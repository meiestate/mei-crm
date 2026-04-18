export type AnalyticsFilterOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

export type AnalyticsFilterGroup = {
  key:
    | "metric"
    | "team"
    | "agent"
    | "source"
    | "project"
    | "location"
    | "stage"
    | "status"
    | "risk"
    | "channel"
    | "priority"
    | "dealSize"
    | "leadType"
    | "propertyType"
    | "conversionWindow";
  label: string;
  options: AnalyticsFilterOption[];
  isMultiSelect?: boolean;
  isSearchable?: boolean;
};

export const ANALYTICS_METRIC_OPTIONS: AnalyticsFilterOption[] = [
  {
    label: "Revenue",
    value: "revenue",
    description: "Track closed value and revenue performance",
  },
  {
    label: "Leads",
    value: "leads",
    description: "Monitor inbound and qualified lead volume",
  },
  {
    label: "Deals",
    value: "deals",
    description: "Analyze active, won, and lost deals",
  },
  {
    label: "Conversions",
    value: "conversions",
    description: "Measure stage and funnel conversion performance",
  },
  {
    label: "Forecast",
    value: "forecast",
    description: "Review projected pipeline and revenue forecast",
  },
  {
    label: "Engagement",
    value: "engagement",
    description: "Analyze email, message, and campaign engagement",
  },
  {
    label: "Efficiency",
    value: "efficiency",
    description: "Compare speed, cost, and output efficiency",
  },
];

export const ANALYTICS_TEAM_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Teams", value: "all" },
  { label: "Sales Team", value: "sales" },
  { label: "Inside Sales", value: "inside-sales" },
  { label: "Field Sales", value: "field-sales" },
  { label: "Pre-Sales", value: "pre-sales" },
  { label: "Marketing", value: "marketing" },
  { label: "CRM Operations", value: "crm-operations" },
  { label: "Leadership", value: "leadership" },
];

export const ANALYTICS_AGENT_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Agents", value: "all" },
  { label: "Arun Kumar", value: "arun-kumar" },
  { label: "Priya Sharma", value: "priya-sharma" },
  { label: "Vignesh Raj", value: "vignesh-raj" },
  { label: "Sneha Reddy", value: "sneha-reddy" },
  { label: "Karthik S", value: "karthik-s" },
  { label: "Naveen Babu", value: "naveen-babu" },
  { label: "Aishwarya N", value: "aishwarya-n" },
];

export const ANALYTICS_SOURCE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Sources", value: "all" },
  { label: "Website", value: "website" },
  { label: "Walk-in", value: "walk-in" },
  { label: "Referral", value: "referral" },
  { label: "Meta Ads", value: "meta-ads" },
  { label: "Google Ads", value: "google-ads" },
  { label: "WhatsApp Campaign", value: "whatsapp-campaign" },
  { label: "Property Portal", value: "property-portal" },
  { label: "Broker Network", value: "broker-network" },
  { label: "Cold Calling", value: "cold-calling" },
];

export const ANALYTICS_PROJECT_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Projects", value: "all" },
  { label: "MEI Green Heights", value: "mei-green-heights" },
  { label: "MEI Urban Nest", value: "mei-urban-nest" },
  { label: "MEI Elite Square", value: "mei-elite-square" },
  { label: "MEI Grand Avenue", value: "mei-grand-avenue" },
  { label: "MEI Smart Villas", value: "mei-smart-villas" },
  { label: "MEI Lake View", value: "mei-lake-view" },
];

export const ANALYTICS_LOCATION_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Locations", value: "all" },
  { label: "Chennai", value: "chennai" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Coimbatore", value: "coimbatore" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Sarjapur Road", value: "sarjapur-road" },
  { label: "Whitefield", value: "whitefield" },
  { label: "Electronic City", value: "electronic-city" },
  { label: "OMR", value: "omr" },
];

export const ANALYTICS_STAGE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Stages", value: "all" },
  { label: "New Lead", value: "new-lead" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Site Visit", value: "site-visit" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Documentation", value: "documentation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export const ANALYTICS_STATUS_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "On Hold", value: "on-hold" },
];

export const ANALYTICS_RISK_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Risk Levels", value: "all" },
  { label: "Low Risk", value: "low" },
  { label: "Medium Risk", value: "medium" },
  { label: "High Risk", value: "high" },
  { label: "Critical Risk", value: "critical" },
];

export const ANALYTICS_CHANNEL_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Channels", value: "all" },
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Phone Calls", value: "calls" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
];

export const ANALYTICS_PRIORITY_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

export const ANALYTICS_DEAL_SIZE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Deal Sizes", value: "all" },
  { label: "Below ₹25L", value: "below-25l" },
  { label: "₹25L - ₹50L", value: "25l-50l" },
  { label: "₹50L - ₹1Cr", value: "50l-1cr" },
  { label: "₹1Cr - ₹2Cr", value: "1cr-2cr" },
  { label: "Above ₹2Cr", value: "above-2cr" },
];

export const ANALYTICS_LEAD_TYPE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Lead Types", value: "all" },
  { label: "Buyer", value: "buyer" },
  { label: "Seller", value: "seller" },
  { label: "Investor", value: "investor" },
  { label: "Tenant", value: "tenant" },
  { label: "Owner", value: "owner" },
  { label: "Broker", value: "broker" },
];

export const ANALYTICS_PROPERTY_TYPE_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Property Types", value: "all" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Office Space", value: "office-space" },
  { label: "Retail Shop", value: "retail-shop" },
];

export const ANALYTICS_CONVERSION_WINDOW_OPTIONS: AnalyticsFilterOption[] = [
  { label: "All Windows", value: "all" },
  { label: "0 - 7 Days", value: "0-7-days" },
  { label: "8 - 15 Days", value: "8-15-days" },
  { label: "16 - 30 Days", value: "16-30-days" },
  { label: "31 - 60 Days", value: "31-60-days" },
  { label: "61 - 90 Days", value: "61-90-days" },
  { label: "90+ Days", value: "90-plus-days" },
];

export const ANALYTICS_FILTER_GROUPS: AnalyticsFilterGroup[] = [
  {
    key: "metric",
    label: "Metrics",
    options: ANALYTICS_METRIC_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "team",
    label: "Teams",
    options: ANALYTICS_TEAM_OPTIONS,
    isMultiSelect: true,
    isSearchable: true,
  },
  {
    key: "agent",
    label: "Agents",
    options: ANALYTICS_AGENT_OPTIONS,
    isMultiSelect: true,
    isSearchable: true,
  },
  {
    key: "source",
    label: "Sources",
    options: ANALYTICS_SOURCE_OPTIONS,
    isMultiSelect: true,
    isSearchable: true,
  },
  {
    key: "project",
    label: "Projects",
    options: ANALYTICS_PROJECT_OPTIONS,
    isMultiSelect: true,
    isSearchable: true,
  },
  {
    key: "location",
    label: "Locations",
    options: ANALYTICS_LOCATION_OPTIONS,
    isMultiSelect: true,
    isSearchable: true,
  },
  {
    key: "stage",
    label: "Stages",
    options: ANALYTICS_STAGE_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "status",
    label: "Statuses",
    options: ANALYTICS_STATUS_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "risk",
    label: "Risk Levels",
    options: ANALYTICS_RISK_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "channel",
    label: "Channels",
    options: ANALYTICS_CHANNEL_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "priority",
    label: "Priorities",
    options: ANALYTICS_PRIORITY_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "dealSize",
    label: "Deal Sizes",
    options: ANALYTICS_DEAL_SIZE_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "leadType",
    label: "Lead Types",
    options: ANALYTICS_LEAD_TYPE_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "propertyType",
    label: "Property Types",
    options: ANALYTICS_PROPERTY_TYPE_OPTIONS,
    isMultiSelect: true,
  },
  {
    key: "conversionWindow",
    label: "Conversion Windows",
    options: ANALYTICS_CONVERSION_WINDOW_OPTIONS,
    isMultiSelect: true,
  },
];

export const ANALYTICS_FILTER_OPTIONS_MAP = {
  metric: ANALYTICS_METRIC_OPTIONS,
  team: ANALYTICS_TEAM_OPTIONS,
  agent: ANALYTICS_AGENT_OPTIONS,
  source: ANALYTICS_SOURCE_OPTIONS,
  project: ANALYTICS_PROJECT_OPTIONS,
  location: ANALYTICS_LOCATION_OPTIONS,
  stage: ANALYTICS_STAGE_OPTIONS,
  status: ANALYTICS_STATUS_OPTIONS,
  risk: ANALYTICS_RISK_OPTIONS,
  channel: ANALYTICS_CHANNEL_OPTIONS,
  priority: ANALYTICS_PRIORITY_OPTIONS,
  dealSize: ANALYTICS_DEAL_SIZE_OPTIONS,
  leadType: ANALYTICS_LEAD_TYPE_OPTIONS,
  propertyType: ANALYTICS_PROPERTY_TYPE_OPTIONS,
  conversionWindow: ANALYTICS_CONVERSION_WINDOW_OPTIONS,
} as const;

export type AnalyticsFilterGroupKey = keyof typeof ANALYTICS_FILTER_OPTIONS_MAP;

export type AnalyticsFilterSelectionState = {
  metric: string[];
  team: string[];
  agent: string[];
  source: string[];
  project: string[];
  location: string[];
  stage: string[];
  status: string[];
  risk: string[];
  channel: string[];
  priority: string[];
  dealSize: string[];
  leadType: string[];
  propertyType: string[];
  conversionWindow: string[];
};

export const ANALYTICS_DEFAULT_FILTER_SELECTIONS: AnalyticsFilterSelectionState = {
  metric: ["revenue"],
  team: ["all"],
  agent: ["all"],
  source: ["all"],
  project: ["all"],
  location: ["all"],
  stage: ["all"],
  status: ["all"],
  risk: ["all"],
  channel: ["all"],
  priority: ["all"],
  dealSize: ["all"],
  leadType: ["all"],
  propertyType: ["all"],
  conversionWindow: ["all"],
};

export const getAnalyticsFilterOptions = (
  key: AnalyticsFilterGroupKey
): AnalyticsFilterOption[] => {
  return ANALYTICS_FILTER_OPTIONS_MAP[key];
};

export const getAnalyticsFilterGroup = (
  key: AnalyticsFilterGroupKey
): AnalyticsFilterGroup | undefined => {
  return ANALYTICS_FILTER_GROUPS.find((group) => group.key === key);
};

export const findAnalyticsFilterOption = (
  key: AnalyticsFilterGroupKey,
  value: string
): AnalyticsFilterOption | undefined => {
  return ANALYTICS_FILTER_OPTIONS_MAP[key].find((option) => option.value === value);
};

export const getAnalyticsFilterOptionLabel = (
  key: AnalyticsFilterGroupKey,
  value: string,
  fallback: string = "Unknown"
): string => {
  return findAnalyticsFilterOption(key, value)?.label ?? fallback;
};

export const isAnalyticsFilterGroupKey = (
  value: string
): value is AnalyticsFilterGroupKey => {
  return value in ANALYTICS_FILTER_OPTIONS_MAP;
};

export const normalizeAnalyticsFilterValues = (
  values: string[] | undefined,
  fallback: string = "all"
): string[] => {
  if (!values || values.length === 0) return [fallback];

  const uniqueValues = Array.from(new Set(values.filter(Boolean)));

  return uniqueValues.length ? uniqueValues : [fallback];
};

export default ANALYTICS_FILTER_GROUPS;