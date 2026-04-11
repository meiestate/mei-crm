import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type BackupSummary = {
  lastBackupAt: string;
  totalBackups: string;
  storageUsed: string;
};

type DataBackupCardProps = {
  mode?: ThemeMode;
  backupSummary: BackupSummary;
  onExportLeads?: () => void;
  onExportContacts?: () => void;
  onExportDeals?: () => void;
  onImportData?: () => void;
  onCreateBackup?: () => void;
  onRestoreBackup?: () => void;
  onDeleteDemoData?: () => void;
};

export default function DataBackupCard({
  mode = "light",
  backupSummary,
  onExportLeads,
  onExportContacts,
  onExportDeals,
  onImportData,
  onCreateBackup,
  onRestoreBackup,
  onDeleteDemoData,
}: DataBackupCardProps) {
  const theme = getTheme(mode);

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
          Data & Backup
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Export records, import data, create backups, and protect your workspace
          from accidental loss.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard
          title="Last Backup"
          value={backupSummary.lastBackupAt}
          theme={theme}
        />
        <InfoCard
          title="Total Backups"
          value={backupSummary.totalBackups}
          theme={theme}
        />
        <InfoCard
          title="Storage Used"
          value={backupSummary.storageUsed}
          theme={theme}
        />
      </div>

      <div style={sectionBlockStyle(theme)}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Data Export & Import
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: theme.subText,
            lineHeight: 1.5,
          }}
        >
          Export important CRM records or bring in data from external systems.
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onExportLeads}
            style={primaryButtonStyle(theme)}
          >
            Export Leads CSV
          </button>

          <button
            type="button"
            onClick={onExportContacts}
            style={secondaryButtonStyle(theme)}
          >
            Export Contacts CSV
          </button>

          <button
            type="button"
            onClick={onExportDeals}
            style={secondaryButtonStyle(theme)}
          >
            Export Deals CSV
          </button>

          <button
            type="button"
            onClick={onImportData}
            style={secondaryButtonStyle(theme)}
          >
            Import Data
          </button>
        </div>
      </div>

      <div style={sectionBlockStyle(theme)}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Backup History
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: theme.subText,
            lineHeight: 1.5,
          }}
        >
          Latest backup completed on {backupSummary.lastBackupAt}.
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onCreateBackup}
            style={primaryButtonStyle(theme)}
          >
            Create Backup
          </button>

          <button
            type="button"
            onClick={onRestoreBackup}
            style={secondaryButtonStyle(theme)}
          >
            Restore Backup
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 16,
          border: `1px solid rgba(239, 68, 68, 0.35)`,
          background:
            mode === "dark"
              ? "rgba(127, 29, 29, 0.18)"
              : "rgba(254, 242, 242, 1)",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Danger Zone
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          Be careful. Destructive actions may permanently remove demo records or
          non-essential seeded data.
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onDeleteDemoData}
            style={dangerButtonStyle()}
          >
            Delete Demo Data
          </button>
        </div>
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 16,
};

function sectionBlockStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
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
    background: theme.cardBg,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function dangerButtonStyle(): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: "#DC2626",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}