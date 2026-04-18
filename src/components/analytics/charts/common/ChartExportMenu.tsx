// src/components/analytics/charts/shared/ChartExportMenu.tsx

import { useEffect, useMemo, useRef, useState } from "react";

type ExportFormat = "png" | "svg" | "csv" | "json";

export interface ChartExportMenuOption {
  key: ExportFormat;
  label: string;
  description?: string;
}

export interface ChartExportMenuProps<TData = Record<string, unknown>> {
  fileName?: string;
  chartTitle?: string;
  data?: TData[];
  csvHeaders?: string[];
  jsonSpace?: number;
  options?: ChartExportMenuOption[];
  disabled?: boolean;
  onExport?: (format: ExportFormat, data: TData[]) => void;
  onExportPNG?: () => void | Promise<void>;
  onExportSVG?: () => void | Promise<void>;
  buttonLabel?: string;
  className?: string;
}

const DEFAULT_OPTIONS: ChartExportMenuOption[] = [
  { key: "png", label: "Export PNG", description: "Download chart as image" },
  { key: "svg", label: "Export SVG", description: "Download chart as vector" },
  { key: "csv", label: "Export CSV", description: "Download raw chart data" },
  { key: "json", label: "Export JSON", description: "Download source dataset" },
];

function sanitizeFileName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function downloadTextFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function convertToCsv<TData extends Record<string, unknown>>(
  data: TData[],
  headers?: string[]
): string {
  if (!data.length) {
    return headers?.join(",") ?? "";
  }

  const keys = headers && headers.length > 0 ? headers : Object.keys(data[0]);
  const headerRow = keys.map(escapeCsvValue).join(",");

  const rows = data.map((item) =>
    keys.map((key) => escapeCsvValue(item[key])).join(",")
  );

  return [headerRow, ...rows].join("\n");
}

async function fallbackDownloadSvg(fileName: string) {
  const svgElement = document.querySelector("svg");

  if (!svgElement) {
    throw new Error("SVG element not found for export.");
  }

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  downloadTextFile(
    svgString,
    `${fileName}.svg`,
    "image/svg+xml;charset=utf-8"
  );
}

export default function ChartExportMenu<TData extends Record<string, unknown>>({
  fileName = "chart-export",
  chartTitle = "Chart Export",
  data = [],
  csvHeaders,
  jsonSpace = 2,
  options = DEFAULT_OPTIONS,
  disabled = false,
  onExport,
  onExportPNG,
  onExportSVG,
  buttonLabel = "Export",
  className,
}: ChartExportMenuProps<TData>) {
  const [open, setOpen] = useState(false);
  const [busyKey, setBusyKey] = useState<ExportFormat | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resolvedFileName = useMemo(() => {
    const clean = sanitizeFileName(fileName || chartTitle || "chart-export");
    return clean.length > 0 ? clean : "chart-export";
  }, [chartTitle, fileName]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleExport(format: ExportFormat) {
    if (disabled || busyKey) {
      return;
    }

    try {
      setBusyKey(format);

      if (onExport) {
        onExport(format, data);
      }

      if (format === "png") {
        if (onExportPNG) {
          await onExportPNG();
        } else {
          throw new Error("PNG export handler is not connected.");
        }
      }

      if (format === "svg") {
        if (onExportSVG) {
          await onExportSVG();
        } else {
          await fallbackDownloadSvg(resolvedFileName);
        }
      }

      if (format === "csv") {
        const csvContent = convertToCsv(data, csvHeaders);
        downloadTextFile(
          csvContent,
          `${resolvedFileName}.csv`,
          "text/csv;charset=utf-8"
        );
      }

      if (format === "json") {
        const jsonContent = JSON.stringify(data, null, jsonSpace);
        downloadTextFile(
          jsonContent,
          `${resolvedFileName}.json`,
          "application/json;charset=utf-8"
        );
      }

      setOpen(false);
    } catch (error) {
      console.error(`${chartTitle} export failed:`, error);
    } finally {
      setBusyKey(null);
    }
  }

  const isDisabled = disabled || options.length === 0;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={{
          border: "1px solid #E2E8F0",
          background: isDisabled ? "#F8FAFC" : "#FFFFFF",
          color: isDisabled ? "#94A3B8" : "#0F172A",
          borderRadius: 12,
          padding: "10px 14px",
          fontSize: 13,
          fontWeight: 700,
          cursor: isDisabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
          minHeight: 40,
        }}
      >
        <span>{buttonLabel}</span>
        <span
          aria-hidden="true"
          style={{
            fontSize: 10,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {open && !isDisabled ? (
        <div
          role="menu"
          aria-label={`${chartTitle} export options`}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 240,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 16,
            boxShadow: "0 18px 42px rgba(15, 23, 42, 0.14)",
            padding: 8,
            zIndex: 50,
          }}
        >
          <div
            style={{
              padding: "8px 10px 10px",
              borderBottom: "1px solid #F1F5F9",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {chartTitle}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Choose a format to export
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 4,
            }}
          >
            {options.map((option) => {
              const isBusy = busyKey === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  role="menuitem"
                  disabled={Boolean(busyKey)}
                  onClick={() => {
                    void handleExport(option.key);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: isBusy ? "#EFF6FF" : "#FFFFFF",
                    borderRadius: 12,
                    padding: "10px 12px",
                    cursor: busyKey ? "wait" : "pointer",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {isBusy ? "Exporting..." : option.label}
                  </span>

                  {option.description ? (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        lineHeight: 1.45,
                      }}
                    >
                      {option.description}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}