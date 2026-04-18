import { useMemo, useState, type CSSProperties } from "react";

export type SourcePerformanceStatus =
  | "excellent"
  | "good"
  | "average"
  | "poor";

export type SourcePerformanceRow = {
  id: string;
  sourceName: string;
  sourceCategory: string;
  channelType: string;
  leads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  conversionRate: number;
  qualificationRate: number;
  pipelineValue: number;
  revenue: number;
  cost: number;
  roas: number;
  cpl: number;
  cpql: number;
  avgDealSize: number;
  avgResponseTimeHours: number;
  winRate: number;
  growthPercent: number;
  overdueFollowUps: number;
  status: SourcePerformanceStatus;
  lastUpdated?: string;
};

export type SourcePerformanceTableProps = {
  data?: SourcePerformanceRow[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  pageSize?: number;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  searchable?: boolean;
  currencySymbol?: string;
  compact?: boolean;
  onRowClick?: (row: SourcePerformanceRow) => void;
};

type SortKey =
  | "sourceName"
  | "sourceCategory"
  | "channelType"
  | "leads"
  | "qualifiedLeads"
  | "siteVisits"
  | "dealsClosed"
  | "conversionRate"
  | "qualificationRate"
  | "pipelineValue"
  | "revenue"
  | "cost"
  | "roas"
  | "cpl"
  | "cpql"
  | "avgDealSize"
  | "avgResponseTimeHours"
  | "winRate"
  | "growthPercent"
  | "overdueFollowUps";

type SortDirection = "asc" | "desc";

const DEFAULT_DATA: SourcePerformanceRow[] = [
  {
    id: "1",
    sourceName: "Facebook Ads",
    sourceCategory: "Paid Marketing",
    channelType: "Meta",
    leads: 286,
    qualifiedLeads: 154,
    siteVisits: 73,
    dealsClosed: 24,
    conversionRate: 8.4,
    qualificationRate: 53.8,
    pipelineValue: 148000000,
    revenue: 22400000,
    cost: 420000,
    roas: 53.3,
    cpl: 1469,
    cpql: 2727,
    avgDealSize: 933333,
    avgResponseTimeHours: 1.8,
    winRate: 32.9,
    growthPercent: 16.2,
    overdueFollowUps: 9,
    status: "excellent",
    lastUpdated: "2026-04-16T09:40:00Z",
  },
  {
    id: "2",
    sourceName: "Google Ads",
    sourceCategory: "Paid Marketing",
    channelType: "Search",
    leads: 214,
    qualifiedLeads: 116,
    siteVisits: 57,
    dealsClosed: 18,
    conversionRate: 8.4,
    qualificationRate: 54.2,
    pipelineValue: 114000000,
    revenue: 16800000,
    cost: 390000,
    roas: 43.1,
    cpl: 1822,
    cpql: 3362,
    avgDealSize: 933333,
    avgResponseTimeHours: 1.6,
    winRate: 31.6,
    growthPercent: 11.8,
    overdueFollowUps: 7,
    status: "excellent",
    lastUpdated: "2026-04-16T09:25:00Z",
  },
  {
    id: "3",
    sourceName: "Referral Network",
    sourceCategory: "Organic",
    channelType: "Partner",
    leads: 132,
    qualifiedLeads: 87,
    siteVisits: 48,
    dealsClosed: 21,
    conversionRate: 15.9,
    qualificationRate: 65.9,
    pipelineValue: 96800000,
    revenue: 19200000,
    cost: 85000,
    roas: 225.9,
    cpl: 644,
    cpql: 977,
    avgDealSize: 914286,
    avgResponseTimeHours: 2.3,
    winRate: 43.8,
    growthPercent: 19.5,
    overdueFollowUps: 5,
    status: "excellent",
    lastUpdated: "2026-04-16T08:55:00Z",
  },
  {
    id: "4",
    sourceName: "MagicBricks",
    sourceCategory: "Listing Portal",
    channelType: "Marketplace",
    leads: 176,
    qualifiedLeads: 81,
    siteVisits: 36,
    dealsClosed: 10,
    conversionRate: 5.7,
    qualificationRate: 46.0,
    pipelineValue: 72400000,
    revenue: 8600000,
    cost: 240000,
    roas: 35.8,
    cpl: 1364,
    cpql: 2963,
    avgDealSize: 860000,
    avgResponseTimeHours: 3.4,
    winRate: 27.8,
    growthPercent: -4.6,
    overdueFollowUps: 17,
    status: "average",
    lastUpdated: "2026-04-15T17:20:00Z",
  },
  {
    id: "5",
    sourceName: "Website Organic",
    sourceCategory: "Organic",
    channelType: "SEO",
    leads: 154,
    qualifiedLeads: 92,
    siteVisits: 44,
    dealsClosed: 14,
    conversionRate: 9.1,
    qualificationRate: 59.7,
    pipelineValue: 81800000,
    revenue: 12400000,
    cost: 110000,
    roas: 112.7,
    cpl: 714,
    cpql: 1196,
    avgDealSize: 885714,
    avgResponseTimeHours: 2.1,
    winRate: 31.8,
    growthPercent: 13.4,
    overdueFollowUps: 8,
    status: "good",
    lastUpdated: "2026-04-16T07:45:00Z",
  },
  {
    id: "6",
    sourceName: "WhatsApp Campaign",
    sourceCategory: "Outbound",
    channelType: "Broadcast",
    leads: 119,
    qualifiedLeads: 54,
    siteVisits: 19,
    dealsClosed: 5,
    conversionRate: 4.2,
    qualificationRate: 45.4,
    pipelineValue: 38600000,
    revenue: 4100000,
    cost: 95000,
    roas: 43.2,
    cpl: 798,
    cpql: 1759,
    avgDealSize: 820000,
    avgResponseTimeHours: 4.1,
    winRate: 26.3,
    growthPercent: -9.8,
    overdueFollowUps: 21,
    status: "poor",
    lastUpdated: "2026-04-15T15:05:00Z",
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

function formatMultiplier(value: number): string {
  return `${value.toFixed(1)}x`;
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

function getStatusTone(status: SourcePerformanceStatus) {
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
    case "poor":
      return {
        label: "Poor",
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

function compareText(a?: string, b?: string): number {
  return (a ?? "").localeCompare(b ?? "", undefined, { sensitivity: "base" });
}

function compareNumber(a?: number, b?: number): number {
  return (a ?? 0) - (b ?? 0);
}

function sortRows(
  rows: SourcePerformanceRow[],
  key: SortKey,
  direction: SortDirection
): SourcePerformanceRow[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;

    switch (key) {
      case "sourceName":
        result = compareText(a.sourceName, b.sourceName);
        break;
      case "sourceCategory":
        result = compareText(a.sourceCategory, b.sourceCategory);
        break;
      case "channelType":
        result = compareText(a.channelType, b.channelType);
        break;
      case "leads":
        result = compareNumber(a.leads, b.leads);
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
      case "qualificationRate":
        result = compareNumber(a.qualificationRate, b.qualificationRate);
        break;
      case "pipelineValue":
        result = compareNumber(a.pipelineValue, b.pipelineValue);
        break;
      case "revenue":
        result = compareNumber(a.revenue, b.revenue);
        break;
      case "cost":
        result = compareNumber(a.cost, b.cost);
        break;
      case "roas":
        result = compareNumber(a.roas, b.roas);
        break;
      case "cpl":
        result = compareNumber(a.cpl, b.cpl);
        break;
      case "cpql":
        result = compareNumber(a.cpql, b.cpql);
        break;
      case "avgDealSize":
        result = compareNumber(a.avgDealSize, b.avgDealSize);
        break;
      case "avgResponseTimeHours":
        result = compareNumber(a.avgResponseTimeHours, b.avgResponseTimeHours);
        break;
      case "winRate":
        result = compareNumber(a.winRate, b.winRate);
        break;
      case "growthPercent":
        result = compareNumber(a.growthPercent, b.growthPercent);
        break;
      case "overdueFollowUps":
        result = compareNumber(a.overdueFollowUps, b.overdueFollowUps);
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

export default function SourcePerformanceTable({
  data = DEFAULT_DATA,
  title = "Source Performance",
  subtitle = "Compare lead quality, revenue efficiency, response speed, and campaign economics by source.",
  loading = false,
  pageSize = 8,
  maxHeight = 560,
  stickyHeader = true,
  searchable = true,
  currencySymbol = "₹",
  compact = false,
  onRowClick,
}: SourcePerformanceTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return data;

    return data.filter((row) =>
      [
        row.sourceName,
        row.sourceCategory,
        row.channelType,
        row.status,
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
    const totalCost = filteredRows.reduce((sum, row) => sum + row.cost, 0);
    const totalClosed = filteredRows.reduce(
      (sum, row) => sum + row.dealsClosed,
      0
    );
    const avgRoas =
      filteredRows.length > 0
        ? filteredRows.reduce((sum, row) => sum + row.roas, 0) /
          filteredRows.length
        : 0;

    return {
      totalRevenue,
      totalCost,
      totalClosed,
      avgRoas,
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
      key === "sourceName" || key === "sourceCategory" || key === "channelType"
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
                placeholder="Search source, category, channel..."
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
            label="Spend"
            value={formatCompactCurrency(summary.totalCost, currencySymbol)}
          />
          <SummaryCard
            label="Deals Closed"
            value={formatNumber(summary.totalClosed)}
          />
          <SummaryCard
            label="Avg ROAS"
            value={formatMultiplier(summary.avgRoas)}
          />
        </div>
      </div>

      <div style={{ overflow: "auto", maxHeight }}>
        <table
          style={{
            width: "100%",
            minWidth: 2050,
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
                label="Source"
                sortKey="sourceName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Category"
                sortKey="sourceCategory"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Channel"
                sortKey="channelType"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th style={headerCellStyle}>Status</th>
              <SortableHeader
                label="Leads"
                sortKey="leads"
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
                label="Qualification"
                sortKey="qualificationRate"
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
                label="Pipeline"
                sortKey="pipelineValue"
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
                label="Cost"
                sortKey="cost"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="ROAS"
                sortKey="roas"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="CPL"
                sortKey="cpl"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="CPQL"
                sortKey="cpql"
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
                label="Win Rate"
                sortKey="winRate"
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
                label="Overdue"
                sortKey="overdueFollowUps"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <th style={headerCellStyle}>Last Updated</th>
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
                  No source performance data found for the current search or filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => {
                const statusTone = getStatusTone(row.status);
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
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={row.sourceName}
                        secondary={`${row.sourceCategory} • ${row.channelType}`}
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
                      {row.sourceCategory}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                        fontWeight: 700,
                      }}
                    >
                      {row.channelType}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
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
                          color: statusTone.text,
                          background: statusTone.bg,
                          border: `1px solid ${statusTone.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusTone.label}
                      </span>
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell primary={formatNumber(row.leads)} align="right" />
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        textAlign: "right",
                      }}
                    >
                      <MetricCell
                        primary={formatNumber(row.qualifiedLeads)}
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
                        primary={formatPercent(row.qualificationRate)}
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
                        primary={formatNumber(row.siteVisits)}
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
                        primary={formatNumber(row.dealsClosed)}
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
                        primary={formatCompactCurrency(
                          row.pipelineValue,
                          currencySymbol
                        )}
                        secondary={formatNumber(row.pipelineValue)}
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
                        primary={formatCompactCurrency(row.cost, currencySymbol)}
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
                        primary={formatMultiplier(row.roas)}
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
                        primary={formatCompactCurrency(row.cpl, currencySymbol)}
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
                        primary={formatCompactCurrency(row.cpql, currencySymbol)}
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
                        textAlign: "right",
                        color:
                          row.overdueFollowUps >= 15 ? "#b91c1c" : "#111827",
                        fontWeight: 800,
                      }}
                    >
                      {formatNumber(row.overdueFollowUps)}
                    </td>

                    <td
                      style={{
                        ...bodyCellStyle,
                        padding: cellPadding,
                        fontSize: rowFontSize,
                      }}
                    >
                      <MetricCell
                        primary={formatDateTime(row.lastUpdated)}
                        secondary="Synced"
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
          of <span style={{ color: "#111827" }}>{sortedRows.length}</span> sources
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