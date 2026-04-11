// src/features/settings/settings/team-users/UserDetailsCard.tsx

import { getTheme, type ThemeMode } from "../../../../theme";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

export type UserDetailsCardUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
  isOwner?: boolean;
};

type UserDetailsCardProps = {
  user: UserDetailsCardUser | null;
  mode?: ThemeMode;
  loading?: boolean;
  onEdit?: (user: UserDetailsCardUser) => void;
};

function formatDateTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value?: string): string {
  if (!value) return "No recent activity";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No recent activity";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 30) return `${days} day ago`;

  return formatDateTime(value);
}

function getInitials(name?: string): string {
  const value = (name ?? "").trim();
  if (!value) return "U";

  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function InfoBlock({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        background: theme.cardBgSoft,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: theme.mutedText,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: theme.text,
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function SkeletonCard({ mode }: { mode: ThemeMode }) {
  const theme = getTheme(mode);

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 14px 34px rgba(0,0,0,0.26)"
            : "0 14px 34px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: `1px solid ${theme.border}`,
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: theme.border,
            }}
          />
          <div style={{ display: "grid", gap: 8 }}>
            <div
              style={{
                width: "38%",
                height: 16,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "56%",
                height: 12,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
            <div
              style={{
                width: "28%",
                height: 12,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              background: theme.cardBgSoft,
              padding: 14,
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                width: "34%",
                height: 10,
                borderRadius: 999,
                background: theme.border,
              }}
            />
            <div
              style={{
                width: "70%",
                height: 12,
                borderRadius: 999,
                background: theme.borderSoft,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function UserDetailsCard({
  user,
  mode = "light",
  loading = false,
  onEdit,
}: UserDetailsCardProps) {
  const theme = getTheme(mode);

  if (loading) {
    return <SkeletonCard mode={mode} />;
  }

  if (!user) {
    return (
      <section
        style={{
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          background: theme.cardBg,
          boxShadow:
            mode === "dark"
              ? "0 14px 34px rgba(0,0,0,0.26)"
              : "0 14px 34px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 16px",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
                  : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
              border: `1px solid ${theme.border}`,
              fontSize: 30,
            }}
          >
            👤
          </div>

          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            No user selected
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.subText,
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            Select a team member to view profile details, access status, and timeline information.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 14px 34px rgba(0,0,0,0.26)"
            : "0 14px 34px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: `1px solid ${theme.border}`,
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(248,250,252,0.85), rgba(248,250,252,0.35))",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr",
            gap: 14,
            alignItems: "center",
            minWidth: 0,
            flex: 1,
          }}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                objectFit: "cover",
                border: `1px solid ${theme.border}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background:
                  mode === "dark"
                    ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
                    : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                border: `1px solid ${theme.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.text,
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              {getInitials(user.name)}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 900,
                  color: theme.text,
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {user.name}
              </h2>

              {user.isOwner ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "5px 10px",
                    background: "rgba(245, 158, 11, 0.12)",
                    color: "#d97706",
                    border: "1px solid rgba(245, 158, 11, 0.24)",
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  Owner
                </span>
              ) : null}
            </div>

            <div
              style={{
                fontSize: 14,
                color: theme.subText,
                lineHeight: 1.7,
                wordBreak: "break-word",
                marginBottom: 10,
              }}
            >
              {user.email}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <RoleBadge role={user.role} mode={mode} />
              <StatusBadge status={user.status} mode={mode} />
            </div>
          </div>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(user)}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 900,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Edit User
          </button>
        ) : null}
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        <InfoBlock
          label="Phone"
          value={user.phone || "—"}
          theme={theme}
        />
        <InfoBlock
          label="Department"
          value={user.department || "—"}
          theme={theme}
        />
        <InfoBlock
          label="Role"
          value={user.role || "—"}
          theme={theme}
        />
        <InfoBlock
          label="Status"
          value={user.status || "—"}
          theme={theme}
        />
        <InfoBlock
          label="Last Active"
          value={
            user.lastActiveAt
              ? `${formatRelativeTime(user.lastActiveAt)} (${formatDateTime(user.lastActiveAt)})`
              : "No recent activity"
          }
          theme={theme}
        />
        <InfoBlock
          label="Joined At"
          value={formatDateTime(user.joinedAt)}
          theme={theme}
        />
        <InfoBlock
          label="Invited At"
          value={formatDateTime(user.invitedAt)}
          theme={theme}
        />
        <InfoBlock
          label="User ID"
          value={user.id}
          theme={theme}
        />
      </div>
    </section>
  );
}