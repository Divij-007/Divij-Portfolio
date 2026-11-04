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
import { ResetConfirmModal } from "@/components/admin/ResetConfirmModal";
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

// Authorized administrator emails
const AUTHORIZED_ADMIN_EMAILS = [
  "divijdivij007@gmail.com",
  ...(import.meta.env.VITE_ADMIN_EMAIL ? [import.meta.env.VITE_ADMIN_EMAIL.toLowerCase()] : []),
];

const isAuthorizedAdmin = (email?: string | null) => {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email.trim().toLowerCase());
};

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
  const [resetModalOpen, setResetModalOpen] = useState(false);

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
      } else if (!isAuthorizedAdmin(email)) {
        await signOut();
        setAuthError("Access restricted: This email is not authorized as an administrator.");
        toast.error("Unauthorized email address.");
      } else {
        toast.success("Welcome back, Admin!");
      }
    } else {
      if (!isAuthorizedAdmin(email)) {
        setAuthError("Registration restricted: Only designated administrators can create an account.");
        toast.error("Unauthorized email address.");
        setAuthSubmitting(false);
        return;
      }
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
        `Failed to persist: ${result.error || "Unknown error"}. Check console for details.`
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

  // Reset to default bundled content (invoked after confirmation)
  const handleExecuteReset = async () => {
    try {
      const defaultData = await resetToDefault();
      setDraft(JSON.parse(JSON.stringify(defaultData)));
      toast.success("Factory defaults restored successfully!");
    } catch (err) {
      console.error("Failed to reset to default:", err);
      toast.error("Failed to reset to default configuration.");
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
              Sign in with your admin credentials to manage and update your portfolio.
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

          {authMode === "signup" && (
            <div className="p-3 rounded-xl bg-[hsl(var(--surface-border))/25] border border-[hsl(var(--surface-border))] text-[11px] text-muted-foreground">
              Notice: Account registration is restricted to the authorized administrator (<span className="text-foreground font-mono">divijdivij007@gmail.com</span>).
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
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all mt-2",
                "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-95 shadow-lg shadow-[hsl(var(--accent-hsl))/20]",
                authSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {authSubmitting
                ? "Authenticating..."
                : authMode === "signin"
                ? "Sign In"
                : "Create Admin Account"}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2">
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

  // ─── ACCESS CONTROL GUARD (AUTHENTICATED BUT NOT AUTHORIZED) ─────────────────
  if (user && !isAuthorizedAdmin(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(var(--bg))] relative selection:bg-[hsl(var(--accent-hsl))/30]">
        <div className="color-field" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-2xl shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-black text-2xl text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The account <span className="font-mono text-foreground font-semibold">{user.email}</span> does not have administrative privileges for this portfolio.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={signOut}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              Sign Out & Log In As Administrator
            </button>
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD WORKSPACE (AUTHENTICATED & AUTHORIZED) ────────────────────────
  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--bg))]">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--accent-hsl))] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] text-foreground font-sans antialiased selection:bg-[hsl(var(--accent-hsl))/30]">
      {/* Background elements */}
      <div className="color-field" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      {/* SQL Setup Modal */}
      <SqlSetupModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        onRecheck={reloadContent}
      />

      {/* Factory Reset Confirmation Modal (requires typing RESET) */}
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleExecuteReset}
      />

      {/* Top Floating Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--surface-glass))] backdrop-blur-2xl border-b border-[hsl(var(--surface-border))] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSqlModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] text-foreground hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[hsl(var(--accent-hsl))]" />
              <span>SQL Schema</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] text-foreground hover:border-[hsl(var(--accent-hsl))/40] transition-colors"
            >
              <span className="hidden xs:inline">Preview</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>

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

        {/* Mobile Horizontal Section Tabs (screens < md) */}
        <div className="md:hidden overflow-x-auto scrollbar-none border-t border-[hsl(var(--surface-border))/40] px-3 py-1.5 bg-[hsl(var(--surface-glass))]">
          <nav className="flex items-center gap-1 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
                    isActive
                      ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))]"
                      : "text-muted-foreground hover:text-foreground"
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

      {/* Main Container: Left Sidebar + Right Editor Body */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Left Sidebar (Desktop md+) */}
        <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 shrink-0 border-r border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))/40] backdrop-blur-xl p-4 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                Content Sections
              </p>
              <nav className="space-y-1">
                {TABS.slice(0, 7).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group",
                        isActive
                          ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] font-bold shadow-xs border border-[hsl(var(--accent-hsl))/30]"
                          : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/40]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-[hsl(var(--accent-hsl))]" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                Settings & Style
              </p>
              <nav className="space-y-1">
                {TABS.slice(7).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group",
                        isActive
                          ? "bg-[hsl(var(--accent-hsl))/15] text-[hsl(var(--accent-hsl))] font-bold shadow-xs border border-[hsl(var(--accent-hsl))/30]"
                          : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/40]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-[hsl(var(--accent-hsl))]" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-4 mt-6 border-t border-[hsl(var(--surface-border))/60] space-y-3">
            <div className="px-3">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Logged In As</p>
              <p className="text-xs font-mono text-foreground truncate font-medium">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Factory Reset</span>
            </button>
          </div>
        </aside>

        {/* Right Editor Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-4xl pb-24">
          <div className="mb-6 pb-4 border-b border-[hsl(var(--surface-border))] flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-2xl text-foreground capitalize">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update details below and click "Save Changes" to publish live.
              </p>
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
}
