export type FilterValuePrimitive = string | number | boolean | null | undefined;

export type FilterValue =
  | FilterValuePrimitive
  | FilterValuePrimitive[]
  | DateRangeValue
  | Record<string, unknown>;

export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"
  | "notIn"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"
  | "isEmpty"
  | "isNotEmpty"
  | "before"
  | "after";

export type FilterControlType =
  | "text"
  | "search"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "date-range"
  | "select"
  | "multi-select"
  | "checkbox"
  | "radio"
  | "toggle"
  | "textarea";

export type FilterGroupLogic = "and" | "or";
export type FilterSortOrder = "asc" | "desc";

export interface DateRangeValue {
  startDate?: string;
  endDate?: string;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
  disabled?: boolean;
  meta?: Record<string, unknown>;
}

export interface BaseFilterDefinition {
  key: string;
  label: string;
  type: FilterControlType;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  hidden?: boolean;
  clearable?: boolean;
  defaultValue?: FilterValue;
}

export interface TextFilterDefinition extends BaseFilterDefinition {
  type: "text" | "search" | "textarea";
  minLength?: number;
  maxLength?: number;
}

export interface NumberFilterDefinition extends BaseFilterDefinition {
  type: "number" | "currency" | "percent";
  min?: number;
  max?: number;
  step?: number;
}

export interface DateFilterDefinition extends BaseFilterDefinition {
  type: "date" | "date-range";
  minDate?: string;
  maxDate?: string;
}

export interface OptionFilterDefinition extends BaseFilterDefinition {
  type: "select" | "multi-select" | "radio";
  options: FilterOption[];
}

export interface BooleanFilterDefinition extends BaseFilterDefinition {
  type: "checkbox" | "toggle";
}

export type FilterDefinition =
  | TextFilterDefinition
  | NumberFilterDefinition
  | DateFilterDefinition
  | OptionFilterDefinition
  | BooleanFilterDefinition;

export interface AppliedFilter {
  key: string;
  label?: string;
  operator?: FilterOperator;
  value: FilterValue;
}

export interface FilterRule {
  key: string;
  operator: FilterOperator;
  value?: FilterValue;
}

export interface FilterGroup {
  logic: FilterGroupLogic;
  rules: FilterRule[];
}

export interface SavedFilterView<TFilters = Record<string, unknown>> {
  id: string;
  name: string;
  description?: string;
  filters: TFilters;
  isDefault?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterChip {
  key: string;
  label: string;
  valueLabel?: string;
}

export interface FilterBarState<TFilters = Record<string, unknown>> {
  filters: TFilters;
  appliedFilters: AppliedFilter[];
  search?: string;
  sortBy?: string;
  sortOrder?: FilterSortOrder;
}

export interface FilterSectionDefinition {
  key: string;
  title: string;
  filters: FilterDefinition[];
}

export interface FilterQueryParams {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean>;
}

export interface FilterTransformer<TFilters = Record<string, unknown>, TResult = FilterQueryParams> {
  toQueryParams: (filters: TFilters) => TResult;
  fromQueryParams?: (params: TResult) => TFilters;
}

export interface FilterCountSummary {
  total: number;
  active: number;
}

export interface TableFilterState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: FilterSortOrder;
  search?: string;
}

export interface FilterPreset<TFilters = Record<string, unknown>> {
  key: string;
  label: string;
  filters: TFilters;
}

export interface FilterActionHandlers<TFilters = Record<string, unknown>> {
  setFilters: (filters: Partial<TFilters>) => void;
  resetFilters: () => void;
  clearFilter: (key: keyof TFilters | string) => void;
  applyPreset?: (preset: FilterPreset<TFilters>) => void;
}