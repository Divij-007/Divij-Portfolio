import type { CaseStudy } from "@/types/content";
import { AlertTriangle, Lightbulb, Wrench, CheckCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudySectionProps {
  caseStudies: CaseStudy[];
}

const iconMap: Record<string, LucideIcon> = {
  "alert-triangle": AlertTriangle,
  lightbulb: Lightbulb,
  wrench: Wrench,
  "check-circle": CheckCircle,
};

export function CaseStudySection({ caseStudies }: CaseStudySectionProps) {
  if (caseStudies.length === 0) {
    return <p className="text-sm text-muted-foreground">No case studies listed yet.</p>;
  }

  return (
    <div className="space-y-6">
      {caseStudies.map((cs) => (
        <div key={cs.id}>
          <div className="mb-4">
            <h3 className="font-heading font-semibold text-foreground text-sm leading-snug">
              {cs.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cs.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cs.blocks.map((block) => {
              const Icon = block.icon ? iconMap[block.icon] : null;
              return (
                <div
                  key={block.title}
                  className={cn(
                    "rounded-xl p-4 border border-[hsl(var(--surface-border))]",
                    "bg-[hsl(var(--surface-glass))]",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {Icon && <Icon className="w-4 h-4 text-[hsl(var(--accent-hsl))] shrink-0" />}
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {block.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{block.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
