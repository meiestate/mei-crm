import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getTheme, ThemeMode } from "../../theme";

type AppLayoutProps = {
  title: string;
  mode: ThemeMode;
  onToggleTheme: () => void;
  children: ReactNode;
};

export default function AppLayout({
  title,
  mode,
  onToggleTheme,
  children,
}: AppLayoutProps) {
  const colors = getTheme(mode);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.pageBg,
      }}
    >
      <Sidebar mode={mode} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar title={title} mode={mode} onToggleTheme={onToggleTheme} />

        <main
          style={{
            flex: 1,
            padding: 24,
            background: colors.pageBg,
            color: colors.text,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}