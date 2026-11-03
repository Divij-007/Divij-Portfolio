import type { Profile, Social } from "@/types/content";
import { Plus, Trash2, Globe, Linkedin, Github, Mail, Twitter } from "lucide-react";

interface ProfileEditorProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
}

const COMMON_ICONS = ["linkedin", "github", "mail", "twitter", "globe"];

export function ProfileEditor({ profile, onChange }: ProfileEditorProps) {
  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    onChange({ ...profile, [field]: value });
  };

  const updateSocial = (index: number, updated: Social) => {
    const list = [...profile.socials];
    list[index] = updated;
    onChange({ ...profile, socials: list });
  };

  const addSocial = () => {
    const newSocial: Social = {
      label: "New Link",
      url: "https://",
      icon: "globe",
    };
    onChange({ ...profile, socials: [...profile.socials, newSocial] });
  };

  const removeSocial = (index: number) => {
    const list = profile.socials.filter((_, i) => i !== index);
    onChange({ ...profile, socials: list });
  };

  const getIconPreview = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
      case "github":
        return <Github className="w-4 h-4" />;
      case "mail":
        return <Mail className="w-4 h-4 text-rose-500" />;
      case "twitter":
        return <Twitter className="w-4 h-4 text-sky-400" />;
      default:
        return <Globe className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Basic details */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl">
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">
          Personal & Professional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. Divij P"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Professional Title / Role
            </label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. Cloud & Infrastructure Engineer"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Hero Tagline / Subtitle
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. Transitioning to DevOps · AWS Cloud Architecture · Terraform IaC"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. Chennai, India"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. +91 9597696369"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Resume URL / Path
            </label>
            <input
              type="text"
              value={profile.resumeUrl}
              onChange={(e) => updateField("resumeUrl", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              placeholder="e.g. /resume.pdf or Google Drive link"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">
              About Bio (Full Narrative)
            </label>
            <textarea
              rows={6}
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] leading-relaxed"
              placeholder="Enter your detailed professional bio..."
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Social Links & Channels
            </h3>
            <p className="text-xs text-muted-foreground">
              Shown in the hero and contact sections of your portfolio
            </p>
          </div>
          <button
            type="button"
            onClick={addSocial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.socials.map((social, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))]"
            >
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <span className="p-2 rounded-lg bg-[hsl(var(--surface-border))/40]">
                  {getIconPreview(social.icon)}
                </span>
                <select
                  value={social.icon}
                  onChange={(e) => updateSocial(index, { ...social, icon: e.target.value })}
                  className="px-2.5 py-2 rounded-lg text-xs bg-[hsl(var(--surface-border))/30] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none"
                >
                  {COMMON_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic.charAt(0).toUpperCase() + ic.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={social.label}
                onChange={(e) => updateSocial(index, { ...social, label: e.target.value })}
                placeholder="Label (e.g. LinkedIn)"
                className="w-full sm:w-40 px-3 py-2 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              />

              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocial(index, { ...social, url: e.target.value })}
                placeholder="https://..."
                className="w-full flex-1 px-3 py-2 rounded-lg text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
              />

              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors self-end sm:self-center"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
