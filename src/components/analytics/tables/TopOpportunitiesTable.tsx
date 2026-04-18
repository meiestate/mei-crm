import { useMemo, useState, type CSSProperties } from "react";

export type OpportunityStage =
  | "new"
  | "qualified"
  | "proposal"
  | "site-visit"
  | "negotiation"
  | "won"
  | "lost"
  | "stuck";

export type OpportunityPriority = "critical" | "high" | "medium" | "low";

export type TopOpportunityRow = {
  id: string;
  dealCode: string;
  leadName: string;
  projectName: string;
  ownerName: string;
  sourceName: string;
  location: string;
  propertyType: string;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  budget: number;
  expectedRevenue: number;
  probabilityPercent: number;
  weightedValue: number;
  expectedCloseDate: string;
  lastActivityDate: string;
  followUpPendingDays: number;
  riskScore: number;
  notes?: string;
};

export type TopOpportunitiesTableProps = {
  data?: TopOpportunityRow[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  pageSize?: number;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  searchable?: boolean;
  currencySymbol?: string;
  compact?: boolean;
  onRowClick?: (row: TopOpportunityRow) => void;
  onView?: (row: TopOpportunityRow) => void;
};

type SortKey =
  | "dealCode"
  | "leadName"
  | "projectName"
  | "ownerName"
  | "sourceName"
  | "location"
  | "propertyType"
  | "stage"
  | "priority"
  | "budget"
  | "expectedRevenue"
  | "probabilityPercent"
  | "weightedValue"
  | "expectedCloseDate"
  | "lastActivityDate"
  | "followUpPendingDays"
  | "riskScore";

type SortDirection = "asc" | "desc";

const DEFAULT_DATA: TopOpportunityRow[] = [
  {
    id: "1",
    dealCode: "OPP-2401",
    leadName: "Ravi Kumar",
    projectName: "Prestige Lakeside Habitat",
    ownerName: "Arun Prakash",
    sourceName: "Facebook Ads",
    location: "Whitefield",
    propertyType: "Apartment",
    stage: "negotiation",
    priority: "critical",
    budget: 12500000,
    expectedRevenue: 375000,
    probabilityPercent: 78,
    weightedValue: 292500,
    expectedCloseDate: "2026-04-24",
    lastActivityDate: "2026-04-15",
    followUpPendingDays: 1,
    riskScore: 22,
    notes: "Client ready for final price negotiation with family approval in progress.",
  },
  {
    id: "2",
    dealCode: "OPP-2402",
    leadName: "Sangeetha N",
    projectName: "Sobha Dream Acres",
    ownerName: "Priya Nair",
    sourceName: "Referral",
    location: "Panathur",
    propertyType: "Apartment",
    stage: "proposal",
    priority: "high",
    budget: 9800000,
    expectedRevenue: 294000,
    probabilityPercent: 66,
    weightedValue: 194040,
    expectedCloseDate: "2026-04-28",
    lastActivityDate: "2026-04-14",
    followUpPendingDays: 2,
    riskScore: 30,
    notes: "Strong intent. Waiting for revised payment plan.",
  },
  {
    id: "3",
    dealCode: "OPP-2403",
    leadName: "Vikram Reddy",
    projectName: "Assetz Marq",
    ownerName: "Nisha Thomas",
    sourceName: "Google Ads",
    location: "Whitefield",
    propertyType: "Apartment",
    stage: "site-visit",
    priority: "high",
    budget: 14200000,
    expectedRevenue: 426000,
    probabilityPercent: 58,
    weightedValue: 247080,
    expectedCloseDate: "2026-05-03",
    lastActivityDate: "2026-04-13",
    followUpPendingDays: 3,
    riskScore: 38,
    notes: "Second site visit expected this weekend.",
  },
  {
    id: "4",
    dealCode: "OPP-2404",
    leadName: "Lakshmi Devi",
    projectName: "Brigade Cornerstone Utopia",
    ownerName: "Dinesh Raj",
    sourceName: "Website Organic",
    location: "Varthur Road",
    propertyType: "Township",
    stage: "qualified",
    priority: "medium",
    budget: 8700000,
    expectedRevenue: 261000,
    probabilityPercent: 49,
    weightedValue: 127890,
    expectedCloseDate: "2026-05-08",
    lastActivityDate: "2026-04-11",
    followUpPendingDays: 5,
    riskScore: 45,
    notes: "Need sharper loan assistance support.",
  },
  {
    id: "5",
    dealCode: "OPP-2405",
    leadName: "Mohammed Iqbal",
    projectName: "Godrej Splendour",
    ownerName: "Karthik S",
    sourceName: "MagicBricks",
    location: "Belathur",
    propertyType: "Apartment",
    stage: "proposal",
    priority: "medium",
    budget: 7600000,
    expectedRevenue: 228000,
    probabilityPercent: 44,
    weightedValue: 100320,
    expectedCloseDate: "2026-05-12",
    lastActivityDate: "2026-04-10",
    followUpPendingDays: 6,
    riskScore: 51,
    notes: "Budget-sensitive lead. Offer comparison required.",
  },
  {
    id: "6",
    dealCode: "OPP-2406",
    leadName: "Deepa Shankar",
    projectName: "Purva Park Hill",
    ownerName: "Harish Kumar",
    sourceName: "WhatsApp Campaign",
    location: "Kanakapura Road",
    propertyType: "Apartment",
    stage: "qualified",
    priority: "low",
    budget: 6900000,
    expectedRevenue: 207000,
    probabilityPercent: 34,
    weightedValue: 70380,
    expectedCloseDate: "2026-05-18",
    lastActivityDate: "2026-04-08",
    followUpPendingDays: 8,
    riskScore: 61,
    notes: "Cold-ish but still active. Needs closer nurture.",
  },
];

function formatCompactCurrency(value: number, currencySymbol: string): string {
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function compareText(a?: string, b?: string): number {
  return (a ?? "").localeCompare(b ?? "", undefined, { sensitivity: "base" });
}

function compareNumber(a?: number, b?: number): number {
  return (a ?? 0) - (b ?? 0);
}

function stageTone(stage: OpportunityStage) {
  switch (stage) {
    case "new":
      return { label: "New", text: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" };
    case "qualified":
      return { label: "Qualified", text: "#0f766e", bg: "#ccfbf1", border: "#99f6e4" };
    case "proposal":
      return { label: "Proposal", text: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" };
    case "site-visit":
      return { label: "Site Visit", text: "#b45309", bg: "#fef3c7", border: "#fcd34d" };
    case "negotiation":
      return { label: "Negotiation", text: "#be123c", bg: "#ffe4e6", border: "#fda4af" };
    case "won":
      return { label: "Won", text: "#166534", bg: "#dcfce7", border: "#86efac" };
    case "lost":
      return { label: "Lost", text: "#64748b", bg: "#f1f5f9", border: "#cbd5e1" };
    case "stuck":
      return { label: "Stuck", text: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" };
    default:
      return { label: stage, text: "#334155", bg: "#f8fafc", border: "#cbd5e1" };
  }
}

function priorityTone(priority: OpportunityPriority) {
  switch (priority) {
    case "critical":
      return { label: "Critical", text: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" };
    case "high":
      return { label: "High", text: "#b45309", bg: "#fef3c7", border: "#fcd34d" };
    case "medium":
      return { label: "Medium", text: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" };
    case "low":
      return { label: "Low", text: "#166534", bg: "#dcfce7", border: "#86efac" };
    default:
      return { label: priority, text: "#334155", bg: "#f1f5f9", border: "#cbd5e1" };
  }
}

function sortRows(
  rows: TopOpportunityRow[],
  key: SortKey,
  direction: SortDirection
): TopOpportunityRow[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;

    switch (key) {
      case "dealCode":
        result = compareText(a.dealCode, b.dealCode);
        break;
      case "leadName":
        result = compareText(a.leadName, b.leadName);
        break;
      case "projectName":
        result = compareText(a.projectName, b.projectName);
        break;
      case "ownerName":
        result = compareText(a.ownerName, b.ownerName);
        break;
      case "sourceName":
        result = compareText(a.sourceName, b.sourceName);
        break;
      case "location":
        result = compareText(a.location, b.location);
        break;
      case "propertyType":
        result = compareText(a.propertyType, b.propertyType);
        break;
      case "stage":
        result = compareText(stageTone(a.stage).label, stageTone(b.stage).label);
        break;
      case "priority":
        result = compareText(priorityTone(a.priority).label, priorityTone(b.priority).label);
        break;
      case "budget":
        result = compareNumber(a.budget, b.budget);
        break;
      case "expectedRevenue":
        result = compareNumber(a.expectedRevenue, b.expectedRevenue);
        break;
      case "probabilityPercent":
        result = compareNumber(a.probabilityPercent, b.probabilityPercent);
        break;
      case "weightedValue":
        result = compareNumber(a.weightedValue, b.weightedValue);
        break;
      case "expectedCloseDate":
        result = compareText(a.expectedCloseDate, b.expectedCloseDate);
        break;
      case "lastActivityDate":
        result = compareText(a.lastActivityDate, b.lastActivityDate);
        break;
      case "followUpPendingDays":
        result = compareNumber(a.followUpPendingDays, b.followUpPendingDays);
        break;
      case "riskScore":
        result = compareNumber(a.riskScore, b.riskScore);
        break;
      default:
        result = 0;
    }

    return result * sign;
  });
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  align = "left",
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  align?: "left" | "right";
  onSort: (key: SortKey) => void;
}) {
  const isActive = sortKey === activeKey;
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
        onClick={() => onSort(sortKey)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          fontSize: 12,
          fontWeight: 800,
          color: isActive ? "#111827" : "#475569",
          cursor: "pointer",
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

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
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

function MetricCell({
  primary,
  secondary,
  align = "left",
}: {
  primary: string;
  secondary?: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.25,
        }}
      >
        {primary}
      </div>
      {secondary ? (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            fontWeight: 600,
            color: "#64748b",
            lineHeight: 1.25,
          }}
        >
          {secondary}
        </div>
      ) : null}
    </div>
  );
}

function LoadingRow({ columns }: { columns: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} style={bodyCellStyle}>
          <div
            style={{
              width: `${Math.max(35, 80 - index * 2)}%`,
              height: 12,
              borderRadius: 999,
              background: "#e2e8f0",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  background: "#ffffff",
  overflow: "hidden",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
};

const headerCellStyle: CSSProperties = {
  padding: "12px 14px",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.35,
  whiteSpace: "nowrap",
};

const bodyCellStyle: CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #eef2f7",
  fontSize: 13,
  color: "#111827",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

export default function TopOpportunitiesTable({
  data = DEFAULT_DATA,
  title = "Top Opportunities",
  subtitle = "Highest-potential deals ranked by revenue, probability, urgency, and weighted value.",
  loading = false,
  pageSize = 8,
  maxHeight = 560,
  stickyHeader = true,
  searchable = true,
  currencySymbol = "₹",
  compact = false,
  onRowClick,
  onView,
}: TopOpportunitiesTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("weightedValue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return data;

    return data.filter((row) =>
      [
        row.dealCode,
        row.leadName,
        row.projectName,
        row.ownerName,
        row.sourceName,
        row.location,
        row.propertyType,
        row.stage,
        row.priority,
        row.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
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
    const totalBudget = filteredRows.reduce((sum, row) => sum + row.budget, 0);
    const totalExpectedRevenue = filteredRows.reduce(
      (sum, row) => sum + row.expectedRevenue,
      0
    );
    const totalWeightedValue = filteredRows.reduce(
      (sum, row) => sum + row.weightedValue,
      0
    );
    const avgProbability =
      filteredRows.length > 0
        ? filteredRows.reduce((sum, row) => sum + row.probabilityPercent, 0) /
          filteredRows.length
        : 0;

    return {
      totalBudget,
      totalExpectedRevenue,
      totalWeightedValue,
      avgProbability,
    };
  }, [filteredRows]);

  const handleSort = (key: SortKey) => {
    setPage(1);

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(
      key === "dealCode" ||
        key === "leadName" ||
        key === "projectName" ||
        key === "ownerName" ||
        key === "sourceName" ||
        key === "location" ||
        key === "propertyType" ||
        key === "stage" ||
        key === "priority"
        ? "asc"
        : "desc"
    );
  };

  const cellPadding = compact ? "10px 12px" : "14px";
  const rowFontSize = compact ? 12 : 13;

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #e2e8f0",
          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 260 }}>
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
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search deal, lead, project, owner, source..."
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  padding: "0 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
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
          <SummaryCard
            label="Pipeline Budget"
            value={formatCompactCurrency(summary.totalBudget, currencySymbol)}
          />
          <SummaryCard
            label="Expected Revenue"
            value={formatCompactCurrency(summary.totalExpectedRevenue, currencySymbol)}
          />
          <SummaryCard
            label="Weighted Value"
            value={formatCompactCurrency(summary.totalWeightedValue, currencySymbol)}
          />
          <SummaryCard
            label="Avg Probability"
            value={formatPercent(summary.avgProbability)}
          />
        </div>
      </div>

      <div style={{ overflow: "auto", maxHeight }}>
        <table
          style={{
            width: "100%",
            minWidth: 1850,
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
                onSort={handleSort}
              />
              <SortableHeader
                label="Lead"
                sortKey="leadName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Project"
                sortKey="projectName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Owner"
                sortKey="ownerName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Source"
                sortKey="sourceName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Location"
                sortKey="location"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Type"
                sortKey="propertyType"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Stage"
                sortKey="stage"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Priority"
                sortKey="priority"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Budget"
                sortKey="budget"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Revenue"
                sortKey="expectedRevenue"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Probability"
                sortKey="probabilityPercent"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Weighted Value"
                sortKey="weightedValue"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Expected Close"
                sortKey="expectedCloseDate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Last Activity"
                sortKey="lastActivityDate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Pending Days"
                sortKey="followUpPendingDays"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Risk Score"
                sortKey="riskScore"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <th style={headerCellStyle}>Notes</th>
              <th style={headerCellStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                <LoadingRow key={index} columns={19} />
              ))
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={19}
                  style={{
                    padding: 36,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#ffffff",
                  }}
                >
                  No top opportunities found for the current search or filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const stage = stageTone(row.stage);
                const priority = priorityTone(row.priority);

                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#fcfdff",
                      cursor: onRowClick ? "pointer" : "default",
                    }}
                  >
                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={row.dealCode}
                        secondary={row.leadName}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={row.leadName}
                        secondary={row.location}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        whiteSpace: "normal",
                        minWidth: 220,
                      }}
                    >
                      <MetricCell
                        primary={row.projectName}
                        secondary={row.propertyType}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={row.ownerName}
                        secondary={row.sourceName}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        fontWeight: 700,
                      }}
                    >
                      {row.sourceName}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        fontWeight: 700,
                      }}
                    >
                      {row.location}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        fontWeight: 700,
                      }}
                    >
                      {row.propertyType}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 28,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: stage.text,
                          background: stage.bg,
                          border: `1px solid ${stage.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stage.label}
                      </span>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 28,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: priority.text,
                          background: priority.bg,
                          border: `1px solid ${priority.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {priority.label}
                      </span>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatCompactCurrency(row.budget, currencySymbol)}
                        secondary={formatNumber(row.budget)}
                        align="right"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatCompactCurrency(
                          row.expectedRevenue,
                          currencySymbol
                        )}
                        align="right"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatPercent(row.probabilityPercent)}
                        align="right"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatCompactCurrency(
                          row.weightedValue,
                          currencySymbol
                        )}
                        align="right"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={formatDate(row.expectedCloseDate)}
                        secondary="Target close"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={formatDate(row.lastActivityDate)}
                        secondary="Last touch"
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                        fontWeight: 800,
                        color:
                          row.followUpPendingDays >= 5 ? "#b91c1c" : "#111827",
                      }}
                    >
                      {formatNumber(row.followUpPendingDays)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 8,
                          minWidth: 94,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 42,
                            height: 8,
                            borderRadius: 999,
                            background: "#e5e7eb",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max(6, Math.min(100, row.riskScore))}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                row.riskScore >= 70
                                  ? "#ef4444"
                                  : row.riskScore >= 40
                                  ? "#f59e0b"
                                  : "#22c55e",
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 800 }}>{row.riskScore}</span>
                      </div>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        whiteSpace: "normal",
                        minWidth: 240,
                        maxWidth: 280,
                      }}
                    >
                      <MetricCell
                        primary={row.notes ?? "—"}
                        secondary={`Pending ${row.followUpPendingDays} day${
                          row.followUpPendingDays === 1 ? "" : "s"
                        }`}
                      />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                      }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onView?.(row)}
                        style={{
                          height: 34,
                          padding: "0 12px",
                          borderRadius: 10,
                          border: "1px solid #d1d5db",
                          background: "#ffffff",
                          color: "#111827",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
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
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
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
          of <span style={{ color: "#111827" }}>{sortedRows.length}</span> opportunities
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
            style={pagerButtonStyle(safePage <= 1)}
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
            style={pagerButtonStyle(safePage >= totalPages)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function pagerButtonStyle(disabled: boolean): CSSProperties {
  return {
    height: 34,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: disabled ? "#f8fafc" : "#ffffff",
    color: disabled ? "#94a3b8" : "#111827",
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}