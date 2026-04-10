import React from "react";

type Column<T> = {
  key: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  render?: (row: T) => React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
  mobilePriority?: boolean;
  className?: string;
};

type ResponsiveTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((row: T, index: number) => string);
  isMobile?: boolean;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  mobileCardTitle?: (row: T) => React.ReactNode;
  mobileCardSubtitle?: (row: T) => React.ReactNode;
  mobileCardMeta?: (row: T) => React.ReactNode;
  mobileCardActions?: (row: T) => React.ReactNode;
  tableMinWidth?: number;
  stickyHeader?: boolean;
  bordered?: boolean;
  striped?: boolean;
  compact?: boolean;
};

function getCellValue<T>(row: T, column: Column<T>): React.ReactNode {
  if (column.render) {
    return column.render(row);
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }

  if (typeof column.accessor === "string") {
    return row[column.accessor] as React.ReactNode;
  }

  return null;
}

function getRowKey<T>(
  row: T,
  index: number,
  rowKey: keyof T | ((row: T, index: number) => string)
): string {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  const value = row[rowKey];
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : `${index}`;
}

function alignToJustify(
  align?: "left" | "center" | "right"
): React.CSSProperties["justifyContent"] {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

function alignToText(
  align?: "left" | "center" | "right"
): React.CSSProperties["textAlign"] {
  if (align === "center") return "center";
  if (align === "right") return "right";
  return "left";
}

export default function ResponsiveTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  isMobile = false,
  loading = false,
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display right now.",
  onRowClick,
  mobileCardTitle,
  mobileCardSubtitle,
  mobileCardMeta,
  mobileCardActions,
  tableMinWidth = 900,
  stickyHeader = true,
  bordered = true,
  striped = false,
  compact = false,
}: ResponsiveTableProps<T>) {
  const visibleMobileColumns = columns.filter((col) => !col.hideOnMobile);
  const priorityMobileColumns = visibleMobileColumns.filter(
    (col) => col.mobilePriority
  );
  const fallbackMobileColumns =
    priorityMobileColumns.length > 0
      ? priorityMobileColumns
      : visibleMobileColumns.slice(0, 4);

  if (loading) {
    return isMobile ? (
      <div style={{ display: "grid", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 14,
              background: "#ffffff",
            }}
          >
            <div
              style={{
                height: 16,
                width: "45%",
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                height: 14,
                width: "70%",
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 14,
                width: "55%",
                borderRadius: 8,
                background: "#e5e7eb",
              }}
            />
          </div>
        ))}
      </div>
    ) : (
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
            gap: 0,
            padding: "14px 16px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              style={{
                height: 14,
                width: "70%",
                borderRadius: 8,
                background: "#e5e7eb",
              }}
            />
          ))}
        </div>

        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
              padding: "16px",
              borderBottom:
                rowIndex === 4 ? "none" : "1px solid rgba(226,232,240,0.85)",
            }}
          >
            {columns.map((column) => (
              <div
                key={`${rowIndex}-${column.key}`}
                style={{
                  height: 14,
                  width: "80%",
                  borderRadius: 8,
                  background: "#e5e7eb",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        style={{
          border: "1px dashed #cbd5e1",
          borderRadius: 18,
          padding: isMobile ? 20 : 28,
          textAlign: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          {emptyTitle}
        </div>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#64748b",
            maxWidth: 460,
            margin: "0 auto",
          }}
        >
          {emptyDescription}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        {data.map((row, index) => {
          const key = getRowKey(row, index, rowKey);

          return (
            <div
              key={key}
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 14,
                background: "#ffffff",
                boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
                cursor: onRowClick ? "pointer" : "default",
                outline: "none",
              }}
            >
              {(mobileCardTitle || mobileCardSubtitle || mobileCardMeta) && (
                <div style={{ marginBottom: 12 }}>
                  {mobileCardTitle && (
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.4,
                        marginBottom: mobileCardSubtitle ? 4 : 0,
                      }}
                    >
                      {mobileCardTitle(row)}
                    </div>
                  )}

                  {mobileCardSubtitle && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.5,
                        marginBottom: mobileCardMeta ? 6 : 0,
                      }}
                    >
                      {mobileCardSubtitle(row)}
                    </div>
                  )}

                  {mobileCardMeta && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        lineHeight: 1.5,
                      }}
                    >
                      {mobileCardMeta(row)}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "grid", gap: 10 }}>
                {fallbackMobileColumns.map((column) => {
                  const value = getCellValue(row, column);

                  if (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    value === false
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={column.key}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          minWidth: 92,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {column.header}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: alignToJustify(column.align),
                          textAlign: alignToText(column.align),
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#0f172a",
                          lineHeight: 1.5,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {mobileCardActions && (
                <div
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  {mobileCardActions(row)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: bordered ? "1px solid #e2e8f0" : "none",
        borderRadius: 18,
        background: "#ffffff",
        boxShadow: bordered ? "0 10px 30px rgba(15,23,42,0.04)" : "none",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: tableMinWidth,
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f8fafc",
            }}
          >
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className}
                style={{
                  position: stickyHeader ? "sticky" : "static",
                  top: stickyHeader ? 0 : undefined,
                  zIndex: stickyHeader ? 1 : undefined,
                  background: "#f8fafc",
                  padding: compact ? "12px 14px" : "14px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  color: "#475569",
                  textAlign: alignToText(column.align),
                  whiteSpace: "nowrap",
                  width: column.width,
                  minWidth: column.minWidth,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const key = getRowKey(row, index, rowKey);

            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                  background:
                    striped && index % 2 === 1 ? "rgba(248,250,252,0.7)" : "#fff",
                  transition: "background 0.2s ease",
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={column.className}
                    style={{
                      padding: compact ? "12px 14px" : "16px",
                      borderBottom:
                        index === data.length - 1
                          ? "none"
                          : "1px solid rgba(226,232,240,0.85)",
                      fontSize: 14,
                      color: "#0f172a",
                      textAlign: alignToText(column.align),
                      verticalAlign: "middle",
                      width: column.width,
                      minWidth: column.minWidth,
                    }}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type { Column, ResponsiveTableProps };