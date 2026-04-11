// src/features/deals/components/AddDealModal.tsx

import { useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeMode } from "../../../theme";
import type { CreateDealInput, DealPriority, DealStatus } from "../api/dealsApi";

type AddDealModalProps = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  title?: string;
  ownerOptions?: string[];
  sourceOptions?: string[];
  contactOptions?: Array<{
    id: string;
    name: string;
  }>;
  leadOptions?: Array<{
    id: string;
    name: string;
  }>;
  defaultValues?: Partial<CreateDealInput>;
  onClose: () => void;
  onSubmit: (values: CreateDealInput) => void | Promise<void>;
};

type FormState = {
  title: string;
  contactId: string;
  contactName: string;
  leadId: string;
  leadName: string;
  company: string;
  value: string;
  expectedValue: string;
  currency: string;
  status: DealStatus;
  stage: string;
  priority: DealPriority;
  source: string;
  owner: string;
  probability: string;
  expectedCloseDate: string;
  tags: string;
  notes: string;
};

const DEFAULT_STAGE_OPTIONS = [
  "New",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const DEFAULT_STATUS_OPTIONS: DealStatus[] = [
  "new",
  "open",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const DEFAULT_PRIORITY_OPTIONS: DealPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];

function toFormState(defaultValues?: Partial<CreateDealInput>): FormState {
  return {
    title: defaultValues?.title ?? "",
    contactId: defaultValues?.contactId ?? "",
    contactName: defaultValues?.contactName ?? "",
    leadId: defaultValues?.leadId ?? "",
    leadName: defaultValues?.leadName ?? "",
    company: defaultValues?.company ?? "",
    value:
      typeof defaultValues?.value === "number" ? String(defaultValues.value) : "",
    expectedValue:
      typeof defaultValues?.expectedValue === "number"
        ? String(defaultValues.expectedValue)
        : "",
    currency: defaultValues?.currency ?? "INR",
    status: defaultValues?.status ?? "open",
    stage: defaultValues?.stage ?? "New",
    priority: defaultValues?.priority ?? "medium",
    source: defaultValues?.source ?? "",
    owner: defaultValues?.owner ?? "",
    probability:
      typeof defaultValues?.probability === "number"
        ? String(defaultValues.probability)
        : "",
    expectedCloseDate: defaultValues?.expectedCloseDate ?? "",
    tags: Array.isArray(defaultValues?.tags) ? defaultValues!.tags!.join(", ") : "",
    notes: defaultValues?.notes ?? "",
  };
}

function parseNumber(value: string): number | undefined {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return undefined;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function statusLabel(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inputBaseStyle(theme: ReturnType<typeof getTheme>) {
  return {
    width: "100%",
    border: `1px solid ${theme.border}`,
    background: theme.inputBg ?? theme.cardBgSoft,
    color: theme.text,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
  };
}

export default function AddDealModal({
  open,
  mode = "light",
  loading = false,
  title = "Add Deal",
  ownerOptions = [],
  sourceOptions = [],
  contactOptions = [],
  leadOptions = [],
  defaultValues,
  onClose,
  onSubmit,
}: AddDealModalProps) {
  const theme = getTheme(mode);

  const [form, setForm] = useState<FormState>(() => toFormState(defaultValues));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  useEffect(() => {
    if (open) {
      setForm(toFormState(defaultValues));
      setErrors({});
    }
  }, [defaultValues, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const ownerDatalistId = useMemo(
    () => `deal-owner-options-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const sourceDatalistId = useMemo(
    () => `deal-source-options-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const contactMap = useMemo(
    () => new Map(contactOptions.map((item) => [item.id, item.name])),
    [contactOptions]
  );

  const leadMap = useMemo(
    () => new Map(leadOptions.map((item) => [item.id, item.name])),
    [leadOptions]
  );

  if (!open) {
    return null;
  }

  const baseInputStyle = inputBaseStyle(theme);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const handleContactChange = (id: string) => {
    handleChange("contactId", id);
    if (id) {
      handleChange("contactName", contactMap.get(id) ?? "");
    }
  };

  const handleLeadChange = (id: string) => {
    handleChange("leadId", id);
    if (id) {
      handleChange("leadName", leadMap.get(id) ?? "");
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) {
      nextErrors.title = "Deal title is required.";
    }

    const probabilityValue = parseNumber(form.probability);
    if (
      form.probability.trim() &&
      (probabilityValue === undefined ||
        probabilityValue < 0 ||
        probabilityValue > 100)
    ) {
      nextErrors.probability = "Probability must be between 0 and 100.";
    }

    const valueAmount = parseNumber(form.value);
    if (form.value.trim() && valueAmount === undefined) {
      nextErrors.value = "Enter a valid deal value.";
    }

    const expectedValueAmount = parseNumber(form.expectedValue);
    if (form.expectedValue.trim() && expectedValueAmount === undefined) {
      nextErrors.expectedValue = "Enter a valid expected value.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): CreateDealInput => ({
    title: form.title.trim(),
    contactId: form.contactId.trim() || undefined,
    contactName: form.contactName.trim() || undefined,
    leadId: form.leadId.trim() || undefined,
    leadName: form.leadName.trim() || undefined,
    company: form.company.trim() || undefined,
    value: parseNumber(form.value),
    expectedValue: parseNumber(form.expectedValue),
    currency: form.currency.trim() || "INR",
    status: form.status,
    stage: form.stage.trim() || "New",
    priority: form.priority,
    source: form.source.trim() || undefined,
    owner: form.owner.trim() || undefined,
    probability: parseNumber(form.probability),
    expectedCloseDate: form.expectedCloseDate.trim() || undefined,
    tags: parseTags(form.tags),
    notes: form.notes.trim() || undefined,
  });

  const submitForm = async () => {
    if (!validate()) return;
    await onSubmit(buildPayload());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background:
          mode === "dark" ? "rgba(2, 6, 23, 0.72)" : "rgba(15, 23, 42, 0.48)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 960,
          maxHeight: "90vh",
          overflow: "auto",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          boxShadow:
            mode === "dark"
              ? "0 24px 60px rgba(0,0,0,0.45)"
              : "0 24px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: theme.cardBg,
            borderBottom: `1px solid ${theme.border}`,
            padding: "20px 22px 16px",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: theme.subText,
                  fontSize: 14,
                }}
              >
                Create a new deal and push your pipeline forward.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                width: 40,
                height: 40,
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div
          style={{
            padding: 22,
            display: "grid",
            gap: 22,
          }}
        >
          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Core Details
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-title"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Deal Title *
                </label>
                <input
                  id="deal-title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Ex: Whitefield villa deal"
                  style={baseInputStyle}
                />
                {errors.title ? (
                  <div
                    style={{
                      color: theme.danger ?? "#dc2626",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {errors.title}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="deal-company"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Company / Builder
                </label>
                <input
                  id="deal-company"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Ex: Prestige Group"
                  style={baseInputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="deal-contact"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Contact
                </label>
                <select
                  id="deal-contact"
                  value={form.contactId}
                  onChange={(e) => handleContactChange(e.target.value)}
                  style={baseInputStyle}
                >
                  <option value="">Select contact</option>
                  {contactOptions.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deal-lead"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Lead
                </label>
                <select
                  id="deal-lead"
                  value={form.leadId}
                  onChange={(e) => handleLeadChange(e.target.value)}
                  style={baseInputStyle}
                >
                  <option value="">Select lead</option>
                  {leadOptions.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Commercial Info
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-value"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Deal Value
                </label>
                <input
                  id="deal-value"
                  value={form.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  placeholder="Ex: 2500000"
                  inputMode="decimal"
                  style={baseInputStyle}
                />
                {errors.value ? (
                  <div
                    style={{
                      color: theme.danger ?? "#dc2626",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {errors.value}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="deal-expected-value"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Expected Value
                </label>
                <input
                  id="deal-expected-value"
                  value={form.expectedValue}
                  onChange={(e) => handleChange("expectedValue", e.target.value)}
                  placeholder="Ex: 2800000"
                  inputMode="decimal"
                  style={baseInputStyle}
                />
                {errors.expectedValue ? (
                  <div
                    style={{
                      color: theme.danger ?? "#dc2626",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {errors.expectedValue}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="deal-currency"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Currency
                </label>
                <input
                  id="deal-currency"
                  value={form.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  placeholder="INR"
                  style={baseInputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="deal-probability"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Probability %
                </label>
                <input
                  id="deal-probability"
                  value={form.probability}
                  onChange={(e) => handleChange("probability", e.target.value)}
                  placeholder="0 - 100"
                  inputMode="decimal"
                  style={baseInputStyle}
                />
                {errors.probability ? (
                  <div
                    style={{
                      color: theme.danger ?? "#dc2626",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {errors.probability}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Pipeline Settings
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-status"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Status
                </label>
                <select
                  id="deal-status"
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as DealStatus)
                  }
                  style={baseInputStyle}
                >
                  {DEFAULT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deal-stage"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Stage
                </label>
                <input
                  id="deal-stage"
                  list="deal-stage-options"
                  value={form.stage}
                  onChange={(e) => handleChange("stage", e.target.value)}
                  placeholder="Select or type stage"
                  style={baseInputStyle}
                />
                <datalist id="deal-stage-options">
                  {DEFAULT_STAGE_OPTIONS.map((stage) => (
                    <option key={stage} value={stage} />
                  ))}
                </datalist>
              </div>

              <div>
                <label
                  htmlFor="deal-priority"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Priority
                </label>
                <select
                  id="deal-priority"
                  value={form.priority}
                  onChange={(e) =>
                    handleChange("priority", e.target.value as DealPriority)
                  }
                  style={baseInputStyle}
                >
                  {DEFAULT_PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {statusLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deal-close-date"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Expected Close Date
                </label>
                <input
                  id="deal-close-date"
                  type="date"
                  value={form.expectedCloseDate}
                  onChange={(e) =>
                    handleChange("expectedCloseDate", e.target.value)
                  }
                  style={baseInputStyle}
                />
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Attribution
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-owner"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Owner
                </label>
                <input
                  id="deal-owner"
                  list={ownerDatalistId}
                  value={form.owner}
                  onChange={(e) => handleChange("owner", e.target.value)}
                  placeholder="Type owner name"
                  style={baseInputStyle}
                />
                <datalist id={ownerDatalistId}>
                  {ownerOptions.map((owner) => (
                    <option key={owner} value={owner} />
                  ))}
                </datalist>
              </div>

              <div>
                <label
                  htmlFor="deal-source"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Source
                </label>
                <input
                  id="deal-source"
                  list={sourceDatalistId}
                  value={form.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  placeholder="Ex: Website, Referral, WhatsApp"
                  style={baseInputStyle}
                />
                <datalist id={sourceDatalistId}>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source} />
                  ))}
                </datalist>
              </div>

              <div>
                <label
                  htmlFor="deal-tags"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Tags
                </label>
                <input
                  id="deal-tags"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="Luxury, Resale, Investor"
                  style={baseInputStyle}
                />
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Notes
            </div>

            <div>
              <label
                htmlFor="deal-notes"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Internal Notes
              </label>
              <textarea
                id="deal-notes"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Write deal context, objections, urgency, next move..."
                rows={5}
                style={{
                  ...baseInputStyle,
                  resize: "vertical",
                  minHeight: 120,
                  fontFamily: "inherit",
                }}
              />
            </div>
          </section>
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 2,
            background: theme.cardBg,
            borderTop: `1px solid ${theme.border}`,
            padding: 18,
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void submitForm()}
            disabled={loading}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 12,
              padding: "12px 18px",
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              minWidth: 140,
            }}
          >
            {loading ? "Saving..." : "Create Deal"}
          </button>
        </div>
      </div>
    </div>
  );
}