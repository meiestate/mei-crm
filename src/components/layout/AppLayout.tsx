import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppLayoutProps = {
  title: string;
  mode: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
};

export default function AppLayout({
  title,
  mode,
  onToggleTheme,
  children,
}: AppLayoutProps) {
  const isDark = mode === "dark";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: isDark ? "#020617" : "#f3f4f6",
      }}
    >
      <Sidebar mode={mode} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title={title} mode={mode} onToggleTheme={onToggleTheme} />

        <main
          style={{
            flex: 1,
            padding: 24,
            background: isDark ? "#020617" : "#f3f4f6",
            color: isDark ? "#f8fafc" : "#111827",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}