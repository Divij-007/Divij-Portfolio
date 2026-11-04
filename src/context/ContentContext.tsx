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

const SYNC_CHANNEL_NAME = "portfolio_content_sync";
const LOCAL_CACHE_KEY = "portfolio_content_cache";

// Helper to ensure projects section exists in any loaded content
function normalizeContent(data: SiteContent): SiteContent {
  const hasProjects = data.sections.some((s) => s.id === "projects");
  if (!hasProjects) {
    const list = [...data.sections];
    const skillsIdx = list.findIndex((s) => s.id === "skills");
    const insertIdx = skillsIdx !== -1 ? skillsIdx + 1 : list.length;
    list.splice(insertIdx, 0, {
      id: "projects",
      label: "Projects",
      visible: true,
      order: insertIdx,
    });
    return {
      ...data,
      sections: list.map((s, idx) => ({ ...s, order: idx })),
    };
  }
  return data;
}

// ─── Data-access interface ───────────────────────────────────────────────────
export interface ContentSource {
  getContent(): Promise<{ data: SiteContent; isRemote: boolean }>;
  saveContent(content: SiteContent): Promise<{ success: boolean; error?: string }>;
}

// ─── Supabase + Bundled Fallback Content Source ──────────────────────────────
export class HybridContentSource implements ContentSource {
  async getContent(): Promise<{ data: SiteContent; isRemote: boolean }> {
    // 1. Fast cache check from localStorage so local tab updates appear immediately
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_CACHE_KEY);
        if (cached) {
          const parsedCache = SiteContentSchema.safeParse(JSON.parse(cached));
          if (parsedCache.success) {
            const normalized = normalizeContent(parsedCache.data);
            // Revalidate with remote in background
            fetchRemoteContent().then((remote) => {
              if (remote) {
                const parsed = SiteContentSchema.safeParse(remote);
                if (parsed.success) {
                  const normalizedRemote = normalizeContent(parsed.data);
                  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(normalizedRemote));
                }
              }
            }).catch(() => {});

            return { data: normalized, isRemote: true };
          }
        }
      } catch {
        // Continue to network fetch
      }
    }

    // 2. Attempt to fetch from Supabase
    try {
      const remote = await fetchRemoteContent();
      if (remote) {
        const parsed = SiteContentSchema.safeParse(remote);
        if (parsed.success) {
          const normalized = normalizeContent(parsed.data);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(normalized));
            } catch {
              /* ignore storage error */
            }
          }
          return { data: normalized, isRemote: true };
        }
        console.warn("Supabase content did not pass schema validation, falling back to bundled:", parsed.error);
      }
    } catch (err) {
      console.warn("Could not load from Supabase, using bundled fallback:", err);
    }

    // 3. Fallback to bundled content.json
    const parsed = SiteContentSchema.safeParse(rawContent);
    if (!parsed.success) {
      console.error("Bundled content.json failed validation:", parsed.error.format());
      throw new Error("content.json failed Zod validation");
    }
    return { data: normalizeContent(parsed.data), isRemote: false };
  }

  async saveContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
    const parsed = SiteContentSchema.safeParse(content);
    if (!parsed.success) {
      return {
        success: false,
        error: `Validation error: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
      };
    }

    // Update local cache immediately
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(parsed.data));
      } catch {
        /* ignore storage error */
      }
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
  resetToDefault: () => Promise<SiteContent>;
}

const ContentContext = createContext<ContentContextValue>({
  content: null,
  loading: true,
  error: null,
  isRemote: false,
  saveContent: async () => ({ success: false, error: "Not initialized" }),
  reloadContent: async () => {},
  resetToDefault: async () => ({} as SiteContent),
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

  // 1. Instant Cross-Tab Sync via BroadcastChannel API (zero reload, <1ms latency)
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
    bc.onmessage = (event) => {
      if (event.data?.type === "CONTENT_UPDATED" && event.data?.content) {
        const parsed = SiteContentSchema.safeParse(event.data.content);
        if (parsed.success) {
          setContent(parsed.data);
          setIsRemote(true);
        }
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  // 2. Storage event listener (cross-window and browser sync)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_CACHE_KEY && e.newValue) {
        try {
          const parsed = SiteContentSchema.safeParse(JSON.parse(e.newValue));
          if (parsed.success) {
            setContent(parsed.data);
            setIsRemote(true);
          }
        } catch {
          /* ignore parse error */
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 3. Supabase Realtime channel (for remote updates across different devices)
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
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(parsed.data));
                } catch {
                  /* ignore storage error */
                }
              }
            }
          }
        }
      )
      .on("broadcast", { event: "content_updated" }, (payload) => {
        if (payload.payload?.content) {
          const parsed = SiteContentSchema.safeParse(payload.payload.content);
          if (parsed.success) {
            setContent(parsed.data);
            setIsRemote(true);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveContent = useCallback(
    async (newContent: SiteContent): Promise<{ success: boolean; error?: string }> => {
      // 1. Optimistically update local state immediately
      setContent(newContent);

      // 2. Broadcast immediately across open tabs and storage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(newContent));
          if ("BroadcastChannel" in window) {
            const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
            bc.postMessage({ type: "CONTENT_UPDATED", content: newContent });
            bc.close();
          }
        } catch (err) {
          console.warn("Local broadcast error:", err);
        }
      }

      // 3. Save remotely to Supabase
      const result = await source.saveContent(newContent);
      if (result.success) {
        setIsRemote(true);

        // Send Supabase websocket broadcast for other devices
        try {
          supabase.channel("public:portfolio_content_changes").send({
            type: "broadcast",
            event: "content_updated",
            payload: { content: newContent },
          });
        } catch {
          /* ignore broadcast send error */
        }
      }
      return result;
    },
    [source]
  );

  const handleResetToDefault = useCallback(async (): Promise<SiteContent> => {
    const parsed = SiteContentSchema.safeParse(rawContent);
    if (!parsed.success) {
      console.error("Default content failed validation:", parsed.error);
      throw new Error("Invalid factory default content");
    }
    const defaultData: SiteContent = JSON.parse(JSON.stringify(parsed.data));
    setContent(defaultData);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(defaultData));
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
          bc.postMessage({ type: "CONTENT_UPDATED", content: defaultData });
          bc.close();
        }
      } catch (err) {
        console.warn("Reset broadcast error:", err);
      }
    }
    await source.saveContent(defaultData);
    return defaultData;
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
