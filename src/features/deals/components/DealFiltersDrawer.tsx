// src/features/deals/components/DealFiltersDrawer.tsx

import { useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeMode } from "../../../theme";
import type { DealFilters } from "../api/dealsApi";

type DealFiltersDrawerProps = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  filters?: DealFilters;
  ownerOptions?: string[];
  sourceOptions?: string[];
  stageOptions?: string[];
  statusOptions?: string[];
  priorityOptions?: string[];
  onClose: () => void;
  onApply: (filters: DealFilters) => void;
  onReset?: () => void;
};

type FormState = {
  search: string;
  status: string;
  stage: string;
  owner: string;
  source: string;
  priority: string;
};

const DEFAULT_STATUS_OPTIONS = [
  "new",
  "open",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const DEFAULT_STAGE_OPTIONS = [
  "New",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const DEFAULT_PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];

function toFormState(filters?: DealFilters): FormState {
  return {
    search: filters?.search ?? "",
    status: filters?.status ?? "",
    stage: filters?.stage ?? "",
    owner: filters?.owner ?? "",
    source: filters?.source ?? "",
    priority: filters?.priority ?? "",
  };
}

function toPayload(form: FormState): DealFilters {
  return {
    search: form.search.trim() || undefined,
    status: form.status.trim() || undefined,
    stage: form.stage.trim() || undefined,
    owner: form.owner.trim() || undefined,
    source: form.source.trim() || undefined,
    priority: form.priority.trim() || undefined,
  };
}

function hasActiveFilters(form: FormState): boolean {
  return Boolean(
    form.search.trim() ||
      form.status.trim() ||
      form.stage.trim() ||
      form.owner.trim() ||
      form.source.trim() ||
      form.priority.trim()
  );
}

function prettyLabel(value: string): string {
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

export default function DealFiltersDrawer({
  open,
  mode = "light",
  loading = false,
  filters,
  ownerOptions = [],
  sourceOptions = [],
  stageOptions = DEFAULT_STAGE_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  priorityOptions = DEFAULT_PRIORITY_OPTIONS,
  onClose,
  onApply,
  onReset,
}: DealFiltersDrawerProps) {
  const theme = getTheme(mode);
  const [form, setForm] = useState<FormState>(() => toFormState(filters));

  useEffect(() => {
    if (open) {
      setForm(toFormState(filters));
    }
  }, [filters, open]);

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
    () => `deal-filter-owner-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const sourceDatalistId = useMemo(
    () => `deal-filter-source-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const activeCount = useMemo(() => {
    return [
      form.search,
      form.status,
      form.stage,
      form.owner,
      form.source,
      form.priority,
    ].filter((value) => value.trim()).length;
  }, [form]);

  if (!open) {
    return null;
  }

  const baseInputStyle = inputBaseStyle(theme);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    const next = toFormState();
    setForm(next);
    onReset?.();
  };

  const handleApply = () => {
    onApply(toPayload(form));
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Deal filters"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background:
          mode === "dark" ? "rgba(2, 6, 23, 0.72)" : "rgba(15, 23, 42, 0.44)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          height: "100%",
          background: theme.cardBg,
          borderLeft: `1px solid ${theme.border}`,
          boxShadow:
            mode === "dark"
              ? "-12px 0 40px rgba(0,0,0,0.34)"
              : "-12px 0 40px rgba(15, 23, 42, 0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: theme.cardBg,
            borderBottom: `1px solid ${theme.border}`,
            padding: "20px 18px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 800,
                    color: theme.text,
                    lineHeight: 1.2,
                  }}
                >
                  Deal Filters
                </h2>

                {activeCount > 0 ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "4px 10px",
                      background: theme.primary,
                      color: theme.inverseText ?? "#ffffff",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {activeCount} active
                  </span>
                ) : null}
              </div>

              <p
                style={{
                  margin: 0,
                  color: theme.subText,
                  fontSize: 14,
                }}
              >
                Narrow down deals by stage, status, owner, priority, and source.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters drawer"
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
            flex: 1,
            overflowY: "auto",
            padding: 18,
            display: "grid",
            gap: 18,
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
              Quick Search
            </div>

            <div>
              <label
                htmlFor="deal-filter-search"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Search
              </label>
              <input
                id="deal-filter-search"
                value={form.search}
                onChange={(e) => setField("search", e.target.value)}
                placeholder="Search title, contact, company, owner..."
                style={baseInputStyle}
              />
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
              Pipeline Filters
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-filter-status"
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
                  id="deal-filter-status"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  style={baseInputStyle}
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {prettyLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deal-filter-stage"
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
                <select
                  id="deal-filter-stage"
                  value={form.stage}
                  onChange={(e) => setField("stage", e.target.value)}
                  style={baseInputStyle}
                >
                  <option value="">All stages</option>
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>
                      {prettyLabel(stage)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deal-filter-priority"
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
                  id="deal-filter-priority"
                  value={form.priority}
                  onChange={(e) => setField("priority", e.target.value)}
                  style={baseInputStyle}
                >
                  <option value="">All priorities</option>
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {prettyLabel(priority)}
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
              Ownership & Source
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="deal-filter-owner"
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
                  id="deal-filter-owner"
                  list={ownerDatalistId}
                  value={form.owner}
                  onChange={(e) => setField("owner", e.target.value)}
                  placeholder="Type or pick owner"
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
                  htmlFor="deal-filter-source"
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
                  id="deal-filter-source"
                  list={sourceDatalistId}
                  value={form.source}
                  onChange={(e) => setField("source", e.target.value)}
                  placeholder="Website, Referral, Campaign..."
                  style={baseInputStyle}
                />
                <datalist id={sourceDatalistId}>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source} />
                  ))}
                </datalist>
              </div>
            </div>
          </section>

          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 14,
              background: theme.cardBgSoft,
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Filter Preview
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {hasActiveFilters(form) ? (
                <>
                  {form.search ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Search: {form.search}
                    </span>
                  ) : null}

                  {form.status ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Status: {prettyLabel(form.status)}
                    </span>
                  ) : null}

                  {form.stage ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Stage: {prettyLabel(form.stage)}
                    </span>
                  ) : null}

                  {form.owner ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Owner: {form.owner}
                    </span>
                  ) : null}

                  {form.source ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Source: {form.source}
                    </span>
                  ) : null}

                  {form.priority ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        border: `1px solid ${theme.border}`,
                        background: theme.cardBg,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Priority: {prettyLabel(form.priority)}
                    </span>
                  ) : null}
                </>
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                  }}
                >
                  No filters selected yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            background: theme.cardBg,
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            Reset
          </button>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text,
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
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
                opacity: loading ? 0.75 : 1,
                minWidth: 120,
              }}
            >
              {loading ? "Applying..." : "Apply Filters"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}