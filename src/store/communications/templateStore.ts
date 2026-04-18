import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TemplateChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "internal-note"
  | "chat"
  | "all";

export type TemplateStatus = "active" | "draft" | "archived";
export type TemplateVisibility = "private" | "team" | "public";

export interface TemplateVariable {
  key: string;
  label: string;
  fallback?: string;
  required?: boolean;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  channel: Exclude<TemplateChannel, "all">;
  subject?: string;
  body: string;
  previewText?: string;
  variables: TemplateVariable[];
  tags: string[];
  status: TemplateStatus;
  visibility: TemplateVisibility;
  isFavorite: boolean;
  isPinned: boolean;
  usageCount: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilters {
  search: string;
  channel: TemplateChannel;
  category: string | "all";
  status: TemplateStatus | "all";
  visibility: TemplateVisibility | "all";
  favoritesOnly: boolean;
  pinnedOnly: boolean;
}

export interface TemplateDraftInput {
  name: string;
  description?: string;
  category: string;
  channel: Exclude<TemplateChannel, "all">;
  subject?: string;
  body: string;
  previewText?: string;
  variables?: TemplateVariable[];
  tags?: string[];
  status?: TemplateStatus;
  visibility?: TemplateVisibility;
  createdBy?: string;
}

export interface TemplateStoreState {
  templates: CommunicationTemplate[];
  selectedTemplateId: string | null;
  filters: TemplateFilters;
  isTemplatePickerOpen: boolean;
  isTemplatePreviewOpen: boolean;
  isLoading: boolean;
  error: string | null;

  setTemplates: (templates: CommunicationTemplate[]) => void;
  addTemplate: (input: TemplateDraftInput) => CommunicationTemplate;
  updateTemplate: (
    templateId: string,
    updates: Partial<Omit<CommunicationTemplate, "id" | "createdAt">>
  ) => void;
  deleteTemplate: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => CommunicationTemplate | null;

  setSelectedTemplateId: (templateId: string | null) => void;
  incrementUsage: (templateId: string) => void;
  toggleFavorite: (templateId: string) => void;
  togglePinned: (templateId: string) => void;

  setFilters: (filters: Partial<TemplateFilters>) => void;
  resetFilters: () => void;

  openTemplatePicker: () => void;
  closeTemplatePicker: () => void;
  openTemplatePreview: (templateId?: string | null) => void;
  closeTemplatePreview: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTemplates: () => void;

  getTemplateById: (templateId: string) => CommunicationTemplate | null;
  getFilteredTemplates: () => CommunicationTemplate[];
  getCategories: () => string[];
}

const STORAGE_KEY = "mei-template-store";

export const getDefaultTemplateFilters = (): TemplateFilters => ({
  search: "",
  channel: "all",
  category: "all",
  status: "all",
  visibility: "all",
  favoritesOnly: false,
  pinnedOnly: false,
});

const nowIso = (): string => new Date().toISOString();

const createTemplateId = (): string => {
  return `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const sortTemplates = (
  templates: CommunicationTemplate[]
): CommunicationTemplate[] => {
  return [...templates].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

export const getDefaultTemplates = (): CommunicationTemplate[] => [
  {
    id: "tpl-default-email-followup",
    name: "Follow-up Email",
    description: "Basic sales follow-up template for leads.",
    category: "Sales",
    channel: "email",
    subject: "Quick Follow-up on Your Interest",
    body: "Hi {{leadName}},\n\nJust following up regarding your interest in {{projectName}}. Let me know a good time to connect.\n\nBest regards,\n{{agentName}}",
    previewText: "Follow-up regarding your interest in the project.",
    variables: [
      { key: "leadName", label: "Lead Name", fallback: "Customer" },
      { key: "projectName", label: "Project Name" },
      { key: "agentName", label: "Agent Name" },
    ],
    tags: ["sales", "follow-up"],
    status: "active",
    visibility: "team",
    isFavorite: true,
    isPinned: true,
    usageCount: 0,
    createdBy: "system",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "tpl-default-whatsapp-reminder",
    name: "WhatsApp Reminder",
    description: "Friendly reminder message for customer follow-up.",
    category: "Reminders",
    channel: "whatsapp",
    body: "Hi {{leadName}}, just a gentle reminder about our discussion on {{projectName}}. Reply here when you're free.",
    previewText: "Gentle reminder for WhatsApp follow-up.",
    variables: [
      { key: "leadName", label: "Lead Name", fallback: "Customer" },
      { key: "projectName", label: "Project Name" },
    ],
    tags: ["whatsapp", "reminder"],
    status: "active",
    visibility: "team",
    isFavorite: false,
    isPinned: false,
    usageCount: 0,
    createdBy: "system",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export const useTemplateStore = create<TemplateStoreState>()(
  persist(
    (set, get) => ({
      templates: getDefaultTemplates(),
      selectedTemplateId: null,
      filters: getDefaultTemplateFilters(),
      isTemplatePickerOpen: false,
      isTemplatePreviewOpen: false,
      isLoading: false,
      error: null,

      setTemplates: (templates) => {
        set({
          templates: sortTemplates(templates),
          selectedTemplateId: null,
        });
      },

      addTemplate: (input) => {
        const template: CommunicationTemplate = {
          id: createTemplateId(),
          name: input.name,
          description: input.description,
          category: input.category,
          channel: input.channel,
          subject: input.subject,
          body: input.body,
          previewText: input.previewText,
          variables: input.variables ?? [],
          tags: input.tags ?? [],
          status: input.status ?? "draft",
          visibility: input.visibility ?? "private",
          isFavorite: false,
          isPinned: false,
          usageCount: 0,
          createdBy: input.createdBy,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };

        set((state) => ({
          templates: sortTemplates([...state.templates, template]),
          selectedTemplateId: template.id,
        }));

        return template;
      },

      updateTemplate: (templateId, updates) => {
        set((state) => ({
          templates: sortTemplates(
            state.templates.map((template) =>
              template.id === templateId
                ? {
                    ...template,
                    ...updates,
                    updatedAt: nowIso(),
                  }
                : template
            )
          ),
        }));
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter(
            (template) => template.id !== templateId
          ),
          selectedTemplateId:
            state.selectedTemplateId === templateId
              ? null
              : state.selectedTemplateId,
          isTemplatePreviewOpen:
            state.selectedTemplateId === templateId
              ? false
              : state.isTemplatePreviewOpen,
        }));
      },

      duplicateTemplate: (templateId) => {
        const source = get().templates.find(
          (template) => template.id === templateId
        );

        if (!source) return null;

        const duplicate: CommunicationTemplate = {
          ...source,
          id: createTemplateId(),
          name: `${source.name} Copy`,
          isFavorite: false,
          isPinned: false,
          usageCount: 0,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };

        set((state) => ({
          templates: sortTemplates([...state.templates, duplicate]),
          selectedTemplateId: duplicate.id,
        }));

        return duplicate;
      },

      setSelectedTemplateId: (templateId) => {
        set({
          selectedTemplateId: templateId,
        });
      },

      incrementUsage: (templateId) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === templateId
              ? {
                  ...template,
                  usageCount: template.usageCount + 1,
                  updatedAt: nowIso(),
                }
              : template
          ),
        }));
      },

      toggleFavorite: (templateId) => {
        set((state) => ({
          templates: sortTemplates(
            state.templates.map((template) =>
              template.id === templateId
                ? {
                    ...template,
                    isFavorite: !template.isFavorite,
                    updatedAt: nowIso(),
                  }
                : template
            )
          ),
        }));
      },

      togglePinned: (templateId) => {
        set((state) => ({
          templates: sortTemplates(
            state.templates.map((template) =>
              template.id === templateId
                ? {
                    ...template,
                    isPinned: !template.isPinned,
                    updatedAt: nowIso(),
                  }
                : template
            )
          ),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        }));
      },

      resetFilters: () => {
        set({
          filters: getDefaultTemplateFilters(),
        });
      },

      openTemplatePicker: () => {
        set({
          isTemplatePickerOpen: true,
        });
      },

      closeTemplatePicker: () => {
        set({
          isTemplatePickerOpen: false,
        });
      },

      openTemplatePreview: (templateId) => {
        set((state) => ({
          isTemplatePreviewOpen: true,
          selectedTemplateId: templateId ?? state.selectedTemplateId,
        }));
      },

      closeTemplatePreview: () => {
        set({
          isTemplatePreviewOpen: false,
        });
      },

      setLoading: (loading) => {
        set({
          isLoading: loading,
        });
      },

      setError: (error) => {
        set({
          error,
        });
      },

      clearTemplates: () => {
        set({
          templates: getDefaultTemplates(),
          selectedTemplateId: null,
          filters: getDefaultTemplateFilters(),
          isTemplatePickerOpen: false,
          isTemplatePreviewOpen: false,
          isLoading: false,
          error: null,
        });
      },

      getTemplateById: (templateId) => {
        return (
          get().templates.find((template) => template.id === templateId) ?? null
        );
      },

      getFilteredTemplates: () => {
        const { templates, filters } = get();
        const search = filters.search.trim().toLowerCase();

        return templates.filter((template) => {
          const matchesChannel =
            filters.channel === "all" || template.channel === filters.channel;

          const matchesCategory =
            filters.category === "all" || template.category === filters.category;

          const matchesStatus =
            filters.status === "all" || template.status === filters.status;

          const matchesVisibility =
            filters.visibility === "all" ||
            template.visibility === filters.visibility;

          const matchesFavorite =
            !filters.favoritesOnly || template.isFavorite;

          const matchesPinned = !filters.pinnedOnly || template.isPinned;

          const matchesSearch =
            search.length === 0 ||
            template.name.toLowerCase().includes(search) ||
            (template.description ?? "").toLowerCase().includes(search) ||
            (template.subject ?? "").toLowerCase().includes(search) ||
            template.body.toLowerCase().includes(search) ||
            template.category.toLowerCase().includes(search) ||
            template.tags.some((tag) => tag.toLowerCase().includes(search));

          return (
            matchesChannel &&
            matchesCategory &&
            matchesStatus &&
            matchesVisibility &&
            matchesFavorite &&
            matchesPinned &&
            matchesSearch
          );
        });
      },

      getCategories: () => {
        const categories = get().templates.map((template) => template.category);
        return Array.from(new Set(categories)).sort((a, b) =>
          a.localeCompare(b)
        );
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        templates: state.templates,
        selectedTemplateId: state.selectedTemplateId,
        filters: state.filters,
      }),
    }
  )
);

export const selectTemplates = (
  state: TemplateStoreState
): CommunicationTemplate[] => state.templates;

export const selectFilteredTemplates = (
  state: TemplateStoreState
): CommunicationTemplate[] => state.getFilteredTemplates();

export const selectSelectedTemplate = (
  state: TemplateStoreState
): CommunicationTemplate | null =>
  state.selectedTemplateId
    ? state.getTemplateById(state.selectedTemplateId)
    : null;

export const selectTemplateFilters = (
  state: TemplateStoreState
): TemplateFilters => state.filters;

export default useTemplateStore;