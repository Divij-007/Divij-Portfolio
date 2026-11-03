import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SiteContentSchema, type SiteContent } from "@/types/content";
import rawContent from "@/content/content.json";

// ─── Data-access interface (same signature Phase 2 will use) ──────────────────
export interface ContentSource {
  getContent(): Promise<SiteContent>;
}

// Phase 1: bundled JSON source
class BundledContentSource implements ContentSource {
  async getContent(): Promise<SiteContent> {
    const parsed = SiteContentSchema.safeParse(rawContent);
    if (!parsed.success) {
      console.error("content.json validation failed:", parsed.error.format());
      throw new Error("content.json failed Zod validation");
    }
    return parsed.data;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface ContentContextValue {
  content: SiteContent | null;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextValue>({
  content: null,
  loading: true,
  error: null,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
const defaultSource = new BundledContentSource();

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

  useEffect(() => {
    let cancelled = false;
    source
      .getContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load content");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <ContentContext.Provider value={{ content, loading, error }}>
      {children}
    </ContentContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
