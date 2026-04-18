import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  Bold,
  Clock3,
  FileText,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  MessageCircleMore,
  Paperclip,
  Phone,
  Save,
  Send,
  Smile,
  Sparkles,
  Trash2,
  Underline,
  User2,
  Wand2,
  X,
} from "lucide-react";

export type MessageComposerChannel =
  | "sms"
  | "whatsapp"
  | "chat"
  | "internal"
  | "email"
  | "call";

export interface MessageComposerAttachment {
  id: string | number;
  name: string;
  sizeLabel?: string;
  typeLabel?: string;
}

export interface MessageComposerRecipient {
  id?: string | number;
  name: string;
  subtitle?: string;
  phone?: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface MessageComposerQuickReply {
  id: string | number;
  label: string;
  value: string;
}

export interface MessageComposerProps {
  value?: string;
  subject?: string;
  className?: string;
  disabled?: boolean;
  sending?: boolean;
  savingDraft?: boolean;
  channel?: MessageComposerChannel;
  recipient?: MessageComposerRecipient;
  attachments?: MessageComposerAttachment[];
  quickReplies?: MessageComposerQuickReply[];
  showSubject?: boolean;
  showPreview?: boolean;
  showToolbar?: boolean;
  errorMessage?: string;
  placeholder?: string;
  onChange?: (value: { subject: string; message: string }) => void;
  onSend?: (value: { subject: string; message: string }) => void;
  onSaveDraft?: (value: { subject: string; message: string }) => void;
  onDiscard?: () => void;
  onAttachClick?: () => void;
  onRemoveAttachment?: (attachmentId: string | number) => void;
  onTogglePreview?: () => void;
  onQuickReplyClick?: (reply: MessageComposerQuickReply) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string) => {
  if (!value) return "U";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const getChannelMeta = (channel: MessageComposerChannel = "chat") => {
  switch (channel) {
    case "sms":
      return {
        label: "SMS",
        icon: <Phone className="h-4 w-4" />,
        badgeClass:
          "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-300",
      };
    case "whatsapp":
      return {
        label: "WhatsApp",
        icon: <MessageCircleMore className="h-4 w-4" />,
        badgeClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
      };
    case "internal":
      return {
        label: "Internal Chat",
        icon: <User2 className="h-4 w-4" />,
        badgeClass:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
      };
    case "email":
      return {
        label: "Email Style",
        icon: <FileText className="h-4 w-4" />,
        badgeClass:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300",
      };
    case "call":
      return {
        label: "Call Follow-up",
        icon: <Phone className="h-4 w-4" />,
        badgeClass:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300",
      };
    case "chat":
    default:
      return {
        label: "Chat",
        icon: <MessageCircleMore className="h-4 w-4" />,
        badgeClass:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
      };
  }
};

const ToolbarButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ title, icon, onClick, disabled }) => {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {icon}
    </button>
  );
};

const SectionLabel: React.FC<{
  label: string;
  action?: React.ReactNode;
}> = ({ label, action }) => {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {action}
    </div>
  );
};

const MessageComposer: React.FC<MessageComposerProps> = ({
  value = "",
  subject = "",
  className,
  disabled = false,
  sending = false,
  savingDraft = false,
  channel = "chat",
  recipient,
  attachments = [],
  quickReplies = [],
  showSubject = false,
  showPreview = false,
  showToolbar = true,
  errorMessage,
  placeholder = "Write your message...",
  onChange,
  onSend,
  onSaveDraft,
  onDiscard,
  onAttachClick,
  onRemoveAttachment,
  onTogglePreview,
  onQuickReplyClick,
}) => {
  const [form, setForm] = useState({
    subject,
    message: value,
  });

  const channelMeta = getChannelMeta(channel);

  const handleFieldChange = (field: "subject" | "message", nextValue: string) => {
    const next = { ...form, [field]: nextValue };
    setForm(next);
    onChange?.(next);
  };

  const insertAtCursor = (prefix: string, suffix = "") => {
    const textarea = document.getElementById("message-composer-body") as HTMLTextAreaElement | null;

    if (!textarea) {
      handleFieldChange("message", `${form.message}${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart ?? form.message.length;
    const end = textarea.selectionEnd ?? form.message.length;
    const selectedText = form.message.slice(start, end);

    const nextMessage =
      form.message.slice(0, start) +
      prefix +
      selectedText +
      suffix +
      form.message.slice(end);

    handleFieldChange("message", nextMessage);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const messageLength = form.message.trim().length;

  const stats = useMemo(() => {
    const characters = form.message.length;
    const words = form.message.trim() ? form.message.trim().split(/\s+/).length : 0;
    const smsSegments =
      channel === "sms" ? Math.max(1, Math.ceil(Math.max(characters, 1) / 160)) : 0;

    return {
      characters,
      words,
      smsSegments,
    };
  }, [channel, form.message]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <MessageCircleMore className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                    Message Composer
                  </h2>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      channelMeta.badgeClass
                    )}
                  >
                    {channelMeta.icon}
                    {channelMeta.label}
                  </span>
                </div>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Fast, precise, and clean — built for follow-up, clarity, and conversion.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onTogglePreview}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <ArrowRight className="h-4 w-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              type="button"
              disabled={disabled || savingDraft}
              onClick={() => onSaveDraft?.(form)}
              className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <Save className="h-4 w-4" />
              {savingDraft ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={disabled || sending || messageLength === 0}
              onClick={() => onSend?.(form)}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 p-5">
          {recipient ? (
            <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {recipient.avatarUrl ? (
                    <img
                      src={recipient.avatarUrl}
                      alt={recipient.name}
                      className="h-11 w-11 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                      {getInitials(recipient.name)}
                    </div>
                  )}

                  {recipient.isOnline ? (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {recipient.name}
                    </p>
                    {recipient.phone ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {recipient.phone}
                      </span>
                    ) : null}
                  </div>
                  {recipient.subtitle ? (
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {recipient.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="space-y-4">
            {showSubject ? (
              <div>
                <SectionLabel label="Subject" />
                <input
                  type="text"
                  value={form.subject}
                  disabled={disabled}
                  onChange={(e) => handleFieldChange("subject", e.target.value)}
                  placeholder="Add subject..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
                />
              </div>
            ) : null}

            {showToolbar ? (
              <div>
                <SectionLabel
                  label="Composer Tools"
                  action={
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      onClick={() => insertAtCursor("{{first_name}}")}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Insert Merge Tag
                    </button>
                  }
                />
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                  <ToolbarButton
                    title="Bold"
                    icon={<Bold className="h-4 w-4" />}
                    onClick={() => insertAtCursor("**", "**")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Italic"
                    icon={<Italic className="h-4 w-4" />}
                    onClick={() => insertAtCursor("*", "*")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Underline"
                    icon={<Underline className="h-4 w-4" />}
                    onClick={() => insertAtCursor("<u>", "</u>")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Bulleted List"
                    icon={<List className="h-4 w-4" />}
                    onClick={() => insertAtCursor("\n• ")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Link"
                    icon={<LinkIcon className="h-4 w-4" />}
                    onClick={() => insertAtCursor("[Link text](", ")")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Mention"
                    icon={<AtSign className="h-4 w-4" />}
                    onClick={() => insertAtCursor("@")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Emoji Placeholder"
                    icon={<Smile className="h-4 w-4" />}
                    onClick={() => insertAtCursor("🙂")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Insert Image Placeholder"
                    icon={<ImageIcon className="h-4 w-4" />}
                    onClick={() => insertAtCursor("\n[Image]\n")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Attach File"
                    icon={<Paperclip className="h-4 w-4" />}
                    onClick={onAttachClick}
                    disabled={disabled}
                  />
                </div>
              </div>
            ) : null}

            {quickReplies.length > 0 ? (
              <div>
                <SectionLabel label="Quick Replies" />
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => {
                        handleFieldChange("message", reply.value);
                        onQuickReplyClick?.(reply);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-950"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <SectionLabel
                label="Message"
                action={
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {stats.characters} chars • {stats.words} words
                  </span>
                }
              />
              <textarea
                id="message-composer-body"
                value={form.message}
                disabled={disabled}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                placeholder={placeholder}
                className="min-h-[260px] w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
              />
            </div>

            {attachments.length > 0 ? (
              <div>
                <SectionLabel label="Attachments" />
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {attachment.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {[attachment.typeLabel, attachment.sizeLabel].filter(Boolean).join(" • ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveAttachment?.(attachment.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-l border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Delivery Snapshot
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Quick checks before the message goes live.
                  </p>
                </div>
                <Clock3 className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Channel
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {channelMeta.label}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Content
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {messageLength > 0 ? "Ready to send" : "Needs message content"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Attachments
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {attachments.length} attached
                  </p>
                </div>

                {channel === "sms" ? (
                  <div className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2.5 dark:border-violet-900 dark:bg-violet-950/20">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                      SMS Segments
                    </p>
                    <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-200">
                      {stats.smsSegments} segment{stats.smsSegments > 1 ? "s" : ""}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {showPreview ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Live Preview
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      A quick glance at the outbound message.
                    </p>
                  </div>
                  <MessageCircleMore className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="max-w-[90%] rounded-[20px] bg-slate-900 px-4 py-3 text-sm leading-6 text-white dark:bg-white dark:text-slate-900">
                    {form.subject && showSubject ? (
                      <p className="mb-2 font-semibold">{form.subject}</p>
                    ) : null}
                    {form.message.trim() ? (
                      form.message.split("\n").map((line, index) => (
                        <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
                      ))
                    ) : (
                      <p className="text-white/70 dark:text-slate-500">
                        Your preview will appear here once you start writing.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Quick Actions
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Tight little shortcuts for faster replies.
                  </p>
                </div>
                <Sparkles className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => insertAtCursor("Hi {{first_name}}, ")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <Sparkles className="h-4 w-4" />
                  Insert Greeting
                </button>

                <button
                  type="button"
                  onClick={onAttachClick}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <Paperclip className="h-4 w-4" />
                  Add Attachment
                </button>

                <button
                  type="button"
                  onClick={onDiscard}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Discard Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;