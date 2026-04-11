// src/features/settings/settings/team-users/TeamUsersHeader.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type TeamUsersHeaderProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  totalUsers?: number;
  activeUsers?: number;
  invitedUsers?: number;
  inactiveUsers?: number;
  loading?: boolean;
  onInviteUser?: () => void;
  onExportUsers?: () => void;
  onRefresh?: () => void;
};

type StatCardProps = {
  label: string;
  value: number;
  tone: "primary" | "success" | "warning" | "neutral";
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
};

function StatCard({
  label,
  value,
  tone,
  theme,
  mode,
}: StatCardProps) {
  const toneMap = {
    primary: {
      bg:
        mode === "dark"
          ? "rgba(59, 130, 246, 0.16)"
          : "rgba(59, 130, 246, 0.10)",
      border: "rgba(59, 130, 246, 0.22)",
      text: "#2563eb",
    },
    success: {
      bg:
        mode === "dark"
          ? "rgba(34, 197, 94, 0.16)"
          : "rgba(34, 197, 94, 0.10)",
      border: "rgba(34, 197, 94, 0.22)",
      text: "#16a34a",
    },
    warning: {
      bg:
        mode === "dark"
          ? "rgba(245, 158, 11, 0.16)"
          : "rgba(245, 158, 11, 0.10)",
      border: "rgba(245, 158, 11, 0.22)",
      text: "#d97706",
    },
    neutral: {
      bg:
        mode === "dark"
          ? "rgba(100, 116, 139, 0.16)"
          : "rgba(100, 116, 139, 0.10)",
      border: "rgba(100, 116, 139, 0.22)",
      text: "#475569",
    },
  }[tone];

  return (
    <div
      style={{
        border: `1px solid ${toneMap.border}`,
        background: toneMap.bg,
        borderRadius: 18,
        padding: "14px 16px",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.mutedText,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 900,
          color: toneMap.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function TeamUsersHeader({
  mode = "light",
  title = "Team Users",
  subtitle = "Manage workspace members, roles, invitations, and access with a clean control center.",
  totalUsers = 0,
  activeUsers = 0,
  invitedUsers = 0,
  inactiveUsers = 0,
  loading = false,
  onInviteUser,
  onExportUsers,
  onRefresh,
}: TeamUsersHeaderProps) {
  const theme = getTheme(mode);

  const actionButtonBase = {
    borderRadius: 12,
    padding: "11px 15px",
    fontSize: 14,
    fontWeight: 800,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: "all 0.18s ease",
    whiteSpace: "nowrap" as const,
  };

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background:
          mode === "dark"
            ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.96))"
            : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
        boxShadow:
          mode === "dark"
            ? "0 18px 40px rgba(0,0,0,0.28)"
            : "0 18px 40px rgba(15, 23, 42, 0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    mode === "dark"
                      ? "linear-gradient(135deg, rgba(59,130,246,0.20), rgba(99,102,241,0.20))"
                      : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                  border: "1px solid rgba(59,130,246,0.22)",
                  fontSize: 22,
                }}
              >
                👥
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 900,
                    color: theme.text,
                    lineHeight: 1.1,
                  }}
                >
                  {title}
                </h1>
              </div>
            </div>

            <p
              style={{
                margin: 0,
                color: theme.subText,
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 760,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                style={{
                  ...actionButtonBase,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBgSoft,
                  color: theme.text,
                }}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            ) : null}

            {onExportUsers ? (
              <button
                type="button"
                onClick={onExportUsers}
                disabled={loading}
                style={{
                  ...actionButtonBase,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBgSoft,
                  color: theme.text,
                }}
              >
                Export Users
              </button>
            ) : null}

            {onInviteUser ? (
              <button
                type="button"
                onClick={onInviteUser}
                disabled={loading}
                style={{
                  ...actionButtonBase,
                  border: "none",
                  background: theme.primary,
                  color: theme.inverseText ?? "#ffffff",
                  boxShadow:
                    mode === "dark"
                      ? "0 10px 24px rgba(37,99,235,0.30)"
                      : "0 10px 24px rgba(37,99,235,0.18)",
                }}
              >
                + Invite User
              </button>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <StatCard
            label="Total Users"
            value={totalUsers}
            tone="primary"
            theme={theme}
            mode={mode}
          />
          <StatCard
            label="Active"
            value={activeUsers}
            tone="success"
            theme={theme}
            mode={mode}
          />
          <StatCard
            label="Invited"
            value={invitedUsers}
            tone="warning"
            theme={theme}
            mode={mode}
          />
          <StatCard
            label="Inactive"
            value={inactiveUsers}
            tone="neutral"
            theme={theme}
            mode={mode}
          />
        </div>
      </div>
    </section>
  );
}