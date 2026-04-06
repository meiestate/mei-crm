import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  updatedAt?: string;
  createdAt?: string;
};

const LEAD_STORAGE_KEYS = [
  "mei-crm-leads",
  "mei_crm_leads",
  "leads",
  "crm_leads",
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

function normalizeStatus(value: string | undefined): LeadStatus {
  const normalized = String(value || "New").toLowerCase();

  if (normalized.includes("contact")) return "Contacted";
  if (normalized.includes("qual")) return "Qualified";
  if (normalized.includes("neg")) return "Negotiation";
  if (normalized.includes("closed") || normalized.includes("won")) return "Closed";
  return "New";
}

function normalizePriority(value: string | undefined): LeadPriority {
  const normalized = String(value || "Medium").toLowerCase();

  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";
  return "Medium";
}

function readStoredLeads(): Lead[] {
  for (const key of LEAD_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const mapped = parsed
        .map((item: any, index: number) => mapUnknownLead(item, index))
        .filter(Boolean) as Lead[];

      if (mapped.length > 0) {
        return mapped;
      }
    } catch (error) {
      console.error(`Failed to parse localStorage key: ${key}`, error);
    }
  }

  return [];
}

function saveStoredLeads(leads: Lead[]) {
  try {
    localStorage.setItem("mei-crm-leads", JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to save leads to localStorage:", error);
  }
}

function mapUnknownLead(item: any, index: number): Lead | null {
  if (!item || typeof item !== "object") return null;

  const timeline = Array.isArray(item.timeline)
    ? item.timeline.map((entry: any) => ({
        title: String(entry?.title || "Activity"),
        description: String(entry?.description || "Lead activity recorded."),
        time: String(entry?.time || "Recent"),
      }))
    : [];

  const callLogs = Array.isArray(item.callLogs)
    ? item.callLogs.map((entry: any) => ({
        time: String(entry?.time || "Recent"),
        note: String(entry?.note || "Call activity recorded."),
        outcome: String(entry?.outcome || "Connected"),
      }))
    : [];

  return {
    id: Number(item.id ?? Date.now() + index),
    name: String(item.name || item.fullName || item.customerName || item.company || `Lead ${index + 1}`),
    phone: String(item.phone || item.mobile || item.whatsapp || "-"),
    source: String(item.source || "Manual"),
    city: String(item.city || item.location || item.area || "Unknown"),
    status: normalizeStatus(item.status),
    email: String(item.email || "-"),
    company: String(item.company || "-"),
    budget:
      typeof item.budget === "number"
        ? `₹${item.budget.toLocaleString("en-IN")}`
        : String(item.budget || "-"),
    notes: String(item.notes || "No notes added yet."),
    owner: String(item.owner || item.assignedTo || item.leadOwner || "Unassigned"),
    priority: normalizePriority(item.priority),
    followUpDate: String(item.followUpDate || item.nextFollowUp || "-"),
    lastContact: String(item.lastContact || "Recent"),
    requirement: String(item.requirement || "Requirement details not added yet."),
    callLogs,
    timeline,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  };
}

function getNowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function getLastContactLabel() {
  return "Just now";
}

export default function LeadDetailPage({
  mode,
  onToggleTheme,
}: LeadDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const colors = getTheme(mode);

  const leadId = Number(id);

  const [allLeads, setAllLeads] = useState<Lead[]>(() => readStoredLeads());

  useEffect(() => {
    const syncLeads = () => {
      setAllLeads(readStoredLeads());
    };

    window.addEventListener("storage", syncLeads);
    return () => window.removeEventListener("storage", syncLeads);
  }, []);

  const initialLead = useMemo(
    () => allLeads.find((item) => item.id === leadId) ?? null,
    [allLeads, leadId]
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [leadState, setLeadState] = useState<Lead | null>(initialLead);
  const [formData, setFormData] = useState<Lead | null>(initialLead);

  useEffect(() => {
    setLeadState(initialLead);
    setFormData(initialLead);
  }, [initialLead]);

  const persistLeadUpdate = (updater: (lead: Lead) => Lead) => {
    const latestLeads = readStoredLeads();
    const updatedLeads = latestLeads.map((lead) =>
      lead.id === leadId ? updater(lead) : lead
    );

    saveStoredLeads(updatedLeads);
    setAllLeads(updatedLeads);

    const updatedLead = updatedLeads.find((lead) => lead.id === leadId) ?? null;
    setLeadState(updatedLead);
    setFormData(updatedLead);
  };

  if (!leadState || !formData) {
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

  const lead = leadState;

  const updateStatus = (nextStatus: LeadStatus) => {
    persistLeadUpdate((prev) => {
      const statusTimeline: TimelineItem = {
        title: "Status Updated",
        description: `Lead status changed to ${nextStatus}.`,
        time: getNowLabel(),
      };

      return {
        ...prev,
        status: nextStatus,
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [statusTimeline, ...(prev.timeline || [])],
      };
    });
  };

  const saveLeadChanges = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.owner.trim()
    ) {
      alert("Name, phone, city, owner fill பண்ணணும்.");
      return;
    }

    persistLeadUpdate((prev) => {
      const editTimeline: TimelineItem = {
        title: "Lead Updated",
        description: "Lead profile information was edited from the detail page.",
        time: getNowLabel(),
      };

      return {
        ...prev,
        ...formData,
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [editTimeline, ...(prev.timeline || [])],
      };
    });

    setIsEditOpen(false);
  };

  const handleDeleteLead = () => {
    const confirmed = window.confirm(`Delete ${lead.name} from leads?`);
    if (!confirmed) return;

    const latestLeads = readStoredLeads();
    const updatedLeads = latestLeads.filter((item) => item.id !== lead.id);

    saveStoredLeads(updatedLeads);
    setAllLeads(updatedLeads);
    navigate("/leads");
  };

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
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 20,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            Quick Actions
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value as LeadStatus)}
              style={inputStyle(colors)}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              onClick={() => {
                setFormData(lead);
                setIsEditOpen(true);
              }}
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
              onClick={handleDeleteLead}
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
          <div style={{ display: "grid", gap: 20 }}>
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
                {lead.callLogs.length > 0 ? (
                  lead.callLogs.map((log, index) => (
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
                  ))
                ) : (
                  <div
                    style={{
                      background: colors.cardBgSoft,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                      color: colors.subText,
                      fontSize: 14,
                    }}
                  >
                    No call logs yet.
                  </div>
                )}
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
                {lead.timeline.length > 0 ? (
                  lead.timeline.map((item, index) => (
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
                  ))
                ) : (
                  <div
                    style={{
                      background: colors.cardBgSoft,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                      color: colors.subText,
                      fontSize: 14,
                    }}
                  >
                    No timeline activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isEditOpen && (
        <div
          onClick={() => setIsEditOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 16,
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 860,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: 26,
                }}
              >
                Edit Lead
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                }}
              >
                Update lead profile, priority, follow-up, and requirement details.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Name"
                value={formData.name}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, name: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, phone: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Email"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, email: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Company"
                value={formData.company}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, company: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, city: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Source"
                value={formData.source}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, source: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Owner"
                value={formData.owner}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, owner: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Budget"
                value={formData.budget}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, budget: value } : prev))
                }
                colors={colors}
              />

              <SelectField
                label="Status"
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, status: value as LeadStatus } : prev
                  )
                }
                options={["New", "Contacted", "Qualified", "Negotiation", "Closed"]}
                colors={colors}
              />

              <SelectField
                label="Priority"
                value={formData.priority}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, priority: value as LeadPriority } : prev
                  )
                }
                options={["Low", "Medium", "High"]}
                colors={colors}
              />

              <div style={{ display: "grid", gap: 8 }}>
                <label
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Follow-up Date
                </label>

                <input
                  type="date"
                  value={formData.followUpDate === "-" ? "" : formData.followUpDate}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, followUpDate: e.target.value || "-" } : prev
                    )
                  }
                  style={inputStyle(colors)}
                />
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <TextAreaField
                label="Requirement"
                value={formData.requirement}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, requirement: value } : prev))
                }
                colors={colors}
              />

              <TextAreaField
                label="Notes"
                value={formData.notes}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, notes: value } : prev))
                }
                colors={colors}
              />
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsEditOpen(false)}
                style={{
                  border: `1px solid ${colors.border}`,
                  background: "transparent",
                  color: colors.text,
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={saveLeadChanges}
                style={{
                  border: "none",
                  background: colors.primary,
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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

function InputField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(colors)}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          ...inputStyle(colors),
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(colors)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function inputStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: colors.inputBg,
    color: colors.text,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}