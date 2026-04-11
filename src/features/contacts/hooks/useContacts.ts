// src/hooks/useContacts.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export type ContactStatus = "active" | "inactive" | "customer" | "lead" | "new";

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

export type ContactSortKey =
  | "name"
  | "company"
  | "status"
  | "source"
  | "owner"
  | "updatedAt"
  | "createdAt";

export type ContactSortDirection = "asc" | "desc";

export type ContactFilters = {
  search: string;
  status: string;
  source: string;
  owner: string;
  sortBy: ContactSortKey;
  sortDirection: ContactSortDirection;
};

type CreateContactInput = {
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

type UpdateContactInput = Partial<CreateContactInput>;

type UseContactsResult = {
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
  updateContact: (contactId: string, updates: UpdateContactInput) => Contact | null;
  deleteContact: (contactId: string) => void;
  deleteSelectedContacts: () => void;
  toggleSelect: (contactId: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  openContactDetail: (contactId: string) => void;
};

const CONTACTS_STORAGE_KEY = "mei-crm-contacts";
const CONTACT_FILTERS_STORAGE_KEY = "mei-crm-contact-filters";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS: ContactFilters = {
  search: "",
  status: "",
  source: "",
  owner: "",
  sortBy: "updatedAt",
  sortDirection: "desc",
};

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readStorageArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  return safeJsonParse<T[]>(window.localStorage.getItem(key), []);
}

function writeStorageArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function mapContact(raw: unknown): Contact | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);

  if (!id) return null;

  const rawAddress =
    item.address && typeof item.address === "object"
      ? (item.address as Record<string, unknown>)
      : null;

  return {
    id,
    name: normalizeString(item.name) || "Unnamed Contact",
    email: normalizeString(item.email) || undefined,
    phone: normalizeString(item.phone) || undefined,
    alternatePhone:
      normalizeString(item.alternatePhone) ||
      normalizeString(item.altPhone) ||
      undefined,
    company: normalizeString(item.company) || undefined,
    designation:
      normalizeString(item.designation) ||
      normalizeString(item.jobTitle) ||
      undefined,
    source: normalizeString(item.source) || undefined,
    owner:
      normalizeString(item.owner) ||
      normalizeString(item.assignedTo) ||
      undefined,
    status: normalizeString(item.status) || "active",
    tags: Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    address: rawAddress
      ? {
          line1: normalizeString(rawAddress.line1) || undefined,
          line2: normalizeString(rawAddress.line2) || undefined,
          city: normalizeString(rawAddress.city) || undefined,
          state: normalizeString(rawAddress.state) || undefined,
          country: normalizeString(rawAddress.country) || undefined,
          pincode: normalizeString(rawAddress.pincode) || undefined,
        }
      : undefined,
    notes: normalizeString(item.notes) || undefined,
    createdAt: normalizeString(item.createdAt) || undefined,
    updatedAt: normalizeString(item.updatedAt) || undefined,
    avatarUrl: normalizeString(item.avatarUrl) || undefined,
    lastContactedAt: normalizeString(item.lastContactedAt) || undefined,
    totalDeals:
      typeof item.totalDeals === "number" ? item.totalDeals : undefined,
    totalDealValue:
      typeof item.totalDealValue === "number" ? item.totalDealValue : undefined,
    totalLeads:
      typeof item.totalLeads === "number" ? item.totalLeads : undefined,
  };
}

function serializeFilters(filters: ContactFilters): string {
  return new URLSearchParams({
    search: filters.search,
    status: filters.status,
    source: filters.source,
    owner: filters.owner,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  }).toString();
}

function getFiltersFromSearchParams(
  searchParams: URLSearchParams
): ContactFilters {
  const sortByParam = searchParams.get("sortBy");
  const sortDirectionParam = searchParams.get("sortDirection");

  const sortBy: ContactSortKey =
    sortByParam === "name" ||
    sortByParam === "company" ||
    sortByParam === "status" ||
    sortByParam === "source" ||
    sortByParam === "owner" ||
    sortByParam === "updatedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : DEFAULT_FILTERS.sortBy;

  const sortDirection: ContactSortDirection =
    sortDirectionParam === "asc" || sortDirectionParam === "desc"
      ? sortDirectionParam
      : DEFAULT_FILTERS.sortDirection;

  return {
    search: searchParams.get("search") ?? DEFAULT_FILTERS.search,
    status: searchParams.get("status") ?? DEFAULT_FILTERS.status,
    source: searchParams.get("source") ?? DEFAULT_FILTERS.source,
    owner: searchParams.get("owner") ?? DEFAULT_FILTERS.owner,
    sortBy,
    sortDirection,
  };
}

function matchesSearch(contact: Contact, query: string): boolean {
  if (!query.trim()) return true;

  const q = query.trim().toLowerCase();

  return [
    contact.name,
    contact.email,
    contact.phone,
    contact.alternatePhone,
    contact.company,
    contact.designation,
    contact.source,
    contact.owner,
    contact.status,
    ...(contact.tags ?? []),
    contact.address?.city,
    contact.address?.state,
    contact.address?.country,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(q));
}

function compareContacts(
  a: Contact,
  b: Contact,
  sortBy: ContactSortKey,
  sortDirection: ContactSortDirection
): number {
  let result = 0;

  switch (sortBy) {
    case "name":
      result = a.name.localeCompare(b.name);
      break;
    case "company":
      result = (a.company ?? "").localeCompare(b.company ?? "");
      break;
    case "status":
      result = (a.status ?? "").localeCompare(b.status ?? "");
      break;
    case "source":
      result = (a.source ?? "").localeCompare(b.source ?? "");
      break;
    case "owner":
      result = (a.owner ?? "").localeCompare(b.owner ?? "");
      break;
    case "createdAt":
      result = toTimestamp(a.createdAt) - toTimestamp(b.createdAt);
      break;
    case "updatedAt":
    default:
      result = toTimestamp(a.updatedAt) - toTimestamp(b.updatedAt);
      break;
  }

  return sortDirection === "asc" ? result : -result;
}

export default function useContacts(): UseContactsResult {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFiltersState] = useState<ContactFilters>(() => {
    const fromUrl = getFiltersFromSearchParams(searchParams);
    const hasAnyUrlFilter = Array.from(searchParams.keys()).length > 0;

    if (hasAnyUrlFilter) return fromUrl;

    if (typeof window !== "undefined") {
      const saved = safeJsonParse<Partial<ContactFilters>>(
        window.localStorage.getItem(CONTACT_FILTERS_STORAGE_KEY),
        {}
      );

      return {
        ...DEFAULT_FILTERS,
        ...saved,
      };
    }

    return DEFAULT_FILTERS;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const rawContacts = readStorageArray<unknown>(CONTACTS_STORAGE_KEY);
      const mappedContacts = rawContacts
        .map(mapContact)
        .filter((item): item is Contact => Boolean(item));

      setContacts(mappedContacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      CONTACT_FILTERS_STORAGE_KEY,
      JSON.stringify(filters)
    );
    setSearchParams(serializeFilters(filters), { replace: true });
  }, [filters, setSearchParams]);

  const filteredContacts = useMemo(() => {
    const next = contacts
      .filter((contact) => matchesSearch(contact, filters.search))
      .filter((contact) =>
        filters.status ? (contact.status ?? "") === filters.status : true
      )
      .filter((contact) =>
        filters.source ? (contact.source ?? "") === filters.source : true
      )
      .filter((contact) =>
        filters.owner ? (contact.owner ?? "") === filters.owner : true
      )
      .sort((a, b) =>
        compareContacts(a, b, filters.sortBy, filters.sortDirection)
      );

    return next;
  }, [contacts, filters]);

  const totalCount = filteredContacts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPageState(1);
  }, [
    filters.search,
    filters.status,
    filters.source,
    filters.owner,
    filters.sortBy,
    filters.sortDirection,
    pageSize,
  ]);

  const paginatedContacts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredContacts.slice(startIndex, startIndex + pageSize);
  }, [filteredContacts, page, pageSize]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => contacts.some((contact) => contact.id === id))
    );
  }, [contacts]);

  const sourceOptions = useMemo(
    () => uniqueSorted(contacts.map((contact) => contact.source ?? "")),
    [contacts]
  );

  const ownerOptions = useMemo(
    () => uniqueSorted(contacts.map((contact) => contact.owner ?? "")),
    [contacts]
  );

  const statusOptions = useMemo(
    () => uniqueSorted(contacts.map((contact) => contact.status ?? "")),
    [contacts]
  );

  const setFilters = useCallback((updates: Partial<ContactFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const persistContacts = useCallback((nextContacts: Contact[]) => {
    writeStorageArray(CONTACTS_STORAGE_KEY, nextContacts);
    setContacts(nextContacts);
  }, []);

  const createContact = useCallback(
    (input: CreateContactInput): Contact => {
      const now = new Date().toISOString();

      const nextContact: Contact = {
        id: createId("contact"),
        name: input.name.trim() || "Unnamed Contact",
        email: input.email?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
        alternatePhone: input.alternatePhone?.trim() || undefined,
        company: input.company?.trim() || undefined,
        designation: input.designation?.trim() || undefined,
        source: input.source?.trim() || undefined,
        owner: input.owner?.trim() || undefined,
        status: input.status?.trim() || "active",
        tags: input.tags?.filter(Boolean) ?? [],
        address: input.address,
        notes: input.notes?.trim() || undefined,
        avatarUrl: input.avatarUrl?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
        lastContactedAt: undefined,
        totalDeals: 0,
        totalDealValue: 0,
        totalLeads: 0,
      };

      const nextContacts = [nextContact, ...contacts];
      persistContacts(nextContacts);

      return nextContact;
    },
    [contacts, persistContacts]
  );

  const updateContact = useCallback(
    (contactId: string, updates: UpdateContactInput): Contact | null => {
      let updatedContact: Contact | null = null;

      const nextContacts = contacts.map((contact) => {
        if (contact.id !== contactId) return contact;

        updatedContact = {
          ...contact,
          ...updates,
          name: updates.name?.trim() || contact.name,
          email:
            updates.email !== undefined
              ? updates.email.trim() || undefined
              : contact.email,
          phone:
            updates.phone !== undefined
              ? updates.phone.trim() || undefined
              : contact.phone,
          alternatePhone:
            updates.alternatePhone !== undefined
              ? updates.alternatePhone.trim() || undefined
              : contact.alternatePhone,
          company:
            updates.company !== undefined
              ? updates.company.trim() || undefined
              : contact.company,
          designation:
            updates.designation !== undefined
              ? updates.designation.trim() || undefined
              : contact.designation,
          source:
            updates.source !== undefined
              ? updates.source.trim() || undefined
              : contact.source,
          owner:
            updates.owner !== undefined
              ? updates.owner.trim() || undefined
              : contact.owner,
          status:
            updates.status !== undefined
              ? updates.status.trim() || "active"
              : contact.status,
          notes:
            updates.notes !== undefined
              ? updates.notes.trim() || undefined
              : contact.notes,
          avatarUrl:
            updates.avatarUrl !== undefined
              ? updates.avatarUrl.trim() || undefined
              : contact.avatarUrl,
          tags: updates.tags !== undefined ? updates.tags.filter(Boolean) : contact.tags,
          address: updates.address !== undefined ? updates.address : contact.address,
          updatedAt: new Date().toISOString(),
        };

        return updatedContact;
      });

      if (!updatedContact) return null;

      persistContacts(nextContacts);
      return updatedContact;
    },
    [contacts, persistContacts]
  );

  const deleteContact = useCallback(
    (contactId: string) => {
      const nextContacts = contacts.filter((contact) => contact.id !== contactId);
      persistContacts(nextContacts);
      setSelectedIds((prev) => prev.filter((id) => id !== contactId));
    },
    [contacts, persistContacts]
  );

  const deleteSelectedContacts = useCallback(() => {
    if (selectedIds.length === 0) return;

    const selectedSet = new Set(selectedIds);
    const nextContacts = contacts.filter((contact) => !selectedSet.has(contact.id));

    persistContacts(nextContacts);
    setSelectedIds([]);
  }, [contacts, persistContacts, selectedIds]);

  const toggleSelect = useCallback((contactId: string) => {
    setSelectedIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  }, []);

  const allVisibleSelected = useMemo(() => {
    if (paginatedContacts.length === 0) return false;
    return paginatedContacts.every((contact) => selectedIds.includes(contact.id));
  }, [paginatedContacts, selectedIds]);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = paginatedContacts.map((contact) => contact.id);

    if (visibleIds.length === 0) return;

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const everySelected = visibleIds.every((id) => prevSet.has(id));

      if (everySelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleIds]));
    });
  }, [paginatedContacts]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const openContactDetail = useCallback(
    (contactId: string) => {
      navigate(`/contacts/${contactId}`, {
        state: {
          from: "/contacts",
          search: `?${serializeFilters(filters)}`,
        },
      });
    },
    [filters, navigate]
  );

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(Math.max(1, nextPageSize));
  }, []);

  return {
    contacts,
    filteredContacts,
    paginatedContacts,
    loading,
    error,
    filters,
    selectedIds,
    page,
    pageSize,
    totalPages,
    totalCount,
    hasSelection: selectedIds.length > 0,
    allVisibleSelected,
    sourceOptions,
    ownerOptions,
    statusOptions,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    refresh,
    createContact,
    updateContact,
    deleteContact,
    deleteSelectedContacts,
    toggleSelect,
    toggleSelectAllVisible,
    clearSelection,
    openContactDetail,
  };
}