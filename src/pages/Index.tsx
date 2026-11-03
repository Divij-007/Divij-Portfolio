import { useRef, useState, useEffect, useCallback, type RefObject } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { useTheme } from "@/context/ThemeContext";
import { GlassPanel } from "@/components/GlassPanel";
import { ProfilePanel } from "@/components/ProfilePanel";
import { MobileTopBar } from "@/components/MobileTopBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProfileSkeleton, PanelSkeleton } from "@/components/ui/Skeletons";

import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { CaseStudySection } from "@/components/sections/CaseStudySection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";

type SectionId = "about" | "experience" | "skills" | "case-study" | "certifications" | "contact";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Index() {
  const { content, loading, error } = useContent();
  const { applyTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Refs for each panel (desktop focus)
  const panelRefs = useRef<Record<string, RefObject<HTMLElement>>>({});

  function getPanelRef(id: string): RefObject<HTMLElement> {
    if (!panelRefs.current[id]) {
      panelRefs.current[id] = { current: null };
    }
    return panelRefs.current[id] as RefObject<HTMLElement>;
  }

  // Apply theme CSS vars whenever content loads
  useEffect(() => {
    if (content?.theme) applyTheme(content.theme);
  }, [content?.theme, applyTheme]);

  const handleSectionClick = useCallback((id: string) => {
    setActiveSection(id);
    const ref = panelRefs.current[id];
    if (ref?.current) {
      ref.current.focus({ preventScroll: false });
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      // Mobile: scroll to anchor
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Deselect active panel after 2s (so highlight doesn't linger)
  useEffect(() => {
    if (!activeSection) return;
    const t = setTimeout(() => setActiveSection(null), 2000);
    return () => clearTimeout(t);
  }, [activeSection]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">Failed to load content: {error}</p>
      </div>
    );
  }

  // Sorted visible sections
  const visibleSections = content
    ? [...content.sections].filter((s) => s.visible).sort((a, b) => a.order - b.order)
    : [];

  // Map section id → JSX content
  function renderSection(id: SectionId) {
    if (!content) return <PanelSkeleton />;
    switch (id) {
      case "about":         return <AboutSection profile={content.profile} />;
      case "experience":    return <ExperienceSection experience={content.experience} />;
      case "skills":        return <SkillsSection skills={content.skills} />;
      case "case-study":    return <CaseStudySection caseStudies={content.caseStudies} />;
      case "certifications":return <CertificationsSection certifications={content.certifications} />;
      case "contact":       return <ContactSection profile={content.profile} />;
      default:              return null;
    }
  }

  return (
    <>
      {/* Color field blobs */}
      <div className="color-field" aria-hidden="true" />
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── MOBILE (<1024px) ─────────────────────────────────────────────── */}
      <div className="lg:hidden relative z-10">
        {loading || !content ? (
          <div className="p-6"><ProfileSkeleton /></div>
        ) : (
          <>
            <MobileTopBar
              profile={content.profile}
              sections={content.sections}
              onSectionClick={handleSectionClick}
            />

            {/* Profile card */}
            <div className="mx-4 mt-4">
              <GlassPanel label="Profile" className="mb-4">
                <ProfilePanel
                  profile={content.profile}
                  sections={content.sections}
                  activeSection={activeSection}
                  onSectionClick={handleSectionClick}
                />
              </GlassPanel>
            </div>

            {/* Section cards stacked */}
            <main className="px-4 pb-8 space-y-4">
              {visibleSections.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                >
                  <ErrorBoundary>
                    <GlassPanel
                      id={`panel-${section.id}`}
                      label={section.label}
                      header={
                        <h2 className="font-heading font-semibold text-base text-foreground">
                          {section.label}
                        </h2>
                      }
                    >
                      {renderSection(section.id as SectionId)}
                    </GlassPanel>
                  </ErrorBoundary>
                </motion.div>
              ))}
            </main>
          </>
        )}
      </div>

      {/* ── DESKTOP (≥1024px) ────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex h-screen overflow-hidden relative z-10"
        style={{ contain: "strict" }}
      >
        {/* LEFT: fixed profile panel */}
        <aside
          className="w-[280px] xl:w-[300px] h-full shrink-0 p-4"
          aria-label="Profile sidebar"
        >
          <GlassPanel
            label="Profile"
            className="h-full"
          >
            {loading || !content ? (
              <ProfileSkeleton />
            ) : (
              <ProfilePanel
                profile={content.profile}
                sections={content.sections}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            )}
          </GlassPanel>
        </aside>

        {/* RIGHT: bento grid of panels */}
        <main
          className="flex-1 h-full overflow-y-auto panel-scroll p-4 pl-0"
          aria-label="Portfolio content"
        >
          {loading || !content ? (
            <div className="grid grid-cols-2 gap-4 h-full">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GlassPanel key={i} label="Loading…">
                  <PanelSkeleton />
                </GlassPanel>
              ))}
            </div>
          ) : (
            <BentoGrid
              sections={visibleSections}
              renderSection={renderSection}
              activeSection={activeSection}
              getPanelRef={getPanelRef}
            />
          )}
        </main>
      </div>
    </>
  );
}

// ─── Bento grid for desktop ────────────────────────────────────────────────────

interface BentoSection {
  id: string;
  label: string;
}

interface BentoGridProps {
  sections: BentoSection[];
  renderSection: (id: SectionId) => React.ReactNode;
  activeSection: string | null;
  getPanelRef: (id: string) => RefObject<HTMLElement>;
}

// Panel height rules: some panels get more rows in the CSS grid
const panelSpan: Record<string, string> = {
  experience:    "row-span-2",
  "case-study":  "row-span-2",
  about:         "row-span-1",
  skills:        "row-span-2",
  certifications:"row-span-1",
  contact:       "row-span-1",
};

function BentoGrid({ sections, renderSection, activeSection, getPanelRef }: BentoGridProps) {
  return (
    <div
      className="grid grid-cols-2 auto-rows-[260px] gap-4"
      style={{ gridAutoRows: "260px" }}
    >
      {sections.map((section, i) => (
        <motion.div
          key={section.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className={`${panelSpan[section.id] ?? "row-span-1"} min-h-0`}
        >
          <ErrorBoundary>
            <GlassPanel
              ref={getPanelRef(section.id) as React.RefObject<HTMLElement>}
              id={section.id}
              label={section.label}
              scrollable
              highlighted={activeSection === section.id}
              className="h-full"
              header={
                <h2 className="font-heading font-semibold text-sm text-foreground">
                  {section.label}
                </h2>
              }
            >
              {renderSection(section.id as SectionId)}
            </GlassPanel>
          </ErrorBoundary>
        </motion.div>
      ))}
    </div>
  );
}
