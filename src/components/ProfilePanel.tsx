import { useTheme } from "@/context/ThemeContext";
import type { Profile, SectionMeta } from "@/types/content";
import { Moon, Sun, MapPin, FileText, Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePanelProps {
  profile: Profile;
  sections: SectionMeta[];
  activeSection: string | null;
  onSectionClick: (id: string) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  linkedin: ({ className }) => <Linkedin className={className} />,
  github: ({ className }) => <Github className={className} />,
  mail: ({ className }) => <Mail className={className} />,
};

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon.toLowerCase()];
  if (Icon) return <Icon className={className} />;
  return <ExternalLink className={className} />;
}

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  return (
    <button
      onClick={toggleMode}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        "text-muted-foreground hover:text-foreground",
        "border border-[hsl(var(--surface-border))] hover:border-[hsl(var(--accent-hsl))/30]",
        "motion-safe-transition"
      )}
    >
      {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="hidden xl:inline">{mode === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

export function ProfilePanel({ profile, sections, activeSection, onSectionClick }: ProfilePanelProps) {
  const visibleSections = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full gap-5 p-6 overflow-y-auto panel-scroll">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-heading font-semibold",
            "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] border-2 border-[hsl(var(--accent-hsl))/30]",
            "select-none"
          )}
          aria-hidden="true"
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            initials
          )}
        </div>

        <div>
          <h1 className="font-heading font-semibold text-xl text-foreground tracking-tight leading-tight">
            {profile.name}
          </h1>
          <p className="text-sm text-[hsl(var(--accent-hsl))] font-medium mt-0.5">
            {profile.title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.tagline}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{profile.location}</span>
        </div>
      </div>

      {/* Socials */}
      <div className="flex justify-center gap-2 flex-wrap">
        {profile.socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target={social.url.startsWith("http") ? "_blank" : undefined}
            rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={social.label}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              "border border-[hsl(var(--surface-border))]",
              "text-muted-foreground hover:text-foreground hover:border-[hsl(var(--accent-hsl))/40]",
              "motion-safe-transition"
            )}
          >
            <SocialIcon icon={social.icon} className="w-4 h-4" />
          </a>
        ))}
      </div>

      {/* Resume button */}
      <a
        href={profile.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
          "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]",
          "hover:opacity-90 motion-safe-transition",
          "focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-hsl))] focus-visible:ring-offset-2"
        )}
      >
        <FileText className="w-4 h-4" />
        Resume
      </a>

      {/* Section nav */}
      <nav aria-label="Portfolio sections">
        <ul className="space-y-0.5">
          {visibleSections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                aria-label={`Jump to ${section.label} section`}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm motion-safe-transition",
                  activeSection === section.id
                    ? "bg-[hsl(var(--accent-hsl))/12] text-[hsl(var(--accent-hsl))] font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))]"
                )}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
