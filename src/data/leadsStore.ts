export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Negotiation"
  | "Closed";

export type LeadPriority = "Low" | "Medium" | "High";

export type CallLogItem = {
  time: string;
  note: string;
  outcome: string;
};

export type TimelineItem = {
  title: string;
  description: string;
  time: string;
};

export type Lead = {
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
};

const STORAGE_KEY = "mei-crm-leads";

const defaultLeads: Lead[] = [
  {
    id: 1001,
    name: "Arun Kumar",
    phone: "9876543210",
    source: "WhatsApp",
    city: "Chennai",
    status: "New",
    email: "arun@example.com",
    company: "AK Traders",
    budget: "₹15,00,000",
    notes:
      "Interested in premium CRM setup and automation. Wants a quick overview before scheduling a product demo.",
    owner: "Madhan",
    priority: "High",
    followUpDate: "2026-04-05",
    lastContact: "Today",
    requirement: "CRM setup, lead automation, dashboard reporting",
    callLogs: [
      {
        time: "Today · 10:30 AM",
        note: "Initial intro call completed. Lead showed strong interest in automation workflow.",
        outcome: "Positive",
      },
      {
        time: "Yesterday · 5:15 PM",
        note: "Shared business overview and collected requirement summary.",
        outcome: "Connected",
      },
    ],
    timeline: [
      {
        title: "Lead Created",
        description: "Lead entered into CRM from WhatsApp enquiry.",
        time: "Yesterday · 4:45 PM",
      },
      {
        title: "Requirement Captured",
        description: "User requirement for CRM automation documented.",
        time: "Yesterday · 5:20 PM",
      },
      {
        title: "Follow-up Scheduled",
        description: "Next product discussion planned for 2026-04-05.",
        time: "Today · 10:35 AM",
      },
    ],
  },
  {
    id: 1002,
    name: "Priya",
    phone: "9123456780",
    source: "Facebook",
    city: "Bangalore",
    status: "Contacted",
    email: "priya@example.com",
    company: "Priya Ventures",
    budget: "₹8,00,000",
    notes:
      "Asked for product demo and pricing details. Wants multi-user access and sales reporting.",
    owner: "Madhan",
    priority: "Medium",
    followUpDate: "2026-04-06",
    lastContact: "Yesterday",
    requirement: "Demo, pricing, team user access",
    callLogs: [
      {
        time: "Yesterday · 2:10 PM",
        note: "Discussed pricing tiers and dashboard features.",
        outcome: "Interested",
      },
    ],
    timeline: [
      {
        title: "Lead Captured",
        description: "Lead received from Facebook campaign.",
        time: "2 days ago",
      },
      {
        title: "Contact Established",
        description: "Spoke with lead and shared company introduction.",
        time: "Yesterday · 2:10 PM",
      },
    ],
  },
  {
    id: 1003,
    name: "Rahul",
    phone: "9000012345",
    source: "Website",
    city: "Coimbatore",
    status: "Qualified",
    email: "rahul@example.com",
    company: "Rahul Infra",
    budget: "₹25,00,000",
    notes:
      "Looking for multi-user CRM with reports, task assignment, and lead tracking for field sales team.",
    owner: "Arun",
    priority: "High",
    followUpDate: "2026-04-07",
    lastContact: "2 days ago",
    requirement: "Team CRM, reporting, field sales workflow",
    callLogs: [
      {
        time: "2 days ago · 1:00 PM",
        note: "Qualified lead after confirming team size and budget.",
        outcome: "Qualified",
      },
    ],
    timeline: [
      {
        title: "Lead Submitted",
        description: "Lead submitted enquiry through official website.",
        time: "3 days ago",
      },
      {
        title: "Qualified",
        description: "Lead marked qualified after budget and use-case discussion.",
        time: "2 days ago · 1:00 PM",
      },
    ],
  },
  {
    id: 1004,
    name: "Meena",
    phone: "9090909090",
    source: "Referral",
    city: "Madurai",
    status: "Negotiation",
    email: "meena@example.com",
    company: "Meena Corp",
    budget: "₹12,00,000",
    notes:
      "Pricing negotiation ongoing. Lead is interested but requesting phased onboarding.",
    owner: "Priya",
    priority: "Medium",
    followUpDate: "2026-04-04",
    lastContact: "Today",
    requirement: "Phased rollout, onboarding support",
    callLogs: [
      {
        time: "Today · 11:40 AM",
        note: "Negotiated payment milestone and onboarding timeline.",
        outcome: "Negotiation",
      },
    ],
    timeline: [
      {
        title: "Referred Lead",
        description: "Lead added through business referral.",
        time: "4 days ago",
      },
      {
        title: "Negotiation Started",
        description: "Commercial discussion and rollout model review.",
        time: "Today · 11:40 AM",
      },
    ],
  },
  {
    id: 1005,
    name: "Suresh",
    phone: "9345678901",
    source: "Walk-in",
    city: "Trichy",
    status: "Closed",
    email: "suresh@example.com",
    company: "Suresh Properties",
    budget: "₹32,00,000",
    notes:
      "Deal closed successfully. Client confirmed onboarding plan and user setup.",
    owner: "Madhan",
    priority: "Low",
    followUpDate: "2026-04-02",
    lastContact: "3 days ago",
    requirement: "Onboarding and implementation",
    callLogs: [
      {
        time: "3 days ago · 4:30 PM",
        note: "Final confirmation call and project kickoff scheduled.",
        outcome: "Won",
      },
    ],
    timeline: [
      {
        title: "Lead Added",
        description: "Walk-in lead added manually by sales desk.",
        time: "1 week ago",
      },
      {
        title: "Deal Closed",
        description: "Commercial approval received and deal marked closed.",
        time: "3 days ago · 4:30 PM",
      },
    ],
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getAllLeads(): Lead[] {
  if (!canUseStorage()) {
    return defaultLeads;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLeads));
      return defaultLeads;
    }

    const parsed = JSON.parse(raw) as Lead[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLeads));
      return defaultLeads;
    }

    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLeads));
    return defaultLeads;
  }
}

export function saveAllLeads(leads: Lead[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function getLeadById(id: number): Lead | null {
  const leads = getAllLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}

export function addLead(
  payload: Omit<Lead, "id" | "timeline" | "callLogs" | "lastContact">
): Lead {
  const leads = getAllLeads();

  const newLead: Lead = {
    ...payload,
    id: Date.now(),
    lastContact: "Just now",
    callLogs: [],
    timeline: [
      {
        title: "Lead Created",
        description: `Lead ${payload.name} was added to CRM.`,
        time: "Just now",
      },
    ],
  };

  const updated = [newLead, ...leads];
  saveAllLeads(updated);
  return newLead;
}

export function updateLead(updatedLead: Lead): Lead {
  const leads = getAllLeads();

  const updated = leads.map((lead) =>
    lead.id === updatedLead.id ? updatedLead : lead
  );

  saveAllLeads(updated);
  return updatedLead;
}

export function updateLeadStatus(id: number, status: LeadStatus): Lead | null {
  const leads = getAllLeads();
  const target = leads.find((lead) => lead.id === id);

  if (!target) return null;

  const updatedLead: Lead = {
    ...target,
    status,
    lastContact: "Just now",
    timeline: [
      {
        title: "Status Updated",
        description: `Lead status changed to ${status}.`,
        time: "Just now",
      },
      ...target.timeline,
    ],
  };

  const updated = leads.map((lead) => (lead.id === id ? updatedLead : lead));
  saveAllLeads(updated);

  return updatedLead;
}

export function deleteLead(id: number) {
  const leads = getAllLeads();
  const updated = leads.filter((lead) => lead.id !== id);
  saveAllLeads(updated);
}