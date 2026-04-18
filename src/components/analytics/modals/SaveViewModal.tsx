import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SaveViewVisibility = "private" | "team" | "public";

export type SaveViewFilterChip = {
  key: string;
  label: string;
};

export type SaveViewModalPayload = {
  name: string;
  description: string;
  visibility: SaveViewVisibility;
  isDefault: boolean;
  includeFilters: boolean;
  includeLayout: boolean;
  includeDateRange: boolean;
  tags: string[];
};

export type SaveViewModalProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  defaultName?: string;
  defaultDescription?: string;
  defaultVisibility?: SaveViewVisibility;
  defaultIsDefault?: boolean;
  includeFiltersByDefault?: boolean;
  includeLayoutByDefault?: boolean;
  includeDateRangeByDefault?: boolean;
  availableTags?: string[];
  activeFilterChips?: SaveViewFilterChip[];
  loading?: boolean;
  maxWidth?: number | string;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  submitLabel?: string;
  onClose: () => void;
  onSave?: (payload: SaveViewModalPayload) => void;
  style?: CSSProperties;
  className?: string;
};

type ToneStyles = {
  accent: string;
  border: string;
  softBg: string;
  surface: string;
  title: string;
  subtitle: string;
  primaryBg: string;
  primaryText: string;
  chipBg: string;
  chipText: string;
  optionBg: string;
};

function getToneStyles(
  tone: NonNullable<SaveViewModalProps["tone"]>
): ToneStyles {
  switch (tone) {
    case "primary":
      return {
        accent: "#111827",
        border: "#e5e7eb",
        softBg: "#f3f4f6",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        primaryBg: "#111827",
        primaryText: "#ffffff",
        chipBg: "#111827",
        chipText: "#ffffff",
        optionBg: "#f9fafb",
      };
    case "success":
      return {
        accent: "#047857",
        border: "#a7f3d0",
        softBg: "#ecfdf3",
        surface: "#ffffff",
        title: "#064e3b",
        subtitle: "#047857",
        primaryBg: "#047857",
        primaryText: "#ffffff",
        chipBg: "#047857",
        chipText: "#ffffff",
        optionBg: "#f0fdf4",
      };
    case "warning":
      return {
        accent: "#c2410c",
        border: "#fdba74",
        softBg: "#fff7ed",
        surface: "#ffffff",
        title: "#7c2d12",
        subtitle: "#c2410c",
        primaryBg: "#c2410c",
        primaryText: "#ffffff",
        chipBg: "#c2410c",
        chipText: "#ffffff",
        optionBg: "#fffbeb",
      };
    case "danger":
      return {
        accent: "#b91c1c",
        border: "#fecaca",
        softBg: "#fef2f2",
        surface: "#ffffff",
        title: "#7f1d1d",
        subtitle: "#b91c1c",
        primaryBg: "#b91c1c",
        primaryText: "#ffffff",
        chipBg: "#b91c1c",
        chipText: "#ffffff",
        optionBg: "#fff1f2",
      };
    case "info":
      return {
        accent: "#1d4ed8",
        border: "#bfdbfe",
        softBg: "#eff6ff",
        surface: "#ffffff",
        title: "#1e3a8a",
        subtitle: "#1d4ed8",
        primaryBg: "#1d4ed8",
        primaryText: "#ffffff",
        chipBg: "#1d4ed8",
        chipText: "#ffffff",
        optionBg: "#f8fbff",
      };
    default:
      return {
        accent: "#374151",
        border: "#e5e7eb",
        softBg: "#f9fafb",
        surface: "#ffffff",
        title: "#111827",
        subtitle: "#6b7280",
        primaryBg: "#111827",
        primaryText: "#ffffff",
        chipBg: "#374151",
        chipText: "#ffffff",
        optionBg: "#f9fafb",
      };
  }
}

const VISIBILITY_OPTIONS: Array<{
  value: SaveViewVisibility;
  label: string;
  description: string;
}> = [
  {
    value: "private",
    label: "Private",
    description: "Only you can access this saved view.",
  },
  {
    value: "team",
    label: "Team",
    description: "Visible to your team and shared workspace members.",
  },
  {
    value: "public",
    label: "Public",
    description: "Visible to everyone who can access this dashboard.",
  },
];

function normalizeTag(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function SaveViewSkeleton({ toneStyles }: { toneStyles: ToneStyles }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          width: "46%",
          height: 16,
          borderRadius: 8,
          background: toneStyles.softBg,
        }}
      />
      <div
        style={{
          width: "78%",
          height: 12,
          borderRadius: 8,
          background: toneStyles.softBg,
        }}
      />
      <div
        style={{
          height: 46,
          borderRadius: 12,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.optionBg,
        }}
      />
      <div
        style={{
          height: 110,
          borderRadius: 12,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.optionBg,
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: 84,
              borderRadius: 16,
              border: `1px solid ${toneStyles.border}`,
              background: toneStyles.optionBg,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SaveViewModal({
  open,
  title = "Save Current View",
  subtitle = "Capture filters, layout choices, and reporting context so you can reopen this view in one tap.",
  icon = "💾",
  defaultName = "",
  defaultDescription = "",
  defaultVisibility = "private",
  defaultIsDefault = false,
  includeFiltersByDefault = true,
  includeLayoutByDefault = true,
  includeDateRangeByDefault = true,
  availableTags = [],
  activeFilterChips = [],
  loading = false,
  maxWidth = 820,
  tone = "default",
  closeOnBackdrop = true,
  closeOnEscape = true,
  submitLabel = "Save View",
  onClose,
  onSave,
  style,
}: SaveViewModalProps) {
  const toneStyles = getToneStyles(tone);

  const defaultResolvedTags = useMemo(
    () =>
      availableTags
        .map((tag) => normalizeTag(tag))
        .filter((tag, index, arr) => tag.length > 0 && arr.indexOf(tag) === index),
    [availableTags]
  );

  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [visibility, setVisibility] =
    useState<SaveViewVisibility>(defaultVisibility);
  const [isDefault, setIsDefault] = useState(defaultIsDefault);
  const [includeFilters, setIncludeFilters] = useState(includeFiltersByDefault);
  const [includeLayout, setIncludeLayout] = useState(includeLayoutByDefault);
  const [includeDateRange, setIncludeDateRange] = useState(
    includeDateRangeByDefault
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultResolvedTags);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(defaultName);
    setDescription(defaultDescription);
    setVisibility(defaultVisibility);
    setIsDefault(defaultIsDefault);
    setIncludeFilters(includeFiltersByDefault);
    setIncludeLayout(includeLayoutByDefault);
    setIncludeDateRange(includeDateRangeByDefault);
    setSelectedTags(defaultResolvedTags);
    setTagInput("");
  }, [
    open,
    defaultName,
    defaultDescription,
    defaultVisibility,
    defaultIsDefault,
    includeFiltersByDefault,
    includeLayoutByDefault,
    includeDateRangeByDefault,
    defaultResolvedTags,
  ]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const trimmedName = name.trim();
  const isSaveDisabled = trimmedName.length === 0;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const addTag = (rawValue: string) => {
    const normalized = normalizeTag(rawValue);
    if (!normalized) return;

    setSelectedTags((current) => {
      if (current.includes(normalized)) {
        return current;
      }

      return [...current, normalized];
    });

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  };

  const handleTagInputKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
    }

    if (event.key === "Backspace" && tagInput.trim().length === 0 && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleSave = () => {
    if (trimmedName.length === 0) return;

    const payload: SaveViewModalPayload = {
      name: trimmedName,
      description: description.trim(),
      visibility,
      isDefault,
      includeFilters,
      includeLayout,
      includeDateRange,
      tags: selectedTags,
    };

    onSave?.(payload);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Save View Modal"}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.58)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={handleModalClick}
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflow: "hidden",
          borderRadius: 24,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.surface,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
            padding: 20,
            borderBottom: `1px solid ${toneStyles.border}`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                minWidth: 56,
                borderRadius: 18,
                background: toneStyles.softBg,
                border: `1px solid ${toneStyles.border}`,
                color: toneStyles.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {icon}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: toneStyles.title,
                  marginBottom: subtitle ? 8 : 0,
                }}
              >
                {title}
              </div>

              {subtitle ? (
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: toneStyles.subtitle,
                  }}
                >
                  {subtitle}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              borderRadius: 12,
              border: `1px solid ${toneStyles.border}`,
              background: "#ffffff",
              color: toneStyles.accent,
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <SaveViewSkeleton toneStyles={toneStyles} />
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  View Details
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#4b5563",
                        marginBottom: 8,
                      }}
                    >
                      View Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ex: Bangalore Revenue Snapshot"
                      style={{
                        width: "100%",
                        height: 46,
                        borderRadius: 12,
                        border: `1px solid ${toneStyles.border}`,
                        background: "#ffffff",
                        padding: "0 14px",
                        boxSizing: "border-box",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#4b5563",
                        marginBottom: 8,
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Add a short note about what this saved view is meant for."
                      rows={4}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        border: `1px solid ${toneStyles.border}`,
                        background: "#ffffff",
                        padding: 14,
                        boxSizing: "border-box",
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        color: "#111827",
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </section>

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  Visibility
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  {VISIBILITY_OPTIONS.map((option) => {
                    const active = visibility === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setVisibility(option.value)}
                        style={{
                          minHeight: 84,
                          borderRadius: 16,
                          border: `1px solid ${
                            active ? toneStyles.accent : toneStyles.border
                          }`,
                          background: active ? toneStyles.softBg : "#ffffff",
                          color: toneStyles.title,
                          textAlign: "left",
                          padding: 14,
                          boxSizing: "border-box",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            marginBottom: 6,
                          }}
                        >
                          {option.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            lineHeight: 1.55,
                            color: toneStyles.subtitle,
                          }}
                        >
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  What to Save
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 10,
                  }}
                >
                  <CheckboxCard
                    checked={includeFilters}
                    label="Filters"
                    description="Save all applied dashboard filters."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeFilters((value) => !value)}
                  />
                  <CheckboxCard
                    checked={includeLayout}
                    label="Layout Preferences"
                    description="Save widgets, arrangement, and section setup."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeLayout((value) => !value)}
                  />
                  <CheckboxCard
                    checked={includeDateRange}
                    label="Date Range"
                    description="Save the current reporting period and date scope."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeDateRange((value) => !value)}
                  />
                  <CheckboxCard
                    checked={isDefault}
                    label="Set as Default"
                    description="Open this view automatically when the page loads."
                    toneStyles={toneStyles}
                    onToggle={() => setIsDefault((value) => !value)}
                  />
                </div>
              </section>

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  Tags
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${toneStyles.border}`,
                    background: "#ffffff",
                    padding: 14,
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {selectedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          minHeight: 32,
                          padding: "0 12px",
                          borderRadius: 999,
                          border: "none",
                          background: toneStyles.chipBg,
                          color: toneStyles.chipText,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        <span>{tag}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}

                    <input
                      type="text"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={() => addTag(tagInput)}
                      placeholder="Type tag and press Enter"
                      style={{
                        flex: "1 1 220px",
                        minWidth: 180,
                        height: 38,
                        borderRadius: 10,
                        border: `1px solid ${toneStyles.border}`,
                        background: "#ffffff",
                        padding: "0 12px",
                        boxSizing: "border-box",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>

                  {activeFilterChips.length > 0 ? (
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#6b7280",
                          marginBottom: 8,
                        }}
                      >
                        Active Filters
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {activeFilterChips.map((chip) => (
                          <span
                            key={chip.key}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minHeight: 30,
                              padding: "0 10px",
                              borderRadius: 999,
                              border: `1px solid ${toneStyles.border}`,
                              background: toneStyles.optionBg,
                              color: toneStyles.title,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <section
                style={{
                  borderRadius: 18,
                  border: `1px solid ${toneStyles.border}`,
                  background: toneStyles.optionBg,
                  padding: 16,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 10,
                  }}
                >
                  Save Preview
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: toneStyles.subtitle,
                  }}
                >
                  <div>
                    <strong style={{ color: toneStyles.title }}>Name:</strong>{" "}
                    {trimmedName || "Untitled View"}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>
                      Visibility:
                    </strong>{" "}
                    {VISIBILITY_OPTIONS.find((option) => option.value === visibility)
                      ?.label ?? "Private"}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>Includes:</strong>{" "}
                    {[
                      includeFilters ? "Filters" : null,
                      includeLayout ? "Layout" : null,
                      includeDateRange ? "Date Range" : null,
                      isDefault ? "Default View" : null,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Nothing selected"}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${toneStyles.border}`,
            background: "#ffffff",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.55,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            {selectedTags.length} tag{selectedTags.length === 1 ? "" : "s"} added
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.border}`,
                background: "#ffffff",
                color: toneStyles.accent,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaveDisabled}
              style={{
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.primaryBg}`,
                background: isSaveDisabled ? "#d1d5db" : toneStyles.primaryBg,
                color: toneStyles.primaryText,
                fontSize: 13,
                fontWeight: 800,
                cursor: isSaveDisabled ? "not-allowed" : "pointer",
              }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckboxCard({
  checked,
  label,
  description,
  toneStyles,
  onToggle,
}: {
  checked: boolean;
  label: string;
  description: string;
  toneStyles: ToneStyles;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "100%",
        minHeight: 84,
        borderRadius: 16,
        border: `1px solid ${checked ? toneStyles.accent : toneStyles.border}`,
        background: checked ? toneStyles.softBg : "#ffffff",
        padding: 14,
        boxSizing: "border-box",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            minWidth: 20,
            marginTop: 1,
            borderRadius: 6,
            border: `1px solid ${checked ? toneStyles.accent : toneStyles.border}`,
            background: checked ? toneStyles.accent : "#ffffff",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {checked ? "✓" : ""}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              lineHeight: 1.35,
              color: "#111827",
              marginBottom: 6,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontSize: 12,
              lineHeight: 1.55,
              color: "#6b7280",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}