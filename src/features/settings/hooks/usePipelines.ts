// src/features/settings/hooks/usePipelines.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import settingsApi, {
  type PipelineStage,
  type SettingsApiMode,
} from "../api/settingsApi";

export type UsePipelinesOptions = {
  mode?: SettingsApiMode;
  autoLoad?: boolean;
};

export type UsePipelinesResult = {
  pipelines: PipelineStage[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  mode: SettingsApiMode;
  refresh: () => Promise<void>;
  clearState: () => void;
  createPipelineStage: (
    input?: Partial<Omit<PipelineStage, "id">>
  ) => Promise<PipelineStage | null>;
  updatePipelineStage: (
    stageId: string,
    updates: Partial<Omit<PipelineStage, "id">>
  ) => Promise<PipelineStage | null>;
  deletePipelineStage: (stageId: string) => Promise<boolean>;
  reorderPipelineStages: (stageIdsInOrder: string[]) => Promise<PipelineStage[]>;
  saveAllPipelineStages: (stages: PipelineStage[]) => Promise<PipelineStage[]>;
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function createStageId(prefix = "stage"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDefaultStageName(index: number): string {
  return `Stage ${index}`;
}

function sortStages(stages: PipelineStage[]): PipelineStage[] {
  return [...stages].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return a.name.localeCompare(b.name);
  });
}

function sanitizeStage(
  stage: PipelineStage,
  fallbackOrder: number,
  fallbackCategory = "deal"
): PipelineStage {
  return {
    ...stage,
    id: normalizeString(stage.id) || createStageId(),
    name: normalizeString(stage.name) || getDefaultStageName(fallbackOrder),
    color: normalizeString(stage.color) || undefined,
    order:
      typeof stage.order === "number" && Number.isFinite(stage.order)
        ? stage.order
        : fallbackOrder,
    category: normalizeString(stage.category) || fallbackCategory,
    isDefault: Boolean(stage.isDefault),
  };
}

export default function usePipelines(
  options: UsePipelinesOptions = {}
): UsePipelinesResult {
  const { mode = "auto", autoLoad = true } = options;

  const [pipelines, setPipelines] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState<boolean>(autoLoad);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const loadPipelines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await settingsApi.getPipelines({ mode });
      setPipelines(sortStages(response));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load pipelines.";
      setError(message);
      setPipelines([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadPipelines();
  }, [autoLoad, loadPipelines]);

  const refresh = useCallback(async () => {
    await loadPipelines();
  }, [loadPipelines]);

  const saveAllPipelineStages = useCallback(
    async (stages: PipelineStage[]): Promise<PipelineStage[]> => {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const sanitizedStages = sortStages(
          stages.map((stage, index) =>
            sanitizeStage(stage, index + 1, stage.category || "deal")
          )
        ).map((stage, index) => ({
          ...stage,
          order: index + 1,
        }));

        const saved = await settingsApi.savePipelines(sanitizedStages, { mode });
        const normalized = sortStages(saved);

        setPipelines(normalized);
        setSuccessMessage("Pipeline stages saved successfully.");

        return normalized;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save pipeline stages.";
        setError(message);
        return pipelines;
      } finally {
        setSaving(false);
      }
    },
    [mode, pipelines]
  );

  const createPipelineStage = useCallback(
    async (
      input: Partial<Omit<PipelineStage, "id">> = {}
    ): Promise<PipelineStage | null> => {
      const nextOrder = pipelines.length + 1;

      const newStage: PipelineStage = sanitizeStage(
        {
          id: createStageId(),
          name: normalizeString(input.name) || getDefaultStageName(nextOrder),
          color: normalizeString(input.color) || undefined,
          order:
            typeof input.order === "number" && Number.isFinite(input.order)
              ? input.order
              : nextOrder,
          category: normalizeString(input.category) || "deal",
          isDefault: Boolean(input.isDefault),
        },
        nextOrder,
        normalizeString(input.category) || "deal"
      );

      const saved = await saveAllPipelineStages([...pipelines, newStage]);
      return saved.find((stage) => stage.id === newStage.id) ?? null;
    },
    [pipelines, saveAllPipelineStages]
  );

  const updatePipelineStage = useCallback(
    async (
      stageId: string,
      updates: Partial<Omit<PipelineStage, "id">>
    ): Promise<PipelineStage | null> => {
      if (!stageId.trim()) {
        setError("Stage ID is required.");
        return null;
      }

      const existingIndex = pipelines.findIndex((stage) => stage.id === stageId);

      if (existingIndex === -1) {
        setError("Pipeline stage not found.");
        return null;
      }

      const currentStage = pipelines[existingIndex];

      const updatedStage: PipelineStage = {
        ...currentStage,
        ...updates,
        name:
          updates.name !== undefined
            ? normalizeString(updates.name) || currentStage.name
            : currentStage.name,
        color:
          updates.color !== undefined
            ? normalizeString(updates.color) || undefined
            : currentStage.color,
        order:
          updates.order !== undefined &&
          typeof updates.order === "number" &&
          Number.isFinite(updates.order)
            ? updates.order
            : currentStage.order,
        category:
          updates.category !== undefined
            ? normalizeString(updates.category) || "deal"
            : currentStage.category,
        isDefault:
          updates.isDefault !== undefined
            ? Boolean(updates.isDefault)
            : currentStage.isDefault,
      };

      const nextStages = [...pipelines];
      nextStages[existingIndex] = updatedStage;

      const saved = await saveAllPipelineStages(nextStages);
      return saved.find((stage) => stage.id === stageId) ?? null;
    },
    [pipelines, saveAllPipelineStages]
  );

  const deletePipelineStage = useCallback(
    async (stageId: string): Promise<boolean> => {
      if (!stageId.trim()) {
        setError("Stage ID is required.");
        return false;
      }

      const exists = pipelines.some((stage) => stage.id === stageId);

      if (!exists) {
        setError("Pipeline stage not found.");
        return false;
      }

      const nextStages = pipelines
        .filter((stage) => stage.id !== stageId)
        .map((stage, index) => ({
          ...stage,
          order: index + 1,
        }));

      await saveAllPipelineStages(nextStages);
      setSuccessMessage("Pipeline stage deleted successfully.");
      return true;
    },
    [pipelines, saveAllPipelineStages]
  );

  const reorderPipelineStages = useCallback(
    async (stageIdsInOrder: string[]): Promise<PipelineStage[]> => {
      if (!Array.isArray(stageIdsInOrder) || stageIdsInOrder.length === 0) {
        setError("A valid stage order is required.");
        return pipelines;
      }

      const stageMap = new Map(pipelines.map((stage) => [stage.id, stage]));
      const reorderedStages: PipelineStage[] = [];

      stageIdsInOrder.forEach((id, index) => {
        const stage = stageMap.get(id);
        if (!stage) return;

        reorderedStages.push({
          ...stage,
          order: index + 1,
        });
      });

      const missingStages = pipelines.filter(
        (stage) => !stageIdsInOrder.includes(stage.id)
      );

      missingStages.forEach((stage) => {
        reorderedStages.push({
          ...stage,
          order: reorderedStages.length + 1,
        });
      });

      return saveAllPipelineStages(reorderedStages);
    },
    [pipelines, saveAllPipelineStages]
  );

  return useMemo(
    () => ({
      pipelines,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createPipelineStage,
      updatePipelineStage,
      deletePipelineStage,
      reorderPipelineStages,
      saveAllPipelineStages,
    }),
    [
      pipelines,
      loading,
      saving,
      error,
      successMessage,
      mode,
      refresh,
      clearState,
      createPipelineStage,
      updatePipelineStage,
      deletePipelineStage,
      reorderPipelineStages,
      saveAllPipelineStages,
    ]
  );
}