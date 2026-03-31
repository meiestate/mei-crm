import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Leads", path: "/leads" },
  { name: "Contacts", path: "/contacts" },
  { name: "Deals", path: "/deals" },
  { name: "Tasks", path: "/tasks" },
  { name: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        borderRight: "1px solid #1f2937",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#f8fafc",
            marginBottom: "6px",
          }}
        >
          MEI
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          Business OS
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                background: active ? "#1e293b" : "transparent",
                color: active ? "#ffffff" : "#cbd5e1",
                border: "1px solid " + (active ? "#334155" : "transparent"),
                borderRadius: "12px",
                padding: "12px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "6px" }}>Workspace</div>
        <div style={{ fontSize: "13px", color: "#94a3b8" }}>MEI CRM Core</div>
      </div>
    </aside>
  );
}