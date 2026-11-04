import type { SectionMeta } from "@/types/content";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionsEditorProps {
  sections: SectionMeta[];
  onChange: (updated: SectionMeta[]) => void;
}

export function SectionsEditor({ sections, onChange }: SectionsEditorProps) {
  // Sort sections by order
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  const toggleVisibility = (id: string) => {
    const updated = sorted.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    onChange(updated);
  };

  const updateLabel = (id: string, label: string) => {
    const updated = sorted.map((s) => (s.id === id ? { ...s, label } : s));
    onChange(updated);
  };

  const move = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const list = [...sorted];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // re-index order
    const reindexed = list.map((item, idx) => ({ ...item, order: idx }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl">
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          Sections & Navigation Layout
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Toggle section visibility, re-label them, and reorder how they appear in the top navigation bar and portfolio page.
        </p>

        <div className="space-y-3">
          {sorted.map((section, index) => (
            <div
              key={section.id}
              className={cn(
                "flex items-center justify-between gap-4 p-4 rounded-xl border transition-all",
                section.visible
                  ? "bg-[hsl(var(--bg))] border-[hsl(var(--surface-border))]"
                  : "bg-[hsl(var(--bg))/40] border-dashed border-[hsl(var(--surface-border))/60] opacity-65"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] flex items-center justify-center text-xs font-mono font-bold">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={section.label}
                      onChange={(e) => updateLabel(section.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg text-sm font-semibold bg-[hsl(var(--surface-border))/30] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                    />
                    <span className="text-xs font-mono text-muted-foreground/70">
                      #{section.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Reorder */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, "up")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === sorted.length - 1}
                  onClick={() => move(index, "down")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    section.visible
                      ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] hover:bg-[hsl(var(--accent-hsl))/25]"
                      : "bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                  )}
                >
                  {section.visible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
