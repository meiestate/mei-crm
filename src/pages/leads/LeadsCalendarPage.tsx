import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LeadsCalendarPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type CalendarViewMode = "Month" | "Week" | "Day" | "Agenda";
type LeadEventType =
  | "Call"
  | "WhatsApp"
  | "Meeting"
  | "Site Visit"
  | "Negotiation"
  | "Closing";

type LeadEventStatus = "Pending" | "Completed" | "Missed" | "Rescheduled";

type LeadEvent = {
  id: number;
  leadId?: number;
  leadName: string;
  phone: string;
  owner: string;
  city: string;
  date: string;
  time: string;
  priority: "Low" | "Medium" | "High" | "Hot";
  leadStatus: "New" | "Contacted" | "Qualified" | "Follow-up" | "Negotiation" | "Closed";
  activityType: LeadEventType;
  activityStatus: LeadEventStatus;
  note: string;
  budget: string;
  location: string;
  source?: string;
  isFromStorage?: boolean;
};

type StoredLeadLike = {
  id?: number | string;
  name?: string;
  fullName?: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
  owner?: string;
  assignedTo?: string;
  leadOwner?: string;
  city?: string;
  preferredLocation?: string;
  location?: string;
  area?: string;
  subLocation?: string;
  status?: string;
  priority?: string;
  source?: string;
  leadSource?: string;
  followUpDate?: string;
  nextFollowUpDate?: string;
  nextFollowUp?: string;
  nextFollowUpTime?: string;
  followUpType?: string;
  budget?: string | number;
  minBudget?: string | number;
  maxBudget?: string | number;
  leadSummary?: string;
  conversationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

const LEAD_STORAGE_KEYS = [
  "mei-crm-leads",
  "mei_crm_leads",
  "leads",
  "crm_leads",
];

const demoEvents: LeadEvent[] = [
  {
    id: 1,
    leadId: 1001,
    leadName: "Arun Kumar",
    phone: "9876543210",
    owner: "Madhan",
    city: "Chennai",
    date: "2026-04-07",
    time: "10:00 AM",
    priority: "Hot",
    leadStatus: "Follow-up",
    activityType: "Call",
    activityStatus: "Pending",
    note: "Budget discussion and project shortlist",
    budget: "₹45L - ₹60L",
    location: "OMR, Chennai",
    source: "WhatsApp",
  },
  {
    id: 2,
    leadId: 1002,
    leadName: "Priya",
    phone: "9123456780",
    owner: "Madhan",
    city: "Bangalore",
    date: "2026-04-08",
    time: "11:30 AM",
    priority: "High",
    leadStatus: "Qualified",
    activityType: "WhatsApp",
    activityStatus: "Pending",
    note: "Send brochure and price sheet",
    budget: "₹70L - ₹90L",
    location: "Whitefield, Bangalore",
    source: "Facebook",
  },
  {
    id: 3,
    leadId: 1003,
    leadName: "Rahul",
    phone: "9000012345",
    owner: "Arun",
    city: "Coimbatore",
    date: "2026-04-08",
    time: "02:00 PM",
    priority: "High",
    leadStatus: "Qualified",
    activityType: "Site Visit",
    activityStatus: "Pending",
    note: "Villa site visit confirmed",
    budget: "₹1.1Cr - ₹1.4Cr",
    location: "Saravanampatti, Coimbatore",
    source: "Website",
  },
  {
    id: 4,
    leadId: 1004,
    leadName: "Meena",
    phone: "9090909090",
    owner: "Priya",
    city: "Madurai",
    date: "2026-04-10",
    time: "04:30 PM",
    priority: "Medium",
    leadStatus: "Negotiation",
    activityType: "Negotiation",
    activityStatus: "Pending",
    note: "Final price negotiation round",
    budget: "₹80L",
    location: "KK Nagar, Madurai",
    source: "Referral",
  },
  {
    id: 5,
    leadId: 1005,
    leadName: "Suresh",
    phone: "9345678901",
    owner: "Madhan",
    city: "Trichy",
    date: "2026-04-05",
    time: "09:30 AM",
    priority: "High",
    leadStatus: "Follow-up",
    activityType: "Call",
    activityStatus: "Missed",
    note: "Missed follow-up call",
    budget: "₹32L",
    location: "Trichy Junction",
    source: "Walk-in",
  },
  {
    id: 6,
    leadId: 1006,
    leadName: "Lavanya",
    phone: "9888877766",
    owner: "Arun",
    city: "Chennai",
    date: "2026-04-12",
    time: "01:15 PM",
    priority: "Low",
    leadStatus: "Contacted",
    activityType: "Meeting",
    activityStatus: "Pending",
    note: "Office meeting for documentation review",
    budget: "₹52L",
    location: "Anna Nagar, Chennai",
    source: "Manual",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function LeadsCalendarPage({
  mode,
  onToggleTheme,
}: LeadsCalendarPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<CalendarViewMode>("Month");
  const [currentMonthLabel] = useState("April 2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("All Owners");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedActivityType, setSelectedActivityType] = useState("All Activities");
  const [selectedDate, setSelectedDate] = useState("2026-04-08");
  const [storageEvents, setStorageEvents] = useState<LeadEvent[]>([]);

  useEffect(() => {
    const syncStoredLeadEvents = () => {
      setStorageEvents(readLeadEventsFromStorage());
    };

    syncStoredLeadEvents();
    window.addEventListener("storage", syncStoredLeadEvents);

    return () => {
      window.removeEventListener("storage", syncStoredLeadEvents);
    };
  }, []);

  const allEvents = useMemo(() => {
    const merged = [...storageEvents];

    for (const demoEvent of demoEvents) {
      const alreadyExists = merged.some((item) => {
        return (
          item.leadName.toLowerCase() === demoEvent.leadName.toLowerCase() &&
          item.date === demoEvent.date &&
          item.time === demoEvent.time &&
          item.activityType === demoEvent.activityType
        );
      });

      if (!alreadyExists) {
        merged.push(demoEvent);
      }
    }

    return merged.sort((a, b) => {
      const aKey = `${a.date} ${to24HourTime(a.time)}`;
      const bKey = `${b.date} ${to24HourTime(b.time)}`;
      return aKey.localeCompare(bKey);
    });
  }, [storageEvents]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(
      new Set(allEvents.map((event) => event.owner).filter(Boolean))
    ).sort();

    return ["All Owners", ...owners];
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesSearch =
        !searchTerm.trim() ||
        event.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.phone.includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOwner =
        selectedOwner === "All Owners" || event.owner === selectedOwner;

      const matchesPriority =
        selectedPriority === "All Priorities" || event.priority === selectedPriority;

      const matchesActivityType =
        selectedActivityType === "All Activities" ||
        event.activityType === selectedActivityType;

      return (
        matchesSearch &&
        matchesOwner &&
        matchesPriority &&
        matchesActivityType
      );
    });
  }, [allEvents, searchTerm, selectedOwner, selectedPriority, selectedActivityType]);

  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter((event) => event.date === selectedDate);
  }, [filteredEvents, selectedDate]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return {
      todayFollowUps: filteredEvents.filter((e) => e.date === today).length,
      overdue: filteredEvents.filter((e) => e.activityStatus === "Missed").length,
      siteVisits: filteredEvents.filter((e) => e.activityType === "Site Visit").length,
      hotLeads: filteredEvents.filter((e) => e.priority === "Hot").length,
      thisWeekActivities: filteredEvents.length,
      convertedThisMonth: filteredEvents.filter((e) => e.leadStatus === "Closed").length,
    };
  }, [filteredEvents]);

  const monthCells = useMemo(() => {
    const cells = [];
    const todayIso = new Date().toISOString().slice(0, 10);

    for (let day = 1; day <= 30; day += 1) {
      const isoDate = `2026-04-${String(day).padStart(2, "0")}`;
      const dayEvents = filteredEvents.filter((event) => event.date === isoDate);

      cells.push({
        day,
        isoDate,
        events: dayEvents,
        isToday: isoDate === todayIso,
        isSelected: isoDate === selectedDate,
      });
    }

    return cells;
  }, [filteredEvents, selectedDate]);

  return (
    <AppLayout title="Leads Calendar" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 22,
            padding: 24,
            boxShadow: colors.shadowSoft,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              MEI CRM Calendar
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
                color: colors.text,
              }}
            >
              Leads Calendar
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: colors.subText,
                lineHeight: 1.7,
              }}
            >
              Track follow-ups, site visits, callbacks, and lead activities by date.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/leads")}
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
              ← Back to Leads
            </button>

            <HeaderButton
              label="Today"
              colors={colors}
              onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            />

            <HeaderButton label="Export" colors={colors} />

            <button
              onClick={() => navigate("/leads/new")}
              style={{
                border: "none",
                background: colors.primary,
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard title="Today Follow-ups" value={stats.todayFollowUps} colors={colors} />
          <StatCard
            title="Overdue Leads"
            value={stats.overdue}
            colors={colors}
            valueColor={stats.overdue > 0 ? colors.danger : colors.text}
          />
          <StatCard title="Site Visits" value={stats.siteVisits} colors={colors} />
          <StatCard title="This Week Activities" value={stats.thisWeekActivities} colors={colors} />
          <StatCard title="Hot Leads" value={stats.hotLeads} colors={colors} />
          <StatCard title="Converted This Month" value={stats.convertedThisMonth} colors={colors} />
        </section>

        <section
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 20,
            boxShadow: colors.shadowSoft,
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <ToolbarButton label="←" colors={colors} />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.text,
                  minWidth: 140,
                  textAlign: "center",
                }}
              >
                {currentMonthLabel}
              </div>
              <ToolbarButton label="→" colors={colors} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(["Month", "Week", "Day", "Agenda"] as CalendarViewMode[]).map((item) => {
                const active = viewMode === item;

                return (
                  <button
                    key={item}
                    onClick={() => setViewMode(item)}
                    style={{
                      border: `1px solid ${active ? colors.primary : colors.border}`,
                      background: active ? colors.primary : colors.cardBgSoft,
                      color: active ? "#fff" : colors.text,
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) 180px 180px 200px",
              gap: 12,
            }}
          >
            <input
              type="text"
              placeholder="Search lead, phone, city, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle(colors)}
            />

            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              style={inputStyle(colors)}
            >
              {ownerOptions.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={inputStyle(colors)}
            >
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Hot</option>
            </select>

            <select
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              style={inputStyle(colors)}
            >
              <option>All Activities</option>
              <option>Call</option>
              <option>WhatsApp</option>
              <option>Meeting</option>
              <option>Site Visit</option>
              <option>Negotiation</option>
              <option>Closing</option>
            </select>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: colors.shadowSoft,
            }}
          >
            {viewMode === "Month" && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                    background: colors.tableHeadBg,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      style={{
                        padding: "14px 12px",
                        fontSize: 13,
                        fontWeight: 800,
                        color: colors.subText,
                        borderRight: `1px solid ${colors.borderSoft || colors.border}`,
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  }}
                >
                  {monthCells.map((cell) => (
                    <button
                      key={cell.isoDate}
                      onClick={() => setSelectedDate(cell.isoDate)}
                      style={{
                        minHeight: 150,
                        border: `1px solid ${colors.borderSoft || colors.border}`,
                        background: cell.isSelected
                          ? colors.cardBgSoft
                          : cell.isToday
                          ? mode === "dark"
                            ? "rgba(59,130,246,0.08)"
                            : "rgba(59,130,246,0.05)"
                          : colors.cardBg,
                        padding: 10,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            display: "grid",
                            placeItems: "center",
                            background: cell.isToday ? colors.primary : "transparent",
                            color: cell.isToday ? "#fff" : colors.text,
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          {cell.day}
                        </span>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: colors.subText,
                          }}
                        >
                          {cell.events.length} item{cell.events.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {cell.events.slice(0, 3).map((event) => (
                        <CalendarEventMiniCard
                          key={`${event.id}-${event.date}-${event.time}`}
                          event={event}
                          mode={mode}
                        />
                      ))}

                      {cell.events.length > 3 && (
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: colors.primary,
                          }}
                        >
                          +{cell.events.length - 3} more
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {viewMode !== "Month" && (
              <div
                style={{
                  padding: 28,
                  color: colors.subText,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  {viewMode} View
                </div>
                <div style={{ lineHeight: 1.8 }}>
                  This structure is ready. Next upgradeல {viewMode} timeline UI,
                  hourly grid, agenda list, drag-drop reschedule மாதிரி features add
                  பண்ணலாம்.
                </div>
              </div>
            )}
          </div>

          <aside style={{ display: "grid", gap: 16, position: "sticky", top: 20 }}>
            <SidebarCard title="Selected Date" colors={colors}>
              <DetailRow label="Date" value={formatPrettyDate(selectedDate)} colors={colors} />
              <DetailRow label="Activities" value={String(selectedDateEvents.length)} colors={colors} />
              <DetailRow
                label="Overdue"
                value={String(
                  selectedDateEvents.filter((e) => e.activityStatus === "Missed").length
                )}
                colors={colors}
              />
              <DetailRow
                label="Completed"
                value={String(
                  selectedDateEvents.filter((e) => e.activityStatus === "Completed").length
                )}
                colors={colors}
              />
            </SidebarCard>

            <SidebarCard title="Activities on Selected Date" colors={colors}>
              {selectedDateEvents.length > 0 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  {selectedDateEvents.map((event) => (
                    <div
                      key={`${event.id}-${event.date}-${event.time}-detail`}
                      style={{
                        border: `1px solid ${colors.border}`,
                        borderRadius: 16,
                        padding: 14,
                        background: colors.cardBgSoft,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            color: colors.text,
                            fontSize: 15,
                          }}
                        >
                          {event.leadName}
                        </div>

                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#fff",
                            background: getActivityTypeColor(event.activityType, colors),
                          }}
                        >
                          {event.activityType}
                        </span>
                      </div>

                      <div style={{ fontSize: 13, color: colors.subText }}>
                        {event.time} • {event.owner} • {event.city}
                      </div>

                      <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                        {event.note}
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <QuickActionChip
                          label="Open Lead"
                          colors={colors}
                          onClick={() => {
                            if (event.leadId) {
                              navigate(`/leads/${event.leadId}`);
                            }
                          }}
                        />
                        <QuickActionChip label="Mark Done" colors={colors} />
                        <QuickActionChip label="Reschedule" colors={colors} />
                        <QuickActionChip label="WhatsApp" colors={colors} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText text="No activities scheduled for this date." colors={colors} />
              )}
            </SidebarCard>

            <SidebarCard title="Alerts" colors={colors}>
              <AlertItem
                text="Missed follow-ups need attention"
                tone="danger"
                colors={colors}
              />
              <AlertItem
                text="High-priority leads without closure this week"
                tone="warning"
                colors={colors}
              />
              <AlertItem
                text="Site visit load is high on busy dates"
                tone="info"
                colors={colors}
              />
            </SidebarCard>

            <SidebarCard title="Mini Planner" colors={colors}>
              <div style={{ display: "grid", gap: 12 }}>
                <PlannerRow
                  label="Morning"
                  value={`${selectedDateEvents.filter((e) => isMorning(e.time)).length} activities`}
                  colors={colors}
                />
                <PlannerRow
                  label="Afternoon"
                  value={`${selectedDateEvents.filter((e) => isAfternoon(e.time)).length} activities`}
                  colors={colors}
                />
                <PlannerRow
                  label="Evening"
                  value={`${selectedDateEvents.filter((e) => isEvening(e.time)).length} activities`}
                  colors={colors}
                />
              </div>
            </SidebarCard>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
}

function readLeadEventsFromStorage(): LeadEvent[] {
  for (const key of LEAD_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;

      const mapped = parsed
        .map((item: StoredLeadLike, index: number) => mapStoredLeadToEvent(item, index))
        .filter(Boolean) as LeadEvent[];

      if (mapped.length > 0) {
        return mapped;
      }
    } catch (error) {
      console.error(`Failed to parse localStorage key: ${key}`, error);
    }
  }

  return [];
}

function mapStoredLeadToEvent(item: StoredLeadLike, index: number): LeadEvent | null {
  if (!item || typeof item !== "object") return null;

  const rawDate =
    item.followUpDate || item.nextFollowUpDate || item.nextFollowUp || "";

  const normalizedDate = normalizeIsoDate(rawDate);
  if (!normalizedDate) return null;

  const priority = normalizePriority(item.priority);
  const leadStatus = normalizeLeadStatus(item.status);
  const activityType = normalizeActivityType(item.followUpType, leadStatus);
  const owner = String(item.owner || item.assignedTo || item.leadOwner || "Unassigned");
  const location = String(
    item.preferredLocation ||
      item.location ||
      item.city ||
      item.area ||
      item.subLocation ||
      "Unknown"
  );

  const budget = formatBudget(item);
  const time = normalizeTime(item.nextFollowUpTime);
  const isMissed =
    normalizedDate < new Date().toISOString().slice(0, 10) &&
    leadStatus !== "Closed";

  return {
    id: Number(item.id ?? Date.now() + index),
    leadId: Number(item.id ?? Date.now() + index),
    leadName: String(item.name || item.fullName || `Lead ${index + 1}`),
    phone: String(item.phone || item.mobile || item.whatsapp || "-"),
    owner,
    city: String(item.city || item.preferredLocation || item.location || "Unknown"),
    date: normalizedDate,
    time,
    priority,
    leadStatus,
    activityType,
    activityStatus: isMissed ? "Missed" : "Pending",
    note: String(
      item.leadSummary ||
        item.conversationNotes ||
        `${activityType} scheduled for follow-up`
    ),
    budget,
    location,
    source: String(item.source || item.leadSource || "Manual"),
    isFromStorage: true,
  };
}

function normalizeIsoDate(value: string | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function normalizePriority(value: string | undefined): LeadEvent["priority"] {
  const normalized = String(value || "Medium").trim().toLowerCase();
  if (normalized === "hot") return "Hot";
  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";
  return "Medium";
}

function normalizeLeadStatus(value: string | undefined): LeadEvent["leadStatus"] {
  const normalized = String(value || "New").trim().toLowerCase();

  if (normalized === "contacted") return "Contacted";
  if (normalized === "qualified") return "Qualified";
  if (normalized === "follow-up" || normalized === "followup") return "Follow-up";
  if (normalized === "negotiation") return "Negotiation";
  if (normalized === "closed" || normalized === "won") return "Closed";
  return "New";
}

function normalizeActivityType(
  value: string | undefined,
  leadStatus: LeadEvent["leadStatus"]
): LeadEventType {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized.includes("whatsapp")) return "WhatsApp";
  if (normalized.includes("site")) return "Site Visit";
  if (normalized.includes("meeting")) return "Meeting";
  if (normalized.includes("negotiation")) return "Negotiation";
  if (normalized.includes("closing")) return "Closing";

  if (leadStatus === "Negotiation") return "Negotiation";
  if (leadStatus === "Qualified") return "Meeting";
  return "Call";
}

function formatBudget(item: StoredLeadLike) {
  if (item.minBudget || item.maxBudget) {
    const min = String(item.minBudget || "0");
    const max = String(item.maxBudget || "0");
    return `₹${min} - ₹${max}`;
  }

  if (typeof item.budget === "number") {
    return `₹${item.budget.toLocaleString("en-IN")}`;
  }

  return String(item.budget || "-");
}

function normalizeTime(value: string | undefined) {
  if (!value) return "10:00 AM";

  const trimmed = value.trim();
  if (/am|pm/i.test(trimmed)) return trimmed;

  const parts = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!parts) return "10:00 AM";

  let hours = Number(parts[1]);
  const minutes = parts[2];
  const suffix = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
}

function to24HourTime(value: string) {
  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);

  if (!match) return "10:00";

  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = match[3];

  if (suffix === "AM") {
    if (hours === 12) hours = 0;
  } else if (hours !== 12) {
    hours += 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function isMorning(time: string) {
  const normalized = to24HourTime(time);
  return normalized >= "05:00" && normalized < "12:00";
}

function isAfternoon(time: string) {
  const normalized = to24HourTime(time);
  return normalized >= "12:00" && normalized < "17:00";
}

function isEvening(time: string) {
  const normalized = to24HourTime(time);
  return normalized >= "17:00" && normalized <= "23:59";
}

function HeaderButton({
  label,
  colors,
  onClick,
}: {
  label: string;
  colors: ReturnType<typeof getTheme>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
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
      {label}
    </button>
  );
}

function ToolbarButton({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <button
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        background: colors.cardBgSoft,
        color: colors.text,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function StatCard({
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

function CalendarEventMiniCard({
  event,
  mode,
}: {
  event: LeadEvent;
  mode: ThemeMode;
}) {
  const colors = getTheme(mode);

  return (
    <div
      style={{
        borderLeft: `4px solid ${getPriorityColor(event.priority, colors)}`,
        background:
          event.activityStatus === "Missed"
            ? mode === "dark"
              ? "rgba(239,68,68,0.10)"
              : "rgba(239,68,68,0.08)"
            : colors.cardBgSoft,
        borderRadius: 10,
        padding: "8px 10px",
        display: "grid",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: colors.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {event.leadName}
      </div>

      <div
        style={{
          fontSize: 11,
          color: colors.subText,
          fontWeight: 700,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {event.activityType} • {event.time}
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ReturnType<typeof getTheme>;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: colors.shadowSoft,
        display: "grid",
        gap: 14,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function DetailRow({
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
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${colors.borderSoft || colors.border}`,
        paddingBottom: 10,
      }}
    >
      <span style={{ fontSize: 13, color: colors.subText }}>{label}</span>
      <span style={{ fontSize: 13, color: colors.text, fontWeight: 800 }}>{value}</span>
    </div>
  );
}

function QuickActionChip({
  label,
  colors,
  onClick,
}: {
  label: string;
  colors: ReturnType<typeof getTheme>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${colors.border}`,
        background: colors.cardBg,
        color: colors.text,
        padding: "8px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function AlertItem({
  text,
  tone,
  colors,
}: {
  text: string;
  tone: "danger" | "warning" | "info";
  colors: ReturnType<typeof getTheme>;
}) {
  const toneColor =
    tone === "danger"
      ? colors.danger
      : tone === "warning"
      ? colors.warning
      : colors.info;

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${toneColor}`,
        borderRadius: 12,
        padding: 12,
        color: colors.text,
        background: colors.cardBgSoft,
        fontSize: 13,
        lineHeight: 1.6,
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

function PlannerRow({
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
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: colors.cardBgSoft,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span style={{ color: colors.subText, fontSize: 13, fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ color: colors.text, fontSize: 13, fontWeight: 800 }}>
        {value}
      </span>
    </div>
  );
}

function EmptyText({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        fontSize: 14,
        color: colors.subText,
        lineHeight: 1.7,
      }}
    >
      {text}
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

function getActivityTypeColor(
  type: LeadEventType,
  colors: ReturnType<typeof getTheme>
) {
  switch (type) {
    case "Call":
      return colors.info;
    case "WhatsApp":
      return colors.success;
    case "Meeting":
      return colors.premium;
    case "Site Visit":
      return colors.warning;
    case "Negotiation":
      return colors.primary;
    case "Closing":
      return colors.success;
    default:
      return colors.subText;
  }
}

function getPriorityColor(
  priority: LeadEvent["priority"],
  colors: ReturnType<typeof getTheme>
) {
  switch (priority) {
    case "Hot":
      return colors.danger;
    case "High":
      return colors.warning;
    case "Medium":
      return colors.primary;
    case "Low":
      return colors.success;
    default:
      return colors.subText;
  }
}

function formatPrettyDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}