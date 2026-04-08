import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type PipelinesPageProps = {
  mode: ThemeMode;
  onToggleTheme?: () => void;
};

type Priority = "Low" | "Medium" | "High";
type DealStatus = "Open" | "Won" | "Lost";

type Deal = {
  id: string;
  title: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  value: number;
  probability: number;
  owner: string;
  priority: Priority;
  expectedCloseDate: string;
  notes: string;
  stageId: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
};

type Stage = {
  id: string;
  title: string;
  color: string;
  order: number;
};

const PIPELINE_STORAGE_KEY = "mei-crm-pipeline-deals";
const PIPELINE_STAGE_STORAGE_KEY = "mei-crm-pipeline-stages";

const defaultStages: Stage[] = [
  { id: "new", title: "New", color: "#3b82f6", order: 1 },
  { id: "qualified", title: "Qualified", color: "#8b5cf6", order: 2 },
  { id: "proposal", title: "Proposal", color: "#f59e0b", order: 3 },
  { id: "negotiation", title: "Negotiation", color: "#ef4444", order: 4 },
  { id: "won", title: "Won", color: "#10b981", order: 5 },
  { id: "lost", title: "Lost", color: "#64748b", order: 6 },
];

const defaultDeals: Deal[] = [
  {
    id: "DL-1001",
    title: "Prestige Apartment Booking",
    company: "Prestige Group",
    contactPerson: "Arun Kumar",
    phone: "9876543210",
    email: "arun@example.com",
    value: 2500000,
    probability: 20,
    owner: "Balraj",
    priority: "High",
    expectedCloseDate: "2026-04-20",
    notes: "Initial discussion completed. Client interested in 2BHK.",
    stageId: "new",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "DL-1002",
    title: "Villa Investment Deal",
    company: "Sobha Realty",
    contactPerson: "Karthik",
    phone: "9123456780",
    email: "karthik@example.com",
    value: 7500000,
    probability: 45,
    owner: "Balraj",
    priority: "High",
    expectedCloseDate: "2026-04-28",
    notes: "Site visit planned for weekend.",
    stageId: "qualified",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "DL-1003",
    title: "Commercial Space Lease",
    company: "Phoenix Mall",
    contactPerson: "Rahul",
    phone: "9000011111",
    email: "rahul@example.com",
    value: 4200000,
    probability: 65,
    owner: "Priya",
    priority: "Medium",
    expectedCloseDate: "2026-05-05",
    notes: "Proposal shared. Waiting for response.",
    stageId: "proposal",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "DL-1004",
    title: "Plot Sale Closing",
    company: "MEI Estates",
    contactPerson: "Suresh",
    phone: "9444412345",
    email: "suresh@example.com",
    value: 1800000,
    probability: 80,
    owner: "Balraj",
    priority: "High",
    expectedCloseDate: "2026-04-14",
    notes: "Price negotiation in final stage.",
    stageId: "negotiation",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "DL-1005",
    title: "Luxury Flat Deal",
    company: "Brigade",
    contactPerson: "Divya",
    phone: "9555512345",
    email: "divya@example.com",
    value: 5200000,
    probability: 100,
    owner: "Priya",
    priority: "High",
    expectedCloseDate: "2026-04-08",
    notes: "Successfully closed.",
    stageId: "won",
    status: "Won",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "High":
      return "#ef4444";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#10b981";
    default:
      return "#64748b";
  }
};

const getProbabilityColor = (probability: number) => {
  if (probability >= 75) return "#10b981";
  if (probability >= 40) return "#f59e0b";
  return "#ef4444";
};

const createEmptyDeal = (): Deal => ({
  id: `DL-${Date.now()}`,
  title: "",
  company: "",
  contactPerson: "",
  phone: "",
  email: "",
  value: 0,
  probability: 10,
  owner: "",
  priority: "Medium",
  expectedCloseDate: "",
  notes: "",
  stageId: "new",
  status: "Open",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function PipelinesPage({
  mode,
  onToggleTheme,
}: PipelinesPageProps) {
  const theme = getTheme(mode);

  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [deals, setDeals] = useState<Deal[]>(defaultDeals);

  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(createEmptyDeal());

  useEffect(() => {
    const storedStages = localStorage.getItem(PIPELINE_STAGE_STORAGE_KEY);
    const storedDeals = localStorage.getItem(PIPELINE_STORAGE_KEY);

    if (storedStages) {
      try {
        setStages(JSON.parse(storedStages));
      } catch {
        setStages(defaultStages);
      }
    } else {
      localStorage.setItem(
        PIPELINE_STAGE_STORAGE_KEY,
        JSON.stringify(defaultStages)
      );
    }

    if (storedDeals) {
      try {
        setDeals(JSON.parse(storedDeals));
      } catch {
        setDeals(defaultDeals);
      }
    } else {
      localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(defaultDeals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(PIPELINE_STAGE_STORAGE_KEY, JSON.stringify(stages));
  }, [stages]);

  const orderedStages = useMemo(
    () => [...stages].sort((a, b) => a.order - b.order),
    [stages]
  );

  const owners = useMemo(() => {
    const ownerSet = new Set(
      deals.map((deal) => deal.owner).filter((owner) => owner.trim())
    );
    return ["All", ...Array.from(ownerSet)];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchSearch =
        deal.title.toLowerCase().includes(search.toLowerCase()) ||
        deal.company.toLowerCase().includes(search.toLowerCase()) ||
        deal.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        deal.phone.toLowerCase().includes(search.toLowerCase()) ||
        deal.email.toLowerCase().includes(search.toLowerCase());

      const matchOwner = ownerFilter === "All" || deal.owner === ownerFilter;
      const matchPriority =
        priorityFilter === "All" || deal.priority === priorityFilter;

      return matchSearch && matchOwner && matchPriority;
    });
  }, [deals, ownerFilter, priorityFilter, search]);

  const pipelineStats = useMemo(() => {
    const openDeals = deals.filter((d) => d.status === "Open");
    const wonDeals = deals.filter((d) => d.status === "Won");
    const lostDeals = deals.filter((d) => d.status === "Lost");

    const totalPipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedPipelineValue = openDeals.reduce(
      (sum, d) => sum + d.value * (d.probability / 100),
      0
    );
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const conversionRate =
      deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

    return {
      totalDeals: deals.length,
      openDeals: openDeals.length,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      totalPipelineValue,
      weightedPipelineValue,
      wonValue,
      conversionRate,
    };
  }, [deals]);

  const stageCounts = useMemo(() => {
    return orderedStages.reduce<Record<string, number>>((acc, stage) => {
      acc[stage.id] = filteredDeals.filter((deal) => deal.stageId === stage.id).length;
      return acc;
    }, {});
  }, [filteredDeals, orderedStages]);

  const stageValueTotals = useMemo(() => {
    return orderedStages.reduce<Record<string, number>>((acc, stage) => {
      acc[stage.id] = filteredDeals
        .filter((deal) => deal.stageId === stage.id)
        .reduce((sum, deal) => sum + deal.value, 0);
      return acc;
    }, {});
  }, [filteredDeals, orderedStages]);

  const openAddModal = () => {
    setFormData(createEmptyDeal());
    setShowAddModal(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData(deal);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDeal(null);
    setFormData(createEmptyDeal());
  };

  const handleSaveDeal = () => {
    if (!formData.title.trim() || !formData.company.trim()) return;

    const stageTitle =
      orderedStages.find((stage) => stage.id === formData.stageId)?.title || "";

    let derivedStatus: DealStatus = "Open";
    if (stageTitle.toLowerCase() === "won") derivedStatus = "Won";
    if (stageTitle.toLowerCase() === "lost") derivedStatus = "Lost";

    const updatedDeal = {
      ...formData,
      status: derivedStatus,
      updatedAt: new Date().toISOString(),
    };

    if (editingDeal) {
      setDeals((prev) =>
        prev.map((deal) => (deal.id === editingDeal.id ? updatedDeal : deal))
      );
    } else {
      setDeals((prev) => [
        {
          ...updatedDeal,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    closeModal();
  };

  const deleteDeal = (dealId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this deal?");
    if (!confirmed) return;
    setDeals((prev) => prev.filter((deal) => deal.id !== dealId));
  };

  const moveDeal = (dealId: string, direction: "left" | "right") => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;

        const currentIndex = orderedStages.findIndex(
          (stage) => stage.id === deal.stageId
        );
        if (currentIndex === -1) return deal;

        const nextIndex =
          direction === "left" ? currentIndex - 1 : currentIndex + 1;

        if (nextIndex < 0 || nextIndex >= orderedStages.length) return deal;

        const nextStage = orderedStages[nextIndex];
        const nextStatus: DealStatus =
          nextStage.title.toLowerCase() === "won"
            ? "Won"
            : nextStage.title.toLowerCase() === "lost"
            ? "Lost"
            : "Open";

        return {
          ...deal,
          stageId: nextStage.id,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const renderSummaryCard = (
    title: string,
    value: string,
    subText: string,
    icon: string
  ) => (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        boxShadow: mode === "dark" ? "0 10px 30px rgba(0,0,0,0.25)" : "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 28,
          marginBottom: 10,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 13,
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: theme.text,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.mutedText,
        }}
      >
        {subText}
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Pipelines"
      mode={mode}
      onToggleTheme={onToggleTheme}
    >
      <div
        style={{
          padding: 24,
          background: theme.pageBg,
          minHeight: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Pipeline Overview
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                color: theme.subText,
              }}
            >
              Track every opportunity from first conversation to final closure.
            </p>
          </div>

          <button
            onClick={openAddModal}
            style={{
              border: "none",
              background: theme.primary,
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(59,130,246,0.25)",
            }}
          >
            + Add Deal
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {renderSummaryCard(
            "Total Pipeline Value",
            currency(pipelineStats.totalPipelineValue),
            `${pipelineStats.openDeals} open deals`,
            "💼"
          )}
          {renderSummaryCard(
            "Weighted Forecast",
            currency(Math.round(pipelineStats.weightedPipelineValue)),
            "Probability-adjusted value",
            "📈"
          )}
          {renderSummaryCard(
            "Won Revenue",
            currency(pipelineStats.wonValue),
            `${pipelineStats.wonDeals} won deals`,
            "🏆"
          )}
          {renderSummaryCard(
            "Conversion Rate",
            `${pipelineStats.conversionRate}%`,
            `${pipelineStats.lostDeals} lost deals`,
            "⚡"
          )}
        </div>

        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: 16,
            marginBottom: 24,
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: 12,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company, contact, phone, email"
            style={{
              width: "100%",
              background: theme.inputBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              outline: "none",
            }}
          />

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            style={{
              width: "100%",
              background: theme.inputBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              outline: "none",
            }}
          >
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              width: "100%",
              background: theme.inputBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              outline: "none",
            }}
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setOwnerFilter("All");
              setPriorityFilter("All");
            }}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
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
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {orderedStages.map((stage, index) => {
            const stageDeals = filteredDeals.filter(
              (deal) => deal.stageId === stage.id
            );

            return (
              <div
                key={stage.id}
                style={{
                  minWidth: 320,
                  width: 320,
                  flexShrink: 0,
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow:
                    mode === "dark"
                      ? "0 12px 30px rgba(0,0,0,0.2)"
                      : "0 10px 24px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    padding: 16,
                    borderBottom: `1px solid ${theme.border}`,
                    background:
                      mode === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: stage.color,
                          display: "inline-block",
                        }}
                      />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 800,
                          color: theme.text,
                        }}
                      >
                        {stage.title}
                      </h3>
                    </div>

                    <div
                      style={{
                        minWidth: 28,
                        height: 28,
                        padding: "0 10px",
                        borderRadius: 999,
                        background: theme.cardBgSoft,
                        color: theme.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {stageCounts[stage.id] || 0}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: theme.subText,
                    }}
                  >
                    Value: {currency(stageValueTotals[stage.id] || 0)}
                  </div>
                </div>

                <div
                  style={{
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 450,
                    background: theme.pageBg,
                  }}
                >
                  {stageDeals.length === 0 ? (
                    <div
                      style={{
                        border: `1px dashed ${theme.border}`,
                        borderRadius: 14,
                        padding: 18,
                        textAlign: "center",
                        color: theme.mutedText,
                        fontSize: 13,
                        background: theme.cardBg,
                      }}
                    >
                      No deals in this stage
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        style={{
                          background: theme.cardBg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 16,
                          padding: 14,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: theme.text,
                                lineHeight: 1.4,
                              }}
                            >
                              {deal.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: theme.subText,
                                marginTop: 4,
                              }}
                            >
                              {deal.company}
                            </div>
                          </div>

                          <span
                            style={{
                              background: `${getPriorityColor(deal.priority)}18`,
                              color: getPriorityColor(deal.priority),
                              border: `1px solid ${getPriorityColor(deal.priority)}33`,
                              borderRadius: 999,
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {deal.priority}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              color: theme.text,
                              fontWeight: 700,
                            }}
                          >
                            {currency(deal.value)}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: theme.subText,
                            }}
                          >
                            👤 {deal.contactPerson} • {deal.owner || "No Owner"}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: theme.subText,
                            }}
                          >
                            📅 Close: {formatDate(deal.expectedCloseDate)}
                          </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 11,
                              color: theme.subText,
                              marginBottom: 6,
                            }}
                          >
                            <span>Probability</span>
                            <span>{deal.probability}%</span>
                          </div>
                          <div
                            style={{
                              height: 8,
                              borderRadius: 999,
                              background: theme.cardBgSoft,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${deal.probability}%`,
                                height: "100%",
                                background: getProbabilityColor(deal.probability),
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>

                        {deal.notes ? (
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.subText,
                              marginBottom: 12,
                              lineHeight: 1.5,
                              background: theme.cardBgSoft,
                              borderRadius: 10,
                              padding: 10,
                            }}
                          >
                            {deal.notes}
                          </div>
                        ) : null}

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => moveDeal(deal.id, "left")}
                            disabled={index === 0}
                            style={{
                              border: `1px solid ${theme.border}`,
                              background: theme.cardBgSoft,
                              color: theme.text,
                              padding: "8px 10px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: index === 0 ? "not-allowed" : "pointer",
                              opacity: index === 0 ? 0.5 : 1,
                            }}
                          >
                            ← Back
                          </button>

                          <button
                            onClick={() => moveDeal(deal.id, "right")}
                            disabled={index === orderedStages.length - 1}
                            style={{
                              border: "none",
                              background: theme.primary,
                              color: "#fff",
                              padding: "8px 10px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor:
                                index === orderedStages.length - 1
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: index === orderedStages.length - 1 ? 0.5 : 1,
                            }}
                          >
                            Next →
                          </button>

                          <button
                            onClick={() => openEditModal(deal)}
                            style={{
                              border: `1px solid ${theme.border}`,
                              background: theme.cardBgSoft,
                              color: theme.text,
                              padding: "8px 10px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteDeal(deal.id)}
                            style={{
                              border: `1px solid ${theme.border}`,
                              background: "transparent",
                              color: "#ef4444",
                              padding: "8px 10px",
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {(showAddModal || editingDeal) && (
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 820,
                maxHeight: "90vh",
                overflowY: "auto",
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 24,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      fontWeight: 800,
                      color: theme.text,
                    }}
                  >
                    {editingDeal ? "Edit Deal" : "Add New Deal"}
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: theme.subText,
                      fontSize: 13,
                    }}
                  >
                    Manage your opportunity flow with clean stage tracking.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBgSoft,
                    color: theme.text,
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Deal Title"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  placeholder="Company / Project"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                  placeholder="Contact Person"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  placeholder="Deal Owner"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email"
                  style={inputStyle(theme)}
                />

                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      value: Number(e.target.value),
                    }))
                  }
                  placeholder="Deal Value"
                  style={inputStyle(theme)}
                />

                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedCloseDate: e.target.value,
                    }))
                  }
                  style={inputStyle(theme)}
                />

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value as Priority,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                <select
                  value={formData.stageId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stageId: e.target.value,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  {orderedStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.title}
                    </option>
                  ))}
                </select>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 13,
                      color: theme.subText,
                      fontWeight: 700,
                    }}
                  >
                    Probability: {formData.probability}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={formData.probability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        probability: Number(e.target.value),
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Notes"
                  rows={5}
                  style={{
                    ...inputStyle(theme),
                    gridColumn: "1 / -1",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBgSoft,
                    color: theme.text,
                    padding: "12px 16px",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveDeal}
                  style={{
                    border: "none",
                    background: theme.primary,
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {editingDeal ? "Update Deal" : "Save Deal"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function inputStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    background: theme.inputBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
  };
}