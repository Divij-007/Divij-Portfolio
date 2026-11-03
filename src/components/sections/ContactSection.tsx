import type { Profile } from "@/types/content";
import { Mail, Phone, Linkedin, Github, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const items = [
    profile.email && {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <Mail className="w-4 h-4" />,
      external: false,
    },
    profile.phone && {
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone}`,
      icon: <Phone className="w-4 h-4" />,
      external: false,
    },
    ...profile.socials
      .filter((s) => s.url.startsWith("http"))
      .map((s) => ({
        label: s.label,
        value: s.url.replace(/^https?:\/\/(www\.)?/, ""),
        href: s.url,
        icon: s.icon === "linkedin" ? <Linkedin className="w-4 h-4" /> : s.icon === "github" ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />,
        external: true,
      })),
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
    external: boolean;
  }>;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Open to Cloud Engineer and DevOps Engineer opportunities. Feel free to reach out.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl",
              "border border-[hsl(var(--surface-border))]",
              "hover:border-[hsl(var(--accent-hsl))/40] hover:bg-[hsl(var(--accent-hsl))/5]",
              "group motion-safe-transition"
            )}
          >
            <span className="text-muted-foreground group-hover:text-[hsl(var(--accent-hsl))] motion-safe-transition shrink-0">
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-xs text-foreground truncate">{item.value}</p>
            </div>
            {item.external && (
              <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-[hsl(var(--accent-hsl))] motion-safe-transition shrink-0" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
