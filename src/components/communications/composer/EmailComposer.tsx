import React, { memo, useMemo, useState } from "react";
import {
  Mail,
  Users,
  Paperclip,
  Settings,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Trash2,
  Send,
  Clock3,
  X,
  Plus,
} from "lucide-react";

import ComposerTabs, { type ComposerTabItem } from "./ComposerTabs";
import ComposerToolbar, {
  type ComposerToolbarAction,
} from "./ComposerToolbar";
import ComposerFooterActions from "./ComposerFooterActions";

type RecipientField = {
  to: string;
  cc: string;
  bcc: string;
};

type AttachmentItem = {
  id: string;
  name: string;
  sizeLabel?: string;
};

type Props = {
  initialTo?: string;
  initialCc?: string;
  initialBcc?: string;
  initialSubject?: string;
  initialBody?: string;
  initialAttachments?: AttachmentItem[];
  loading?: boolean;
  sending?: boolean;
  savingDraft?: boolean;
  scheduling?: boolean;
  onCancel?: () => void;
  onSaveDraft?: (payload: EmailComposerPayload) => void;
  onScheduleSend?: (payload: EmailComposerPayload) => void;
  onSendNow?: (payload: EmailComposerPayload) => void;
  className?: string;
};

export type EmailComposerPayload = {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  attachments: AttachmentItem[];
  scheduledAt?: string;
};

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
  width: "100%",
};

const shellStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 24,
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  padding: "22px 22px 0",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const titleWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const draftBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
};

const bodyWrapStyle: React.CSSProperties = {
  padding: 22,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.65fr) minmax(320px, 0.95fr)",
  gap: 18,
  alignItems: "start",
};

const editorPaneStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const sidebarPaneStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const fieldGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  border: "1px solid #dbe3ef",
  borderRadius: 14,
  padding: "12px 14px",
  fontSize: 14,
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 280,
  resize: "vertical",
  border: "1px solid #dbe3ef",
  borderRadius: 16,
  padding: "14px 16px",
  fontSize: 14,
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
  lineHeight: 1.7,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const quickRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const toggleButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#f8fafc",
  color: "#334155",
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#b91c1c",
  fontWeight: 700,
  lineHeight: 1.5,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const attachmentItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const attachmentMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const attachmentNameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const attachmentSizeStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};

const inlineButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 10,
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const previewShellStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  background: "#ffffff",
  overflow: "hidden",
};

const previewHeaderStyle: React.CSSProperties = {
  padding: "14px 16px",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const previewBodyStyle: React.CSSProperties = {
  padding: 16,
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  minHeight: 220,
};

const scheduleCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
  border: "1px solid #dbeafe",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

function EmailComposer({
  initialTo = "",
  initialCc = "",
  initialBcc = "",
  initialSubject = "",
  initialBody = "",
  initialAttachments = [],
  loading = false,
  sending = false,
  savingDraft = false,
  scheduling = false,
  onCancel,
  onSaveDraft,
  onScheduleSend,
  onSendNow,
  className,
}: Props) {
  const [activeTab, setActiveTab] = useState("message");
  const [showCc, setShowCc] = useState(Boolean(initialCc));
  const [showBcc, setShowBcc] = useState(Boolean(initialBcc));
  const [recipients, setRecipients] = useState<RecipientField>({
    to: initialTo,
    cc: initialCc,
    bcc: initialBcc,
  });
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [attachments, setAttachments] =
    useState<AttachmentItem[]>(initialAttachments);
  const [scheduledAt, setScheduledAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parsedPayload = useMemo<EmailComposerPayload>(
    () => ({
      to: parseEmailList(recipients.to),
      cc: parseEmailList(recipients.cc),
      bcc: parseEmailList(recipients.bcc),
      subject: subject.trim(),
      body: body.trim(),
      attachments,
      scheduledAt: scheduledAt || undefined,
    }),
    [attachments, body, recipients.bcc, recipients.cc, recipients.to, scheduledAt, subject]
  );

  const tabs = useMemo<ComposerTabItem[]>(
    () => [
      {
        key: "message",
        label: "Message",
        icon: <Mail size={16} />,
        hasUnsavedChanges: Boolean(subject || body),
      },
      {
        key: "audience",
        label: "Recipients",
        icon: <Users size={16} />,
        count:
          parsedPayload.to.length +
          parsedPayload.cc.length +
          parsedPayload.bcc.length,
      },
      {
        key: "attachments",
        label: "Attachments",
        icon: <Paperclip size={16} />,
        count: attachments.length,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings size={16} />,
        hasUnsavedChanges: Boolean(scheduledAt),
      },
      {
        key: "preview",
        label: "Preview",
        icon: <Eye size={16} />,
      },
    ],
    [
      attachments.length,
      body,
      parsedPayload.bcc.length,
      parsedPayload.cc.length,
      parsedPayload.to.length,
      scheduledAt,
      subject,
    ]
  );

  const toolbarActions = useMemo<ComposerToolbarAction[]>(
    () => [
      {
        key: "undo",
        label: "Undo",
        icon: <Undo2 size={15} />,
        onClick: () => document.execCommand("undo"),
      },
      {
        key: "redo",
        label: "Redo",
        icon: <Redo2 size={15} />,
        onClick: () => document.execCommand("redo"),
      },
      {
        key: "bold",
        label: "Bold",
        icon: <Bold size={15} />,
        onClick: () => insertWrapper("**", "**"),
      },
      {
        key: "italic",
        label: "Italic",
        icon: <Italic size={15} />,
        onClick: () => insertWrapper("*", "*"),
      },
      {
        key: "underline",
        label: "Underline",
        icon: <Underline size={15} />,
        onClick: () => insertWrapper("<u>", "</u>"),
      },
      {
        key: "bullets",
        label: "Bullets",
        icon: <List size={15} />,
        onClick: () => appendBlock("\n• "),
      },
      {
        key: "numbered",
        label: "Numbered",
        icon: <ListOrdered size={15} />,
        onClick: () => appendBlock("\n1. "),
      },
      {
        key: "link",
        label: "Link",
        icon: <LinkIcon size={15} />,
        onClick: () => appendBlock("\nhttps://"),
      },
      {
        key: "clear",
        label: "Clear",
        icon: <Trash2 size={15} />,
        danger: true,
        onClick: () => setBody(""),
      },
    ],
    [body]
  );

  function insertWrapper(start: string, end: string) {
    setBody((prev) => `${prev}${start}${end}`);
  }

  function appendBlock(text: string) {
    setBody((prev) => `${prev}${text}`);
  }

  function updateRecipient<K extends keyof RecipientField>(
    key: K,
    value: RecipientField[K]
  ) {
    setRecipients((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (parsedPayload.to.length === 0) {
      nextErrors.to = "At least one recipient is required.";
    }

    if (!parsedPayload.subject) {
      nextErrors.subject = "Subject is required.";
    }

    if (!parsedPayload.body) {
      nextErrors.body = "Email body cannot be empty.";
    }

    if (scheduledAt && Number.isNaN(new Date(scheduledAt).getTime())) {
      nextErrors.scheduledAt = "Please choose a valid scheduled date and time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveDraft() {
    setErrors({});
    onSaveDraft?.(parsedPayload);
  }

  function handleScheduleSend() {
    if (!validate()) return;
    onScheduleSend?.(parsedPayload);
  }

  function handleSendNow() {
    if (!validate()) return;
    onSendNow?.(parsedPayload);
  }

  function handleAddMockAttachment() {
    const id = `${Date.now()}`;
    setAttachments((prev) => [
      ...prev,
      {
        id,
        name: `Attachment-${prev.length + 1}.pdf`,
        sizeLabel: `${(prev.length + 1) * 1.2} MB`,
      },
    ]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className={className} style={pageStyle}>
      <style>
        {`
          @media (max-width: 1180px) {
            .email-composer-body {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .email-composer-title-row {
              flex-direction: column;
              align-items: stretch !important;
            }

            .email-composer-quick-row {
              flex-direction: column;
              align-items: stretch !important;
            }
          }
        `}
      </style>

      <div style={shellStyle}>
        <div style={headerStyle}>
          <div className="email-composer-title-row" style={titleRowStyle}>
            <div style={titleWrapStyle}>
              <h2 style={titleStyle}>Compose Email</h2>
              <p style={subtitleStyle}>
                Craft polished outreach, follow-ups, campaigns, and client-ready
                communication from one clean workspace.
              </p>
            </div>

            <div style={draftBadgeStyle}>
              <Send size={14} />
              Professional Composer
            </div>
          </div>

          <ComposerTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="email-composer-body" style={bodyWrapStyle}>
          <div style={editorPaneStyle}>
            {(activeTab === "message" || activeTab === "audience") && (
              <div style={cardStyle}>
                <div className="email-composer-quick-row" style={quickRowStyle}>
                  <button
                    type="button"
                    style={toggleButtonStyle}
                    onClick={() => setShowCc((prev) => !prev)}
                  >
                    {showCc ? "Hide CC" : "Add CC"}
                  </button>

                  <button
                    type="button"
                    style={toggleButtonStyle}
                    onClick={() => setShowBcc((prev) => !prev)}
                  >
                    {showBcc ? "Hide BCC" : "Add BCC"}
                  </button>

                  <span style={helperTextStyle}>
                    Separate multiple email addresses with commas.
                  </span>
                </div>

                <div style={fieldGridStyle}>
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>To</label>
                    <input
                      type="text"
                      value={recipients.to}
                      onChange={(e) => updateRecipient("to", e.target.value)}
                      placeholder="client@example.com, team@example.com"
                      style={inputStyle}
                    />
                    {errors.to ? <div style={errorTextStyle}>{errors.to}</div> : null}
                  </div>

                  {showCc && (
                    <div style={fieldWrapStyle}>
                      <label style={fieldLabelStyle}>CC</label>
                      <input
                        type="text"
                        value={recipients.cc}
                        onChange={(e) => updateRecipient("cc", e.target.value)}
                        placeholder="manager@example.com"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {showBcc && (
                    <div style={fieldWrapStyle}>
                      <label style={fieldLabelStyle}>BCC</label>
                      <input
                        type="text"
                        value={recipients.bcc}
                        onChange={(e) => updateRecipient("bcc", e.target.value)}
                        placeholder="audit@example.com"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject"
                      style={inputStyle}
                    />
                    {errors.subject ? (
                      <div style={errorTextStyle}>{errors.subject}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "message" && (
              <>
                <ComposerToolbar
                  actions={toolbarActions}
                  rightSlot={
                    <span style={helperTextStyle}>
                      Use the toolbar for quick formatting shortcuts.
                    </span>
                  }
                />

                <div style={cardStyle}>
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Message Body</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email here..."
                      style={textareaStyle}
                    />
                    {errors.body ? (
                      <div style={errorTextStyle}>{errors.body}</div>
                    ) : (
                      <div style={helperTextStyle}>
                        Keep it clear, concise, and conversion-focused.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "attachments" && (
              <div style={cardStyle}>
                <div style={titleRowStyle}>
                  <div style={titleWrapStyle}>
                    <h3 style={sectionTitleStyle}>Attachments</h3>
                    <p style={subtitleStyle}>
                      Add brochures, proposals, invoices, decks, or supporting files.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={inlineButtonStyle}
                    onClick={handleAddMockAttachment}
                  >
                    <Plus size={14} />
                    Add Attachment
                  </button>
                </div>

                {attachments.length === 0 ? (
                  <div style={helperTextStyle}>
                    No attachments added yet. Add files that support your message.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {attachments.map((item) => (
                      <div key={item.id} style={attachmentItemStyle}>
                        <div style={attachmentMetaStyle}>
                          <Paperclip size={16} color="#475569" />
                          <div style={{ minWidth: 0 }}>
                            <div style={attachmentNameStyle}>{item.name}</div>
                            <div style={attachmentSizeStyle}>
                              {item.sizeLabel ?? "Unknown size"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          style={inlineButtonStyle}
                          onClick={() => removeAttachment(item.id)}
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div style={scheduleCardStyle}>
                <div style={titleWrapStyle}>
                  <h3 style={sectionTitleStyle}>Delivery Settings</h3>
                  <p style={subtitleStyle}>
                    Choose whether to send now or schedule it for the right time.
                  </p>
                </div>

                <div style={fieldWrapStyle}>
                  <label style={fieldLabelStyle}>Scheduled Send</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    style={inputStyle}
                  />
                  {errors.scheduledAt ? (
                    <div style={errorTextStyle}>{errors.scheduledAt}</div>
                  ) : (
                    <div style={helperTextStyle}>
                      Leave this empty to send immediately using “Send Now”.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div style={previewShellStyle}>
                <div style={previewHeaderStyle}>
                  <div style={{ ...fieldLabelStyle, marginBottom: 2 }}>Preview</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                    {subject || "Untitled email"}
                  </div>
                  <div style={helperTextStyle}>
                    To: {parsedPayload.to.join(", ") || "No recipients"}
                  </div>
                </div>

                <div style={previewBodyStyle}>
                  {body || "Your email preview will appear here."}
                </div>
              </div>
            )}

            <ComposerFooterActions
              onCancel={onCancel}
              onSaveDraft={handleSaveDraft}
              onScheduleSend={handleScheduleSend}
              onSendNow={handleSendNow}
              isSavingDraft={savingDraft}
              isScheduling={scheduling}
              isSending={sending}
              disableSendNow={loading}
              disableScheduleSend={loading}
              disableSaveDraft={loading}
              statusText={
                loading
                  ? "Composer is loading..."
                  : "Recipients, subject, and body are required before sending."
              }
              errorText={
                Object.keys(errors).length > 0
                  ? "Please fix the highlighted fields before continuing."
                  : undefined
              }
            />
          </div>

          <div style={sidebarPaneStyle}>
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Audience Summary</h3>

              <SummaryRow
                label="To"
                value={String(parsedPayload.to.length)}
                subtext={parsedPayload.to.join(", ") || "No primary recipients"}
              />
              <SummaryRow
                label="CC"
                value={String(parsedPayload.cc.length)}
                subtext={parsedPayload.cc.join(", ") || "No CC recipients"}
              />
              <SummaryRow
                label="BCC"
                value={String(parsedPayload.bcc.length)}
                subtext={parsedPayload.bcc.join(", ") || "No BCC recipients"}
              />
            </div>

            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Message Health</h3>

              <SummaryRow
                label="Subject"
                value={subject.trim() ? "Ready" : "Missing"}
                subtext={
                  subject.trim()
                    ? `${subject.trim().length} characters`
                    : "Add a strong subject line"
                }
                tone={subject.trim() ? "good" : "warning"}
              />
              <SummaryRow
                label="Body"
                value={body.trim() ? "Ready" : "Missing"}
                subtext={
                  body.trim()
                    ? `${body.trim().length} characters`
                    : "Add message content"
                }
                tone={body.trim() ? "good" : "warning"}
              />
              <SummaryRow
                label="Attachments"
                value={String(attachments.length)}
                subtext={
                  attachments.length > 0
                    ? "Supporting files added"
                    : "No supporting files attached"
                }
              />
            </div>

            <div style={previewShellStyle}>
              <div style={previewHeaderStyle}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                  Quick Preview
                </div>
                <div style={helperTextStyle}>
                  Snapshot of what recipients are likely to see.
                </div>
              </div>

              <div style={{ ...previewBodyStyle, minHeight: 160 }}>
                <div style={{ marginBottom: 10, fontWeight: 800, color: "#0f172a" }}>
                  {subject || "Untitled email"}
                </div>
                <div>{body || "Compose your message to see preview content."}</div>
              </div>
            </div>

            <div style={scheduleCardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock3 size={18} color="#2563eb" />
                <h3 style={{ ...sectionTitleStyle, margin: 0 }}>Send Timing</h3>
              </div>

              <div style={helperTextStyle}>
                {scheduledAt
                  ? `Scheduled for ${formatScheduledAt(scheduledAt)}`
                  : "No scheduled time selected. This email can be sent immediately."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  subtext?: string;
  tone?: "default" | "good" | "warning";
};

function SummaryRow({
  label,
  value,
  subtext,
  tone = "default",
}: SummaryRowProps) {
  const toneColor =
    tone === "good" ? "#047857" : tone === "warning" ? "#b45309" : "#0f172a";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: toneColor,
          }}
        >
          {value}
        </span>
      </div>

      {subtext ? <div style={helperTextStyle}>{subtext}</div> : null}
    </div>
  );
}

function parseEmailList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatScheduledAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid schedule";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default memo(EmailComposer);