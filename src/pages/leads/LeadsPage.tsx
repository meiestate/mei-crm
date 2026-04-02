import AppLayout from "../../components/layout/AppLayout";
import { useNavigate } from "react-router-dom";

type LeadsPageProps = {
  mode: "light" | "dark";
  onToggleTheme: () => void;
};

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  city: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
};

const leads: Lead[] = [
  { id: 1, name: "Arun Kumar", phone: "9876543210", source: "WhatsApp", city: "Chennai", status: "New" },
  { id: 2, name: "Priya", phone: "9123456780", source: "Facebook", city: "Bangalore", status: "Contacted" },
  { id: 3, name: "Rahul", phone: "9000012345", source: "Website", city: "Coimbatore", status: "Qualified" },
  { id: 4, name: "Meena", phone: "9090909090", source: "Reference", city: "Madurai", status: "Closed" },
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

export default function LeadsPage({ mode, onToggleTheme }: LeadsPageProps) {
  const navigate = useNavigate();
  const isDark = mode === "dark";

  const cardBg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#334155" : "#e5e7eb";
  const text = isDark ? "#f8fafc" : "#111827";
  const subText = isDark ? "#94a3b8" : "#6b7280";
  const softBg = isDark ? "#1e293b" : "#f9fafb";

  return (
    <AppLayout title="Leads" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "Total Leads", value: leads.length },
            { label: "New Leads", value: leads.filter((l) => l.status === "New").length },
            { label: "Qualified", value: leads.filter((l) => l.status === "Qualified").length },
            { label: "Closed", value: leads.filter((l) => l.status === "Closed").length },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ color: subText, fontSize: 14 }}>{item.label}</div>
              <div style={{ color: text, fontSize: 32, fontWeight: 800, marginTop: 8 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 20,
              borderBottom: `1px solid ${border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: text }}>Leads Table</div>
              <div style={{ fontSize: 14, color: subText, marginTop: 4 }}>
                View and manage all incoming leads.
              </div>
            </div>

            <button
              style={{
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Add Lead
            </button>
          </div>

          <div style={{ padding: 20 }}>
            <div
              style={{
                marginBottom: 16,
                padding: 14,
                borderRadius: 12,
                background: softBg,
                color: subText,
                border: `1px solid ${border}`,
              }}
            >
              Search / Filters section வரும் next step ல.
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={thStyle(subText)}>ID</th>
                    <th style={thStyle(subText)}>Name</th>
                    <th style={thStyle(subText)}>Phone</th>
                    <th style={thStyle(subText)}>Source</th>
                    <th style={thStyle(subText)}>City</th>
                    <th style={thStyle(subText)}>Status</th>
                    <th style={thStyle(subText)}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderTop: `1px solid ${border}` }}>
                      <td style={tdStyle(text)}>{lead.id}</td>
                      <td style={tdStyle(text)}>{lead.name}</td>
                      <td style={tdStyle(text)}>{lead.phone}</td>
                      <td style={tdStyle(text)}>{lead.source}</td>
                      <td style={tdStyle(text)}>{lead.city}</td>
                      <td style={tdStyle(text)}>
                        <span
                          style={{
                            background: getStatusColor(lead.status),
                            color: "#ffffff",
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            display: "inline-block",
                          }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td style={tdStyle(text)}>
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          style={{
                            border: "none",
                            background: "#111827",
                            color: "#ffffff",
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontWeight: 700,
                            cursor: "pointer",
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
    </AppLayout>
  );
}

function thStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 13,
    color,
    fontWeight: 700,
  };
}

function tdStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 15,
    color,
  };
}