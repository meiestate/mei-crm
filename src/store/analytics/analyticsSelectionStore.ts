import { create } from "zustand";

export type AnalyticsSectionKey =
  | "dashboard"
  | "overview"
  | "forecast"
  | "leads"
  | "marketing"
  | "pipeline"
  | "revenue"
  | "team-performance";

export type AnalyticsViewMode = "summary" | "detailed";
export type AnalyticsCompareMode = "none" | "previous-period" | "custom";

export interface AnalyticsDrilldownSelection {
  section: AnalyticsSectionKey | null;
  chartKey: string | null;
  metricKey: string | null;
  label: string | null;
}

export interface AnalyticsSelectionState {
  activeSection: AnalyticsSectionKey;
  selectedViewId: string | null;
  selectedChartKey: string | null;
  selectedMetricKey: string | null;
  selectedTableKey: string | null;
  selectedRowId: string | null;
  viewMode: AnalyticsViewMode;
  compareMode: AnalyticsCompareMode;
  isDrilldownOpen: boolean;
  isExportModalOpen: boolean;
  isSaveViewModalOpen: boolean;
  drilldown: AnalyticsDrilldownSelection;

  setActiveSection: (section: AnalyticsSectionKey) => void;
  setSelectedViewId: (viewId: string | null) => void;
  setSelectedChartKey: (chartKey: string | null) => void;
  setSelectedMetricKey: (metricKey: string | null) => void;
  setSelectedTableKey: (tableKey: string | null) => void;
  setSelectedRowId: (rowId: string | null) => void;
  setViewMode: (mode: AnalyticsViewMode) => void;
  setCompareMode: (mode: AnalyticsCompareMode) => void;

  openDrilldown: (payload: {
    section?: AnalyticsSectionKey | null;
    chartKey?: string | null;
    metricKey?: string | null;
    label?: string | null;
  }) => void;
  closeDrilldown: () => void;

  openExportModal: () => void;
  closeExportModal: () => void;

  openSaveViewModal: () => void;
  closeSaveViewModal: () => void;

  resetSelection: () => void;
  resetSectionSelection: () => void;
}

export const getDefaultAnalyticsSelectionState = () => ({
  activeSection: "dashboard" as AnalyticsSectionKey,
  selectedViewId: null,
  selectedChartKey: null,
  selectedMetricKey: null,
  selectedTableKey: null,
  selectedRowId: null,
  viewMode: "summary" as AnalyticsViewMode,
  compareMode: "none" as AnalyticsCompareMode,
  isDrilldownOpen: false,
  isExportModalOpen: false,
  isSaveViewModalOpen: false,
  drilldown: {
    section: null,
    chartKey: null,
    metricKey: null,
    label: null,
  } satisfies AnalyticsDrilldownSelection,
});

export const useAnalyticsSelectionStore = create<AnalyticsSelectionState>(
  (set, get) => ({
    ...getDefaultAnalyticsSelectionState(),

    setActiveSection: (section: AnalyticsSectionKey) => {
      set({
        activeSection: section,
        selectedChartKey: null,
        selectedMetricKey: null,
        selectedTableKey: null,
        selectedRowId: null,
        isDrilldownOpen: false,
        drilldown: {
          section: null,
          chartKey: null,
          metricKey: null,
          label: null,
        },
      });
    },

    setSelectedViewId: (viewId: string | null) => {
      set({
        selectedViewId: viewId,
      });
    },

    setSelectedChartKey: (chartKey: string | null) => {
      set({
        selectedChartKey: chartKey,
      });
    },

    setSelectedMetricKey: (metricKey: string | null) => {
      set({
        selectedMetricKey: metricKey,
      });
    },

    setSelectedTableKey: (tableKey: string | null) => {
      set({
        selectedTableKey: tableKey,
      });
    },

    setSelectedRowId: (rowId: string | null) => {
      set({
        selectedRowId: rowId,
      });
    },

    setViewMode: (mode: AnalyticsViewMode) => {
      set({
        viewMode: mode,
      });
    },

    setCompareMode: (mode: AnalyticsCompareMode) => {
      set({
        compareMode: mode,
      });
    },

    openDrilldown: (payload) => {
      const state = get();

      set({
        isDrilldownOpen: true,
        selectedChartKey: payload.chartKey ?? state.selectedChartKey,
        selectedMetricKey: payload.metricKey ?? state.selectedMetricKey,
        drilldown: {
          section: payload.section ?? state.activeSection,
          chartKey: payload.chartKey ?? state.selectedChartKey,
          metricKey: payload.metricKey ?? state.selectedMetricKey,
          label: payload.label ?? null,
        },
      });
    },

    closeDrilldown: () => {
      set({
        isDrilldownOpen: false,
        drilldown: {
          section: null,
          chartKey: null,
          metricKey: null,
          label: null,
        },
      });
    },

    openExportModal: () => {
      set({
        isExportModalOpen: true,
      });
    },

    closeExportModal: () => {
      set({
        isExportModalOpen: false,
      });
    },

    openSaveViewModal: () => {
      set({
        isSaveViewModalOpen: true,
      });
    },

    closeSaveViewModal: () => {
      set({
        isSaveViewModalOpen: false,
      });
    },

    resetSelection: () => {
      set({
        ...getDefaultAnalyticsSelectionState(),
      });
    },

    resetSectionSelection: () => {
      set((state) => ({
        activeSection: state.activeSection,
        selectedViewId: state.selectedViewId,
        selectedChartKey: null,
        selectedMetricKey: null,
        selectedTableKey: null,
        selectedRowId: null,
        viewMode: state.viewMode,
        compareMode: state.compareMode,
        isDrilldownOpen: false,
        isExportModalOpen: false,
        isSaveViewModalOpen: false,
        drilldown: {
          section: null,
          chartKey: null,
          metricKey: null,
          label: null,
        },
      }));
    },
  })
);

export const selectActiveAnalyticsSection = (
  state: AnalyticsSelectionState
): AnalyticsSectionKey => state.activeSection;

export const selectAnalyticsViewMode = (
  state: AnalyticsSelectionState
): AnalyticsViewMode => state.viewMode;

export const selectAnalyticsCompareMode = (
  state: AnalyticsSelectionState
): AnalyticsCompareMode => state.compareMode;

export const selectAnalyticsDrilldownState = (
  state: AnalyticsSelectionState
): AnalyticsDrilldownSelection => state.drilldown;

export const selectIsAnalyticsDrilldownOpen = (
  state: AnalyticsSelectionState
): boolean => state.isDrilldownOpen;

export const selectIsAnalyticsExportModalOpen = (
  state: AnalyticsSelectionState
): boolean => state.isExportModalOpen;

export const selectIsAnalyticsSaveViewModalOpen = (
  state: AnalyticsSelectionState
): boolean => state.isSaveViewModalOpen;

export default useAnalyticsSelectionStore;