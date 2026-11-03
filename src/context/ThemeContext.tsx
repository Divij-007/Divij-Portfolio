import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Theme } from "@/types/content";

type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  toggleMode: () => {},
  applyTheme: () => {},
});

const STORAGE_KEY = "portfolio-theme-mode";

function getSystemPreference(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitialMode(defaultMode: "dark" | "light" | "system"): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === "dark" || stored === "light") return stored;
  if (defaultMode === "system") return getSystemPreference();
  return defaultMode;
}

function applyModeToDOM(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
  root.setAttribute("data-theme", mode);
}

function applyCSSVars(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--accent-hsl", theme.accentColor);
  root.style.setProperty("--blur-intensity", `${theme.blurIntensity}px`);
  root.style.setProperty("--grain-intensity", `${theme.grainIntensity / 100}`);
  root.style.setProperty("--radius-base", `${theme.radius}rem`);
  root.style.setProperty("--font-heading", `"${theme.fontHeading}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`);
  root.style.setProperty("--font-body", `"${theme.fontBody}", system-ui, sans-serif`);
}

export function ThemeProvider({
  children,
  defaultMode = "dark",
}: {
  children: ReactNode;
  defaultMode?: "dark" | "light" | "system";
}) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode(defaultMode));

  useEffect(() => {
    applyModeToDOM(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const applyTheme = useCallback((theme: Theme) => {
    applyCSSVars(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
