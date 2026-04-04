import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadDetailPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LeadStatus = "New" | "Contacted" | "Qualified" | "Negotiation" | "Closed";
type LeadPriority = "Low" | "Medium" | "High";

type CallLogItem = {
  time: string;
  note: string;
  outcome: string;
};

type TimelineItem = {
  title: string;
  description: string;
  time: string;
};

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
  owner: string;
  priority: LeadPriority;
  followUpDate: string;
  lastContact: string;
  requirement: string;
  callLogs: CallLogItem[];
  timeline: TimelineItem[];
};

const leads: Lead[] = [
  {
    id: 1001,
    name: "Arun Kumar",
    phone: "9876543210",
    source: "WhatsApp",
    city: "Chennai",
    status: "New",
    email: "arun@example.com",
    company: "AK Traders",
    budget: "₹15,00,000",
    notes: "Interested in premium CRM setup and automation. Wants a quick overview before scheduling a product demo.",
    owner: "Madhan",
    priority: "High",
    followUpDate: "2026-04-05",
    lastContact: "Today",
    requirement: "CRM setup, lead automation, dashboard reporting",
    callLogs: [
      {
        time: "Today · 10:30 AM",
        note: "Initial intro call completed. Lead showed strong interest in automation workflow.",
        outcome: "Positive",
      },
      {
        time: "Yesterday · 5:15 PM",
        note: "Shared business overview and collected requirement summary.",
        outcome: "Connected",
      },
    ],
    timeline: [
      {
        title: "Lead Created",
        description: "Lead entered into CRM from WhatsApp enquiry.",
        time: "Yesterday · 4:45 PM",
      },
      {
        title: "Requirement Captured",
        description: "User requirement for CRM automation documented.",
        time: "Yesterday · 5:20 PM",
      },
      {
        title: "Follow-up Scheduled",
        description: "Next product discussion planned for 2026-04-05.",
        time: "Today · 10:35 AM",
      },
    ],
  },
  {
    id: 1002,
    name: "Priya",
    phone: "9123456780",
    source: "Facebook",
    city: "Bangalore",
    status: "Contacted",
    email: "priya@example.com",
    company: "Priya Ventures",
    budget: "₹8,00,000",
    notes: "Asked for product demo and pricing details. Wants multi-user access and sales reporting.",
    owner: "Madhan",
    priority: "Medium",
    followUpDate: "2026-04-06",
    lastContact: "Yesterday",
    requirement: "Demo, pricing, team user access",
    callLogs: [
      {
        time: "Yesterday · 2:10 PM",
        note: "Discussed pricing tiers and dashboard features.",
        outcome: "Interested",
      },
    ],
    timeline: [
      {
        title: "Lead Captured",
        description: "Lead received from Facebook campaign.",
        time: "2 days ago",
      },
      {
        title: "Contact Established",
        description: "Spoke with lead and shared company introduction.",
        time: "Yesterday · 2:10 PM",
      },
    ],
  },
  {
    id: 1003,
    name: "Rahul",
    phone: "9000012345",
    source: "Website",
    city: "Coimbatore",
    status: "Qualified",
    email: "rahul@example.com",
    company: "Rahul Infra",
    budget: "₹25,00,000",
    notes: "Looking for multi-user CRM with reports, task assignment, and lead tracking for field sales team.",
    owner: "Arun",
    priority: "High",
    followUpDate: "2026-04-07",
    lastContact: "2 days ago",
    requirement: "Team CRM, reporting, field sales workflow",
    callLogs: [
      {
        time: "2 days ago · 1:00 PM",
        note: "Qualified lead after confirming team size and budget.",
        outcome: "Qualified",
      },
    ],
    timeline: [
      {
        title: "Lead Submitted",
        description: "Lead submitted enquiry through official website.",
        time: "3 days ago",
      },
      {
        title: "Qualified",
        description: "Lead marked qualified after budget and use-case discussion.",
        time: "2 days ago · 1:00 PM",
      },
    ],
  },
  {
    id: 1004,
    name: "Meena",
    phone: "9090909090",
    source: "Referral",
    city: "Madurai",
    status: "Negotiation",
    email: "meena@example.com",
    company: "Meena Corp",
    budget: "₹12,00,000",
    notes: "Pricing negotiation ongoing. Lead is interested but requesting phased onboarding.",
    owner: "Priya",
    priority: "Medium",
    followUpDate: "2026-04-04",
    lastContact: "Today",
    requirement: "Phased rollout, onboarding support",
    callLogs: [
      {
        time: "Today · 11:40 AM",
        note: "Negotiated payment milestone and onboarding timeline.",
        outcome: "Negotiation",
      },
    ],
    timeline: [
      {
        title: "Referred Lead",
        description: "Lead added through business referral.",
        time: "4 days ago",
      },
      {
        title: "Negotiation Started",
        description: "Commercial discussion and rollout model review.",
        time: "Today · 11:40 AM",
      },
    ],
  },
  {
    id: 1005,
    name: "Suresh",
    phone: "9345678901",
    source: "Walk-in",
    city: "Trichy",
    status: "Closed",
    email: "suresh@example.com",
    company: "Suresh Properties",
    budget: "₹32,00,000",
    notes: "Deal closed successfully. Client confirmed onboarding plan and user setup.",
    owner: "Madhan",
    priority: "Low",
    followUpDate: "2026-04-02",
    lastContact: "3 days ago",
    requirement: "Onboarding and implementation",
    callLogs: [
      {
        time: "3 days ago · 4:30 PM",
        note: "Final confirmation call and project kickoff scheduled.",
        outcome: "Won",
      },
    ],
    timeline: [
      {
        title: "Lead Added",
        description: "Walk-in lead added manually by sales desk.",
        time: "1 week ago",
      },
      {
        title: "Deal Closed",
        description: "Commercial approval received and deal marked closed.",
        time: "3 days ago · 4:30 PM",
      },
    ],
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
    case "Negotiation":
      return colors.primary;
    case "Closed":
      return colors.success;
    default:
      return colors.subText;
  }
}

function getPriorityColor(priority: LeadPriority, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (priority) {
    case "High":
      return colors.danger;
    case "Medium":
      return colors.warning;
    case "Low":
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
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <h2 style={{ margin: 0, color: colors.text, fontSize: 28 }}>
            Lead not found
          </h2>

          <p style={{ margin: "10px 0 0", color: colors.subText }}>
            The requested lead does not exist or may have been removed.
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
        <section
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
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: colors.cardBgSoft,
                  color: colors.subText,
                  border: `1px solid ${colors.border}`,
                  marginBottom: 14,
                }}
              >
                Lead Profile
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 32,
                  color: colors.text,
                  fontWeight: 800,
                }}
              >
                {lead.name}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Full lead profile, contact summary, activity tracking, and next action plan.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-block",
                  background: getPriorityColor(lead.priority, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {lead.priority} Priority
              </span>

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
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <DetailCard label="Lead ID" value={String(lead.id)} colors={colors} />
          <DetailCard label="Phone" value={lead.phone} colors={colors} />
          <DetailCard label="Email" value={lead.email} colors={colors} />
          <DetailCard label="Source" value={lead.source} colors={colors} />
          <DetailCard label="City" value={lead.city} colors={colors} />
          <DetailCard label="Company" value={lead.company} colors={colors} />
          <DetailCard label="Owner" value={lead.owner} colors={colors} />
          <DetailCard label="Budget" value={lead.budget} colors={colors} />
          <DetailCard label="Follow-up Date" value={lead.followUpDate} colors={colors} />
          <DetailCard label="Last Contact" value={lead.lastContact} colors={colors} />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.1fr) minmax(280px, 0.9fr)",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            <InfoPanel title="Requirement" colors={colors}>
              {lead.requirement}
            </InfoPanel>

            <InfoPanel title="Notes" colors={colors}>
              {lead.notes}
            </InfoPanel>

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
                  marginBottom: 14,
                }}
              >
                Call Log
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {lead.callLogs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      background: colors.cardBgSoft,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          color: colors.text,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {log.outcome}
                      </div>

                      <div
                        style={{
                          color: colors.mutedText,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {log.time}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        color: colors.subText,
                        lineHeight: 1.6,
                        fontSize: 14,
                      }}
                    >
                      {log.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 20,
              alignContent: "start",
            }}
          >
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
                  marginBottom: 14,
                }}
              >
                Next Follow-up
              </div>

              <div
                style={{
                  background: colors.cardBgSoft,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    color: colors.subText,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Scheduled Date
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: colors.text,
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {lead.followUpDate}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: colors.subText,
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  Prepare the next update, confirm requirement clarity, and move the lead to the next stage.
                </div>
              </div>
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
                  marginBottom: 14,
                }}
              >
                Activity Timeline
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {lead.timeline.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "14px 1fr",
                      gap: 12,
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: colors.primary,
                        marginTop: 6,
                      }}
                    />

                    <div
                      style={{
                        background: colors.cardBgSoft,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 14,
                        padding: 14,
                      }}
                    >
                      <div
                        style={{
                          color: colors.text,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          color: colors.subText,
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}
                      >
                        {item.description}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: colors.mutedText,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
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
        </section>
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

function InfoPanel({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
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
        {title}
      </div>

      <div
        style={{
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          color: colors.text,
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}