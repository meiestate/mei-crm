import React from "react";

type MobileCardAction<T> = {
  key: string;
  label: React.ReactNode;
  onClick?: (item: T) => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

type MobileCardField<T> = {
  key: string;
  label: React.ReactNode;
  value?: React.ReactNode | ((item: T) => React.ReactNode);
  hideIfEmpty?: boolean;
  align?: "left" | "center" | "right";
};

type MobileCardListProps<T> = {
  items: T[];
  getItemKey: (item: T, index: number) => string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onCardClick?: (item: T) => void;
  renderCardTitle: (item: T) => React.ReactNode;
  renderCardSubtitle?: (item: T) => React.ReactNode;
  renderCardMeta?: (item: T) => React.ReactNode;
  fields?: MobileCardField<T>[];
  actions?: MobileCardAction<T>[];
  renderCustomContent?: (item: T) => React.ReactNode;
  renderTopRight?: (item: T) => React.ReactNode;
  cardBackground?: string;
  borderColor?: string;
  titleColor?: string;
  textColor?: string;
  mutedColor?: string;
  compact?: boolean;
};

function resolveValue<T>(
  item: T,
  value?: React.ReactNode | ((item: T) => React.ReactNode)
): React.ReactNode {
  if (typeof value === "function") {
    return value(item);
  }
  return value ?? null;
}

function getTextAlign(
  align?: "left" | "center" | "right"
): React.CSSProperties["textAlign"] {
  if (align === "center") return "center";
  if (align === "right") return "right";
  return "left";
}

function getJustifyContent(
  align?: "left" | "center" | "right"
): React.CSSProperties["justifyContent"] {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

function getActionStyles(
  variant: "primary" | "secondary" | "danger",
  fullWidth?: boolean
): React.CSSProperties {
  if (variant === "primary") {
    return {
      minHeight: 40,
      border: "none",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      background: "#2563eb",
      color: "#ffffff",
      width: fullWidth ? "100%" : undefined,
    };
  }

  if (variant === "danger") {
    return {
      minHeight: 40,
      border: "1px solid rgba(239,68,68,0.22)",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      background: "rgba(239,68,68,0.08)",
      color: "#dc2626",
      width: fullWidth ? "100%" : undefined,
    };
  }

  return {
    minHeight: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    background: "#ffffff",
    color: "#0f172a",
    width: fullWidth ? "100%" : undefined,
  };
}

export default function MobileCardList<T>({
  items,
  getItemKey,
  title,
  subtitle,
  loading = false,
  emptyTitle = "No items found",
  emptyDescription = "There is nothing to show right now.",
  onCardClick,
  renderCardTitle,
  renderCardSubtitle,
  renderCardMeta,
  fields = [],
  actions = [],
  renderCustomContent,
  renderTopRight,
  cardBackground = "#ffffff",
  borderColor = "#e2e8f0",
  titleColor = "#0f172a",
  textColor = "#0f172a",
  mutedColor = "#64748b",
  compact = false,
}: MobileCardListProps<T>) {
  const cardPadding = compact ? 12 : 14;
  const cardGap = compact ? 10 : 12;

  if (loading) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        {title && (
          <div style={{ marginBottom: 4 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: titleColor,
                marginBottom: subtitle ? 4 : 0,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 13,
                  color: mutedColor,
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 16,
              padding: cardPadding,
              background: cardBackground,
              boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                height: 16,
                width: "48%",
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                height: 14,
                width: "72%",
                borderRadius: 8,
                background: "#e5e7eb",
                marginBottom: 14,
              }}
            />
            <div style={{ display: "grid", gap: 10 }}>
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      height: 12,
                      width: "25%",
                      borderRadius: 8,
                      background: "#e5e7eb",
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      width: "50%",
                      borderRadius: 8,
                      background: "#e5e7eb",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        style={{
          border: `1px dashed ${borderColor}`,
          borderRadius: 18,
          padding: 22,
          textAlign: "center",
          background: cardBackground,
        }}
      >
        {title && (
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: titleColor,
                marginBottom: subtitle ? 4 : 0,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 13,
                  color: mutedColor,
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: titleColor,
            marginBottom: 6,
          }}
        >
          {emptyTitle}
        </div>
        <div
          style={{
            fontSize: 14,
            color: mutedColor,
            lineHeight: 1.6,
          }}
        >
          {emptyDescription}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: 2 }}>
          {title && (
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: titleColor,
                marginBottom: subtitle ? 4 : 0,
                lineHeight: 1.35,
              }}
            >
              {title}
            </div>
          )}

          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: mutedColor,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {items.map((item, index) => {
        const key = getItemKey(item, index);

        return (
          <div
            key={key}
            role={onCardClick ? "button" : undefined}
            tabIndex={onCardClick ? 0 : undefined}
            onClick={onCardClick ? () => onCardClick(item) : undefined}
            onKeyDown={
              onCardClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onCardClick(item);
                    }
                  }
                : undefined
            }
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 16,
              padding: cardPadding,
              background: cardBackground,
              boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
              cursor: onCardClick ? "pointer" : "default",
              outline: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom:
                  renderCardSubtitle || renderCardMeta || renderTopRight
                    ? cardGap
                    : 0,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: titleColor,
                    lineHeight: 1.45,
                    wordBreak: "break-word",
                    marginBottom: renderCardSubtitle ? 4 : 0,
                  }}
                >
                  {renderCardTitle(item)}
                </div>

                {renderCardSubtitle && (
                  <div
                    style={{
                      fontSize: 13,
                      color: mutedColor,
                      lineHeight: 1.55,
                      wordBreak: "break-word",
                      marginBottom: renderCardMeta ? 6 : 0,
                    }}
                  >
                    {renderCardSubtitle(item)}
                  </div>
                )}

                {renderCardMeta && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {renderCardMeta(item)}
                  </div>
                )}
              </div>

              {renderTopRight && (
                <div
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                  }}
                >
                  {renderTopRight(item)}
                </div>
              )}
            </div>

            {fields.length > 0 && (
              <div style={{ display: "grid", gap: 10 }}>
                {fields.map((field) => {
                  const value = resolveValue(item, field.value);

                  if (
                    field.hideIfEmpty &&
                    (value === null ||
                      value === undefined ||
                      value === "" ||
                      value === false)
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={field.key}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          minWidth: 90,
                          fontSize: 12,
                          fontWeight: 600,
                          color: mutedColor,
                          lineHeight: 1.5,
                        }}
                      >
                        {field.label}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: getJustifyContent(field.align),
                          textAlign: getTextAlign(field.align),
                          fontSize: 13,
                          fontWeight: 500,
                          color: textColor,
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {renderCustomContent && (
              <div
                style={{
                  marginTop: fields.length > 0 ? 12 : 0,
                }}
              >
                {renderCustomContent(item)}
              </div>
            )}

            {actions.length > 0 && (
              <div
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                style={{
                  marginTop:
                    fields.length > 0 || renderCustomContent ? 14 : 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${borderColor}`,
                  display: "grid",
                  gridTemplateColumns:
                    actions.length === 1 && actions[0].fullWidth
                      ? "1fr"
                      : "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {actions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => action.onClick?.(item)}
                    style={{
                      ...getActionStyles(
                        action.variant ?? "secondary",
                        action.fullWidth
                      ),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: action.icon ? 8 : 0,
                    }}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export type { MobileCardAction, MobileCardField, MobileCardListProps };