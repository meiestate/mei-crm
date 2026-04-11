// src/features/settings/settings/team-users/UserActionMenu.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { getTheme, type ThemeMode } from "../../../../theme";

export type UserActionMenuUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  isOwner?: boolean;
};

type MenuTone = "default" | "danger" | "success" | "warning";

type UserActionMenuProps = {
  user: UserActionMenuUser;
  mode?: ThemeMode;
  disabled?: boolean;
  onView?: (user: UserActionMenuUser) => void;
  onEdit?: (user: UserActionMenuUser) => void;
  onInviteAgain?: (user: UserActionMenuUser) => void;
  onActivate?: (user: UserActionMenuUser) => void;
  onDeactivate?: (user: UserActionMenuUser) => void;
  onSuspend?: (user: UserActionMenuUser) => void;
  onDelete?: (user: UserActionMenuUser) => void;
};

type MenuAction = {
  key: string;
  label: string;
  icon: string;
  tone?: MenuTone;
  hidden?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function normalizeStatus(status?: string): string {
  return (status ?? "").trim().toLowerCase();
}

function getToneStyles(tone: MenuTone, mode: ThemeMode) {
  if (tone === "danger") {
    return {
      color: "#dc2626",
      bg: mode === "dark" ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.08)",
    };
  }

  if (tone === "success") {
    return {
      color: "#16a34a",
      bg: mode === "dark" ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.08)",
    };
  }

  if (tone === "warning") {
    return {
      color: "#d97706",
      bg: mode === "dark" ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.08)",
    };
  }

  return {
    color: "",
    bg: "transparent",
  };
}

function isVisibleAction(action: MenuAction): boolean {
  return !action.hidden;
}

export default function UserActionMenu({
  user,
  mode = "light",
  disabled = false,
  onView,
  onEdit,
  onInviteAgain,
  onActivate,
  onDeactivate,
  onSuspend,
  onDelete,
}: UserActionMenuProps) {
  const theme = getTheme(mode);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const status = normalizeStatus(user.status);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const actions = useMemo<MenuAction[]>(() => {
    const nextActions: MenuAction[] = [
      {
        key: "view",
        label: "View Profile",
        icon: "👁️",
        hidden: !onView,
        onClick: () => onView?.(user),
      },
      {
        key: "edit",
        label: "Edit User",
        icon: "✏️",
        hidden: !onEdit,
        onClick: () => onEdit?.(user),
      },
      {
        key: "invite-again",
        label: "Resend Invite",
        icon: "✉️",
        tone: "warning",
        hidden: !onInviteAgain || status !== "invited",
        onClick: () => onInviteAgain?.(user),
      },
      {
        key: "activate",
        label: "Activate User",
        icon: "✅",
        tone: "success",
        hidden: !onActivate || status === "active" || status === "invited",
        onClick: () => onActivate?.(user),
      },
      {
        key: "deactivate",
        label: "Deactivate User",
        icon: "⏸️",
        tone: "warning",
        hidden: !onDeactivate || status !== "active",
        disabled: user.isOwner,
        onClick: () => onDeactivate?.(user),
      },
      {
        key: "suspend",
        label: "Suspend User",
        icon: "🚫",
        tone: "warning",
        hidden: !onSuspend || status === "suspended",
        disabled: user.isOwner,
        onClick: () => onSuspend?.(user),
      },
      {
        key: "delete",
        label: "Delete User",
        icon: "🗑️",
        tone: "danger",
        hidden: !onDelete,
        disabled: user.isOwner,
        onClick: () => onDelete?.(user),
      },
    ];

    return nextActions.filter(isVisibleAction);
  }, [
    onActivate,
    onDeactivate,
    onDelete,
    onEdit,
    onInviteAgain,
    onSuspend,
    onView,
    status,
    user,
  ]);

  const handleAction = (action: MenuAction) => {
    if (action.disabled) return;
    setOpen(false);
    action.onClick?.();
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          border: `1px solid ${theme.border}`,
          background: theme.cardBgSoft,
          color: theme.text,
          borderRadius: 10,
          padding: "8px 10px",
          fontSize: 14,
          fontWeight: 900,
          lineHeight: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        ⋯
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={`Actions for ${user.name}`}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 210,
            padding: 8,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            boxShadow:
              mode === "dark"
                ? "0 18px 40px rgba(0,0,0,0.34)"
                : "0 18px 40px rgba(15, 23, 42, 0.14)",
            zIndex: 40,
            display: "grid",
            gap: 6,
          }}
        >
          <div
            style={{
              padding: "8px 10px 10px",
              borderBottom: `1px solid ${theme.borderSoft}`,
              marginBottom: 2,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.3,
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.subText,
                marginTop: 4,
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </div>
          </div>

          {actions.map((action) => {
            const tone = getToneStyles(action.tone ?? "default", mode);

            return (
              <button
                key={action.key}
                type="button"
                role="menuitem"
                disabled={action.disabled}
                onClick={() => handleAction(action)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                  border: "none",
                  background: action.tone ? tone.bg : "transparent",
                  color: tone.color || theme.text,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: action.disabled ? "not-allowed" : "pointer",
                  opacity: action.disabled ? 0.5 : 1,
                }}
              >
                <span
                  style={{
                    width: 18,
                    display: "inline-flex",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </span>
                <span>{action.label}</span>
              </button>
            );
          })}

          {user.isOwner ? (
            <div
              style={{
                marginTop: 2,
                padding: "8px 10px 4px",
                borderTop: `1px solid ${theme.borderSoft}`,
                fontSize: 11,
                color: theme.mutedText,
                lineHeight: 1.5,
              }}
            >
              Owner account actions are restricted.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}