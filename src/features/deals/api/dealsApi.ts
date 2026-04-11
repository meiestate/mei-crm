// src/features/deals/api/dealsApi.ts

export type DealsApiMode = "auto" | "local" | "remote";

export type DealStatus =
  | "new"
  | "open"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | string;

export type DealPriority = "low" | "medium" | "high" | "urgent" | string;

export type Deal = {
  id: string;
  title: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  leadName?: string;
  company?: string;
  value?: number;
  expectedValue?: number;
  currency?: string;
  status?: DealStatus;
  stage?: string;
  priority?: DealPriority;
  source?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DealActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "status_change"
  | "stage_change"
  | "system"
  | string;

export type DealActivity = {
  id: string;
  dealId: string;
  type: DealActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
};

export type DealFilters = {
  search?: string;
  status?: string;
  stage?: string;
  owner?: string;
  source?: string;
  priority?: string;
};

export type CreateDealInput = {
  title: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  leadName?: string;
  company?: string;
  value?: number;
  expectedValue?: number;
  currency?: string;
  status?: DealStatus;
  stage?: string;
  priority?: DealPriority;
  source?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
};

export type UpdateDealInput = Partial<CreateDealInput>;

export type DealPipelineStageSummary = {
  stage: string;
  count: number;
  value: number;
};

export type DealListResponse = {
  items: Deal[];
  total: number;
};

type UnknownRecord = Record<string, unknown>;

const STORAGE_KEYS = {
  deals: "mei-crm-deals",
  dealActivities: "mei-crm-deal-activities",
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

function mapDeal(raw: unknown): Deal | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    title: pickFirstString(item, ["title", "name"]) || "Untitled Deal",
    contactId: pickFirstString(item, ["contactId"]) || undefined,
    contactName: pickFirstString(item, ["contactName"]) || undefined,
    leadId: pickFirstString(item, ["leadId"]) || undefined,
    leadName: pickFirstString(item, ["leadName"]) || undefined,
    company: pickFirstString(item, ["company"]) || undefined,
    value:
      toNumber(item.value) ||
      toNumber(item.amount) ||
      toNumber(item.dealValue) ||
      undefined,
    expectedValue: toNumber(item.expectedValue) || undefined,
    currency: pickFirstString(item, ["currency"]) || undefined,
    status: pickFirstString(item, ["status"]) || "open",
    stage: pickFirstString(item, ["stage", "pipelineStage"]) || "New",
    priority: pickFirstString(item, ["priority"]) || undefined,
    source: pickFirstString(item, ["source"]) || undefined,
    owner: pickFirstString(item, ["owner", "assignedTo"]) || undefined,
    probability:
      typeof item.probability === "number"
        ? item.probability
        : toNumber(item.probability) || undefined,
    expectedCloseDate:
      pickFirstString(item, ["expectedCloseDate", "closeDate"]) || undefined,
    tags: Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    notes: pickFirstString(item, ["notes", "description"]) || undefined,
    createdAt: pickFirstString(item, ["createdAt"]) || undefined,
    updatedAt: pickFirstString(item, ["updatedAt"]) || undefined,
  };
}

function mapDealActivity(raw: unknown): DealActivity | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  const dealId = pickFirstString(item, ["dealId"]);

  if (!id || !dealId) return null;

  return {
    id,
    dealId,
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

function matchesDealFilters(deal: Deal, filters?: DealFilters): boolean {
  if (!filters) return true;

  const search = normalizeString(filters.search).toLowerCase();

  if (search) {
    const haystack = [
      deal.title,
      deal.contactName,
      deal.leadName,
      deal.company,
      deal.stage,
      deal.status,
      deal.owner,
      deal.source,
      deal.priority,
      ...(deal.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.status && (deal.status ?? "") !== filters.status) return false;
  if (filters.stage && (deal.stage ?? "") !== filters.stage) return false;
  if (filters.owner && (deal.owner ?? "") !== filters.owner) return false;
  if (filters.source && (deal.source ?? "") !== filters.source) return false;
  if (filters.priority && (deal.priority ?? "") !== filters.priority) return false;

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

function getDealsFromLocal(filters?: DealFilters): Deal[] {
  return readStorageArray(STORAGE_KEYS.deals)
    .map(mapDeal)
    .filter((item): item is Deal => Boolean(item))
    .filter((deal) => matchesDealFilters(deal, filters))
    .sort(
      (a, b) =>
        toTimestamp(b.updatedAt ?? b.createdAt) -
        toTimestamp(a.updatedAt ?? a.createdAt)
    );
}

function getDealActivitiesFromLocal(dealId: string): DealActivity[] {
  return readStorageArray(STORAGE_KEYS.dealActivities)
    .map(mapDealActivity)
    .filter((item): item is DealActivity => Boolean(item))
    .filter((activity) => activity.dealId === dealId)
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
}

function createDealActivityEntry(params: {
  dealId: string;
  type: DealActivityType;
  title: string;
  description?: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
}): DealActivity {
  return {
    id: createId("deal-activity"),
    dealId: params.dealId,
    type: params.type,
    title: params.title,
    description: params.description,
    createdAt: params.createdAt ?? new Date().toISOString(),
    createdBy: params.createdBy,
    entityType: params.entityType ?? "deal",
    entityId: params.entityId ?? params.dealId,
  };
}

const dealsApi = {
  async getDeals(options?: {
    mode?: DealsApiMode;
    filters?: DealFilters;
  }): Promise<DealListResponse> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const items = getDealsFromLocal(filters);
      return { items, total: items.length };
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.stage) params.set("stage", filters.stage);
      if (filters?.owner) params.set("owner", filters.owner);
      if (filters?.source) params.set("source", filters.source);
      if (filters?.priority) params.set("priority", filters.priority);

      const query = params.toString();
      return fetchJson<DealListResponse>(`/deals${query ? `?${query}` : ""}`);
    }

    try {
      return await this.getDeals({ mode: "remote", filters });
    } catch {
      return this.getDeals({ mode: "local", filters });
    }
  },

  async getDealById(
    dealId: string,
    options?: { mode?: DealsApiMode }
  ): Promise<Deal | null> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getDealsFromLocal().find((deal) => deal.id === dealId) ?? null;
    }

    if (mode === "remote") {
      return fetchJson<Deal>(`/deals/${dealId}`);
    }

    try {
      return await this.getDealById(dealId, { mode: "remote" });
    } catch {
      return this.getDealById(dealId, { mode: "local" });
    }
  },

  async createDeal(
    input: CreateDealInput,
    options?: { mode?: DealsApiMode; createdBy?: string }
  ): Promise<Deal> {
    const mode = options?.mode ?? "auto";
    const createdBy = options?.createdBy;

    if (mode === "local") {
      const now = new Date().toISOString();

      const deal: Deal = {
        id: createId("deal"),
        title: normalizeString(input.title) || "Untitled Deal",
        contactId: normalizeString(input.contactId) || undefined,
        contactName: normalizeString(input.contactName) || undefined,
        leadId: normalizeString(input.leadId) || undefined,
        leadName: normalizeString(input.leadName) || undefined,
        company: normalizeString(input.company) || undefined,
        value: input.value,
        expectedValue: input.expectedValue,
        currency: normalizeString(input.currency) || "INR",
        status: normalizeString(input.status) || "open",
        stage: normalizeString(input.stage) || "New",
        priority: normalizeString(input.priority) || "medium",
        source: normalizeString(input.source) || undefined,
        owner: normalizeString(input.owner) || undefined,
        probability: input.probability,
        expectedCloseDate: normalizeString(input.expectedCloseDate) || undefined,
        tags: input.tags?.filter(Boolean) ?? [],
        notes: normalizeString(input.notes) || undefined,
        createdAt: now,
        updatedAt: now,
      };

      const deals = getDealsFromLocal();
      writeStorageArray(STORAGE_KEYS.deals, [deal, ...deals]);

      const activities = readStorageArray<DealActivity>(STORAGE_KEYS.dealActivities);
      const createActivity = createDealActivityEntry({
        dealId: deal.id,
        type: "system",
        title: "Deal created",
        description: `${deal.title} was created.`,
        createdAt: now,
        createdBy,
      });

      writeStorageArray(STORAGE_KEYS.dealActivities, [createActivity, ...activities]);

      return deal;
    }

    if (mode === "remote") {
      return fetchJson<Deal>("/deals", {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.createDeal(input, { mode: "remote", createdBy });
    } catch {
      return this.createDeal(input, { mode: "local", createdBy });
    }
  },

  async updateDeal(
    dealId: string,
    updates: UpdateDealInput,
    options?: { mode?: DealsApiMode; updatedBy?: string }
  ): Promise<Deal | null> {
    const mode = options?.mode ?? "auto";
    const updatedBy = options?.updatedBy;

    if (mode === "local") {
      const existingDeals = getDealsFromLocal();
      const dealIndex = existingDeals.findIndex((deal) => deal.id === dealId);

      if (dealIndex === -1) {
        return null;
      }

      const currentDeal = existingDeals[dealIndex];
      const previousStage = currentDeal.stage ?? "";
      const nextStageValue =
        updates.stage !== undefined
          ? normalizeString(updates.stage) || undefined
          : currentDeal.stage;

      const updatedDeal: Deal = {
        ...currentDeal,
        ...updates,
        title:
          updates.title !== undefined
            ? normalizeString(updates.title) || currentDeal.title
            : currentDeal.title,
        contactId:
          updates.contactId !== undefined
            ? normalizeString(updates.contactId) || undefined
            : currentDeal.contactId,
        contactName:
          updates.contactName !== undefined
            ? normalizeString(updates.contactName) || undefined
            : currentDeal.contactName,
        leadId:
          updates.leadId !== undefined
            ? normalizeString(updates.leadId) || undefined
            : currentDeal.leadId,
        leadName:
          updates.leadName !== undefined
            ? normalizeString(updates.leadName) || undefined
            : currentDeal.leadName,
        company:
          updates.company !== undefined
            ? normalizeString(updates.company) || undefined
            : currentDeal.company,
        value: updates.value !== undefined ? updates.value : currentDeal.value,
        expectedValue:
          updates.expectedValue !== undefined
            ? updates.expectedValue
            : currentDeal.expectedValue,
        currency:
          updates.currency !== undefined
            ? normalizeString(updates.currency) || undefined
            : currentDeal.currency,
        status:
          updates.status !== undefined
            ? normalizeString(updates.status) || undefined
            : currentDeal.status,
        stage: nextStageValue,
        priority:
          updates.priority !== undefined
            ? normalizeString(updates.priority) || undefined
            : currentDeal.priority,
        source:
          updates.source !== undefined
            ? normalizeString(updates.source) || undefined
            : currentDeal.source,
        owner:
          updates.owner !== undefined
            ? normalizeString(updates.owner) || undefined
            : currentDeal.owner,
        probability:
          updates.probability !== undefined
            ? updates.probability
            : currentDeal.probability,
        expectedCloseDate:
          updates.expectedCloseDate !== undefined
            ? normalizeString(updates.expectedCloseDate) || undefined
            : currentDeal.expectedCloseDate,
        notes:
          updates.notes !== undefined
            ? normalizeString(updates.notes) || undefined
            : currentDeal.notes,
        tags:
          updates.tags !== undefined
            ? updates.tags.filter(Boolean)
            : currentDeal.tags,
        updatedAt: new Date().toISOString(),
      };

      const nextDeals = [...existingDeals];
      nextDeals[dealIndex] = updatedDeal;
      writeStorageArray(STORAGE_KEYS.deals, nextDeals);

      const activityList =
        readStorageArray(STORAGE_KEYS.dealActivities)
          .map(mapDealActivity)
          .filter((item): item is DealActivity => Boolean(item));

      const nextActivities: DealActivity[] = [
        createDealActivityEntry({
          dealId,
          type: "system",
          title: "Deal updated",
          description: `${updatedDeal.title} was updated.`,
          createdBy: updatedBy,
        }),
        ...activityList,
      ];

      const nextStage = updatedDeal.stage ?? "";
      if (previousStage && nextStage && previousStage !== nextStage) {
        nextActivities.unshift(
          createDealActivityEntry({
            dealId,
            type: "stage_change",
            title: "Stage changed",
            description: `${previousStage} → ${nextStage}`,
            createdBy: updatedBy,
          })
        );
      }

      writeStorageArray(STORAGE_KEYS.dealActivities, nextActivities);

      return updatedDeal;
    }

    if (mode === "remote") {
      return fetchJson<Deal>(`/deals/${dealId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }

    try {
      return await this.updateDeal(dealId, updates, {
        mode: "remote",
        updatedBy,
      });
    } catch {
      return this.updateDeal(dealId, updates, {
        mode: "local",
        updatedBy,
      });
    }
  },

  async deleteDeal(
    dealId: string,
    options?: { mode?: DealsApiMode }
  ): Promise<boolean> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const deals = getDealsFromLocal();
      const nextDeals = deals.filter((deal) => deal.id !== dealId);
      writeStorageArray(STORAGE_KEYS.deals, nextDeals);

      const activities = readStorageArray(STORAGE_KEYS.dealActivities)
        .map(mapDealActivity)
        .filter((item): item is DealActivity => Boolean(item))
        .filter((activity) => activity.dealId !== dealId);

      writeStorageArray(STORAGE_KEYS.dealActivities, activities);
      return true;
    }

    if (mode === "remote") {
      await fetchJson<{ success?: boolean }>(`/deals/${dealId}`, {
        method: "DELETE",
      });
      return true;
    }

    try {
      return await this.deleteDeal(dealId, { mode: "remote" });
    } catch {
      return this.deleteDeal(dealId, { mode: "local" });
    }
  },

  async getDealActivities(
    dealId: string,
    options?: { mode?: DealsApiMode }
  ): Promise<DealActivity[]> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getDealActivitiesFromLocal(dealId);
    }

    if (mode === "remote") {
      return fetchJson<DealActivity[]>(`/deals/${dealId}/activities`);
    }

    try {
      return await this.getDealActivities(dealId, { mode: "remote" });
    } catch {
      return this.getDealActivities(dealId, { mode: "local" });
    }
  },

  async addDealActivity(
    dealId: string,
    input: Omit<DealActivity, "id" | "dealId" | "createdAt"> & {
      createdAt?: string;
    },
    options?: { mode?: DealsApiMode }
  ): Promise<DealActivity> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      const activity = createDealActivityEntry({
        dealId,
        type: input.type,
        title: normalizeString(input.title) || "Activity",
        description: normalizeString(input.description) || undefined,
        createdAt: input.createdAt,
        createdBy: normalizeString(input.createdBy) || undefined,
        entityType: normalizeString(input.entityType) || "deal",
        entityId: normalizeString(input.entityId) || dealId,
      });

      const activities = readStorageArray<DealActivity>(STORAGE_KEYS.dealActivities);
      writeStorageArray(STORAGE_KEYS.dealActivities, [activity, ...activities]);

      return activity;
    }

    if (mode === "remote") {
      return fetchJson<DealActivity>(`/deals/${dealId}/activities`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    }

    try {
      return await this.addDealActivity(dealId, input, { mode: "remote" });
    } catch {
      return this.addDealActivity(dealId, input, { mode: "local" });
    }
  },

  async getPipelineSummary(options?: {
    mode?: DealsApiMode;
    filters?: DealFilters;
  }): Promise<DealPipelineStageSummary[]> {
    const mode = options?.mode ?? "auto";
    const filters = options?.filters;

    if (mode === "local") {
      const deals = getDealsFromLocal(filters);
      const stageMap = new Map<string, DealPipelineStageSummary>();

      deals.forEach((deal) => {
        const stage = deal.stage || "Unknown";
        const value = deal.value || deal.expectedValue || 0;
        const existing = stageMap.get(stage);

        if (existing) {
          existing.count += 1;
          existing.value += value;
        } else {
          stageMap.set(stage, {
            stage,
            count: 1,
            value,
          });
        }
      });

      return Array.from(stageMap.values()).sort((a, b) => b.value - a.value);
    }

    if (mode === "remote") {
      const params = new URLSearchParams();

      if (filters?.search) params.set("search", filters.search);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.stage) params.set("stage", filters.stage);
      if (filters?.owner) params.set("owner", filters.owner);
      if (filters?.source) params.set("source", filters.source);
      if (filters?.priority) params.set("priority", filters.priority);

      const query = params.toString();
      return fetchJson<DealPipelineStageSummary[]>(
        `/deals/pipeline-summary${query ? `?${query}` : ""}`
      );
    }

    try {
      return await this.getPipelineSummary({ mode: "remote", filters });
    } catch {
      return this.getPipelineSummary({ mode: "local", filters });
    }
  },
};

export default dealsApi;