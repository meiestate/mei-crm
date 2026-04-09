import { useEffect, useRef, useState, type ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

export type QuickActionMenuItem = {
  key: string;
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
};

type QuickActionMenuProps = {
  mode: ThemeMode;
  items: QuickActionMenuItem[];
  align?: "left" | "right";
  placement?: "bottom" | "top";
  triggerLabel?: string;
  triggerIcon?: ReactNode;
  minWidth?: number;
};

export default function QuickActionMenu({
  mode,
  items,
  align = "right",
  placement = "bottom",
  triggerLabel = "Actions",
  triggerIcon,
  minWidth = 210,
}: QuickActionMenuProps) {
  const theme = getTheme(mode);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const menuPositionStyle =
    placement === "bottom"
      ? { top: "calc(100% + 10px)" }
      : { bottom: "calc(100% + 10px)" };

  const menuAlignStyle =
    align === "right"
      ? { right: 0 }
      : { left: 0 };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          height: 40,
          padding: "0 14px",
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          background: open
            ? theme.cardBgSoft ?? theme.cardBg
            : theme.cardBg,
          color: theme.text,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow:
            open && mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.24)"
              : open
              ? "0 8px 20px rgba(15,23,42,0.08)"
              : "none",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          {triggerIcon ?? "⋯"}
        </span>

        <span>{triggerLabel}</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            zIndex: 50,
            minWidth,
            ...menuPositionStyle,
            ...menuAlignStyle,
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 8,
            boxShadow:
              mode === "dark"
                ? "0 18px 40px rgba(0,0,0,0.36)"
                : "0 18px 40px rgba(15,23,42,0.14)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {items.map((item) => {
              const textColor = item.disabled
                ? theme.mutedText
                : item.danger
                ? theme.warning ?? "#ef4444"
                : theme.text;

              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;
                    item.onClick?.();
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 42,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: textColor,
                    borderRadius: 12,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "left",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    opacity: item.disabled ? 0.65 : 1,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    {item.icon ?? "•"}
                  </span>

                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}