import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type AddTaskPageProps = {
  mode: ThemeMode;
  onToggleTheme?: () => void;
};

type TaskPriority = "Low" | "Medium" | "High";
type TaskStatus = "Pending" | "In Progress" | "Completed";

type TaskForm = {
  title: string;
  relatedTo: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
  type: string;
  description: string;
};

const TASK_STORAGE_KEY = "mei-crm-tasks";

const initialForm: TaskForm = {
  title: "",
  relatedTo: "",
  assignedTo: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  dueTime: "",
  type: "Call",
  description: "",
};

export default function AddTaskPage({ mode, onToggleTheme }: AddTaskPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();
  const [form, setForm] = useState<TaskForm>(initialForm);

  const updateField = (field: keyof TaskForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveTask = (addAnother = false) => {
    if (!form.title.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: form.title.trim(),
      relatedTo: form.relatedTo.trim(),
      assignedTo: form.assignedTo.trim() || "Unassigned",
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      type: form.type,
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(TASK_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const tasks = Array.isArray(existing) ? existing : [];

      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify([newTask, ...tasks]));

      if (addAnother) {
        setForm(initialForm);
        alert("Task saved. Add another task.");
        return;
      }

      navigate("/tasks");
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Unable to save task. Please try again.");
    }
  };

  return (
    <AppLayout title="Add Task" mode={mode} onToggleTheme={onToggleTheme}>
      <div
        style={{
          display: "grid",
          gap: 20,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: colors.text,
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Create New Task
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: colors.subText,
                fontSize: 15,
              }}
            >
              Create follow-up, call, meeting, document, or site visit tasks.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" onClick={() => navigate("/dashboard")} style={secondaryButtonStyle(colors)}>
              Cancel
            </button>

            <button type="button" onClick={() => saveTask(true)} style={secondaryButtonStyle(colors)}>
              Save & Add Another
            </button>

            <button type="button" onClick={() => saveTask(false)} style={primaryButtonStyle(colors)}>
              Save Task
            </button>
          </div>
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: colors.text,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            Task Information
          </h2>

          <p
            style={{
              margin: "8px 0 22px",
              color: colors.subText,
              fontSize: 14,
            }}
          >
            Add task details and assign ownership.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <Field label="Task Title *" colors={colors}>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Example: Call customer for site visit"
                style={inputStyle(colors)}
              />
            </Field>

            <Field label="Related To" colors={colors}>
              <input
                value={form.relatedTo}
                onChange={(event) => updateField("relatedTo", event.target.value)}
                placeholder="Lead / Customer / Deal name"
                style={inputStyle(colors)}
              />
            </Field>

            <Field label="Assigned To" colors={colors}>
              <input
                value={form.assignedTo}
                onChange={(event) => updateField("assignedTo", event.target.value)}
                placeholder="Team member name"
                style={inputStyle(colors)}
              />
            </Field>

            <Field label="Task Type" colors={colors}>
              <select value={form.type} onChange={(event) => updateField("type", event.target.value)} style={inputStyle(colors)}>
                <option value="Call">Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Meeting">Meeting</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Document Collection">Document Collection</option>
                <option value="Loan Follow-up">Loan Follow-up</option>
                <option value="Registration Follow-up">Registration Follow-up</option>
              </select>
            </Field>

            <Field label="Priority" colors={colors}>
              <select
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value)}
                style={inputStyle(colors)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </Field>

            <Field label="Status" colors={colors}>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                style={inputStyle(colors)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </Field>

            <Field label="Due Date" colors={colors}>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField("dueDate", event.target.value)}
                style={inputStyle(colors)}
              />
            </Field>

            <Field label="Due Time" colors={colors}>
              <input
                type="time"
                value={form.dueTime}
                onChange={(event) => updateField("dueTime", event.target.value)}
                style={inputStyle(colors)}
              />
            </Field>
          </div>

          <div style={{ marginTop: 18 }}>
            <Field label="Description / Notes" colors={colors}>
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Add task notes..."
                rows={5}
                style={{
                  ...inputStyle(colors),
                  resize: "vertical",
                  minHeight: 120,
                }}
              />
            </Field>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Field({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          color: colors.text,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function inputStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    border: `1px solid ${colors.border}`,
    background: colors.inputBg ?? colors.cardBg,
    color: colors.text,
    borderRadius: 14,
    padding: "14px 16px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}

function primaryButtonStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function secondaryButtonStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    padding: "12px 18px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  };
}