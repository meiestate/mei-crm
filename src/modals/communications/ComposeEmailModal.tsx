import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";
type EmailPriority = "Low" | "Normal" | "High" | "Urgent";

export type EmailTemplateOption = {
  id: string;
  name: string;
  subject?: string;
  body?: string;
};

export type ComposeEmailFormValues = {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  priority: EmailPriority;
  scheduleEnabled: boolean;
  scheduleDate: string;
  scheduleTime: string;
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
  danger: string;
  success: string;
  warning: string;
  shadow: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  title?: string;
  loading?: boolean;
  initialValues?: Partial<ComposeEmailFormValues>;
  templates?: EmailTemplateOption[];
  attachmentCount?: number;
  defaultExpandedCcBcc?: boolean;
  onClose: () => void;
  onSubmit: (values: ComposeEmailFormValues) => void | Promise<void>;
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
      danger: "#ef4444",
      success: "#10b981",
      warning: "#f59e0b",
      shadow: "0 24px 64px rgba(0,0,0,0.48)",
    };
  }

  return {
    mode: "light",
    overlay: "rgba(15, 23, 42, 0.46)",
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
    warning: "#d97706",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const defaultValues: ComposeEmailFormValues = {
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  body: "",
  priority: "Normal",
  scheduleEnabled: false,
  scheduleDate: "",
  scheduleTime: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const validateEmailList = (value: string): boolean => {
  if (!value.trim()) return true;

  const emails = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return emails.every((email) => emailRegex.test(email));
};

export default function ComposeEmailModal({
  open,
  mode = "light",
  title = "Compose Email",
  loading = false,
  initialValues,
  templates = [],
  attachmentCount = 0,
  defaultExpandedCcBcc = false,
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<ComposeEmailFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ComposeEmailFormValues, string>>>({});
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(defaultExpandedCcBcc);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultValues,
        ...initialValues,
      });
      setErrors({});
      setSelectedTemplateId("");
      setShowCcBcc(defaultExpandedCcBcc);
      setSubmitting(false);
    }
  }, [open, initialValues, defaultExpandedCcBcc]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, submitting, onClose]);

  const busy = loading || submitting;

  const updateField = <K extends keyof ComposeEmailFormValues>(
    key: K,
    value: ComposeEmailFormValues[K]
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

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    const selected = templates.find((template) => template.id === templateId);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      subject: selected.subject ?? prev.subject,
      body: selected.body ?? prev.body,
    }));

    setErrors((prev) => ({
      ...prev,
      subject: "",
      body: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ComposeEmailFormValues, string>> = {};

    if (!form.to.trim()) {
      nextErrors.to = "Recipient email is required.";
    } else if (!validateEmailList(form.to)) {
      nextErrors.to = "Enter valid recipient emails separated by commas.";
    }

    if (form.cc.trim() && !validateEmailList(form.cc)) {
      nextErrors.cc = "Enter valid CC emails separated by commas.";
    }

    if (form.bcc.trim() && !validateEmailList(form.bcc)) {
      nextErrors.bcc = "Enter valid BCC emails separated by commas.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }

    if (!form.body.trim()) {
      nextErrors.body = "Email body is required.";
    }

    if (form.scheduleEnabled) {
      if (!form.scheduleDate) {
        nextErrors.scheduleDate = "Schedule date is required.";
      }

      if (!form.scheduleTime) {
        nextErrors.scheduleTime = "Schedule time is required.";
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
        ...form,
        to: form.to.trim(),
        cc: form.cc.trim(),
        bcc: form.bcc.trim(),
        subject: form.subject.trim(),
        body: form.body.trim(),
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
    zIndex: 1400,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 920,
    maxHeight: "94vh",
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  };

  const titleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: -0.3,
    color: theme.text,
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
    opacity: busy ? 0.7 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };

  const topToolbarStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 14,
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

  const bodyTextAreaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: 260,
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.7,
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.danger,
    marginTop: -2,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const toggleButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.subText,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
  };

  const pillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: theme.cardBg,
    border: `1px solid ${theme.borderSoft}`,
    fontSize: 12,
    fontWeight: 700,
    color: theme.subText,
  };

  const scheduleWrapStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.cardBg,
    borderRadius: 18,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const checkboxLabelStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 700,
    color: theme.text,
    cursor: busy ? "not-allowed" : "pointer",
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
          <div style={titleWrapStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>
              Craft a clean, professional message and keep every conversation in motion.
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
            <div style={topToolbarStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="email-template">
                  Template
                </label>
                <select
                  id="email-template"
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  style={inputStyle}
                  disabled={busy}
                >
                  <option value="">Select template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="email-priority">
                  Priority
                </label>
                <select
                  id="email-priority"
                  value={form.priority}
                  onChange={(e) =>
                    updateField("priority", e.target.value as EmailPriority)
                  }
                  style={inputStyle}
                  disabled={busy}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={rowStyle}>
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => setShowCcBcc((prev) => !prev)}
                disabled={busy}
              >
                {showCcBcc ? "Hide CC / BCC" : "Add CC / BCC"}
              </button>

              <span style={pillStyle}>Attachments: {attachmentCount}</span>
              <span style={pillStyle}>Priority: {form.priority}</span>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="email-to">
                To
              </label>
              <input
                id="email-to"
                type="text"
                placeholder="recipient@example.com, second@example.com"
                value={form.to}
                onChange={(e) => updateField("to", e.target.value)}
                style={inputStyle}
                disabled={busy}
              />
              {errors.to ? <span style={errorTextStyle}>{errors.to}</span> : null}
            </div>

            {showCcBcc ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 14,
                }}
              >
                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="email-cc">
                    CC
                  </label>
                  <input
                    id="email-cc"
                    type="text"
                    placeholder="cc@example.com"
                    value={form.cc}
                    onChange={(e) => updateField("cc", e.target.value)}
                    style={inputStyle}
                    disabled={busy}
                  />
                  {errors.cc ? <span style={errorTextStyle}>{errors.cc}</span> : null}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="email-bcc">
                    BCC
                  </label>
                  <input
                    id="email-bcc"
                    type="text"
                    placeholder="bcc@example.com"
                    value={form.bcc}
                    onChange={(e) => updateField("bcc", e.target.value)}
                    style={inputStyle}
                    disabled={busy}
                  />
                  {errors.bcc ? <span style={errorTextStyle}>{errors.bcc}</span> : null}
                </div>
              </div>
            ) : null}

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="email-subject">
                Subject
              </label>
              <input
                id="email-subject"
                type="text"
                placeholder="Enter email subject"
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                style={inputStyle}
                disabled={busy}
              />
              {errors.subject ? (
                <span style={errorTextStyle}>{errors.subject}</span>
              ) : null}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="email-body">
                Message
              </label>
              <textarea
                id="email-body"
                placeholder="Write your email here..."
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                style={bodyTextAreaStyle}
                disabled={busy}
              />
              {errors.body ? <span style={errorTextStyle}>{errors.body}</span> : null}
            </div>

            <div style={scheduleWrapStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={form.scheduleEnabled}
                  onChange={(e) => updateField("scheduleEnabled", e.target.checked)}
                  disabled={busy}
                />
                Schedule send
              </label>

              {form.scheduleEnabled ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="schedule-date">
                      Schedule Date
                    </label>
                    <input
                      id="schedule-date"
                      type="date"
                      value={form.scheduleDate}
                      onChange={(e) => updateField("scheduleDate", e.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.scheduleDate ? (
                      <span style={errorTextStyle}>{errors.scheduleDate}</span>
                    ) : null}
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle} htmlFor="schedule-time">
                      Schedule Time
                    </label>
                    <input
                      id="schedule-time"
                      type="time"
                      value={form.scheduleTime}
                      onChange={(e) => updateField("scheduleTime", e.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.scheduleTime ? (
                      <span style={errorTextStyle}>{errors.scheduleTime}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              <span style={pillStyle}>{attachmentCount} file(s) attached</span>
              {form.scheduleEnabled ? <span style={pillStyle}>Scheduled</span> : <span style={pillStyle}>Send now</span>}
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
                {busy
                  ? "Sending..."
                  : form.scheduleEnabled
                  ? "Schedule Email"
                  : "Send Email"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}