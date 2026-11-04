import type { CaseStudy, CaseStudyBlock } from "@/types/content";
import { Plus, Trash2, Layers, AlertTriangle, Lightbulb, Wrench, CheckCircle } from "lucide-react";

interface CaseStudyEditorProps {
  caseStudies: CaseStudy[];
  onChange: (updated: CaseStudy[]) => void;
}

const AVAILABLE_ICONS = [
  { value: "alert-triangle", label: "Warning / Problem", icon: AlertTriangle },
  { value: "lightbulb", label: "Idea / Approach", icon: Lightbulb },
  { value: "wrench", label: "Tool / Implementation", icon: Wrench },
  { value: "check-circle", label: "Success / Outcome", icon: CheckCircle },
];

export function CaseStudyEditor({ caseStudies, onChange }: CaseStudyEditorProps) {
  const addCaseStudy = () => {
    const newCS: CaseStudy = {
      id: `study-${Date.now()}`,
      title: "New Cloud Project Case Study",
      subtitle: "Client: Enterprise · Key technologies and scope of work.",
      blocks: [
        {
          title: "Problem",
          icon: "alert-triangle",
          content: "Describe the architectural or operational challenge...",
        },
        {
          title: "Approach",
          icon: "lightbulb",
          content: "Explain the solution, Terraform designs, or CI/CD strategy...",
        },
        {
          title: "Tools",
          icon: "wrench",
          content: "AWS, Terraform, Python, Docker, GitHub Actions...",
        },
        {
          title: "Outcome",
          icon: "check-circle",
          content: "Quantifiable results, uptime increase, cost reduction...",
        },
      ],
    };
    onChange([...caseStudies, newCS]);
  };

  const updateCaseStudy = (index: number, updated: CaseStudy) => {
    const list = [...caseStudies];
    list[index] = updated;
    onChange(list);
  };

  const removeCaseStudy = (index: number) => {
    onChange(caseStudies.filter((_, i) => i !== index));
  };

  const addBlock = (csIndex: number) => {
    const cs = caseStudies[csIndex];
    const newBlock: CaseStudyBlock = {
      title: "New Section",
      icon: "lightbulb",
      content: "Details about this phase or aspect...",
    };
    updateCaseStudy(csIndex, { ...cs, blocks: [...cs.blocks, newBlock] });
  };

  const updateBlock = (
    csIndex: number,
    blockIndex: number,
    updated: CaseStudyBlock
  ) => {
    const cs = caseStudies[csIndex];
    const blocks = [...cs.blocks];
    blocks[blockIndex] = updated;
    updateCaseStudy(csIndex, { ...cs, blocks });
  };

  const removeBlock = (csIndex: number, blockIndex: number) => {
    const cs = caseStudies[csIndex];
    const blocks = cs.blocks.filter((_, i) => i !== blockIndex);
    updateCaseStudy(csIndex, { ...cs, blocks });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Architecture Case Studies & Client Stories
          </h3>
          <p className="text-xs text-muted-foreground">
            Highlight high-impact initiatives, problem-solving, and measured outcomes.
          </p>
        </div>
        <button
          type="button"
          onClick={addCaseStudy}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Case Study</span>
        </button>
      </div>

      {caseStudies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">No case studies created</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Add a case study to display deep technical problem-solving on your portfolio.
          </p>
          <button
            type="button"
            onClick={addCaseStudy}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]"
          >
            Create Case Study
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {caseStudies.map((cs, csIdx) => (
            <div
              key={cs.id}
              className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[hsl(var(--surface-border))]">
                <span className="font-heading font-bold text-base text-foreground">
                  Case Study #{csIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCaseStudy(csIdx)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete case study"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={cs.title}
                    onChange={(e) =>
                      updateCaseStudy(csIdx, { ...cs, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Subtitle / Context
                  </label>
                  <input
                    type="text"
                    value={cs.subtitle}
                    onChange={(e) =>
                      updateCaseStudy(csIdx, { ...cs, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    Narrative Pillars (Problem, Approach, Tools, Outcome)
                  </span>
                  <button
                    type="button"
                    onClick={() => addBlock(csIdx)}
                    className="flex items-center gap-1 text-xs text-[hsl(var(--accent-hsl))] hover:underline font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Pillar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cs.blocks.map((block, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-4 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) =>
                            updateBlock(csIdx, bIdx, {
                              ...block,
                              title: e.target.value,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[hsl(var(--surface-border))/30] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                        />

                        <div className="flex items-center gap-1.5">
                          <select
                            value={block.icon || "lightbulb"}
                            onChange={(e) =>
                              updateBlock(csIdx, bIdx, {
                                ...block,
                                icon: e.target.value,
                              })
                            }
                            className="px-2 py-1 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none [&>option]:bg-[hsl(var(--bg))] [&>option]:text-foreground"
                          >
                            {AVAILABLE_ICONS.map((ic) => (
                              <option key={ic.value} value={ic.value}>
                                {ic.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeBlock(csIdx, bIdx)}
                            className="p-1 rounded-md text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="Delete pillar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(csIdx, bIdx, {
                            ...block,
                            content: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] leading-relaxed"
                        placeholder="Detailed pillar explanation..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
