import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import { ThemeMode, getTheme } from "../../theme";

type TasksPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

const tasks = [
  { id: 1, title: "Call Arun Kumar", priority: "High", dueDate: "2026-04-03", status: "Pending" },
  { id: 2, title: "Send project brochure", priority: "Medium", dueDate: "2026-04-04", status: "In Progress" },
  { id: 3, title: "Follow up with Priya", priority: "High", dueDate: "2026-04-05", status: "Pending" },
  { id: 4, title: "Close deal documentation", priority: "Low", dueDate: "2026-04-06", status: "Completed" },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "#dc2626";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#16a34a";
    default:
      return "#6b7280";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "#2563eb";
    case "In Progress":
      return "#7c3aed";
    case "Completed":
      return "#16a34a";
    default:
      return "#6b7280";
  }
}

export default function TasksPage({ mode, onToggleTheme }: TasksPageProps) {
  const colors = getTheme(mode);

  return (
    <AppLayout title="Tasks" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, color: colors.text }}>Task Management</h2>
          <p style={{ margin: "8px 0 0", color: colors.subText }}>
            Track pending, in-progress, and completed work items.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Card label="Total Tasks" value={tasks.length} colors={colors} />
          <Card label="Pending" value={tasks.filter((t) => t.status === "Pending").length} colors={colors} />
          <Card label="In Progress" value={tasks.filter((t) => t.status === "In Progress").length} colors={colors} />
          <Card label="Completed" value={tasks.filter((t) => t.status === "Completed").length} colors={colors} />
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: colors.shadowSoft,
          }}
        >
          <div style={{ padding: 20, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>Tasks Table</div>
            <div style={{ fontSize: 14, color: colors.subText, marginTop: 4 }}>
              All task records are listed below.
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr style={{ background: colors.tableHeadBg, textAlign: "left" }}>
                  <th style={thStyle(colors.subText)}>ID</th>
                  <th style={thStyle(colors.subText)}>Task</th>
                  <th style={thStyle(colors.subText)}>Priority</th>
                  <th style={thStyle(colors.subText)}>Due Date</th>
                  <th style={thStyle(colors.subText)}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    style={{
                      borderTop: `1px solid ${colors.border}`,
                      background: colors.rowBg,
                    }}
                  >
                    <td style={tdStyle(colors.text)}>{task.id}</td>
                    <td style={tdStyle(colors.text)}>{task.title}</td>
                    <td style={tdStyle(colors.text)}>
                      <span
                        style={{
                          display: "inline-block",
                          background: getPriorityColor(task.priority),
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td style={tdStyle(colors.text)}>{task.dueDate}</td>
                    <td style={tdStyle(colors.text)}>
                      <span
                        style={{
                          display: "inline-block",
                          background: getStatusColor(task.status),
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Card({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div style={{ fontSize: 14, color: colors.subText }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 32, fontWeight: 800, color: colors.text }}>{value}</div>
    </div>
  );
}

function thStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 13,
    color,
    fontWeight: 700,
  };
}

function tdStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 15,
    color,
  };
}