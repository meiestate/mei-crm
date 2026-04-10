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

export default function Sidebar({
  mode = "light",
  onNavigate,
}: SidebarProps) {
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
      <div style={{ padding: "6px 8px 2px" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: 0.4,
            color: theme.text,
            marginBottom: 6,
            lineHeight: 1.1,
          }}
        >
          MEI CRM
        </div>

        <div
          style={{
            fontSize: 13,
            color: theme.subText ?? theme.mutedText,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          Business OS
        </div>
      </div>

      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 14,
          boxShadow:
            mode === "dark"
              ? "0 10px 24px rgba(0,0,0,0.22)"
              : "0 10px 24px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: theme.mutedText,
            marginBottom: 6,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Workspace
        </div>

        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 4,
            lineHeight: 1.35,
          }}
        >
          MEI CRM Core
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.55,
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
                        fontSize: 16,
                        flexShrink: 0,
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
                          padding: "0 6px",
                          borderRadius: 999,
                          background: active ? theme.primary : "#ef4444",
                          color: "#ffffff",
                          fontSize: 11,
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : active ? (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: theme.primary,
                          flexShrink: 0,
                        }}
                      />
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
          marginTop: "auto",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 6,
            lineHeight: 1.4,
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

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 999,
            background: theme.cardBgSoft,
            border: `1px solid ${theme.border}`,
            fontSize: 12,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          <span>●</span>
          <span>{mode === "dark" ? "Dark Theme" : "Light Theme"}</span>
        </div>
      </div>
    </aside>
  );
}