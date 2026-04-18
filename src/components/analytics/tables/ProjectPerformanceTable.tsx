import { useMemo, useState, type CSSProperties } from "react";

export type ProjectPerformanceStatus =
  | "excellent"
  | "good"
  | "average"
  | "poor";

export type ProjectPerformanceRow = {
  id: string;
  projectName: string;
  builderName: string;
  location: string;
  propertyType: string;
  totalLeads: number;
  qualifiedLeads: number;
  siteVisits: number;
  dealsClosed: number;
  conversionRate: number;
  pipelineValue: number;
  revenue: number;
  avgDealSize: number;
  avgResponseTimeHours: number;
  overdueFollowUps: number;
  winRate: number;
  growthPercent: number;
  status: ProjectPerformanceStatus;
  lastUpdated?: string;
};

export type ProjectPerformanceTableProps = {
  data?: ProjectPerformanceRow[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  pageSize?: number;
  maxHeight?: number | string;
  stickyHeader?: boolean;
  searchable?: boolean;
  currencySymbol?: string;
  compact?: boolean;
  onRowClick?: (row: ProjectPerformanceRow) => void;
};

type SortKey =
  | "projectName"
  | "builderName"
  | "location"
  | "propertyType"
  | "totalLeads"
  | "qualifiedLeads"
  | "siteVisits"
  | "dealsClosed"
  | "conversionRate"
  | "pipelineValue"
  | "revenue"
  | "avgDealSize"
  | "avgResponseTimeHours"
  | "overdueFollowUps"
  | "winRate"
  | "growthPercent";

type SortDirection = "asc" | "desc";

const DEFAULT_DATA: ProjectPerformanceRow[] = [
  {
    id: "1",
    projectName: "Prestige Lakeside Habitat",
    builderName: "Prestige Group",
    location: "Whitefield",
    propertyType: "Apartment",
    totalLeads: 164,
    qualifiedLeads: 102,
    siteVisits: 56,
    dealsClosed: 21,
    conversionRate: 12.8,
    pipelineValue: 92500000,
    revenue: 15800000,
    avgDealSize: 752381,
    avgResponseTimeHours: 1.9,
    overdueFollowUps: 5,
    winRate: 37.5,
    growthPercent: 18.4,
    status: "excellent",
    lastUpdated: "2026-04-16T09:30:00Z",
  },
  {
    id: "2",
    projectName: "Sobha Dream Acres",
    builderName: "Sobha Ltd",
    location: "Panathur",
    propertyType: "Apartment",
    totalLeads: 141,
    qualifiedLeads: 84,
    siteVisits: 43,
    dealsClosed: 15,
    conversionRate: 10.6,
    pipelineValue: 74800000,
    revenue: 11250000,
    avgDealSize: 750000,
    avgResponseTimeHours: 2.4,
    overdueFollowUps: 8,
    winRate: 34.9,
    growthPercent: 9.7,
    status: "good",
    lastUpdated: "2026-04-16T10:15:00Z",
  },
  {
    id: "3",
    projectName: "Brigade Cornerstone Utopia",
    builderName: "Brigade Group",
    location: "Varthur Road",
    propertyType: "Township",
    totalLeads: 118,
    qualifiedLeads: 63,
    siteVisits: 31,
    dealsClosed: 10,
    conversionRate: 8.5,
    pipelineValue: 63200000,
    revenue: 7860000,
    avgDealSize: 786000,
    avgResponseTimeHours: 3.1,
    overdueFollowUps: 14,
    winRate: 32.2,
    growthPercent: -3.6,
    status: "average",
    lastUpdated: "2026-04-15T17:45:00Z",
  },
  {
    id: "4",
    projectName: "Godrej Splendour",
    builderName: "Godrej Properties",
    location: "Belathur",
    propertyType: "Apartment",
    totalLeads: 97,
    qualifiedLeads: 49,
    siteVisits: 21,
    dealsClosed: 6,
    conversionRate: 6.2,
    pipelineValue: 40800000,
    revenue: 4380000,
    avgDealSize: 730000,
    avgResponseTimeHours: 4.2,
    overdueFollowUps: 19,
    winRate: 28.6,
    growthPercent: -11.8,
    status: "poor",
    lastUpdated: "2026-04-15T14:20:00Z",
  },
  {
    id: "5",
    projectName: "Assetz Marq",
    builderName: "Assetz Property Group",
    location: "Whitefield",
    propertyType: "Apartment",
    totalLeads: 128,
    qualifiedLeads: 75,
    siteVisits: 39,
    dealsClosed: 14,
    conversionRate: 10.9,
    pipelineValue: 68400000,
    revenue: 10800000,
    avgDealSize: 771429,
    avgResponseTimeHours: 2.2,
    overdueFollowUps: 7,
    winRate: 35.9,
    growthPercent: 12.1,
    status: "good",
    lastUpdated: "2026-04-16T08:05:00Z",
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

function getStatusTone(status: ProjectPerformanceStatus) {
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
  rows: ProjectPerformanceRow[],
  key: SortKey,
  direction: SortDirection
): ProjectPerformanceRow[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    let result = 0;

    switch (key) {
      case "projectName":
        result = compareText(a.projectName, b.projectName);
        break;
      case "builderName":
        result = compareText(a.builderName, b.builderName);
        break;
      case "location":
        result = compareText(a.location, b.location);
        break;
      case "propertyType":
        result = compareText(a.propertyType, b.propertyType);
        break;
      case "totalLeads":
        result = compareNumber(a.totalLeads, b.totalLeads);
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
      case "pipelineValue":
        result = compareNumber(a.pipelineValue, b.pipelineValue);
        break;
      case "revenue":
        result = compareNumber(a.revenue, b.revenue);
        break;
      case "avgDealSize":
        result = compareNumber(a.avgDealSize, b.avgDealSize);
        break;
      case "avgResponseTimeHours":
        result = compareNumber(a.avgResponseTimeHours, b.avgResponseTimeHours);
        break;
      case "overdueFollowUps":
        result = compareNumber(a.overdueFollowUps, b.overdueFollowUps);
        break;
      case "winRate":
        result = compareNumber(a.winRate, b.winRate);
        break;
      case "growthPercent":
        result = compareNumber(a.growthPercent, b.growthPercent);
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
              width: `${Math.max(35, 82 - index * 3)}%`,
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

export default function ProjectPerformanceTable({
  data = DEFAULT_DATA,
  title = "Project Performance",
  subtitle = "Compare lead quality, conversion strength, revenue, and follow-up health across projects.",
  loading = false,
  pageSize = 8,
  maxHeight = 560,
  stickyHeader = true,
  searchable = true,
  currencySymbol = "₹",
  compact = false,
  onRowClick,
}: ProjectPerformanceTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return data;

    return data.filter((row) =>
      [
        row.projectName,
        row.builderName,
        row.location,
        row.propertyType,
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
      key === "projectName" ||
        key === "builderName" ||
        key === "location" ||
        key === "propertyType"
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
                placeholder="Search project, builder, location, type..."
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
            minWidth: 1700,
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
                label="Project"
                sortKey="projectName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Builder"
                sortKey="builderName"
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
              <th style={headerCellStyle}>Status</th>
              <SortableHeader
                label="Leads"
                sortKey="totalLeads"
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
                label="Overdue"
                sortKey="overdueFollowUps"
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
              <th style={headerCellStyle}>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                <LoadingRow key={index} columns={18} />
              ))
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={18}
                  style={{
                    padding: 36,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#ffffff",
                  }}
                >
                  No project performance data found for the current search or filters.
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
                        primary={row.projectName}
                        secondary={`${formatNumber(row.totalLeads)} leads`}
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
                        primary={row.builderName}
                        secondary={row.location}
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
                      <MetricCell
                        primary={formatNumber(row.totalLeads)}
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
                        primary={formatNumber(row.qualifiedLeads)}
                        secondary={formatPercent(
                          row.totalLeads > 0
                            ? (row.qualifiedLeads / row.totalLeads) * 100
                            : 0
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
          of <span style={{ color: "#111827" }}>{sortedRows.length}</span> projects
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