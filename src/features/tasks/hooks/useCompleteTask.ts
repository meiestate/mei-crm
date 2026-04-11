// src/features/tasks/hooks/useCompleteTask.ts

import { useCallback, useMemo, useState } from "react";
import tasksApi, {
  type Task,
  type TasksApiMode,
} from "../api/tasksApi";

export type CompleteTaskInput = {
  taskId: string;
  completedBy?: string;
};

export type UseCompleteTaskOptions = {
  mode?: TasksApiMode;
  onSuccess?: (task: Task) => void;
};

export type UseCompleteTaskResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  completeTask: (input: CompleteTaskInput) => Promise<Task | null>;
};

function normalizeString(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

export default function useCompleteTask(
  options: UseCompleteTaskOptions = {}
): UseCompleteTaskResult {
  const { mode = "auto", onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const completeTask = useCallback(
    async (input: CompleteTaskInput): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const taskId = normalizeString(input.taskId);

        if (!taskId) {
          throw new Error("Task ID is required.");
        }

        const completedTask = await tasksApi.completeTask(taskId, {
          mode,
          completedBy: normalizeString(input.completedBy) || undefined,
        });

        if (!completedTask) {
          throw new Error("Task could not be completed.");
        }

        setSuccessMessage(`Task "${completedTask.title}" marked as completed.`);
        onSuccess?.(completedTask);

        return completedTask;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to complete task.";
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
      completeTask,
    }),
    [loading, error, successMessage, clearState, completeTask]
  );
}