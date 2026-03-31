import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type LeadStatus = "New" | "Follow-up" | "Visit Planned" | "Closed" | "Lost";
type PropertyType = "Plot" | "Flat" | "Villa" | "Land" | "Commercial";
type AreaUnit = "sqft" | "cent" | "ground" | "acre";
type LeadPriority = "Low" | "Medium" | "High" | "Hot";
type ActivityType =
  | "created"
  | "note"
  | "call"
  | "status"
  | "owner"
  | "reschedule"
  | "updated"
  | "priority";

type ActivityItem = {
  id: string;
  type: ActivityType;
  text: string;
  createdAt: string;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  location: string;
  source: string;
  owner: string;
  status: LeadStatus;
  priority: LeadPriority;
  dealValue: number | string;
  followUp: string;
  createdAt: string;
  lastUpdatedAt?: string;
  propertyType: PropertyType;
  areaValue: string;
  areaUnit: AreaUnit | string;
  facing: string;
  bhk?: string;
  notes?: string[];
  activities?: ActivityItem[];
  leadScore?: number;
};

type SortOption =
  | "latest_created"
  | "followup_asc"
  | "dealvalue_desc"
  | "updated_desc"
  | "priority_desc";

type ToastType = "success" | "info" | "error";

const STORAGE_KEY = "mei_leads_v1";

const owners = ["Ravi", "Meena", "Sabari", "Admin"] as const;
const statusOptions: LeadStatus[] = [
  "New",
  "Follow-up",
  "Visit Planned",
  "Closed",
  "Lost",
];
const propertyTypeOptions: PropertyType[] = [
  "Plot",
  "Flat",
  "Villa",
  "Land",
  "Commercial",
];
const areaUnitOptions: AreaUnit[] = ["sqft", "cent", "ground", "acre"];
const priorityOptions: LeadPriority[] = ["Low", "Medium", "High", "Hot"];

const ownerPhoneMap: Record<string, string> = {
  Ravi: "919876543210",
  Meena: "919876543211",
  Sabari: "919884452255",
  Admin: "919876543213",
};

const callOutcomeOptions = [
  "Called",
  "No Answer",
  "Interested",
  "Not Interested",
  "Visit Fixed",
] as const;

const emptyLeadForm = {
  name: "",
  phone: "",
  location: "",
  source: "Website",
  owner: "",
  status: "New" as LeadStatus,
  priority: "Medium" as LeadPriority,
  propertyType: "Plot" as PropertyType,
  areaValue: "",
  areaUnit: "sqft" as AreaUnit,
  facing: "",
  bhk: "",
  dealValue: "",
  followUp: "",
};

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function formatDateTime(dateLike?: string) {
  if (!dateLike) return "-";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return dateLike;
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateLike?: string) {
  if (!dateLike) return "-";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return dateLike;

  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24) return `${hrs} hr ago`;
  return `${days} day ago`;
}

function normalizeDate(dateStr: string) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateStr.match(ddmmyyyy);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }

  return dateStr;
}

function makeIsoNow() {
  return new Date().toISOString();
}

function makeActivity(type: ActivityType, text: string): ActivityItem {
  return {
    id: crypto.randomUUID(),
    type,
    text,
    createdAt: makeIsoNow(),
  };
}

function priorityWeight(priority: LeadPriority) {
  return priority === "Hot"
    ? 4
    : priority === "High"
    ? 3
    : priority === "Medium"
    ? 2
    : 1;
}

function computeLeadScore(lead: Partial<Lead>): number {
  let score = 0;

  const dealValue = Number(lead.dealValue || 0);
  const priority = (lead.priority || "Medium") as LeadPriority;
  const status = (lead.status || "New") as LeadStatus;
  const source = (lead.source || "").toLowerCase();

  score +=
    priority === "Hot"
      ? 40
      : priority === "High"
      ? 28
      : priority === "Medium"
      ? 18
      : 8;

  score += dealValue >= 10000000 ? 25 : dealValue >= 5000000 ? 18 : dealValue > 0 ? 10 : 0;

  score +=
    status === "New"
      ? 10
      : status === "Follow-up"
      ? 14
      : status === "Visit Planned"
      ? 20
      : status === "Closed"
      ? 30
      : 0;

  score += source.includes("referral")
    ? 12
    : source.includes("website")
    ? 8
    : source.includes("99acres")
    ? 7
    : 5;

  if (lead.phone) score += 5;
  if (lead.location) score += 5;
  if (lead.followUp) score += 5;

  return Math.min(score, 100);
}

function exportLeadsToCsv(leads: Lead[]) {
  const headers = [
    "Name",
    "Phone",
    "Location",
    "Source",
    "Owner",
    "Status",
    "Priority",
    "Lead Score",
    "Deal Value",
    "Follow-up",
    "Created At",
    "Last Updated",
    "Property Info",
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.phone,
    lead.location,
    lead.source,
    lead.owner,
    lead.status,
    lead.priority,
    String(lead.leadScore ?? computeLeadScore(lead)),
    String(lead.dealValue ?? ""),
    lead.followUp,
    lead.createdAt,
    lead.lastUpdatedAt || "",
    [
      lead.propertyType,
      ["Flat", "Villa"].includes(lead.propertyType) && lead.bhk ? `${lead.bhk} BHK` : "",
      lead.areaValue && lead.areaUnit ? `${lead.areaValue} ${lead.areaUnit}` : "",
      lead.facing || "",
    ]
      .filter(Boolean)
      .join(" • "),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mei-leads-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function safeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function seedLeads(): Lead[] {
  const now = makeIsoNow();

  const base: Lead[] = [
    {
      id: crypto.randomUUID(),
      name: "Paul",
      phone: "7358162409",
      location: "Chennai",
      source: "99acres",
      owner: "Ravi",
      status: "Follow-up",
      priority: "High",
      dealValue: 3600000,
      followUp: "2026-03-31",
      createdAt: "2026-03-29",
      lastUpdatedAt: now,
      propertyType: "Plot",
      areaValue: "2400",
      areaUnit: "sqft",
      facing: "East",
      bhk: "",
      notes: [
        "29/03/2026 - Asked for east facing plot options.",
        "29/03/2026 - Wants callback after 6 PM.",
      ],
      activities: [
        makeActivity("created", "Lead created from 99acres."),
        makeActivity("note", "Asked for east facing plot options."),
        makeActivity("note", "Wants callback after 6 PM."),
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Kumar",
      phone: "9885544771",
      location: "Chennai",
      source: "Referral",
      owner: "Admin",
      status: "Follow-up",
      priority: "Medium",
      dealValue: 12200000,
      followUp: "2026-03-31",
      createdAt: "2026-03-29",
      lastUpdatedAt: now,
      propertyType: "Flat",
      areaValue: "1200",
      areaUnit: "sqft",
      facing: "North",
      bhk: "2",
      notes: ["29/03/2026 - Interested in ready-to-move flat."],
      activities: [
        makeActivity("created", "Lead created from referral."),
        makeActivity("note", "Interested in ready-to-move flat."),
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Arun Kumar",
      phone: "9876543210",
      location: "Whitefield",
      source: "Website",
      owner: "Meena",
      status: "New",
      priority: "Hot",
      dealValue: 4500000,
      followUp: "2026-03-30",
      createdAt: "2026-03-28",
      lastUpdatedAt: now,
      propertyType: "Villa",
      areaValue: "2400",
      areaUnit: "sqft",
      facing: "East",
      bhk: "3",
      notes: [],
      activities: [makeActivity("created", "Lead created from website.")],
    },
    {
      id: crypto.randomUUID(),
      name: "Bharathi",
      phone: "9884452255",
      location: "Bangalore",
      source: "99acres",
      owner: "Sabari",
      status: "Follow-up",
      priority: "High",
      dealValue: 5000000,
      followUp: "2026-03-31",
      createdAt: "2026-03-30",
      lastUpdatedAt: now,
      propertyType: "Villa",
      areaValue: "1200",
      areaUnit: "sqft",
      facing: "North",
      bhk: "5",
      notes: [],
      activities: [makeActivity("created", "Lead created from 99acres.")],
    },
  ];

  return base.map((lead) => ({
    ...lead,
    leadScore: computeLeadScore(lead),
  }));
}

function toSafeLead(raw: any): Lead {
  const createdAt = normalizeDate(safeString(raw?.createdAt, getTodayString()));
  const lastUpdatedAt = safeString(raw?.lastUpdatedAt, makeIsoNow());
  const notes = safeArray<string>(raw?.notes);
  const activitiesRaw = safeArray<ActivityItem>(raw?.activities);

  const notesToActivities =
    activitiesRaw.length > 0
      ? activitiesRaw
      : [
          makeActivity(
            "created",
            `Lead created from ${safeString(raw?.source, "Website")}.`
          ),
          ...notes.map((note) => makeActivity("note", note)),
        ];

  return {
    id: safeString(raw?.id, crypto.randomUUID()),
    name: safeString(raw?.name),
    phone: safeString(raw?.phone),
    location: safeString(raw?.location),
    source: safeString(raw?.source, "Website"),
    owner: safeString(raw?.owner, "Admin"),
    status: (safeString(raw?.status, "New") as LeadStatus) || "New",
    priority:
      (safeString(raw?.priority, "Medium") as LeadPriority) || "Medium",
    dealValue: raw?.dealValue ?? "",
    followUp: normalizeDate(safeString(raw?.followUp)),
    createdAt,
    lastUpdatedAt,
    propertyType:
      (safeString(raw?.propertyType, "Plot") as PropertyType) || "Plot",
    areaValue: safeString(raw?.areaValue),
    areaUnit: safeString(raw?.areaUnit, "sqft"),
    facing: safeString(raw?.facing),
    bhk: safeString(raw?.bhk),
    notes,
    activities: notesToActivities,
    leadScore: Number(raw?.leadScore ?? computeLeadScore(raw)),
  };
}

function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [ownerFilter, setOwnerFilter] = useState(
    searchParams.get("owner") || "All Owners"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All Status"
  );
  const [sourceFilter, setSourceFilter] = useState(
    searchParams.get("source") || "All Sources"
  );
  const [specialFilter, setSpecialFilter] = useState(
    searchParams.get("filter") || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "latest_created"
  );

  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [callOutcome, setCallOutcome] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const [form, setForm] = useState({ ...emptyLeadForm });
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    text: string;
  }>({
    show: false,
    type: "info",
    text: "",
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const showToast = (text: string, type: ToastType = "info") => {
    setToast({ show: true, type, text });
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const safeLeads = Array.isArray(parsed) ? parsed.map(toSafeLead) : [];
        setLeads(safeLeads);
        return;
      } catch (error) {
        console.error("Failed to parse leads:", error);
      }
    }

    const demoLeads = seedLeads();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLeads));
    setLeads(demoLeads);
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setOwnerFilter(searchParams.get("owner") || "All Owners");
    setStatusFilter(searchParams.get("status") || "All Status");
    setSourceFilter(searchParams.get("source") || "All Sources");
    setSpecialFilter(searchParams.get("filter") || "");
    setSortBy((searchParams.get("sort") as SortOption) || "latest_created");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
        setDrawerLeadId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const normalizeNoteStamp = (text: string) => {
    return `${new Date().toLocaleDateString("en-GB")} ${new Date().toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )} - ${text.trim()}`;
  };

  const saveToStorage = (updated: Lead[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLeads(updated);
  };

  const autoAssignOwner = (name: string) => {
    if (!name.trim()) return "Admin";
    const index = name.trim().charCodeAt(0) % owners.length;
    return owners[index];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "propertyType" && !["Flat", "Villa"].includes(value)) {
        updated.bhk = "";
      }

      return updated;
    });
  };

  const resetForm = () => {
    setForm({ ...emptyLeadForm });
    setEditingLeadId(null);
  };

  const getPropertyInfo = (lead: Lead) => {
    const parts: string[] = [];

    if (lead.propertyType) parts.push(lead.propertyType);
    if (["Flat", "Villa"].includes(lead.propertyType) && lead.bhk) {
      parts.push(`${lead.bhk} BHK`);
    }
    if (lead.areaValue && lead.areaUnit) {
      parts.push(`${lead.areaValue} ${lead.areaUnit}`);
    }
    if (lead.facing) parts.push(lead.facing);

    return parts.join(" • ");
  };

  const getLatestNote = (lead: Lead) => {
    if (!lead.notes || lead.notes.length === 0) return "";
    return lead.notes[lead.notes.length - 1];
  };

  const formatCurrency = (value: number | string) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "-";
    return `₹ ${num.toLocaleString("en-IN")}`;
  };

  const buildLeadWhatsappMessage = (lead: Lead) => {
    return `Hi ${lead.name}, this is MEI Business OS.

Following up regarding your property inquiry.

Property: ${getPropertyInfo(lead) || "-"}
Location: ${lead.location}
Source: ${lead.source}
Priority: ${lead.priority}
Deal Value: ${formatCurrency(lead.dealValue)}
Follow-up Date: ${lead.followUp || "-"}

Our team will contact you shortly.`;
  };

  const buildOwnerWhatsappMessage = (lead: Lead) => {
    return `New Lead Assigned

Name: ${lead.name}
Phone: ${lead.phone}
Location: ${lead.location}
Source: ${lead.source}
Property: ${getPropertyInfo(lead) || "-"}
Assigned Owner: ${lead.owner}
Priority: ${lead.priority}
Deal Value: ${formatCurrency(lead.dealValue)}
Follow-up: ${lead.followUp || "-"}

Please contact this lead immediately.`;
  };

  const openWhatsApp = (phone: string, message: string) => {
    if (!phone) {
      showToast("Phone number missing.", "error");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
  };

  const callLead = (phone: string) => {
    if (!phone) {
      showToast("Phone number missing.", "error");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      showToast("Phone copied.", "success");
    } catch {
      showToast("Copy failed.", "error");
    }
  };

  const isOverdue = (lead: Lead) => {
    const follow = normalizeDate(lead.followUp);
    if (!follow) return false;
    if (lead.status === "Closed" || lead.status === "Lost") return false;
    return follow < todayString;
  };

  const isTodayFollowUp = (lead: Lead) => {
    const follow = normalizeDate(lead.followUp);
    if (!follow) return false;
    if (lead.status === "Closed" || lead.status === "Lost") return false;
    return follow === todayString;
  };

  const isTomorrowFollowUp = (lead: Lead) => {
    const follow = normalizeDate(lead.followUp);
    if (!follow) return false;
    if (lead.status === "Closed" || lead.status === "Lost") return false;
    return follow === tomorrowString;
  };

  const appendActivity = (
    lead: Lead,
    activity: ActivityItem,
    patch?: Partial<Lead>
  ): Lead => {
    const nextLead = {
      ...lead,
      ...patch,
      activities: [...(lead.activities || []), activity],
      lastUpdatedAt: makeIsoNow(),
    };

    return {
      ...nextLead,
      leadScore: computeLeadScore(nextLead),
    };
  };

  const addQuickNoteToLead = (leadId: string) => {
    const noteText = window.prompt("Enter note for this lead:");
    if (!noteText || !noteText.trim()) return;

    const stampedNote = normalizeNoteStamp(noteText);

    const updated = leads.map((lead) =>
      lead.id === leadId
        ? appendActivity(
            {
              ...lead,
              notes: [...(lead.notes || []), stampedNote],
            },
            makeActivity("note", noteText.trim())
          )
        : lead
    );

    saveToStorage(updated);
    setOpenMenuId(null);
    showToast("Note added successfully.", "success");
  };

  const openActivityDrawer = (leadId: string) => {
    const selected = leads.find((lead) => lead.id === leadId);
    setDrawerLeadId(leadId);
    setNewNoteText("");
    setCallOutcome("");
    setRescheduleDate(selected?.followUp || "");
    setOpenMenuId(null);
  };

  const closeActivityDrawer = () => {
    setDrawerLeadId(null);
    setNewNoteText("");
    setCallOutcome("");
    setRescheduleDate("");
  };

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === drawerLeadId) || null,
    [leads, drawerLeadId]
  );

  const savePanelNote = () => {
    if (!selectedLead) return;
    if (!newNoteText.trim()) return;

    const stampedNote = normalizeNoteStamp(newNoteText);

    const updated = leads.map((lead) =>
      lead.id === selectedLead.id
        ? appendActivity(
            {
              ...lead,
              notes: [...(lead.notes || []), stampedNote],
            },
            makeActivity("note", newNoteText.trim())
          )
        : lead
    );

    saveToStorage(updated);
    setNewNoteText("");
    showToast("Note saved.", "success");
  };

  const saveCallLogAndReschedule = () => {
    if (!selectedLead) return;

    const logParts: string[] = [];
    if (callOutcome) logParts.push(`Outcome: ${callOutcome}`);
    if (rescheduleDate)
      logParts.push(`Next Follow-up: ${normalizeDate(rescheduleDate)}`);
    if (newNoteText.trim()) logParts.push(`Note: ${newNoteText.trim()}`);

    if (logParts.length === 0) {
      showToast("Add call outcome, date, or note before saving.", "error");
      return;
    }

    const stampedLog = normalizeNoteStamp(logParts.join(" | "));

    const nextStatus: LeadStatus =
      callOutcome === "Visit Fixed"
        ? "Visit Planned"
        : callOutcome === "Not Interested"
        ? "Lost"
        : callOutcome === "Interested" ||
          callOutcome === "Called" ||
          callOutcome === "No Answer"
        ? "Follow-up"
        : selectedLead.status;

    const updated = leads.map((lead) =>
      lead.id === selectedLead.id
        ? appendActivity(
            {
              ...lead,
              status: nextStatus,
              followUp: rescheduleDate
                ? normalizeDate(rescheduleDate)
                : lead.followUp,
              notes: [...(lead.notes || []), stampedLog],
            },
            makeActivity(
              "call",
              `Call updated. ${
                callOutcome ? `Outcome: ${callOutcome}. ` : ""
              }${
                rescheduleDate
                  ? `Follow-up moved to ${normalizeDate(rescheduleDate)}. `
                  : ""
              }${newNoteText.trim() ? `Note: ${newNoteText.trim()}` : ""}`
            )
          )
        : lead
    );

    saveToStorage(updated);
    setNewNoteText("");
    setCallOutcome("");
    showToast("Call log and follow-up updated.", "success");
  };

  const handleSaveLead = () => {
    if (!form.name || !form.phone || !form.location) {
      showToast("Name, Phone, Location required.", "error");
      return;
    }

    if (editingLeadId) {
      const updated = leads.map((lead) =>
        lead.id === editingLeadId
          ? appendActivity(
              (() => {
                const patchedLead = {
                  ...lead,
                  ...form,
                  followUp: normalizeDate(form.followUp),
                };
                return patchedLead;
              })(),
              makeActivity("updated", "Lead details updated from edit form.")
            )
          : lead
      );
      saveToStorage(updated);
      resetForm();
      showToast("Lead updated successfully.", "success");
      return;
    }

    const assignedOwner = form.owner || autoAssignOwner(form.name);

    const baseLead: Lead = {
      id: crypto.randomUUID(),
      name: form.name,
      phone: form.phone,
      location: form.location,
      source: form.source,
      owner: assignedOwner,
      status: form.status,
      priority: form.priority,
      propertyType: form.propertyType,
      areaValue: form.areaValue,
      areaUnit: form.areaUnit,
      facing: form.facing,
      bhk: form.bhk,
      dealValue: form.dealValue,
      followUp: normalizeDate(form.followUp),
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdatedAt: makeIsoNow(),
      notes: [],
      activities: [
        makeActivity(
          "created",
          `Lead created from ${form.source} and assigned to ${assignedOwner}.`
        ),
      ],
    };

    const newLead: Lead = {
      ...baseLead,
      leadScore: computeLeadScore({
        ...form,
        owner: assignedOwner,
      }),
    };

    const updated = [newLead, ...leads];
    saveToStorage(updated);
    resetForm();
    showToast("Lead saved successfully.", "success");

    const ok = window.confirm(
      `Lead auto assigned to ${assignedOwner}. Send WhatsApp alert now?`
    );

    if (ok) {
      openWhatsApp(
        ownerPhoneMap[assignedOwner],
        buildOwnerWhatsappMessage(newLead)
      );
    }
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setForm({
      name: lead.name || "",
      phone: lead.phone || "",
      location: lead.location || "",
      source: lead.source || "Website",
      owner: lead.owner || "",
      status: lead.status || "New",
      priority: lead.priority || "Medium",
      propertyType: lead.propertyType || "Plot",
      areaValue: lead.areaValue || "",
      areaUnit: (lead.areaUnit as AreaUnit) || "sqft",
      facing: lead.facing || "",
      bhk: lead.bhk || "",
      dealValue: String(lead.dealValue || ""),
      followUp: normalizeDate(lead.followUp) || "",
    });

    setOpenMenuId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLead = (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this lead?");
    if (!ok) return;

    const updated = leads.filter((lead) => lead.id !== id);
    saveToStorage(updated);

    if (editingLeadId === id) resetForm();
    if (drawerLeadId === id) closeActivityDrawer();

    setSelectedLeadIds((prev) => prev.filter((leadId) => leadId !== id));
    setOpenMenuId(null);
    showToast("Lead deleted successfully.", "success");
  };

  const updateLeadOwner = (id: string, owner: string) => {
    const selected = leads.find((lead) => lead.id === id);
    if (!selected) return;

    const updated = leads.map((lead) =>
      lead.id === id
        ? appendActivity(
            { ...lead, owner },
            makeActivity("owner", `Owner changed from ${selected.owner} to ${owner}.`)
          )
        : lead
    );
    saveToStorage(updated);
    showToast("Owner updated.", "success");
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const selected = leads.find((lead) => lead.id === id);
    if (!selected) return;

    const updated = leads.map((lead) =>
      lead.id === id
        ? appendActivity(
            { ...lead, status },
            makeActivity(
              "status",
              `Status changed from ${selected.status} to ${status}.`
            )
          )
        : lead
    );
    saveToStorage(updated);
    showToast("Status updated.", "success");
  };

  const updateLeadPriority = (id: string, priority: LeadPriority) => {
    const selected = leads.find((lead) => lead.id === id);
    if (!selected) return;

    const updated = leads.map((lead) =>
      lead.id === id
        ? appendActivity(
            { ...lead, priority },
            makeActivity(
              "priority",
              `Priority changed from ${selected.priority} to ${priority}.`
            )
          )
        : lead
    );
    saveToStorage(updated);
    showToast("Priority updated.", "success");
  };

  const quickSetStatus = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status);
    setOpenMenuId(null);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const sourceOptions = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.source).filter(Boolean)));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const result = leads.filter((lead) => {
      const query = searchTerm.toLowerCase().trim();

      const matchesOwner =
        ownerFilter === "All Owners" ? true : lead.owner === ownerFilter;

      const matchesStatus =
        statusFilter === "All Status" ? true : lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All Sources" ? true : lead.source === sourceFilter;

      const matchesSpecial =
        specialFilter === "overdue"
          ? isOverdue(lead)
          : specialFilter === "today"
          ? isTodayFollowUp(lead)
          : specialFilter === "hot"
          ? lead.priority === "Hot"
          : true;

      const latestNote = getLatestNote(lead).toLowerCase();

      const matchesSearch =
        !query ||
        lead.name?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query) ||
        lead.location?.toLowerCase().includes(query) ||
        lead.source?.toLowerCase().includes(query) ||
        lead.owner?.toLowerCase().includes(query) ||
        lead.status?.toLowerCase().includes(query) ||
        lead.priority?.toLowerCase().includes(query) ||
        lead.propertyType?.toLowerCase().includes(query) ||
        lead.areaUnit?.toLowerCase().includes(query) ||
        lead.facing?.toLowerCase().includes(query) ||
        getPropertyInfo(lead).toLowerCase().includes(query) ||
        latestNote.includes(query);

      return (
        matchesOwner &&
        matchesStatus &&
        matchesSource &&
        matchesSpecial &&
        matchesSearch
      );
    });

    const sorted = [...result].sort((a, b) => {
      if (sortBy === "followup_asc") {
        return normalizeDate(a.followUp).localeCompare(normalizeDate(b.followUp));
      }
      if (sortBy === "dealvalue_desc") {
        return Number(b.dealValue || 0) - Number(a.dealValue || 0);
      }
      if (sortBy === "updated_desc") {
        return (b.lastUpdatedAt || "").localeCompare(a.lastUpdatedAt || "");
      }
      if (sortBy === "priority_desc") {
        return priorityWeight(b.priority) - priorityWeight(a.priority);
      }
      return normalizeDate(b.createdAt).localeCompare(normalizeDate(a.createdAt));
    });

    return sorted;
  }, [
    leads,
    searchTerm,
    ownerFilter,
    statusFilter,
    sourceFilter,
    specialFilter,
    sortBy,
  ]);

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredLeads.map((lead) => lead.id);
    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) => selectedLeadIds.includes(id));

    setSelectedLeadIds((prev) =>
      allSelected
        ? prev.filter((id) => !filteredIds.includes(id))
        : Array.from(new Set([...prev, ...filteredIds]))
    );
  };

  const bulkUpdateStatus = (status: LeadStatus) => {
    if (selectedLeadIds.length === 0) {
      showToast("Select leads first.", "error");
      return;
    }

    const updated = leads.map((lead) =>
      selectedLeadIds.includes(lead.id)
        ? appendActivity(
            {
              ...lead,
              status,
            },
            makeActivity("status", `Bulk status updated to ${status}.`)
          )
        : lead
    );

    saveToStorage(updated);
    setSelectedLeadIds([]);
    showToast(`Bulk status updated to ${status}.`, "success");
  };

  const summaryStats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "New").length,
      follow: leads.filter((l) => l.status === "Follow-up").length,
      visit: leads.filter((l) => l.status === "Visit Planned").length,
      closed: leads.filter((l) => l.status === "Closed").length,
      overdue: leads.filter((l) => isOverdue(l)).length,
      hot: leads.filter((l) => l.priority === "Hot").length,
    };
  }, [leads]);

  const reminderData = useMemo(() => {
    const todayItems = leads
      .filter(isTodayFollowUp)
      .sort((a, b) => a.name.localeCompare(b.name));

    const overdueItems = leads
      .filter(isOverdue)
      .sort((a, b) =>
        normalizeDate(a.followUp).localeCompare(normalizeDate(b.followUp))
      );

    const tomorrowItems = leads
      .filter(isTomorrowFollowUp)
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      todayItems,
      overdueItems,
      tomorrowItems,
    };
  }, [leads]);

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string }> = [];

    if (searchTerm.trim()) chips.push({ key: "search", label: `Search: ${searchTerm}` });
    if (ownerFilter !== "All Owners") chips.push({ key: "owner", label: `Owner: ${ownerFilter}` });
    if (statusFilter !== "All Status") chips.push({ key: "status", label: `Status: ${statusFilter}` });
    if (sourceFilter !== "All Sources") chips.push({ key: "source", label: `Source: ${sourceFilter}` });
    if (specialFilter === "overdue") chips.push({ key: "filter", label: "Overdue Only" });
    if (specialFilter === "today") chips.push({ key: "filter", label: "Today Only" });
    if (specialFilter === "hot") chips.push({ key: "filter", label: "Hot Leads" });
    if (sortBy !== "latest_created") chips.push({ key: "sort", label: `Sort: ${sortBy}` });

    return chips;
  }, [searchTerm, ownerFilter, statusFilter, sourceFilter, specialFilter, sortBy]);

  const updateQueryParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const shouldDelete =
        value === "" ||
        value === "All Owners" ||
        value === "All Status" ||
        value === "All Sources" ||
        value === "latest_created";

      if (shouldDelete) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    setSearchParams(next);
  };

  const handleRemoveChip = (key: string) => {
    if (key === "search") {
      setSearchTerm("");
      updateQueryParams({ search: "" });
      return;
    }
    if (key === "owner") {
      setOwnerFilter("All Owners");
      updateQueryParams({ owner: "" });
      return;
    }
    if (key === "status") {
      setStatusFilter("All Status");
      updateQueryParams({ status: "" });
      return;
    }
    if (key === "source") {
      setSourceFilter("All Sources");
      updateQueryParams({ source: "" });
      return;
    }
    if (key === "filter") {
      setSpecialFilter("");
      updateQueryParams({ filter: "" });
      return;
    }
    if (key === "sort") {
      setSortBy("latest_created");
      updateQueryParams({ sort: "" });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setOwnerFilter("All Owners");
    setStatusFilter("All Status");
    setSourceFilter("All Sources");
    setSpecialFilter("");
    setSortBy("latest_created");
    setSearchParams({});
  };

  return (
    <>
      <div style={{ padding: "28px" }}>
        <div style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "44px", fontWeight: 900, marginBottom: "8px" }}>
            All Leads
          </div>

          <div
            style={{
              color: "#9fb1d1",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span>
              Showing <strong style={{ color: "white" }}>{filteredLeads.length}</strong> of{" "}
              <strong style={{ color: "white" }}>{leads.length}</strong> leads
            </span>

            {(activeChips.length > 0 || editingLeadId) && (
              <button
                onClick={() => {
                  clearAllFilters();
                  if (editingLeadId) resetForm();
                }}
                style={topClearBtn}
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={() => {
                resetForm();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={primaryGhostBtn}
            >
              Quick Add Lead
            </button>

            <button onClick={() => navigate("/dashboard")} style={backBtn}>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div style={pillWrap}>
          <SummaryPill label="Total" value={summaryStats.total} onClick={() => clearAllFilters()} />
          <SummaryPill label="New" value={summaryStats.new} onClick={() => updateQueryParams({ status: "New", filter: "" })} />
          <SummaryPill label="Follow-up" value={summaryStats.follow} onClick={() => updateQueryParams({ status: "Follow-up", filter: "" })} />
          <SummaryPill label="Visit" value={summaryStats.visit} onClick={() => updateQueryParams({ status: "Visit Planned", filter: "" })} />
          <SummaryPill label="Closed" value={summaryStats.closed} onClick={() => updateQueryParams({ status: "Closed", filter: "" })} />
          <SummaryPill label="Hot" value={summaryStats.hot} warning onClick={() => updateQueryParams({ filter: "hot", status: "" })} />
          <SummaryPill label="Overdue" value={summaryStats.overdue} danger onClick={() => updateQueryParams({ filter: "overdue", status: "" })} />
        </div>

        <div style={reminderGridStyle}>
          <ReminderPanel
            title="Today Follow-ups"
            subtitle={todayString}
            items={reminderData.todayItems}
            emptyText="No follow-ups for today."
            accent="blue"
            getPropertyInfo={getPropertyInfo}
            formatCurrency={formatCurrency}
            onEdit={handleEditLead}
            onOpen={openActivityDrawer}
          />

          <ReminderPanel
            title="Overdue Reminders"
            subtitle="Needs immediate action"
            items={reminderData.overdueItems}
            emptyText="No overdue reminders."
            accent="red"
            getPropertyInfo={getPropertyInfo}
            formatCurrency={formatCurrency}
            onEdit={handleEditLead}
            onOpen={openActivityDrawer}
          />

          <ReminderPanel
            title="Tomorrow Queue"
            subtitle={tomorrowString}
            items={reminderData.tomorrowItems}
            emptyText="No follow-ups for tomorrow."
            accent="amber"
            getPropertyInfo={getPropertyInfo}
            formatCurrency={formatCurrency}
            onEdit={handleEditLead}
            onOpen={openActivityDrawer}
          />
        </div>

        {activeChips.length > 0 && (
          <div style={chipsWrapStyle}>
            {activeChips.map((chip) => (
              <button
                key={chip.key + chip.label}
                onClick={() => handleRemoveChip(chip.key)}
                style={chipStyle}
              >
                <span>{chip.label}</span>
                <span style={{ opacity: 0.9 }}>×</span>
              </button>
            ))}
          </div>
        )}

        <div style={bulkToolbarStyle}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => exportLeadsToCsv(filteredLeads)} style={toolbarBtnStyle}>
              Export CSV
            </button>

            <button
              onClick={() => setViewMode((prev) => (prev === "table" ? "kanban" : "table"))}
              style={toolbarBtnStyle}
            >
              View: {viewMode === "table" ? "Table" : "Kanban"}
            </button>

            <button onClick={toggleSelectAllFiltered} style={toolbarBtnStyle}>
              {filteredLeads.length > 0 &&
              filteredLeads.every((lead) => selectedLeadIds.includes(lead.id))
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => bulkUpdateStatus("Follow-up")} style={toolbarBtnStyle}>
              Bulk Follow-up
            </button>
            <button onClick={() => bulkUpdateStatus("Closed")} style={toolbarBtnStyle}>
              Bulk Close
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            {editingLeadId ? "Edit Lead" : "Add Lead"}
            {editingLeadId && (
              <span style={editingBadgeStyle}>
                Editing: {form.name || "Lead"}
              </span>
            )}
          </div>

          <div style={infoBarStyle}>
            New lead save ஆனவுடன் owner auto assign ஆகும்.
          </div>

          <div style={sectionLabelStyle}>Lead Details</div>
          <div style={formGridStyle}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Lead Name *" style={inputStyle} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" style={inputStyle} />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location *" style={inputStyle} />

            <select name="source" value={form.source} onChange={handleChange} style={inputStyle}>
              <option value="Website">Website</option>
              <option value="99acres">99acres</option>
              <option value="Magicbricks">Magicbricks</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
            </select>

            <select name="owner" value={form.owner} onChange={handleChange} style={inputStyle}>
              <option value="">
                Auto Assign → {form.name ? autoAssignOwner(form.name) : "Owner"}
              </option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  Priority: {priority}
                </option>
              ))}
            </select>
          </div>

          <div style={sectionLabelStyle}>Property Details</div>
          <div style={formGridStyle}>
            <select name="propertyType" value={form.propertyType} onChange={handleChange} style={inputStyle}>
              {propertyTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input name="areaValue" value={form.areaValue} onChange={handleChange} type="number" placeholder="Area Value" style={inputStyle} />

            <select name="areaUnit" value={form.areaUnit} onChange={handleChange} style={inputStyle}>
              {areaUnitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            <select name="facing" value={form.facing} onChange={handleChange} style={inputStyle}>
              <option value="">Select Facing</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </select>

            {["Flat", "Villa"].includes(form.propertyType) ? (
              <select name="bhk" value={form.bhk} onChange={handleChange} style={inputStyle}>
                <option value="">Select BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>
            ) : (
              <div />
            )}

            <input name="dealValue" value={form.dealValue} onChange={handleChange} type="number" placeholder="Deal Value" style={inputStyle} />
          </div>

          <div style={sectionLabelStyle}>Follow-up Details</div>
          <div style={formGridStyle}>
            <input name="followUp" value={form.followUp} onChange={handleChange} type="date" style={inputStyle} />
          </div>

          <div style={stickyActionBarStyle}>
            <button onClick={handleSaveLead} style={primaryBtn}>
              {editingLeadId ? "Update Lead" : "Save Lead"}
            </button>
            <button onClick={resetForm} style={secondaryBtn}>
              Cancel
            </button>
            {editingLeadId && (
              <button
                onClick={() => editingLeadId && handleDeleteLead(editingLeadId)}
                style={dangerBtn}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 190px 190px 190px 210px",
              gap: "14px",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  updateQueryParams({ search: value });
                }}
                placeholder="Search by name, phone, location, source, owner, status, note..."
                style={{ ...inputStyle, paddingRight: "46px" }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateQueryParams({ search: "" });
                  }}
                  style={searchClearBtn}
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={ownerFilter}
              onChange={(e) => {
                const value = e.target.value;
                setOwnerFilter(value);
                updateQueryParams({ owner: value });
              }}
              style={inputStyle}
            >
              <option>All Owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value);
                updateQueryParams({ status: value });
              }}
              style={inputStyle}
            >
              <option>All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => {
                const value = e.target.value;
                setSourceFilter(value);
                updateQueryParams({ source: value });
              }}
              style={inputStyle}
            >
              <option>All Sources</option>
              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                const value = e.target.value as SortOption;
                setSortBy(value);
                updateQueryParams({ sort: value });
              }}
              style={inputStyle}
            >
              <option value="latest_created">Sort: Latest Created</option>
              <option value="followup_asc">Sort: Follow-up Date</option>
              <option value="dealvalue_desc">Sort: Highest Deal Value</option>
              <option value="updated_desc">Sort: Recently Updated</option>
              <option value="priority_desc">Sort: Priority</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
            <button onClick={() => updateQueryParams({ filter: "today" })} style={getQuickFilterBtnStyle(specialFilter === "today")}>
              Today
            </button>
            <button onClick={() => updateQueryParams({ filter: "overdue" })} style={getQuickFilterBtnStyle(specialFilter === "overdue")}>
              Overdue
            </button>
            <button onClick={() => updateQueryParams({ filter: "hot" })} style={getQuickFilterBtnStyle(specialFilter === "hot")}>
              Hot Leads
            </button>
            <button onClick={() => updateQueryParams({ status: "New" })} style={getQuickFilterBtnStyle(statusFilter === "New")}>
              New
            </button>
            <button onClick={() => updateQueryParams({ status: "Follow-up" })} style={getQuickFilterBtnStyle(statusFilter === "Follow-up")}>
              Follow-up
            </button>
          </div>

          {specialFilter && (
            <div style={specialBannerStyle}>
              Showing filter: <strong>{specialFilter}</strong>
            </div>
          )}
        </div>

        {viewMode === "table" ? (
          <div style={tableCardStyle}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: "2050px",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "70px" }}>Select</th>
                  <th style={{ ...thStyle, ...stickyNameHeaderStyle, width: "160px" }}>Name</th>
                  <th style={{ ...thStyle, width: "130px" }}>Phone</th>
                  <th style={{ ...thStyle, width: "130px" }}>Location</th>
                  <th style={{ ...thStyle, width: "230px" }}>Property Info</th>
                  <th style={{ ...thStyle, width: "120px" }}>Priority</th>
                  <th style={{ ...thStyle, width: "120px" }}>Lead Score</th>
                  <th style={{ ...thStyle, width: "180px" }}>Latest Note</th>
                  <th style={{ ...thStyle, width: "110px" }}>Source</th>
                  <th style={{ ...thStyle, width: "140px" }}>Owner</th>
                  <th style={{ ...thStyle, width: "170px" }}>Status</th>
                  <th style={{ ...thStyle, width: "140px" }}>Deal Value</th>
                  <th style={{ ...thStyle, width: "120px" }}>Follow-up</th>
                  <th style={{ ...thStyle, width: "110px" }}>Created</th>
                  <th style={{ ...thStyle, width: "170px" }}>Last Updated</th>
                  <th style={{ ...thStyle, width: "200px" }}>Quick Actions</th>
                  <th style={{ ...thStyle, width: "110px" }}>Menu</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={17} style={emptyTdStyle}>
                      No leads match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => {
                    const overdue = isOverdue(lead);
                    const isHovered = hoveredRowId === lead.id;
                    const latestNote = getLatestNote(lead);

                    return (
                      <tr
                        key={lead.id}
                        onMouseEnter={() => setHoveredRowId(lead.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          background: overdue
                            ? isHovered
                              ? "linear-gradient(90deg, rgba(127,29,29,0.30), rgba(30,41,59,0.35))"
                              : "linear-gradient(90deg, rgba(127,29,29,0.18), rgba(0,0,0,0))"
                            : index % 2 === 0
                            ? isHovered
                              ? "rgba(37, 99, 235, 0.10)"
                              : "rgba(255,255,255,0.01)"
                            : isHovered
                            ? "rgba(37, 99, 235, 0.10)"
                            : "transparent",
                          boxShadow: isHovered
                            ? overdue
                              ? "inset 4px 0 0 #ef4444, inset 0 0 0 1px rgba(248,113,113,0.08)"
                              : "inset 4px 0 0 #3b82f6, inset 0 0 0 1px rgba(96,165,250,0.08)"
                            : overdue
                            ? "inset 4px 0 0 #ef4444"
                            : "inset 4px 0 0 transparent",
                          transition: "background 0.18s ease, box-shadow 0.18s ease",
                        }}
                      >
                        <td style={tdStyle}>
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onChange={() => toggleLeadSelection(lead.id)}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            ...stickyNameCellStyle,
                          }}
                        >
                          <button
                            onClick={() => openActivityDrawer(lead.id)}
                            style={rowNameBtn}
                          >
                            {lead.name}
                          </button>
                        </td>

                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{lead.phone}</td>
                        <td style={tdStyle}>{lead.location}</td>

                        <td style={tdStyle}>
                          <div style={{ whiteSpace: "normal", lineHeight: 1.6, wordBreak: "break-word" }}>
                            {getPropertyInfo(lead) || "-"}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <select
                            value={lead.priority}
                            onChange={(e) => updateLeadPriority(lead.id, e.target.value as LeadPriority)}
                            style={{
                              ...pillSelectStyle,
                              ...getPrioritySelectStyle(lead.priority),
                              minWidth: "110px",
                            }}
                          >
                            {priorityOptions.map((priority) => (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td style={tdStyle}>
                          <div style={scoreBadgeStyle}>
                            {lead.leadScore ?? computeLeadScore(lead)} / 100
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() => openActivityDrawer(lead.id)}
                            style={notePreviewBtn}
                          >
                            {latestNote || "No notes"}
                          </button>
                        </td>

                        <td style={tdStyle}>{lead.source}</td>

                        <td style={tdStyle}>
                          <select
                            value={lead.owner}
                            onChange={(e) => updateLeadOwner(lead.id, e.target.value)}
                            style={{
                              ...pillSelectStyle,
                              background:
                                lead.owner === "Ravi"
                                  ? "#0f9d8a"
                                  : lead.owner === "Meena"
                                  ? "#1fb954"
                                  : lead.owner === "Sabari"
                                  ? "#d81b60"
                                  : "#2f5be7",
                            }}
                          >
                            {owners.map((owner) => (
                              <option key={owner} value={owner}>
                                {owner}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              style={{
                                ...pillSelectStyle,
                                background:
                                  lead.status === "New"
                                    ? "#2563eb"
                                    : lead.status === "Follow-up"
                                    ? "#f59e0b"
                                    : lead.status === "Visit Planned"
                                    ? "#7c3aed"
                                    : lead.status === "Closed"
                                    ? "#16a34a"
                                    : "#dc2626",
                                minWidth: "140px",
                              }}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>

                            {overdue && <span style={overdueBadgeStyle}>Overdue</span>}
                          </div>
                        </td>

                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                          {formatCurrency(lead.dealValue)}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            whiteSpace: "nowrap",
                            color: overdue ? "#fca5a5" : "#ffffff",
                            fontWeight: overdue ? 700 : 500,
                          }}
                        >
                          {normalizeDate(lead.followUp) || "-"}
                        </td>

                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                          {normalizeDate(lead.createdAt) || "-"}
                        </td>

                        <td style={tdStyle}>
                          <div style={{ lineHeight: 1.4 }}>
                            <div>{formatRelativeTime(lead.lastUpdatedAt)}</div>
                            <div style={{ color: "#8fa4c5", fontSize: "12px", marginTop: "4px" }}>
                              {formatDateTime(lead.lastUpdatedAt)}
                            </div>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <div style={quickActionWrapStyle}>
                            <button
                              onClick={() => callLead(lead.phone)}
                              style={quickActionIconBtn}
                              title="Call"
                            >
                              📞
                            </button>
                            <button
                              onClick={() => openWhatsApp(lead.phone, buildLeadWhatsappMessage(lead))}
                              style={quickActionIconBtn}
                              title="WhatsApp"
                            >
                              💬
                            </button>
                            <button
                              onClick={() => copyPhone(lead.phone)}
                              style={quickActionIconBtn}
                              title="Copy Phone"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => addQuickNoteToLead(lead.id)}
                              style={quickActionIconBtn}
                              title="Add Note"
                            >
                              📝
                            </button>
                            <button
                              onClick={() => quickSetStatus(lead.id, "Closed")}
                              style={quickActionIconBtn}
                              title="Mark Closed"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => quickSetStatus(lead.id, "Follow-up")}
                              style={quickActionIconBtn}
                              title="Mark Follow-up"
                            >
                              🔁
                            </button>
                            <button
                              onClick={() => openActivityDrawer(lead.id)}
                              style={quickActionIconBtn}
                              title="Timeline"
                            >
                              ⏱
                            </button>
                          </div>
                        </td>

                        <td style={{ ...tdStyle, position: "relative" }}>
                          <div ref={openMenuId === lead.id ? menuRef : null}>
                            <button
                              onClick={() =>
                                setOpenMenuId((prev) => (prev === lead.id ? null : lead.id))
                              }
                              style={menuTriggerBtn}
                            >
                              ⋯
                            </button>

                            {openMenuId === lead.id && (
                              <div style={menuPanelStyle}>
                                <button
                                  onClick={() => {
                                    openWhatsApp(lead.phone, buildLeadWhatsappMessage(lead));
                                    setOpenMenuId(null);
                                  }}
                                  style={menuItemStyle}
                                >
                                  WhatsApp Lead
                                </button>

                                <button
                                  onClick={() => {
                                    openWhatsApp(ownerPhoneMap[lead.owner], buildOwnerWhatsappMessage(lead));
                                    setOpenMenuId(null);
                                  }}
                                  style={menuItemStyle}
                                >
                                  WhatsApp Owner
                                </button>

                                <button
                                  onClick={() => addQuickNoteToLead(lead.id)}
                                  style={menuItemStyle}
                                >
                                  Add Note
                                </button>

                                <button
                                  onClick={() => openActivityDrawer(lead.id)}
                                  style={menuItemStyle}
                                >
                                  Open Timeline
                                </button>

                                <button
                                  onClick={() => quickSetStatus(lead.id, "Closed")}
                                  style={menuItemStyle}
                                >
                                  Mark Closed
                                </button>

                                <button
                                  onClick={() => handleEditLead(lead)}
                                  style={menuItemStyle}
                                >
                                  Edit Lead
                                </button>

                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  style={{ ...menuItemStyle, color: "#fca5a5" }}
                                >
                                  Delete Lead
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={kanbanWrapStyle}>
            {statusOptions.map((status) => {
              const statusLeads = filteredLeads.filter((lead) => lead.status === status);
              return (
                <div key={status} style={kanbanColumnStyle}>
                  <div style={kanbanColumnHeaderStyle}>
                    <span>{status}</span>
                    <span style={kanbanCountStyle}>{statusLeads.length}</span>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {statusLeads.length === 0 ? (
                      <div style={emptyNotesStyle}>No leads</div>
                    ) : (
                      statusLeads.map((lead) => (
                        <div key={lead.id} style={kanbanCardStyle}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                            <button onClick={() => openActivityDrawer(lead.id)} style={rowNameBtn}>
                              {lead.name}
                            </button>
                            <span style={miniPriorityPillStyle}>{lead.priority}</span>
                          </div>

                          <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
                            {lead.location} • {getPropertyInfo(lead)}
                          </div>

                          <div style={{ color: "#dbeafe", fontSize: "13px", marginTop: "8px" }}>
                            Score: {lead.leadScore ?? computeLeadScore(lead)} / 100
                          </div>

                          <div style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "8px" }}>
                            {formatCurrency(lead.dealValue)}
                          </div>

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                            <button onClick={() => callLead(lead.phone)} style={smallPanelBtn}>Call</button>
                            <button
                              onClick={() => openWhatsApp(lead.phone, buildLeadWhatsappMessage(lead))}
                              style={smallPanelBtnAlt}
                            >
                              WhatsApp
                            </button>
                            <button onClick={() => handleEditLead(lead)} style={smallPanelBtnAlt}>
                              Edit
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
        )}
      </div>

      {selectedLead && (
        <div style={notesOverlayStyle} onClick={closeActivityDrawer}>
          <div style={notesPanelStyle} onClick={(e) => e.stopPropagation()}>
            <div style={notesPanelHeaderStyle}>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 900 }}>
                  {selectedLead.name} Timeline
                </div>
                <div style={{ color: "#9fb1d1", marginTop: "4px", fontSize: "14px" }}>
                  {selectedLead.location} • {getPropertyInfo(selectedLead) || "-"}
                </div>
              </div>

              <button onClick={closeActivityDrawer} style={closeNotesBtn}>
                ×
              </button>
            </div>

            <div style={notesMetaStyle}>
              <span style={metaChipStyle}>{selectedLead.owner}</span>
              <span style={metaChipStyle}>{selectedLead.status}</span>
              <span style={metaChipStyle}>{selectedLead.priority}</span>
              <span style={metaChipStyle}>{formatCurrency(selectedLead.dealValue)}</span>
              <span style={metaChipStyle}>{selectedLead.followUp || "-"}</span>
              <span style={metaChipStyle}>
                Score: {selectedLead.leadScore ?? computeLeadScore(selectedLead)}
              </span>
            </div>

            <div style={panelSectionTitle}>Quick Actions</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
              <button onClick={() => callLead(selectedLead.phone)} style={smallActionBtn}>Call</button>
              <button
                onClick={() => openWhatsApp(selectedLead.phone, buildLeadWhatsappMessage(selectedLead))}
                style={smallActionBtn}
              >
                WhatsApp
              </button>
              <button onClick={() => handleEditLead(selectedLead)} style={smallActionBtnAlt}>
                Edit
              </button>
            </div>

            <div style={panelSectionTitle}>Call Log + Reschedule</div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
              <select
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Call Outcome</option>
                {callOutcomeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                style={inputStyle}
              />

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type call summary / next step note..."
                style={notesTextareaStyle}
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={saveCallLogAndReschedule} style={primaryBtn}>
                  Save Update
                </button>
                <button onClick={savePanelNote} style={secondaryBtn}>
                  Save Note Only
                </button>
                <button
                  onClick={() => {
                    setNewNoteText("");
                    setCallOutcome("");
                  }}
                  style={secondaryBtn}
                >
                  Clear
                </button>
              </div>
            </div>

            <div style={panelSectionTitle}>Activity Timeline</div>

            <div style={timelineWrapStyle}>
              {(selectedLead.activities || []).length === 0 ? (
                <div style={emptyNotesStyle}>No activity yet.</div>
              ) : (
                [...(selectedLead.activities || [])]
                  .slice()
                  .reverse()
                  .map((activity) => (
                    <div key={activity.id} style={timelineItemStyle}>
                      <div style={timelineBadgeWrapStyle}>
                        <span
                          style={{
                            ...timelineTypeBadgeStyle,
                            ...getActivityBadgeStyle(activity.type),
                          }}
                        >
                          {activity.type.toUpperCase()}
                        </span>
                        <span style={timelineTimeStyle}>
                          {formatDateTime(activity.createdAt)}
                        </span>
                      </div>
                      <div style={timelineTextStyle}>{activity.text}</div>
                    </div>
                  ))
              )}
            </div>

            <div style={panelSectionTitle}>Notes History</div>

            <div style={notesHistoryWrapStyle}>
              {(selectedLead.notes || []).length === 0 ? (
                <div style={emptyNotesStyle}>No notes added yet.</div>
              ) : (
                [...(selectedLead.notes || [])]
                  .slice()
                  .reverse()
                  .map((note, index) => (
                    <div key={`${selectedLead.id}-note-${index}`} style={singleNoteCardStyle}>
                      {note}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          style={{
            ...toastStyle,
            ...(toast.type === "success"
              ? toastSuccessStyle
              : toast.type === "error"
              ? toastErrorStyle
              : toastInfoStyle),
          }}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}

function SummaryPill({
  label,
  value,
  onClick,
  danger = false,
  warning = false,
}: {
  label: string;
  value: number;
  onClick?: () => void;
  danger?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: danger
          ? "rgba(185,28,28,0.25)"
          : warning
          ? "rgba(245,158,11,0.18)"
          : "rgba(37,99,235,0.18)",
        border: danger
          ? "1px solid rgba(248,113,113,0.35)"
          : warning
          ? "1px solid rgba(251,191,36,0.35)"
          : "1px solid rgba(96,165,250,0.25)",
        borderRadius: "16px",
        padding: "14px 18px",
        minWidth: "110px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: "13px", color: "#9fb1d1" }}>{label}</div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 900,
          color: danger ? "#fecaca" : warning ? "#fde68a" : "#ffffff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ReminderPanel({
  title,
  subtitle,
  items,
  emptyText,
  accent,
  getPropertyInfo,
  formatCurrency,
  onEdit,
  onOpen,
}: {
  title: string;
  subtitle: string;
  items: Lead[];
  emptyText: string;
  accent: "blue" | "red" | "amber";
  getPropertyInfo: (lead: Lead) => string;
  formatCurrency: (value: number | string) => string;
  onEdit: (lead: Lead) => void;
  onOpen: (leadId: string) => void;
}) {
  const accentMap = {
    blue: {
      bg: "rgba(37,99,235,0.14)",
      border: "rgba(96,165,250,0.20)",
      title: "#dbeafe",
      badge: "#2563eb",
    },
    red: {
      bg: "rgba(185,28,28,0.14)",
      border: "rgba(248,113,113,0.20)",
      title: "#fecaca",
      badge: "#b91c1c",
    },
    amber: {
      bg: "rgba(245,158,11,0.14)",
      border: "rgba(251,191,36,0.22)",
      title: "#fde68a",
      badge: "#d97706",
    },
  }[accent];

  return (
    <div
      style={{
        background: "rgba(10, 20, 45, 0.95)",
        border: `1px solid ${accentMap.border}`,
        borderRadius: "24px",
        padding: "18px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 900,
              color: accentMap.title,
            }}
          >
            {title}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
            {subtitle}
          </div>
        </div>

        <div style={panelCountBadgeStyle}>{items.length}</div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: "18px",
            borderRadius: "16px",
            background: "rgba(8,22,50,0.75)",
            color: "#93a4c3",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {emptyText}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {items.slice(0, 4).map((lead) => (
            <div
              key={lead.id}
              style={{
                background: accentMap.bg,
                border: `1px solid ${accentMap.border}`,
                borderRadius: "18px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>
                    {lead.name}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                    {lead.location} • {getPropertyInfo(lead) || "-"}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px" }}>
                    {formatCurrency(lead.dealValue)} • {lead.owner}
                  </div>
                </div>

                <span
                  style={{
                    padding: "7px 10px",
                    borderRadius: "999px",
                    background: accentMap.badge,
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {lead.followUp}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                <button onClick={() => onOpen(lead.id)} style={smallPanelBtn}>
                  Open
                </button>
                <button
                  onClick={() => {
                    const url = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hi ${lead.name}, this is MEI Business OS. Following up on your property enquiry.`
                    )}`;
                    window.open(url, "_blank");
                  }}
                  style={smallPanelBtnAlt}
                >
                  WhatsApp
                </button>
                <button onClick={() => onEdit(lead)} style={smallPanelBtnAlt}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getPrioritySelectStyle(priority: LeadPriority): React.CSSProperties {
  if (priority === "Hot") {
    return {
      background: "#dc2626",
      color: "#fff",
    };
  }
  if (priority === "High") {
    return {
      background: "#ea580c",
      color: "#fff",
    };
  }
  if (priority === "Medium") {
    return {
      background: "#2563eb",
      color: "#fff",
    };
  }
  return {
    background: "#334155",
    color: "#fff",
  };
}

function getActivityBadgeStyle(type: ActivityType): React.CSSProperties {
  if (type === "created") {
    return { background: "rgba(37,99,235,0.20)", color: "#93c5fd" };
  }
  if (type === "note") {
    return { background: "rgba(124,58,237,0.20)", color: "#c4b5fd" };
  }
  if (type === "call") {
    return { background: "rgba(245,158,11,0.20)", color: "#fde68a" };
  }
  if (type === "status") {
    return { background: "rgba(22,163,74,0.20)", color: "#86efac" };
  }
  if (type === "owner") {
    return { background: "rgba(219,39,119,0.20)", color: "#f9a8d4" };
  }
  if (type === "reschedule") {
    return { background: "rgba(14,165,233,0.20)", color: "#7dd3fc" };
  }
  if (type === "priority") {
    return { background: "rgba(234,88,12,0.20)", color: "#fdba74" };
  }
  return { background: "rgba(148,163,184,0.20)", color: "#cbd5e1" };
}

function getQuickFilterBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "rgba(37,99,235,0.28)" : "rgba(37,99,235,0.14)",
    color: "#dbeafe",
    border: active
      ? "1px solid rgba(147,197,253,0.45)"
      : "1px solid rgba(96,165,250,0.18)",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const reminderGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const smallPanelBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const smallPanelBtnAlt: React.CSSProperties = {
  background: "transparent",
  color: "#93c5fd",
  border: "1px solid rgba(96,165,250,0.20)",
  borderRadius: "12px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const pillWrap: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const chipsWrapStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(37,99,235,0.18)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#dbeafe",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const topClearBtn: React.CSSProperties = {
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "8px 14px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryGhostBtn: React.CSSProperties = {
  background: "rgba(37,99,235,0.18)",
  color: "#dbeafe",
  border: "1px solid rgba(96,165,250,0.22)",
  borderRadius: "12px",
  padding: "8px 14px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const backBtn: React.CSSProperties = {
  background: "transparent",
  color: "#93c5fd",
  border: "1px solid rgba(96,165,250,0.22)",
  borderRadius: "12px",
  padding: "8px 14px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const bulkToolbarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const toolbarBtnStyle: React.CSSProperties = {
  background: "rgba(37,99,235,0.18)",
  color: "#dbeafe",
  border: "1px solid rgba(96,165,250,0.22)",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 45, 0.95)",
  border: "1px solid rgba(96, 165, 250, 0.15)",
  borderRadius: "24px",
  padding: "22px",
  marginBottom: "22px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const tableCardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 45, 0.95)",
  border: "1px solid rgba(96, 165, 250, 0.15)",
  borderRadius: "24px",
  overflowX: "auto",
  overflowY: "auto",
  maxHeight: "70vh",
  position: "relative",
};

const cardTitle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "14px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const editingBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(37,99,235,0.18)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#dbeafe",
  fontSize: "13px",
  fontWeight: 800,
};

const infoBarStyle: React.CSSProperties = {
  marginBottom: "18px",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(59,130,246,0.18)",
  background: "rgba(8, 26, 60, 0.65)",
  color: "#93c5fd",
  fontSize: "15px",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#9fb1d1",
  marginBottom: "12px",
  marginTop: "18px",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
};

const stickyActionBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  position: "sticky",
  bottom: 0,
  paddingTop: "12px",
  background: "linear-gradient(180deg, rgba(10,20,45,0), rgba(10,20,45,0.98) 28%)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#081632",
  color: "white",
  border: "1px solid rgba(148,163,184,0.20)",
  borderRadius: "16px",
  padding: "16px 18px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const searchClearBtn: React.CSSProperties = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(148,163,184,0.18)",
  color: "#fff",
  border: "none",
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "18px",
  lineHeight: 1,
};

const thStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 5,
  padding: "18px 20px",
  color: "#cbd5e1",
  fontSize: "15px",
  fontWeight: 700,
  textAlign: "left",
  verticalAlign: "middle",
  background: "#09152b",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const stickyNameHeaderStyle: React.CSSProperties = {
  left: 0,
  zIndex: 6,
};

const tdStyle: React.CSSProperties = {
  padding: "18px 20px",
  fontSize: "15px",
  color: "#ffffff",
  verticalAlign: "middle",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  transition: "color 0.18s ease, background 0.18s ease",
};

const stickyNameCellStyle: React.CSSProperties = {
  position: "sticky",
  left: 0,
  background: "#071330",
  zIndex: 2,
};

const rowNameBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 800,
  cursor: "pointer",
  padding: 0,
  textAlign: "left",
};

const emptyTdStyle: React.CSSProperties = {
  padding: "34px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "16px",
};

const pillSelectStyle: React.CSSProperties = {
  border: "none",
  color: "#fff",
  borderRadius: "999px",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: 700,
  outline: "none",
  cursor: "pointer",
  minWidth: "120px",
};

const overdueBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#b91c1c",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const panelCountBadgeStyle: React.CSSProperties = {
  minWidth: "32px",
  height: "32px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(37,99,235,0.18)",
  border: "1px solid rgba(96,165,250,0.18)",
  color: "#fff",
  fontWeight: 800,
};

const scoreBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(14,165,233,0.14)",
  border: "1px solid rgba(125,211,252,0.20)",
  color: "#bae6fd",
  fontSize: "13px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const primaryBtn: React.CSSProperties = {
  background: "#2f6df6",
  color: "white",
  border: "none",
  borderRadius: "16px",
  padding: "14px 24px",
  fontSize: "18px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  background: "#1e293b",
  color: "white",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: "16px",
  padding: "14px 24px",
  fontSize: "18px",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerBtn: React.CSSProperties = {
  background: "#7f1d1d",
  color: "#fff",
  border: "1px solid rgba(248,113,113,0.18)",
  borderRadius: "16px",
  padding: "14px 24px",
  fontSize: "18px",
  fontWeight: 700,
  cursor: "pointer",
};

const menuTriggerBtn: React.CSSProperties = {
  background: "#132347",
  color: "#fff",
  border: "1px solid rgba(96,165,250,0.18)",
  borderRadius: "12px",
  padding: "8px 14px",
  fontSize: "22px",
  lineHeight: 1,
  cursor: "pointer",
  minWidth: "48px",
};

const menuPanelStyle: React.CSSProperties = {
  position: "absolute",
  right: "20px",
  top: "60px",
  minWidth: "180px",
  background: "#081632",
  border: "1px solid rgba(96,165,250,0.18)",
  borderRadius: "16px",
  boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
  padding: "8px",
  zIndex: 30,
};

const menuItemStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "transparent",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "12px 12px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const quickActionWrapStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const quickActionIconBtn: React.CSSProperties = {
  background: "rgba(15,23,42,0.8)",
  color: "#fff",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: "10px",
  width: "36px",
  height: "36px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "14px",
};

const notePreviewBtn: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "rgba(15,23,42,0.7)",
  color: "#cbd5e1",
  border: "1px solid rgba(96,165,250,0.10)",
  borderRadius: "12px",
  padding: "10px 12px",
  fontSize: "13px",
  lineHeight: 1.5,
  cursor: "pointer",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const notesOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.55)",
  zIndex: 100,
  display: "flex",
  justifyContent: "flex-end",
};

const notesPanelStyle: React.CSSProperties = {
  width: "520px",
  height: "100vh",
  background: "#071330",
  borderLeft: "1px solid rgba(96,165,250,0.16)",
  boxShadow: "-12px 0 30px rgba(0,0,0,0.32)",
  padding: "22px",
  boxSizing: "border-box",
  overflowY: "auto",
};

const notesPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "14px",
};

const closeNotesBtn: React.CSSProperties = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(96,165,250,0.18)",
  borderRadius: "12px",
  width: "42px",
  height: "42px",
  fontSize: "24px",
  cursor: "pointer",
};

const notesMetaStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "16px",
  color: "#cbd5e1",
  fontSize: "13px",
};

const metaChipStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: "999px",
  background: "rgba(15,23,42,0.9)",
  border: "1px solid rgba(96,165,250,0.12)",
};

const notesTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "110px",
  resize: "vertical",
  background: "#081632",
  color: "#fff",
  border: "1px solid rgba(148,163,184,0.20)",
  borderRadius: "16px",
  padding: "14px 16px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const notesHistoryWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "12px",
};

const timelineWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
  marginBottom: "18px",
};

const timelineItemStyle: React.CSSProperties = {
  background: "rgba(10,20,45,0.95)",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: "16px",
  padding: "14px",
};

const timelineBadgeWrapStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "10px",
};

const timelineTypeBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
};

const timelineTimeStyle: React.CSSProperties = {
  color: "#8fa4c5",
  fontSize: "12px",
};

const timelineTextStyle: React.CSSProperties = {
  color: "#e2e8f0",
  fontSize: "14px",
  lineHeight: 1.6,
};

const emptyNotesStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "16px",
  background: "rgba(8,22,50,0.75)",
  color: "#93a4c3",
  textAlign: "center",
  fontSize: "14px",
};

const singleNoteCardStyle: React.CSSProperties = {
  background: "rgba(10,20,45,0.95)",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: "16px",
  padding: "14px",
  color: "#e2e8f0",
  fontSize: "14px",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
};

const panelSectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 800,
  color: "#dbeafe",
  marginBottom: "10px",
};

const specialBannerStyle: React.CSSProperties = {
  marginTop: "14px",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "rgba(37,99,235,0.16)",
  border: "1px solid rgba(96,165,250,0.20)",
  color: "#dbeafe",
  fontWeight: 700,
};

const smallActionBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const smallActionBtnAlt: React.CSSProperties = {
  background: "transparent",
  color: "#93c5fd",
  border: "1px solid rgba(96,165,250,0.18)",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  right: "24px",
  bottom: "24px",
  zIndex: 999,
  minWidth: "220px",
  maxWidth: "360px",
  padding: "14px 16px",
  borderRadius: "16px",
  color: "#fff",
  fontWeight: 700,
  boxShadow: "0 20px 40px rgba(0,0,0,0.28)",
  border: "1px solid transparent",
};

const toastSuccessStyle: React.CSSProperties = {
  background: "rgba(22,163,74,0.95)",
  borderColor: "rgba(134,239,172,0.25)",
};

const toastErrorStyle: React.CSSProperties = {
  background: "rgba(185,28,28,0.95)",
  borderColor: "rgba(252,165,165,0.25)",
};

const toastInfoStyle: React.CSSProperties = {
  background: "rgba(37,99,235,0.95)",
  borderColor: "rgba(147,197,253,0.25)",
};

const kanbanWrapStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(260px, 1fr))",
  gap: "16px",
  alignItems: "start",
};

const kanbanColumnStyle: React.CSSProperties = {
  background: "rgba(10, 20, 45, 0.95)",
  border: "1px solid rgba(96,165,250,0.15)",
  borderRadius: "24px",
  padding: "16px",
};

const kanbanColumnHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "14px",
  color: "#fff",
  fontWeight: 800,
  fontSize: "16px",
};

const kanbanCountStyle: React.CSSProperties = {
  minWidth: "28px",
  height: "28px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(37,99,235,0.18)",
  border: "1px solid rgba(96,165,250,0.18)",
  color: "#dbeafe",
  fontSize: "12px",
  fontWeight: 800,
};

const kanbanCardStyle: React.CSSProperties = {
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(96,165,250,0.10)",
  borderRadius: "18px",
  padding: "14px",
};

const miniPriorityPillStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(234,88,12,0.18)",
  border: "1px solid rgba(251,146,60,0.18)",
  color: "#fdba74",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

export default LeadsPage;