// src/hooks/communications/useFollowUps.ts

import { useEffect, useMemo, useState } from "react";
import type { CommunicationChannel } from "../../constants/communications/communicationChannels";

export type FollowUpChannel = CommunicationChannel | "call" | "meeting";
export type FollowUpPriority = "low" | "medium" | "high" | "urgent";
export type FollowUpStatus = "pending" | "completed" | "overdue" | "cancelled";

export interface FollowUpRecord {
  id: string;
  title: string;
  description?: string;
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  channel?: FollowUpChannel;
  assigneeName?: string;
  dueAt: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface FollowUpFormInput {
  title: string;
  description?: string;
  conversationId?: string;
  leadId?: string;
  contactId?: string;
  channel?: FollowUpChannel;
  assigneeName?: string;
  dueAt: string;
  priority?: FollowUpPriority;
  tags?: string[];
}

export interface FollowUpFilterState {
  searchQuery: string;
  channel: FollowUpChannel | "all";
  priority: FollowUpPriority | "all";
  status: FollowUpStatus | "all";
  assigneeName: string;
  conversationId: string | "all";
  includeCompleted: boolean;
  dueDateFrom: string | null;
  dueDateTo: string | null;
}

export interface UseFollowUpsOptions {
  storageKey?: string;
  seedDemoData?: boolean;
  initialFilters?: Partial<FollowUpFilterState>;
}

export interface UseFollowUpsResult {
  followUps: FollowUpRecord[];
  filteredFollowUps: FollowUpRecord[];
  todayFollowUps: FollowUpRecord[];
  overdueFollowUps: FollowUpRecord[];
  upcomingFollowUps: FollowUpRecord[];
  completedFollowUps: FollowUpRecord[];

  filters: FollowUpFilterState;
  setSearchQuery: (value: string) => void;
  setChannel: (value: FollowUpChannel | "all") => void;
  setPriority: (value: FollowUpPriority | "all") => void;
  setStatus: (value: FollowUpStatus | "all") => void;
  setAssigneeName: (value: string) => void;
  setConversationId: (value: string | "all") => void;
  setIncludeCompleted: (value: boolean) => void;
  setDueDateFrom: (value: string | null) => void;
  setDueDateTo: (value: string | null) => void;
  clearFilters: () => void;

  addFollowUp: (input: FollowUpFormInput) => FollowUpRecord;
  updateFollowUp: (
    followUpId: string,
    updates: Partial<Omit<FollowUpRecord, "id" | "createdAt">>
  ) => FollowUpRecord | null;
  completeFollowUp: (followUpId: string) => FollowUpRecord | null;
  cancelFollowUp: (followUpId: string) => FollowUpRecord | null;
  deleteFollowUp: (followUpId: string) => void;
  getFollowUpById: (followUpId: string) => FollowUpRecord | undefined;
  getFollowUpsByConversationId: (conversationId: string) => FollowUpRecord[];
  refreshOverdueStatuses: () => void;

  totalCount: number;
  filteredCount: number;
  todayCount: number;
  overdueCount: number;
  upcomingCount: number;
  completedCount: number;
}

const DEFAULT_STORAGE_KEY = "mei-crm-communication-followups";

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function isValidDate(dateString?: string | null): boolean {
  if (!dateString) {
    return false;
  }

  return !Number.isNaN(new Date(dateString).getTime());
}

function getNowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix = "followup"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function endOfToday(): Date {
  const today = startOfToday();
  return new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const start = startOfToday();
  const end = endOfToday();

  return date >= start && date <= end;
}

function isFollowUpChannel(value: unknown): value is FollowUpChannel {
  return (
    value === "email" ||
    value === "sms" ||
    value === "whatsapp" ||
    value === "call" ||
    value === "meeting"
  );
}

function normalizeChannel(value: unknown): FollowUpChannel | undefined {
  return isFollowUpChannel(value) ? value : undefined;
}

function normalizePriority(value: unknown): FollowUpPriority {
  if (
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "urgent"
  ) {
    return value;
  }

  return "medium";
}

function normalizeStatus(value: unknown): FollowUpStatus {
  if (
    value === "pending" ||
    value === "completed" ||
    value === "overdue" ||
    value === "cancelled"
  ) {
    return value;
  }

  return "pending";
}

function isOverdue(record: FollowUpRecord): boolean {
  if (record.status === "completed" || record.status === "cancelled") {
    return false;
  }

  return new Date(record.dueAt).getTime() < Date.now();
}

function normalizeFollowUpRecord(input: Partial<FollowUpRecord>): FollowUpRecord {
  const now = getNowIso();

  return {
    id: typeof input.id === "string" && input.id.trim() ? input.id : generateId(),
    title:
      typeof input.title === "string" && input.title.trim()
        ? input.title.trim()
        : "Untitled Follow-up",
    description:
      typeof input.description === "string" && input.description.trim()
        ? input.description.trim()
        : undefined,
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
    channel: normalizeChannel(input.channel),
    assigneeName:
      typeof input.assigneeName === "string" && input.assigneeName.trim()
        ? input.assigneeName.trim()
        : undefined,
    dueAt: isValidDate(input.dueAt) ? String(input.dueAt) : now,
    priority: normalizePriority(input.priority),
    status: normalizeStatus(input.status),
    completedAt: isValidDate(input.completedAt) ? String(input.completedAt) : null,
    createdAt: isValidDate(input.createdAt) ? String(input.createdAt) : now,
    updatedAt: isValidDate(input.updatedAt) ? String(input.updatedAt) : now,
    tags: Array.isArray(input.tags)
      ? input.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
  };
}

function normalizeFollowUpStatus(record: FollowUpRecord): FollowUpRecord {
  if (record.status === "completed" || record.status === "cancelled") {
    return record;
  }

  if (isOverdue(record)) {
    return {
      ...record,
      status: "overdue",
    };
  }

  return {
    ...record,
    status: "pending",
  };
}

function normalizeStoredFollowUp(input: Partial<FollowUpRecord>): FollowUpRecord {
  return normalizeFollowUpStatus(normalizeFollowUpRecord(input));
}

function sortByDueDateAsc(records: FollowUpRecord[]): FollowUpRecord[] {
  return [...records].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  );
}

function seedFollowUps(): FollowUpRecord[] {
  const now = new Date();
  const nowIso = now.toISOString();
  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const seeded: FollowUpRecord[] = [
    {
      id: generateId(),
      title: "Send pricing follow-up email",
      description: "Share updated project pricing and payment plan.",
      conversationId: "conv-001",
      leadId: "lead-001",
      contactId: "contact-001",
      channel: "email",
      assigneeName: "Balraj",
      dueAt: in2Hours,
      priority: "high",
      status: "pending",
      completedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      tags: ["pricing", "hot lead"],
    },
    {
      id: generateId(),
      title: "WhatsApp reminder for site visit",
      description: "Confirm site visit timing and share location pin.",
      conversationId: "conv-002",
      leadId: "lead-002",
      contactId: "contact-002",
      channel: "whatsapp",
      assigneeName: "Balraj",
      dueAt: tomorrow,
      priority: "medium",
      status: "pending",
      completedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      tags: ["site visit"],
    },
    {
      id: generateId(),
      title: "Call back missed lead",
      description: "Lead asked for callback regarding villa unit availability.",
      conversationId: "conv-003",
      leadId: "lead-003",
      contactId: "contact-003",
      channel: "call",
      assigneeName: "Balraj",
      dueAt: yesterday,
      priority: "urgent",
      status: "overdue",
      completedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      tags: ["callback", "villa"],
    },
  ];

  return seeded.map(normalizeFollowUpStatus);
}

export default function useFollowUps(
  options: UseFollowUpsOptions = {}
): UseFollowUpsResult {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    seedDemoData = true,
    initialFilters,
  } = options;

  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [filters, setFilters] = useState<FollowUpFilterState>({
    searchQuery: initialFilters?.searchQuery ?? "",
    channel: initialFilters?.channel ?? "all",
    priority: initialFilters?.priority ?? "all",
    status: initialFilters?.status ?? "all",
    assigneeName: initialFilters?.assigneeName ?? "",
    conversationId: initialFilters?.conversationId ?? "all",
    includeCompleted: initialFilters?.includeCompleted ?? true,
    dueDateFrom: initialFilters?.dueDateFrom ?? null,
    dueDateTo: initialFilters?.dueDateTo ?? null,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FollowUpRecord>[];
        setFollowUps(parsed.map(normalizeStoredFollowUp));
        return;
      }

      if (seedDemoData) {
        setFollowUps(seedFollowUps());
      }
    } catch {
      if (seedDemoData) {
        setFollowUps(seedFollowUps());
      }
    }
  }, [storageKey, seedDemoData]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(followUps));
    } catch {
      // ignore storage issues
    }
  }, [followUps, storageKey]);

  const refreshOverdueStatuses = () => {
    setFollowUps((current) => current.map(normalizeFollowUpStatus));
  };

  const filteredFollowUps = useMemo<FollowUpRecord[]>(() => {
    const normalizedQuery = normalizeText(filters.searchQuery);

    return sortByDueDateAsc(
      followUps
        .map(normalizeFollowUpStatus)
        .filter((record) => {
          if (!filters.includeCompleted && record.status === "completed") {
            return false;
          }

          if (filters.channel !== "all" && record.channel !== filters.channel) {
            return false;
          }

          if (filters.priority !== "all" && record.priority !== filters.priority) {
            return false;
          }

          if (filters.status !== "all" && record.status !== filters.status) {
            return false;
          }

          if (
            filters.assigneeName.trim() &&
            !normalizeText(record.assigneeName).includes(
              normalizeText(filters.assigneeName)
            )
          ) {
            return false;
          }

          if (
            filters.conversationId !== "all" &&
            record.conversationId !== filters.conversationId
          ) {
            return false;
          }

          if (filters.dueDateFrom) {
            const from = new Date(`${filters.dueDateFrom}T00:00:00`).getTime();
            const due = new Date(record.dueAt).getTime();

            if (due < from) {
              return false;
            }
          }

          if (filters.dueDateTo) {
            const to = new Date(`${filters.dueDateTo}T23:59:59.999`).getTime();
            const due = new Date(record.dueAt).getTime();

            if (due > to) {
              return false;
            }
          }

          if (normalizedQuery) {
            const matches =
              normalizeText(record.title).includes(normalizedQuery) ||
              normalizeText(record.description).includes(normalizedQuery) ||
              normalizeText(record.assigneeName).includes(normalizedQuery) ||
              normalizeText(record.channel).includes(normalizedQuery) ||
              normalizeText(record.priority).includes(normalizedQuery) ||
              normalizeText(record.status).includes(normalizedQuery) ||
              normalizeText(record.leadId).includes(normalizedQuery) ||
              normalizeText(record.contactId).includes(normalizedQuery) ||
              normalizeText(record.conversationId).includes(normalizedQuery) ||
              (record.tags ?? []).some((tag) =>
                normalizeText(tag).includes(normalizedQuery)
              );

            if (!matches) {
              return false;
            }
          }

          return true;
        })
    );
  }, [followUps, filters]);

  const todayFollowUps = useMemo<FollowUpRecord[]>(() => {
    return filteredFollowUps.filter(
      (record) =>
        record.status !== "completed" &&
        record.status !== "cancelled" &&
        isToday(record.dueAt)
    );
  }, [filteredFollowUps]);

  const overdueFollowUps = useMemo<FollowUpRecord[]>(() => {
    return filteredFollowUps.filter((record) => record.status === "overdue");
  }, [filteredFollowUps]);

  const upcomingFollowUps = useMemo<FollowUpRecord[]>(() => {
    const endTodayTime = endOfToday().getTime();

    return filteredFollowUps.filter((record) => {
      const due = new Date(record.dueAt).getTime();

      return (
        (record.status === "pending" || record.status === "overdue") &&
        due > endTodayTime
      );
    });
  }, [filteredFollowUps]);

  const completedFollowUps = useMemo<FollowUpRecord[]>(() => {
    return filteredFollowUps.filter((record) => record.status === "completed");
  }, [filteredFollowUps]);

  const addFollowUp = (input: FollowUpFormInput): FollowUpRecord => {
    const now = getNowIso();

    const newRecord = normalizeStoredFollowUp({
      id: generateId(),
      title: input.title,
      description: input.description,
      conversationId: input.conversationId,
      leadId: input.leadId,
      contactId: input.contactId,
      channel: input.channel,
      assigneeName: input.assigneeName,
      dueAt: input.dueAt,
      priority: input.priority ?? "medium",
      status: "pending",
      completedAt: null,
      createdAt: now,
      updatedAt: now,
      tags: input.tags ?? [],
    });

    setFollowUps((current) => sortByDueDateAsc([...current, newRecord]));
    return newRecord;
  };

  const updateFollowUp = (
    followUpId: string,
    updates: Partial<Omit<FollowUpRecord, "id" | "createdAt">>
  ): FollowUpRecord | null => {
    const existing = followUps.find((record) => record.id === followUpId);

    if (!existing) {
      return null;
    }

    const updatedRecord = normalizeStoredFollowUp({
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: getNowIso(),
    });

    setFollowUps((current) =>
      sortByDueDateAsc(
        current.map((record) => (record.id === followUpId ? updatedRecord : record))
      )
    );

    return updatedRecord;
  };

  const completeFollowUp = (followUpId: string): FollowUpRecord | null => {
    const existing = followUps.find((record) => record.id === followUpId);

    if (!existing) {
      return null;
    }

    const completedRecord: FollowUpRecord = {
      ...existing,
      status: "completed",
      completedAt: getNowIso(),
      updatedAt: getNowIso(),
    };

    setFollowUps((current) =>
      sortByDueDateAsc(
        current.map((record) => (record.id === followUpId ? completedRecord : record))
      )
    );

    return completedRecord;
  };

  const cancelFollowUp = (followUpId: string): FollowUpRecord | null => {
    const existing = followUps.find((record) => record.id === followUpId);

    if (!existing) {
      return null;
    }

    const cancelledRecord: FollowUpRecord = {
      ...existing,
      status: "cancelled",
      updatedAt: getNowIso(),
    };

    setFollowUps((current) =>
      sortByDueDateAsc(
        current.map((record) => (record.id === followUpId ? cancelledRecord : record))
      )
    );

    return cancelledRecord;
  };

  const deleteFollowUp = (followUpId: string) => {
    setFollowUps((current) => current.filter((record) => record.id !== followUpId));
  };

  const getFollowUpById = (followUpId: string): FollowUpRecord | undefined => {
    return followUps.find((record) => record.id === followUpId);
  };

  const getFollowUpsByConversationId = (conversationId: string): FollowUpRecord[] => {
    return sortByDueDateAsc(
      followUps.filter((record) => record.conversationId === conversationId)
    );
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      channel: "all",
      priority: "all",
      status: "all",
      assigneeName: "",
      conversationId: "all",
      includeCompleted: true,
      dueDateFrom: null,
      dueDateTo: null,
    });
  };

  return {
    followUps,
    filteredFollowUps,
    todayFollowUps,
    overdueFollowUps,
    upcomingFollowUps,
    completedFollowUps,

    filters,
    setSearchQuery: (value) =>
      setFilters((current) => ({ ...current, searchQuery: value })),
    setChannel: (value) =>
      setFilters((current) => ({ ...current, channel: value })),
    setPriority: (value) =>
      setFilters((current) => ({ ...current, priority: value })),
    setStatus: (value) =>
      setFilters((current) => ({ ...current, status: value })),
    setAssigneeName: (value) =>
      setFilters((current) => ({ ...current, assigneeName: value })),
    setConversationId: (value) =>
      setFilters((current) => ({ ...current, conversationId: value })),
    setIncludeCompleted: (value) =>
      setFilters((current) => ({ ...current, includeCompleted: value })),
    setDueDateFrom: (value) =>
      setFilters((current) => ({ ...current, dueDateFrom: value })),
    setDueDateTo: (value) =>
      setFilters((current) => ({ ...current, dueDateTo: value })),
    clearFilters,

    addFollowUp,
    updateFollowUp,
    completeFollowUp,
    cancelFollowUp,
    deleteFollowUp,
    getFollowUpById,
    getFollowUpsByConversationId,
    refreshOverdueStatuses,

    totalCount: followUps.length,
    filteredCount: filteredFollowUps.length,
    todayCount: todayFollowUps.length,
    overdueCount: overdueFollowUps.length,
    upcomingCount: upcomingFollowUps.length,
    completedCount: completedFollowUps.length,
  };
}