import { useMemo } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

export type SettingsSidebarItem = {
  key: string;
  label: string;
  description?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
};

type SettingsSidebarProps = {
  mode: ThemeMode;
  items: SettingsSidebarItem[];
  title?: string;
  subtitle?: string;
};

export default function SettingsSidebar({
  mode,
  items,
  title = "Settings",
  subtitle = "Manage your workspace preferences and account controls.",
}: SettingsSidebarProps) {
  const theme = getTheme(mode);

  const activeItem = useMemo(
    () => items.find((item) => item.active),
    [items]
  );

  return (
    <aside
      style={{
        width: 320,
        minWidth: 280,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.30)"
            : "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div
        style={{
          paddingBottom: 14,
          borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: theme.text,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((item) => {
          const isActive = !!item.active;

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              style={{
                width: "100%",
                textAlign: "left",
                border: `1px solid ${
                  isActive
                    ? theme.primary
                    : theme.borderSoft ?? theme.border
                }`,
                background: isActive
                  ? mode === "dark"
                    ? "rgba(59,130,246,0.14)"
                    : "rgba(37,99,235,0.08)"
                  : theme.cardBgSoft ?? theme.cardBg,
                borderRadius: 16,
                padding: "14px 14px",
                cursor: item.onClick ? "pointer" : "default",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: isActive ? theme.primary : theme.text,
                    lineHeight: 1.3,
                  }}
                >
                  {item.label}
                </div>

                {item.description && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: theme.subText,
                    }}
                  >
                    {item.description}
                  </div>
                )}
              </div>

              {item.badge !== undefined && item.badge !== null && (
                <div
                  style={{
                    flexShrink: 0,
                    minWidth: 24,
                    height: 24,
                    padding: "0 8px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: isActive ? "#ffffff" : theme.primary,
                    background: isActive
                      ? theme.primary
                      : mode === "dark"
                      ? "rgba(59,130,246,0.12)"
                      : "rgba(37,99,235,0.10)",
                  }}
                >
                  {item.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {activeItem && (
        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: `1px solid ${theme.borderSoft ?? theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: theme.mutedText,
              marginBottom: 4,
            }}
          >
            Currently viewing
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            {activeItem.label}
          </div>

          {activeItem.description && (
            <div
              style={{
                marginTop: 4,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: theme.subText,
              }}
            >
              {activeItem.description}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}