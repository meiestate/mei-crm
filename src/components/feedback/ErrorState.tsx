import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type ErrorStateProps = {
  mode: ThemeMode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  fullHeight?: boolean;
};

export default function ErrorState({
  mode,
  title = "Something went wrong",
  message = "We couldn’t load this section right now. Please try again.",
  actionLabel = "Try Again",
  onAction,
  icon,
  fullHeight = false,
}: ErrorStateProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        width: "100%",
        minHeight: fullHeight ? "60vh" : 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          padding: "32px 28px",
          textAlign: "center",
          boxShadow:
            mode === "dark"
              ? "0 18px 50px rgba(0,0,0,0.28)"
              : "0 18px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 18px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              mode === "dark"
                ? "rgba(239,68,68,0.14)"
                : "rgba(239,68,68,0.10)",
            color: theme.warning ?? "#ef4444",
            border: `1px solid ${
              mode === "dark"
                ? "rgba(239,68,68,0.20)"
                : "rgba(239,68,68,0.16)"
            }`,
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          {icon ?? "!"}
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 24,
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