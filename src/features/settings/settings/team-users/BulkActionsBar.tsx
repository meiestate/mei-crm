// src/features/settings/settings/team-users/BulkActionsBar.tsx

import { getTheme, type ThemeMode } from "../../../../theme";

type BulkActionsBarProps = {
  selectedCount: number;
  mode?: ThemeMode;
  itemLabel?: string;
  sticky?: boolean;
  top?: number;
  loading?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  dangerActionLabel?: string;
  onClearSelection?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onDangerAction?: () => void;
};

export default function BulkActionsBar({
  selectedCount,
  mode = "light",
  itemLabel = "items",
  sticky = true,
  top = 12,
  loading = false,
  primaryActionLabel = "Export Selected",
  secondaryActionLabel = "Update Selected",
  dangerActionLabel = "Delete Selected",
  onClearSelection,
  onPrimaryAction,
  onSecondaryAction,
  onDangerAction,
}: BulkActionsBarProps) {
  const theme = getTheme(mode);

  if (selectedCount <= 0) {
    return null;
  }

  const actionButtonBase = {
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    transition: "all 0.18s ease",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div
      style={{
        position: sticky ? "sticky" : "relative",
        top: sticky ? top : undefined,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
        padding: 14,
        marginBottom: 14,
        borderRadius: 18,
        border: `1px solid ${theme.border}`,
        background:
          mode === "dark"
            ? "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))"
            : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
        boxShadow:
          mode === "dark"
            ? "0 12px 30px rgba(0,0,0,0.32)"
            : "0 12px 30px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              mode === "dark"
                ? "rgba(59, 130, 246, 0.18)"
                : "rgba(59, 130, 246, 0.12)",
            border: "1px solid rgba(59, 130, 246, 0.24)",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ✅
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            {selectedCount} {itemLabel} selected
          </div>

          <div
            style={{
              fontSize: 12,
              color: theme.subText,
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            Apply actions to everything currently selected.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {onSecondaryAction ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            disabled={loading}
            style={{
              ...actionButtonBase,
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
            }}
          >
            {secondaryActionLabel}
          </button>
        ) : null}

        {onPrimaryAction ? (
          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={loading}
            style={{
              ...actionButtonBase,
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
            }}
          >
            {primaryActionLabel}
          </button>
        ) : null}

        {onDangerAction ? (
          <button
            type="button"
            onClick={onDangerAction}
            disabled={loading}
            style={{
              ...actionButtonBase,
              border: "none",
              background: theme.danger ?? "#dc2626",
              color: "#ffffff",
            }}
          >
            {dangerActionLabel}
          </button>
        ) : null}

        {onClearSelection ? (
          <button
            type="button"
            onClick={onClearSelection}
            disabled={loading}
            style={{
              ...actionButtonBase,
              border: `1px solid ${theme.border}`,
              background: "transparent",
              color: theme.subText,
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}