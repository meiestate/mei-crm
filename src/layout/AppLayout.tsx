import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ThemeMode } from "../theme";
import { getTheme } from "../theme";

type Props = {
  children: ReactNode;
  title?: string;
  mode?: ThemeMode;
  onToggleTheme?: () => void;
};

export default function AppLayout({
  children,
  title,
  mode = "light",
  onToggleTheme,
}: Props) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: theme.pageBg,
      }}
    >
      <Sidebar mode={mode} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: theme.pageBg,
        }}
      >
        <Topbar title={title} mode={mode} onToggleTheme={onToggleTheme} />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: theme.pageBg,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}