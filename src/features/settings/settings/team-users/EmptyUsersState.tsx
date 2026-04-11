// src/features/settings/settings/team-users/EmptyUsersState.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type EmptyUsersStateProps = {
  mode?: ThemeMode;
  title?: string;
  message?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  compact?: boolean;
};

export default function EmptyUsersState({
  mode = "light",
  title = "No users found",
  message = "There are no team members to show right now. Add your first user or adjust the current filters.",
  actionLabel = "Add User",
  secondaryActionLabel = "Clear Filters",
  onAction,
  onSecondaryAction,
  compact = false,
}: EmptyUsersStateProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        border: `1px dashed ${theme.border}`,
        borderRadius: compact ? 18 : 24,
        background:
          mode === "dark"
            ? "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(30,41,59,0.78))"
            : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
        padding: compact ? 24 : 36,
        display: "grid",
        gap: compact ? 16 : 20,
        justifyItems: "center",
        textAlign: "center",
        boxShadow:
          mode === "dark"
            ? "0 12px 30px rgba(0,0,0,0.22)"
            : "0 12px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        style={{
          width: compact ? 64 : 78,
          height: compact ? 64 : 78,
          borderRadius: compact ? 20 : 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            mode === "dark"
              ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
              : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(59, 130, 246, 0.20)",
          fontSize: compact ? 28 : 34,
        }}
      >
        👥
      </div>

      <div style={{ maxWidth: 560 }}>
        <h3
          style={{
            margin: 0,
            fontSize: compact ? 20 : 24,
            fontWeight: 900,
            color: theme.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: compact ? 13 : 14,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          {message}
        </p>
      </div>

      {(onAction || onSecondaryAction) ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              style={{
                border: "none",
                background: theme.primary,
                color: theme.inverseText ?? "#ffffff",
                borderRadius: 12,
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 900,
                cursor: "pointer",
                boxShadow:
                  mode === "dark"
                    ? "0 10px 24px rgba(37,99,235,0.28)"
                    : "0 10px 24px rgba(37,99,235,0.18)",
              }}
            >
              {actionLabel}
            </button>
          ) : null}

          {onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 12,
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "6px 12px",
            background:
              mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(15,23,42,0.04)",
            border: `1px solid ${theme.border}`,
            color: theme.subText,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Add teammates
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "6px 12px",
            background:
              mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(15,23,42,0.04)",
            border: `1px solid ${theme.border}`,
            color: theme.subText,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Assign roles
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "6px 12px",
            background:
              mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(15,23,42,0.04)",
            border: `1px solid ${theme.border}`,
            color: theme.subText,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Track team access
        </span>
      </div>
    </div>
  );
}