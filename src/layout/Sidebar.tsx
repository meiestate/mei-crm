import { useLocation, useNavigate } from "react-router-dom";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type SidebarProps = {
  mode?: ThemeMode;
  onNavigate?: () => void;
};

type MenuItem = {
  name: string;
  path: string;
  icon: string;
  badge?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: "🏠" },
      { name: "Leads", path: "/leads", icon: "🎯" },
      { name: "Contacts", path: "/contacts", icon: "👥" },
      { name: "Deals", path: "/deals", icon: "💼" },
      { name: "Pipelines", path: "/pipelines", icon: "📊" },
      { name: "Tasks", path: "/tasks", icon: "✅" },
      { name: "Call Logs", path: "/calls", icon: "📞" },
    ],
  },
  {
    title: "Administration",
    items: [
      { name: "Users", path: "/settings/users", icon: "🧑‍💼" },
      { name: "Roles", path: "/settings/roles", icon: "🛡️" },
      { name: "Settings", path: "/settings", icon: "⚙️" },
      {
        name: "Billing & Subscription",
        path: "/settings/billing",
        icon: "💳",
      },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Help & Support", path: "/help-support", icon: "🆘", badge: "2" },
    ],
  },
];

export default function Sidebar({ mode = "light", onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getTheme(mode);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside
      style={{
        width: "100%",
        minHeight: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
        gap: 18,
        background: theme.sidebarBg ?? theme.cardBg ?? theme.pageBg,
        color: theme.text,
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 16,
          boxShadow:
            mode === "dark"
              ? "0 10px 24px rgba(0,0,0,0.22)"
              : "0 10px 24px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: theme.primary,
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            ⚡
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 23,
                fontWeight: 900,
                letterSpacing: 0.3,
                color: theme.text,
                lineHeight: 1.1,
              }}
            >
              MEI CRM
            </div>

            <div
              style={{
                fontSize: 12,
                color: theme.subText ?? theme.mutedText,
                fontWeight: 600,
                lineHeight: 1.5,
                marginTop: 3,
              }}
            >
              Business OS
            </div>
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: theme.border,
            margin: "12px 0",
          }}
        />

        <div
          style={{
            fontSize: 11,
            color: theme.mutedText,
            marginBottom: 6,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 0.9,
          }}
        >
          Workspace
        </div>

        <div
          style={{
            fontSize: 15,
            fontWeight: 900,
            color: theme.text,
            marginBottom: 6,
            lineHeight: 1.35,
          }}
        >
          MEI CRM Core
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.6,
          }}
        >
          Manage leads, teams, pipelines, roles, and growth from one clean
          control panel.
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          flex: 1,
          overflowY: "auto",
          paddingRight: 2,
        }}
      >
        {menuSections.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: theme.mutedText,
                textTransform: "uppercase",
                letterSpacing: 0.9,
                marginBottom: 10,
                padding: "0 10px",
              }}
            >
              {section.title}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {section.items.map((item) => {
                const active = isActive(item.path);

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      borderRadius: 14,
                      padding: "12px 14px",
                      minHeight: 46,
                      border: `1px solid ${
                        active
                          ? theme.primary
                          : theme.borderSoft ?? "transparent"
                      }`,
                      background: active
                        ? theme.navActiveBg
                        : theme.cardBgSoft ?? "transparent",
                      color: active ? theme.navActiveText : theme.navText,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: active ? 800 : 600,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 16,
                      }}
                    >
                      {item.icon}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </span>

                    {item.badge ? (
                      <span
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: 999,
                          background: "#ef4444",
                          color: "#ffffff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "0 6px",
                          flexShrink: 0,
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 14,
          boxShadow:
            mode === "dark"
              ? "0 10px 24px rgba(0,0,0,0.18)"
              : "0 10px 24px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 900,
            color: theme.text,
            marginBottom: 6,
          }}
        >
          Enterprise Mode
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.55,
            marginBottom: 12,
          }}
        >
          Structured access, cleaner workflows, sharper control.
        </div>

        <button
          type="button"
          onClick={() => handleNavigate("/settings")}
          style={{
            border: `1px solid ${theme.border}`,
            background: theme.cardBgSoft ?? theme.pageBg,
            color: theme.text,
            borderRadius: 999,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ⚙ Manage CRM
        </button>
      </div>
    </aside>
  );
}