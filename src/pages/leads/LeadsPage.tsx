import AppLayout from "../../components/layout/AppLayout";

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
  const isDark = mode === "dark";

  const cardBg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#334155" : "#e5e7eb";
  const text = isDark ? "#f8fafc" : "#111827";
  const subText = isDark ? "#94a3b8" : "#6b7280";
  const softBg = isDark ? "#1e293b" : "#f9fafb";
  const inputBg = isDark ? "#0f172a" : "#ffffff";

  return (
    <AppLayout title="Leads" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, color: text }}>Lead Management</h2>
          <p style={{ margin: "8px 0 0", color: subText }}>
            Track every lead, follow-up, and conversion in one place.
          </p>
        </div>

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
                borderRadius: 18,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 14, color: subText }}>{item.label}</div>
              <div style={{ marginTop: 8, fontSize: 32, fontWeight: 800, color: text }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 18,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <input
                type="text"
                placeholder="Search lead name, phone, city..."
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: text,
                  outline: "none",
                  fontSize: 14,
                }}
              />
            </div>

            <button
              style={{
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Add Lead
            </button>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {["All", "New", "Contacted", "Qualified", "Closed"].map((item, index) => (
              <button
                key={item}
                style={{
                  border: `1px solid ${border}`,
                  background: index === 0 ? "#2563eb" : softBg,
                  color: index === 0 ? "#ffffff" : text,
                  padding: "10px 14px",
                  borderRadius: 999,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 18,
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
                All lead records are listed below.
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: softBg, textAlign: "left" }}>
                  <th style={thStyle(subText)}>ID</th>
                  <th style={thStyle(subText)}>Name</th>
                  <th style={thStyle(subText)}>Phone</th>
                  <th style={thStyle(subText)}>Source</th>
                  <th style={thStyle(subText)}>City</th>
                  <th style={thStyle(subText)}>Status</th>
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
                          display: "inline-block",
                          background: getStatusColor(lead.status),
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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