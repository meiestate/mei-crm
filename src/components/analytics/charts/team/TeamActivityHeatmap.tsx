import { useMemo, useState } from "react";

export type TeamActivityHeatmapItem = {
  day: string;
  hour: string;
  activityCount: number;
};

type TeamActivityHeatmapProps = {
  title?: string;
  subtitle?: string;
  data?: TeamActivityHeatmapItem[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

const DEFAULT_DATA: TeamActivityHeatmapItem[] = [
  { day: "Mon", hour: "08:00", activityCount: 8 },
  { day: "Mon", hour: "09:00", activityCount: 14 },
  { day: "Mon", hour: "10:00", activityCount: 24 },
  { day: "Mon", hour: "11:00", activityCount: 28 },
  { day: "Mon", hour: "12:00", activityCount: 18 },
  { day: "Mon", hour: "13:00", activityCount: 12 },
  { day: "Mon", hour: "14:00", activityCount: 21 },
  { day: "Mon", hour: "15:00", activityCount: 26 },
  { day: "Mon", hour: "16:00", activityCount: 19 },
  { day: "Mon", hour: "17:00", activityCount: 16 },
  { day: "Mon", hour: "18:00", activityCount: 11 },
  { day: "Mon", hour: "19:00", activityCount: 5 },

  { day: "Tue", hour: "08:00", activityCount: 6 },
  { day: "Tue", hour: "09:00", activityCount: 16 },
  { day: "Tue", hour: "10:00", activityCount: 27 },
  { day: "Tue", hour: "11:00", activityCount: 31 },
  { day: "Tue", hour: "12:00", activityCount: 22 },
  { day: "Tue", hour: "13:00", activityCount: 15 },
  { day: "Tue", hour: "14:00", activityCount: 25 },
  { day: "Tue", hour: "15:00", activityCount: 30 },
  { day: "Tue", hour: "16:00", activityCount: 23 },
  { day: "Tue", hour: "17:00", activityCount: 18 },
  { day: "Tue", hour: "18:00", activityCount: 13 },
  { day: "Tue", hour: "19:00", activityCount: 7 },

  { day: "Wed", hour: "08:00", activityCount: 9 },
  { day: "Wed", hour: "09:00", activityCount: 18 },
  { day: "Wed", hour: "10:00", activityCount: 29 },
  { day: "Wed", hour: "11:00", activityCount: 35 },
  { day: "Wed", hour: "12:00", activityCount: 24 },
  { day: "Wed", hour: "13:00", activityCount: 17 },
  { day: "Wed", hour: "14:00", activityCount: 28 },
  { day: "Wed", hour: "15:00", activityCount: 33 },
  { day: "Wed", hour: "16:00", activityCount: 26 },
  { day: "Wed", hour: "17:00", activityCount: 20 },
  { day: "Wed", hour: "18:00", activityCount: 14 },
  { day: "Wed", hour: "19:00", activityCount: 8 },

  { day: "Thu", hour: "08:00", activityCount: 7 },
  { day: "Thu", hour: "09:00", activityCount: 15 },
  { day: "Thu", hour: "10:00", activityCount: 26 },
  { day: "Thu", hour: "11:00", activityCount: 30 },
  { day: "Thu", hour: "12:00", activityCount: 21 },
  { day: "Thu", hour: "13:00", activityCount: 14 },
  { day: "Thu", hour: "14:00", activityCount: 24 },
  { day: "Thu", hour: "15:00", activityCount: 29 },
  { day: "Thu", hour: "16:00", activityCount: 22 },
  { day: "Thu", hour: "17:00", activityCount: 19 },
  { day: "Thu", hour: "18:00", activityCount: 12 },
  { day: "Thu", hour: "19:00", activityCount: 6 },

  { day: "Fri", hour: "08:00", activityCount: 5 },
  { day: "Fri", hour: "09:00", activityCount: 13 },
  { day: "Fri", hour: "10:00", activityCount: 22 },
  { day: "Fri", hour: "11:00", activityCount: 27 },
  { day: "Fri", hour: "12:00", activityCount: 20 },
  { day: "Fri", hour: "13:00", activityCount: 13 },
  { day: "Fri", hour: "14:00", activityCount: 23 },
  { day: "Fri", hour: "15:00", activityCount: 25 },
  { day: "Fri", hour: "16:00", activityCount: 21 },
  { day: "Fri", hour: "17:00", activityCount: 17 },
  { day: "Fri", hour: "18:00", activityCount: 10 },
  { day: "Fri", hour: "19:00", activityCount: 5 },

  { day: "Sat", hour: "08:00", activityCount: 2 },
  { day: "Sat", hour: "09:00", activityCount: 5 },
  { day: "Sat", hour: "10:00", activityCount: 10 },
  { day: "Sat", hour: "11:00", activityCount: 13 },
  { day: "Sat", hour: "12:00", activityCount: 11 },
  { day: "Sat", hour: "13:00", activityCount: 7 },
  { day: "Sat", hour: "14:00", activityCount: 9 },
  { day: "Sat", hour: "15:00", activityCount: 12 },
  { day: "Sat", hour: "16:00", activityCount: 8 },
  { day: "Sat", hour: "17:00", activityCount: 6 },
  { day: "Sat", hour: "18:00", activityCount: 4 },
  { day: "Sat", hour: "19:00", activityCount: 2 },

  { day: "Sun", hour: "08:00", activityCount: 1 },
  { day: "Sun", hour: "09:00", activityCount: 3 },
  { day: "Sun", hour: "10:00", activityCount: 5 },
  { day: "Sun", hour: "11:00", activityCount: 7 },
  { day: "Sun", hour: "12:00", activityCount: 6 },
  { day: "Sun", hour: "13:00", activityCount: 4 },
  { day: "Sun", hour: "14:00", activityCount: 5 },
  { day: "Sun", hour: "15:00", activityCount: 6 },
  { day: "Sun", hour: "16:00", activityCount: 5 },
  { day: "Sun", hour: "17:00", activityCount: 3 },
  { day: "Sun", hour: "18:00", activityCount: 2 },
  { day: "Sun", hour: "19:00", activityCount: 1 },
];

const FILTER_OPTIONS = ["All", ...DAYS] as const;

function getIntensityColor(value: number, max: number): string {
  if (max <= 0 || value <= 0) return "#f3f4f6";

  const ratio = value / max;

  if (ratio >= 0.85) return "#0f766e";
  if (ratio >= 0.65) return "#14b8a6";
  if (ratio >= 0.45) return "#5eead4";
  if (ratio >= 0.25) return "#99f6e4";
  return "#ccfbf1";
}

function getTextColor(value: number, max: number): string {
  if (max <= 0 || value <= 0) return "#6b7280";
  const ratio = value / max;
  return ratio >= 0.65 ? "#ffffff" : "#0f172a";
}

export default function TeamActivityHeatmap({
  title = "Team Activity Heatmap",
  subtitle = "Visualize team workload intensity across weekdays and working hours",
  data = DEFAULT_DATA,
}: TeamActivityHeatmapProps) {
  const [selectedDay, setSelectedDay] =
    useState<(typeof FILTER_OPTIONS)[number]>("All");

  const safeData = useMemo(() => {
    return (data ?? []).filter(
      (item) =>
        item &&
        typeof item.day === "string" &&
        typeof item.hour === "string" &&
        typeof item.activityCount === "number" &&
        item.activityCount >= 0
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedDay === "All") return safeData;
    return safeData.filter((item) => item.day === selectedDay);
  }, [safeData, selectedDay]);

  const maxActivity = useMemo(() => {
    if (!filteredData.length) return 0;
    return Math.max(...filteredData.map((item) => item.activityCount));
  }, [filteredData]);

  const totalActivity = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.activityCount, 0);
  }, [filteredData]);

  const averageActivity = useMemo(() => {
    if (!filteredData.length) return 0;
    return totalActivity / filteredData.length;
  }, [filteredData, totalActivity]);

  const peakSlot = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort((a, b) => b.activityCount - a.activityCount)[0];
  }, [filteredData]);

  const peakDay = useMemo(() => {
    if (!safeData.length) return null;

    const dayTotals = DAYS.map((day) => ({
      day,
      total: safeData
        .filter((item) => item.day === day)
        .reduce((sum, item) => sum + item.activityCount, 0),
    }));

    return dayTotals.sort((a, b) => b.total - a.total)[0];
  }, [safeData]);

  const heatmapMatrix = useMemo(() => {
    const source = selectedDay === "All" ? DAYS : ([selectedDay] as readonly string[]);

    return source.map((day) => {
      return {
        day,
        slots: HOURS.map((hour) => {
          const match = safeData.find((item) => item.day === day && item.hour === hour);
          return {
            hour,
            value: match?.activityCount ?? 0,
          };
        }),
      };
    });
  }, [safeData, selectedDay]);

  const hasData = heatmapMatrix.some((row) =>
    row.slots.some((slot) => slot.value > 0)
  );

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {FILTER_OPTIONS.map((option) => {
            const active = selectedDay === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedDay(option)}
                style={{
                  border: active ? "1px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#ffffff",
                  color: active ? "#ffffff" : "#374151",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >
          <div style={{ fontSize: 12, color: "#1d4ed8", marginBottom: 6 }}>
            Total Activity
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1d4ed8" }}>
            {totalActivity}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#f0fdfa",
            border: "1px solid #ccfbf1",
          }}
        >
          <div style={{ fontSize: 12, color: "#0f766e", marginBottom: 6 }}>
            Avg Activity / Slot
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f766e" }}>
            {averageActivity.toFixed(1)}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <div style={{ fontSize: 12, color: "#9a3412", marginBottom: 6 }}>
            Peak Slot
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#9a3412" }}>
            {peakSlot ? `${peakSlot.day} ${peakSlot.hour}` : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#9a3412", marginTop: 4 }}>
            {peakSlot ? `${peakSlot.activityCount} activities` : "No data"}
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 14,
            background: "#fdf4ff",
            border: "1px solid #f5d0fe",
          }}
        >
          <div style={{ fontSize: 12, color: "#a21caf", marginBottom: 6 }}>
            Peak Day
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a21caf" }}>
            {peakDay ? peakDay.day : "-"}
          </div>
          <div style={{ fontSize: 13, color: "#a21caf", marginTop: 4 }}>
            {peakDay ? `${peakDay.total} total activities` : "No data"}
          </div>
        </div>
      </div>

      {!hasData ? (
        <div
          style={{
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            border: "1px dashed #d1d5db",
            background: "#fafafa",
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          No team activity data available.
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 18,
            border: "1px solid #e5e7eb",
            background: "#fcfcfd",
            padding: 14,
          }}
        >
          <div
            style={{
              minWidth: 860,
              display: "grid",
              gridTemplateColumns: `120px repeat(${HOURS.length}, minmax(56px, 1fr))`,
              gap: 8,
              alignItems: "center",
            }}
          >
            <div />

            {HOURS.map((hour) => (
              <div
                key={hour}
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6b7280",
                  paddingBottom: 6,
                }}
              >
                {hour}
              </div>
            ))}

            {heatmapMatrix.map((row) => (
              <FragmentRow
                key={row.day}
                day={row.day}
                slots={row.slots}
                maxActivity={maxActivity}
              />
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
            Activity Intensity
          </span>

          {[
            { label: "Low", color: "#ccfbf1" },
            { label: "Medium", color: "#5eead4" },
            { label: "High", color: "#14b8a6" },
            { label: "Peak", color: "#0f766e" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: item.color,
                  border: "1px solid rgba(15,23,42,0.06)",
                  display: "inline-block",
                }}
              />
              {item.label}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          Darker cells indicate higher team activity concentration.
        </div>
      </div>
    </section>
  );
}

type FragmentRowProps = {
  day: string;
  slots: Array<{
    hour: string;
    value: number;
  }>;
  maxActivity: number;
};

function FragmentRow({ day, slots, maxActivity }: FragmentRowProps) {
  return (
    <>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111827",
          paddingRight: 8,
        }}
      >
        {day}
      </div>

      {slots.map((slot) => {
        const bg = getIntensityColor(slot.value, maxActivity);
        const color = getTextColor(slot.value, maxActivity);

        return (
          <div
            key={`${day}-${slot.hour}`}
            title={`${day} ${slot.hour} — ${slot.value} activities`}
            style={{
              height: 52,
              borderRadius: 12,
              background: bg,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              border: "1px solid rgba(15,23,42,0.05)",
              boxShadow:
                slot.value > 0 ? "inset 0 0 0 1px rgba(255,255,255,0.06)" : "none",
            }}
          >
            {slot.value}
          </div>
        );
      })}
    </>
  );
}