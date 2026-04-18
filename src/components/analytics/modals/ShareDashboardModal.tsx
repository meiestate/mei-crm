import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ShareDashboardPermission = "view" | "comment" | "edit";
export type ShareDashboardAudience = "specific" | "team" | "public";

export type ShareDashboardPerson = {
  id: string;
  name: string;
  email: string;
  avatarText?: string;
  role?: string;
};

export type ShareDashboardPayload = {
  audience: ShareDashboardAudience;
  permission: ShareDashboardPermission;
  people: ShareDashboardPerson[];
  sendEmail: boolean;
  allowDownload: boolean;
  includeFilters: boolean;
  includeDateRange: boolean;
  message: string;
};

export type ShareDashboardModalProps = {
  open: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  peopleOptions?: ShareDashboardPerson[];
  defaultAudience?: ShareDashboardAudience;
  defaultPermission?: ShareDashboardPermission;
  defaultSelectedPeople?: ShareDashboardPerson[];
  sendEmailByDefault?: boolean;
  allowDownloadByDefault?: boolean;
  includeFiltersByDefault?: true | false;
  includeDateRangeByDefault?: true | false;
  defaultMessage?: string;
  loading?: boolean;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  maxWidth?: number | string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  submitLabel?: string;
  onClose: () => void;
  onShare?: (payload: ShareDashboardPayload) => void;
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

const AUDIENCE_OPTIONS: Array<{
  value: ShareDashboardAudience;
  label: string;
  description: string;
}> = [
  {
    value: "specific",
    label: "Specific People",
    description: "Share only with selected users or stakeholders.",
  },
  {
    value: "team",
    label: "Entire Team",
    description: "Anyone inside your workspace team can access it.",
  },
  {
    value: "public",
    label: "Public Link",
    description: "Anyone with the link can open the dashboard.",
  },
];

const PERMISSION_OPTIONS: Array<{
  value: ShareDashboardPermission;
  label: string;
  description: string;
}> = [
  {
    value: "view",
    label: "View Only",
    description: "Can view the dashboard without making changes.",
  },
  {
    value: "comment",
    label: "Comment",
    description: "Can comment and collaborate on insights.",
  },
  {
    value: "edit",
    label: "Edit",
    description: "Can modify layout, filters, and dashboard setup.",
  },
];

function getToneStyles(
  tone: NonNullable<ShareDashboardModalProps["tone"]>
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

function ShareDashboardSkeleton({
  toneStyles,
}: {
  toneStyles: ToneStyles;
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          width: "42%",
          height: 16,
          borderRadius: 8,
          background: toneStyles.softBg,
        }}
      />
      <div
        style={{
          width: "76%",
          height: 12,
          borderRadius: 8,
          background: toneStyles.softBg,
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
          height: 120,
          borderRadius: 12,
          border: `1px solid ${toneStyles.border}`,
          background: toneStyles.optionBg,
        }}
      />
    </div>
  );
}

function dedupePeople(people: ShareDashboardPerson[]): ShareDashboardPerson[] {
  const map = new Map<string, ShareDashboardPerson>();

  people.forEach((person) => {
    if (!map.has(person.id)) {
      map.set(person.id, person);
    }
  });

  return Array.from(map.values());
}

function getAvatarText(person: ShareDashboardPerson): string {
  if (person.avatarText?.trim()) {
    return person.avatarText.trim().slice(0, 2).toUpperCase();
  }

  const pieces = person.name.trim().split(/\s+/).filter(Boolean);

  if (pieces.length === 0) return "U";
  if (pieces.length === 1) return pieces[0].slice(0, 2).toUpperCase();

  return `${pieces[0][0] ?? ""}${pieces[1][0] ?? ""}`.toUpperCase();
}

export default function ShareDashboardModal({
  open,
  title = "Share Dashboard",
  subtitle = "Invite people, choose permissions, and control what gets shared along with the dashboard.",
  icon = "🔗",
  peopleOptions = [],
  defaultAudience = "specific",
  defaultPermission = "view",
  defaultSelectedPeople = [],
  sendEmailByDefault = true,
  allowDownloadByDefault = false,
  includeFiltersByDefault = true,
  includeDateRangeByDefault = true,
  defaultMessage = "",
  loading = false,
  tone = "default",
  maxWidth = 880,
  closeOnBackdrop = true,
  closeOnEscape = true,
  submitLabel = "Share Dashboard",
  onClose,
  onShare,
  style,
}: ShareDashboardModalProps) {
  const toneStyles = getToneStyles(tone);

  const initialSelectedPeople = useMemo(
    () => dedupePeople(defaultSelectedPeople),
    [defaultSelectedPeople]
  );

  const [audience, setAudience] =
    useState<ShareDashboardAudience>(defaultAudience);
  const [permission, setPermission] =
    useState<ShareDashboardPermission>(defaultPermission);
  const [selectedPeople, setSelectedPeople] =
    useState<ShareDashboardPerson[]>(initialSelectedPeople);
  const [search, setSearch] = useState("");
  const [sendEmail, setSendEmail] = useState(sendEmailByDefault);
  const [allowDownload, setAllowDownload] = useState(allowDownloadByDefault);
  const [includeFilters, setIncludeFilters] =
    useState(includeFiltersByDefault);
  const [includeDateRange, setIncludeDateRange] =
    useState(includeDateRangeByDefault);
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    if (!open) return;

    setAudience(defaultAudience);
    setPermission(defaultPermission);
    setSelectedPeople(initialSelectedPeople);
    setSearch("");
    setSendEmail(sendEmailByDefault);
    setAllowDownload(allowDownloadByDefault);
    setIncludeFilters(includeFiltersByDefault);
    setIncludeDateRange(includeDateRangeByDefault);
    setMessage(defaultMessage);
  }, [
    open,
    defaultAudience,
    defaultPermission,
    initialSelectedPeople,
    sendEmailByDefault,
    allowDownloadByDefault,
    includeFiltersByDefault,
    includeDateRangeByDefault,
    defaultMessage,
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

  const filteredPeopleOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return peopleOptions.filter((person) => {
      if (!query) return true;

      return (
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        (person.role ?? "").toLowerCase().includes(query)
      );
    });
  }, [peopleOptions, search]);

  const selectedPersonIds = useMemo(
    () => new Set(selectedPeople.map((person) => person.id)),
    [selectedPeople]
  );

  const isSubmitDisabled =
    audience === "specific" && selectedPeople.length === 0;

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const togglePerson = (person: ShareDashboardPerson) => {
    setSelectedPeople((current) => {
      const exists = current.some((item) => item.id === person.id);

      if (exists) {
        return current.filter((item) => item.id !== person.id);
      }

      return [...current, person];
    });
  };

  const removePerson = (personId: string) => {
    setSelectedPeople((current) =>
      current.filter((person) => person.id !== personId)
    );
  };

  const handleShare = () => {
    if (isSubmitDisabled) return;

    onShare?.({
      audience,
      permission,
      people: audience === "specific" ? selectedPeople : [],
      sendEmail,
      allowDownload,
      includeFilters,
      includeDateRange,
      message: message.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Share Dashboard Modal"}
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
            <ShareDashboardSkeleton toneStyles={toneStyles} />
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
                  Share With
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  {AUDIENCE_OPTIONS.map((option) => {
                    const active = audience === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAudience(option.value)}
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
                  Permission Level
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  {PERMISSION_OPTIONS.map((option) => {
                    const active = permission === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPermission(option.value)}
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

              {audience === "specific" ? (
                <section>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: toneStyles.title,
                      marginBottom: 12,
                    }}
                  >
                    Select People
                  </div>

                  <div
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${toneStyles.border}`,
                      background: "#ffffff",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: 14,
                        borderBottom: `1px solid ${toneStyles.border}`,
                        boxSizing: "border-box",
                      }}
                    >
                      <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, email, or role"
                        style={{
                          width: "100%",
                          height: 42,
                          borderRadius: 12,
                          border: `1px solid ${toneStyles.border}`,
                          background: "#ffffff",
                          padding: "0 14px",
                          boxSizing: "border-box",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>

                    {selectedPeople.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          padding: 14,
                          borderBottom: `1px solid ${toneStyles.border}`,
                          boxSizing: "border-box",
                        }}
                      >
                        {selectedPeople.map((person) => (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => removePerson(person.id)}
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
                            <span>{person.name}</span>
                            <span aria-hidden="true">×</span>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <div
                      style={{
                        maxHeight: 280,
                        overflowY: "auto",
                        display: "grid",
                      }}
                    >
                      {filteredPeopleOptions.length === 0 ? (
                        <div
                          style={{
                            padding: 18,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#6b7280",
                          }}
                        >
                          No matching people found.
                        </div>
                      ) : (
                        filteredPeopleOptions.map((person) => {
                          const checked = selectedPersonIds.has(person.id);

                          return (
                            <PersonRow
                              key={person.id}
                              person={person}
                              checked={checked}
                              toneStyles={toneStyles}
                              onToggle={() => togglePerson(person)}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </section>
              ) : null}

              <section>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: toneStyles.title,
                    marginBottom: 12,
                  }}
                >
                  Share Settings
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 10,
                  }}
                >
                  <CheckboxCard
                    checked={sendEmail}
                    label="Send Email Notification"
                    description="Notify recipients right away."
                    toneStyles={toneStyles}
                    onToggle={() => setSendEmail((value) => !value)}
                  />
                  <CheckboxCard
                    checked={allowDownload}
                    label="Allow Download"
                    description="Let recipients export or download data."
                    toneStyles={toneStyles}
                    onToggle={() => setAllowDownload((value) => !value)}
                  />
                  <CheckboxCard
                    checked={includeFilters}
                    label="Include Filters"
                    description="Share the current filter context."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeFilters((value) => !value)}
                  />
                  <CheckboxCard
                    checked={includeDateRange}
                    label="Include Date Range"
                    description="Share the active reporting timeline."
                    toneStyles={toneStyles}
                    onToggle={() => setIncludeDateRange((value) => !value)}
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
                  Message
                </div>

                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Add a quick note for the people receiving this dashboard."
                  rows={5}
                  style={{
                    width: "100%",
                    borderRadius: 14,
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
                  Share Preview
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
                    <strong style={{ color: toneStyles.title }}>Audience:</strong>{" "}
                    {AUDIENCE_OPTIONS.find((item) => item.value === audience)?.label ??
                      "Specific People"}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>
                      Permission:
                    </strong>{" "}
                    {PERMISSION_OPTIONS.find((item) => item.value === permission)
                      ?.label ?? "View Only"}
                  </div>
                  <div>
                    <strong style={{ color: toneStyles.title }}>
                      Recipients:
                    </strong>{" "}
                    {audience === "specific"
                      ? selectedPeople.length > 0
                        ? selectedPeople.map((person) => person.name).join(", ")
                        : "No recipients selected"
                      : audience === "team"
                      ? "Entire team"
                      : "Anyone with the link"}
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
            {audience === "specific"
              ? `${selectedPeople.length} recipient${
                  selectedPeople.length === 1 ? "" : "s"
                } selected`
              : audience === "team"
              ? "This will be shared with your team"
              : "This will create a public share state"}
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
              onClick={handleShare}
              disabled={isSubmitDisabled}
              style={{
                minHeight: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${toneStyles.primaryBg}`,
                background: isSubmitDisabled ? "#d1d5db" : toneStyles.primaryBg,
                color: toneStyles.primaryText,
                fontSize: 13,
                fontWeight: 800,
                cursor: isSubmitDisabled ? "not-allowed" : "pointer",
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

function PersonRow({
  person,
  checked,
  toneStyles,
  onToggle,
}: {
  person: ShareDashboardPerson;
  checked: boolean;
  toneStyles: ToneStyles;
  onToggle: () => void;
}) {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{
        width: "100%",
        border: "none",
        borderBottom: `1px solid ${toneStyles.border}`,
        background: checked ? toneStyles.softBg : "#ffffff",
        padding: 14,
        boxSizing: "border-box",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            minWidth: 38,
            borderRadius: 999,
            background: toneStyles.chipBg,
            color: toneStyles.chipText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {getAvatarText(person)}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.35,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {person.email}
            {person.role ? ` • ${person.role}` : ""}
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            minWidth: 20,
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
      </div>
    </button>
  );
}