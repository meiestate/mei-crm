// src/types/contacts.types.ts

export type ContactStatus =
  | "active"
  | "inactive"
  | "customer"
  | "lead"
  | "new";

export type ContactSortKey =
  | "name"
  | "company"
  | "status"
  | "source"
  | "owner"
  | "updatedAt"
  | "createdAt";

export type ContactSortDirection = "asc" | "desc";

export type ContactActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "whatsapp"
  | "system";

export type ContactAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
};

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  company?: string;
  designation?: string;
  source?: string;
  owner?: string;
  status?: ContactStatus | string;
  tags?: string[];
  address?: ContactAddress;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
  lastContactedAt?: string;
  totalDeals?: number;
  totalDealValue?: number;
  totalLeads?: number;
};

export type ContactLead = {
  id: string;
  name: string;
  status?: string;
  source?: string;
  updatedAt?: string;
};

export type ContactDeal = {
  id: string;
  title: string;
  value?: number;
  stage?: string;
  status?: string;
  updatedAt?: string;
};

export type ContactActivity = {
  id: string;
  contactId: string;
  type: ContactActivityType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  pinned?: boolean;
};

export type ContactNote = {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
};

export type ContactFilters = {
  search: string;
  status: string;
  source: string;
  owner: string;
  sortBy: ContactSortKey;
  sortDirection: ContactSortDirection;
};

export type CreateContactInput = {
  name: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  company?: string;
  designation?: string;
  source?: string;
  owner?: string;
  status?: ContactStatus | string;
  tags?: string[];
  address?: ContactAddress;
  notes?: string;
  avatarUrl?: string;
};

export type UpdateContactInput = Partial<CreateContactInput>;

export type UseContactsResult = {
  contacts: Contact[];
  filteredContacts: Contact[];
  paginatedContacts: Contact[];
  loading: boolean;
  error: string | null;
  filters: ContactFilters;
  selectedIds: string[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasSelection: boolean;
  allVisibleSelected: boolean;
  sourceOptions: string[];
  ownerOptions: string[];
  statusOptions: string[];
  setFilters: (updates: Partial<ContactFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refresh: () => void;
  createContact: (input: CreateContactInput) => Contact;
  updateContact: (
    contactId: string,
    updates: UpdateContactInput
  ) => Contact | null;
  deleteContact: (contactId: string) => void;
  deleteSelectedContacts: () => void;
  toggleSelect: (contactId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openContactDetail: (contactId: string) => void;
};

export type UseContactDetailResult = {
  contactId: string;
  contact: Contact | null;
  relatedDeals: ContactDeal[];
  relatedLeads: ContactLead[];
  activities: ContactActivity[];
  notes: ContactNote[];
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refresh: () => void;
  goBack: () => void;
  updateContact: (updates: Partial<Contact>) => Contact | null;
  addNote: (content: string, createdBy?: string) => ContactNote | null;
  pinActivity: (activityId: string, pinned?: boolean) => void;
};