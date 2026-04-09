import { useEffect, useMemo, useState } from "react";

export type LeadNoteItem = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
};

type LeadNotesPanelProps = {
  leadId: string;
  title?: string;
  initialNotes?: LeadNoteItem[];
  storageKey?: string;
  onNotesChange?: (notes: LeadNoteItem[]) => void;
};

const DEFAULT_STORAGE_KEY = "mei-crm-lead-notes";

export default function LeadNotesPanel({
  leadId,
  title = "Lead Notes",
  initialNotes = [],
  storageKey = DEFAULT_STORAGE_KEY,
  onNotesChange,
}: LeadNotesPanelProps) {
  const [notes, setNotes] = useState<LeadNoteItem[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const storageId = useMemo(() => `${storageKey}-${leadId}`, [storageKey, leadId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageId);
      if (raw) {
        const parsed = JSON.parse(raw) as LeadNoteItem[];
        setNotes(sortNotes(parsed));
        return;
      }
    } catch (error) {
      console.error("Failed to read lead notes:", error);
    }

    setNotes(sortNotes(initialNotes));
  }, [storageId, initialNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(storageId, JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save lead notes:", error);
    }
    onNotesChange?.(notes);
  }, [notes, storageId, onNotesChange]);

  const pinnedCount = notes.filter((note) => note.isPinned).length;

  const addNote = () => {
    const content = draft.trim();
    if (!content) return;

    const now = new Date().toISOString();

    const newNote: LeadNoteItem = {
      id: `note-${Date.now()}`,
      content,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
    };

    setNotes((prev) => sortNotes([newNote, ...prev]));
    setDraft("");
  };

  const startEdit = (note: LeadNoteItem) => {
    setEditingId(note.id);
    setEditingValue(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = (id: string) => {
    const content = editingValue.trim();
    if (!content) return;

    setNotes((prev) =>
      sortNotes(
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                content,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      )
    );

    cancelEdit();
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      sortNotes(
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                isPinned: !note.isPinned,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      )
    );
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Track conversations, requirements, objections, and follow-up clues.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <StatBadge label="Total" value={String(notes.length)} />
          <StatBadge label="Pinned" value={String(pinnedCount)} />
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 16,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#334155",
          }}
        >
          Add New Note
        </label>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write something important about this lead..."
          rows={4}
          style={{
            width: "100%",
            resize: "vertical",
            borderRadius: 14,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            padding: "12px 14px",
            fontSize: 14,
            lineHeight: 1.5,
            color: "#0f172a",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={addNote}
            disabled={!draft.trim()}
            style={{
              ...primaryButtonStyle,
              opacity: draft.trim() ? 1 : 0.55,
              cursor: draft.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Note
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {notes.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: 18,
              background: "#f8fafc",
              padding: "28px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              No notes yet
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Start adding lead insights, requirement details, and conversation highlights.
            </div>
          </div>
        ) : (
          notes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <article
                key={note.id}
                style={{
                  border: note.isPinned ? "1px solid #f59e0b" : "1px solid #e2e8f0",
                  borderRadius: 18,
                  background: note.isPinned ? "#fffbeb" : "#ffffff",
                  padding: 16,
                  boxShadow: note.isPinned
                    ? "0 10px 20px rgba(245, 158, 11, 0.10)"
                    : "0 6px 16px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {note.isPinned ? (
                      <span style={pinnedBadgeStyle}>📌 Pinned</span>
                    ) : null}
                    <span style={metaBadgeStyle}>
                      Created: {formatDateTime(note.createdAt)}
                    </span>
                    <span style={metaBadgeStyle}>
                      Updated: {formatDateTime(note.updatedAt)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => togglePin(note.id)}
                      style={miniButtonStyle}
                    >
                      {note.isPinned ? "Unpin" : "Pin"}
                    </button>

                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        style={miniButtonStyle}
                      >
                        Edit
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      style={{
                        ...miniButtonStyle,
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <textarea
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      rows={4}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        borderRadius: 14,
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        padding: "12px 14px",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#0f172a",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={secondaryButtonStyle}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(note.id)}
                        disabled={!editingValue.trim()}
                        style={{
                          ...primaryButtonStyle,
                          opacity: editingValue.trim() ? 1 : 0.55,
                          cursor: editingValue.trim() ? "pointer" : "not-allowed",
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#334155",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {note.content}
                  </p>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function sortNotes(notes: LeadNoteItem[]) {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        minWidth: 76,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#0f172a",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const miniButtonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const metaBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#475569",
  fontSize: 12,
  fontWeight: 700,
};

const pinnedBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#fef3c7",
  color: "#b45309",
  fontSize: 12,
  fontWeight: 800,
};