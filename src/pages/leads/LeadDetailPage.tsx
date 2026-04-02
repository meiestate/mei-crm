import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

type LeadDetailPageProps = {
  mode: "light" | "dark";
  onToggleTheme: () => void;
};

const leads = [
  { id: 1, name: "Arun Kumar", phone: "9876543210", source: "WhatsApp", city: "Chennai", status: "New" },
  { id: 2, name: "Priya", phone: "9123456780", source: "Facebook", city: "Bangalore", status: "Contacted" },
  { id: 3, name: "Rahul", phone: "9000012345", source: "Website", city: "Coimbatore", status: "Qualified" },
  { id: 4, name: "Meena", phone: "9090909090", source: "Reference", city: "Madurai", status: "Closed" },
];

export default function LeadDetailPage({
  mode,
  onToggleTheme,
}: LeadDetailPageProps) {
  const { id } = useParams();
  const lead = leads.find((item) => item.id === Number(id));
  const isDark = mode === "dark";

  const cardBg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#334155" : "#e5e7eb";
  const text = isDark ? "#f8fafc" : "#111827";
  const subText = isDark ? "#94a3b8" : "#6b7280";

  if (!lead) {
    return (
      <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
        <div style={{ color: text }}>Lead not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
      <div
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: 24,
          maxWidth: 900,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 30, color: text }}>{lead.name}</h2>
          <p style={{ margin: "8px 0 0", color: subText }}>
            Lead full profile overview
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <DetailBox label="Lead ID" value={String(lead.id)} text={text} subText={subText} border={border} />
          <DetailBox label="Phone" value={lead.phone} text={text} subText={subText} border={border} />
          <DetailBox label="Source" value={lead.source} text={text} subText={subText} border={border} />
          <DetailBox label="City" value={lead.city} text={text} subText={subText} border={border} />
          <DetailBox label="Status" value={lead.status} text={text} subText={subText} border={border} />
        </div>

        <div style={{ marginTop: 24 }}>
          <Link
            to="/leads"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#2563eb",
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Back to Leads
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

function DetailBox({
  label,
  value,
  text,
  subText,
  border,
}: {
  label: string;
  value: string;
  text: string;
  subText: string;
  border: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ color: subText, fontSize: 14, marginBottom: 8 }}>{label}</div>
      <div style={{ color: text, fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}