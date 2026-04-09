import { useEffect, useMemo, useState } from "react";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "assign"
  | "approve";

export type PermissionModule =
  | "dashboard"
  | "leads"
  | "contacts"
  | "deals"
  | "tasks"
  | "users"
  | "reports"
  | "settings";

export type PermissionMatrixValue = Record<
  PermissionModule,
  Partial<Record<PermissionAction, boolean>>
>;

type PermissionMatrixProps = {
  value?: PermissionMatrixValue;
  onChange?: (value: PermissionMatrixValue) => void;
  selectedRole?: string;
  readOnly?: boolean;
};

type ModuleConfig = {
  key: PermissionModule;
  label: string;
  description: string;
  actions: PermissionAction[];
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  export: "Export",
  assign: "Assign",
  approve: "Approve",
};

const MODULES: ModuleConfig[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Business overview, KPI insights, widgets, and snapshot data.",
    actions: ["view", "export"],
  },
  {
    key: "leads",
    label: "Leads",
    description: "Lead capture, follow-ups, ownership, notes, and conversion flow.",
    actions: ["view", "create", "edit", "delete", "export", "assign"],
  },
  {
    key: "contacts",
    label: "Contacts",
    description: "Customer records, relationship mapping, and profile management.",
    actions: ["view", "create", "edit", "delete", "export"],
  },
  {
    key: "deals",
    label: "Deals",
    description: "Pipeline stages, negotiation tracking, and closure workflows.",
    actions: ["view", "create", "edit", "delete", "export", "approve"],
  },
  {
    key: "tasks",
    label: "Tasks",
    description: "Daily actions, reminders, internal accountability, and deadlines.",
    actions: ["view", "create", "edit", "delete", "assign"],
  },
  {
    key: "users",
    label: "Users",
    description: "Team members, access control, invite flow, and role management.",
    actions: ["view", "create", "edit", "delete", "assign"],
  },
  {
    key: "reports",
    label: "Reports",
    description: "Analytics, exports, trend reports, and performance review.",
    actions: ["view", "export", "approve"],
  },
  {
    key: "settings",
    label: "Settings",
    description: "System configuration, preferences, billing, and admin controls.",
    actions: ["view", "edit", "approve"],
  },
];

const ROLE_PRESETS: Record<string, PermissionMatrixValue> = {
  Admin: {
    dashboard: { view: true, export: true },
    leads: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      assign: true,
    },
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
      approve: true,
    },
    tasks: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      assign: true,
    },
    users: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      assign: true,
    },
    reports: { view: true, export: true, approve: true },
    settings: { view: true, edit: true, approve: true },
  },
  Manager: {
    dashboard: { view: true, export: true },
    leads: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      assign: true,
    },
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      approve: true,
    },
    tasks: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      assign: true,
    },
    users: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      assign: true,
    },
    reports: { view: true, export: true, approve: true },
    settings: { view: true, edit: false, approve: false },
  },
  Sales: {
    dashboard: { view: true, export: false },
    leads: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: true,
      assign: false,
    },
    contacts: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: false,
    },
    deals: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: false,
      approve: false,
    },
    tasks: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      assign: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    reports: { view: true, export: false, approve: false },
    settings: { view: false, edit: false, approve: false },
  },
  Support: {
    dashboard: { view: true, export: false },
    leads: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      export: false,
      assign: false,
    },
    contacts: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      export: false,
    },
    deals: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    tasks: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      assign: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    reports: { view: false, export: false, approve: false },
    settings: { view: false, edit: false, approve: false },
  },
  Viewer: {
    dashboard: { view: true, export: false },
    leads: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      assign: false,
    },
    contacts: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
    },
    deals: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    tasks: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    reports: { view: true, export: false, approve: false },
    settings: { view: false, edit: false, approve: false },
  },
};

function buildDefaultMatrix(): PermissionMatrixValue {
  return {
    dashboard: { view: false, export: false },
    leads: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      assign: false,
    },
    contacts: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
    },
    deals: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    tasks: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      assign: false,
    },
    reports: {
      view: false,
      export: false,
      approve: false,
    },
    settings: {
      view: false,
      edit: false,
      approve: false,
    },
  };
}

function normalizeMatrix(value?: PermissionMatrixValue): PermissionMatrixValue {
  const base = buildDefaultMatrix();

  if (!value) return base;

  const merged: PermissionMatrixValue = { ...base };

  for (const module of MODULES) {
    merged[module.key] = {
      ...base[module.key],
      ...(value[module.key] || {}),
    };
  }

  return merged;
}

export default function PermissionMatrix({
  value,
  onChange,
  selectedRole,
  readOnly = false,
}: PermissionMatrixProps) {
  const [matrix, setMatrix] = useState<PermissionMatrixValue>(
    normalizeMatrix(value)
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (value) {
      setMatrix(normalizeMatrix(value));
    }
  }, [value]);

  useEffect(() => {
    if (!value && selectedRole && ROLE_PRESETS[selectedRole]) {
      const preset = normalizeMatrix(ROLE_PRESETS[selectedRole]);
      setMatrix(preset);
      onChange?.(preset);
    }
  }, [selectedRole, value, onChange]);

  const visibleModules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return MODULES;

    return MODULES.filter((module) => {
      const haystack = `${module.label} ${module.description}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [search]);

  const totalAllowed = useMemo(() => {
    let count = 0;

    for (const module of MODULES) {
      for (const action of module.actions) {
        if (matrix[module.key]?.[action]) count += 1;
      }
    }

    return count;
  }, [matrix]);

  const totalAvailable = useMemo(() => {
    return MODULES.reduce((sum, module) => sum + module.actions.length, 0);
  }, []);

  const updateMatrix = (next: PermissionMatrixValue) => {
    setMatrix(next);
    onChange?.(next);
  };

  const togglePermission = (
    moduleKey: PermissionModule,
    action: PermissionAction
  ) => {
    if (readOnly) return;

    const next: PermissionMatrixValue = {
      ...matrix,
      [moduleKey]: {
        ...matrix[moduleKey],
        [action]: !matrix[moduleKey]?.[action],
      },
    };

    if (action !== "view" && next[moduleKey][action]) {
      next[moduleKey].view = true;
    }

    if (action === "view" && !next[moduleKey].view) {
      for (const module of MODULES) {
        if (module.key === moduleKey) {
          for (const itemAction of module.actions) {
            if (itemAction !== "view") {
              next[moduleKey][itemAction] = false;
            }
          }
        }
      }
    }

    updateMatrix(next);
  };

  const setModuleAll = (moduleKey: PermissionModule, checked: boolean) => {
    if (readOnly) return;

    const moduleConfig = MODULES.find((item) => item.key === moduleKey);
    if (!moduleConfig) return;

    const nextModuleState: Partial<Record<PermissionAction, boolean>> = {};

    for (const action of moduleConfig.actions) {
      nextModuleState[action] = checked;
    }

    const next: PermissionMatrixValue = {
      ...matrix,
      [moduleKey]: nextModuleState,
    };

    updateMatrix(next);
  };

  const setAllPermissions = (checked: boolean) => {
    if (readOnly) return;

    const next = buildDefaultMatrix();

    for (const module of MODULES) {
      for (const action of module.actions) {
        next[module.key][action] = checked;
      }
    }

    updateMatrix(next);
  };

  const resetToRolePreset = () => {
    if (readOnly || !selectedRole || !ROLE_PRESETS[selectedRole]) return;
    const preset = normalizeMatrix(ROLE_PRESETS[selectedRole]);
    updateMatrix(preset);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.eyebrow}>Access Control</div>
            <h2 style={styles.title}>Permission Matrix</h2>
            <p style={styles.subtitle}>
              Control exactly what this team member can access, create, edit,
              assign, approve, or export across the CRM.
            </p>
          </div>

          <div style={styles.statsWrap}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Granted</div>
              <div style={styles.statValue}>{totalAllowed}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Available</div>
              <div style={styles.statValue}>{totalAvailable}</div>
            </div>
          </div>
        </div>

        <div style={styles.toolbar}>
          <input
            type="text"
            placeholder="Search module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.toolbarActions}>
            <button
              type="button"
              onClick={() => setAllPermissions(true)}
              style={styles.primaryGhostButton}
              disabled={readOnly}
            >
              Allow All
            </button>

            <button
              type="button"
              onClick={() => setAllPermissions(false)}
              style={styles.secondaryButton}
              disabled={readOnly}
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={resetToRolePreset}
              style={styles.primaryButton}
              disabled={readOnly || !selectedRole || !ROLE_PRESETS[selectedRole]}
            >
              Reset to Role Preset
            </button>
          </div>
        </div>
      </div>

      <div style={styles.matrixCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.moduleTh }}>Module</th>
                <th style={styles.th}>All</th>
                <th style={styles.th}>View</th>
                <th style={styles.th}>Create</th>
                <th style={styles.th}>Edit</th>
                <th style={styles.th}>Delete</th>
                <th style={styles.th}>Export</th>
                <th style={styles.th}>Assign</th>
                <th style={styles.th}>Approve</th>
              </tr>
            </thead>

            <tbody>
              {visibleModules.length === 0 ? (
                <tr>
                  <td colSpan={9} style={styles.emptyCell}>
                    No matching module found.
                  </td>
                </tr>
              ) : (
                visibleModules.map((module) => {
                  const allowedCount = module.actions.filter(
                    (action) => matrix[module.key]?.[action]
                  ).length;

                  const allChecked =
                    allowedCount > 0 && allowedCount === module.actions.length;

                  return (
                    <tr key={module.key} style={styles.tr}>
                      <td style={{ ...styles.td, ...styles.moduleTd }}>
                        <div style={styles.moduleName}>{module.label}</div>
                        <div style={styles.moduleDesc}>{module.description}</div>
                      </td>

                      <td style={styles.tdCenter}>
                        <ToggleBadge
                          checked={allChecked}
                          disabled={readOnly}
                          onClick={() =>
                            setModuleAll(module.key, !allChecked)
                          }
                          label="All"
                        />
                      </td>

                      {(
                        [
                          "view",
                          "create",
                          "edit",
                          "delete",
                          "export",
                          "assign",
                          "approve",
                        ] as PermissionAction[]
                      ).map((action) => {
                        const supported = module.actions.includes(action);

                        if (!supported) {
                          return (
                            <td key={action} style={styles.tdCenter}>
                              <span style={styles.naPill}>—</span>
                            </td>
                          );
                        }

                        return (
                          <td key={action} style={styles.tdCenter}>
                            <ToggleBadge
                              checked={!!matrix[module.key]?.[action]}
                              disabled={readOnly}
                              onClick={() =>
                                togglePermission(module.key, action)
                              }
                              label={ACTION_LABELS[action]}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.summaryCard}>
        <div style={styles.summaryTitle}>Permission Summary</div>

        <div style={styles.summaryGrid}>
          {MODULES.map((module) => {
            const enabledActions = module.actions.filter(
              (action) => matrix[module.key]?.[action]
            );

            return (
              <div key={module.key} style={styles.summaryModuleCard}>
                <div style={styles.summaryModuleTitle}>{module.label}</div>
                <div style={styles.summaryModuleText}>
                  {enabledActions.length > 0
                    ? enabledActions.map((action) => ACTION_LABELS[action]).join(", ")
                    : "No access granted"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleBadge({
  checked,
  onClick,
  disabled,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        ...styles.toggleBadge,
        ...(checked ? styles.toggleBadgeActive : {}),
        ...(disabled ? styles.toggleBadgeDisabled : {}),
      }}
    >
      <span
        style={{
          ...styles.toggleDot,
          ...(checked ? styles.toggleDotActive : {}),
        }}
      />
      <span>{checked ? "Yes" : "No"}</span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  headerCard: {
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: 720,
  },
  statsWrap: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  statCard: {
    minWidth: 110,
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: 700,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: "#0F172A",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: 320,
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
    boxSizing: "border-box",
  },
  toolbarActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    height: 44,
    borderRadius: 12,
    border: "none",
    padding: "0 16px",
    background: "#0F172A",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryGhostButton: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #0F172A",
    padding: "0 16px",
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 16px",
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  matrixCard: {
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    overflow: "hidden",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: 1100,
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "center",
    padding: "16px 12px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
  },
  moduleTh: {
    textAlign: "left",
    minWidth: 320,
  },
  tr: {
    background: "#FFFFFF",
  },
  td: {
    padding: "18px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "top",
  },
  tdCenter: {
    padding: "18px 12px",
    borderBottom: "1px solid #EEF2F7",
    textAlign: "center",
    verticalAlign: "middle",
  },
  moduleTd: {
    minWidth: 320,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 6,
  },
  moduleDesc: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "#64748B",
    maxWidth: 360,
  },
  toggleBadge: {
    height: 34,
    minWidth: 72,
    padding: "0 10px",
    borderRadius: 999,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 800,
    color: "#334155",
    cursor: "pointer",
  },
  toggleBadgeActive: {
    background: "#ECFDF5",
    border: "1px solid #10B981",
    color: "#065F46",
  },
  toggleBadgeDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  toggleDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#94A3B8",
  },
  toggleDotActive: {
    background: "#10B981",
  },
  naPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 34,
    height: 28,
    borderRadius: 999,
    background: "#F1F5F9",
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: 800,
  },
  emptyCell: {
    padding: 28,
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    fontWeight: 700,
  },
  summaryCard: {
    borderRadius: 24,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 16,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  summaryModuleCard: {
    border: "1px solid #E2E8F0",
    borderRadius: 18,
    padding: 16,
    background: "#F8FAFC",
  },
  summaryModuleTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 8,
  },
  summaryModuleText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#475569",
  },
};