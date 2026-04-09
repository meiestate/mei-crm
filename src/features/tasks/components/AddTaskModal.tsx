import { useEffect, useMemo, useState } from "react";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type TaskType =
  | "Call"
  | "Meeting"
  | "Follow-up"
  | "Site Visit"
  | "Documentation"
  | "Reminder"
  | "Personal"
  | "Other";

export type AddTaskFormValues = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  relatedTo: string;
  relatedType: "Lead" | "Contact" | "Deal" | "General";
  reminderEnabled: boolean;
  reminderMinutes: number;
  notes: string;
};

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (task: AddTaskFormValues) => void | Promise<void>;
  defaultValues?: Partial<AddTaskFormValues>;
  assigneeOptions?: string[];
};

type FormErrors = Partial<Record<keyof AddTaskFormValues, string>>;

const STORAGE_KEY = "mei-crm-tasks";

const PRIORITY_OPTIONS: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];
const STATUS_OPTIONS: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Overdue",
];
const TASK_TYPE_OPTIONS: TaskType[] = [
  "Call",
  "Meeting",
  "Follow-up",
  "Site Visit",
  "Documentation",
  "Reminder",
  "Personal",
  "Other",
];

const DEFAULT_ASSIGNEES = [
  "Arjun Mehta",
  "Priya Nair",
  "Rahul Verma",
  "Nisha Kapoor",
  "Karan Malhotra",
];

function getTodayDate() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCurrentTimeRounded() {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = minutes < 30 ? "30" : "00";
  const hour =
    minutes < 30 ? now.getHours() : (now.getHours() + 1) % 24;
  return `${String(hour).padStart(2, "0")}:${roundedMinutes}`;
}

const DEFAULT_FORM: AddTaskFormValues = {
  id: "",
  title: "",
  description: "",
  type: "Follow-up",
  priority: "Medium",
  status: "Pending",
  dueDate: getTodayDate(),
  dueTime: getCurrentTimeRounded(),
  assignedTo: "",
  relatedTo: "",
  relatedType: "General",
  reminderEnabled: true,
  reminderMinutes: 30,
  notes: "",
};

export default function AddTaskModal({
  isOpen,
  onClose,
  onSave,
  defaultValues,
  assigneeOptions = DEFAULT_ASSIGNEES,
}: AddTaskModalProps) {
  const [form, setForm] = useState<AddTaskFormValues>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      ...DEFAULT_FORM,
      ...defaultValues,
      id:
        defaultValues?.id ||
        `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dueDate: defaultValues?.dueDate || getTodayDate(),
      dueTime: defaultValues?.dueTime || getCurrentTimeRounded(),
    });
    setErrors({});
    setIsSaving(false);
  }, [isOpen, defaultValues]);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!form.reminderEnabled && form.reminderMinutes !== 30) {
      setForm((prev) => ({
        ...prev,
        reminderMinutes: 30,
      }));
    }
  }, [form.reminderEnabled, form.reminderMinutes]);

  const dueDateTimeText = useMemo(() => {
    if (!form.dueDate) return "No due date selected";
    const value = `${form.dueDate}${form.dueTime ? ` ${form.dueTime}` : ""}`;
    return value;
  }, [form.dueDate, form.dueTime]);

  const updateField = <K extends keyof AddTaskFormValues>(
    key: K,
    value: AddTaskFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Task title is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Task description is required.";
    }

    if (!form.dueDate) {
      nextErrors.dueDate = "Due date is required.";
    }

    if (!form.dueTime) {
      nextErrors.dueTime = "Due time is required.";
    }

    if (!form.assignedTo.trim()) {
      nextErrors.assignedTo = "Please select or enter an assignee.";
    }

    if (form.reminderEnabled) {
      if (
        Number.isNaN(form.reminderMinutes) ||
        form.reminderMinutes < 5 ||
        form.reminderMinutes > 1440
      ) {
        nextErrors.reminderMinutes =
          "Reminder should be between 5 and 1440 minutes.";
      }
    }

    if (form.title.trim().length > 120) {
      nextErrors.title = "Title must be under 120 characters.";
    }

    if (form.notes.trim().length > 500) {
      nextErrors.notes = "Notes must be under 500 characters.";
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

    const payload: AddTaskFormValues = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      assignedTo: form.assignedTo.trim(),
      relatedTo: form.relatedTo.trim(),
      notes: form.notes.trim(),
    };

    setIsSaving(true);

    try {
      if (onSave) {
        await Promise.resolve(onSave(payload));
      } else {
        saveTaskToLocalStorage(payload);
      }

      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Task Management</div>
            <h2 style={styles.title}>Add New Task</h2>
            <p style={styles.subtitle}>
              Create a clear action item with ownership, timing, and follow-up
              discipline built in.
            </p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.layout}>
            <div style={styles.leftColumn}>
              <SectionCard title="Task Details">
                <Field label="Task Title *" error={errors.title}>
                  <input
                    type="text"
                    value={form.title}
                    placeholder="Ex: Follow up with premium lead"
                    onChange={(e) => updateField("title", e.target.value)}
                    style={{
                      ...styles.input,
                      ...(errors.title ? styles.inputError : {}),
                    }}
                  />
                </Field>

                <Field label="Description *" error={errors.description}>
                  <textarea
                    rows={4}
                    value={form.description}
                    placeholder="Add a clear task description..."
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    style={{
                      ...styles.textarea,
                      ...(errors.description ? styles.inputError : {}),
                    }}
                  />
                </Field>

                <div style={styles.gridTwo}>
                  <Field label="Task Type">
                    <select
                      value={form.type}
                      onChange={(e) =>
                        updateField("type", e.target.value as TaskType)
                      }
                      style={styles.select}
                    >
                      {TASK_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Priority">
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        updateField("priority", e.target.value as TaskPriority)
                      }
                      style={styles.select}
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div style={styles.gridTwo}>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        updateField("status", e.target.value as TaskStatus)
                      }
                      style={styles.select}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Assigned To *" error={errors.assignedTo}>
                    <input
                      list="task-assignee-options"
                      value={form.assignedTo}
                      placeholder="Select assignee"
                      onChange={(e) =>
                        updateField("assignedTo", e.target.value)
                      }
                      style={{
                        ...styles.input,
                        ...(errors.assignedTo ? styles.inputError : {}),
                      }}
                    />
                    <datalist id="task-assignee-options">
                      {assigneeOptions.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Timeline">
                <div style={styles.gridTwo}>
                  <Field label="Due Date *" error={errors.dueDate}>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => updateField("dueDate", e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.dueDate ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="Due Time *" error={errors.dueTime}>
                    <input
                      type="time"
                      value={form.dueTime}
                      onChange={(e) => updateField("dueTime", e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.dueTime ? styles.inputError : {}),
                      }}
                    />
                  </Field>
                </div>

                <div style={styles.previewPanel}>
                  <div style={styles.previewLabel}>Scheduled For</div>
                  <div style={styles.previewValue}>{dueDateTimeText}</div>
                </div>
              </SectionCard>

              <SectionCard title="Task Relation">
                <div style={styles.gridTwo}>
                  <Field label="Related Type">
                    <select
                      value={form.relatedType}
                      onChange={(e) =>
                        updateField(
                          "relatedType",
                          e.target.value as AddTaskFormValues["relatedType"]
                        )
                      }
                      style={styles.select}
                    >
                      <option value="General">General</option>
                      <option value="Lead">Lead</option>
                      <option value="Contact">Contact</option>
                      <option value="Deal">Deal</option>
                    </select>
                  </Field>

                  <Field label="Related To">
                    <input
                      type="text"
                      value={form.relatedTo}
                      placeholder="Ex: Lead #1004 / Priya / Deal Alpha"
                      onChange={(e) => updateField("relatedTo", e.target.value)}
                      style={styles.input}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Notes">
                <Field label="Internal Notes" error={errors.notes}>
                  <textarea
                    rows={4}
                    value={form.notes}
                    placeholder="Add internal comments, call prep points, or reminders..."
                    onChange={(e) => updateField("notes", e.target.value)}
                    style={{
                      ...styles.textarea,
                      ...(errors.notes ? styles.inputError : {}),
                    }}
                  />
                </Field>
              </SectionCard>
            </div>

            <div style={styles.rightColumn}>
              <SectionCard title="Reminder Settings">
                <ToggleRow
                  label="Enable Reminder"
                  description="Get alerted before the task is due."
                  checked={form.reminderEnabled}
                  onChange={(checked) =>
                    updateField("reminderEnabled", checked)
                  }
                />

                <Field
                  label="Reminder Before Due Time (minutes)"
                  error={errors.reminderMinutes}
                >
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    disabled={!form.reminderEnabled}
                    value={form.reminderMinutes}
                    onChange={(e) =>
                      updateField(
                        "reminderMinutes",
                        Number(e.target.value || 30)
                      )
                    }
                    style={{
                      ...styles.input,
                      opacity: form.reminderEnabled ? 1 : 0.6,
                      ...(errors.reminderMinutes ? styles.inputError : {}),
                    }}
                  />
                </Field>
              </SectionCard>

              <SectionCard title="Live Summary">
                <div
                  style={{
                    ...styles.priorityBadge,
                    ...getPriorityBadgeStyles(form.priority),
                  }}
                >
                  {form.priority} Priority
                </div>

                <div style={styles.summaryList}>
                  <SummaryRow
                    label="Task"
                    value={form.title.trim() || "Untitled task"}
                  />
                  <SummaryRow label="Type" value={form.type} />
                  <SummaryRow label="Status" value={form.status} />
                  <SummaryRow
                    label="Assigned To"
                    value={form.assignedTo.trim() || "Not assigned"}
                  />
                  <SummaryRow
                    label="Due"
                    value={dueDateTimeText || "Not scheduled"}
                  />
                  <SummaryRow
                    label="Relation"
                    value={
                      form.relatedTo.trim()
                        ? `${form.relatedType} • ${form.relatedTo.trim()}`
                        : "General task"
                    }
                  />
                  <SummaryRow
                    label="Reminder"
                    value={
                      form.reminderEnabled
                        ? `${form.reminderMinutes} min before`
                        : "Disabled"
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="Quick Presets">
                <div style={styles.presetStack}>
                  <PresetButton
                    title="Lead Follow-up"
                    subtitle="Standard sales follow-up task"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        title: "Lead Follow-up",
                        description:
                          "Call the lead, confirm requirement, and update next action.",
                        type: "Follow-up",
                        priority: "High",
                        status: "Pending",
                        reminderEnabled: true,
                        reminderMinutes: 30,
                      }))
                    }
                  />

                  <PresetButton
                    title="Site Visit Coordination"
                    subtitle="Property visit planning"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        title: "Coordinate Site Visit",
                        description:
                          "Confirm location, timing, and customer visit details.",
                        type: "Site Visit",
                        priority: "Urgent",
                        status: "Pending",
                        reminderEnabled: true,
                        reminderMinutes: 60,
                      }))
                    }
                  />

                  <PresetButton
                    title="Documentation Reminder"
                    subtitle="Collect pending documents"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        title: "Collect Pending Documents",
                        description:
                          "Request and verify pending customer or property documents.",
                        type: "Documentation",
                        priority: "Medium",
                        status: "Pending",
                        reminderEnabled: true,
                        reminderMinutes: 120,
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
                ...DEFAULT_FORM,
                id: `task-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,
                dueDate: getTodayDate(),
                dueTime: getCurrentTimeRounded(),
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
            {isSaving ? "Saving Task..." : "Create Task"}
          </button>
        </div>
      </div>
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
      {error ? <div style={styles.errorText}>{error}</div> : null}
    </div>
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

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.summaryRow}>
      <span style={styles.summaryLabel}>{label}</span>
      <span style={styles.summaryValue}>{value}</span>
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

function saveTaskToLocalStorage(task: AddTaskFormValues) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(current) ? current : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([task, ...list]));
  } catch (error) {
    console.error("Unable to save task to localStorage", error);
  }
}

function getPriorityBadgeStyles(priority: TaskPriority): React.CSSProperties {
  const map: Record<TaskPriority, React.CSSProperties> = {
    Low: {
      background: "#F1F5F9",
      color: "#475569",
      border: "1px solid #CBD5E1",
    },
    Medium: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    },
    High: {
      background: "#FFFBEB",
      color: "#B45309",
      border: "1px solid #FDE68A",
    },
    Urgent: {
      background: "#FFF1F2",
      color: "#BE123C",
      border: "1px solid #FECDD3",
    },
  };

  return map[priority];
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
    maxWidth: 1180,
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
  layout: {
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
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 16,
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
  select: {
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
    minHeight: 96,
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
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: 600,
  },
  previewPanel: {
    marginTop: 6,
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: 14,
  },
  previewLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: 700,
    marginBottom: 6,
  },
  previewValue: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: 800,
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
    marginBottom: 16,
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
  priorityBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    padding: "0 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 16,
  },
  summaryList: {
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    overflow: "hidden",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    padding: "12px 14px",
    borderBottom: "1px solid #E2E8F0",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: 700,
  },
  summaryValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: 800,
    textAlign: "right",
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