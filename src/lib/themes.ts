// Theme system for customizable themes

export type ThemeMode = "light" | "dark" | "system";

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export const DEFAULT_THEMES: Theme[] = [
  {
    id: "default",
    name: "Default",
    primary: "hsl(222 47% 31%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 96%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222 47% 11%)",
    muted: "hsl(210 40% 96%)",
    border: "hsl(214 32% 91%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "hsl(199 89% 48%)",
    secondary: "hsl(200 50% 90%)",
    accent: "hsl(190 90% 50%)",
    background: "hsl(200 50% 97%)",
    foreground: "hsl(200 50% 10%)",
    muted: "hsl(200 30% 90%)",
    border: "hsl(200 30% 85%)",
  },
  {
    id: "forest",
    name: "Forest",
    primary: "hsl(142 76% 36%)",
    secondary: "hsl(140 40% 90%)",
    accent: "hsl(140 60% 45%)",
    background: "hsl(140 30% 97%)",
    foreground: "hsl(140 40% 10%)",
    muted: "hsl(140 20% 90%)",
    border: "hsl(140 20% 85%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    primary: "hsl(25 95% 53%)",
    secondary: "hsl(30 50% 90%)",
    accent: "hsl(20 90% 55%)",
    background: "hsl(30 30% 97%)",
    foreground: "hsl(30 40% 10%)",
    muted: "hsl(30 20% 90%)",
    border: "hsl(30 20% 85%)",
  },
  {
    id: "berry",
    name: "Berry",
    primary: "hsl(330 80% 50%)",
    secondary: "hsl(330 40% 90%)",
    accent: "hsl(320 70% 55%)",
    background: "hsl(330 20% 97%)",
    foreground: "hsl(330 40% 10%)",
    muted: "hsl(330 20% 90%)",
    border: "hsl(330 20% 85%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    primary: "hsl(250 80% 60%)",
    secondary: "hsl(250 30% 20%)",
    accent: "hsl(260 70% 55%)",
    background: "hsl(250 25% 8%)",
    foreground: "hsl(250 20% 95%)",
    muted: "hsl(250 20% 20%)",
    border: "hsl(250 20% 25%)",
  },
];

export interface ThemeConfig {
  mode: ThemeMode;
  themeId: string;
  customPrimary?: string;
}

const THEME_STORAGE_KEY = "nexus_theme_config";

export function getThemeConfig(): ThemeConfig {
  if (typeof window === "undefined") {
    return { mode: "system", themeId: "default" };
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored
    ? JSON.parse(stored)
    : { mode: "system", themeId: "default" };
}

export function saveThemeConfig(config: ThemeConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
}

export function applyTheme(config: ThemeConfig): void {
  if (typeof window === "undefined") return;

  const theme = DEFAULT_THEMES.find((t) => t.id === config.themeId) || DEFAULT_THEMES[0];
  const root = document.documentElement;

  // Apply theme colors
  root.style.setProperty("--primary", config.customPrimary || theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--foreground", theme.foreground);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--border", theme.border);

  // Apply mode
  const isDark =
    config.mode === "dark" ||
    (config.mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Store applied theme
  root.setAttribute("data-theme", theme.id);
}

export function getCurrentTheme(): Theme {
  const config = getThemeConfig();
  return (
    DEFAULT_THEMES.find((t) => t.id === config.themeId) || DEFAULT_THEMES[0]
  );
}
