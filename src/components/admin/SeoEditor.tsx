import { useState, useEffect } from "react";
import type { Seo } from "@/types/content";
import { checkTableStatus } from "@/lib/supabase";
import { Globe, Database, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface SeoEditorProps {
  seo: Seo;
  onChange: (updated: Seo) => void;
  onOpenSqlModal: () => void;
  onSeedData: () => Promise<void>;
}

export function SeoEditor({
  seo,
  onChange,
  onOpenSqlModal,
  onSeedData,
}: SeoEditorProps) {
  const [tableStatus, setTableStatus] = useState<{
    exists: boolean;
    hasData: boolean;
    error?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    const status = await checkTableStatus();
    setTableStatus(status);
    setChecking(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    await onSeedData();
    await checkStatus();
    setSeeding(false);
  };

  const updateField = <K extends keyof Seo>(field: K, value: Seo[K]) => {
    onChange({ ...seo, [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SEO & Meta Tags */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Search Engine Optimization (SEO) & Social Sharing
            </h3>
            <p className="text-xs text-muted-foreground">
              Customize how your portfolio appears in Google search results and LinkedIn/Twitter previews.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Browser Title / Meta Title
            </label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. Divij P — Cloud & DevOps Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Meta Description (Search Snippet)
            </label>
            <textarea
              rows={3}
              value={seo.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] leading-relaxed"
              placeholder="A brief 1-2 sentence description of your expertise and experience..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Open Graph (OG) Image URL
            </label>
            <input
              type="text"
              value={seo.ogImage || ""}
              onChange={(e) => updateField("ogImage", e.target.value || undefined)}
              placeholder="https://yourdomain.com/og-image.png"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
            />
          </div>
        </div>
      </div>

      {/* Supabase Database Health Card */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                Supabase Database Connection
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Project: https://usalopghptthamlszjmi.supabase.co
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={checkStatus}
            disabled={checking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-[hsl(var(--surface-border))] hover:bg-[hsl(var(--surface-border))/30] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
            <span>Check Status</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {tableStatus?.exists ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-foreground">
                    Table &apos;portfolio_content&apos; exists
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-foreground">
                    Table &apos;portfolio_content&apos; not detected
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {tableStatus?.exists
                ? tableStatus.hasData
                  ? "Database is actively synchronizing your portfolio."
                  : "Table exists but currently has no content row."
                : "Run the SQL script in your Supabase dashboard to create the table and enable remote saving."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!tableStatus?.exists && (
              <button
                type="button"
                onClick={onOpenSqlModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90"
              >
                View SQL Script
              </button>
            )}
            {tableStatus?.exists && !tableStatus?.hasData && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90"
              >
                {seeding ? "Saving..." : "Seed Initial Content"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
