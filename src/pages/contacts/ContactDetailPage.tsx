import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";


type ActivityItem = {
  id: string;
  type: "call" | "email" | "whatsapp" | "meeting" | "note" | "task";
  title: string;
  description: string;
  date: string;
};

type RelatedLead = {
  id: string;
  title: string;
  status: string;
  budget: string;
};

type RelatedDeal = {
  id: string;
  property: string;
  stage: string;
  value: string;
};

type RelatedTask = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
};

type ContactRecord = {
  id: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  company: string;
  designation: string;
  source: string;
  owner: string;
  city: string;
  address: string;
  tags: string[];
  createdAt: string;
  lastContactedAt: string;
  nextFollowUp: string;
  status: string;
  profileColor: string;
  notes: string;
  activities: ActivityItem[];
  relatedLeads: RelatedLead[];
  relatedDeals: RelatedDeal[];
  relatedTasks: RelatedTask[];
};

const mockContacts: ContactRecord[] = [
  {
    id: "1001",
    fullName: "Arun Kumar",
    phone: "+91 98765 43210",
    alternatePhone: "+91 91234 56789",
    email: "arun@example.com",
    company: "AK Properties",
    designation: "Property Investor",
    source: "Website Inquiry",
    owner: "Mei Admin",
    city: "Chennai",
    address: "Anna Nagar, Chennai, Tamil Nadu",
    tags: ["Hot Lead", "Investor", "Premium"],
    createdAt: "2026-04-01 10:30 AM",
    lastContactedAt: "2026-04-07 06:15 PM",
    nextFollowUp: "2026-04-10 11:00 AM",
    status: "Active",
    profileColor: "#0f766e",
    notes:
      "Interested in premium plotted developments and commercial spaces. Prefers WhatsApp first, then call. Wants ROI-focused opportunities in fast-growing zones.",
    activities: [
      {
        id: "a1",
        type: "call",
        title: "Initial Discovery Call",
        description:
          "Discussed investment preference, expected ROI, and target locations.",
        date: "2026-04-07 06:15 PM",
      },
      {
        id: "a2",
        type: "whatsapp",
        title: "Project Brochure Sent",
        description:
          "Shared brochure and pricing details for 2 premium plotted projects.",
        date: "2026-04-07 07:05 PM",
      },
      {
        id: "a3",
        type: "meeting",
        title: "Site Visit Planned",
        description:
          "Tentatively planned weekend site visit for OMR and ECR side projects.",
        date: "2026-04-08 11:00 AM",
      },
      {
        id: "a4",
        type: "note",
        title: "Internal Note Added",
        description:
          "Client seems serious. Emphasize legal clarity and appreciation potential.",
        date: "2026-04-08 01:30 PM",
      },
    ],
    relatedLeads: [
      {
        id: "L-201",
        title: "OMR Premium Plot Lead",
        status: "Qualified",
        budget: "₹75L - ₹1.2Cr",
      },
      {
        id: "L-305",
        title: "Commercial Land Opportunity",
        status: "Proposal Sent",
        budget: "₹2Cr+",
      },
    ],
    relatedDeals: [
      {
        id: "D-101",
        property: "ECR Premium Villa Plot",
        stage: "Negotiation",
        value: "₹98,00,000",
      },
    ],
    relatedTasks: [
      {
        id: "T-01",
        title: "Send updated payment plan",
        dueDate: "2026-04-09",
        status: "Pending",
      },
      {
        id: "T-02",
        title: "Confirm weekend site visit slot",
        dueDate: "2026-04-10",
        status: "Open",
      },
    ],
  },
];

function formatActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "call":
      return "📞";
    case "email":
      return "✉️";
    case "whatsapp":
      return "🟢";
    case "meeting":
      return "📍";
    case "note":
      return "📝";
    case "task":
      return "✅";
    default:
      return "•";
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#111827",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {rightAction}
      </div>

      {children}
    </div>
  );
}

export default function ContactDetailPage() {
  const navigate = useNavigate();
  const { contactId } = useParams();

  const contact = useMemo(() => {
    return mockContacts.find((item) => item.id === contactId) || mockContacts[0];
  }, [contactId]);

  if (!contact) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: "#111827" }}>Contact not found</h2>
        <button
          onClick={() => navigate("/contacts")}
          style={{
            marginTop: 12,
            border: "none",
            background: "#111827",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Top Back / Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => navigate("/contacts")}
          style={{
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Back to Contacts
        </button>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Edit Contact
          </button>

          <button
            style={{
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: 24,
          padding: 24,
          color: "#ffffff",
          marginBottom: 24,
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: contact.profileColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              }}
            >
              {contact.fullName.charAt(0)}
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {contact.fullName}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 15,
                }}
              >
                {contact.designation} • {contact.company}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 14,
                }}
              >
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(140px, 1fr))",
              gap: 14,
              minWidth: 280,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Status</div>
              <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>
                {contact.status}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Source</div>
              <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>
                {contact.source}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Last Contact</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>
                {contact.lastContactedAt}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Next Follow-up</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>
                {contact.nextFollowUp}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 22,
          }}
        >
          {[
            "📞 Call",
            "🟢 WhatsApp",
            "✉️ Email",
            "📅 Schedule Meeting",
            "📝 Add Note",
            "✅ Create Task",
          ].map((label) => (
            <button
              key={label}
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <SectionCard
            title="Basic Information"
            subtitle="Core contact details and profile information"
          >
            <InfoRow label="Full Name" value={contact.fullName} />
            <InfoRow label="Mobile" value={contact.phone} />
            <InfoRow label="Alt Mobile" value={contact.alternatePhone} />
            <InfoRow label="Email" value={contact.email} />
            <InfoRow label="Designation" value={contact.designation} />
            <InfoRow label="Company" value={contact.company} />
            <InfoRow label="Owner" value={contact.owner} />
            <InfoRow label="Source" value={contact.source} />
            <InfoRow label="Created At" value={contact.createdAt} />
            <InfoRow label="City" value={contact.city} />
            <InfoRow label="Address" value={contact.address} />
          </SectionCard>

          <SectionCard
            title="Notes & Insights"
            subtitle="Internal summary and conversation context"
            rightAction={
              <button
                style={{
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  padding: "8px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Edit Note
              </button>
            }
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 16,
                fontSize: 14,
                lineHeight: 1.7,
                color: "#374151",
              }}
            >
              {contact.notes}
            </div>
          </SectionCard>

          <SectionCard
            title="Activity Timeline"
            subtitle="Latest communication and engagement history"
            rightAction={
              <button
                style={{
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  padding: "8px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View All
              </button>
            }
          >
            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {contact.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 28,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      {formatActivityIcon(activity.type)}
                    </div>
                    {index !== contact.activities.length - 1 ? (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          background: "#e5e7eb",
                          minHeight: 42,
                          marginTop: 6,
                        }}
                      />
                    ) : null}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {activity.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          fontWeight: 600,
                        }}
                      >
                        {activity.date}
                      </div>
                    </div>

                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14,
                        color: "#4b5563",
                        lineHeight: 1.6,
                      }}
                    >
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Side */}
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <SectionCard
            title="Follow-up Summary"
            subtitle="What needs to happen next"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1d4ed8",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                  NEXT FOLLOW-UP
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {contact.nextFollowUp}
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Suggested next step
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#111827",
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  Share updated pricing + payment plan and lock site visit slot.
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Related Leads"
            subtitle="Leads linked to this contact"
          >
            <div style={{ display: "grid", gap: 12 }}>
              {contact.relatedLeads.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 14,
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {lead.title}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        Budget: {lead.budget}
                      </div>
                    </div>

                    <span
                      style={{
                        alignSelf: "flex-start",
                        background: "#ecfeff",
                        color: "#0f766e",
                        border: "1px solid #99f6e4",
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Related Deals"
            subtitle="Current opportunities in progress"
          >
            <div style={{ display: "grid", gap: 12 }}>
              {contact.relatedDeals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 14,
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {deal.property}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    <span>Stage: {deal.stage}</span>
                    <span>Value: {deal.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Tasks"
            subtitle="Pending and active tasks for this contact"
          >
            <div style={{ display: "grid", gap: 12 }}>
              {contact.relatedTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 14,
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    <span>Due: {task.dueDate}</span>
                    <span>Status: {task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}