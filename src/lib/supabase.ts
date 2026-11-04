import { createClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/types/content";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const PORTFOLIO_ROW_ID = "main";
export const PORTFOLIO_TABLE = "portfolio_content";

/**
 * Fetch portfolio content from Supabase
 */
export async function fetchRemoteContent(): Promise<SiteContent | null> {
  try {
    const { data, error } = await supabase
      .from(PORTFOLIO_TABLE)
      .select("content")
      .eq("id", PORTFOLIO_ROW_ID)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetch returned error:", error.message);
      return null;
    }

    if (data?.content) {
      return data.content as SiteContent;
    }

    return null;
  } catch (err) {
    console.warn("Failed to connect to Supabase:", err);
    return null;
  }
}

/**
 * Save portfolio content to Supabase
 */
export async function saveRemoteContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(PORTFOLIO_TABLE)
      .upsert(
        {
          id: PORTFOLIO_ROW_ID,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Supabase upsert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error saving content";
    return { success: false, error: message };
  }
}

/**
 * Checks if the portfolio_content table is ready in Supabase
 */
export async function checkTableStatus(): Promise<{ exists: boolean; hasData: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from(PORTFOLIO_TABLE)
      .select("id")
      .eq("id", PORTFOLIO_ROW_ID)
      .maybeSingle();

    if (error) {
      return { exists: false, hasData: false, error: error.message };
    }

    return { exists: true, hasData: !!data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Connection failed";
    return { exists: false, hasData: false, error: message };
  }
}
