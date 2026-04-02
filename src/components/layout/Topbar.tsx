type TopbarProps = {
  title: string;
  mode: "light" | "dark";
  onToggleTheme: () => void;
};

export default function Topbar({ title, mode, onToggleTheme }: TopbarProps) {
  const isDark = mode === "dark";

  return (
    <header
      style={{
        height: 72,
        background: isDark ? "#111827" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            color: isDark ? "#f8fafc" : "#111827",
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onToggleTheme}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 700,
            cursor: "pointer",
            background: isDark ? "#f8fafc" : "#111827",
            color: isDark ? "#111827" : "#ffffff",
          }}
        >
          {isDark ? "Light Mode" : "Dark Navy Mode"}
        </button>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isDark ? "#2563eb" : "#111827",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
          }}
        >
          M
        </div>
      </div>
    </header>
  );
}