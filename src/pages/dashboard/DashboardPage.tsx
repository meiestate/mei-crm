import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";
import type { CSSProperties } from "react";

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

export default function DashboardPage({
  mode,
  onToggleTheme,
}: DashboardPageProps) {
  const colors = getTheme(mode);

  const kpiData = [
    { label: "Total Leads", value: "128", note: "+12 this week", color: colors.info },
    { label: "Qualified Leads", value: "42", note: "+6 this week", color: colors.premium },
    { label: "Closed Deals", value: "18", note: "+3 this month", color: colors.success },
    { label: "Pending Tasks", value: "11", note: "4 due today", color: colors.warning },
  ];

  const notifications: NotificationItem[] = [
    {
      title: "Follow-up due today",
      message: "Arun Kumar needs a call back before 5:00 PM.",
      time: "5 mins ago",
      badge: "WARNING",
      color: colors.warning,
    },
    {
      title: "New website lead",
      message: "Sneha submitted a project inquiry from the landing page.",
      time: "12 mins ago",
      badge: "INFO",
      color: colors.info,
    },
    {
      title: "Deal moved to negotiation",
      message: "Meena Corp deal has advanced to the negotiation stage.",
      time: "42 mins ago",
      badge: "SUCCESS",
      color: colors.success,
    },
    {
      title: "Task overdue",
      message: "Proposal document for Rahul has not been sent yet.",
      time: "1 hour ago",
      badge: "DANGER",
      color: colors.danger,
    },
  ];

  const pipelineData = [
    { label: "New Leads", value: 128, color: colors.info },
    { label: "Contacted", value: 96, color: colors.primary },
    { label: "Qualified", value: 42, color: colors.premium },
    { label: "Negotiation", value: 24, color: colors.warning },
    { label: "Closed", value: 18, color: colors.success },
  ];

  const revenueData = [220000, 310000, 420000, 480000, 530000, 610000];
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const leadsData = [12, 18, 14, 22, 19, 25];
  const leadsLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const maxPipeline = Math.max(...pipelineData.map((item) => item.value));
  const unreadCount = 2;

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
              }}
            >
              Dashboard
            </h1>

            <p style={subTextStyle(colors)}>
              Welcome back, here’s your business snapshot today.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={primaryButtonStyle(colors)}>+ Add Lead</button>
            <button style={secondaryButtonStyle(colors)}>Create Task</button>
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
            <div key={item.label} style={cardStyle(colors)}>
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
                    background: item.color,
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
          <div style={cardStyle(colors)}>
            <h2 style={sectionTitle(colors)}>Revenue Overview</h2>
            <p style={subTextStyle(colors)}>Monthly revenue trend and growth movement</p>

            <div
              style={{
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
              }}
            >
              {revenueData.map((value, index) => {
                const max = Math.max(...revenueData);
                const height = `${(value / max) * 100}%`;

                return (
                  <div
                    key={revenueLabels[index]}
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
                        fontSize: 12,
                        fontWeight: 700,
                        color: colors.text,
                      }}
                    >
                      {revenueLabels[index]}
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
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle(colors)}>
            <h2 style={sectionTitle(colors)}>Lead Trend</h2>
            <p style={subTextStyle(colors)}>Weekly incoming leads performance</p>

            <div
              style={{
                marginTop: 18,
                height: 260,
                borderRadius: 16,
                background: colors.cardBgSoft,
                border: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "flex-end",
                gap: 14,
                padding: 18,
              }}
            >
              {leadsData.map((value, index) => {
                const max = Math.max(...leadsData);
                const height = `${(value / max) * 100}%`;

                return (
                  <div
                    key={leadsLabels[index]}
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
                        fontSize: 12,
                        fontWeight: 700,
                        color: colors.text,
                      }}
                    >
                      {value}
                    </div>

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

                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.subText,
                      }}
                    >
                      {leadsLabels[index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section style={cardStyle(colors)}>
          <h2 style={sectionTitle(colors)}>Pipeline Performance</h2>
          <p style={subTextStyle(colors)}>Track how leads move from enquiry to closed deal</p>

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
                  const widthPercent = Math.max((stage.value / maxPipeline) * 100, 24);

                  return (
                    <div key={stage.label}>
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
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <MiniStatCard colors={colors} label="Pipeline Close Rate" value="14.1%" />
              <MiniStatCard colors={colors} label="Top Funnel Volume" value="128" />
              <MiniStatCard colors={colors} label="Bottom Funnel Wins" value="18" />
              <MiniStatCard
                colors={colors}
                label="Biggest Drop Stage"
                value="Contacted → Qualified"
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
              <MiniStatCard colors={colors} label="Unread Alerts" value="2" />
              <MiniStatCard colors={colors} label="Critical Issues" value="1" />
              <MiniStatCard colors={colors} label="Today Reminders" value="2" />
              <MiniStatCard colors={colors} label="Resolved Updates" value="1" />
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

function primaryButtonStyle(colors: ReturnType<typeof getTheme>): CSSProperties {
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

function secondaryButtonStyle(colors: ReturnType<typeof getTheme>): CSSProperties {
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