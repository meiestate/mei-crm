import { useEffect, useMemo, useState } from "react";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type TaskType =
  | "Call"
  | "Meeting"
  | "Follow-up"
  | "Site Visit"
  | "Documentation"
  | "Reminder"
  | "Personal"
  | "Other";

export type TaskFilterValues = {
  search: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  types: TaskType[];
  assignee: string;
  relatedType: "All" | "Lead" | "Contact" | "Deal" | "General";
  dueRange: "All" | "Today" | "Tomorrow" | "This Week" | "Overdue" | "No Due Date";
  sortBy:
    | "dueDateAsc"
    | "dueDateDesc"
    | "priorityDesc"
    | "priorityAsc"
    | "recentlyCreated"
    | "recentlyUpdated"
    | "titleAsc";
  onlyMyTasks: boolean;
  onlyWithReminder: boolean;
};

type TaskFiltersProps = {
  value?: TaskFilterValues;
  onChange?: (value: TaskFilterValues) => void;
  onReset?: () => void;
  assigneeOptions?: string[];
  currentUserName?: string;
  totalCount?: number;
  filteredCount?: number;
};

const DEFAULT_ASSIGNEES = [
  "Arjun Mehta",
  "Priya Nair",
  "Rahul Verma",
  "Nisha Kapoor",
  "Karan Malhotra",
];

const STATUS_OPTIONS: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Overdue",
];

const PRIORITY_OPTIONS: TaskPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

const TYPE_OPTIONS: TaskType[] = [
  "Call",
  "Meeting",
  "Follow-up",
  "Site Visit",
  "Documentation",
  "Reminder",
  "Personal",
  "Other",
];

const DEFAULT_FILTERS: TaskFilterValues = {
  search: "",
  statuses: [],
  priorities: [],
  types: [],
  assignee: "All",
  relatedType: "All",
  dueRange: "All",
  sortBy: "dueDateAsc",
  onlyMyTasks: false,
  onlyWithReminder: false,
};

export default function TaskFilters({
  value,
  onChange,
  onReset,
  assigneeOptions = DEFAULT_ASSIGNEES,
  currentUserName = "Arjun Mehta",
  totalCount,
  filteredCount,
}: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilterValues>(
    value || DEFAULT_FILTERS
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (value) {
      setFilters(value);
    }
  }, [value]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.search.trim()) count += 1;
    if (filters.statuses.length) count += 1;
    if (filters.priorities.length) count += 1;
    if (filters.types.length) count += 1;
    if (filters.assignee !== "All") count += 1;
    if (filters.relatedType !== "All") count += 1;
    if (filters.dueRange !== "All") count += 1;
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count += 1;
    if (filters.onlyMyTasks) count += 1;
    if (filters.onlyWithReminder) count += 1;

    return count;
  }, [filters]);

  const updateFilters = (next: TaskFilterValues) => {
    setFilters(next);
    onChange?.(next);
  };

  const updateField = <K extends keyof TaskFilterValues>(
    key: K,
    value: TaskFilterValues[K]
  ) => {
    const next = {
      ...filters,
      [key]: value,
    };
    updateFilters(next);
  };

  const toggleArrayValue = <
    K extends "statuses" | "priorities" | "types"
  >(
    key: K,
    item: TaskFilterValues[K][number]
  ) => {
    const current = filters[key] as string[];
    const exists = current.includes(item as string);

    const next = exists
      ? current.filter((value) => value !== item)
      : [...current, item];

    updateField(key, next as TaskFilterValues[K]);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onChange?.(DEFAULT_FILTERS);
    onReset?.();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div style={styles.topRow}>
          <div>
            <div style={styles.eyebrow}>Task Intelligence</div>
            <h2 style={styles.title}>Task Filters</h2>
            <p style={styles.subtitle}>
              Narrow down action items by urgency, ownership, due timeline, and
              workflow context so the right work rises first.
            </p>
          </div>

          <div style={styles.summaryWrap}>
            {typeof filteredCount === "number" ? (
              <div style={styles.summaryCard}>
                <div style={styles.summaryLabel}>Showing</div>
                <div style={styles.summaryValue}>
                  {filteredCount}
                  {typeof totalCount === "number" ? ` / ${totalCount}` : ""}
                </div>
              </div>
            ) : null}

            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Active Filters</div>
              <div style={styles.summaryValue}>{activeFilterCount}</div>
            </div>
          </div>
        </div>

        <div style={styles.primaryRow}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              type="text"
              value={filters.search}
              placeholder="Search title, description, related entity, assignee..."
              onChange={(e) => updateField("search", e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.primaryActions}>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateField("sortBy", e.target.value as TaskFilterValues["sortBy"])
              }
              style={styles.select}
            >
              <option value="dueDateAsc">Sort: Due Date ↑</option>
              <option value="dueDateDesc">Sort: Due Date ↓</option>
              <option value="priorityDesc">Sort: Priority ↓</option>
              <option value="priorityAsc">Sort: Priority ↑</option>
              <option value="recentlyCreated">Sort: Recently Created</option>
              <option value="recentlyUpdated">Sort: Recently Updated</option>
              <option value="titleAsc">Sort: Title A-Z</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              style={{
                ...styles.secondaryButton,
                ...(showAdvanced ? styles.secondaryButtonActive : {}),
              }}
            >
              {showAdvanced ? "Hide Filters" : "More Filters"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={styles.ghostButton}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={styles.quickChipRow}>
          <QuickToggleChip
            label="My Tasks"
            checked={filters.onlyMyTasks}
            onClick={() => updateField("onlyMyTasks", !filters.onlyMyTasks)}
          />
          <QuickToggleChip
            label="With Reminder"
            checked={filters.onlyWithReminder}
            onClick={() =>
              updateField("onlyWithReminder", !filters.onlyWithReminder)
            }
          />

          <QuickToggleChip
            label="Due Today"
            checked={filters.dueRange === "Today"}
            onClick={() =>
              updateField(
                "dueRange",
                filters.dueRange === "Today" ? "All" : "Today"
              )
            }
          />

          <QuickToggleChip
            label="Overdue"
            checked={filters.dueRange === "Overdue"}
            onClick={() =>
              updateField(
                "dueRange",
                filters.dueRange === "Overdue" ? "All" : "Overdue"
              )
            }
          />

          <QuickToggleChip
            label="Urgent"
            checked={filters.priorities.includes("Urgent")}
            onClick={() => toggleArrayValue("priorities", "Urgent")}
          />

          <QuickToggleChip
            label="Pending"
            checked={filters.statuses.includes("Pending")}
            onClick={() => toggleArrayValue("statuses", "Pending")}
          />
        </div>

        {showAdvanced ? (
          <div style={styles.advancedPanel}>
            <div style={styles.gridTwo}>
              <FilterSection title="Status">
                <div style={styles.chipWrap}>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectableChip
                      key={status}
                      label={status}
                      selected={filters.statuses.includes(status)}
                      onClick={() => toggleArrayValue("statuses", status)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Priority">
                <div style={styles.chipWrap}>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <SelectableChip
                      key={priority}
                      label={priority}
                      selected={filters.priorities.includes(priority)}
                      onClick={() => toggleArrayValue("priorities", priority)}
                    />
                  ))}
                </div>
              </FilterSection>
            </div>

            <div style={styles.gridTwo}>
              <FilterSection title="Task Type">
                <div style={styles.chipWrap}>
                  {TYPE_OPTIONS.map((type) => (
                    <SelectableChip
                      key={type}
                      label={type}
                      selected={filters.types.includes(type)}
                      onClick={() => toggleArrayValue("types", type)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Due Timeline">
                <div style={styles.chipWrap}>
                  {(
                    [
                      "All",
                      "Today",
                      "Tomorrow",
                      "This Week",
                      "Overdue",
                      "No Due Date",
                    ] as TaskFilterValues["dueRange"][]
                  ).map((range) => (
                    <SelectableChip
                      key={range}
                      label={range}
                      selected={filters.dueRange === range}
                      onClick={() => updateField("dueRange", range)}
                    />
                  ))}
                </div>
              </FilterSection>
            </div>

            <div style={styles.gridThree}>
              <Field label="Assignee">
                <select
                  value={filters.assignee}
                  onChange={(e) => updateField("assignee", e.target.value)}
                  style={styles.select}
                >
                  <option value="All">All Assignees</option>
                  <option value={currentUserName}>Only {currentUserName}</option>
                  {assigneeOptions.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Related Type">
                <select
                  value={filters.relatedType}
                  onChange={(e) =>
                    updateField(
                      "relatedType",
                      e.target.value as TaskFilterValues["relatedType"]
                    )
                  }
                  style={styles.select}
                >
                  <option value="All">All Relations</option>
                  <option value="Lead">Lead</option>
                  <option value="Contact">Contact</option>
                  <option value="Deal">Deal</option>
                  <option value="General">General</option>
                </select>
              </Field>

              <Field label="Focus Mode">
                <div style={styles.toggleColumn}>
                  <InlineToggle
                    label="Only my tasks"
                    checked={filters.onlyMyTasks}
                    onChange={(checked) => updateField("onlyMyTasks", checked)}
                  />
                  <InlineToggle
                    label="Only reminders enabled"
                    checked={filters.onlyWithReminder}
                    onChange={(checked) =>
                      updateField("onlyWithReminder", checked)
                    }
                  />
                </div>
              </Field>
            </div>
          </div>
        ) : null}

        {activeFilterCount > 0 ? (
          <div style={styles.appliedSection}>
            <div style={styles.appliedLabel}>Applied Filters</div>

            <div style={styles.appliedWrap}>
              {filters.search.trim() ? (
                <AppliedTag
                  label={`Search: ${filters.search}`}
                  onRemove={() => updateField("search", "")}
                />
              ) : null}

              {filters.statuses.map((status) => (
                <AppliedTag
                  key={status}
                  label={`Status: ${status}`}
                  onRemove={() => toggleArrayValue("statuses", status)}
                />
              ))}

              {filters.priorities.map((priority) => (
                <AppliedTag
                  key={priority}
                  label={`Priority: ${priority}`}
                  onRemove={() => toggleArrayValue("priorities", priority)}
                />
              ))}

              {filters.types.map((type) => (
                <AppliedTag
                  key={type}
                  label={`Type: ${type}`}
                  onRemove={() => toggleArrayValue("types", type)}
                />
              ))}

              {filters.assignee !== "All" ? (
                <AppliedTag
                  label={`Assignee: ${filters.assignee}`}
                  onRemove={() => updateField("assignee", "All")}
                />
              ) : null}

              {filters.relatedType !== "All" ? (
                <AppliedTag
                  label={`Relation: ${filters.relatedType}`}
                  onRemove={() => updateField("relatedType", "All")}
                />
              ) : null}

              {filters.dueRange !== "All" ? (
                <AppliedTag
                  label={`Due: ${filters.dueRange}`}
                  onRemove={() => updateField("dueRange", "All")}
                />
              ) : null}

              {filters.onlyMyTasks ? (
                <AppliedTag
                  label="Only my tasks"
                  onRemove={() => updateField("onlyMyTasks", false)}
                />
              ) : null}

              {filters.onlyWithReminder ? (
                <AppliedTag
                  label="Reminder enabled"
                  onRemove={() => updateField("onlyWithReminder", false)}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.filterSection}>
      <div style={styles.filterSectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function SelectableChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.chip,
        ...(selected ? styles.chipActive : {}),
      }}
    >
      {label}
    </button>
  );
}

function QuickToggleChip({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.quickChip,
        ...(checked ? styles.quickChipActive : {}),
      }}
    >
      {label}
    </button>
  );
}

function AppliedTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span style={styles.appliedTag}>
      <span>{label}</span>
      <button type="button" onClick={onRemove} style={styles.appliedTagButton}>
        ×
      </button>
    </span>
  );
}

function InlineToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label style={styles.inlineToggle}>
      <span style={styles.inlineToggleText}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          ...styles.toggle,
          ...(checked ? styles.toggleActive : {}),
        }}
      >
        <span
          style={{
            ...styles.toggleKnob,
            ...(checked ? styles.toggleKnobActive : {}),
          }}
        />
      </button>
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  headerCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  subtitle: {
    margin: "8px 0 0",
    maxWidth: 760,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#475569",
  },
  summaryWrap: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  summaryCard: {
    minWidth: 120,
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: "14px 16px",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748B",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 800,
    color: "#0F172A",
  },
  primaryRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 14,
  },
  searchWrap: {
    flex: 1,
    minWidth: 280,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748B",
    fontSize: 14,
  },
  searchInput: {
    width: "100%",
    height: 46,
    borderRadius: 14,
    border: "1px solid #CBD5E1",
    padding: "0 14px 0 38px",
    fontSize: 14,
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
    boxSizing: "border-box",
  },
  primaryActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  select: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
    boxSizing: "border-box",
    width: "100%",
  },
  secondaryButton: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 16px",
    background: "#FFFFFF",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButtonActive: {
    background: "#0F172A",
    color: "#FFFFFF",
    border: "1px solid #0F172A",
  },
  ghostButton: {
    height: 44,
    borderRadius: 12,
    border: "1px dashed #CBD5E1",
    padding: "0 16px",
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  quickChipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  quickChip: {
    height: 36,
    borderRadius: 999,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#334155",
    padding: "0 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  quickChipActive: {
    background: "#EFF6FF",
    color: "#1D4ED8",
    border: "1px solid #BFDBFE",
  },
  advancedPanel: {
    marginTop: 18,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  gridThree: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  filterSection: {
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: 14,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 12,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    minHeight: 34,
    borderRadius: 999,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#334155",
    padding: "0 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
  chipActive: {
    background: "#0F172A",
    color: "#FFFFFF",
    border: "1px solid #0F172A",
  },
  toggleColumn: {
    display: "grid",
    gap: 12,
    paddingTop: 2,
  },
  inlineToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 14,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: "12px 14px",
  },
  inlineToggleText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  toggle: {
    position: "relative",
    width: 50,
    height: 28,
    borderRadius: 999,
    border: "none",
    background: "#CBD5E1",
    cursor: "pointer",
    flexShrink: 0,
  },
  toggleActive: {
    background: "#0F172A",
  },
  toggleKnob: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#FFFFFF",
    transition: "all 0.2s ease",
  },
  toggleKnobActive: {
    left: 25,
  },
  appliedSection: {
    marginTop: 18,
    borderTop: "1px solid #E2E8F0",
    paddingTop: 18,
  },
  appliedLabel: {
    fontSize: 13,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 10,
  },
  appliedWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  appliedTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 34,
    borderRadius: 999,
    background: "#F8FAFC",
    border: "1px solid #CBD5E1",
    color: "#334155",
    padding: "0 10px 0 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  appliedTagButton: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "none",
    background: "#E2E8F0",
    color: "#334155",
    cursor: "pointer",
    fontSize: 12,
    lineHeight: 1,
  },
};