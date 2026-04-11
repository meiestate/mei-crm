// src/features/leads/hooks/useUpdateLeadStatus.ts

import { useCallback, useMemo, useState } from "react";
import leadsApi, {
  type Lead,
  type LeadActivity,
  type LeadStatus,
  type LeadsApiMode,
} from "../api/leadsApi";

export type UpdateLeadStatusInput = {
  leadId: string;
  status: LeadStatus | string;
  note?: string;
  updatedBy?: string;
};

export type UseUpdateLeadStatusOptions = {
  mode?: LeadsApiMode;
  onSuccess?: (lead: Lead) => void;
  onActivityCreated?: (activity: LeadActivity) => void;
};

export type UseUpdateLeadStatusResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  getSuggestedTemperature: (status: string) => string | undefined;
  getSuggestedScore: (status: string) => number | undefined;
  updateLeadStatus: (input: UpdateLeadStatusInput) => Promise<Lead | null>;
};

function normalizeValue(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function getSuggestedTemperature(status: string): string | undefined {
  const value = normalizeValue(status);

  if (value === "hot" || value === "won") return "hot";
  if (value === "warm" || value === "qualified" || value === "proposal") {
    return "warm";
  }
  if (
    value === "cold" ||
    value === "lost" ||
    value === "new" ||
    value === "open" ||
    value === "contacted"
  ) {
    return "cold";
  }

  if (value === "negotiation") return "warm";

  return undefined;
}

function getSuggestedScore(status: string): number | undefined {
  const value = normalizeValue(status);

  if (value === "won") return 100;
  if (value === "hot") return 85;
  if (value === "negotiation") return 75;
  if (value === "proposal") return 65;
  if (value === "qualified") return 55;
  if (value === "contacted") return 35;
  if (value === "new" || value === "open") return 20;
  if (value === "warm") return 60;
  if (value === "cold") return 15;
  if (value === "lost") return 0;

  return undefined;
}

function getSuccessLabel(status: string): string {
  const value = normalizeValue(status);

  if (!value) return "updated";

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function useUpdateLeadStatus(
  options: UseUpdateLeadStatusOptions = {}
): UseUpdateLeadStatusResult {
  const { mode = "auto", onSuccess, onActivityCreated } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const updateLeadStatus = useCallback(
    async (input: UpdateLeadStatusInput): Promise<Lead | null> => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const leadId = input.leadId.trim();
        const nextStatus = input.status?.trim();

        if (!leadId) {
          throw new Error("Lead ID is required.");
        }

        if (!nextStatus) {
          throw new Error("Lead status is required.");
        }

        const suggestedTemperature = getSuggestedTemperature(nextStatus);
        const suggestedScore = getSuggestedScore(nextStatus);

        const updatedLead = await leadsApi.updateLead(
          leadId,
          {
            status: nextStatus,
            temperature: suggestedTemperature,
            score: suggestedScore,
          },
          {
            mode,
            updatedBy: input.updatedBy,
          }
        );

        if (!updatedLead) {
          throw new Error("Lead could not be updated.");
        }

        let createdActivity: LeadActivity | null = null;

        if (input.note?.trim()) {
          createdActivity = await leadsApi.addLeadActivity(
            leadId,
            {
              type: "note",
              title: "Status update note",
              description: input.note.trim(),
              createdBy: input.updatedBy,
              entityType: "lead",
              entityId: leadId,
            },
            { mode }
          );
        }

        setSuccessMessage(
          `Lead marked as ${getSuccessLabel(nextStatus)} successfully.`
        );

        onSuccess?.(updatedLead);

        if (createdActivity) {
          onActivityCreated?.(createdActivity);
        }

        return updatedLead;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update lead status.";
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
      getSuggestedTemperature,
      getSuggestedScore,
      updateLeadStatus,
    }),
    [loading, error, successMessage, clearState, updateLeadStatus]
  );
}