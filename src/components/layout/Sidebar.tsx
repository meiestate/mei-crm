import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  mode: "light" | "dark";
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

  const isDark = mode === "dark";

  return (
    <aside
      style={{
        width: 250,
        minHeight: "100vh",
        background: isDark ? "#0f172a" : "#ffffff",
        borderRight: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 24,
          color: isDark ? "#f8fafc" : "#111827",
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
                background: active
                  ? isDark
                    ? "#2563eb"
                    : "#111827"
                  : "transparent",
                color: active
                  ? "#ffffff"
                  : isDark
                  ? "#cbd5e1"
                  : "#374151",
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