import React, { useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";
type FilterType = "All" | LeadStatus;

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  city: string;
  status: LeadStatus;
};

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Arun Kumar",
    phone: "9876543210",
    source: "WhatsApp",
    city: "Chennai",
    status: "New",
  },
  {
    id: 2,
    name: "Priya",
    phone: "9123456780",
    source: "Facebook",
    city: "Bangalore",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Rahul",
    phone: "9000012345",
    source: "Website",
    city: "Coimbatore",
    status: "Qualified",
  },
  {
    id: 4,
    name: "Meena",
    phone: "9090909090",
    source: "Reference",
    city: "Madurai",
    status: "Closed",
  },
];

function getStatusColor(status: LeadStatus, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (status) {
    case "New":
      return colors.info;
    case "Contacted":
      return colors.warning;
    case "Qualified":
      return colors.premium;
    case "Closed":
      return colors.success;
    default:
      return colors.subText;
  }
}

export default function LeadsPage({
  mode,
  onToggleTheme,
}: LeadsPageProps) {
  const colors = getTheme(mode);

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "",
    city: "",
    status: "New" as LeadStatus,
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesFilter =
        activeFilter === "All" ? true : lead.status === activeFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [leads, activeFilter, searchTerm]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;

  const handleAddLead = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim()) {
      alert("Name, phone, city fill பண்ணணும்.");
      return;
    }

    const newLead: Lead = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      source: formData.source.trim() || "Manual",
      city: formData.city.trim(),
      status: formData.status,
    };

    setLeads((prev) => [newLead, ...prev]);
    setFormData({
      name: "",
      phone: "",
      source: "",
      city: "",
      status: "New",
    });
    setIsModalOpen(false);
    setActiveFilter("All");
    setSearchTerm("");
  };

  return (
    <AppLayout title="Leads" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              color: colors.text,
            }}
          >
            Lead Management
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              color: colors.subText,
            }}
          >
            Track every lead, follow-up, and conversion in one place.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "Total Leads", value: totalLeads },
            { label: "New Leads", value: newLeads },
            { label: "Qualified", value: qualifiedLeads },
            { label: "Closed", value: closedLeads },
          ].map((item) => (
            <div
              key={item.label}
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
                  fontSize: 14,
                  color: colors.subText,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 32,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
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
              placeholder="Search lead name, phone, city..."
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
              + Add Lead
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
            {(["All", "New", "Contacted", "Qualified", "Closed"] as FilterType[]).map(
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
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                Leads Table
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: colors.subText,
                  marginTop: 4,
                }}
              >
                Showing {filteredLeads.length} lead(s)
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 760,
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
                  <th style={thStyle(colors.subText)}>Source</th>
                  <th style={thStyle(colors.subText)}>City</th>
                  <th style={thStyle(colors.subText)}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      style={{
                        borderTop: `1px solid ${colors.border}`,
                        background: colors.rowBg,
                      }}
                    >
                      <td style={tdStyle(colors.text)}>{lead.id}</td>
                      <td style={tdStyle(colors.text)}>{lead.name}</td>
                      <td style={tdStyle(colors.text)}>{lead.phone}</td>
                      <td style={tdStyle(colors.text)}>{lead.source}</td>
                      <td style={tdStyle(colors.text)}>{lead.city}</td>
                      <td style={tdStyle(colors.text)}>
                        <span
                          style={{
                            display: "inline-block",
                            background: getStatusColor(lead.status, mode),
                            color: "#ffffff",
                            padding: "6px 12px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: 24,
                        color: colors.subText,
                        textAlign: "center",
                        background: colors.rowBg,
                      }}
                    >
                      No leads found.
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
              maxWidth: 560,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h3
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: 26,
                }}
              >
                Add New Lead
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                }}
              >
                Fill the details and create a new lead.
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
                label="Source"
                value={formData.source}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, source: value }))
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
                      status: e.target.value as LeadStatus,
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
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed</option>
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
                onClick={handleAddLead}
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
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
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