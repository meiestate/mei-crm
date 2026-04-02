import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

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

function LeadsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", padding: 24 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 24, borderBottom: "1px solid #e5e7eb" }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>Leads</h1>
          <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
            Basic CRM leads list is working.
          </p>
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
            <div style={{ background: "#eff6ff", padding: 16, borderRadius: 14 }}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Total Leads</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{leads.length}</div>
            </div>
            <div style={{ background: "#fef3c7", padding: 16, borderRadius: 14 }}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Contacted</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Contacted").length}
              </div>
            </div>
            <div style={{ background: "#ede9fe", padding: 16, borderRadius: 14 }}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Qualified</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Qualified").length}
              </div>
            </div>
            <div style={{ background: "#dcfce7", padding: 16, borderRadius: 14 }}>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Closed</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {leads.filter((lead) => lead.status === "Closed").length}
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>City</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={tdStyle}>{lead.id}</td>
                    <td style={tdStyle}>{lead.name}</td>
                    <td style={tdStyle}>{lead.phone}</td>
                    <td style={tdStyle}>{lead.source}</td>
                    <td style={tdStyle}>{lead.city}</td>
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
                          background: "#111827",
                          color: "#fff",
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

function LeadDetailPage() {
  const { id } = useParams();
  const lead = leads.find((item) => item.id === Number(id));

  if (!lead) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lead not found</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", padding: 24 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0 }}>{lead.name}</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <DetailCard label="Lead ID" value={String(lead.id)} />
          <DetailCard label="Phone" value={lead.phone} />
          <DetailCard label="Source" value={lead.source} />
          <DetailCard label="City" value={lead.city} />
          <DetailCard label="Status" value={lead.status} />
        </div>

        <div style={{ marginTop: 24 }}>
          <a
            href="/leads"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: "#111827",
              color: "#fff",
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

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        background: "#fafafa",
      }}
    >
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: 14,
  fontSize: 14,
  color: "#6b7280",
};

const tdStyle: React.CSSProperties = {
  padding: 14,
  fontSize: 15,
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}