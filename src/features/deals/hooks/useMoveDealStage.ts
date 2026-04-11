// src/features/deals/hooks/useMoveDealStage.ts

import { useCallback, useMemo, useState } from "react";
import type { Deal, DealActivity, DealsApiMode } from "../api/dealsApi";
import dealsApi from "../api/dealsApi";

export type MoveDealStageInput = {
  dealId: string;
  stage: string;
  status?: string;
  probability?: number;
  note?: string;
  updatedBy?: string;
};

export type UseMoveDealStageOptions = {
  mode?: DealsApiMode;
  onSuccess?: (deal: Deal) => void;
  onActivityCreated?: (activity: DealActivity) => void;
};

export type UseMoveDealStageResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  getSuggestedStatus: (stage: string) => string;
  getSuggestedProbability: (stage: string) => number;
  moveDealStage: (input: MoveDealStageInput) => Promise<Deal | null>;
};

function normalizeValue(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getSuggestedStatus(stage: string): string {
  const value = normalizeValue(stage);

  if (value.includes("new")) return "new";
  if (value.includes("qualif")) return "qualified";
  if (value.includes("proposal")) return "proposal";
  if (value.includes("negoti")) return "negotiation";
  if (value.includes("won")) return "won";
  if (value.includes("lost")) return "lost";

  return "open";
}

function getSuggestedProbability(stage: string): number {
  const value = normalizeValue(stage);

  if (value.includes("new")) return 15;
  if (value.includes("qualif")) return 35;
  if (value.includes("proposal")) return 55;
  if (value.includes("negoti")) return 75;
  if (value.includes("won")) return 100;
  if (value.includes("lost")) return 0;

  return 20;
}

export default function useMoveDealStage(
  options: UseMoveDealStageOptions = {}
): UseMoveDealStageResult {
  const { mode = "auto", onSuccess, onActivityCreated } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const moveDealStage = useCallback(
    async (input: MoveDealStageInput): Promise<Deal | null> => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const nextStage = input.stage.trim();

        if (!input.dealId.trim()) {
          throw new Error("Deal ID is required.");
        }

        if (!nextStage) {
          throw new Error("Stage is required.");
        }

        const nextStatus =
          input.status?.trim() || getSuggestedStatus(nextStage);
        const nextProbability =
          typeof input.probability === "number"
            ? input.probability
            : getSuggestedProbability(nextStage);

        const updatedDeal = await dealsApi.updateDeal(
          input.dealId,
          {
            stage: nextStage,
            status: nextStatus,
            probability: nextProbability,
          },
          {
            mode,
            updatedBy: input.updatedBy,
          }
        );

        if (!updatedDeal) {
          throw new Error("Deal could not be updated.");
        }

        let createdActivity: DealActivity | null = null;

        if (input.note?.trim()) {
          createdActivity = await dealsApi.addDealActivity(
            input.dealId,
            {
              type: "note",
              title: "Stage movement note",
              description: input.note.trim(),
              createdBy: input.updatedBy,
              entityType: "deal",
              entityId: input.dealId,
            },
            { mode }
          );
        }

        setSuccessMessage(
          `Deal moved to ${nextStage}${nextStatus ? ` (${nextStatus})` : ""}.`
        );

        onSuccess?.(updatedDeal);

        if (createdActivity) {
          onActivityCreated?.(createdActivity);
        }

        return updatedDeal;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to move deal stage.";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mode, onActivityCreated, onSuccess]
  );

  return useMemo(
    () => ({
      loading,
      error,
      successMessage,
      clearState,
      getSuggestedStatus,
      getSuggestedProbability,
      moveDealStage,
    }),
    [loading, error, successMessage, clearState, moveDealStage]
  );
}