import React, { useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type ContactsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type ContactStatus = "Active" | "Follow-up" | "VIP" | "Inactive";
type FilterType = "All" | ContactStatus;

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  company: string;
  status: ContactStatus;
};

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Arun Kumar",
    phone: "9876543210",
    email: "arun@example.com",
    city: "Chennai",
    company: "AK Traders",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya",
    phone: "9123456780",
    email: "priya@example.com",
    city: "Bangalore",
    company: "Priya Ventures",
    status: "Follow-up",
  },
  {
    id: 3,
    name: "Rahul",
    phone: "9000012345",
    email: "rahul@example.com",
    city: "Coimbatore",
    company: "Rahul Infra",
    status: "VIP",
  },
  {
    id: 4,
    name: "Meena",
    phone: "9090909090",
    email: "meena@example.com",
    city: "Madurai",
    company: "Meena Corp",
    status: "Inactive",
  },
];

function getStatusColor(status: ContactStatus, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (status) {
    case "Active":
      return colors.success;
    case "Follow-up":
      return colors.warning;
    case "VIP":
      return colors.premium;
    case "Inactive":
      return colors.danger;
    default:
      return colors.subText;
  }
}

export default function ContactsPage({
  mode,
  onToggleTheme,
}: ContactsPageProps) {
  const colors = getTheme(mode);

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    company: "",
    status: "Active" as ContactStatus,
  });

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesFilter =
        activeFilter === "All" ? true : contact.status === activeFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        contact.name.toLowerCase().includes(q) ||
        contact.phone.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.city.toLowerCase().includes(q) ||
        contact.company.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [contacts, activeFilter, searchTerm]);

  const totalContacts = contacts.length;
  const activeContacts = contacts.filter((c) => c.status === "Active").length;
  const vipContacts = contacts.filter((c) => c.status === "VIP").length;
  const inactiveContacts = contacts.filter((c) => c.status === "Inactive").length;

  const handleAddContact = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.city.trim()
    ) {
      alert("Name, phone, email, city fill பண்ணணும்.");
      return;
    }

    const newContact: Contact = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      company: formData.company.trim() || "Independent",
      status: formData.status,
    };

    setContacts((prev) => [newContact, ...prev]);
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      company: "",
      status: "Active",
    });
    setIsModalOpen(false);
    setActiveFilter("All");
    setSearchTerm("");
  };

  return (
    <AppLayout title="Contacts" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, color: colors.text }}>
            Contact Management
          </h2>
          <p style={{ margin: "8px 0 0", color: colors.subText }}>
            Manage clients, partners, and business relationships in one place.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard label="Total Contacts" value={totalContacts} colors={colors} />
          <StatCard label="Active Contacts" value={activeContacts} colors={colors} />
          <StatCard label="VIP Contacts" value={vipContacts} colors={colors} />
          <StatCard label="Inactive" value={inactiveContacts} colors={colors} />
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            padding: 20,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, phone, email, company..."
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                border: "none",
                background: colors.primary,
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: colors.shadowSoft,
              }}
            >
              + Add Contact
            </button>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {(["All", "Active", "Follow-up", "VIP", "Inactive"] as FilterType[]).map(
              (item) => {
                const active = activeFilter === item;

                return (
                  <button
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    style={{
                      border: `1px solid ${
                        active ? colors.primary : colors.border
                      }`,
                      background: active ? colors.primary : colors.cardBgSoft,
                      color: active ? "#ffffff" : colors.text,
                      padding: "10px 14px",
                      borderRadius: 999,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                );
              }
            )}

            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              style={{
                border: `1px solid ${colors.border}`,
                background: "transparent",
                color: colors.subText,
                padding: "10px 14px",
                borderRadius: 999,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              padding: 20,
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>
                Contacts Table
              </div>
              <div style={{ fontSize: 14, color: colors.subText, marginTop: 4 }}>
                Showing {filteredContacts.length} contact(s)
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 960,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: colors.tableHeadBg,
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle(colors.subText)}>ID</th>
                  <th style={thStyle(colors.subText)}>Name</th>
                  <th style={thStyle(colors.subText)}>Phone</th>
                  <th style={thStyle(colors.subText)}>Email</th>
                  <th style={thStyle(colors.subText)}>City</th>
                  <th style={thStyle(colors.subText)}>Company</th>
                  <th style={thStyle(colors.subText)}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      style={{
                        borderTop: `1px solid ${colors.border}`,
                        background: colors.rowBg,
                      }}
                    >
                      <td style={tdStyle(colors.text)}>{contact.id}</td>
                      <td style={tdStyle(colors.text)}>{contact.name}</td>
                      <td style={tdStyle(colors.text)}>{contact.phone}</td>
                      <td style={tdStyle(colors.text)}>{contact.email}</td>
                      <td style={tdStyle(colors.text)}>{contact.city}</td>
                      <td style={tdStyle(colors.text)}>{contact.company}</td>
                      <td style={tdStyle(colors.text)}>
                        <span
                          style={{
                            display: "inline-block",
                            background: getStatusColor(contact.status, mode),
                            color: "#ffffff",
                            padding: "6px 12px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: 24,
                        color: colors.subText,
                        textAlign: "center",
                        background: colors.rowBg,
                      }}
                    >
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            padding: 16,
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 700,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ margin: 0, color: colors.text, fontSize: 26 }}>
                Add New Contact
              </h3>
              <p style={{ margin: "8px 0 0", color: colors.subText }}>
                Fill the details and create a new contact.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <InputField
                label="Name"
                value={formData.name}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
                colors={colors}
              />

              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
                colors={colors}
              />

              <InputField
                label="Email"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
                colors={colors}
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, city: value }))
                }
                colors={colors}
              />

              <InputField
                label="Company"
                value={formData.company}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, company: value }))
                }
                colors={colors}
              />

              <div style={{ display: "grid", gap: 8 }}>
                <label
                  style={{
                    color: colors.subText,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as ContactStatus,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.inputBg,
                    color: colors.text,
                    outline: "none",
                    fontSize: 14,
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: `1px solid ${colors.border}`,
                  background: "transparent",
                  color: colors.text,
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleAddContact}
                style={{
                  border: "none",
                  background: colors.primary,
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function StatCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div style={{ fontSize: 14, color: colors.subText }}>{label}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 32,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          color: colors.subText,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: colors.inputBg,
          color: colors.text,
          outline: "none",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function thStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 13,
    color,
    fontWeight: 700,
  };
}

function tdStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 15,
    color,
  };
}