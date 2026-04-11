import type { ApiResponse } from "../../auth/types/auth.types";

export type ContactStatus = "active" | "inactive" | "blocked" | "archived";

export type ContactSource =
  | "website"
  | "referral"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "call"
  | "manual"
  | "other";

export type ContactAddress = {
  line1?: string;
  line2?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type ContactSocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type Contact = {
  id: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags?: string[];
  source?: ContactSource;
  status: ContactStatus;
  ownerId?: string;
  ownerName?: string;
  address?: ContactAddress;
  socialLinks?: ContactSocialLinks;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContactStatus | "all";
  source?: ContactSource | "all";
  ownerId?: string;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "fullName"
    | "firstName"
    | "company"
    | "status";
  sortOrder?: "asc" | "desc";
};

export type ContactsListResponse = {
  items: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ContactDetailResponse = {
  contact: Contact;
};

export type CreateContactPayload = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags?: string[];
  source?: ContactSource;
  status?: ContactStatus;
  ownerId?: string;
  ownerName?: string;
  address?: ContactAddress;
  socialLinks?: ContactSocialLinks;
};

export type UpdateContactPayload = Partial<CreateContactPayload>;

export type DeleteContactResponse = {
  deleted: boolean;
  id: string;
};

export type BulkDeleteContactsPayload = {
  ids: string[];
};

export type BulkDeleteContactsResponse = {
  deleted: boolean;
  ids: string[];
};

const CONTACTS_API_BASE_URL =
  (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

const CONTACTS_API_PREFIX = "/contacts";

class ContactsApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      errors?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = "ContactsApiError";
    this.statusCode = options?.statusCode;
    this.errors = options?.errors;
  }
}

function buildContactsUrl(path = ""): string {
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";

  return `${CONTACTS_API_BASE_URL}${CONTACTS_API_PREFIX}${normalizedPath}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeContactStatus(value: unknown): ContactStatus {
  if (
    value === "active" ||
    value === "inactive" ||
    value === "blocked" ||
    value === "archived"
  ) {
    return value;
  }

  return "active";
}

function normalizeContactSource(value: unknown): ContactSource | undefined {
  if (
    value === "website" ||
    value === "referral" ||
    value === "facebook" ||
    value === "instagram" ||
    value === "whatsapp" ||
    value === "call" ||
    value === "manual" ||
    value === "other"
  ) {
    return value;
  }

  return undefined;
}

function normalizeAddress(value: unknown): ContactAddress | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  return {
    line1: typeof value.line1 === "string" ? value.line1 : undefined,
    line2: typeof value.line2 === "string" ? value.line2 : undefined,
    area: typeof value.area === "string" ? value.area : undefined,
    city: typeof value.city === "string" ? value.city : undefined,
    state: typeof value.state === "string" ? value.state : undefined,
    country: typeof value.country === "string" ? value.country : undefined,
    postalCode: typeof value.postalCode === "string" ? value.postalCode : undefined,
  };
}

function normalizeSocialLinks(value: unknown): ContactSocialLinks | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  return {
    facebook: typeof value.facebook === "string" ? value.facebook : undefined,
    instagram: typeof value.instagram === "string" ? value.instagram : undefined,
    linkedin: typeof value.linkedin === "string" ? value.linkedin : undefined,
    twitter: typeof value.twitter === "string" ? value.twitter : undefined,
    website: typeof value.website === "string" ? value.website : undefined,
  };
}

function buildFullName(firstName: string, lastName?: string): string {
  return `${firstName}${lastName ? ` ${lastName}` : ""}`.trim();
}

function normalizeContact(input: unknown): Contact {
  if (!isObject(input)) {
    throw new ContactsApiError("Invalid contact data received from server.");
  }

  const firstName =
    typeof input.firstName === "string"
      ? input.firstName
      : typeof input.name === "string"
        ? input.name
        : "Contact";

  const lastName =
    typeof input.lastName === "string" ? input.lastName : undefined;

  const fullName =
    typeof input.fullName === "string"
      ? input.fullName
      : buildFullName(firstName, lastName);

  return {
    id: String(input.id ?? ""),
    firstName,
    lastName,
    fullName,
    email: typeof input.email === "string" ? input.email : undefined,
    phone: typeof input.phone === "string" ? input.phone : undefined,
    alternatePhone:
      typeof input.alternatePhone === "string"
        ? input.alternatePhone
        : typeof input.alternate_phone === "string"
          ? input.alternate_phone
          : undefined,
    company: typeof input.company === "string" ? input.company : undefined,
    jobTitle:
      typeof input.jobTitle === "string"
        ? input.jobTitle
        : typeof input.job_title === "string"
          ? input.job_title
          : undefined,
    notes: typeof input.notes === "string" ? input.notes : undefined,
    tags: isStringArray(input.tags) ? input.tags : undefined,
    source: normalizeContactSource(input.source),
    status: normalizeContactStatus(input.status),
    ownerId:
      typeof input.ownerId === "string"
        ? input.ownerId
        : typeof input.owner_id === "string"
          ? input.owner_id
          : undefined,
    ownerName:
      typeof input.ownerName === "string"
        ? input.ownerName
        : typeof input.owner_name === "string"
          ? input.owner_name
          : undefined,
    address: normalizeAddress(input.address),
    socialLinks: normalizeSocialLinks(input.socialLinks ?? input.social_links),
    createdAt:
      typeof input.createdAt === "string"
        ? input.createdAt
        : typeof input.created_at === "string"
          ? input.created_at
          : undefined,
    updatedAt:
      typeof input.updatedAt === "string"
        ? input.updatedAt
        : typeof input.updated_at === "string"
          ? input.updated_at
          : undefined,
  };
}

async function parseApiResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      isObject(body) && typeof body.message === "string"
        ? body.message
        : "Request failed. Please try again.";

    const errors =
      isObject(body) && isObject(body.errors)
        ? (body.errors as Record<string, string[]>)
        : undefined;

    return {
      success: false,
      message,
      errors,
      statusCode: response.status,
    };
  }

  if (isObject(body) && "success" in body) {
    return body as ApiResponse<T>;
  }

  return {
    success: true,
    data: body as T,
  };
}

async function request<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    accessToken?: string;
    signal?: AbortSignal;
    query?: Record<string, string | number | boolean | undefined>;
  },
): Promise<T> {
  const queryString = options?.query
    ? new URLSearchParams(
        Object.entries(options.query)
          .filter(([, value]) => value !== undefined && value !== "")
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";

  const url = `${buildContactsUrl(path)}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
    },
    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  const parsed = await parseApiResponse<T>(response);

  if (!parsed.success) {
    throw new ContactsApiError(parsed.message, {
      statusCode: parsed.statusCode,
      errors: parsed.errors,
    });
  }

  return parsed.data;
}

function normalizeContactsListResponse(input: unknown): ContactsListResponse {
  if (!isObject(input)) {
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }

  const rawItems = Array.isArray(input.items)
    ? input.items
    : Array.isArray(input.contacts)
      ? input.contacts
      : Array.isArray(input.data)
        ? input.data
        : [];

  const items = rawItems.map(normalizeContact);

  const total =
    typeof input.total === "number"
      ? input.total
      : typeof input.count === "number"
        ? input.count
        : items.length;

  const page = typeof input.page === "number" ? input.page : 1;
  const limit = typeof input.limit === "number" ? input.limit : items.length || 10;
  const totalPages =
    typeof input.totalPages === "number"
      ? input.totalPages
      : limit > 0
        ? Math.ceil(total / limit)
        : 0;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

function normalizeContactDetailResponse(input: unknown): ContactDetailResponse {
  if (!isObject(input)) {
    throw new ContactsApiError("Invalid contact detail response.");
  }

  return {
    contact: normalizeContact(input.contact ?? input.data ?? input),
  };
}

export async function getContactsApi(
  params?: ContactsListParams,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<ContactsListResponse> {
  const data = await request<unknown>("", {
    method: "GET",
    accessToken,
    signal,
    query: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      status:
        params?.status && params.status !== "all" ? params.status : undefined,
      source:
        params?.source && params.source !== "all" ? params.source : undefined,
      ownerId: params?.ownerId,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    },
  });

  return normalizeContactsListResponse(data);
}

export async function getContactByIdApi(
  id: string,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<ContactDetailResponse> {
  const data = await request<unknown>(`/${id}`, {
    method: "GET",
    accessToken,
    signal,
  });

  return normalizeContactDetailResponse(data);
}

export async function createContactApi(
  payload: CreateContactPayload,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<ContactDetailResponse> {
  const data = await request<unknown>("", {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  });

  return normalizeContactDetailResponse(data);
}

export async function updateContactApi(
  id: string,
  payload: UpdateContactPayload,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<ContactDetailResponse> {
  const data = await request<unknown>(`/${id}`, {
    method: "PATCH",
    body: payload,
    accessToken,
    signal,
  });

  return normalizeContactDetailResponse(data);
}

export async function deleteContactApi(
  id: string,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<DeleteContactResponse> {
  const data = await request<unknown>(`/${id}`, {
    method: "DELETE",
    accessToken,
    signal,
  });

  if (!isObject(data)) {
    return {
      deleted: true,
      id,
    };
  }

  return {
    deleted:
      typeof data.deleted === "boolean" ? data.deleted : true,
    id: typeof data.id === "string" ? data.id : id,
  };
}

export async function bulkDeleteContactsApi(
  payload: BulkDeleteContactsPayload,
  accessToken?: string,
  signal?: AbortSignal,
): Promise<BulkDeleteContactsResponse> {
  const data = await request<unknown>("/bulk-delete", {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  });

  if (!isObject(data)) {
    return {
      deleted: true,
      ids: payload.ids,
    };
  }

  return {
    deleted:
      typeof data.deleted === "boolean" ? data.deleted : true,
    ids: isStringArray(data.ids) ? data.ids : payload.ids,
  };
}

export { ContactsApiError };