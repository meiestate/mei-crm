type ThemeMode = "light" | "dark";

export type ContactOverviewData = {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  designation?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  source?: string;
  status?: "active" | "inactive" | "blocked" | "archived" | string;
  ownerName?: string;
  location?: string;
  budget?: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ContactOverviewCardProps = {
  mode?: ThemeMode;
  data: ContactOverviewData;
  onEdit?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
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

export default function ContactOverviewCard({
  mode = "light",
  data,
  onEdit,
  onCall,
  onEmail,
  onWhatsApp,
}: ContactOverviewCardProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    pageBg: isDark ? "#020617" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    mutedText: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    primary: "#2563eb",
    primarySoft: isDark ? "rgba(37,99,235,0.16)" : "rgba(37,99,235,0.10)",
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
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
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
              width: 64,
              height: 64,
              borderRadius: 18,
              background: theme.primarySoft,
              color: theme.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 22,
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
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: theme.text,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.3,
                }}
              >
                {fullName}
              </h2>

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
                fontSize: 14,
                color: theme.subText,
                lineHeight: 1.7,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {data.designation ? <span>{data.designation}</span> : null}
              {data.company ? <span>• {data.company}</span> : null}
              {data.location ? <span>• {data.location}</span> : null}
            </div>
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
              Edit Contact
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <InfoCard label="Email" value={data.email || "—"} theme={theme} />
        <InfoCard label="Phone" value={data.phone || "—"} theme={theme} />
        <InfoCard
          label="Alternate Phone"
          value={data.alternatePhone || "—"}
          theme={theme}
        />
        <InfoCard label="Source" value={data.source || "—"} theme={theme} />
        <InfoCard label="Owner" value={data.ownerName || "—"} theme={theme} />
        <InfoCard label="Budget" value={data.budget || "—"} theme={theme} />
        <InfoCard
          label="Created At"
          value={data.createdAt || "—"}
          theme={theme}
        />
        <InfoCard
          label="Updated At"
          value={data.updatedAt || "—"}
          theme={theme}
        />
      </div>

      {(data.tags?.length || data.notes) ? (
        <div
          style={{
            padding: "0 20px 20px",
            display: "grid",
            gap: 16,
          }}
        >
          {data.tags?.length ? (
            <div
              style={{
                borderRadius: 18,
                border: `1px solid ${theme.border}`,
                background: theme.cardSoft,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.subText,
                  marginBottom: 10,
                }}
              >
                Tags
              </div>

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
            </div>
          ) : null}

          {data.notes ? (
            <div
              style={{
                borderRadius: 18,
                border: `1px solid ${theme.border}`,
                background: theme.cardSoft,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.subText,
                  marginBottom: 10,
                }}
              >
                Notes
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: theme.text,
                  whiteSpace: "pre-wrap",
                }}
              >
                {data.notes}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function InfoCard({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: {
    cardSoft: string;
    pageBg: string;
    text: string;
    subText: string;
    border: string;
  };
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${theme.border}`,
        background: theme.cardSoft,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: theme.subText,
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: value === "—" ? theme.subText : theme.text,
          lineHeight: 1.7,
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