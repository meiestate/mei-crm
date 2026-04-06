import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Follow-up"
  | "Negotiation"
  | "Closed";

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
  updatedAt?: string;
  createdAt?: string;
};

const LEAD_STORAGE_KEYS = [
  "mei-crm-leads",
  "mei_crm_leads",
  "leads",
  "crm_leads",
];

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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
    case "Follow-up":
      return colors.warning;
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

function normalizeStatus(value: string | null): FilterType {
  if (!value) return "All";

  const normalized = value.trim().toLowerCase();

  if (normalized === "new") return "New";
  if (normalized === "contacted") return "Contacted";
  if (normalized === "qualified") return "Qualified";
  if (normalized === "follow-up" || normalized === "followup") return "Follow-up";
  if (normalized === "negotiation") return "Negotiation";
  if (normalized === "closed" || normalized === "won") return "Closed";

  return "All";
}

function safelyReadStoredLeads(): Lead[] {
  for (const key of LEAD_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const mapped = parsed
        .map((item: any, index: number) => mapUnknownLead(item, index))
        .filter(Boolean) as Lead[];

      if (mapped.length > 0) {
        return mapped;
      }
    } catch (error) {
      console.error(`Failed to parse localStorage key: ${key}`, error);
    }
  }

  return [];
}

function mapUnknownLead(item: any, index: number): Lead | null {
  if (!item || typeof item !== "object") return null;

  const rawStatus = String(item.status || "New");
  const normalizedStatus = normalizeStatus(rawStatus);

  const status: LeadStatus = normalizedStatus === "All" ? "New" : normalizedStatus;

  const priorityRaw = String(item.priority || "Medium").toLowerCase();
  const priority: LeadPriority =
    priorityRaw === "high"
      ? "High"
      : priorityRaw === "low"
      ? "Low"
      : "Medium";

  const sourceRaw = String(item.source || item.leadSource || "Manual");
  const allowedSources: SourceType[] = [
    "WhatsApp",
    "Facebook",
    "Website",
    "Referral",
    "Walk-in",
    "Manual",
  ];

  const source = allowedSources.includes(sourceRaw as SourceType)
    ? (sourceRaw as SourceType)
    : "Manual";

  return {
    id: Number(item.id ?? Date.now() + index),
    name: String(
      item.name ||
        item.fullName ||
        item.customerName ||
        item.company ||
        `Lead ${index + 1}`
    ),
    phone: String(item.phone || item.mobile || item.whatsapp || "-"),
    source,
    city: String(
      item.city ||
        item.preferredLocation ||
        item.location ||
        item.area ||
        item.subLocation ||
        "Unknown"
    ),
    status,
    priority,
    owner: String(item.owner || item.assignedTo || item.leadOwner || "Unassigned"),
    followUpDate: String(
      item.followUpDate || item.nextFollowUpDate || item.nextFollowUp || "-"
    ),
    budget:
      item.minBudget || item.maxBudget
        ? `₹${item.minBudget || "0"} - ₹${item.maxBudget || "0"}`
        : typeof item.budget === "number"
        ? `₹${item.budget.toLocaleString("en-IN")}`
        : String(item.budget || "-"),
    lastContact: String(item.lastContact || "Recent"),
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  };
}

function saveLeadsToStorage(leads: Lead[]) {
  try {
    localStorage.setItem("mei-crm-leads", JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to save leads to localStorage:", error);
  }
}

export default function LeadsPage({
  mode,
  onToggleTheme,
}: LeadsPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [leads, setLeads] = useState<Lead[]>(() => {
    const stored = safelyReadStoredLeads();
    return stored.length > 0 ? stored : initialLeads;
  });

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
  const [activeFilter, setActiveFilter] = useState<FilterType>(() =>
    normalizeStatus(searchParams.get("filter"))
  );
  const [cityFilter, setCityFilter] = useState(() => searchParams.get("city") || "All");
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  useEffect(() => {
    const syncLeads = () => {
      const stored = safelyReadStoredLeads();
      if (stored.length > 0) {
        setLeads(stored);
      }
    };

    window.addEventListener("storage", syncLeads);
    return () => window.removeEventListener("storage", syncLeads);
  }, []);

  useEffect(() => {
    saveLeadsToStorage(leads);
  }, [leads]);

  useEffect(() => {
    const queryFilter = normalizeStatus(searchParams.get("filter"));
    const querySearch = searchParams.get("search") || "";
    const queryCity = searchParams.get("city") || "All";

    setActiveFilter(queryFilter);
    setSearchTerm(querySearch);
    setCityFilter(queryCity);
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (activeFilter !== "All") {
      nextParams.set("filter", activeFilter.toLowerCase());
    }

    if (searchTerm.trim()) {
      nextParams.set("search", searchTerm.trim());
    }

    if (cityFilter !== "All") {
      nextParams.set("city", cityFilter);
    }

    setSearchParams(nextParams, { replace: true });
  }, [activeFilter, cityFilter, searchTerm, setSearchParams]);

  const cityOptions = useMemo(() => {
    const cities = Array.from(
      new Set(leads.map((lead) => lead.city).filter(Boolean))
    ).sort();
    return ["All", ...cities];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesFilter =
        activeFilter === "All" ? true : lead.status === activeFilter;

      const matchesCity = cityFilter === "All" ? true : lead.city === cityFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q) ||
        String(lead.id).toLowerCase().includes(q);

      return matchesFilter && matchesCity && matchesSearch;
    });
  }, [leads, activeFilter, cityFilter, searchTerm]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const contactedLeads = leads.filter((l) => l.status === "Contacted").length;
  const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
  const negotiationLeads = leads.filter((l) => l.status === "Negotiation").length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const todayFollowUps = leads.filter(
    (lead) =>
      lead.followUpDate &&
      lead.followUpDate !== "-" &&
      lead.followUpDate.slice(0, 10) === todayIso
  ).length;

  const overdueLeads = leads.filter((lead) => {
    if (!lead.followUpDate || lead.followUpDate === "-") return false;
    return lead.followUpDate.slice(0, 10) < todayIso && lead.status !== "Closed";
  }).length;

  const openLeadDetail = (leadId: number) => {
    navigate(`/leads/${leadId}`);
  };

  const handleKpiFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const clearAllFilters = () => {
    setActiveFilter("All");
    setCityFilter("All");
    setSearchTerm("");
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
              Dashboard KPI filters, localStorage live data, and pipeline view all in sync.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.cardBgSoft,
                color: colors.text,
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => navigate("/leads/calendar")}
              style={{
                border: `1px solid ${colors.border}`,
                background: colors.cardBgSoft,
                color: colors.text,
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Calendar View
            </button>

            <button
              onClick={() => navigate("/leads/new")}
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
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              label: "Total Leads",
              value: totalLeads,
              note: "All active records",
              filter: "All" as FilterType,
              active: activeFilter === "All",
            },
            {
              label: "New Leads",
              value: newLeads,
              note: "Fresh opportunities",
              filter: "New" as FilterType,
              active: activeFilter === "New",
            },
            {
              label: "Contacted",
              value: contactedLeads,
              note: "Already reached out",
              filter: "Contacted" as FilterType,
              active: activeFilter === "Contacted",
            },
            {
              label: "Qualified",
              value: qualifiedLeads,
              note: "Sales-ready leads",
              filter: "Qualified" as FilterType,
              active: activeFilter === "Qualified",
            },
            {
              label: "Negotiation",
              value: negotiationLeads,
              note: "Hot deals in progress",
              filter: "Negotiation" as FilterType,
              active: activeFilter === "Negotiation",
            },
            {
              label: "Closed",
              value: closedLeads,
              note: "Successfully converted",
              filter: "Closed" as FilterType,
              active: activeFilter === "Closed",
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleKpiFilter(item.filter)}
              style={{
                background: item.active ? colors.primary : colors.cardBg,
                border: `1px solid ${item.active ? colors.primary : colors.border}`,
                borderRadius: 18,
                padding: 20,
                boxShadow: colors.shadowSoft,
                cursor: "pointer",
                textAlign: "left",
                color: item.active ? "#ffffff" : colors.text,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: item.active ? "rgba(255,255,255,0.82)" : colors.subText,
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
                  color: item.active ? "#ffffff" : colors.text,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: item.active ? "rgba(255,255,255,0.78)" : colors.mutedText,
                  fontWeight: 600,
                }}
              >
                {item.note}
              </div>
            </button>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <MiniInfoCard title="Today Follow-ups" value={todayFollowUps} colors={colors} />
          <MiniInfoCard
            title="Overdue Leads"
            value={overdueLeads}
            colors={colors}
            valueColor={overdueLeads > 0 ? colors.danger : colors.text}
          />
          <MiniInfoCard title="Active City Filter" value={cityFilter} colors={colors} />
          <MiniInfoCard title="Filtered Results" value={filteredLeads.length} colors={colors} />
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
              placeholder="Search name, phone, city, owner, id..."
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
              <option value="Follow-up">Follow-up</option>
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
              ["All", "New", "Contacted", "Qualified", "Follow-up", "Negotiation", "Closed"] as FilterType[]
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
              onClick={clearAllFilters}
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

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {activeFilter !== "All" && (
              <FilterChip
                label={`Status: ${activeFilter}`}
                onRemove={() => setActiveFilter("All")}
                colors={colors}
              />
            )}

            {cityFilter !== "All" && (
              <FilterChip
                label={`City: ${cityFilter}`}
                onRemove={() => setCityFilter("All")}
                colors={colors}
              />
            )}

            {searchTerm.trim() && (
              <FilterChip
                label={`Search: ${searchTerm}`}
                onRemove={() => setSearchTerm("")}
                colors={colors}
              />
            )}
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
                    const isOverdue =
                      lead.followUpDate !== "-" &&
                      lead.followUpDate.slice(0, 10) < todayIso &&
                      lead.status !== "Closed";

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => openLeadDetail(lead.id)}
                        onMouseEnter={() => setHoveredRowId(lead.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          borderTop: `1px solid ${colors.border}`,
                          background: isOverdue
                            ? mode === "dark"
                              ? "rgba(239,68,68,0.08)"
                              : "rgba(239,68,68,0.05)"
                            : isHovered
                            ? colors.rowHover
                            : colors.rowBg,
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

                        <td style={tdStyle(colors.text)}>
                          <div>{lead.followUpDate}</div>
                          {isOverdue && (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                color: colors.danger,
                              }}
                            >
                              Overdue
                            </div>
                          )}
                        </td>

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
    </AppLayout>
  );
}

function MiniInfoCard({
  title,
  value,
  colors,
  valueColor,
}: {
  title: string;
  value: string | number;
  colors: ReturnType<typeof getTheme>;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div style={{ fontSize: 13, color: colors.subText, fontWeight: 700 }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 28,
          fontWeight: 800,
          color: valueColor || colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
  colors,
}: {
  label: string;
  onRemove: () => void;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: colors.cardBgSoft,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        style={{
          border: "none",
          background: "transparent",
          color: colors.subText,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        ✕
      </button>
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