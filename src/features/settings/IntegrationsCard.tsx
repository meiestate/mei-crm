import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  status: "Connected" | "Not Connected";
};

type IntegrationsCardProps = {
  mode?: ThemeMode;
  integrations: IntegrationItem[];
  onConnect?: (integration: IntegrationItem) => void;
  onConfigure?: (integration: IntegrationItem) => void;
  onViewDetails?: (integration: IntegrationItem) => void;
};

export default function IntegrationsCard({
  mode = "light",
  integrations,
  onConnect,
  onConfigure,
  onViewDetails,
}: IntegrationsCardProps) {
  const theme = getTheme(mode);

  const connectedCount = integrations.filter(
    (integration) => integration.status === "Connected"
  ).length;

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Integrations
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Connect the tools that power communication, billing, calendar sync,
          marketing, and workflow automation.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard
          title="Total Integrations"
          value={String(integrations.length)}
          theme={theme}
        />
        <InfoCard
          title="Connected"
          value={String(connectedCount)}
          theme={theme}
        />
        <InfoCard
          title="Not Connected"
          value={String(integrations.length - connectedCount)}
          theme={theme}
        />
      </div>

      <div style={cardsGridStyle}>
        {integrations.length > 0 ? (
          integrations.map((integration) => {
            const isConnected = integration.status === "Connected";

            return (
              <div
                key={integration.id}
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBgSoft,
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: theme.text,
                      }}
                    >
                      {integration.name}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: theme.subText,
                      }}
                    >
                      {integration.description}
                    </div>
                  </div>

                  <StatusBadge
                    label={integration.status}
                    tone={isConnected ? "success" : "warning"}
                    theme={theme}
                  />
                </div>

                <div style={{ ...actionsRowStyle, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() =>
                      isConnected
                        ? onConfigure?.(integration)
                        : onConnect?.(integration)
                    }
                    style={primaryButtonStyle(theme)}
                  >
                    {isConnected ? "Configure" : "Connect"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewDetails?.(integration)}
                    style={secondaryButtonStyle(theme)}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: 24,
              borderRadius: 16,
              border: `1px dashed ${theme.border}`,
              color: theme.subText,
              fontSize: 14,
              textAlign: "center",
              background: theme.cardBgSoft,
            }}
          >
            No integrations available.
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  theme,
}: {
  title: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
  theme,
}: {
  label: string;
  tone: "success" | "warning";
  theme: ReturnType<typeof getTheme>;
}) {
  const toneMap = {
    success: {
      bg: "rgba(34, 197, 94, 0.14)",
      color: theme.success,
      border: "rgba(34, 197, 94, 0.30)",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.14)",
      color: theme.warning,
      border: "rgba(245, 158, 11, 0.30)",
    },
  } as const;

  const selected = toneMap[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: selected.bg,
        color: selected.color,
        border: `1px solid ${selected.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const cardsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.primary,
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.cardBg,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}