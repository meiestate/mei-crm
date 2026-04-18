import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ExportAnalyticsFormat = "pdf" | "csv" | "xlsx" | "png" | "json";

export type ExportAnalyticsSection = {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type ExportAnalyticsPayload = {
  fileName: string;
  format: ExportAnalyticsFormat;
  selectedSections: string[];
  includeDateRange: boolean;
  includeFilters: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  includeTables: boolean;
};

export type ExportAnalyticsModalProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  availableSections?: ExportAnalyticsSection[];
  defaultSelectedSections?: string[];
  defaultFormat?: ExportAnalyticsFormat;
  defaultFileName?: string;
  includeDateRangeByDefault?: boolean;
  includeFiltersByDefault?: boolean;
  includeSummaryByDefault?: boolean;
  includeChartsByDefault?: boolean;
  includeTablesByDefault?: boolean;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  loading?: boolean;
  maxWidth?: number | string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  onClose: () => void;
  onExport?: (payload: ExportAnalyticsPayload) => void;
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
  primaryBg: string;
  primaryText: string;
  chipBg: string;
  chipText: string;
  optionBg: string;
};

const EXPORT_FORMATS: ReadonlyArray<ExportAnalyticsFormat> = [
  "pdf",
  "csv",
  "xlsx",
  "png",
  "json",
];

const DEFAULT_SECTIONS: ExportAnalyticsSection[] = [
  {
    key: "overview",
    label: "Overview Summary",
    description: "KPI cards, topline highlights, and executive summary blocks.",
  },
  {
    key: "pipeline",
    label: "Pipeline Analytics",
    description: "Pipeline value, conversion flow, and stage progression insights.",
  },
  {
    key: "leads",
    label: "Lead Performance",
    description: "Lead quality, source efficiency, and follow-up outcomes.",
  },
  {
    key: "agents",
    label: "Team / Agent Analytics",
    description: "Agent productivity, conversion, compliance, and revenue view.",
  },
  {
    key: "revenue",
    label: "Revenue Analytics",
    description: "Revenue trends, forecasts, won deals, and deal-size movement.",
  },
  {
    key: "operations",
    label: "Operations & SLA",
    description: "Response time, SLA breach, stuck leads, and activity monitoring.",
  },
];

function getToneStyles(
  tone: NonNullable<ExportAnalyticsModalProps["tone"]>
): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        border: "#e5e7eb",
        softBg: "#f3f4f6",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        primaryBg: "#111827",
        primaryText: "#ffffff",
        chipBg: "#111827",
        chipText: "#ffffff",
        optionBg: "#f9fafb",
      };
    case "success":
      return {
        accent: "#047857",
        border: "#a7f3d0",
        softBg: "#ecfdf3",
        surface: "#ffffff",
        title: "#064e3b",
        subtitle: "#047857",
        primaryBg: "#047857",
        primaryText: "#ffffff",
        chipBg: "#047857",
        chipText: "#ffffff",
        optionBg: "#f0fdf4",
      };
    case "warning":
      return {
        accent: "#c2410c",
        border: "#fdba74",
        softBg: "#fff7ed",
        surface: "#ffffff",
        title: "#7c2d12",
        subtitle: "#c2410c",
        primaryBg: "#c2410c",
        primaryText: "#ffffff",
        chipBg: "#c2410c",
        chipText: "#ffffff",
        optionBg: "#fffbeb",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        border: "#fecaca",
        softBg: "#fef2f2",
        surface: "#ffffff",
        title: "#7f1d1d",
        subtitle: "#b91c1c",
        primaryBg: "#b91c1c",
        primaryText: "#ffffff",
        chipBg: "#b91c1c",
        chipText: "#ffffff",
        optionBg: "#fff1f2",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        border: "#bfdbfe",
        softBg: "#eff6ff",
        surface: "#ffffff",
        title: "#1e3a8a",
        subtitle: "#1d4ed8",
        primaryBg: "#1d4ed8",
        primaryText: "#ffffff",
        chipBg: "#1d4ed8",
        chipText: "#ffffff",
        optionBg: "#f8fbff",
      };
    default:
      return {
        accent: "#374151",
        border: "#e5e7eb",
        softBg: "#f9fafb",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        primaryBg: "#111827",
        primaryText: "#ffffff",
        chipBg: "#374151",
        chipText: "#ffffff",
        optionBg: "#f9fafb",
      };
  }
}

function getFormatLabel(format: ExportAnalyticsFormat): string {
  switch (format) {
    case "pdf":
      return "PDF Report";
    case "csv":
      return "CSV Data";
    case "xlsx":
      return "Excel Workbook";
    case "png":
      return "PNG Snapshot";
    case "json":
      return "JSON Export";
    default:
      return "Export";
  }
}

function getFormatTag(format: ExportAnalyticsFormat): string {
  switch (format) {
    case "pdf":
      return "PDF";
    case "csv":
      return "CSV";
    case "xlsx":
      return "XLSX";
    case "png":
      return "PNG";
    case "json":
      return "JSON";
    default:
      return "FILE";
  }
}

function sanitizeFileName(value: string): string {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function ExportModalSkeleton({ toneStyles }: { toneStyles: ToneStyles }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          width: "50%",
          height: 16,
          borderRadius: 8,
          background: toneStyles.softBg,
        }}
      />
      <div
        style={{
          width: "76%",
          height: 12,
          borderRadius: 8,
          background: toneStyles.softBg,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: 82,
              borderRadius: 16,
              border: `1px solid ${toneStyles.border}`,
              background: toneStyles.optionBg,
            }}
          />
        ))}
      </div>

      <div
        style={{
          height: 46,
          borderRadius: 12,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.optionBg,
        }}
      />

      <div style={{ display: "grid", gap: 10 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: 72,
              borderRadius: 16,
              border: `1px solid ${toneStyles.border}`,
              background: toneStyles.optionBg,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ExportAnalyticsModal({
  open,
  title = "Export Analytics",
  subtitle = "Choose format, pick report sections, and package your dashboard the way you want.",
  icon = "📤",
  availableSections = DEFAULT_SECTIONS,
  defaultSelectedSections,
  defaultFormat = "pdf",
  defaultFileName = "analytics-report",
  includeDateRangeByDefault = true,
  includeFiltersByDefault = true,
  includeSummaryByDefault = true,
  includeChartsByDefault = true,
  includeTablesByDefault = true,
  tone = "default",
  loading = false,
  maxWidth = 920,
  closeOnBackdrop = true,
  closeOnEscape = true,
  onClose,
  onExport,
  style,
}: ExportAnalyticsModalProps) {
  const toneStyles = getToneStyles(tone);

  const initialSelectedSections = useMemo(() => {
    if (defaultSelectedSections && defaultSelectedSections.length > 0) {
      return defaultSelectedSections;
    }

    return availableSections.filter((section) => !section.disabled).map((section) => section.key);
  }, [availableSections, defaultSelectedSections]);

  const [format, setFormat] = useState<ExportAnalyticsFormat>(defaultFormat);
  const [fileName, setFileName] = useState(defaultFileName);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    initialSelectedSections
  );
  const [includeDateRange, setIncludeDateRange] = useState(
    includeDateRangeByDefault
  );
  const [includeFilters, setIncludeFilters] = useState(includeFiltersByDefault);
  const [includeSummary, setIncludeSummary] = useState(includeSummaryByDefault);
  const [includeCharts, setIncludeCharts] = useState(includeChartsByDefault);
  const [includeTables, setIncludeTables] = useState(includeTablesByDefault);

  useEffect(() => {
    if (!open) return;

    setFormat(defaultFormat);
    setFileName(defaultFileName);
    setSelectedSections(initialSelectedSections);
    setIncludeDateRange(includeDateRangeByDefault);
    setIncludeFilters(includeFiltersByDefault);
    setIncludeSummary(includeSummaryByDefault);
    setIncludeCharts(includeChartsByDefault);
    setIncludeTables(includeTablesByDefault);
  }, [
    open,
    defaultFormat,
    defaultFileName,
    initialSelectedSections,
    includeDateRangeByDefault,
    includeFiltersByDefault,
    includeSummaryByDefault,
    includeChartsByDefault,
    includeTablesByDefault,
  ]);

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

  const enabledSections = availableSections.filter((section) => !section.disabled);
  const allEnabledSelected =
    enabledSections.length > 0 &&
    enabledSections.every((section) => selectedSections.includes(section.key));

  const resolvedFileName = sanitizeFileName(fileName) || "analytics-report";

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleToggleSection = (sectionKey: string) => {
    setSelectedSections((current) => {
      if (current.includes(sectionKey)) {
        return current.filter((key) => key !== sectionKey);
      }

      return [...current, sectionKey];
    });
  };

  const handleSelectAll = () => {
    if (allEnabledSelected) {
      setSelectedSections([]);
      return;
    }

    setSelectedSections(enabledSections.map((section) => section.key));
  };

  const handleExport = () => {
    const payload: ExportAnalyticsPayload = {
      fileName: resolvedFileName,
      format,
      selectedSections,
      includeDateRange,
      includeFilters,
      includeSummary,
      includeCharts,
      includeTables,
    };

    onExport?.(payload);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Export Analytics Modal"}
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
                  }}
                >
                  {subtitle}
                </div>
              ) : null}
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
            <ExportModalSkeleton toneStyles={toneStyles} />
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  Export Format
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: 10,
                  }}
                >
                  {EXPORT_FORMATS.map((formatOption) => {
                    const active = format === formatOption;

                    return (
                      <button
                        key={formatOption}
                        type="button"
                        onClick={() => setFormat(formatOption)}
                        style={{
                          minHeight: 82,
                          borderRadius: 16,
                          border: `1px solid ${
                            active ? toneStyles.accent : toneStyles.border
                          }`,
                          background: active ? toneStyles.softBg : "#ffffff",
                          color: active ? toneStyles.accent : toneStyles.title,
                          padding: 14,
                          boxSizing: "border-box",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            marginBottom: 8,
                          }}
                        >
                          {getFormatTag(formatOption)}
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1.4,
                          }}
                        >
                          {getFormatLabel(formatOption)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  File Name
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="text"
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                    placeholder="analytics-report"
                    style={{
                      flex: "1 1 260px",
                      height: 44,
                      borderRadius: 12,
                      border: `1px solid ${toneStyles.border}`,
                      background: "#ffffff",
                      padding: "0 14px",
                      boxSizing: "border-box",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      outline: "none",
                    }}
                  />

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      minHeight: 32,
                      padding: "0 12px",
                      borderRadius: 999,
                      background: toneStyles.chipBg,
                      color: toneStyles.chipText,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    .{format}
                  </span>
                </div>
              </section>

              <section>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: toneStyles.title,
                    }}
                  >
                    Report Sections
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectAll}
                    style={{
                      minHeight: 34,
                      padding: "0 12px",
                      borderRadius: 10,
                      border: `1px solid ${toneStyles.border}`,
                      background: "#ffffff",
                      color: toneStyles.accent,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {allEnabledSelected ? "Clear All" : "Select All"}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {availableSections.map((section) => {
                    const checked = selectedSections.includes(section.key);

                    return (
                      <CheckboxRow
                        key={section.key}
                        checked={checked}
                        disabled={section.disabled}
                        label={section.label}
                        description={section.description}
                        toneStyles={toneStyles}
                        onToggle={() => {
                          if (!section.disabled) {
                            handleToggleSection(section.key);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </section>

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  Include Options
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 10,
                  }}
                >
                  <CheckboxRow
                    checked={includeDateRange}
                    label="Date Range"
                    description="Attach selected reporting period."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeDateRange((value) => !value)}
                  />
                  <CheckboxRow
                    checked={includeFilters}
                    label="Applied Filters"
                    description="Include filter conditions used for this export."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeFilters((value) => !value)}
                  />
                  <CheckboxRow
                    checked={includeSummary}
                    label="Executive Summary"
                    description="Include KPI highlights and top observations."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeSummary((value) => !value)}
                  />
                  <CheckboxRow
                    checked={includeCharts}
                    label="Charts"
                    description="Embed chart visuals in the exported report."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeCharts((value) => !value)}
                  />
                  <CheckboxRow
                    checked={includeTables}
                    label="Tables"
                    description="Attach underlying table data where available."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeTables((value) => !value)}
                  />
                </div>
              </section>

              <section
                style={{
                  borderRadius: 18,
                  border: `1px solid ${toneStyles.border}`,
                  background: toneStyles.optionBg,
                  padding: 16,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 10,
                  }}
                >
                  Export Preview
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: toneStyles.subtitle,
                  }}
                >
                  <div>
                    <strong style={{ color: toneStyles.title }}>File:</strong>{" "}
                    {resolvedFileName}.{format}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>Format:</strong>{" "}
                    {getFormatLabel(format)}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>Sections:</strong>{" "}
                    {selectedSections.length > 0
                      ? availableSections
                          .filter((section) => selectedSections.includes(section.key))
                          .map((section) => section.label)
                          .join(", ")
                      : "No sections selected"}
                  </div>
                </div>
              </section>
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.55,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            {selectedSections.length} section
            {selectedSections.length === 1 ? "" : "s"} selected
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
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
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={selectedSections.length === 0}
              style={{
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.primaryBg}`,
                background:
                  selectedSections.length === 0
                    ? "#d1d5db"
                    : toneStyles.primaryBg,
                color: toneStyles.primaryText,
                fontSize: 13,
                fontWeight: 800,
                cursor:
                  selectedSections.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Export Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({
  checked,
  disabled,
  label,
  description,
  toneStyles,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  description?: string;
  toneStyles: ToneStyles;
  onToggle: () => void;
}) {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{
        width: "100%",
        textAlign: "left",
        minHeight: 72,
        borderRadius: 16,
        border: `1px solid ${checked ? toneStyles.accent : toneStyles.border}`,
        background: checked ? toneStyles.softBg : "#ffffff",
        padding: 14,
        boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            minWidth: 20,
            marginTop: 1,
            borderRadius: 6,
            border: `1px solid ${checked ? toneStyles.accent : toneStyles.border}`,
            background: checked ? toneStyles.accent : "#ffffff",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {checked ? "✓" : ""}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              lineHeight: 1.35,
              color: "#111827",
              marginBottom: description ? 6 : 0,
              wordBreak: "break-word",
            }}
          >
            {label}
          </div>

          {description ? (
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.55,
                color: "#6b7280",
                wordBreak: "break-word",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}