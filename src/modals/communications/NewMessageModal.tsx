import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";
type MessageChannel = "Email" | "SMS" | "WhatsApp" | "Internal";
type MessagePriority = "Low" | "Normal" | "High" | "Urgent";

export type NewMessageTemplateOption = {
  id: string;
  name: string;
  channel?: MessageChannel;
  subject?: string;
  body?: string;
};

export type NewMessageFormValues = {
  channel: MessageChannel;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  body: string;
  priority: MessagePriority;
  scheduleEnabled: boolean;
  scheduleDate: string;
  scheduleTime: string;
  internalNoteOnly: boolean;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  attachmentCount?: number;
  templates?: NewMessageTemplateOption[];
  initialValues?: Partial<NewMessageFormValues>;
  onClose: () => void;
  onSubmit: (values: NewMessageFormValues) => void | Promise<void>;
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
  success: string;
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
      success: "#10b981",
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
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const defaultValues: NewMessageFormValues = {
  channel: "Email",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  subject: "",
  body: "",
  priority: "Normal",
  scheduleEnabled: false,
  scheduleDate: "",
  scheduleTime: "",
  internalNoteOnly: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export default function NewMessageModal({
  open,
  mode = "light",
  loading = false,
  title = "New Message",
  attachmentCount = 0,
  templates = [],
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<NewMessageFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof NewMessageFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultValues,
        ...initialValues,
      });
      setSelectedTemplateId("");
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

  const updateField = <K extends keyof NewMessageFormValues>(
    key: K,
    value: NewMessageFormValues[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "channel") {
        next.internalNoteOnly = value === "Internal";
        if (value !== "Email") {
          next.subject = prev.subject;
        }
      }

      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const filteredTemplates = templates.filter(
    (template) => !template.channel || template.channel === form.channel
  );

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
    const nextErrors: Partial<Record<keyof NewMessageFormValues, string>> = {};

    if (!form.recipientName.trim() && form.channel !== "Internal") {
      nextErrors.recipientName = "Recipient name is required.";
    }

    if (form.channel === "Email") {
      if (!form.recipientEmail.trim()) {
        nextErrors.recipientEmail = "Recipient email is required for email messages.";
      } else if (!emailRegex.test(form.recipientEmail.trim())) {
        nextErrors.recipientEmail = "Enter a valid email address.";
      }

      if (!form.subject.trim()) {
        nextErrors.subject = "Subject is required for email messages.";
      }
    }

    if (form.channel === "SMS" || form.channel === "WhatsApp") {
      if (!form.recipientPhone.trim()) {
        nextErrors.recipientPhone = "Recipient phone is required for this channel.";
      } else if (!phoneRegex.test(form.recipientPhone.trim())) {
        nextErrors.recipientPhone = "Enter a valid phone number.";
      }
    }

    if (!form.body.trim()) {
      nextErrors.body = "Message body is required.";
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
        recipientName: form.recipientName.trim(),
        recipientEmail: form.recipientEmail.trim(),
        recipientPhone: form.recipientPhone.trim(),
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
    zIndex: 1800,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 980,
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
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
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

  const textAreaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: 220,
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.7,
  };

  const helperTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    lineHeight: 1.6,
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: theme.danger,
    fontWeight: 700,
  };

  const pillRowStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

  const pillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.subText,
    fontSize: 12,
    fontWeight: 800,
  };

  const checkWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const checkboxLabelStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    fontWeight: 700,
    color: theme.text,
    cursor: busy ? "not-allowed" : "pointer",
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
        aria-labelledby="new-message-modal-title"
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 id="new-message-modal-title" style={titleStyle}>
              {title}
            </h2>
            <p style={subtitleStyle}>
              Start a fresh conversation, choose the right channel, and send with cleaner control.
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
                <h3 style={sectionTitleStyle}>Message Setup</h3>

                <div style={gridStyle}>
                  <div style={fieldStyle}>
                    <label htmlFor="new-message-channel" style={labelStyle}>
                      Channel
                    </label>
                    <select
                      id="new-message-channel"
                      value={form.channel}
                      onChange={(event) =>
                        updateField("channel", event.target.value as MessageChannel)
                      }
                      style={inputStyle}
                      disabled={busy}
                    >
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Internal">Internal</option>
                    </select>
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="new-message-priority" style={labelStyle}>
                      Priority
                    </label>
                    <select
                      id="new-message-priority"
                      value={form.priority}
                      onChange={(event) =>
                        updateField("priority", event.target.value as MessagePriority)
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

                  <div style={fieldStyle}>
                    <label htmlFor="new-message-template" style={labelStyle}>
                      Template
                    </label>
                    <select
                      id="new-message-template"
                      value={selectedTemplateId}
                      onChange={(event) => handleTemplateChange(event.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    >
                      <option value="">Select template</option>
                      {filteredTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="new-message-recipient-name" style={labelStyle}>
                      Recipient Name
                    </label>
                    <input
                      id="new-message-recipient-name"
                      type="text"
                      value={form.recipientName}
                      onChange={(event) =>
                        updateField("recipientName", event.target.value)
                      }
                      placeholder="Enter recipient name"
                      style={inputStyle}
                      disabled={busy || form.channel === "Internal"}
                    />
                    {errors.recipientName ? (
                      <span style={errorTextStyle}>{errors.recipientName}</span>
                    ) : null}
                  </div>

                  {form.channel === "Email" ? (
                    <div style={fieldStyle}>
                      <label htmlFor="new-message-recipient-email" style={labelStyle}>
                        Recipient Email
                      </label>
                      <input
                        id="new-message-recipient-email"
                        type="email"
                        value={form.recipientEmail}
                        onChange={(event) =>
                          updateField("recipientEmail", event.target.value)
                        }
                        placeholder="recipient@example.com"
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.recipientEmail ? (
                        <span style={errorTextStyle}>{errors.recipientEmail}</span>
                      ) : null}
                    </div>
                  ) : null}

                  {form.channel === "SMS" || form.channel === "WhatsApp" ? (
                    <div style={fieldStyle}>
                      <label htmlFor="new-message-recipient-phone" style={labelStyle}>
                        Recipient Phone
                      </label>
                      <input
                        id="new-message-recipient-phone"
                        type="text"
                        value={form.recipientPhone}
                        onChange={(event) =>
                          updateField("recipientPhone", event.target.value)
                        }
                        placeholder="+91 9876543210"
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.recipientPhone ? (
                        <span style={errorTextStyle}>{errors.recipientPhone}</span>
                      ) : null}
                    </div>
                  ) : null}

                  {form.channel === "Email" ? (
                    <div style={fullFieldStyle}>
                      <label htmlFor="new-message-subject" style={labelStyle}>
                        Subject
                      </label>
                      <input
                        id="new-message-subject"
                        type="text"
                        value={form.subject}
                        onChange={(event) => updateField("subject", event.target.value)}
                        placeholder="Enter conversation subject"
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.subject ? (
                        <span style={errorTextStyle}>{errors.subject}</span>
                      ) : null}
                    </div>
                  ) : null}

                  <div style={fullFieldStyle}>
                    <label htmlFor="new-message-body" style={labelStyle}>
                      Message
                    </label>
                    <textarea
                      id="new-message-body"
                      value={form.body}
                      onChange={(event) => updateField("body", event.target.value)}
                      placeholder="Write your message here..."
                      style={textAreaStyle}
                      disabled={busy}
                    />
                    <span style={helperTextStyle}>
                      Keep the message clear, direct, and aligned with the selected channel.
                    </span>
                    {errors.body ? <span style={errorTextStyle}>{errors.body}</span> : null}
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Delivery Options</h3>

                <div style={checkWrapStyle}>
                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={form.scheduleEnabled}
                      onChange={(event) =>
                        updateField("scheduleEnabled", event.target.checked)
                      }
                      disabled={busy}
                    />
                    Schedule send
                  </label>

                  {form.channel === "Internal" ? (
                    <label style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        checked={form.internalNoteOnly}
                        onChange={(event) =>
                          updateField("internalNoteOnly", event.target.checked)
                        }
                        disabled={busy}
                      />
                      Mark as internal note only
                    </label>
                  ) : null}
                </div>

                {form.scheduleEnabled ? (
                  <div style={gridStyle}>
                    <div style={fieldStyle}>
                      <label htmlFor="new-message-schedule-date" style={labelStyle}>
                        Schedule Date
                      </label>
                      <input
                        id="new-message-schedule-date"
                        type="date"
                        value={form.scheduleDate}
                        onChange={(event) =>
                          updateField("scheduleDate", event.target.value)
                        }
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.scheduleDate ? (
                        <span style={errorTextStyle}>{errors.scheduleDate}</span>
                      ) : null}
                    </div>

                    <div style={fieldStyle}>
                      <label htmlFor="new-message-schedule-time" style={labelStyle}>
                        Schedule Time
                      </label>
                      <input
                        id="new-message-schedule-time"
                        type="time"
                        value={form.scheduleTime}
                        onChange={(event) =>
                          updateField("scheduleTime", event.target.value)
                        }
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.scheduleTime ? (
                        <span style={errorTextStyle}>{errors.scheduleTime}</span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </section>
            </div>

            <div style={panelStyle}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Live Summary</h3>

                <div style={pillRowStyle}>
                  <span style={pillStyle}>{form.channel}</span>
                  <span style={pillStyle}>{form.priority}</span>
                  <span style={pillStyle}>{attachmentCount} attachment(s)</span>
                  <span style={pillStyle}>
                    {form.scheduleEnabled ? "Scheduled" : "Send Now"}
                  </span>
                </div>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Recipient</span>
                  <div style={previewValueStyle}>
                    {form.channel === "Email"
                      ? form.recipientEmail || form.recipientName || "No recipient selected yet"
                      : form.channel === "SMS" || form.channel === "WhatsApp"
                      ? form.recipientPhone || form.recipientName || "No recipient selected yet"
                      : form.recipientName || "Internal conversation"}
                  </div>
                </div>

                {form.channel === "Email" ? (
                  <div style={previewCardStyle}>
                    <span style={previewLabelStyle}>Subject</span>
                    <div style={previewValueStyle}>
                      {form.subject || "No subject yet"}
                    </div>
                  </div>
                ) : null}

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Message Preview</span>
                  <div style={previewValueStyle}>
                    {form.body || "Your draft message preview will appear here."}
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Quick Notes</h3>
                <span style={helperTextStyle}>
                  Email works best for detailed updates. SMS and WhatsApp should stay compact and action-focused.
                </span>
                <span style={helperTextStyle}>
                  Internal messages are ideal for team coordination, note sharing, and quiet operational context.
                </span>
              </section>
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              <span style={pillStyle}>{attachmentCount} file(s)</span>
              <span style={pillStyle}>{form.channel}</span>
              <span style={pillStyle}>{form.priority}</span>
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
                  ? "Processing..."
                  : form.scheduleEnabled
                  ? "Schedule Message"
                  : "Send Message"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}