import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ThemeMode } from "../theme";

type Props = {
  children: ReactNode;
  title?: string;
  mode?: ThemeMode;
  onToggleTheme?: () => void;
};

export default function AppLayout({
  children,
  title,
  mode,
  onToggleTheme,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <Sidebar />

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
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}