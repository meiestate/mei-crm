import React, { useEffect, useMemo, useState } from "react";

type ScheduledChannel = "email" | "sms" | "whatsapp";
type ScheduledStatus = "scheduled" | "paused" | "sent" | "failed" | "cancelled";
type ScheduledPriority = "low" | "medium" | "high";

type ScheduledMessage = {
  id: string;
  title: string;
  subject: string;
  preview: string;
  body: string;
  recipientName: string;
  recipientValue: string;
  channel: ScheduledChannel;
  status: ScheduledStatus;
  priority: ScheduledPriority;
  campaignName?: string;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
};

type ChannelFilter = ScheduledChannel | "all";
type StatusFilter = ScheduledStatus | "all";
type PriorityFilter = ScheduledPriority | "all";

type FilterOption<T extends string> = {
  label: string;
  value: T | "all";
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
};

const STORAGE_KEY = "mei-crm-scheduled-messages";

const channelOptions: FilterOption<ScheduledChannel>[] = [
  { label: "All Channels", value: "all" },
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "WhatsApp", value: "whatsapp" },
];

const statusOptions: FilterOption<ScheduledStatus>[] = [
  { label: "All Statuses", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paused", value: "paused" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const priorityOptions: FilterOption<ScheduledPriority>[] = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const defaultScheduledMessages: ScheduledMessage[] = [
  {
    id: "SCH-1001",
    title: "Whitefield brochure follow-up",
    subject: "Property brochure + price sheet",
    preview:
      "Hi Arjun, sharing the brochure, floor plan, and latest price sheet for your review.",
    body:
      "Hi Arjun,\n\nSharing the brochure, floor plan, and latest price sheet for your review. Let me know your preferred time for a site visit.\n\nRegards,\nMEI Team",
    recipientName: "Arjun Kumar",
    recipientValue: "arjun@example.com",
    channel: "email",
    status: "scheduled",
    priority: "high",
    campaignName: "Whitefield Buyer Follow-up",
    scheduledFor: "2026-04-15T10:00:00.000Z",
    createdAt: "2026-04-14T06:30:00.000Z",
    updatedAt: "2026-04-14T06:30:00.000Z",
    createdBy: "Balraj",
    tags: ["brochure", "buyer", "priority"],
  },
  {
    id: "SCH-1002",
    title: "Site visit reminder",
    subject: "Reminder for tomorrow's site visit",
    preview:
      "Friendly reminder: your site visit is confirmed for tomorrow at 11:00 AM.",
    body:
      "Hello,\n\nFriendly reminder: your site visit is confirmed for tomorrow at 11:00 AM. Our executive will meet you at the entrance.\n\nRegards,\nMEI Team",
    recipientName: "Karthik Raj",
    recipientValue: "+91 9876543210",
    channel: "whatsapp",
    status: "scheduled",
    priority: "medium",
    campaignName: "Visit Reminder",
    scheduledFor: "2026-04-15T05:30:00.000Z",
    createdAt: "2026-04-14T07:00:00.000Z",
    updatedAt: "2026-04-14T07:00:00.000Z",
    createdBy: "CRM Automation",
    tags: ["reminder", "visit"],
  },
  {
    id: "SCH-1003",
    title: "Loan assistance SMS",
    subject: "Home loan support available",
    preview: "Need help with home loan eligibility and documents? We can assist.",
    body:
      "Need help with home loan eligibility and documents? We can assist. Reply YES to connect with our finance desk.",
    recipientName: "Priya Sharma",
    recipientValue: "+91 9000001234",
    channel: "sms",
    status: "paused",
    priority: "low",
    campaignName: "Finance Nurture",
    scheduledFor: "2026-04-16T08:15:00.000Z",
    createdAt: "2026-04-13T11:30:00.000Z",
    updatedAt: "2026-04-14T08:10:00.000Z",
    createdBy: "Finance Desk",
    tags: ["finance", "loan"],
  },
  {
    id: "SCH-1004",
    title: "Price drop alert",
    subject: "Special offer now live",
    preview: "A new limited-time offer is now available for your shortlisted property.",
    body:
      "Hello,\n\nA new limited-time offer is now available for your shortlisted property. Reply or call us to reserve your slot.\n\nRegards,\nMEI Team",
    recipientName: "Naveen S",
    recipientValue: "naveen@example.com",
    channel: "email",
    status: "failed",
    priority: "high",
    campaignName: "Offer Blast",
    scheduledFor: "2026-04-13T04:00:00.000Z",
    createdAt: "2026-04-12T12:00:00.000Z",
    updatedAt: "2026-04-13T04:20:00.000Z",
    createdBy: "Campaign Bot",
    tags: ["offer", "campaign"],
  },
  {
    id: "SCH-1005",
    title: "Weekend inventory update",
    subject: "Updated inventory list",
    preview: "Fresh inventory update with unit availability and revised pricing.",
    body:
      "Hello,\n\nSharing the latest inventory update with unit availability and revised pricing.\n\nRegards,\nMEI Team",
    recipientName: "Suresh B",
    recipientValue: "suresh@example.com",
    channel: "email",
    status: "sent",
    priority: "medium",
    campaignName: "Inventory Push",
    scheduledFor: "2026-04-13T09:00:00.000Z",
    createdAt: "2026-04-12T17:45:00.000Z",
    updatedAt: "2026-04-13T09:02:00.000Z",
    createdBy: "Sales Ops",
    tags: ["inventory", "update"],
  },
  {
    id: "SCH-1006",
    title: "Old nurture sequence",
    subject: "Checking in on your property search",
    preview: "Just checking whether you are still looking for a property in Bangalore.",
    body:
      "Hi,\n\nJust checking whether you are still looking for a property in Bangalore. We can share curated options based on your budget.\n\nRegards,\nMEI Team",
    recipientName: "Rahul Menon",
    recipientValue: "+91 9898989898",
    channel: "whatsapp",
    status: "cancelled",
    priority: "low",
    campaignName: "Old Nurture",
    scheduledFor: "2026-04-10T10:00:00.000Z",
    createdAt: "2026-04-09T13:10:00.000Z",
    updatedAt: "2026-04-10T08:50:00.000Z",
    createdBy: "Automation",
    tags: ["nurture"],
  },
];

function isScheduledChannel(value: unknown): value is ScheduledChannel {
  return value === "email" || value === "sms" || value === "whatsapp";
}

function isScheduledStatus(value: unknown): value is ScheduledStatus {
  return (
    value === "scheduled" ||
    value === "paused" ||
    value === "sent" ||
    value === "failed" ||
    value === "cancelled"
  );
}

function isScheduledPriority(value: unknown): value is ScheduledPriority {
  return value === "low" || value === "medium" || value === "high";
}

function isScheduledMessage(value: unknown): value is ScheduledMessage {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<ScheduledMessage>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.subject === "string" &&
    typeof item.preview === "string" &&
    typeof item.body === "string" &&
    typeof item.recipientName === "string" &&
    typeof item.recipientValue === "string" &&
    isScheduledChannel(item.channel) &&
    isScheduledStatus(item.status) &&
    isScheduledPriority(item.priority) &&
    typeof item.scheduledFor === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" &&
    typeof item.createdBy === "string" &&
    Array.isArray(item.tags)
  );
}

function loadScheduledMessages(): ScheduledMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return defaultScheduledMessages;

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return defaultScheduledMessages;

    const valid = parsed.filter(isScheduledMessage);

    return valid.length ? valid : defaultScheduledMessages;
  } catch {
    return defaultScheduledMessages;
  }
}

function saveScheduledMessages(messages: ScheduledMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getChannelLabel(channel: ScheduledChannel): string {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "whatsapp":
      return "WhatsApp";
    default:
      return channel;
  }
}

function getChannelColor(channel: ScheduledChannel): string {
  switch (channel) {
    case "email":
      return "#2563EB";
    case "sms":
      return "#D97706";
    case "whatsapp":
      return "#16A34A";
    default:
      return "#64748B";
  }
}

function getStatusColor(status: ScheduledStatus): string {
  switch (status) {
    case "scheduled":
      return "#2563EB";
    case "paused":
      return "#D97706";
    case "sent":
      return "#16A34A";
    case "failed":
      return "#DC2626";
    case "cancelled":
      return "#64748B";
    default:
      return "#64748B";
  }
}

function getPriorityColor(priority: ScheduledPriority): string {
  switch (priority) {
    case "low":
      return "#64748B";
    case "medium":
      return "#D97706";
    case "high":
      return "#DC2626";
    default:
      return "#64748B";
  }
}

function isOverdue(item: ScheduledMessage): boolean {
  return item.status === "scheduled" && new Date(item.scheduledFor).getTime() < Date.now();
}

function StatCard({ title, value, subtitle, accent }: StatCardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: accent,
          opacity: 0.14,
          marginBottom: 12,
        }}
      />
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#475569" }}>{subtitle}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: 12,
  letterSpacing: 0.3,
  color: "#64748B",
  borderBottom: "1px solid #E2E8F0",
  background: "#F8FAFC",
};

const tdStyle: React.CSSProperties = {
  padding: "16px",
  fontSize: 14,
  color: "#334155",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "top",
};

export default function ScheduledMessagesPage() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");

  useEffect(() => {
    const loaded = loadScheduledMessages();
    setMessages(loaded);

    if (loaded.length > 0) {
      setSelectedMessageId(loaded[0].id);
    }
  }, []);

  function updateMessages(nextMessages: ScheduledMessage[]): void {
    setMessages(nextMessages);
    saveScheduledMessages(nextMessages);
  }

  const filteredMessages: ScheduledMessage[] = useMemo(() => {
    return messages.filter((message: ScheduledMessage) => {
      const searchBucket = [
        message.title,
        message.subject,
        message.preview,
        message.body,
        message.recipientName,
        message.recipientValue,
        message.channel,
        message.status,
        message.priority,
        message.createdBy,
        message.campaignName ?? "",
        ...message.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.trim()
        ? searchBucket.includes(searchText.trim().toLowerCase())
        : true;

      const matchesChannel =
        channelFilter === "all" ? true : message.channel === channelFilter;

      const matchesStatus =
        statusFilter === "all" ? true : message.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ? true : message.priority === priorityFilter;

      return matchesSearch && matchesChannel && matchesStatus && matchesPriority;
    });
  }, [messages, searchText, channelFilter, statusFilter, priorityFilter]);

  const selectedMessage: ScheduledMessage | null = useMemo(() => {
    return (
      filteredMessages.find((message: ScheduledMessage) => message.id === selectedMessageId) ??
      filteredMessages[0] ??
      null
    );
  }, [filteredMessages, selectedMessageId]);

  useEffect(() => {
    if (!selectedMessage && filteredMessages.length > 0) {
      setSelectedMessageId(filteredMessages[0].id);
    }
  }, [selectedMessage, filteredMessages]);

  const stats = useMemo(() => {
    const total = messages.length;
    const scheduled = messages.filter(
      (message: ScheduledMessage) => message.status === "scheduled"
    ).length;
    const paused = messages.filter(
      (message: ScheduledMessage) => message.status === "paused"
    ).length;
    const overdue = messages.filter((message: ScheduledMessage) => isOverdue(message)).length;

    return { total, scheduled, paused, overdue };
  }, [messages]);

  function handlePause(messageId: string): void {
    const nextMessages: ScheduledMessage[] = messages.map((message: ScheduledMessage) =>
      message.id === messageId && message.status === "scheduled"
        ? {
            ...message,
            status: "paused",
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

  function handleResume(messageId: string): void {
    const nextMessages: ScheduledMessage[] = messages.map((message: ScheduledMessage) =>
      message.id === messageId && message.status === "paused"
        ? {
            ...message,
            status: "scheduled",
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

  function handleCancel(messageId: string): void {
    const nextMessages: ScheduledMessage[] = messages.map((message: ScheduledMessage) =>
      message.id === messageId
        ? {
            ...message,
            status: "cancelled",
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

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
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            borderRadius: 24,
            padding: 24,
            color: "#FFFFFF",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 14, opacity: 0.82, marginBottom: 8 }}>
                Communications / Scheduled Messages
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Scheduled Messages
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14,
                  lineHeight: 1.6,
                  opacity: 0.84,
                  maxWidth: 760,
                }}
              >
                Track all queued communication across email, SMS, and WhatsApp with
                schedule timing, delivery state, and quick control actions.
              </p>
            </div>

            <button
              type="button"
              style={{
                border: "none",
                borderRadius: 14,
                background: "#2563EB",
                color: "#FFFFFF",
                height: 46,
                padding: "0 18px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.24)",
              }}
            >
              + Schedule Message
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            title="Total Scheduled Items"
            value={formatNumber(stats.total)}
            subtitle="All planned communication"
            accent="#2563EB"
          />
          <StatCard
            title="Active Scheduled"
            value={formatNumber(stats.scheduled)}
            subtitle="Ready to be sent"
            accent="#16A34A"
          />
          <StatCard
            title="Paused Messages"
            value={formatNumber(stats.paused)}
            subtitle="Waiting for resume"
            accent="#D97706"
          />
          <StatCard
            title="Overdue Queue"
            value={formatNumber(stats.overdue)}
            subtitle="Need attention now"
            accent="#DC2626"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.45fr 0.95fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 18,
                borderBottom: "1px solid #E2E8F0",
                display: "grid",
                gap: 14,
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                  Queue Overview
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                  Filter by channel, status, and priority to monitor all scheduled outreach.
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(240px, 1fr) repeat(3, minmax(150px, 180px))",
                  gap: 12,
                }}
              >
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search title, subject, recipient, tags..."
                  style={{
                    height: 42,
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    padding: "0 14px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />

                <select
                  value={channelFilter}
                  onChange={(event) =>
                    setChannelFilter(event.target.value as ChannelFilter)
                  }
                  style={{
                    height: 42,
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                >
                  {channelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  style={{
                    height: 42,
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as PriorityFilter)
                  }
                  style={{
                    height: 42,
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1120 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Message</th>
                    <th style={thStyle}>Recipient</th>
                    <th style={thStyle}>Channel</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Priority</th>
                    <th style={thStyle}>Scheduled For</th>
                    <th style={thStyle}>Created By</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: 24,
                          textAlign: "center",
                          color: "#64748B",
                          fontSize: 14,
                        }}
                      >
                        No scheduled messages matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((message: ScheduledMessage) => {
                      const selected = selectedMessageId === message.id;
                      const overdue = isOverdue(message);

                      return (
                        <tr
                          key={message.id}
                          onClick={() => setSelectedMessageId(message.id)}
                          style={{
                            background: selected ? "#EFF6FF" : "#FFFFFF",
                            cursor: "pointer",
                          }}
                        >
                          <td style={tdStyle}>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                  }}
                                >
                                  {message.title}
                                </span>

                                {overdue ? (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      padding: "4px 8px",
                                      borderRadius: 999,
                                      background: "#FEE2E2",
                                      color: "#B91C1C",
                                      fontSize: 11,
                                      fontWeight: 800,
                                    }}
                                  >
                                    Overdue
                                  </span>
                                ) : null}
                              </div>

                              <div style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>
                                {message.subject}
                              </div>

                              <div style={{ fontSize: 13, color: "#475569" }}>
                                {message.preview}
                              </div>

                              <div style={{ fontSize: 12, color: "#94A3B8" }}>{message.id}</div>
                            </div>
                          </td>

                          <td style={tdStyle}>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div style={{ color: "#0F172A", fontWeight: 700 }}>
                                {message.recipientName}
                              </div>
                              <div style={{ fontSize: 13, color: "#64748B" }}>
                                {message.recipientValue}
                              </div>
                              {message.campaignName ? (
                                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                  Campaign: {message.campaignName}
                                </div>
                              ) : null}
                            </div>
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getChannelColor(message.channel)}14`,
                                color: getChannelColor(message.channel),
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {getChannelLabel(message.channel)}
                            </span>
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getStatusColor(message.status)}14`,
                                color: getStatusColor(message.status),
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "capitalize",
                              }}
                            >
                              {message.status}
                            </span>
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getPriorityColor(message.priority)}14`,
                                color: getPriorityColor(message.priority),
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "capitalize",
                              }}
                            >
                              {message.priority}
                            </span>
                          </td>

                          <td style={tdStyle}>{formatDateTime(message.scheduledFor)}</td>
                          <td style={tdStyle}>{message.createdBy}</td>

                          <td style={tdStyle}>
                            <div
                              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                              onClick={(event) => event.stopPropagation()}
                            >
                              {message.status === "scheduled" ? (
                                <button
                                  type="button"
                                  onClick={() => handlePause(message.id)}
                                  style={{
                                    border: "none",
                                    background: "#FEF3C7",
                                    color: "#B45309",
                                    borderRadius: 10,
                                    padding: "8px 10px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Pause
                                </button>
                              ) : null}

                              {message.status === "paused" ? (
                                <button
                                  type="button"
                                  onClick={() => handleResume(message.id)}
                                  style={{
                                    border: "none",
                                    background: "#DBEAFE",
                                    color: "#1D4ED8",
                                    borderRadius: 10,
                                    padding: "8px 10px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Resume
                                </button>
                              ) : null}

                              {message.status !== "cancelled" && message.status !== "sent" ? (
                                <button
                                  type="button"
                                  onClick={() => handleCancel(message.id)}
                                  style={{
                                    border: "none",
                                    background: "#FEE2E2",
                                    color: "#B91C1C",
                                    borderRadius: 10,
                                    padding: "8px 10px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              position: "sticky",
              top: 24,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 20,
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 18,
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                Schedule Preview
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Full schedule details, content preview, and control actions.
              </div>
            </div>

            {selectedMessage ? (
              <div style={{ padding: 18, display: "grid", gap: 16 }}>
                <div
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 16,
                    padding: 16,
                    background: "#F8FAFC",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: `${getChannelColor(selectedMessage.channel)}14`,
                        color: getChannelColor(selectedMessage.channel),
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {getChannelLabel(selectedMessage.channel)}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: `${getStatusColor(selectedMessage.status)}14`,
                        color: getStatusColor(selectedMessage.status),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedMessage.status}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: `${getPriorityColor(selectedMessage.priority)}14`,
                        color: getPriorityColor(selectedMessage.priority),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedMessage.priority}
                    </span>

                    {isOverdue(selectedMessage) ? (
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "#FEE2E2",
                          color: "#B91C1C",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        Overdue
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#0F172A",
                        lineHeight: 1.3,
                      }}
                    >
                      {selectedMessage.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#334155",
                        fontWeight: 700,
                        marginTop: 8,
                      }}
                    >
                      {selectedMessage.subject}
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: 12,
                      padding: 12,
                      background: "#FFFFFF",
                      display: "grid",
                      gap: 8,
                      fontSize: 14,
                      color: "#334155",
                    }}
                  >
                    <div>
                      <strong>Recipient:</strong> {selectedMessage.recipientName}
                    </div>
                    <div>
                      <strong>Address / Number:</strong> {selectedMessage.recipientValue}
                    </div>
                    <div>
                      <strong>Scheduled For:</strong> {formatDateTime(selectedMessage.scheduledFor)}
                    </div>
                    <div>
                      <strong>Created By:</strong> {selectedMessage.createdBy}
                    </div>
                    <div>
                      <strong>Created At:</strong> {formatDateTime(selectedMessage.createdAt)}
                    </div>
                    <div>
                      <strong>Updated At:</strong> {formatDateTime(selectedMessage.updatedAt)}
                    </div>
                    {selectedMessage.campaignName ? (
                      <div>
                        <strong>Campaign:</strong> {selectedMessage.campaignName}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Preview
                    </div>
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                        fontSize: 14,
                        color: "#334155",
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 12,
                        padding: 14,
                      }}
                    >
                      {selectedMessage.body}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 16,
                    padding: 16,
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Tags</div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedMessage.tags.length > 0 ? (
                      selectedMessage.tags.map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: "#EFF6FF",
                            color: "#1D4ED8",
                            border: "1px solid #BFDBFE",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 13, color: "#94A3B8" }}>No tags added.</span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  {selectedMessage.status === "scheduled" ? (
                    <button
                      type="button"
                      onClick={() => handlePause(selectedMessage.id)}
                      style={{
                        border: "none",
                        background: "#FEF3C7",
                        color: "#B45309",
                        borderRadius: 12,
                        height: 42,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Pause Schedule
                    </button>
                  ) : null}

                  {selectedMessage.status === "paused" ? (
                    <button
                      type="button"
                      onClick={() => handleResume(selectedMessage.id)}
                      style={{
                        border: "none",
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        borderRadius: 12,
                        height: 42,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Resume Schedule
                    </button>
                  ) : null}

                  {selectedMessage.status !== "cancelled" &&
                  selectedMessage.status !== "sent" ? (
                    <button
                      type="button"
                      onClick={() => handleCancel(selectedMessage.id)}
                      style={{
                        border: "none",
                        background: "#FEE2E2",
                        color: "#B91C1C",
                        borderRadius: 12,
                        height: 42,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Cancel Schedule
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, fontSize: 14, color: "#64748B" }}>
                No scheduled message selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}