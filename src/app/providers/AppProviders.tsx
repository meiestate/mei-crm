import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeMode } from "../../theme";

export const THEME_STORAGE_KEY = "mei-crm-theme";

type AppProvidersRenderProps = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

type AppProvidersProps = {
  children: (props: AppProvidersRenderProps) => ReactNode;
};

function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

export default function AppProviders({ children }: AppProvidersProps) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);
    document.body.style.background = mode === "dark" ? "#020617" : "#f8fafc";
    document.body.style.margin = "0";
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (savedMode === "light" || savedMode === "dark") {
        return;
      }

      setModeState(event.matches ? "dark" : "light");
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  const value = useMemo<AppProvidersRenderProps>(
    () => ({
      mode,
      toggleTheme: () => {
        setModeState((prevMode) => (prevMode === "dark" ? "light" : "dark"));
      },
      setMode: (nextMode: ThemeMode) => {
        setModeState(nextMode);
      },
    }),
    [mode],
  );

  return <>{children(value)}</>;
}