import { useEffect, useMemo, useState } from "react";

export type SourceChannelType =
  | "website"
  | "portal"
  | "broker"
  | "referral"
  | "social"
  | "campaign"
  | "walkin"
  | "cold-call"
  | "whatsapp"
  | "other";

export type SourceRecord = {
  id: string;
  name: string;
  code: string;
  type: SourceChannelType;
  description: string;
  color: string;
  priority: number;
  isActive: boolean;
  isDefault: boolean;
  autoAssign: boolean;
  trackCampaign: boolean;
  requiresRemark: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ownerName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type SourceListEditorProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  initialValue?: Partial<SourceRecord>;
  existingSources?: SourceRecord[];
  onClose: () => void;
  onSave?: (value: SourceRecord, allValues: SourceRecord[]) => void | Promise<void>;
};

type SourceErrors = Partial<Record<keyof SourceRecord, string>>;

const STORAGE_KEY = "mei-crm-source-list";

const SOURCE_TYPE_OPTIONS: Array<{
  value: SourceChannelType;
  label: string;
  description: string;
}> = [
  {
    value: "website",
    label: "Website",
    description: "Organic or direct website lead source.",
  },
  {
    value: "portal",
    label: "Portal",
    description: "99acres, Magicbricks, Housing and similar portals.",
  },
  {
    value: "broker",
    label: "Broker",
    description: "External broker, partner or channel source.",
  },
  {
    value: "referral",
    label: "Referral",
    description: "Customer, friend or business referral source.",
  },
  {
    value: "social",
    label: "Social",
    description: "Facebook, Instagram, LinkedIn and social channels.",
  },
  {
    value: "campaign",
    label: "Campaign",
    description: "Paid ad campaigns and tracking-based sources.",
  },
  {
    value: "walkin",
    label: "Walk-in",
    description: "Office visit, event booth or site visit source.",
  },
  {
    value: "cold-call",
    label: "Cold Call",
    description: "Outbound prospecting and telecalling source.",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    description: "Direct WhatsApp inquiries and CTA responses.",
  },
  {
    value: "other",
    label: "Other",
    description: "Custom uncategorized source.",
  },
];

const COLOR_PRESETS = [
  "#0F172A",
  "#1D4ED8",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#DC2626",
  "#0891B2",
  "#BE185D",
];

const DEFAULT_SOURCE: SourceRecord = {
  id: "",
  name: "",
  code: "",
  type: "website",
  description: "",
  color: "#1D4ED8",
  priority: 1,
  isActive: true,
  isDefault: false,
  autoAssign: false,
  trackCampaign: false,
  requiresRemark: false,
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  ownerName: "",
  notes: "",
  createdAt: "",
  updatedAt: "",
};

export default function SourceListEditor({
  isOpen,
  mode = "create",
  initialValue,
  existingSources = [],
  onClose,
  onSave,
}: SourceListEditorProps) {
  const [form, setForm] = useState<SourceRecord>(DEFAULT_SOURCE);
  const [errors, setErrors] = useState<SourceErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  const sourceList = useMemo(() => {
    const stored = readSourcesFromStorage();
    if (existingSources.length > 0) {
      return mergeSources(stored, existingSources);
    }
    return stored;
  }, [existingSources]);

  const filteredSources = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return sourceList;

    return sourceList.filter((item) => {
      const haystack =
        `${item.name} ${item.code} ${item.type} ${item.description} ${item.ownerName}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [search, sourceList]);

  useEffect(() => {
    if (!isOpen) return;

    const now = new Date().toISOString();
    const fallbackPriority =
      sourceList.length > 0
        ? Math.max(...sourceList.map((item) => item.priority || 0)) + 1
        : 1;

    const nextValue: SourceRecord = {
      ...DEFAULT_SOURCE,
      ...initialValue,
      id:
        initialValue?.id ||
        `src-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      code:
        initialValue?.code ||
        buildSourceCode(initialValue?.name || "", initialValue?.type || "website"),
      priority:
        typeof initialValue?.priority === "number"
          ? initialValue.priority
          : fallbackPriority,
      createdAt: initialValue?.createdAt || now,
      updatedAt: now,
    };

    setForm(nextValue);
    setErrors({});
    setIsSaving(false);
    setSearch("");
  }, [isOpen, initialValue, sourceList]);

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
    if (!form.trackCampaign) {
      if (form.utmSource || form.utmMedium || form.utmCampaign) {
        setForm((prev) => ({
          ...prev,
          utmSource: "",
          utmMedium: "",
          utmCampaign: "",
        }));
      }
    }
  }, [form.trackCampaign, form.utmCampaign, form.utmMedium, form.utmSource]);

  const summaryText = useMemo(() => {
    const typeLabel =
      SOURCE_TYPE_OPTIONS.find((item) => item.value === form.type)?.label || "Source";

    return `${typeLabel} • Priority ${form.priority} • ${
      form.isActive ? "Active" : "Inactive"
    }`;
  }, [form.type, form.priority, form.isActive]);

  const updateField = <K extends keyof SourceRecord>(
    key: K,
    value: SourceRecord[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleNameBlur = () => {
    if (!initialValue?.code && !form.code.trim()) {
      updateField("code", buildSourceCode(form.name, form.type));
    }
  };

  const validate = (): boolean => {
    const nextErrors: SourceErrors = {};

    const trimmedName = form.name.trim();
    const trimmedCode = form.code.trim().toUpperCase();

    if (!trimmedName) {
      nextErrors.name = "Source name is required.";
    }

    if (!trimmedCode) {
      nextErrors.code = "Source code is required.";
    } else if (!/^[A-Z0-9-_]{2,20}$/.test(trimmedCode)) {
      nextErrors.code =
        "Use 2-20 uppercase letters, numbers, dash or underscore only.";
    }

    const duplicateName = sourceList.find(
      (item) =>
        item.id !== form.id &&
        item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateName) {
      nextErrors.name = "A source with this name already exists.";
    }

    const duplicateCode = sourceList.find(
      (item) =>
        item.id !== form.id &&
        item.code.trim().toUpperCase() === trimmedCode
    );

    if (duplicateCode) {
      nextErrors.code = "This source code already exists.";
    }

    if (form.priority < 1 || form.priority > 999) {
      nextErrors.priority = "Priority must be between 1 and 999.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (form.trackCampaign) {
      if (!form.utmSource.trim()) {
        nextErrors.utmSource = "UTM source is required when campaign tracking is enabled.";
      }
      if (!form.utmMedium.trim()) {
        nextErrors.utmMedium = "UTM medium is required when campaign tracking is enabled.";
      }
    }

    if (form.ownerName.trim().length > 60) {
      nextErrors.ownerName = "Owner name must be under 60 characters.";
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

  const handleQuickPreset = (type: SourceChannelType) => {
    const preset = getSourcePreset(type);
    setForm((prev) => ({
      ...prev,
      ...preset,
      id: prev.id,
      createdAt: prev.createdAt,
      updatedAt: new Date().toISOString(),
    }));
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    const normalized: SourceRecord = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      utmSource: form.utmSource.trim(),
      utmMedium: form.utmMedium.trim(),
      utmCampaign: form.utmCampaign.trim(),
      ownerName: form.ownerName.trim(),
      notes: form.notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = upsertSource(sourceList, normalized).map((item) =>
      normalized.isDefault && item.id !== normalized.id
        ? { ...item, isDefault: false }
        : item
    );

    const finalList = normalized.isDefault
      ? updatedList.map((item) =>
          item.id === normalized.id ? { ...item, isDefault: true } : item
        )
      : updatedList;

    setIsSaving(true);

    try {
      writeSourcesToStorage(finalList);

      if (onSave) {
        await Promise.resolve(onSave(normalized, finalList));
      }

      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error("Failed to save source:", error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Lead Source Management</div>
            <h2 style={styles.title}>
              {mode === "edit" ? "Edit Source" : "Create Source"}
            </h2>
            <p style={styles.subtitle}>
              Organize every lead origin with clarity, tracking discipline, and
              routing logic across your CRM system.
            </p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.layout}>
            <div style={styles.editorColumn}>
              <SectionCard title="Basic Information">
                <div style={styles.gridTwo}>
                  <Field label="Source Name *" error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      placeholder="Ex: Magicbricks Portal"
                      onChange={(e) => updateField("name", e.target.value)}
                      onBlur={handleNameBlur}
                      style={{
                        ...styles.input,
                        ...(errors.name ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="Source Code *" error={errors.code}>
                    <input
                      type="text"
                      value={form.code}
                      placeholder="MAGICBRICKS"
                      onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                      style={{
                        ...styles.input,
                        ...(errors.code ? styles.inputError : {}),
                      }}
                    />
                  </Field>
                </div>

                <div style={styles.gridTwo}>
                  <Field label="Source Type">
                    <select
                      value={form.type}
                      onChange={(e) =>
                        updateField("type", e.target.value as SourceChannelType)
                      }
                      style={styles.select}
                    >
                      {SOURCE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Priority *" error={errors.priority}>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={form.priority}
                      onChange={(e) =>
                        updateField("priority", Number(e.target.value || 1))
                      }
                      style={{
                        ...styles.input,
                        ...(errors.priority ? styles.inputError : {}),
                      }}
                    />
                  </Field>
                </div>

                <Field label="Description *" error={errors.description}>
                  <textarea
                    rows={4}
                    value={form.description}
                    placeholder="Describe when and how this source is used..."
                    onChange={(e) => updateField("description", e.target.value)}
                    style={{
                      ...styles.textarea,
                      ...(errors.description ? styles.inputError : {}),
                    }}
                  />
                </Field>
              </SectionCard>

              <SectionCard title="Visual Identity">
                <Field label="Choose Color">
                  <div style={styles.colorRow}>
                    {COLOR_PRESETS.map((color) => {
                      const active = form.color === color;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateField("color", color)}
                          style={{
                            ...styles.colorButton,
                            background: color,
                            ...(active ? styles.colorButtonActive : {}),
                          }}
                        />
                      );
                    })}
                  </div>
                </Field>

                <div style={styles.previewCard}>
                  <div
                    style={{
                      ...styles.previewBadge,
                      background: `${form.color}16`,
                      border: `1px solid ${form.color}33`,
                      color: form.color,
                    }}
                  >
                    <span
                      style={{
                        ...styles.previewDot,
                        background: form.color,
                      }}
                    />
                    {form.name.trim() || "Untitled Source"}
                  </div>

                  <div style={styles.previewMeta}>{summaryText}</div>
                </div>
              </SectionCard>

              <SectionCard title="Source Controls">
                <div style={styles.toggleGrid}>
                  <ToggleRow
                    label="Active Source"
                    description="Enable this source for new lead creation."
                    checked={form.isActive}
                    onChange={(checked) => updateField("isActive", checked)}
                  />
                  <ToggleRow
                    label="Default Source"
                    description="Use as fallback lead source by default."
                    checked={form.isDefault}
                    onChange={(checked) => updateField("isDefault", checked)}
                  />
                  <ToggleRow
                    label="Auto Assign"
                    description="Allow auto-routing or ownership logic."
                    checked={form.autoAssign}
                    onChange={(checked) => updateField("autoAssign", checked)}
                  />
                  <ToggleRow
                    label="Track Campaign"
                    description="Enable UTM and campaign tracking fields."
                    checked={form.trackCampaign}
                    onChange={(checked) => updateField("trackCampaign", checked)}
                  />
                  <ToggleRow
                    label="Require Remark"
                    description="Force note or remark while selecting this source."
                    checked={form.requiresRemark}
                    onChange={(checked) => updateField("requiresRemark", checked)}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Campaign Tracking">
                <div style={styles.gridThree}>
                  <Field label="UTM Source" error={errors.utmSource}>
                    <input
                      type="text"
                      value={form.utmSource}
                      disabled={!form.trackCampaign}
                      placeholder="facebook"
                      onChange={(e) => updateField("utmSource", e.target.value)}
                      style={{
                        ...styles.input,
                        opacity: form.trackCampaign ? 1 : 0.6,
                        ...(errors.utmSource ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="UTM Medium" error={errors.utmMedium}>
                    <input
                      type="text"
                      value={form.utmMedium}
                      disabled={!form.trackCampaign}
                      placeholder="cpc"
                      onChange={(e) => updateField("utmMedium", e.target.value)}
                      style={{
                        ...styles.input,
                        opacity: form.trackCampaign ? 1 : 0.6,
                        ...(errors.utmMedium ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="UTM Campaign">
                    <input
                      type="text"
                      value={form.utmCampaign}
                      disabled={!form.trackCampaign}
                      placeholder="april-luxury-project"
                      onChange={(e) => updateField("utmCampaign", e.target.value)}
                      style={{
                        ...styles.input,
                        opacity: form.trackCampaign ? 1 : 0.6,
                      }}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Ownership & Notes">
                <div style={styles.gridTwo}>
                  <Field label="Owner Name" error={errors.ownerName}>
                    <input
                      type="text"
                      value={form.ownerName}
                      placeholder="Ex: Digital Marketing Team"
                      onChange={(e) => updateField("ownerName", e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors.ownerName ? styles.inputError : {}),
                      }}
                    />
                  </Field>

                  <Field label="Last Updated">
                    <input
                      type="text"
                      readOnly
                      value={formatDateTime(form.updatedAt)}
                      style={{ ...styles.input, background: "#F8FAFC" }}
                    />
                  </Field>
                </div>

                <Field label="Notes" error={errors.notes}>
                  <textarea
                    rows={4}
                    value={form.notes}
                    placeholder="Add internal instructions, routing notes, or usage context..."
                    onChange={(e) => updateField("notes", e.target.value)}
                    style={{
                      ...styles.textarea,
                      ...(errors.notes ? styles.inputError : {}),
                    }}
                  />
                </Field>
              </SectionCard>
            </div>

            <div style={styles.sideColumn}>
              <SectionCard title="Quick Presets">
                <div style={styles.presetStack}>
                  {SOURCE_TYPE_OPTIONS.slice(0, 6).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleQuickPreset(option.value)}
                      style={styles.presetButton}
                    >
                      <div style={styles.presetTitle}>{option.label}</div>
                      <div style={styles.presetDescription}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Existing Sources">
                <input
                  type="text"
                  value={search}
                  placeholder="Search saved sources..."
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />

                <div style={styles.sourceList}>
                  {filteredSources.length === 0 ? (
                    <div style={styles.emptyState}>No sources found.</div>
                  ) : (
                    filteredSources.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setForm(item);
                          setErrors({});
                        }}
                        style={{
                          ...styles.sourceListItem,
                          ...(item.id === form.id ? styles.sourceListItemActive : {}),
                        }}
                      >
                        <div style={styles.sourceListTop}>
                          <div style={styles.sourceListTitleWrap}>
                            <span
                              style={{
                                ...styles.sourceMiniDot,
                                background: item.color,
                              }}
                            />
                            <span style={styles.sourceListTitle}>{item.name}</span>
                          </div>
                          {item.isDefault ? (
                            <span style={styles.defaultBadge}>Default</span>
                          ) : null}
                        </div>

                        <div style={styles.sourceListMeta}>
                          {item.code} • {item.type} • P{item.priority}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Usage Guidance">
                <ul style={styles.guidelineList}>
                  <li>Keep source names simple and recognizable across teams.</li>
                  <li>Use unique source codes for automation and reporting logic.</li>
                  <li>Campaign tracking is best for paid ads and measurable funnels.</li>
                  <li>Only one default source should exist at a time.</li>
                  <li>Priority helps when multiple routing rules compete together.</li>
                </ul>
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
              const now = new Date().toISOString();
              setForm({
                ...DEFAULT_SOURCE,
                id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                createdAt: now,
                updatedAt: now,
                priority:
                  sourceList.length > 0
                    ? Math.max(...sourceList.map((item) => item.priority || 0)) + 1
                    : 1,
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
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
              ? "Save Source"
              : "Create Source"}
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

function buildSourceCode(name: string, type: SourceChannelType) {
  const base = name.trim()
    ? name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 16)
    : type.toUpperCase();

  return base || "SOURCE";
}

function formatDateTime(value: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getSourcePreset(type: SourceChannelType): Partial<SourceRecord> {
  const map: Record<SourceChannelType, Partial<SourceRecord>> = {
    website: {
      name: "Website Direct",
      code: "WEBSITE-DIRECT",
      type: "website",
      description: "Direct website inquiry from forms or landing pages.",
      color: "#1D4ED8",
      trackCampaign: false,
      autoAssign: true,
      requiresRemark: false,
    },
    portal: {
      name: "Property Portal",
      code: "PROPERTY-PORTAL",
      type: "portal",
      description: "Lead captured from a real estate listing portal.",
      color: "#7C3AED",
      trackCampaign: false,
      autoAssign: true,
      requiresRemark: true,
    },
    broker: {
      name: "Broker Partner",
      code: "BROKER-PARTNER",
      type: "broker",
      description: "Lead referred by external broker or channel partner.",
      color: "#D97706",
      trackCampaign: false,
      autoAssign: false,
      requiresRemark: true,
    },
    referral: {
      name: "Customer Referral",
      code: "CUSTOMER-REFERRAL",
      type: "referral",
      description: "Referral generated by customer or trusted network.",
      color: "#059669",
      trackCampaign: false,
      autoAssign: false,
      requiresRemark: true,
    },
    social: {
      name: "Social Media",
      code: "SOCIAL-MEDIA",
      type: "social",
      description: "Lead generated from social channel interactions.",
      color: "#0891B2",
      trackCampaign: true,
      autoAssign: true,
      requiresRemark: false,
      utmSource: "facebook",
      utmMedium: "social",
      utmCampaign: "",
    },
    campaign: {
      name: "Paid Campaign",
      code: "PAID-CAMPAIGN",
      type: "campaign",
      description: "Performance campaign driven lead source.",
      color: "#DC2626",
      trackCampaign: true,
      autoAssign: true,
      requiresRemark: false,
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "",
    },
    walkin: {
      name: "Walk-in Visit",
      code: "WALKIN-VISIT",
      type: "walkin",
      description: "Lead captured through office or site walk-in.",
      color: "#0F172A",
    },
    "cold-call": {
      name: "Cold Calling",
      code: "COLD-CALLING",
      type: "cold-call",
      description: "Outbound sales-generated lead source.",
      color: "#BE185D",
    },
    whatsapp: {
      name: "WhatsApp Inquiry",
      code: "WHATSAPP-INQUIRY",
      type: "whatsapp",
      description: "Lead captured through direct WhatsApp CTA.",
      color: "#059669",
    },
    other: {
      name: "Other Source",
      code: "OTHER-SOURCE",
      type: "other",
      description: "Custom or non-standard source bucket.",
      color: "#64748B",
    },
  };

  return map[type];
}

function readSourcesFromStorage(): SourceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSourcesToStorage(sources: SourceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  } catch {
    // ignore storage errors
  }
}

function mergeSources(a: SourceRecord[], b: SourceRecord[]) {
  const map = new Map<string, SourceRecord>();
  [...a, ...b].forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

function upsertSource(list: SourceRecord[], value: SourceRecord) {
  const exists = list.some((item) => item.id === value.id);
  if (!exists) return [value, ...list];
  return list.map((item) => (item.id === value.id ? value : item));
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
    maxWidth: 1280,
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
    maxWidth: 760,
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
  editorColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  sideColumn: {
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
  gridThree: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
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
  colorRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  colorButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "2px solid transparent",
    cursor: "pointer",
  },
  colorButtonActive: {
    border: "2px solid #0F172A",
    boxShadow: "0 0 0 3px rgba(15,23,42,0.08)",
  },
  previewCard: {
    marginTop: 16,
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: 14,
  },
  previewBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    minHeight: 40,
    padding: "0 14px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  previewMeta: {
    marginTop: 12,
    fontSize: 13,
    color: "#475569",
    fontWeight: 600,
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
  presetDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 1.5,
  },
  searchInput: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    background: "#FFFFFF",
    color: "#0F172A",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 14,
  },
  sourceList: {
    display: "grid",
    gap: 10,
  },
  sourceListItem: {
    width: "100%",
    textAlign: "left",
    borderRadius: 16,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: 14,
    cursor: "pointer",
  },
  sourceListItemActive: {
    border: "1px solid #0F172A",
    background: "#F8FAFC",
  },
  sourceListTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sourceListTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  sourceMiniDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  sourceListTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0F172A",
  },
  sourceListMeta: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
  },
  defaultBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: 22,
    padding: "0 8px",
    borderRadius: 999,
    background: "#ECFDF5",
    color: "#047857",
    border: "1px solid #A7F3D0",
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  },
  emptyState: {
    padding: 16,
    borderRadius: 14,
    background: "#F8FAFC",
    border: "1px dashed #CBD5E1",
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    fontWeight: 600,
  },
  guidelineList: {
    margin: 0,
    paddingLeft: 18,
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.8,
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