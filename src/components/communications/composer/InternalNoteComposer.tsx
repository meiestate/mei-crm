import React, { memo, useMemo, useState } from "react";
import {
  StickyNote,
  Tag,
  Paperclip,
  Eye,
  Pin,
  Clock3,
  Users,
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
  Save,
  Send,
} from "lucide-react";

import ComposerTabs, { type ComposerTabItem } from "./ComposerTabs";
import ComposerToolbar, {
  type ComposerToolbarAction,
} from "./ComposerToolbar";
import ComposerFooterActions from "./ComposerFooterActions";

type NotePriority = "low" | "medium" | "high" | "urgent";
type NoteVisibility = "private" | "team" | "management";

type AttachmentItem = {
  id: string;
  name: string;
  sizeLabel?: string;
};

export type InternalNoteComposerPayload = {
  title: string;
  body: string;
  priority: NotePriority;
  visibility: NoteVisibility;
  tags: string[];
  mentions: string[];
  pinned: boolean;
  followUpRequired: boolean;
  attachments: AttachmentItem[];
};

type Props = {
  initialTitle?: string;
  initialBody?: string;
  initialPriority?: NotePriority;
  initialVisibility?: NoteVisibility;
  initialTags?: string[];
  initialMentions?: string[];
  initialPinned?: boolean;
  initialFollowUpRequired?: boolean;
  initialAttachments?: AttachmentItem[];
  loading?: boolean;
  savingDraft?: boolean;
  publishing?: boolean;
  className?: string;
  onCancel?: () => void;
  onSaveDraft?: (payload: InternalNoteComposerPayload) => void;
  onPublish?: (payload: InternalNoteComposerPayload) => void;
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
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

const chipWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 10px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
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

function InternalNoteComposer({
  initialTitle = "",
  initialBody = "",
  initialPriority = "medium",
  initialVisibility = "team",
  initialTags = [],
  initialMentions = [],
  initialPinned = false,
  initialFollowUpRequired = false,
  initialAttachments = [],
  loading = false,
  savingDraft = false,
  publishing = false,
  className,
  onCancel,
  onSaveDraft,
  onPublish,
}: Props) {
  const [activeTab, setActiveTab] = useState("note");
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [priority, setPriority] = useState<NotePriority>(initialPriority);
  const [visibility, setVisibility] =
    useState<NoteVisibility>(initialVisibility);
  const [tagInput, setTagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [mentions, setMentions] = useState<string[]>(initialMentions);
  const [pinned, setPinned] = useState(initialPinned);
  const [followUpRequired, setFollowUpRequired] = useState(
    initialFollowUpRequired
  );
  const [attachments, setAttachments] =
    useState<AttachmentItem[]>(initialAttachments);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const payload = useMemo<InternalNoteComposerPayload>(
    () => ({
      title: title.trim(),
      body: body.trim(),
      priority,
      visibility,
      tags,
      mentions,
      pinned,
      followUpRequired,
      attachments,
    }),
    [
      attachments,
      body,
      followUpRequired,
      mentions,
      pinned,
      priority,
      tags,
      title,
      visibility,
    ]
  );

  const tabs = useMemo<ComposerTabItem[]>(
    () => [
      {
        key: "note",
        label: "Note",
        icon: <StickyNote size={16} />,
        hasUnsavedChanges: Boolean(title || body),
      },
      {
        key: "meta",
        label: "Meta",
        icon: <Tag size={16} />,
        count: tags.length,
      },
      {
        key: "attachments",
        label: "Attachments",
        icon: <Paperclip size={16} />,
        count: attachments.length,
      },
      {
        key: "preview",
        label: "Preview",
        icon: <Eye size={16} />,
      },
    ],
    [attachments.length, body, tags.length, title]
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

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!payload.title) {
      nextErrors.title = "Note title is required.";
    }

    if (!payload.body) {
      nextErrors.body = "Note body cannot be empty.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveDraft() {
    setErrors({});
    onSaveDraft?.(payload);
  }

  function handlePublish() {
    if (!validate()) return;
    onPublish?.(payload);
  }

  function addTag() {
    const next = tagInput.trim();
    if (!next) return;
    if (!tags.includes(next)) {
      setTags((prev) => [...prev, next]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
  }

  function addMention() {
    const next = mentionInput.trim();
    if (!next) return;
    if (!mentions.includes(next)) {
      setMentions((prev) => [...prev, next]);
    }
    setMentionInput("");
  }

  function removeMention(name: string) {
    setMentions((prev) => prev.filter((item) => item !== name));
  }

  function handleAddMockAttachment() {
    const id = `${Date.now()}`;
    setAttachments((prev) => [
      ...prev,
      {
        id,
        name: `Note-File-${prev.length + 1}.pdf`,
        sizeLabel: `${(prev.length + 1) * 0.9} MB`,
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
            .internal-note-body {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .internal-note-header-row {
              flex-direction: column;
              align-items: stretch !important;
            }

            .internal-note-field-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div style={shellStyle}>
        <div style={headerStyle}>
          <div className="internal-note-header-row" style={titleRowStyle}>
            <div style={titleWrapStyle}>
              <h2 style={titleStyle}>Internal Note Composer</h2>
              <p style={subtitleStyle}>
                Capture internal context, team observations, follow-up intent,
                and strategic notes in one structured workspace.
              </p>
            </div>

            <div style={badgeStyle}>
              <StickyNote size={14} />
              Team Collaboration Note
            </div>
          </div>

          <ComposerTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="internal-note-body" style={bodyWrapStyle}>
          <div style={editorPaneStyle}>
            {(activeTab === "note" || activeTab === "meta") && (
              <div style={cardStyle}>
                <div style={fieldWrapStyle}>
                  <label style={fieldLabelStyle}>Note Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter internal note title"
                    style={inputStyle}
                  />
                  {errors.title ? (
                    <div style={errorTextStyle}>{errors.title}</div>
                  ) : null}
                </div>

                <div
                  className="internal-note-field-grid"
                  style={fieldGridStyle}
                >
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as NotePriority)
                      }
                      style={selectStyle}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Visibility</label>
                    <select
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as NoteVisibility)
                      }
                      style={selectStyle}
                    >
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="management">Management</option>
                    </select>
                  </div>
                </div>

                <div style={quickRowStyle}>
                  <button
                    type="button"
                    style={{
                      ...pillButtonStyle,
                      ...(pinned ? activePillStyle : {}),
                    }}
                    onClick={() => setPinned((prev) => !prev)}
                  >
                    <Pin size={13} />
                    {pinned ? "Pinned" : "Pin Note"}
                  </button>

                  <button
                    type="button"
                    style={{
                      ...pillButtonStyle,
                      ...(followUpRequired ? activePillStyle : {}),
                    }}
                    onClick={() => setFollowUpRequired((prev) => !prev)}
                  >
                    <Clock3 size={13} />
                    {followUpRequired ? "Follow-up Needed" : "Mark Follow-up"}
                  </button>

                  <span style={helperTextStyle}>
                    Notes can be pinned and marked for action tracking.
                  </span>
                </div>
              </div>
            )}

            {activeTab === "note" && (
              <>
                <ComposerToolbar
                  actions={toolbarActions}
                  rightSlot={
                    <span style={helperTextStyle}>
                      Use formatting tools to make notes easier for the team to scan.
                    </span>
                  }
                />

                <div style={cardStyle}>
                  <div style={fieldWrapStyle}>
                    <label style={fieldLabelStyle}>Note Body</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your internal note here..."
                      style={textareaStyle}
                    />
                    {errors.body ? (
                      <div style={errorTextStyle}>{errors.body}</div>
                    ) : (
                      <div style={helperTextStyle}>
                        Add observations, action items, context, blockers, or next steps.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "meta" && (
              <>
                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>Tags</h3>

                  <div style={quickRowStyle}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      style={inputStyle}
                    />
                    <button type="button" style={pillButtonStyle} onClick={addTag}>
                      <Plus size={13} />
                      Add Tag
                    </button>
                  </div>

                  {tags.length > 0 ? (
                    <div style={chipWrapStyle}>
                      {tags.map((tag) => (
                        <span key={tag} style={chipStyle}>
                          <Tag size={12} />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              color: "#64748b",
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={helperTextStyle}>
                      No tags added yet. Use tags to group similar notes.
                    </div>
                  )}
                </div>

                <div style={cardStyle}>
                  <h3 style={sectionTitleStyle}>Mentions</h3>

                  <div style={quickRowStyle}>
                    <input
                      type="text"
                      value={mentionInput}
                      onChange={(e) => setMentionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMention();
                        }
                      }}
                      placeholder="@username or teammate name"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      style={pillButtonStyle}
                      onClick={addMention}
                    >
                      <Users size={13} />
                      Add Mention
                    </button>
                  </div>

                  {mentions.length > 0 ? (
                    <div style={chipWrapStyle}>
                      {mentions.map((name) => (
                        <span key={name} style={chipStyle}>
                          <Users size={12} />
                          {name}
                          <button
                            type="button"
                            onClick={() => removeMention(name)}
                            style={{
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              color: "#64748b",
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={helperTextStyle}>
                      Mention teammates to increase visibility and accountability.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "attachments" && (
              <div style={cardStyle}>
                <div style={titleRowStyle}>
                  <div style={titleWrapStyle}>
                    <h3 style={sectionTitleStyle}>Attachments</h3>
                    <p style={subtitleStyle}>
                      Add screenshots, documents, voice notes, or evidence files.
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
                    No attachments added. Supporting files can strengthen note context.
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

            {activeTab === "preview" && (
              <div style={previewShellStyle}>
                <div style={previewHeaderStyle}>
                  <div style={{ ...fieldLabelStyle, marginBottom: 2 }}>Preview</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                    {title || "Untitled internal note"}
                  </div>
                  <div style={helperTextStyle}>
                    {priority.toUpperCase()} · {visibility.toUpperCase()} ·{" "}
                    {pinned ? "Pinned" : "Not pinned"}
                  </div>
                </div>

                <div style={previewBodyStyle}>
                  {body || "Your internal note preview will appear here."}
                </div>
              </div>
            )}

            <ComposerFooterActions
              onCancel={onCancel}
              onSaveDraft={handleSaveDraft}
              onSendNow={handlePublish}
              isSavingDraft={savingDraft}
              isSending={publishing}
              disableSaveDraft={loading}
              disableSendNow={loading}
              hideScheduleSend
              sendNowLabel="Publish Note"
              saveDraftLabel="Save Draft"
              statusText={
                loading
                  ? "Note composer is loading..."
                  : "Title and note body are required before publishing."
              }
              errorText={
                Object.keys(errors).length > 0
                  ? "Please fix the highlighted fields before publishing."
                  : undefined
              }
              rightSlot={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#475569",
                  }}
                >
                  <Save size={14} />
                  Autosave-ready workflow
                </span>
              }
            />
          </div>

          <div style={sidebarPaneStyle}>
            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Note Summary</h3>

              <SummaryRow
                label="Title"
                value={title.trim() ? "Ready" : "Missing"}
                subtext={
                  title.trim()
                    ? `${title.trim().length} characters`
                    : "Add a meaningful title"
                }
                tone={title.trim() ? "good" : "warning"}
              />
              <SummaryRow
                label="Body"
                value={body.trim() ? "Ready" : "Missing"}
                subtext={
                  body.trim()
                    ? `${body.trim().length} characters`
                    : "Add note content"
                }
                tone={body.trim() ? "good" : "warning"}
              />
              <SummaryRow
                label="Priority"
                value={priority.toUpperCase()}
                subtext="Current note urgency"
              />
              <SummaryRow
                label="Visibility"
                value={visibility.toUpperCase()}
                subtext="Who can access this note"
              />
            </div>

            <div style={cardStyle}>
              <h3 style={sectionTitleStyle}>Collaboration</h3>

              <SummaryRow
                label="Tags"
                value={String(tags.length)}
                subtext={tags.length ? tags.join(", ") : "No tags added"}
              />
              <SummaryRow
                label="Mentions"
                value={String(mentions.length)}
                subtext={
                  mentions.length ? mentions.join(", ") : "No teammates mentioned"
                }
              />
              <SummaryRow
                label="Pinned"
                value={pinned ? "Yes" : "No"}
                subtext={
                  pinned
                    ? "This note will stay visible and prioritized"
                    : "This note is not pinned"
                }
                tone={pinned ? "good" : "default"}
              />
              <SummaryRow
                label="Follow-up"
                value={followUpRequired ? "Required" : "Not Required"}
                subtext={
                  followUpRequired
                    ? "This note is marked for next action"
                    : "No follow-up flagged"
                }
                tone={followUpRequired ? "warning" : "default"}
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
                  Snapshot of how this note reads at a glance.
                </div>
              </div>

              <div style={{ ...previewBodyStyle, minHeight: 160 }}>
                <div style={{ marginBottom: 10, fontWeight: 800, color: "#0f172a" }}>
                  {title || "Untitled internal note"}
                </div>
                <div>{body || "Compose your note to see preview content."}</div>
              </div>
            </div>

            <div
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
                border: "1px solid #dbeafe",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Send size={18} color="#2563eb" />
                <h3 style={{ ...sectionTitleStyle, margin: 0 }}>
                  Publish Readiness
                </h3>
              </div>

              <div style={helperTextStyle}>
                {payload.title && payload.body
                  ? "This internal note is ready to save or publish for team visibility."
                  : "Complete the title and body to make this note publish-ready."}
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

export default memo(InternalNoteComposer);