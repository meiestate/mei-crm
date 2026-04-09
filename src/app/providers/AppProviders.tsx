import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeMode } from "../theme";

export const THEME_STORAGE_KEY = "mei-crm-theme";

type AppProvidersProps = {
  children: (props: {
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
  }) => ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedMode === "light" || savedMode === "dark") {
      return savedMode;
    }

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);
    document.body.style.background = mode === "dark" ? "#020617" : "#f8fafc";
    document.body.style.margin = "0";
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);

      if (savedMode === "light" || savedMode === "dark") {
        return;
      }

      setMode(event.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () =>
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark")),
      setMode,
    }),
    [mode]
  );

  return <>{children(value)}</>;
}