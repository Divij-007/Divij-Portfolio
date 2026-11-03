import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import type { SiteContent } from "@/types/content";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { SectionsEditor } from "@/components/admin/SectionsEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { CaseStudyEditor } from "@/components/admin/CaseStudyEditor";
import { CertificationsEditor } from "@/components/admin/CertificationsEditor";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { SeoEditor } from "@/components/admin/SeoEditor";
import { SqlSetupModal } from "@/components/admin/SqlSetupModal";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  ExternalLink,
  Database,
  User,
  Layers,
  Briefcase,
  Zap,
  BookOpen,
  Award,
  Code2,
  Palette,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdminTab =
  | "profile"
  | "sections"
  | "experience"
  | "skills"
  | "case-study"
  | "certifications"
  | "projects"
  | "theme"
  | "seo";

const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "Profile & Bio", icon: User },
  { id: "sections", label: "Sections", icon: Layers },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "case-study", label: "Case Studies", icon: BookOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "theme", label: "Theme & Styling", icon: Palette },
  { id: "seo", label: "SEO & Database", icon: Globe },
];

export default function Admin() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { content, loading: contentLoading, isRemote, saveContent, resetToDefault, reloadContent } = useContent();

  // Auth Form State
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Draft editing state
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);

  // Sync draft whenever content is loaded or updated
  useEffect(() => {
    if (content && !draft) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [content, draft]);

  const isDirty =
    draft && content ? JSON.stringify(draft) !== JSON.stringify(content) : false;

  // Handle Authentication submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    if (authMode === "signin") {
      const res = await signIn(email, password);
      if (res.error) {
        setAuthError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Welcome back, Admin!");
      }
    } else {
      const res = await signUp(email, password);
      if (res.error) {
        setAuthError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Admin account registered successfully! You are now logged in.");
      }
    }
    setAuthSubmitting(false);
  };

  // Handle Saving Changes
  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const result = await saveContent(draft);
    if (result.success) {
      toast.success("Portfolio changes saved successfully!");
    } else {
      toast.error(
        `Failed to persist to Supabase: ${result.error}. (Make sure you have run the SQL script to create the table).`
      );
    }
    setSaving(false);
  };

  // Discard edits
  const handleDiscard = () => {
    if (content) {
      setDraft(JSON.parse(JSON.stringify(content)));
      toast.info("Unsaved edits reverted to saved version.");
    }
  };

  // Reset to default bundled content
  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all portfolio content to factory defaults?")) {
      await resetToDefault();
      if (content) setDraft(JSON.parse(JSON.stringify(content)));
      toast.success("Reset to default configuration.");
    }
  };

  // Seed remote DB with draft
  const handleSeedData = async () => {
    if (draft) {
      await handleSave();
    }
  };

  if (authLoading || (user && contentLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--bg))] text-foreground">
        <div className="w-10 h-10 rounded-full border-3 border-[hsl(var(--accent-hsl))] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading admin workspace...</p>
      </div>
    );
  }

  // ─── LOGIN / SIGNUP SCREEN ───────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(var(--bg))] relative selection:bg-[hsl(var(--accent-hsl))/30]">
        <div className="color-field" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />

        <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] flex items-center justify-center mx-auto text-sm font-bold font-mono">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in with your credentials to edit your portfolio in real time.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-[hsl(var(--surface-border))/30] border border-[hsl(var(--surface-border))]">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setAuthError(null);
              }}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                authMode === "signin"
                  ? "bg-[hsl(var(--bg))] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setAuthError(null);
              }}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                authMode === "signup"
                  ? "bg-[hsl(var(--bg))] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Create Account
            </button>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted-foreground hover:text-foreground absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-bold tracking-wide",
                "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]",
                "shadow-lg shadow-[hsl(var(--accent-hsl))/25] hover:opacity-95 transition-all",
                authSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {authSubmitting
                ? "Verifying..."
                : authMode === "signin"
                ? "Enter Admin Dashboard"
                : "Register Admin Account"}
            </button>
          </form>

          {/* Database Info pill */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-muted-foreground/70">
              Connected to Supabase Project: <span className="font-mono text-foreground/80">usalopghptthamlszjmi</span>
            </p>
          </div>

          {/* Back to site */}
          <div className="pt-2 text-center border-t border-[hsl(var(--surface-border))]">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1 font-medium transition-colors"
            >
              ← Back to Live Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD WORKSPACE (AUTHENTICATED) ──────────────────────────────────────
  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--accent-hsl))] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] text-foreground font-sans antialiased selection:bg-[hsl(var(--accent-hsl))/30] pb-24">
      {/* Background elements */}
      <div className="color-field" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      {/* SQL Setup Modal */}
      <SqlSetupModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        onRecheck={reloadContent}
      />

      {/* Top Floating Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--surface-glass))] backdrop-blur-2xl border-b border-[hsl(var(--surface-border))] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & status */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-heading font-extrabold text-base text-foreground hover:text-[hsl(var(--accent-hsl))] transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] flex items-center justify-center text-xs font-mono font-bold">
                DP
              </span>
              <span className="hidden sm:inline">Portfolio Admin</span>
            </Link>

            <span className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-medium bg-[hsl(var(--surface-border))/30] border-[hsl(var(--surface-border))]">
              {isRemote ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[11px]">Supabase Synced</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400 text-[11px]">Local Bundled</span>
                </>
              )}
            </span>
          </div>

          {/* Center actions: Live preview & SQL */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSqlModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] text-foreground hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[hsl(var(--accent-hsl))]" />
              <span className="hidden md:inline">SQL Schema</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] text-foreground hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/40] transition-colors"
              >
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all",
                "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]",
                isDirty
                  ? "shadow-lg shadow-[hsl(var(--accent-hsl))/30] ring-2 ring-[hsl(var(--accent-hsl))/40] scale-[1.02]"
                  : "opacity-85 hover:opacity-100",
                saving && "opacity-50 cursor-not-allowed"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : isDirty ? "Save Changes *" : "Saved"}</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none border-t border-[hsl(var(--surface-border))/40]">
          <nav className="flex items-center gap-1 py-1.5 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0",
                    isActive
                      ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/40]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {activeTab === "profile" && (
          <ProfileEditor
            profile={draft.profile}
            onChange={(updated) => setDraft({ ...draft, profile: updated })}
          />
        )}

        {activeTab === "sections" && (
          <SectionsEditor
            sections={draft.sections}
            onChange={(updated) => setDraft({ ...draft, sections: updated })}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceEditor
            experience={draft.experience}
            onChange={(updated) => setDraft({ ...draft, experience: updated })}
          />
        )}

        {activeTab === "skills" && (
          <SkillsEditor
            skills={draft.skills}
            onChange={(updated) => setDraft({ ...draft, skills: updated })}
          />
        )}

        {activeTab === "case-study" && (
          <CaseStudyEditor
            caseStudies={draft.caseStudies}
            onChange={(updated) => setDraft({ ...draft, caseStudies: updated })}
          />
        )}

        {activeTab === "certifications" && (
          <CertificationsEditor
            certifications={draft.certifications}
            onChange={(updated) => setDraft({ ...draft, certifications: updated })}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsEditor
            projects={draft.projects}
            onChange={(updated) => setDraft({ ...draft, projects: updated })}
          />
        )}

        {activeTab === "theme" && (
          <ThemeEditor
            theme={draft.theme}
            onChange={(updated) => setDraft({ ...draft, theme: updated })}
          />
        )}

        {activeTab === "seo" && (
          <SeoEditor
            seo={draft.seo}
            onChange={(updated) => setDraft({ ...draft, seo: updated })}
            onOpenSqlModal={() => setSqlModalOpen(true)}
            onSeedData={handleSeedData}
          />
        )}

        {/* Bottom Safety Reset Bar */}
        <div className="mt-12 pt-6 border-t border-[hsl(var(--surface-border))] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Signed in as:</span>
            <span className="font-mono text-foreground font-semibold">{user.email}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 hover:underline transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Portfolio Content to Factory Defaults</span>
          </button>
        </div>
      </main>
    </div>
  );
}
