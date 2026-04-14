import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";

export type ScheduleSendFormValues = {
  date: string;
  time: string;
  note: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  timezoneLabel?: string;
  initialValues?: Partial<ScheduleSendFormValues>;
  onClose: () => void;
  onSubmit: (values: ScheduleSendFormValues) => void | Promise<void>;
};

type ThemePalette = {
  mode: ThemeMode;
  overlay: string;
  modalBg: string;
  cardBg: string;
  inputBg: string;
  border: string;
  borderSoft: string;
  text: string;
  subText: string;
  mutedText: string;
  primary: string;
  primaryHover: string;
  warning: string;
  danger: string;
  shadow: string;
};

const getTheme = (mode: ThemeMode = "light"): ThemePalette => {
  if (mode === "dark") {
    return {
      mode: "dark",
      overlay: "rgba(2, 6, 23, 0.8)",
      modalBg: "#0f172a",
      cardBg: "#111827",
      inputBg: "#0b1220",
      border: "#334155",
      borderSoft: "#1e293b",
      text: "#f8fafc",
      subText: "#cbd5e1",
      mutedText: "#94a3b8",
      primary: "#22c55e",
      primaryHover: "#16a34a",
      warning: "#f59e0b",
      danger: "#ef4444",
      shadow: "0 24px 64px rgba(0,0,0,0.48)",
    };
  }

  return {
    mode: "light",
    overlay: "rgba(15, 23, 42, 0.45)",
    modalBg: "#ffffff",
    cardBg: "#f8fafc",
    inputBg: "#ffffff",
    border: "#cbd5e1",
    borderSoft: "#e2e8f0",
    text: "#0f172a",
    subText: "#334155",
    mutedText: "#64748b",
    primary: "#16a34a",
    primaryHover: "#15803d",
    warning: "#d97706",
    danger: "#dc2626",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const defaultValues: ScheduleSendFormValues = {
  date: "",
  time: "",
  note: "",
};

const formatPreview = (date: string, time: string) => {
  if (!date || !time) return "Choose a date and time to preview the scheduled send.";
  return `${date} at ${time}`;
};

export default function ScheduleSendModal({
  open,
  mode = "light",
  loading = false,
  timezoneLabel = "Asia/Kolkata",
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<ScheduleSendFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleSendFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultValues,
        ...initialValues,
      });
      setErrors({});
      setSubmitting(false);
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, busy, onClose]);

  const updateField = <K extends keyof ScheduleSendFormValues>(
    key: K,
    value: ScheduleSendFormValues[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const applyPreset = (type: "todayEvening" | "tomorrowMorning" | "tomorrowEvening" | "nextMonday") => {
    const now = new Date();
    const next = new Date(now);

    if (type === "todayEvening") {
      next.setHours(18, 30, 0, 0);
    }

    if (type === "tomorrowMorning") {
      next.setDate(now.getDate() + 1);
      next.setHours(9, 0, 0, 0);
    }

    if (type === "tomorrowEvening") {
      next.setDate(now.getDate() + 1);
      next.setHours(18, 30, 0, 0);
    }

    if (type === "nextMonday") {
      const currentDay = now.getDay();
      const daysUntilMonday = ((8 - currentDay) % 7) || 7;
      next.setDate(now.getDate() + daysUntilMonday);
      next.setHours(10, 0, 0, 0);
    }

    const localDate = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(
      next.getDate()
    ).padStart(2, "0")}`;
    const localTime = `${String(next.getHours()).padStart(2, "0")}:${String(
      next.getMinutes()
    ).padStart(2, "0")}`;

    setForm((prev) => ({
      ...prev,
      date: localDate,
      time: localTime,
    }));

    setErrors((prev) => ({
      ...prev,
      date: "",
      time: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ScheduleSendFormValues, string>> = {};

    if (!form.date) {
      nextErrors.date = "Schedule date is required.";
    }

    if (!form.time) {
      nextErrors.time = "Schedule time is required.";
    }

    if (form.date && form.time) {
      const scheduledAt = new Date(`${form.date}T${form.time}`);
      if (Number.isNaN(scheduledAt.getTime())) {
        nextErrors.time = "Enter a valid date and time.";
      } else if (scheduledAt.getTime() <= Date.now()) {
        nextErrors.time = "Scheduled time must be in the future.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        date: form.date,
        time: form.time,
        note: form.note.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: theme.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1850,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 720,
    maxHeight: "92vh",
    overflow: "hidden",
    background: theme.modalBg,
    color: theme.text,
    borderRadius: 22,
    border: `1px solid ${theme.borderSoft}`,
    boxShadow: theme.shadow,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: CSSProperties = {
    padding: "20px 24px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  };

  const titleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.3,
    color: theme.text,
  };

  const subtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.mutedText,
    lineHeight: 1.6,
  };

  const closeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: 24,
    overflowY: "auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 0.9fr)",
    gap: 20,
  };

  const panelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minWidth: 0,
  };

  const sectionStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.cardBg,
    borderRadius: 18,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: theme.text,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  };

  const fullFieldStyle: CSSProperties = {
    ...fieldStyle,
    gridColumn: "1 / -1",
  };

  const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 800,
    color: theme.subText,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: 120,
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.7,
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.danger,
    fontWeight: 700,
  };

  const helperTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    lineHeight: 1.6,
  };

  const presetWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const presetButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.primary,
    borderRadius: 999,
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const previewCardStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    borderRadius: 18,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const previewLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    color: theme.mutedText,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  };

  const previewValueStyle: CSSProperties = {
    fontSize: 14,
    color: theme.text,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  const warningBoxStyle: CSSProperties = {
    border: `1px solid ${theme.mode === "dark" ? "rgba(245,158,11,0.25)" : "#fde68a"}`,
    background: theme.mode === "dark" ? "rgba(245,158,11,0.12)" : "#fffbeb",
    color: theme.warning,
    borderRadius: 16,
    padding: "12px 14px",
    fontSize: 13,
    lineHeight: 1.6,
  };

  const footerStyle: CSSProperties = {
    padding: "16px 24px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const footerMetaStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const metaPillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.subText,
    fontSize: 12,
    fontWeight: 800,
  };

  const footerButtonsStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const primaryButtonStyle: CSSProperties = {
    border: "none",
    background: theme.primary,
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 900,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.8 : 1,
  };

  return (
    <div
      style={overlayStyle}
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-send-modal-title"
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 id="schedule-send-modal-title" style={titleStyle}>
              Schedule Send
            </h2>
            <p style={subtitleStyle}>
              Choose the exact date and time for delivery, so the message lands when it matters most.
            </p>
          </div>

          <button
            type="button"
            style={closeButtonStyle}
            onClick={onClose}
            disabled={busy}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div style={bodyStyle}>
            <div style={panelStyle}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Schedule Details</h3>

                <div style={gridStyle}>
                  <div style={fieldStyle}>
                    <label htmlFor="schedule-send-date" style={labelStyle}>
                      Date
                    </label>
                    <input
                      id="schedule-send-date"
                      type="date"
                      value={form.date}
                      onChange={(event) => updateField("date", event.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.date ? <span style={errorTextStyle}>{errors.date}</span> : null}
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="schedule-send-time" style={labelStyle}>
                      Time
                    </label>
                    <input
                      id="schedule-send-time"
                      type="time"
                      value={form.time}
                      onChange={(event) => updateField("time", event.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.time ? <span style={errorTextStyle}>{errors.time}</span> : null}
                  </div>

                  <div style={fullFieldStyle}>
                    <label htmlFor="schedule-send-note" style={labelStyle}>
                      Optional Note
                    </label>
                    <textarea
                      id="schedule-send-note"
                      value={form.note}
                      onChange={(event) => updateField("note", event.target.value)}
                      placeholder="Add an internal reminder or context for this scheduled send..."
                      style={textareaStyle}
                      disabled={busy}
                    />
                    <span style={helperTextStyle}>
                      This can be used for internal context like why this send time matters.
                    </span>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Quick Presets</h3>

                <div style={presetWrapStyle}>
                  <button
                    type="button"
                    style={presetButtonStyle}
                    onClick={() => applyPreset("todayEvening")}
                    disabled={busy}
                  >
                    Today 6:30 PM
                  </button>

                  <button
                    type="button"
                    style={presetButtonStyle}
                    onClick={() => applyPreset("tomorrowMorning")}
                    disabled={busy}
                  >
                    Tomorrow 9:00 AM
                  </button>

                  <button
                    type="button"
                    style={presetButtonStyle}
                    onClick={() => applyPreset("tomorrowEvening")}
                    disabled={busy}
                  >
                    Tomorrow 6:30 PM
                  </button>

                  <button
                    type="button"
                    style={presetButtonStyle}
                    onClick={() => applyPreset("nextMonday")}
                    disabled={busy}
                  >
                    Next Monday 10:00 AM
                  </button>
                </div>
              </section>
            </div>

            <div style={panelStyle}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Schedule Preview</h3>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Scheduled For</span>
                  <div style={previewValueStyle}>
                    {formatPreview(form.date, form.time)}
                  </div>
                </div>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Timezone</span>
                  <div style={previewValueStyle}>{timezoneLabel}</div>
                </div>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Internal Note</span>
                  <div style={previewValueStyle}>
                    {form.note.trim() || "No internal note added."}
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Important</h3>

                <div style={warningBoxStyle}>
                  Make sure the scheduled time is correct for your audience and workflow.
                  Once queued, this should feel intentional, not accidental.
                </div>
              </section>
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              <span style={metaPillStyle}>{timezoneLabel}</span>
              <span style={metaPillStyle}>
                {form.date && form.time ? "Ready to Schedule" : "Waiting for Date & Time"}
              </span>
            </div>

            <div style={footerButtonsStyle}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>

              <button type="submit" style={primaryButtonStyle} disabled={busy}>
                {busy ? "Scheduling..." : "Schedule Send"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}