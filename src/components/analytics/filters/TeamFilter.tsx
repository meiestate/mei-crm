import { useEffect, useMemo, useState } from "react";

export type TeamFilterOption = {
  label: string;
  value: string;
};

export type TeamFilterValue = {
  search: string;
  department: string;
  role: string;
  memberStatus: string;
  selectedTeams: string[];
};

type TeamFilterProps = {
  value?: TeamFilterValue;
  onChange?: (value: TeamFilterValue) => void;
  onApply?: (value: TeamFilterValue) => void;
  onReset?: () => void;
  title?: string;
  subtitle?: string;
  departmentOptions?: TeamFilterOption[];
  roleOptions?: TeamFilterOption[];
  memberStatusOptions?: TeamFilterOption[];
  teamOptions?: TeamFilterOption[];
  featuredTeams?: TeamFilterOption[];
  disabled?: boolean;
};

const DEFAULT_VALUE: TeamFilterValue = {
  search: "",
  department: "all",
  role: "all",
  memberStatus: "all",
  selectedTeams: [],
};

const DEFAULT_DEPARTMENT_OPTIONS: TeamFilterOption[] = [
  { label: "All Departments", value: "all" },
  { label: "Sales", value: "sales" },
  { label: "Marketing", value: "marketing" },
  { label: "Operations", value: "operations" },
  { label: "Customer Success", value: "customer_success" },
  { label: "Finance", value: "finance" },
  { label: "Management", value: "management" },
];

const DEFAULT_ROLE_OPTIONS: TeamFilterOption[] = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Team Lead", value: "team_lead" },
  { label: "Executive", value: "executive" },
  { label: "Agent", value: "agent" },
  { label: "Coordinator", value: "coordinator" },
];

const DEFAULT_MEMBER_STATUS_OPTIONS: TeamFilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on_leave" },
  { label: "Probation", value: "probation" },
];

const DEFAULT_TEAM_OPTIONS: TeamFilterOption[] = [
  { label: "Inside Sales", value: "inside_sales" },
  { label: "Field Sales", value: "field_sales" },
  { label: "Broker Relations", value: "broker_relations" },
  { label: "Digital Marketing", value: "digital_marketing" },
  { label: "CRM Operations", value: "crm_operations" },
  { label: "Customer Support", value: "customer_support" },
  { label: "Finance Ops", value: "finance_ops" },
  { label: "Leadership Team", value: "leadership_team" },
];

const DEFAULT_FEATURED_TEAMS: TeamFilterOption[] = [
  { label: "Inside Sales", value: "inside_sales" },
  { label: "Field Sales", value: "field_sales" },
  { label: "Digital Marketing", value: "digital_marketing" },
  { label: "CRM Operations", value: "crm_operations" },
];

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: "#6b7280",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

type SelectFieldProps = {
  value: string;
  options: TeamFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

function SelectField({
  value,
  options,
  onChange,
  disabled = false,
}: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        height: 44,
        borderRadius: 12,
        border: "1px solid #d1d5db",
        background: "#ffffff",
        color: "#111827",
        padding: "0 12px",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function TeamFilter({
  value = DEFAULT_VALUE,
  onChange,
  onApply,
  onReset,
  title = "Team Filter",
  subtitle = "Refine records using team, department, role and member status",
  departmentOptions = DEFAULT_DEPARTMENT_OPTIONS,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  memberStatusOptions = DEFAULT_MEMBER_STATUS_OPTIONS,
  teamOptions = DEFAULT_TEAM_OPTIONS,
  featuredTeams = DEFAULT_FEATURED_TEAMS,
  disabled = false,
}: TeamFilterProps) {
  const [localValue, setLocalValue] = useState<TeamFilterValue>({
    search: value.search ?? "",
    department: value.department ?? "all",
    role: value.role ?? "all",
    memberStatus: value.memberStatus ?? "all",
    selectedTeams: value.selectedTeams ?? [],
  });

  useEffect(() => {
    setLocalValue({
      search: value.search ?? "",
      department: value.department ?? "all",
      role: value.role ?? "all",
      memberStatus: value.memberStatus ?? "all",
      selectedTeams: value.selectedTeams ?? [],
    });
  }, [
    value.department,
    value.memberStatus,
    value.role,
    value.search,
    value.selectedTeams,
  ]);

  const filteredTeamOptions = useMemo(() => {
    const keyword = localValue.search.trim().toLowerCase();

    if (!keyword) return teamOptions;

    return teamOptions.filter((team) => {
      const normalizedKeyword = keyword.replace(/\s+/g, "_");
      return (
        team.label.toLowerCase().includes(keyword) ||
        team.value.toLowerCase().includes(normalizedKeyword)
      );
    });
  }, [localValue.search, teamOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localValue.search.trim()) count += 1;
    if (localValue.department !== "all") count += 1;
    if (localValue.role !== "all") count += 1;
    if (localValue.memberStatus !== "all") count += 1;
    if (localValue.selectedTeams.length > 0) count += 1;

    return count;
  }, [localValue]);

  const updateValue = (next: TeamFilterValue) => {
    setLocalValue(next);
    onChange?.(next);
  };

  const handleReset = () => {
    updateValue(DEFAULT_VALUE);
    onReset?.();
  };

  const handleApply = () => {
    if (disabled) return;
    onApply?.(localValue);
  };

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        padding: 20,
        boxSizing: "border-box",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 34,
            padding: "0 12px",
            borderRadius: 999,
            background: activeFilterCount > 0 ? "#111827" : "#f3f4f6",
            color: activeFilterCount > 0 ? "#ffffff" : "#6b7280",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {activeFilterCount} active
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(220px, 1.4fr) repeat(3, minmax(170px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <FilterLabel>Search Team</FilterLabel>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              🔍
            </span>

            <input
              type="text"
              value={localValue.search}
              onChange={(e) =>
                updateValue({
                  ...localValue,
                  search: e.target.value,
                })
              }
              placeholder="Search by team or member group"
              disabled={disabled}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                padding: "0 12px 0 38px",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div>
          <FilterLabel>Department</FilterLabel>
          <SelectField
            value={localValue.department}
            options={departmentOptions}
            onChange={(nextDepartment) =>
              updateValue({
                ...localValue,
                department: nextDepartment,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Role</FilterLabel>
          <SelectField
            value={localValue.role}
            options={roleOptions}
            onChange={(nextRole) =>
              updateValue({
                ...localValue,
                role: nextRole,
              })
            }
            disabled={disabled}
          />
        </div>

        <div>
          <FilterLabel>Member Status</FilterLabel>
          <SelectField
            value={localValue.memberStatus}
            options={memberStatusOptions}
            onChange={(nextMemberStatus) =>
              updateValue({
                ...localValue,
                memberStatus: nextMemberStatus,
              })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6b7280",
            marginBottom: 8,
          }}
        >
          Featured Teams
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {featuredTeams.map((team) => {
            const active = localValue.selectedTeams.includes(team.value);

            return (
              <button
                key={team.value}
                type="button"
                onClick={() =>
                  updateValue({
                    ...localValue,
                    selectedTeams: toggleArrayValue(
                      localValue.selectedTeams,
                      team.value
                    ),
                  })
                }
                disabled={disabled}
                style={{
                  border: active ? "1px solid #111827" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#ffffff",
                  color: active ? "#ffffff" : "#374151",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {team.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6b7280",
            marginBottom: 8,
          }}
        >
          Select Teams
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minHeight: 44,
          }}
        >
          {filteredTeamOptions.length > 0 ? (
            filteredTeamOptions.map((team) => {
              const active = localValue.selectedTeams.includes(team.value);

              return (
                <button
                  key={team.value}
                  type="button"
                  onClick={() =>
                    updateValue({
                      ...localValue,
                      selectedTeams: toggleArrayValue(
                        localValue.selectedTeams,
                        team.value
                      ),
                    })
                  }
                  disabled={disabled}
                  style={{
                    border: active ? "1px solid #111827" : "1px solid #d1d5db",
                    background: active ? "#111827" : "#ffffff",
                    color: active ? "#ffffff" : "#374151",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  {team.label}
                </button>
              );
            })
          ) : (
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                padding: "8px 0",
              }}
            >
              No matching teams found.
            </div>
          )}
        </div>
      </div>

      {localValue.selectedTeams.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Selected Teams
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {localValue.selectedTeams.map((teamValue) => {
              const team = teamOptions.find((item) => item.value === teamValue);

              return (
                <div
                  key={teamValue}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 34,
                    borderRadius: 999,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    padding: "0 12px",
                    color: "#374151",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span>{team?.label ?? teamValue}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateValue({
                        ...localValue,
                        selectedTeams: localValue.selectedTeams.filter(
                          (item) => item !== teamValue
                        ),
                      })
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#6b7280",
                      cursor: "pointer",
                      fontSize: 14,
                      lineHeight: 1,
                      padding: 0,
                    }}
                    aria-label={`Remove ${team?.label ?? teamValue}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <MetricCard
          label="Selected Department"
          value={
            departmentOptions.find(
              (item) => item.value === localValue.department
            )?.label ?? "All Departments"
          }
          accent="#2563eb"
          background="#eff6ff"
          border="#dbeafe"
        />

        <MetricCard
          label="Selected Role"
          value={
            roleOptions.find((item) => item.value === localValue.role)?.label ??
            "All Roles"
          }
          accent="#16a34a"
          background="#f0fdf4"
          border="#dcfce7"
        />

        <MetricCard
          label="Team Count"
          value={`${localValue.selectedTeams.length}`}
          accent="#9333ea"
          background="#faf5ff"
          border="#e9d5ff"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#374151",
            padding: "0 16px",
            fontSize: 14,
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={disabled}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #111827",
            background: "#111827",
            color: "#ffffff",
            padding: "0 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Apply Team Filter
        </button>
      </div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  accent: string;
  background: string;
  border: string;
};

function MetricCard({
  label,
  value,
  accent,
  background,
  border,
}: MetricCardProps) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 14,
        background,
        border: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: accent,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: accent,
          lineHeight: 1.25,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}