import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type ThemeMode = "light" | "dark";
type TemplateChannel = "Email" | "SMS" | "WhatsApp" | "Internal";
type TemplateStatus = "Active" | "Inactive";

export type MessageTemplateFormValues = {
  name: string;
  category: string;
  channel: TemplateChannel;
  subject: string;
  body: string;
  variables: string[];
  status: TemplateStatus;
};

export type MessageTemplateInitialData = Partial<MessageTemplateFormValues> & {
  id?: string;
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  initialValues?: MessageTemplateInitialData;
  categories?: string[];
  variableSuggestions?: string[];
  onClose: () => void;
  onSubmit: (values: MessageTemplateFormValues) => void | Promise<void>;
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
  success: string;
  danger: string;
  warning: string;
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
      success: "#10b981",
      danger: "#ef4444",
      warning: "#f59e0b",
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
    success: "#059669",
    danger: "#dc2626",
    warning: "#d97706",
    shadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
  };
};

const defaultValues: MessageTemplateFormValues = {
  name: "",
  category: "",
  channel: "Email",
  subject: "",
  body: "",
  variables: [],
  status: "Active",
};

const extractVariablesFromText = (value: string): string[] => {
  const matches = value.match(/\{\{(.*?)\}\}/g) ?? [];
  const normalized = matches
    .map((match) => match.replace(/\{\{|\}\}/g, "").trim())
    .filter(Boolean);

  return Array.from(new Set(normalized));
};

export default function MessageTemplateModal({
  open,
  mode = "light",
  loading = false,
  initialValues,
  categories = ["General", "Welcome", "Follow-Up", "Reminder", "Promotion", "Support"],
  variableSuggestions = ["customerName", "agentName", "companyName", "date", "time", "propertyName"],
  onClose,
  onSubmit,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  const isEditMode = Boolean(initialValues?.id);

  const [form, setForm] = useState<MessageTemplateFormValues>({
    ...defaultValues,
    ...initialValues,
    variables: initialValues?.variables ?? [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MessageTemplateFormValues, string>>>({});
  const [newVariable, setNewVariable] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultValues,
        ...initialValues,
        variables: initialValues?.variables ?? [],
      });
      setErrors({});
      setNewVariable("");
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

  const updateField = <K extends keyof MessageTemplateFormValues>(
    key: K,
    value: MessageTemplateFormValues[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "subject" || key === "body") {
        const extracted = Array.from(
          new Set([
            ...extractVariablesFromText(next.subject),
            ...extractVariablesFromText(next.body),
            ...next.variables,
          ])
        );

        next.variables = extracted;
      }

      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const addVariable = (rawValue: string) => {
    const value = rawValue.trim().replace(/\{|\}/g, "");
    if (!value) return;

    setForm((prev) => ({
      ...prev,
      variables: prev.variables.includes(value)
        ? prev.variables
        : [...prev.variables, value],
    }));

    setNewVariable("");
  };

  const removeVariable = (value: string) => {
    setForm((prev) => ({
      ...prev,
      variables: prev.variables.filter((item) => item !== value),
    }));
  };

  const insertVariableIntoBody = (value: string) => {
    const placeholder = `{{${value}}}`;
    setForm((prev) => ({
      ...prev,
      body: prev.body ? `${prev.body} ${placeholder}` : placeholder,
      variables: prev.variables.includes(value)
        ? prev.variables
        : [...prev.variables, value],
    }));

    setErrors((prev) => ({
      ...prev,
      body: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof MessageTemplateFormValues, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Template name is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (form.channel === "Email" && !form.subject.trim()) {
      nextErrors.subject = "Subject is required for email templates.";
    }

    if (!form.body.trim()) {
      nextErrors.body = "Template body is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      const extractedVariables = Array.from(
        new Set([
          ...form.variables,
          ...extractVariablesFromText(form.subject),
          ...extractVariablesFromText(form.body),
        ])
      );

      await onSubmit({
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        subject: form.subject.trim(),
        body: form.body.trim(),
        variables: extractedVariables,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const previewSubject =
    form.subject || (form.channel === "Email" ? "No subject yet" : "Subject not used for this channel");

  const previewBody =
    form.body || "Your message preview will appear here once you start writing the template.";

  if (!open) return null;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: theme.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1700,
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
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
    gap: 20,
  };

  const panelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
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

  const formGridStyle: CSSProperties = {
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

  const fullWidthFieldStyle: CSSProperties = {
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
    minHeight: 200,
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

  const toggleRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const statusPillStyle = (active: boolean): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${
      active
        ? theme.mode === "dark"
          ? "rgba(16,185,129,0.28)"
          : "#a7f3d0"
        : theme.border
    }`,
    background: active
      ? theme.mode === "dark"
        ? "rgba(16,185,129,0.15)"
        : "#ecfdf5"
      : theme.mode === "dark"
      ? theme.inputBg
      : "#ffffff",
    color: active ? theme.success : theme.subText,
    fontSize: 12,
    fontWeight: 900,
  });

  const variableWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const variableChipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.subText,
    fontSize: 12,
    fontWeight: 800,
  };

  const chipButtonStyle: CSSProperties = {
    border: "none",
    background: "transparent",
    color: theme.danger,
    fontSize: 12,
    fontWeight: 900,
    cursor: busy ? "not-allowed" : "pointer",
    padding: 0,
  };

  const suggestionButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.primary,
    borderRadius: 999,
    padding: "8px 10px",
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
    lineHeight: 1.8,
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

  const footerPillStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    background: theme.cardBg,
    border: `1px solid ${theme.borderSoft}`,
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
        aria-labelledby="message-template-modal-title"
      >
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <h2 id="message-template-modal-title" style={titleStyle}>
              {isEditMode ? "Edit Message Template" : "Create Message Template"}
            </h2>
            <p style={subtitleStyle}>
              Build reusable messaging blocks for faster communication, better consistency, and cleaner follow-up flow.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            style={closeButtonStyle}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div style={bodyStyle}>
            <div style={panelStyle}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Template Details</h3>

                <div style={formGridStyle}>
                  <div style={fieldStyle}>
                    <label htmlFor="template-name" style={labelStyle}>
                      Template Name
                    </label>
                    <input
                      id="template-name"
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Enter template name"
                      style={inputStyle}
                      disabled={busy}
                    />
                    {errors.name ? <span style={errorTextStyle}>{errors.name}</span> : null}
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="template-category" style={labelStyle}>
                      Category
                    </label>
                    <select
                      id="template-category"
                      value={form.category}
                      onChange={(event) => updateField("category", event.target.value)}
                      style={inputStyle}
                      disabled={busy}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category ? <span style={errorTextStyle}>{errors.category}</span> : null}
                  </div>

                  <div style={fieldStyle}>
                    <label htmlFor="template-channel" style={labelStyle}>
                      Channel
                    </label>
                    <select
                      id="template-channel"
                      value={form.channel}
                      onChange={(event) =>
                        updateField("channel", event.target.value as TemplateChannel)
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
                    <label style={labelStyle}>Status</label>
                    <div style={toggleRowStyle}>
                      <button
                        type="button"
                        style={statusPillStyle(form.status === "Active")}
                        onClick={() => updateField("status", "Active")}
                        disabled={busy}
                      >
                        Active
                      </button>

                      <button
                        type="button"
                        style={statusPillStyle(form.status === "Inactive")}
                        onClick={() => updateField("status", "Inactive")}
                        disabled={busy}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>

                  {form.channel === "Email" ? (
                    <div style={fullWidthFieldStyle}>
                      <label htmlFor="template-subject" style={labelStyle}>
                        Subject
                      </label>
                      <input
                        id="template-subject"
                        type="text"
                        value={form.subject}
                        onChange={(event) => updateField("subject", event.target.value)}
                        placeholder="Enter subject line"
                        style={inputStyle}
                        disabled={busy}
                      />
                      {errors.subject ? (
                        <span style={errorTextStyle}>{errors.subject}</span>
                      ) : null}
                    </div>
                  ) : null}

                  <div style={fullWidthFieldStyle}>
                    <label htmlFor="template-body" style={labelStyle}>
                      Message Body
                    </label>
                    <textarea
                      id="template-body"
                      value={form.body}
                      onChange={(event) => updateField("body", event.target.value)}
                      placeholder="Write your template here. Example: Hello {{customerName}}, your follow-up is scheduled on {{date}}."
                      style={textareaStyle}
                      disabled={busy}
                    />
                    <span style={helperTextStyle}>
                      Use placeholders like <strong>{"{{customerName}}"}</strong> or <strong>{"{{date}}"}</strong> for dynamic values.
                    </span>
                    {errors.body ? <span style={errorTextStyle}>{errors.body}</span> : null}
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Variables / Placeholders</h3>

                <div style={toggleRowStyle}>
                  <input
                    type="text"
                    value={newVariable}
                    onChange={(event) => setNewVariable(event.target.value)}
                    placeholder="Add custom variable"
                    style={{ ...inputStyle, flex: 1, minWidth: 180 }}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    onClick={() => addVariable(newVariable)}
                    disabled={busy || !newVariable.trim()}
                    style={primaryButtonStyle}
                  >
                    Add Variable
                  </button>
                </div>

                {form.variables.length > 0 ? (
                  <div style={variableWrapStyle}>
                    {form.variables.map((variable) => (
                      <span key={variable} style={variableChipStyle}>
                        {`{{${variable}}}`}
                        <button
                          type="button"
                          onClick={() => removeVariable(variable)}
                          disabled={busy}
                          style={chipButtonStyle}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={helperTextStyle}>No variables added yet.</span>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={labelStyle}>Quick Suggestions</span>
                  <div style={variableWrapStyle}>
                    {variableSuggestions.map((variable) => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => insertVariableIntoBody(variable)}
                        disabled={busy}
                        style={suggestionButtonStyle}
                      >
                        {`{{${variable}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div style={panelStyle}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Live Preview</h3>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Channel</span>
                  <div style={previewValueStyle}>{form.channel}</div>
                </div>

                {form.channel === "Email" ? (
                  <div style={previewCardStyle}>
                    <span style={previewLabelStyle}>Subject Preview</span>
                    <div style={previewValueStyle}>{previewSubject}</div>
                  </div>
                ) : null}

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Message Preview</span>
                  <div style={previewValueStyle}>{previewBody}</div>
                </div>

                <div style={previewCardStyle}>
                  <span style={previewLabelStyle}>Current Status</span>
                  <div style={previewValueStyle}>{form.status}</div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Template Notes</h3>
                <span style={helperTextStyle}>
                  Keep template names sharp and searchable. Use categories consistently so your team can find the right message fast.
                </span>
                <span style={helperTextStyle}>
                  For email, subject matters. For SMS and WhatsApp, keep the body tighter and more direct.
                </span>
              </section>
            </div>
          </div>

          <div style={footerStyle}>
            <div style={footerMetaStyle}>
              <span style={footerPillStyle}>{form.channel}</span>
              <span style={footerPillStyle}>{form.status}</span>
              <span style={footerPillStyle}>{form.variables.length} variable(s)</span>
            </div>

            <div style={footerButtonsStyle}>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button type="submit" disabled={busy} style={primaryButtonStyle}>
                {busy
                  ? "Saving..."
                  : isEditMode
                  ? "Update Template"
                  : "Create Template"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}