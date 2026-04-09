import { useEffect, useMemo, useState } from "react";

export type PipelineStageColor =
  | "slate"
  | "blue"
  | "indigo"
  | "violet"
  | "amber"
  | "orange"
  | "emerald"
  | "rose";

export type PipelineStageFormValue = {
  id: string;
  name: string;
  description: string;
  color: PipelineStageColor;
  probability: number;
  slaDays: number;
  sortOrder: number;
  isDefault: boolean;
  isClosingStage: boolean;
  isWonStage: boolean;
  isLostStage: boolean;
  requiresFollowUp: boolean;
  autoCreateTask: boolean;
  taskTemplate: string;
};

type PipelineStageEditorProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  initialValue?: Partial<PipelineStageFormValue>;
  existingStages?: Array<Partial<PipelineStageFormValue>>;
  onClose: () => void;
  onSave?: (value: PipelineStageFormValue) => void | Promise<void>;
};

const DEFAULT_STAGE: PipelineStageFormValue = {
  id: "",
  name: "",
  description: "",
  color: "blue",
  probability: 20,
  slaDays: 3,
  sortOrder: 1,
  isDefault: false,
  isClosingStage: false,
  isWonStage: false,
  isLostStage: false,
  requiresFollowUp: true,
  autoCreateTask: false,
  taskTemplate: "",
};

const COLOR_OPTIONS: Array<{
  value: PipelineStageColor;
  label: string;
  dot: string;
}> = [
  { value: "slate", label: "Slate", dot: "#64748B" },
  { value: "blue", label: "Blue", dot: "#2563EB" },
  { value: "indigo", label: "Indigo", dot: "#4F46E5" },
  { value: "violet", label: "Violet", dot: "#7C3AED" },
  { value: "amber", label: "Amber", dot: "#D97706" },
  { value: "orange", label: "Orange", dot: "#EA580C" },
  { value: "emerald", label: "Emerald", dot: "#059669" },
  { value: "rose", label: "Rose", dot: "#E11D48" },
];

const STORAGE_KEY = "mei-crm-pipeline-stages";

export default function PipelineStageEditor({
  isOpen,
  mode = "create",
  initialValue,
  existingStages = [],
  onClose,
  onSave,
}: PipelineStageEditorProps) {
  const [form, setForm] = useState<PipelineStageFormValue>(DEFAULT_STAGE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PipelineStageFormValue, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const mergedExistingStages = useMemo(() => {
    const storedStages = readStoredStages();
    return [...storedStages, ...existingStages].filter(Boolean);
  }, [existingStages]);

  useEffect(() => {
    if (!isOpen) return;

    const fallbackSortOrder = mergedExistingStages.length + 1;

    setForm({
      ...DEFAULT_STAGE,
      ...initialValue,
      id:
        initialValue?.id ||
        `stage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sortOrder:
        typeof initialValue?.sortOrder === "number"
          ? initialValue.sortOrder
          : fallbackSortOrder,
      probability:
        typeof initialValue?.probability === "number"
          ? initialValue.probability
          : DEFAULT_STAGE.probability,
      slaDays:
        typeof initialValue?.slaDays === "number"
          ? initialValue.slaDays
          : DEFAULT_STAGE.slaDays,
    });
    setErrors({});
    setIsSaving(false);
  }, [isOpen, initialValue, mergedExistingStages.length]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!form.isClosingStage) {
      if (form.isWonStage || form.isLostStage) {
        setForm((prev) => ({
          ...prev,
          isWonStage: false,
          isLostStage: false,
        }));
      }
    }
  }, [form.isClosingStage, form.isWonStage, form.isLostStage]);

  useEffect(() => {
    if (!form.autoCreateTask && form.taskTemplate) {
      setForm((prev) => ({
        ...prev,
        taskTemplate: "",
      }));
    }
  }, [form.autoCreateTask, form.taskTemplate]);

  const completionLabel = useMemo(() => {
    if (form.isWonStage) return "Won stage";
    if (form.isLostStage) return "Lost stage";
    if (form.isClosingStage) return "Closing stage";
    return "Open stage";
  }, [form.isClosingStage, form.isLostStage, form.isWonStage]);

  const updateField = <K extends keyof PipelineStageFormValue>(
    key: K,
    value: PipelineStageFormValue[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof PipelineStageFormValue, string>> = {};

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();

    if (!trimmedName) {
      nextErrors.name = "Stage name is required.";
    } else {
      const duplicate = mergedExistingStages.find((stage) => {
        const sameName =
          (stage.name || "").trim().toLowerCase() === trimmedName.toLowerCase();
        const differentId = stage.id !== form.id;
        return sameName && differentId;
      });

      if (duplicate) {
        nextErrors.name = "A stage with this name already exists.";
      }
    }

    if (!trimmedDescription) {
      nextErrors.description = "Description is required.";
    }

    if (Number.isNaN(form.probability) || form.probability < 0 || form.probability > 100) {
      nextErrors.probability = "Probability must be between 0 and 100.";
    }

    if (!Number.isInteger(form.slaDays) || form.slaDays < 0 || form.slaDays > 365) {
      nextErrors.slaDays = "SLA days must be between 0 and 365.";
    }

    if (!Number.isInteger(form.sortOrder) || form.sortOrder < 1 || form.sortOrder > 999) {
      nextErrors.sortOrder = "Sort order must be between 1 and 999.";
    }

    if (form.autoCreateTask && !form.taskTemplate.trim()) {
      nextErrors.taskTemplate = "Task template is required when auto task is enabled.";
    }

    if (form.isWonStage && form.isLostStage) {
      nextErrors.isWonStage = "Stage cannot be marked both won and lost.";
      nextErrors.isLostStage = "Stage cannot be marked both won and lost.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload: PipelineStageFormValue = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      taskTemplate: form.taskTemplate.trim(),
    };

    setIsSaving(true);

    try {
      if (onSave) {
        await Promise.resolve(onSave(payload));
      } else {
        saveStageToLocalStorage(payload);
      }

      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error("Failed to save pipeline stage:", error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedColor =
    COLOR_OPTIONS.find((item) => item.value === form.color) || COLOR_OPTIONS[1];

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Pipeline Configuration</div>
            <h2 style={styles.title}>
              {mode === "edit" ? "Edit Pipeline Stage" : "Create Pipeline Stage"}
            </h2>
            <p style={styles.subtitle}>
              Define how this stage behaves across your deal flow, ownership
              system, follow-up discipline, and closing logic.
            </p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.grid}>
            <div style={styles.leftColumn}>
              <SectionCard title="Basic Information">
                <div style={styles.fieldGrid}>
                  <Field label="Stage Name *" error={errors.name}>
                    <input
                      type="text"
                      placeholder="Ex: Qualified, Negotiation, Closed Won"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.name ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="Sort Order *" error={errors.sortOrder}>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={form.sortOrder}
                      onChange={(e) =>
                        updateField("sortOrder", safeNumber(e.target.value, 1))
                      }
                      style={{
                        ...styles.input,
                        ...(errors.sortOrder ? styles.inputError : {}),
                      }}
                    />
                  </Field>
                </div>

                <Field label="Description *" error={errors.description}>
                  <textarea
                    rows={4}
                    placeholder="Describe when a deal belongs in this stage..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    style={{
                      ...styles.textarea,
                      ...(errors.description ? styles.inputError : {}),
                    }}
                  />
                </Field>

                <div style={styles.fieldGrid}>
                  <Field label="Stage Color">
                    <div style={styles.colorGrid}>
                      {COLOR_OPTIONS.map((option) => {
                        const active = form.color === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateField("color", option.value)}
                            style={{
                              ...styles.colorOption,
                              ...(active ? styles.colorOptionActive : {}),
                            }}
                          >
                            <span
                              style={{
                                ...styles.colorDot,
                                background: option.dot,
                              }}
                            />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Stage Logic">
                <div style={styles.fieldGridThree}>
                  <Field label="Win Probability (%) *" error={errors.probability}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.probability}
                      onChange={(e) =>
                        updateField("probability", safeNumber(e.target.value, 0))
                      }
                      style={{
                        ...styles.input,
                        ...(errors.probability ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="SLA Days *" error={errors.slaDays}>
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={form.slaDays}
                      onChange={(e) =>
                        updateField("slaDays", safeNumber(e.target.value, 0))
                      }
                      style={{
                        ...styles.input,
                        ...(errors.slaDays ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="Stage Type">
                    <input
                      type="text"
                      value={completionLabel}
                      readOnly
                      style={{
                        ...styles.input,
                        background: "#F8FAFC",
                        color: "#334155",
                      }}
                    />
                  </Field>
                </div>

                <div style={styles.toggleGrid}>
                  <ToggleRow
                    label="Default Stage"
                    description="New deals can start here by default."
                    checked={form.isDefault}
                    onChange={(checked) => updateField("isDefault", checked)}
                  />

                  <ToggleRow
                    label="Closing Stage"
                    description="This stage belongs to end-of-pipeline movement."
                    checked={form.isClosingStage}
                    onChange={(checked) => {
                      if (!checked) {
                        setForm((prev) => ({
                          ...prev,
                          isClosingStage: false,
                          isWonStage: false,
                          isLostStage: false,
                        }));
                        return;
                      }

                      updateField("isClosingStage", checked);
                    }}
                  />

                  <ToggleRow
                    label="Won Stage"
                    description="Mark this as successful conversion."
                    checked={form.isWonStage}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        isClosingStage: checked ? true : prev.isClosingStage,
                        isWonStage: checked,
                        isLostStage: checked ? false : prev.isLostStage,
                      }))
                    }
                  />

                  <ToggleRow
                    label="Lost Stage"
                    description="Mark this as failed or dropped closure."
                    checked={form.isLostStage}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        isClosingStage: checked ? true : prev.isClosingStage,
                        isLostStage: checked,
                        isWonStage: checked ? false : prev.isWonStage,
                      }))
                    }
                  />

                  <ToggleRow
                    label="Requires Follow-up"
                    description="Track next action discipline in this stage."
                    checked={form.requiresFollowUp}
                    onChange={(checked) =>
                      updateField("requiresFollowUp", checked)
                    }
                  />

                  <ToggleRow
                    label="Auto-create Task"
                    description="Create a default task when deal enters this stage."
                    checked={form.autoCreateTask}
                    onChange={(checked) =>
                      updateField("autoCreateTask", checked)
                    }
                  />
                </div>

                {errors.isWonStage ? (
                  <div style={styles.errorText}>{errors.isWonStage}</div>
                ) : null}
                {errors.isLostStage ? (
                  <div style={styles.errorText}>{errors.isLostStage}</div>
                ) : null}
              </SectionCard>

              <SectionCard title="Automation">
                <Field
                  label="Task Template"
                  error={errors.taskTemplate}
                  helperText={
                    form.autoCreateTask
                      ? "This will be used as the default task title or instruction."
                      : "Enable auto-create task to configure task template."
                  }
                >
                  <textarea
                    rows={3}
                    placeholder="Ex: Follow up with customer within 24 hours"
                    value={form.taskTemplate}
                    onChange={(e) => updateField("taskTemplate", e.target.value)}
                    disabled={!form.autoCreateTask}
                    style={{
                      ...styles.textarea,
                      opacity: form.autoCreateTask ? 1 : 0.6,
                      ...(errors.taskTemplate ? styles.inputError : {}),
                    }}
                  />
                </Field>
              </SectionCard>
            </div>

            <div style={styles.rightColumn}>
              <SectionCard title="Live Preview">
                <div
                  style={{
                    ...styles.previewBadge,
                    ...getStageBadgeStyles(selectedColor.value),
                  }}
                >
                  <span
                    style={{
                      ...styles.previewDot,
                      background: selectedColor.dot,
                    }}
                  />
                  <span>{form.name.trim() || "Untitled Stage"}</span>
                </div>

                <div style={styles.previewPanel}>
                  <PreviewRow
                    label="Description"
                    value={form.description.trim() || "No description added"}
                  />
                  <PreviewRow
                    label="Probability"
                    value={`${form.probability}%`}
                  />
                  <PreviewRow
                    label="SLA"
                    value={`${form.slaDays} day${form.slaDays === 1 ? "" : "s"}`}
                  />
                  <PreviewRow label="Sort Order" value={`#${form.sortOrder}`} />
                  <PreviewRow label="Stage Type" value={completionLabel} />
                  <PreviewRow
                    label="Follow-up"
                    value={form.requiresFollowUp ? "Required" : "Not required"}
                  />
                  <PreviewRow
                    label="Task Automation"
                    value={form.autoCreateTask ? "Enabled" : "Disabled"}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Guidelines">
                <ul style={styles.guidelineList}>
                  <li>Early stages usually keep lower probability and tighter activity SLA.</li>
                  <li>Only end-of-pipeline stages should be marked as won or lost.</li>
                  <li>Use clear stage names so sales teams understand the movement instantly.</li>
                  <li>Auto tasks work best for negotiation, follow-up, and closing milestones.</li>
                </ul>
              </SectionCard>

              <SectionCard title="Quick Presets">
                <div style={styles.presetStack}>
                  <PresetButton
                    title="Qualified Lead"
                    subtitle="Early validation stage"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        name: "Qualified",
                        description:
                          "Lead has been validated and is ready for active pipeline movement.",
                        color: "blue",
                        probability: 25,
                        slaDays: 2,
                        requiresFollowUp: true,
                        autoCreateTask: true,
                        taskTemplate: "Contact qualified lead and schedule detailed discussion",
                      }))
                    }
                  />

                  <PresetButton
                    title="Negotiation"
                    subtitle="Active commercial discussion"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        name: "Negotiation",
                        description:
                          "Commercial terms are under discussion and the deal is actively progressing.",
                        color: "amber",
                        probability: 70,
                        slaDays: 1,
                        requiresFollowUp: true,
                        autoCreateTask: true,
                        taskTemplate: "Review negotiation updates and confirm next decision step",
                      }))
                    }
                  />

                  <PresetButton
                    title="Closed Won"
                    subtitle="Successful conversion"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        name: "Closed Won",
                        description:
                          "Deal has been successfully completed and marked as won.",
                        color: "emerald",
                        probability: 100,
                        slaDays: 0,
                        isClosingStage: true,
                        isWonStage: true,
                        isLostStage: false,
                        requiresFollowUp: false,
                        autoCreateTask: false,
                        taskTemplate: "",
                      }))
                    }
                  />

                  <PresetButton
                    title="Closed Lost"
                    subtitle="Dropped or lost closure"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        name: "Closed Lost",
                        description:
                          "Deal did not convert and is marked as lost or inactive.",
                        color: "rose",
                        probability: 0,
                        slaDays: 0,
                        isClosingStage: true,
                        isLostStage: true,
                        isWonStage: false,
                        requiresFollowUp: false,
                        autoCreateTask: false,
                        taskTemplate: "",
                      }))
                    }
                  />
                </div>
              </SectionCard>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.secondaryButton}>
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                ...DEFAULT_STAGE,
                id: `stage-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,
                sortOrder: mergedExistingStages.length + 1,
              });
              setErrors({});
            }}
            style={styles.ghostButton}
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...styles.primaryButton,
              ...(isSaving ? styles.primaryButtonDisabled : {}),
            }}
          >
            {isSaving
              ? mode === "edit"
                ? "Saving Changes..."
                : "Creating Stage..."
              : mode === "edit"
              ? "Save Changes"
              : "Create Stage"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  helperText,
  children,
}: {
  label: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
      {error ? <div style={styles.errorText}>{error}</div> : null}
      {!error && helperText ? <div style={styles.helperText}>{helperText}</div> : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.sectionCard}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label style={styles.toggleRow}>
      <div style={{ minWidth: 0 }}>
        <div style={styles.toggleLabel}>{label}</div>
        <div style={styles.toggleDescription}>{description}</div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          ...styles.toggle,
          ...(checked ? styles.toggleActive : {}),
        }}
      >
        <span
          style={{
            ...styles.toggleKnob,
            ...(checked ? styles.toggleKnobActive : {}),
          }}
        />
      </button>
    </label>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.previewRow}>
      <span style={styles.previewRowLabel}>{label}</span>
      <span style={styles.previewRowValue}>{value}</span>
    </div>
  );
}

function PresetButton({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={styles.presetButton}>
      <div style={styles.presetTitle}>{title}</div>
      <div style={styles.presetSubtitle}>{subtitle}</div>
    </button>
  );
}

function safeNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readStoredStages(): Array<Partial<PipelineStageFormValue>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStageToLocalStorage(stage: PipelineStageFormValue) {
  const current = readStoredStages();
  const exists = current.some((item) => item.id === stage.id);

  const next = exists
    ? current.map((item) => (item.id === stage.id ? stage : item))
    : [...current, stage];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function getStageBadgeStyles(color: PipelineStageColor): React.CSSProperties {
  const map: Record<PipelineStageColor, React.CSSProperties> = {
    slate: {
      background: "#F8FAFC",
      color: "#334155",
      border: "1px solid #CBD5E1",
    },
    blue: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    },
    indigo: {
      background: "#EEF2FF",
      color: "#4338CA",
      border: "1px solid #C7D2FE",
    },
    violet: {
      background: "#F5F3FF",
      color: "#6D28D9",
      border: "1px solid #DDD6FE",
    },
    amber: {
      background: "#FFFBEB",
      color: "#B45309",
      border: "1px solid #FDE68A",
    },
    orange: {
      background: "#FFF7ED",
      color: "#C2410C",
      border: "1px solid #FED7AA",
    },
    emerald: {
      background: "#ECFDF5",
      color: "#047857",
      border: "1px solid #A7F3D0",
    },
    rose: {
      background: "#FFF1F2",
      color: "#BE123C",
      border: "1px solid #FECDD3",
    },
  };

  return map[color];
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.68)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: 1220,
    maxHeight: "94vh",
    background: "#FFFFFF",
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    boxShadow: "0 28px 80px rgba(15, 23, 42, 0.24)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: "24px 24px 18px",
    borderBottom: "1px solid #E2E8F0",
    background:
      "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#94A3B8",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#FFFFFF",
  },
  subtitle: {
    margin: "8px 0 0",
    maxWidth: 720,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#CBD5E1",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    fontSize: 16,
    cursor: "pointer",
    flexShrink: 0,
  },
  body: {
    padding: 20,
    overflowY: "auto",
    background: "#F8FAFC",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.9fr)",
    gap: 18,
    alignItems: "start",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  sectionCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 16,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 180px",
    gap: 16,
    marginBottom: 16,
  },
  fieldGridThree: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    background: "#FFFFFF",
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 98,
    borderRadius: 14,
    border: "1px solid #CBD5E1",
    padding: 14,
    fontSize: 14,
    background: "#FFFFFF",
    color: "#0F172A",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  inputError: {
    border: "1px solid #EF4444",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 1.5,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: 600,
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
  },
  colorOption: {
    height: 42,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    cursor: "pointer",
    padding: "0 12px",
  },
  colorOptionActive: {
    border: "1px solid #0F172A",
    background: "#F8FAFC",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  toggleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#64748B",
  },
  toggle: {
    position: "relative",
    width: 50,
    height: 28,
    borderRadius: 999,
    border: "none",
    background: "#CBD5E1",
    cursor: "pointer",
    flexShrink: 0,
  },
  toggleActive: {
    background: "#0F172A",
  },
  toggleKnob: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#FFFFFF",
    transition: "all 0.2s ease",
  },
  toggleKnobActive: {
    left: 25,
  },
  previewBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    minHeight: 42,
    width: "fit-content",
    padding: "0 14px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 16,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  previewPanel: {
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    overflow: "hidden",
  },
  previewRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 14px",
    borderBottom: "1px solid #E2E8F0",
  },
  previewRowLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#64748B",
  },
  previewRowValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0F172A",
    textAlign: "right",
  },
  guidelineList: {
    margin: 0,
    paddingLeft: 18,
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.8,
  },
  presetStack: {
    display: "grid",
    gap: 10,
  },
  presetButton: {
    width: "100%",
    textAlign: "left",
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: 14,
    cursor: "pointer",
  },
  presetTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 4,
  },
  presetSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 1.5,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    flexWrap: "wrap",
    padding: 18,
    borderTop: "1px solid #E2E8F0",
    background: "#FFFFFF",
  },
  primaryButton: {
    height: 46,
    borderRadius: 12,
    border: "none",
    padding: "0 18px",
    background: "#0F172A",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  secondaryButton: {
    height: 46,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 18px",
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostButton: {
    height: 46,
    borderRadius: 12,
    border: "1px dashed #CBD5E1",
    padding: "0 18px",
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};