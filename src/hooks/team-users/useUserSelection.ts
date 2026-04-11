// src/hooks/team-users/useUserSelection.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAM_USERS_SELECTED_IDS_KEY } from "../../constants/teamUsersConstants";

type Identifiable = {
  id: string;
};

type UseUserSelectionOptions<T extends Identifiable> = {
  users: T[];
  paginatedUsers?: T[];
  storageKey?: string;
  initialSelectedIds?: string[];
};

type UseUserSelectionReturn<T extends Identifiable> = {
  selectedIds: string[];
  selectedUsers: T[];

  selectedCount: number;
  isSelected: (userId: string) => boolean;

  allSelected: boolean;
  allSelectedOnPage: boolean;
  someSelected: boolean;
  someSelectedOnPage: boolean;

  toggleSelect: (userId: string) => void;
  selectOne: (userId: string) => void;
  deselectOne: (userId: string) => void;

  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  clearSelection: () => void;

  selectAll: () => void;
  deselectAll: () => void;
  toggleSelectAll: () => void;

  selectAllOnPage: () => void;
  deselectAllOnPage: () => void;
  toggleSelectAllOnPage: () => void;

  selectMany: (userIds: string[]) => void;
  deselectMany: (userIds: string[]) => void;
};

function safeParseArray(value: string | null, fallback: string[] = []): string[] {
  try {
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
  } catch {
    return fallback;
  }
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

export default function useUserSelection<T extends Identifiable>({
  users,
  paginatedUsers = [],
  storageKey = TEAM_USERS_SELECTED_IDS_KEY,
  initialSelectedIds = [],
}: UseUserSelectionOptions<T>): UseUserSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return uniqueIds(initialSelectedIds);
    }

    const stored = safeParseArray(localStorage.getItem(storageKey), initialSelectedIds);
    return uniqueIds(stored);
  });

  const allUserIds = useMemo(() => users.map((user) => user.id), [users]);
  const pageUserIds = useMemo(() => paginatedUsers.map((user) => user.id), [paginatedUsers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(selectedIds));
  }, [selectedIds, storageKey]);

  useEffect(() => {
    const validIds = new Set(allUserIds);
    setSelectedIds((prev) => prev.filter((id) => validIds.has(id)));
  }, [allUserIds]);

  const selectedUsers = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return users.filter((user) => selectedSet.has(user.id));
  }, [users, selectedIds]);

  const selectedCount = selectedIds.length;

  const isSelected = useCallback(
    (userId: string) => selectedIds.includes(userId),
    [selectedIds]
  );

  const allSelected = useMemo(() => {
    if (allUserIds.length === 0) return false;
    return allUserIds.every((id) => selectedIds.includes(id));
  }, [allUserIds, selectedIds]);

  const someSelected = useMemo(() => {
    return selectedIds.length > 0 && !allSelected;
  }, [selectedIds.length, allSelected]);

  const allSelectedOnPage = useMemo(() => {
    if (pageUserIds.length === 0) return false;
    return pageUserIds.every((id) => selectedIds.includes(id));
  }, [pageUserIds, selectedIds]);

  const someSelectedOnPage = useMemo(() => {
    if (pageUserIds.length === 0) return false;
    const selectedOnPageCount = pageUserIds.filter((id) => selectedIds.includes(id)).length;
    return selectedOnPageCount > 0 && selectedOnPageCount < pageUserIds.length;
  }, [pageUserIds, selectedIds]);

  const toggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  const selectOne = useCallback((userId: string) => {
    setSelectedIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  }, []);

  const deselectOne = useCallback((userId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== userId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectMany = useCallback((userIds: string[]) => {
    setSelectedIds((prev) => uniqueIds([...prev, ...userIds]));
  }, []);

  const deselectMany = useCallback((userIds: string[]) => {
    const removeSet = new Set(userIds);
    setSelectedIds((prev) => prev.filter((id) => !removeSet.has(id)));
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(uniqueIds(allUserIds));
  }, [allUserIds]);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const currentlyAllSelected =
        allUserIds.length > 0 && allUserIds.every((id) => prev.includes(id));

      return currentlyAllSelected ? [] : uniqueIds(allUserIds);
    });
  }, [allUserIds]);

  const selectAllOnPage = useCallback(() => {
    setSelectedIds((prev) => uniqueIds([...prev, ...pageUserIds]));
  }, [pageUserIds]);

  const deselectAllOnPage = useCallback(() => {
    const pageSet = new Set(pageUserIds);
    setSelectedIds((prev) => prev.filter((id) => !pageSet.has(id)));
  }, [pageUserIds]);

  const toggleSelectAllOnPage = useCallback(() => {
    setSelectedIds((prev) => {
      const currentlyAllSelectedOnPage =
        pageUserIds.length > 0 && pageUserIds.every((id) => prev.includes(id));

      if (currentlyAllSelectedOnPage) {
        const pageSet = new Set(pageUserIds);
        return prev.filter((id) => !pageSet.has(id));
      }

      return uniqueIds([...prev, ...pageUserIds]);
    });
  }, [pageUserIds]);

  return {
    selectedIds,
    selectedUsers,

    selectedCount,
    isSelected,

    allSelected,
    allSelectedOnPage,
    someSelected,
    someSelectedOnPage,

    toggleSelect,
    selectOne,
    deselectOne,

    setSelectedIds,
    clearSelection,

    selectAll,
    deselectAll,
    toggleSelectAll,

    selectAllOnPage,
    deselectAllOnPage,
    toggleSelectAllOnPage,

    selectMany,
    deselectMany,
  };
}