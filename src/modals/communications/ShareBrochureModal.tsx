import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";
type ShareChannel = "Email" | "WhatsApp" | "SMS";

export type BrochureOption = {
  id: string;
  title: string;
  projectName?: string;
  fileName?: string;
  fileSizeLabel?: string;
  pagesLabel?: string;
  format?: "PDF" | "DOC" | "PPT" | "IMAGE";
};

export type BrochureMessageTemplate = {
  id: string;
  name: string;
  channel?: ShareChannel;
  subject?: string;
  body?: string;
};

export type ShareBrochureFormValues = {
  channel: ShareChannel;
  brochureId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  message: string;
  scheduleEnabled: boolean;
  scheduleDate: string;
  scheduleTime: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  brochures?: BrochureOption[];
  templates?: BrochureMessageTemplate[];
  initialValues?: Partial<ShareBrochureFormValues>;
  title?: string;
  onClose: () => void;
  onSubmit: (values: ShareBrochureFormValues) => void | Promise<void>;
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

const defaultValues: ShareBrochureFormValues = {
  channel: "Email",
  brochureId: "",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  subject: "",
  message: "",
  scheduleEnabled: false,
  scheduleDate: "",
  scheduleTime: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export default function ShareBrochureModal({
  open,
  mode = "light",
  loading = false,
  brochures = [],
  templates = [],
  initialValues,
  title = "Share Brochure",
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<ShareBrochureFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ShareBrochureFormValues, string>>>(
    {}
  );
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

  const filteredTemplates = templates.filter(
    (template) => !template.channel || template.channel === form.channel
  );

  const selectedBrochure = brochures.find((item) => item.id === form.brochureId);

  const updateField = <K extends keyof ShareBrochureFormValues>(
    key: K,
    value: ShareBrochureFormValues[K]
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
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;

    setForm((prev) => ({
      ...prev,
      subject: template.subject ?? prev.subject,
      message: template.body ?? prev.message,
    }));

    setErrors((prev) => ({
      ...prev,
      subject: "",
      message: "",
    }));
  };

  const applyQuickMessage = (type: "formal" | "warm" | "short") => {
    const brochureName = selectedBrochure?.title || "the brochure";

    const messages = {
      formal: `Hello ${form.recipientName || ""},

Please find attached ${brochureName} for your review. This contains the key project details, highlights, and important information.

Please let me know if you would like a call or site visit.

Regards,
MEI CRM Team`,
      warm: `Hi ${form.recipientName || ""},

Sharing ${brochureName} with you. Have a look when free.

Happy to explain the details and help with the next steps.`,
      short: `Hi ${form.recipientName || ""}, sharing ${brochureName} here. Let me know if you'd like more details or a quick call.`,
    };

    setForm((prev) => ({
      ...prev,
      message: messages[type].trim(),
    }));

    setErrors((prev) => ({
      ...prev,
      message: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ShareBrochureFormValues, string>> = {};

    if (!form.brochureId) {
      nextErrors.brochureId = "Please select a brochure.";
    }

    if (!form.recipientName.trim()) {
      nextErrors.recipientName = "Recipient name is required.";
    }

    if (form.channel === "Email") {
      if (!form.recipientEmail.trim()) {
        nextErrors.recipientEmail = "Recipient email is required.";
      } else if (!emailRegex.test(form.recipientEmail.trim())) {
        nextErrors.recipientEmail = "Enter a valid email address.";
      }

      if (!form.subject.trim()) {
        nextErrors.subject = "Subject is required for email sharing.";
      }
    }

    if (form.channel === "WhatsApp" || form.channel === "SMS") {
      if (!form.recipientPhone.trim()) {
        nextErrors.recipientPhone = "Recipient phone is required.";
      } else if (!phoneRegex.test(form.recipientPhone.trim())) {
        nextErrors.recipientPhone = "Enter a valid phone number.";
      }
    }

    if (!form.message.trim()) {
      nextErrors.message = "Message is required.";
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
        message: form.message.trim(),
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
    zIndex: 1900,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 1020,
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
    minHeight: 190,
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

  const checkboxLabelStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    fontWeight: 700,
    color: theme.text,
    cursor: busy ? "not-allowed" : "pointer",
  };

  const chipWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const chipButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.primary,
    borderRadius: 999,
    padding: "8px 12px",
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

  const badgeRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const badgeStyle: CSSProperties = {
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
        aria-labelledby="share-brochure-modal-title"
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 id="share-brochure-modal-title" style={titleStyle}>
              {title}
            </h2>
            <p style={subtitleStyle}>
              Share project brochures with the right message, the right channel, and a cleaner sales flow.
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
                <h3 style={sectionTitleStyle}>Brochure & Delivery Setup</h3>

                <div style={gridStyle}>
                  <div style={fieldStyle}>
                    <label htmlFor="share-brochure-channel" style={labelStyle}>
                      Channel
                    </label>
                    <select
                      id="share-brochure-channel"
                      value={form.channel}
                      onChange={(event) =>
                        updateField("channel", event.target.value as ShareChannel)
                      }
                      style={inputStyle}
                      disabled={busy}
                    >
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="SMS">SMS</option>
                    </select>
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="share-brochure-select" style={labelStyle}>
                      Brochure
                    </label>
                    <select
                      id="share-brochure-select"
                      value={form.brochureId}
                      onChange={(event) => updateField("brochureId", event.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    >
                      <option value="">Select brochure</option>
                      {brochures.map((brochure) => (
                        <option key={brochure.id} value={brochure.id}>
                          {brochure.title}
                        </option>
                      ))}
                    </select>
                    {errors.brochureId ? (
                      <span style={errorTextStyle}>{errors.brochureId}</span>
                    ) : null}
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="share-brochure-template" style={labelStyle}>
                      Message Template
                    </label>
                    <select
                      id="share-brochure-template"
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
                    <label htmlFor="share-brochure-recipient-name" style={labelStyle}>
                      Recipient Name
                    </label>
                    <input
                      id="share-brochure-recipient-name"
                      type="text"
                      value={form.recipientName}
                      onChange={(event) =>
                        updateField("recipientName", event.target.value)
                      }
                      placeholder="Enter recipient name"
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.recipientName ? (
                      <span style={errorTextStyle}>{errors.recipientName}</span>
                    ) : null}
                  </div>

                  {form.channel === "Email" ? (
                    <div style={fieldStyle}>
                      <label htmlFor="share-brochure-recipient-email" style={labelStyle}>
                        Recipient Email
                      </label>
                      <input
                        id="share-brochure-recipient-email"
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

                  {form.channel === "WhatsApp" || form.channel === "SMS" ? (
                    <div style={fieldStyle}>
                      <label htmlFor="share-brochure-recipient-phone" style={labelStyle}>
                        Recipient Phone
                      </label>
                      <input
                        id="share-brochure-recipient-phone"
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
                      <label htmlFor="share-brochure-subject" style={labelStyle}>
                        Subject
                      </label>
                      <input
                        id="share-brochure-subject"
                        type="text"
                        value={form.subject}
                        onChange={(event) => updateField("subject", event.target.value)}
                        placeholder="Enter email subject"
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.subject ? (
                        <span style={errorTextStyle}>{errors.subject}</span>
                      ) : null}
                    </div>
                  ) : null}

                  <div style={fullFieldStyle}>
                    <label htmlFor="share-brochure-message" style={labelStyle}>
                      Message
                    </label>
                    <textarea
                      id="share-brochure-message"
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      placeholder="Write your brochure sharing message..."
                      style={textAreaStyle}
                      disabled={busy}
                    />
                    <span style={helperTextStyle}>
                      Keep it useful, human, and easy to respond to.
                    </span>
                    {errors.message ? (
                      <span style={errorTextStyle}>{errors.message}</span>
                    ) : null}
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Quick Message Styles</h3>
                <div style={chipWrapStyle}>
                  <button
                    type="button"
                    style={chipButtonStyle}
                    onClick={() => applyQuickMessage("formal")}
                    disabled={busy}
                  >
                    Formal
                  </button>
                  <button
                    type="button"
                    style={chipButtonStyle}
                    onClick={() => applyQuickMessage("warm")}
                    disabled={busy}
                  >
                    Warm
                  </button>
                  <button
                    type="button"
                    style={chipButtonStyle}
                    onClick={() => applyQuickMessage("short")}
                    disabled={busy}
                  >
                    Short
                  </button>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Schedule Option</h3>

                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.scheduleEnabled}
                    onChange={(event) =>
                      updateField("scheduleEnabled", event.target.checked)
                    }
                    disabled={busy}
                  />
                  Schedule brochure send
                </label>

                {form.scheduleEnabled ? (
                  <div style={gridStyle}>
                    <div style={fieldStyle}>
                      <label htmlFor="share-brochure-schedule-date" style={labelStyle}>
                        Date
                      </label>
                      <input
                        id="share-brochure-schedule-date"
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
                      <label htmlFor="share-brochure-schedule-time" style={labelStyle}>
                        Time
                      </label>
                      <input
                        id="share-brochure-schedule-time"
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
                <h3 style={sectionTitleStyle}>Brochure Preview</h3>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Selected Brochure</span>
                  <div style={previewValueStyle}>
                    {selectedBrochure?.title || "No brochure selected"}
                  </div>
                </div>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Project</span>
                  <div style={previewValueStyle}>
                    {selectedBrochure?.projectName || "Not specified"}
                  </div>
                </div>

                <div style={badgeRowStyle}>
                  <span style={badgeStyle}>
                    {selectedBrochure?.format || "File"}
                  </span>
                  <span style={badgeStyle}>
                    {selectedBrochure?.fileSizeLabel || "—"}
                  </span>
                  <span style={badgeStyle}>
                    {selectedBrochure?.pagesLabel || "—"}
                  </span>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Delivery Preview</h3>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Recipient</span>
                  <div style={previewValueStyle}>
                    {form.recipientName ||
                      form.recipientEmail ||
                      form.recipientPhone ||
                      "No recipient entered"}
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
                    {form.message || "Your brochure message preview will appear here."}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              <span style={badgeStyle}>{form.channel}</span>
              <span style={badgeStyle}>
                {form.scheduleEnabled ? "Scheduled" : "Send Now"}
              </span>
              <span style={badgeStyle}>
                {selectedBrochure?.format || "Brochure"}
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
                {busy
                  ? "Processing..."
                  : form.scheduleEnabled
                  ? "Schedule Share"
                  : "Share Brochure"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}