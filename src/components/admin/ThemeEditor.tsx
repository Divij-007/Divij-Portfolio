import { useEffect } from "react";
import type { Theme } from "@/types/content";
import { useTheme } from "@/context/ThemeContext";
import { Palette, Sun, Moon, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeEditorProps {
  theme: Theme;
  onChange: (updated: Theme) => void;
}

const PRESET_ACCENTS = [
  { name: "Teal (Default)", hsl: "173 58% 45%", hex: "#31b5a5" },
  { name: "Emerald", hsl: "158 64% 42%", hex: "#26b17c" },
  { name: "Cyan", hsl: "192 85% 42%", hex: "#10a5cb" },
  { name: "Sky Blue", hsl: "200 95% 45%", hex: "#0bb3fa" },
  { name: "Indigo", hsl: "238 82% 63%", hex: "#5d60f5" },
  { name: "Violet", hsl: "262 83% 58%", hex: "#8b3cf0" },
  { name: "Amber Gold", hsl: "38 92% 50%", hex: "#f59f0a" },
  { name: "Coral Rose", hsl: "16 90% 58%", hex: "#f75531" },
];

const HEADING_FONTS = [
  "Plus Jakarta Sans",
  "Inter",
  "Fraunces",
  "Poppins",
  "Outfit",
  "Sora",
];

const BODY_FONTS = [
  "Inter",
  "Plus Jakarta Sans",
  "Roboto",
  "System",
];

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  const { applyTheme } = useTheme();

  // Apply changes to document in real-time so user can test visually
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const updateField = <K extends keyof Theme>(field: K, value: Theme[K]) => {
    onChange({ ...theme, [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Accent Color Palette */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Accent Color Palette
            </h3>
            <p className="text-xs text-muted-foreground">
              Controls buttons, badges, highlights, and borders across the portfolio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {PRESET_ACCENTS.map((preset) => {
            const isSelected = theme.accentColor.trim() === preset.hsl.trim();
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => updateField("accentColor", preset.hsl)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-[hsl(var(--accent-hsl))] bg-[hsl(var(--accent-hsl))/15] shadow-sm"
                    : "border-[hsl(var(--surface-border))] bg-[hsl(var(--bg))] hover:border-[hsl(var(--accent-hsl))/40]"
                )}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: preset.hex }}
                />
                <span className="text-xs font-semibold text-foreground truncate">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
            Custom Accent Color (HSL values e.g. &quot;173 58% 45%&quot;)
          </label>
          <input
            type="text"
            value={theme.accentColor}
            onChange={(e) => updateField("accentColor", e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl text-xs font-mono bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
          />
        </div>
      </div>

      {/* Theme Mode & Typography */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-5">
        <h3 className="font-heading font-bold text-lg text-foreground">
          Theme Mode & Typography
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
              Default Mode
            </label>
            <div className="flex gap-2">
              {(["dark", "light", "system"] as const).map((modeOption) => (
                <button
                  key={modeOption}
                  type="button"
                  onClick={() => updateField("defaultMode", modeOption)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all",
                    theme.defaultMode === modeOption
                      ? "bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] border-transparent"
                      : "bg-[hsl(var(--bg))] border-[hsl(var(--surface-border))] text-muted-foreground hover:text-foreground"
                  )}
                >
                  {modeOption === "dark" && <Moon className="w-3.5 h-3.5" />}
                  {modeOption === "light" && <Sun className="w-3.5 h-3.5" />}
                  <span>{modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
              Heading Font Family
            </label>
            <select
              value={theme.fontHeading}
              onChange={(e) => updateField("fontHeading", e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] [&>option]:bg-[hsl(var(--bg))] [&>option]:text-foreground"
            >
              {HEADING_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
              Body Font Family
            </label>
            <select
              value={theme.fontBody}
              onChange={(e) => updateField("fontBody", e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))] [&>option]:bg-[hsl(var(--bg))] [&>option]:text-foreground"
            >
              {BODY_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Sliders: Blur, Grain, Radius */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[hsl(var(--accent-hsl))]" />
          <h3 className="font-heading font-bold text-lg text-foreground">
            Aesthetic Glass & Surface Effects
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Glass Blur */}
          <div className="p-4 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Glass Blur</span>
              <span className="font-mono text-[hsl(var(--accent-hsl))]">{theme.blurIntensity}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={theme.blurIntensity}
              onChange={(e) => updateField("blurIntensity", Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent-hsl))]"
            />
            <p className="text-[11px] text-muted-foreground">
              Controls backdrop frosted blur on navbar and card containers.
            </p>
          </div>

          {/* Film Grain */}
          <div className="p-4 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Film Grain</span>
              <span className="font-mono text-[hsl(var(--accent-hsl))]">{theme.grainIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={theme.grainIntensity}
              onChange={(e) => updateField("grainIntensity", Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent-hsl))]"
            />
            <p className="text-[11px] text-muted-foreground">
              Subtle analog noise texture over the dark/light canvas.
            </p>
          </div>

          {/* Border Radius */}
          <div className="p-4 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Corner Radius</span>
              <span className="font-mono text-[hsl(var(--accent-hsl))]">{theme.radius}rem</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.05"
              value={theme.radius}
              onChange={(e) => updateField("radius", Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent-hsl))]"
            />
            <p className="text-[11px] text-muted-foreground">
              Controls curvature of cards, pills, buttons, and navigation bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
