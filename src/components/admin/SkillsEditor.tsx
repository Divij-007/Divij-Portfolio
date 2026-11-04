import { useState } from "react";
import type { SkillGroup } from "@/types/content";
import { Plus, Trash2, X, Tag } from "lucide-react";

interface SkillsEditorProps {
  skills: SkillGroup[];
  onChange: (updated: SkillGroup[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillInput, setNewSkillInput] = useState<Record<number, string>>({});

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    onChange([...skills, { category: newCategoryName.trim(), items: [] }]);
    setNewCategoryName("");
  };

  const removeCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index: number, name: string) => {
    const list = [...skills];
    list[index] = { ...list[index], category: name };
    onChange(list);
  };

  const addSkillItem = (categoryIndex: number) => {
    const val = (newSkillInput[categoryIndex] || "").trim();
    if (!val) return;

    const list = [...skills];
    const group = list[categoryIndex];
    if (!group.items.includes(val)) {
      group.items = [...group.items, val];
      onChange(list);
    }
    setNewSkillInput({ ...newSkillInput, [categoryIndex]: "" });
  };

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    const list = [...skills];
    const group = list[categoryIndex];
    group.items = group.items.filter((_, i) => i !== itemIndex);
    onChange(list);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Add category row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Technical Skills & Proficiencies
          </h3>
          <p className="text-xs text-muted-foreground">
            Group skills into distinct categories (e.g. Cloud, IaC, CI/CD, Scripting)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="New Category Name..."
            className="px-3.5 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] w-full sm:w-52"
          />
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid of skill categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="p-5 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-4"
          >
            {/* Category header */}
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={group.category}
                onChange={(e) => updateCategoryName(groupIdx, e.target.value)}
                className="font-heading font-bold text-sm text-[hsl(var(--accent-hsl))] bg-transparent border-b border-dashed border-[hsl(var(--surface-border))] focus:outline-none focus:border-[hsl(var(--accent-hsl))] flex-1"
              />
              <button
                type="button"
                onClick={() => removeCategory(groupIdx)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors shrink-0"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Existing skill chips */}
            <div className="flex flex-wrap gap-2 min-h-12 items-center">
              {group.items.length === 0 ? (
                <span className="text-xs text-muted-foreground/60 italic">
                  No skills yet. Add some below.
                </span>
              ) : (
                group.items.map((skill, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-[hsl(var(--surface-border))] bg-[hsl(var(--bg))] text-foreground"
                  >
                    <Tag className="w-3 h-3 text-[hsl(var(--accent-hsl))]" />
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillItem(groupIdx, itemIdx)}
                      className="text-muted-foreground hover:text-rose-400 ml-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input to add new skill to this category */}
            <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--surface-border))]">
              <input
                type="text"
                value={newSkillInput[groupIdx] || ""}
                onChange={(e) =>
                  setNewSkillInput({ ...newSkillInput, [groupIdx]: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && addSkillItem(groupIdx)}
                placeholder="Add tool/skill (e.g. AWS Lambda)..."
                className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              />
              <button
                type="button"
                onClick={() => addSkillItem(groupIdx)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[hsl(var(--accent-hsl))/20] text-[hsl(var(--accent-hsl))] hover:bg-[hsl(var(--accent-hsl))/30] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
