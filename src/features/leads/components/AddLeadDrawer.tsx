import { useEffect, useMemo, useState } from "react";

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Won"
  | "Lost";

type LeadPriority = "Low" | "Medium" | "High";
type LeadSource =
  | "Website"
  | "Facebook"
  | "Instagram"
  | "WhatsApp"
  | "Referral"
  | "Walk-in"
  | "Call"
  | "Broker"
  | "Other";

export type LeadFormValues = {
  id: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  location: string;
  budget: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo: string;
  followUpDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type AddLeadDrawerProps = {
  open: boolean;
  onClose: () => void;
  onLeadAdded?: (lead: LeadFormValues) => void;
  storageKey?: string;
};

const DEFAULT_STORAGE_KEY = "mei-crm-leads";

const statusOptions: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Won",
  "Lost",
];

const sourceOptions: LeadSource[] = [
  "Website",
  "Facebook",
  "Instagram",
  "WhatsApp",
  "Referral",
  "Walk-in",
  "Call",
  "Broker",
  "Other",
];

const priorityOptions: LeadPriority[] = ["Low", "Medium", "High"];

const initialFormState = (): LeadFormValues => {
  const now = new Date().toISOString();

  return {
    id: `LD-${Date.now()}`,
    name: "",
    phone: "",
    email: "",
    project: "",
    location: "",
    budget: "",
    status: "New",
    source: "Website",
    priority: "Medium",
    assignedTo: "",
    followUpDate: "",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
};

export default function AddLeadDrawer({
  open,
  onClose,
  onLeadAdded,
  storageKey = DEFAULT_STORAGE_KEY,
}: AddLeadDrawerProps) {
  const [form, setForm] = useState<LeadFormValues>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialFormState());
      setErrors({});
      setIsSaving(false);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const titleText = useMemo(() => "Add New Lead", []);

  const handleChange = (
    field: keyof LeadFormValues,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof LeadFormValues, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Lead name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";

    if (form.phone.trim() && !/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.project.trim()) nextErrors.project = "Project is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveToLocalStorage = (lead: LeadFormValues) => {
    try {
      const existing = localStorage.getItem(storageKey);
      const parsed: LeadFormValues[] = existing ? JSON.parse(existing) : [];
      const updated = [lead, ...parsed];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save lead to localStorage:", error);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSaving(true);

    const payload: LeadFormValues = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      project: form.project.trim(),
      location: form.location.trim(),
      budget: form.budget.trim(),
      assignedTo: form.assignedTo.trim(),
      notes: form.notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    saveToLocalStorage(payload);

    if (onLeadAdded) {
      onLeadAdded(payload);
    }

    setIsSaving(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2, 6, 23, 0.6)",
          zIndex: 1000,
          backdropFilter: "blur(2px)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Lead Drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "100%",
          maxWidth: 560,
          background: "#ffffff",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.16)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {titleText}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Capture lead details and push them into your CRM pipeline.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={iconButtonStyle}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            background: "#f8fafc",
          }}
        >
          <div style={sectionCardStyle}>
            <SectionTitle title="Basic Information" />

            <div style={grid2Style}>
              <Field
                label="Lead Name *"
                value={form.name}
                onChange={(value) => handleChange("name", value)}
                placeholder="Enter full name"
                error={errors.name}
              />

              <Field
                label="Phone Number *"
                value={form.phone}
                onChange={(value) => handleChange("phone", value)}
                placeholder="Enter phone number"
                error={errors.phone}
              />
            </div>

            <div style={grid2Style}>
              <Field
                label="Email Address"
                value={form.email}
                onChange={(value) => handleChange("email", value)}
                placeholder="Enter email address"
                error={errors.email}
              />

              <Field
                label="Assigned To"
                value={form.assignedTo}
                onChange={(value) => handleChange("assignedTo", value)}
                placeholder="Sales owner / team member"
                error={errors.assignedTo}
              />
            </div>
          </div>

          <div style={sectionCardStyle}>
            <SectionTitle title="Lead Details" />

            <div style={grid2Style}>
              <Field
                label="Project *"
                value={form.project}
                onChange={(value) => handleChange("project", value)}
                placeholder="Project / Property name"
                error={errors.project}
              />

              <Field
                label="Location *"
                value={form.location}
                onChange={(value) => handleChange("location", value)}
                placeholder="Preferred location"
                error={errors.location}
              />
            </div>

            <div style={grid2Style}>
              <Field
                label="Budget"
                value={form.budget}
                onChange={(value) => handleChange("budget", value)}
                placeholder="e.g. ₹75L - ₹1Cr"
                error={errors.budget}
              />

              <Field
                label="Follow-up Date"
                type="date"
                value={form.followUpDate}
                onChange={(value) => handleChange("followUpDate", value)}
                error={errors.followUpDate}
              />
            </div>

            <div style={grid2Style}>
              <SelectField
                label="Lead Status"
                value={form.status}
                options={statusOptions}
                onChange={(value) => handleChange("status", value)}
              />

              <SelectField
                label="Lead Source"
                value={form.source}
                options={sourceOptions}
                onChange={(value) => handleChange("source", value)}
              />
            </div>

            <div style={grid2Style}>
              <SelectField
                label="Priority"
                value={form.priority}
                options={priorityOptions}
                onChange={(value) => handleChange("priority", value)}
              />
            </div>
          </div>

          <div style={sectionCardStyle}>
            <SectionTitle title="Notes" />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Additional Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Add client requirement, urgency, preferences, or any special notes..."
                rows={5}
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  padding: "12px 14px",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 20,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            background: "#ffffff",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            style={{
              ...primaryButtonStyle,
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </div>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 44,
          borderRadius: 12,
          border: error ? "1px solid #ef4444" : "1px solid #cbd5e1",
          background: "#ffffff",
          padding: "0 14px",
          fontSize: 14,
          outline: "none",
          color: "#0f172a",
          boxSizing: "border-box",
        }}
      />

      {error ? (
        <span
          style={{
            fontSize: 12,
            color: "#dc2626",
          }}
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 44,
          borderRadius: 12,
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          padding: "0 14px",
          fontSize: 14,
          outline: "none",
          color: "#0f172a",
          boxSizing: "border-box",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>
    </div>
  );
}

const grid2Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const sectionCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 18,
  marginBottom: 18,
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
};

const iconButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  cursor: "pointer",
  fontSize: 16,
  color: "#334155",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 18px",
  borderRadius: 12,
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 18px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};