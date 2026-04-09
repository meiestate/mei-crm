import type { CSSProperties } from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "neutral" | "white";

type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  thickness?: number;
  fullPage?: boolean;
  style?: CSSProperties;
};

const sizeMap: Record<SpinnerSize, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 44,
};

const colorMap: Record<
  SpinnerVariant,
  { track: string; active: string; text: string }
> = {
  primary: {
    track: "rgba(37, 99, 235, 0.18)",
    active: "#2563eb",
    text: "#2563eb",
  },
  neutral: {
    track: "rgba(148, 163, 184, 0.22)",
    active: "#334155",
    text: "#475569",
  },
  white: {
    track: "rgba(255, 255, 255, 0.28)",
    active: "#ffffff",
    text: "#ffffff",
  },
};

export default function Spinner({
  size = "md",
  variant = "primary",
  label,
  thickness = 3,
  fullPage = false,
  style,
}: SpinnerProps) {
  const spinnerSize = sizeMap[size];
  const colors = colorMap[variant];

  const spinner = (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: "50%",
          border: `${thickness}px solid ${colors.track}`,
          borderTopColor: colors.active,
          borderRightColor: colors.active,
          display: "inline-block",
          animation: "meiSpinnerRotate 0.75s linear infinite",
          boxSizing: "border-box",
        }}
      />

      {label && (
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4,
            color: colors.text,
            textAlign: "center",
          }}
        >
          {label}
        </span>
      )}

      <style>
        {`
          @keyframes meiSpinnerRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" aria-busy="true">
      {spinner}
    </div>
  );
}