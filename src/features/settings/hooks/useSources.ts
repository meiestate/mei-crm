// src/features/settings/hooks/useSources.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import settingsApi, {
  type LeadSource,
  type SettingsApiMode,
} from "../api/settingsApi";

export type UseSourcesOptions = {
  mode?: SettingsApiMode;
  autoLoad?: boolean;
};

export type UseSourcesResult = {
  sources: LeadSource[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  mode: SettingsApiMode;
  refresh: () => Promise<void>;
  clearState: () => void;
  createSource: (
    input: Omit<LeadSource, "id" | "createdAt" | "updatedAt">
  ) => Promise<LeadSource | null>;
  updateSource: (
    sourceId: string,
    updates: Partial<Omit<LeadSource, "id" | "createdAt">>
  ) => Promise<LeadSource | null>;
  deleteSource: (sourceId: string) => Promise<boolean>;
  toggleSourceActive: (sourceId: string, isActive?: boolean) => Promise<LeadSource | null>;
  saveAllSources: (sources: LeadSource[]) => Promise<LeadSource[]>;
  getSourceById: (sourceId: string) => LeadSource | undefined;
  activeSources: LeadSource[];
  inactiveSources: LeadSource[];
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function createSourceId(prefix = "lead-source"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortSources(sources: LeadSource[]): LeadSource[] {
  return [...sources].sort((a, b) => {
    const aActive = Boolean(a.isActive);
    const bActive = Boolean(b.isActive);

    if (aActive !== bActive) {
      return aActive ? -1 : 1;
    }

    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

function sanitizeSource(
  source: LeadSource,
  fallbackName = "New Source"
): LeadSource {
  return {
    ...source,
    id: normalizeString(source.id) || createSourceId(),
    name: normalizeString(source.name) || fallbackName,
    description: normalizeString(source.description) || undefined,
    isActive: source.isActive ?? true,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export default function useSources(
  options: UseSourcesOptions = {}
): UseSourcesResult {
  const { mode = "auto", autoLoad = true } = options;

  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const loadSources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await settingsApi.getLeadSources({ mode });
      setSources(sortSources(response));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load sources.";
      setError(message);
      setSources([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadSources();
  }, [autoLoad, loadSources]);

  const refresh = useCallback(async () => {
    await loadSources();
  }, [loadSources]);

  const saveAllSources = useCallback(
    async (nextSources: LeadSource[]): Promise<LeadSource[]> => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const sanitized = sortSources(
          nextSources.map((source, index) =>
            sanitizeSource(source, `Source ${index + 1}`)
          )
        ).map((source) => ({
          ...source,
          updatedAt: new Date().toISOString(),
        }));

        const saved = await settingsApi.saveLeadSources(sanitized, { mode });
        const normalized = sortSources(saved);

        setSources(normalized);
        setSuccessMessage("Lead sources saved successfully.");

        return normalized;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save lead sources.";
        setError(message);
        return sources;
      } finally {
        setSaving(false);
      }
    },
    [mode, sources]
  );

  const createSource = useCallback(
    async (
      input: Omit<LeadSource, "id" | "createdAt" | "updatedAt">
    ): Promise<LeadSource | null> => {
      const now = new Date().toISOString();

      const nextSource: LeadSource = sanitizeSource(
        {
          id: createSourceId(),
          name: normalizeString(input.name) || "New Source",
          description: normalizeString(input.description) || undefined,
          isActive: input.isActive ?? true,
          createdAt: now,
          updatedAt: now,
        },
        "New Source"
      );

      const saved = await saveAllSources([...sources, nextSource]);
      return saved.find((source) => source.id === nextSource.id) ?? null;
    },
    [saveAllSources, sources]
  );

  const updateSource = useCallback(
    async (
      sourceId: string,
      updates: Partial<Omit<LeadSource, "id" | "createdAt">>
    ): Promise<LeadSource | null> => {
      const cleanSourceId = normalizeString(sourceId);

      if (!cleanSourceId) {
        setError("Source ID is required.");
        return null;
      }

      const sourceIndex = sources.findIndex((source) => source.id === cleanSourceId);

      if (sourceIndex === -1) {
        setError("Lead source not found.");
        return null;
      }

      const currentSource = sources[sourceIndex];

      const updatedSource: LeadSource = {
        ...currentSource,
        ...updates,
        name:
          updates.name !== undefined
            ? normalizeString(updates.name) || currentSource.name
            : currentSource.name,
        description:
          updates.description !== undefined
            ? normalizeString(updates.description) || undefined
            : currentSource.description,
        isActive:
          updates.isActive !== undefined
            ? Boolean(updates.isActive)
            : currentSource.isActive,
        updatedAt: new Date().toISOString(),
      };

      const nextSources = [...sources];
      nextSources[sourceIndex] = updatedSource;

      const saved = await saveAllSources(nextSources);
      return saved.find((source) => source.id === cleanSourceId) ?? null;
    },
    [saveAllSources, sources]
  );

  const deleteSource = useCallback(
    async (sourceId: string): Promise<boolean> => {
      const cleanSourceId = normalizeString(sourceId);

      if (!cleanSourceId) {
        setError("Source ID is required.");
        return false;
      }

      const exists = sources.some((source) => source.id === cleanSourceId);

      if (!exists) {
        setError("Lead source not found.");
        return false;
      }

      const nextSources = sources.filter((source) => source.id !== cleanSourceId);
      await saveAllSources(nextSources);
      setSuccessMessage("Lead source deleted successfully.");

      return true;
    },
    [saveAllSources, sources]
  );

  const toggleSourceActive = useCallback(
    async (sourceId: string, isActive?: boolean): Promise<LeadSource | null> => {
      const source = sources.find((item) => item.id === sourceId);

      if (!source) {
        setError("Lead source not found.");
        return null;
      }

      const nextActive =
        typeof isActive === "boolean" ? isActive : !Boolean(source.isActive);

      return updateSource(sourceId, { isActive: nextActive });
    },
    [sources, updateSource]
  );

  const getSourceById = useCallback(
    (sourceId: string) => sources.find((source) => source.id === sourceId),
    [sources]
  );

  const activeSources = useMemo(
    () => sources.filter((source) => Boolean(source.isActive)),
    [sources]
  );

  const inactiveSources = useMemo(
    () => sources.filter((source) => !source.isActive),
    [sources]
  );

  return useMemo(
    () => ({
      sources,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createSource,
      updateSource,
      deleteSource,
      toggleSourceActive,
      saveAllSources,
      getSourceById,
      activeSources,
      inactiveSources,
    }),
    [
      sources,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createSource,
      updateSource,
      deleteSource,
      toggleSourceActive,
      saveAllSources,
      getSourceById,
      activeSources,
      inactiveSources,
    ]
  );
}