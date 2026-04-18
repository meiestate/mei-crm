import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export type TabItem = {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
};

export interface TabsProps {
  items: TabItem[];
  mode?: ThemeMode;
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  variant?: "underline" | "pills" | "segmented";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  tabListStyle?: CSSProperties;
  tabPanelStyle?: CSSProperties;
}

const Tabs = ({
  items,
  mode = "light",
  activeKey,
  defaultActiveKey,
  onChange,
  variant = "underline",
  size = "md",
  fullWidth = false,
  className,
  style,
  tabListStyle,
  tabPanelStyle,
}: TabsProps) => {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const enabledItems = useMemo(
    () => items.filter((item) => !item.disabled),
    [items]
  );

  const fallbackKey = enabledItems[0]?.key ?? "";
  const initialKey =
    defaultActiveKey && enabledItems.some((item) => item.key === defaultActiveKey)
      ? defaultActiveKey
      : fallbackKey;

  const [internalActiveKey, setInternalActiveKey] = useState(initialKey);

  const currentActiveKey = activeKey ?? internalActiveKey;

  useEffect(() => {
    if (!items.some((item) => item.key === currentActiveKey && !item.disabled)) {
      const nextKey = enabledItems[0]?.key ?? "";
      setInternalActiveKey(nextKey);
    }
  }, [currentActiveKey, enabledItems, items]);

  const activeTab =
    items.find((item) => item.key === currentActiveKey) ??
    items.find((item) => !item.disabled);

  const handleChange = (key: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (!enabledItems.length) return;

    const lastIndex = enabledItems.length - 1;
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
        break;

      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;

      case "End":
        event.preventDefault();
        nextIndex = lastIndex;
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        handleChange(enabledItems[currentIndex].key);
        return;

      default:
        return;
    }

    const nextTab = enabledItems[nextIndex];
    handleChange(nextTab.key);

    const nextButton = document.getElementById(`tab-${nextTab.key}`);
    nextButton?.focus();
  };

  const sizeConfig = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          height: 34,
          fontSize: 12,
          px: 12,
        };
      case "lg":
        return {
          height: 46,
          fontSize: 15,
          px: 18,
        };
      case "md":
      default:
        return {
          height: 40,
          fontSize: 13,
          px: 16,
        };
    }
  }, [size]);

  const getTabStyle = (isActive: boolean, isDisabled: boolean): CSSProperties => {
    const common: CSSProperties = {
      position: "relative",
      height: sizeConfig.height,
      padding: `0 ${sizeConfig.px}px`,
      borderRadius: variant === "underline" ? 0 : 12,
      border:
        variant === "underline"
          ? "none"
          : `1px solid ${isActive ? theme.primary : theme.border}`,
      background:
        variant === "underline"
          ? "transparent"
          : isActive
          ? variant === "segmented"
            ? theme.primary
            : mode === "dark"
            ? "rgba(59,130,246,0.16)"
            : "rgba(37,99,235,0.08)"
          : "transparent",
      color: isDisabled
        ? theme.mutedText
        : variant === "segmented" && isActive
        ? theme.inverseText ?? "#ffffff"
        : isActive
        ? theme.primary
        : theme.text,
      fontSize: sizeConfig.fontSize,
      fontWeight: isActive ? 700 : 600,
      cursor: isDisabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      whiteSpace: "nowrap",
      transition: "all 0.2s ease",
      opacity: isDisabled ? 0.55 : 1,
      borderBottom:
        variant === "underline"
          ? `2px solid ${isActive ? theme.primary : "transparent"}`
          : undefined,
    };

    return common;
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...style,
      }}
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        style={{
          width: fullWidth ? "100%" : "fit-content",
          display: "flex",
          alignItems: "center",
          gap: variant === "underline" ? 18 : 8,
          padding:
            variant === "segmented"
              ? 6
              : variant === "pills"
              ? 4
              : 0,
          borderRadius: 16,
          background:
            variant === "segmented"
              ? mode === "dark"
                ? "rgba(255,255,255,0.04)"
                : "#f8fafc"
              : "transparent",
          border:
            variant === "segmented"
              ? `1px solid ${theme.border}`
              : "none",
          boxShadow:
            variant === "segmented"
              ? mode === "dark"
                ? "0 10px 24px rgba(0,0,0,0.18)"
                : "0 10px 24px rgba(15,23,42,0.06)"
              : "none",
          ...tabListStyle,
        }}
      >
        {items.map((item) => {
          const isActive = item.key === activeTab?.key;
          const enabledIndex = enabledItems.findIndex(
            (enabledItem) => enabledItem.key === item.key
          );

          return (
            <button
              key={item.key}
              id={`tab-${item.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.key}`}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                handleChange(item.key);
              }}
              onKeyDown={(event) => {
                if (item.disabled || enabledIndex === -1) return;
                moveFocus(event, enabledIndex);
              }}
              style={{
                ...getTabStyle(isActive, Boolean(item.disabled)),
                flex: fullWidth ? 1 : undefined,
              }}
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${activeTab?.key ?? "empty"}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab?.key ?? "empty"}`}
        style={{
          width: "100%",
          color: theme.text,
          ...tabPanelStyle,
        }}
      >
        {activeTab?.content ?? null}
      </div>
    </div>
  );
};

export default Tabs;