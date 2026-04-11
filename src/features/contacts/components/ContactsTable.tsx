type ThemeMode = "light" | "dark";

export type ContactTableItem = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: "active" | "inactive" | "blocked" | "archived" | string;
  ownerName?: string;
  updatedAt?: string;
};

type SortKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "source"
  | "status"
  | "ownerName"
  | "updatedAt";

type SortOrder = "asc" | "desc";

type ContactsTableProps = {
  mode?: ThemeMode;
  contacts?: ContactTableItem[];
  loading?: boolean;
  selectedIds?: Array<string | number>;
  sortBy?: SortKey;
  sortOrder?: SortOrder;
  onSort?: (key: SortKey) => void;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onRowClick?: (contact: ContactTableItem) => void;
  onEdit?: (contact: ContactTableItem) => void;
  onDelete?: (contact: ContactTableItem) => void;
};

function getStatusTheme(status: string | undefined, mode: ThemeMode) {
  const value = (status ?? "").toLowerCase();

  if (value === "active") {
    return {
      bg: mode === "dark" ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.10)",
      text: mode === "dark" ? "#86efac" : "#15803d",
      border:
        mode === "dark" ? "rgba(34,197,94,0.28)" : "rgba(34,197,94,0.18)",
    };
  }

  if (value === "inactive") {
    return {
      bg: mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
      text: mode === "dark" ? "#cbd5e1" : "#475569",
      border:
        mode === "dark"
          ? "rgba(148,163,184,0.28)"
          : "rgba(148,163,184,0.18)",
    };
  }

  if (value === "blocked") {
    return {
      bg: mode === "dark" ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.10)",
      text: mode === "dark" ? "#fca5a5" : "#b91c1c",
      border:
        mode === "dark" ? "rgba(239,68,68,0.28)" : "rgba(239,68,68,0.18)",
    };
  }

  if (value === "archived") {
    return {
      bg: mode === "dark" ? "rgba(168,85,247,0.16)" : "rgba(168,85,247,0.10)",
      text: mode === "dark" ? "#d8b4fe" : "#7e22ce",
      border:
        mode === "dark" ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.18)",
    };
  }

  return {
    bg: mode === "dark" ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.10)",
    text: mode === "dark" ? "#cbd5e1" : "#475569",
    border:
      mode === "dark"
        ? "rgba(148,163,184,0.28)"
        : "rgba(148,163,184,0.18)",
  };
}

function SortIndicator({
  active,
  order,
  color,
}: {
  active: boolean;
  order?: SortOrder;
  color: string;
}) {
  return (
    <span
      style={{
        marginLeft: 6,
        fontSize: 11,
        color,
        opacity: active ? 1 : 0.5,
      }}
    >
      {active ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );
}

export default function ContactsTable({
  mode = "light",
  contacts = [],
  loading = false,
  selectedIds = [],
  sortBy,
  sortOrder = "asc",
  onSort,
  onSelectRow,
  onSelectAll,
  onRowClick,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    pageBg: isDark ? "#020617" : "#f8fafc",
    tableHeadBg: isDark ? "#0b1220" : "#f8fafc",
    rowHover: isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.03)",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    mutedText: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    primary: "#2563eb",
    shadow: isDark
      ? "0 20px 40px rgba(0,0,0,0.28)"
      : "0 16px 32px rgba(15,23,42,0.08)",
  };

  const allSelected =
    contacts.length > 0 &&
    contacts.every((contact) => selectedIds.includes(contact.id));

  return (
    <section
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        boxShadow: theme.shadow,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: theme.text,
            }}
          >
            Contacts Table
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: theme.subText,
              lineHeight: 1.6,
            }}
          >
            Organised view of all contacts, ownership, sources, and status.
          </p>
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: theme.subText,
          }}
        >
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : `${contacts.length} total`}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 1100,
          }}
        >
          <thead>
            <tr
              style={{
                background: theme.tableHeadBg,
              }}
            >
              <HeaderCell theme={theme} width={52}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onSelectAll?.(event.target.checked)}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: theme.primary,
                    cursor: "pointer",
                  }}
                />
              </HeaderCell>

              <SortableHeaderCell
                label="Name"
                sortKey="name"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Email"
                sortKey="email"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Phone"
                sortKey="phone"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Company"
                sortKey="company"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Source"
                sortKey="source"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Status"
                sortKey="status"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Owner"
                sortKey="ownerName"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <SortableHeaderCell
                label="Updated"
                sortKey="updatedAt"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                theme={theme}
              />
              <HeaderCell theme={theme} align="right" width={150}>
                Actions
              </HeaderCell>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <BodyCell theme={theme}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: theme.borderStrong,
                        }}
                      />
                    </BodyCell>
                    {Array.from({ length: 8 }).map((__, innerIndex) => (
                      <BodyCell key={innerIndex} theme={theme}>
                        <div
                          style={{
                            width: innerIndex % 2 === 0 ? "80%" : "60%",
                            height: 12,
                            borderRadius: 999,
                            background: theme.border,
                          }}
                        />
                      </BodyCell>
                    ))}
                    <BodyCell theme={theme} align="right">
                      <div
                        style={{
                          width: 90,
                          height: 34,
                          marginLeft: "auto",
                          borderRadius: 10,
                          background: theme.border,
                        }}
                      />
                    </BodyCell>
                  </tr>
                ))
              : contacts.length === 0
                ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: 40,
                        textAlign: "center",
                        background: theme.cardBg,
                        color: theme.subText,
                        fontSize: 14,
                        lineHeight: 1.8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: theme.text,
                          marginBottom: 8,
                        }}
                      >
                        No contacts found
                      </div>
                      <div>
                        Once contacts are added, they will appear here with full
                        ownership and status visibility.
                      </div>
                    </td>
                  </tr>
                )
                : contacts.map((contact) => {
                    const selected = selectedIds.includes(contact.id);
                    const statusTheme = getStatusTheme(contact.status, mode);

                    return (
                      <tr
                        key={String(contact.id)}
                        style={{
                          background: selected ? theme.cardSoft : theme.cardBg,
                        }}
                      >
                        <BodyCell theme={theme}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(event) =>
                              onSelectRow?.(contact.id, event.target.checked)
                            }
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: theme.primary,
                              cursor: "pointer",
                            }}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: theme.text,
                              marginBottom: 4,
                            }}
                          >
                            {contact.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.mutedText,
                            }}
                          >
                            ID: {contact.id}
                          </div>
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.email || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.phone || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.company || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.source || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 30,
                              padding: "0 10px",
                              borderRadius: 999,
                              border: `1px solid ${statusTheme.border}`,
                              background: statusTheme.bg,
                              color: statusTheme.text,
                              fontSize: 12,
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                          >
                            {contact.status || "unknown"}
                          </span>
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.ownerName || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell
                          theme={theme}
                          clickable={!!onRowClick}
                          onClick={() => onRowClick?.(contact)}
                        >
                          <CellText
                            primary={contact.updatedAt || "—"}
                            theme={theme}
                          />
                        </BodyCell>

                        <BodyCell theme={theme} align="right">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            {onEdit ? (
                              <button
                                type="button"
                                onClick={() => onEdit(contact)}
                                style={{
                                  height: 34,
                                  padding: "0 12px",
                                  borderRadius: 10,
                                  border: `1px solid ${theme.borderStrong}`,
                                  background: theme.cardSoft,
                                  color: theme.text,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Edit
                              </button>
                            ) : null}

                            {onDelete ? (
                              <button
                                type="button"
                                onClick={() => onDelete(contact)}
                                style={{
                                  height: 34,
                                  padding: "0 12px",
                                  borderRadius: 10,
                                  border: "none",
                                  background: isDark
                                    ? "rgba(239,68,68,0.16)"
                                    : "rgba(239,68,68,0.10)",
                                  color: isDark ? "#fca5a5" : "#b91c1c",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </BodyCell>
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({
  children,
  theme,
  width,
  align = "left",
}: {
  children: React.ReactNode;
  theme: {
    text: string;
    border: string;
  };
  width?: number;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        padding: "14px 14px",
        fontSize: 12,
        fontWeight: 800,
        color: theme.text,
        textAlign: align,
        borderBottom: `1px solid ${theme.border}`,
        whiteSpace: "nowrap",
        width,
      }}
    >
      {children}
    </th>
  );
}

function SortableHeaderCell({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  theme,
}: {
  label: string;
  sortKey: SortKey;
  currentSortBy?: SortKey;
  currentSortOrder?: SortOrder;
  onSort?: (key: SortKey) => void;
  theme: {
    text: string;
    subText: string;
    border: string;
  };
}) {
  const active = currentSortBy === sortKey;

  return (
    <th
      onClick={() => onSort?.(sortKey)}
      style={{
        padding: "14px 14px",
        fontSize: 12,
        fontWeight: 800,
        color: theme.text,
        textAlign: "left",
        borderBottom: `1px solid ${theme.border}`,
        whiteSpace: "nowrap",
        cursor: onSort ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {label}
        <SortIndicator
          active={active}
          order={currentSortOrder}
          color={active ? theme.text : theme.subText}
        />
      </span>
    </th>
  );
}

function BodyCell({
  children,
  theme,
  align = "left",
  clickable = false,
  onClick,
}: {
  children: React.ReactNode;
  theme: {
    border: string;
    rowHover: string;
  };
  align?: "left" | "center" | "right";
  clickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <td
      onClick={onClick}
      style={{
        padding: "14px 14px",
        borderBottom: `1px solid ${theme.border}`,
        textAlign: align,
        verticalAlign: "middle",
        cursor: clickable ? "pointer" : "default",
      }}
      onMouseEnter={(event) => {
        if (!clickable) return;
        event.currentTarget.style.background = theme.rowHover;
      }}
      onMouseLeave={(event) => {
        if (!clickable) return;
        event.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </td>
  );
}

function CellText({
  primary,
  theme,
}: {
  primary: string;
  theme: {
    text: string;
    subText: string;
  };
}) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: primary === "—" ? theme.subText : theme.text,
        lineHeight: 1.6,
        wordBreak: "break-word",
      }}
    >
      {primary}
    </div>
  );
}