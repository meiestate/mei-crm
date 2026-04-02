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

  const pageBackground = isDark ? "#020617" : "#f3f4f6";
  const contentBackground = isDark ? "#020617" : "#f3f4f6";
  const textColor = isDark ? "#f8fafc" : "#111827";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: pageBackground,
      }}
    >
      {/* Sidebar */}
      <Sidebar mode={mode} />

      {/* Right Side */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <Topbar title={title} mode={mode} onToggleTheme={onToggleTheme} />

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: 24,
            background: contentBackground,
            color: textColor,
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