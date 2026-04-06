import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type DashboardPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type NotificationItem = {
  title: string;
  message: string;
  time: string;
  badge: "INFO" | "WARNING" | "SUCCESS" | "DANGER";
  color: string;
};

type LeadRecord = {
  id: string | number;
  name?: string;
  fullName?: string;
  customerName?: string;
  company?: string;
  project?: string;
  source?: string;
  status?: string;
  phone?: string;
  email?: string;
  budget?: string | number;
  followUpDate?: string;
  nextFollowUp?: string;
  updatedAt?: string;
  createdAt?: string;
  owner?: string;
};

type TaskRecord = {
  id: string | number;
  title?: string;
  status?: string;
  dueDate?: string;
  followUpDate?: string;
  priority?: string;
  relatedTo?: string;
};

type DealRecord = {
  id: string | number;
  title?: string;
  client?: string;
  clientName?: string;
  customerName?: string;
  value?: string | number;
  city?: string;
  owner?: string;
  stage?: string;
  status?: string;
  source?: string;
  leadId?: string | number;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
};

const FALLBACK_LEADS: LeadRecord[] = [
  {
    id: "LD-1001",
    name: "Arun Kumar",
    source: "Website",
    status: "New",
    budget: "₹45L",
    followUpDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: "John Paul",
  },
  {
    id: "LD-1002",
    name: "Sneha R",
    source: "Meta Ads",
    status: "Qualified",
    budget: "₹72L",
    followUpDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: "John Paul",
  },
  {
    id: "LD-1003",
    name: "Rahul",
    source: "Referral",
    status: "Negotiation",
    budget: "₹1.2Cr",
    followUpDate: new Date(Date.now() + 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    owner: "John Paul",
  },
  {
    id: "LD-1004",
    name: "Meena Corp",
    source: "Call",
    status: "Closed",
    budget: "₹2.1Cr",
    updatedAt: new Date().toISOString(),
    owner: "John Paul",
  },
  {
    id: "LD-1005",
    name: "Vignesh",
    source: "WhatsApp",
    status: "Contacted",
    budget: "₹58L",
    followUpDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: "John Paul",
  },
];

const FALLBACK_TASKS: TaskRecord[] = [
  {
    id: "TS-101",
    title: "Call Arun Kumar",
    status: "Pending",
    dueDate: new Date().toISOString(),
    priority: "High",
    relatedTo: "Arun Kumar",
  },
  {
    id: "TS-102",
    title: "Send pricing to Sneha",
    status: "Pending",
    dueDate: new Date().toISOString(),
    priority: "Medium",
    relatedTo: "Sneha R",
  },
  {
    id: "TS-103",
    title: "Prepare proposal",
    status: "Completed",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    priority: "Low",
    relatedTo: "Rahul",
  },
];

const FALLBACK_DEALS: DealRecord[] = [
  {
    id: "DL-201",
    title: "CRM Setup Package",
    client: "Arun Kumar",
    value: "₹2,50,000",
    city: "Chennai",
    owner: "Balraj",
    stage: "New",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DL-202",
    title: "Sales Automation System",
    client: "Priya Ventures",
    value: "₹4,80,000",
    city: "Bangalore",
    owner: "Balraj",
    stage: "Negotiation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DL-203",
    title: "Lead Funnel Dashboard",
    client: "Rahul Infra",
    value: "₹3,20,000",
    city: "Coimbatore",
    owner: "Arun",
    stage: "Proposal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DL-204",
    title: "Business OS Deployment",
    client: "Meena Corp",
    value: "₹6,00,000",
    city: "Madurai",
    owner: "Priya",
    stage: "Won",
    createdAt: new Date().toISOString(),
  },
];

const LEAD_STORAGE_KEYS = [
  "mei-crm-leads",
  "mei_crm_leads",
  "leads",
  "crm_leads",
];

const TASK_STORAGE_KEYS = [
  "mei-crm-tasks",
  "mei_crm_tasks",
  "tasks",
  "crm_tasks",
];

const DEAL_STORAGE_KEYS = [
  "mei-crm-deals",
  "mei_crm_deals",
  "deals",
  "crm_deals",
];

export default function DashboardPage({
  mode,
  onToggleTheme,
}: DashboardPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();

  const leads = useMemo<LeadRecord[]>(() => {
    const stored = readFirstArrayFromStorage<LeadRecord>(LEAD_STORAGE_KEYS);
    return stored.length ? stored : FALLBACK_LEADS;
  }, []);

  const tasks = useMemo<TaskRecord[]>(() => {
    const stored = readFirstArrayFromStorage<TaskRecord>(TASK_STORAGE_KEYS);
    return stored.length ? stored : FALLBACK_TASKS;
  }, []);

  const deals = useMemo<DealRecord[]>(() => {
    const stored = readFirstArrayFromStorage<DealRecord>(DEAL_STORAGE_KEYS);
    return stored.length ? stored : FALLBACK_DEALS;
  }, []);

  const totalLeads = leads.length;

  const qualifiedLeads = leads.filter((lead) =>
    matchesStatus(lead.status, ["qualified"])
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !matchesStatus(task.status, ["completed", "done", "closed"])
  ).length;

  const todayFollowUps = leads
    .filter((lead) =>
      isToday(parsePossibleDate(lead.followUpDate || lead.nextFollowUp))
    )
    .sort(
      sortByDateAsc((lead) =>
        parsePossibleDate(lead.followUpDate || lead.nextFollowUp)
      )
    );

  const overdueFollowUps = leads.filter((lead) => {
    const date = parsePossibleDate(lead.followUpDate || lead.nextFollowUp);
    return date ? isPastDate(date) && !isToday(date) : false;
  }).length;

  const recentLeads = [...leads]
    .sort(
      sortByDateDesc((lead) =>
        parsePossibleDate(lead.updatedAt || lead.createdAt || lead.followUpDate)
      )
    )
    .slice(0, 6);

  const recentDeals = [...deals]
    .sort(
      sortByDateDesc((deal) =>
        parsePossibleDate(deal.updatedAt || deal.createdAt)
      )
    )
    .slice(0, 5);

  const unreadCount =
    todayFollowUps.length > 0 ? Math.min(todayFollowUps.length, 9) : 2;

  const newDeals = deals.filter((deal) => matchesStatus(deal.stage || deal.status, ["new"])).length;
  const negotiationDeals = deals.filter((deal) =>
    matchesStatus(deal.stage || deal.status, ["negotiation"])
  ).length;
  const proposalDeals = deals.filter((deal) =>
    matchesStatus(deal.stage || deal.status, ["proposal"])
  ).length;
  const wonDeals = deals.filter((deal) =>
    matchesStatus(deal.stage || deal.status, ["won", "closed"])
  ).length;
  const lostDeals = deals.filter((deal) =>
    matchesStatus(deal.stage || deal.status, ["lost"])
  ).length;

  const totalDealValue = deals.reduce((sum, deal) => {
    const numeric = Number(String(deal.value || "").replace(/[^\d.]/g, ""));
    return sum + (Number.isFinite(numeric) ? numeric : 0);
  }, 0);

  const notifications: NotificationItem[] = buildNotifications(
    colors,
    todayFollowUps,
    overdueFollowUps,
    recentLeads,
    wonDeals
  );

  const pipelineData = [
    {
      label: "New Deals",
      value: newDeals,
      color: colors.info,
      onClick: () => navigate("/deals?filter=new"),
    },
    {
      label: "Negotiation",
      value: negotiationDeals,
      color: colors.warning,
      onClick: () => navigate("/deals?filter=negotiation"),
    },
    {
      label: "Proposal",
      value: proposalDeals,
      color: colors.premium,
      onClick: () => navigate("/deals?filter=proposal"),
    },
    {
      label: "Won Deals",
      value: wonDeals,
      color: colors.success,
      onClick: () => navigate("/deals?filter=won"),
    },
    {
      label: "Lost Deals",
      value: lostDeals,
      color: colors.danger,
      onClick: () => navigate("/deals?filter=lost"),
    },
  ];

  const revenueData = [220000, 310000, 420000, 480000, 530000, 610000];
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const leadsData = [
    Math.max(Math.round(totalLeads * 0.12), 4),
    Math.max(Math.round(totalLeads * 0.16), 5),
    Math.max(Math.round(totalLeads * 0.1), 4),
    Math.max(Math.round(totalLeads * 0.2), 6),
    Math.max(Math.round(totalLeads * 0.18), 5),
    Math.max(Math.round(totalLeads * 0.24), 6),
  ];
  const leadsLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const maxPipeline = Math.max(...pipelineData.map((item) => item.value), 1);

  const kpiData = [
    {
      label: "Total Leads",
      value: String(totalLeads),
      note: `${recentLeads.length} recent updates`,
      color: colors.info,
      bg: colors.infoBg,
      icon: "📇",
      onClick: () => navigate("/leads"),
    },
    {
      label: "Qualified Leads",
      value: String(qualifiedLeads),
      note: "Hot prospects in pipeline",
      color: colors.premium,
      bg: colors.premiumBg,
      icon: "🎯",
      onClick: () => navigate("/leads?filter=qualified"),
    },
    {
      label: "Won Deals",
      value: String(wonDeals),
      note: "Closed commercial wins",
      color: colors.success,
      bg: colors.successBg,
      icon: "🤝",
      onClick: () => navigate("/deals?filter=won"),
    },
    {
      label: "Pending Tasks",
      value: String(pendingTasks),
      note: `${todayFollowUps.length} follow-ups today`,
      color: colors.warning,
      bg: colors.warningBg,
      icon: "📝",
      onClick: () => navigate("/tasks"),
    },
    {
      label: "Pipeline Value",
      value: `₹${Math.round(totalDealValue).toLocaleString("en-IN")}`,
      note: `${deals.length} total deals`,
      color: colors.primary,
      bg: colors.infoBg,
      icon: "💰",
      onClick: () => navigate("/deals"),
    },
    {
      label: "Negotiation Deals",
      value: String(negotiationDeals),
      note: "Hot deals in motion",
      color: colors.warning,
      bg: colors.warningBg,
      icon: "🔥",
      onClick: () => navigate("/deals?filter=negotiation"),
    },
  ];

  return (
    <AppLayout title="Dashboard" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            ...cardStyle(colors),
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: colors.cardBgSoft,
                color: colors.subText,
                border: `1px solid ${colors.border}`,
                marginBottom: 14,
              }}
            >
              MEI CRM Overview
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 800,
                color: colors.text,
                letterSpacing: "-0.02em",
              }}
            >
              Dashboard
            </h1>

            <p style={subTextStyle(colors)}>
              Welcome back, here’s your live business snapshot today.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={primaryButtonStyle(colors)}
              onClick={() => navigate("/leads")}
            >
              + Add Lead
            </button>
            <button
              style={secondaryButtonStyle(colors)}
              onClick={() => navigate("/tasks")}
            >
              Create Task
            </button>
            <button
              style={secondaryButtonStyle(colors)}
              onClick={() => navigate("/deals")}
            >
              Add Deal
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {kpiData.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              style={{
                ...cardStyle(colors),
                padding: 20,
                display: "grid",
                gap: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                background: colors.cardBg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: item.bg,
                    color: item.color,
                    fontSize: 20,
                  }}
                >
                  {item.icon}
                </div>
              </div>

              <div
                style={{
                  fontSize: item.label === "Pipeline Value" ? 26 : 34,
                  fontWeight: 800,
                  color: colors.text,
                  lineHeight: 1,
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: colors.mutedText,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {item.note}
                </span>

                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    color: item.color,
                    background: item.bg,
                  }}
                >
                  View
                </span>
              </div>
            </button>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1fr)",
            gap: 20,
          }}
        >
          <div style={cardStyle(colors)}>
            <div style={chartHeaderWrap}>
              <div>
                <h2 style={sectionTitle(colors)}>Revenue Overview</h2>
                <p style={subTextStyle(colors)}>
                  Monthly revenue trend and growth movement
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/deals")}
                style={unstyledBadgeButton(
                  inlineBadge(colors, colors.success, colors.successBg)
                )}
              >
                Pipeline Value
              </button>
            </div>

            <div style={chartContainer(colors)}>
              {revenueData.map((value, index) => {
                const max = Math.max(...revenueData);
                const height = `${(value / max) * 100}%`;

                return (
                  <div key={revenueLabels[index]} style={chartBarWrap}>
                    <div style={chartLabelTop(colors)}>
                      ₹{Math.round(value / 1000)}k
                    </div>

                    <div
                      style={{
                        width: "100%",
                        maxWidth: 34,
                        height,
                        minHeight: 16,
                        borderRadius: 10,
                        background: colors.primary,
                      }}
                    />

                    <div style={chartLabelBottom(colors)}>
                      {revenueLabels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle(colors)}>
            <div style={chartHeaderWrap}>
              <div>
                <h2 style={sectionTitle(colors)}>Lead Trend</h2>
                <p style={subTextStyle(colors)}>
                  Weekly incoming leads performance
                </p>
              </div>
              <div style={inlineBadge(colors, colors.info, colors.infoBg)}>
                Weekly View
              </div>
            </div>

            <div style={chartContainer(colors)}>
              {leadsData.map((value, index) => {
                const max = Math.max(...leadsData);
                const height = `${(value / max) * 100}%`;

                return (
                  <div key={leadsLabels[index]} style={chartBarWrap}>
                    <div style={chartLabelTop(colors)}>{value}</div>

                    <div
                      style={{
                        width: "100%",
                        maxWidth: 42,
                        height,
                        minHeight: 16,
                        borderRadius: 12,
                        background: colors.info,
                      }}
                    />

                    <div style={chartLabelBottom(colors)}>
                      {leadsLabels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            gap: 20,
          }}
        >
          <div style={cardStyle(colors)}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={sectionTitle(colors)}>Recent Leads</h2>
                <p style={subTextStyle(colors)}>
                  Latest lead updates from localStorage live data
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/leads")}
                style={secondaryButtonStyle(colors)}
              >
                View All Leads
              </button>
            </div>

            <div
              style={{
                overflowX: "auto",
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                background: colors.cardBgSoft,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 760,
                }}
              >
                <thead>
                  <tr>
                    {["Lead", "Source", "Status", "Budget", "Follow-up", "Owner"].map(
                      (head) => (
                        <th
                          key={head}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            fontSize: 13,
                            color: colors.subText,
                            borderBottom: `1px solid ${colors.border}`,
                            fontWeight: 800,
                            background: colors.cardBg,
                          }}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {recentLeads.map((lead) => {
                    const followUp = parsePossibleDate(
                      lead.followUpDate || lead.nextFollowUp
                    );

                    return (
                      <tr
                        key={String(lead.id)}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{
                          cursor: "pointer",
                          borderBottom: `1px solid ${colors.border}`,
                        }}
                      >
                        <td style={tableCellStyle(colors)}>
                          <div style={{ fontWeight: 700, color: colors.text }}>
                            {getLeadName(lead)}
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: colors.mutedText,
                            }}
                          >
                            #{lead.id}
                          </div>
                        </td>

                        <td style={tableCellStyle(colors)}>{lead.source || "—"}</td>

                        <td style={tableCellStyle(colors)}>
                          <span
                            style={{
                              ...statusPillStyle(
                                colors,
                                getLeadStatusColor(colors, lead.status)
                              ),
                            }}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>

                        <td style={tableCellStyle(colors)}>
                          {formatBudget(lead.budget)}
                        </td>

                        <td style={tableCellStyle(colors)}>
                          {followUp ? formatDateShortLocal(followUp) : "—"}
                        </td>

                        <td style={tableCellStyle(colors)}>
                          {lead.owner || "Unassigned"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <div style={cardStyle(colors)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h2 style={sectionTitle(colors)}>Today Follow-up</h2>
                  <p style={subTextStyle(colors)}>
                    Leads that need action before the day ends
                  </p>
                </div>

                <span
                  style={inlineBadge(colors, colors.warning, colors.warningBg)}
                >
                  {todayFollowUps.length} Due
                </span>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {todayFollowUps.length === 0 ? (
                  <div
                    style={{
                      border: `1px dashed ${colors.border}`,
                      borderRadius: 16,
                      padding: 18,
                      background: colors.cardBgSoft,
                      color: colors.subText,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    No follow-ups due today. Smooth sailing.
                  </div>
                ) : (
                  todayFollowUps.slice(0, 5).map((lead) => (
                    <div
                      key={`followup-${lead.id}`}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: 16,
                        padding: 16,
                        background: colors.cardBgSoft,
                        display: "grid",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: colors.text,
                          }}
                        >
                          {getLeadName(lead)}
                        </div>

                        <span
                          style={{
                            ...statusPillStyle(
                              colors,
                              getLeadStatusColor(colors, lead.status)
                            ),
                          }}
                        >
                          {lead.status || "New"}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color: colors.subText,
                          lineHeight: 1.6,
                        }}
                      >
                        Source: {lead.source || "—"} · Budget:{" "}
                        {formatBudget(lead.budget)}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: colors.mutedText,
                          fontWeight: 700,
                        }}
                      >
                        Follow-up:{" "}
                        {formatDateTimeShort(
                          parsePossibleDate(lead.followUpDate || lead.nextFollowUp)
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle(colors)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h2 style={sectionTitle(colors)}>Quick Stats</h2>
                  <p style={subTextStyle(colors)}>
                    Fast operational pulse for today
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <MiniStatCard
                  colors={colors}
                  label="Win Rate"
                  value={`${deals.length ? ((wonDeals / deals.length) * 100).toFixed(1) : "0.0"}%`}
                />
                <MiniStatCard
                  colors={colors}
                  label="Today Follow-ups"
                  value={String(todayFollowUps.length)}
                />
                <MiniStatCard
                  colors={colors}
                  label="Overdue Follow-ups"
                  value={String(overdueFollowUps)}
                />
                <MiniStatCard
                  colors={colors}
                  label="Pending Tasks"
                  value={String(pendingTasks)}
                />
              </div>
            </div>
          </div>
        </section>

        <section style={cardStyle(colors)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={sectionTitle(colors)}>Deal Pipeline Performance</h2>
              <p style={subTextStyle(colors)}>
                Track how deals move from entry to won stage
              </p>
            </div>

            <div style={inlineBadge(colors, colors.primary, colors.infoBg)}>
              Live Snapshot
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "minmax(320px, 1fr) 320px",
              gap: 20,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                background: colors.cardBgSoft,
                border: `1px solid ${colors.border}`,
                padding: 20,
              }}
            >
              <div style={{ display: "grid", gap: 12 }}>
                {pipelineData.map((stage, index) => {
                  const widthPercent = Math.max(
                    (stage.value / maxPipeline) * 100,
                    24
                  );

                  return (
                    <button
                      key={stage.label}
                      type="button"
                      onClick={stage.onClick}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: colors.text,
                          }}
                        >
                          {index + 1}. {stage.label}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: colors.subText,
                          }}
                        >
                          {stage.value} records
                        </div>
                      </div>

                      <div
                        style={{
                          height: 44,
                          width: `${widthPercent}%`,
                          minWidth: 140,
                          borderRadius: 14,
                          background: stage.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0 14px",
                          color: "#ffffff",
                          fontWeight: 800,
                        }}
                      >
                        <span>{stage.label}</span>
                        <span>{stage.value}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <MiniStatCard
                colors={colors}
                label="Won Deals"
                value={String(wonDeals)}
              />
              <MiniStatCard
                colors={colors}
                label="Negotiation"
                value={String(negotiationDeals)}
              />
              <MiniStatCard
                colors={colors}
                label="Proposal"
                value={String(proposalDeals)}
              />
              <MiniStatCard
                colors={colors}
                label="Pipeline Value"
                value={`₹${Math.round(totalDealValue).toLocaleString("en-IN")}`}
              />
            </div>
          </div>
        </section>

        <section style={cardStyle(colors)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={sectionTitle(colors)}>Recent Deals</h2>
              <p style={subTextStyle(colors)}>
                Latest commercial records from live deals data
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/deals")}
              style={secondaryButtonStyle(colors)}
            >
              View All Deals
            </button>
          </div>

          <div
            style={{
              overflowX: "auto",
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              background: colors.cardBgSoft,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 860,
              }}
            >
              <thead>
                <tr>
                  {["Deal", "Client", "Stage", "Value", "Owner", "Created"].map(
                    (head) => (
                      <th
                        key={head}
                        style={{
                          textAlign: "left",
                          padding: "14px 16px",
                          fontSize: 13,
                          color: colors.subText,
                          borderBottom: `1px solid ${colors.border}`,
                          fontWeight: 800,
                          background: colors.cardBg,
                        }}
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {recentDeals.map((deal) => (
                  <tr
                    key={String(deal.id)}
                    onClick={() => navigate(`/deals/${deal.id}`)}
                    style={{
                      cursor: "pointer",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <td style={tableCellStyle(colors)}>
                      <div style={{ fontWeight: 700, color: colors.text }}>
                        {deal.title || "Untitled Deal"}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          color: colors.mutedText,
                        }}
                      >
                        #{deal.id}
                      </div>
                    </td>

                    <td style={tableCellStyle(colors)}>
                      {deal.client || deal.clientName || deal.customerName || "—"}
                    </td>

                    <td style={tableCellStyle(colors)}>
                      <span
                        style={{
                          ...statusPillStyle(
                            colors,
                            getDealStageColor(colors, deal.stage || deal.status)
                          ),
                        }}
                      >
                        {deal.stage || deal.status || "New"}
                      </span>
                    </td>

                    <td style={tableCellStyle(colors)}>
                      {formatBudget(deal.value)}
                    </td>

                    <td style={tableCellStyle(colors)}>
                      {deal.owner || "Unassigned"}
                    </td>

                    <td style={tableCellStyle(colors)}>
                      {formatDateShortLocal(parsePossibleDate(deal.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={cardStyle(colors)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={sectionTitle(colors)}>Notifications</h2>
              <p style={subTextStyle(colors)}>
                Stay on top of alerts, reminders, and critical updates
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 12,
                background: colors.cardBgSoft,
                border: `1px solid ${colors.border}`,
                fontWeight: 800,
                color: colors.text,
              }}
            >
              <span>🔔</span>
              <span>{unreadCount} Unread</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(320px, 1fr) 280px",
              gap: 20,
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              {notifications.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    padding: 16,
                    background: colors.cardBgSoft,
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      marginTop: 6,
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: colors.text,
                        }}
                      >
                        {item.title}
                      </div>

                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#ffffff",
                          background: item.color,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        color: colors.subText,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.message}
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        color: colors.mutedText,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <MiniStatCard
                colors={colors}
                label="Unread Alerts"
                value={String(unreadCount)}
              />
              <MiniStatCard
                colors={colors}
                label="Critical Issues"
                value={String(overdueFollowUps > 0 ? 1 : 0)}
              />
              <MiniStatCard
                colors={colors}
                label="Won Deals"
                value={String(wonDeals)}
              />
              <MiniStatCard
                colors={colors}
                label="Negotiation"
                value={String(negotiationDeals)}
              />
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function MiniStatCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        background: colors.cardBgSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          color: colors.text,
          fontSize: 22,
          fontWeight: 800,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function cardStyle(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: colors.shadowSoft,
  };
}

function sectionTitle(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: colors.text,
  };
}

function subTextStyle(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    marginTop: 6,
    color: colors.subText,
    fontSize: 14,
    lineHeight: 1.6,
  };
}

function primaryButtonStyle(
  colors: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function secondaryButtonStyle(
  colors: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function inlineBadge(
  colors: ReturnType<typeof getTheme>,
  color: string,
  background: string
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "7px 12px",
    borderRadius: 999,
    color,
    background,
    fontSize: 12,
    fontWeight: 800,
    border: `1px solid ${colors.border}`,
    whiteSpace: "nowrap",
  };
}

function unstyledBadgeButton(styleObj: CSSProperties): CSSProperties {
  return {
    ...styleObj,
    border: styleObj.border,
    cursor: "pointer",
  };
}

const chartHeaderWrap: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

function chartContainer(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    marginTop: 18,
    height: 260,
    borderRadius: 16,
    background: colors.cardBgSoft,
    border: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    padding: 18,
  };
}

const chartBarWrap: CSSProperties = {
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 8,
};

function chartLabelTop(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    color: colors.text,
  };
}

function chartLabelBottom(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 600,
    color: colors.subText,
  };
}

function tableCellStyle(colors: ReturnType<typeof getTheme>): CSSProperties {
  return {
    padding: "14px 16px",
    fontSize: 14,
    color: colors.text,
    verticalAlign: "middle",
  };
}

function statusPillStyle(
  colors: ReturnType<typeof getTheme>,
  tone: { color: string; bg: string }
): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    color: tone.color,
    background: tone.bg,
    border: `1px solid ${colors.border}`,
    whiteSpace: "nowrap",
  };
}

function getLeadStatusColor(
  colors: ReturnType<typeof getTheme>,
  status?: string
): { color: string; bg: string } {
  const normalized = (status || "").toLowerCase();

  if (normalized.includes("closed") || normalized.includes("won")) {
    return { color: colors.success, bg: colors.successBg };
  }

  if (normalized.includes("qualified")) {
    return { color: colors.premium, bg: colors.premiumBg };
  }

  if (normalized.includes("negotiation")) {
    return { color: colors.warning, bg: colors.warningBg };
  }

  if (normalized.includes("contacted")) {
    return { color: colors.primary, bg: colors.infoBg };
  }

  return { color: colors.info, bg: colors.infoBg };
}

function getDealStageColor(
  colors: ReturnType<typeof getTheme>,
  stage?: string
): { color: string; bg: string } {
  const normalized = (stage || "").toLowerCase();

  if (normalized.includes("won") || normalized.includes("closed")) {
    return { color: colors.success, bg: colors.successBg };
  }

  if (normalized.includes("proposal")) {
    return { color: colors.premium, bg: colors.premiumBg };
  }

  if (normalized.includes("negotiation")) {
    return { color: colors.warning, bg: colors.warningBg };
  }

  if (normalized.includes("lost")) {
    return { color: colors.danger, bg: colors.dangerBg || colors.warningBg };
  }

  return { color: colors.info, bg: colors.infoBg };
}

function readFirstArrayFromStorage<T>(keys: string[]): T[] {
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error(`Failed to parse localStorage key: ${key}`, error);
    }
  }

  return [];
}

function matchesStatus(status: string | undefined, allowed: string[]): boolean {
  const normalized = (status || "").toLowerCase().trim();
  return allowed.some((item) => normalized.includes(item));
}

function parsePossibleDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isToday(date: Date | null): boolean {
  if (!date) return false;

  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isPastDate(date: Date | null): boolean {
  if (!date) return false;
  return date.getTime() < Date.now();
}

function sortByDateDesc<T>(selector: (item: T) => Date | null) {
  return (a: T, b: T) => {
    const aTime = selector(a)?.getTime() ?? 0;
    const bTime = selector(b)?.getTime() ?? 0;
    return bTime - aTime;
  };
}

function sortByDateAsc<T>(selector: (item: T) => Date | null) {
  return (a: T, b: T) => {
    const aTime = selector(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = selector(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  };
}

function getLeadName(lead: LeadRecord): string {
  return (
    lead.name ||
    lead.fullName ||
    lead.customerName ||
    lead.company ||
    "Untitled Lead"
  );
}

function formatBudget(value?: string | number): string {
  if (typeof value === "number") {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "—";
}

function formatDateShortLocal(date: Date | null): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTimeShort(date: Date | null): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildNotifications(
  colors: ReturnType<typeof getTheme>,
  todayFollowUps: LeadRecord[],
  overdueFollowUps: number,
  recentLeads: LeadRecord[],
  wonDeals: number
): NotificationItem[] {
  const items: NotificationItem[] = [];

  if (todayFollowUps[0]) {
    items.push({
      title: "Follow-up due today",
      message: `${getLeadName(todayFollowUps[0])} needs attention today.`,
      time: "Now",
      badge: "WARNING",
      color: colors.warning,
    });
  }

  if (recentLeads[0]) {
    items.push({
      title: "Recent lead updated",
      message: `${getLeadName(recentLeads[0])} was recently updated in the CRM.`,
      time: "Live",
      badge: "INFO",
      color: colors.info,
    });
  }

  if (wonDeals > 0) {
    items.push({
      title: "Won deals recorded",
      message: `${wonDeals} deal(s) are currently in won stage.`,
      time: "Recent",
      badge: "SUCCESS",
      color: colors.success,
    });
  }

  if (overdueFollowUps > 0) {
    items.push({
      title: "Overdue follow-up detected",
      message: `${overdueFollowUps} lead follow-up(s) are overdue and need action.`,
      time: "Alert",
      badge: "DANGER",
      color: colors.danger,
    });
  }

  while (items.length < 4) {
    items.push({
      title: "CRM synced",
      message: "Dashboard is showing your latest available localStorage data.",
      time: "Just now",
      badge: "INFO",
      color: colors.info,
    });
  }

  return items.slice(0, 4);
}