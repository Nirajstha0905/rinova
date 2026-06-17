export const defaultThemeTokens = {
  primary: "#6d35ff",
  primaryHover: "#5a29db",
  secondary: "#2558ff",
  cta: "#111827",
  bg: "#eef4ff",
  surface: "#ffffff",
  surfaceMuted: "#f8fbff",
  border: "#e4ebf7",
  text: "#0f172a",
  mutedText: "#64748b",
  fontPrimary: "Inter, sans-serif",
};

export const darkThemeTokens = {
  bg: "#08111f",
  surface: "#0f1b2d",
  surfaceMuted: "#14243a",
  border: "#24344d",
  text: "#eef4ff",
  mutedText: "#9fb0c7",
};

export const themeStorageKey = "rinova-theme-settings";

export const applyThemeTokens = (tokens = defaultThemeTokens) => {
  const root = document.documentElement;

  root.style.setProperty("--color-primary", tokens.primary);
  root.style.setProperty("--color-primary-hover", tokens.primaryHover);
  root.style.setProperty("--color-secondary", tokens.secondary);
  root.style.setProperty("--color-cta", tokens.cta);
  root.style.setProperty("--color-bg", tokens.bg);
  root.style.setProperty("--color-surface", tokens.surface);
  root.style.setProperty("--color-surface-muted", tokens.surfaceMuted);
  root.style.setProperty("--color-border", tokens.border);
  root.style.setProperty("--color-text", tokens.text);
  root.style.setProperty("--color-muted", tokens.mutedText);
  root.style.setProperty("--font-primary", tokens.fontPrimary);
};

export const mergeThemeTokens = (savedTokens) => ({
  ...defaultThemeTokens,
  ...(savedTokens || {}),
});
