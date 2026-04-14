import React, { useEffect, useMemo, useState } from "react";

type TemplateChannel = "email" | "sms" | "whatsapp";
type TemplateStatus = "active" | "draft" | "archived";
type TemplateCategory =
  | "follow_up"
  | "promotion"
  | "reminder"
  | "welcome"
  | "support"
  | "custom";

type CommunicationTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
  channel: TemplateChannel;
  category: TemplateCategory;
  status: TemplateStatus;
  variables: string[];
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
};

type FilterOption<T extends string> = {
  label: string;
  value: T | "all";
};

const STORAGE_KEY = "mei-crm-communication-templates";

const defaultTemplates: CommunicationTemplate[] = [
  {
    id: "TPL-1001",
    name: "Site Visit Reminder",
    subject: "Reminder for your scheduled site visit",
    content:
      "Hi {{leadName}}, this is a reminder for your site visit at {{projectName}} on {{visitDate}} at {{visitTime}}. Reply if you need to reschedule.",
    channel: "whatsapp",
    category: "reminder",
    status: "active",
    variables: ["leadName", "projectName", "visitDate", "visitTime"],
    usageCount: 124,
    lastUsedAt: "2026-04-14T08:10:00.000Z",
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-04-12T09:20:00.000Z",
  },
  {
    id: "TPL-1002",
    name: "Pricing Sheet Email",
    subject: "Requested pricing details for {{projectName}}",
    content:
      "Hello {{leadName}},\n\nPlease find the latest pricing details for {{projectName}} attached in this email. Let me know if you would like a callback or a custom payment plan explanation.\n\nRegards,\n{{agentName}}",
    channel: "email",
    category: "follow_up",
    status: "active",
    variables: ["leadName", "projectName", "agentName"],
    usageCount: 89,
    lastUsedAt: "2026-04-13T11:20:00.000Z",
    createdAt: "2026-01-18T07:30:00.000Z",
    updatedAt: "2026-04-11T15:40:00.000Z",
  },
  {
    id: "TPL-1003",
    name: "Welcome New Lead",
    subject: "Welcome to MEI CRM",
    content:
      "Hi {{leadName}}, thank you for showing interest in {{projectName}}. Our team will guide you through pricing, site visit, legal clarity, and booking support.",
    channel: "sms",
    category: "welcome",
    status: "active",
    variables: ["leadName", "projectName"],
    usageCount: 203,
    lastUsedAt: "2026-04-12T16:00:00.000Z",
    createdAt: "2025-12-28T06:45:00.000Z",
    updatedAt: "2026-03-29T12:10:00.000Z",
  },
  {
    id: "TPL-1004",
    name: "Document Collection Follow-up",
    subject: "Pending documents for booking process",
    content:
      "Hi {{leadName}}, just following up regarding the pending documents for {{projectName}} booking. Please share {{documentList}} at your earliest convenience.",
    channel: "whatsapp",
    category: "follow_up",
    status: "draft",
    variables: ["leadName", "projectName", "documentList"],
    usageCount: 15,
    lastUsedAt: "2026-04-02T14:10:00.000Z",
    createdAt: "2026-02-14T10:20:00.000Z",
    updatedAt: "2026-04-10T18:30:00.000Z",
  },
  {
    id: "TPL-1005",
    name: "Festive Offer Campaign",
    subject: "Exclusive festive offer on {{projectName}}",
    content:
      "Dear {{leadName}}, unlock exclusive limited-period festive pricing for {{projectName}}. Offer valid till {{offerExpiryDate}}. Call now for priority booking.",
    channel: "email",
    category: "promotion",
    status: "archived",
    variables: ["leadName", "projectName", "offerExpiryDate"],
    usageCount: 46,
    lastUsedAt: "2026-03-07T10:00:00.000Z",
    createdAt: "2026-01-25T13:00:00.000Z",
    updatedAt: "2026-03-15T17:05:00.000Z",
  },
  {
    id: "TPL-1006",
    name: "Customer Support Response",
    subject: "Support update for your request",
    content:
      "Hello {{leadName}}, we have received your request regarding {{issueTopic}}. Our team is reviewing it and will get back to you shortly.",
    channel: "email",
    category: "support",
    status: "active",
    variables: ["leadName", "issueTopic"],
    usageCount: 33,
    lastUsedAt: "2026-04-08T09:40:00.000Z",
    createdAt: "2026-02-08T11:30:00.000Z",
    updatedAt: "2026-04-08T09:45:00.000Z",
  },
];

const channelOptions: FilterOption<TemplateChannel>[] = [
  { label: "All Channels", value: "all" },
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "WhatsApp", value: "whatsapp" },
];

const categoryOptions: FilterOption<TemplateCategory>[] = [
  { label: "All Categories", value: "all" },
  { label: "Follow Up", value: "follow_up" },
  { label: "Promotion", value: "promotion" },
  { label: "Reminder", value: "reminder" },
  { label: "Welcome", value: "welcome" },
  { label: "Support", value: "support" },
  { label: "Custom", value: "custom" },
];

const statusOptions: FilterOption<TemplateStatus>[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
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

function getChannelColor(channel: TemplateChannel): string {
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

function getStatusColor(status: TemplateStatus): string {
  switch (status) {
    case "active":
      return "#059669";
    case "draft":
      return "#D97706";
    case "archived":
      return "#64748B";
    default:
      return "#64748B";
  }
}

function getCategoryLabel(category: TemplateCategory): string {
  switch (category) {
    case "follow_up":
      return "Follow Up";
    case "promotion":
      return "Promotion";
    case "reminder":
      return "Reminder";
    case "welcome":
      return "Welcome";
    case "support":
      return "Support";
    case "custom":
      return "Custom";
    default:
      return category;
  }
}

function getChannelLabel(channel: TemplateChannel): string {
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

function loadTemplates(): CommunicationTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultTemplates;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return defaultTemplates;
    }

    const templates = parsed.filter(
      (item: unknown): item is CommunicationTemplate =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "subject" in item &&
        "content" in item &&
        "channel" in item &&
        "category" in item &&
        "status" in item
    );

    return templates.length > 0 ? templates : defaultTemplates;
  } catch {
    return defaultTemplates;
  }
}

function saveTemplates(templates: CommunicationTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
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

export default function CommunicationTemplatesPage() {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<TemplateChannel | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<TemplateStatus | "all">("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);

    if (loaded.length > 0) {
      setSelectedTemplateId(loaded[0].id);
    }
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template: CommunicationTemplate) => {
      const matchesSearch = searchText.trim()
        ? [
            template.name,
            template.subject,
            template.content,
            template.channel,
            template.category,
            template.status,
            ...template.variables,
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchText.trim().toLowerCase())
        : true;

      const matchesChannel =
        selectedChannel === "all" ? true : template.channel === selectedChannel;

      const matchesCategory =
        selectedCategory === "all" ? true : template.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" ? true : template.status === selectedStatus;

      return matchesSearch && matchesChannel && matchesCategory && matchesStatus;
    });
  }, [templates, searchText, selectedChannel, selectedCategory, selectedStatus]);

  const selectedTemplate = useMemo(() => {
    return (
      filteredTemplates.find(
        (template: CommunicationTemplate) => template.id === selectedTemplateId
      ) ||
      filteredTemplates[0] ||
      null
    );
  }, [filteredTemplates, selectedTemplateId]);

  useEffect(() => {
    if (!selectedTemplate && filteredTemplates.length > 0) {
      setSelectedTemplateId(filteredTemplates[0].id);
    }
  }, [filteredTemplates, selectedTemplate]);

  const stats = useMemo(() => {
    const total = templates.length;
    const active = templates.filter(
      (template: CommunicationTemplate) => template.status === "active"
    ).length;
    const drafts = templates.filter(
      (template: CommunicationTemplate) => template.status === "draft"
    ).length;
    const totalUsage = templates.reduce(
      (sum: number, template: CommunicationTemplate) => sum + template.usageCount,
      0
    );

    return { total, active, drafts, totalUsage };
  }, [templates]);

  function updateTemplates(nextTemplates: CommunicationTemplate[]) {
    setTemplates(nextTemplates);
    saveTemplates(nextTemplates);
  }

  function handleDuplicate(templateId: string) {
    const template = templates.find((item: CommunicationTemplate) => item.id === templateId);

    if (!template) return;

    const duplicated: CommunicationTemplate = {
      ...template,
      id: `TPL-${Date.now()}`,
      name: `${template.name} Copy`,
      status: "draft",
      usageCount: 0,
      lastUsedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextTemplates = [duplicated, ...templates];
    updateTemplates(nextTemplates);
    setSelectedTemplateId(duplicated.id);
  }

  function handleToggleStatus(templateId: string) {
    const nextTemplates = templates.map((template: CommunicationTemplate) => {
      if (template.id !== templateId) {
        return template;
      }

      const nextStatus: TemplateStatus =
        template.status === "active" ? "archived" : "active";

      return {
        ...template,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    updateTemplates(nextTemplates);
  }

  function handleDelete(templateId: string) {
    const nextTemplates = templates.filter(
      (template: CommunicationTemplate) => template.id !== templateId
    );

    updateTemplates(nextTemplates);

    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(nextTemplates[0]?.id || "");
    }
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
                Communications / Templates
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Communication Templates
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
                Manage reusable email, SMS, and WhatsApp templates with clear channel
                control, preview visibility, status management, and usage analytics.
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
              + Create Template
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
            title="Total Templates"
            value={formatNumber(stats.total)}
            subtitle="All channels combined"
            accent="#2563EB"
          />
          <StatCard
            title="Active Templates"
            value={formatNumber(stats.active)}
            subtitle="Ready for live usage"
            accent="#16A34A"
          />
          <StatCard
            title="Draft Templates"
            value={formatNumber(stats.drafts)}
            subtitle="Still under preparation"
            accent="#D97706"
          />
          <StatCard
            title="Total Usage"
            value={formatNumber(stats.totalUsage)}
            subtitle="Cumulative sends tracked"
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                    Template Library
                  </div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                    Browse and manage communication templates with quick actions.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(240px, 1fr) repeat(3, minmax(160px, 180px))",
                  gap: 12,
                }}
              >
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search templates, subject, variables..."
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
                  value={selectedChannel}
                  onChange={(event) =>
                    setSelectedChannel(event.target.value as TemplateChannel | "all")
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
                  {channelOptions.map((option: FilterOption<TemplateChannel>) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value as TemplateCategory | "all")
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
                  {categoryOptions.map((option: FilterOption<TemplateCategory>) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as TemplateStatus | "all")
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
                  {statusOptions.map((option: FilterOption<TemplateStatus>) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1050 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Template</th>
                    <th style={thStyle}>Channel</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Variables</th>
                    <th style={thStyle}>Usage</th>
                    <th style={thStyle}>Last Used</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.length === 0 ? (
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
                        No templates matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((template: CommunicationTemplate) => {
                      const isSelected = selectedTemplateId === template.id;

                      return (
                        <tr
                          key={template.id}
                          onClick={() => setSelectedTemplateId(template.id)}
                          style={{
                            background: isSelected ? "#EFF6FF" : "#FFFFFF",
                            cursor: "pointer",
                          }}
                        >
                          <td style={tdStyle}>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#0F172A",
                                }}
                              >
                                {template.name}
                              </div>
                              <div style={{ fontSize: 13, color: "#475569" }}>
                                {template.subject}
                              </div>
                              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                {template.id}
                              </div>
                            </div>
                          </td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getChannelColor(template.channel)}14`,
                                color: getChannelColor(template.channel),
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {getChannelLabel(template.channel)}
                            </span>
                          </td>

                          <td style={tdStyle}>{getCategoryLabel(template.category)}</td>

                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: `${getStatusColor(template.status)}14`,
                                color: getStatusColor(template.status),
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "capitalize",
                              }}
                            >
                              {template.status}
                            </span>
                          </td>

                          <td style={tdStyle}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                              }}
                            >
                              {template.variables.length === 0 ? (
                                <span style={{ color: "#94A3B8" }}>—</span>
                              ) : (
                                template.variables.map((variable: string) => (
                                  <span
                                    key={variable}
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: 999,
                                      background: "#F1F5F9",
                                      color: "#334155",
                                      fontSize: 12,
                                      border: "1px solid #E2E8F0",
                                    }}
                                  >
                                    {`{{${variable}}}`}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>

                          <td style={tdStyle}>{formatNumber(template.usageCount)}</td>
                          <td style={tdStyle}>{formatDateTime(template.lastUsedAt)}</td>

                          <td style={tdStyle}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                              }}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleDuplicate(template.id)}
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
                                Duplicate
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(template.id)}
                                style={{
                                  border: "none",
                                  background:
                                    template.status === "active" ? "#FEF2F2" : "#ECFDF5",
                                  color:
                                    template.status === "active" ? "#DC2626" : "#059669",
                                  borderRadius: 10,
                                  padding: "8px 10px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                {template.status === "active" ? "Archive" : "Activate"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(template.id)}
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
                Template Preview
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Live preview of selected template content and metadata.
              </div>
            </div>

            {selectedTemplate ? (
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
                        background: `${getChannelColor(selectedTemplate.channel)}14`,
                        color: getChannelColor(selectedTemplate.channel),
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {getChannelLabel(selectedTemplate.channel)}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: `${getStatusColor(selectedTemplate.status)}14`,
                        color: getStatusColor(selectedTemplate.status),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedTemplate.status}
                    </span>

                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#E2E8F0",
                        color: "#334155",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {getCategoryLabel(selectedTemplate.category)}
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
                      {selectedTemplate.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                      {selectedTemplate.id}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Subject
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0F172A",
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      {selectedTemplate.subject}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Content
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
                      {selectedTemplate.content}
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
                    Template Details
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#64748B" }}>Usage Count</span>
                      <strong style={{ color: "#0F172A" }}>
                        {formatNumber(selectedTemplate.usageCount)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#64748B" }}>Created At</span>
                      <strong style={{ color: "#0F172A" }}>
                        {formatDateTime(selectedTemplate.createdAt)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#64748B" }}>Updated At</span>
                      <strong style={{ color: "#0F172A" }}>
                        {formatDateTime(selectedTemplate.updatedAt)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#64748B" }}>Last Used</span>
                      <strong style={{ color: "#0F172A" }}>
                        {formatDateTime(selectedTemplate.lastUsedAt)}
                      </strong>
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
                    Variables
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {selectedTemplate.variables.length > 0 ? (
                      selectedTemplate.variables.map((variable: string) => (
                        <span
                          key={variable}
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
                          {`{{${variable}}}`}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 13, color: "#94A3B8" }}>
                        No variables used.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, fontSize: 14, color: "#64748B" }}>
                No template selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}