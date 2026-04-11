import type { CSSProperties, ReactNode } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type PipelineStage = {
  id: string;
  name: string;
  color: string;
  order: number;
};

type PipelinesCardProps = {
  mode?: ThemeMode;
  leadStages: PipelineStage[];
  dealStages: PipelineStage[];
  onAddLeadStage?: () => void;
  onReorderLeadStages?: () => void;
  onAddDealStage?: () => void;
  onEditDealMapping?: () => void;
};

export default function PipelinesCard({
  mode = "light",
  leadStages,
  dealStages,
  onAddLeadStage,
  onReorderLeadStages,
  onAddDealStage,
  onEditDealMapping,
}: PipelinesCardProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        display: "grid",
        gap: 20,
      }}
    >
      <SectionCard
        title="Lead Pipeline"
        subtitle="Configure stages for lead progression, qualification, and conversion tracking."
        theme={theme}
      >
        <PipelineStats
          theme={theme}
          totalStages={leadStages.length}
          firstStage={leadStages[0]?.name ?? "-"}
          lastStage={leadStages[leadStages.length - 1]?.name ?? "-"}
        />

        <div style={{ marginTop: 18 }}>
          <PipelineTable theme={theme} data={leadStages} />
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onAddLeadStage}
            style={primaryButtonStyle(theme)}
          >
            Add Lead Stage
          </button>

          <button
            type="button"
            onClick={onReorderLeadStages}
            style={secondaryButtonStyle(theme)}
          >
            Reorder Stages
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Deal Pipeline"
        subtitle="Configure stages for active deals, negotiation flow, and close tracking."
        theme={theme}
      >
        <PipelineStats
          theme={theme}
          totalStages={dealStages.length}
          firstStage={dealStages[0]?.name ?? "-"}
          lastStage={dealStages[dealStages.length - 1]?.name ?? "-"}
        />

        <div style={{ marginTop: 18 }}>
          <PipelineTable theme={theme} data={dealStages} />
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onAddDealStage}
            style={primaryButtonStyle(theme)}
          >
            Add Deal Stage
          </button>

          <button
            type="button"
            onClick={onEditDealMapping}
            style={secondaryButtonStyle(theme)}
          >
            Edit Mapping
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  theme,
  children,
}: {
  title: string;
  subtitle: string;
  theme: ReturnType<typeof getTheme>;
  children: ReactNode;
}) {
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
          {title}
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          {subtitle}
        </div>
      </div>

      {children}
    </div>
  );
}

function PipelineStats({
  theme,
  totalStages,
  firstStage,
  lastStage,
}: {
  theme: ReturnType<typeof getTheme>;
  totalStages: number;
  firstStage: string;
  lastStage: string;
}) {
  return (
    <div style={statsGridStyle}>
      <InfoCard title="Total Stages" value={String(totalStages)} theme={theme} />
      <InfoCard title="Entry Stage" value={firstStage} theme={theme} />
      <InfoCard title="Final Stage" value={lastStage} theme={theme} />
    </div>
  );
}

function PipelineTable({
  theme,
  data,
}: {
  theme: ReturnType<typeof getTheme>;
  data: PipelineStage[];
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 680,
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: theme.tableHeadBg,
          }}
        >
          <tr>
            {["Order", "Stage Name", "Color", "Preview"].map((column) => (
              <th
                key={column}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  color: theme.subText,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((stage) => (
              <tr
                key={stage.id}
                style={{
                  background: theme.rowBg,
                }}
              >
                <td style={cellStyle(theme)}>{stage.order}</td>
                <td style={cellStyle(theme)}>{stage.name}</td>
                <td style={cellStyle(theme)}>{stage.color}</td>
                <td style={cellStyle(theme)}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      background: stage.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stage.name}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: "22px 16px",
                  textAlign: "center",
                  fontSize: 14,
                  color: theme.subText,
                  background: theme.rowBg,
                }}
              >
                No pipeline stages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

function cellStyle(theme: ReturnType<typeof getTheme>): CSSProperties {
  return {
    padding: "14px 16px",
    fontSize: 14,
    color: theme.text,
    borderBottom: `1px solid ${theme.borderSoft}`,
    verticalAlign: "middle",
  };
}

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
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}