import type { ExperienceItem } from "@/types/content";
import { Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

function formatDate(date: string | undefined): string {
  if (!date) return "Present";
  return date;
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) {
    return <p className="text-sm text-muted-foreground">No experience listed yet.</p>;
  }

  return (
    <div className="space-y-6">
      {experience.map((exp) => (
        <article key={exp.id}>
          <div className="flex items-start gap-3 mb-4">
            <div className={cn("p-2 rounded-lg mt-0.5", "bg-[hsl(var(--accent-hsl))/10]")}>
              <Briefcase className="w-4 h-4 text-[hsl(var(--accent-hsl))]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-foreground text-sm leading-snug">
                {exp.role}
              </h3>
              <p className="text-xs text-[hsl(var(--accent-hsl))] font-medium mt-0.5">
                {exp.company}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                <span>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {exp.location}
                </span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 pl-1">
            {exp.responsibilities.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="text-[hsl(var(--accent-hsl))] mt-[3px] shrink-0">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
