import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { SiteContentSchema, type SiteContent } from "@/types/content";
import rawContent from "@/content/content.json";
import {
  fetchRemoteContent,
  saveRemoteContent,
  supabase,
  PORTFOLIO_TABLE,
  PORTFOLIO_ROW_ID,
} from "@/lib/supabase";

// ─── Data-access interface ───────────────────────────────────────────────────
export interface ContentSource {
  getContent(): Promise<{ data: SiteContent; isRemote: boolean }>;
  saveContent(content: SiteContent): Promise<{ success: boolean; error?: string }>;
}

// ─── Supabase + Bundled Fallback Content Source ──────────────────────────────
export class HybridContentSource implements ContentSource {
  async getContent(): Promise<{ data: SiteContent; isRemote: boolean }> {
    // 1. Attempt to fetch from Supabase
    try {
      const remote = await fetchRemoteContent();
      if (remote) {
        const parsed = SiteContentSchema.safeParse(remote);
        if (parsed.success) {
          return { data: parsed.data, isRemote: true };
        }
        console.warn("Supabase content did not pass schema validation, falling back to bundled:", parsed.error);
      }
    } catch (err) {
      console.warn("Could not load from Supabase, using bundled fallback:", err);
    }

    // 2. Fallback to bundled content.json
    const parsed = SiteContentSchema.safeParse(rawContent);
    if (!parsed.success) {
      console.error("Bundled content.json failed validation:", parsed.error.format());
      throw new Error("content.json failed Zod validation");
    }
    return { data: parsed.data, isRemote: false };
  }

  async saveContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
    const parsed = SiteContentSchema.safeParse(content);
    if (!parsed.success) {
      return {
        success: false,
        error: `Validation error: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
      };
    }

    return await saveRemoteContent(parsed.data);
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
export interface ContentContextValue {
  content: SiteContent | null;
  loading: boolean;
  error: string | null;
  isRemote: boolean;
  saveContent: (newContent: SiteContent) => Promise<{ success: boolean; error?: string }>;
  reloadContent: () => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue>({
  content: null,
  loading: true,
  error: null,
  isRemote: false,
  saveContent: async () => ({ success: false, error: "Not initialized" }),
  reloadContent: async () => {},
  resetToDefault: async () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────
const defaultSource = new HybridContentSource();

export function ContentProvider({
  children,
  source = defaultSource,
}: {
  children: ReactNode;
  source?: ContentSource;
}) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRemote, setIsRemote] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await source.getContent();
      setContent(res.data);
      setIsRemote(res.isRemote);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Realtime subscription for multi-tab or live update support
  useEffect(() => {
    const channel = supabase
      .channel("public:portfolio_content_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: PORTFOLIO_TABLE,
          filter: `id=eq.${PORTFOLIO_ROW_ID}`,
        },
        (payload) => {
          if (payload.new && (payload.new as { content?: unknown }).content) {
            const parsed = SiteContentSchema.safeParse((payload.new as { content: unknown }).content);
            if (parsed.success) {
              setContent(parsed.data);
              setIsRemote(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveContent = useCallback(
    async (newContent: SiteContent): Promise<{ success: boolean; error?: string }> => {
      // Optimistically update local state
      setContent(newContent);

      const result = await source.saveContent(newContent);
      if (result.success) {
        setIsRemote(true);
      }
      return result;
    },
    [source]
  );

  const handleResetToDefault = useCallback(async () => {
    const parsed = SiteContentSchema.safeParse(rawContent);
    if (parsed.success) {
      setContent(parsed.data);
      await source.saveContent(parsed.data);
    }
  }, [source]);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        isRemote,
        saveContent: handleSaveContent,
        reloadContent: loadContent,
        resetToDefault: handleResetToDefault,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
