import type { ReactNode } from "react";
import Sidebar from "../../layout/Sidebar";
import Topbar from "../../layout/Topbar";
import { getTheme, type ThemeMode } from "../../theme";

type DashboardLayoutProps = {
  children: ReactNode;
  mode: ThemeMode;
  title?: string;
  onToggleTheme?: () => void;
};

export default function DashboardLayout({
  children,
  mode,
  title = "Dashboard",
  onToggleTheme,
}: DashboardLayoutProps) {
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
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background: theme.pageBg,
        }}
      >
        <Topbar
          mode={mode}
          title={title}
          onToggleTheme={onToggleTheme}
        />

        <main
          style={{
            flex: 1,
            padding: 24,
            overflowY: "auto",
            background: theme.pageBg,
          }}
        >
          <div
            style={{
              maxWidth: 1600,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}