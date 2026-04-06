import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadDetailPageProps = {
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
type TimelineTone = "info" | "success" | "warning" | "danger" | "primary";
type ActivityFilter = "All" | "Info" | "Success" | "Warning" | "Danger" | "Primary";

type CallLogItem = {
  time: string;
  note: string;
  outcome: string;
};

type TimelineItem = {
  title: string;
  description: string;
  time: string;
  tone?: TimelineTone;
};

type AttachmentItem = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  sizeLabel: string;
};

type Lead = {
  id: number;
  name: string;
  phone: string;
  source: string;
  city: string;
  status: LeadStatus;
  email: string;
  company: string;
  budget: string;
  notes: string;
  owner: string;
  priority: LeadPriority;
  followUpDate: string;
  lastContact: string;
  requirement: string;
  callLogs: CallLogItem[];
  timeline: TimelineItem[];
  attachments?: AttachmentItem[];
  isConvertedToDeal?: boolean;
  convertedDealAt?: string;
  convertedDealValue?: string;
  updatedAt?: string;
  createdAt?: string;

  alternatePhone?: string;
  address?: string;
  preferredLanguage?: string;
  campaign?: string;
  referredBy?: string;

  financingType?: string;
  purpose?: string;
  sqft?: string;
  facing?: string;
  floorPreference?: string;
  timelineLabel?: string;

  tags?: string[];
  objections?: string[];

  ownerEmail?: string;
  ownerPhone?: string;
};

const LEAD_STORAGE_KEYS = [
  "mei-crm-leads",
  "mei_crm_leads",
  "leads",
  "crm_leads",
];

const DEAL_STORAGE_KEY = "mei-crm-deals";

const OWNER_OPTIONS = [
  "Madhan",
  "Arun",
  "Priya",
  "John Paul",
  "Sales Desk",
  "Unassigned",
];

const WHATSAPP_TEMPLATES = [
  "Hi {name}, just checking in regarding your enquiry. Shall we connect today?",
  "Hi {name}, your follow-up is due today. Please let me know a convenient time.",
  "Hi {name}, I’ve shared the details. Happy to walk you through the next steps.",
  "Hi {name}, we can move this to the next stage whenever you're ready.",
];

const PIPELINE_STEPS: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Follow-up",
  "Negotiation",
  "Closed",
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

function normalizeStatus(value: string | undefined): LeadStatus {
  const normalized = String(value || "New").toLowerCase();

  if (normalized.includes("contact")) return "Contacted";
  if (normalized.includes("qual")) return "Qualified";
  if (normalized.includes("follow")) return "Follow-up";
  if (normalized.includes("neg")) return "Negotiation";
  if (normalized.includes("closed") || normalized.includes("won")) return "Closed";
  return "New";
}

function normalizePriority(value: string | undefined): LeadPriority {
  const normalized = String(value || "Medium").toLowerCase();

  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";
  return "Medium";
}

function readStoredLeads(): Lead[] {
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

function saveStoredLeads(leads: Lead[]) {
  try {
    localStorage.setItem("mei-crm-leads", JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to save leads to localStorage:", error);
  }
}

function readStoredDeals(): any[] {
  try {
    const raw = localStorage.getItem(DEAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read deals:", error);
    return [];
  }
}

function saveStoredDeals(deals: any[]) {
  try {
    localStorage.setItem(DEAL_STORAGE_KEY, JSON.stringify(deals));
  } catch (error) {
    console.error("Failed to save deals:", error);
  }
}

function mapUnknownLead(item: any, index: number): Lead | null {
  if (!item || typeof item !== "object") return null;

  const timeline = Array.isArray(item.timeline)
    ? item.timeline.map((entry: any) => ({
        title: String(entry?.title || "Activity"),
        description: String(entry?.description || "Lead activity recorded."),
        time: String(entry?.time || "Recent"),
        tone: entry?.tone as TimelineTone | undefined,
      }))
    : [];

  const callLogs = Array.isArray(item.callLogs)
    ? item.callLogs.map((entry: any) => ({
        time: String(entry?.time || "Recent"),
        note: String(entry?.note || "Call activity recorded."),
        outcome: String(entry?.outcome || "Connected"),
      }))
    : [];

  const attachments = Array.isArray(item.attachments)
    ? item.attachments.map((entry: any, i: number) => ({
        id: String(entry?.id || `${Date.now()}-${i}`),
        name: String(entry?.name || "Attachment"),
        type: String(entry?.type || "file"),
        uploadedAt: String(entry?.uploadedAt || "Recent"),
        sizeLabel: String(entry?.sizeLabel || "—"),
      }))
    : [];

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
    alternatePhone: String(item.alternatePhone || item.altPhone || "-"),
    source: String(item.source || "Manual"),
    city: String(item.city || item.location || item.area || "Unknown"),
    status: normalizeStatus(item.status),
    email: String(item.email || "-"),
    company: String(item.company || "-"),
    budget:
      typeof item.budget === "number"
        ? `₹${item.budget.toLocaleString("en-IN")}`
        : String(item.budget || "-"),
    notes: String(item.notes || "No notes added yet."),
    owner: String(item.owner || item.assignedTo || item.leadOwner || "Unassigned"),
    priority: normalizePriority(item.priority),
    followUpDate: String(item.followUpDate || item.nextFollowUp || "-"),
    lastContact: String(item.lastContact || "Recent"),
    requirement: String(item.requirement || "Requirement details not added yet."),
    callLogs,
    timeline,
    attachments,
    isConvertedToDeal: Boolean(item.isConvertedToDeal),
    convertedDealAt: item.convertedDealAt,
    convertedDealValue: item.convertedDealValue,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,

    address: String(item.address || item.fullAddress || "-"),
    preferredLanguage: String(item.preferredLanguage || "Tamil / English"),
    campaign: String(item.campaign || item.campaignName || "-"),
    referredBy: String(item.referredBy || item.referenceBy || "-"),

    financingType: String(item.financingType || "Bank Loan"),
    purpose: String(item.purpose || "Self-use"),
    sqft: String(item.sqft || item.areaRange || "-"),
    facing: String(item.facing || "-"),
    floorPreference: String(item.floorPreference || "-"),
    timelineLabel: String(item.timelineLabel || item.purchaseTimeline || "-"),

    tags: Array.isArray(item.tags) ? item.tags : [],
    objections: Array.isArray(item.objections) ? item.objections : [],

    ownerEmail: String(item.ownerEmail || "-"),
    ownerPhone: String(item.ownerPhone || "-"),
  };
}

function getNowLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function getLastContactLabel() {
  return "Just now";
}

function isOverdue(dateValue: string, status: LeadStatus) {
  if (!dateValue || dateValue === "-" || status === "Closed") return false;

  const today = new Date().toISOString().slice(0, 10);
  return dateValue.slice(0, 10) < today;
}

function getTimelineToneColor(
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

function getLeadHealthScore(lead: Lead) {
  let score = 40;

  if (lead.priority === "High") score += 20;
  if (lead.status === "Qualified") score += 18;
  if (lead.status === "Negotiation") score += 25;
  if (lead.status === "Closed") score = 100;
  if (lead.callLogs.length >= 2) score += 8;
  if (lead.notes && lead.notes !== "No notes added yet.") score += 5;
  if (lead.requirement && lead.requirement !== "Requirement details not added yet.") score += 4;
  if (isOverdue(lead.followUpDate, lead.status)) score -= 15;
  if (lead.attachments && lead.attachments.length > 0) score += 5;

  return Math.max(0, Math.min(100, score));
}

function getStageProbability(status: LeadStatus) {
  switch (status) {
    case "New":
      return "12%";
    case "Contacted":
      return "28%";
    case "Qualified":
      return "55%";
    case "Follow-up":
      return "64%";
    case "Negotiation":
      return "78%";
    case "Closed":
      return "100%";
    default:
      return "0%";
  }
}

function toneMatchesFilter(tone: TimelineTone | undefined, filter: ActivityFilter) {
  if (filter === "All") return true;
  if (filter === "Info") return (tone || "info") === "info";
  if (filter === "Success") return tone === "success";
  if (filter === "Warning") return tone === "warning";
  if (filter === "Danger") return tone === "danger";
  if (filter === "Primary") return tone === "primary";
  return true;
}

export default function LeadDetailPage({
  mode,
  onToggleTheme,
}: LeadDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = getTheme(mode);

  const leadId = Number(id);
  const leadsBackLink = `/leads${location.search || ""}`;

  const [allLeads, setAllLeads] = useState<Lead[]>(() => readStoredLeads());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [callNote, setCallNote] = useState("");
  const [callOutcome, setCallOutcome] = useState("Connected");
  const [followUpInput, setFollowUpInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("All");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentType, setAttachmentType] = useState("Proposal");
  const [attachmentSize, setAttachmentSize] = useState("");

  useEffect(() => {
    const syncLeads = () => {
      setAllLeads(readStoredLeads());
    };

    window.addEventListener("storage", syncLeads);
    return () => window.removeEventListener("storage", syncLeads);
  }, []);

  const initialLead = useMemo(
    () => allLeads.find((item) => item.id === leadId) ?? null,
    [allLeads, leadId]
  );

  const [leadState, setLeadState] = useState<Lead | null>(initialLead);
  const [formData, setFormData] = useState<Lead | null>(initialLead);

  useEffect(() => {
    setLeadState(initialLead);
    setFormData(initialLead);
    setFollowUpInput(
      initialLead?.followUpDate && initialLead.followUpDate !== "-"
        ? initialLead.followUpDate
        : ""
    );
    setOwnerInput(initialLead?.owner || "");
  }, [initialLead]);

  const currentIndex = useMemo(
    () => allLeads.findIndex((item) => item.id === leadId),
    [allLeads, leadId]
  );

  const previousLead = currentIndex > 0 ? allLeads[currentIndex - 1] : null;
  const nextLead =
    currentIndex >= 0 && currentIndex < allLeads.length - 1
      ? allLeads[currentIndex + 1]
      : null;

  const persistLeadUpdate = (updater: (lead: Lead) => Lead) => {
    const latestLeads = readStoredLeads();
    const updatedLeads = latestLeads.map((lead) =>
      lead.id === leadId ? updater(lead) : lead
    );

    saveStoredLeads(updatedLeads);
    setAllLeads(updatedLeads);

    const updatedLead = updatedLeads.find((lead) => lead.id === leadId) ?? null;
    setLeadState(updatedLead);
    setFormData(updatedLead);
  };

  if (!leadState || !formData) {
    return (
      <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
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
            Lead not found
          </h2>

          <p style={{ margin: "10px 0 0", color: colors.subText }}>
            The requested lead does not exist or may have been removed.
          </p>

          <div style={{ marginTop: 20 }}>
            <Link
              to={leadsBackLink}
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
              Back to Leads
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const lead = leadState;
  const overdue = isOverdue(lead.followUpDate, lead.status);
  const leadHealth = getLeadHealthScore(lead);
  const filteredTimeline = lead.timeline.filter((item) =>
    toneMatchesFilter(item.tone, activityFilter)
  );
  const pipelineIndex = PIPELINE_STEPS.indexOf(lead.status);

  const updateStatus = (nextStatus: LeadStatus) => {
    persistLeadUpdate((prev) => {
      const statusTimeline: TimelineItem = {
        title: "Status Updated",
        description: `Lead status changed to ${nextStatus}.`,
        time: getNowLabel(),
        tone:
          nextStatus === "Closed"
            ? "success"
            : nextStatus === "Negotiation"
            ? "warning"
            : nextStatus === "Qualified"
            ? "primary"
            : "info",
      };

      return {
        ...prev,
        status: nextStatus,
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [statusTimeline, ...(prev.timeline || [])],
      };
    });
  };

  const saveLeadChanges = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.owner.trim()
    ) {
      alert("Name, phone, city, owner fill பண்ணணும்.");
      return;
    }

    persistLeadUpdate((prev) => {
      const editTimeline: TimelineItem = {
        title: "Lead Updated",
        description: "Lead profile information was edited from the detail page.",
        time: getNowLabel(),
        tone: "primary",
      };

      return {
        ...prev,
        ...formData,
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [editTimeline, ...(prev.timeline || [])],
      };
    });

    setIsEditOpen(false);
  };

  const handleDeleteLead = () => {
    const confirmed = window.confirm(`Delete ${lead.name} from leads?`);
    if (!confirmed) return;

    const latestLeads = readStoredLeads();
    const updatedLeads = latestLeads.filter((item) => item.id !== lead.id);

    saveStoredLeads(updatedLeads);
    setAllLeads(updatedLeads);
    navigate(leadsBackLink);
  };

  const handleAddQuickNote = () => {
    if (!noteInput.trim()) return;

    persistLeadUpdate((prev) => {
      const existingNotes =
        prev.notes && prev.notes !== "No notes added yet." ? prev.notes : "";

      const nextNotes = existingNotes
        ? `${noteInput.trim()}\n\n${existingNotes}`
        : noteInput.trim();

      const noteTimeline: TimelineItem = {
        title: "Quick Note Added",
        description: noteInput.trim(),
        time: getNowLabel(),
        tone: "info",
      };

      return {
        ...prev,
        notes: nextNotes,
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [noteTimeline, ...(prev.timeline || [])],
      };
    });

    setNoteInput("");
  };

  const handleAddCallLog = () => {
    if (!callNote.trim()) return;

    persistLeadUpdate((prev) => {
      const nextCall: CallLogItem = {
        time: getNowLabel(),
        note: callNote.trim(),
        outcome: callOutcome,
      };

      const callTimeline: TimelineItem = {
        title: "Call Log Added",
        description: `${callOutcome}: ${callNote.trim()}`,
        time: getNowLabel(),
        tone: callOutcome.toLowerCase().includes("won")
          ? "success"
          : callOutcome.toLowerCase().includes("not")
          ? "danger"
          : "warning",
      };

      return {
        ...prev,
        callLogs: [nextCall, ...(prev.callLogs || [])],
        lastContact: getLastContactLabel(),
        updatedAt: new Date().toISOString(),
        timeline: [callTimeline, ...(prev.timeline || [])],
      };
    });

    setCallNote("");
    setCallOutcome("Connected");
  };

  const handleRescheduleFollowUp = () => {
    if (!followUpInput.trim()) return;

    persistLeadUpdate((prev) => {
      const timelineItem: TimelineItem = {
        title: "Follow-up Rescheduled",
        description: `Next follow-up moved to ${followUpInput}.`,
        time: getNowLabel(),
        tone: "warning",
      };

      return {
        ...prev,
        followUpDate: followUpInput,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });
  };

  const handleReassignOwner = () => {
    if (!ownerInput.trim()) return;

    persistLeadUpdate((prev) => {
      const timelineItem: TimelineItem = {
        title: "Owner Reassigned",
        description: `Lead owner changed to ${ownerInput.trim()}.`,
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

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;

    persistLeadUpdate((prev) => {
      const nextAttachment: AttachmentItem = {
        id: `${Date.now()}`,
        name: attachmentName.trim(),
        type: attachmentType,
        uploadedAt: getNowLabel(),
        sizeLabel: attachmentSize.trim() || "—",
      };

      const timelineItem: TimelineItem = {
        title: "Attachment Added",
        description: `${nextAttachment.name} uploaded under ${nextAttachment.type}.`,
        time: getNowLabel(),
        tone: "info",
      };

      return {
        ...prev,
        attachments: [nextAttachment, ...(prev.attachments || [])],
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    setAttachmentName("");
    setAttachmentSize("");
    setAttachmentType("Proposal");
  };

  const handleConvertToDeal = () => {
    if (lead.isConvertedToDeal) {
      alert("This lead is already converted to a deal.");
      return;
    }

    const latestDeals = readStoredDeals();
    const nextDeal = {
      id: Date.now(),
      leadId: lead.id,
      title: `${lead.name} Deal`,
      clientName: lead.name,
      company: lead.company,
      owner: lead.owner,
      status: "Open",
      stage: lead.status === "Negotiation" ? "Negotiation" : "Qualified",
      value: lead.budget || "—",
      city: lead.city,
      source: lead.source,
      createdAt: new Date().toISOString(),
    };

    saveStoredDeals([nextDeal, ...latestDeals]);

    persistLeadUpdate((prev) => {
      const timelineItem: TimelineItem = {
        title: "Converted to Deal",
        description: `Lead converted into active deal with value ${prev.budget || "—"}.`,
        time: getNowLabel(),
        tone: "success",
      };

      return {
        ...prev,
        isConvertedToDeal: true,
        convertedDealAt: new Date().toISOString(),
        convertedDealValue: prev.budget,
        updatedAt: new Date().toISOString(),
        timeline: [timelineItem, ...(prev.timeline || [])],
      };
    });

    alert("Lead converted to deal successfully.");
  };

  const handleOpenWhatsAppTemplate = (template: string) => {
    const text = template
      .replace("{name}", lead.name)
      .replace("{company}", lead.company || "");

    const phone = lead.phone.replace(/\D/g, "");
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AppLayout title="Lead Detail" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 22,
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
                Dashboard / Leads / {lead.id}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 32,
                  color: colors.text,
                  fontWeight: 800,
                }}
              >
                {lead.name}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Single lead control room — full profile, follow-up plan, notes, call history, and conversion actions.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {overdue && (
                <span
                  style={{
                    display: "inline-block",
                    background: colors.danger,
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Overdue Follow-up
                </span>
              )}

              {lead.isConvertedToDeal && (
                <span
                  style={{
                    display: "inline-block",
                    background: colors.success,
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Deal Converted
                </span>
              )}

              <span
                style={{
                  display: "inline-block",
                  background: getPriorityColor(lead.priority, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {lead.priority} Priority
              </span>

              <span
                style={{
                  display: "inline-block",
                  background: getStatusColor(lead.status, mode),
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {lead.status}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <a href={`tel:${lead.phone}`} style={primaryLinkButton(colors)}>
              Call
            </a>

            {lead.phone && lead.phone !== "-" ? (
              <a
                href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={secondaryLinkButton(colors)}
              >
                WhatsApp
              </a>
            ) : null}

            {lead.email && lead.email !== "-" ? (
              <a href={`mailto:${lead.email}`} style={secondaryLinkButton(colors)}>
                Email
              </a>
            ) : null}

            <button
              onClick={handleConvertToDeal}
              style={{
                ...primaryButton(colors),
                opacity: lead.isConvertedToDeal ? 0.65 : 1,
                cursor: lead.isConvertedToDeal ? "not-allowed" : "pointer",
              }}
              disabled={lead.isConvertedToDeal}
            >
              Convert to Deal
            </button>

            <button
              onClick={() => {
                setFormData(lead);
                setIsEditOpen(true);
              }}
              style={secondaryButton(colors)}
            >
              Edit Lead
            </button>

            <button onClick={handleDeleteLead} style={dangerButton(colors)}>
              Delete
            </button>

            <Link to={leadsBackLink} style={secondaryLinkButton(colors)}>
              Back to Leads
            </Link>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 16,
          }}
        >
          <MiniStatCard label="Lead Health" value={`${leadHealth}/100`} colors={colors} />
          <MiniStatCard label="Stage Probability" value={getStageProbability(lead.status)} colors={colors} />
          <MiniStatCard label="Calls Logged" value={String(lead.callLogs.length)} colors={colors} />
          <MiniStatCard label="Attachments" value={String(lead.attachments?.length || 0)} colors={colors} />
          <MiniStatCard label="Timeline Events" value={String(lead.timeline.length)} colors={colors} />
          <MiniStatCard label="Current Stage" value={lead.status} colors={colors} />
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 20,
            boxShadow: colors.shadowSoft,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: colors.text,
              marginBottom: 16,
            }}
          >
            Lead Summary
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            <DetailCard label="Lead ID" value={String(lead.id)} colors={colors} />
            <DetailCard label="Phone" value={lead.phone} colors={colors} />
            <DetailCard label="Email" value={lead.email} colors={colors} />
            <DetailCard label="Source" value={lead.source} colors={colors} />
            <DetailCard label="City" value={lead.city} colors={colors} />
            <DetailCard label="Company" value={lead.company} colors={colors} />
            <DetailCard label="Owner" value={lead.owner} colors={colors} />
            <DetailCard label="Budget" value={lead.budget} colors={colors} />
            <DetailCard label="Follow-up Date" value={lead.followUpDate} colors={colors} />
            <DetailCard label="Last Contact" value={lead.lastContact} colors={colors} />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.35fr) minmax(300px, 0.85fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <InfoPanel title="Lead Information" colors={colors}>
              <InfoGrid
                colors={colors}
                items={[
                  ["Full Name", lead.name],
                  ["Phone", lead.phone],
                  ["Alternate Number", lead.alternatePhone || "-"],
                  ["Email", lead.email],
                  ["Company", lead.company],
                  ["City", lead.city],
                  ["Address", lead.address || "-"],
                  ["Preferred Language", lead.preferredLanguage || "-"],
                  ["Lead Source", lead.source],
                  ["Campaign", lead.campaign || "-"],
                  ["Reference By", lead.referredBy || "-"],
                  ["Owner", lead.owner],
                ]}
              />
            </InfoPanel>

            <InfoPanel title="Requirement Details" colors={colors}>
              <InfoGrid
                colors={colors}
                items={[
                  ["Requirement", lead.requirement],
                  ["Budget", lead.budget],
                  ["Purchase Timeline", lead.timelineLabel || "-"],
                  ["Financing Type", lead.financingType || "-"],
                  ["Purpose", lead.purpose || "-"],
                  ["Sq.ft", lead.sqft || "-"],
                  ["Facing", lead.facing || "-"],
                  ["Floor Preference", lead.floorPreference || "-"],
                ]}
              />
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
                Notes
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
                  marginBottom: 14,
                }}
              >
                {lead.notes}
              </div>

              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={4}
                placeholder="Write a fresh update, objection note, or follow-up note..."
                style={{
                  ...inputStyle(colors),
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleAddQuickNote} style={primaryButton(colors)}>
                  Add Note
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
                Call Log
              </div>

              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  style={inputStyle(colors)}
                >
                  <option value="Connected">Connected</option>
                  <option value="Interested">Interested</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Not Reachable">Not Reachable</option>
                  <option value="Won">Won</option>
                </select>

                <textarea
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  rows={3}
                  placeholder="Add call summary..."
                  style={{
                    ...inputStyle(colors),
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={handleAddCallLog} style={primaryButton(colors)}>
                    Add Call Log
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {lead.callLogs.length > 0 ? (
                  lead.callLogs.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        background: colors.cardBgSoft,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 14,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            color: colors.text,
                            fontSize: 15,
                            fontWeight: 700,
                          }}
                        >
                          {log.outcome}
                        </div>

                        <div
                          style={{
                            color: colors.mutedText,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {log.time}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: colors.subText,
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}
                      >
                        {log.note}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyStateCard text="No call logs yet." colors={colors} />
                )}
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: colors.text,
                  }}
                >
                  Activity Timeline
                </div>

                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value as ActivityFilter)}
                  style={inputStyle(colors)}
                >
                  <option value="All">All</option>
                  <option value="Info">Info</option>
                  <option value="Success">Success</option>
                  <option value="Warning">Warning</option>
                  <option value="Danger">Danger</option>
                  <option value="Primary">Primary</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {filteredTimeline.length > 0 ? (
                  filteredTimeline.map((item, index) => {
                    const dotColor = getTimelineToneColor(item.tone, colors);

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
                  <EmptyStateCard text="No timeline activity for this filter." colors={colors} />
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start", position: "sticky", top: 16 }}>
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
                Status & Pipeline
              </div>

              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {PIPELINE_STEPS.map((step, index) => {
                  const isDone = index <= pipelineIndex;
                  return (
                    <div
                      key={step}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "32px 1fr",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 800,
                          background: isDone ? colors.primary : colors.cardBgSoft,
                          color: isDone ? "#ffffff" : colors.subText,
                          border: `1px solid ${isDone ? colors.primary : colors.border}`,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          color: isDone ? colors.text : colors.subText,
                          fontWeight: isDone ? 700 : 600,
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>

              <select
                value={lead.status}
                onChange={(e) => updateStatus(e.target.value as LeadStatus)}
                style={inputStyle(colors)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed">Closed</option>
              </select>
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
                Reschedule Follow-up
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <input
                  type="date"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  style={inputStyle(colors)}
                />

                <button onClick={handleRescheduleFollowUp} style={primaryButton(colors)}>
                  Save Follow-up Date
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
                Reassign Owner
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

                <button onClick={handleReassignOwner} style={primaryButton(colors)}>
                  Save Owner
                </button>
              </div>
            </div>

            <InfoPanel title="Assigned Owner" colors={colors}>
              <InfoGrid
                colors={colors}
                items={[
                  ["Owner", lead.owner],
                  ["Email", lead.ownerEmail || "-"],
                  ["Phone", lead.ownerPhone || "-"],
                ]}
              />
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
                Attachments
              </div>

              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="Document name"
                  style={inputStyle(colors)}
                />

                <select
                  value={attachmentType}
                  onChange={(e) => setAttachmentType(e.target.value)}
                  style={inputStyle(colors)}
                >
                  <option value="Proposal">Proposal</option>
                  <option value="Quotation">Quotation</option>
                  <option value="KYC">KYC</option>
                  <option value="Agreement">Agreement</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  value={attachmentSize}
                  onChange={(e) => setAttachmentSize(e.target.value)}
                  placeholder="Size label (e.g. 1.2 MB)"
                  style={inputStyle(colors)}
                />

                <button onClick={handleAddAttachment} style={primaryButton(colors)}>
                  Add Attachment
                </button>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {(lead.attachments || []).length > 0 ? (
                  (lead.attachments || []).map((file) => (
                    <div
                      key={file.id}
                      style={{
                        background: colors.cardBgSoft,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 14,
                        padding: 14,
                      }}
                    >
                      <div style={{ fontWeight: 800, color: colors.text }}>{file.name}</div>
                      <div style={{ marginTop: 6, fontSize: 13, color: colors.subText }}>
                        {file.type} · {file.sizeLabel} · {file.uploadedAt}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyStateCard text="No attachments yet." colors={colors} />
                )}
              </div>
            </div>

            <InfoPanel title="Tags / Labels" colors={colors}>
              <TagWrap
                colors={colors}
                items={lead.tags && lead.tags.length > 0 ? lead.tags : ["No tags added"]}
              />
            </InfoPanel>

            <InfoPanel title="Objections / Pain Points" colors={colors}>
              <TagWrap
                colors={colors}
                items={
                  lead.objections && lead.objections.length > 0
                    ? lead.objections
                    : ["No objections captured yet"]
                }
                danger
              />
            </InfoPanel>

            <InfoPanel title="Conversion Insight" colors={colors}>
              <InfoGrid
                colors={colors}
                items={[
                  ["Lead Health", `${leadHealth}/100`],
                  ["Stage Probability", getStageProbability(lead.status)],
                  ["Deal Value", lead.convertedDealValue || lead.budget || "-"],
                  ["Converted", lead.isConvertedToDeal ? "Yes" : "No"],
                ]}
              />
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
                Lead Navigation
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <button
                  onClick={() =>
                    previousLead &&
                    navigate(`/leads/${previousLead.id}${location.search || ""}`)
                  }
                  disabled={!previousLead}
                  style={{
                    ...secondaryButton(colors),
                    opacity: previousLead ? 1 : 0.5,
                    cursor: previousLead ? "pointer" : "not-allowed",
                  }}
                >
                  ← Previous Lead
                </button>

                <button
                  onClick={() =>
                    nextLead &&
                    navigate(`/leads/${nextLead.id}${location.search || ""}`)
                  }
                  disabled={!nextLead}
                  style={{
                    ...secondaryButton(colors),
                    opacity: nextLead ? 1 : 0.5,
                    cursor: nextLead ? "pointer" : "not-allowed",
                  }}
                >
                  Next Lead →
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
                WhatsApp Quick Templates
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {WHATSAPP_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenWhatsAppTemplate(template)}
                    style={{
                      ...secondaryButton(colors),
                      textAlign: "left",
                    }}
                  >
                    {template.replace("{name}", lead.name)}
                  </button>
                ))}
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
              maxWidth: 920,
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              boxSizing: "border-box",
              boxShadow: colors.shadowCard,
              maxHeight: "90vh",
              overflowY: "auto",
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
                Edit Lead
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.subText,
                }}
              >
                Update lead profile, requirement details, owner, and follow-up details.
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
                  setFormData((prev) => (prev ? { ...prev, name: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Phone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, phone: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Alternate Phone"
                value={formData.alternatePhone || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, alternatePhone: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Email"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, email: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Company"
                value={formData.company}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, company: value } : prev))
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
                label="Address"
                value={formData.address || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, address: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Source"
                value={formData.source}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, source: value } : prev))
                }
                colors={colors}
              />

              <InputField
                label="Campaign"
                value={formData.campaign || ""}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, campaign: value } : prev))
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
                label="Budget"
                value={formData.budget}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, budget: value } : prev))
                }
                colors={colors}
              />

              <SelectField
                label="Status"
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, status: value as LeadStatus } : prev
                  )
                }
                options={["New", "Contacted", "Qualified", "Follow-up", "Negotiation", "Closed"]}
                colors={colors}
              />

              <SelectField
                label="Priority"
                value={formData.priority}
                onChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, priority: value as LeadPriority } : prev
                  )
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
                  value={formData.followUpDate === "-" ? "" : formData.followUpDate}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, followUpDate: e.target.value || "-" } : prev
                    )
                  }
                  style={inputStyle(colors)}
                />
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 14 }}>
              <TextAreaField
                label="Requirement"
                value={formData.requirement}
                onChange={(value) =>
                  setFormData((prev) => (prev ? { ...prev, requirement: value } : prev))
                }
                colors={colors}
              />

              <TextAreaField
                label="Notes"
                value={formData.notes}
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

              <button onClick={saveLeadChanges} style={primaryButton(colors)}>
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

      {children}
    </div>
  );
}

function InfoGrid({
  items,
  colors,
}: {
  items: Array<[string, string]>;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      {items.map(([label, value]) => (
        <div
          key={`${label}-${value}`}
          style={{
            background: colors.cardBgSoft,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div
            style={{
              color: colors.subText,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {label}
          </div>
          <div
            style={{
              color: colors.text,
              fontSize: 14,
              lineHeight: 1.6,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {value || "-"}
          </div>
        </div>
      ))}
    </div>
  );
}

function TagWrap({
  items,
  colors,
  danger = false,
}: {
  items: string[];
  colors: ReturnType<typeof getTheme>;
  danger?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: 999,
            background: colors.cardBgSoft,
            border: `1px solid ${colors.border}`,
            color: danger ? colors.danger : colors.text,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyStateCard({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
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
      {text}
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

function secondaryLinkButton(colors: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    display: "inline-block",
    textDecoration: "none",
    border: `1px solid ${colors.border}`,
    background: colors.cardBg,
    color: colors.text,
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
  };
}