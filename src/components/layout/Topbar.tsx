import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type TopbarProps = {
  title: string;
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export default function Topbar({ title, mode, onToggleTheme }: TopbarProps) {
  const colors = getTheme(mode);
  const isDark = mode === "dark";

  return (
    <header
      style={{
        height: 72,
        background: colors.topbarBg,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 26, color: colors.text }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onToggleTheme}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 700,
            cursor: "pointer",
            background: isDark ? colors.inverseText : colors.text,
            color: isDark ? colors.text : colors.inverseText,
          }}
        >
          {isDark ? "Light Mode" : "Dark Navy Mode"}
        </button>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: colors.primary,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            boxShadow: colors.shadowSoft,
          }}
        >
          M
        </div>
      </div>
    </header>
  );
}