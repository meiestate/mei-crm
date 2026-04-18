import React, { useMemo, useState } from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  mode?: ThemeMode;
  shape?: "circle" | "rounded";
  status?: "online" | "offline" | "busy" | "away";
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "U";

  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

const getStatusColor = (status: NonNullable<AvatarProps["status"]>) => {
  switch (status) {
    case "online":
      return "#16a34a";
    case "busy":
      return "#dc2626";
    case "away":
      return "#d97706";
    case "offline":
    default:
      return "#64748b";
  }
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  mode = "light",
  shape = "circle",
  status = "offline",
  showStatus = false,
  className,
  onClick,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [hasError, setHasError] = useState(false);

  const sizing = useMemo(() => {
    switch (size) {
      case "xs":
        return { box: 28, font: 11, status: 8 };
      case "sm":
        return { box: 36, font: 12, status: 9 };
      case "lg":
        return { box: 56, font: 18, status: 12 };
      case "xl":
        return { box: 72, font: 22, status: 14 };
      case "md":
      default:
        return { box: 44, font: 14, status: 10 };
    }
  }, [size]);

  const initials = useMemo(() => getInitials(name), [name]);
  const statusColor = getStatusColor(status);
  const radius = shape === "circle" ? "50%" : 16;

  const clickable = Boolean(onClick);

  return (
    <div
      className={className}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!clickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      style={{
        position: "relative",
        width: sizing.box,
        height: sizing.box,
        minWidth: sizing.box,
        borderRadius: radius,
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        cursor: clickable ? "pointer" : "default",
        border: `1px solid ${theme.border}`,
        background:
          mode === "dark"
            ? "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(148,163,184,0.12))"
            : "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(226,232,240,0.9))",
        color: theme.text,
        fontSize: sizing.font,
        fontWeight: 800,
        letterSpacing: 0.3,
        boxShadow:
          mode === "dark"
            ? "0 8px 20px rgba(0,0,0,0.26)"
            : "0 8px 20px rgba(15,23,42,0.08)",
        transition: "all 0.2s ease",
      }}
      title={name || alt || "Avatar"}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt ?? name ?? "Avatar"}
          onError={() => setHasError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}

      {showStatus ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 1,
            bottom: 1,
            width: sizing.status,
            height: sizing.status,
            borderRadius: "50%",
            background: statusColor,
            border: `2px solid ${theme.cardBg}`,
            boxShadow: `0 0 0 2px ${statusColor}22`,
          }}
        />
      ) : null}
    </div>
  );
};

export default Avatar;