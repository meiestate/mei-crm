import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type DealsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type DealStage = "New" | "Negotiation" | "Proposal" | "Won" | "Lost";
type FilterType = "All" | DealStage;

type Deal = {
  id: number;
  title: string;
  client: string;
  value: string;
  city: string;
  owner: string;
  stage: DealStage;
  leadId?: number;
  company?: string;
  source?: string;
  status?: string;
  createdAt?: string;
};

const DEAL_STORAGE_KEY = "mei-crm-deals";

const fallbackDeals: Deal[] = [
  {
    id: 1,
    title: "CRM Setup Package",
    client: "Arun Kumar",
    value: "₹2,50,000",
    city: "Chennai",
    owner: "Balraj",
    stage: "New",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Sales Automation System",
    client: "Priya Ventures",
    value: "₹4,80,000",
    city: "Bangalore",
    owner: "Balraj",
    stage: "Negotiation",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Lead Funnel Dashboard",
    client: "Rahul Infra",
    value: "₹3,20,000",
    city: "Coimbatore",
    owner: "Arun",
    stage: "Proposal",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Business OS Deployment",
    client: "Meena Corp",
    value: "₹6,00,000",
    city: "Madurai",
    owner: "Priya",
    stage: "Won",
    createdAt: new Date().toISOString(),
  },
];

function normalizeStage(value: string | undefined): DealStage {
  const normalized = String(value || "New").toLowerCase();

  if (normalized.includes("neg")) return "Negotiation";
  if (normalized.includes("prop")) return "Proposal";
  if (normalized.includes("won") || normalized.includes("closed")) return "Won";
  if (normalized.includes("lost")) return "Lost";
  return "New";
}

function getStageColor(stage: DealStage, mode: ThemeMode) {
  const colors = getTheme(mode);

  switch (stage) {
    case "New":
      return colors.info;
    case "Negotiation":
      return colors.warning;
    case "Proposal":
      return colors.premium;
    case "Won":
      return colors.success;
    case "Lost":
      return colors.danger;
    default:
      return colors.subText;
  }
}

function readStoredDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(DEAL_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: any, index: number) => mapUnknownDeal(item, index))
      .filter(Boolean) as Deal[];
  } catch (error) {
    console.error("Failed to parse deals from localStorage:", error);
    return [];
  }
}

function saveStoredDeals(deals: Deal[]) {
  try {
    localStorage.setItem(DEAL_STORAGE_KEY, JSON.stringify(deals));
  } catch (error) {
    console.error("Failed to save deals to localStorage:", error);
  }
}

function mapUnknownDeal(item: any, index: number): Deal | null {
  if (!item || typeof item !== "object") return null;

  return {
    id: Number(item.id ?? Date.now() + index),
    title: String(item.title || item.dealTitle || item.name || `Deal ${index + 1}`),
    client: String(
      item.client || item.clientName || item.customerName || item.company || "Unknown Client"
    ),
    value:
      typeof item.value === "number"
        ? `₹${item.value.toLocaleString("en-IN")}`
        : String(item.value || "—"),
    city: String(item.city || item.location || "Unknown"),
    owner: String(item.owner || "Unassigned"),
    stage: normalizeStage(item.stage || item.status),
    leadId: item.leadId ? Number(item.leadId) : undefined,
    company: item.company ? String(item.company) : undefined,
    source: item.source ? String(item.source) : undefined,
    status: item.status ? String(item.status) : undefined,
    createdAt: item.createdAt,
  };
}

function formatDateShort(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DealsPage({
  mode,
  onToggleTheme,
}: DealsPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();

  const [deals, setDeals] = useState<Deal[]>(() => {
    const stored = readStoredDeals();
    return stored.length > 0 ? stored : fallbackDeals;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    value: "",
    city: "",
    owner: "",
    stage: "New" as DealStage,
  });

  useEffect(() => {
    const syncDeals = () => {
      const stored = readStoredDeals();
      if (stored.length > 0) {
        setDeals(stored);
      }
    };

    window.addEventListener("storage", syncDeals);
    return () => window.removeEventListener("storage", syncDeals);
  }, []);

  useEffect(() => {
    if (deals.length > 0) {
      saveStoredDeals(deals);
    }
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesFilter =
        activeFilter === "All" ? true : deal.stage === activeFilter;

      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        deal.title.toLowerCase().includes(q) ||
        deal.client.toLowerCase().includes(q) ||
        deal.city.toLowerCase().includes(q) ||
        deal.owner.toLowerCase().includes(q) ||
        deal.value.toLowerCase().includes(q) ||
        String(deal.id).toLowerCase().includes(q) ||
        String(deal.company || "").toLowerCase().includes(q) ||
        String(deal.source || "").toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [deals, activeFilter, searchTerm]);

  const totalDeals = deals.length;
  const newDeals = deals.filter((d) => d.stage === "New").length;
  const negotiationDeals = deals.filter((d) => d.stage === "Negotiation").length;
  const proposalDeals = deals.filter((d) => d.stage === "Proposal").length;
  const wonDeals = deals.filter((d) => d.stage === "Won").length;
  const lostDeals = deals.filter((d) => d.stage === "Lost").length;

  const totalDealValue = deals.reduce((sum, deal) => {
    const numeric = Number(String(deal.value).replace(/[^\d.]/g, ""));
    return sum + (Number.isFinite(numeric) ? numeric : 0);
  }, 0);

  const handleAddDeal = () => {
    if (
      !formData.title.trim() ||
      !formData.client.trim() ||
      !formData.value.trim() ||
      !formData.city.trim()
    ) {
      alert("Title, client, value, city fill பண்ணணும்.");
      return;
    }

    const newDeal: Deal = {
      id: Date.now(),
      title: formData.title.trim(),
      client: formData.client.trim(),
      value: formData.value.trim(),
      city: formData.city.trim(),
      owner: formData.owner.trim() || "Unassigned",
      stage: formData.stage,
      createdAt: new Date().toISOString(),
    };

    setDeals((prev) => [newDeal, ...prev]);
    setFormData({
      title: "",
      client: "",
      value: "",
      city: "",
      owner: "",
      stage: "New",
    });
    setIsModalOpen(false);
    setActiveFilter("All");
    setSearchTerm("");
  };

  const handleKpiFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const openDealDetail = (dealId: number) => {
    navigate(`/deals/${dealId}`);
  };

  return (
    <AppLayout title="Deals" mode={mode} onToggleTheme={onToggleTheme}>
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
              MEI CRM Deals
            </div>

            <h2 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800 }}>
              Deal Management
            </h2>

            <p style={{ margin: "8px 0 0", color: colors.subText }}>
              Live deals synced from manual entries and lead conversion flow.
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
            + Add Deal
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
            { label: "Total Deals", value: totalDeals, filter: "All" as FilterType },
            { label: "New Deals", value: newDeals, filter: "New" as FilterType },
            { label: "Negotiation", value: negotiationDeals, filter: "Negotiation" as FilterType },
            { label: "Proposal", value: proposalDeals, filter: "Proposal" as FilterType },
            { label: "Won Deals", value: wonDeals, filter: "Won" as FilterType },
            { label: "Lost Deals", value: lostDeals, filter: "Lost" as FilterType },
          ].map((item) => {
            const active = activeFilter === item.filter;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleKpiFilter(item.filter)}
                style={{
                  background: active ? colors.primary : colors.cardBg,
                  border: `1px solid ${active ? colors.primary : colors.border}`,
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: colors.shadowSoft,
                  cursor: "pointer",
                  textAlign: "left",
                  color: active ? "#ffffff" : colors.text,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: active ? "rgba(255,255,255,0.82)" : colors.subText,
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
                    color: active ? "#ffffff" : colors.text,
                  }}
                >
                  {item.value}
                </div>
              </button>
            );
          })}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            label="Pipeline Value"
            value={`₹${totalDealValue.toLocaleString("en-IN")}`}
            colors={colors}
          />
          <StatCard
            label="Converted From Leads"
            value={String(deals.filter((deal) => deal.leadId).length)}
            colors={colors}
          />
          <StatCard
            label="Live Filter Results"
            value={String(filteredDeals.length)}
            colors={colors}
          />
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
              gridTemplateColumns: "minmax(220px, 1fr) auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, client, city, owner, source..."
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
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              style={{
                border: `1px solid ${colors.border}`,
                background: "transparent",
                color: colors.subText,
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear
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
            {(["All", "New", "Negotiation", "Proposal", "Won", "Lost"] as FilterType[]).map(
              (item) => {
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
              }
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
              <div style={{ fontSize: 24, fontWeight: 800, color: colors.text }}>
                Deals Table
              </div>
              <div style={{ fontSize: 14, color: colors.subText, marginTop: 4 }}>
                Showing {filteredDeals.length} deal(s)
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
                  <th style={thStyle(colors.subText)}>Deal Title</th>
                  <th style={thStyle(colors.subText)}>Client</th>
                  <th style={thStyle(colors.subText)}>Value</th>
                  <th style={thStyle(colors.subText)}>City</th>
                  <th style={thStyle(colors.subText)}>Owner</th>
                  <th style={thStyle(colors.subText)}>Stage</th>
                  <th style={thStyle(colors.subText)}>Source</th>
                  <th style={thStyle(colors.subText)}>Lead Ref</th>
                  <th style={thStyle(colors.subText)}>Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => {
                    const isHovered = hoveredRowId === deal.id;

                    return (
                      <tr
                        key={deal.id}
                        onClick={() => openDealDetail(deal.id)}
                        onMouseEnter={() => setHoveredRowId(deal.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          borderTop: `1px solid ${colors.border}`,
                          background: isHovered ? colors.rowHover : colors.rowBg,
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                        title={`Open ${deal.title} details`}
                      >
                        <td style={tdStyle(colors.text)}>{deal.id}</td>

                        <td style={tdStyle(colors.text)}>
                          <div style={{ fontWeight: 700 }}>{deal.title}</div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: isHovered ? colors.primary : colors.subText,
                              fontWeight: 700,
                            }}
                          >
                            View Deal →
                          </div>
                          {deal.company ? (
                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: colors.subText,
                              }}
                            >
                              {deal.company}
                            </div>
                          ) : null}
                        </td>

                        <td style={tdStyle(colors.text)}>{deal.client}</td>
                        <td style={tdStyle(colors.text)}>{deal.value}</td>
                        <td style={tdStyle(colors.text)}>{deal.city}</td>
                        <td style={tdStyle(colors.text)}>{deal.owner}</td>
                        <td style={tdStyle(colors.text)}>
                          <span
                            style={{
                              display: "inline-block",
                              background: getStageColor(deal.stage, mode),
                              color: "#ffffff",
                              padding: "6px 12px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {deal.stage}
                          </span>
                        </td>
                        <td style={tdStyle(colors.text)}>{deal.source || "Manual"}</td>
                        <td style={tdStyle(colors.text)}>
                          {deal.leadId ? `#${deal.leadId}` : "—"}
                        </td>
                        <td style={tdStyle(colors.text)}>
                          {formatDateShort(deal.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: 24,
                        color: colors.subText,
                        textAlign: "center",
                        background: colors.rowBg,
                      }}
                    >
                      No deals found.
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
                Add New Deal
              </h3>
              <p style={{ margin: "8px 0 0", color: colors.subText }}>
                Fill the details and create a new deal.
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
                label="Deal Title"
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                colors={colors}
              />

              <InputField
                label="Client"
                value={formData.client}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, client: value }))
                }
                colors={colors}
              />

              <InputField
                label="Value"
                value={formData.value}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, value }))
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
                label="Owner"
                value={formData.owner}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, owner: value }))
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
                  Stage
                </label>

                <select
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stage: e.target.value as DealStage,
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
                  <option value="Negotiation">Negotiation</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
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
                onClick={handleAddDeal}
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
                Save Deal
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
  value: string;
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
          wordBreak: "break-word",
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