import React, { memo, useMemo, useState } from "react";
import {
  MessageSquare,
  Send,
  Clock3,
  Paperclip,
  Eye,
  Users,
  Settings,
  Smartphone,
  MessageCircle,
  Wand2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Trash2,
  Plus,
  X,
  Tags,
} from "lucide-react";

import ComposerTabs, { type ComposerTabItem } from "./ComposerTabs";
import ComposerToolbar, {
  type ComposerToolbarAction,
} from "./ComposerToolbar";
import ComposerFooterActions from "./ComposerFooterActions";
import MergeTagPicker, { type MergeTagItem } from "./MergeTagPicker";

type MessageChannel = "sms" | "whatsapp" | "custom";

type AttachmentItem = {
  id: string;
  name: string;
  sizeLabel?: string;
};

export type MessageComposerPayload = {
  channel: MessageChannel;
  recipients: string[];
  message: string;
  attachments: AttachmentItem[];
  scheduledAt?: string;
  templateName?: string;
};

type Props = {
  initialChannel?: MessageChannel;
  initialRecipients?: string;
  initialMessage?: string;
  initialTemplateName?: string;
  initialAttachments?: AttachmentItem[];
  mergeTags?: MergeTagItem[];
  loading?: boolean;
  sending?: boolean;
  savingDraft?: boolean;
  scheduling?: boolean;
  className?: string;
  onCancel?: () => void;
  onSaveDraft?: (payload: MessageComposerPayload) => void;
  onScheduleSend?: (payload: MessageComposerPayload) => void;
  onSendNow?: (payload: MessageComposerPayload) => void;
};

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  minWidth: 0,
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

const badgeStyle: React.CSSProperties = {
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
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
  minHeight: 260,
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

const quickRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const pillButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#f8fafc",
  color: "#334155",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const activePillStyle: React.CSSProperties = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
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

const counterRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const metricCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

function MessageComposer({
  initialChannel = "whatsapp",
  initialRecipients = "",
  initialMessage = "",
  initialTemplateName = "",
  initialAttachments = [],
  mergeTags = [],
  loading = false,
  sending = false,
  savingDraft = false,
  scheduling = false,
  className,
  onCancel,
  onSaveDraft,
  onScheduleSend,
  onSendNow,
}: Props) {
  const [activeTab, setActiveTab] = useState("message");
  const [channel, setChannel] = useState<MessageChannel>(initialChannel);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [message, setMessage] = useState(initialMessage);
  const [templateName, setTemplateName] = useState(initialTemplateName);
  const [scheduledAt, setScheduledAt] = useState("");
  const [attachments, setAttachments] =
    useState<AttachmentItem[]>(initialAttachments);
  const [selectedMergeTag, setSelectedMergeTag] = useState<string | null>(null);
  const [showMergeTagPicker, setShowMergeTagPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parsedRecipients = useMemo(() => {
    return recipients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [recipients]);

  const payload = useMemo<MessageComposerPayload>(
    () => ({
      channel,
      recipients: parsedRecipients,
      message: message.trim(),
      attachments,
      scheduledAt: scheduledAt || undefined,
      templateName: templateName.trim() || undefined,
    }),
    [attachments, channel, message, parsedRecipients, scheduledAt, templateName]
  );

  const charCount = message.length;
  const segmentSize = channel === "sms" ? 160 : 1000;
  const segmentCount = Math.max(1, Math.ceil(Math.max(charCount, 1) / segmentSize));

  const tabs = useMemo<ComposerTabItem[]>(
    () => [
      {
        key: "message",
        label: "Message",
        icon: <MessageSquare size={16} />,
        hasUnsavedChanges: Boolean(message || templateName),
      },
      {
        key: "audience",
        label: "Recipients",
        icon: <Users size={16} />,
        count: parsedRecipients.length,
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
    [attachments.length, message, parsedRecipients.length, scheduledAt, templateName]
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
        onClick: () => setMessage(""),
      },
    ],
    [message]
  );

  function insertWrapper(start: string, end: string) {
    setMessage((prev) => `${prev}${start}${end}`);
  }

  function appendBlock(text: string) {
    setMessage((prev) => `${prev}${text}`);
  }

  function handleInsertMergeTag(tag: MergeTagItem) {
    setSelectedMergeTag(tag.value);
    setMessage((prev) => `${prev}${prev ? " " : ""}${tag.value}`);
    setShowMergeTagPicker(false);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (parsedRecipients.length === 0) {
      nextErrors.recipients = "At least one recipient is required.";
    }

    if (!message.trim()) {
      nextErrors.message = "Message body cannot be empty.";
    }

    if (scheduledAt && Number.isNaN(new Date(scheduledAt).getTime())) {
      nextErrors.scheduledAt = "Please choose a valid scheduled date and time.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveDraft() {
    setErrors({});
    onSaveDraft?.(payload);
  }

  function handleScheduleSend() {
    if (!validate()) return;
    onScheduleSend?.(payload);
  }

  function handleSendNow() {
    if (!validate()) return;
    onSendNow?.(payload);
  }

  function handleAddMockAttachment() {
    const id = `${Date.now()}`;
    setAttachments((prev) => [
      ...prev,
      {
        id,
        name: `Message-File-${prev.length + 1}.jpg`,
        sizeLabel: `${(prev.length + 1) * 0.8} MB`,
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
            .message-composer-body {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .message-composer-header-row {
              flex-direction: column;
              align-items: stretch !important;
            }

            .message-composer-field-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={shellStyle}>
        <div style={headerStyle}>
          <div className="message-composer-header-row" style={titleRowStyle}>
            <div style={titleWrapStyle}>
              <h2 style={titleStyle}>Message Composer</h2>
              <p style={subtitleStyle}>
                Create high-conversion SMS, WhatsApp, and outbound message flows
                with personalization, attachments, scheduling, and preview.
              </p>
            </div>

            <div style={badgeStyle}>
              <Send size={14} />
              Omnichannel Messaging
            </div>
          </div>

          <ComposerTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="message-composer-body" style={bodyWrapStyle}>
          <div style={editorPaneStyle}>
            {(activeTab === "message" || activeTab === "audience") && (
              <div style={cardStyle}>
                <div style={fieldWrapStyle}>
                  <label style={fieldLabelStyle}>Channel</label>

                  <div style={quickRowStyle}>
                    <button
                      type="button"
                      style={{
                        ...pillButtonStyle,
                        ...(channel === "sms" ? activePillStyle : {}),
                      }}
                      onClick={() => setChannel("sms")}
                    >
                      <Smartphone size={13} />
                      SMS
                    </button>

                    <button
                      type="button"
                      style={{
                        ...pillButtonStyle,
                        ...(channel === "whatsapp" ? activePillStyle : {}),
                      }}
                      onClick={() => setChannel("whatsapp")}
                    >
                      <MessageCircle size={13} />
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      style={{
                        ...pillButtonStyle,
                        ...(channel === "custom" ? activePillStyle : {}),
                      }}
                      onClick={() => setChannel("custom")}
                    >
                      <Wand2 size={13} />
                      Custom
                    </button>
                  </div>
                </div>

                <div
                  className="message-composer-field-grid"
                  style={fieldGridStyle}
                >
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Recipients</label>
                    <input
                      type="text"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder="9876543210, 9123456789"
                      style={inputStyle}
                    />
                    {errors.recipients ? (
                      <div style={errorTextStyle}>{errors.recipients}</div>
                    ) : (
                      <div style={helperTextStyle}>
                        Separate multiple numbers or recipient identifiers with commas.
                      </div>
                    )}
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Template Name</label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Festival Follow-up / Site Visit Reminder"
                      style={inputStyle}
                    />
                    <div style={helperTextStyle}>
                      Optional internal name for reusable message patterns.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "message" && (
              <>
                <ComposerToolbar
                  actions={toolbarActions}
                  rightSlot={
                    <div style={quickRowStyle}>
                      <button
                        type="button"
                        style={pillButtonStyle}
                        onClick={() => setShowMergeTagPicker((prev) => !prev)}
                      >
                        <Tags size={13} />
                        {showMergeTagPicker ? "Hide Merge Tags" : "Insert Merge Tag"}
                      </button>
                    </div>
                  }
                />

                <div style={cardStyle}>
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Message Body</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      style={textareaStyle}
                    />
                    {errors.message ? (
                      <div style={errorTextStyle}>{errors.message}</div>
                    ) : (
                      <div style={helperTextStyle}>
                        Keep the message short, personalized, and action-oriented.
                      </div>
                    )}
                  </div>

                  <div style={counterRowStyle}>
                    <div style={helperTextStyle}>
                      Channel-aware counter updates automatically based on message type.
                    </div>

                    <div style={quickRowStyle}>
                      <span style={pillButtonStyle as React.CSSProperties}>
                        Characters: {charCount}
                      </span>
                      <span style={pillButtonStyle as React.CSSProperties}>
                        Segments: {segmentCount}
                      </span>
                    </div>
                  </div>
                </div>

                {showMergeTagPicker && mergeTags.length > 0 ? (
                  <div style={cardStyle}>
                    <MergeTagPicker
                      tags={mergeTags}
                      selectedValue={selectedMergeTag}
                      recentValues={mergeTags.slice(0, 3).map((item) => item.value)}
                      onInsert={handleInsertMergeTag}
                      onCopy={(tag) => {
                        navigator.clipboard.writeText(tag.value);
                        setSelectedMergeTag(tag.value);
                      }}
                    />
                  </div>
                ) : null}
              </>
            )}

            {activeTab === "attachments" && (
              <div style={cardStyle}>
                <div style={titleRowStyle}>
                  <div style={titleWrapStyle}>
                    <h3 style={sectionTitleStyle}>Attachments</h3>
                    <p style={subtitleStyle}>
                      Add brochures, location maps, offer creatives, or supporting media.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={pillButtonStyle}
                    onClick={handleAddMockAttachment}
                  >
                    <Plus size={13} />
                    Add Attachment
                  </button>
                </div>

                {attachments.length === 0 ? (
                  <div style={helperTextStyle}>
                    No attachments added yet. Media can improve response quality in WhatsApp and rich outbound flows.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {attachments.map((item) => (
                      <div key={item.id} style={attachmentItemStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            minWidth: 0,
                          }}
                        >
                          <Paperclip size={16} color="#475569" />
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#0f172a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </div>
                            <div style={helperTextStyle}>
                              {item.sizeLabel ?? "Unknown size"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          style={pillButtonStyle}
                          onClick={() => removeAttachment(item.id)}
                        >
                          <X size={13} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div style={cardStyle}>
                <div style={titleWrapStyle}>
                  <h3 style={sectionTitleStyle}>Delivery Settings</h3>
                  <p style={subtitleStyle}>
                    Send immediately or choose a scheduled date and time.
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
                      Leave empty to use “Send Now” for immediate delivery.
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
                    {templateName || "Untitled message"}
                  </div>
                  <div style={helperTextStyle}>
                    Channel: {channel.toUpperCase()} · Recipients: {parsedRecipients.length}
                  </div>
                </div>

                <div style={previewBodyStyle}>
                  {message || "Your message preview will appear here."}
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
              disableSaveDraft={loading}
              disableScheduleSend={loading}
              disableSendNow={loading}
              saveDraftLabel="Save Draft"
              scheduleSendLabel="Schedule"
              sendNowLabel="Send Now"
              statusText={
                loading
                  ? "Message composer is loading..."
                  : "Recipients and message content are required before sending."
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
              <h3 style={sectionTitleStyle}>Message Summary</h3>

              <SummaryRow
                label="Channel"
                value={channel.toUpperCase()}
                subtext="Selected delivery channel"
              />
              <SummaryRow
                label="Recipients"
                value={String(parsedRecipients.length)}
                subtext={
                  parsedRecipients.length
                    ? parsedRecipients.join(", ")
                    : "No recipients added"
                }
                tone={parsedRecipients.length ? "good" : "warning"}
              />
              <SummaryRow
                label="Template"
                value={templateName.trim() ? "Named" : "Untitled"}
                subtext={
                  templateName.trim()
                    ? templateName.trim()
                    : "No internal template name set"
                }
              />
            </div>

            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Delivery Metrics</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                <div style={metricCardStyle}>
                  <span style={fieldLabelStyle}>Characters</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                    {charCount}
                  </span>
                  <span style={helperTextStyle}>Live message length</span>
                </div>

                <div style={metricCardStyle}>
                  <span style={fieldLabelStyle}>Segments</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                    {segmentCount}
                  </span>
                  <span style={helperTextStyle}>
                    Estimated by {channel.toUpperCase()} rules
                  </span>
                </div>
              </div>

              <SummaryRow
                label="Attachments"
                value={String(attachments.length)}
                subtext={
                  attachments.length
                    ? "Supporting files attached"
                    : "No files attached"
                }
              />
              <SummaryRow
                label="Schedule"
                value={scheduledAt ? "Scheduled" : "Immediate"}
                subtext={
                  scheduledAt
                    ? formatScheduledAt(scheduledAt)
                    : "No future delivery time selected"
                }
                tone={scheduledAt ? "good" : "default"}
              />
            </div>

            <div style={previewShellStyle}>
              <div style={previewHeaderStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  <Eye size={14} />
                  Quick Preview
                </div>
                <div style={helperTextStyle}>
                  Snapshot of how this message may appear to the recipient.
                </div>
              </div>

              <div style={{ ...previewBodyStyle, minHeight: 160 }}>
                <div style={{ marginBottom: 10, fontWeight: 800, color: "#0f172a" }}>
                  {templateName || "Untitled message"}
                </div>
                <div>{message || "Compose your message to see preview content."}</div>
              </div>
            </div>

            <div
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                border: "1px solid #dbeafe",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock3 size={18} color="#2563eb" />
                <h3 style={{ ...sectionTitleStyle, margin: 0 }}>
                  Delivery Readiness
                </h3>
              </div>

              <div style={helperTextStyle}>
                {parsedRecipients.length > 0 && message.trim()
                  ? "This message is ready to save, schedule, or send right away."
                  : "Add recipients and message content to make this message delivery-ready."}
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

export default memo(MessageComposer);