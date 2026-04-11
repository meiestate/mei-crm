// src/features/leads/utils/leadHelpers.ts

import type {
  Lead,
  LeadActivity,
  LeadFilters,
  LeadPriority,
  LeadSortDirection,
  LeadSortKey,
  LeadStatus,
  LeadSourceSummary,
  LeadStatusSummary,
  UseLeadsFilters,
} from "../types/leads.types";

export const LEADS_STORAGE_KEY = "mei-crm-leads";
export const LEAD_ACTIVITIES_STORAGE_KEY = "mei-crm-lead-activities";
export const LEADS_FILTERS_STORAGE_KEY = "mei-crm-lead-filters";
export const DEFAULT_LEADS_PAGE_SIZE = 10;

export const DEFAULT_LEADS_FILTERS: UseLeadsFilters = {
  search: "",
  status: "",
  owner: "",
  source: "",
  priority: "",
  propertyType: "",
  city: "",
  sortBy: "updatedAt",
  sortDirection: "desc",
};

export function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readStorageArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  return safeJsonParse<T[]>(window.localStorage.getItem(key), []);
}

export function writeStorageArray<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function createLeadId(prefix = "lead"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function pickFirstString(
  item: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = normalizeString(item[key]);
    if (value) return value;
  }

  return "";
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export function formatLeadStatusLabel(status?: string): string {
  const value = normalizeString(status);
  if (!value) return "Unknown";

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function serializeLeadsFilters(filters: UseLeadsFilters): string {
  return new URLSearchParams({
    search: filters.search ?? "",
    status: filters.status ?? "",
    owner: filters.owner ?? "",
    source: filters.source ?? "",
    priority: filters.priority ?? "",
    propertyType: filters.propertyType ?? "",
    city: filters.city ?? "",
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  }).toString();
}

export function getLeadsFiltersFromSearchParams(
  searchParams: URLSearchParams
): UseLeadsFilters {
  const sortByParam = searchParams.get("sortBy");
  const sortDirectionParam = searchParams.get("sortDirection");

  const sortBy: LeadSortKey =
    sortByParam === "name" ||
    sortByParam === "status" ||
    sortByParam === "priority" ||
    sortByParam === "source" ||
    sortByParam === "owner" ||
    sortByParam === "budget" ||
    sortByParam === "expectedValue" ||
    sortByParam === "city" ||
    sortByParam === "propertyType" ||
    sortByParam === "followUpDate" ||
    sortByParam === "updatedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : DEFAULT_LEADS_FILTERS.sortBy;

  const sortDirection: LeadSortDirection =
    sortDirectionParam === "asc" || sortDirectionParam === "desc"
      ? sortDirectionParam
      : DEFAULT_LEADS_FILTERS.sortDirection;

  return {
    search: searchParams.get("search") ?? DEFAULT_LEADS_FILTERS.search,
    status: searchParams.get("status") ?? DEFAULT_LEADS_FILTERS.status,
    owner: searchParams.get("owner") ?? DEFAULT_LEADS_FILTERS.owner,
    source: searchParams.get("source") ?? DEFAULT_LEADS_FILTERS.source,
    priority: searchParams.get("priority") ?? DEFAULT_LEADS_FILTERS.priority,
    propertyType:
      searchParams.get("propertyType") ?? DEFAULT_LEADS_FILTERS.propertyType,
    city: searchParams.get("city") ?? DEFAULT_LEADS_FILTERS.city,
    sortBy,
    sortDirection,
  };
}

export function matchesLeadFilters(lead: Lead, filters?: LeadFilters): boolean {
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
      lead.state,
      lead.country,
      lead.interestType,
      lead.temperature,
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

export function compareLeads(
  a: Lead,
  b: Lead,
  sortBy: LeadSortKey,
  sortDirection: LeadSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "name":
      result = (a.name ?? "").localeCompare(b.name ?? "");
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "priority":
      result = (a.priority ?? "").localeCompare(b.priority ?? "");
      break;
    case "source":
      result = (a.source ?? "").localeCompare(b.source ?? "");
      break;
    case "owner":
      result = (a.owner ?? "").localeCompare(b.owner ?? "");
      break;
    case "budget":
      result = toNumber(a.budget) - toNumber(b.budget);
      break;
    case "expectedValue":
      result = toNumber(a.expectedValue) - toNumber(b.expectedValue);
      break;
    case "city":
      result = (a.city ?? "").localeCompare(b.city ?? "");
      break;
    case "propertyType":
      result = (a.propertyType ?? "").localeCompare(b.propertyType ?? "");
      break;
    case "followUpDate":
      result =
        toTimestamp(a.followUpDate ?? a.nextFollowUpDate) -
        toTimestamp(b.followUpDate ?? b.nextFollowUpDate);
      break;
    case "createdAt":
      result = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
      break;
    case "updatedAt":
    default:
      result = toTimestamp(a.updatedAt) - toTimestamp(b.updatedAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

export function mapLead(raw: unknown): Lead | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
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
    status: (pickFirstString(item, ["status", "leadStatus"]) || "new") as LeadStatus,
    priority: pickFirstString(item, ["priority"]) as LeadPriority | undefined,
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

export function mapLeadActivity(raw: unknown): LeadActivity | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
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

export function createLeadActivityEntry(params: {
  leadId: string;
  type: LeadActivity["type"];
  title: string;
  description?: string;
  createdBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
}): LeadActivity {
  return {
    id: createLeadId("lead-activity"),
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

export function getLeadSourceSummary(leads: Lead[]): LeadSourceSummary[] {
  const sourceMap = new Map<string, number>();

  leads.forEach((lead) => {
    const source = lead.source || "Unknown";
    sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
  });

  return Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

export function getLeadStatusSummary(leads: Lead[]): LeadStatusSummary[] {
  const statusMap = new Map<string, number>();

  leads.forEach((lead) => {
    const status = lead.status || "Unknown";
    statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
  });

  return Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSuggestedLeadTemperature(status: string): string | undefined {
  const value = normalizeString(status).toLowerCase();

  if (value === "hot" || value === "won") return "hot";
  if (value === "warm" || value === "qualified" || value === "proposal") {
    return "warm";
  }
  if (
    value === "cold" ||
    value === "lost" ||
    value === "new" ||
    value === "open" ||
    value === "contacted"
  ) {
    return "cold";
  }
  if (value === "negotiation") return "warm";

  return undefined;
}

export function getSuggestedLeadScore(status: string): number | undefined {
  const value = normalizeString(status).toLowerCase();

  if (value === "won") return 100;
  if (value === "hot") return 85;
  if (value === "negotiation") return 75;
  if (value === "proposal") return 65;
  if (value === "qualified") return 55;
  if (value === "contacted") return 35;
  if (value === "new" || value === "open") return 20;
  if (value === "warm") return 60;
  if (value === "cold") return 15;
  if (value === "lost") return 0;

  return undefined;
}