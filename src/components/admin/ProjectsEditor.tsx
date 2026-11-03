import { useState } from "react";
import type { Project } from "@/types/content";
import { Plus, Trash2, FolderGit2, X, Tag } from "lucide-react";

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export function ProjectsEditor({ projects, onChange }: ProjectsEditorProps) {
  const [tagInput, setTagInput] = useState<Record<number, string>>({});

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: "New Cloud Automation Project",
      description: "Automated multi-region infrastructure provisioning using Terraform and GitHub Actions.",
      url: "",
      repoUrl: "",
      tags: ["Terraform", "AWS", "GitHub Actions"],
    };
    onChange([...projects, newProj]);
  };

  const updateProj = (index: number, updated: Project) => {
    const list = [...projects];
    list[index] = updated;
    onChange(list);
  };

  const removeProj = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const addTag = (projIndex: number) => {
    const tag = (tagInput[projIndex] || "").trim();
    if (!tag) return;
    const proj = projects[projIndex];
    if (!proj.tags.includes(tag)) {
      updateProj(projIndex, { ...proj, tags: [...proj.tags, tag] });
    }
    setTagInput({ ...tagInput, [projIndex]: "" });
  };

  const removeTag = (projIndex: number, tagIdx: number) => {
    const proj = projects[projIndex];
    const tags = proj.tags.filter((_, i) => i !== tagIdx);
    updateProj(projIndex, { ...proj, tags });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Featured Projects & Repositories
          </h3>
          <p className="text-xs text-muted-foreground">
            Add portfolio projects, open-source repositories, and infrastructure demonstrations.
          </p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <FolderGit2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">No projects currently listed</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Showcase personal repos, IaC templates, or cloud automation tools here.
          </p>
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--surface-border))]">
                <span className="font-heading font-bold text-sm text-foreground">
                  #{index + 1}: {proj.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeProj(index)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProj(index, { ...proj, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) =>
                      updateProj(index, { ...proj, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={proj.url || ""}
                    onChange={(e) =>
                      updateProj(index, { ...proj, url: e.target.value || undefined })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    GitHub Repo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={proj.repoUrl || ""}
                    onChange={(e) =>
                      updateProj(index, { ...proj, repoUrl: e.target.value || undefined })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                {/* Tech tags */}
                <div className="md:col-span-2 space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                    Tags & Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {proj.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground"
                      >
                        <Tag className="w-3 h-3 text-[hsl(var(--accent-hsl))]" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index, tIdx)}
                          className="text-muted-foreground hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tagInput[index] || ""}
                        onChange={(e) =>
                          setTagInput({ ...tagInput, [index]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === "Enter" && addTag(index)}
                        placeholder="Add tag..."
                        className="w-28 px-2.5 py-1 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                      />
                      <button
                        type="button"
                        onClick={() => addTag(index)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-[hsl(var(--accent-hsl))/20] text-[hsl(var(--accent-hsl))]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
