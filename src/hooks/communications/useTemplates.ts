// src/hooks/communications/useTemplates.ts

import { useEffect, useMemo, useState } from "react";

export type TemplateChannel = "email" | "whatsapp" | "sms" | "internal";
export type TemplateVisibility = "private" | "team" | "global";
export type TemplateSortBy =
  | "recent"
  | "most-used"
  | "title-asc"
  | "title-desc"
  | "newest"
  | "oldest";

export interface TemplateRecord {
  id: string;
  title: string;
  category: string;
  channel: TemplateChannel;
  subject?: string;
  content: string;
  variables: string[];
  tags: string[];
  visibility: TemplateVisibility;
  isFavorite: boolean;
  usageCount: number;
  lastUsedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateInput {
  title: string;
  category: string;
  channel: TemplateChannel;
  subject?: string;
  content: string;
  variables?: string[];
  tags?: string[];
  visibility?: TemplateVisibility;
  isFavorite?: boolean;
  createdBy: string;
}

export interface TemplateFilterState {
  searchQuery: string;
  channel: TemplateChannel | "all";
  category: string | "all";
  visibility: TemplateVisibility | "all";
  favoritesOnly: boolean;
  sortBy: TemplateSortBy;
}

export interface UseTemplatesOptions {
  storageKey?: string;
  seedDemoData?: boolean;
  initialFilters?: Partial<TemplateFilterState>;
}

export interface UseTemplatesResult {
  templates: TemplateRecord[];
  filteredTemplates: TemplateRecord[];
  favoriteTemplates: TemplateRecord[];
  recentTemplates: TemplateRecord[];
  mostUsedTemplates: TemplateRecord[];
  availableCategories: string[];
  availableTags: string[];

  filters: TemplateFilterState;
  setSearchQuery: (value: string) => void;
  setChannel: (value: TemplateChannel | "all") => void;
  setCategory: (value: string | "all") => void;
  setVisibility: (value: TemplateVisibility | "all") => void;
  setFavoritesOnly: (value: boolean) => void;
  setSortBy: (value: TemplateSortBy) => void;
  clearFilters: () => void;

  addTemplate: (input: TemplateInput) => TemplateRecord;
  updateTemplate: (
    templateId: string,
    updates: Partial<Omit<TemplateRecord, "id" | "createdAt" | "createdBy">>
  ) => TemplateRecord | null;
  deleteTemplate: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => TemplateRecord | null;
  favoriteTemplate: (templateId: string) => TemplateRecord | null;
  unfavoriteTemplate: (templateId: string) => TemplateRecord | null;
  incrementTemplateUsage: (templateId: string) => TemplateRecord | null;

  getTemplateById: (templateId: string) => TemplateRecord | undefined;
  getTemplatesByChannel: (channel: TemplateChannel) => TemplateRecord[];
  renderTemplate: (
    templateId: string,
    variables?: Record<string, string | number>
  ) => { subject?: string; content: string } | null;
  renderTemplateRecord: (
    template: TemplateRecord,
    variables?: Record<string, string | number>
  ) => { subject?: string; content: string };

  totalCount: number;
  filteredCount: number;
  favoritesCount: number;
}

const DEFAULT_STORAGE_KEY = "mei-crm-communication-templates";

function getNowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix = "template"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function isValidDate(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function normalizeText(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function isTemplateChannel(value: unknown): value is TemplateChannel {
  return (
    value === "email" ||
    value === "whatsapp" ||
    value === "sms" ||
    value === "internal"
  );
}

function isTemplateVisibility(value: unknown): value is TemplateVisibility {
  return value === "private" || value === "team" || value === "global";
}

function isTemplateSortBy(value: unknown): value is TemplateSortBy {
  return (
    value === "recent" ||
    value === "most-used" ||
    value === "title-asc" ||
    value === "title-desc" ||
    value === "newest" ||
    value === "oldest"
  );
}

function normalizeChannel(value: unknown): TemplateChannel {
  return isTemplateChannel(value) ? value : "whatsapp";
}

function normalizeVisibility(value: unknown): TemplateVisibility {
  return isTemplateVisibility(value) ? value : "team";
}

function normalizeSortBy(value: unknown): TemplateSortBy {
  return isTemplateSortBy(value) ? value : "recent";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function extractVariables(content: string, subject?: string): string[] {
  const source = `${subject ?? ""} ${content}`;
  const matches = source.match(/{{\s*[\w.]+\s*}}/g) ?? [];

  return uniqueStrings(
    matches.map((match) => match.replace(/[{}]/g, "").trim())
  );
}

type TemplateLike = Partial<TemplateRecord> & {
  channel?: TemplateChannel | string;
  visibility?: TemplateVisibility | string;
};

function normalizeTemplate(input: TemplateLike): TemplateRecord {
  const now = getNowIso();
  const content = typeof input.content === "string" ? input.content : "";
  const subject =
    typeof input.subject === "string" && input.subject.trim()
      ? input.subject.trim()
      : undefined;

  const derivedVariables = extractVariables(content, subject);

  return {
    id: typeof input.id === "string" && input.id.trim() ? input.id : generateId(),
    title:
      typeof input.title === "string" && input.title.trim()
        ? input.title.trim()
        : "Untitled Template",
    category:
      typeof input.category === "string" && input.category.trim()
        ? input.category.trim()
        : "General",
    channel: normalizeChannel(input.channel),
    subject,
    content,
    variables: uniqueStrings([
      ...normalizeStringArray(input.variables),
      ...derivedVariables,
    ]),
    tags: uniqueStrings(normalizeStringArray(input.tags)),
    visibility: normalizeVisibility(input.visibility),
    isFavorite: Boolean(input.isFavorite),
    usageCount:
      typeof input.usageCount === "number" && Number.isFinite(input.usageCount)
        ? input.usageCount
        : 0,
    lastUsedAt: isValidDate(input.lastUsedAt) ? String(input.lastUsedAt) : null,
    createdBy:
      typeof input.createdBy === "string" && input.createdBy.trim()
        ? input.createdBy.trim()
        : "Unknown",
    createdAt: isValidDate(input.createdAt) ? String(input.createdAt) : now,
    updatedAt: isValidDate(input.updatedAt) ? String(input.updatedAt) : now,
  };
}

function sortTemplates(
  templates: TemplateRecord[],
  sortBy: TemplateSortBy
): TemplateRecord[] {
  const sorted = [...templates];

  sorted.sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    switch (sortBy) {
      case "most-used":
        return b.usageCount - a.usageCount;

      case "title-asc":
        return a.title.localeCompare(b.title);

      case "title-desc":
        return b.title.localeCompare(a.title);

      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      case "recent":
      default:
        return (
          new Date(b.lastUsedAt ?? b.updatedAt).getTime() -
          new Date(a.lastUsedAt ?? a.updatedAt).getTime()
        );
    }
  });

  return sorted;
}

function replaceTemplateVariables(
  value: string,
  variables?: Record<string, string | number>
): string {
  if (!variables) {
    return value;
  }

  return value.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) => {
    const resolved = variables[key];
    return resolved !== undefined && resolved !== null ? String(resolved) : `{{${key}}}`;
  });
}

function seedTemplates(): TemplateRecord[] {
  const now = getNowIso();

  const seeded: TemplateRecord[] = [
    {
      id: generateId(),
      title: "Project Pricing Follow-up",
      category: "Sales Follow-up",
      channel: "email",
      subject: "Updated pricing for {{projectName}}",
      content:
        "Hi {{clientName}},\n\nPlease find the updated pricing and payment plan for {{projectName}}.\n\nLet me know a good time for a quick call.\n\nRegards,\n{{agentName}}",
      variables: ["projectName", "clientName", "agentName"],
      tags: ["pricing", "sales", "follow-up"],
      visibility: "team",
      isFavorite: true,
      usageCount: 12,
      lastUsedAt: now,
      createdBy: "Balraj",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Site Visit Reminder",
      category: "Appointment",
      channel: "whatsapp",
      content:
        "Hi {{clientName}}, gentle reminder for your site visit to {{projectName}} on {{visitDate}} at {{visitTime}}. Please reply YES to confirm.",
      variables: ["clientName", "projectName", "visitDate", "visitTime"],
      tags: ["site visit", "reminder"],
      visibility: "team",
      isFavorite: true,
      usageCount: 20,
      lastUsedAt: now,
      createdBy: "Balraj",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Missed Call Callback SMS",
      category: "Lead Response",
      channel: "sms",
      content:
        "Hi {{clientName}}, sorry we missed your call. We will get back to you shortly regarding {{projectName}}. - {{brandName}}",
      variables: ["clientName", "projectName", "brandName"],
      tags: ["callback", "sms"],
      visibility: "team",
      isFavorite: false,
      usageCount: 8,
      lastUsedAt: now,
      createdBy: "Balraj",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Internal Escalation Note",
      category: "Internal",
      channel: "internal",
      content:
        "Lead {{leadId}} needs urgent manager review. Budget concern: {{budgetConcern}}. Next action owner: {{ownerName}}.",
      variables: ["leadId", "budgetConcern", "ownerName"],
      tags: ["internal", "escalation"],
      visibility: "private",
      isFavorite: false,
      usageCount: 4,
      lastUsedAt: now,
      createdBy: "Balraj",
      createdAt: now,
      updatedAt: now,
    },
  ];

  return seeded.map((template) => normalizeTemplate(template));
}

export default function useTemplates(
  options: UseTemplatesOptions = {}
): UseTemplatesResult {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    seedDemoData = true,
    initialFilters,
  } = options;

  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [filters, setFilters] = useState<TemplateFilterState>({
    searchQuery: initialFilters?.searchQuery ?? "",
    channel: initialFilters?.channel ?? "all",
    category: initialFilters?.category ?? "all",
    visibility: initialFilters?.visibility ?? "all",
    favoritesOnly: initialFilters?.favoritesOnly ?? false,
    sortBy: normalizeSortBy(initialFilters?.sortBy),
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (raw) {
        const parsed = JSON.parse(raw) as TemplateLike[];
        setTemplates(parsed.map((item) => normalizeTemplate(item)));
        return;
      }

      if (seedDemoData) {
        setTemplates(seedTemplates());
      }
    } catch {
      if (seedDemoData) {
        setTemplates(seedTemplates());
      }
    }
  }, [storageKey, seedDemoData]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(templates));
    } catch {
      // ignore storage issues
    }
  }, [storageKey, templates]);

  const availableCategories = useMemo<string[]>(() => {
    return Array.from(new Set(templates.map((template) => template.category))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [templates]);

  const availableTags = useMemo<string[]>(() => {
    return Array.from(new Set(templates.flatMap((template) => template.tags))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [templates]);

  const filteredTemplates = useMemo<TemplateRecord[]>(() => {
    const query = normalizeText(filters.searchQuery);

    const result = templates.filter((template) => {
      if (filters.channel !== "all" && template.channel !== filters.channel) {
        return false;
      }

      if (filters.category !== "all" && template.category !== filters.category) {
        return false;
      }

      if (filters.visibility !== "all" && template.visibility !== filters.visibility) {
        return false;
      }

      if (filters.favoritesOnly && !template.isFavorite) {
        return false;
      }

      if (query) {
        const matches =
          normalizeText(template.title).includes(query) ||
          normalizeText(template.category).includes(query) ||
          normalizeText(template.channel).includes(query) ||
          normalizeText(template.subject).includes(query) ||
          normalizeText(template.content).includes(query) ||
          normalizeText(template.createdBy).includes(query) ||
          template.tags.some((tag) => normalizeText(tag).includes(query)) ||
          template.variables.some((variable) => normalizeText(variable).includes(query));

        if (!matches) {
          return false;
        }
      }

      return true;
    });

    return sortTemplates(result, filters.sortBy);
  }, [templates, filters]);

  const favoriteTemplates = useMemo<TemplateRecord[]>(() => {
    return sortTemplates(
      templates.filter((template) => template.isFavorite),
      filters.sortBy
    );
  }, [templates, filters.sortBy]);

  const recentTemplates = useMemo<TemplateRecord[]>(() => {
    return sortTemplates(templates, "recent").slice(0, 10);
  }, [templates]);

  const mostUsedTemplates = useMemo<TemplateRecord[]>(() => {
    return sortTemplates(templates, "most-used").slice(0, 10);
  }, [templates]);

  const addTemplate = (input: TemplateInput): TemplateRecord => {
    const now = getNowIso();

    const newTemplate = normalizeTemplate({
      id: generateId(),
      title: input.title,
      category: input.category,
      channel: input.channel,
      subject: input.subject,
      content: input.content,
      variables: input.variables,
      tags: input.tags,
      visibility: input.visibility ?? "team",
      isFavorite: Boolean(input.isFavorite),
      usageCount: 0,
      lastUsedAt: null,
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    setTemplates((current) => [newTemplate, ...current]);
    return newTemplate;
  };

  const updateTemplate = (
    templateId: string,
    updates: Partial<Omit<TemplateRecord, "id" | "createdAt" | "createdBy">>
  ): TemplateRecord | null => {
    const existing = templates.find((template) => template.id === templateId);

    if (!existing) {
      return null;
    }

    const updatedTemplate = normalizeTemplate({
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      createdBy: existing.createdBy,
      updatedAt: getNowIso(),
    });

    setTemplates((current) =>
      current.map((template) => (template.id === templateId ? updatedTemplate : template))
    );

    return updatedTemplate;
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((current) => current.filter((template) => template.id !== templateId));
  };

  const duplicateTemplate = (templateId: string): TemplateRecord | null => {
    const existing = templates.find((template) => template.id === templateId);

    if (!existing) {
      return null;
    }

    const now = getNowIso();

    const duplicated = normalizeTemplate({
      ...existing,
      id: generateId(),
      title: `${existing.title} Copy`,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    setTemplates((current) => [duplicated, ...current]);
    return duplicated;
  };

  const favoriteTemplate = (templateId: string): TemplateRecord | null => {
    return updateTemplate(templateId, { isFavorite: true });
  };

  const unfavoriteTemplate = (templateId: string): TemplateRecord | null => {
    return updateTemplate(templateId, { isFavorite: false });
  };

  const incrementTemplateUsage = (templateId: string): TemplateRecord | null => {
    const existing = templates.find((template) => template.id === templateId);

    if (!existing) {
      return null;
    }

    const updated = normalizeTemplate({
      ...existing,
      usageCount: existing.usageCount + 1,
      lastUsedAt: getNowIso(),
      updatedAt: getNowIso(),
    });

    setTemplates((current) =>
      current.map((template) => (template.id === templateId ? updated : template))
    );

    return updated;
  };

  const getTemplateById = (templateId: string): TemplateRecord | undefined => {
    return templates.find((template) => template.id === templateId);
  };

  const getTemplatesByChannel = (channel: TemplateChannel): TemplateRecord[] => {
    return sortTemplates(
      templates.filter((template) => template.channel === channel),
      "recent"
    );
  };

  const renderTemplateRecord = (
    template: TemplateRecord,
    variables?: Record<string, string | number>
  ): { subject?: string; content: string } => {
    return {
      subject: template.subject
        ? replaceTemplateVariables(template.subject, variables)
        : undefined,
      content: replaceTemplateVariables(template.content, variables),
    };
  };

  const renderTemplate = (
    templateId: string,
    variables?: Record<string, string | number>
  ): { subject?: string; content: string } | null => {
    const template = templates.find((item) => item.id === templateId);

    if (!template) {
      return null;
    }

    return renderTemplateRecord(template, variables);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      channel: "all",
      category: "all",
      visibility: "all",
      favoritesOnly: false,
      sortBy: "recent",
    });
  };

  return {
    templates,
    filteredTemplates,
    favoriteTemplates,
    recentTemplates,
    mostUsedTemplates,
    availableCategories,
    availableTags,

    filters,
    setSearchQuery: (value) =>
      setFilters((current) => ({ ...current, searchQuery: value })),
    setChannel: (value) =>
      setFilters((current) => ({ ...current, channel: value })),
    setCategory: (value) =>
      setFilters((current) => ({ ...current, category: value })),
    setVisibility: (value) =>
      setFilters((current) => ({ ...current, visibility: value })),
    setFavoritesOnly: (value) =>
      setFilters((current) => ({ ...current, favoritesOnly: value })),
    setSortBy: (value) =>
      setFilters((current) => ({ ...current, sortBy: value })),
    clearFilters,

    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    favoriteTemplate,
    unfavoriteTemplate,
    incrementTemplateUsage,

    getTemplateById,
    getTemplatesByChannel,
    renderTemplate,
    renderTemplateRecord,

    totalCount: templates.length,
    filteredCount: filteredTemplates.length,
    favoritesCount: templates.filter((template) => template.isFavorite).length,
  };
}