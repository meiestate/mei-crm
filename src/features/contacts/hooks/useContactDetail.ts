// src/hooks/useContactDetail.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export type ContactStatus = "active" | "inactive" | "customer" | "lead" | "new";

export type ContactActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "task"
  | "whatsapp"
  | "system";

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

export type ContactDeal = {
  id: string;
  title: string;
  value?: number;
  stage?: string;
  status?: string;
  updatedAt?: string;
};

export type ContactLead = {
  id: string;
  name: string;
  status?: string;
  source?: string;
  updatedAt?: string;
};

export type ContactNote = {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
};

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

type UseContactDetailResult = {
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

const CONTACTS_STORAGE_KEY = "mei-crm-contacts";
const DEALS_STORAGE_KEY = "mei-crm-deals";
const LEADS_STORAGE_KEY = "mei-crm-leads";
const CONTACT_ACTIVITIES_STORAGE_KEY = "mei-crm-contact-activities";
const CONTACT_NOTES_STORAGE_KEY = "mei-crm-contact-notes";
const CONTACT_FILTERS_STORAGE_KEY = "mei-crm-contact-filters";

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

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function matchesContactId(item: unknown, contactId: string): boolean {
  if (!item || typeof item !== "object") return false;

  const record = item as Record<string, unknown>;

  return (
    normalizeString(record.contactId) === contactId ||
    normalizeString(record.contactID) === contactId ||
    normalizeString(record.contact_id) === contactId
  );
}

function matchesRelatedEntity(item: unknown, contactId: string): boolean {
  if (!item || typeof item !== "object") return false;

  const record = item as Record<string, unknown>;

  return (
    normalizeString(record.contactId) === contactId ||
    normalizeString(record.contactID) === contactId ||
    normalizeString(record.contact_id) === contactId ||
    normalizeString(record.relatedContactId) === contactId ||
    normalizeString(record.related_contact_id) === contactId
  );
}

function mapContact(raw: unknown): Contact | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);

  if (!id) return null;

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
    address:
      item.address && typeof item.address === "object"
        ? {
            line1: normalizeString((item.address as Record<string, unknown>).line1),
            line2: normalizeString((item.address as Record<string, unknown>).line2),
            city: normalizeString((item.address as Record<string, unknown>).city),
            state: normalizeString((item.address as Record<string, unknown>).state),
            country: normalizeString(
              (item.address as Record<string, unknown>).country
            ),
            pincode: normalizeString(
              (item.address as Record<string, unknown>).pincode
            ),
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

function mapDeal(raw: unknown): ContactDeal | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    title:
      normalizeString(item.title) ||
      normalizeString(item.name) ||
      "Untitled Deal",
    value: typeof item.value === "number" ? item.value : undefined,
    stage: normalizeString(item.stage) || undefined,
    status: normalizeString(item.status) || undefined,
    updatedAt: normalizeString(item.updatedAt) || undefined,
  };
}

function mapLead(raw: unknown): ContactLead | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    name: normalizeString(item.name) || "Untitled Lead",
    status: normalizeString(item.status) || undefined,
    source: normalizeString(item.source) || undefined,
    updatedAt: normalizeString(item.updatedAt) || undefined,
  };
}

function mapActivity(raw: unknown, contactId: string): ContactActivity | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    contactId,
    type:
      (normalizeString(item.type) as ContactActivityType) || "system",
    title: normalizeString(item.title) || "Activity",
    description:
      normalizeString(item.description) ||
      normalizeString(item.note) ||
      undefined,
    createdAt: normalizeString(item.createdAt) || new Date().toISOString(),
    createdBy: normalizeString(item.createdBy) || undefined,
    pinned: Boolean(item.pinned),
  };
}

function mapNote(raw: unknown, contactId: string): ContactNote | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const id = normalizeString(item.id);
  if (!id) return null;

  return {
    id,
    contactId,
    content:
      normalizeString(item.content) ||
      normalizeString(item.note) ||
      normalizeString(item.text),
    createdAt: normalizeString(item.createdAt) || new Date().toISOString(),
    updatedAt: normalizeString(item.updatedAt) || undefined,
    createdBy: normalizeString(item.createdBy) || undefined,
  };
}

export default function useContactDetail(): UseContactDetailResult {
  const { contactId = "" } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [contact, setContact] = useState<Contact | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<ContactDeal[]>([]);
  const [relatedLeads, setRelatedLeads] = useState<ContactLead[]>([]);
  const [activities, setActivities] = useState<ContactActivity[]>([]);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const contactsRaw = readStorageArray<unknown>(CONTACTS_STORAGE_KEY);
      const dealsRaw = readStorageArray<unknown>(DEALS_STORAGE_KEY);
      const leadsRaw = readStorageArray<unknown>(LEADS_STORAGE_KEY);
      const activitiesRaw = readStorageArray<unknown>(
        CONTACT_ACTIVITIES_STORAGE_KEY
      );
      const notesRaw = readStorageArray<unknown>(CONTACT_NOTES_STORAGE_KEY);

      const currentContact =
        contactsRaw
          .map(mapContact)
          .filter((item): item is Contact => Boolean(item))
          .find((item) => item.id === contactId) ?? null;

      const currentDeals = dealsRaw
        .filter((item) => matchesRelatedEntity(item, contactId))
        .map(mapDeal)
        .filter((item): item is ContactDeal => Boolean(item))
        .sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });

      const currentLeads = leadsRaw
        .filter((item) => matchesRelatedEntity(item, contactId))
        .map(mapLead)
        .filter((item): item is ContactLead => Boolean(item))
        .sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });

      const currentActivities = activitiesRaw
        .filter((item) => matchesContactId(item, contactId))
        .map((item) => mapActivity(item, contactId))
        .filter((item): item is ContactActivity => Boolean(item))
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      const currentNotes = notesRaw
        .filter((item) => matchesContactId(item, contactId))
        .map((item) => mapNote(item, contactId))
        .filter((item): item is ContactNote => Boolean(item))
        .sort(
          (a, b) =>
            new Date(b.updatedAt ?? b.createdAt).getTime() -
            new Date(a.updatedAt ?? a.createdAt).getTime()
        );

      setContact(currentContact);
      setRelatedDeals(currentDeals);
      setRelatedLeads(currentLeads);
      setActivities(currentActivities);
      setNotes(currentNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact.");
      setContact(null);
      setRelatedDeals([]);
      setRelatedLeads([]);
      setActivities([]);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const goBack = useCallback(() => {
    const state = location.state as
      | {
          from?: string;
          search?: string;
        }
      | undefined;

    if (state?.from) {
      navigate(`${state.from}${state.search ?? ""}`);
      return;
    }

    const savedFilters =
      typeof window !== "undefined"
        ? window.localStorage.getItem(CONTACT_FILTERS_STORAGE_KEY)
        : null;

    navigate(savedFilters ? `/contacts?${savedFilters}` : "/contacts");
  }, [location.state, navigate]);

  const updateContact = useCallback(
    (updates: Partial<Contact>) => {
      const contacts = readStorageArray<unknown>(CONTACTS_STORAGE_KEY);

      let updatedContact: Contact | null = null;

      const nextContacts = contacts.map((raw) => {
        const item = mapContact(raw);
        if (!item || item.id !== contactId) return raw;

        updatedContact = {
          ...item,
          ...updates,
          id: item.id,
          updatedAt: new Date().toISOString(),
        };

        return updatedContact;
      });

      if (!updatedContact) return null;

      writeStorageArray(CONTACTS_STORAGE_KEY, nextContacts);
      setContact(updatedContact);

      return updatedContact;
    },
    [contactId]
  );

  const addNote = useCallback(
    (content: string, createdBy?: string) => {
      const cleanContent = content.trim();
      if (!cleanContent) return null;

      const note: ContactNote = {
        id: createId("contact-note"),
        contactId,
        content: cleanContent,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      const activity: ContactActivity = {
        id: createId("contact-activity"),
        contactId,
        type: "note",
        title: "Note added",
        description: cleanContent,
        createdAt: note.createdAt,
        createdBy,
        pinned: false,
      };

      const currentNotes = readStorageArray<ContactNote>(CONTACT_NOTES_STORAGE_KEY);
      const currentActivities = readStorageArray<ContactActivity>(
        CONTACT_ACTIVITIES_STORAGE_KEY
      );

      const nextNotes = [note, ...currentNotes];
      const nextActivities = [activity, ...currentActivities];

      writeStorageArray(CONTACT_NOTES_STORAGE_KEY, nextNotes);
      writeStorageArray(CONTACT_ACTIVITIES_STORAGE_KEY, nextActivities);

      setNotes((prev) => [note, ...prev]);
      setActivities((prev) =>
        [activity, ...prev].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
      );

      updateContact({
        lastContactedAt: note.createdAt,
      });

      return note;
    },
    [contactId, updateContact]
  );

  const pinActivity = useCallback(
    (activityId: string, pinned = true) => {
      const currentActivities = readStorageArray<ContactActivity>(
        CONTACT_ACTIVITIES_STORAGE_KEY
      );

      const nextActivities = currentActivities.map((item) => {
        if (item.id !== activityId) return item;
        return { ...item, pinned };
      });

      writeStorageArray(CONTACT_ACTIVITIES_STORAGE_KEY, nextActivities);

      setActivities((prev) =>
        prev
          .map((item) =>
            item.id === activityId ? { ...item, pinned } : item
          )
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
      );
    },
    []
  );

  const notFound = useMemo(() => !loading && !contact, [loading, contact]);

  return {
    contactId,
    contact,
    relatedDeals,
    relatedLeads,
    activities,
    notes,
    loading,
    error,
    notFound,
    refresh,
    goBack,
    updateContact,
    addNote,
    pinActivity,
  };
}