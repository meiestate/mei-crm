import React, { useEffect, useMemo, useState } from "react";

type ChannelType = "email" | "sms" | "whatsapp" | "call";
type DeliveryStatus =
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "replied"
  | "failed"
  | "bounced";

type CommunicationRecord = {
  id: string;
  subject: string;
  channel: ChannelType;
  templateName?: string;
  campaignName?: string;
  leadName?: string;
  recipient?: string;
  status: DeliveryStatus;
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
};

type DateRangeKey = "7d" | "30d" | "90d" | "all";

type KpiCardProps = {
  title: string;
  value: string;
  sublabel: string;
  accent: string;
};

type ChartBarItem = {
  label: string;
  value: number;
  color?: string;
};

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type CampaignPerformanceRow = {
  campaignName: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  failed: number;
  openRate: number;
  replyRate: number;
};

const STORAGE_KEYS = [
  "mei-crm-communications",
  "mei-crm-messages",
  "mei-crm-email-messages",
  "mei-crm-conversations",
  "mei-crm-campaigns",
];

const mockAnalyticsData: CommunicationRecord[] = [
  {
    id: "COM-1001",
    subject: "Whitefield Premium Villa Launch",
    channel: "email",
    templateName: "Project Launch Email",
    campaignName: "April Villa Push",
    leadName: "Arjun Kumar",
    recipient: "arjun@email.com",
    status: "opened",
    sentAt: "2026-04-13T09:20:00.000Z",
    openedAt: "2026-04-13T09:34:00.000Z",
  },
  {
    id: "COM-1002",
    subject: "Site Visit Reminder",
    channel: "whatsapp",
    templateName: "Visit Reminder WA",
    campaignName: "Site Visit Follow-up",
    leadName: "Priya Sharma",
    recipient: "+919900000001",
    status: "delivered",
    sentAt: "2026-04-12T11:10:00.000Z",
  },
  {
    id: "COM-1003",
    subject: "Pricing Sheet Sent",
    channel: "email",
    templateName: "Pricing Sheet",
    campaignName: "April Villa Push",
    leadName: "Ravi Teja",
    recipient: "ravi@email.com",
    status: "clicked",
    sentAt: "2026-04-11T08:00:00.000Z",
    openedAt: "2026-04-11T08:12:00.000Z",
    clickedAt: "2026-04-11T08:19:00.000Z",
  },
  {
    id: "COM-1004",
    subject: "Offer Closing Tonight",
    channel: "sms",
    templateName: "Urgency SMS",
    campaignName: "Closing Offer Sprint",
    leadName: "Meena",
    recipient: "+919900000002",
    status: "delivered",
    sentAt: "2026-04-10T15:20:00.000Z",
  },
  {
    id: "COM-1005",
    subject: "Callback Attempt",
    channel: "call",
    templateName: "Manual Call",
    campaignName: "Warm Leads Push",
    leadName: "Joseph",
    recipient: "+919900000003",
    status: "replied",
    sentAt: "2026-04-09T10:15:00.000Z",
    repliedAt: "2026-04-09T10:15:00.000Z",
  },
  {
    id: "COM-1006",
    subject: "Hebbal Plot Investment Deck",
    channel: "email",
    templateName: "Investor Deck",
    campaignName: "North Bangalore Push",
    leadName: "Fatima",
    recipient: "fatima@email.com",
    status: "failed",
    sentAt: "2026-04-08T13:40:00.000Z",
  },
  {
    id: "COM-1007",
    subject: "Document Collection Reminder",
    channel: "whatsapp",
    templateName: "Docs Reminder WA",
    campaignName: "Documentation Flow",
    leadName: "Sanjay",
    recipient: "+919900000004",
    status: "replied",
    sentAt: "2026-04-07T16:25:00.000Z",
    repliedAt: "2026-04-07T16:41:00.000Z",
  },
  {
    id: "COM-1008",
    subject: "Pre-Launch Access",
    channel: "email",
    templateName: "VIP Preview",
    campaignName: "Premium Buyers Circle",
    leadName: "Nisha",
    recipient: "nisha@email.com",
    status: "bounced",
    sentAt: "2026-04-06T07:55:00.000Z",
  },
  {
    id: "COM-1009",
    subject: "Loan Assistance Message",
    channel: "sms",
    templateName: "Finance Help SMS",
    campaignName: "Loan Support",
    leadName: "Hari",
    recipient: "+919900000005",
    status: "sent",
    sentAt: "2026-04-05T14:30:00.000Z",
  },
  {
    id: "COM-1010",
    subject: "Visit Confirmation",
    channel: "whatsapp",
    templateName: "Visit Confirm WA",
    campaignName: "Site Visit Follow-up",
    leadName: "Sneha",
    recipient: "+919900000006",
    status: "clicked",
    sentAt: "2026-04-04T09:10:00.000Z",
    clickedAt: "2026-04-04T09:18:00.000Z",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getDateRangeStart(range: DateRangeKey) {
  if (range === "all") {
    return null;
  }

  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const start = new Date(now);

  start.setDate(now.getDate() - days);
  return start;
}

function parseCommunicationRecord(
  raw: Record<string, unknown>,
  index: number
): CommunicationRecord {
  const channelValue = String(
    raw.channel ?? raw.type ?? raw.mode ?? "email"
  ).toLowerCase();

  const validChannel: ChannelType =
    channelValue === "sms" ||
    channelValue === "whatsapp" ||
    channelValue === "call"
      ? channelValue
      : "email";

  const statusValue = String(raw.status ?? raw.deliveryStatus ?? "sent").toLowerCase();

  const validStatuses: DeliveryStatus[] = [
    "sent",
    "delivered",
    "opened",
    "clicked",
    "replied",
    "failed",
    "bounced",
  ];

  const status: DeliveryStatus = validStatuses.includes(statusValue as DeliveryStatus)
    ? (statusValue as DeliveryStatus)
    : "sent";

  const sentAt = String(
    raw.sentAt ?? raw.createdAt ?? raw.timestamp ?? new Date().toISOString()
  );

  return {
    id: String(raw.id ?? `COMM-${index + 1}`),
    subject: String(raw.subject ?? raw.title ?? raw.message ?? "Untitled Communication"),
    channel: validChannel,
    templateName: raw.templateName ? String(raw.templateName) : undefined,
    campaignName: raw.campaignName ? String(raw.campaignName) : undefined,
    leadName: raw.leadName ? String(raw.leadName) : undefined,
    recipient: raw.recipient ? String(raw.recipient) : undefined,
    status,
    sentAt,
    openedAt: raw.openedAt ? String(raw.openedAt) : undefined,
    clickedAt: raw.clickedAt ? String(raw.clickedAt) : undefined,
    repliedAt: raw.repliedAt ? String(raw.repliedAt) : undefined,
  };
}

function loadRecordsFromStorage(): CommunicationRecord[] {
  for (const key of STORAGE_KEYS) {
    try {
      const rawValue = localStorage.getItem(key);

      if (!rawValue) {
        continue;
      }

      const parsed: unknown = JSON.parse(rawValue);

      let sourceArray: unknown[] = [];

      if (Array.isArray(parsed)) {
        sourceArray = parsed;
      } else if (
        parsed &&
        typeof parsed === "object" &&
        "items" in parsed &&
        Array.isArray((parsed as { items?: unknown[] }).items)
      ) {
        sourceArray = (parsed as { items: unknown[] }).items;
      } else if (
        parsed &&
        typeof parsed === "object" &&
        "messages" in parsed &&
        Array.isArray((parsed as { messages?: unknown[] }).messages)
      ) {
        sourceArray = (parsed as { messages: unknown[] }).messages;
      } else if (
        parsed &&
        typeof parsed === "object" &&
        "conversations" in parsed &&
        Array.isArray((parsed as { conversations?: unknown[] }).conversations)
      ) {
        sourceArray = (parsed as { conversations: unknown[] }).conversations;
      }

      const records = sourceArray
        .filter((item: unknown): item is Record<string, unknown> => {
          return typeof item === "object" && item !== null;
        })
        .map((item: Record<string, unknown>, index: number) =>
          parseCommunicationRecord(item, index)
        );

      if (records.length > 0) {
        return records;
      }
    } catch {
      // ignore malformed localStorage values
    }
  }

  return mockAnalyticsData;
}

function getChannelLabel(channel: ChannelType | "all") {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "whatsapp":
      return "WhatsApp";
    case "call":
      return "Calls";
    default:
      return "All Channels";
  }
}

function getStatusColor(status: DeliveryStatus) {
  switch (status) {
    case "sent":
      return "#2563EB";
    case "delivered":
      return "#0891B2";
    case "opened":
      return "#7C3AED";
    case "clicked":
      return "#D97706";
    case "replied":
      return "#059669";
    case "failed":
      return "#DC2626";
    case "bounced":
      return "#9333EA";
    default:
      return "#64748B";
  }
}

function KpiCard({ title, value, sublabel, accent }: KpiCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        minHeight: 118,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: accent,
          opacity: 0.12,
          marginBottom: 12,
        }}
      />
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#475569" }}>{sublabel}</div>
    </div>
  );
}

function MiniBarChart({ items }: { items: ChartBarItem[] }) {
  const max = Math.max(...items.map((item: ChartBarItem) => item.value), 1);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item: ChartBarItem) => (
        <div key={item.label} style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 13,
              color: "#334155",
            }}
          >
            <span>{item.label}</span>
            <strong>{formatNumber(item.value)}</strong>
          </div>
          <div
            style={{
              height: 10,
              width: "100%",
              background: "#E2E8F0",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(item.value / max) * 100}%`,
                background: item.color || "#2563EB",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce(
    (sum: number, segment: DonutSegment) => sum + segment.value,
    0
  ) || 1;

  let cumulative = 0;

  const circles = segments.map((segment: DonutSegment) => {
    const dash = (segment.value / total) * 283;
    const offset = 283 - cumulative;
    cumulative += dash;

    return (
      <circle
        key={segment.label}
        cx="60"
        cy="60"
        r="45"
        fill="transparent"
        stroke={segment.color}
        strokeWidth="14"
        strokeDasharray={`${dash} ${283 - dash}`}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        strokeLinecap="round"
      />
    );
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth="14"
        />
        {circles}
        <text
          x="60"
          y="56"
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill="#0F172A"
        >
          {formatNumber(total)}
        </text>
        <text x="60" y="74" textAnchor="middle" fontSize="11" fill="#64748B">
          total
        </text>
      </svg>

      <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 180 }}>
        {segments.map((segment: DonutSegment) => (
          <div
            key={segment.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: segment.color,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13, color: "#334155" }}>{segment.label}</span>
            </div>
            <strong style={{ fontSize: 13, color: "#0F172A" }}>
              {formatNumber(segment.value)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #F1F5F9",
  fontSize: 14,
  color: "#334155",
};

export default function CommunicationAnalyticsPage() {
  const [records, setRecords] = useState<CommunicationRecord[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setRecords(loadRecordsFromStorage());
  }, []);

  const filteredRecords = useMemo(() => {
    const startDate = getDateRangeStart(dateRange);

    return records.filter((record: CommunicationRecord) => {
      const recordDate = new Date(record.sentAt);

      const matchesChannel =
        selectedChannel === "all" ? true : record.channel === selectedChannel;

      const searchHaystack = [
        record.subject,
        record.templateName,
        record.campaignName,
        record.leadName,
        record.recipient,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.trim()
        ? searchHaystack.includes(searchText.trim().toLowerCase())
        : true;

      const matchesDate = startDate ? recordDate >= startDate : true;

      return matchesChannel && matchesSearch && matchesDate;
    });
  }, [records, selectedChannel, dateRange, searchText]);

  const totals = useMemo(() => {
    const totalSent = filteredRecords.length;
    const delivered = filteredRecords.filter((item: CommunicationRecord) =>
      ["delivered", "opened", "clicked", "replied"].includes(item.status)
    ).length;
    const opened = filteredRecords.filter((item: CommunicationRecord) =>
      ["opened", "clicked", "replied"].includes(item.status)
    ).length;
    const clicked = filteredRecords.filter(
      (item: CommunicationRecord) => item.status === "clicked"
    ).length;
    const replied = filteredRecords.filter(
      (item: CommunicationRecord) => item.status === "replied"
    ).length;
    const failed = filteredRecords.filter((item: CommunicationRecord) =>
      ["failed", "bounced"].includes(item.status)
    ).length;

    const deliveryRate = totalSent ? (delivered / totalSent) * 100 : 0;
    const openRate = totalSent ? (opened / totalSent) * 100 : 0;
    const clickRate = totalSent ? (clicked / totalSent) * 100 : 0;
    const replyRate = totalSent ? (replied / totalSent) * 100 : 0;

    return {
      totalSent,
      delivered,
      opened,
      clicked,
      replied,
      failed,
      deliveryRate,
      openRate,
      clickRate,
      replyRate,
    };
  }, [filteredRecords]);

  const channelBreakdown = useMemo<ChartBarItem[]>(() => {
    const channels: ChannelType[] = ["email", "sms", "whatsapp", "call"];

    return channels.map((channel: ChannelType) => ({
      label: getChannelLabel(channel),
      value: filteredRecords.filter(
        (item: CommunicationRecord) => item.channel === channel
      ).length,
      color:
        channel === "email"
          ? "#2563EB"
          : channel === "sms"
          ? "#06B6D4"
          : channel === "whatsapp"
          ? "#16A34A"
          : "#F59E0B",
    }));
  }, [filteredRecords]);

  const statusBreakdown = useMemo<DonutSegment[]>(() => {
    const statuses: DeliveryStatus[] = [
      "sent",
      "delivered",
      "opened",
      "clicked",
      "replied",
      "failed",
      "bounced",
    ];

    return statuses.map((status: DeliveryStatus) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: filteredRecords.filter(
        (item: CommunicationRecord) => item.status === status
      ).length,
      color: getStatusColor(status),
    }));
  }, [filteredRecords]);

  const topTemplates = useMemo(() => {
    const map = new Map<string, number>();

    filteredRecords.forEach((record: CommunicationRecord) => {
      const key = record.templateName || "Untemplated";
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, count]: [string, number]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredRecords]);

  const campaignPerformance = useMemo<CampaignPerformanceRow[]>(() => {
    const map = new Map<
      string,
      {
        sent: number;
        opened: number;
        clicked: number;
        replied: number;
        failed: number;
      }
    >();

    filteredRecords.forEach((record: CommunicationRecord) => {
      const key = record.campaignName || "General Campaign";

      const existing = map.get(key) || {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        failed: 0,
      };

      existing.sent += 1;

      if (["opened", "clicked", "replied"].includes(record.status)) {
        existing.opened += 1;
      }

      if (record.status === "clicked") {
        existing.clicked += 1;
      }

      if (record.status === "replied") {
        existing.replied += 1;
      }

      if (["failed", "bounced"].includes(record.status)) {
        existing.failed += 1;
      }

      map.set(key, existing);
    });

    return Array.from(map.entries())
      .map(
        ([campaignName, stats]): CampaignPerformanceRow => ({
          campaignName,
          ...stats,
          openRate: stats.sent ? (stats.opened / stats.sent) * 100 : 0,
          replyRate: stats.sent ? (stats.replied / stats.sent) * 100 : 0,
        })
      )
      .sort((a, b) => b.sent - a.sent)
      .slice(0, 8);
  }, [filteredRecords]);

  const recentActivities = useMemo<CommunicationRecord[]>(() => {
    return [...filteredRecords]
      .sort(
        (a: CommunicationRecord, b: CommunicationRecord) =>
          new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      )
      .slice(0, 8);
  }, [filteredRecords]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: 24,
        color: "#0F172A",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            color: "#ffffff",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
                Communications / Analytics
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Communication Analytics Dashboard
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14,
                  opacity: 0.82,
                  maxWidth: 760,
                }}
              >
                Track campaign performance, delivery quality, engagement depth, and
                template effectiveness across email, SMS, WhatsApp, and call activity.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <select
                value={selectedChannel}
                onChange={(event) =>
                  setSelectedChannel(event.target.value as ChannelType | "all")
                }
                style={{
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  padding: "0 12px",
                  outline: "none",
                }}
              >
                <option value="all" style={{ color: "#0F172A" }}>
                  All Channels
                </option>
                <option value="email" style={{ color: "#0F172A" }}>
                  Email
                </option>
                <option value="sms" style={{ color: "#0F172A" }}>
                  SMS
                </option>
                <option value="whatsapp" style={{ color: "#0F172A" }}>
                  WhatsApp
                </option>
                <option value="call" style={{ color: "#0F172A" }}>
                  Calls
                </option>
              </select>

              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value as DateRangeKey)}
                style={{
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  padding: "0 12px",
                  outline: "none",
                }}
              >
                <option value="7d" style={{ color: "#0F172A" }}>
                  Last 7 days
                </option>
                <option value="30d" style={{ color: "#0F172A" }}>
                  Last 30 days
                </option>
                <option value="90d" style={{ color: "#0F172A" }}>
                  Last 90 days
                </option>
                <option value="all" style={{ color: "#0F172A" }}>
                  All time
                </option>
              </select>

              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search subject, campaign, lead..."
                style={{
                  width: 260,
                  maxWidth: "100%",
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  padding: "0 14px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <KpiCard
            title="Messages Sent"
            value={formatNumber(totals.totalSent)}
            sublabel={`${getChannelLabel(selectedChannel)} in selected period`}
            accent="#2563EB"
          />
          <KpiCard
            title="Delivery Rate"
            value={formatPercent(totals.deliveryRate)}
            sublabel={`${formatNumber(totals.delivered)} successfully delivered`}
            accent="#06B6D4"
          />
          <KpiCard
            title="Open Rate"
            value={formatPercent(totals.openRate)}
            sublabel={`${formatNumber(totals.opened)} opened or viewed`}
            accent="#7C3AED"
          />
          <KpiCard
            title="Reply Rate"
            value={formatPercent(totals.replyRate)}
            sublabel={`${formatNumber(totals.replied)} replies captured`}
            accent="#16A34A"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #E2E8F0",
              padding: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Channel Performance
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Compare communication volume across active channels.
              </div>
            </div>
            <MiniBarChart items={channelBreakdown} />
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #E2E8F0",
              padding: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Status Breakdown
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Visibility into delivered, opened, clicked, replied, and failed outcomes.
              </div>
            </div>
            <DonutChart segments={statusBreakdown} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #E2E8F0",
              padding: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Engagement Snapshot
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Quick look at campaign engagement quality.
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {[
                {
                  label: "Delivered",
                  value: totals.delivered,
                  percent: totals.deliveryRate,
                  color: "#0891B2",
                },
                {
                  label: "Opened",
                  value: totals.opened,
                  percent: totals.openRate,
                  color: "#7C3AED",
                },
                {
                  label: "Clicked",
                  value: totals.clicked,
                  percent: totals.clickRate,
                  color: "#D97706",
                },
                {
                  label: "Replied",
                  value: totals.replied,
                  percent: totals.replyRate,
                  color: "#059669",
                },
              ].map(
                (item: {
                  label: string;
                  value: number;
                  percent: number;
                  color: string;
                }) => (
                  <div key={item.label} style={{ display: "grid", gap: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#334155" }}>{item.label}</span>
                      <strong style={{ color: "#0F172A" }}>
                        {formatNumber(item.value)} · {formatPercent(item.percent)}
                      </strong>
                    </div>
                    <div
                      style={{
                        height: 10,
                        background: "#E2E8F0",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(item.percent, 100)}%`,
                          height: "100%",
                          background: item.color,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid #E2E8F0",
              padding: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Top Templates
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Most frequently used messaging templates in the selected window.
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {topTemplates.length === 0 ? (
                <div style={{ fontSize: 14, color: "#64748B" }}>
                  No template data available.
                </div>
              ) : (
                topTemplates.map(
                  (template: { name: string; count: number }, index: number) => (
                    <div
                      key={template.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 14,
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 10,
                            background: "#DBEAFE",
                            color: "#1D4ED8",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#0F172A",
                            }}
                          >
                            {template.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B" }}>
                            Template usage frequency
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#0F172A",
                        }}
                      >
                        {formatNumber(template.count)}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 20, borderBottom: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Campaign Performance Table
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
              Track sends, opens, clicks, replies, and failures by campaign.
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {[
                    "Campaign",
                    "Sent",
                    "Opened",
                    "Clicked",
                    "Replies",
                    "Failed",
                    "Open Rate",
                    "Reply Rate",
                  ].map((heading: string) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        fontSize: 12,
                        letterSpacing: 0.3,
                        color: "#64748B",
                        borderBottom: "1px solid #E2E8F0",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaignPerformance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 24,
                        textAlign: "center",
                        fontSize: 14,
                        color: "#64748B",
                      }}
                    >
                      No campaign records available for the selected filters.
                    </td>
                  </tr>
                ) : (
                  campaignPerformance.map((item: CampaignPerformanceRow) => (
                    <tr key={item.campaignName}>
                      <td
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid #F1F5F9",
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {item.campaignName}
                      </td>
                      <td style={cellStyle}>{formatNumber(item.sent)}</td>
                      <td style={cellStyle}>{formatNumber(item.opened)}</td>
                      <td style={cellStyle}>{formatNumber(item.clicked)}</td>
                      <td style={cellStyle}>{formatNumber(item.replied)}</td>
                      <td style={cellStyle}>{formatNumber(item.failed)}</td>
                      <td style={cellStyle}>{formatPercent(item.openRate)}</td>
                      <td style={cellStyle}>{formatPercent(item.replyRate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 20, borderBottom: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Recent Communication Activity
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
              Latest message-level activity across all tracked communication channels.
            </div>
          </div>

          <div style={{ padding: 18, display: "grid", gap: 12 }}>
            {recentActivities.length === 0 ? (
              <div style={{ fontSize: 14, color: "#64748B" }}>
                No recent communication activity found.
              </div>
            ) : (
              recentActivities.map((activity: CommunicationRecord) => (
                <div
                  key={activity.id}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 16,
                    padding: 16,
                    background: "#FFFFFF",
                    display: "grid",
                    gap: 10,
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
                          fontWeight: 800,
                          color: "#0F172A",
                          marginBottom: 4,
                        }}
                      >
                        {activity.subject}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748B" }}>
                        {activity.leadName || "Unknown Lead"} ·{" "}
                        {activity.recipient || "No recipient"}
                      </div>
                    </div>

                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        color: getStatusColor(activity.status),
                        background: `${getStatusColor(activity.status)}14`,
                        textTransform: "capitalize",
                      }}
                    >
                      {activity.status}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    <span
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: 999,
                        padding: "6px 10px",
                      }}
                    >
                      Channel: {getChannelLabel(activity.channel)}
                    </span>
                    <span
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: 999,
                        padding: "6px 10px",
                      }}
                    >
                      Template: {activity.templateName || "—"}
                    </span>
                    <span
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: 999,
                        padding: "6px 10px",
                      }}
                    >
                      Campaign: {activity.campaignName || "General Campaign"}
                    </span>
                    <span
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: 999,
                        padding: "6px 10px",
                      }}
                    >
                      Sent: {formatDateTime(activity.sentAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}