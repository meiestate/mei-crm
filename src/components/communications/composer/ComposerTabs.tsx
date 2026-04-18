import React, { memo } from "react";

export type ComposerTabItem = {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
  hasUnsavedChanges?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  tabs: ComposerTabItem[];
  activeTab: string;
  onChange: (tabKey: string) => void;
  className?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minWidth: 0,
};

const scrollerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  overflowX: "auto",
  overflowY: "hidden",
  paddingBottom: 4,
  scrollbarWidth: "thin",
};

const fullWidthScrollerStyle: React.CSSProperties = {
  ...scrollerStyle,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  overflowX: "hidden",
};

const tabButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#475569",
  borderRadius: 14,
  minHeight: 46,
  padding: "10px 14px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  position: "relative",
};

const activeTabButtonStyle: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
};

const disabledTabButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
  boxShadow: "none",
};

const tabContentStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const countBadgeStyle: React.CSSProperties = {
  minWidth: 22,
  height: 22,
  padding: "0 7px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#334155",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const activeCountBadgeStyle: React.CSSProperties = {
  background: "#dbeafe",
  color: "#1d4ed8",
};

const unsavedDotStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#f59e0b",
  boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.16)",
  flexShrink: 0,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.5,
};

function ComposerTabs({
  tabs,
  activeTab,
  onChange,
  className,
  ariaLabel = "Composer tabs",
  fullWidth = false,
}: Props) {
  return (
    <div className={className} style={wrapperStyle}>
      <style>
        {`
          .composer-tabs-scroller::-webkit-scrollbar {
            height: 8px;
          }

          .composer-tabs-scroller::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 999px;
          }

          .composer-tabs-scroller::-webkit-scrollbar-track {
            background: transparent;
          }

          @media (max-width: 768px) {
            .composer-tabs-full-width {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }

            .composer-tab-button {
              width: 100%;
            }
          }
        `}
      </style>

      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`composer-tabs-scroller ${
          fullWidth ? "composer-tabs-full-width" : ""
        }`}
        style={fullWidth ? fullWidthScrollerStyle : scrollerStyle}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const isDisabled = Boolean(tab.disabled);

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`composer-tab-panel-${tab.key}`}
              id={`composer-tab-${tab.key}`}
              disabled={isDisabled}
              className="composer-tab-button"
              onClick={() => {
                if (!isDisabled && tab.key !== activeTab) {
                  onChange(tab.key);
                }
              }}
              style={{
                ...tabButtonStyle,
                ...(fullWidth ? { width: "100%" } : {}),
                ...(isActive ? activeTabButtonStyle : {}),
                ...(isDisabled ? disabledTabButtonStyle : {}),
              }}
            >
              <span style={tabContentStyle}>
                {tab.icon ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tab.icon}
                  </span>
                ) : null}

                <span style={labelStyle}>{tab.label}</span>

                {typeof tab.count === "number" ? (
                  <span
                    style={{
                      ...countBadgeStyle,
                      ...(isActive ? activeCountBadgeStyle : {}),
                    }}
                  >
                    {tab.count}
                  </span>
                ) : null}

                {tab.hasUnsavedChanges ? <span style={unsavedDotStyle} /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div style={helperTextStyle}>
        Switch between composer sections without losing context.
      </div>
    </div>
  );
}

export default memo(ComposerTabs);