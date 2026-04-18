import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  AtSign,
  Bold,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  Paperclip,
  Save,
  Send,
  Sparkles,
  Trash2,
  Underline,
  X,
} from "lucide-react";

export interface EmailComposerRecipientOption {
  label: string;
  value: string;
}

export interface EmailComposerAttachment {
  id: string | number;
  name: string;
  sizeLabel?: string;
  typeLabel?: string;
}

export interface EmailComposerProps {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  className?: string;
  disabled?: boolean;
  sending?: boolean;
  savingDraft?: boolean;
  showPreview?: boolean;
  showToolbar?: boolean;
  showCcBccByDefault?: boolean;
  recipientSuggestions?: EmailComposerRecipientOption[];
  attachments?: EmailComposerAttachment[];
  errorMessage?: string;
  onChange?: (value: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
  }) => void;
  onSend?: (value: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
  }) => void;
  onSaveDraft?: (value: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
  }) => void;
  onDiscard?: () => void;
  onTogglePreview?: () => void;
  onAttachClick?: () => void;
  onRemoveAttachment?: (attachmentId: string | number) => void;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

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

const EmailComposer: React.FC<EmailComposerProps> = ({
  to = "",
  cc = "",
  bcc = "",
  subject = "",
  body = "",
  className,
  disabled = false,
  sending = false,
  savingDraft = false,
  showPreview = false,
  showToolbar = true,
  showCcBccByDefault = false,
  recipientSuggestions = [],
  attachments = [],
  errorMessage,
  onChange,
  onSend,
  onSaveDraft,
  onDiscard,
  onTogglePreview,
  onAttachClick,
  onRemoveAttachment,
}) => {
  const [form, setForm] = useState({
    to,
    cc,
    bcc,
    subject,
    body,
  });

  const [showCc, setShowCc] = useState(showCcBccByDefault || !!cc);
  const [showBcc, setShowBcc] = useState(showCcBccByDefault || !!bcc);

  const hasRecipients = useMemo(
    () => form.to.trim().length > 0 || form.cc.trim().length > 0 || form.bcc.trim().length > 0,
    [form.to, form.cc, form.bcc]
  );

  const handleFieldChange = (
    field: "to" | "cc" | "bcc" | "subject" | "body",
    value: string
  ) => {
    const next = { ...form, [field]: value };
    setForm(next);
    onChange?.(next);
  };

  const insertAtCursor = (prefix: string, suffix = "") => {
    const textarea = document.getElementById("email-composer-body") as HTMLTextAreaElement | null;

    if (!textarea) {
      handleFieldChange("body", `${form.body}${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart ?? form.body.length;
    const end = textarea.selectionEnd ?? form.body.length;
    const selectedText = form.body.slice(start, end);
    const nextBody =
      form.body.slice(0, start) +
      prefix +
      selectedText +
      suffix +
      form.body.slice(end);

    handleFieldChange("body", nextBody);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const previewHtml = useMemo(() => {
    return form.body
      .split("\n")
      .filter(Boolean)
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }, [form.body]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Email Composer
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Shape the message with clarity, warmth, and a little bit of sharp intent.
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
              <Eye className="h-4 w-4" />
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
              disabled={disabled || sending || !hasRecipients || !form.subject.trim()}
              onClick={() => onSend?.(form)}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 p-5">
          {errorMessage ? (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <SectionLabel
                label="Recipients"
                action={
                  <div className="flex items-center gap-2">
                    {!showCc ? (
                      <button
                        type="button"
                        onClick={() => setShowCc(true)}
                        className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Add Cc
                      </button>
                    ) : null}

                    {!showBcc ? (
                      <button
                        type="button"
                        onClick={() => setShowBcc(true)}
                        className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Add Bcc
                      </button>
                    ) : null}
                  </div>
                }
              />

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="w-8 shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
                      To
                    </span>
                    <input
                      type="text"
                      list="email-composer-recipient-suggestions"
                      value={form.to}
                      disabled={disabled}
                      onChange={(e) => handleFieldChange("to", e.target.value)}
                      placeholder="Add recipients..."
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {showCc ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="w-8 shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Cc
                      </span>
                      <input
                        type="text"
                        value={form.cc}
                        disabled={disabled}
                        onChange={(e) => handleFieldChange("cc", e.target.value)}
                        placeholder="Add Cc recipients..."
                        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCc(false);
                          handleFieldChange("cc", "");
                        }}
                        className="text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {showBcc ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="w-8 shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Bcc
                      </span>
                      <input
                        type="text"
                        value={form.bcc}
                        disabled={disabled}
                        onChange={(e) => handleFieldChange("bcc", e.target.value)}
                        placeholder="Add Bcc recipients..."
                        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowBcc(false);
                          handleFieldChange("bcc", "");
                        }}
                        className="text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {recipientSuggestions.length > 0 ? (
                <datalist id="email-composer-recipient-suggestions">
                  {recipientSuggestions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </datalist>
              ) : null}
            </div>

            <div>
              <SectionLabel label="Subject" />
              <input
                type="text"
                value={form.subject}
                disabled={disabled}
                onChange={(e) => handleFieldChange("subject", e.target.value)}
                placeholder="Write a clear subject line..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
              />
            </div>

            {showToolbar ? (
              <div>
                <SectionLabel
                  label="Formatting"
                  action={
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      onClick={() => insertAtCursor("{{", "}}")}
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
                    title="Insert Link"
                    icon={<LinkIcon className="h-4 w-4" />}
                    onClick={() => insertAtCursor("[Link text](", ")")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Insert Mention"
                    icon={<AtSign className="h-4 w-4" />}
                    onClick={() => insertAtCursor("@")}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Attach File"
                    icon={<Paperclip className="h-4 w-4" />}
                    onClick={onAttachClick}
                    disabled={disabled}
                  />
                  <ToolbarButton
                    title="Insert Image"
                    icon={<ImageIcon className="h-4 w-4" />}
                    onClick={() => insertAtCursor("\n[Image]\n")}
                    disabled={disabled}
                  />
                </div>
              </div>
            ) : null}

            <div>
              <SectionLabel label="Message" />
              <textarea
                id="email-composer-body"
                value={form.body}
                disabled={disabled}
                onChange={(e) => handleFieldChange("body", e.target.value)}
                placeholder="Write your email here..."
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
                    Quick check before your message leaves the dock.
                  </p>
                </div>
                <Clock3 className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Recipients
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {hasRecipients ? "Ready" : "Missing recipients"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Subject
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {form.subject.trim() ? "Ready" : "Subject needed"}
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
                      A clean glance at how the email will read.
                    </p>
                  </div>
                  <Eye className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Subject</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {form.subject || "No subject"}
                    </p>
                  </div>

                  <div className="bg-white px-4 py-4 dark:bg-slate-950">
                    {form.body.trim() ? (
                      <div
                        className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-200"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
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
                    Keep the flow crisp and the desk clean.
                  </p>
                </div>
                <ChevronDown className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
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
                  onClick={() => insertAtCursor("{{first_name}}")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <Sparkles className="h-4 w-4" />
                  Insert First Name Tag
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

export default EmailComposer;