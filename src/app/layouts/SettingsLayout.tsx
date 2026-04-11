import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTheme, type ThemeMode } from "../../theme";

export type SettingsSidebarItem = {
  key: string;
  label: string;
  description?: string;
  path: string;
  disabled?: boolean;
};

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
  const location = useLocation();
  const navigate = useNavigate();

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
      <aside
        style={{
          position: "sticky",
          top: 24,
          borderRadius: 24,
          border: `1px solid ${theme.border}`,
          background: theme.cardBg,
          boxShadow:
            mode === "dark"
              ? "0 18px 40px rgba(0,0,0,0.28)"
              : "0 18px 40px rgba(15,23,42,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
            background:
              mode === "dark"
                ? "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(99,102,241,0.08))"
                : "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            {sidebarTitle}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.subText,
            }}
          >
            {sidebarSubtitle}
          </div>
        </div>

        <div
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {items.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    navigate(item.path);
                  }
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderRadius: 18,
                  padding: "14px 16px",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  border: `1px solid ${
                    isActive
                      ? theme.primary
                      : theme.borderSoft ?? theme.border
                  }`,
                  background: isActive
                    ? mode === "dark"
                      ? "rgba(59,130,246,0.14)"
                      : "rgba(37,99,235,0.08)"
                    : theme.cardBg,
                  opacity: item.disabled ? 0.55 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: isActive ? theme.primary : theme.text,
                    marginBottom: item.description ? 4 : 0,
                  }}
                >
                  {item.label}
                </div>

                {item.description ? (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: theme.subText,
                    }}
                  >
                    {item.description}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>

      <section
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            padding: 24,
            boxShadow:
              mode === "dark"
                ? "0 18px 40px rgba(0,0,0,0.22)"
                : "0 18px 40px rgba(15,23,42,0.06)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 15,
              lineHeight: 1.75,
              color: theme.subText,
              maxWidth: 760,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >
          {children}
        </div>
      </section>
    </div>
  );
}