import { useMemo, useState } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  mode: ThemeMode;
  name?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize | number;
  rounded?: boolean;
  showStatus?: boolean;
  status?: "online" | "offline" | "busy" | "away";
  fontWeight?: number;
};

function getInitials(name?: string) {
  if (!name) return "?";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function getAvatarSize(size: AvatarSize | number) {
  if (typeof size === "number") {
    return size;
  }

  switch (size) {
    case "xs":
      return 28;
    case "sm":
      return 34;
    case "md":
      return 42;
    case "lg":
      return 52;
    case "xl":
      return 68;
    default:
      return 42;
  }
}

function getStatusColor(status: NonNullable<AvatarProps["status"]>) {
  switch (status) {
    case "online":
      return "#22c55e";
    case "busy":
      return "#ef4444";
    case "away":
      return "#f59e0b";
    case "offline":
    default:
      return "#94a3b8";
  }
}

function getSeededColor(name: string, mode: ThemeMode) {
  const paletteLight = [
    "#dbeafe",
    "#ede9fe",
    "#dcfce7",
    "#fce7f3",
    "#fef3c7",
    "#cffafe",
  ];

  const paletteDark = [
    "#1d4ed8",
    "#6d28d9",
    "#15803d",
    "#be185d",
    "#b45309",
    "#0f766e",
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palette = mode === "dark" ? paletteDark : paletteLight;
  return palette[Math.abs(hash) % palette.length];
}

export default function Avatar({
  mode,
  name = "",
  src,
  alt,
  size = "md",
  rounded = true,
  showStatus = false,
  status = "offline",
  fontWeight = 800,
}: AvatarProps) {
  const theme = getTheme(mode);
  const [imageError, setImageError] = useState(false);

  const resolvedSize = getAvatarSize(size);
  const initials = useMemo(() => getInitials(name), [name]);
  const fallbackBg = useMemo(
    () => getSeededColor(name || "User", mode),
    [name, mode]
  );

  const hasImage = !!src && !imageError;
  const statusSize = Math.max(8, Math.round(resolvedSize * 0.24));
  const borderRadius = rounded ? "50%" : Math.max(10, Math.round(resolvedSize * 0.28));

  return (
    <div
      style={{
        position: "relative",
        width: resolvedSize,
        height: resolvedSize,
        flexShrink: 0,
      }}
      title={name || alt || "Avatar"}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hasImage
            ? theme.cardBg
            : fallbackBg,
          color: hasImage
            ? theme.text
            : mode === "dark"
            ? "#ffffff"
            : "#0f172a",
          border: `1px solid ${theme.border}`,
          userSelect: "none",
        }}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: Math.max(11, Math.round(resolvedSize * 0.34)),
              fontWeight,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {showStatus && (
        <span
          style={{
            position: "absolute",
            right: 1,
            bottom: 1,
            width: statusSize,
            height: statusSize,
            borderRadius: "50%",
            background: getStatusColor(status),
            border: `2px solid ${theme.cardBg}`,
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}