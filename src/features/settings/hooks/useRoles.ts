// src/features/settings/hooks/useRoles.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import settingsApi, {
  type SettingsApiMode,
  type TeamRole,
} from "../api/settingsApi";

export type UseRolesOptions = {
  mode?: SettingsApiMode;
  autoLoad?: boolean;
};

export type UseRolesResult = {
  roles: TeamRole[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  mode: SettingsApiMode;
  refresh: () => Promise<void>;
  clearState: () => void;
  createRole: (
    input: Omit<TeamRole, "id" | "createdAt" | "updatedAt">
  ) => Promise<TeamRole | null>;
  updateRole: (
    roleId: string,
    updates: Partial<Omit<TeamRole, "id" | "createdAt">>
  ) => Promise<TeamRole | null>;
  deleteRole: (roleId: string) => Promise<boolean>;
  getRoleById: (roleId: string) => TeamRole | undefined;
  systemRoles: TeamRole[];
  customRoles: TeamRole[];
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sortRoles(roles: TeamRole[]): TeamRole[] {
  return [...roles].sort((a, b) => {
    const aSystem = Boolean(a.isSystemRole);
    const bSystem = Boolean(b.isSystemRole);

    if (aSystem !== bSystem) {
      return aSystem ? -1 : 1;
    }

    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

function sanitizeRoleInput(
  input: Omit<TeamRole, "id" | "createdAt" | "updatedAt">
): Omit<TeamRole, "id" | "createdAt" | "updatedAt"> {
  return {
    name: normalizeString(input.name) || "New Role",
    description: normalizeString(input.description) || undefined,
    permissions: Array.isArray(input.permissions)
      ? input.permissions
          .map((permission) => normalizeString(permission))
          .filter(Boolean)
      : [],
    userCount:
      typeof input.userCount === "number" && Number.isFinite(input.userCount)
        ? input.userCount
        : 0,
    isSystemRole: Boolean(input.isSystemRole),
  };
}

export default function useRoles(
  options: UseRolesOptions = {}
): UseRolesResult {
  const { mode = "auto", autoLoad = true } = options;

  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await settingsApi.getTeamRoles({ mode });
      setRoles(sortRoles(response));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load roles.";
      setError(message);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadRoles();
  }, [autoLoad, loadRoles]);

  const refresh = useCallback(async () => {
    await loadRoles();
  }, [loadRoles]);

  const createRole = useCallback(
    async (
      input: Omit<TeamRole, "id" | "createdAt" | "updatedAt">
    ): Promise<TeamRole | null> => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const payload = sanitizeRoleInput(input);
        const created = await settingsApi.createTeamRole(payload, { mode });

        setRoles((prev) => sortRoles([created, ...prev]));
        setSuccessMessage(`Role "${created.name}" created successfully.`);

        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create role.";
        setError(message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [mode]
  );

  const updateRole = useCallback(
    async (
      roleId: string,
      updates: Partial<Omit<TeamRole, "id" | "createdAt">>
    ): Promise<TeamRole | null> => {
      const cleanRoleId = normalizeString(roleId);

      if (!cleanRoleId) {
        setError("Role ID is required.");
        return null;
      }

      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const sanitizedUpdates: Partial<Omit<TeamRole, "id" | "createdAt">> = {
          ...updates,
          name:
            updates.name !== undefined
              ? normalizeString(updates.name) || undefined
              : updates.name,
          description:
            updates.description !== undefined
              ? normalizeString(updates.description) || undefined
              : updates.description,
          permissions:
            updates.permissions !== undefined
              ? updates.permissions
                  .map((permission) => normalizeString(permission))
                  .filter(Boolean)
              : updates.permissions,
        };

        const updated = await settingsApi.updateTeamRole(
          cleanRoleId,
          sanitizedUpdates,
          { mode }
        );

        if (!updated) {
          setError("Role not found.");
          return null;
        }

        setRoles((prev) =>
          sortRoles(
            prev.map((role) => (role.id === cleanRoleId ? updated : role))
          )
        );
        setSuccessMessage(`Role "${updated.name}" updated successfully.`);

        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update role.";
        setError(message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [mode]
  );

  const deleteRole = useCallback(
    async (roleId: string): Promise<boolean> => {
      const cleanRoleId = normalizeString(roleId);

      if (!cleanRoleId) {
        setError("Role ID is required.");
        return false;
      }

      const targetRole = roles.find((role) => role.id === cleanRoleId);

      if (!targetRole) {
        setError("Role not found.");
        return false;
      }

      if (targetRole.isSystemRole) {
        setError("System roles cannot be deleted.");
        return false;
      }

      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const success = await settingsApi.deleteTeamRole(cleanRoleId, { mode });

        if (!success) {
          setError("Failed to delete role.");
          return false;
        }

        setRoles((prev) => prev.filter((role) => role.id !== cleanRoleId));
        setSuccessMessage(`Role "${targetRole.name}" deleted successfully.`);

        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete role.";
        setError(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [mode, roles]
  );

  const getRoleById = useCallback(
    (roleId: string) => roles.find((role) => role.id === roleId),
    [roles]
  );

  const systemRoles = useMemo(
    () => roles.filter((role) => Boolean(role.isSystemRole)),
    [roles]
  );

  const customRoles = useMemo(
    () => roles.filter((role) => !role.isSystemRole),
    [roles]
  );

  return useMemo(
    () => ({
      roles,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createRole,
      updateRole,
      deleteRole,
      getRoleById,
      systemRoles,
      customRoles,
    }),
    [
      roles,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createRole,
      updateRole,
      deleteRole,
      getRoleById,
      systemRoles,
      customRoles,
    ]
  );
}