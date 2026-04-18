import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  triggerLabel?: string;
  mode?: ThemeMode;
  align?: "left" | "right";
  minWidth?: number;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  triggerLabel = "Open",
  mode = "light",
  align = "right",
  minWidth = 200,
  className,
  disabled = false,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 40,
          padding: "0 14px",
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          background: theme.cardBg,
          color: theme.text,
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 13,
          fontWeight: 700,
          transition: "all 0.2s ease",
          boxShadow:
            mode === "dark"
              ? "0 8px 20px rgba(0,0,0,0.22)"
              : "0 8px 20px rgba(15,23,42,0.08)",
        }}
      >
        {trigger ?? (
          <>
            <span>{triggerLabel}</span>
            <span
              aria-hidden="true"
              style={{
                fontSize: 11,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ▼
            </span>
          </>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Dropdown menu"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            [align]: 0,
            minWidth,
            padding: 8,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            boxShadow:
              mode === "dark"
                ? "0 18px 36px rgba(0,0,0,0.32)"
                : "0 18px 36px rgba(15,23,42,0.14)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 4,
            }}
          >
            {items.length === 0 ? (
              <div
                style={{
                  padding: "10px 12px",
                  color: theme.subText,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                No options available
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
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
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 12px",
                    border: "none",
                    borderRadius: 12,
                    background: "transparent",
                    color: item.disabled
                      ? theme.mutedText ?? theme.subText
                      : item.danger
                      ? "#dc2626"
                      : theme.text,
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(event) => {
                    if (item.disabled) return;
                    event.currentTarget.style.background =
                      mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : theme.cardBgSoft ?? "#f8fafc";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {item.icon ?? (item.danger ? "🗑" : "•")}
                  </span>

                  <span style={{ flex: 1 }}>{item.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;