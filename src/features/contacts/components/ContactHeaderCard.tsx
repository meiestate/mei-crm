type ThemeMode = "light" | "dark";

export type ContactHeaderCardData = {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  designation?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: "active" | "inactive" | "blocked" | "archived" | string;
  ownerName?: string;
  location?: string;
  tags?: string[];
  updatedAt?: string;
};

type ContactHeaderCardProps = {
  mode?: ThemeMode;
  data: ContactHeaderCardData;
  onBack?: () => void;
  onEdit?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  onDelete?: () => void;
};

function getStatusTheme(status: string | undefined, mode: ThemeMode) {
  const value = (status ?? "").toLowerCase();

  if (value === "active") {
    return {
      bg: mode === "dark" ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.10)",
      text: mode === "dark" ? "#86efac" : "#15803d",
      border:
        mode === "dark" ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.18)",
    };
  }

  if (value === "inactive") {
    return {
      bg: mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
      text: mode === "dark" ? "#cbd5e1" : "#475569",
      border:
        mode === "dark"
          ? "rgba(148,163,184,0.28)"
          : "rgba(148,163,184,0.18)",
    };
  }

  if (value === "blocked") {
    return {
      bg: mode === "dark" ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.10)",
      text: mode === "dark" ? "#fca5a5" : "#b91c1c",
      border:
        mode === "dark" ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.18)",
    };
  }

  if (value === "archived") {
    return {
      bg: mode === "dark" ? "rgba(168,85,247,0.16)" : "rgba(168,85,247,0.10)",
      text: mode === "dark" ? "#d8b4fe" : "#7e22ce",
      border:
        mode === "dark" ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.18)",
    };
  }

  return {
    bg: mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
    text: mode === "dark" ? "#cbd5e1" : "#475569",
    border:
      mode === "dark"
        ? "rgba(148,163,184,0.28)"
        : "rgba(148,163,184,0.18)",
  };
}

function getInitials(firstName: string, lastName?: string) {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "C";
}

export default function ContactHeaderCard({
  mode = "light",
  data,
  onBack,
  onEdit,
  onCall,
  onEmail,
  onWhatsApp,
  onDelete,
}: ContactHeaderCardProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    primarySoft: isDark ? "rgba(37,99,235,0.16)" : "rgba(37,99,235,0.10)",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    mutedText: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    primary: "#2563eb",
    shadow: isDark
      ? "0 20px 40px rgba(0,0,0,0.28)"
      : "0 16px 32px rgba(15,23,42,0.08)",
  };

  const fullName = `${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}`.trim();
  const statusTheme = getStatusTheme(data.status, mode);

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        boxShadow: theme.shadow,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                style={{
                  height: 38,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStrong}`,
                  background: theme.cardSoft,
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            ) : null}

            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.subText,
              }}
            >
              Contact Profile
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {onCall ? (
              <button
                type="button"
                onClick={onCall}
                style={getActionButtonStyle(theme, "secondary")}
              >
                Call
              </button>
            ) : null}

            {onEmail ? (
              <button
                type="button"
                onClick={onEmail}
                style={getActionButtonStyle(theme, "secondary")}
              >
                Email
              </button>
            ) : null}

            {onWhatsApp ? (
              <button
                type="button"
                onClick={onWhatsApp}
                style={getActionButtonStyle(theme, "secondary")}
              >
                WhatsApp
              </button>
            ) : null}

            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                style={getActionButtonStyle(theme, "primary")}
              >
                Edit
              </button>
            ) : null}

            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "none",
                  background: isDark
                    ? "rgba(239,68,68,0.16)"
                    : "rgba(239,68,68,0.10)",
                  color: isDark ? "#fca5a5" : "#b91c1c",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: theme.primarySoft,
                color: theme.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {getInitials(data.firstName, data.lastName)}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 800,
                    color: theme.text,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.25,
                  }}
                >
                  {fullName}
                </h1>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 30,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: `1px solid ${statusTheme.border}`,
                    background: statusTheme.bg,
                    color: statusTheme.text,
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.status || "unknown"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  fontSize: 14,
                  color: theme.subText,
                  lineHeight: 1.7,
                }}
              >
                {data.designation ? <span>{data.designation}</span> : null}
                {data.company ? <span>• {data.company}</span> : null}
                {data.location ? <span>• {data.location}</span> : null}
                {data.ownerName ? <span>• Owner: {data.ownerName}</span> : null}
              </div>
            </div>
          </div>

          <div
            style={{
              minWidth: 220,
              display: "grid",
              gap: 10,
            }}
          >
            <QuickInfoRow label="Email" value={data.email || "—"} theme={theme} />
            <QuickInfoRow label="Phone" value={data.phone || "—"} theme={theme} />
            <QuickInfoRow label="Source" value={data.source || "—"} theme={theme} />
            <QuickInfoRow
              label="Last Updated"
              value={data.updatedAt || "—"}
              theme={theme}
            />
          </div>
        </div>

        {data.tags?.length ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {data.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 30,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: theme.primarySoft,
                  color: theme.primary,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function QuickInfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: {
    cardSoft: string;
    text: string;
    subText: string;
    border: string;
  };
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${theme.border}`,
        background: theme.cardSoft,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: value === "—" ? theme.subText : theme.text,
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function getActionButtonStyle(
  theme: {
    primary: string;
    text: string;
    borderStrong: string;
    cardSoft: string;
  },
  variant: "primary" | "secondary",
) {
  if (variant === "primary") {
    return {
      height: 40,
      padding: "0 14px",
      borderRadius: 12,
      border: "none",
      background: theme.primary,
      color: "#ffffff",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
    } as const;
  }

  return {
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    border: `1px solid ${theme.borderStrong}`,
    background: theme.cardSoft,
    color: theme.text,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  } as const;
}