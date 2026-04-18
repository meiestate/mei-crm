import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Bold,
  Bookmark,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Flag,
  Hash,
  Info,
  Italic,
  List,
  Lock,
  Pin,
  Save,
  Sparkles,
  Tag,
  Trash2,
  Underline,
  UserPlus,
  X,
} from "lucide-react";

export interface InternalNoteTag {
  id: string | number;
  label: string;
}

export interface InternalNoteMentionOption {
  id: string | number;
  label: string;
  value: string;
}

export interface InternalNoteAttachment {
  id: string | number;
  name: string;
  sizeLabel?: string;
  typeLabel?: string;
}

export interface InternalNoteComposerProps {
  title?: string;
  note?: string;
  className?: string;
  disabled?: boolean;
  saving?: boolean;
  pinned?: boolean;
  privateNote?: boolean;
  tags?: InternalNoteTag[];
  mentionSuggestions?: InternalNoteMentionOption[];
  attachments?: InternalNoteAttachment[];
  errorMessage?: string;
  showPreview?: boolean;
  onChange?: (value: {
    title: string;
    note: string;
    pinned: boolean;
    privateNote: boolean;
    tags: InternalNoteTag[];
  }) => void;
  onSave?: (value: {
    title: string;
    note: string;
    pinned: boolean;
    privateNote: boolean;
    tags: InternalNoteTag[];
  }) => void;
  onDiscard?: () => void;
  onTogglePreview?: () => void;
  onTogglePinned?: (value: boolean) => void;
  onTogglePrivate?: (value: boolean) => void;
  onAddTag?: () => void;
  onRemoveTag?: (tagId: string | number) => void;
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

const ToggleCard: React.FC<{
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}> = ({ label, description, icon, checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition",
        checked
          ? "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20"
          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-950",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl",
          checked
            ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
            : "bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400"
        )}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </p>
          <span
            className={cn(
              "inline-flex h-6 w-11 items-center rounded-full p-1 transition",
              checked
                ? "bg-sky-500 justify-end"
                : "bg-slate-300 justify-start dark:bg-slate-700"
            )}
          >
            <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
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

const InternalNoteComposer: React.FC<InternalNoteComposerProps> = ({
  title = "",
  note = "",
  className,
  disabled = false,
  saving = false,
  pinned = false,
  privateNote = true,
  tags = [],
  mentionSuggestions = [],
  attachments = [],
  errorMessage,
  showPreview = false,
  onChange,
  onSave,
  onDiscard,
  onTogglePreview,
  onTogglePinned,
  onTogglePrivate,
  onAddTag,
  onRemoveTag,
  onAttachClick,
  onRemoveAttachment,
}) => {
  const [form, setForm] = useState({
    title,
    note,
    pinned,
    privateNote,
    tags,
  });

  const handleChange = (
    field: "title" | "note" | "pinned" | "privateNote" | "tags",
    value: string | boolean | InternalNoteTag[]
  ) => {
    const next = {
      ...form,
      [field]: value,
    } as typeof form;

    setForm(next);
    onChange?.(next);
  };

  const insertAtCursor = (prefix: string, suffix = "") => {
    const textarea = document.getElementById("internal-note-composer-body") as HTMLTextAreaElement | null;

    if (!textarea) {
      handleChange("note", `${form.note}${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart ?? form.note.length;
    const end = textarea.selectionEnd ?? form.note.length;
    const selected = form.note.slice(start, end);

    const nextValue =
      form.note.slice(0, start) + prefix + selected + suffix + form.note.slice(end);

    handleChange("note", nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const previewParagraphs = useMemo(() => {
    return form.note
      .split("\n")
      .filter((line) => line.trim().length > 0);
  }, [form.note]);

  const handlePinnedToggle = (value: boolean) => {
    handleChange("pinned", value);
    onTogglePinned?.(value);
  };

  const handlePrivateToggle = (value: boolean) => {
    handleChange("privateNote", value);
    onTogglePrivate?.(value);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Internal Note Composer
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Capture signal, context, and decision trails without losing the thread.
              </p>
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
              disabled={disabled || saving}
              onClick={() => onSave?.(form)}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Note"}
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
                label="Title"
                action={
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Optional but useful
                  </span>
                }
              />
              <input
                type="text"
                value={form.title}
                disabled={disabled}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Add a short internal note title..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
              />
            </div>

            <div>
              <SectionLabel
                label="Formatting"
                action={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    onClick={() => insertAtCursor("{{context}}")}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Insert Context Tag
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
                  title="List"
                  icon={<List className="h-4 w-4" />}
                  onClick={() => insertAtCursor("\n• ")}
                  disabled={disabled}
                />
                <ToolbarButton
                  title="Insert Mention"
                  icon={<UserPlus className="h-4 w-4" />}
                  onClick={() => insertAtCursor("@")}
                  disabled={disabled}
                />
                <ToolbarButton
                  title="Insert Tag"
                  icon={<Hash className="h-4 w-4" />}
                  onClick={() => insertAtCursor("#")}
                  disabled={disabled}
                />
              </div>
            </div>

            <div>
              <SectionLabel
                label="Note Body"
                action={
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Keep it clear, searchable, and useful later
                  </span>
                }
              />
              <textarea
                id="internal-note-composer-body"
                value={form.note}
                disabled={disabled}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Write internal context, follow-up intelligence, objections, decision notes, handoff comments, or anything the team should know..."
                className="min-h-[280px] w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-700 dark:focus:bg-slate-950"
              />
            </div>

            <div>
              <SectionLabel
                label="Tags"
                action={
                  <button
                    type="button"
                    onClick={onAddTag}
                    className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Add Tag
                  </button>
                }
              />
              {form.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag.label}
                      <button
                        type="button"
                        onClick={() => onRemoveTag?.(tag.id)}
                        className="text-slate-400 transition hover:text-rose-600 dark:hover:text-rose-300"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                  Add tags to make notes easier to filter and revisit later.
                </div>
              )}
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
                    Note Controls
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Decide who sees it and whether it stays at the top.
                  </p>
                </div>
                <Bookmark className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 space-y-3">
                <ToggleCard
                  label="Pinned Note"
                  description="Keep this note visible for quick scanning at the top of the thread."
                  icon={<Pin className="h-4 w-4" />}
                  checked={form.pinned}
                  onChange={handlePinnedToggle}
                  disabled={disabled}
                />

                <ToggleCard
                  label="Private Note"
                  description="Restrict visibility for internal team-only context and sensitive comments."
                  icon={<Lock className="h-4 w-4" />}
                  checked={form.privateNote}
                  onChange={handlePrivateToggle}
                  disabled={disabled}
                />
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
                      A quick glance at how the note will look to the team.
                    </p>
                  </div>
                  <Eye className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  {form.title ? (
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {form.title}
                    </h4>
                  ) : null}

                  <div className={cn(form.title ? "mt-3" : "")}>
                    {previewParagraphs.length > 0 ? (
                      <div className="space-y-3">
                        {previewParagraphs.map((paragraph, index) => (
                          <p
                            key={`${paragraph}-${index}`}
                            className="text-sm leading-6 text-slate-700 dark:text-slate-200"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        Your note preview will appear here once you start typing.
                      </p>
                    )}
                  </div>

                  {(form.tags.length > 0 || form.pinned || form.privateNote) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {form.pinned ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                          <Pin className="h-3.5 w-3.5" />
                          Pinned
                        </span>
                      ) : null}

                      {form.privateNote ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-300">
                          <Lock className="h-3.5 w-3.5" />
                          Private
                        </span>
                      ) : null}

                      {form.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        >
                          <Tag className="h-3.5 w-3.5" />
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Note Health Check
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Tiny signals that help the note stay useful later.
                  </p>
                </div>
                <CheckCircle2 className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Body
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {form.note.trim() ? "Ready" : "Needs note content"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Tags
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {form.tags.length > 0 ? `${form.tags.length} added` : "No tags yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Visibility
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {form.privateNote ? "Private team note" : "Shared internal note"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Quick Actions
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Fast moves for clean note-taking.
                  </p>
                </div>
                <Info className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => insertAtCursor("\nDecision:\n")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <Flag className="h-4 w-4" />
                  Insert Decision Block
                </button>

                <button
                  type="button"
                  onClick={onAttachClick}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <Bookmark className="h-4 w-4" />
                  Add Attachment
                </button>

                <button
                  type="button"
                  onClick={onDiscard}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Discard Note
                </button>
              </div>
            </div>

            {mentionSuggestions.length > 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Mention Suggestions
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Pull people into the thread with a single tap.
                    </p>
                  </div>
                  <Clock3 className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {mentionSuggestions.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => insertAtCursor(`${person.value} `)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-950"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {person.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalNoteComposer;