import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type BreadcrumbItem = {
  label: string;
  onClick?: () => void;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  mode: ThemeMode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageHeader({
  title,
  subtitle,
  mode,
  actions,
  breadcrumbs = [],
}: PageHeaderProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "20px 24px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.cardBg,
      }}
    >
      {breadcrumbs.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: theme.mutedText,
          }}
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div
                key={`${item.label}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  onClick={item.onClick}
                  style={{
                    cursor: item.onClick ? "pointer" : "default",
                    color: isLast ? theme.text : theme.mutedText,
                    fontWeight: isLast ? 600 : 500,
                    transition: "0.2s ease",
                  }}
                >
                  {item.label}
                </span>

                {!isLast && (
                  <span
                    style={{
                      color: theme.borderStrong,
                    }}
                  >
                    /
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.2,
              color: theme.text,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: theme.subText,
                maxWidth: 700,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}