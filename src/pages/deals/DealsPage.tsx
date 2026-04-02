import React, { useMemo, useState } from "react";
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
};

const initialDeals: Deal[] = [
  {
    id: 1,
    title: "CRM Setup Package",
    client: "Arun Kumar",
    value: "₹2,50,000",
    city: "Chennai",
    owner: "Balraj",
    stage: "New",
  },
  {
    id: 2,
    title: "Sales Automation System",
    client: "Priya Ventures",
    value: "₹4,80,000",
    city: "Bangalore",
    owner: "Balraj",
    stage: "Negotiation",
  },
  {
    id: 3,
    title: "Lead Funnel Dashboard",
    client: "Rahul Infra",
    value: "₹3,20,000",
    city: "Coimbatore",
    owner: "Arun",
    stage: "Proposal",
  },
  {
    id: 4,
    title: "Business OS Deployment",
    client: "Meena Corp",
    value: "₹6,00,000",
    city: "Madurai",
    owner: "Priya",
    stage: "Won",
  },
];

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

export default function DealsPage({
  mode,
  onToggleTheme,
}: DealsPageProps) {
  const colors = getTheme(mode);

  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    value: "",
    city: "",
    owner: "",
    stage: "New" as DealStage,
  });

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
        deal.value.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [deals, activeFilter, searchTerm]);

  const totalDeals = deals.length;
  const newDeals = deals.filter((d) => d.stage === "New").length;
  const wonDeals = deals.filter((d) => d.stage === "Won").length;
  const negotiationDeals = deals.filter((d) => d.stage === "Negotiation").length;

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

  return (
    <AppLayout title="Deals" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, color: colors.text }}>
            Deal Management
          </h2>
          <p style={{ margin: "8px 0 0", color: colors.subText }}>
            Track opportunities, proposals, negotiations, and closed deals.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard label="Total Deals" value={totalDeals} colors={colors} />
          <StatCard label="New Deals" value={newDeals} colors={colors} />
          <StatCard label="Negotiation" value={negotiationDeals} colors={colors} />
          <StatCard label="Won Deals" value={wonDeals} colors={colors} />
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
              placeholder="Search title, client, city, owner..."
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
              + Add Deal
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
                minWidth: 980,
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
                </tr>
              </thead>

              <tbody>
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      style={{
                        borderTop: `1px solid ${colors.border}`,
                        background: colors.rowBg,
                      }}
                    >
                      <td style={tdStyle(colors.text)}>{deal.id}</td>
                      <td style={tdStyle(colors.text)}>{deal.title}</td>
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
                      No deals found.
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
                  setFormData((prev) => ({ ...prev, value: value }))
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