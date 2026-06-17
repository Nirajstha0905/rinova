import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  applyThemeTokens,
  darkThemeTokens,
  defaultThemeTokens,
  mergeThemeTokens,
  themeStorageKey,
} from "../config/theme";

const ThemeContext = createContext(null);

const readStoredTheme = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(themeStorageKey) || "{}");

    return {
      mode: stored.mode === "dark" ? "dark" : "light",
      tokens: mergeThemeTokens(stored.tokens),
    };
  } catch {
    return {
      mode: "light",
      tokens: defaultThemeTokens,
    };
  }
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => readStoredTheme().mode);
  const [tokens, setTokens] = useState(() => readStoredTheme().tokens);

  const effectiveTokens = useMemo(
    () => ({
      ...tokens,
      ...(mode === "dark" ? darkThemeTokens : {}),
    }),
    [mode, tokens],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.dataset.theme = mode;
    applyThemeTokens(effectiveTokens);
    localStorage.setItem(
      themeStorageKey,
      JSON.stringify({ mode, tokens }),
    );
  }, [effectiveTokens, mode, tokens]);

  const value = useMemo(
    () => ({
      mode,
      tokens,
      effectiveTokens,
      isDark: mode === "dark",
      setMode,
      toggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark")),
      updateToken: (key, value) =>
        setTokens((current) => ({
          ...current,
          [key]: value,
        })),
      resetTheme: () => {
        setMode("light");
        setTokens(defaultThemeTokens);
      },
    }),
    [effectiveTokens, mode, tokens],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
