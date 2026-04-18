export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last14Days"
  | "last30Days"
  | "last90Days"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";

export type AnalyticsDateRangeOption = {
  key: AnalyticsDateRangeKey;
  label: string;
  shortLabel: string;
  description: string;
  compareLabel?: string;
};

export type AnalyticsResolvedDateRange = {
  key: AnalyticsDateRangeKey;
  label: string;
  startDate: string;
  endDate: string;
};

export type AnalyticsCompareRange = {
  startDate: string;
  endDate: string;
};

const pad = (value: number): string => String(value).padStart(2, "0");

export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const endOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const startOfWeek = (date: Date, weekStartsOn: 0 | 1 = 1): Date => {
  const result = startOfDay(date);
  const currentDay = result.getDay();
  const diff = (currentDay - weekStartsOn + 7) % 7;
  result.setDate(result.getDate() - diff);
  return startOfDay(result);
};

export const endOfWeek = (date: Date, weekStartsOn: 0 | 1 = 1): Date => {
  const start = startOfWeek(date, weekStartsOn);
  return endOfDay(addDays(start, 6));
};

export const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const endOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

export const getQuarter = (date: Date): number => Math.floor(date.getMonth() / 3) + 1;

export const startOfQuarter = (date: Date): Date => {
  const quarterStartMonth = (getQuarter(date) - 1) * 3;
  return new Date(date.getFullYear(), quarterStartMonth, 1);
};

export const endOfQuarter = (date: Date): Date => {
  const start = startOfQuarter(date);
  return new Date(start.getFullYear(), start.getMonth() + 3, 0, 23, 59, 59, 999);
};

export const startOfYear = (date: Date): Date => new Date(date.getFullYear(), 0, 1);

export const endOfYear = (date: Date): Date =>
  new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

export const ANALYTICS_DATE_RANGE_OPTIONS: AnalyticsDateRangeOption[] = [
  {
    key: "today",
    label: "Today",
    shortLabel: "Today",
    description: "Current day performance",
    compareLabel: "vs yesterday",
  },
  {
    key: "yesterday",
    label: "Yesterday",
    shortLabel: "Yesterday",
    description: "Previous day snapshot",
    compareLabel: "vs previous day",
  },
  {
    key: "last7Days",
    label: "Last 7 Days",
    shortLabel: "7D",
    description: "Rolling 7-day performance",
    compareLabel: "vs previous 7 days",
  },
  {
    key: "last14Days",
    label: "Last 14 Days",
    shortLabel: "14D",
    description: "Rolling 14-day performance",
    compareLabel: "vs previous 14 days",
  },
  {
    key: "last30Days",
    label: "Last 30 Days",
    shortLabel: "30D",
    description: "Rolling 30-day performance",
    compareLabel: "vs previous 30 days",
  },
  {
    key: "last90Days",
    label: "Last 90 Days",
    shortLabel: "90D",
    description: "Rolling 90-day performance",
    compareLabel: "vs previous 90 days",
  },
  {
    key: "thisWeek",
    label: "This Week",
    shortLabel: "This Week",
    description: "Current week to date",
    compareLabel: "vs last week",
  },
  {
    key: "lastWeek",
    label: "Last Week",
    shortLabel: "Last Week",
    description: "Previous full week",
    compareLabel: "vs previous week",
  },
  {
    key: "thisMonth",
    label: "This Month",
    shortLabel: "This Month",
    description: "Current month to date",
    compareLabel: "vs last month",
  },
  {
    key: "lastMonth",
    label: "Last Month",
    shortLabel: "Last Month",
    description: "Previous full month",
    compareLabel: "vs previous month",
  },
  {
    key: "thisQuarter",
    label: "This Quarter",
    shortLabel: "This Quarter",
    description: "Current quarter to date",
    compareLabel: "vs last quarter",
  },
  {
    key: "lastQuarter",
    label: "Last Quarter",
    shortLabel: "Last Quarter",
    description: "Previous full quarter",
    compareLabel: "vs previous quarter",
  },
  {
    key: "thisYear",
    label: "This Year",
    shortLabel: "This Year",
    description: "Current year to date",
    compareLabel: "vs last year",
  },
  {
    key: "lastYear",
    label: "Last Year",
    shortLabel: "Last Year",
    description: "Previous full year",
    compareLabel: "vs previous year",
  },
  {
    key: "custom",
    label: "Custom Range",
    shortLabel: "Custom",
    description: "User-selected date range",
  },
];

export const ANALYTICS_DEFAULT_DATE_RANGE_KEY: AnalyticsDateRangeKey = "last30Days";

export const getAnalyticsDateRangeOption = (
  key: AnalyticsDateRangeKey
): AnalyticsDateRangeOption => {
  return (
    ANALYTICS_DATE_RANGE_OPTIONS.find((option) => option.key === key) ??
    ANALYTICS_DATE_RANGE_OPTIONS.find(
      (option) => option.key === ANALYTICS_DEFAULT_DATE_RANGE_KEY
    )!
  );
};

export const resolveAnalyticsDateRange = (
  key: AnalyticsDateRangeKey,
  now: Date = new Date(),
  weekStartsOn: 0 | 1 = 1
): AnalyticsResolvedDateRange => {
  const today = startOfDay(now);
  const option = getAnalyticsDateRangeOption(key);

  switch (key) {
    case "today":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(today),
        endDate: toDateInputValue(today),
      };

    case "yesterday": {
      const yesterday = addDays(today, -1);
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(yesterday),
        endDate: toDateInputValue(yesterday),
      };
    }

    case "last7Days":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(addDays(today, -6)),
        endDate: toDateInputValue(today),
      };

    case "last14Days":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(addDays(today, -13)),
        endDate: toDateInputValue(today),
      };

    case "last30Days":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(addDays(today, -29)),
        endDate: toDateInputValue(today),
      };

    case "last90Days":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(addDays(today, -89)),
        endDate: toDateInputValue(today),
      };

    case "thisWeek":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfWeek(today, weekStartsOn)),
        endDate: toDateInputValue(today),
      };

    case "lastWeek": {
      const currentWeekStart = startOfWeek(today, weekStartsOn);
      const previousWeekStart = addDays(currentWeekStart, -7);
      const previousWeekEnd = addDays(currentWeekStart, -1);

      return {
        key,
        label: option.label,
        startDate: toDateInputValue(previousWeekStart),
        endDate: toDateInputValue(previousWeekEnd),
      };
    }

    case "thisMonth":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfMonth(today)),
        endDate: toDateInputValue(today),
      };

    case "lastMonth": {
      const previousMonth = addMonths(today, -1);
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfMonth(previousMonth)),
        endDate: toDateInputValue(endOfMonth(previousMonth)),
      };
    }

    case "thisQuarter":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfQuarter(today)),
        endDate: toDateInputValue(today),
      };

    case "lastQuarter": {
      const previousQuarterDate = addMonths(today, -3);
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfQuarter(previousQuarterDate)),
        endDate: toDateInputValue(endOfQuarter(previousQuarterDate)),
      };
    }

    case "thisYear":
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfYear(today)),
        endDate: toDateInputValue(today),
      };

    case "lastYear": {
      const previousYear = new Date(today.getFullYear() - 1, 0, 1);
      return {
        key,
        label: option.label,
        startDate: toDateInputValue(startOfYear(previousYear)),
        endDate: toDateInputValue(endOfYear(previousYear)),
      };
    }

    case "custom":
    default:
      return {
        key: "custom",
        label: option.label,
        startDate: toDateInputValue(addDays(today, -29)),
        endDate: toDateInputValue(today),
      };
  }
};

export const getAnalyticsPreviousComparisonRange = (
  startDate: string,
  endDate: string
): AnalyticsCompareRange => {
  const start = startOfDay(new Date(startDate));
  const end = startOfDay(new Date(endDate));

  const diffInMs = end.getTime() - start.getTime();
  const rangeDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(rangeDays - 1));

  return {
    startDate: toDateInputValue(previousStart),
    endDate: toDateInputValue(previousEnd),
  };
};

export const getAnalyticsPresetComparisonRange = (
  key: AnalyticsDateRangeKey,
  now: Date = new Date(),
  weekStartsOn: 0 | 1 = 1
): AnalyticsCompareRange => {
  const today = startOfDay(now);

  switch (key) {
    case "today": {
      const yesterday = addDays(today, -1);
      return {
        startDate: toDateInputValue(yesterday),
        endDate: toDateInputValue(yesterday),
      };
    }

    case "yesterday": {
      const previous = addDays(today, -2);
      return {
        startDate: toDateInputValue(previous),
        endDate: toDateInputValue(previous),
      };
    }

    case "last7Days":
    case "last14Days":
    case "last30Days":
    case "last90Days": {
      const current = resolveAnalyticsDateRange(key, now, weekStartsOn);
      return getAnalyticsPreviousComparisonRange(
        current.startDate,
        current.endDate
      );
    }

    case "thisWeek": {
      const currentWeekStart = startOfWeek(today, weekStartsOn);
      const previousWeekStart = addDays(currentWeekStart, -7);
      const previousWeekEnd = addDays(currentWeekStart, -1);

      return {
        startDate: toDateInputValue(previousWeekStart),
        endDate: toDateInputValue(previousWeekEnd),
      };
    }

    case "lastWeek": {
      const currentWeekStart = startOfWeek(today, weekStartsOn);
      const previousWeekStart = addDays(currentWeekStart, -14);
      const previousWeekEnd = addDays(currentWeekStart, -8);

      return {
        startDate: toDateInputValue(previousWeekStart),
        endDate: toDateInputValue(previousWeekEnd),
      };
    }

    case "thisMonth": {
      const previousMonth = addMonths(today, -1);
      return {
        startDate: toDateInputValue(startOfMonth(previousMonth)),
        endDate: toDateInputValue(endOfMonth(previousMonth)),
      };
    }

    case "lastMonth": {
      const twoMonthsBack = addMonths(today, -2);
      return {
        startDate: toDateInputValue(startOfMonth(twoMonthsBack)),
        endDate: toDateInputValue(endOfMonth(twoMonthsBack)),
      };
    }

    case "thisQuarter": {
      const previousQuarterDate = addMonths(today, -3);
      return {
        startDate: toDateInputValue(startOfQuarter(previousQuarterDate)),
        endDate: toDateInputValue(endOfQuarter(previousQuarterDate)),
      };
    }

    case "lastQuarter": {
      const twoQuartersBack = addMonths(today, -6);
      return {
        startDate: toDateInputValue(startOfQuarter(twoQuartersBack)),
        endDate: toDateInputValue(endOfQuarter(twoQuartersBack)),
      };
    }

    case "thisYear": {
      const previousYearDate = new Date(today.getFullYear() - 1, 0, 1);
      return {
        startDate: toDateInputValue(startOfYear(previousYearDate)),
        endDate: toDateInputValue(endOfYear(previousYearDate)),
      };
    }

    case "lastYear": {
      const twoYearsBack = new Date(today.getFullYear() - 2, 0, 1);
      return {
        startDate: toDateInputValue(startOfYear(twoYearsBack)),
        endDate: toDateInputValue(endOfYear(twoYearsBack)),
      };
    }

    case "custom":
    default: {
      const current = resolveAnalyticsDateRange("last30Days", now, weekStartsOn);
      return getAnalyticsPreviousComparisonRange(
        current.startDate,
        current.endDate
      );
    }
  }
};

export const formatAnalyticsDateRangeLabel = (
  startDate: string,
  endDate: string
): string => {
  if (startDate === endDate) return startDate;
  return `${startDate} to ${endDate}`;
};

export const isValidAnalyticsDateRange = (
  startDate?: string,
  endDate?: string
): boolean => {
  if (!startDate || !endDate) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

  return start.getTime() <= end.getTime();
};

export const getAnalyticsDateRangeDays = (
  startDate: string,
  endDate: string
): number => {
  const start = startOfDay(new Date(startDate));
  const end = startOfDay(new Date(endDate));

  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export default ANALYTICS_DATE_RANGE_OPTIONS;