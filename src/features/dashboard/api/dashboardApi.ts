// src/features/dashboard/api/dashboardApi.ts

export type DashboardMode = "auto" | "local" | "remote";

export type DashboardKpiId =
  | "totalLeads"
  | "hotLeads"
  | "totalContacts"
  | "openDeals"
  | "wonDeals"
  | "pipelineValue"
  | "pendingTasks"
  | "todayFollowUps"
  | "overdueFollowUps";

export type DashboardTrend = "up" | "down" | "neutral";

export type DashboardKpi = {
  id: DashboardKpiId;
  label: string;
  value: number;
  change?: number;
  trend?: DashboardTrend;
  prefix?: string;
  suffix?: string;
};

export type DashboardPipelineStage = {
  stage: string;
  count: number;
  value: number;
};

export type DashboardLeadSourceItem = {
  source: string;
  count: number;
};

export type DashboardTaskItem = {
  id: string;
  title: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  owner?: string;
  relatedTo?: string;
};

export type DashboardActivityItem = {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  actor?: string;
  entityType?: string;
  entityId?: string;
};

export type DashboardRecentLeadItem = {
  id: string;
  name: string;
  phone?: string;
  status?: string;
  source?: string;
  budget?: number;
  followUpDate?: string;
  updatedAt?: string;
  owner?: string;
};

export type DashboardData = {
  kpis: DashboardKpi[];
  pipeline: DashboardPipelineStage[];
  leadSources: DashboardLeadSourceItem[];
  todayTasks: DashboardTaskItem[];
  recentActivities: DashboardActivityItem[];
  recentLeads: DashboardRecentLeadItem[];
  lastUpdatedAt: string;
};

type UnknownRecord = Record<string, unknown>;

const STORAGE_KEYS = {
  leads: "mei-crm-leads",
  contacts: "mei-crm-contacts",
  deals: "mei-crm-deals",
  tasks: "mei-crm-tasks",
  leadActivities: "mei-crm-lead-activities",
  contactActivities: "mei-crm-contact-activities",
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

function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isToday(value: unknown): boolean {
  const text = normalizeString(value);
  if (!text) return false;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return false;

  return isSameDay(date, new Date());
}

function isPastDate(value: unknown): boolean {
  const text = normalizeString(value);
  if (!text) return false;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getTime() < now.getTime() && !isSameDay(date, now);
}

function pickFirstString(item: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeString(item[key]);
    if (value) return value;
  }

  return "";
}

function getLeadStatus(item: UnknownRecord): string {
  return pickFirstString(item, ["status", "leadStatus"]) || "Unknown";
}

function getLeadSource(item: UnknownRecord): string {
  return pickFirstString(item, ["source", "leadSource"]) || "Unknown";
}

function getDealStage(item: UnknownRecord): string {
  return (
    pickFirstString(item, ["stage", "pipelineStage", "dealStage", "status"]) ||
    "Unknown"
  );
}

function getDealStatus(item: UnknownRecord): string {
  return pickFirstString(item, ["status", "stage"]) || "Unknown";
}

function getDealValue(item: UnknownRecord): number {
  return (
    toNumber(item.value) ||
    toNumber(item.amount) ||
    toNumber(item.dealValue) ||
    toNumber(item.expectedValue) ||
    0
  );
}

function getTaskStatus(item: UnknownRecord): string {
  return pickFirstString(item, ["status"]) || "pending";
}

function mapTask(raw: unknown): DashboardTaskItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    title: pickFirstString(item, ["title", "name", "taskTitle"]) || "Untitled Task",
    status: pickFirstString(item, ["status"]) || undefined,
    priority: pickFirstString(item, ["priority"]) || undefined,
    dueDate: pickFirstString(item, ["dueDate", "deadline"]) || undefined,
    owner: pickFirstString(item, ["owner", "assignedTo"]) || undefined,
    relatedTo:
      pickFirstString(item, [
        "relatedTo",
        "relatedEntityName",
        "leadName",
        "contactName",
      ]) || undefined,
  };
}

function mapActivity(
  raw: unknown,
  fallbackType: string
): DashboardActivityItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    type: pickFirstString(item, ["type"]) || fallbackType,
    title: pickFirstString(item, ["title", "name"]) || "Activity",
    description:
      pickFirstString(item, ["description", "note", "content"]) || undefined,
    createdAt:
      pickFirstString(item, ["createdAt", "updatedAt", "timestamp"]) ||
      new Date().toISOString(),
    actor: pickFirstString(item, ["createdBy", "actor", "owner"]) || undefined,
    entityType:
      pickFirstString(item, ["entityType"]) ||
      fallbackType.replace(/Activity$/i, ""),
    entityId:
      pickFirstString(item, ["entityId", "leadId", "contactId", "dealId"]) ||
      undefined,
  };
}

function mapRecentLead(raw: unknown): DashboardRecentLeadItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as UnknownRecord;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    name: pickFirstString(item, ["name", "fullName", "customerName"]) || "Untitled Lead",
    phone: pickFirstString(item, ["phone", "mobile", "phoneNumber"]) || undefined,
    status: pickFirstString(item, ["status", "leadStatus"]) || undefined,
    source: pickFirstString(item, ["source", "leadSource"]) || undefined,
    budget:
      toNumber(item.budget) ||
      toNumber(item.expectedBudget) ||
      toNumber(item.amount) ||
      undefined,
    followUpDate:
      pickFirstString(item, ["followUpDate", "nextFollowUpDate"]) || undefined,
    updatedAt:
      pickFirstString(item, ["updatedAt", "lastUpdatedAt", "createdAt"]) ||
      undefined,
    owner: pickFirstString(item, ["owner", "assignedTo", "leadOwner"]) || undefined,
  };
}

function buildKpis(values: {
  totalLeads: number;
  hotLeads: number;
  totalContacts: number;
  openDeals: number;
  wonDeals: number;
  pipelineValue: number;
  pendingTasks: number;
  todayFollowUps: number;
  overdueFollowUps: number;
}): DashboardKpi[] {
  return [
    {
      id: "totalLeads",
      label: "Total Leads",
      value: values.totalLeads,
      trend: "neutral",
    },
    {
      id: "hotLeads",
      label: "Hot Leads",
      value: values.hotLeads,
      trend: values.hotLeads > 0 ? "up" : "neutral",
    },
    {
      id: "totalContacts",
      label: "Total Contacts",
      value: values.totalContacts,
      trend: "neutral",
    },
    {
      id: "openDeals",
      label: "Open Deals",
      value: values.openDeals,
      trend: "neutral",
    },
    {
      id: "wonDeals",
      label: "Won Deals",
      value: values.wonDeals,
      trend: values.wonDeals > 0 ? "up" : "neutral",
    },
    {
      id: "pipelineValue",
      label: "Pipeline Value",
      value: values.pipelineValue,
      prefix: "₹",
      trend: values.pipelineValue > 0 ? "up" : "neutral",
    },
    {
      id: "pendingTasks",
      label: "Pending Tasks",
      value: values.pendingTasks,
      trend: values.pendingTasks > 0 ? "down" : "neutral",
    },
    {
      id: "todayFollowUps",
      label: "Today Follow-ups",
      value: values.todayFollowUps,
      trend: "neutral",
    },
    {
      id: "overdueFollowUps",
      label: "Overdue Follow-ups",
      value: values.overdueFollowUps,
      trend: values.overdueFollowUps > 0 ? "down" : "neutral",
    },
  ];
}

function getDashboardDataFromLocalStorage(): DashboardData {
  const rawLeads = readStorageArray<UnknownRecord>(STORAGE_KEYS.leads);
  const rawContacts = readStorageArray<UnknownRecord>(STORAGE_KEYS.contacts);
  const rawDeals = readStorageArray<UnknownRecord>(STORAGE_KEYS.deals);
  const rawTasks = readStorageArray<UnknownRecord>(STORAGE_KEYS.tasks);
  const rawLeadActivities = readStorageArray<UnknownRecord>(
    STORAGE_KEYS.leadActivities
  );
  const rawContactActivities = readStorageArray<UnknownRecord>(
    STORAGE_KEYS.contactActivities
  );
  const rawDealActivities = readStorageArray<UnknownRecord>(
    STORAGE_KEYS.dealActivities
  );

  const totalLeads = rawLeads.length;
  const totalContacts = rawContacts.length;

  const hotLeads = rawLeads.filter((lead) => {
    const status = getLeadStatus(lead).toLowerCase();
    const priority = pickFirstString(lead, ["priority", "temperature"]).toLowerCase();
    const score = toNumber(lead.score);

    return (
      status === "hot" ||
      priority === "hot" ||
      priority === "high" ||
      score >= 80
    );
  }).length;

  const wonDeals = rawDeals.filter((deal) => {
    const status = getDealStatus(deal).toLowerCase();
    return status === "won" || status === "closed won" || status === "closed";
  }).length;

  const openDeals = rawDeals.filter((deal) => {
    const status = getDealStatus(deal).toLowerCase();
    return !["won", "closed won", "closed", "lost", "closed lost"].includes(status);
  }).length;

  const pipelineValue = rawDeals.reduce((sum, deal) => {
    const status = getDealStatus(deal).toLowerCase();
    if (["lost", "closed lost"].includes(status)) return sum;
    return sum + getDealValue(deal);
  }, 0);

  const pendingTasks = rawTasks.filter((task) => {
    const status = getTaskStatus(task).toLowerCase();
    return !["done", "completed", "closed"].includes(status);
  }).length;

  const todayFollowUps = rawLeads.filter((lead) =>
    isToday(lead.followUpDate ?? lead.nextFollowUpDate)
  ).length;

  const overdueFollowUps = rawLeads.filter((lead) => {
    const followUpDate = lead.followUpDate ?? lead.nextFollowUpDate;
    const status = getLeadStatus(lead).toLowerCase();

    if (["won", "lost", "closed"].includes(status)) return false;
    return isPastDate(followUpDate);
  }).length;

  const pipelineMap = new Map<string, DashboardPipelineStage>();

  rawDeals.forEach((deal) => {
    const stage = getDealStage(deal);
    const value = getDealValue(deal);
    const existing = pipelineMap.get(stage);

    if (existing) {
      existing.count += 1;
      existing.value += value;
      return;
    }

    pipelineMap.set(stage, {
      stage,
      count: 1,
      value,
    });
  });

  const leadSourceMap = new Map<string, number>();

  rawLeads.forEach((lead) => {
    const source = getLeadSource(lead);
    leadSourceMap.set(source, (leadSourceMap.get(source) ?? 0) + 1);
  });

  const todayTasks = rawTasks
    .map(mapTask)
    .filter((item): item is DashboardTaskItem => Boolean(item))
    .filter((task) => {
      const status = normalizeString(task.status).toLowerCase();
      return !["done", "completed", "closed"].includes(status);
    })
    .sort((a, b) => toTimestamp(a.dueDate) - toTimestamp(b.dueDate))
    .slice(0, 8);

  const recentActivities = [
    ...rawLeadActivities.map((item) => mapActivity(item, "leadActivity")),
    ...rawContactActivities.map((item) => mapActivity(item, "contactActivity")),
    ...rawDealActivities.map((item) => mapActivity(item, "dealActivity")),
  ]
    .filter((item): item is DashboardActivityItem => Boolean(item))
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
    .slice(0, 12);

  const recentLeads = rawLeads
    .map(mapRecentLead)
    .filter((item): item is DashboardRecentLeadItem => Boolean(item))
    .sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt))
    .slice(0, 8);

  return {
    kpis: buildKpis({
      totalLeads,
      hotLeads,
      totalContacts,
      openDeals,
      wonDeals,
      pipelineValue,
      pendingTasks,
      todayFollowUps,
      overdueFollowUps,
    }),
    pipeline: Array.from(pipelineMap.values()).sort((a, b) => b.value - a.value),
    leadSources: Array.from(leadSourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
    todayTasks,
    recentActivities,
    recentLeads,
    lastUpdatedAt: new Date().toISOString(),
  };
}

async function getDashboardDataRemote(): Promise<DashboardData> {
  const baseUrl =
    (typeof import.meta !== "undefined" &&
      (import.meta as ImportMeta & {
        env?: { VITE_API_BASE_URL?: string };
      }).env?.VITE_API_BASE_URL) ||
    "";

  const url = `${baseUrl}/dashboard`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  const data = (await response.json()) as DashboardData;

  return {
    kpis: Array.isArray(data.kpis) ? data.kpis : [],
    pipeline: Array.isArray(data.pipeline) ? data.pipeline : [],
    leadSources: Array.isArray(data.leadSources) ? data.leadSources : [],
    todayTasks: Array.isArray(data.todayTasks) ? data.todayTasks : [],
    recentActivities: Array.isArray(data.recentActivities)
      ? data.recentActivities
      : [],
    recentLeads: Array.isArray(data.recentLeads) ? data.recentLeads : [],
    lastUpdatedAt: data.lastUpdatedAt || new Date().toISOString(),
  };
}

const dashboardApi = {
  async getDashboardData(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardData> {
    const mode = options?.mode ?? "auto";

    if (mode === "local") {
      return getDashboardDataFromLocalStorage();
    }

    if (mode === "remote") {
      return getDashboardDataRemote();
    }

    try {
      return await getDashboardDataRemote();
    } catch {
      return getDashboardDataFromLocalStorage();
    }
  },

  async getDashboardKpis(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardKpi[]> {
    const data = await this.getDashboardData(options);
    return data.kpis;
  },

  async getPipelineSummary(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardPipelineStage[]> {
    const data = await this.getDashboardData(options);
    return data.pipeline;
  },

  async getLeadSourceSummary(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardLeadSourceItem[]> {
    const data = await this.getDashboardData(options);
    return data.leadSources;
  },

  async getTodayTasks(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardTaskItem[]> {
    const data = await this.getDashboardData(options);
    return data.todayTasks;
  },

  async getRecentActivities(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardActivityItem[]> {
    const data = await this.getDashboardData(options);
    return data.recentActivities;
  },

  async getRecentLeads(options?: {
    mode?: DashboardMode;
  }): Promise<DashboardRecentLeadItem[]> {
    const data = await this.getDashboardData(options);
    return data.recentLeads;
  },
};

export default dashboardApi;