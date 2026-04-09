import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type NoDataStateProps = {
  mode: ThemeMode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  compact?: boolean;
  fullHeight?: boolean;
};

export default function NoDataState({
  mode,
  title = "No data found",
  message = "There’s nothing to show here right now.",
  actionLabel = "Create New",
  onAction,
  icon,
  compact = false,
  fullHeight = false,
}: NoDataStateProps) {
  const theme = getTheme(mode);

  const minHeight = compact ? 220 : fullHeight ? "60vh" : 320;

  return (
    <div
      style={{
        width: "100%",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: compact ? 16 : 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: compact ? 480 : 560,
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: compact ? 20 : 24,
          padding: compact ? "24px 20px" : "32px 28px",
          textAlign: "center",
          boxShadow:
            mode === "dark"
              ? "0 18px 50px rgba(0,0,0,0.28)"
              : "0 18px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            width: compact ? 60 : 72,
            height: compact ? 60 : 72,
            margin: "0 auto 18px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              mode === "dark"
                ? "rgba(59,130,246,0.14)"
                : "rgba(37,99,235,0.10)",
            color: theme.primary,
            border: `1px solid ${
              mode === "dark"
                ? "rgba(59,130,246,0.20)"
                : "rgba(37,99,235,0.16)"
            }`,
            fontSize: compact ? 24 : 28,
            fontWeight: 800,
          }}
        >
          {icon ?? "∅"}
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: compact ? 20 : 24,
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: theme.text,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: "10px auto 0",
            maxWidth: 420,
            fontSize: 14,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          {message}
        </p>

        {onAction && (
          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={onAction}
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
                borderRadius: 14,
                padding: "12px 18px",
                fontSize: 14,
                fontWeight: 700,
                background: theme.primary,
                color: "#ffffff",
                boxShadow:
                  mode === "dark"
                    ? "0 10px 24px rgba(37,99,235,0.28)"
                    : "0 10px 24px rgba(37,99,235,0.18)",
                transition: "all 0.2s ease",
              }}
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}