// src/mocks/contacts.mock.ts

export type ContactStatus =
  | "new"
  | "active"
  | "follow_up"
  | "inactive"
  | "converted"
  | "archived";

export type ContactType =
  | "buyer"
  | "seller"
  | "owner"
  | "tenant"
  | "investor"
  | "broker"
  | "builder";

export type ContactPriority = "low" | "medium" | "high" | "urgent";

export interface ContactAddress {
  street?: string;
  area: string;
  city: string;
  state: string;
  pincode?: string;
  country: string;
}

export interface ContactSocialLinks {
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

export interface ContactPreferences {
  preferredPropertyTypes: string[];
  preferredLocations: string[];
  budgetMin?: number;
  budgetMax?: number;
  unitPreference?: string;
  furnishingPreference?: "unfurnished" | "semi-furnished" | "fully-furnished";
  purpose?: "buy" | "rent" | "lease" | "invest";
}

export interface ContactNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ContactActivity {
  id: string;
  type: "call" | "email" | "whatsapp" | "meeting" | "site_visit" | "note";
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface ContactDealSnapshot {
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalValue: number;
}

export interface Contact {
  id: string;
  contactCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  company?: string;
  designation?: string;
  type: ContactType;
  status: ContactStatus;
  priority: ContactPriority;
  source:
    | "website"
    | "facebook"
    | "instagram"
    | "google_ads"
    | "whatsapp"
    | "referral"
    | "broker_network"
    | "walk_in"
    | "property_portal"
    | "cold_call";
  assignedTo: string;
  ownerId: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
  location: ContactAddress;
  tags: string[];
  isStarred: boolean;
  isWhatsAppOptIn: boolean;
  isEmailOptIn: boolean;
  budgetLabel?: string;
  notes: ContactNote[];
  activities: ContactActivity[];
  preferences?: ContactPreferences;
  dealSnapshot: ContactDealSnapshot;
}

const makeDate = (value: string) => value;

export const contactsMock: Contact[] = [
  {
    id: "cnt_001",
    contactCode: "MEI-CON-1001",
    firstName: "Arjun",
    lastName: "Menon",
    fullName: "Arjun Menon",
    email: "arjun.menon@example.com",
    phone: "+91 9876543210",
    alternatePhone: "+91 9988776655",
    company: "Infosphere Labs",
    designation: "Engineering Manager",
    type: "buyer",
    status: "active",
    priority: "high",
    source: "website",
    assignedTo: "Ravi Kumar",
    ownerId: "usr_001",
    lastContactedAt: makeDate("2026-04-13T11:00:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-16T09:30:00.000Z"),
    createdAt: makeDate("2026-03-18T10:15:00.000Z"),
    updatedAt: makeDate("2026-04-13T11:05:00.000Z"),
    location: {
      area: "Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      country: "India",
    },
    tags: ["hot lead", "2bhk", "it professional", "home loan ready"],
    isStarred: true,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    budgetLabel: "₹90L - ₹1.2Cr",
    notes: [
      {
        id: "note_001",
        content:
          "Interested in premium 2BHK gated community projects near ITPL.",
        createdAt: makeDate("2026-04-10T08:30:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "act_001",
        type: "call",
        title: "Initial requirement call",
        description: "Discussed budget, loan eligibility, and family needs.",
        createdAt: makeDate("2026-04-09T09:00:00.000Z"),
        createdBy: "Ravi Kumar",
      },
      {
        id: "act_002",
        type: "site_visit",
        title: "Scheduled Whitefield site visit",
        description: "Visit planned for Saturday morning.",
        createdAt: makeDate("2026-04-13T11:00:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment", "Gated Community Flat"],
      preferredLocations: ["Whitefield", "Varthur", "Sarjapur Road"],
      budgetMin: 9000000,
      budgetMax: 12000000,
      unitPreference: "2 BHK",
      furnishingPreference: "semi-furnished",
      purpose: "buy",
    },
    dealSnapshot: {
      totalDeals: 1,
      wonDeals: 0,
      lostDeals: 0,
      totalValue: 0,
    },
  },
  {
    id: "cnt_002",
    contactCode: "MEI-CON-1002",
    firstName: "Priya",
    lastName: "Natarajan",
    fullName: "Priya Natarajan",
    email: "priya.n@example.com",
    phone: "+91 9123456780",
    company: "Freelance",
    designation: "Interior Consultant",
    type: "seller",
    status: "follow_up",
    priority: "medium",
    source: "referral",
    assignedTo: "Meena S",
    ownerId: "usr_002",
    lastContactedAt: makeDate("2026-04-12T16:20:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-17T10:00:00.000Z"),
    createdAt: makeDate("2026-03-28T13:00:00.000Z"),
    updatedAt: makeDate("2026-04-12T16:22:00.000Z"),
    location: {
      area: "Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      country: "India",
    },
    tags: ["resale flat", "motivated seller"],
    isStarred: false,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    budgetLabel: "Expected ₹1.45Cr",
    notes: [
      {
        id: "note_002",
        content: "Wants to sell 3BHK before relocating to Coimbatore.",
        createdAt: makeDate("2026-04-05T15:10:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    activities: [
      {
        id: "act_003",
        type: "meeting",
        title: "Seller expectation meeting",
        description: "Discussed market rate and exclusive mandate option.",
        createdAt: makeDate("2026-04-12T16:20:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment"],
      preferredLocations: ["Anna Nagar"],
      purpose: "buy",
    },
    dealSnapshot: {
      totalDeals: 2,
      wonDeals: 1,
      lostDeals: 0,
      totalValue: 13200000,
    },
  },
  {
    id: "cnt_003",
    contactCode: "MEI-CON-1003",
    firstName: "Rahul",
    lastName: "Shetty",
    fullName: "Rahul Shetty",
    email: "rahul.shetty@example.com",
    phone: "+91 9345678901",
    company: "FinEdge Capital",
    designation: "Investment Analyst",
    type: "investor",
    status: "active",
    priority: "urgent",
    source: "broker_network",
    assignedTo: "Aravind P",
    ownerId: "usr_003",
    lastContactedAt: makeDate("2026-04-14T07:45:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-15T12:00:00.000Z"),
    createdAt: makeDate("2026-02-22T09:30:00.000Z"),
    updatedAt: makeDate("2026-04-14T07:46:00.000Z"),
    location: {
      area: "Hebbal",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560024",
      country: "India",
    },
    tags: ["investor", "plots", "north bangalore", "fast mover"],
    isStarred: true,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    budgetLabel: "₹2Cr - ₹5Cr",
    notes: [
      {
        id: "note_003",
        content:
          "Looking for plotted development opportunities near airport growth belt.",
        createdAt: makeDate("2026-04-11T12:00:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    activities: [
      {
        id: "act_004",
        type: "call",
        title: "Investment strategy call",
        description: "Focused on 3-year appreciation and exit opportunity.",
        createdAt: makeDate("2026-04-14T07:45:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Plot", "Villa Plot", "Land Parcel"],
      preferredLocations: ["Hebbal", "Devanahalli", "Yelahanka"],
      budgetMin: 20000000,
      budgetMax: 50000000,
      purpose: "invest",
    },
    dealSnapshot: {
      totalDeals: 4,
      wonDeals: 2,
      lostDeals: 1,
      totalValue: 87600000,
    },
  },
  {
    id: "cnt_004",
    contactCode: "MEI-CON-1004",
    firstName: "Sneha",
    lastName: "Reddy",
    fullName: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 9567890123",
    company: "Apex Systems",
    designation: "HR Lead",
    type: "tenant",
    status: "new",
    priority: "medium",
    source: "instagram",
    assignedTo: "Ravi Kumar",
    ownerId: "usr_001",
    lastContactedAt: makeDate("2026-04-14T10:30:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-15T17:30:00.000Z"),
    createdAt: makeDate("2026-04-14T10:00:00.000Z"),
    updatedAt: makeDate("2026-04-14T10:35:00.000Z"),
    location: {
      area: "HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
      country: "India",
    },
    tags: ["rental", "family", "semi furnished"],
    isStarred: false,
    isWhatsAppOptIn: true,
    isEmailOptIn: false,
    budgetLabel: "₹30K - ₹45K Rent",
    notes: [
      {
        id: "note_004",
        content: "Needs rental home within 2 weeks near office commute zone.",
        createdAt: makeDate("2026-04-14T10:20:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "act_005",
        type: "whatsapp",
        title: "Shared rental options",
        description: "Sent 5 shortlisted HSR and Sarjapur properties.",
        createdAt: makeDate("2026-04-14T10:30:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment"],
      preferredLocations: ["HSR Layout", "Sarjapur Road", "Bellandur"],
      budgetMin: 30000,
      budgetMax: 45000,
      unitPreference: "2 BHK",
      furnishingPreference: "semi-furnished",
      purpose: "rent",
    },
    dealSnapshot: {
      totalDeals: 0,
      wonDeals: 0,
      lostDeals: 0,
      totalValue: 0,
    },
  },
  {
    id: "cnt_005",
    contactCode: "MEI-CON-1005",
    firstName: "Karthik",
    lastName: "Subramanian",
    fullName: "Karthik Subramanian",
    email: "karthik.s@example.com",
    phone: "+91 9789012345",
    company: "Self Employed",
    designation: "Business Owner",
    type: "owner",
    status: "active",
    priority: "high",
    source: "whatsapp",
    assignedTo: "Meena S",
    ownerId: "usr_002",
    lastContactedAt: makeDate("2026-04-11T14:10:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-18T09:00:00.000Z"),
    createdAt: makeDate("2026-01-14T09:00:00.000Z"),
    updatedAt: makeDate("2026-04-11T14:15:00.000Z"),
    location: {
      area: "Velachery",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600042",
      country: "India",
    },
    tags: ["owner", "property management", "rental income"],
    isStarred: true,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    budgetLabel: "Monthly Rent Goal ₹55K",
    notes: [
      {
        id: "note_005",
        content:
          "Interested in end-to-end property management for his vacant apartment.",
        createdAt: makeDate("2026-03-30T17:00:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    activities: [
      {
        id: "act_006",
        type: "meeting",
        title: "Property management pitch",
        description: "Explained tenant screening and maintenance SLA process.",
        createdAt: makeDate("2026-04-11T14:10:00.000Z"),
        createdBy: "Meena S",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment"],
      preferredLocations: ["Velachery", "OMR"],
      purpose: "lease",
    },
    dealSnapshot: {
      totalDeals: 3,
      wonDeals: 2,
      lostDeals: 0,
      totalValue: 85000,
    },
  },
  {
    id: "cnt_006",
    contactCode: "MEI-CON-1006",
    firstName: "Mohammed",
    lastName: "Irfan",
    fullName: "Mohammed Irfan",
    email: "irfan@example.com",
    phone: "+91 9001122334",
    company: "Urban Crest Realty",
    designation: "Channel Partner",
    type: "broker",
    status: "active",
    priority: "medium",
    source: "broker_network",
    assignedTo: "Aravind P",
    ownerId: "usr_003",
    lastContactedAt: makeDate("2026-04-10T18:00:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-19T12:30:00.000Z"),
    createdAt: makeDate("2025-12-21T12:00:00.000Z"),
    updatedAt: makeDate("2026-04-10T18:02:00.000Z"),
    location: {
      area: "Sarjapur Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560035",
      country: "India",
    },
    tags: ["channel partner", "co-broking", "inventory access"],
    isStarred: false,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    notes: [
      {
        id: "note_006",
        content: "Strong local network in East Bangalore mid-premium segment.",
        createdAt: makeDate("2026-02-15T09:40:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    activities: [
      {
        id: "act_007",
        type: "call",
        title: "Co-broking sync call",
        description: "Discussed buyer sharing terms for new launch inventory.",
        createdAt: makeDate("2026-04-10T18:00:00.000Z"),
        createdBy: "Aravind P",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment", "Villa"],
      preferredLocations: ["Sarjapur Road", "Bellandur", "Varthur"],
      purpose: "buy",
    },
    dealSnapshot: {
      totalDeals: 6,
      wonDeals: 4,
      lostDeals: 1,
      totalValue: 145000000,
    },
  },
  {
    id: "cnt_007",
    contactCode: "MEI-CON-1007",
    firstName: "Lakshmi",
    lastName: "Prasad",
    fullName: "Lakshmi Prasad",
    email: "lakshmi.prasad@example.com",
    phone: "+91 9884433221",
    company: "Prasad Foundations",
    designation: "Sales Director",
    type: "builder",
    status: "converted",
    priority: "urgent",
    source: "cold_call",
    assignedTo: "Balaji K",
    ownerId: "usr_004",
    lastContactedAt: makeDate("2026-04-08T15:15:00.000Z"),
    nextFollowUpAt: makeDate("2026-04-22T11:00:00.000Z"),
    createdAt: makeDate("2025-11-11T10:00:00.000Z"),
    updatedAt: makeDate("2026-04-08T15:17:00.000Z"),
    location: {
      area: "OMR",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600119",
      country: "India",
    },
    tags: ["builder", "exclusive inventory", "strategic partner"],
    isStarred: true,
    isWhatsAppOptIn: true,
    isEmailOptIn: true,
    budgetLabel: "Project Ticket Size ₹75L+",
    notes: [
      {
        id: "note_007",
        content:
          "Converted into project partner. Ready for exclusive campaign push.",
        createdAt: makeDate("2026-04-02T13:25:00.000Z"),
        createdBy: "Balaji K",
      },
    ],
    activities: [
      {
        id: "act_008",
        type: "meeting",
        title: "Builder partnership closure",
        description: "Finalized inventory access and campaign launch timeline.",
        createdAt: makeDate("2026-04-08T15:15:00.000Z"),
        createdBy: "Balaji K",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment", "Villa"],
      preferredLocations: ["OMR", "Sholinganallur", "Navalur"],
      purpose: "buy",
    },
    dealSnapshot: {
      totalDeals: 8,
      wonDeals: 6,
      lostDeals: 1,
      totalValue: 312000000,
    },
  },
  {
    id: "cnt_008",
    contactCode: "MEI-CON-1008",
    firstName: "Deepika",
    lastName: "Rao",
    fullName: "Deepika Rao",
    email: "deepika.rao@example.com",
    phone: "+91 9012345678",
    company: "ByteNest",
    designation: "Product Designer",
    type: "buyer",
    status: "inactive",
    priority: "low",
    source: "facebook",
    assignedTo: "Ravi Kumar",
    ownerId: "usr_001",
    lastContactedAt: makeDate("2026-03-20T12:00:00.000Z"),
    nextFollowUpAt: makeDate("2026-05-01T09:00:00.000Z"),
    createdAt: makeDate("2026-02-03T09:45:00.000Z"),
    updatedAt: makeDate("2026-03-20T12:10:00.000Z"),
    location: {
      area: "Electronic City",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560100",
      country: "India",
    },
    tags: ["cold", "future buyer"],
    isStarred: false,
    isWhatsAppOptIn: false,
    isEmailOptIn: true,
    budgetLabel: "₹55L - ₹70L",
    notes: [
      {
        id: "note_008",
        content: "Paused search for now due to job switch.",
        createdAt: makeDate("2026-03-20T12:00:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "act_009",
        type: "email",
        title: "Sent project brochure set",
        description: "Shared affordable gated community projects.",
        createdAt: makeDate("2026-03-18T10:45:00.000Z"),
        createdBy: "Ravi Kumar",
      },
    ],
    preferences: {
      preferredPropertyTypes: ["Apartment"],
      preferredLocations: ["Electronic City", "Begur Road"],
      budgetMin: 5500000,
      budgetMax: 7000000,
      unitPreference: "2 BHK",
      purpose: "buy",
    },
    dealSnapshot: {
      totalDeals: 0,
      wonDeals: 0,
      lostDeals: 1,
      totalValue: 0,
    },
  },
];

export const contactTypeOptions = [
  { label: "Buyer", value: "buyer" },
  { label: "Seller", value: "seller" },
  { label: "Owner", value: "owner" },
  { label: "Tenant", value: "tenant" },
  { label: "Investor", value: "investor" },
  { label: "Broker", value: "broker" },
  { label: "Builder", value: "builder" },
] as const;

export const contactStatusOptions = [
  { label: "New", value: "new" },
  { label: "Active", value: "active" },
  { label: "Follow Up", value: "follow_up" },
  { label: "Inactive", value: "inactive" },
  { label: "Converted", value: "converted" },
  { label: "Archived", value: "archived" },
] as const;

export const contactPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

export const contactSourceOptions = [
  { label: "Website", value: "website" },
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Google Ads", value: "google_ads" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Referral", value: "referral" },
  { label: "Broker Network", value: "broker_network" },
  { label: "Walk In", value: "walk_in" },
  { label: "Property Portal", value: "property_portal" },
  { label: "Cold Call", value: "cold_call" },
] as const;

export const contactStatsMock = {
  total: contactsMock.length,
  active: contactsMock.filter((item) => item.status === "active").length,
  followUp: contactsMock.filter((item) => item.status === "follow_up").length,
  converted: contactsMock.filter((item) => item.status === "converted").length,
  starred: contactsMock.filter((item) => item.isStarred).length,
  buyers: contactsMock.filter((item) => item.type === "buyer").length,
  sellers: contactsMock.filter((item) => item.type === "seller").length,
  investors: contactsMock.filter((item) => item.type === "investor").length,
};

export const recentContactsMock = [...contactsMock]
  .sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
  .slice(0, 5);

export const starredContactsMock = contactsMock.filter((item) => item.isStarred);

export const hotContactsMock = contactsMock.filter(
  (item) => item.priority === "high" || item.priority === "urgent",
);

export const upcomingFollowUpsMock = contactsMock
  .filter((item) => item.nextFollowUpAt)
  .sort(
    (a, b) =>
      new Date(a.nextFollowUpAt ?? 0).getTime() -
      new Date(b.nextFollowUpAt ?? 0).getTime(),
  );

export const contactOwnersMock = [
  { id: "usr_001", name: "Ravi Kumar" },
  { id: "usr_002", name: "Meena S" },
  { id: "usr_003", name: "Aravind P" },
  { id: "usr_004", name: "Balaji K" },
];

export const getContactById = (contactId: string): Contact | undefined => {
  return contactsMock.find((contact) => contact.id === contactId);
};

export const getContactsByStatus = (status: ContactStatus): Contact[] => {
  return contactsMock.filter((contact) => contact.status === status);
};

export const getContactsByType = (type: ContactType): Contact[] => {
  return contactsMock.filter((contact) => contact.type === type);
};

export const getContactsByOwner = (ownerId: string): Contact[] => {
  return contactsMock.filter((contact) => contact.ownerId === ownerId);
};

export const searchContactsMock = (search: string): Contact[] => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return contactsMock;
  }

  return contactsMock.filter((contact) => {
    return [
      contact.fullName,
      contact.email,
      contact.phone,
      contact.company,
      contact.designation,
      contact.location.area,
      contact.location.city,
      contact.type,
      contact.status,
      contact.source,
      ...contact.tags,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
};

export default contactsMock;