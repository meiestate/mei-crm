import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadDetailPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  city: string;
  status: LeadStatus;
  email: string;
  company: string;
  budget: string;
  notes: string;
};

const leads: Lead[] = [
  {
    id: 1,
    name: "Arun Kumar",
    phone: "9876543210",
    source: "WhatsApp",
    city: "Chennai",
    status: "New",
    email: "arun@example.com",
    company: "AK Traders",
    budget: "₹15,00,000",
    notes: "Interested in premium CRM setup and automation.",
  },
  {
    id: 2,
    name: "Priya",
    phone: "9123456780",
    source: "Facebook",
    city: "Bangalore",
    status: "Contacted",
    email: "priya@example.com",
    company: "Priya Ventures",
    budget: "₹8,00,000",
    notes: "Asked for product demo and pricing details.",
  },
  {
    id: 3,
    name: "Rahul",
    phone: "9000012345",
    source: "Website",
    city: "Coimbatore",
    status: "Qualified",
    email: "rahul@example.com",
    company: "Rahul Infra",
    budget: "₹25,00,000",
    notes: "Looking for multi-user CRM with reports.",
  },
  {
    id: 4,
    name: "Meena",
    phone: "9090909090",
    source: "Reference",
    city: "Madurai",
    status: "Closed",
    email: "meena@example.com",
    company: "Meena Corp",
    budget: "₹12,00,000",
    notes: "Deal closed successfully.",
  },
];

function getStatusColor(status: LeadStatus, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (status) {
    case "New":
      return colors.info;
    case "Contacted":
      return colors.warning;
    case "Qualified":
      return colors.premium;
    case "Closed":
      return colors.success;
    default:
      return colors.subText;
  }
}

export default function LeadDetailPage({
  mode,
  onToggleTheme,
}: LeadDetailPageProps) {
  const { id } = useParams();
  const colors = getTheme(mode);

  const lead = leads.find((item) => item.id === Number(id));

  if (!lead) {
    return (
      <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <h2 style={{ margin: 0, color: colors.text }}>Lead not found</h2>
          <p style={{ margin: "8px 0 0", color: colors.subText }}>
            The requested lead does not exist.
          </p>

          <div style={{ marginTop: 20 }}>
            <Link
              to="/leads"
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: colors.primary,
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: 12,
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

  return (
    <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  color: colors.text,
                }}
              >
                {lead.name}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                }}
              >
                Lead full profile overview
              </p>
            </div>

            <span
              style={{
                display: "inline-block",
                background: getStatusColor(lead.status, mode),
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {lead.status}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <DetailCard label="Lead ID" value={String(lead.id)} colors={colors} />
          <DetailCard label="Phone" value={lead.phone} colors={colors} />
          <DetailCard label="Email" value={lead.email} colors={colors} />
          <DetailCard label="Source" value={lead.source} colors={colors} />
          <DetailCard label="City" value={lead.city} colors={colors} />
          <DetailCard label="Company" value={lead.company} colors={colors} />
          <DetailCard label="Budget" value={lead.budget} colors={colors} />
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Notes
          </div>

          <div
            style={{
              background: colors.cardBgSoft,
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: 16,
              color: colors.text,
              lineHeight: 1.6,
            }}
          >
            {lead.notes}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/leads"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: colors.primary,
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 700,
            }}
          >
            Back to Leads
          </Link>

          <button
            style={{
              border: `1px solid ${colors.border}`,
              background: colors.cardBg,
              color: colors.text,
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Edit Lead
          </button>

          <button
            style={{
              border: "none",
              background: colors.danger,
              color: "#ffffff",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

function DetailCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}