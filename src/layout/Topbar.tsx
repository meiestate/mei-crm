import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/leads": "Leads",
    "/contacts": "Contacts",
    "/deals": "Deals",
    "/tasks": "Tasks",
    "/calls": "Call Logs",
    "/help-support": "Help & Support",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  function handleAddLeadClick() {
    navigate("/leads", { state: { openAddLeadForm: true } });
  }

  function handleHelpSupportClick() {
    navigate("/help-support");
  }

  function handleSupportTicketClick() {
    navigate("/help-support", {
      state: { openRaiseTicketForm: true },
    });
  }

  return (
    <header
      style={{
        height: "72px",
        borderBottom: "1px solid #1f2937",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        gap: "16px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          {pageTitle}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "2px",
          }}
        >
          Welcome back to MEI Business OS
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <input
          placeholder="Search..."
          style={{
            width: "240px",
            background: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "10px 14px",
            outline: "none",
          }}
        />

        <button
          onClick={handleHelpSupportClick}
          style={{
            background: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "10px 14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "15px" }}>🛟</span>
          <span>Help</span>
        </button>

        <button
          onClick={handleSupportTicketClick}
          style={{
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
            borderRadius: "999px",
            padding: "10px 14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>Support</span>
          <span
            style={{
              minWidth: "22px",
              height: "22px",
              borderRadius: "999px",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
              lineHeight: 1,
            }}
          >
            2
          </span>
        </button>

        <button
          onClick={handleAddLeadClick}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Lead
        </button>
      </div>
    </header>
  );
}