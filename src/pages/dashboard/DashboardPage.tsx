import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";
import type { CSSProperties } from "react";

type DashboardPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type ChartPoint = {
  label: string;
  value: number;
};

type PipelineStage = {
  label: string;
  value: number;
  color: string;
};

type NotificationItem = {
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "danger" | "success";
  unread?: boolean;
};

const kpiData = [
  { label: "Total Leads", value: "128", note: "+12 this week", colorKey: "info" },
  { label: "Qualified Leads", value: "42", note: "+6 this week", colorKey: "premium" },
  { label: "Closed Deals", value: "18", note: "+3 this month", colorKey: "success" },
  { label: "Pending Tasks", value: "11", note: "4 due today", colorKey: "warning" },
];

const revenueData: ChartPoint[] = [
  { label: "Jan", value: 220000 },
  { label: "Feb", value: 310000 },
  { label: "Mar", value: 420000 },
  { label: "Apr", value: 480000 },
  { label: "May", value: 530000 },
  { label: "Jun", value: 610000 },
];

const leadsData: ChartPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 14 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 19 },
  { label: "Sat", value: 25 },
];

const recentActivities = [
  {
    title: "New lead added",
    description: "Arun Kumar was added from WhatsApp inquiry.",
    time: "10 mins ago",
  },
  {
    title: "Task completed",
    description: "Project brochure sent to Priya.",
    time: "35 mins ago",
  },
  {
    title: "Lead status updated",
    description: "Rahul moved to Qualified stage.",
    time: "1 hour ago",
  },
  {
    title: "Deal closed",
    description: "Meena Corp confirmed the final agreement.",
    time: "2 hours ago",
  },
];

const upcomingFollowUps = [
  {
    name: "Arun Kumar",
    type: "Call Follow-up",
    date: "2026-04-03",
    status: "Today",
  },
  {
    name: "Priya",
    type: "Demo Meeting",
    date: "2026-04-04",
    status: "Tomorrow",
  },
  {
    name: "Rahul",
    type: "Proposal Review",
    date: "2026-04-05",
    status: "Upcoming",
  },
];

const notifications: NotificationItem[] = [
  {
    title: "Follow-up due today",
    message: "Arun Kumar needs a call back before 5:00 PM.",
    time: "5 mins ago",
    type: "warning",
    unread: true,
  },
  {
    title: "New website lead",
    message: "Sneha submitted a project inquiry from the landing page.",
    time: "12 mins ago",
    type: "info",
    unread: true,
  },
  {
    title: "Deal moved to negotiation",
    message: "Meena Corp deal has advanced to the negotiation stage.",
    time: "42 mins ago",
    type: "success",
  },
  {
    title: "Task overdue",
    message: "Proposal document for Rahul has not been sent yet.",
    time: "1 hour ago",
    type: "danger",
  },
];

export default function DashboardPage({
  mode,
  onToggleTheme,
}: DashboardPageProps) {
  const colors = getTheme(mode);

  const pipelineData: PipelineStage[] = [
    { label: "New Leads", value: 128, color: colors.info },
    { label: "Contacted", value: 96, color: colors.primary },
    { label: "Qualified", value: 42, color: colors.premium },
    { label: "Negotiation", value: 24, color: colors.warning },
    { label: "Closed", value: 18, color: colors.success },
  ];

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <AppLayout title="Dashboard" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 22,
            padding: 24,
            boxShadow: colors.shadowSoft,
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
                fontSize: 30,
                fontWeight: 800,
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: colors.subText,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Welcome back, here’s your business snapshot today.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={primaryButtonStyle(colors)}>+ Add Lead</button>
            <button style={secondaryButtonStyle(colors)}>Create Task</button>
            <button
              style={secondaryButtonStyle(colors)}
              onClick={onToggleTheme}
            >
              Toggle Theme
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
            <div
              key={item.label}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 18,
                padding: 20,
                boxShadow: colors.shadowSoft,
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
                  marginTop: 10,
                  fontSize: 34,
                  fontWeight: 800,
                  color: colors.text,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  marginTop: 12,
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
                    color: "#ffffff",
                    background: getBadgeColor(item.colorKey, colors),
                  }}
                >
                  Active
                </span>
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 1fr)",
            gap: 20,
          }}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: colors.shadowSoft,
            }}
          >
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
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: colors.text,
                  }}
                >
                  Revenue Overview
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: colors.subText,
                    fontSize: 14,
                  }}
                >
                  Monthly revenue trend and growth movement
                </div>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: colors.cardBgSoft,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                ₹6.1L Peak
              </div>
            </div>

            <LineChartCard
              data={revenueData}
              colors={colors}
              formatValue={(value) => `₹${formatCompactCurrency(value)}`}
            />
          </div>

          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: colors.shadowSoft,
            }}
          >
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
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: colors.text,
                  }}
                >
                  Lead Trend
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: colors.subText,
                    fontSize: 14,
                  }}
                >
                  Weekly incoming leads performance
                </div>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: colors.cardBgSoft,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                25 Best Day
              </div>
            </div>

            <BarChartCard data={leadsData} colors={colors} />
          </div>
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
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
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                Pipeline Performance
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: colors.subText,
                  fontSize: 14,
                }}
              >
                Track how leads move from enquiry to closed deal
              </div>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                background: colors.cardBgSoft,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              14.1% Close Rate
            </div>
          </div>

          <PipelineFunnelCard data={pipelineData} colors={colors} />
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
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
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                Notifications
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: colors.subText,
                  fontSize: 14,
                }}
              >
                Stay on top of alerts, reminders, and critical updates
              </div>
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
              }}
            >
              <span style={{ fontSize: 16 }}>🔔</span>
              <span
                style={{
                  color: colors.text,
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {unreadCount} Unread
              </span>
            </div>
          </div>

          <NotificationPanel notifications={notifications} colors={colors} />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.2fr) minmax(280px, 0.8fr)",
            gap: 20,
          }}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxShadow: colors.shadowSoft,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: colors.text,
                marginBottom: 16,
              }}
            >
              Recent Activities
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    padding: 16,
                    background: colors.cardBgSoft,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {activity.title}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      color: colors.subText,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {activity.description}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      color: colors.mutedText,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 16,
                }}
              >
                Upcoming Follow-ups
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {upcomingFollowUps.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                      background: colors.cardBgSoft,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: colors.text,
                      }}
                    >
                      {item.name}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        color: colors.subText,
                        fontSize: 14,
                      }}
                    >
                      {item.type}
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: colors.mutedText,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {item.date}
                      </span>

                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#ffffff",
                          background:
                            item.status === "Today"
                              ? colors.danger
                              : item.status === "Tomorrow"
                              ? colors.warning
                              : colors.info,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 16,
                }}
              >
                Quick Summary
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <SummaryRow
                  label="Lead Conversion Rate"
                  value="38%"
                  colors={colors}
                />
                <SummaryRow
                  label="Response Speed"
                  value="1.4 hrs"
                  colors={colors}
                />
                <SummaryRow
                  label="Team Productivity"
                  value="84%"
                  colors={colors}
                />
                <SummaryRow
                  label="Monthly Revenue"
                  value="₹4,80,000"
                  colors={colors}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function NotificationPanel({
  notifications,
  colors,
}: {
  notifications: NotificationItem[];
  colors: ReturnType<typeof getTheme>;
}) {
  return (
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
              background: item.unread ? colors.cardBgSoft : colors.cardBg,
              boxShadow: colors.shadowSoft,
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
                background: getNotificationColor(item.type, colors),
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
                    background: getNotificationColor(item.type, colors),
                  }}
                >
                  {item.type.toUpperCase()}
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
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: colors.mutedText,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {item.time}
                </span>

                {item.unread ? (
                  <span
                    style={{
                      color: getNotificationColor(item.type, colors),
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    New alert
                  </span>
                ) : (
                  <span
                    style={{
                      color: colors.mutedText,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Seen
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
        <NotificationMiniStat
          label="Unread Alerts"
          value={`${notifications.filter((item) => item.unread).length}`}
          colors={colors}
        />
        <NotificationMiniStat
          label="Critical Issues"
          value={`${notifications.filter((item) => item.type === "danger").length}`}
          colors={colors}
        />
        <NotificationMiniStat
          label="Today Reminders"
          value={`${
            notifications.filter(
              (item) => item.type === "warning" || item.type === "info"
            ).length
          }`}
          colors={colors}
        />
        <NotificationMiniStat
          label="Resolved Updates"
          value={`${notifications.filter((item) => item.type === "success").length}`}
          colors={colors}
        />
      </div>
    </div>
  );
}

function NotificationMiniStat({
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
        }}
      >
        {value}
      </div>
    </div>
  );
}

function LineChartCard({
  data,
  colors,
  formatValue,
}: {
  data: ChartPoint[];
  colors: ReturnType<typeof getTheme>;
  formatValue: (value: number) => string;
}) {
  const width = 640;
  const height = 260;
  const padding = 28;

  const max = Math.max(...data.map((item) => item.value));
  const min = Math.min(...data.map((item) => item.value));
  const range = Math.max(max - min, 1);

  const points = data
    .map((item, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height -
        padding -
        ((item.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const lastItem = data[data.length - 1];

  return (
    <div>
      <div
        style={{
          height: 260,
          width: "100%",
          borderRadius: 16,
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          padding: 12,
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {[0, 1, 2, 3].map((line) => {
            const y = padding + (line * (height - padding * 2)) / 3;
            return (
              <line
                key={line}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={colors.border}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />

          {data.map((item, index) => {
            const x =
              padding +
              (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
            const y =
              height -
              padding -
              ((item.value - min) / range) * (height - padding * 2);

            return (
              <g key={item.label}>
                <circle cx={x} cy={y} r="5" fill={colors.primary} />
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fill={colors.subText}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ color: colors.subText, fontSize: 14 }}>
          Latest revenue:
          <span
            style={{
              marginLeft: 8,
              color: colors.text,
              fontWeight: 800,
            }}
          >
            {formatValue(lastItem.value)}
          </span>
        </div>

        <div
          style={{
            color: colors.subText,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Highest month: {data.reduce((a, b) => (a.value > b.value ? a : b)).label}
        </div>
      </div>
    </div>
  );
}

function BarChartCard({
  data,
  colors,
}: {
  data: ChartPoint[];
  colors: ReturnType<typeof getTheme>;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div>
      <div
        style={{
          height: 260,
          borderRadius: 16,
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          padding: 18,
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
        }}
      >
        {data.map((item) => {
          const barHeight = `${(item.value / max) * 100}%`;

          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  width: "100%",
                  maxWidth: 42,
                  height: barHeight,
                  minHeight: 16,
                  borderRadius: 12,
                  background: colors.info,
                  boxShadow: colors.shadowSoft,
                }}
              />

              <div
                style={{
                  color: colors.subText,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ color: colors.subText, fontSize: 14 }}>
          Weekly total:
          <span
            style={{
              marginLeft: 8,
              color: colors.text,
              fontWeight: 800,
            }}
          >
            {data.reduce((sum, item) => sum + item.value, 0)} leads
          </span>
        </div>

        <div
          style={{
            color: colors.subText,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Best day: {data.reduce((a, b) => (a.value > b.value ? a : b)).label}
        </div>
      </div>
    </div>
  );
}

function PipelineFunnelCard({
  data,
  colors,
}: {
  data: PipelineStage[];
  colors: ReturnType<typeof getTheme>;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const firstValue = data[0]?.value ?? 1;
  const lastValue = data[data.length - 1]?.value ?? 0;
  const closeRate = ((lastValue / firstValue) * 100).toFixed(1);

  return (
    <div
      style={{
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
          {data.map((stage, index) => {
            const widthPercent = Math.max((stage.value / max) * 100, 24);

            return (
              <div key={stage.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}. {stage.label}
                  </div>

                  <div
                    style={{
                      color: colors.subText,
                      fontSize: 13,
                      fontWeight: 700,
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
                    boxShadow: colors.shadowSoft,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span>{stage.label}</span>
                  <span>{stage.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          borderRadius: 18,
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          padding: 20,
          display: "grid",
          gap: 12,
          alignContent: "start",
        }}
      >
        <PipelineStatCard
          label="Pipeline Close Rate"
          value={`${closeRate}%`}
          colors={colors}
        />
        <PipelineStatCard
          label="Top Funnel Volume"
          value={`${firstValue}`}
          colors={colors}
        />
        <PipelineStatCard
          label="Bottom Funnel Wins"
          value={`${lastValue}`}
          colors={colors}
        />
        <PipelineStatCard
          label="Biggest Drop Stage"
          value={getBiggestDropStage(data)}
          colors={colors}
        />
      </div>
    </div>
  );
}

function NotificationMiniStat({
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
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PipelineStatCard({
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
        background: colors.cardBg,
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
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryRow({
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
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        background: colors.cardBgSoft,
      }}
    >
      <span
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function getBiggestDropStage(data: PipelineStage[]) {
  if (data.length < 2) return "-";

  let biggestDrop = -Infinity;
  let biggestDropLabel = data[0].label;

  for (let index = 0; index < data.length - 1; index += 1) {
    const current = data[index];
    const next = data[index + 1];
    const drop = current.value - next.value;

    if (drop > biggestDrop) {
      biggestDrop = drop;
      biggestDropLabel = `${current.label} → ${next.label}`;
    }
  }

  return biggestDropLabel;
}

function getBadgeColor(
  colorKey: string,
  colors: ReturnType<typeof getTheme>
) {
  switch (colorKey) {
    case "info":
      return colors.info;
    case "premium":
      return colors.premium;
    case "success":
      return colors.success;
    case "warning":
      return colors.warning;
    default:
      return colors.primary;
  }
}

function getNotificationColor(
  type: NotificationItem["type"],
  colors: ReturnType<typeof getTheme>
) {
  switch (type) {
    case "info":
      return colors.info;
    case "warning":
      return colors.warning;
    case "danger":
      return colors.danger;
    case "success":
      return colors.success;
    default:
      return colors.primary;
  }
}

function formatCompactCurrency(value: number) {
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }

  return value.toLocaleString("en-IN");
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
    boxShadow: colors.shadowSoft,
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