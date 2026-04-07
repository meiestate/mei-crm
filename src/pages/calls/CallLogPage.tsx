import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type CallType = "Incoming" | "Outgoing" | "Missed";
type CallStatus = "Connected" | "No Answer" | "Busy" | "Failed";
type SortField = "dateTime" | "durationSec";
type SortDirection = "asc" | "desc";
type ExportMode = "selected" | "page" | "filtered";

type CallLog = {
  id: string;
  contactName: string;
  company?: string;
  phone: string;
  leadId?: string;
  leadName?: string;
  assignedTo: string;
  type: CallType;
  status: CallStatus;
  durationSec: number;
  dateTime: string;
  notes: string;
  followUpDate?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt?: string;
};

type CallLogPageProps = {
  mode: ThemeMode;
};

type CallLogFormState = {
  contactName: string;
  company: string;
  phone: string;
  leadId: string;
  leadName: string;
  assignedTo: string;
  type: CallType;
  status: CallStatus;
  durationSec: string;
  dateTime: string;
  notes: string;
  followUpDate: string;
  recordingUrl: string;
};

type LeadActivityItem = {
  id: string;
  leadId: string;
  type: "call_added" | "call_updated" | "call_deleted";
  title: string;
  description: string;
  meta?: {
    callId?: string;
    contactName?: string;
    phone?: string;
    status?: CallStatus;
    durationSec?: number;
    assignedTo?: string;
  };
  createdAt: string;
};

const CALL_LOGS_STORAGE_KEY = "mei-crm-call-logs";
const LEAD_ACTIVITIES_STORAGE_KEY = "mei-crm-lead-activities";

const seededCallLogs: CallLog[] = [
  {
    id: "CALL-1001",
    contactName: "Arun Kumar",
    company: "MEI Estates",
    phone: "+91 98765 43210",
    leadId: "1001",
    leadName: "Whitefield Villa Buyer",
    assignedTo: "Balraj",
    type: "Outgoing",
    status: "Connected",
    durationSec: 320,
    dateTime: "2026-04-07T10:30",
    notes: "Interested in 3BHK villa. Requested brochure and site visit details.",
    followUpDate: "2026-04-09",
    recordingUrl: "https://example.com/recordings/call-1001",
    createdAt: "2026-04-07T10:30:00",
  },
  {
    id: "CALL-1002",
    contactName: "Priya Sharma",
    company: "Urban Nest",
    phone: "+91 91234 56789",
    leadId: "1002",
    leadName: "HSR Rental Lead",
    assignedTo: "Karthik",
    type: "Incoming",
    status: "Connected",
    durationSec: 185,
    dateTime: "2026-04-07T11:10",
    notes: "Asked about rent, deposit, and nearby schools.",
    followUpDate: "2026-04-08",
    recordingUrl: "https://example.com/recordings/call-1002",
    createdAt: "2026-04-07T11:10:00",
  },
  {
    id: "CALL-1003",
    contactName: "Ravi Prakash",
    phone: "+91 90000 11111",
    leadId: "1003",
    leadName: "Sarjapur Plot Investor",
    assignedTo: "Balraj",
    type: "Missed",
    status: "No Answer",
    durationSec: 0,
    dateTime: "2026-04-06T17:45",
    notes: "Call missed. Need to reconnect.",
    followUpDate: "2026-04-07",
    createdAt: "2026-04-06T17:45:00",
  },
  {
    id: "CALL-1004",
    contactName: "Nisha Reddy",
    company: "Skyline Homes",
    phone: "+91 99887 76655",
    leadId: "1004",
    leadName: "Hebbal Apartment Lead",
    assignedTo: "Sanjay",
    type: "Outgoing",
    status: "Busy",
    durationSec: 12,
    dateTime: "2026-04-06T15:15",
    notes: "Number busy. Try again in evening.",
    followUpDate: "2026-04-07",
    createdAt: "2026-04-06T15:15:00",
  },
  {
    id: "CALL-1005",
    contactName: "Mohammed Irfan",
    phone: "+91 93456 78123",
    leadId: "1005",
    leadName: "Electronic City Rental",
    assignedTo: "Karthik",
    type: "Incoming",
    status: "Connected",
    durationSec: 410,
    dateTime: "2026-04-05T13:00",
    notes: "Requested video tour and payment terms.",
    followUpDate: "2026-04-10",
    recordingUrl: "https://example.com/recordings/call-1005",
    createdAt: "2026-04-05T13:00:00",
  },
];

const emptyForm: CallLogFormState = {
  contactName: "",
  company: "",
  phone: "",
  leadId: "",
  leadName: "",
  assignedTo: "",
  type: "Outgoing",
  status: "Connected",
  durationSec: "",
  dateTime: "",
  notes: "",
  followUpDate: "",
  recordingUrl: "",
};

function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (!mins) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDateTime(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusColor(status: CallStatus) {
  switch (status) {
    case "Connected":
      return {
        bg: "rgba(34,197,94,0.12)",
        text: "#16a34a",
        border: "rgba(34,197,94,0.35)",
      };
    case "No Answer":
      return {
        bg: "rgba(245,158,11,0.12)",
        text: "#d97706",
        border: "rgba(245,158,11,0.35)",
      };
    case "Busy":
      return {
        bg: "rgba(59,130,246,0.12)",
        text: "#2563eb",
        border: "rgba(59,130,246,0.35)",
      };
    case "Failed":
      return {
        bg: "rgba(239,68,68,0.12)",
        text: "#dc2626",
        border: "rgba(239,68,68,0.35)",
      };
    default:
      return { bg: "#f3f4f6", text: "#111827", border: "#d1d5db" };
  }
}

function getTypeColor(type: CallType) {
  switch (type) {
    case "Incoming":
      return {
        bg: "rgba(16,185,129,0.12)",
        text: "#059669",
        border: "rgba(16,185,129,0.35)",
      };
    case "Outgoing":
      return {
        bg: "rgba(99,102,241,0.12)",
        text: "#4f46e5",
        border: "rgba(99,102,241,0.35)",
      };
    case "Missed":
      return {
        bg: "rgba(239,68,68,0.12)",
        text: "#dc2626",
        border: "rgba(239,68,68,0.35)",
      };
    default:
      return { bg: "#f3f4f6", text: "#111827", border: "#d1d5db" };
  }
}

function generateCallId(existingLogs: CallLog[]) {
  const maxNumber = existingLogs.reduce((max, item) => {
    const numericPart = Number(item.id.replace("CALL-", ""));
    return Number.isNaN(numericPart) ? max : Math.max(max, numericPart);
  }, 1000);

  return `CALL-${maxNumber + 1}`;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const safe = String(cell ?? "").replace(/"/g, '""');
          return `"${safe}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildFormState(log: CallLog): CallLogFormState {
  return {
    contactName: log.contactName,
    company: log.company || "",
    phone: log.phone,
    leadId: log.leadId || "",
    leadName: log.leadName || "",
    assignedTo: log.assignedTo,
    type: log.type,
    status: log.status,
    durationSec: String(log.durationSec),
    dateTime: log.dateTime,
    notes: log.notes,
    followUpDate: log.followUpDate || "",
    recordingUrl: log.recordingUrl || "",
  };
}

function pushLeadActivity(entry: LeadActivityItem) {
  try {
    const existing = localStorage.getItem(LEAD_ACTIVITIES_STORAGE_KEY);
    const parsed = existing ? (JSON.parse(existing) as LeadActivityItem[]) : [];
    const updated = [entry, ...parsed];
    localStorage.setItem(LEAD_ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to sync lead activity history", error);
  }
}

function syncLeadActivityFromCall(
  action: "call_added" | "call_updated" | "call_deleted",
  call: CallLog
) {
  if (!call.leadId) return;

  const labelMap = {
    call_added: "Call added",
    call_updated: "Call updated",
    call_deleted: "Call deleted",
  } as const;

  pushLeadActivity({
    id: `ACT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    leadId: call.leadId,
    type: action,
    title: labelMap[action],
    description: `${call.contactName} • ${call.type} • ${call.status} • ${formatDuration(
      call.durationSec
    )}`,
    meta: {
      callId: call.id,
      contactName: call.contactName,
      phone: call.phone,
      status: call.status,
      durationSec: call.durationSec,
      assignedTo: call.assignedTo,
    },
    createdAt: new Date().toISOString(),
  });
}

function StatCard({
  title,
  value,
  subtitle,
  mode,
}: {
  title: string;
  value: string;
  subtitle: string;
  mode: ThemeMode;
}) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.24)"
            : "0 8px 20px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 13, color: theme.subText, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: theme.text }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: theme.mutedText, marginTop: 8 }}>
        {subtitle}
      </div>
    </div>
  );
}

function Label({
  children,
  themeText,
}: {
  children: React.ReactNode;
  themeText: string;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 6,
        color: themeText,
      }}
    >
      {children}
    </label>
  );
}

export default function CallLogPage({ mode }: CallLogPageProps) {
  const theme = getTheme(mode);
  const navigate = useNavigate();

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | CallType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | CallStatus>("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("dateTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedCallId, setSelectedCallId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CallLog | null>(null);

  const [form, setForm] = useState<CallLogFormState>(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem(CALL_LOGS_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CallLog[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCallLogs(parsed);
          setSelectedCallId(parsed[0].id);
          return;
        }
      } catch (error) {
        console.error("Failed to parse call logs from localStorage", error);
      }
    }

    setCallLogs(seededCallLogs);
    setSelectedCallId(seededCallLogs[0]?.id ?? "");
  }, []);

  useEffect(() => {
    localStorage.setItem(CALL_LOGS_STORAGE_KEY, JSON.stringify(callLogs));
  }, [callLogs]);

  const owners = useMemo(() => {
    const uniqueOwners = Array.from(
      new Set(callLogs.map((item) => item.assignedTo).filter(Boolean))
    );
    return ["All", ...uniqueOwners];
  }, [callLogs]);

  const filteredAndSortedLogs = useMemo(() => {
    const filtered = callLogs.filter((item) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.leadName || "").toLowerCase().includes(q) ||
        (item.company || "").toLowerCase().includes(q);

      const matchesType = typeFilter === "All" ? true : item.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" ? true : item.status === statusFilter;
      const matchesOwner =
        ownerFilter === "All" ? true : item.assignedTo === ownerFilter;

      const itemDate = new Date(item.dateTime);
      const fromOk = dateFrom
        ? itemDate >= new Date(`${dateFrom}T00:00:00`)
        : true;
      const toOk = dateTo ? itemDate <= new Date(`${dateTo}T23:59:59`) : true;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesOwner &&
        fromOk &&
        toOk
      );
    });

    filtered.sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      if (sortField === "dateTime") {
        return (
          (new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) *
          multiplier
        );
      }

      return (a.durationSec - b.durationSec) * multiplier;
    });

    return filtered;
  }, [
    callLogs,
    search,
    typeFilter,
    statusFilter,
    ownerFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedLogs.length / pageSize)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    typeFilter,
    statusFilter,
    ownerFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
    pageSize,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedLogs.slice(start, start + pageSize);
  }, [filteredAndSortedLogs, currentPage, pageSize]);

  const selectedCall =
    filteredAndSortedLogs.find((item) => item.id === selectedCallId) ||
    callLogs.find((item) => item.id === selectedCallId) ||
    paginatedLogs[0] ||
    filteredAndSortedLogs[0] ||
    callLogs[0] ||
    null;

  useEffect(() => {
    if (!selectedCallId && filteredAndSortedLogs[0]) {
      setSelectedCallId(filteredAndSortedLogs[0].id);
      return;
    }

    if (
      selectedCallId &&
      !callLogs.some((item) => item.id === selectedCallId) &&
      filteredAndSortedLogs[0]
    ) {
      setSelectedCallId(filteredAndSortedLogs[0].id);
    }
  }, [filteredAndSortedLogs, selectedCallId, callLogs]);

  const currentPageIds = paginatedLogs.map((item) => item.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const stats = useMemo(() => {
    const totalCalls = filteredAndSortedLogs.length;
    const connectedCalls = filteredAndSortedLogs.filter(
      (c) => c.status === "Connected"
    ).length;
    const missedCalls = filteredAndSortedLogs.filter(
      (c) => c.type === "Missed"
    ).length;
    const totalDuration = filteredAndSortedLogs.reduce(
      (sum, c) => sum + c.durationSec,
      0
    );
    const avgDuration = totalCalls ? Math.round(totalDuration / totalCalls) : 0;

    return {
      totalCalls,
      connectedCalls,
      missedCalls,
      avgDuration,
    };
  }, [filteredAndSortedLogs]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setOwnerFilter("All");
    setDateFrom("");
    setDateTo("");
    setSortField("dateTime");
    setSortDirection("desc");
  };

  const openAddModal = () => {
    setForm({
      ...emptyForm,
      dateTime: new Date().toISOString().slice(0, 16),
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setForm(emptyForm);
  };

  const openEditModal = () => {
    if (!selectedCall) return;
    setForm(buildFormState(selectedCall));
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setForm(emptyForm);
  };

  const validateForm = () => {
    if (
      !form.contactName.trim() ||
      !form.phone.trim() ||
      !form.assignedTo.trim() ||
      !form.dateTime
    ) {
      alert("Please fill Contact Name, Phone, Assigned To, and Date & Time.");
      return false;
    }
    return true;
  };

  const handleCreateCallLog = () => {
    if (!validateForm()) return;

    const newLog: CallLog = {
      id: generateCallId(callLogs),
      contactName: form.contactName.trim(),
      company: form.company.trim() || undefined,
      phone: form.phone.trim(),
      leadId: form.leadId.trim() || undefined,
      leadName: form.leadName.trim() || undefined,
      assignedTo: form.assignedTo.trim(),
      type: form.type,
      status: form.status,
      durationSec: Number(form.durationSec || 0),
      dateTime: form.dateTime,
      notes: form.notes.trim(),
      followUpDate: form.followUpDate || undefined,
      recordingUrl: form.recordingUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newLog, ...callLogs];
    setCallLogs(updated);
    setSelectedCallId(newLog.id);
    syncLeadActivityFromCall("call_added", newLog);
    closeAddModal();
  };

  const handleEditCallLog = () => {
    if (!validateForm() || !selectedCall) return;

    const updatedLog: CallLog = {
      ...selectedCall,
      contactName: form.contactName.trim(),
      company: form.company.trim() || undefined,
      phone: form.phone.trim(),
      leadId: form.leadId.trim() || undefined,
      leadName: form.leadName.trim() || undefined,
      assignedTo: form.assignedTo.trim(),
      type: form.type,
      status: form.status,
      durationSec: Number(form.durationSec || 0),
      dateTime: form.dateTime,
      notes: form.notes.trim(),
      followUpDate: form.followUpDate || undefined,
      recordingUrl: form.recordingUrl.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    const updated = callLogs.map((item) =>
      item.id === selectedCall.id ? updatedLog : item
    );

    setCallLogs(updated);
    setSelectedCallId(updatedLog.id);
    syncLeadActivityFromCall("call_updated", updatedLog);
    closeEditModal();
  };

  const confirmDeleteSelectedCall = () => {
    if (!deleteTarget) return;

    const target = deleteTarget;
    const updated = callLogs.filter((item) => item.id !== target.id);

    setCallLogs(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== target.id));

    if (selectedCallId === target.id) {
      setSelectedCallId(updated[0]?.id ?? "");
    }

    syncLeadActivityFromCall("call_deleted", target);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert("Please select call logs first.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected call log(s)?`
    );

    if (!confirmed) return;

    const deleteLogs = callLogs.filter((item) => selectedIds.includes(item.id));
    const updated = callLogs.filter((item) => !selectedIds.includes(item.id));

    setCallLogs(updated);

    deleteLogs.forEach((log) => syncLeadActivityFromCall("call_deleted", log));

    setSelectedIds([]);
    setSelectedCallId(updated[0]?.id ?? "");
  };

  const buildExportRows = (items: CallLog[]) => {
    return [
      [
        "Call ID",
        "Contact Name",
        "Company",
        "Phone",
        "Lead ID",
        "Lead Name",
        "Assigned To",
        "Type",
        "Status",
        "Duration (sec)",
        "Date Time",
        "Follow Up Date",
        "Notes",
        "Recording URL",
      ],
      ...items.map((item) => [
        item.id,
        item.contactName,
        item.company || "",
        item.phone,
        item.leadId || "",
        item.leadName || "",
        item.assignedTo,
        item.type,
        item.status,
        String(item.durationSec),
        item.dateTime,
        item.followUpDate || "",
        item.notes,
        item.recordingUrl || "",
      ]),
    ];
  };

  const handleExportCsv = (mode: ExportMode) => {
    let exportItems: CallLog[] = [];

    if (mode === "selected") {
      exportItems = filteredAndSortedLogs.filter((item) =>
        selectedIds.includes(item.id)
      );
      if (exportItems.length === 0) {
        alert("No selected rows to export.");
        return;
      }
    }

    if (mode === "page") {
      exportItems = paginatedLogs;
    }

    if (mode === "filtered") {
      exportItems = filteredAndSortedLogs;
    }

    downloadCsv(
      `mei-call-logs-${mode}-${new Date().toISOString().slice(0, 10)}.csv`,
      buildExportRows(exportItems)
    );
  };

  const goToLeadDetail = () => {
    if (!selectedCall?.leadId) {
      alert("This call log is not linked to a lead.");
      return;
    }

    navigate(`/leads/${selectedCall.leadId}`);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCurrentPageSelection = () => {
    if (allCurrentPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.pageBg,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: theme.text,
                letterSpacing: -0.4,
              }}
            >
              Call Logs
            </h1>
            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
                color: theme.subText,
                fontSize: 14,
              }}
            >
              Enterprise call tracking with editing, bulk actions, pagination, sorting,
              and lead activity sync.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => handleExportCsv("filtered")}
              style={toolbarButton(theme)}
            >
              Export Filtered
            </button>

            <button
              onClick={openAddModal}
              style={{
                ...toolbarButton(theme),
                background: theme.primary,
                color: theme.inverseText,
                border: "none",
              }}
            >
              + Add Call Log
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            title="Total Calls"
            value={String(stats.totalCalls)}
            subtitle="Filtered results"
            mode={mode}
          />
          <StatCard
            title="Connected Calls"
            value={String(stats.connectedCalls)}
            subtitle="Successful conversations"
            mode={mode}
          />
          <StatCard
            title="Missed Calls"
            value={String(stats.missedCalls)}
            subtitle="Attention needed"
            mode={mode}
          />
          <StatCard
            title="Average Duration"
            value={formatDuration(stats.avgDuration)}
            subtitle="Based on filtered results"
            mode={mode}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2.15fr) minmax(340px, 0.95fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                mode === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.24)"
                  : "0 8px 20px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                padding: 18,
                borderBottom: `1px solid ${theme.border}`,
                background: theme.sectionBg,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr auto",
                  gap: 12,
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by call ID, contact, phone, lead, company..."
                  style={inputStyle(theme)}
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "All" | CallType)}
                  style={inputStyle(theme)}
                >
                  <option value="All">All Types</option>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Missed">Missed</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "All" | CallStatus)
                  }
                  style={inputStyle(theme)}
                >
                  <option value="All">All Status</option>
                  <option value="Connected">Connected</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Busy">Busy</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  style={inputStyle(theme)}
                >
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner === "All" ? "All Owners" : owner}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={inputStyle(theme)}
                />

                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={inputStyle(theme)}
                />

                <select
                  value={`${sortField}:${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split(":") as [
                      SortField,
                      SortDirection
                    ];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  style={inputStyle(theme)}
                >
                  <option value="dateTime:desc">Newest Date</option>
                  <option value="dateTime:asc">Oldest Date</option>
                  <option value="durationSec:desc">Longest Duration</option>
                  <option value="durationSec:asc">Shortest Duration</option>
                </select>

                <button onClick={resetFilters} style={toolbarButton(theme)}>
                  Clear
                </button>
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderBottom: `1px solid ${theme.border}`,
                background: theme.cardBg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={toggleCurrentPageSelection} style={toolbarButton(theme)}>
                  {allCurrentPageSelected ? "Unselect Page" : "Select Page"}
                </button>

                <button
                  onClick={() => handleExportCsv("selected")}
                  style={toolbarButton(theme)}
                >
                  Export Selected
                </button>

                <button
                  onClick={() => handleExportCsv("page")}
                  style={toolbarButton(theme)}
                >
                  Export This Page
                </button>

                <button onClick={handleBulkDelete} style={dangerButton(theme)}>
                  Delete Selected
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  color: theme.subText,
                  fontSize: 13,
                  flexWrap: "wrap",
                }}
              >
                <span>{selectedIds.length} selected</span>

                <select
                  value={String(pageSize)}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  style={{
                    ...inputStyle(theme),
                    width: 90,
                    padding: "10px 12px",
                  }}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  minWidth: 1380,
                }}
              >
                <thead>
                  <tr style={{ background: theme.tableHeadBg }}>
                    {[
                      "",
                      "Call ID",
                      "Contact",
                      "Phone",
                      "Type",
                      "Status",
                      "Duration",
                      "Date & Time",
                      "Assigned To",
                      "Follow-up",
                      "Recording",
                    ].map((head, index) => (
                      <th
                        key={`${head}-${index}`}
                        style={{
                          textAlign: "left",
                          padding: "14px 16px",
                          fontSize: 13,
                          fontWeight: 800,
                          color: theme.subText,
                          borderBottom: `1px solid ${theme.border}`,
                          whiteSpace: "nowrap",
                          position: "sticky",
                          top: 0,
                          background: theme.tableHeadBg,
                          zIndex: 1,
                        }}
                      >
                        {index === 0 ? (
                          <input
                            type="checkbox"
                            checked={allCurrentPageSelected}
                            onChange={toggleCurrentPageSelection}
                          />
                        ) : (
                          head
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          padding: 24,
                          textAlign: "center",
                          color: theme.subText,
                          background: theme.cardBg,
                        }}
                      >
                        No call logs found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((call) => {
                      const statusColors = getStatusColor(call.status);
                      const typeColors = getTypeColor(call.type);
                      const isSelectedRow = selectedCall?.id === call.id;
                      const isChecked = selectedIds.includes(call.id);

                      return (
                        <tr
                          key={call.id}
                          onClick={() => setSelectedCallId(call.id)}
                          style={{
                            cursor: "pointer",
                            background: isSelectedRow ? theme.rowHover : theme.rowBg,
                            transform: isSelectedRow ? "scale(0.995)" : "scale(1)",
                            transition: "all 180ms ease",
                            boxShadow: isSelectedRow
                              ? "inset 3px 0 0 rgba(99,102,241,0.9)"
                              : "inset 0 0 0 rgba(0,0,0,0)",
                          }}
                        >
                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleRowSelection(call.id)}
                            />
                          </td>

                          <td
                            style={cellStyle(theme, true)}
                          >
                            {call.id}
                          </td>

                          <td style={cellStyle(theme)}>
                            <div style={{ color: theme.text, fontWeight: 700 }}>
                              {call.contactName}
                            </div>
                            <div style={{ color: theme.subText, fontSize: 12, marginTop: 4 }}>
                              {call.leadName || call.company || "—"}
                            </div>
                          </td>

                          <td style={cellStyle(theme)}>{call.phone}</td>

                          <td style={cellStyle(theme)}>
                            <span style={badgeStyle(typeColors)}>
                              {call.type}
                            </span>
                          </td>

                          <td style={cellStyle(theme)}>
                            <span style={badgeStyle(statusColors)}>
                              {call.status}
                            </span>
                          </td>

                          <td style={cellStyle(theme)}>
                            {formatDuration(call.durationSec)}
                          </td>

                          <td style={cellStyle(theme)}>
                            {formatDateTime(call.dateTime)}
                          </td>

                          <td style={cellStyle(theme)}>{call.assignedTo}</td>

                          <td style={cellStyle(theme)}>
                            {call.followUpDate || "—"}
                          </td>

                          <td
                            style={cellStyle(theme)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {call.recordingUrl ? (
                              <a
                                href={call.recordingUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={toolbarButton(theme)}
                              >
                                ▶ Recording
                              </a>
                            ) : (
                              <span style={{ color: theme.mutedText, fontSize: 13 }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: 14,
                borderTop: `1px solid ${theme.border}`,
                background: theme.cardBg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ color: theme.subText, fontSize: 13 }}>
                Showing {(currentPage - 1) * pageSize + (paginatedLogs.length ? 1 : 0)}–
                {(currentPage - 1) * pageSize + paginatedLogs.length} of {filteredAndSortedLogs.length}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  style={{
                    ...toolbarButton(theme),
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Prev
                </button>

                <div
                  style={{
                    minWidth: 90,
                    textAlign: "center",
                    color: theme.text,
                    fontWeight: 700,
                  }}
                >
                  Page {currentPage} / {totalPages}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  style={{
                    ...toolbarButton(theme),
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              padding: 20,
              boxShadow:
                mode === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.24)"
                  : "0 8px 20px rgba(15,23,42,0.06)",
              position: "sticky",
              top: 20,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: theme.subText, marginBottom: 6 }}>
                Call Details
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
                {selectedCall?.contactName || "Select a call"}
              </div>
              <div style={{ fontSize: 13, color: theme.mutedText, marginTop: 6 }}>
                {selectedCall?.id || "No call selected"}
              </div>
            </div>

            {selectedCall ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  {[
                    { label: "Phone", value: selectedCall.phone },
                    { label: "Assigned To", value: selectedCall.assignedTo },
                    { label: "Call Type", value: selectedCall.type },
                    { label: "Status", value: selectedCall.status },
                    { label: "Duration", value: formatDuration(selectedCall.durationSec) },
                    { label: "Follow-up", value: selectedCall.followUpDate || "Not scheduled" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        background: theme.sectionBg,
                        border: `1px solid ${theme.borderSoft}`,
                        borderRadius: 14,
                        padding: 14,
                      }}
                    >
                      <div style={{ fontSize: 12, color: theme.subText }}>{item.label}</div>
                      <div style={{ marginTop: 6, fontWeight: 700, color: theme.text }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 14,
                    background: theme.sectionBg,
                    padding: 16,
                    marginBottom: 18,
                  }}
                >
                  <div style={{ fontSize: 13, color: theme.subText, marginBottom: 8 }}>
                    Lead / Context
                  </div>
                  <div style={{ color: theme.text, fontWeight: 700 }}>
                    {selectedCall.leadName || "General Contact"}
                  </div>
                  <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 6 }}>
                    {selectedCall.company || "No company linked"}
                  </div>
                  <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 6 }}>
                    Lead ID: {selectedCall.leadId || "—"}
                  </div>
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 14,
                    background: theme.sectionBg,
                    padding: 16,
                    marginBottom: 18,
                  }}
                >
                  <div style={{ fontSize: 13, color: theme.subText, marginBottom: 8 }}>
                    Notes
                  </div>
                  <div style={{ color: theme.text, fontSize: 14, lineHeight: 1.6 }}>
                    {selectedCall.notes || "No notes added yet."}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <button onClick={openEditModal} style={toolbarButton(theme)}>
                    Edit Call Log
                  </button>

                  <button
                    onClick={() => setDeleteTarget(selectedCall)}
                    style={dangerButton(theme)}
                  >
                    Delete Call Log
                  </button>

                  <button onClick={goToLeadDetail} style={toolbarButton(theme)}>
                    Open Lead Detail
                  </button>

                  {selectedCall.recordingUrl ? (
                    <a
                      href={selectedCall.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...toolbarButton(theme),
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      Play Call Recording
                    </a>
                  ) : (
                    <button
                      style={{
                        ...toolbarButton(theme),
                        color: theme.mutedText,
                        cursor: "not-allowed",
                      }}
                    >
                      No Recording Available
                    </button>
                  )}

                  <button style={toolbarButton(theme)}>Create Task</button>

                  <a
                    href={`tel:${selectedCall.phone}`}
                    style={{
                      ...toolbarButton(theme),
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Call Again
                  </a>
                </div>
              </>
            ) : (
              <div
                style={{
                  color: theme.subText,
                  fontSize: 14,
                  padding: 20,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: 14,
                  background: theme.sectionBg,
                }}
              >
                Select a call log row from the table to view details here.
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <ModalShell
          mode={mode}
          title="Add Call Log"
          subtitle="Create a new call entry and sync it into localStorage + lead activity history."
          onClose={closeAddModal}
        >
          <CallForm
            theme={theme}
            form={form}
            setForm={setForm}
            onCancel={closeAddModal}
            onSubmit={handleCreateCallLog}
            submitLabel="Save Call Log"
          />
        </ModalShell>
      )}

      {isEditModalOpen && (
        <ModalShell
          mode={mode}
          title="Edit Call Log"
          subtitle="Update the selected call log and sync the edit to lead activity history."
          onClose={closeEditModal}
        >
          <CallForm
            theme={theme}
            form={form}
            setForm={setForm}
            onCancel={closeEditModal}
            onSubmit={handleEditCallLog}
            submitLabel="Update Call Log"
          />
        </ModalShell>
      )}

      {deleteTarget && (
        <ModalShell
          mode={mode}
          title="Delete Call Log"
          subtitle="This action cannot be undone."
          onClose={() => setDeleteTarget(null)}
        >
          <div style={{ padding: 20 }}>
            <div
              style={{
                color: theme.text,
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete <strong>{deleteTarget.id}</strong> for{" "}
              <strong>{deleteTarget.contactName}</strong>?
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setDeleteTarget(null)} style={toolbarButton(theme)}>
                Cancel
              </button>
              <button onClick={confirmDeleteSelectedCall} style={dangerButton(theme)}>
                Confirm Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function CallForm({
  theme,
  form,
  setForm,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  theme: ReturnType<typeof getTheme>;
  form: CallLogFormState;
  setForm: React.Dispatch<React.SetStateAction<CallLogFormState>>;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <Label themeText={theme.text}>Contact Name</Label>
          <input
            value={form.contactName}
            onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Enter contact name"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Company</Label>
          <input
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Enter company"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Phone</Label>
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Assigned To</Label>
          <input
            value={form.assignedTo}
            onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Sales owner name"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Lead ID</Label>
          <input
            value={form.leadId}
            onChange={(e) => setForm((prev) => ({ ...prev, leadId: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="1001"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Lead Name</Label>
          <input
            value={form.leadName}
            onChange={(e) => setForm((prev) => ({ ...prev, leadName: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="Whitefield Villa Buyer"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Call Type</Label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as CallType }))}
            style={inputStyle(theme)}
          >
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
            <option value="Missed">Missed</option>
          </select>
        </div>

        <div>
          <Label themeText={theme.text}>Status</Label>
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as CallStatus }))}
            style={inputStyle(theme)}
          >
            <option value="Connected">Connected</option>
            <option value="No Answer">No Answer</option>
            <option value="Busy">Busy</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <Label themeText={theme.text}>Duration (seconds)</Label>
          <input
            type="number"
            min="0"
            value={form.durationSec}
            onChange={(e) => setForm((prev) => ({ ...prev, durationSec: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="320"
          />
        </div>

        <div>
          <Label themeText={theme.text}>Date & Time</Label>
          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm((prev) => ({ ...prev, dateTime: e.target.value }))}
            style={inputStyle(theme)}
          />
        </div>

        <div>
          <Label themeText={theme.text}>Follow-up Date</Label>
          <input
            type="date"
            value={form.followUpDate}
            onChange={(e) => setForm((prev) => ({ ...prev, followUpDate: e.target.value }))}
            style={inputStyle(theme)}
          />
        </div>

        <div>
          <Label themeText={theme.text}>Recording URL</Label>
          <input
            value={form.recordingUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, recordingUrl: e.target.value }))}
            style={inputStyle(theme)}
            placeholder="https://example.com/recording.mp3"
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <Label themeText={theme.text}>Notes</Label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            style={{
              ...inputStyle(theme),
              minHeight: 110,
              resize: "vertical",
            }}
            placeholder="Call summary, follow-up context, customer intent..."
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 20,
        }}
      >
        <button onClick={onCancel} style={toolbarButton(theme)}>
          Cancel
        </button>

        <button
          onClick={onSubmit}
          style={{
            ...toolbarButton(theme),
            background: theme.primary,
            color: theme.inverseText,
            border: "none",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function ModalShell({
  mode,
  title,
  subtitle,
  onClose,
  children,
}: {
  mode: ThemeMode;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const theme = getTheme(mode);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
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
          maxWidth: 900,
          maxHeight: "90vh",
          overflowY: "auto",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 22,
          boxShadow:
            mode === "dark"
              ? "0 24px 60px rgba(0,0,0,0.42)"
              : "0 24px 60px rgba(15,23,42,0.18)",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
              {title}
            </div>
            <div style={{ fontSize: 13, color: theme.subText, marginTop: 4 }}>
              {subtitle}
            </div>
          </div>

          <button onClick={onClose} style={toolbarButton(theme)}>
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function inputStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    outline: "none",
    boxSizing: "border-box",
  };
}

function toolbarButton(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    background: theme.cardBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function dangerButton(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    background: "rgba(239,68,68,0.08)",
    color: "#dc2626",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function cellStyle(
  theme: ReturnType<typeof getTheme>,
  bold = false
): React.CSSProperties {
  return {
    padding: "14px 16px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    color: theme.text,
    whiteSpace: "nowrap",
    fontWeight: bold ? 700 : 500,
  };
}

function badgeStyle(colors: {
  bg: string;
  text: string;
  border: string;
}): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };
}