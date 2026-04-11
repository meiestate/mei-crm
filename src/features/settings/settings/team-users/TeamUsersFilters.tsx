// src/features/settings/settings/team-users/TeamUsersFilters.tsx

import { useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeMode } from "../../../../theme";

export type TeamUsersFiltersValue = {
  search: string;
  role: string;
  status: string;
  department: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
};

type TeamUsersFiltersProps = {
  mode?: ThemeMode;
  loading?: boolean;
  filters: TeamUsersFiltersValue;
  roleOptions?: string[];
  statusOptions?: string[];
  departmentOptions?: string[];
  sortOptions?: Array<{
    value: string;
    label: string;
  }>;
  onChange: (updates: Partial<TeamUsersFiltersValue>) => void;
  onReset?: () => void;
};

const DEFAULT_SORT_OPTIONS = [
  { value: "lastActiveAt", label: "Last Active" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "role", label: "Role" },
  { value: "status", label: "Status" },
  { value: "department", label: "Department" },
  { value: "joinedAt", label: "Joined Date" },
];

function normalizeString(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function prettyLabel(value?: string): string {
  const text = normalizeString(value);
  if (!text) return "";

  return text
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function inputStyle(theme: ReturnType<typeof getTheme>) {
  return {
    width: "100%",
    border: `1px solid ${theme.border}`,
    background: theme.inputBg ?? theme.cardBgSoft,
    color: theme.text,
    borderRadius: 12,
    padding: "11px 13px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
  };
}

export default function TeamUsersFilters({
  mode = "light",
  loading = false,
  filters,
  roleOptions = [],
  statusOptions = [],
  departmentOptions = [],
  sortOptions = DEFAULT_SORT_OPTIONS,
  onChange,
  onReset,
}: TeamUsersFiltersProps) {
  const theme = getTheme(mode);

  const [searchValue, setSearchValue] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchValue(filters.search ?? "");
  }, [filters.search]);

  const roleDatalistId = useMemo(
    () => `team-users-role-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const departmentDatalistId = useMemo(
    () => `team-users-department-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const activeFilterCount = useMemo(() => {
    return [
      filters.search,
      filters.role,
      filters.status,
      filters.department,
      filters.sortBy && filters.sortBy !== "lastActiveAt" ? filters.sortBy : "",
      filters.sortDirection && filters.sortDirection !== "desc"
        ? filters.sortDirection
        : "",
    ].filter((value) => normalizeString(value)).length;
  }, [filters]);

  const baseInput = inputStyle(theme);

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        background: theme.cardBg,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.24)"
            : "0 10px 30px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          background:
            mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(248,250,252,0.8), rgba(248,250,252,0.35))",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            Team User Filters
          </div>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Search faster, slice by role and status, and keep the table sharp.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {activeFilterCount > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "6px 12px",
                background: theme.primary,
                color: theme.inverseText ?? "#ffffff",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {activeFilterCount} active
            </span>
          ) : null}

          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              disabled={loading}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px, 1.6fr) repeat(3, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <label
              htmlFor="team-users-search"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Search
            </label>
            <input
              id="team-users-search"
              value={searchValue}
              onChange={(e) => {
                const nextValue = e.target.value;
                setSearchValue(nextValue);
                onChange({ search: nextValue });
              }}
              placeholder="Search name, email, phone, role..."
              disabled={loading}
              style={baseInput}
            />
          </div>

          <div>
            <label
              htmlFor="team-users-role"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Role
            </label>
            <input
              id="team-users-role"
              list={roleDatalistId}
              value={filters.role}
              onChange={(e) => onChange({ role: e.target.value })}
              placeholder="All roles"
              disabled={loading}
              style={baseInput}
            />
            <datalist id={roleDatalistId}>
              {roleOptions.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="team-users-status"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Status
            </label>
            <select
              id="team-users-status"
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value })}
              disabled={loading}
              style={baseInput}
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {prettyLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="team-users-department"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Department
            </label>
            <input
              id="team-users-department"
              list={departmentDatalistId}
              value={filters.department}
              onChange={(e) => onChange({ department: e.target.value })}
              placeholder="All departments"
              disabled={loading}
              style={baseInput}
            />
            <datalist id={departmentDatalistId}>
              {departmentOptions.map((department) => (
                <option key={department} value={department} />
              ))}
            </datalist>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 1fr) minmax(140px, 180px)",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <label
              htmlFor="team-users-sortby"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Sort By
            </label>
            <select
              id="team-users-sortby"
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value })}
              disabled={loading}
              style={baseInput}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="team-users-sortdirection"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Direction
            </label>
            <select
              id="team-users-sortdirection"
              value={filters.sortDirection}
              onChange={(e) =>
                onChange({
                  sortDirection: e.target.value as "asc" | "desc",
                })
              }
              disabled={loading}
              style={baseInput}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              paddingTop: 4,
            }}
          >
            {normalizeString(filters.search) ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Search: {filters.search}
              </span>
            ) : null}

            {normalizeString(filters.role) ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Role: {prettyLabel(filters.role)}
              </span>
            ) : null}

            {normalizeString(filters.status) ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Status: {prettyLabel(filters.status)}
              </span>
            ) : null}

            {normalizeString(filters.department) ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Department: {filters.department}
              </span>
            ) : null}

            {filters.sortBy !== "lastActiveAt" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Sort:{" "}
                {sortOptions.find((option) => option.value === filters.sortBy)?.label ??
                  filters.sortBy}
              </span>
            ) : null}

            {filters.sortDirection !== "desc" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "6px 12px",
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Direction: {prettyLabel(filters.sortDirection)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}