import { useTheme } from "@/context/ThemeContext";
import type { Profile, SectionMeta } from "@/types/content";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileTopBarProps {
  profile: Profile;
  sections: SectionMeta[];
  onSectionClick: (id: string) => void;
}

export function MobileTopBar({ profile, sections, onSectionClick }: MobileTopBarProps) {
  const { mode, toggleMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleSections = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 flex items-center justify-between px-4 py-3",
          "glass border-b border-[hsl(var(--surface-border))]"
        )}
      >
        <span className="font-heading font-semibold text-foreground text-base">
          {profile.name}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground motion-safe-transition"
          >
            {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground motion-safe-transition"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown nav */}
      {menuOpen && (
        <nav
          aria-label="Portfolio sections"
          className={cn(
            "fixed top-14 left-0 right-0 z-40",
            "glass border-b border-[hsl(var(--surface-border))]",
            "animate-fade-in"
          )}
        >
          <ul className="px-4 py-2">
            {visibleSections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    onSectionClick(section.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground motion-safe-transition rounded-lg"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
