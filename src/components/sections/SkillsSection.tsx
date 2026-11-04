import type { SkillGroup } from "@/types/content";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  skills: SkillGroup[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">No skills listed yet.</p>;
  }

  return (
    <div className="space-y-4">
      {skills.map((group) => (
        <div key={group.category}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            {group.category}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium",
                  "border border-[hsl(var(--surface-border))]",
                  "bg-[hsl(var(--bg-subtle))] text-foreground",
                  "hover:border-[hsl(var(--accent-hsl))/40] hover:text-[hsl(var(--accent-hsl))]",
                  "motion-safe-transition"
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
