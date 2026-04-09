import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

export type TabItem = {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
};

type TabsVariant = "line" | "pill" | "segmented";
type TabsSize = "sm" | "md" | "lg";

type TabsProps = {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string, item: TabItem) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  centered?: boolean;
  destroyInactiveTabPane?: boolean;
  contentStyle?: CSSProperties;
  tabListStyle?: CSSProperties;
};

const sizeMap: Record<
  TabsSize,
  {
    tabMinHeight: number;
    tabPaddingX: number;
    fontSize: number;
    radius: number;
    gap: number;
  }
> = {
  sm: {
    tabMinHeight: 34,
    tabPaddingX: 12,
    fontSize: 13,
    radius: 10,
    gap: 8,
  },
  md: {
    tabMinHeight: 40,
    tabPaddingX: 14,
    fontSize: 14,
    radius: 12,
    gap: 10,
  },
  lg: {
    tabMinHeight: 46,
    tabPaddingX: 16,
    fontSize: 15,
    radius: 14,
    gap: 12,
  },
};

function getFirstEnabledKey(items: TabItem[]) {
  return items.find((item) => !item.disabled)?.key ?? "";
}

export default function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  variant = "line",
  size = "md",
  fullWidth = false,
  centered = false,
  destroyInactiveTabPane = false,
  contentStyle,
  tabListStyle,
}: TabsProps) {
  const initialKey =
    defaultActiveKey && items.some((item) => item.key === defaultActiveKey && !item.disabled)
      ? defaultActiveKey
      : getFirstEnabledKey(items);

  const [internalActiveKey, setInternalActiveKey] = useState(initialKey);

  useEffect(() => {
    if (!items.some((item) => item.key === internalActiveKey && !item.disabled)) {
      setInternalActiveKey(getFirstEnabledKey(items));
    }
  }, [items, internalActiveKey]);

  const currentKey = activeKey ?? internalActiveKey;

  const activeItem = useMemo(
    () => items.find((item) => item.key === currentKey && !item.disabled) ?? items.find((item) => !item.disabled),
    [items, currentKey]
  );

  const sizes = sizeMap[size];

  const handleChange = (item: TabItem) => {
    if (item.disabled) return;

    if (activeKey === undefined) {
      setInternalActiveKey(item.key);
    }

    onChange?.(item.key, item);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    currentIndex: number
  ) => {
    if (!items.length) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      for (let i = 0; i < items.length; i += 1) {
        nextIndex = (nextIndex + 1) % items.length;
        if (!items[nextIndex].disabled) {
          handleChange(items[nextIndex]);
          break;
        }
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      for (let i = 0; i < items.length; i += 1) {
        nextIndex = (nextIndex - 1 + items.length) % items.length;
        if (!items[nextIndex].disabled) {
          handleChange(items[nextIndex]);
          break;
        }
      }
    }
  };

  const getTabButtonStyle = (isActive: boolean, isDisabled: boolean): CSSProperties => {
    const base: CSSProperties = {
      minHeight: sizes.tabMinHeight,
      padding: `0 ${sizes.tabPaddingX}px`,
      borderRadius: variant === "line" ? 0 : sizes.radius,
      border: "none",
      background:
        variant === "segmented"
          ? isActive
            ? "#ffffff"
            : "transparent"
          : variant === "pill"
          ? isActive
            ? "#2563eb"
            : "#f8fafc"
          : "transparent",
      color:
        variant === "pill"
          ? isActive
            ? "#ffffff"
            : "#475569"
          : isActive
          ? "#2563eb"
          : "#475569",
      fontSize: sizes.fontSize,
      fontWeight: isActive ? 700 : 600,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      whiteSpace: "nowrap",
      transition: "all 0.2s ease",
      boxShadow:
        variant === "segmented" && isActive
          ? "0 6px 18px rgba(15, 23, 42, 0.08)"
          : "none",
      borderBottom:
        variant === "line"
          ? isActive
            ? "2px solid #2563eb"
            : "2px solid transparent"
          : undefined,
    };

    return base;
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: centered ? "center" : "flex-start",
          gap: sizes.gap,
          width: fullWidth ? "100%" : "fit-content",
          padding: variant === "segmented" ? 6 : 0,
          borderRadius: variant === "segmented" ? sizes.radius + 4 : 0,
          background: variant === "segmented" ? "#f8fafc" : "transparent",
          border: variant === "segmented" ? "1px solid #e2e8f0" : "none",
          borderBottom: variant === "line" ? "1px solid #e2e8f0" : "none",
          overflowX: "auto",
          ...tabListStyle,
        }}
      >
        {items.map((item, index) => {
          const isActive = activeItem?.key === item.key;

          return (
            <button
              key={item.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              onClick={() => handleChange(item)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              style={{
                ...getTabButtonStyle(isActive, Boolean(item.disabled)),
                flex: fullWidth ? 1 : undefined,
              }}
            >
              <span>{item.label}</span>

              {item.badge && (
                <span
                  style={{
                    minWidth: 20,
                    height: 20,
                    padding: "0 6px",
                    borderRadius: 999,
                    background:
                      variant === "pill" && isActive
                        ? "rgba(255,255,255,0.18)"
                        : "#e2e8f0",
                    color:
                      variant === "pill" && isActive ? "#ffffff" : "#334155",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          ...contentStyle,
        }}
      >
        {destroyInactiveTabPane
          ? activeItem?.content
          : items.map((item) => (
              <div
                key={item.key}
                role="tabpanel"
                hidden={activeItem?.key !== item.key}
                style={{
                  display: activeItem?.key === item.key ? "block" : "none",
                }}
              >
                {item.content}
              </div>
            ))}
      </div>
    </div>
  );
}