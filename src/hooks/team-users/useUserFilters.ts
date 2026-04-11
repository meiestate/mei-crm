// src/hooks/team-users/useUserFilters.ts

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_TEAM_USER_FILTERS,
  type TeamDepartment,
  type TeamUsersFilterKey,
  type UserRole,
  type UserStatus,
} from "../../constants/teamUsersConstants";

export type TeamUsersFilters = typeof DEFAULT_TEAM_USER_FILTERS;

export type TeamUsersSortValue = TeamUsersFilters["sortBy"];

type UseUserFiltersReturn = {
  filters: TeamUsersFilters;
  activeFilterCount: number;

  setFilters: React.Dispatch<React.SetStateAction<TeamUsersFilters>>;
  setSearch: (value: string) => void;
  setSortBy: (value: TeamUsersSortValue) => void;
  setLocationFilter: (location: string) => void;

  toggleRoleFilter: (role: UserRole) => void;
  toggleDepartmentFilter: (department: TeamDepartment) => void;
  toggleStatusFilter: (status: UserStatus) => void;

  setQuickFilter: (key: TeamUsersFilterKey) => void;
  resetFilters: () => void;
  clearSearch: () => void;
};

function toggleArrayValue<T>(items: T[], value: T): T[] {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

export default function useUserFilters(
  initialFilters: TeamUsersFilters = DEFAULT_TEAM_USER_FILTERS
): UseUserFiltersReturn {
  const [filters, setFilters] = useState<TeamUsersFilters>(initialFilters);

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: "",
    }));
  }, []);

  const setSortBy = useCallback((value: TeamUsersSortValue) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  }, []);

  const setLocationFilter = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: location === "All Locations" ? "all" : location,
    }));
  }, []);

  const toggleRoleFilter = useCallback((role: UserRole) => {
    setFilters((prev) => ({
      ...prev,
      roles: toggleArrayValue(prev.roles, role),
    }));
  }, []);

  const toggleDepartmentFilter = useCallback((department: TeamDepartment) => {
    setFilters((prev) => ({
      ...prev,
      departments: toggleArrayValue(prev.departments, department),
    }));
  }, []);

  const toggleStatusFilter = useCallback((status: UserStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: toggleArrayValue(prev.statuses, status),
    }));
  }, []);

  const setQuickFilter = useCallback((key: TeamUsersFilterKey) => {
    switch (key) {
      case "all":
        setFilters((prev) => ({
          ...DEFAULT_TEAM_USER_FILTERS,
          search: prev.search,
          sortBy: prev.sortBy,
        }));
        break;

      case "active":
      case "inactive":
      case "invited":
      case "suspended":
        setFilters((prev) => ({
          ...prev,
          roles: [],
          departments: [],
          statuses: [key],
          location: "all",
        }));
        break;

      case "management":
        setFilters((prev) => ({
          ...prev,
          roles: [],
          departments: ["Management"],
          statuses: [],
          location: "all",
        }));
        break;

      case "sales":
        setFilters((prev) => ({
          ...prev,
          roles: [],
          departments: ["Sales"],
          statuses: [],
          location: "all",
        }));
        break;

      case "support":
        setFilters((prev) => ({
          ...prev,
          roles: [],
          departments: ["Support"],
          statuses: [],
          location: "all",
        }));
        break;

      default:
        break;
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_TEAM_USER_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.search.trim()) count += 1;
    if (filters.roles.length > 0) count += filters.roles.length;
    if (filters.departments.length > 0) count += filters.departments.length;
    if (filters.statuses.length > 0) count += filters.statuses.length;
    if (filters.location !== "all") count += 1;
    if (filters.sortBy !== DEFAULT_TEAM_USER_FILTERS.sortBy) count += 1;

    return count;
  }, [filters]);

  return {
    filters,
    activeFilterCount,

    setFilters,
    setSearch,
    setSortBy,
    setLocationFilter,

    toggleRoleFilter,
    toggleDepartmentFilter,
    toggleStatusFilter,

    setQuickFilter,
    resetFilters,
    clearSearch,
  };
}