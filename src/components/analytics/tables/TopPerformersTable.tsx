import { useMemo, useState, type CSSProperties } from "react";

export type PerformerStatus = "excellent" | "good" | "average" | "needs-support";
export type PerformerTrend = "up" | "down" | "flat";

export type TopPerformerRow = {
  id: string;
  rank: number;
  agentName: string;
  teamName: string;
  role: string;
  location: string;
  leadsHandled: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  conversionRate: number;
  winRate: number;
  revenue: number;
  pipelineValue: number;
  avgDealSize: number;
  avgResponseTimeHours: number;
  followUpCompliance: number;
  overdueFollowUps: number;
  customerRating: number;
  growthPercent: number;
  trend: PerformerTrend;
  status: PerformerStatus;
  lastActivityDate?: string;
};

export type TopPerformersTableProps = {
  data?: TopPerformerRow[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  pageSize?: number;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  searchable?: boolean;
  currencySymbol?: string;
  compact?: boolean;
  onRowClick?: (row: TopPerformerRow) => void;
};

type SortKey =
  | "rank"
  | "agentName"
  | "teamName"
  | "role"
  | "location"
  | "leadsHandled"
  | "qualifiedLeads"
  | "siteVisits"
  | "dealsClosed"
  | "conversionRate"
  | "winRate"
  | "revenue"
  | "pipelineValue"
  | "avgDealSize"
  | "avgResponseTimeHours"
  | "followUpCompliance"
  | "overdueFollowUps"
  | "customerRating"
  | "growthPercent"
  | "lastActivityDate";

type SortDirection = "asc" | "desc";

const DEFAULT_DATA: TopPerformerRow[] = [
  {
    id: "1",
    rank: 1,
    agentName: "Arun Kumar",
    teamName: "Whitefield Prime",
    role: "Senior Sales Manager",
    location: "Whitefield",
    leadsHandled: 142,
    qualifiedLeads: 91,
    siteVisits: 48,
    dealsClosed: 19,
    conversionRate: 13.4,
    winRate: 39.6,
    revenue: 18200000,
    pipelineValue: 86400000,
    avgDealSize: 957895,
    avgResponseTimeHours: 1.6,
    followUpCompliance: 96,
    overdueFollowUps: 3,
    customerRating: 4.9,
    growthPercent: 18.2,
    trend: "up",
    status: "excellent",
    lastActivityDate: "2026-04-16T09:35:00Z",
  },
  {
    id: "2",
    rank: 2,
    agentName: "Priya Nair",
    teamName: "East Corridor",
    role: "Relationship Manager",
    location: "Varthur",
    leadsHandled: 126,
    qualifiedLeads: 79,
    siteVisits: 42,
    dealsClosed: 16,
    conversionRate: 12.7,
    winRate: 38.1,
    revenue: 15600000,
    pipelineValue: 72100000,
    avgDealSize: 975000,
    avgResponseTimeHours: 1.9,
    followUpCompliance: 93,
    overdueFollowUps: 5,
    customerRating: 4.8,
    growthPercent: 11.4,
    trend: "up",
    status: "excellent",
    lastActivityDate: "2026-04-16T08:50:00Z",
  },
  {
    id: "3",
    rank: 3,
    agentName: "Dinesh Raj",
    teamName: "North Growth",
    role: "Sales Executive",
    location: "Hebbal",
    leadsHandled: 118,
    qualifiedLeads: 68,
    siteVisits: 35,
    dealsClosed: 12,
    conversionRate: 10.2,
    winRate: 34.3,
    revenue: 11800000,
    pipelineValue: 59800000,
    avgDealSize: 983333,
    avgResponseTimeHours: 2.4,
    followUpCompliance: 88,
    overdueFollowUps: 8,
    customerRating: 4.6,
    growthPercent: 6.9,
    trend: "up",
    status: "good",
    lastActivityDate: "2026-04-15T17:10:00Z",
  },
  {
    id: "4",
    rank: 4,
    agentName: "Lakshmi Devi",
    teamName: "South Hub",
    role: "Sales Executive",
    location: "Electronic City",
    leadsHandled: 111,
    qualifiedLeads: 59,
    siteVisits: 28,
    dealsClosed: 9,
    conversionRate: 8.1,
    winRate: 32.1,
    revenue: 8740000,
    pipelineValue: 47100000,
    avgDealSize: 971111,
    avgResponseTimeHours: 3.1,
    followUpCompliance: 84,
    overdueFollowUps: 12,
    customerRating: 4.4,
    growthPercent: -2.8,
    trend: "down",
    status: "average",
    lastActivityDate: "2026-04-15T14:25:00Z",
  },
  {
    id: "5",
    rank: 5,
    agentName: "Mohammed Iqbal",
    teamName: "Central Elite",
    role: "Associate Manager",
    location: "Indiranagar",
    leadsHandled: 97,
    qualifiedLeads: 46,
    siteVisits: 21,
    dealsClosed: 6,
    conversionRate: 6.2,
    winRate: 28.6,
    revenue: 5660000,
    pipelineValue: 32900000,
    avgDealSize: 943333,
    avgResponseTimeHours: 4.3,
    followUpCompliance: 76,
    overdueFollowUps: 18,
    customerRating: 4.1,
    growthPercent: -9.5,
    trend: "down",
    status: "needs-support",
    lastActivityDate: "2026-04-14T18:05:00Z",
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
  return `${value.toFixed(1)}%`;
}

function formatHours(value: number): string {
  return `${value.toFixed(1)}h`;
}

function formatRating(value: number): string {
  return `${value.toFixed(1)}/5`;
}

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function compareText(a?: string, b?: string): number {
  return (a ?? "").localeCompare(b ?? "", undefined, { sensitivity: "base" });
}

function compareNumber(a?: number, b?: number): number {
  return (a ?? 0) - (b ?? 0);
}

function statusTone(status: PerformerStatus) {
  switch (status) {
    case "excellent":
      return {
        label: "Excellent",
        text: "#166534",
        bg: "#dcfce7",
        border: "#86efac",
      };
    case "good":
      return {
        label: "Good",
        text: "#1d4ed8",
        bg: "#dbeafe",
        border: "#93c5fd",
      };
    case "average":
      return {
        label: "Average",
        text: "#b45309",
        bg: "#fef3c7",
        border: "#fcd34d",
      };
    case "needs-support":
      return {
        label: "Needs Support",
        text: "#b91c1c",
        bg: "#fee2e2",
        border: "#fca5a5",
      };
    default:
      return {
        label: "Unknown",
        text: "#334155",
        bg: "#f1f5f9",
        border: "#cbd5e1",
      };
  }
}

function trendTone(trend: PerformerTrend) {
  switch (trend) {
    case "up":
      return {
        symbol: "▲",
        text: "#166534",
        bg: "#dcfce7",
        border: "#86efac",
      };
    case "down":
      return {
        symbol: "▼",
        text: "#b91c1c",
        bg: "#fee2e2",
        border: "#fca5a5",
      };
    case "flat":
      return {
        symbol: "•",
        text: "#475569",
        bg: "#f1f5f9",
        border: "#cbd5e1",
      };
    default:
      return {
        symbol: "•",
        text: "#475569",
        bg: "#f1f5f9",
        border: "#cbd5e1",
      };
  }
}

function sortRows(
  rows: TopPerformerRow[],
  key: SortKey,
  direction: SortDirection
): TopPerformerRow[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;

    switch (key) {
      case "rank":
        result = compareNumber(a.rank, b.rank);
        break;
      case "agentName":
        result = compareText(a.agentName, b.agentName);
        break;
      case "teamName":
        result = compareText(a.teamName, b.teamName);
        break;
      case "role":
        result = compareText(a.role, b.role);
        break;
      case "location":
        result = compareText(a.location, b.location);
        break;
      case "leadsHandled":
        result = compareNumber(a.leadsHandled, b.leadsHandled);
        break;
      case "qualifiedLeads":
        result = compareNumber(a.qualifiedLeads, b.qualifiedLeads);
        break;
      case "siteVisits":
        result = compareNumber(a.siteVisits, b.siteVisits);
        break;
      case "dealsClosed":
        result = compareNumber(a.dealsClosed, b.dealsClosed);
        break;
      case "conversionRate":
        result = compareNumber(a.conversionRate, b.conversionRate);
        break;
      case "winRate":
        result = compareNumber(a.winRate, b.winRate);
        break;
      case "revenue":
        result = compareNumber(a.revenue, b.revenue);
        break;
      case "pipelineValue":
        result = compareNumber(a.pipelineValue, b.pipelineValue);
        break;
      case "avgDealSize":
        result = compareNumber(a.avgDealSize, b.avgDealSize);
        break;
      case "avgResponseTimeHours":
        result = compareNumber(a.avgResponseTimeHours, b.avgResponseTimeHours);
        break;
      case "followUpCompliance":
        result = compareNumber(a.followUpCompliance, b.followUpCompliance);
        break;
      case "overdueFollowUps":
        result = compareNumber(a.overdueFollowUps, b.overdueFollowUps);
        break;
      case "customerRating":
        result = compareNumber(a.customerRating, b.customerRating);
        break;
      case "growthPercent":
        result = compareNumber(a.growthPercent, b.growthPercent);
        break;
      case "lastActivityDate":
        result = compareText(a.lastActivityDate, b.lastActivityDate);
        break;
      default:
        result = 0;
    }

    return result * sign;
  });
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

function LoadingRow({ columns }: { columns: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} style={bodyCellStyle}>
          <div
            style={{
              width: `${Math.max(35, 82 - index * 2)}%`,
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

export default function TopPerformersTable({
  data = DEFAULT_DATA,
  title = "Top Performers",
  subtitle = "Track agent productivity, conversion quality, revenue output, and execution discipline.",
  loading = false,
  pageSize = 8,
  maxHeight = 560,
  stickyHeader = true,
  searchable = true,
  currencySymbol = "₹",
  compact = false,
  onRowClick,
}: TopPerformersTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return data;

    return data.filter((row) =>
      [
        row.agentName,
        row.teamName,
        row.role,
        row.location,
        row.status,
        row.trend,
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
    const totalRevenue = filteredRows.reduce((sum, row) => sum + row.revenue, 0);
    const totalPipeline = filteredRows.reduce(
      (sum, row) => sum + row.pipelineValue,
      0
    );
    const totalClosed = filteredRows.reduce(
      (sum, row) => sum + row.dealsClosed,
      0
    );
    const avgConversion =
      filteredRows.length > 0
        ? filteredRows.reduce((sum, row) => sum + row.conversionRate, 0) /
          filteredRows.length
        : 0;

    return {
      totalRevenue,
      totalPipeline,
      totalClosed,
      avgConversion,
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
      key === "rank"
        ? "asc"
        : key === "agentName" ||
          key === "teamName" ||
          key === "role" ||
          key === "location" ||
          key === "lastActivityDate"
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
                placeholder="Search agent, team, role, location..."
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
            label="Revenue"
            value={formatCompactCurrency(summary.totalRevenue, currencySymbol)}
          />
          <SummaryCard
            label="Pipeline"
            value={formatCompactCurrency(summary.totalPipeline, currencySymbol)}
          />
          <SummaryCard
            label="Deals Closed"
            value={formatNumber(summary.totalClosed)}
          />
          <SummaryCard
            label="Avg Conversion"
            value={formatPercent(summary.avgConversion)}
          />
        </div>
      </div>

      <div style={{ overflow: "auto", maxHeight }}>
        <table
          style={{
            width: "100%",
            minWidth: 1900,
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
                label="Rank"
                sortKey="rank"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Agent"
                sortKey="agentName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Team"
                sortKey="teamName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Role"
                sortKey="role"
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
              <th style={headerCellStyle}>Status</th>
              <th style={headerCellStyle}>Trend</th>
              <SortableHeader
                label="Leads"
                sortKey="leadsHandled"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Qualified"
                sortKey="qualifiedLeads"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Visits"
                sortKey="siteVisits"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Closed"
                sortKey="dealsClosed"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Conversion"
                sortKey="conversionRate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Win Rate"
                sortKey="winRate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Revenue"
                sortKey="revenue"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Pipeline"
                sortKey="pipelineValue"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Avg Deal"
                sortKey="avgDealSize"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Response"
                sortKey="avgResponseTimeHours"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Compliance"
                sortKey="followUpCompliance"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Overdue"
                sortKey="overdueFollowUps"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Rating"
                sortKey="customerRating"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Growth"
                sortKey="growthPercent"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="Last Activity"
                sortKey="lastActivityDate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                <LoadingRow key={index} columns={22} />
              ))
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={22}
                  style={{
                    padding: 36,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#ffffff",
                  }}
                >
                  No performer data found for the current search or filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const status = statusTone(row.status);
                const trend = trendTone(row.trend);
                const growthPositive = row.growthPercent >= 0;

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
                        textAlign: "right",
                        fontWeight: 900,
                        fontSize: 14,
                        color:
                          row.rank <= 3 ? "#7c3aed" : "#0f172a",
                      }}
                    >
                      #{row.rank}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={row.agentName}
                        secondary={`${row.role} • ${row.location}`}
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
                      {row.teamName}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        whiteSpace: "normal",
                        minWidth: 160,
                      }}
                    >
                      {row.role}
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
                          color: status.text,
                          background: status.bg,
                          border: `1px solid ${status.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status.label}
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
                          gap: 6,
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: trend.text,
                          background: trend.bg,
                          border: `1px solid ${trend.border}`,
                        }}
                      >
                        <span>{trend.symbol}</span>
                        <span>{row.trend === "flat" ? "Flat" : row.trend === "up" ? "Up" : "Down"}</span>
                      </span>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      {formatNumber(row.leadsHandled)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      {formatNumber(row.qualifiedLeads)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      {formatNumber(row.siteVisits)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                        fontWeight: 800,
                      }}
                    >
                      {formatNumber(row.dealsClosed)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatPercent(row.conversionRate)}
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
                        primary={formatPercent(row.winRate)}
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
                        primary={formatCompactCurrency(row.revenue, currencySymbol)}
                        secondary={formatNumber(row.revenue)}
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
                          row.pipelineValue,
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
                        primary={formatCompactCurrency(
                          row.avgDealSize,
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
                        primary={formatHours(row.avgResponseTimeHours)}
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
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 100,
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 8,
                            borderRadius: 999,
                            background: "#e5e7eb",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max(
                                6,
                                Math.min(100, row.followUpCompliance)
                              )}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                row.followUpCompliance >= 90
                                  ? "#22c55e"
                                  : row.followUpCompliance >= 80
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 800 }}>
                          {formatPercent(row.followUpCompliance)}
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                        fontWeight: 800,
                        color:
                          row.overdueFollowUps >= 15 ? "#b91c1c" : "#111827",
                      }}
                    >
                      {formatNumber(row.overdueFollowUps)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatRating(row.customerRating)}
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
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                          color: growthPositive ? "#166534" : "#b91c1c",
                          background: growthPositive ? "#dcfce7" : "#fee2e2",
                          border: `1px solid ${
                            growthPositive ? "#86efac" : "#fca5a5"
                          }`,
                        }}
                      >
                        <span>{growthPositive ? "▲" : "▼"}</span>
                        <span>{formatPercent(Math.abs(row.growthPercent))}</span>
                      </span>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={formatDateTime(row.lastActivityDate)}
                        secondary="Recent touch"
                      />
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
          of <span style={{ color: "#111827" }}>{sortedRows.length}</span> performers
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