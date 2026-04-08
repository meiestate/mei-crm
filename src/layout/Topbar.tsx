import { useNavigate, useLocation } from "react-router-dom";
import type { ThemeMode } from "../theme";

type TopbarProps = {
  title?: string;
  mode?: ThemeMode;
  onToggleTheme?: () => void;
};

export default function Topbar({
  title,
  mode,
  onToggleTheme,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/leads": "Leads",
    "/contacts": "Contacts",
    "/deals": "Deals",
    "/tasks": "Tasks",
    "/calls": "Call Logs",
    "/help-support": "Help & Support",
    "/settings": "Settings",
    "/settings/billing": "Billing & Subscription",
  };

  const matchedPath =
    Object.keys(pageTitles)
      .sort((a, b) => b.length - a.length)
      .find(
        (path) =>
          location.pathname === path ||
          location.pathname.startsWith(path + "/")
      ) || "/dashboard";

  const pageTitle = title || pageTitles[matchedPath] || "Dashboard";

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

  function handleThemeToggle() {
    if (onToggleTheme) {
      onToggleTheme();
    }
  }

  return (
    <header
      style={{
        minHeight: "72px",
        borderBottom: "1px solid #1f2937",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        gap: "16px",
        boxSizing: "border-box",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          minWidth: 0,
          padding: "12px 0",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "4px",
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
          padding: "12px 0",
        }}
      >
        <input
          placeholder="Search..."
          style={{
            width: "240px",
            maxWidth: "100%",
            background: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "10px 14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {mode && onToggleTheme ? (
          <button
            type="button"
            onClick={handleThemeToggle}
            style={{
              background: "#111827",
              color: "#e5e7eb",
              border: "1px solid #374151",
              borderRadius: "12px",
              padding: "10px 14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        ) : null}

        <button
          type="button"
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
          type="button"
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
          type="button"
          onClick={handleAddLeadClick}
          style={{
            background: "#2563eb",
            color: "#ffffff",
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