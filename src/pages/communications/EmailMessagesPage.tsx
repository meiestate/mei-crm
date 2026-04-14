import React, { useEffect, useMemo, useState } from "react";

type MailFolder = "inbox" | "sent" | "drafts" | "scheduled" | "archived" | "trash";
type MailStatus = "read" | "unread" | "sent" | "draft" | "scheduled" | "failed";
type MailPriority = "low" | "medium" | "high";

type EmailMessage = {
  id: string;
  threadId: string;
  folder: MailFolder;
  status: MailStatus;
  priority: MailPriority;
  subject: string;
  preview: string;
  body: string;
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  tags: string[];
  attachmentsCount: number;
  starred: boolean;
  campaignName?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
};

type FolderFilter = MailFolder | "all";
type StatusFilter = MailStatus | "all";
type PriorityFilter = MailPriority | "all";

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

const STORAGE_KEY = "mei-crm-email-messages";

const folderOptions: FilterOption<MailFolder>[] = [
  { label: "All Folders", value: "all" },
  { label: "Inbox", value: "inbox" },
  { label: "Sent", value: "sent" },
  { label: "Drafts", value: "drafts" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Archived", value: "archived" },
  { label: "Trash", value: "trash" },
];

const statusOptions: FilterOption<MailStatus>[] = [
  { label: "All Statuses", value: "all" },
  { label: "Read", value: "read" },
  { label: "Unread", value: "unread" },
  { label: "Sent", value: "sent" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Failed", value: "failed" },
];

const priorityOptions: FilterOption<MailPriority>[] = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const statusByFolder: Record<MailFolder, MailStatus> = {
  inbox: "read",
  sent: "sent",
  drafts: "draft",
  scheduled: "scheduled",
  archived: "read",
  trash: "failed",
};

const defaultMessages: EmailMessage[] = [
  {
    id: "MAIL-1001",
    threadId: "THR-1001",
    folder: "inbox",
    status: "unread",
    priority: "high",
    subject: "Need pricing details for Whitefield project",
    preview:
      "Hi team, please share the latest pricing, floor plan, and availability for the Whitefield property...",
    body:
      "Hi team,\n\nPlease share the latest pricing, floor plan, and availability for the Whitefield property. Also let me know whether there are any launch offers currently available.\n\nRegards,\nArjun",
    fromName: "Arjun Kumar",
    fromEmail: "arjun@example.com",
    toName: "MEI Sales",
    toEmail: "sales@mei.com",
    tags: ["pricing", "whitefield", "new lead"],
    attachmentsCount: 1,
    starred: true,
    createdAt: "2026-04-14T08:25:00.000Z",
    updatedAt: "2026-04-14T08:25:00.000Z",
  },
  {
    id: "MAIL-1002",
    threadId: "THR-1002",
    folder: "sent",
    status: "sent",
    priority: "medium",
    subject: "Brochure shared for Sarjapur gated community",
    preview:
      "Hello, as discussed, I have attached the brochure, pricing sheet, and payment plan for your review...",
    body:
      "Hello,\n\nAs discussed, I have attached the brochure, pricing sheet, and payment plan for your review. Please check and let me know a suitable time for the site visit.\n\nRegards,\nMEI Team",
    fromName: "MEI Sales",
    fromEmail: "sales@mei.com",
    toName: "Priya Sharma",
    toEmail: "priya@example.com",
    tags: ["brochure", "sarjapur"],
    attachmentsCount: 2,
    starred: false,
    campaignName: "Project Follow-up",
    createdAt: "2026-04-13T12:10:00.000Z",
    updatedAt: "2026-04-13T12:15:00.000Z",
  },
  {
    id: "MAIL-1003",
    threadId: "THR-1003",
    folder: "drafts",
    status: "draft",
    priority: "low",
    subject: "Draft: Home loan assistance follow-up",
    preview:
      "Hi {{leadName}}, just checking if you need any help regarding your home loan eligibility...",
    body:
      "Hi {{leadName}},\n\nJust checking if you need any help regarding your home loan eligibility, documentation, or bank options. I can connect you with our finance support team.\n\nRegards,\nMEI Team",
    fromName: "MEI Finance Desk",
    fromEmail: "finance@mei.com",
    toName: "Draft Recipient",
    toEmail: "lead@example.com",
    tags: ["loan", "finance", "draft"],
    attachmentsCount: 0,
    starred: false,
    createdAt: "2026-04-12T09:05:00.000Z",
    updatedAt: "2026-04-14T06:40:00.000Z",
  },
  {
    id: "MAIL-1004",
    threadId: "THR-1004",
    folder: "scheduled",
    status: "scheduled",
    priority: "medium",
    subject: "Tomorrow reminder for site visit",
    preview: "This is a scheduled reminder for your site visit at 11:00 AM tomorrow...",
    body:
      "Hello,\n\nThis is a scheduled reminder for your site visit at 11:00 AM tomorrow. Our executive will meet you at the project entrance.\n\nRegards,\nMEI Team",
    fromName: "MEI CRM",
    fromEmail: "crm@mei.com",
    toName: "Karthik Raj",
    toEmail: "karthik@example.com",
    tags: ["reminder", "scheduled"],
    attachmentsCount: 0,
    starred: true,
    scheduledFor: "2026-04-15T05:30:00.000Z",
    createdAt: "2026-04-14T07:30:00.000Z",
    updatedAt: "2026-04-14T07:35:00.000Z",
  },
  {
    id: "MAIL-1005",
    threadId: "THR-1005",
    folder: "inbox",
    status: "read",
    priority: "medium",
    subject: "Legal document clarification needed",
    preview: "Can you explain the EC and registration flow for this property before booking?",
    body:
      "Hi,\n\nCan you explain the EC and registration flow for this property before booking? I want clarity on the timeline and legal documentation process.\n\nThanks,\nNaveen",
    fromName: "Naveen S",
    fromEmail: "naveen@example.com",
    toName: "MEI Legal Support",
    toEmail: "legal@mei.com",
    tags: ["legal", "documentation"],
    attachmentsCount: 0,
    starred: false,
    createdAt: "2026-04-11T15:10:00.000Z",
    updatedAt: "2026-04-14T04:20:00.000Z",
  },
  {
    id: "MAIL-1006",
    threadId: "THR-1006",
    folder: "trash",
    status: "failed",
    priority: "low",
    subject: "Old campaign message failed",
    preview: "Delivery failed for one or more recipients in this campaign...",
    body:
      "Delivery failed for one or more recipients in this campaign. Please verify the email addresses and retry after correcting invalid addresses.",
    fromName: "MEI Campaign Bot",
    fromEmail: "campaigns@mei.com",
    toName: "Old List",
    toEmail: "unknown@example.com",
    tags: ["campaign", "failed"],
    attachmentsCount: 0,
    starred: false,
    campaignName: "Legacy Promo",
    createdAt: "2026-03-28T10:40:00.000Z",
    updatedAt: "2026-03-28T10:50:00.000Z",
  },
];

function formatDateTime(value?: string): string {
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getFolderLabel(folder: MailFolder): string {
  switch (folder) {
    case "inbox":
      return "Inbox";
    case "sent":
      return "Sent";
    case "drafts":
      return "Drafts";
    case "scheduled":
      return "Scheduled";
    case "archived":
      return "Archived";
    case "trash":
      return "Trash";
    default:
      return folder;
  }
}

function getStatusLabel(status: MailStatus): string {
  switch (status) {
    case "read":
      return "Read";
    case "unread":
      return "Unread";
    case "sent":
      return "Sent";
    case "draft":
      return "Draft";
    case "scheduled":
      return "Scheduled";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function getFolderColor(folder: MailFolder): string {
  switch (folder) {
    case "inbox":
      return "#2563EB";
    case "sent":
      return "#16A34A";
    case "drafts":
      return "#D97706";
    case "scheduled":
      return "#7C3AED";
    case "archived":
      return "#64748B";
    case "trash":
      return "#DC2626";
    default:
      return "#64748B";
  }
}

function getStatusColor(status: MailStatus): string {
  switch (status) {
    case "read":
      return "#0F766E";
    case "unread":
      return "#2563EB";
    case "sent":
      return "#16A34A";
    case "draft":
      return "#D97706";
    case "scheduled":
      return "#7C3AED";
    case "failed":
      return "#DC2626";
    default:
      return "#64748B";
  }
}

function getPriorityColor(priority: MailPriority): string {
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

function isMailFolder(value: unknown): value is MailFolder {
  return (
    value === "inbox" ||
    value === "sent" ||
    value === "drafts" ||
    value === "scheduled" ||
    value === "archived" ||
    value === "trash"
  );
}

function isMailStatus(value: unknown): value is MailStatus {
  return (
    value === "read" ||
    value === "unread" ||
    value === "sent" ||
    value === "draft" ||
    value === "scheduled" ||
    value === "failed"
  );
}

function isMailPriority(value: unknown): value is MailPriority {
  return value === "low" || value === "medium" || value === "high";
}

function isEmailMessage(value: unknown): value is EmailMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<EmailMessage>;

  return (
    typeof message.id === "string" &&
    typeof message.threadId === "string" &&
    isMailFolder(message.folder) &&
    isMailStatus(message.status) &&
    isMailPriority(message.priority) &&
    typeof message.subject === "string" &&
    typeof message.preview === "string" &&
    typeof message.body === "string" &&
    typeof message.fromName === "string" &&
    typeof message.fromEmail === "string" &&
    typeof message.toName === "string" &&
    typeof message.toEmail === "string" &&
    Array.isArray(message.tags) &&
    typeof message.attachmentsCount === "number" &&
    typeof message.starred === "boolean" &&
    typeof message.createdAt === "string" &&
    typeof message.updatedAt === "string"
  );
}

function loadMessages(): EmailMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultMessages;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return defaultMessages;
    }

    const validMessages = parsed.filter(isEmailMessage);

    return validMessages.length > 0 ? validMessages : defaultMessages;
  } catch {
    return defaultMessages;
  }
}

function saveMessages(messages: EmailMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
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

export default function EmailMessagesPage() {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [folderFilter, setFolderFilter] = useState<FolderFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [showStarredOnly, setShowStarredOnly] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");

  useEffect(() => {
    const loadedMessages: EmailMessage[] = loadMessages();
    setMessages(loadedMessages);

    if (loadedMessages.length > 0) {
      setSelectedMessageId(loadedMessages[0].id);
    }
  }, []);

  const filteredMessages: EmailMessage[] = useMemo(() => {
    return messages.filter((message: EmailMessage) => {
      const searchBucket = [
        message.subject,
        message.preview,
        message.body,
        message.fromName,
        message.fromEmail,
        message.toName,
        message.toEmail,
        message.folder,
        message.status,
        message.priority,
        ...message.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.trim()
        ? searchBucket.includes(searchText.trim().toLowerCase())
        : true;

      const matchesFolder =
        folderFilter === "all" ? true : message.folder === folderFilter;

      const matchesStatus =
        statusFilter === "all" ? true : message.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ? true : message.priority === priorityFilter;

      const matchesStarred = showStarredOnly ? message.starred : true;

      return (
        matchesSearch &&
        matchesFolder &&
        matchesStatus &&
        matchesPriority &&
        matchesStarred
      );
    });
  }, [messages, searchText, folderFilter, statusFilter, priorityFilter, showStarredOnly]);

  const selectedMessage: EmailMessage | null = useMemo(() => {
    return (
      filteredMessages.find(
        (message: EmailMessage) => message.id === selectedMessageId
      ) ?? filteredMessages[0] ?? null
    );
  }, [filteredMessages, selectedMessageId]);

  useEffect(() => {
    if (!selectedMessage && filteredMessages.length > 0) {
      setSelectedMessageId(filteredMessages[0].id);
    }
  }, [selectedMessage, filteredMessages]);

  const stats = useMemo(
    () => ({
      total: messages.length,
      inbox: messages.filter((message: EmailMessage) => message.folder === "inbox").length,
      unread: messages.filter((message: EmailMessage) => message.status === "unread").length,
      scheduled: messages.filter((message: EmailMessage) => message.folder === "scheduled")
        .length,
    }),
    [messages]
  );

  function updateMessages(nextMessages: EmailMessage[]): void {
    setMessages(nextMessages);
    saveMessages(nextMessages);
  }

  function handleToggleStar(messageId: string): void {
    const nextMessages: EmailMessage[] = messages.map((message: EmailMessage) =>
      message.id === messageId
        ? {
            ...message,
            starred: !message.starred,
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

  function handleMoveFolder(messageId: string, folder: MailFolder): void {
    const nextMessages: EmailMessage[] = messages.map((message: EmailMessage) =>
      message.id === messageId
        ? {
            ...message,
            folder,
            status: statusByFolder[folder],
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

  function handleMarkAsRead(messageId: string): void {
    const nextMessages: EmailMessage[] = messages.map((message: EmailMessage) =>
      message.id === messageId
        ? {
            ...message,
            status: "read",
            updatedAt: new Date().toISOString(),
          }
        : message
    );

    updateMessages(nextMessages);
  }

  function handleDelete(messageId: string): void {
    const nextMessages: EmailMessage[] = messages.map((message: EmailMessage) =>
      message.id === messageId
        ? {
            ...message,
            folder: "trash",
            status: "failed",
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
                Communications / Email Messages
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Email Messages
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
                Manage inbox, sent, draft, scheduled, and archived communication with
                typed filters, preview, and quick actions.
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
              + Compose Email
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
            title="Total Messages"
            value={formatNumber(stats.total)}
            subtitle="Across all folders"
            accent="#2563EB"
          />
          <StatCard
            title="Inbox Messages"
            value={formatNumber(stats.inbox)}
            subtitle="Active incoming messages"
            accent="#16A34A"
          />
          <StatCard
            title="Unread Messages"
            value={formatNumber(stats.unread)}
            subtitle="Need attention"
            accent="#DC2626"
          />
          <StatCard
            title="Scheduled Emails"
            value={formatNumber(stats.scheduled)}
            subtitle="Queued for later"
            accent="#7C3AED"
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
                  Message Library
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                  Search, filter, and manage your email communication stream.
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(240px, 1fr) repeat(3, minmax(150px, 180px)) auto",
                  gap: 12,
                }}
              >
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search subject, sender, tags..."
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
                  value={folderFilter}
                  onChange={(event) =>
                    setFolderFilter(event.target.value as FolderFilter)
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
                  {folderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
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

                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "#334155",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showStarredOnly}
                    onChange={(event) => setShowStarredOnly(event.target.checked)}
                  />
                  Starred only
                </label>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1120 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Subject</th>
                    <th style={thStyle}>From / To</th>
                    <th style={thStyle}>Folder</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Priority</th>
                    <th style={thStyle}>Tags</th>
                    <th style={thStyle}>Updated</th>
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
                        No messages matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((message: EmailMessage) => {
                      const isSelected = selectedMessageId === message.id;

                      return (
                        <tr
                          key={message.id}
                          onClick={() => setSelectedMessageId(message.id)}
                          style={{
                            background: isSelected ? "#EFF6FF" : "#FFFFFF",
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
                                  {message.subject}
                                </span>

                                {message.starred ? (
                                  <span
                                    style={{
                                      color: "#F59E0B",
                                      fontSize: 14,
                                      fontWeight: 700,
                                    }}
                                  >
                                    ★
                                  </span>
                                ) : null}
                              </div>

                              <div style={{ fontSize: 13, color: "#475569" }}>
                                {message.preview}
                              </div>

                              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                {message.id}
                              </div>
                            </div>
                          </td>

                          <td style={tdStyle}>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div>
                                <strong style={{ color: "#0F172A" }}>From:</strong>{" "}
                                {message.fromName}
                              </div>
                              <div style={{ color: "#64748B", fontSize: 13 }}>
                                {message.fromEmail}
                              </div>
                              <div style={{ marginTop: 4 }}>
                                <strong style={{ color: "#0F172A" }}>To:</strong>{" "}
                                {message.toName}
                              </div>
                              <div style={{ color: "#64748B", fontSize: 13 }}>
                                {message.toEmail}
                              </div>
                            </div>
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getFolderColor(message.folder)}14`,
                                color: getFolderColor(message.folder),
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {getFolderLabel(message.folder)}
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
                              }}
                            >
                              {getStatusLabel(message.status)}
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

                          <td style={tdStyle}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {message.tags.length > 0 ? (
                                message.tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: 999,
                                      background: "#F1F5F9",
                                      color: "#334155",
                                      fontSize: 12,
                                      border: "1px solid #E2E8F0",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: "#94A3B8" }}>—</span>
                              )}
                            </div>
                          </td>

                          <td style={tdStyle}>{formatDateTime(message.updatedAt)}</td>

                          <td style={tdStyle}>
                            <div
                              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleStar(message.id)}
                                style={{
                                  border: "1px solid #CBD5E1",
                                  background: "#FFFFFF",
                                  color: "#334155",
                                  borderRadius: 10,
                                  padding: "8px 10px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                {message.starred ? "Unstar" : "Star"}
                              </button>

                              {message.status === "unread" ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsRead(message.id)}
                                  style={{
                                    border: "none",
                                    background: "#ECFDF5",
                                    color: "#059669",
                                    borderRadius: 10,
                                    padding: "8px 10px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Mark Read
                                </button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => handleMoveFolder(message.id, "archived")}
                                style={{
                                  border: "none",
                                  background: "#F1F5F9",
                                  color: "#475569",
                                  borderRadius: 10,
                                  padding: "8px 10px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Archive
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(message.id)}
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
                                Delete
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
                Message Preview
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                View full email content, sender details, and metadata.
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
                        background: `${getFolderColor(selectedMessage.folder)}14`,
                        color: getFolderColor(selectedMessage.folder),
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {getFolderLabel(selectedMessage.folder)}
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
                      }}
                    >
                      {getStatusLabel(selectedMessage.status)}
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
                      {selectedMessage.subject}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                      Thread: {selectedMessage.threadId}
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
                      <strong>From:</strong> {selectedMessage.fromName} (
                      {selectedMessage.fromEmail})
                    </div>
                    <div>
                      <strong>To:</strong> {selectedMessage.toName} ({selectedMessage.toEmail})
                    </div>
                    <div>
                      <strong>Attachments:</strong> {selectedMessage.attachmentsCount}
                    </div>
                    <div>
                      <strong>Updated:</strong> {formatDateTime(selectedMessage.updatedAt)}
                    </div>
                    {selectedMessage.scheduledFor ? (
                      <div>
                        <strong>Scheduled For:</strong>{" "}
                        {formatDateTime(selectedMessage.scheduledFor)}
                      </div>
                    ) : null}
                    {selectedMessage.campaignName ? (
                      <div>
                        <strong>Campaign:</strong> {selectedMessage.campaignName}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Message Body
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
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                    Tags
                  </div>

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
                  <button
                    type="button"
                    onClick={() => handleToggleStar(selectedMessage.id)}
                    style={{
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      color: "#334155",
                      borderRadius: 12,
                      height: 42,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {selectedMessage.starred ? "Remove Star" : "Add Star"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveFolder(selectedMessage.id, "archived")}
                    style={{
                      border: "none",
                      background: "#E2E8F0",
                      color: "#334155",
                      borderRadius: 12,
                      height: 42,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Move to Archive
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveFolder(selectedMessage.id, "inbox")}
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
                    Move to Inbox
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
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
                    Move to Trash
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, fontSize: 14, color: "#64748B" }}>
                No message selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}