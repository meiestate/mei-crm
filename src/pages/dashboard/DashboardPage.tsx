import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type DashboardPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

const kpiData = [
  { label: "Total Leads", value: "128", colorKey: "info" },
  { label: "Qualified Leads", value: "42", colorKey: "premium" },
  { label: "Closed Deals", value: "18", colorKey: "success" },
  { label: "Pending Tasks", value: "11", colorKey: "warning" },
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

export default function DashboardPage({
  mode,
  onToggleTheme,
}: DashboardPageProps) {
  const colors = getTheme(mode);

  return (
    <AppLayout title="Dashboard" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
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
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  color: colors.text,
                }}
              >
                Welcome back to MEI CRM
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                }}
              >
                Here is your business snapshot for today.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={primaryButtonStyle(colors)}>+ Add Lead</button>
              <button style={secondaryButtonStyle(colors)}>Create Task</button>
            </div>
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
              <div style={{ color: colors.subText, fontSize: 14 }}>
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

              <div style={{ marginTop: 14 }}>
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
                  Active Metric
                </span>
              </div>
            </div>
          ))}
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

function primaryButtonStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
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

function secondaryButtonStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
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