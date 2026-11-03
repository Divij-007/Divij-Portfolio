import type { Certification } from "@/types/content";
import { Award, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) {
    return <p className="text-sm text-muted-foreground">No certifications listed yet.</p>;
  }

  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <article
          key={cert.id}
          className={cn(
            "rounded-xl p-4 border border-[hsl(var(--surface-border))]",
            "bg-[hsl(var(--surface-glass))]",
            "hover:border-[hsl(var(--accent-hsl))/30]",
            "motion-safe-transition"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-foreground text-sm leading-snug">
                {cert.name}
              </h3>
              <p className="text-xs text-[hsl(var(--accent-hsl))] mt-0.5">{cert.issuer}</p>

              <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                <p>Issued: {cert.issueDate}</p>
                {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
                {cert.credentialId && (
                  <p className="font-mono text-[10px] break-all">ID: {cert.credentialId}</p>
                )}
              </div>

              {cert.badgeUrl && (
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-[hsl(var(--accent-hsl))] hover:opacity-80 motion-safe-transition"
                >
                  View Certificate
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
      <p className="text-xs text-muted-foreground text-center pt-2">
        Additional certifications in progress
      </p>
    </div>
  );
}
