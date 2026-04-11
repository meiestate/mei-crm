import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type AuditLogItem = {
  id: string;
  timestamp: string;
  user: string;
  module: string;
  action: string;
  record: string;
  status: "Success" | "Warning" | "Failed";
};

type AuditLogsCardProps = {
  mode?: ThemeMode;
  logs: AuditLogItem[];
  onExportLogs?: () => void;
  onRefreshLogs?: () => void;
};

export default function AuditLogsCard({
  mode = "light",
  logs,
  onExportLogs,
  onRefreshLogs,
}: AuditLogsCardProps) {
  const theme = getTheme(mode);

  const successCount = logs.filter((log) => log.status === "Success").length;
  const warningCount = logs.filter((log) => log.status === "Warning").length;
  const failedCount = logs.filter((log) => log.status === "Failed").length;

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Audit Logs
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Review workspace activity history for transparency, accountability,
          and traceability.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard title="Total Logs" value={String(logs.length)} theme={theme} />
        <InfoCard title="Success" value={String(successCount)} theme={theme} />
        <InfoCard title="Warnings" value={String(warningCount)} theme={theme} />
        <InfoCard title="Failed" value={String(failedCount)} theme={theme} />
      </div>

      <div style={actionsRowStyle}>
        <button
          type="button"
          onClick={onRefreshLogs}
          style={primaryButtonStyle(theme)}
        >
          Refresh Logs
        </button>

        <button
          type="button"
          onClick={onExportLogs}
          style={secondaryButtonStyle(theme)}
        >
          Export Logs
        </button>
      </div>

      <div
        style={{
          marginTop: 18,
          overflowX: "auto",
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 860,
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: theme.tableHeadBg,
            }}
          >
            <tr>
              {["Timestamp", "User", "Module", "Action", "Record", "Status"].map(
                (column) => (
                  <th
                    key={column}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      fontSize: 12,
                      fontWeight: 800,
                      color: theme.subText,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    {column}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  style={{
                    background: theme.rowBg,
                  }}
                >
                  <td style={cellStyle(theme)}>{log.timestamp}</td>
                  <td style={cellStyle(theme)}>{log.user}</td>
                  <td style={cellStyle(theme)}>{log.module}</td>
                  <td style={cellStyle(theme)}>{log.action}</td>
                  <td style={cellStyle(theme)}>{log.record}</td>
                  <td style={cellStyle(theme)}>
                    <StatusBadge
                      label={log.status}
                      tone={
                        log.status === "Success"
                          ? "success"
                          : log.status === "Warning"
                          ? "warning"
                          : "danger"
                      }
                      theme={theme}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "22px 16px",
                    textAlign: "center",
                    fontSize: 14,
                    color: theme.subText,
                    background: theme.rowBg,
                  }}
                >
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  theme,
}: {
  title: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
  theme,
}: {
  label: string;
  tone: "success" | "warning" | "danger";
  theme: ReturnType<typeof getTheme>;
}) {
  const toneMap = {
    success: {
      bg: "rgba(34, 197, 94, 0.14)",
      color: theme.success,
      border: "rgba(34, 197, 94, 0.30)",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.14)",
      color: theme.warning,
      border: "rgba(245, 158, 11, 0.30)",
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.14)",
      color: "#EF4444",
      border: "rgba(239, 68, 68, 0.30)",
    },
  } as const;

  const selected = toneMap[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: selected.bg,
        color: selected.color,
        border: `1px solid ${selected.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
  marginBottom: 18,
};

function cellStyle(theme: ReturnType<typeof getTheme>): CSSProperties {
  return {
    padding: "14px 16px",
    fontSize: 14,
    color: theme.text,
    borderBottom: `1px solid ${theme.borderSoft}`,
    verticalAlign: "middle",
  };
}

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.primary,
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}