import { useLocation, useNavigate } from "react-router-dom";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type SidebarProps = {
  mode?: ThemeMode;
};

type MenuItem = {
  name: string;
  path: string;
  icon: string;
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
    items: [{ name: "Help & Support", path: "/help-support", icon: "🆘" }],
  },
];

export default function Sidebar({ mode = "light" }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getTheme(mode);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside
      style={{
        width: 270,
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        gap: 20,
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "6px 6px 2px" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: 0.4,
            color: theme.text,
            marginBottom: 6,
          }}
        >
          MEI CRM
        </div>

        <div
          style={{
            fontSize: 13,
            color: theme.subText,
            fontWeight: 500,
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
          }}
        >
          MEI CRM Core
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.5,
          }}
        >
          Manage leads, teams, pipelines, roles, and growth from one clean control panel.
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
                    onClick={() => navigate(item.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      borderRadius: 14,
                      padding: "12px 14px",
                      border: `1px solid ${
                        active ? theme.primary : "transparent"
                      }`,
                      background: active ? theme.navActiveBg : "transparent",
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

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active ? (
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
          }}
        >
          Enterprise Mode
        </div>

        <div
          style={{
            fontSize: 12,
            color: theme.subText,
            lineHeight: 1.5,
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