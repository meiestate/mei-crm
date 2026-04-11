// src/features/leads/api/leadsApi.ts

export type LeadsApiMode = "auto" | "local" | "remote";

export type LeadStatus =
  | "new"
  | "open"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "hot"
  | "warm"
  | "cold"
  | string;

export type LeadPriority = "low" | "medium" | "high" | "urgent" | string;

export type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  company?: string;
  source?: string;
  owner?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: number;
  expectedValue?: number;
  interestType?: string;
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  tags?: string[];
  notes?: string;
  score?: number;
  temperature?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "whatsapp"
  | "status_change"
  | "system"
  | string;

export type LeadActivity = {
  id: string;
  leadId: string;
  type: LeadActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
};

export type LeadFilters = {
  search?: string;
  status?: string;
  owner?: string;
  source?: string;
  priority?: string;
  propertyType?: string;
  city?: string;
};

export type CreateLeadInput = {
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  company?: string;
  source?: string;
  owner?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: number;
  expectedValue?: number;
  interestType?: string;
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  tags?: string[];
  notes?: string;
  score?: number;
  temperature?: string;
};

export type UpdateLeadInput = Partial<CreateLeadInput>;

export type LeadListResponse = {
  items: Lead[];
  total: number;
};

export type LeadSourceSummary = {
  source: string;
  count: number;
};

export type LeadStatusSummary = {
  status: string;
  count: number;
};

type UnknownRecord = Record<string, unknown>;

const STORAGE_KEYS = {
  leads: "mei-crm-leads",
  leadActivities: "mei-crm-lead-activities",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readStorageArray<T = UnknownRecord>(key: string): T[] {
  if (!isBrowser()) return [];
  return safeJsonParse<T[]>(window.localStorage.getItem(key), []);
}

function writeStorageArray<T>(key: string, value: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toTimestamp(value: unknown): number {
  const text = normalizeString(value);
  if (!text) return 0;

  const time = new Date(text).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickFirstString(item: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeString(item[key]);
    if (value) return value;
  }

  return "";
}

function mapLead(raw: unknown): Lead | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);

  if (!id) return null;

  return {
    id,
    name: pickFirstString(item, ["name", "fullName", "customerName"]) || "Unnamed Lead",
    email: pickFirstString(item, ["email"]) || undefined,
    phone: pickFirstString(item, ["phone", "mobile", "phoneNumber"]) || undefined,
    alternatePhone:
      pickFirstString(item, ["alternatePhone", "altPhone"]) || undefined,
    whatsapp: pickFirstString(item, ["whatsapp", "whatsApp"]) || undefined,
    company: pickFirstString(item, ["company"]) || undefined,
    source: pickFirstString(item, ["source", "leadSource"]) || undefined,
    owner: pickFirstString(item, ["owner", "assignedTo", "leadOwner"]) || undefined,
    status: pickFirstString(item, ["status", "leadStatus"]) || "new",
    priority: pickFirstString(item, ["priority"]) || undefined,
    budget: toNumber(item.budget) || undefined,
    expectedValue: toNumber(item.expectedValue) || undefined,
    interestType: pickFirstString(item, ["interestType"]) || undefined,
    propertyType: pickFirstString(item, ["propertyType"]) || undefined,
    location: pickFirstString(item, ["location"]) || undefined,
    city: pickFirstString(item, ["city"]) || undefined,
    state: pickFirstString(item, ["state"]) || undefined,
    country: pickFirstString(item, ["country"]) || undefined,
    followUpDate: pickFirstString(item, ["followUpDate"]) || undefined,
    nextFollowUpDate: pickFirstString(item, ["nextFollowUpDate"]) || undefined,
    tags: Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    notes: pickFirstString(item, ["notes", "description"]) || undefined,
    score:
      typeof item.score === "number" ? item.score : toNumber(item.score) || undefined,
    temperature: pickFirstString(item, ["temperature"]) || undefined,
    createdAt: pickFirstString(item, ["createdAt"]) || undefined,
    updatedAt: pickFirstString(item, ["updatedAt"]) || undefined,
  };
}

function mapLeadActivity(raw: unknown): LeadActivity | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const leadId = pickFirstString(item, ["leadId"]);

  if (!id || !leadId) return null;

  return {
    id,
    leadId,
    type: pickFirstString(item, ["type"]) || "system",
    title: pickFirstString(item, ["title", "name"]) || "Activity",
    description:
      pickFirstString(item, ["description", "note", "content"]) || undefined,
    createdAt:
      pickFirstString(item, ["createdAt", "updatedAt"]) ||
      new Date().toISOString(),
    createdBy: pickFirstString(item, ["createdBy", "actor"]) || undefined,
    entityType: pickFirstString(item, ["entityType"]) || undefined,
    entityId: pickFirstString(item, ["entityId"]) || undefined,
  };
}

function matchesLeadFilters(lead: Lead, filters?: LeadFilters): boolean {
  if (!filters) return true;

  const search = normalizeString(filters.search).toLowerCase();

  if (search) {
    const haystack = [
      lead.name,
      lead.email,
      lead.phone,
      lead.alternatePhone,
      lead.whatsapp,
      lead.company,
      lead.source,
      lead.owner,
      lead.status,
      lead.priority,
      lead.propertyType,
      lead.location,
      lead.city,
      ...(lead.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.status && (lead.status ?? "") !== filters.status) return false;
  if (filters.owner && (lead.owner ?? "") !== filters.owner) return false;
  if (filters.source && (lead.source ?? "") !== filters.source) return false;
  if (filters.priority && (lead.priority ?? "") !== filters.priority) return false;
  if (filters.propertyType && (lead.propertyType ?? "") !== filters.propertyType) {
    return false;
  }
  if (filters.city && (lead.city ?? "") !== filters.city) return false;

  return true;
}

function getRemoteBaseUrl(): string {
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
      ?.VITE_API_BASE_URL
  ) {
    return (
      (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
        ?.VITE_API_BASE_URL ?? ""
    );
  }

  return "";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getRemoteBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

function getLeadsFromLocal(filters?: LeadFilters): Lead[] {
  return readStorageArray(STORAGE_KEYS.leads)
    .map(mapLead)
    .filter((item): item is Lead => Boolean(item))
    .filter((lead) => matchesLeadFilters(lead, filters))
    .sort(
      (a, b) =>
        toTimestamp(b.updatedAt ?? b.createdAt) -
        toTimestamp(a.updatedAt ?? a.createdAt)
    );
}

function getLeadActivitiesFromLocal(leadId: string): LeadActivity[] {
  return readStorageArray(STORAGE_KEYS.leadActivities)
    .map(mapLeadActivity)
    .filter((item): item is LeadActivity => Boolean(item))
    .filter((activity) => activity.leadId === leadId)
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
}

function createLeadActivityEntry(params: {
  leadId: string;
  type: LeadActivityType;
  title: string;
  description?: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
}): LeadActivity {
  return {
    id: createId("lead-activity"),
    leadId: params.leadId,
    type: params.type,
    title: params.title,
    description: params.description,
    createdAt: params.createdAt ?? new Date().toISOString(),
    createdBy: params.createdBy,
    entityType: params.entityType ?? "lead",
    entityId: params.entityId ?? params.leadId,
  };
}

const leadsApi = {
  async getLeads(options?: {
    mode?: LeadsApiMode;
    filters?: LeadFilters;
  }): Promise<LeadListResponse> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const items = getLeadsFromLocal(filters);
      return { items, total: items.length };
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.owner) params.set("owner", filters.owner);
      if (filters?.source) params.set("source", filters.source);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.propertyType) params.set("propertyType", filters.propertyType);
      if (filters?.city) params.set("city", filters.city);

      const query = params.toString();
      return fetchJson<LeadListResponse>(`/leads${query ? `?${query}` : ""}`);
    }

    try {
      return await this.getLeads({ mode: "remote", filters });
    } catch {
      return this.getLeads({ mode: "local", filters });
    }
  },

  async getLeadById(
    leadId: string,
    options?: { mode?: LeadsApiMode }
  ): Promise<Lead | null> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getLeadsFromLocal().find((lead) => lead.id === leadId) ?? null;
    }

    if (mode === "remote") {
      return fetchJson<Lead>(`/leads/${leadId}`);
    }

    try {
      return await this.getLeadById(leadId, { mode: "remote" });
    } catch {
      return this.getLeadById(leadId, { mode: "local" });
    }
  },

  async createLead(
    input: CreateLeadInput,
    options?: { mode?: LeadsApiMode; createdBy?: string }
  ): Promise<Lead> {
    const mode = options?.mode ?? "auto";
    const createdBy = options?.createdBy;

    if (mode === "local") {
      const now = new Date().toISOString();

      const lead: Lead = {
        id: createId("lead"),
        name: normalizeString(input.name) || "Unnamed Lead",
        email: normalizeString(input.email) || undefined,
        phone: normalizeString(input.phone) || undefined,
        alternatePhone: normalizeString(input.alternatePhone) || undefined,
        whatsapp: normalizeString(input.whatsapp) || undefined,
        company: normalizeString(input.company) || undefined,
        source: normalizeString(input.source) || undefined,
        owner: normalizeString(input.owner) || undefined,
        status: normalizeString(input.status) || "new",
        priority: normalizeString(input.priority) || "medium",
        budget: input.budget,
        expectedValue: input.expectedValue,
        interestType: normalizeString(input.interestType) || undefined,
        propertyType: normalizeString(input.propertyType) || undefined,
        location: normalizeString(input.location) || undefined,
        city: normalizeString(input.city) || undefined,
        state: normalizeString(input.state) || undefined,
        country: normalizeString(input.country) || undefined,
        followUpDate: normalizeString(input.followUpDate) || undefined,
        nextFollowUpDate: normalizeString(input.nextFollowUpDate) || undefined,
        tags: input.tags?.filter(Boolean) ?? [],
        notes: normalizeString(input.notes) || undefined,
        score: input.score,
        temperature: normalizeString(input.temperature) || undefined,
        createdAt: now,
        updatedAt: now,
      };

      const leads = getLeadsFromLocal();
      writeStorageArray(STORAGE_KEYS.leads, [lead, ...leads]);

      const activities = readStorageArray<LeadActivity>(STORAGE_KEYS.leadActivities);
      const createActivity = createLeadActivityEntry({
        leadId: lead.id,
        type: "system",
        title: "Lead created",
        description: `${lead.name} was created.`,
        createdAt: now,
        createdBy,
      });

      writeStorageArray(STORAGE_KEYS.leadActivities, [createActivity, ...activities]);

      return lead;
    }

    if (mode === "remote") {
      return fetchJson<Lead>("/leads", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.createLead(input, { mode: "remote", createdBy });
    } catch {
      return this.createLead(input, { mode: "local", createdBy });
    }
  },

  async updateLead(
    leadId: string,
    updates: UpdateLeadInput,
    options?: { mode?: LeadsApiMode; updatedBy?: string }
  ): Promise<Lead | null> {
    const mode = options?.mode ?? "auto";
    const updatedBy = options?.updatedBy;

    if (mode === "local") {
      const existingLeads = getLeadsFromLocal();
      const leadIndex = existingLeads.findIndex((lead) => lead.id === leadId);

      if (leadIndex === -1) {
        return null;
      }

      const currentLead = existingLeads[leadIndex];
      const previousStatus = currentLead.status ?? "";
      const nextStatusValue =
        updates.status !== undefined
          ? normalizeString(updates.status) || undefined
          : currentLead.status;

      const updatedLead: Lead = {
        ...currentLead,
        ...updates,
        name:
          updates.name !== undefined
            ? normalizeString(updates.name) || currentLead.name
            : currentLead.name,
        email:
          updates.email !== undefined
            ? normalizeString(updates.email) || undefined
            : currentLead.email,
        phone:
          updates.phone !== undefined
            ? normalizeString(updates.phone) || undefined
            : currentLead.phone,
        alternatePhone:
          updates.alternatePhone !== undefined
            ? normalizeString(updates.alternatePhone) || undefined
            : currentLead.alternatePhone,
        whatsapp:
          updates.whatsapp !== undefined
            ? normalizeString(updates.whatsapp) || undefined
            : currentLead.whatsapp,
        company:
          updates.company !== undefined
            ? normalizeString(updates.company) || undefined
            : currentLead.company,
        source:
          updates.source !== undefined
            ? normalizeString(updates.source) || undefined
            : currentLead.source,
        owner:
          updates.owner !== undefined
            ? normalizeString(updates.owner) || undefined
            : currentLead.owner,
        status: nextStatusValue,
        priority:
          updates.priority !== undefined
            ? normalizeString(updates.priority) || undefined
            : currentLead.priority,
        budget: updates.budget !== undefined ? updates.budget : currentLead.budget,
        expectedValue:
          updates.expectedValue !== undefined
            ? updates.expectedValue
            : currentLead.expectedValue,
        interestType:
          updates.interestType !== undefined
            ? normalizeString(updates.interestType) || undefined
            : currentLead.interestType,
        propertyType:
          updates.propertyType !== undefined
            ? normalizeString(updates.propertyType) || undefined
            : currentLead.propertyType,
        location:
          updates.location !== undefined
            ? normalizeString(updates.location) || undefined
            : currentLead.location,
        city:
          updates.city !== undefined
            ? normalizeString(updates.city) || undefined
            : currentLead.city,
        state:
          updates.state !== undefined
            ? normalizeString(updates.state) || undefined
            : currentLead.state,
        country:
          updates.country !== undefined
            ? normalizeString(updates.country) || undefined
            : currentLead.country,
        followUpDate:
          updates.followUpDate !== undefined
            ? normalizeString(updates.followUpDate) || undefined
            : currentLead.followUpDate,
        nextFollowUpDate:
          updates.nextFollowUpDate !== undefined
            ? normalizeString(updates.nextFollowUpDate) || undefined
            : currentLead.nextFollowUpDate,
        tags:
          updates.tags !== undefined
            ? updates.tags.filter(Boolean)
            : currentLead.tags,
        notes:
          updates.notes !== undefined
            ? normalizeString(updates.notes) || undefined
            : currentLead.notes,
        score: updates.score !== undefined ? updates.score : currentLead.score,
        temperature:
          updates.temperature !== undefined
            ? normalizeString(updates.temperature) || undefined
            : currentLead.temperature,
        updatedAt: new Date().toISOString(),
      };

      const nextLeads = [...existingLeads];
      nextLeads[leadIndex] = updatedLead;
      writeStorageArray(STORAGE_KEYS.leads, nextLeads);

      const activityList = readStorageArray(STORAGE_KEYS.leadActivities)
        .map(mapLeadActivity)
        .filter((item): item is LeadActivity => Boolean(item));

      const nextActivities: LeadActivity[] = [
        createLeadActivityEntry({
          leadId,
          type: "system",
          title: "Lead updated",
          description: `${updatedLead.name} was updated.`,
          createdBy: updatedBy,
        }),
        ...activityList,
      ];

      const nextStatus = updatedLead.status ?? "";
      if (previousStatus && nextStatus && previousStatus !== nextStatus) {
        nextActivities.unshift(
          createLeadActivityEntry({
            leadId,
            type: "status_change",
            title: "Status changed",
            description: `${previousStatus} → ${nextStatus}`,
            createdBy: updatedBy,
          })
        );
      }

      writeStorageArray(STORAGE_KEYS.leadActivities, nextActivities);

      return updatedLead;
    }

    if (mode === "remote") {
      return fetchJson<Lead>(`/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateLead(leadId, updates, {
        mode: "remote",
        updatedBy,
      });
    } catch {
      return this.updateLead(leadId, updates, {
        mode: "local",
        updatedBy,
      });
    }
  },

  async deleteLead(
    leadId: string,
    options?: { mode?: LeadsApiMode }
  ): Promise<boolean> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const leads = getLeadsFromLocal();
      const nextLeads = leads.filter((lead) => lead.id !== leadId);
      writeStorageArray(STORAGE_KEYS.leads, nextLeads);

      const activities = readStorageArray(STORAGE_KEYS.leadActivities)
        .map(mapLeadActivity)
        .filter((item): item is LeadActivity => Boolean(item))
        .filter((activity) => activity.leadId !== leadId);

      writeStorageArray(STORAGE_KEYS.leadActivities, activities);
      return true;
    }

    if (mode === "remote") {
      await fetchJson<{ success?: boolean }>(`/leads/${leadId}`, {
        method: "DELETE",
      });
      return true;
    }

    try {
      return await this.deleteLead(leadId, { mode: "remote" });
    } catch {
      return this.deleteLead(leadId, { mode: "local" });
    }
  },

  async getLeadActivities(
    leadId: string,
    options?: { mode?: LeadsApiMode }
  ): Promise<LeadActivity[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getLeadActivitiesFromLocal(leadId);
    }

    if (mode === "remote") {
      return fetchJson<LeadActivity[]>(`/leads/${leadId}/activities`);
    }

    try {
      return await this.getLeadActivities(leadId, { mode: "remote" });
    } catch {
      return this.getLeadActivities(leadId, { mode: "local" });
    }
  },

  async addLeadActivity(
    leadId: string,
    input: Omit<LeadActivity, "id" | "leadId" | "createdAt"> & {
      createdAt?: string;
    },
    options?: { mode?: LeadsApiMode }
  ): Promise<LeadActivity> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const activity = createLeadActivityEntry({
        leadId,
        type: input.type,
        title: normalizeString(input.title) || "Activity",
        description: normalizeString(input.description) || undefined,
        createdAt: input.createdAt,
        createdBy: normalizeString(input.createdBy) || undefined,
        entityType: normalizeString(input.entityType) || "lead",
        entityId: normalizeString(input.entityId) || leadId,
      });

      const activities = readStorageArray<LeadActivity>(STORAGE_KEYS.leadActivities);
      writeStorageArray(STORAGE_KEYS.leadActivities, [activity, ...activities]);

      return activity;
    }

    if (mode === "remote") {
      return fetchJson<LeadActivity>(`/leads/${leadId}/activities`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.addLeadActivity(leadId, input, { mode: "remote" });
    } catch {
      return this.addLeadActivity(leadId, input, { mode: "local" });
    }
  },

  async getLeadSourceSummary(options?: {
    mode?: LeadsApiMode;
    filters?: LeadFilters;
  }): Promise<LeadSourceSummary[]> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const leads = getLeadsFromLocal(filters);
      const sourceMap = new Map<string, number>();

      leads.forEach((lead) => {
        const source = lead.source || "Unknown";
        sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
      });

      return Array.from(sourceMap.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.owner) params.set("owner", filters.owner);
      if (filters?.source) params.set("source", filters.source);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.propertyType) params.set("propertyType", filters.propertyType);
      if (filters?.city) params.set("city", filters.city);

      const query = params.toString();
      return fetchJson<LeadSourceSummary[]>(
        `/leads/source-summary${query ? `?${query}` : ""}`
      );
    }

    try {
      return await this.getLeadSourceSummary({ mode: "remote", filters });
    } catch {
      return this.getLeadSourceSummary({ mode: "local", filters });
    }
  },

  async getLeadStatusSummary(options?: {
    mode?: LeadsApiMode;
    filters?: LeadFilters;
  }): Promise<LeadStatusSummary[]> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const leads = getLeadsFromLocal(filters);
      const statusMap = new Map<string, number>();

      leads.forEach((lead) => {
        const status = lead.status || "Unknown";
        statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
      });

      return Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.owner) params.set("owner", filters.owner);
      if (filters?.source) params.set("source", filters.source);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.propertyType) params.set("propertyType", filters.propertyType);
      if (filters?.city) params.set("city", filters.city);

      const query = params.toString();
      return fetchJson<LeadStatusSummary[]>(
        `/leads/status-summary${query ? `?${query}` : ""}`
      );
    }

    try {
      return await this.getLeadStatusSummary({ mode: "remote", filters });
    } catch {
      return this.getLeadStatusSummary({ mode: "local", filters });
    }
  },
};

export default leadsApi;