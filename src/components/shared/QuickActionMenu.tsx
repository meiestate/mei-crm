import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface QuickActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface QuickActionMenuProps {
  actions: QuickActionItem[];
  mode?: ThemeMode;
  triggerLabel?: string;
  triggerIcon?: ReactNode;
  align?: "left" | "right";
  className?: string;
  disabled?: boolean;
}

const QuickActionMenu: React.FC<QuickActionMenuProps> = ({
  actions,
  mode = "light",
  triggerLabel = "Actions",
  triggerIcon,
  align = "right",
  className,
  disabled = false,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const triggerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow:
      mode === "dark"
        ? "0 6px 16px rgba(0,0,0,0.20)"
        : "0 8px 20px rgba(15,23,42,0.08)",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 10px)",
    [align]: 0,
    minWidth: 220,
    padding: 8,
    borderRadius: 16,
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    boxShadow:
      mode === "dark"
        ? "0 20px 40px rgba(0,0,0,0.35)"
        : "0 18px 42px rgba(15,23,42,0.14)",
    zIndex: 1000,
  };

  const headerStyle: React.CSSProperties = {
    padding: "6px 8px 10px 8px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: theme.subText,
  };

  const getItemStyle = (danger?: boolean, itemDisabled?: boolean): React.CSSProperties => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 12px",
    borderRadius: 12,
    border: "none",
    background: "transparent",
    color: itemDisabled
      ? theme.mutedText ?? theme.subText
      : danger
      ? "#dc2626"
      : theme.text,
    fontSize: 13,
    fontWeight: 600,
    textAlign: "left",
    cursor: itemDisabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
  });

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
        ref={buttonRef}
        type="button"
        style={triggerStyle}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
      >
        {triggerIcon ? <span>{triggerIcon}</span> : <span>⚡</span>}
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
      </button>

      {open ? (
        <div style={dropdownStyle} role="menu" aria-label="Quick action menu">
          <div style={headerStyle}>Quick Actions</div>

          <div style={{ display: "grid", gap: 4 }}>
            {actions.length === 0 ? (
              <div
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  color: theme.subText,
                }}
              >
                No actions available
              </div>
            ) : (
              actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  disabled={action.disabled}
                  onClick={() => {
                    if (action.disabled) return;
                    action.onClick?.();
                    setOpen(false);
                  }}
                  style={getItemStyle(action.danger, action.disabled)}
                  onMouseEnter={(event) => {
                    if (action.disabled) return;
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
                    {action.icon ?? (action.danger ? "🗑" : "•")}
                  </span>

                  <span style={{ flex: 1 }}>{action.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QuickActionMenu;