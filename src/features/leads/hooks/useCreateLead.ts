// src/features/leads/hooks/useCreateLead.ts

import { useCallback, useMemo, useState } from "react";
import leadsApi, {
  type CreateLeadInput,
  type Lead,
  type LeadsApiMode,
} from "../api/leadsApi";

export type UseCreateLeadOptions = {
  mode?: LeadsApiMode;
  onSuccess?: (lead: Lead) => void;
};

export type UseCreateLeadResult = {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearState: () => void;
  createLead: (
    input: CreateLeadInput,
    options?: { createdBy?: string }
  ) => Promise<Lead | null>;
};

export default function useCreateLead(
  options: UseCreateLeadOptions = {}
): UseCreateLeadResult {
  const { mode = "auto", onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const createLead = useCallback(
    async (
      input: CreateLeadInput,
      apiOptions?: { createdBy?: string }
    ): Promise<Lead | null> => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const cleanName = input.name?.trim();

        if (!cleanName) {
          throw new Error("Lead name is required.");
        }

        const payload: CreateLeadInput = {
          ...input,
          name: cleanName,
          email: input.email?.trim() || undefined,
          phone: input.phone?.trim() || undefined,
          alternatePhone: input.alternatePhone?.trim() || undefined,
          whatsapp: input.whatsapp?.trim() || undefined,
          company: input.company?.trim() || undefined,
          source: input.source?.trim() || undefined,
          owner: input.owner?.trim() || undefined,
          status: input.status?.trim() || "new",
          priority: input.priority?.trim() || "medium",
          interestType: input.interestType?.trim() || undefined,
          propertyType: input.propertyType?.trim() || undefined,
          location: input.location?.trim() || undefined,
          city: input.city?.trim() || undefined,
          state: input.state?.trim() || undefined,
          country: input.country?.trim() || undefined,
          followUpDate: input.followUpDate?.trim() || undefined,
          nextFollowUpDate: input.nextFollowUpDate?.trim() || undefined,
          notes: input.notes?.trim() || undefined,
          temperature: input.temperature?.trim() || undefined,
          tags: Array.isArray(input.tags)
            ? input.tags.map((tag) => tag.trim()).filter(Boolean)
            : [],
        };

        const createdLead = await leadsApi.createLead(payload, {
          mode,
          createdBy: apiOptions?.createdBy,
        });

        setSuccessMessage(`${createdLead.name} created successfully.`);
        onSuccess?.(createdLead);

        return createdLead;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create lead.";
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
      createLead,
    }),
    [loading, error, successMessage, clearState, createLead]
  );
}