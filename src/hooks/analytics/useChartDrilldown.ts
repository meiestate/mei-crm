// src/hooks/analytics/useChartDrilldown.ts

import { useCallback, useMemo, useState } from 'react';

export type ChartDrilldownView =
  | 'summary'
  | 'table'
  | 'trend'
  | 'breakdown'
  | 'comparison'
  | 'custom';

export type ChartDrilldownStatus = 'idle' | 'open';

export interface ChartDrilldownPoint {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  date?: string;
  category?: string;
  region?: string;
  owner?: string;
  source?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartDrilldownPayload {
  chartId: string;
  chartTitle: string;
  chartType?: string;
  section?: string;
  description?: string;
  points: ChartDrilldownPoint[];
  activePoint?: ChartDrilldownPoint | null;
  activeView?: ChartDrilldownView;
  appliedFilters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ChartDrilldownState {
  status: ChartDrilldownStatus;
  isOpen: boolean;
  chartId: string | null;
  chartTitle: string;
  chartType: string | null;
  section: string | null;
  description: string;
  points: ChartDrilldownPoint[];
  activePoint: ChartDrilldownPoint | null;
  activeView: ChartDrilldownView;
  appliedFilters: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface UseChartDrilldownReturn {
  drilldown: ChartDrilldownState;
  isOpen: boolean;
  hasData: boolean;
  totalPoints: number;
  selectedPointLabel: string | null;
  selectedPointValue: number | null;
  openDrilldown: (payload: ChartDrilldownPayload) => void;
  closeDrilldown: () => void;
  toggleDrilldown: (payload?: ChartDrilldownPayload) => void;
  setActiveView: (view: ChartDrilldownView) => void;
  setActivePoint: (point: ChartDrilldownPoint | null) => void;
  selectPointById: (pointId: string) => void;
  updatePoints: (points: ChartDrilldownPoint[]) => void;
  updateMetadata: (metadata: Record<string, unknown>) => void;
  updateAppliedFilters: (filters: Record<string, unknown>) => void;
  resetDrilldown: () => void;
}

const INITIAL_DRILLDOWN_STATE: ChartDrilldownState = {
  status: 'idle',
  isOpen: false,
  chartId: null,
  chartTitle: '',
  chartType: null,
  section: null,
  description: '',
  points: [],
  activePoint: null,
  activeView: 'summary',
  appliedFilters: {},
  metadata: {},
};

export const useChartDrilldown = (): UseChartDrilldownReturn => {
  const [drilldown, setDrilldown] = useState<ChartDrilldownState>(
    INITIAL_DRILLDOWN_STATE,
  );

  const isOpen = useMemo<boolean>(() => drilldown.isOpen, [drilldown.isOpen]);

  const hasData = useMemo<boolean>(() => drilldown.points.length > 0, [drilldown.points]);

  const totalPoints = useMemo<number>(() => drilldown.points.length, [drilldown.points]);

  const selectedPointLabel = useMemo<string | null>(() => {
    return drilldown.activePoint?.label ?? null;
  }, [drilldown.activePoint]);

  const selectedPointValue = useMemo<number | null>(() => {
    return typeof drilldown.activePoint?.value === 'number'
      ? drilldown.activePoint.value
      : null;
  }, [drilldown.activePoint]);

  const openDrilldown = useCallback((payload: ChartDrilldownPayload) => {
    setDrilldown({
      status: 'open',
      isOpen: true,
      chartId: payload.chartId,
      chartTitle: payload.chartTitle,
      chartType: payload.chartType ?? null,
      section: payload.section ?? null,
      description: payload.description ?? '',
      points: payload.points ?? [],
      activePoint:
        payload.activePoint ??
        (payload.points.length > 0 ? payload.points[0] : null),
      activeView: payload.activeView ?? 'summary',
      appliedFilters: payload.appliedFilters ?? {},
      metadata: payload.metadata ?? {},
    });
  }, []);

  const closeDrilldown = useCallback(() => {
    setDrilldown((prev) => ({
      ...prev,
      status: 'idle',
      isOpen: false,
    }));
  }, []);

  const toggleDrilldown = useCallback((payload?: ChartDrilldownPayload) => {
    setDrilldown((prev) => {
      if (prev.isOpen) {
        return {
          ...prev,
          status: 'idle',
          isOpen: false,
        };
      }

      if (!payload) {
        return prev;
      }

      return {
        status: 'open',
        isOpen: true,
        chartId: payload.chartId,
        chartTitle: payload.chartTitle,
        chartType: payload.chartType ?? null,
        section: payload.section ?? null,
        description: payload.description ?? '',
        points: payload.points ?? [],
        activePoint:
          payload.activePoint ??
          (payload.points.length > 0 ? payload.points[0] : null),
        activeView: payload.activeView ?? 'summary',
        appliedFilters: payload.appliedFilters ?? {},
        metadata: payload.metadata ?? {},
      };
    });
  }, []);

  const setActiveView = useCallback((view: ChartDrilldownView) => {
    setDrilldown((prev) => ({
      ...prev,
      activeView: view,
    }));
  }, []);

  const setActivePoint = useCallback((point: ChartDrilldownPoint | null) => {
    setDrilldown((prev) => ({
      ...prev,
      activePoint: point,
    }));
  }, []);

  const selectPointById = useCallback((pointId: string) => {
    setDrilldown((prev) => {
      const matchedPoint =
        prev.points.find((point) => point.id === pointId) ?? prev.activePoint;

      return {
        ...prev,
        activePoint: matchedPoint ?? null,
      };
    });
  }, []);

  const updatePoints = useCallback((points: ChartDrilldownPoint[]) => {
    setDrilldown((prev) => {
      const nextActivePoint =
        prev.activePoint && points.some((point) => point.id === prev.activePoint?.id)
          ? points.find((point) => point.id === prev.activePoint?.id) ?? null
          : points.length > 0
            ? points[0]
            : null;

      return {
        ...prev,
        points,
        activePoint: nextActivePoint,
      };
    });
  }, []);

  const updateMetadata = useCallback((metadata: Record<string, unknown>) => {
    setDrilldown((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...metadata,
      },
    }));
  }, []);

  const updateAppliedFilters = useCallback((filters: Record<string, unknown>) => {
    setDrilldown((prev) => ({
      ...prev,
      appliedFilters: {
        ...prev.appliedFilters,
        ...filters,
      },
    }));
  }, []);

  const resetDrilldown = useCallback(() => {
    setDrilldown(INITIAL_DRILLDOWN_STATE);
  }, []);

  return {
    drilldown,
    isOpen,
    hasData,
    totalPoints,
    selectedPointLabel,
    selectedPointValue,
    openDrilldown,
    closeDrilldown,
    toggleDrilldown,
    setActiveView,
    setActivePoint,
    selectPointById,
    updatePoints,
    updateMetadata,
    updateAppliedFilters,
    resetDrilldown,
  };
};