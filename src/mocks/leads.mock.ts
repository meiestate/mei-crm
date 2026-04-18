// src/mocks/leads.mock.ts

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site_visit_scheduled"
  | "negotiation"
  | "won"
  | "lost"
  | "unresponsive";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type LeadSource =
  | "website"
  | "whatsapp"
  | "referral"
  | "instagram"
  | "facebook"
  | "google_ads"
  | "broker_network"
  | "walk_in"
  | "property_portal";

export type LeadIntent =
  | "buy"
  | "sell"
  | "rent"
  | "lease"
  | "invest"
  | "property_management";

export type PropertyCategory =
  | "apartment"
  | "villa"
  | "plot"
  | "land"
  | "commercial"
  | "rental";

export interface LeadBudgetRange {
  min: number;
  max: number;
  label: string;
}

export interface LeadLocationPreference {
  city: string;
  localities: string[];
}

export interface LeadPropertyPreference {
  category: PropertyCategory;
  configuration?: string;
  sizeMin?: number;
  sizeMax?: number;
  sizeUnit?: "sqft" | "acre" | "cent";
  facing?: string;
  furnished?: "unfurnished" | "semi_furnished" | "fully_furnished";
}

export interface LeadFollowUp {
  id: string;
  type: "call" | "meeting" | "whatsapp" | "email" | "site_visit";
  dueAt: string;
  note: string;
  completed: boolean;
}

export interface LeadActivity {
  id: string;
  type:
    | "lead_created"
    | "call"
    | "whatsapp"
    | "email"
    | "meeting"
    | "site_visit"
    | "note"
    | "status_change"
    | "task";
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface LeadMatchingProperty {
  id: string;
  title: string;
  locality: string;
  city: string;
  category: PropertyCategory;
  configuration?: string;
  price: number;
  sizeLabel?: string;
  matchScore: number;
}

export interface Lead {
  id: string;
  leadCode: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  city: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  intent: LeadIntent;
  assignedTo: string;
  assignedUserId: string;
  budget: LeadBudgetRange;
  locationPreference: LeadLocationPreference;
  propertyPreference: LeadPropertyPreference;
  score: number;
  tags: string[];
  isHot: boolean;
  isStarred: boolean;
  isOverdue: boolean;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
  occupation?: string;
  notes: LeadNote[];
  activities: LeadActivity[];
  followUps: LeadFollowUp[];
  matchingProperties: LeadMatchingProperty[];
}

const createBudgetLabel = (min: number, max: number): string => {
  const format = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
  };

  return `${format(min)} - ${format(max)}`;
};

export const leadStatusOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit Scheduled", value: "site_visit_scheduled" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "Unresponsive", value: "unresponsive" },
] as const;

export const leadPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

export const leadSourceOptions = [
  { label: "Website", value: "website" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Referral", value: "referral" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "Google Ads", value: "google_ads" },
  { label: "Broker Network", value: "broker_network" },
  { label: "Walk In", value: "walk_in" },
  { label: "Property Portal", value: "property_portal" },
] as const;

export const leadIntentOptions = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Rent", value: "rent" },
  { label: "Lease", value: "lease" },
  { label: "Invest", value: "invest" },
  { label: "Property Management", value: "property_management" },
] as const;

export const leadsMock: Lead[] = [
  {
    id: "lead_001",
    leadCode: "MEI-LEAD-1001",
    name: "Vignesh R",
    phone: "+91 9876500011",
    alternatePhone: "+91 9003000011",
    email: "vignesh.r@example.com",
    city: "Chennai",
    status: "new",
    priority: "high",
    source: "website",
    intent: "buy",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    budget: {
      min: 6500000,
      max: 8000000,
      label: createBudgetLabel(6500000, 8000000),
    },
    locationPreference: {
      city: "Chennai",
      localities: ["OMR", "Medavakkam", "Sholinganallur"],
    },
    propertyPreference: {
      category: "apartment",
      configuration: "2 BHK",
      sizeMin: 950,
      sizeMax: 1250,
      sizeUnit: "sqft",
      facing: "East",
      furnished: "semi_furnished",
    },
    score: 78,
    tags: ["website", "first-time buyer", "family", "hot"],
    isHot: true,
    isStarred: true,
    isOverdue: false,
    lastContactAt: "2026-04-15T05:50:00.000Z",
    nextFollowUpAt: "2026-04-15T11:30:00.000Z",
    createdAt: "2026-04-15T05:45:00.000Z",
    updatedAt: "2026-04-15T06:10:00.000Z",
    occupation: "Software Engineer",
    notes: [
      {
        id: "lnote_001",
        text: "Looking for gated community with good school access.",
        createdAt: "2026-04-15T06:00:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "lact_001",
        type: "lead_created",
        title: "Lead created from website inquiry",
        description: "Submitted form for 2 BHK requirement.",
        createdAt: "2026-04-15T05:45:00.000Z",
        createdBy: "System",
      },
      {
        id: "lact_002",
        type: "call",
        title: "Initial qualification call completed",
        description: "Budget and location preference collected.",
        createdAt: "2026-04-15T05:50:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    followUps: [
      {
        id: "lfollow_001",
        type: "call",
        dueAt: "2026-04-15T11:30:00.000Z",
        note: "Share shortlisted OMR and Medavakkam projects.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_001",
        title: "OMR Green Heights",
        locality: "Sholinganallur",
        city: "Chennai",
        category: "apartment",
        configuration: "2 BHK",
        price: 7200000,
        sizeLabel: "1080 sq.ft",
        matchScore: 92,
      },
      {
        id: "mprop_002",
        title: "Medavakkam Lake View Residency",
        locality: "Medavakkam",
        city: "Chennai",
        category: "apartment",
        configuration: "2 BHK",
        price: 7650000,
        sizeLabel: "1140 sq.ft",
        matchScore: 88,
      },
    ],
  },
  {
    id: "lead_002",
    leadCode: "MEI-LEAD-1002",
    name: "Ananya Shekar",
    phone: "+91 9876500012",
    email: "ananya.s@example.com",
    city: "Bengaluru",
    status: "qualified",
    priority: "urgent",
    source: "whatsapp",
    intent: "buy",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    budget: {
      min: 11000000,
      max: 14000000,
      label: createBudgetLabel(11000000, 14000000),
    },
    locationPreference: {
      city: "Bengaluru",
      localities: ["Whitefield", "Varthur", "Sarjapur Road"],
    },
    propertyPreference: {
      category: "apartment",
      configuration: "3 BHK",
      sizeMin: 1400,
      sizeMax: 1800,
      sizeUnit: "sqft",
      furnished: "semi_furnished",
    },
    score: 91,
    tags: ["whatsapp", "hot", "ready-to-buy", "whitefield"],
    isHot: true,
    isStarred: true,
    isOverdue: false,
    lastContactAt: "2026-04-15T04:25:00.000Z",
    nextFollowUpAt: "2026-04-16T08:00:00.000Z",
    createdAt: "2026-04-15T04:10:00.000Z",
    updatedAt: "2026-04-15T04:30:00.000Z",
    occupation: "Product Manager",
    notes: [
      {
        id: "lnote_002",
        text: "Ready with down payment. Wants possession within 6 months.",
        createdAt: "2026-04-15T04:28:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    activities: [
      {
        id: "lact_003",
        type: "whatsapp",
        title: "Requirement received on WhatsApp",
        description: "Asked for Whitefield 3 BHK premium options.",
        createdAt: "2026-04-15T04:10:00.000Z",
        createdBy: "System",
      },
      {
        id: "lact_004",
        type: "status_change",
        title: "Lead moved to qualified",
        description: "Budget and buying timeline verified.",
        createdAt: "2026-04-15T04:25:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    followUps: [
      {
        id: "lfollow_002",
        type: "site_visit",
        dueAt: "2026-04-16T08:00:00.000Z",
        note: "Schedule Whitefield project site visits.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_003",
        title: "Prestige Tech Vista",
        locality: "Whitefield",
        city: "Bengaluru",
        category: "apartment",
        configuration: "3 BHK",
        price: 12800000,
        sizeLabel: "1560 sq.ft",
        matchScore: 95,
      },
      {
        id: "mprop_004",
        title: "Varthur Skyline",
        locality: "Varthur",
        city: "Bengaluru",
        category: "apartment",
        configuration: "3 BHK",
        price: 13400000,
        sizeLabel: "1680 sq.ft",
        matchScore: 89,
      },
    ],
  },
  {
    id: "lead_003",
    leadCode: "MEI-LEAD-1003",
    name: "Kishore Babu",
    phone: "+91 9876500013",
    email: "kishore.b@example.com",
    city: "Coimbatore",
    status: "contacted",
    priority: "medium",
    source: "referral",
    intent: "invest",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    budget: {
      min: 4500000,
      max: 6000000,
      label: createBudgetLabel(4500000, 6000000),
    },
    locationPreference: {
      city: "Coimbatore",
      localities: ["Saravanampatti", "Kovilpalayam"],
    },
    propertyPreference: {
      category: "plot",
      sizeMin: 1200,
      sizeMax: 2400,
      sizeUnit: "sqft",
    },
    score: 63,
    tags: ["referral", "investor", "plot"],
    isHot: false,
    isStarred: false,
    isOverdue: false,
    lastContactAt: "2026-04-14T16:25:00.000Z",
    nextFollowUpAt: "2026-04-17T09:30:00.000Z",
    createdAt: "2026-04-14T16:15:00.000Z",
    updatedAt: "2026-04-14T16:30:00.000Z",
    occupation: "Business Owner",
    notes: [
      {
        id: "lnote_003",
        text: "Prefers appreciation-focused investment over self-use.",
        createdAt: "2026-04-14T16:28:00.000Z",
        createdBy: "Meena S",
      },
    ],
    activities: [
      {
        id: "lact_005",
        type: "lead_created",
        title: "Referral lead added",
        description: "Shared by previous customer contact.",
        createdAt: "2026-04-14T16:15:00.000Z",
        createdBy: "System",
      },
      {
        id: "lact_006",
        type: "call",
        title: "Intro call done",
        description: "Discussed plot budget and target holding period.",
        createdAt: "2026-04-14T16:25:00.000Z",
        createdBy: "Meena S",
      },
    ],
    followUps: [
      {
        id: "lfollow_003",
        type: "email",
        dueAt: "2026-04-17T09:30:00.000Z",
        note: "Send shortlisted plotted layout options.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_005",
        title: "Saravanampatti Growth Corridor Plots",
        locality: "Saravanampatti",
        city: "Coimbatore",
        category: "plot",
        price: 5200000,
        sizeLabel: "1500 sq.ft",
        matchScore: 84,
      },
    ],
  },
  {
    id: "lead_004",
    leadCode: "MEI-LEAD-1004",
    name: "Harini M",
    phone: "+91 9876500014",
    city: "Bengaluru",
    status: "site_visit_scheduled",
    priority: "high",
    source: "instagram",
    intent: "buy",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    budget: {
      min: 9000000,
      max: 12000000,
      label: createBudgetLabel(9000000, 12000000),
    },
    locationPreference: {
      city: "Bengaluru",
      localities: ["Sarjapur Road", "Electronic City"],
    },
    propertyPreference: {
      category: "villa",
      configuration: "3 BHK",
      sizeMin: 1600,
      sizeMax: 2200,
      sizeUnit: "sqft",
    },
    score: 84,
    tags: ["instagram", "site-visit", "villa"],
    isHot: true,
    isStarred: false,
    isOverdue: false,
    lastContactAt: "2026-04-14T13:20:00.000Z",
    nextFollowUpAt: "2026-04-16T06:30:00.000Z",
    createdAt: "2026-04-14T13:05:00.000Z",
    updatedAt: "2026-04-14T13:22:00.000Z",
    occupation: "Architect",
    notes: [
      {
        id: "lnote_004",
        text: "Interested in modern villa communities with open space.",
        createdAt: "2026-04-14T13:18:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    activities: [
      {
        id: "lact_007",
        type: "meeting",
        title: "Virtual discussion completed",
        description: "Lifestyle and layout preference mapped.",
        createdAt: "2026-04-14T13:12:00.000Z",
        createdBy: "Balaji K",
      },
      {
        id: "lact_008",
        type: "site_visit",
        title: "Site visit scheduled",
        description: "Sarjapur villa community visit planned.",
        createdAt: "2026-04-14T13:20:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    followUps: [
      {
        id: "lfollow_004",
        type: "site_visit",
        dueAt: "2026-04-16T06:30:00.000Z",
        note: "Coordinate villa site visit and route map.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_006",
        title: "Sarjapur Urban Villas",
        locality: "Sarjapur Road",
        city: "Bengaluru",
        category: "villa",
        configuration: "3 BHK",
        price: 11800000,
        sizeLabel: "1820 sq.ft",
        matchScore: 90,
      },
    ],
  },
  {
    id: "lead_005",
    leadCode: "MEI-LEAD-1005",
    name: "Sathish Kumar",
    phone: "+91 9876500015",
    email: "sathish.k@example.com",
    city: "Chennai",
    status: "negotiation",
    priority: "urgent",
    source: "broker_network",
    intent: "buy",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    budget: {
      min: 18000000,
      max: 23000000,
      label: createBudgetLabel(18000000, 23000000),
    },
    locationPreference: {
      city: "Chennai",
      localities: ["ECR", "Neelankarai", "Injambakkam"],
    },
    propertyPreference: {
      category: "villa",
      configuration: "4 BHK",
      sizeMin: 2400,
      sizeMax: 3600,
      sizeUnit: "sqft",
      facing: "East",
    },
    score: 94,
    tags: ["broker-network", "luxury", "urgent", "negotiation"],
    isHot: true,
    isStarred: true,
    isOverdue: false,
    lastContactAt: "2026-04-14T11:55:00.000Z",
    nextFollowUpAt: "2026-04-15T13:45:00.000Z",
    createdAt: "2026-04-14T11:45:00.000Z",
    updatedAt: "2026-04-14T12:00:00.000Z",
    occupation: "Entrepreneur",
    notes: [
      {
        id: "lnote_005",
        text: "Buyer likes premium finish and immediate registration option.",
        createdAt: "2026-04-14T11:58:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "lact_009",
        type: "call",
        title: "Luxury requirement discussion",
        description: "Collected lifestyle and location preference.",
        createdAt: "2026-04-14T11:50:00.000Z",
        createdBy: "Ravi Kumar",
      },
      {
        id: "lact_010",
        type: "status_change",
        title: "Lead moved to negotiation",
        description: "Buyer interested in one shortlisted villa.",
        createdAt: "2026-04-14T11:55:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    followUps: [
      {
        id: "lfollow_005",
        type: "meeting",
        dueAt: "2026-04-15T13:45:00.000Z",
        note: "Price negotiation with seller and buyer.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_007",
        title: "ECR Ocean Crest Villas",
        locality: "Neelankarai",
        city: "Chennai",
        category: "villa",
        configuration: "4 BHK",
        price: 21500000,
        sizeLabel: "3050 sq.ft",
        matchScore: 96,
      },
    ],
  },
  {
    id: "lead_006",
    leadCode: "MEI-LEAD-1006",
    name: "Divya Raj",
    phone: "+91 9876500016",
    email: "divya.raj@example.com",
    city: "Bengaluru",
    status: "unresponsive",
    priority: "low",
    source: "facebook",
    intent: "rent",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    budget: {
      min: 25000,
      max: 35000,
      label: createBudgetLabel(25000, 35000),
    },
    locationPreference: {
      city: "Bengaluru",
      localities: ["HSR Layout", "Koramangala"],
    },
    propertyPreference: {
      category: "rental",
      configuration: "1 BHK",
      sizeMin: 550,
      sizeMax: 850,
      sizeUnit: "sqft",
      furnished: "fully_furnished",
    },
    score: 34,
    tags: ["facebook", "rental", "cold"],
    isHot: false,
    isStarred: false,
    isOverdue: true,
    lastContactAt: "2026-04-10T08:30:00.000Z",
    nextFollowUpAt: "2026-04-12T09:00:00.000Z",
    createdAt: "2026-04-08T09:10:00.000Z",
    updatedAt: "2026-04-10T08:35:00.000Z",
    occupation: "UI Designer",
    notes: [
      {
        id: "lnote_006",
        text: "Stopped responding after first shortlist shared.",
        createdAt: "2026-04-10T08:32:00.000Z",
        createdBy: "Meena S",
      },
    ],
    activities: [
      {
        id: "lact_011",
        type: "whatsapp",
        title: "Rental shortlist shared",
        description: "Sent fully furnished 1 BHK options.",
        createdAt: "2026-04-09T07:50:00.000Z",
        createdBy: "Meena S",
      },
      {
        id: "lact_012",
        type: "task",
        title: "Follow-up overdue",
        description: "No response from lead for 3 days.",
        createdAt: "2026-04-12T09:00:00.000Z",
        createdBy: "System",
      },
    ],
    followUps: [
      {
        id: "lfollow_006",
        type: "call",
        dueAt: "2026-04-12T09:00:00.000Z",
        note: "Final re-engagement attempt.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_008",
        title: "HSR Studio Living",
        locality: "HSR Layout",
        city: "Bengaluru",
        category: "rental",
        configuration: "1 BHK",
        price: 32000,
        sizeLabel: "720 sq.ft",
        matchScore: 80,
      },
    ],
  },
  {
    id: "lead_007",
    leadCode: "MEI-LEAD-1007",
    name: "Karthik Subramanian",
    phone: "+91 9876500017",
    email: "karthik.sub@example.com",
    city: "Chennai",
    status: "contacted",
    priority: "medium",
    source: "whatsapp",
    intent: "property_management",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    budget: {
      min: 40000,
      max: 65000,
      label: createBudgetLabel(40000, 65000),
    },
    locationPreference: {
      city: "Chennai",
      localities: ["Velachery", "Perungudi"],
    },
    propertyPreference: {
      category: "rental",
      configuration: "2 BHK",
      sizeMin: 1000,
      sizeMax: 1350,
      sizeUnit: "sqft",
    },
    score: 69,
    tags: ["owner", "property-management", "whatsapp"],
    isHot: false,
    isStarred: true,
    isOverdue: false,
    lastContactAt: "2026-04-13T14:10:00.000Z",
    nextFollowUpAt: "2026-04-16T10:30:00.000Z",
    createdAt: "2026-04-13T13:30:00.000Z",
    updatedAt: "2026-04-13T14:20:00.000Z",
    occupation: "NRI Owner",
    notes: [
      {
        id: "lnote_007",
        text: "Needs tenant management and maintenance support end-to-end.",
        createdAt: "2026-04-13T14:15:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    activities: [
      {
        id: "lact_013",
        type: "call",
        title: "Property management inquiry discussed",
        description: "Explained MEI rental management model.",
        createdAt: "2026-04-13T14:10:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    followUps: [
      {
        id: "lfollow_007",
        type: "email",
        dueAt: "2026-04-16T10:30:00.000Z",
        note: "Send service agreement and pricing sheet.",
        completed: false,
      },
    ],
    matchingProperties: [],
  },
  {
    id: "lead_008",
    leadCode: "MEI-LEAD-1008",
    name: "Rahul Shetty",
    phone: "+91 9876500018",
    email: "rahul.shetty@example.com",
    city: "Bengaluru",
    status: "won",
    priority: "high",
    source: "broker_network",
    intent: "invest",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    budget: {
      min: 8000000,
      max: 9500000,
      label: createBudgetLabel(8000000, 9500000),
    },
    locationPreference: {
      city: "Bengaluru",
      localities: ["Devanahalli"],
    },
    propertyPreference: {
      category: "plot",
      sizeMin: 1200,
      sizeMax: 1500,
      sizeUnit: "sqft",
    },
    score: 88,
    tags: ["investor", "won", "plot"],
    isHot: true,
    isStarred: true,
    isOverdue: false,
    lastContactAt: "2026-04-12T10:00:00.000Z",
    nextFollowUpAt: "2026-04-25T09:00:00.000Z",
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-12T10:10:00.000Z",
    occupation: "Investor",
    notes: [
      {
        id: "lnote_008",
        text: "Closed plotted investment deal successfully.",
        createdAt: "2026-04-12T10:05:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    activities: [
      {
        id: "lact_014",
        type: "status_change",
        title: "Lead marked as won",
        description: "Converted to confirmed plot booking.",
        createdAt: "2026-04-12T10:00:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    followUps: [
      {
        id: "lfollow_008",
        type: "call",
        dueAt: "2026-04-25T09:00:00.000Z",
        note: "Post-sale follow-up and referral ask.",
        completed: false,
      },
    ],
    matchingProperties: [
      {
        id: "mprop_009",
        title: "North Gate Plotted Enclave",
        locality: "Devanahalli",
        city: "Bengaluru",
        category: "plot",
        price: 8600000,
        sizeLabel: "1200 sq.ft",
        matchScore: 94,
      },
    ],
  },
];

export const leadStatsMock = {
  totalLeads: leadsMock.length,
  hotLeads: leadsMock.filter((lead) => lead.isHot).length,
  starredLeads: leadsMock.filter((lead) => lead.isStarred).length,
  overdueLeads: leadsMock.filter((lead) => lead.isOverdue).length,
  qualifiedLeads: leadsMock.filter((lead) =>
    ["qualified", "site_visit_scheduled", "negotiation"].includes(lead.status),
  ).length,
  wonLeads: leadsMock.filter((lead) => lead.status === "won").length,
  lostLeads: leadsMock.filter((lead) => lead.status === "lost").length,
  avgScore:
    leadsMock.length > 0
      ? Math.round(
          leadsMock.reduce((sum, lead) => sum + lead.score, 0) / leadsMock.length,
        )
      : 0,
};

export const hotLeadsMock = leadsMock.filter((lead) => lead.isHot);

export const starredLeadsMock = leadsMock.filter((lead) => lead.isStarred);

export const overdueLeadsMock = leadsMock.filter((lead) => lead.isOverdue);

export const recentLeadsMock = [...leadsMock]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  .slice(0, 5);

export const leadStatusCountMock = leadStatusOptions.map((status) => ({
  status: status.value,
  label: status.label,
  count: leadsMock.filter((lead) => lead.status === status.value).length,
}));

export const leadSourceCountMock = leadSourceOptions.map((source) => ({
  source: source.value,
  label: source.label,
  count: leadsMock.filter((lead) => lead.source === source.value).length,
}));

export const getLeadById = (leadId: string): Lead | undefined => {
  return leadsMock.find((lead) => lead.id === leadId);
};

export const getLeadsByStatus = (status: LeadStatus): Lead[] => {
  return leadsMock.filter((lead) => lead.status === status);
};

export const getLeadsByAssignedUser = (userId: string): Lead[] => {
  return leadsMock.filter((lead) => lead.assignedUserId === userId);
};

export const searchLeadsMock = (search: string): Lead[] => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return leadsMock;
  }

  return leadsMock.filter((lead) =>
    [
      lead.name,
      lead.phone,
      lead.alternatePhone,
      lead.email,
      lead.city,
      lead.leadCode,
      lead.assignedTo,
      lead.status,
      lead.source,
      lead.intent,
      lead.occupation,
      ...lead.locationPreference.localities,
      ...lead.tags,
      ...lead.matchingProperties.map((property) => property.title),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
};

export default leadsMock;