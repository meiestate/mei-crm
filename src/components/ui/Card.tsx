import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  padding?: number | string;
  hoverable?: boolean;
  bordered?: boolean;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  onClick?: () => void;
};

export default function Card({
  children,
  title,
  subtitle,
  action,
  footer,
  padding = 20,
  hoverable = false,
  bordered = true,
  style,
  bodyStyle,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: bordered ? "1px solid #e2e8f0" : "none",
        borderRadius: 18,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hoverable) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 16px 36px rgba(15, 23, 42, 0.12)";
      }}
      onMouseLeave={(e) => {
        if (!hoverable) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(15, 23, 42, 0.08)";
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.3,
                }}
              >
                {title}
              </div>
            )}

            {subtitle && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}

      <div
        style={{
          padding,
          ...bodyStyle,
        }}
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #f1f5f9",
            background: "#f8fafc",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}