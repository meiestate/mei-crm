import React, { memo, useMemo } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  Clock3,
  Flame,
  Globe2,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  User2,
} from "lucide-react";

type LeadPriority = "low" | "medium" | "high" | "urgent";
type LeadTemperature = "cold" | "warm" | "hot";
type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site-visit"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type LeadSummaryCardData = {
  id: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  source?: string;
  ownerName?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  temperature?: LeadTemperature;
  budget?: string;
  projectInterest?: string;
  propertyType?: string;
  timeline?: string;
  notes?: string;
  score?: number;
  lastActivityAt?: string;
  nextFollowUpAt?: string;
  createdAt?: string;
  isVerified?: boolean;
};

type Props = {
  lead?: LeadSummaryCardData | null;
  loading?: boolean;
  empty?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actionLabel?: string;
  onOpenLead?: (lead: LeadSummaryCardData) => void;
  onCallLead?: (lead: LeadSummaryCardData) => void;
  onMessageLead?: (lead: LeadSummaryCardData) => void;
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  position: "relative",
  padding: 20,
  borderBottom: "1px solid #e2e8f0",
  background:
    "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(248,250,252,1) 52%, rgba(255,255,255,1) 100%)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  right: -32,
  top: -44,
  width: 180,
  height: 180,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0) 72%)",
  pointerEvents: "none",
};

const headerRowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
};

const contentStyle: React.CSSProperties = {
  padding: 20,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(300px, 0.95fr)",
  gap: 16,
  minWidth: 0,
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  background: "#ffffff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const heroCardStyle: React.CSSProperties = {
  ...sectionStyle,
  background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
  border: "1px solid #dbeafe",
};

const leadNameStyle: React.CSSProperties = {
  fontSize: 21,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.2,
  letterSpacing: "-0.03em",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#475569",
  lineHeight: 1.75,
};

const tagWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const infoItemStyle: React.CSSProperties = {
  border: "1px solid #edf2f7",
  borderRadius: 16,
  background: "#f8fafc",
  padding: "13px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 7,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const notesBoxStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  background: "#f8fafc",
  padding: 14,
  fontSize: 13,
  color: "#334155",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const footerStyle: React.CSSProperties = {
  padding: "0 20px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const actionsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const actionButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};

const primaryActionButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.16)",
};

const emptyStateStyle: React.CSSProperties = {
  padding: 28,
  margin: 20,
  borderRadius: 18,
  border: "1px dashed #cbd5e1",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  textAlign: "center",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "leadSummaryCardPulse 1.4s ease-in-out infinite",
};

function LeadSummaryCard({
  lead,
  loading = false,
  empty = false,
  className,
  title = "Lead Summary",
  subtitle = "See lead quality, urgency, communication readiness, and follow-up timing in one operational snapshot.",
  emptyTitle = "No lead selected",
  emptyDescription = "Choose a lead to view profile summary, quality signals, and next action context.",
  actionLabel = "Open Lead",
  onOpenLead,
  onCallLead,
  onMessageLead,
}: Props) {
  const safeLead = useMemo<LeadSummaryCardData | null>(() => {
    if (lead) return lead;

    return {
      id: "lead-001",
      fullName: "Aravind Kumar",
      company: "AK Holdings",
      email: "aravind@example.com",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      location: "Whitefield, Bengaluru",
      source: "Meta Ads",
      ownerName: "Vikram Raj",
      status: "qualified",
      priority: "high",
      temperature: "hot",
      budget: "₹95L - ₹1.2Cr",
      projectInterest: "Premium plotted development",
      propertyType: "Plot",
      timeline: "Within 30 days",
      notes:
        "Lead is actively comparing 2 projects. Fast response matters. Legal clarity and appreciation potential are the key persuasion points.",
      score: 82,
      lastActivityAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      nextFollowUpAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      isVerified: true,
    };
  }, [lead]);

  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes leadSummaryCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 1100px) {
              .lead-summary-card-content {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 768px) {
              .lead-summary-card-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <div style={{ ...skeletonStyle, height: 22, width: 180 }} />
              <div style={{ ...skeletonStyle, height: 14, width: 280 }} />
            </div>
          </div>
        </div>

        <div className="lead-summary-card-content" style={contentStyle}>
          <div style={columnStyle}>
            <div style={heroCardStyle}>
              <div style={{ ...skeletonStyle, height: 24, width: 220 }} />
              <div style={{ ...skeletonStyle, height: 14, width: "100%" }} />
              <div style={{ ...skeletonStyle, height: 14, width: "74%" }} />
              <div style={{ ...skeletonStyle, height: 32, width: "68%" }} />
            </div>

            <div className="lead-summary-card-grid" style={infoGridStyle}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} style={infoItemStyle}>
                  <div style={{ ...skeletonStyle, height: 10, width: 70 }} />
                  <div style={{ ...skeletonStyle, height: 16, width: "82%" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={columnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 18, width: 120 }} />
              <div style={{ ...skeletonStyle, height: 78, width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (empty || !safeLead) {
    return (
      <div className={className} style={cardStyle}>
        <div style={headerStyle}>
          <div style={glowStyle} />
          <div style={headerRowStyle}>
            <div style={titleWrapStyle}>
              <h3 style={titleStyle}>{title}</h3>
              <p style={subtitleStyle}>{subtitle}</p>
            </div>
          </div>
        </div>

        <div style={emptyStateStyle}>
          <CircleDashed size={24} color="#64748b" />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {emptyTitle}
          </div>
          <div style={helperTextStyle}>{emptyDescription}</div>
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(safeLead.status);
  const priorityMeta = getPriorityMeta(safeLead.priority);
  const temperatureMeta = getTemperatureMeta(safeLead.temperature);
  const leadScore = normalizeScore(safeLead.score);
  const leadQualityMeta = getLeadQualityMeta(leadScore);

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 1100px) {
            .lead-summary-card-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .lead-summary-card-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <div style={glowStyle} />
        <div style={headerRowStyle}>
          <div style={titleWrapStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <div style={badgeStyle}>
            <Sparkles size={14} />
            Lead Intelligence
          </div>
        </div>
      </div>

      <div className="lead-summary-card-content" style={contentStyle}>
        <div style={columnStyle}>
          <div style={heroCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={leadNameStyle}>{safeLead.fullName}</div>

              {safeLead.isVerified ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 999,
                    padding: "6px 10px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#047857",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <BadgeCheck size={12} />
                  Verified
                </span>
              ) : null}
            </div>

            <div style={descriptionStyle}>
              {safeLead.projectInterest
                ? `${safeLead.fullName} is currently interested in ${safeLead.projectInterest.toLowerCase()}.`
                : "This lead is active in the pipeline and ready for deeper qualification and conversion actions."}
            </div>

            <div style={tagWrapStyle}>
              <span style={statusMeta.style}>
                {statusMeta.icon}
                {statusMeta.label}
              </span>

              <span style={priorityMeta.style}>
                {priorityMeta.icon}
                {priorityMeta.label}
              </span>

              <span style={temperatureMeta.style}>
                {temperatureMeta.icon}
                {temperatureMeta.label}
              </span>
            </div>
          </div>

          <div className="lead-summary-card-grid" style={infoGridStyle}>
            <InfoItem
              label="Lead Score"
              value={`${leadScore}/100`}
              helper={leadQualityMeta.label}
              icon={<TrendingUp size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Budget"
              value={safeLead.budget || "Not specified"}
              icon={<IndianRupee size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Property Type"
              value={safeLead.propertyType || "Not specified"}
              icon={<Building2 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Timeline"
              value={safeLead.timeline || "Not specified"}
              icon={<CalendarClock size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Source"
              value={safeLead.source || "Unknown"}
              icon={<Globe2 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Owner"
              value={safeLead.ownerName || "Unassigned"}
              icon={<User2 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Last Activity"
              value={formatDateTime(safeLead.lastActivityAt)}
              icon={<Clock3 size={14} color="#2563eb" />}
            />
            <InfoItem
              label="Next Follow-Up"
              value={formatDateTime(safeLead.nextFollowUpAt)}
              helper={getFollowUpLabel(safeLead.nextFollowUpAt)}
              icon={<CalendarClock size={14} color="#2563eb" />}
            />
          </div>
        </div>

        <div style={columnStyle}>
          <div style={sectionStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Contact & Qualification
              </div>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "6px 10px",
                  background: leadQualityMeta.bg,
                  border: `1px solid ${leadQualityMeta.border}`,
                  color: leadQualityMeta.color,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {leadQualityMeta.icon}
                {leadQualityMeta.label}
              </span>
            </div>

            <div style={infoGridStyle} className="lead-summary-card-grid">
              <InfoItem
                label="Phone"
                value={safeLead.phone || "Not available"}
                icon={<Phone size={14} color="#2563eb" />}
              />
              <InfoItem
                label="WhatsApp"
                value={safeLead.whatsapp || "Not available"}
                icon={<MessageSquare size={14} color="#2563eb" />}
              />
              <InfoItem
                label="Email"
                value={safeLead.email || "Not available"}
                icon={<Mail size={14} color="#2563eb" />}
              />
              <InfoItem
                label="Location"
                value={safeLead.location || "Not available"}
                icon={<MapPin size={14} color="#2563eb" />}
              />
              <InfoItem
                label="Company"
                value={safeLead.company || "Not available"}
                icon={<Building2 size={14} color="#2563eb" />}
              />
              <InfoItem
                label="Created At"
                value={formatDateTime(safeLead.createdAt)}
                icon={<CalendarClock size={14} color="#2563eb" />}
              />
            </div>
          </div>

          <div
            style={{
              ...sectionStyle,
              background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Notes & Conversion Read
            </div>

            <div style={notesBoxStyle}>
              {safeLead.notes?.trim()
                ? safeLead.notes
                : "No notes added yet. Add context about objections, urgency, budget clarity, and interest depth."}
            </div>

            <div style={helperTextStyle}>
              High-conviction leads usually combine strong intent, recent activity,
              clear budget, and a short decision timeline. Keep momentum alive with fast follow-up.
            </div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={helperTextStyle}>
          Use this summary card to judge readiness, urgency, and next conversion move at a glance.
        </div>

        <div style={actionsWrapStyle}>
          <button
            type="button"
            style={actionButtonStyle}
            onClick={() => onCallLead?.(safeLead)}
          >
            <Phone size={14} />
            Call
          </button>

          <button
            type="button"
            style={actionButtonStyle}
            onClick={() => onMessageLead?.(safeLead)}
          >
            <MessageSquare size={14} />
            Message
          </button>

          <button
            type="button"
            style={primaryActionButtonStyle}
            onClick={() => onOpenLead?.(safeLead)}
          >
            {actionLabel}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={infoItemStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
        {icon ? <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <span style={valueStyle}>{value}</span>
          {helper ? <span style={helperTextStyle}>{helper}</span> : null}
        </div>
      </div>
    </div>
  );
}

function getStatusMeta(status: LeadStatus = "new") {
  switch (status) {
    case "won":
      return {
        label: "Won",
        icon: <CheckCircle2 size={12} />,
        style: chip("#ecfdf5", "#a7f3d0", "#047857"),
      };
    case "lost":
      return {
        label: "Lost",
        icon: <CircleAlert size={12} />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    case "qualified":
      return {
        label: "Qualified",
        icon: <BadgeCheck size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
    case "site-visit":
      return {
        label: "Site Visit",
        icon: <MapPin size={12} />,
        style: chip("#ecfeff", "#a5f3fc", "#0f766e"),
      };
    case "proposal":
      return {
        label: "Proposal",
        icon: <Sparkles size={12} />,
        style: chip("#f5f3ff", "#ddd6fe", "#6d28d9"),
      };
    case "negotiation":
      return {
        label: "Negotiation",
        icon: <TrendingUp size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "contacted":
      return {
        label: "Contacted",
        icon: <Phone size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
    default:
      return {
        label: "New",
        icon: <Star size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
  }
}

function getPriorityMeta(priority: LeadPriority = "medium") {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgent",
        icon: <Flame size={12} />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    case "high":
      return {
        label: "High Priority",
        icon: <CircleAlert size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
    case "medium":
      return {
        label: "Medium Priority",
        icon: <Clock3 size={12} />,
        style: chip("#eff6ff", "#bfdbfe", "#1d4ed8"),
      };
    default:
      return {
        label: "Low Priority",
        icon: <CircleDashed size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
  }
}

function getTemperatureMeta(temperature: LeadTemperature = "warm") {
  switch (temperature) {
    case "hot":
      return {
        label: "Hot Lead",
        icon: <Flame size={12} />,
        style: chip("#fef2f2", "#fecaca", "#b91c1c"),
      };
    case "cold":
      return {
        label: "Cold Lead",
        icon: <CircleDashed size={12} />,
        style: chip("#f8fafc", "#e2e8f0", "#475569"),
      };
    default:
      return {
        label: "Warm Lead",
        icon: <Sparkles size={12} />,
        style: chip("#fff7ed", "#fed7aa", "#c2410c"),
      };
  }
}

function getLeadQualityMeta(score: number) {
  if (score >= 80) {
    return {
      label: "High Quality",
      icon: <BadgeCheck size={12} />,
      bg: "#ecfdf5",
      border: "#a7f3d0",
      color: "#047857",
    };
  }

  if (score >= 60) {
    return {
      label: "Promising",
      icon: <TrendingUp size={12} />,
      bg: "#eff6ff",
      border: "#bfdbfe",
      color: "#1d4ed8",
    };
  }

  if (score >= 40) {
    return {
      label: "Needs Nurture",
      icon: <Clock3 size={12} />,
      bg: "#fff7ed",
      border: "#fed7aa",
      color: "#c2410c",
    };
  }

  return {
    label: "Low Readiness",
    icon: <CircleAlert size={12} />,
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#b91c1c",
  };
}

function chip(
  background: string,
  border: string,
  color: string
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "7px 11px",
    background,
    border: `1px solid ${border}`,
    color,
    fontSize: 12,
    fontWeight: 800,
  };
}

function normalizeScore(score?: number) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getFollowUpLabel(value?: string) {
  if (!value) return "No follow-up scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid follow-up date";

  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) {
    const mins = Math.floor(Math.abs(diff) / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} overdue`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} overdue`;
    return `${Math.max(mins, 1)} minute${mins > 1 ? "s" : ""} overdue`;
  }

  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `Due in ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  return `Due in ${Math.max(mins, 1)} minute${mins > 1 ? "s" : ""}`;
}

export default memo(LeadSummaryCard);