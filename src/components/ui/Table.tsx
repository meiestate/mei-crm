import type { CSSProperties, ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T, index: number) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T, index: number) => string);
  loading?: boolean;
  emptyText?: ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  compact?: boolean;
  onRowClick?: (record: T, index: number) => void;
  containerStyle?: CSSProperties;
  tableStyle?: CSSProperties;
};

function getCellAlign(
  align?: "left" | "center" | "right"
): CSSProperties["textAlign"] {
  if (align === "center") return "center";
  if (align === "right") return "right";
  return "left";
}

function getRowKey<T>(
  rowKey: keyof T | ((record: T, index: number) => string),
  record: T,
  index: number
) {
  if (typeof rowKey === "function") {
    return rowKey(record, index);
  }

  return String(record[rowKey]);
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = "No data available",
  striped = false,
  hoverable = true,
  bordered = true,
  stickyHeader = false,
  maxHeight,
  compact = false,
  onRowClick,
  containerStyle,
  tableStyle,
}: TableProps<T>) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "auto",
        border: bordered ? "1px solid #e2e8f0" : "none",
        borderRadius: 18,
        background: "#ffffff",
        boxShadow: bordered ? "0 10px 30px rgba(15, 23, 42, 0.06)" : "none",
        maxHeight,
        ...containerStyle,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          minWidth: "100%",
          ...tableStyle,
        }}
      >
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={column.key}
                style={{
                  position: stickyHeader ? "sticky" : "static",
                  top: stickyHeader ? 0 : undefined,
                  zIndex: stickyHeader ? 2 : undefined,
                  background: "#f8fafc",
                  color: "#334155",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: getCellAlign(column.align),
                  padding: compact ? "12px 14px" : "14px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  whiteSpace: "nowrap",
                  width: column.width,
                  minWidth: column.minWidth || column.width,
                  borderTopLeftRadius: columnIndex === 0 ? 18 : 0,
                  borderTopRightRadius:
                    columnIndex === columns.length - 1 ? 18 : 0,
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: 14,
                  background: "#ffffff",
                }}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: 14,
                  background: "#ffffff",
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, rowIndex) => (
              <tr
                key={getRowKey(rowKey, record, rowIndex)}
                onClick={() => onRowClick?.(record, rowIndex)}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                  background:
                    striped && rowIndex % 2 === 1 ? "#fcfdff" : "#ffffff",
                  transition: "background 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (!hoverable) return;
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (!hoverable) return;
                  e.currentTarget.style.background =
                    striped && rowIndex % 2 === 1 ? "#fcfdff" : "#ffffff";
                }}
              >
                {columns.map((column) => {
                  const value = column.dataIndex
                    ? record[column.dataIndex]
                    : undefined;

                  return (
                    <td
                      key={column.key}
                      style={{
                        padding: compact ? "12px 14px" : "14px 16px",
                        borderBottom:
                          rowIndex === data.length - 1
                            ? "none"
                            : "1px solid #f1f5f9",
                        color: "#0f172a",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: getCellAlign(column.align),
                        verticalAlign: "middle",
                        width: column.width,
                        minWidth: column.minWidth || column.width,
                      }}
                    >
                      {column.render
                        ? column.render(value, record, rowIndex)
                        : (value as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}