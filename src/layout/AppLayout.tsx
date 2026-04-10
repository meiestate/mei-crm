import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ThemeMode } from "../theme";
import { getTheme } from "../theme";
import useResponsive from "../hooks/useResponsive";

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
  const { isMobile, isTablet, width } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarWidth = 260;
  const mobileDrawerWidth =
    typeof width === "number" ? Math.min(280, width - 40) : 280;

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: theme.pageBg,
        color: theme.text,
        position: "relative",
      }}
    >
      {!isMobile && (
        <div
          style={{
            width: sidebarWidth,
            flexShrink: 0,
            borderRight: `1px solid ${theme.border}`,
            background: theme.sidebarBg ?? theme.cardBg ?? theme.pageBg,
          }}
        >
          <Sidebar mode={mode} />
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: theme.pageBg,
        }}
      >
        <Topbar
          title={title}
          mode={mode}
          onToggleTheme={onToggleTheme}
          onOpenSidebar={isMobile ? handleOpenSidebar : undefined}
          isMobile={isMobile}
        />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: theme.pageBg,
            padding: isMobile ? 12 : isTablet ? 16 : 20,
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>

      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={handleCloseSidebar}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              zIndex: 90,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: mobileDrawerWidth,
              background: theme.sidebarBg ?? theme.cardBg ?? theme.pageBg,
              borderRight: `1px solid ${theme.border}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.28)",
              zIndex: 100,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: 12,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <button
                type="button"
                onClick={handleCloseSidebar}
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBg ?? theme.pageBg,
                  color: theme.text,
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
                aria-label="Close sidebar"
              >
                ×
              </button>
            </div>

            <Sidebar mode={mode} onNavigate={handleCloseSidebar} />
          </div>
        </>
      )}
    </div>
  );
}