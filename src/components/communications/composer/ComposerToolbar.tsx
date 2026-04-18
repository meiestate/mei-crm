import React, { memo } from "react";

export type ComposerToolbarAction = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
};

type Props = {
  actions?: ComposerToolbarAction[];
  className?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  compact?: boolean;
  sticky?: boolean;
  showDividers?: boolean;
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  padding: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
};

const stickyStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 20,
};

const sideWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  minWidth: 0,
};

const actionsWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  minWidth: 0,
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  alignSelf: "stretch",
  background: "#e2e8f0",
  minHeight: 28,
};

const baseButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "9px 12px",
  minHeight: 40,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  lineHeight: 1,
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
};

const compactButtonStyle: React.CSSProperties = {
  padding: "8px 10px",
  minHeight: 36,
  borderRadius: 10,
};

const activeButtonStyle: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  boxShadow: "0 6px 18px rgba(37, 99, 235, 0.12)",
};

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  boxShadow: "none",
};

const dangerButtonStyle: React.CSSProperties = {
  color: "#b91c1c",
  border: "1px solid #fecaca",
  background: "#fff7f7",
};

const labelStyle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const helperWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  marginLeft: "auto",
};

function ComposerToolbar({
  actions = [],
  className,
  leftSlot,
  rightSlot,
  compact = false,
  sticky = false,
  showDividers = true,
}: Props) {
  return (
    <div
      className={className}
      style={{
        ...wrapperStyle,
        ...(compact ? { padding: 10, borderRadius: 14 } : {}),
        ...(sticky ? stickyStyle : {}),
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .composer-toolbar-root {
              align-items: stretch !important;
            }

            .composer-toolbar-left,
            .composer-toolbar-actions,
            .composer-toolbar-right {
              width: 100%;
            }

            .composer-toolbar-right {
              margin-left: 0 !important;
              justify-content: flex-start !important;
            }
          }
        `}
      </style>

      <div
        className="composer-toolbar-root"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <div className="composer-toolbar-left" style={sideWrapStyle}>
          {leftSlot}

          {leftSlot && actions.length > 0 && showDividers ? (
            <span style={dividerStyle} />
          ) : null}

          <div className="composer-toolbar-actions" style={actionsWrapStyle}>
            {actions.map((action, index) => {
              const showDivider =
                showDividers &&
                index > 0 &&
                (index === 3 || index === 6 || index === 9);

              return (
                <React.Fragment key={action.key}>
                  {showDivider ? <span style={dividerStyle} /> : null}

                  <button
                    type="button"
                    onClick={() => {
                      if (!action.disabled) {
                        action.onClick?.();
                      }
                    }}
                    disabled={action.disabled}
                    title={action.title ?? action.label}
                    aria-pressed={action.active ? true : undefined}
                    style={{
                      ...baseButtonStyle,
                      ...(compact ? compactButtonStyle : {}),
                      ...(action.active ? activeButtonStyle : {}),
                      ...(action.danger ? dangerButtonStyle : {}),
                      ...(action.disabled ? disabledButtonStyle : {}),
                    }}
                  >
                    {action.icon ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {action.icon}
                      </span>
                    ) : null}

                    <span style={labelStyle}>{action.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="composer-toolbar-right" style={helperWrapStyle}>
          {rightSlot}
        </div>
      </div>
    </div>
  );
}

export default memo(ComposerToolbar);