import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadDetailPageProps = {
  mode: ThemeMode;
};

type LeadStatus =
  | "New"
  | "Attempted"
  | "Contacted"
  | "Qualified"
  | "Follow-up"
  | "Site Visit Scheduled"
  | "Negotiation"
  | "Won"
  | "Lost";

type Priority = "Cold" | "Warm" | "Hot";
type TaskStatus = "Pending" | "In Progress" | "Done" | "Overdue";
type ActivityType =
  | "created"
  | "status_changed"
  | "note_added"
  | "call_logged"
  | "task_created"
  | "whatsapp_sent"
  | "email_sent"
  | "followup_updated"
  | "converted";

type LeadNoteTag = "General" | "Budget" | "Objection" | "Follow-up" | "Meeting";

type LeadInfo = {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  company?: string;
  occupation?: string;
  city: string;
  address: string;
  preferredLanguage: string;
  source: string;
  campaign?: string;
  referredBy?: string;
  owner: string;
  ownerRole: string;
  ownerEmail: string;
  ownerPhone: string;
  status: LeadStatus;
  priority: Priority;
  budget: string;
  requirementType: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  timeline: string;
  financingType: string;
  purpose: string;
  sqft: string;
  facing: string;
  floorPreference: string;
  expectedCloseDate: string;
  probability: number;
  leadScore: number;
  estimatedDealValue: string;
  riskFlag: string;
  nextFollowUp: string;
  followUpType: string;
  lastFollowUp: string;
  tags: string[];
  objections: string[];
};

type TaskItem = {
  id: string;
  title: string;
  due: string;
  status: TaskStatus;
  priority: "Low" | "Medium" | "High";
  assignee: string;
};

type NoteItem = {
  id: string;
  author: string;
  tag: LeadNoteTag;
  content: string;
  createdAt: string;
  pinned?: boolean;
};

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  user: string;
};

type AttachmentItem = {
  id: string;
  fileName: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
};

type CommunicationItem = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
};

const PIPELINE_STEPS: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Follow-up",
  "Negotiation",
  "Won",
];

const sampleLead: LeadInfo = {
  id: "LD-1001",
  name: "Arun Kumar",
  phone: "+91 98765 43210",
  alternatePhone: "+91 91234 56789",
  email: "arun.kumar@email.com",
  company: "Apex Systems",
  occupation: "Senior Software Engineer",
  city: "Bengaluru",
  address: "Whitefield, Bengaluru, Karnataka",
  preferredLanguage: "Tamil / English",
  source: "Facebook Lead Form",
  campaign: "Whitefield 2BHK Campaign",
  referredBy: "Rajesh",
  owner: "Balraj",
  ownerRole: "Sales Manager",
  ownerEmail: "balraj@mei.com",
  ownerPhone: "+91 90000 11111",
  status: "Negotiation",
  priority: "Hot",
  budget: "₹65,00,000",
  requirementType: "2BHK Flat",
  location: "Whitefield",
  createdAt: "28 Mar 2026, 10:15 AM",
  updatedAt: "06 Apr 2026, 05:20 PM",
  timeline: "Within 30 Days",
  financingType: "Bank Loan",
  purpose: "Self-use",
  sqft: "1150 - 1300 Sq.ft",
  facing: "East",
  floorPreference: "3rd Floor and above",
  expectedCloseDate: "12 Apr 2026",
  probability: 70,
  leadScore: 82,
  estimatedDealValue: "₹65,00,000",
  riskFlag: "Loan approval pending",
  nextFollowUp: "07 Apr 2026, 11:30 AM",
  followUpType: "Call",
  lastFollowUp: "06 Apr 2026, 03:40 PM",
  tags: ["Hot Lead", "Loan Required", "Self Use", "Whitefield", "High Intent"],
  objections: [
    "Comparing with competitor project",
    "Wants better negotiation on final price",
    "Waiting for loan pre-approval",
  ],
};

const initialTasks: TaskItem[] = [
  {
    id: "TSK-01",
    title: "Call customer regarding budget confirmation",
    due: "Today, 06:30 PM",
    status: "Pending",
    priority: "High",
    assignee: "Balraj",
  },
  {
    id: "TSK-02",
    title: "Send updated brochure and floor plan",
    due: "Tomorrow, 10:00 AM",
    status: "In Progress",
    priority: "Medium",
    assignee: "Balraj",
  },
  {
    id: "TSK-03",
    title: "Coordinate site visit with project team",
    due: "08 Apr 2026, 01:00 PM",
    status: "Overdue",
    priority: "High",
    assignee: "Operations Team",
  },
];

const initialNotes: NoteItem[] = [
  {
    id: "NOTE-01",
    author: "Balraj",
    tag: "Budget",
    content:
      "Customer said budget can stretch up to ₹68L if loan process is smooth and registration support is included.",
    createdAt: "06 Apr 2026, 04:10 PM",
    pinned: true,
  },
  {
    id: "NOTE-02",
    author: "Balraj",
    tag: "Objection",
    content:
      "He is comparing with another project nearby and wants clarity on amenities, maintenance cost, and possession timeline.",
    createdAt: "05 Apr 2026, 06:25 PM",
  },
  {
    id: "NOTE-03",
    author: "Rakesh",
    tag: "Follow-up",
    content:
      "Requested a callback after office hours. Prefers short WhatsApp summaries before calls.",
    createdAt: "04 Apr 2026, 08:15 PM",
  },
];

const initialActivities: ActivityItem[] = [
  {
    id: "ACT-01",
    type: "status_changed",
    title: "Status changed to Negotiation",
    description: "Moved from Follow-up to Negotiation after pricing discussion.",
    createdAt: "06 Apr 2026, 05:12 PM",
    user: "Balraj",
  },
  {
    id: "ACT-02",
    type: "note_added",
    title: "Budget note added",
    description: "Customer budget stretch information recorded.",
    createdAt: "06 Apr 2026, 04:10 PM",
    user: "Balraj",
  },
  {
    id: "ACT-03",
    type: "whatsapp_sent",
    title: "WhatsApp summary sent",
    description: "Shared brochure, floor plan, and tentative price breakup.",
    createdAt: "06 Apr 2026, 03:50 PM",
    user: "Balraj",
  },
  {
    id: "ACT-04",
    type: "call_logged",
    title: "Call logged",
    description: "Discussed loan process, site visit, and possession timeline.",
    createdAt: "06 Apr 2026, 03:40 PM",
    user: "Balraj",
  },
  {
    id: "ACT-05",
    type: "created",
    title: "Lead created",
    description: "Lead captured from Facebook Lead Form campaign.",
    createdAt: "28 Mar 2026, 10:15 AM",
    user: "System",
  },
];

const attachments: AttachmentItem[] = [
  {
    id: "ATT-01",
    fileName: "Whitefield-2BHK-Brochure.pdf",
    size: "2.4 MB",
    uploadedBy: "Balraj",
    uploadedAt: "05 Apr 2026, 05:12 PM",
  },
  {
    id: "ATT-02",
    fileName: "FloorPlan-TypeA.jpg",
    size: "1.1 MB",
    uploadedBy: "Balraj",
    uploadedAt: "05 Apr 2026, 05:14 PM",
  },
];

const calls: CommunicationItem[] = [
  {
    id: "CALL-01",
    title: "Pricing discussion call",
    subtitle: "12 mins • Connected",
    time: "06 Apr 2026, 03:40 PM",
  },
  {
    id: "CALL-02",
    title: "Requirement qualification call",
    subtitle: "8 mins • Connected",
    time: "04 Apr 2026, 08:00 PM",
  },
];

const whatsapps: CommunicationItem[] = [
  {
    id: "WA-01",
    title: "Brochure and floor plan sent",
    subtitle: "Documents shared successfully",
    time: "06 Apr 2026, 03:50 PM",
  },
  {
    id: "WA-02",
    title: "Reminder message sent",
    subtitle: "Asked for callback confirmation",
    time: "05 Apr 2026, 07:15 PM",
  },
];

const emails: CommunicationItem[] = [
  {
    id: "EMAIL-01",
    title: "Project details emailed",
    subtitle: "Sent to arun.kumar@email.com",
    time: "05 Apr 2026, 06:40 PM",
  },
];

export default function LeadDetailPage({ mode }: LeadDetailPageProps) {
  const theme = getTheme(mode);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [lead, setLead] = useState<LeadInfo>({
    ...sampleLead,
    id: id ? `LD-${id}` : sampleLead.id,
  });
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"calls" | "whatsapp" | "emails">(
    "calls"
  );

  const overdueTasksCount = tasks.filter((task) => task.status === "Overdue").length;
  const completedTasksCount = tasks.filter((task) => task.status === "Done").length;
  const currentPipelineIndex = PIPELINE_STEPS.indexOf(
    lead.status === "Won" || lead.status === "Lost" ? "Negotiation" : lead.status
  );

  const followUpState = useMemo(() => {
    if (overdueTasksCount > 0) return "overdue";
    if (lead.nextFollowUp.includes("07 Apr")) return "upcoming";
    return "due";
  }, [lead.nextFollowUp, overdueTasksCount]);

  const handleStatusChange = (status: LeadStatus) => {
    setLead((prev) => ({
      ...prev,
      status,
      updatedAt: "06 Apr 2026, 06:00 PM",
    }));

    setActivities((prev) => [
      {
        id: `ACT-${prev.length + 1}`,
        type: "status_changed",
        title: `Status changed to ${status}`,
        description: `Lead moved to ${status} stage.`,
        createdAt: "06 Apr 2026, 06:00 PM",
        user: "You",
      },
      ...prev,
    ]);
  };

  const handleAddNote = () => {
    const trimmed = newNote.trim();
    if (!trimmed) return;

    const note: NoteItem = {
      id: `NOTE-${notes.length + 1}`,
      author: "You",
      tag: "General",
      content: trimmed,
      createdAt: "06 Apr 2026, 06:05 PM",
    };

    setNotes((prev) => [note, ...prev]);
    setActivities((prev) => [
      {
        id: `ACT-${prev.length + 1}`,
        type: "note_added",
        title: "New note added",
        description: trimmed,
        createdAt: "06 Apr 2026, 06:05 PM",
        user: "You",
      },
      ...prev,
    ]);
    setNewNote("");
  };

  const markTaskDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: "Done" } : task))
    );
  };

  const getStatusBadgeStyles = (status: LeadStatus) => {
    if (status === "Won") {
      return { background: "rgba(34,197,94,0.12)", color: "#16a34a" };
    }
    if (status === "Lost") {
      return { background: "rgba(239,68,68,0.12)", color: "#dc2626" };
    }
    if (status === "Negotiation") {
      return { background: "rgba(168,85,247,0.14)", color: "#7c3aed" };
    }
    if (status === "Follow-up" || status === "Site Visit Scheduled") {
      return { background: "rgba(249,115,22,0.12)", color: "#ea580c" };
    }
    return { background: "rgba(59,130,246,0.12)", color: "#2563eb" };
  };

  const getPriorityBadgeStyles = (priority: Priority) => {
    if (priority === "Hot") {
      return { background: "rgba(239,68,68,0.12)", color: "#dc2626" };
    }
    if (priority === "Warm") {
      return { background: "rgba(249,115,22,0.12)", color: "#ea580c" };
    }
    return { background: "rgba(148,163,184,0.18)", color: theme.text };
  };

  const getTaskStatusStyles = (status: TaskStatus) => {
    if (status === "Done") {
      return { background: "rgba(34,197,94,0.12)", color: "#16a34a" };
    }
    if (status === "Overdue") {
      return { background: "rgba(239,68,68,0.12)", color: "#dc2626" };
    }
    if (status === "In Progress") {
      return { background: "rgba(59,130,246,0.12)", color: "#2563eb" };
    }
    return { background: "rgba(249,115,22,0.12)", color: "#ea580c" };
  };

  const followUpTone =
    followUpState === "overdue"
      ? { background: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.28)", color: "#dc2626" }
      : followUpState === "due"
      ? { background: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.28)", color: "#ea580c" }
      : { background: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.28)", color: "#16a34a" };

  const communicationList =
    activeTab === "calls" ? calls : activeTab === "whatsapp" ? whatsapps : emails;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.pageBg,
        color: theme.text,
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 16,
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            color: theme.text,
            borderRadius: 10,
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <LeadHeader
          theme={theme}
          lead={lead}
          onStatusChange={handleStatusChange}
          statusBadgeStyle={getStatusBadgeStyles(lead.status)}
          priorityBadgeStyle={getPriorityBadgeStyles(lead.priority)}
        />

        <LeadSummaryCard
          theme={theme}
          lead={lead}
          statusBadgeStyle={getStatusBadgeStyles(lead.status)}
          priorityBadgeStyle={getPriorityBadgeStyles(lead.priority)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <SectionCard title="Lead Information" theme={theme}>
              <InfoGrid
                theme={theme}
                items={[
                  ["Full Name", lead.name],
                  ["Mobile", lead.phone],
                  ["Alternate Number", lead.alternatePhone || "-"],
                  ["Email", lead.email],
                  ["Company", lead.company || "-"],
                  ["Occupation", lead.occupation || "-"],
                  ["City", lead.city],
                  ["Address", lead.address],
                  ["Preferred Language", lead.preferredLanguage],
                  ["Source", lead.source],
                  ["Campaign", lead.campaign || "-"],
                  ["Reference By", lead.referredBy || "-"],
                ]}
              />
            </SectionCard>

            <SectionCard title="Requirement Details" theme={theme}>
              <InfoGrid
                theme={theme}
                items={[
                  ["Requirement Type", lead.requirementType],
                  ["Budget", lead.budget],
                  ["Preferred Location", lead.location],
                  ["Purchase Timeline", lead.timeline],
                  ["Financing Type", lead.financingType],
                  ["Purpose", lead.purpose],
                  ["Sq.ft Preference", lead.sqft],
                  ["Facing", lead.facing],
                  ["Floor Preference", lead.floorPreference],
                ]}
              />
            </SectionCard>

            <SectionCard
              title="Notes"
              theme={theme}
              action={
                <button
                  type="button"
                  onClick={handleAddNote}
                  style={primaryButtonStyle(theme)}
                >
                  Add Note
                </button>
              }
            >
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write an internal note..."
                  rows={4}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    padding: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.cardBgSoft || theme.cardBg,
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <strong>{note.author}</strong>
                        <Badge
                          label={note.tag}
                          background="rgba(59,130,246,0.12)"
                          color="#2563eb"
                        />
                        {note.pinned ? (
                          <Badge
                            label="Pinned"
                            background="rgba(245,158,11,0.12)"
                            color="#d97706"
                          />
                        ) : null}
                      </div>
                      <span style={{ color: theme.mutedText, fontSize: 13 }}>{note.createdAt}</span>
                    </div>
                    <div style={{ color: theme.subText, lineHeight: 1.7 }}>{note.content}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Activity Timeline" theme={theme}>
              <div style={{ display: "grid", gap: 14 }}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 12,
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        background: theme.cardBgSoft || "rgba(148,163,184,0.12)",
                        border: `1px solid ${theme.border}`,
                        fontSize: 18,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div
                      style={{
                        border: `1px solid ${theme.border}`,
                        borderRadius: 14,
                        padding: 14,
                        background: theme.cardBg,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          marginBottom: 6,
                        }}
                      >
                        <strong>{activity.title}</strong>
                        <span style={{ color: theme.mutedText, fontSize: 13 }}>
                          {activity.createdAt}
                        </span>
                      </div>
                      <div style={{ color: theme.subText, marginBottom: 4 }}>{activity.description}</div>
                      <div style={{ color: theme.mutedText, fontSize: 13 }}>by {activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Communication" theme={theme}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {(["calls", "whatsapp", "emails"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: `1px solid ${isActive ? theme.primary : theme.border}`,
                        background: isActive ? theme.primary : theme.cardBg,
                        color: isActive ? "#fff" : theme.text,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {communicationList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: 14,
                      background: theme.cardBgSoft || theme.cardBg,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong>{item.title}</strong>
                      <span style={{ color: theme.mutedText, fontSize: 13 }}>{item.time}</span>
                    </div>
                    <div style={{ color: theme.subText, marginTop: 6 }}>{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Attachments" theme={theme}>
              <div style={{ display: "grid", gap: 12 }}>
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      background: theme.cardBg,
                      padding: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{file.fileName}</div>
                      <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 4 }}>
                        {file.size} • Uploaded by {file.uploadedBy} • {file.uploadedAt}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" style={ghostButtonStyle(theme)}>
                        Preview
                      </button>
                      <button type="button" style={ghostButtonStyle(theme)}>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div
            style={{
              display: "grid",
              gap: 20,
              position: "sticky",
              top: 20,
            }}
          >
            <SectionCard title="Quick Actions" theme={theme}>
              <div style={{ display: "grid", gap: 10 }}>
                <button type="button" style={primaryButtonStyle(theme)}>
                  Convert to Deal
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    Call
                  </button>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    WhatsApp
                  </button>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    Email
                  </button>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    Edit
                  </button>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    Add Task
                  </button>
                  <button type="button" style={ghostButtonStyle(theme)}>
                    Add Note
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Status & Pipeline" theme={theme}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <Badge
                  label={lead.status}
                  background={getStatusBadgeStyles(lead.status).background}
                  color={getStatusBadgeStyles(lead.status).color}
                />
                <Badge
                  label={`${lead.probability}% Probability`}
                  background="rgba(59,130,246,0.12)"
                  color="#2563eb"
                />
              </div>

              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {PIPELINE_STEPS.map((step, index) => {
                  const isActive = index <= currentPipelineIndex;
                  return (
                    <div key={step} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          border: `1px solid ${isActive ? theme.primary : theme.border}`,
                          background: isActive ? theme.primary : theme.cardBg,
                          color: isActive ? "#fff" : theme.mutedText,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div
                        style={{
                          color: isActive ? theme.text : theme.mutedText,
                          fontWeight: isActive ? 700 : 500,
                          paddingTop: 4,
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>

              <InfoGrid
                theme={theme}
                compact
                items={[
                  ["Expected Close", lead.expectedCloseDate],
                  ["Last Updated", lead.updatedAt],
                ]}
              />
            </SectionCard>

            <SectionCard title="Next Follow-up" theme={theme}>
              <div
                style={{
                  border: `1px solid ${followUpTone.border}`,
                  background: followUpTone.background,
                  color: followUpTone.color,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 14,
                  fontWeight: 700,
                }}
              >
                {overdueTasksCount > 0
                  ? "Attention needed: You have overdue follow-up items."
                  : "Follow-up is on track."}
              </div>

              <InfoGrid
                theme={theme}
                compact
                items={[
                  ["Next Follow-up", lead.nextFollowUp],
                  ["Type", lead.followUpType],
                  ["Last Follow-up", lead.lastFollowUp],
                  ["Assigned To", lead.owner],
                ]}
              />

              <button type="button" style={{ ...primaryButtonStyle(theme), marginTop: 14, width: "100%" }}>
                Reschedule Follow-up
              </button>
            </SectionCard>

            <SectionCard title="Assigned Owner" theme={theme}>
              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  padding: 14,
                  background: theme.cardBgSoft || theme.cardBg,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 16 }}>{lead.owner}</div>
                <div style={{ color: theme.subText, marginTop: 4 }}>{lead.ownerRole}</div>
                <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 12 }}>
                  {lead.ownerEmail}
                </div>
                <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 4 }}>
                  {lead.ownerPhone}
                </div>

                <button type="button" style={{ ...ghostButtonStyle(theme), marginTop: 14, width: "100%" }}>
                  Reassign Owner
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title="Tasks"
              theme={theme}
              subtitle={`${completedTasksCount} completed • ${overdueTasksCount} overdue`}
            >
              <div style={{ display: "grid", gap: 12 }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 14,
                      padding: 14,
                      background: theme.cardBg,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <strong>{task.title}</strong>
                      <Badge
                        label={task.status}
                        background={getTaskStatusStyles(task.status).background}
                        color={getTaskStatusStyles(task.status).color}
                      />
                    </div>
                    <div style={{ color: theme.subText, fontSize: 14, marginBottom: 8 }}>
                      Due: {task.due}
                    </div>
                    <div style={{ color: theme.mutedText, fontSize: 13, marginBottom: 12 }}>
                      {task.priority} Priority • Assigned to {task.assignee}
                    </div>
                    {task.status !== "Done" ? (
                      <button
                        type="button"
                        onClick={() => markTaskDone(task.id)}
                        style={ghostButtonStyle(theme)}
                      >
                        Mark as Done
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Tags / Labels" theme={theme}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {lead.tags.map((tag) => (
                  <Badge
                    key={tag}
                    label={tag}
                    background="rgba(99,102,241,0.12)"
                    color="#4f46e5"
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Objections / Pain Points" theme={theme}>
              <div style={{ display: "grid", gap: 10 }}>
                {lead.objections.map((objection) => (
                  <div
                    key={objection}
                    style={{
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12,
                      padding: 12,
                      background: theme.cardBgSoft || theme.cardBg,
                      color: theme.subText,
                    }}
                  >
                    • {objection}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Conversion Insight" theme={theme}>
              <InfoGrid
                theme={theme}
                compact
                items={[
                  ["Lead Score", `${lead.leadScore}/100`],
                  ["Probability", `${lead.probability}%`],
                  ["Estimated Deal Value", lead.estimatedDealValue],
                  ["Risk Flag", lead.riskFlag],
                ]}
              />
            </SectionCard>

            <SectionCard title="Deal Conversion" theme={theme}>
              <div style={{ color: theme.subText, lineHeight: 1.7, marginBottom: 14 }}>
                Convert this lead into a live deal with deal value, expected close date,
                pipeline stage, and follow-up carry-forward.
              </div>
              <button type="button" style={{ ...primaryButtonStyle(theme), width: "100%" }}>
                Convert to Deal
              </button>
            </SectionCard>

            <SectionCard title="Danger Zone" theme={theme}>
              <div style={{ display: "grid", gap: 10 }}>
                <button
                  type="button"
                  style={{
                    ...ghostButtonStyle(theme),
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#dc2626",
                  }}
                >
                  Mark as Lost
                </button>
                <button
                  type="button"
                  style={{
                    ...ghostButtonStyle(theme),
                    border: "1px solid rgba(249,115,22,0.3)",
                    color: "#ea580c",
                  }}
                >
                  Archive Lead
                </button>
                <button
                  type="button"
                  style={{
                    ...ghostButtonStyle(theme),
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#dc2626",
                  }}
                >
                  Delete Lead
                </button>
              </div>
            </SectionCard>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            color: theme.mutedText,
            fontSize: 13,
          }}
        >
          Route example: <code>/leads/1001</code> • Back to{" "}
          <Link to="/leads" style={{ color: theme.primary, textDecoration: "none" }}>
            Leads
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeadHeader({
  theme,
  lead,
  onStatusChange,
  statusBadgeStyle,
  priorityBadgeStyle,
}: {
  theme: any;
  lead: LeadInfo;
  onStatusChange: (status: LeadStatus) => void;
  statusBadgeStyle: { background: string; color: string };
  priorityBadgeStyle: { background: string; color: string };
}) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 20,
        marginBottom: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ color: theme.mutedText, fontSize: 13, marginBottom: 8 }}>
            Dashboard / Leads / {lead.id}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>{lead.name}</div>
          <div style={{ color: theme.mutedText, marginTop: 6 }}>
            {lead.id} • Last updated {lead.updatedAt}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "start" }}>
          <button type="button" style={ghostButtonStyle(theme)}>
            Edit Lead
          </button>
          <button type="button" style={ghostButtonStyle(theme)}>
            Call
          </button>
          <button type="button" style={ghostButtonStyle(theme)}>
            WhatsApp
          </button>
          <button type="button" style={primaryButtonStyle(theme)}>
            Convert to Deal
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <Badge
          label={lead.status}
          background={statusBadgeStyle.background}
          color={statusBadgeStyle.color}
        />
        <Badge
          label={lead.source}
          background="rgba(59,130,246,0.12)"
          color="#2563eb"
        />
        <Badge
          label={lead.priority}
          background={priorityBadgeStyle.background}
          color={priorityBadgeStyle.color}
        />
        <Badge
          label={`Owner: ${lead.owner}`}
          background="rgba(16,185,129,0.12)"
          color="#059669"
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["New", "Contacted", "Qualified", "Follow-up", "Negotiation", "Won", "Lost"] as LeadStatus[]).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                border: `1px solid ${lead.status === status ? theme.primary : theme.border}`,
                background: lead.status === status ? theme.primary : theme.cardBg,
                color: lead.status === status ? "#fff" : theme.text,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {status}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function LeadSummaryCard({
  theme,
  lead,
  statusBadgeStyle,
  priorityBadgeStyle,
}: {
  theme: any;
  lead: LeadInfo;
  statusBadgeStyle: { background: string; color: string };
  priorityBadgeStyle: { background: string; color: string };
}) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <SummaryBox theme={theme} label="Lead Name" value={lead.name} />
        <SummaryBox
          theme={theme}
          label="Status"
          value={
            <Badge
              label={lead.status}
              background={statusBadgeStyle.background}
              color={statusBadgeStyle.color}
            />
          }
        />
        <SummaryBox
          theme={theme}
          label="Priority"
          value={
            <Badge
              label={lead.priority}
              background={priorityBadgeStyle.background}
              color={priorityBadgeStyle.color}
            />
          }
        />
        <SummaryBox theme={theme} label="Budget" value={lead.budget} />
        <SummaryBox theme={theme} label="Requirement" value={lead.requirementType} />
        <SummaryBox theme={theme} label="Location" value={lead.location} />
        <SummaryBox theme={theme} label="Owner" value={lead.owner} />
        <SummaryBox theme={theme} label="Created On" value={lead.createdAt} />
      </div>
    </div>
  );
}

function SummaryBox({
  theme,
  label,
  value,
}: {
  theme: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: theme.cardBgSoft || theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ color: theme.mutedText, fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  theme,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  theme: any;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
          {subtitle ? (
            <div style={{ color: theme.mutedText, fontSize: 13, marginTop: 4 }}>{subtitle}</div>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoGrid({
  items,
  theme,
  compact = false,
}: {
  items: Array<[string, string]>;
  theme: any;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact
          ? "repeat(auto-fit, minmax(180px, 1fr))"
          : "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      {items.map(([label, value]) => (
        <div
          key={`${label}-${value}`}
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: compact ? 12 : 14,
            background: theme.cardBgSoft || theme.cardBg,
          }}
        >
          <div style={{ color: theme.mutedText, fontSize: 13, marginBottom: 8 }}>{label}</div>
          <div style={{ fontWeight: 700, color: theme.text }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function Badge({
  label,
  background,
  color,
}: {
  label: string;
  background: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background,
        color,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {label}
    </span>
  );
}

function primaryButtonStyle(theme: any): React.CSSProperties {
  return {
    border: "none",
    background: theme.primary,
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function ghostButtonStyle(theme: any): React.CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    background: theme.cardBg,
    color: theme.text,
    borderRadius: 10,
    padding: "12px 14px",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "created":
      return "✨";
    case "status_changed":
      return "🔁";
    case "note_added":
      return "📝";
    case "call_logged":
      return "📞";
    case "task_created":
      return "✅";
    case "whatsapp_sent":
      return "💬";
    case "email_sent":
      return "📧";
    case "followup_updated":
      return "📅";
    case "converted":
      return "💼";
    default:
      return "•";
  }
}