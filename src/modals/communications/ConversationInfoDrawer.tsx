import { useEffect, useMemo, type CSSProperties } from "react";

type ThemeMode = "light" | "dark";
type CommunicationChannel = "Email" | "SMS" | "WhatsApp" | "Call" | "Internal";
type ConversationStatus = "Open" | "Pending" | "Resolved" | "Closed";
type ConversationPriority = "Low" | "Medium" | "High" | "Urgent";

export type ConversationInfoAttachment = {
  id: string;
  name: string;
  size?: string;
  type?: string;
  url?: string;
};

export type ConversationParticipant = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  avatarText?: string;
};

export type ConversationFollowUpInfo = {
  title?: string;
  date?: string;
  time?: string;
  status?: string;
};

export type ConversationInfoData = {
  id: string;
  subject: string;
  channel: CommunicationChannel;
  status: ConversationStatus;
  priority: ConversationPriority;
  summary?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  messageCount?: number;
  internalNotes?: string;
  tags?: string[];
  participants?: ConversationParticipant[];
  followUp?: ConversationFollowUpInfo;
  attachments?: ConversationInfoAttachment[];
};

type Props = {
  open: boolean;
  mode?: ThemeMode;
  conversation?: ConversationInfoData | null;
  onClose: () => void;
};

type ThemePalette = {
  mode: ThemeMode;
  overlay: string;
  drawerBg: string;
  cardBg: string;
  inputBg: string;
  border: string;
  borderSoft: string;
  text: string;
  subText: string;
  mutedText: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
};

const getTheme = (mode: ThemeMode = "light"): ThemePalette => {
  if (mode === "dark") {
    return {
      mode: "dark",
      overlay: "rgba(2, 6, 23, 0.52)",
      drawerBg: "#0f172a",
      cardBg: "#111827",
      inputBg: "#0b1220",
      border: "#334155",
      borderSoft: "#1e293b",
      text: "#f8fafc",
      subText: "#cbd5e1",
      mutedText: "#94a3b8",
      primary: "#22c55e",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      shadow: "-10px 0 35px rgba(0,0,0,0.38)",
    };
  }

  return {
    mode: "light",
    overlay: "rgba(15, 23, 42, 0.24)",
    drawerBg: "#ffffff",
    cardBg: "#f8fafc",
    inputBg: "#ffffff",
    border: "#cbd5e1",
    borderSoft: "#e2e8f0",
    text: "#0f172a",
    subText: "#334155",
    mutedText: "#64748b",
    primary: "#16a34a",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    shadow: "-10px 0 35px rgba(15, 23, 42, 0.12)",
  };
};

const getStatusTone = (
  status: ConversationStatus,
  theme: ThemePalette
): { bg: string; text: string; border: string } => {
  switch (status) {
    case "Resolved":
      return {
        bg: theme.mode === "dark" ? "rgba(16,185,129,0.15)" : "#ecfdf5",
        text: theme.success,
        border: theme.mode === "dark" ? "rgba(16,185,129,0.28)" : "#a7f3d0",
      };
    case "Pending":
      return {
        bg: theme.mode === "dark" ? "rgba(245,158,11,0.15)" : "#fffbeb",
        text: theme.warning,
        border: theme.mode === "dark" ? "rgba(245,158,11,0.28)" : "#fde68a",
      };
    case "Closed":
      return {
        bg: theme.mode === "dark" ? "rgba(148,163,184,0.15)" : "#f1f5f9",
        text: theme.mutedText,
        border: theme.mode === "dark" ? "rgba(148,163,184,0.25)" : "#cbd5e1",
      };
    case "Open":
    default:
      return {
        bg: theme.mode === "dark" ? "rgba(34,197,94,0.15)" : "#f0fdf4",
        text: theme.primary,
        border: theme.mode === "dark" ? "rgba(34,197,94,0.26)" : "#bbf7d0",
      };
  }
};

const getPriorityTone = (
  priority: ConversationPriority,
  theme: ThemePalette
): { bg: string; text: string; border: string } => {
  switch (priority) {
    case "Urgent":
      return {
        bg: theme.mode === "dark" ? "rgba(239,68,68,0.16)" : "#fef2f2",
        text: theme.danger,
        border: theme.mode === "dark" ? "rgba(239,68,68,0.3)" : "#fecaca",
      };
    case "High":
      return {
        bg: theme.mode === "dark" ? "rgba(245,158,11,0.16)" : "#fff7ed",
        text: theme.warning,
        border: theme.mode === "dark" ? "rgba(245,158,11,0.3)" : "#fed7aa",
      };
    case "Medium":
      return {
        bg: theme.mode === "dark" ? "rgba(59,130,246,0.16)" : "#eff6ff",
        text: "#2563eb",
        border: theme.mode === "dark" ? "rgba(59,130,246,0.3)" : "#bfdbfe",
      };
    case "Low":
    default:
      return {
        bg: theme.mode === "dark" ? "rgba(148,163,184,0.16)" : "#f8fafc",
        text: theme.subText,
        border: theme.mode === "dark" ? "rgba(148,163,184,0.25)" : "#cbd5e1",
      };
  }
};

const getChannelTone = (
  channel: CommunicationChannel,
  theme: ThemePalette
): { bg: string; text: string; border: string } => {
  switch (channel) {
    case "WhatsApp":
      return {
        bg: theme.mode === "dark" ? "rgba(34,197,94,0.15)" : "#f0fdf4",
        text: theme.primary,
        border: theme.mode === "dark" ? "rgba(34,197,94,0.26)" : "#bbf7d0",
      };
    case "SMS":
      return {
        bg: theme.mode === "dark" ? "rgba(245,158,11,0.15)" : "#fffbeb",
        text: theme.warning,
        border: theme.mode === "dark" ? "rgba(245,158,11,0.26)" : "#fde68a",
      };
    case "Call":
      return {
        bg: theme.mode === "dark" ? "rgba(59,130,246,0.15)" : "#eff6ff",
        text: "#2563eb",
        border: theme.mode === "dark" ? "rgba(59,130,246,0.26)" : "#bfdbfe",
      };
    case "Internal":
      return {
        bg: theme.mode === "dark" ? "rgba(168,85,247,0.15)" : "#faf5ff",
        text: "#9333ea",
        border: theme.mode === "dark" ? "rgba(168,85,247,0.26)" : "#e9d5ff",
      };
    case "Email":
    default:
      return {
        bg: theme.mode === "dark" ? "rgba(148,163,184,0.15)" : "#f8fafc",
        text: theme.subText,
        border: theme.mode === "dark" ? "rgba(148,163,184,0.25)" : "#cbd5e1",
      };
  }
};

const safeText = (value?: string | null, fallback = "—") => {
  return value && value.trim() ? value : fallback;
};

export default function ConversationInfoDrawer({
  open,
  mode = "light",
  conversation,
  onClose,
}: Props) {
  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const statusTone = getStatusTone(conversation?.status ?? "Open", theme);
  const priorityTone = getPriorityTone(conversation?.priority ?? "Medium", theme);
  const channelTone = getChannelTone(conversation?.channel ?? "Email", theme);

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: theme.overlay,
    zIndex: 1500,
    display: "flex",
    justifyContent: "flex-end",
  };

  const drawerStyle: CSSProperties = {
    width: "100%",
    maxWidth: 430,
    height: "100%",
    background: theme.drawerBg,
    borderLeft: `1px solid ${theme.borderSoft}`,
    boxShadow: theme.shadow,
    display: "flex",
    flexDirection: "column",
    color: theme.text,
  };

  const headerStyle: CSSProperties = {
    padding: "20px 20px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const headerTitleWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: -0.3,
    color: theme.text,
  };

  const subTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.mutedText,
  };

  const closeButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  };

  const bodyStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 18,
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
    fontWeight: 800,
    color: theme.text,
    letterSpacing: 0.1,
  };

  const pillRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const pillStyle = (tone: { bg: string; text: string; border: string }): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "7px 11px",
    borderRadius: 999,
    background: tone.bg,
    color: tone.text,
    border: `1px solid ${tone.border}`,
    fontSize: 12,
    fontWeight: 800,
  });

  const subjectStyle: CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: theme.text,
    lineHeight: 1.5,
  };

  const summaryStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: theme.subText,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  };

  const statCardStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    borderRadius: 16,
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const statLabelStyle: CSSProperties = {
    fontSize: 12,
    color: theme.mutedText,
    fontWeight: 700,
  };

  const statValueStyle: CSSProperties = {
    fontSize: 18,
    color: theme.text,
    fontWeight: 900,
    letterSpacing: -0.3,
  };

  const infoGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  };

  const infoItemStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const infoLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: theme.mutedText,
  };

  const infoValueStyle: CSSProperties = {
    fontSize: 14,
    color: theme.text,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const tagWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const tagStyle: CSSProperties = {
    padding: "7px 10px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    color: theme.subText,
    fontSize: 12,
    fontWeight: 700,
  };

  const participantCardStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    borderRadius: 16,
    padding: 14,
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  };

  const avatarStyle: CSSProperties = {
    width: 42,
    height: 42,
    minWidth: 42,
    borderRadius: "50%",
    background: theme.mode === "dark" ? "#1e293b" : "#dcfce7",
    color: theme.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 900,
    border: `1px solid ${theme.borderSoft}`,
  };

  const attachmentItemStyle: CSSProperties = {
    border: `1px solid ${theme.borderSoft}`,
    background: theme.mode === "dark" ? theme.inputBg : "#ffffff",
    borderRadius: 14,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const attachmentMetaStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const attachmentNameStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: theme.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const attachmentSubStyle: CSSProperties = {
    margin: 0,
    fontSize: 12,
    color: theme.mutedText,
  };

  const attachmentLinkStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: theme.primary,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const emptyStyle: CSSProperties = {
    padding: 28,
    color: theme.mutedText,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 1.6,
  };

  return (
    <div
      style={overlayStyle}
      onClick={onClose}
    >
      <aside
        style={drawerStyle}
        onClick={(event) => event.stopPropagation()}
        aria-label="Conversation information drawer"
      >
        <div style={headerStyle}>
          <div style={headerTitleWrapStyle}>
            <h2 style={titleStyle}>Conversation Info</h2>
            <p style={subTitleStyle}>
              Details, people, context, and thread metadata.
            </p>
          </div>

          <button type="button" style={closeButtonStyle} onClick={onClose}>
            Close
          </button>
        </div>

        <div style={bodyStyle}>
          {!conversation ? (
            <div style={emptyStyle}>No conversation selected.</div>
          ) : (
            <>
              <section style={sectionStyle}>
                <div style={pillRowStyle}>
                  <span style={pillStyle(channelTone)}>{conversation.channel}</span>
                  <span style={pillStyle(statusTone)}>{conversation.status}</span>
                  <span style={pillStyle(priorityTone)}>{conversation.priority}</span>
                </div>

                <div>
                  <h3 style={subjectStyle}>{safeText(conversation.subject)}</h3>
                </div>

                <p style={summaryStyle}>
                  {safeText(
                    conversation.summary,
                    "No summary available for this conversation yet."
                  )}
                </p>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Quick Stats</h3>

                <div style={statsGridStyle}>
                  <div style={statCardStyle}>
                    <span style={statLabelStyle}>Messages</span>
                    <span style={statValueStyle}>
                      {conversation.messageCount ?? 0}
                    </span>
                  </div>

                  <div style={statCardStyle}>
                    <span style={statLabelStyle}>Unread</span>
                    <span style={statValueStyle}>
                      {conversation.unreadCount ?? 0}
                    </span>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Customer</h3>

                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Name</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.customerName)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Email</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.customerEmail)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Phone</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.customerPhone)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Assigned To</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.assignedTo)}
                    </span>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Timeline</h3>

                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Created</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.createdAt)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Last Updated</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.updatedAt)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Last Message</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.lastMessageAt)}
                    </span>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Follow-Up</h3>

                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Title</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.followUp?.title)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Date</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.followUp?.date)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Time</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.followUp?.time)}
                    </span>
                  </div>

                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Status</span>
                    <span style={infoValueStyle}>
                      {safeText(conversation.followUp?.status)}
                    </span>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Tags</h3>

                {conversation.tags && conversation.tags.length > 0 ? (
                  <div style={tagWrapStyle}>
                    {conversation.tags.map((tag) => (
                      <span key={tag} style={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={infoValueStyle}>—</div>
                )}
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Participants</h3>

                {conversation.participants && conversation.participants.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {conversation.participants.map((participant) => (
                      <div key={participant.id} style={participantCardStyle}>
                        <div style={avatarStyle}>
                          {participant.avatarText ||
                            participant.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ ...infoValueStyle, fontWeight: 800 }}>
                            {safeText(participant.name)}
                          </div>
                          <div style={{ ...attachmentSubStyle, marginTop: 2 }}>
                            {safeText(participant.role)}
                          </div>
                          <div style={{ ...attachmentSubStyle, marginTop: 6 }}>
                            {safeText(participant.email)}
                          </div>
                          <div style={{ ...attachmentSubStyle }}>
                            {safeText(participant.phone)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={infoValueStyle}>—</div>
                )}
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Internal Notes</h3>
                <p style={summaryStyle}>
                  {safeText(
                    conversation.internalNotes,
                    "No internal notes added yet."
                  )}
                </p>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Attachments</h3>

                {conversation.attachments && conversation.attachments.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {conversation.attachments.map((attachment) => (
                      <div key={attachment.id} style={attachmentItemStyle}>
                        <div style={attachmentMetaStyle}>
                          <p style={attachmentNameStyle}>{attachment.name}</p>
                          <p style={attachmentSubStyle}>
                            {[attachment.type, attachment.size].filter(Boolean).join(" • ") || "File"}
                          </p>
                        </div>

                        {attachment.url ? (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            style={attachmentLinkStyle}
                          >
                            Open
                          </a>
                        ) : (
                          <span style={attachmentLinkStyle}>View</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={infoValueStyle}>—</div>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}