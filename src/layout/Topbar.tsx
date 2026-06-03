import { useNavigate, useLocation } from "react-router-dom";
import type { ThemeMode } from "../theme";
import { getTheme } from "../theme";

type TopbarProps = {
  title?: string;
  mode?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSidebar?: () => void;
  isMobile?: boolean;
};

export default function Topbar({
  title,
  mode = "light",
  onToggleTheme,
  onOpenSidebar,
  isMobile = false,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getTheme(mode);

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/leads": "Leads",
    "/leads/add": "Add Lead",
    "/leads/new": "Add Lead",
    "/contacts": "Contacts",
    "/deals": "Deals",
    "/tasks": "Tasks",
    "/calls": "Call Logs",
    "/help-support": "Help & Support",
    "/settings": "Settings",
    "/settings/billing": "Billing & Subscription",
    "/settings/roles": "Roles & Permissions",
    "/settings/users": "Users",
    "/pipelines": "Pipelines",
  };

  const matchedPath =
    Object.keys(pageTitles)
      .sort((a, b) => b.length - a.length)
      .find(
        (path) =>
          location.pathname === path ||
          location.pathname.startsWith(path + "/"),
      ) || "/dashboard";

  const pageTitle = title || pageTitles[matchedPath] || "Dashboard";

  function handleAddLeadClick() {
    navigate("/leads/add");
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
        minHeight: isMobile ? "auto" : "72px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.topbarBg ?? theme.cardBg ?? theme.pageBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "12px" : "0 24px",
        gap: "16px",
        boxSizing: "border-box",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          minWidth: 0,
          padding: isMobile ? "0" : "12px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          flex: isMobile ? "1 1 100%" : "0 1 auto",
        }}
      >
        {isMobile && onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: theme.cardBg ?? theme.pageBg,
              color: theme.text,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        ) : null}

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 700,
              color: theme.text,
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {pageTitle}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: theme.subText ?? theme.mutedText ?? "#94a3b8",
              marginTop: "4px",
            }}
          >
            Welcome back to MEI Business OS
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: isMobile ? "stretch" : "flex-end",
          padding: isMobile ? "0" : "12px 0",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <input
          placeholder="Search..."
          style={{
            width: isMobile ? "100%" : "240px",
            maxWidth: "100%",
            background: theme.inputBg ?? theme.cardBg ?? theme.pageBg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            padding: "10px 14px",
            outline: "none",
            boxSizing: "border-box",
            minHeight: 42,
          }}
        />

        {mode && onToggleTheme ? (
          <button
            type="button"
            onClick={handleThemeToggle}
            style={{
              background: theme.cardBg ?? theme.pageBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: "12px",
              padding: "10px 14px",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: 42,
              width: isMobile ? "calc(50% - 6px)" : "auto",
            }}
          >
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleHelpSupportClick}
          style={{
            background: theme.cardBg ?? theme.pageBg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            padding: "10px 14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            minHeight: 42,
            width: isMobile ? "calc(50% - 6px)" : "auto",
          }}
        >
          <span style={{ fontSize: "15px" }}>🛟</span>
          <span>Help</span>
        </button>

        <button
          type="button"
          onClick={handleSupportTicketClick}
          style={{
            background: theme.sectionBg ?? theme.cardBg ?? theme.pageBg,
            color: theme.text,
            border: `1px solid ${theme.borderStrong ?? theme.border}`,
            borderRadius: "999px",
            padding: "10px 14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            minHeight: 42,
            width: isMobile ? "calc(50% - 6px)" : "auto",
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
            background: theme.primary,
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
            minHeight: 42,
            width: isMobile ? "100%" : "auto",
          }}
        >
          + Add Lead
        </button>
      </div>
    </header>
  );
}