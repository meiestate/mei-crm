import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type CallType = "Incoming" | "Outgoing" | "Missed";
type CallStatus = "Connected" | "No Answer" | "Busy" | "Failed";

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

const CALL_LOGS_STORAGE_KEY = "mei-crm-call-logs";

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
  const [selectedCallId, setSelectedCallId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (callLogs.length > 0) {
      localStorage.setItem(CALL_LOGS_STORAGE_KEY, JSON.stringify(callLogs));
    }
  }, [callLogs]);

  const owners = useMemo(() => {
    const uniqueOwners = Array.from(new Set(callLogs.map((item) => item.assignedTo).filter(Boolean)));
    return ["All", ...uniqueOwners];
  }, [callLogs]);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((item) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.leadName || "").toLowerCase().includes(q) ||
        (item.company || "").toLowerCase().includes(q);

      const matchesType = typeFilter === "All" ? true : item.type === typeFilter;
      const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter;
      const matchesOwner = ownerFilter === "All" ? true : item.assignedTo === ownerFilter;

      const itemDate = new Date(item.dateTime);
      const fromOk = dateFrom ? itemDate >= new Date(`${dateFrom}T00:00:00`) : true;
      const toOk = dateTo ? itemDate <= new Date(`${dateTo}T23:59:59`) : true;

      return matchesSearch && matchesType && matchesStatus && matchesOwner && fromOk && toOk;
    });
  }, [callLogs, search, typeFilter, statusFilter, ownerFilter, dateFrom, dateTo]);

  const selectedCall =
    filteredLogs.find((item) => item.id === selectedCallId) ||
    callLogs.find((item) => item.id === selectedCallId) ||
    filteredLogs[0] ||
    callLogs[0] ||
    null;

  useEffect(() => {
    if (!selectedCallId && filteredLogs[0]) {
      setSelectedCallId(filteredLogs[0].id);
      return;
    }

    if (selectedCallId && !filteredLogs.some((item) => item.id === selectedCallId) && filteredLogs[0]) {
      setSelectedCallId(filteredLogs[0].id);
    }
  }, [filteredLogs, selectedCallId]);

  const stats = useMemo(() => {
    const totalCalls = filteredLogs.length;
    const connectedCalls = filteredLogs.filter((c) => c.status === "Connected").length;
    const missedCalls = filteredLogs.filter((c) => c.type === "Missed").length;
    const totalDuration = filteredLogs.reduce((sum, c) => sum + c.durationSec, 0);
    const avgDuration = totalCalls ? Math.round(totalDuration / totalCalls) : 0;

    return {
      totalCalls,
      connectedCalls,
      missedCalls,
      avgDuration,
    };
  }, [filteredLogs]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setOwnerFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  const openAddModal = () => {
    setForm({
      ...emptyForm,
      dateTime: new Date().toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const handleCreateCallLog = () => {
    if (!form.contactName.trim() || !form.phone.trim() || !form.assignedTo.trim() || !form.dateTime) {
      alert("Please fill Contact Name, Phone, Assigned To, and Date & Time.");
      return;
    }

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
    };

    const updated = [newLog, ...callLogs];
    setCallLogs(updated);
    setSelectedCallId(newLog.id);
    closeAddModal();
  };

  const handleExportCsv = () => {
    const rows: string[][] = [
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
      ...filteredLogs.map((item) => [
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

    downloadCsv("mei-call-logs.csv", rows);
  };

  const goToLeadDetail = () => {
    if (!selectedCall?.leadId) {
      alert("This call log is not linked to a lead.");
      return;
    }

    navigate(`/leads/${selectedCall.leadId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.pageBg,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1460, margin: "0 auto" }}>
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
              Track every incoming, outgoing, and missed call across your sales workflow.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleExportCsv}
              style={{
                background: theme.cardBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Export CSV
            </button>

            <button
              onClick={openAddModal}
              style={{
                background: theme.primary,
                color: theme.inverseText,
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
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
            subtitle="Filtered call logs"
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
            subtitle="Need quick follow-up"
            mode={mode}
          />
          <StatCard
            title="Average Duration"
            value={formatDuration(stats.avgDuration)}
            subtitle="Average for current view"
            mode={mode}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(340px, 0.95fr)",
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
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto",
                  gap: 12,
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by call ID, contact, phone, lead, company..."
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "All" | CallType)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
                >
                  <option value="All">All Types</option>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Missed">Missed</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | CallStatus)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
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
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
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
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
                />

                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    outline: "none",
                  }}
                />

                <button
                  onClick={resetFilters}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBg,
                    color: theme.text,
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  minWidth: 1260,
                }}
              >
                <thead>
                  <tr style={{ background: theme.tableHeadBg }}>
                    {[
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
                    ].map((head) => (
                      <th
                        key={head}
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
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
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
                    filteredLogs.map((call) => {
                      const statusColors = getStatusColor(call.status);
                      const typeColors = getTypeColor(call.type);
                      const isSelected = selectedCall?.id === call.id;

                      return (
                        <tr
                          key={call.id}
                          onClick={() => setSelectedCallId(call.id)}
                          style={{
                            cursor: "pointer",
                            background: isSelected ? theme.rowHover : theme.rowBg,
                            transform: isSelected ? "scale(0.995)" : "scale(1)",
                            transition: "all 180ms ease",
                            boxShadow: isSelected
                              ? "inset 3px 0 0 rgba(99,102,241,0.9)"
                              : "inset 0 0 0 rgba(0,0,0,0)",
                          }}
                        >
                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {call.id}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                            }}
                          >
                            <div style={{ color: theme.text, fontWeight: 700 }}>
                              {call.contactName}
                            </div>
                            <div style={{ color: theme.subText, fontSize: 12, marginTop: 4 }}>
                              {call.leadName || call.company || "—"}
                            </div>
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {call.phone}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: typeColors.bg,
                                color: typeColors.text,
                                border: `1px solid ${typeColors.border}`,
                                fontSize: 12,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {call.type}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: statusColors.bg,
                                color: statusColors.text,
                                border: `1px solid ${statusColors.border}`,
                                fontSize: 12,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {call.status}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDuration(call.durationSec)}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDateTime(call.dateTime)}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {call.assignedTo}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {call.followUpDate || "—"}
                          </td>

                          <td
                            style={{
                              padding: "14px 16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {call.recordingUrl ? (
                              <a
                                href={call.recordingUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textDecoration: "none",
                                  background: theme.cardBg,
                                  color: theme.text,
                                  border: `1px solid ${theme.border}`,
                                  borderRadius: 10,
                                  padding: "8px 10px",
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
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
                  <button
                    style={{
                      background: theme.primary,
                      color: theme.inverseText,
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Schedule Follow-up
                  </button>

                  <button
                    onClick={goToLeadDetail}
                    style={{
                      background: theme.cardBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Open Lead Detail
                  </button>

                  {selectedCall.recordingUrl ? (
                    <a
                      href={selectedCall.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        background: theme.cardBg,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      Play Call Recording
                    </a>
                  ) : (
                    <button
                      style={{
                        background: theme.cardBg,
                        color: theme.mutedText,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        fontWeight: 700,
                        cursor: "not-allowed",
                      }}
                    >
                      No Recording Available
                    </button>
                  )}

                  <button
                    style={{
                      background: theme.cardBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Create Task
                  </button>

                  <a
                    href={`tel:${selectedCall.phone}`}
                    style={{
                      textDecoration: "none",
                      background: theme.cardBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontWeight: 700,
                      textAlign: "center",
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

      {isModalOpen && (
        <div
          onClick={closeAddModal}
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
              maxWidth: 860,
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
                  Add Call Log
                </div>
                <div style={{ fontSize: 13, color: theme.subText, marginTop: 4 }}>
                  Create a new call entry and save it to localStorage.
                </div>
              </div>

              <button
                onClick={closeAddModal}
                style={{
                  background: theme.cardBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>

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
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, type: e.target.value as CallType }))
                    }
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
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value as CallStatus }))
                    }
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
                <button
                  onClick={closeAddModal}
                  style={{
                    background: theme.cardBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateCallLog}
                  style={{
                    background: theme.primary,
                    color: theme.inverseText,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Call Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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