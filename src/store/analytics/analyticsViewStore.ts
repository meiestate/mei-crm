import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "custom";

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  dateRange?: AnalyticsDateRangeKey;
  compareStartDate?: string;
  compareEndDate?: string;
  compareEnabled?: boolean;
  ownerIds?: string[];
  agentIds?: string[];
  teamIds?: string[];
  sourceIds?: string[];
  campaignIds?: string[];
  projectIds?: string[];
  stageIds?: string[];
  locationIds?: string[];
  statuses?: string[];
  channels?: string[];
  priorities?: string[];
  tags?: string[];
  search?: string;
  segment?: string;
  groupBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type AnalyticsViewSection =
  | "dashboard"
  | "overview"
  | "forecast"
  | "leads"
  | "marketing"
  | "pipeline"
  | "revenue"
  | "team-performance";

export interface AnalyticsSavedView {
  id: string;
  name: string;
  section: AnalyticsViewSection;
  description?: string;
  filters: AnalyticsFilters;
  isDefault?: boolean;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsViewStoreState {
  views: AnalyticsSavedView[];
  activeViewId: string | null;

  setViews: (views: AnalyticsSavedView[]) => void;
  addView: (
    input: Omit<AnalyticsSavedView, "id" | "createdAt" | "updatedAt">
  ) => AnalyticsSavedView;
  updateView: (
    id: string,
    updates: Partial<Omit<AnalyticsSavedView, "id" | "createdAt">>
  ) => void;
  deleteView: (id: string) => void;
  duplicateView: (id: string) => AnalyticsSavedView | null;
  setActiveViewId: (id: string | null) => void;
  setDefaultView: (id: string) => void;
  pinView: (id: string, pinned?: boolean) => void;
  clearViews: () => void;

  getViewById: (id: string) => AnalyticsSavedView | null;
  getActiveView: () => AnalyticsSavedView | null;
  getViewsBySection: (section: AnalyticsViewSection) => AnalyticsSavedView[];
}

export const ANALYTICS_VIEW_STORAGE_KEY = "mei-analytics-views";

const createViewId = (): string => {
  return `analytics-view-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const nowIso = (): string => new Date().toISOString();

const sanitizeFilters = (filters: AnalyticsFilters): AnalyticsFilters => {
  const next: AnalyticsFilters = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      (next as Record<string, unknown>)[key] = [...value];
      return;
    }

    (next as Record<string, unknown>)[key] = value;
  });

  return next;
};

export const getDefaultAnalyticsViews = (): AnalyticsSavedView[] => [
  {
    id: "analytics-default-dashboard",
    name: "Default Dashboard View",
    section: "dashboard",
    description: "Core dashboard snapshot with default filters.",
    filters: {
      dateRange: "last30days",
      compareEnabled: false,
      page: 1,
      limit: 10,
      sortOrder: "desc",
    },
    isDefault: true,
    isPinned: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export const useAnalyticsViewStore = create<AnalyticsViewStoreState>()(
  persist(
    (set, get) => ({
      views: getDefaultAnalyticsViews(),
      activeViewId: "analytics-default-dashboard",

      setViews: (views: AnalyticsSavedView[]) => {
        set({
          views,
          activeViewId:
            views.find((view) => view.isDefault)?.id ?? views[0]?.id ?? null,
        });
      },

      addView: (
        input: Omit<AnalyticsSavedView, "id" | "createdAt" | "updatedAt">
      ) => {
        const createdView: AnalyticsSavedView = {
          ...input,
          id: createViewId(),
          filters: sanitizeFilters(input.filters),
          isDefault: input.isDefault ?? false,
          isPinned: input.isPinned ?? false,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };

        set((state) => {
          let nextViews = [...state.views, createdView];

          if (createdView.isDefault) {
            nextViews = nextViews.map((view) => ({
              ...view,
              isDefault: view.id === createdView.id,
            }));
          }

          return {
            views: nextViews,
            activeViewId: createdView.id,
          };
        });

        return createdView;
      },

      updateView: (
        id: string,
        updates: Partial<Omit<AnalyticsSavedView, "id" | "createdAt">>
      ) => {
        set((state) => {
          const nextViews = state.views.map((view) => {
            if (view.id !== id) return view;

            return {
              ...view,
              ...updates,
              filters: updates.filters
                ? sanitizeFilters(updates.filters)
                : view.filters,
              updatedAt: nowIso(),
            };
          });

          const updatedTarget = nextViews.find((view) => view.id === id);

          if (updatedTarget?.isDefault) {
            return {
              views: nextViews.map((view) => ({
                ...view,
                isDefault: view.id === id,
              })),
            };
          }

          return {
            views: nextViews,
          };
        });
      },

      deleteView: (id: string) => {
        set((state) => {
          const target = state.views.find((view) => view.id === id);
          const remainingViews = state.views.filter((view) => view.id !== id);

          if (remainingViews.length === 0) {
            const fallbackViews = getDefaultAnalyticsViews();

            return {
              views: fallbackViews,
              activeViewId: fallbackViews[0]?.id ?? null,
            };
          }

          if (target?.isDefault) {
            remainingViews[0] = {
              ...remainingViews[0],
              isDefault: true,
              updatedAt: nowIso(),
            };
          }

          return {
            views: remainingViews,
            activeViewId:
              state.activeViewId === id
                ? remainingViews.find((view) => view.isDefault)?.id ??
                  remainingViews[0]?.id ??
                  null
                : state.activeViewId,
          };
        });
      },

      duplicateView: (id: string) => {
        const source = get().views.find((view) => view.id === id);

        if (!source) return null;

        const duplicatedView: AnalyticsSavedView = {
          ...source,
          id: createViewId(),
          name: `${source.name} Copy`,
          isDefault: false,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          filters: sanitizeFilters(source.filters),
        };

        set((state) => ({
          views: [...state.views, duplicatedView],
          activeViewId: duplicatedView.id,
        }));

        return duplicatedView;
      },

      setActiveViewId: (id: string | null) => {
        set({
          activeViewId: id,
        });
      },

      setDefaultView: (id: string) => {
        set((state) => ({
          views: state.views.map((view) => ({
            ...view,
            isDefault: view.id === id,
            updatedAt: view.id === id ? nowIso() : view.updatedAt,
          })),
          activeViewId: id,
        }));
      },

      pinView: (id: string, pinned = true) => {
        set((state) => ({
          views: state.views.map((view) =>
            view.id === id
              ? {
                  ...view,
                  isPinned: pinned,
                  updatedAt: nowIso(),
                }
              : view
          ),
        }));
      },

      clearViews: () => {
        const defaults = getDefaultAnalyticsViews();

        set({
          views: defaults,
          activeViewId: defaults[0]?.id ?? null,
        });
      },

      getViewById: (id: string) => {
        return get().views.find((view) => view.id === id) ?? null;
      },

      getActiveView: () => {
        const { views, activeViewId } = get();
        return views.find((view) => view.id === activeViewId) ?? null;
      },

      getViewsBySection: (section: AnalyticsViewSection) => {
        return get().views.filter((view) => view.section === section);
      },
    }),
    {
      name: ANALYTICS_VIEW_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        views: state.views,
        activeViewId: state.activeViewId,
      }),
    }
  )
);

export const selectAnalyticsViews = (
  state: AnalyticsViewStoreState
): AnalyticsSavedView[] => state.views;

export const selectActiveAnalyticsViewId = (
  state: AnalyticsViewStoreState
): string | null => state.activeViewId;

export const selectActiveAnalyticsView = (
  state: AnalyticsViewStoreState
): AnalyticsSavedView | null => state.getActiveView();

export default useAnalyticsViewStore;