// src/hooks/analytics/useComparePeriod.ts

import { useCallback, useMemo, useState } from 'react';

export type ComparePeriodType =
  | 'previous_period'
  | 'previous_week'
  | 'previous_month'
  | 'previous_quarter'
  | 'previous_year'
  | 'custom';

export interface CompareDateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface ComparePeriodState {
  enabled: boolean;
  type: ComparePeriodType;
  currentRange: CompareDateRange;
  compareRange: CompareDateRange;
}

export interface CompareChangeResult {
  currentValue: number;
  previousValue: number;
  difference: number;
  percentageChange: number;
  direction: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  isNegative: boolean;
}

export interface UseComparePeriodConfig {
  initialEnabled?: boolean;
  initialType?: ComparePeriodType;
  initialCurrentRange?: CompareDateRange;
  initialCompareRange?: CompareDateRange;
}

export interface UseComparePeriodReturn {
  comparePeriod: ComparePeriodState;
  isEnabled: boolean;
  compareType: ComparePeriodType;
  currentRange: CompareDateRange;
  compareRange: CompareDateRange;
  enableComparison: () => void;
  disableComparison: () => void;
  toggleComparison: () => void;
  setCompareType: (type: ComparePeriodType) => void;
  setCurrentRange: (range: CompareDateRange) => void;
  setCompareRange: (range: CompareDateRange) => void;
  setRanges: (currentRange: CompareDateRange, compareRange: CompareDateRange) => void;
  calculateChange: (currentValue: number, previousValue: number) => CompareChangeResult;
  resetComparePeriod: () => void;
}

const DEFAULT_CURRENT_RANGE: CompareDateRange = {
  startDate: null,
  endDate: null,
};

const DEFAULT_COMPARE_RANGE: CompareDateRange = {
  startDate: null,
  endDate: null,
};

const DEFAULT_COMPARE_PERIOD_STATE: ComparePeriodState = {
  enabled: true,
  type: 'previous_period',
  currentRange: DEFAULT_CURRENT_RANGE,
  compareRange: DEFAULT_COMPARE_RANGE,
};

const safeNumber = (value: number): number => {
  return Number.isFinite(value) ? value : 0;
};

export const useComparePeriod = (
  config?: UseComparePeriodConfig,
): UseComparePeriodReturn => {
  const initialState: ComparePeriodState = {
    enabled: config?.initialEnabled ?? DEFAULT_COMPARE_PERIOD_STATE.enabled,
    type: config?.initialType ?? DEFAULT_COMPARE_PERIOD_STATE.type,
    currentRange:
      config?.initialCurrentRange ?? DEFAULT_COMPARE_PERIOD_STATE.currentRange,
    compareRange:
      config?.initialCompareRange ?? DEFAULT_COMPARE_PERIOD_STATE.compareRange,
  };

  const [comparePeriod, setComparePeriod] =
    useState<ComparePeriodState>(initialState);

  const isEnabled = useMemo<boolean>(() => {
    return comparePeriod.enabled;
  }, [comparePeriod.enabled]);

  const compareType = useMemo<ComparePeriodType>(() => {
    return comparePeriod.type;
  }, [comparePeriod.type]);

  const currentRange = useMemo<CompareDateRange>(() => {
    return comparePeriod.currentRange;
  }, [comparePeriod.currentRange]);

  const compareRange = useMemo<CompareDateRange>(() => {
    return comparePeriod.compareRange;
  }, [comparePeriod.compareRange]);

  const enableComparison = useCallback(() => {
    setComparePeriod((prev) => ({
      ...prev,
      enabled: true,
    }));
  }, []);

  const disableComparison = useCallback(() => {
    setComparePeriod((prev) => ({
      ...prev,
      enabled: false,
    }));
  }, []);

  const toggleComparison = useCallback(() => {
    setComparePeriod((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  const setCompareType = useCallback((type: ComparePeriodType) => {
    setComparePeriod((prev) => ({
      ...prev,
      type,
    }));
  }, []);

  const setCurrentRange = useCallback((range: CompareDateRange) => {
    setComparePeriod((prev) => ({
      ...prev,
      currentRange: range,
    }));
  }, []);

  const setCompareRange = useCallback((range: CompareDateRange) => {
    setComparePeriod((prev) => ({
      ...prev,
      compareRange: range,
    }));
  }, []);

  const setRanges = useCallback(
    (currentRangeValue: CompareDateRange, compareRangeValue: CompareDateRange) => {
      setComparePeriod((prev) => ({
        ...prev,
        currentRange: currentRangeValue,
        compareRange: compareRangeValue,
      }));
    },
    [],
  );

  const calculateChange = useCallback(
    (currentValue: number, previousValue: number): CompareChangeResult => {
      const safeCurrentValue = safeNumber(currentValue);
      const safePreviousValue = safeNumber(previousValue);

      const difference = safeCurrentValue - safePreviousValue;

      let percentageChange = 0;

      if (safePreviousValue === 0) {
        if (safeCurrentValue > 0) {
          percentageChange = 100;
        } else if (safeCurrentValue < 0) {
          percentageChange = -100;
        } else {
          percentageChange = 0;
        }
      } else {
        percentageChange = (difference / safePreviousValue) * 100;
      }

      let direction: 'up' | 'down' | 'neutral' = 'neutral';

      if (difference > 0) {
        direction = 'up';
      } else if (difference < 0) {
        direction = 'down';
      }

      return {
        currentValue: safeCurrentValue,
        previousValue: safePreviousValue,
        difference,
        percentageChange,
        direction,
        isPositive: difference > 0,
        isNegative: difference < 0,
      };
    },
    [],
  );

  const resetComparePeriod = useCallback(() => {
    setComparePeriod(initialState);
  }, [initialState]);

  return {
    comparePeriod,
    isEnabled,
    compareType,
    currentRange,
    compareRange,
    enableComparison,
    disableComparison,
    toggleComparison,
    setCompareType,
    setCurrentRange,
    setCompareRange,
    setRanges,
    calculateChange,
    resetComparePeriod,
  };
};