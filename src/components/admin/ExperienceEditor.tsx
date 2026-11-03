import type { ExperienceItem } from "@/types/content";
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from "lucide-react";

interface ExperienceEditorProps {
  experience: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export function ExperienceEditor({ experience, onChange }: ExperienceEditorProps) {
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: "New Role",
      company: "Company Name",
      location: "City, Country",
      startDate: "2024",
      endDate: "",
      responsibilities: [
        "Key responsibility or achievement here...",
      ],
    };
    onChange([newItem, ...experience]);
  };

  const updateItem = (index: number, updated: ExperienceItem) => {
    const list = [...experience];
    list[index] = updated;
    onChange(list);
  };

  const removeItem = (index: number) => {
    const list = experience.filter((_, i) => i !== index);
    onChange(list);
  };

  const move = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= experience.length) return;
    const list = [...experience];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    onChange(list);
  };

  const addResponsibility = (expIndex: number) => {
    const exp = experience[expIndex];
    updateItem(expIndex, {
      ...exp,
      responsibilities: [...exp.responsibilities, "New bullet point..."],
    });
  };

  const updateResponsibility = (expIndex: number, respIndex: number, text: string) => {
    const exp = experience[expIndex];
    const resps = [...exp.responsibilities];
    resps[respIndex] = text;
    updateItem(expIndex, { ...exp, responsibilities: resps });
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const exp = experience[expIndex];
    const resps = exp.responsibilities.filter((_, i) => i !== respIndex);
    updateItem(expIndex, { ...exp, responsibilities: resps });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Work Experience & Career History
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage your positions, dates, company names, and bullet point achievements.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">No experience items added</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Click &quot;Add Position&quot; to showcase your work history.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]"
          >
            Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-5"
            >
              {/* Header card action bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[hsl(var(--surface-border))]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-sm text-foreground">
                    #{index + 1}: {item.role || "Untitled Role"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, "up")}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === experience.length - 1}
                    onClick={() => move(index, "down")}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors ml-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(index, { ...item, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => updateItem(index, { ...item, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateItem(index, { ...item, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => updateItem(index, { ...item, startDate: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                      End Date (Blank = Present)
                    </label>
                    <input
                      type="text"
                      value={item.endDate || ""}
                      onChange={(e) => updateItem(index, { ...item, endDate: e.target.value || undefined })}
                      placeholder="Present"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                    Responsibilities & Impact Bullets
                  </label>
                  <button
                    type="button"
                    onClick={() => addResponsibility(index)}
                    className="flex items-center gap-1 text-xs text-[hsl(var(--accent-hsl))] hover:underline font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {item.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2">
                      <span className="text-[hsl(var(--accent-hsl))] mt-2 font-mono text-xs">▸</span>
                      <textarea
                        rows={2}
                        value={resp}
                        onChange={(e) => updateResponsibility(index, rIdx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] leading-relaxed"
                        placeholder="Start with a bold category (e.g. Patch Management: ...)"
                      />
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index, rIdx)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-1"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
