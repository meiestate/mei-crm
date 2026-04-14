import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type FollowUpPriority = "Low" | "Medium" | "High" | "Urgent";
type FollowUpStatus = "Pending" | "Scheduled" | "Completed" | "Cancelled";
type FollowUpEntityType = "Lead" | "Contact" | "Deal" | "General";

export type FollowUpFormValues = {
  title: string;
  entityType: FollowUpEntityType;
  entityName: string;
  followUpDate: string;
  followUpTime: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  notes: string;
};

type ThemeMode = "light" | "dark";

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
  danger: string;
  success: string;
  shadow: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  title?: string;
  initialValues?: Partial<FollowUpFormValues>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: FollowUpFormValues) => void | Promise<void>;
};

const getTheme = (mode: ThemeMode = "light"): ThemePalette => {
  if (mode === "dark") {
    return {
      mode: "dark",
      overlay: "rgba(2, 6, 23, 0.76)",
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
      danger: "#ef4444",
      success: "#10b981",
      shadow: "0 24px 64px rgba(0,0,0,0.45)",
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
    danger: "#dc2626",
    success: "#059669",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const defaultValues: FollowUpFormValues = {
  title: "",
  entityType: "Lead",
  entityName: "",
  followUpDate: "",
  followUpTime: "",
  priority: "Medium",
  status: "Pending",
  reminderEnabled: true,
  reminderMinutesBefore: 30,
  notes: "",
};

export default function AddFollowUpModal({
  open,
  mode = "light",
  title = "Add Follow-Up",
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<FollowUpFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FollowUpFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

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
      if (event.key === "Escape" && !submitting && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, submitting, loading]);

  const updateField = <K extends keyof FollowUpFormValues>(key: K, value: FollowUpFormValues[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FollowUpFormValues, string>> = {};

    if (!form.title.trim()) {
      nextErrors.title = "Follow-up title is required.";
    }

    if (!form.entityName.trim() && form.entityType !== "General") {
      nextErrors.entityName = "Entity name is required.";
    }

    if (!form.followUpDate) {
      nextErrors.followUpDate = "Follow-up date is required.";
    }

    if (!form.followUpTime) {
      nextErrors.followUpTime = "Follow-up time is required.";
    }

    if (form.reminderEnabled) {
      if (
        Number.isNaN(Number(form.reminderMinutesBefore)) ||
        Number(form.reminderMinutesBefore) < 0
      ) {
        nextErrors.reminderMinutesBefore = "Reminder must be 0 or more minutes.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        title: form.title.trim(),
        entityName: form.entityType === "General" ? "" : form.entityName.trim(),
        notes: form.notes.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const busy = submitting || loading;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: theme.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1200,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 760,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "20px 24px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
  };

  const headerTitleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: theme.text,
    letterSpacing: -0.3,
  };

  const subtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.mutedText,
  };

  const closeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.65 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: 24,
    overflowY: "auto",
  };

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  };

  const labelStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
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

  const textAreaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: 110,
    resize: "vertical",
    fontFamily: "inherit",
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.danger,
    marginTop: -2,
  };

  const reminderRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    padding: 14,
    background: theme.cardBg,
    border: `1px solid ${theme.borderSoft}`,
    borderRadius: 16,
  };

  const checkboxLabelStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 600,
    color: theme.text,
    cursor: "pointer",
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: "16px 24px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    background: theme.modalBg,
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 700,
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
    fontWeight: 800,
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
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div style={headerStyle}>
          <div style={headerTitleWrapStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>
              Schedule the next touchpoint and keep your pipeline moving.
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

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={bodyStyle}>
            <div style={gridStyle}>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle} htmlFor="followup-title">
                  Follow-Up Title
                </label>
                <input
                  id="followup-title"
                  type="text"
                  placeholder="Enter follow-up title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  style={inputStyle}
                  disabled={busy}
                />
                {errors.title ? <span style={errorTextStyle}>{errors.title}</span> : null}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="entity-type">
                  Related To
                </label>
                <select
                  id="entity-type"
                  value={form.entityType}
                  onChange={(e) =>
                    updateField("entityType", e.target.value as FollowUpEntityType)
                  }
                  style={inputStyle}
                  disabled={busy}
                >
                  <option value="Lead">Lead</option>
                  <option value="Contact">Contact</option>
                  <option value="Deal">Deal</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="entity-name">
                  {form.entityType === "General" ? "Reference Name (Optional)" : `${form.entityType} Name`}
                </label>
                <input
                  id="entity-name"
                  type="text"
                  placeholder={
                    form.entityType === "General"
                      ? "Optional reference"
                      : `Enter ${form.entityType.toLowerCase()} name`
                  }
                  value={form.entityName}
                  onChange={(e) => updateField("entityName", e.target.value)}
                  style={inputStyle}
                  disabled={busy || form.entityType === "General"}
                />
                {errors.entityName ? (
                  <span style={errorTextStyle}>{errors.entityName}</span>
                ) : null}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="followup-date">
                  Follow-Up Date
                </label>
                <input
                  id="followup-date"
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => updateField("followUpDate", e.target.value)}
                  style={inputStyle}
                  disabled={busy}
                />
                {errors.followUpDate ? (
                  <span style={errorTextStyle}>{errors.followUpDate}</span>
                ) : null}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="followup-time">
                  Follow-Up Time
                </label>
                <input
                  id="followup-time"
                  type="time"
                  value={form.followUpTime}
                  onChange={(e) => updateField("followUpTime", e.target.value)}
                  style={inputStyle}
                  disabled={busy}
                />
                {errors.followUpTime ? (
                  <span style={errorTextStyle}>{errors.followUpTime}</span>
                ) : null}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(e) =>
                    updateField("priority", e.target.value as FollowUpPriority)
                  }
                  style={inputStyle}
                  disabled={busy}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as FollowUpStatus)
                  }
                  style={inputStyle}
                  disabled={busy}
                >
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Reminder</label>

                <div style={reminderRowStyle}>
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={form.reminderEnabled}
                      onChange={(e) => updateField("reminderEnabled", e.target.checked)}
                      disabled={busy}
                    />
                    Enable reminder before follow-up
                  </label>

                  {form.reminderEnabled ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="number"
                        min={0}
                        step={5}
                        value={form.reminderMinutesBefore}
                        onChange={(e) =>
                          updateField("reminderMinutesBefore", Number(e.target.value))
                        }
                        style={{
                          ...inputStyle,
                          width: 110,
                          padding: "10px 12px",
                        }}
                        disabled={busy}
                      />
                      <span style={{ fontSize: 13, color: theme.subText }}>
                        minutes before
                      </span>
                    </div>
                  ) : null}
                </div>

                {errors.reminderMinutesBefore ? (
                  <span style={errorTextStyle}>{errors.reminderMinutesBefore}</span>
                ) : null}
              </div>

              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle} htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Add conversation notes, next action points, or context..."
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  style={textAreaStyle}
                  disabled={busy}
                />
              </div>
            </div>
          </div>

          <div style={footerStyle}>
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button type="submit" style={primaryButtonStyle} disabled={busy}>
              {busy ? "Saving..." : "Save Follow-Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}