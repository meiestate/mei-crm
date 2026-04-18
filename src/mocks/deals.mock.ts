// src/mocks/deals.mock.ts

export type DealStage =
  | "new"
  | "contacted"
  | "qualified"
  | "site_visit"
  | "negotiation"
  | "documentation"
  | "won"
  | "lost";

export type DealPriority = "low" | "medium" | "high" | "urgent";

export type DealType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial"
  | "rental"
  | "land";

export type DealRiskLevel = "low" | "medium" | "high";

export type DealActivityType =
  | "call"
  | "meeting"
  | "whatsapp"
  | "email"
  | "site_visit"
  | "note"
  | "document"
  | "payment"
  | "stage_change";

export interface DealCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  type: "buyer" | "seller" | "investor" | "tenant" | "owner";
}

export interface DealProperty {
  id: string;
  title: string;
  type: DealType;
  city: string;
  locality: string;
  configuration?: string;
  sizeLabel?: string;
  price: number;
  listingCode: string;
}

export interface DealRiskFlag {
  id: string;
  label: string;
  level: DealRiskLevel;
  description: string;
}

export interface DealActivity {
  id: string;
  type: DealActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface DealNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface DealTaskSnapshot {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface Deal {
  id: string;
  dealCode: string;
  title: string;
  stage: DealStage;
  priority: DealPriority;
  source:
    | "website"
    | "whatsapp"
    | "referral"
    | "instagram"
    | "facebook"
    | "broker_network"
    | "walk_in"
    | "google_ads"
    | "property_portal";
  assignedTo: string;
  assignedUserId: string;
  customer: DealCustomer;
  property: DealProperty;
  expectedValue: number;
  probability: number;
  commissionRate: number;
  expectedCommission: number;
  expectedCloseDate?: string;
  lastActivityAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  riskFlags: DealRiskFlag[];
  activities: DealActivity[];
  notes: DealNote[];
  taskSnapshot: DealTaskSnapshot;
  isStarred: boolean;
  isOverdue: boolean;
}

const nowDate = (value: string) => value;

const calculateCommission = (value: number, rate: number): number => {
  return Math.round(value * (rate / 100));
};

export const dealStageOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Documentation", value: "documentation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
] as const;

export const dealPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

export const dealTypeOptions = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Rental", value: "rental" },
  { label: "Land", value: "land" },
] as const;

export const dealsMock: Deal[] = [
  {
    id: "deal_001",
    dealCode: "MEI-DEAL-1001",
    title: "Arjun Menon - Whitefield 2BHK Purchase",
    stage: "site_visit",
    priority: "high",
    source: "website",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    customer: {
      id: "cnt_001",
      name: "Arjun Menon",
      phone: "+91 9876543210",
      email: "arjun.menon@example.com",
      city: "Bengaluru",
      type: "buyer",
    },
    property: {
      id: "prop_001",
      title: "Prestige Tech Vista",
      type: "apartment",
      city: "Bengaluru",
      locality: "Whitefield",
      configuration: "2 BHK",
      sizeLabel: "1240 sq.ft",
      price: 11200000,
      listingCode: "MEI-PROP-201",
    },
    expectedValue: 11200000,
    probability: 62,
    commissionRate: 2,
    expectedCommission: calculateCommission(11200000, 2),
    expectedCloseDate: nowDate("2026-04-28T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-14T10:20:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-15T07:30:00.000Z"),
    createdAt: nowDate("2026-03-25T09:00:00.000Z"),
    updatedAt: nowDate("2026-04-14T10:22:00.000Z"),
    tags: ["hot", "loan-ready", "family buyer", "whitefield"],
    riskFlags: [
      {
        id: "risk_001",
        label: "Loan sanction pending",
        level: "medium",
        description: "Bank pre-approval complete, final sanction pending.",
      },
    ],
    activities: [
      {
        id: "dact_001",
        type: "call",
        title: "Requirement discussion completed",
        description: "Budget and family needs finalized.",
        createdAt: nowDate("2026-04-09T09:10:00.000Z"),
        createdBy: "Ravi Kumar",
      },
      {
        id: "dact_002",
        type: "site_visit",
        title: "Site visit scheduled",
        description: "Visit planned for Saturday morning.",
        createdAt: nowDate("2026-04-14T10:20:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    notes: [
      {
        id: "dnote_001",
        text: "Customer prefers east-facing unit with clubhouse access.",
        createdAt: nowDate("2026-04-11T13:00:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    taskSnapshot: {
      total: 5,
      completed: 2,
      pending: 2,
      overdue: 1,
    },
    isStarred: true,
    isOverdue: false,
  },
  {
    id: "deal_002",
    dealCode: "MEI-DEAL-1002",
    title: "Priya Natarajan - Anna Nagar Resale",
    stage: "negotiation",
    priority: "medium",
    source: "referral",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    customer: {
      id: "cnt_002",
      name: "Priya Natarajan",
      phone: "+91 9123456780",
      email: "priya.n@example.com",
      city: "Chennai",
      type: "seller",
    },
    property: {
      id: "prop_002",
      title: "Anna Nagar 3BHK Resale Flat",
      type: "apartment",
      city: "Chennai",
      locality: "Anna Nagar",
      configuration: "3 BHK",
      sizeLabel: "1620 sq.ft",
      price: 14500000,
      listingCode: "MEI-PROP-202",
    },
    expectedValue: 14500000,
    probability: 71,
    commissionRate: 1.5,
    expectedCommission: calculateCommission(14500000, 1.5),
    expectedCloseDate: nowDate("2026-05-03T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-12T16:20:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-17T10:00:00.000Z"),
    createdAt: nowDate("2026-03-28T13:00:00.000Z"),
    updatedAt: nowDate("2026-04-12T16:25:00.000Z"),
    tags: ["resale", "seller-side", "price discussion"],
    riskFlags: [
      {
        id: "risk_002",
        label: "Price expectation mismatch",
        level: "high",
        description: "Seller asking above current market comfort range.",
      },
    ],
    activities: [
      {
        id: "dact_003",
        type: "meeting",
        title: "Seller expectation meeting",
        description: "Discussed revised offer range.",
        createdAt: nowDate("2026-04-12T16:20:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    notes: [
      {
        id: "dnote_002",
        text: "Potential buyer exists if price comes down by 5-7%.",
        createdAt: nowDate("2026-04-12T17:00:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    taskSnapshot: {
      total: 4,
      completed: 1,
      pending: 2,
      overdue: 1,
    },
    isStarred: false,
    isOverdue: false,
  },
  {
    id: "deal_003",
    dealCode: "MEI-DEAL-1003",
    title: "Rahul Shetty - Devanahalli Plot Investment",
    stage: "qualified",
    priority: "urgent",
    source: "broker_network",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    customer: {
      id: "cnt_003",
      name: "Rahul Shetty",
      phone: "+91 9345678901",
      email: "rahul.shetty@example.com",
      city: "Bengaluru",
      type: "investor",
    },
    property: {
      id: "prop_003",
      title: "North Gate Plotted Enclave",
      type: "plot",
      city: "Bengaluru",
      locality: "Devanahalli",
      configuration: "30x40 Plot",
      sizeLabel: "1200 sq.ft",
      price: 8600000,
      listingCode: "MEI-PROP-203",
    },
    expectedValue: 8600000,
    probability: 54,
    commissionRate: 2.25,
    expectedCommission: calculateCommission(8600000, 2.25),
    expectedCloseDate: nowDate("2026-05-12T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-14T07:45:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-15T10:00:00.000Z"),
    createdAt: nowDate("2026-02-22T09:30:00.000Z"),
    updatedAt: nowDate("2026-04-14T07:46:00.000Z"),
    tags: ["investor", "plot", "north bangalore", "fast mover"],
    riskFlags: [
      {
        id: "risk_003",
        label: "Legal verification in progress",
        level: "medium",
        description: "Final title review pending from legal desk.",
      },
    ],
    activities: [
      {
        id: "dact_004",
        type: "call",
        title: "Investment strategy call",
        description: "Appreciation and exit options discussed.",
        createdAt: nowDate("2026-04-14T07:45:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    notes: [
      {
        id: "dnote_003",
        text: "Customer wants strong resale potential within 3 years.",
        createdAt: nowDate("2026-04-11T12:15:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    taskSnapshot: {
      total: 6,
      completed: 3,
      pending: 3,
      overdue: 0,
    },
    isStarred: true,
    isOverdue: false,
  },
  {
    id: "deal_004",
    dealCode: "MEI-DEAL-1004",
    title: "Sneha Reddy - HSR Rental Search",
    stage: "contacted",
    priority: "medium",
    source: "instagram",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    customer: {
      id: "cnt_004",
      name: "Sneha Reddy",
      phone: "+91 9567890123",
      email: "sneha.reddy@example.com",
      city: "Bengaluru",
      type: "tenant",
    },
    property: {
      id: "prop_004",
      title: "HSR Semi-Furnished Rental Collection",
      type: "rental",
      city: "Bengaluru",
      locality: "HSR Layout",
      configuration: "2 BHK",
      sizeLabel: "1100 sq.ft",
      price: 42000,
      listingCode: "MEI-PROP-204",
    },
    expectedValue: 42000,
    probability: 38,
    commissionRate: 8,
    expectedCommission: calculateCommission(42000, 8),
    expectedCloseDate: nowDate("2026-04-21T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-14T10:30:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-15T12:30:00.000Z"),
    createdAt: nowDate("2026-04-14T10:00:00.000Z"),
    updatedAt: nowDate("2026-04-14T10:35:00.000Z"),
    tags: ["rental", "family", "urgent move"],
    riskFlags: [],
    activities: [
      {
        id: "dact_005",
        type: "whatsapp",
        title: "Rental shortlist shared",
        description: "Sent 5 options near HSR and Sarjapur.",
        createdAt: nowDate("2026-04-14T10:30:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    notes: [
      {
        id: "dnote_004",
        text: "Needs property within 2 weeks due to job relocation.",
        createdAt: nowDate("2026-04-14T10:18:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    taskSnapshot: {
      total: 3,
      completed: 1,
      pending: 2,
      overdue: 0,
    },
    isStarred: false,
    isOverdue: false,
  },
  {
    id: "deal_005",
    dealCode: "MEI-DEAL-1005",
    title: "Karthik Subramanian - Property Management Mandate",
    stage: "documentation",
    priority: "high",
    source: "whatsapp",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    customer: {
      id: "cnt_005",
      name: "Karthik Subramanian",
      phone: "+91 9789012345",
      email: "karthik.s@example.com",
      city: "Chennai",
      type: "owner",
    },
    property: {
      id: "prop_005",
      title: "Velachery Rental Apartment",
      type: "rental",
      city: "Chennai",
      locality: "Velachery",
      configuration: "2 BHK",
      sizeLabel: "1180 sq.ft",
      price: 55000,
      listingCode: "MEI-PROP-205",
    },
    expectedValue: 55000,
    probability: 83,
    commissionRate: 10,
    expectedCommission: calculateCommission(55000, 10),
    expectedCloseDate: nowDate("2026-04-18T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-11T14:10:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-18T09:00:00.000Z"),
    createdAt: nowDate("2026-01-14T09:00:00.000Z"),
    updatedAt: nowDate("2026-04-11T14:15:00.000Z"),
    tags: ["property management", "owner", "recurring revenue"],
    riskFlags: [
      {
        id: "risk_004",
        label: "Agreement signature pending",
        level: "low",
        description: "Mandate draft shared, awaiting final sign-off.",
      },
    ],
    activities: [
      {
        id: "dact_006",
        type: "document",
        title: "Management agreement shared",
        description: "Draft agreement emailed to owner.",
        createdAt: nowDate("2026-04-11T14:10:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    notes: [
      {
        id: "dnote_005",
        text: "Owner wants tenant screening and maintenance handled fully.",
        createdAt: nowDate("2026-03-30T17:00:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    taskSnapshot: {
      total: 4,
      completed: 2,
      pending: 2,
      overdue: 0,
    },
    isStarred: true,
    isOverdue: false,
  },
  {
    id: "deal_006",
    dealCode: "MEI-DEAL-1006",
    title: "Irfan - East Bangalore Co-Broking Inventory",
    stage: "new",
    priority: "medium",
    source: "broker_network",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    customer: {
      id: "cnt_006",
      name: "Mohammed Irfan",
      phone: "+91 9001122334",
      email: "irfan@example.com",
      city: "Bengaluru",
      type: "buyer",
    },
    property: {
      id: "prop_006",
      title: "Sarjapur Premium Inventory Basket",
      type: "apartment",
      city: "Bengaluru",
      locality: "Sarjapur Road",
      configuration: "2/3 BHK",
      sizeLabel: "1180 - 1680 sq.ft",
      price: 9800000,
      listingCode: "MEI-PROP-206",
    },
    expectedValue: 9800000,
    probability: 22,
    commissionRate: 1.75,
    expectedCommission: calculateCommission(9800000, 1.75),
    expectedCloseDate: nowDate("2026-05-20T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-10T18:00:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-19T12:30:00.000Z"),
    createdAt: nowDate("2025-12-21T12:00:00.000Z"),
    updatedAt: nowDate("2026-04-10T18:02:00.000Z"),
    tags: ["co-broking", "inventory", "east bangalore"],
    riskFlags: [],
    activities: [
      {
        id: "dact_007",
        type: "call",
        title: "Channel sync completed",
        description: "Discussed available stock and commission split.",
        createdAt: nowDate("2026-04-10T18:00:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    notes: [
      {
        id: "dnote_006",
        text: "Potential to unlock 3 more buyers via partner network.",
        createdAt: nowDate("2026-04-10T18:10:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    taskSnapshot: {
      total: 2,
      completed: 1,
      pending: 1,
      overdue: 0,
    },
    isStarred: false,
    isOverdue: false,
  },
  {
    id: "deal_007",
    dealCode: "MEI-DEAL-1007",
    title: "Lakshmi Prasad - OMR Builder Partnership Deal",
    stage: "won",
    priority: "urgent",
    source: "property_portal",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    customer: {
      id: "cnt_007",
      name: "Lakshmi Prasad",
      phone: "+91 9884433221",
      email: "lakshmi.prasad@example.com",
      city: "Chennai",
      type: "seller",
    },
    property: {
      id: "prop_007",
      title: "OMR Premium Launch Inventory",
      type: "apartment",
      city: "Chennai",
      locality: "OMR",
      configuration: "2/3 BHK",
      sizeLabel: "1280 - 1820 sq.ft",
      price: 7800000,
      listingCode: "MEI-PROP-207",
    },
    expectedValue: 31200000,
    probability: 100,
    commissionRate: 2.5,
    expectedCommission: calculateCommission(31200000, 2.5),
    expectedCloseDate: nowDate("2026-04-08T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-04-08T15:15:00.000Z"),
    nextFollowUpAt: nowDate("2026-04-22T11:00:00.000Z"),
    createdAt: nowDate("2025-11-11T10:00:00.000Z"),
    updatedAt: nowDate("2026-04-08T15:17:00.000Z"),
    tags: ["builder", "won", "exclusive", "campaign-ready"],
    riskFlags: [],
    activities: [
      {
        id: "dact_008",
        type: "stage_change",
        title: "Deal marked as won",
        description: "Builder partnership finalized successfully.",
        createdAt: nowDate("2026-04-08T15:15:00.000Z"),
        createdBy: "Balaji K",
      },
    ],
    notes: [
      {
        id: "dnote_007",
        text: "Inventory access approved for upcoming campaign launch.",
        createdAt: nowDate("2026-04-08T16:00:00.000Z"),
        createdBy: "Balaji K",
      },
    ],
    taskSnapshot: {
      total: 7,
      completed: 7,
      pending: 0,
      overdue: 0,
    },
    isStarred: true,
    isOverdue: false,
  },
  {
    id: "deal_008",
    dealCode: "MEI-DEAL-1008",
    title: "Deepika Rao - Affordable 2BHK Search",
    stage: "lost",
    priority: "low",
    source: "facebook",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    customer: {
      id: "cnt_008",
      name: "Deepika Rao",
      phone: "+91 9012345678",
      email: "deepika.rao@example.com",
      city: "Bengaluru",
      type: "buyer",
    },
    property: {
      id: "prop_008",
      title: "Electronic City Budget Homes",
      type: "apartment",
      city: "Bengaluru",
      locality: "Electronic City",
      configuration: "2 BHK",
      sizeLabel: "980 sq.ft",
      price: 6200000,
      listingCode: "MEI-PROP-208",
    },
    expectedValue: 6200000,
    probability: 0,
    commissionRate: 2,
    expectedCommission: calculateCommission(6200000, 2),
    expectedCloseDate: nowDate("2026-03-28T00:00:00.000Z"),
    lastActivityAt: nowDate("2026-03-20T12:00:00.000Z"),
    nextFollowUpAt: nowDate("2026-05-01T09:00:00.000Z"),
    createdAt: nowDate("2026-02-03T09:45:00.000Z"),
    updatedAt: nowDate("2026-03-20T12:10:00.000Z"),
    tags: ["cold", "future buyer"],
    riskFlags: [
      {
        id: "risk_005",
        label: "Customer paused decision",
        level: "high",
        description: "Property search paused due to job transition.",
      },
    ],
    activities: [
      {
        id: "dact_009",
        type: "email",
        title: "Brochure set shared",
        description: "Affordable project list emailed.",
        createdAt: nowDate("2026-03-18T10:45:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    notes: [
      {
        id: "dnote_008",
        text: "Re-engage after one month with fresh inventory.",
        createdAt: nowDate("2026-03-20T12:00:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    taskSnapshot: {
      total: 2,
      completed: 1,
      pending: 0,
      overdue: 1,
    },
    isStarred: false,
    isOverdue: true,
  },
];

export const dealsByStageMock: Record<DealStage, Deal[]> = {
  new: dealsMock.filter((deal) => deal.stage === "new"),
  contacted: dealsMock.filter((deal) => deal.stage === "contacted"),
  qualified: dealsMock.filter((deal) => deal.stage === "qualified"),
  site_visit: dealsMock.filter((deal) => deal.stage === "site_visit"),
  negotiation: dealsMock.filter((deal) => deal.stage === "negotiation"),
  documentation: dealsMock.filter((deal) => deal.stage === "documentation"),
  won: dealsMock.filter((deal) => deal.stage === "won"),
  lost: dealsMock.filter((deal) => deal.stage === "lost"),
};

export const dealStatsMock = {
  totalDeals: dealsMock.length,
  activeDeals: dealsMock.filter(
    (deal) => !["won", "lost"].includes(deal.stage),
  ).length,
  wonDeals: dealsMock.filter((deal) => deal.stage === "won").length,
  lostDeals: dealsMock.filter((deal) => deal.stage === "lost").length,
  overdueDeals: dealsMock.filter((deal) => deal.isOverdue).length,
  totalPipelineValue: dealsMock
    .filter((deal) => !["won", "lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.expectedValue, 0),
  wonValue: dealsMock
    .filter((deal) => deal.stage === "won")
    .reduce((sum, deal) => sum + deal.expectedValue, 0),
  expectedCommission: dealsMock
    .filter((deal) => !["lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.expectedCommission, 0),
};

export const starredDealsMock = dealsMock.filter((deal) => deal.isStarred);

export const overdueDealsMock = dealsMock.filter((deal) => deal.isOverdue);

export const hotDealsMock = dealsMock.filter(
  (deal) => deal.priority === "high" || deal.priority === "urgent",
);

export const recentDealsMock = [...dealsMock]
  .sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
  .slice(0, 5);

export const dealStageCountMock = dealStageOptions.map((stage) => ({
  stage: stage.value,
  label: stage.label,
  count: dealsMock.filter((deal) => deal.stage === stage.value).length,
}));

export const getDealById = (dealId: string): Deal | undefined => {
  return dealsMock.find((deal) => deal.id === dealId);
};

export const getDealsByStage = (stage: DealStage): Deal[] => {
  return dealsMock.filter((deal) => deal.stage === stage);
};

export const getDealsByAssignedUser = (userId: string): Deal[] => {
  return dealsMock.filter((deal) => deal.assignedUserId === userId);
};

export const searchDealsMock = (search: string): Deal[] => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return dealsMock;
  }

  return dealsMock.filter((deal) =>
    [
      deal.title,
      deal.dealCode,
      deal.customer.name,
      deal.customer.phone,
      deal.customer.email,
      deal.property.title,
      deal.property.locality,
      deal.property.city,
      deal.assignedTo,
      deal.stage,
      deal.priority,
      deal.source,
      ...deal.tags,
      ...deal.riskFlags.map((risk) => risk.label),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
};

export default dealsMock;