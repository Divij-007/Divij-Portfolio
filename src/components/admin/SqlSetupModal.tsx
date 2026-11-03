import { useState } from "react";
import { Check, Copy, Database, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";

interface SqlSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecheck?: () => void;
}

export const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- Portfolio Database Schema & Seed Data for Supabase
-- Paste and run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create portfolio_content table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone visiting the portfolio can read content)
DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_content;
CREATE POLICY "Allow public read access"
ON public.portfolio_content
FOR SELECT
TO public
USING (true);

-- 4. Authenticated admin update policy (only logged in admin can edit content)
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.portfolio_content;
CREATE POLICY "Allow authenticated users to update"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Authenticated admin insert policy
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.portfolio_content;
CREATE POLICY "Allow authenticated users to insert"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (true);
`;

export function SqlSetupModal({ isOpen, onClose, onRecheck }: SqlSetupModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
      setCopied(true);
      toast.success("SQL script copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy automatically. Please select and copy manually.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground text-base">
                Supabase SQL Setup Script
              </h3>
              <p className="text-xs text-muted-foreground">
                Run this once in your Supabase dashboard to enable database persistence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-4 rounded-xl bg-[hsl(var(--accent-hsl))/10] border border-[hsl(var(--accent-hsl))/20] text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">How to apply this in 3 simple steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>
                Open{" "}
                <a
                  href="https://supabase.com/dashboard/project/usalopghptthamlszjmi/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent-hsl))] underline inline-flex items-center gap-1 font-mono font-medium"
                >
                  Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Click the <strong>Copy SQL</strong> button below and paste it into the editor.</li>
              <li>Click <strong>Run</strong> in Supabase. Your database is now ready!</li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--surface-border))/30] rounded-t-xl border border-b-0 border-[hsl(var(--surface-border))] text-xs font-mono text-muted-foreground">
              <span>supabase/schema.sql</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] font-semibold hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy SQL"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-b-xl bg-black/60 border border-[hsl(var(--surface-border))] text-xs font-mono text-neutral-200 overflow-x-auto max-h-64 selection:bg-[hsl(var(--accent-hsl))/40]">
              <code>{SUPABASE_SQL_SCRIPT}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <button
            onClick={() => {
              if (onRecheck) onRecheck();
              onClose();
            }}
            className="text-xs text-[hsl(var(--accent-hsl))] hover:underline font-semibold"
          >
            I have run the SQL, test connection
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90 transition-opacity"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Script" : "Copy SQL Script"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-[hsl(var(--surface-border))] hover:bg-[hsl(var(--surface-border))/40] text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
