import { Link, useLocation } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type SidebarProps = {
  mode: ThemeMode;
};

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Leads", path: "/leads" },
  { label: "Contacts", path: "/contacts" },
  { label: "Deals", path: "/deals" },
  { label: "Tasks", path: "/tasks" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar({ mode }: SidebarProps) {
  const location = useLocation();
  const colors = getTheme(mode);

  return (
    <aside
      style={{
        width: 250,
        minHeight: "100vh",
        background: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 24,
          color: colors.text,
        }}
      >
        MEI CRM
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {menuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                padding: "12px 14px",
                borderRadius: 12,
                fontWeight: 600,
                background: active ? colors.navActiveBg : "transparent",
                color: active ? colors.navActiveText : colors.navText,
                transition: "0.2s ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}