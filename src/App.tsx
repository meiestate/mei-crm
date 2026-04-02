import React, { useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

type ThemeMode = "light" | "dark";

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  city: string;
};

const leads: Lead[] = [
  { id: 1, name: "Arun Kumar", phone: "9876543210", source: "WhatsApp", status: "New", city: "Chennai" },
  { id: 2, name: "Priya", phone: "9123456780", source: "Facebook", status: "Contacted", city: "Bangalore" },
  { id: 3, name: "Rahul", phone: "9000012345", source: "Reference", status: "Qualified", city: "Coimbatore" },
  { id: 4, name: "Meena", phone: "9090909090", source: "Website", status: "Closed", city: "Madurai" },
];

function getStatusColor(status: Lead["status"]) {
  switch (status) {
    case "New":
      return "#2563eb";
    case "Contacted":
      return "#f59e0b";
    case "Qualified":
      return "#7c3aed";
    case "Closed":
      return "#16a34a";
    default:
      return "#6b7280";
  }
}

function getTheme(mode: ThemeMode) {
  if (mode === "dark") {
    return {
      pageBg: "#0f172a",
      panelBg: "#162033",
      cardBg: "#1e293b",
      softCard1: "#172554",
      softCard2: "#3f2d0a",
      softCard3: "#2e1065",
      softCard4: "#052e16",
      text: "#f8fafc",
      subText: "#94a3b8",
      border: "#334155",
      tableHead: "#1e293b",
      buttonBg: "#2563eb",
      buttonText: "#ffffff",
      inputBg: "#0f172a",
    };
  }

  return {
    pageBg: "#f5f7fb",
    panelBg: "#ffffff",
    cardBg: "#fafafa",
    softCard1: "#eff6ff",
    softCard2: "#fef3c7",
    softCard3: "#ede9fe",
    softCard4: "#dcfce7",
    text: "#111827",
    subText: "#6b7280",
    border: "#e5e7eb",
    tableHead: "#f9fafb",
    buttonBg: "#111827",
    buttonText: "#ffffff",
    inputBg: "#ffffff",
  };
}

function ThemeToggle({
  mode,
  onToggle,
}: {
  mode: ThemeMode;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        border: "none",
        background: mode === "dark" ? "#f8fafc" : "#111827",
        color: mode === "dark" ? "#111827" : "#ffffff",
        padding: "10px 16px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {mode === "light" ? "Dark Navy Mode" : "Light Mode"}
    </button>
  );
}

function LeadsPage({
  mode,
  onToggleTheme,
}: {
  mode: ThemeMode;
  onToggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, padding: 24 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: theme.panelBg,
          borderRadius: 16,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: theme.text }}>Leads</h1>
            <p style={{ margin: "8px 0 0", color: theme.subText }}>
              Basic CRM leads list with light and dark background mode.
            </p>
          </div>

          <ThemeToggle mode={mode} onToggle={onToggleTheme} />
        </div>

        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={statCardStyle(theme.softCard1, theme.text, theme.subText)}>
              <div style={{ color: theme.subText, fontSize: 14 }}>Total Leads</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{leads.length}</div>
            </div>

            <div style={statCardStyle(theme.softCard2, theme.text, theme.subText)}>
              <div style={{ color: theme.subText, fontSize: 14 }}>Contacted</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Contacted").length}
              </div>
            </div>

            <div style={statCardStyle(theme.softCard3, theme.text, theme.subText)}>
              <div style={{ color: theme.subText, fontSize: 14 }}>Qualified</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Qualified").length}
              </div>
            </div>

            <div style={statCardStyle(theme.softCard4, theme.text, theme.subText)}>
              <div style={{ color: theme.subText, fontSize: 14 }}>Closed</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Closed").length}
              </div>
            </div>
          </div>

          <div
            style={{
              overflowX: "auto",
              border: `1px solid ${theme.border}`,
              borderRadius: 14,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.tableHead, textAlign: "left" }}>
                  <th style={{ ...thStyle, color: theme.subText }}>ID</th>
                  <th style={{ ...thStyle, color: theme.subText }}>Name</th>
                  <th style={{ ...thStyle, color: theme.subText }}>Phone</th>
                  <th style={{ ...thStyle, color: theme.subText }}>Source</th>
                  <th style={{ ...thStyle, color: theme.subText }}>City</th>
                  <th style={{ ...thStyle, color: theme.subText }}>Status</th>
                  <th style={{ ...thStyle, color: theme.subText }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      background: theme.panelBg,
                    }}
                  >
                    <td style={{ ...tdStyle, color: theme.text }}>{lead.id}</td>
                    <td style={{ ...tdStyle, color: theme.text }}>{lead.name}</td>
                    <td style={{ ...tdStyle, color: theme.text }}>{lead.phone}</td>
                    <td style={{ ...tdStyle, color: theme.text }}>{lead.source}</td>
                    <td style={{ ...tdStyle, color: theme.text }}>{lead.city}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                          background: getStatusColor(lead.status),
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{
                          border: "none",
                          background: theme.buttonBg,
                          color: theme.buttonText,
                          padding: "10px 14px",
                          borderRadius: 10,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadDetailPage({
  mode,
  onToggleTheme,
}: {
  mode: ThemeMode;
  onToggleTheme: () => void;
}) {
  const { id } = useParams();
  const lead = leads.find((item) => item.id === Number(id));
  const theme = useMemo(() => getTheme(mode), [mode]);

  if (!lead) {
    return (
      <div style={{ minHeight: "100vh", background: theme.pageBg, padding: 24 }}>
        <div style={{ color: theme.text }}>Lead not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, padding: 24 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: theme.panelBg,
          borderRadius: 16,
          boxShadow:
            mode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.35)"
              : "0 10px 30px rgba(0,0,0,0.08)",
          padding: 24,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <h1 style={{ margin: 0, color: theme.text }}>{lead.name}</h1>
          <ThemeToggle mode={mode} onToggle={onToggleTheme} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <DetailCard theme={theme} label="Lead ID" value={String(lead.id)} />
          <DetailCard theme={theme} label="Phone" value={lead.phone} />
          <DetailCard theme={theme} label="Source" value={lead.source} />
          <DetailCard theme={theme} label="City" value={lead.city} />
          <DetailCard theme={theme} label="Status" value={lead.status} />
        </div>

        <div style={{ marginTop: 24 }}>
          <a
            href="/leads"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: theme.buttonBg,
              color: theme.buttonText,
              padding: "12px 16px",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Back to Leads
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  theme,
  label,
  value,
}: {
  theme: ReturnType<typeof getTheme>;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: 16,
        background: theme.cardBg,
      }}
    >
      <div style={{ color: theme.subText, fontSize: 14, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>
        {value}
      </div>
    </div>
  );
}

function statCardStyle(background: string, color: string, subText: string): React.CSSProperties {
  return {
    background,
    padding: 16,
    borderRadius: 14,
    color,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  };
}

const thStyle: React.CSSProperties = {
  padding: 14,
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: 14,
  fontSize: 15,
};

export default function App() {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/leads" replace />}
        />
        <Route
          path="/leads"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />
        <Route
          path="/leads/:id"
          element={<LeadDetailPage mode={mode} onToggleTheme={toggleTheme} />}
        />
      </Routes>
    </BrowserRouter>
  );
}