import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type LoadingStateProps = {
  mode: ThemeMode;
  title?: string;
  message?: string;
  fullHeight?: boolean;
  minHeight?: number | string;
};

export default function LoadingState({
  mode,
  title = "Loading",
  message = "Please wait while we prepare your data.",
  fullHeight = false,
  minHeight,
}: LoadingStateProps) {
  const theme = getTheme(mode);

  const resolvedMinHeight =
    minHeight ?? (fullHeight ? "60vh" : 260);

  return (
    <div
      style={{
        width: "100%",
        minHeight: resolvedMinHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
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
            width: 74,
            height: 74,
            margin: "0 auto 18px",
            borderRadius: 999,
            border: `6px solid ${
              mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(15,23,42,0.08)"
            }`,
            borderTop: `6px solid ${theme.primary}`,
            animation: "mei-spin 0.9s linear infinite",
            boxSizing: "border-box",
          }}
        />

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
            maxWidth: 380,
            fontSize: 14,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          {message}
        </p>

        <style>
          {`
            @keyframes mei-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}