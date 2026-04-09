import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";
import SettingsSidebar, {
  type SettingsSidebarItem,
} from "./SettingsSidebar";

type SettingsLayoutProps = {
  mode: ThemeMode;
  title?: string;
  subtitle?: string;
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  items: SettingsSidebarItem[];
  children: ReactNode;
};

export default function SettingsLayout({
  mode,
  title = "Settings",
  subtitle = "Manage your account, workspace preferences, billing, and security controls.",
  sidebarTitle = "Settings Panel",
  sidebarSubtitle = "Navigate and manage each configuration area from one place.",
  items,
  children,
}: SettingsLayoutProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px minmax(0, 1fr)",
        gap: 24,
        width: "100%",
        alignItems: "start",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 24,
          alignSelf: "start",
        }}
      >
        <SettingsSidebar
          mode={mode}
          items={items}
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
        />
      </div>

      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: "24px 24px 20px",
            boxShadow:
              mode === "dark"
                ? "0 14px 40px rgba(0,0,0,0.28)"
                : "0 14px 40px rgba(15,23,42,0.07)",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: theme.text,
              marginBottom: 10,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.subText,
              maxWidth: 760,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 24,
            minHeight: 520,
            boxShadow:
              mode === "dark"
                ? "0 14px 40px rgba(0,0,0,0.22)"
                : "0 14px 40px rgba(15,23,42,0.06)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}