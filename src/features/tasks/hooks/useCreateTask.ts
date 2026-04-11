// src/features/tasks/hooks/useCreateTask.ts

import { useCallback, useMemo, useState } from "react";
import tasksApi, {
  type CreateTaskInput,
  type Task,
  type TasksApiMode,
} from "../api/tasksApi";

export type UseCreateTaskOptions = {
  mode?: TasksApiMode;
  onSuccess?: (task: Task) => void;
};

export type UseCreateTaskResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  createTask: (
    input: CreateTaskInput,
    options?: { createdBy?: string }
  ) => Promise<Task | null>;
};

function normalizeString(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeTags(tags?: string[]): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag) => normalizeString(tag)).filter(Boolean);
}

export default function useCreateTask(
  options: UseCreateTaskOptions = {}
): UseCreateTaskResult {
  const { mode = "auto", onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const createTask = useCallback(
    async (
      input: CreateTaskInput,
      apiOptions?: { createdBy?: string }
    ): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const cleanTitle = normalizeString(input.title);

        if (!cleanTitle) {
          throw new Error("Task title is required.");
        }

        const payload: CreateTaskInput = {
          ...input,
          title: cleanTitle,
          description: normalizeString(input.description) || undefined,
          status: normalizeString(input.status) || "todo",
          priority: normalizeString(input.priority) || "medium",
          assignedTo: normalizeString(input.assignedTo) || undefined,
          assignedToId: normalizeString(input.assignedToId) || undefined,
          relatedToType: normalizeString(input.relatedToType) || undefined,
          relatedToId: normalizeString(input.relatedToId) || undefined,
          relatedToName: normalizeString(input.relatedToName) || undefined,
          dueDate: normalizeString(input.dueDate) || undefined,
          createdBy:
            normalizeString(apiOptions?.createdBy) ||
            normalizeString(input.createdBy) ||
            undefined,
          tags: sanitizeTags(input.tags),
          reminderAt: normalizeString(input.reminderAt) || undefined,
        };

        const createdTask = await tasksApi.createTask(payload, {
          mode,
          createdBy: payload.createdBy,
        });

        setSuccessMessage(`Task "${createdTask.title}" created successfully.`);
        onSuccess?.(createdTask);

        return createdTask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create task.";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mode, onSuccess]
  );

  return useMemo(
    () => ({
      loading,
      error,
      successMessage,
      clearState,
      createTask,
    }),
    [loading, error, successMessage, clearState, createTask]
  );
}