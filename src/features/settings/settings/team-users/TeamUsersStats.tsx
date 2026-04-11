// src/features/settings/settings/team-users/TeamUsersStats.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type TeamUsersStatsProps = {
  mode?: ThemeMode;
  loading?: boolean;
  totalUsers?: number;
  activeUsers?: number;
  invitedUsers?: number;
  inactiveUsers?: number;
  suspendedUsers?: number;
  adminsCount?: number;
  managersCount?: number;
  agentsCount?: number;
};

type StatTone = "primary" | "success" | "warning" | "neutral" | "danger";

type StatItem = {
  label: string;
  value: number;
  helper: string;
  icon: string;
  tone: StatTone;
};

function getToneStyles(mode: ThemeMode, tone: StatTone) {
  if (tone === "primary") {
    return {
      bg:
        mode === "dark"
          ? "rgba(59, 130, 246, 0.16)"
          : "rgba(59, 130, 246, 0.10)",
      border: "rgba(59, 130, 246, 0.22)",
      text: "#2563eb",
    };
  }

  if (tone === "success") {
    return {
      bg:
        mode === "dark"
          ? "rgba(34, 197, 94, 0.16)"
          : "rgba(34, 197, 94, 0.10)",
      border: "rgba(34, 197, 94, 0.22)",
      text: "#16a34a",
    };
  }

  if (tone === "warning") {
    return {
      bg:
        mode === "dark"
          ? "rgba(245, 158, 11, 0.16)"
          : "rgba(245, 158, 11, 0.10)",
      border: "rgba(245, 158, 11, 0.22)",
      text: "#d97706",
    };
  }

  if (tone === "danger") {
    return {
      bg:
        mode === "dark"
          ? "rgba(239, 68, 68, 0.16)"
          : "rgba(239, 68, 68, 0.10)",
      border: "rgba(239, 68, 68, 0.22)",
      text: "#dc2626",
    };
  }

  return {
    bg:
      mode === "dark"
        ? "rgba(100, 116, 139, 0.16)"
        : "rgba(100, 116, 139, 0.10)",
    border: "rgba(100, 116, 139, 0.22)",
    text: "#475569",
  };
}

function SkeletonCard({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        background: theme.cardBg,
        padding: 16,
        display: "grid",
        gap: 12,
        boxShadow:
          mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.24)"
            : "0 10px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: theme.border,
          }}
        />
        <div
          style={{
            width: 54,
            height: 12,
            borderRadius: 999,
            background: theme.borderSoft,
          }}
        />
      </div>

      <div
        style={{
          width: "46%",
          height: 24,
          borderRadius: 999,
          background: theme.border,
        }}
      />

      <div
        style={{
          width: "72%",
          height: 10,
          borderRadius: 999,
          background: theme.borderSoft,
        }}
      />
    </div>
  );
}

function StatCard({
  item,
  mode,
}: {
  item: StatItem;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);
  const tone = getToneStyles(mode, item.tone);

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        background: theme.cardBg,
        padding: 16,
        display: "grid",
        gap: 14,
        boxShadow:
          mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.24)"
            : "0 10px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: tone.bg,
            border: `1px solid ${tone.border}`,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {item.icon}
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "5px 10px",
            background: tone.bg,
            border: `1px solid ${tone.border}`,
            color: tone.text,
            fontSize: 11,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      </div>

      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: theme.text,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {item.value}
        </div>

        <div
          style={{
            fontSize: 13,
            color: theme.subText,
            lineHeight: 1.6,
          }}
        >
          {item.helper}
        </div>
      </div>
    </div>
  );
}

export default function TeamUsersStats({
  mode = "light",
  loading = false,
  totalUsers = 0,
  activeUsers = 0,
  invitedUsers = 0,
  inactiveUsers = 0,
  suspendedUsers = 0,
  adminsCount = 0,
  managersCount = 0,
  agentsCount = 0,
}: TeamUsersStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Total Users",
      value: totalUsers,
      helper: "Everyone currently inside your workspace.",
      icon: "👥",
      tone: "primary",
    },
    {
      label: "Active",
      value: activeUsers,
      helper: "Users who can access and use the workspace right now.",
      icon: "✅",
      tone: "success",
    },
    {
      label: "Invited",
      value: invitedUsers,
      helper: "Pending invites waiting for acceptance.",
      icon: "✉️",
      tone: "warning",
    },
    {
      label: "Inactive",
      value: inactiveUsers,
      helper: "Users who are paused or not currently engaged.",
      icon: "⏸️",
      tone: "neutral",
    },
    {
      label: "Suspended",
      value: suspendedUsers,
      helper: "Users temporarily blocked from workspace access.",
      icon: "🚫",
      tone: "danger",
    },
    {
      label: "Admins",
      value: adminsCount,
      helper: "High-control users with broad workspace permissions.",
      icon: "🛡️",
      tone: "danger",
    },
    {
      label: "Managers",
      value: managersCount,
      helper: "Team leads overseeing operations and performance.",
      icon: "📌",
      tone: "primary",
    },
    {
      label: "Agents",
      value: agentsCount,
      helper: "Execution-focused users driving daily field or sales work.",
      icon: "⚡",
      tone: "success",
    },
  ];

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} mode={mode} />
          ))
        : stats.map((item) => (
            <StatCard
              key={item.label}
              item={item}
              mode={mode}
            />
          ))}
    </section>
  );
}