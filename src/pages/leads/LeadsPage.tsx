import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LeadStatus = "New" | "Contacted" | "Qualified" | "Negotiation" | "Closed";
type LeadPriority = "Low" | "Medium" | "High";
type SourceType =
  | "WhatsApp"
  | "Facebook"
  | "Website"
  | "Referral"
  | "Walk-in"
  | "Manual";

type FilterType = "All" | LeadStatus;

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: SourceType;
  city: string;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string;
  followUpDate: string;
  budget: string;
  lastContact: string;
};

const initialLeads: Lead[] = [
  {
    id: 1001,
    name: "Arun Kumar",
    phone: "9876543210",
    source: "WhatsApp",
    city: "Chennai",
    status: "New",
    priority: "High",
    owner: "Madhan",
    followUpDate: "2026-04-05",
    budget: "₹25L",
    lastContact: "Today",
  },
  {
    id: 1002,
    name: "Priya",
    phone: "9123456780",
    source: "Facebook",
    city: "Bangalore",
    status: "Contacted",
    priority: "Medium",
    owner: "Madhan",
    followUpDate: "2026-04-06",
    budget: "₹40L",
    lastContact: "Yesterday",
  },
  {
    id: 1003,
    name: "Rahul",
    phone: "9000012345",
    source: "Website",
    city: "Coimbatore",
    status: "Qualified",
    priority: "High",
    owner: "Arun",
    followUpDate: "2026-04-07",
    budget: "₹55L",
    lastContact: "2 days ago",
  },
  {
    id: 1004,
    name: "Meena",
    phone: "9090909090",
    source: "Referral",
    city: "Madurai",
    status: "Negotiation",
    priority: "Medium",
    owner: "Priya",
    followUpDate: "2026-04-04",
    budget: "₹70L",
    lastContact: "Today",
  },
  {
    id: 1005,
    name: "Suresh",
    phone: "9345678901",
    source: "Walk-in",
    city: "Trichy",
    status: "Closed",
    priority: "Low",
    owner: "Madhan",
    followUpDate: "2026-04-02",
    budget: "₹32L",
    lastContact: "3 days ago",
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
    case "Negotiation":
      return colors.primary;
    case "Closed":
      return colors.success;
    default:
      return colors.subText;
  }
}

function getPriorityColor(priority: LeadPriority, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (priority) {
    case "High":
      return colors.danger;
    case "Medium":
      return colors.warning;
    case "Low":
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
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "Manual" as SourceType,
    city: "",
    status: "New" as LeadStatus,
    priority: "Medium" as LeadPriority,
    owner: "",
    followUpDate: "",
    budget: "",
  });

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(leads.map((lead) => lead.city))).sort();
    return ["All", ...cities];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesFilter =
        activeFilter === "All" ? true : lead.status === activeFilter;

      const matchesCity =
        cityFilter === "All" ? true : lead.city === cityFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q);

      return matchesFilter && matchesCity && matchesSearch;
    });
  }, [leads, activeFilter, cityFilter, searchTerm]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
  const negotiationLeads = leads.filter((l) => l.status === "Negotiation").length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;

  const handleAddLead = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.owner.trim()
    ) {
      alert("Name, phone, city, owner fill பண்ணணும்.");
      return;
    }

    const newLead: Lead = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      source: formData.source,
      city: formData.city.trim(),
      status: formData.status,
      priority: formData.priority,
      owner: formData.owner.trim(),
      followUpDate: formData.followUpDate || "-",
      budget: formData.budget.trim() || "-",
      lastContact: "Just now",
    };

    setLeads((prev) => [newLead, ...prev]);
    setFormData({
      name: "",
      phone: "",
      source: "Manual",
      city: "",
      status: "New",
      priority: "Medium",
      owner: "",
      followUpDate: "",
      budget: "",
    });
    setIsModalOpen(false);
    setActiveFilter("All");
    setCityFilter("All");
    setSearchTerm("");
  };

  const openLeadDetail = (leadId: number) => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <AppLayout title="Leads" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: colors.cardBgSoft,
                color: colors.subText,
                border: `1px solid ${colors.border}`,
                marginBottom: 14,
              }}
            >
              MEI CRM Leads
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 30,
                color: colors.text,
                fontWeight: 800,
              }}
            >
              Lead Management
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: colors.subText,
                lineHeight: 1.6,
              }}
            >
              Manage, filter, and convert your lead pipeline efficiently.
            </p>
          </div>

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
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "Total Leads", value: totalLeads, note: "All active records" },
            { label: "New Leads", value: newLeads, note: "Fresh opportunities" },
            { label: "Qualified", value: qualifiedLeads, note: "Sales-ready leads" },
            { label: "Negotiation", value: negotiationLeads, note: "Hot deals in progress" },
            { label: "Closed", value: closedLeads, note: "Successfully converted" },
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
                  fontWeight: 600,
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

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: colors.mutedText,
                  fontWeight: 600,
                }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </section>

        <section
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
              gridTemplateColumns: "minmax(220px, 1fr) 180px 180px",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, phone, city, owner..."
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

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as FilterType)}
              style={selectStyle(colors)}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={selectStyle(colors)}
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city === "All" ? "All Cities" : city}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {(
              ["All", "New", "Contacted", "Qualified", "Negotiation", "Closed"] as FilterType[]
            ).map((item) => {
              const active = activeFilter === item;

              return (
                <button
                  key={item}
                  onClick={() => setActiveFilter(item)}
                  style={{
                    border: `1px solid ${active ? colors.primary : colors.border}`,
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
            })}

            <button
              onClick={() => {
                setActiveFilter("All");
                setCityFilter("All");
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
              Clear Filters
            </button>
          </div>
        </section>

        <section
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
                minWidth: 1200,
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
                  <th style={thStyle(colors.subText)}>Owner</th>
                  <th style={thStyle(colors.subText)}>Priority</th>
                  <th style={thStyle(colors.subText)}>Status</th>
                  <th style={thStyle(colors.subText)}>Follow-up</th>
                  <th style={thStyle(colors.subText)}>Budget</th>
                  <th style={thStyle(colors.subText)}>Last Contact</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const isHovered = hoveredRowId === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => openLeadDetail(lead.id)}
                        onMouseEnter={() => setHoveredRowId(lead.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          borderTop: `1px solid ${colors.border}`,
                          background: isHovered ? colors.rowHover : colors.rowBg,
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                        title={`Open ${lead.name} details`}
                      >
                        <td style={tdStyle(colors.text)}>{lead.id}</td>

                        <td style={tdStyle(colors.text)}>
                          <div style={{ fontWeight: 700 }}>{lead.name}</div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: isHovered ? colors.primary : colors.subText,
                              fontWeight: 700,
                            }}
                          >
                            View Details →
                          </div>
                        </td>

                        <td style={tdStyle(colors.text)}>{lead.phone}</td>
                        <td style={tdStyle(colors.text)}>{lead.source}</td>
                        <td style={tdStyle(colors.text)}>{lead.city}</td>
                        <td style={tdStyle(colors.text)}>{lead.owner}</td>

                        <td style={tdStyle(colors.text)}>
                          <span
                            style={{
                              display: "inline-block",
                              background: getPriorityColor(lead.priority, mode),
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {lead.priority}
                          </span>
                        </td>

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

                        <td style={tdStyle(colors.text)}>{lead.followUpDate}</td>
                        <td style={tdStyle(colors.text)}>{lead.budget}</td>
                        <td style={tdStyle(colors.text)}>{lead.lastContact}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      style={{
                        padding: 28,
                        color: colors.subText,
                        textAlign: "center",
                        background: colors.rowBg,
                        fontWeight: 600,
                      }}
                    >
                      No leads found. Try changing filters or add a new lead.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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
              maxWidth: 760,
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

              <SelectField
                label="Source"
                value={formData.source}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, source: value as SourceType }))
                }
                options={[
                  "Manual",
                  "WhatsApp",
                  "Facebook",
                  "Website",
                  "Referral",
                  "Walk-in",
                ]}
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
                label="Owner"
                value={formData.owner}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, owner: value }))
                }
                colors={colors}
              />

              <InputField
                label="Budget"
                value={formData.budget}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, budget: value }))
                }
                colors={colors}
              />

              <SelectField
                label="Status"
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as LeadStatus }))
                }
                options={["New", "Contacted", "Qualified", "Negotiation", "Closed"]}
                colors={colors}
              />

              <SelectField
                label="Priority"
                value={formData.priority}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value as LeadPriority,
                  }))
                }
                options={["Low", "Medium", "High"]}
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
                  Follow-up Date
                </label>

                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      followUpDate: e.target.value,
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
                    boxSizing: "border-box",
                  }}
                />
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

function SelectField({
  label,
  value,
  onChange,
  options,
  colors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
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

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle(colors)}
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

function selectStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: colors.inputBg,
    color: colors.text,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}

function thStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 13,
    color,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };
}

function tdStyle(color: string): React.CSSProperties {
  return {
    padding: 14,
    fontSize: 15,
    color,
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };
}