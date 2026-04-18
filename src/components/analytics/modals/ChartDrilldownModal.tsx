import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
} from "react";

export type ChartDrilldownModalTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type ChartDrilldownMetric = {
  label: string;
  value: string | number;
  helperText?: string;
};

export type ChartDrilldownRecord = {
  id: string | number;
  title: string;
  subtitle?: string;
  value?: string | number;
  status?: string;
  extra?: string;
};

export type ChartDrilldownModalProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  chartTitle?: ReactNode;
  selectedLabel?: ReactNode;
  selectedValue?: ReactNode;
  icon?: ReactNode;
  metrics?: ChartDrilldownMetric[];
  records?: ChartDrilldownRecord[];
  emptyState?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  tone?: ChartDrilldownModalTone;
  loading?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  maxWidth?: number | string;
  minHeight?: number | string;
  onClose: () => void;
  onRecordClick?: (record: ChartDrilldownRecord) => void;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  border: string;
  softBg: string;
  surface: string;
  title: string;
  subtitle: string;
  chipBg: string;
  chipText: string;
  recordBg: string;
};

function getToneStyles(tone: ChartDrilldownModalTone): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        border: "#e5e7eb",
        softBg: "#f3f4f6",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        chipBg: "#111827",
        chipText: "#ffffff",
        recordBg: "#f9fafb",
      };
    case "success":
      return {
        accent: "#047857",
        border: "#a7f3d0",
        softBg: "#ecfdf3",
        surface: "#ffffff",
        title: "#064e3b",
        subtitle: "#047857",
        chipBg: "#047857",
        chipText: "#ffffff",
        recordBg: "#f0fdf4",
      };
    case "warning":
      return {
        accent: "#c2410c",
        border: "#fdba74",
        softBg: "#fff7ed",
        surface: "#ffffff",
        title: "#7c2d12",
        subtitle: "#c2410c",
        chipBg: "#c2410c",
        chipText: "#ffffff",
        recordBg: "#fffbeb",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        border: "#fecaca",
        softBg: "#fef2f2",
        surface: "#ffffff",
        title: "#7f1d1d",
        subtitle: "#b91c1c",
        chipBg: "#b91c1c",
        chipText: "#ffffff",
        recordBg: "#fff1f2",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        border: "#bfdbfe",
        softBg: "#eff6ff",
        surface: "#ffffff",
        title: "#1e3a8a",
        subtitle: "#1d4ed8",
        chipBg: "#1d4ed8",
        chipText: "#ffffff",
        recordBg: "#f8fbff",
      };
    default:
      return {
        accent: "#374151",
        border: "#e5e7eb",
        softBg: "#f9fafb",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        chipBg: "#374151",
        chipText: "#ffffff",
        recordBg: "#f9fafb",
      };
  }
}

function formatValue(value: string | number): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value;
}

function DrilldownSkeleton({ toneStyles }: { toneStyles: ToneStyles }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              minHeight: 80,
              borderRadius: 16,
              background: toneStyles.recordBg,
              border: `1px solid ${toneStyles.border}`,
              padding: 14,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "56%",
                height: 10,
                borderRadius: 8,
                background: toneStyles.softBg,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                width: "72%",
                height: 20,
                borderRadius: 10,
                background: toneStyles.softBg,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: "48%",
                height: 10,
                borderRadius: 8,
                background: toneStyles.softBg,
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              minHeight: 72,
              borderRadius: 16,
              background: toneStyles.recordBg,
              border: `1px solid ${toneStyles.border}`,
              padding: 14,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "32%",
                height: 12,
                borderRadius: 8,
                background: toneStyles.softBg,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                width: "68%",
                height: 14,
                borderRadius: 8,
                background: toneStyles.softBg,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: "44%",
                height: 10,
                borderRadius: 8,
                background: toneStyles.softBg,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartDrilldownModal({
  open,
  title = "Chart Drilldown",
  subtitle = "Review the deeper breakdown behind the selected chart point.",
  chartTitle,
  selectedLabel,
  selectedValue,
  icon = "📊",
  metrics = [],
  records = [],
  emptyState,
  footer,
  children,
  tone = "default",
  loading = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxWidth = 960,
  minHeight = 240,
  onClose,
  onRecordClick,
  style,
}: ChartDrilldownModalProps) {
  const toneStyles = getToneStyles(tone);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Chart Drilldown Modal"}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.58)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={handleModalClick}
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          minHeight,
          overflow: "hidden",
          borderRadius: 24,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.surface,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            padding: 20,
            borderBottom: `1px solid ${toneStyles.border}`,
            background: toneStyles.surface,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                minWidth: 56,
                borderRadius: 18,
                background: toneStyles.softBg,
                border: `1px solid ${toneStyles.border}`,
                color: toneStyles.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {icon}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: toneStyles.title,
                  marginBottom: subtitle ? 8 : 0,
                }}
              >
                {title}
              </div>

              {subtitle ? (
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: toneStyles.subtitle,
                    marginBottom:
                      chartTitle || selectedLabel || selectedValue ? 12 : 0,
                  }}
                >
                  {subtitle}
                </div>
              ) : null}

              {(chartTitle || selectedLabel || selectedValue) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {chartTitle ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 28,
                        padding: "0 10px",
                        borderRadius: 999,
                        background: toneStyles.softBg,
                        border: `1px solid ${toneStyles.border}`,
                        color: toneStyles.accent,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {chartTitle}
                    </span>
                  ) : null}

                  {selectedLabel ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 28,
                        padding: "0 10px",
                        borderRadius: 999,
                        background: toneStyles.recordBg,
                        border: `1px solid ${toneStyles.border}`,
                        color: toneStyles.title,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {selectedLabel}
                    </span>
                  ) : null}

                  {selectedValue ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 28,
                        padding: "0 10px",
                        borderRadius: 999,
                        background: toneStyles.chipBg,
                        color: toneStyles.chipText,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {selectedValue}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              borderRadius: 12,
              border: `1px solid ${toneStyles.border}`,
              background: "#ffffff",
              color: toneStyles.accent,
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <DrilldownSkeleton toneStyles={toneStyles} />
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {metrics.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  {metrics.map((metric) => (
                    <div
                      key={`${metric.label}-${metric.value}`}
                      style={{
                        minHeight: 82,
                        borderRadius: 16,
                        background: toneStyles.recordBg,
                        border: `1px solid ${toneStyles.border}`,
                        padding: 14,
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          color: "#6b7280",
                          marginBottom: 8,
                        }}
                      >
                        {metric.label}
                      </div>

                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          lineHeight: 1.15,
                          color: toneStyles.title,
                          marginBottom: metric.helperText ? 6 : 0,
                        }}
                      >
                        {formatValue(metric.value)}
                      </div>

                      {metric.helperText ? (
                        <div
                          style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: toneStyles.subtitle,
                          }}
                        >
                          {metric.helperText}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {children ? <div>{children}</div> : null}

              {records.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {records.map((record) => {
                    const clickable = Boolean(onRecordClick);

                    return (
                      <button
                        key={record.id}
                        type="button"
                        onClick={() => onRecordClick?.(record)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: `1px solid ${toneStyles.border}`,
                          background: toneStyles.recordBg,
                          borderRadius: 16,
                          padding: 14,
                          boxSizing: "border-box",
                          cursor: clickable ? "pointer" : "default",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                lineHeight: 1.3,
                                color: toneStyles.title,
                                marginBottom: record.subtitle ? 6 : 0,
                                wordBreak: "break-word",
                              }}
                            >
                              {record.title}
                            </div>

                            {record.subtitle ? (
                              <div
                                style={{
                                  fontSize: 13,
                                  lineHeight: 1.55,
                                  color: toneStyles.subtitle,
                                  marginBottom:
                                    record.extra || record.status ? 8 : 0,
                                  wordBreak: "break-word",
                                }}
                              >
                                {record.subtitle}
                              </div>
                            ) : null}

                            {(record.extra || record.status) && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                {record.status ? (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      minHeight: 26,
                                      padding: "0 10px",
                                      borderRadius: 999,
                                      background: toneStyles.softBg,
                                      border: `1px solid ${toneStyles.border}`,
                                      color: toneStyles.accent,
                                      fontSize: 11,
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.02em",
                                    }}
                                  >
                                    {record.status}
                                  </span>
                                ) : null}

                                {record.extra ? (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#6b7280",
                                    }}
                                  >
                                    {record.extra}
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>

                          {record.value !== undefined ? (
                            <div
                              style={{
                                fontSize: 18,
                                fontWeight: 800,
                                lineHeight: 1.2,
                                color: toneStyles.accent,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatValue(record.value)}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {!children && metrics.length === 0 && records.length === 0 ? (
                <div
                  style={{
                    minHeight: 220,
                    borderRadius: 18,
                    border: `1px dashed ${toneStyles.border}`,
                    background: toneStyles.recordBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 20,
                    boxSizing: "border-box",
                    color: toneStyles.subtitle,
                    fontSize: 14,
                    lineHeight: 1.6,
                    fontWeight: 600,
                  }}
                >
                  {emptyState ??
                    "No drilldown details available for the selected chart point."}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${toneStyles.border}`,
            background: "#ffffff",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {footer ? (
            <div style={{ flex: 1, minWidth: 0 }}>{footer}</div>
          ) : (
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.55,
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              Click a record to inspect deeper workflow details.
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              minHeight: 40,
              padding: "0 16px",
              borderRadius: 12,
              border: `1px solid ${toneStyles.border}`,
              background: "#ffffff",
              color: toneStyles.accent,
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}