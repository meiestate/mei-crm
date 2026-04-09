import React from "react";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadPriority = "Low" | "Medium" | "High";

export type LeadSource =
  | "Website"
  | "Facebook"
  | "Instagram"
  | "WhatsApp"
  | "Referral"
  | "Walk-in"
  | "Call"
  | "Broker"
  | "Other";

export type LeadOverviewData = {
  id: string;
  name: string;
  project?: string;
  location?: string;
  budget?: string;
  propertyType?: string;
  requirementType?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  assignedTo?: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  score?: number;
  conversionProbability?: number;
};

type LeadOverviewCardProps = {
  lead: LeadOverviewData;
};

export default function LeadOverviewCard({
  lead,
}: LeadOverviewCardProps) {
  const leadScore = clampNumber(lead.score ?? getDefaultScore(lead.status), 0, 100);
  const probability = clampNumber(
    lead.conversionProbability ?? getDefaultProbability(lead.status),
    0,
    100
  );

  const followUpHealth = getFollowUpHealth(lead.followUpDate);
  const summaryLine = [
    lead.requirementType || "General requirement",
    lead.propertyType || "Property not specified",
    lead.location || "Location not specified",
  ].join(" • ");

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Lead Overview
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            A quick business snapshot of this lead’s quality, urgency, and conversion pulse.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Badge label={lead.status} style={getStatusStyle(lead.status)} />
          <Badge label={`${lead.priority} Priority`} style={getPriorityStyle(lead.priority)} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        <MetricCard
          label="Lead Score"
          value={`${leadScore}/100`}
          tone="dark"
          subtext={getLeadScoreText(leadScore)}
        />
        <MetricCard
          label="Conversion Chance"
          value={`${probability}%`}
          tone="green"
          subtext={getProbabilityText(probability)}
        />
        <MetricCard
          label="Follow-Up Health"
          value={followUpHealth.label}
          tone={followUpHealth.tone}
          subtext={followUpHealth.subtext}
        />
        <MetricCard
          label="Lead Source"
          value={lead.source}
          tone="blue"
          subtext="Origin channel of the lead"
        />
      </div>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          background: "#f8fafc",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Requirement Summary
          </div>

          <div
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            {summaryLine}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <InfoRow label="Project" value={lead.project || "Not specified"} />
          <InfoRow label="Budget" value={lead.budget || "Not specified"} />
          <InfoRow label="Assigned To" value={lead.assignedTo || "Unassigned"} />
          <InfoRow label="Follow-Up Date" value={formatDate(lead.followUpDate)} />
          <InfoRow label="Created At" value={formatDateTime(lead.createdAt)} />
          <InfoRow label="Last Updated" value={formatDateTime(lead.updatedAt)} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        <MiniStat
          label="Status Stage"
          value={lead.status}
          helper={getStageHelper(lead.status)}
        />
        <MiniStat
          label="Priority Level"
          value={lead.priority}
          helper={getPriorityHelper(lead.priority)}
        />
        <MiniStat
          label="Budget Strength"
          value={getBudgetStrength(lead.budget)}
          helper="Based on entered budget clarity"
        />
        <MiniStat
          label="Engagement Signal"
          value={getEngagementSignal(lead.status)}
          helper="Estimated from current stage"
        />
      </div>

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Notes Preview
        </div>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#334155",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 14,
            minHeight: 74,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {lead.notes?.trim()
            ? truncateText(lead.notes.trim(), 220)
            : "No notes added yet. Add requirement insights, urgency clues, objections, and budget signals to sharpen follow-up quality."}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  tone,
}: {
  label: string;
  value: string;
  subtext: string;
  tone: "dark" | "green" | "amber" | "red" | "blue";
}) {
  const toneMap: Record<string, { bg: string; text: string; border: string }> = {
    dark: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      text: "#ffffff",
      border: "#0f172a",
    },
    green: {
      bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      text: "#166534",
      border: "#86efac",
    },
    amber: {
      bg: "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)",
      text: "#92400e",
      border: "#fcd34d",
    },
    red: {
      bg: "linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)",
      text: "#b91c1c",
      border: "#fda4af",
    },
    blue: {
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      text: "#1d4ed8",
      border: "#93c5fd",
    },
  };

  const styles = toneMap[tone];

  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${styles.border}`,
        background: styles.bg,
        padding: 16,
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: styles.text,
          opacity: tone === "dark" ? 0.75 : 0.85,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: styles.text,
          lineHeight: 1.15,
          marginBottom: 10,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: styles.text,
          opacity: tone === "dark" ? 0.82 : 0.9,
        }}
      >
        {subtext}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748b",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.5,
          color: "#0f172a",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        borderRadius: 16,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          fontWeight: 700,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: "#64748b",
        }}
      >
        {helper}
      </div>
    </div>
  );
}

function Badge({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "7px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

function getStatusStyle(status: LeadStatus): React.CSSProperties {
  switch (status) {
    case "New":
      return { background: "#dbeafe", color: "#1d4ed8" };
    case "Contacted":
      return { background: "#ede9fe", color: "#6d28d9" };
    case "Qualified":
      return { background: "#dcfce7", color: "#15803d" };
    case "Site Visit":
      return { background: "#fef3c7", color: "#b45309" };
    case "Negotiation":
      return { background: "#fde68a", color: "#92400e" };
    case "Won":
      return { background: "#bbf7d0", color: "#166534" };
    case "Lost":
      return { background: "#fee2e2", color: "#b91c1c" };
    default:
      return { background: "#e2e8f0", color: "#334155" };
  }
}

function getPriorityStyle(priority: LeadPriority): React.CSSProperties {
  switch (priority) {
    case "High":
      return { background: "#fee2e2", color: "#b91c1c" };
    case "Medium":
      return { background: "#fef3c7", color: "#b45309" };
    case "Low":
      return { background: "#dcfce7", color: "#15803d" };
    default:
      return { background: "#e2e8f0", color: "#334155" };
  }
}

function getDefaultScore(status: LeadStatus) {
  switch (status) {
    case "New":
      return 42;
    case "Contacted":
      return 55;
    case "Qualified":
      return 72;
    case "Site Visit":
      return 80;
    case "Negotiation":
      return 88;
    case "Won":
      return 100;
    case "Lost":
      return 18;
    default:
      return 40;
  }
}

function getDefaultProbability(status: LeadStatus) {
  switch (status) {
    case "New":
      return 20;
    case "Contacted":
      return 35;
    case "Qualified":
      return 58;
    case "Site Visit":
      return 72;
    case "Negotiation":
      return 86;
    case "Won":
      return 100;
    case "Lost":
      return 5;
    default:
      return 20;
  }
}

function getLeadScoreText(score: number) {
  if (score >= 85) return "Hot lead with strong closing potential";
  if (score >= 65) return "Promising lead with healthy intent";
  if (score >= 45) return "Moderate lead, needs sharper nurturing";
  return "Weak signal, requires qualification";
}

function getProbabilityText(probability: number) {
  if (probability >= 85) return "Very close to conversion";
  if (probability >= 65) return "Strong deal momentum";
  if (probability >= 40) return "Possible conversion with follow-up";
  return "Low intent or early stage";
}

function getFollowUpHealth(followUpDate?: string): {
  label: string;
  subtext: string;
  tone: "green" | "amber" | "red";
} {
  if (!followUpDate) {
    return {
      label: "No Follow-Up",
      subtext: "Next action is not scheduled yet",
      tone: "red",
    };
  }

  const now = new Date();
  const date = new Date(followUpDate);

  if (Number.isNaN(date.getTime())) {
    return {
      label: "Unknown",
      subtext: "Follow-up date format looks invalid",
      tone: "amber",
    };
  }

  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((dateOnly - nowOnly) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "Overdue",
      subtext: `${Math.abs(diffDays)} day(s) overdue`,
      tone: "red",
    };
  }

  if (diffDays === 0) {
    return {
      label: "Due Today",
      subtext: "Follow-up needs attention today",
      tone: "amber",
    };
  }

  if (diffDays <= 2) {
    return {
      label: "Upcoming",
      subtext: `Scheduled in ${diffDays} day(s)`,
      tone: "amber",
    };
  }

  return {
    label: "On Track",
    subtext: `Scheduled in ${diffDays} day(s)`,
    tone: "green",
  };
}

function getStageHelper(status: LeadStatus) {
  switch (status) {
    case "New":
      return "Freshly entered into pipeline";
    case "Contacted":
      return "Initial connection has started";
    case "Qualified":
      return "Need and intent look promising";
    case "Site Visit":
      return "High engagement stage";
    case "Negotiation":
      return "Commercial discussion in progress";
    case "Won":
      return "Successfully converted";
    case "Lost":
      return "Opportunity no longer active";
    default:
      return "Stage unknown";
  }
}

function getPriorityHelper(priority: LeadPriority) {
  switch (priority) {
    case "High":
      return "Needs quick and strong follow-up";
    case "Medium":
      return "Balanced urgency and effort";
    case "Low":
      return "Can be nurtured gradually";
    default:
      return "Priority not available";
  }
}

function getBudgetStrength(budget?: string) {
  if (!budget?.trim()) return "Unknown";
  if (budget.trim().length >= 10) return "Strong";
  return "Basic";
}

function getEngagementSignal(status: LeadStatus) {
  switch (status) {
    case "Negotiation":
      return "Very High";
    case "Site Visit":
      return "High";
    case "Qualified":
      return "Good";
    case "Contacted":
      return "Moderate";
    case "New":
      return "Early";
    case "Won":
      return "Closed";
    case "Lost":
      return "Dropped";
    default:
      return "Unknown";
  }
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateText(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}