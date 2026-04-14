// src/hooks/communications/useInternalNotes.ts

import { useEffect, useMemo, useState } from "react";

export interface InternalNoteRecord {
  id: string;
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  tags: string[];
}

export interface InternalNoteInput {
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  title: string;
  body: string;
  authorName: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface InternalNotesFilterState {
  searchQuery: string;
  authorName: string;
  tag: string | "all";
  conversationId: string | "all";
  leadId: string | "all";
  contactId: string | "all";
  includeArchived: boolean;
  pinnedOnly: boolean;
  sortBy: "latest" | "oldest" | "title-asc" | "title-desc";
}

export interface UseInternalNotesOptions {
  storageKey?: string;
  seedDemoData?: boolean;
  initialFilters?: Partial<InternalNotesFilterState>;
}

export interface UseInternalNotesResult {
  notes: InternalNoteRecord[];
  filteredNotes: InternalNoteRecord[];
  pinnedNotes: InternalNoteRecord[];
  archivedNotes: InternalNoteRecord[];
  activeNotes: InternalNoteRecord[];

  filters: InternalNotesFilterState;
  setSearchQuery: (value: string) => void;
  setAuthorName: (value: string) => void;
  setTag: (value: string | "all") => void;
  setConversationId: (value: string | "all") => void;
  setLeadId: (value: string | "all") => void;
  setContactId: (value: string | "all") => void;
  setIncludeArchived: (value: boolean) => void;
  setPinnedOnly: (value: boolean) => void;
  setSortBy: (
    value: InternalNotesFilterState["sortBy"]
  ) => void;
  clearFilters: () => void;

  addNote: (input: InternalNoteInput) => InternalNoteRecord;
  updateNote: (
    noteId: string,
    updates: Partial<Omit<InternalNoteRecord, "id" | "createdAt">>
  ) => InternalNoteRecord | null;
  deleteNote: (noteId: string) => void;
  pinNote: (noteId: string) => InternalNoteRecord | null;
  unpinNote: (noteId: string) => InternalNoteRecord | null;
  archiveNote: (noteId: string) => InternalNoteRecord | null;
  unarchiveNote: (noteId: string) => InternalNoteRecord | null;
  getNoteById: (noteId: string) => InternalNoteRecord | undefined;
  getNotesByConversationId: (conversationId: string) => InternalNoteRecord[];
  getNotesByLeadId: (leadId: string) => InternalNoteRecord[];
  getNotesByContactId: (contactId: string) => InternalNoteRecord[];

  totalCount: number;
  filteredCount: number;
  pinnedCount: number;
  archivedCount: number;
  activeCount: number;
  availableTags: string[];
}

const DEFAULT_STORAGE_KEY = "mei-crm-internal-notes";

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getNowIso(): string {
  return new Date().toISOString();
}

function isValidDate(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function generateId(prefix = "note"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeNote(input: Partial<InternalNoteRecord>): InternalNoteRecord {
  const now = getNowIso();

  return {
    id: typeof input.id === "string" && input.id.trim() ? input.id : generateId(),
    conversationId:
      typeof input.conversationId === "string" && input.conversationId.trim()
        ? input.conversationId
        : undefined,
    leadId:
      typeof input.leadId === "string" && input.leadId.trim()
        ? input.leadId
        : undefined,
    contactId:
      typeof input.contactId === "string" && input.contactId.trim()
        ? input.contactId
        : undefined,
    title:
      typeof input.title === "string" && input.title.trim()
        ? input.title.trim()
        : "Untitled Note",
    body:
      typeof input.body === "string" && input.body.trim()
        ? input.body.trim()
        : "",
    authorName:
      typeof input.authorName === "string" && input.authorName.trim()
        ? input.authorName.trim()
        : "Unknown Author",
    createdAt: isValidDate(input.createdAt) ? String(input.createdAt) : now,
    updatedAt: isValidDate(input.updatedAt) ? String(input.updatedAt) : now,
    isPinned: Boolean(input.isPinned),
    isArchived: Boolean(input.isArchived),
    tags: normalizeTags(input.tags),
  };
}

function sortNotes(
  notes: InternalNoteRecord[],
  sortBy: InternalNotesFilterState["sortBy"]
): InternalNoteRecord[] {
  const sorted = [...notes];

  sorted.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    switch (sortBy) {
      case "oldest":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

      case "title-asc":
        return a.title.localeCompare(b.title);

      case "title-desc":
        return b.title.localeCompare(a.title);

      case "latest":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return sorted;
}

function seedInternalNotes(): InternalNoteRecord[] {
  const now = getNowIso();

  return [
    {
      id: generateId(),
      conversationId: "conv-001",
      leadId: "lead-001",
      contactId: "contact-001",
      title: "Client prefers premium inventory",
      body: "Spoke internally with sales team. Client is more interested in premium gated community options and flexible payment discussions.",
      authorName: "Balraj",
      createdAt: now,
      updatedAt: now,
      isPinned: true,
      isArchived: false,
      tags: ["premium", "sales", "priority"],
    },
    {
      id: generateId(),
      conversationId: "conv-002",
      leadId: "lead-002",
      contactId: "contact-002",
      title: "Follow-up after site visit",
      body: "Need to share brochure PDF and unit availability sheet after tomorrow morning.",
      authorName: "Balraj",
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      isArchived: false,
      tags: ["site visit", "brochure"],
    },
    {
      id: generateId(),
      conversationId: "conv-003",
      leadId: "lead-003",
      contactId: "contact-003",
      title: "Archived negotiation context",
      body: "Earlier negotiation note saved for future reference. Budget sensitivity was high.",
      authorName: "Balraj",
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      isArchived: true,
      tags: ["negotiation", "archive"],
    },
  ].map(normalizeNote);
}

export default function useInternalNotes(
  options: UseInternalNotesOptions = {}
): UseInternalNotesResult {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    seedDemoData = true,
    initialFilters,
  } = options;

  const [notes, setNotes] = useState<InternalNoteRecord[]>([]);
  const [filters, setFilters] = useState<InternalNotesFilterState>({
    searchQuery: initialFilters?.searchQuery ?? "",
    authorName: initialFilters?.authorName ?? "",
    tag: initialFilters?.tag ?? "all",
    conversationId: initialFilters?.conversationId ?? "all",
    leadId: initialFilters?.leadId ?? "all",
    contactId: initialFilters?.contactId ?? "all",
    includeArchived: initialFilters?.includeArchived ?? false,
    pinnedOnly: initialFilters?.pinnedOnly ?? false,
    sortBy: initialFilters?.sortBy ?? "latest",
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<InternalNoteRecord>[];
        setNotes(parsed.map(normalizeNote));
        return;
      }

      if (seedDemoData) {
        setNotes(seedInternalNotes());
      }
    } catch {
      if (seedDemoData) {
        setNotes(seedInternalNotes());
      }
    }
  }, [storageKey, seedDemoData]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {
      // ignore storage issues
    }
  }, [notes, storageKey]);

  const availableTags = useMemo<string[]>(() => {
    return Array.from(
      new Set(notes.flatMap((note) => note.tags))
    ).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo<InternalNoteRecord[]>(() => {
    const query = normalizeText(filters.searchQuery);

    const result = notes.filter((note) => {
      if (!filters.includeArchived && note.isArchived) {
        return false;
      }

      if (filters.pinnedOnly && !note.isPinned) {
        return false;
      }

      if (
        filters.authorName.trim() &&
        !normalizeText(note.authorName).includes(normalizeText(filters.authorName))
      ) {
        return false;
      }

      if (filters.tag !== "all" && !note.tags.includes(filters.tag)) {
        return false;
      }

      if (
        filters.conversationId !== "all" &&
        note.conversationId !== filters.conversationId
      ) {
        return false;
      }

      if (filters.leadId !== "all" && note.leadId !== filters.leadId) {
        return false;
      }

      if (filters.contactId !== "all" && note.contactId !== filters.contactId) {
        return false;
      }

      if (query) {
        const matches =
          normalizeText(note.title).includes(query) ||
          normalizeText(note.body).includes(query) ||
          normalizeText(note.authorName).includes(query) ||
          normalizeText(note.conversationId).includes(query) ||
          normalizeText(note.leadId).includes(query) ||
          normalizeText(note.contactId).includes(query) ||
          note.tags.some((tag) => normalizeText(tag).includes(query));

        if (!matches) {
          return false;
        }
      }

      return true;
    });

    return sortNotes(result, filters.sortBy);
  }, [notes, filters]);

  const pinnedNotes = useMemo<InternalNoteRecord[]>(() => {
    return filteredNotes.filter((note) => note.isPinned);
  }, [filteredNotes]);

  const archivedNotes = useMemo<InternalNoteRecord[]>(() => {
    return filteredNotes.filter((note) => note.isArchived);
  }, [filteredNotes]);

  const activeNotes = useMemo<InternalNoteRecord[]>(() => {
    return filteredNotes.filter((note) => !note.isArchived);
  }, [filteredNotes]);

  const addNote = (input: InternalNoteInput): InternalNoteRecord => {
    const now = getNowIso();

    const newNote = normalizeNote({
      id: generateId(),
      conversationId: input.conversationId,
      leadId: input.leadId,
      contactId: input.contactId,
      title: input.title,
      body: input.body,
      authorName: input.authorName,
      createdAt: now,
      updatedAt: now,
      isPinned: Boolean(input.isPinned),
      isArchived: false,
      tags: input.tags ?? [],
    });

    setNotes((current) => sortNotes([newNote, ...current], "latest"));
    return newNote;
  };

  const updateNote = (
    noteId: string,
    updates: Partial<Omit<InternalNoteRecord, "id" | "createdAt">>
  ): InternalNoteRecord | null => {
    const existing = notes.find((note) => note.id === noteId);

    if (!existing) {
      return null;
    }

    const updatedNote = normalizeNote({
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: getNowIso(),
    });

    setNotes((current) =>
      current.map((note) => (note.id === noteId ? updatedNote : note))
    );

    return updatedNote;
  };

  const deleteNote = (noteId: string) => {
    setNotes((current) => current.filter((note) => note.id !== noteId));
  };

  const pinNote = (noteId: string): InternalNoteRecord | null => {
    return updateNote(noteId, { isPinned: true });
  };

  const unpinNote = (noteId: string): InternalNoteRecord | null => {
    return updateNote(noteId, { isPinned: false });
  };

  const archiveNote = (noteId: string): InternalNoteRecord | null => {
    return updateNote(noteId, { isArchived: true });
  };

  const unarchiveNote = (noteId: string): InternalNoteRecord | null => {
    return updateNote(noteId, { isArchived: false });
  };

  const getNoteById = (noteId: string): InternalNoteRecord | undefined => {
    return notes.find((note) => note.id === noteId);
  };

  const getNotesByConversationId = (conversationId: string): InternalNoteRecord[] => {
    return sortNotes(
      notes.filter((note) => note.conversationId === conversationId),
      "latest"
    );
  };

  const getNotesByLeadId = (leadId: string): InternalNoteRecord[] => {
    return sortNotes(
      notes.filter((note) => note.leadId === leadId),
      "latest"
    );
  };

  const getNotesByContactId = (contactId: string): InternalNoteRecord[] => {
    return sortNotes(
      notes.filter((note) => note.contactId === contactId),
      "latest"
    );
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      authorName: "",
      tag: "all",
      conversationId: "all",
      leadId: "all",
      contactId: "all",
      includeArchived: false,
      pinnedOnly: false,
      sortBy: "latest",
    });
  };

  return {
    notes,
    filteredNotes,
    pinnedNotes,
    archivedNotes,
    activeNotes,

    filters,
    setSearchQuery: (value) =>
      setFilters((current) => ({ ...current, searchQuery: value })),
    setAuthorName: (value) =>
      setFilters((current) => ({ ...current, authorName: value })),
    setTag: (value) =>
      setFilters((current) => ({ ...current, tag: value })),
    setConversationId: (value) =>
      setFilters((current) => ({ ...current, conversationId: value })),
    setLeadId: (value) =>
      setFilters((current) => ({ ...current, leadId: value })),
    setContactId: (value) =>
      setFilters((current) => ({ ...current, contactId: value })),
    setIncludeArchived: (value) =>
      setFilters((current) => ({ ...current, includeArchived: value })),
    setPinnedOnly: (value) =>
      setFilters((current) => ({ ...current, pinnedOnly: value })),
    setSortBy: (value) =>
      setFilters((current) => ({ ...current, sortBy: value })),
    clearFilters,

    addNote,
    updateNote,
    deleteNote,
    pinNote,
    unpinNote,
    archiveNote,
    unarchiveNote,
    getNoteById,
    getNotesByConversationId,
    getNotesByLeadId,
    getNotesByContactId,

    totalCount: notes.length,
    filteredCount: filteredNotes.length,
    pinnedCount: notes.filter((note) => note.isPinned).length,
    archivedCount: notes.filter((note) => note.isArchived).length,
    activeCount: notes.filter((note) => !note.isArchived).length,
    availableTags,
  };
}