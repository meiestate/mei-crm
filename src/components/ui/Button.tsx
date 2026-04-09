import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "1px solid #1d4ed8",
    boxShadow: "0 10px 24px rgba(37, 99, 235, 0.28)",
  },
  secondary: {
    background: "#0f172a",
    color: "#e2e8f0",
    border: "1px solid #1e293b",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.22)",
  },
  outline: {
    background: "transparent",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "#334155",
    border: "1px solid transparent",
    boxShadow: "none",
  },
  danger: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
    border: "1px solid #dc2626",
    boxShadow: "0 10px 24px rgba(239, 68, 68, 0.24)",
  },
  success: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "1px solid #059669",
    boxShadow: "0 10px 24px rgba(16, 185, 129, 0.24)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: 34,
    padding: "0 12px",
    fontSize: 13,
    borderRadius: 10,
  },
  md: {
    height: 40,
    padding: "0 16px",
    fontSize: 14,
    borderRadius: 12,
  },
  lg: {
    height: 46,
    padding: "0 20px",
    fontSize: 15,
    borderRadius: 14,
  },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  style,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: 600,
        fontFamily: "inherit",
        lineHeight: 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.65 : 1,
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        userSelect: "none",
        outline: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.filter = "brightness(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.filter = "brightness(1)";
      }}
      onMouseDown={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "currentColor",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span style={{ display: "inline-flex" }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: "inline-flex" }}>{rightIcon}</span>}
        </>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
}