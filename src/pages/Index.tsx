import { useState, useEffect } from "react";
import { useContent } from "@/context/ContentContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Moon,
  Sun,
  FileText,
  Download,
  Menu,
  X,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Briefcase,
  Award,
  AlertTriangle,
  Lightbulb,
  Wrench,
  CheckCircle,
  Cloud,
  Terminal,
  ShieldCheck,
  Server,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SectionMeta, CaseStudy } from "@/types/content";

// ── Motion variants ────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

function useSectionInView(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const idsKey = ids.join(",");

  useEffect(() => {
    const list = idsKey.split(",").filter(Boolean);
    const observers: IntersectionObserver[] = [];
    list.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [idsKey]);

  return active;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── FLOATING BLURRED TOP BAR WITH ROUNDED CORNERS ──────────────────────────────

function Navbar({
  sections,
  profile,
}: {
  sections: SectionMeta[];
  profile: { name: string; resumeUrl: string };
}) {
  const { mode, toggleMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const active = useSectionInView(visible.map((s) => s.id));

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <header
        className={cn(
          "pointer-events-auto max-w-6xl w-full transition-all duration-300 relative",
          "rounded-2xl",
          "bg-[hsl(var(--surface-glass))] backdrop-blur-2xl shadow-xl shadow-black/5 dark:shadow-black/35",
          "px-5 sm:px-7 py-2.5 sm:py-3",
          scrolled && "shadow-2xl bg-[hsl(var(--surface-glass))/95]"
        )}
      >
        <nav className="flex items-center justify-between gap-4">
          {/* Brand with attractive monogram */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 font-heading font-extrabold text-base sm:text-lg text-foreground shrink-0 hover:text-[hsl(var(--accent-hsl))] transition-colors group"
          >
            <span className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] flex items-center justify-center text-xs font-bold font-mono">
              DP
            </span>
            <span className="tracking-tight">{profile.name}</span>
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1.5">
            {visible.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200",
                    active === s.id
                      ? "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50]"
                  )}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions: Theme toggle + Resume button */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleMode}
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] transition-colors"
            >
              {mode === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
            <a
              href={profile.resumeUrl}
              download="Divij-P-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide",
                "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]",
                "hover:opacity-95 shadow-md shadow-[hsl(var(--accent-hsl))/20] hover:scale-[1.02] active:scale-[0.98] transition-all"
              )}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleMode}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-muted-foreground"
            >
              {mode === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50]"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[hsl(var(--surface-border))/20] animate-fade-in">
            <ul className="space-y-1">
              {visible.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      scrollTo(s.id);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active === s.id
                        ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--bg-subtle))]"
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={profile.resumeUrl}
                  download="Divij-P-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

// ── Section wrappers ───────────────────────────────────────────────────────────

function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28 scroll-mt-24", className)}>
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-1 bg-[hsl(var(--accent-hsl))] rounded-full" />
        <span className="text-xs font-mono font-semibold tracking-widest uppercase text-[hsl(var(--accent-hsl))]">
          {title}
        </span>
      </div>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
        {subtitle ?? title}
      </h2>
    </motion.div>
  );
}

// ── HERO SECTION ───────────────────────────────────────────────────────────────

function HeroSection({
  profile,
}: {
  profile: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    resumeUrl: string;
    location: string;
    socials: { label: string; url: string; icon: string }[];
  };
}) {
  return (
    <section className="min-h-screen flex items-center pt-28 pb-16 relative">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="max-w-4xl">
          {/* Status availability pill */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[hsl(var(--accent-hsl))/30] bg-[hsl(var(--accent-hsl))/10] text-[hsl(var(--accent-hsl))] mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent-hsl))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--accent-hsl))]"></span>
            </span>
            <span>Available for Cloud & DevOps Roles · Chennai, India</span>
          </motion.div>

          {/* Name in striking, professional display font */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground tracking-tight leading-[0.95] mb-6"
          >
            {profile.name}
          </motion.h1>

          {/* Role and company badge */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-2 mb-6"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl text-foreground/90 font-semibold tracking-tight">
              {profile.title}
            </p>
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-lg sm:text-xl font-medium">
              <span className="text-[hsl(var(--accent-hsl))]">@</span>
              <span className="text-[hsl(var(--accent-hsl))] font-extrabold">LTM</span>
              <span className="text-xs sm:text-sm font-semibold tracking-normal text-black dark:text-neutral-300">
                formerly LTIMindtree
              </span>
            </div>
          </motion.div>

          {/* Tagline / Subtitle with text-justify */}
          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-base sm:text-lg text-muted-foreground text-justify leading-relaxed max-w-2xl mb-8"
          >
            {profile.tagline}. Driving mission-critical cloud operations, Terraform
            automation, and proactive monitoring across enterprise AWS banking environments.
          </motion.p>

          {/* Stack pills */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-2 mb-10"
          >
            {[
              "AWS Cloud",
              "Terraform IaC",
              "GitHub Actions CI/CD",
              "Python & Lambda",
              "CloudWatch Alerting",
              "ABSA Banking Client",
            ].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] text-foreground/80 backdrop-blur-md"
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-3 items-center"
          >
            <a
              href={profile.resumeUrl}
              download="Divij-P-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide",
                "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]",
                "shadow-lg shadow-[hsl(var(--accent-hsl))/25] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
              )}
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold",
                "border border-[hsl(var(--border))] bg-[hsl(var(--surface-glass))] text-foreground backdrop-blur-md",
                "hover:bg-[hsl(var(--bg-subtle))] hover:border-[hsl(var(--accent-hsl))/40] transition-all"
              )}
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex gap-3 mt-8"
          >
            {profile.socials
              .filter((s) => s.url.startsWith("http"))
              .map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
                >
                  {s.icon === "linkedin" ? (
                    <Linkedin className="w-4 h-4" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                </a>
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── ABOUT SECTION ──────────────────────────────────────────────────────────────

function AboutSection({ bio }: { bio: string }) {
  return (
    <Section id="about" className="bg-[hsl(var(--bg-subtle))]">
      <SectionHeading title="About" subtitle="Engineering Resilient Cloud Foundations" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="lg:col-span-8 space-y-4"
        >
          <p className="text-base sm:text-lg text-muted-foreground text-justify leading-relaxed">
            {bio}
          </p>
        </motion.div>

        {/* Highlight cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="lg:col-span-4 grid grid-cols-1 gap-4"
        >
          <div className="p-5 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Cloud className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
              <h4 className="font-heading font-bold text-foreground text-sm">Enterprise AWS Migration</h4>
            </div>
            <p className="text-xs text-muted-foreground text-justify leading-relaxed">
              Operational readiness, patch management, private AMI validation, and automated CloudWatch alarms for ABSA banking.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
              <h4 className="font-heading font-bold text-foreground text-sm">Automation & Governance</h4>
            </div>
            <p className="text-xs text-muted-foreground text-justify leading-relaxed">
              Custom Python/Boto3 and AWS Lambda solutions enforcing tag governance, idle resource termination, and auto-healing alarms.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ── EXPERIENCE SECTION ─────────────────────────────────────────────────────────

function ExperienceSection({
  experience,
}: {
  experience: {
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    location: string;
    responsibilities: string[];
  }[];
}) {
  return (
    <Section id="experience">
      <SectionHeading title="Experience" subtitle="Professional Impact & Responsibilities" />
      <div className="space-y-10">
        {experience.map((exp, i) => (
          <motion.article
            key={exp.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className={cn(
              "rounded-2xl p-6 sm:p-8 md:p-10 border border-[hsl(var(--surface-border))]",
              "bg-[hsl(var(--surface-glass))] backdrop-blur-xl shadow-lg"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-[hsl(var(--surface-border))]">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-[hsl(var(--accent-hsl))/12] text-[hsl(var(--accent-hsl))]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                    {exp.role}
                  </h3>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base sm:text-lg text-[hsl(var(--accent-hsl))] font-bold">
                    LTM
                  </span>
                  <span className="text-xs font-semibold text-black dark:text-neutral-300">
                    formerly LTIMindtree
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground sm:text-right shrink-0">
                <span className="font-mono font-medium">
                  {exp.startDate} – {exp.endDate ?? "Present"}
                </span>
                <span className="flex items-center gap-1 sm:justify-end">
                  <MapPin className="w-3.5 h-3.5" />
                  {exp.location}
                </span>
              </div>
            </div>

            <ul className="space-y-4">
              {exp.responsibilities.map((item, j) => {
                const parts = item.split(":");
                const heading = parts.length > 1 ? parts[0] : null;
                const rest = parts.length > 1 ? parts.slice(1).join(":") : item;

                return (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-muted-foreground text-justify leading-relaxed"
                  >
                    <span className="text-[hsl(var(--accent-hsl))] font-bold mt-0.5 shrink-0 text-base">
                      ▸
                    </span>
                    <span>
                      {heading && (
                        <strong className="text-foreground font-semibold mr-1">
                          {heading}:
                        </strong>
                      )}
                      {rest}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

// ── SKILLS SECTION ─────────────────────────────────────────────────────────────

function SkillsSection({
  skills,
}: {
  skills: { category: string; items: string[] }[];
}) {
  return (
    <Section id="skills" className="bg-[hsl(var(--bg-subtle))]">
      <SectionHeading title="Skills" subtitle="Technical Proficiencies & Tooling" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((group, i) => (
          <motion.div
            key={group.category}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className={cn(
              "rounded-2xl p-6 border border-[hsl(var(--surface-border))]",
              "bg-[hsl(var(--surface-glass))] backdrop-blur-xl shadow-md",
              "hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            )}
          >
            <h3 className="font-heading font-bold text-foreground mb-4 text-xs font-mono uppercase tracking-widest text-[hsl(var(--accent-hsl))]">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[hsl(var(--surface-border))] bg-[hsl(var(--bg))] text-foreground/90 hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ── CASE STUDY SECTION ─────────────────────────────────────────────────────────

const blockIconMap: Record<string, React.FC<{ className?: string }>> = {
  "alert-triangle": ({ className }) => <AlertTriangle className={className ?? ""} />,
  lightbulb: ({ className }) => <Lightbulb className={className ?? ""} />,
  wrench: ({ className }) => <Wrench className={className ?? ""} />,
  "check-circle": ({ className }) => <CheckCircle className={className ?? ""} />,
};

function CaseStudySection({ caseStudies }: { caseStudies: CaseStudy[] }) {
  if (!caseStudies.length) return null;
  return (
    <Section id="case-study">
      <SectionHeading title="Case Study" subtitle="ABSA Banking Migration & Cloud Readiness" />
      {caseStudies.map((cs, i) => (
        <div key={cs.id}>
          <motion.div
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground mb-2 tracking-tight">
              {cs.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground text-justify leading-relaxed">
              {cs.subtitle}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cs.blocks.map((block, j) => {
              const Icon = block.icon ? blockIconMap[block.icon] : null;
              return (
                <motion.div
                  key={block.title}
                  custom={j}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeUp}
                  className={cn(
                    "rounded-2xl p-7 border border-[hsl(var(--surface-border))]",
                    "bg-[hsl(var(--surface-glass))] backdrop-blur-xl shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {Icon && <Icon className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />}
                    <h4 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">
                      {block.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground text-justify leading-relaxed">
                    {block.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </Section>
  );
}

// ── CERTIFICATIONS SECTION ─────────────────────────────────────────────────────

function CertificationsSection({
  certifications,
}: {
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    badgeUrl?: string;
    verifyUrl?: string;
    description?: string;
  }[];
}) {
  return (
    <Section id="certifications" className="bg-[hsl(var(--bg-subtle))]">
      <SectionHeading title="Certifications" subtitle="Industry Accreditations" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, i) => (
          <motion.article
            key={cert.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className={cn(
              "rounded-2xl p-7 border border-[hsl(var(--surface-border))]",
              "bg-[hsl(var(--surface-glass))] backdrop-blur-xl shadow-md",
              "hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/15 shrink-0 border border-amber-500/30">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-1">
                  {cert.name}
                </h3>
                <p className="text-[hsl(var(--accent-hsl))] font-semibold text-sm mb-3">
                  {cert.issuer}
                </p>
                {cert.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground text-justify leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <p>Issued: {cert.issueDate}</p>
                  {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
                  {cert.credentialId && (
                    <p className="pt-1 break-all">Credential ID: {cert.credentialId}</p>
                  )}
                </div>
                {cert.badgeUrl && (
                  <a
                    href={cert.badgeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold text-[hsl(var(--accent-hsl))] hover:underline transition-all"
                  >
                    View Official Credential <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
        <div className="rounded-2xl p-7 border border-dashed border-[hsl(var(--surface-border))] flex flex-col justify-center items-center text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            Additional Certifications In Progress
          </p>
          <p className="text-xs text-muted-foreground max-w-xs text-justify">
            Currently advancing AWS Solutions Architect & DevOps Engineer professional competencies.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ── CONTACT SECTION ────────────────────────────────────────────────────────────

function ContactSection({
  profile,
}: {
  profile: {
    email: string;
    phone?: string;
    socials: { label: string; url: string; icon: string }[];
  };
}) {
  const items = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <Mail className="w-5 h-5" />,
      external: false,
    },
    ...(profile.phone
      ? [
          {
            label: "Phone",
            value: profile.phone,
            href: `tel:${profile.phone}`,
            icon: <Phone className="w-5 h-5" />,
            external: false,
          },
        ]
      : []),
    ...profile.socials
      .filter((s) => s.url.startsWith("http"))
      .map((s) => ({
        label: s.label,
        value: s.url.replace(/^https?:\/\/(www\.)?/, ""),
        href: s.url,
        icon:
          s.icon === "linkedin" ? (
            <Linkedin className="w-5 h-5" />
          ) : (
            <Github className="w-5 h-5" />
          ),
        external: true,
      })),
  ];

  return (
    <Section id="contact">
      <SectionHeading title="Contact" subtitle="Let's Connect & Collaborate" />
      <div className="max-w-3xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-base sm:text-lg text-muted-foreground text-justify leading-relaxed mb-8"
        >
          Open to Cloud Engineer and DevOps Engineer opportunities. Whether you have an
          infrastructure automation inquiry or want to discuss enterprise cloud readiness,
          feel free to reach out directly.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.a
              key={item.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl",
                "border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl shadow-sm",
                "hover:border-[hsl(var(--accent-hsl))/40] hover:bg-[hsl(var(--accent-hsl))/5]",
                "group transition-all duration-200"
              )}
            >
              <span className="text-muted-foreground group-hover:text-[hsl(var(--accent-hsl))] transition-colors shrink-0">
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-foreground truncate group-hover:text-[hsl(var(--accent-hsl))] transition-colors">
                  {item.value}
                </p>
              </div>
              {item.external && (
                <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-[hsl(var(--accent-hsl))] transition-colors shrink-0" />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────

function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-[hsl(var(--surface-border))] py-10 bg-[hsl(var(--bg))]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {name}. Built with focus on cloud infrastructure & automation.
        </p>
        <p className="text-xs text-muted-foreground/60 font-mono">
          React 18 · Vite · Tailwind CSS · TypeScript
        </p>
      </div>
    </footer>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function Index() {
  const { content, loading, error } = useContent();
  const { applyTheme } = useTheme();

  const theme = content?.theme;
  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme, applyTheme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--accent-hsl))] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">Failed to load content. {error}</p>
      </div>
    );
  }

  const visibleSections = [...content.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative min-h-screen bg-[hsl(var(--bg))] font-sans antialiased selection:bg-[hsl(var(--accent-hsl))/30]">
      {/* Background color blobs */}
      <div className="color-field" aria-hidden="true" />
      {/* Subtle film grain */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Floating blurred top bar with rounded corners */}
      <Navbar sections={content.sections} profile={content.profile} />

      {/* Full vertical sections */}
      <main>
        <HeroSection profile={content.profile} />

        {visibleSections.map((s) => {
          switch (s.id) {
            case "about":
              return <AboutSection key={s.id} bio={content.profile.bio} />;
            case "experience":
              return (
                <ExperienceSection
                  key={s.id}
                  experience={content.experience}
                />
              );
            case "skills":
              return <SkillsSection key={s.id} skills={content.skills} />;
            case "case-study":
              return (
                <CaseStudySection
                  key={s.id}
                  caseStudies={content.caseStudies}
                />
              );
            case "certifications":
              return (
                <CertificationsSection
                  key={s.id}
                  certifications={content.certifications}
                />
              );
            case "contact":
              return <ContactSection key={s.id} profile={content.profile} />;
            default:
              return null;
          }
        })}
      </main>

      <Footer name={content.profile.name} />
    </div>
  );
}
