import { useMemo, useState, type CSSProperties } from "react";

export type HighRiskDealStatus =
  | "new"
  | "contacted"
  | "site-visit"
  | "negotiation"
  | "proposal"
  | "follow-up"
  | "stuck"
  | "won"
  | "lost";

export type HighRiskLevel = "critical" | "high" | "medium";

export type HighRiskDealReason =
  | "No recent follow-up"
  | "Price objection"
  | "Budget mismatch"
  | "Competitor pressure"
  | "Documentation pending"
  | "Low engagement"
  | "Site visit not scheduled"
  | "Delayed decision maker"
  | "Loan issue"
  | "Inventory mismatch";

export type HighRiskDealRow = {
  id: string;
  dealCode: string;
  clientName: string;
  projectName: string;
  agentName: string;
  location: string;
  source: string;
  stage: HighRiskDealStatus;
  dealValue: number;
  expectedCloseDate: string;
  lastFollowUpDate: string;
  daysInactive: number;
  riskScore: number;
  riskLevel: HighRiskLevel;
  probabilityPercent: number;
  nextAction?: string;
  primaryReason: HighRiskDealReason;
  secondaryReason?: HighRiskDealReason;
  notes?: string;
};

export type HighRiskDealsTableProps = {
  data?: HighRiskDealRow[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  pageSize?: number;
  currencySymbol?: string;
  onRowClick?: (row: HighRiskDealRow) => void;
  onViewDeal?: (row: HighRiskDealRow) => void;
};

type SortKey =
  | "dealCode"
  | "clientName"
  | "projectName"
  | "agentName"
  | "location"
  | "stage"
  | "dealValue"
  | "expectedCloseDate"
  | "lastFollowUpDate"
  | "daysInactive"
  | "riskScore"
  | "riskLevel"
  | "probabilityPercent"
  | "primaryReason";

type SortDirection = "asc" | "desc";

const DEFAULT_DATA: HighRiskDealRow[] = [
  {
    id: "deal-001",
    dealCode: "MEI-2401",
    clientName: "Ravi Kumar",
    projectName: "Prestige Lakeside Habitat",
    agentName: "Arun Prakash",
    location: "Whitefield",
    source: "Facebook Ads",
    stage: "negotiation",
    dealValue: 12500000,
    expectedCloseDate: "2026-04-28",
    lastFollowUpDate: "2026-04-08",
    daysInactive: 8,
    riskScore: 91,
    riskLevel: "critical",
    probabilityPercent: 38,
    nextAction: "Urgent pricing discussion with decision maker",
    primaryReason: "Price objection",
    secondaryReason: "Delayed decision maker",
    notes: "Client liked property but comparing with competitor project.",
  },
  {
    id: "deal-002",
    dealCode: "MEI-2402",
    clientName: "Sangeetha N",
    projectName: "Sobha Dream Acres",
    agentName: "Priya Nair",
    location: "Panathur",
    source: "Referral",
    stage: "follow-up",
    dealValue: 8200000,
    expectedCloseDate: "2026-04-24",
    lastFollowUpDate: "2026-04-05",
    daysInactive: 11,
    riskScore: 87,
    riskLevel: "critical",
    probabilityPercent: 42,
    nextAction: "Book second site visit with spouse",
    primaryReason: "No recent follow-up",
    secondaryReason: "Low engagement",
    notes: "Lead was hot initially, dropped after loan discussion.",
  },
  {
    id: "deal-003",
    dealCode: "MEI-2403",
    clientName: "Mohammed Iqbal",
    projectName: "Brigade Cornerstone Utopia",
    agentName: "Dinesh Raj",
    location: "Varthur",
    source: "MagicBricks",
    stage: "proposal",
    dealValue: 9800000,
    expectedCloseDate: "2026-05-03",
    lastFollowUpDate: "2026-04-10",
    daysInactive: 6,
    riskScore: 78,
    riskLevel: "high",
    probabilityPercent: 49,
    nextAction: "Rework offer and send payment plan",
    primaryReason: "Budget mismatch",
    secondaryReason: "Competitor pressure",
    notes: "Budget stretch possible if payment plan improves.",
  },
  {
    id: "deal-004",
    dealCode: "MEI-2404",
    clientName: "Deepa Shankar",
    projectName: "Assetz Marq",
    agentName: "Karthik S",
    location: "Whitefield",
    source: "Website",
    stage: "site-visit",
    dealValue: 14500000,
    expectedCloseDate: "2026-04-30",
    lastFollowUpDate: "2026-04-12",
    daysInactive: 4,
    riskScore: 72,
    riskLevel: "high",
    probabilityPercent: 54,
    nextAction: "Reschedule missed site visit",
    primaryReason: "Site visit not scheduled",
    secondaryReason: "Low engagement",
    notes: "Client interested but work travel delayed visit.",
  },
  {
    id: "deal-005",
    dealCode: "MEI-2405",
    clientName: "Lakshmi Devi",
    projectName: "Godrej Splendour",
    agentName: "Harish Kumar",
    location: "Hoskote Road",
    source: "WhatsApp Campaign",
    stage: "contacted",
    dealValue: 6900000,
    expectedCloseDate: "2026-05-08",
    lastFollowUpDate: "2026-04-09",
    daysInactive: 7,
    riskScore: 64,
    riskLevel: "medium",
    probabilityPercent: 58,
    nextAction: "Send comparison brochure and finance options",
    primaryReason: "Documentation pending",
    secondaryReason: "Loan issue",
    notes: "Needs clarity on legal docs and bank eligibility.",
  },
  {
    id: "deal-006",
    dealCode: "MEI-2406",
    clientName: "Vikram Reddy",
    projectName: "Purva Park Hill",
    agentName: "Nisha Thomas",
    location: "Kanakapura Road",
    source: "Google Ads",
    stage: "stuck",
    dealValue: 11300000,
    expectedCloseDate: "2026-04-26",
    lastFollowUpDate: "2026-04-03",
    daysInactive: 13,
    riskScore: 84,
    riskLevel: "critical",
    probabilityPercent: 35,
    nextAction: "Escalate with senior closer",
    primaryReason: "Delayed decision maker",
    secondaryReason: "No recent follow-up",
    notes: "Family approval pending for over a week.",
  },
];

function formatCurrency(value: number, currencySymbol: string): string {
  if (!Number.isFinite(value)) return `${currencySymbol}0`;

  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `${currencySymbol}${(value / 10000000).toFixed(2)}Cr`;
  }

  if (abs >= 100000) {
    return `${currencySymbol}${(value / 100000).toFixed(1)}L`;
  }

  if (abs >= 1000) {
    return `${currencySymbol}${(value / 1000).toFixed(1)}K`;
  }

  return `${currencySymbol}${value.toFixed(0)}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusLabel(stage: HighRiskDealStatus): string {
  switch (stage) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "site-visit":
      return "Site Visit";
    case "negotiation":
      return "Negotiation";
    case "proposal":
      return "Proposal";
    case "follow-up":
      return "Follow-up";
    case "stuck":
      return "Stuck";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    default:
      return stage;
  }
}

function stageTone(stage: HighRiskDealStatus): {
  text: string;
  bg: string;
  border: string;
} {
  switch (stage) {
    case "new":
      return { text: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" };
    case "contacted":
      return { text: "#0f766e", bg: "#ccfbf1", border: "#99f6e4" };
    case "site-visit":
      return { text: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" };
    case "negotiation":
      return { text: "#b45309", bg: "#fef3c7", border: "#fde68a" };
    case "proposal":
      return { text: "#9333ea", bg: "#f3e8ff", border: "#e9d5ff" };
    case "follow-up":
      return { text: "#0369a1", bg: "#e0f2fe", border: "#bae6fd" };
    case "stuck":
      return { text: "#b91c1c", bg: "#fee2e2", border: "#fecaca" };
    case "won":
      return { text: "#166534", bg: "#dcfce7", border: "#bbf7d0" };
    case "lost":
      return { text: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
    default:
      return { text: "#334155", bg: "#f8fafc", border: "#e2e8f0" };
  }
}

function riskTone(level: HighRiskLevel): {
  text: string;
  bg: string;
  border: string;
} {
  switch (level) {
    case "critical":
      return { text: "#b91c1c", bg: "#fee2e2", border: "#fecaca" };
    case "high":
      return { text: "#b45309", bg: "#fef3c7", border: "#fde68a" };
    case "medium":
      return { text: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" };
    default:
      return { text: "#334155", bg: "#f8fafc", border: "#e2e8f0" };
  }
}

function compareDates(a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime();
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function sortRows(
  rows: HighRiskDealRow[],
  sortKey: SortKey,
  direction: SortDirection
): HighRiskDealRow[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;

    switch (sortKey) {
      case "dealCode":
        result = compareText(a.dealCode, b.dealCode);
        break;
      case "clientName":
        result = compareText(a.clientName, b.clientName);
        break;
      case "projectName":
        result = compareText(a.projectName, b.projectName);
        break;
      case "agentName":
        result = compareText(a.agentName, b.agentName);
        break;
      case "location":
        result = compareText(a.location, b.location);
        break;
      case "stage":
        result = compareText(statusLabel(a.stage), statusLabel(b.stage));
        break;
      case "dealValue":
        result = a.dealValue - b.dealValue;
        break;
      case "expectedCloseDate":
        result = compareDates(a.expectedCloseDate, b.expectedCloseDate);
        break;
      case "lastFollowUpDate":
        result = compareDates(a.lastFollowUpDate, b.lastFollowUpDate);
        break;
      case "daysInactive":
        result = a.daysInactive - b.daysInactive;
        break;
      case "riskScore":
        result = a.riskScore - b.riskScore;
        break;
      case "riskLevel":
        result = compareText(a.riskLevel, b.riskLevel);
        break;
      case "probabilityPercent":
        result = a.probabilityPercent - b.probabilityPercent;
        break;
      case "primaryReason":
        result = compareText(a.primaryReason, b.primaryReason);
        break;
      default:
        result = 0;
    }

    return result * sign;
  });
}

function RiskBadge({
  label,
  tone,
}: {
  label: string;
  tone: { text: string; bg: string; border: string };
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 28,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: tone.text,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  align = "left",
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  align?: CSSProperties["textAlign"];
  onClick: (key: SortKey) => void;
}) {
  const isActive = activeKey === sortKey;
  const arrow = isActive ? (direction === "asc" ? "↑" : "↓") : "↕";

  return (
    <th
      style={{
        ...headerCellStyle,
        textAlign: align,
      }}
    >
      <button
        type="button"
        onClick={() => onClick(sortKey)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          color: isActive ? "#111827" : "#475569",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.3,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: 11 }}>{arrow}</span>
      </button>
    </th>
  );
}

function LoadingRow() {
  const shimmerStyle: CSSProperties = {
    height: 12,
    borderRadius: 999,
    background: "#e5e7eb",
    width: "100%",
  };

  return (
    <tr>
      {Array.from({ length: 12 }).map((_, index) => (
        <td key={index} style={bodyCellStyle}>
          <div style={shimmerStyle} />
        </td>
      ))}
    </tr>
  );
}

const containerStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #e5e7eb",
  borderRadius: 20,
  background: "#ffffff",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

const headerCellStyle: CSSProperties = {
  padding: "14px 16px",
  background: "#f8fafc",
  borderBottom: "1px solid #e5e7eb",
  color: "#475569",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  whiteSpace: "nowrap",
};

const bodyCellStyle: CSSProperties = {
  padding: "14px 16px",
  borderBottom: "1px solid #eef2f7",
  fontSize: 13,
  color: "#111827",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

export default function HighRiskDealsTable({
  data = DEFAULT_DATA,
  loading = false,
  title = "High Risk Deals",
  subtitle = "Deals that need immediate attention before they slip out of the pipeline.",
  searchable = true,
  stickyHeader = true,
  maxHeight = 560,
  pageSize = 8,
  currencySymbol = "₹",
  onRowClick,
  onViewDeal,
}: HighRiskDealsTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return data;

    return data.filter((row) => {
      return [
        row.dealCode,
        row.clientName,
        row.projectName,
        row.agentName,
        row.location,
        row.source,
        row.primaryReason,
        row.secondaryReason ?? "",
        row.notes ?? "",
        row.nextAction ?? "",
        statusLabel(row.stage),
        row.riskLevel,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [data, normalizedSearch]);

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortKey, sortDirection),
    [filteredRows, sortKey, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [safePage, sortedRows, pageSize]);

  const summary = useMemo(() => {
    const criticalCount = filteredRows.filter(
      (row) => row.riskLevel === "critical"
    ).length;

    const avgRisk =
      filteredRows.length > 0
        ? Math.round(
            filteredRows.reduce((sum, row) => sum + row.riskScore, 0) /
              filteredRows.length
          )
        : 0;

    const totalValue = filteredRows.reduce((sum, row) => sum + row.dealValue, 0);

    return {
      count: filteredRows.length,
      criticalCount,
      avgRisk,
      totalValue,
    };
  }, [filteredRows]);

  const handleSort = (key: SortKey) => {
    setPage(1);

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(key === "clientName" || key === "projectName" ? "asc" : "desc");
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #e5e7eb",
          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 280 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </div>
          </div>

          {searchable ? (
            <div style={{ minWidth: 260, width: 320, maxWidth: "100%" }}>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search deal, client, project, agent, reason..."
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  padding: "0 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#ffffff",
                }}
              />
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 18,
          }}
        >
          <MetricCard label="Risk Deals" value={String(summary.count)} />
          <MetricCard label="Critical Deals" value={String(summary.criticalCount)} />
          <MetricCard label="Avg Risk Score" value={String(summary.avgRisk)} />
          <MetricCard
            label="Total Deal Value"
            value={formatCurrency(summary.totalValue, currencySymbol)}
          />
        </div>
      </div>

      <div style={{ overflow: "auto", maxHeight }}>
        <table
          style={{
            width: "100%",
            minWidth: 1680,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead
            style={
              stickyHeader
                ? {
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                  }
                : undefined
            }
          >
            <tr>
              <SortableHeader
                label="Deal"
                sortKey="dealCode"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Client"
                sortKey="clientName"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Project"
                sortKey="projectName"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Agent"
                sortKey="agentName"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Location"
                sortKey="location"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Stage"
                sortKey="stage"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Deal Value"
                sortKey="dealValue"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
                align="right"
              />
              <SortableHeader
                label="Expected Close"
                sortKey="expectedCloseDate"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Last Follow-up"
                sortKey="lastFollowUpDate"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Inactive Days"
                sortKey="daysInactive"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
                align="right"
              />
              <SortableHeader
                label="Risk Score"
                sortKey="riskScore"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
                align="right"
              />
              <SortableHeader
                label="Risk Level"
                sortKey="riskLevel"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <SortableHeader
                label="Probability"
                sortKey="probabilityPercent"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
                align="right"
              />
              <SortableHeader
                label="Primary Reason"
                sortKey="primaryReason"
                activeKey={sortKey}
                direction={sortDirection}
                onClick={handleSort}
              />
              <th style={headerCellStyle}>Next Action</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                <LoadingRow key={index} />
              ))
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={16}
                  style={{
                    padding: 36,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#ffffff",
                  }}
                >
                  No high risk deals found for the current search or filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const risk = riskTone(row.riskLevel);
                const stage = stageTone(row.stage);

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#fcfdff",
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                  >
                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 800, color: "#0f172a" }}>
                          {row.dealCode}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {row.source}
                        </span>
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{row.clientName}</span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {row.location}
                        </span>
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          maxWidth: 220,
                          whiteSpace: "normal",
                          lineHeight: 1.45,
                          fontWeight: 700,
                        }}
                      >
                        {row.projectName}
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <span style={{ fontWeight: 700 }}>{row.agentName}</span>
                    </td>

                    <td style={bodyCellStyle}>
                      <span style={{ fontWeight: 700 }}>{row.location}</span>
                    </td>

                    <td style={bodyCellStyle}>
                      <RiskBadge label={statusLabel(row.stage)} tone={stage} />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                        fontWeight: 800,
                      }}
                    >
                      {formatCurrency(row.dealValue, currencySymbol)}
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>
                          {formatDate(row.expectedCloseDate)}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          Target close
                        </span>
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>
                          {formatDate(row.lastFollowUpDate)}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: row.daysInactive >= 10 ? "#b91c1c" : "#64748b",
                            fontWeight: 700,
                          }}
                        >
                          {row.daysInactive} days inactive
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                        fontWeight: 800,
                        color: row.daysInactive >= 10 ? "#b91c1c" : "#0f172a",
                      }}
                    >
                      {row.daysInactive}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 8,
                          minWidth: 96,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 8,
                            borderRadius: 999,
                            background: "#e5e7eb",
                            overflow: "hidden",
                            minWidth: 42,
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max(6, Math.min(100, row.riskScore))}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                row.riskScore >= 85
                                  ? "#ef4444"
                                  : row.riskScore >= 70
                                  ? "#f59e0b"
                                  : "#3b82f6",
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 800 }}>{row.riskScore}</span>
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <RiskBadge
                        label={row.riskLevel.toUpperCase()}
                        tone={risk}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        textAlign: "right",
                        fontWeight: 800,
                      }}
                    >
                      {row.probabilityPercent}%
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          maxWidth: 190,
                          whiteSpace: "normal",
                          lineHeight: 1.45,
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{row.primaryReason}</div>
                        {row.secondaryReason ? (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 4,
                              fontWeight: 600,
                            }}
                          >
                            + {row.secondaryReason}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          maxWidth: 240,
                          whiteSpace: "normal",
                          lineHeight: 1.45,
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          {row.nextAction ?? "—"}
                        </div>
                        {row.notes ? (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 4,
                              fontWeight: 600,
                            }}
                          >
                            {row.notes}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    <td style={bodyCellStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onViewDeal?.(row)}
                          style={{
                            height: 34,
                            padding: "0 12px",
                            borderRadius: 10,
                            border: "1px solid #d1d5db",
                            background: "#ffffff",
                            color: "#0f172a",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          padding: "14px 18px",
          borderTop: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            fontWeight: 700,
          }}
        >
          Showing{" "}
          <span style={{ color: "#111827" }}>
            {sortedRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span style={{ color: "#111827" }}>
            {Math.min(safePage * pageSize, sortedRows.length)}
          </span>{" "}
          of <span style={{ color: "#111827" }}>{sortedRows.length}</span> deals
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: safePage <= 1 ? "#f8fafc" : "#ffffff",
              color: safePage <= 1 ? "#94a3b8" : "#111827",
              fontSize: 12,
              fontWeight: 800,
              cursor: safePage <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          <div
            style={{
              minWidth: 84,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Page {safePage} / {totalPages}
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: safePage >= totalPages ? "#f8fafc" : "#ffffff",
              color: safePage >= totalPages ? "#94a3b8" : "#111827",
              fontSize: 12,
              fontWeight: 800,
              cursor: safePage >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#ffffff",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}