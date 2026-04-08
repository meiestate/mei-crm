import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type DealDetailPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type DealStage = "New" | "Negotiation" | "Proposal" | "Won" | "Lost";
type TimelineTone = "info" | "success" | "warning" | "danger" | "primary";

type DealTimelineItem = {
  title: string;
  description: string;
  time: string;
  tone?: TimelineTone;
};

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
  notes?: string;
  probability?: string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: DealTimelineItem[];
};

const DEAL_STORAGE_KEY = "mei-crm-deals";

const OWNER_OPTIONS = [
  "Balraj",
  "Madhan",
  "Arun",
  "Priya",
  "Sales Desk",
  "Unassigned",
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

function getToneColor(
  tone: TimelineTone | undefined,
  colors: ReturnType<typeof getTheme>
) {
  switch (tone) {
    case "success":
      return colors.success;
    case "warning":
      return colors.warning;
    case "danger":
      return colors.danger;
    case "primary":
      return colors.primary;
    default:
      return colors.info;
  }
}

function getNowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
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
    console.error("Failed to read deals:", error);
    return [];
  }
}

function saveStoredDeals(deals: Deal[]) {
  try {
    localStorage.setItem(DEAL_STORAGE_KEY, JSON.stringify(deals));
  } catch (error) {
    console.error("Failed to save deals:", error);
  }
}

function mapUnknownDeal(item: any, index: number): Deal | null {
  if (!item || typeof item !== "object") return null;

  const timeline = Array.isArray(item.timeline)
    ? item.timeline.map((entry: any) => ({
        title: String(entry?.title || "Activity"),
        description: String(entry?.description || "Deal activity recorded."),
        time: String(entry?.time || "Recent"),
        tone: entry?.tone as TimelineTone | undefined,
      }))
    : [];

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
    notes: String(item.notes || "No deal notes added yet."),
    probability: String(item.probability || getDefaultProbability(normalizeStage(item.stage || item.status))),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    timeline,
  };
}

function getDefaultProbability(stage: DealStage) {
  switch (stage) {
    case "New":
      return "15%";
    case "Negotiation":
      return "65%";
    case "Proposal":
      return "48%";
    case "Won":
      return "100%";
    case "Lost":
      return "0%";
    default:
      return "0%";
  }
}

export default function DealDetailPage({
  mode,
  onToggleTheme,
}: DealDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const colors = getTheme(mode);

  const dealId = Number(id);

  const [allDeals, setAllDeals] = useState<Deal[]>(() => readStoredDeals());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [probabilityInput, setProbabilityInput] = useState("");

  useEffect(() => {
    const syncDeals = () => {
      setAllDeals(readStoredDeals());
    };

    window.addEventListener("storage", syncDeals);
    return () => window.removeEventListener("storage", syncDeals);
  }, []);

  const initialDeal = useMemo(
    () => allDeals.find((item) => item.id === dealId) ?? null,
    [allDeals, dealId]
  );

  const [dealState, setDealState] = useState<Deal | null>(initialDeal);
  const [formData, setFormData] = useState<Deal | null>(initialDeal);

  useEffect(() => {
    setDealState(initialDeal);
    setFormData(initialDeal);
    setOwnerInput(initialDeal?.owner || "");
    setValueInput(initialDeal?.value || "");
    setProbabilityInput(initialDeal?.probability || "");
  }, [initialDeal]);

  const currentIndex = useMemo(
    () => allDeals.findIndex((item) => item.id === dealId),
    [allDeals, dealId]
  );

  const previousDeal = currentIndex > 0 ? allDeals[currentIndex - 1] : null;
  const nextDeal =
    currentIndex >= 0 && currentIndex < allDeals.length - 1
      ? allDeals[currentIndex + 1]
      : null;

  const persistDealUpdate = (updater: (deal: Deal) => Deal) => {
    const latestDeals = readStoredDeals();
    const updatedDeals = latestDeals.map((deal) =>
      deal.id === dealId ? updater(deal) : deal
    );

    saveStoredDeals(updatedDeals);
    setAllDeals(updatedDeals);

    const updatedDeal = updatedDeals.find((deal) => deal.id === dealId) ?? null;
    setDealState(updatedDeal);
    setFormData(updatedDeal);
  };

  if (!dealState || !formData) {
    return (
      <AppLayout title="Deal Detail" mode={mode} onToggleTheme={onToggleTheme}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <h2 style={{ margin: 0, color: colors.text, fontSize: 28 }}>
            Deal not found
          </h2>

          <p style={{ margin: "10px 0 0", color: colors.subText }}>
            The requested deal does not exist or may have been removed.
          </p>

          <div style={{ marginTop: 20 }}>
            <Link
              to="/deals"
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: colors.primary,
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              Back to Deals
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const deal = dealState;

  const updateStage = (nextStage: DealStage) => {
    persistDealUpdate((prev) => {
      const timelineItem: DealTimelineItem = {
        title: "Stage Updated",
        description: `Deal stage changed to ${nextStage}.`,
        time: getNowLabel(),
        tone:
          nextStage === "Won"
            ? "success"
            : nextStage === "Lost"
            ? "danger"
            : nextStage === "Negotiation"
            ? "warning"
            : nextStage === "Proposal"
            ? "primary"
            : "info",
      };

      return {
        ...prev,
        stage: nextStage,
        status: nextStage,
        probability: getDefaultProbability(nextStage),
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleSaveOwner = () => {
    if (!ownerInput.trim()) return;

    persistDealUpdate((prev) => {
      const timelineItem: DealTimelineItem = {
        title: "Owner Reassigned",
        description: `Deal owner changed to ${ownerInput.trim()}.`,
        time: getNowLabel(),
        tone: "primary",
      };

      return {
        ...prev,
        owner: ownerInput.trim(),
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleSaveValue = () => {
    if (!valueInput.trim()) return;

    persistDealUpdate((prev) => {
      const timelineItem: DealTimelineItem = {
        title: "Deal Value Updated",
        description: `Deal value updated to ${valueInput.trim()}.`,
        time: getNowLabel(),
        tone: "warning",
      };

      return {
        ...prev,
        value: valueInput.trim(),
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleSaveProbability = () => {
    if (!probabilityInput.trim()) return;

    persistDealUpdate((prev) => {
      const timelineItem: DealTimelineItem = {
        title: "Probability Updated",
        description: `Deal probability updated to ${probabilityInput.trim()}.`,
        time: getNowLabel(),
        tone: "info",
      };

      return {
        ...prev,
        probability: probabilityInput.trim(),
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;

    persistDealUpdate((prev) => {
      const existingNotes =
        prev.notes && prev.notes !== "No deal notes added yet." ? prev.notes : "";

      const nextNotes = existingNotes
        ? `${noteInput.trim()}\n\n${existingNotes}`
        : noteInput.trim();

      const timelineItem: DealTimelineItem = {
        title: "Note Added",
        description: noteInput.trim(),
        time: getNowLabel(),
        tone: "info",
      };

      return {
        ...prev,
        notes: nextNotes,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    setNoteInput("");
  };

  const handleDeleteDeal = () => {
    const confirmed = window.confirm(`Delete ${deal.title}?`);
    if (!confirmed) return;

    const latestDeals = readStoredDeals();
    const updatedDeals = latestDeals.filter((item) => item.id !== deal.id);

    saveStoredDeals(updatedDeals);
    setAllDeals(updatedDeals);
    navigate("/deals");
  };

  const saveDealChanges = () => {
    if (
      !formData.title.trim() ||
      !formData.client.trim() ||
      !formData.value.trim() ||
      !formData.city.trim()
    ) {
      alert("Title, client, value, city fill பண்ணணும்.");
      return;
    }

    persistDealUpdate((prev) => {
      const timelineItem: DealTimelineItem = {
        title: "Deal Updated",
        description: "Deal information was edited from the detail page.",
        time: getNowLabel(),
        tone: "primary",
      };

      return {
        ...prev,
        ...formData,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    setIsEditOpen(false);
  };

  return (
    <AppLayout title="Deal Detail" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
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
                Deal Profile
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 32,
                  color: colors.text,
                  fontWeight: 800,
                }}
              >
                {deal.title}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Track commercial movement, stage progress, ownership, and deal notes.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-block",
                  background: getStageColor(deal.stage, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {deal.stage}
              </span>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <MiniStatCard label="Stage" value={deal.stage} colors={colors} />
          <MiniStatCard label="Probability" value={deal.probability || "—"} colors={colors} />
          <MiniStatCard label="Deal Value" value={deal.value} colors={colors} />
          <MiniStatCard
            label="Timeline Events"
            value={String((deal.timeline || []).length)}
            colors={colors}
          />
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 20,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            Quick Actions
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={deal.stage}
              onChange={(e) => updateStage(e.target.value as DealStage)}
              style={inputStyle(colors)}
            >
              <option value="New">New</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Proposal">Proposal</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            <button
              onClick={() => {
                setFormData(deal);
                setIsEditOpen(true);
              }}
              style={secondaryButton(colors)}
            >
              Edit Deal
            </button>

            <button onClick={handleDeleteDeal} style={dangerButton(colors)}>
              Delete
            </button>

            <Link to="/deals" style={primaryLinkButton(colors)}>
              Back to Deals
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <DetailCard label="Deal ID" value={String(deal.id)} colors={colors} />
          <DetailCard label="Client" value={deal.client} colors={colors} />
          <DetailCard label="Company" value={deal.company || "—"} colors={colors} />
          <DetailCard label="City" value={deal.city} colors={colors} />
          <DetailCard label="Owner" value={deal.owner} colors={colors} />
          <DetailCard label="Value" value={deal.value} colors={colors} />
          <DetailCard label="Source" value={deal.source || "Manual"} colors={colors} />
          <DetailCard
            label="Lead Reference"
            value={deal.leadId ? `#${deal.leadId}` : "—"}
            colors={colors}
          />
          <DetailCard
            label="Created"
            value={formatDateShort(deal.createdAt)}
            colors={colors}
          />
          <DetailCard
            label="Updated"
            value={formatDateShort(deal.updatedAt)}
            colors={colors}
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.1fr) minmax(320px, 0.9fr)",
            gap: 20,
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <InfoPanel title="Deal Notes" colors={colors}>
              {deal.notes || "No deal notes added yet."}
            </InfoPanel>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Add Quick Note
              </div>

              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={4}
                placeholder="Add new commercial update or negotiation note..."
                style={{
                  ...inputStyle(colors),
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleAddNote} style={primaryButton(colors)}>
                  Add Note
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Owner Reassignment
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <select
                  value={ownerInput}
                  onChange={(e) => setOwnerInput(e.target.value)}
                  style={inputStyle(colors)}
                >
                  {OWNER_OPTIONS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>

                <button onClick={handleSaveOwner} style={primaryButton(colors)}>
                  Save Owner
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Value Update
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <input
                  type="text"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="Enter deal value"
                  style={inputStyle(colors)}
                />

                <button onClick={handleSaveValue} style={primaryButton(colors)}>
                  Save Value
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Probability Update
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <input
                  type="text"
                  value={probabilityInput}
                  onChange={(e) => setProbabilityInput(e.target.value)}
                  placeholder="Example: 65%"
                  style={inputStyle(colors)}
                />

                <button onClick={handleSaveProbability} style={primaryButton(colors)}>
                  Save Probability
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Deal Navigation
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <button
                  onClick={() => previousDeal && navigate(`/deals/${previousDeal.id}`)}
                  disabled={!previousDeal}
                  style={{
                    ...secondaryButton(colors),
                    opacity: previousDeal ? 1 : 0.5,
                    cursor: previousDeal ? "pointer" : "not-allowed",
                  }}
                >
                  ← Previous Deal
                </button>

                <button
                  onClick={() => nextDeal && navigate(`/deals/${nextDeal.id}`)}
                  disabled={!nextDeal}
                  style={{
                    ...secondaryButton(colors),
                    opacity: nextDeal ? 1 : 0.5,
                    cursor: nextDeal ? "pointer" : "not-allowed",
                  }}
                >
                  Next Deal →
                </button>
              </div>
            </div>

            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 24,
                boxShadow: colors.shadowSoft,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                Deal Timeline
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {(deal.timeline || []).length > 0 ? (
                  (deal.timeline || []).map((item, index) => {
                    const dotColor = getToneColor(item.tone, colors);

                    return (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "14px 1fr",
                          gap: 12,
                          alignItems: "start",
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: dotColor,
                            marginTop: 6,
                          }}
                        />

                        <div
                          style={{
                            background: colors.cardBgSoft,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 14,
                            padding: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                color: colors.text,
                                fontSize: 15,
                                fontWeight: 700,
                              }}
                            >
                              {item.title}
                            </div>

                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 800,
                                background: dotColor,
                                color: "#ffffff",
                              }}
                            >
                              {(item.tone || "info").toUpperCase()}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              color: colors.subText,
                              lineHeight: 1.6,
                              fontSize: 14,
                            }}
                          >
                            {item.description}
                          </div>

                          <div
                            style={{
                              marginTop: 8,
                              color: colors.mutedText,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {item.time}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      background: colors.cardBgSoft,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: 16,
                      color: colors.subText,
                      fontSize: 14,
                    }}
                  >
                    No timeline activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isEditOpen && (
        <div
          onClick={() => setIsEditOpen(false)}
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
              maxWidth: 860,
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
                Edit Deal
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                }}
              >
                Update deal title, client, value, stage, and commercial data.
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
                  setFormData((prev) => (prev ? { ...prev, title: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Client"
                value={formData.client}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, client: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Value"
                value={formData.value}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, value: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, city: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Owner"
                value={formData.owner}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, owner: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Company"
                value={formData.company || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, company: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Source"
                value={formData.source || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, source: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Probability"
                value={formData.probability || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, probability: value } : prev))
                }
                colors={colors}
              />

              <SelectField
                label="Stage"
                value={formData.stage}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, stage: value as DealStage } : prev
                  )
                }
                options={["New", "Negotiation", "Proposal", "Won", "Lost"]}
                colors={colors}
              />
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <TextAreaField
                label="Notes"
                value={formData.notes || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, notes: value } : prev))
                }
                colors={colors}
              />
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
                onClick={() => setIsEditOpen(false)}
                style={secondaryButton(colors)}
              >
                Cancel
              </button>

              <button onClick={saveDealChanges} style={primaryButton(colors)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function MiniStatCard({
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
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          color: colors.text,
          fontSize: 24,
          fontWeight: 800,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DetailCard({
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
        padding: 18,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          color: colors.subText,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: colors.shadowSoft,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          background: colors.cardBgSoft,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          color: colors.text,
          lineHeight: 1.7,
          fontSize: 14,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
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
        style={inputStyle(colors)}
      />
    </div>
  );
}

function TextAreaField({
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

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          ...inputStyle(colors),
          resize: "vertical",
          fontFamily: "inherit",
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
        style={inputStyle(colors)}
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

function inputStyle(colors: ReturnType<typeof getTheme>): React.CSSProperties {
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

function primaryButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function secondaryButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function dangerButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: "none",
    background: colors.danger,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function primaryLinkButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    display: "inline-block",
    textDecoration: "none",
    background: colors.primary,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
  };
}