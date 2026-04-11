// src/services/mockServer.ts

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type MockRequestQuery = Record<
  string,
  string | number | boolean | undefined
>;

type MockRequest = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: MockRequestQuery;
};

type MockResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
};

type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TeamUser = BaseEntity & {
  workspaceId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
};

type AuditLog = BaseEntity & {
  workspaceId: string;
  action: string;
  entityType: string;
  message: string;
};

type EmailMessage = BaseEntity & {
  workspaceId: string;
  subject: string;
  body: string;
  fromEmail: string;
  to: string[];
  status: string;
};

type MockCollectionItem = TeamUser | AuditLog | EmailMessage;

type MockDb = {
  users: TeamUser[];
  teamUsers: TeamUser[];
  auditLogs: AuditLog[];
  emails: EmailMessage[];
};

type MockCollectionKey = keyof MockDb;

const MOCK_DB_STORAGE_KEY = "mei-crm-mock-db";
const MOCK_SERVER_ENABLED_KEY = "mei-crm-mock-server-enabled";
const DEFAULT_LATENCY = 250;

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function delay(ms = DEFAULT_LATENCY): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function createBaseEntity(idPrefix: string): BaseEntity {
  const now = nowIso();

  return {
    id: createId(idPrefix),
    createdAt: now,
    updatedAt: now,
  };
}

function createDefaultDb(): MockDb {
  const user1: TeamUser = {
    ...createBaseEntity("user"),
    workspaceId: "ws_001",
    fullName: "Balraj",
    email: "balraj@mei.com",
    role: "admin",
    status: "active",
  };

  const user2: TeamUser = {
    ...createBaseEntity("user"),
    workspaceId: "ws_001",
    fullName: "Arun Kumar",
    email: "arun@mei.com",
    role: "manager",
    status: "active",
  };

  const audit1: AuditLog = {
    ...createBaseEntity("audit"),
    workspaceId: "ws_001",
    action: "create",
    entityType: "user",
    message: "Initial admin user created",
  };

  const email1: EmailMessage = {
    ...createBaseEntity("email"),
    workspaceId: "ws_001",
    subject: "Welcome to MEI CRM",
    body: "Your workspace is ready.",
    fromEmail: "noreply@mei.com",
    to: ["balraj@mei.com"],
    status: "sent",
  };

  return {
    users: [user1, user2],
    teamUsers: [user1, user2],
    auditLogs: [audit1],
    emails: [email1],
  };
}

function getDb(): MockDb {
  const storage = getStorage();

  if (!storage) {
    return createDefaultDb();
  }

  const parsed = safeParse<MockDb>(
    storage.getItem(MOCK_DB_STORAGE_KEY),
    createDefaultDb()
  );

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    teamUsers: Array.isArray(parsed.teamUsers) ? parsed.teamUsers : [],
    auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
    emails: Array.isArray(parsed.emails) ? parsed.emails : [],
  };
}

function setDb(db: MockDb): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(db));
}

function getCollectionKey(path: string): MockCollectionKey | null {
  if (path.startsWith("/users")) return "users";
  if (path.startsWith("/team-users")) return "teamUsers";
  if (path.startsWith("/audit-logs")) return "auditLogs";
  if (path.startsWith("/emails")) return "emails";
  return null;
}

function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function getEntityIdFromPath(path: string): string | null {
  const segments = getPathSegments(path);

  if (segments.length >= 2) {
    return segments[1] ?? null;
  }

  return null;
}

function buildListResponse<T>(
  items: T[],
  page = 1,
  pageSize = 10
): MockResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> {
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;
  const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

  return {
    success: true,
    data: {
      items: paginatedItems,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
}

function buildSuccess<T>(data: T, message?: string): MockResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

function buildError(message: string, statusCode = 400): MockResponse {
  return {
    success: false,
    message,
    statusCode,
  };
}

function createRecord(
  collection: MockCollectionKey,
  body: Record<string, unknown>
): MockCollectionItem {
  switch (collection) {
    case "users":
    case "teamUsers":
      return {
        ...createBaseEntity("user"),
        workspaceId: normalizeText(body.workspaceId) || "ws_001",
        fullName: normalizeText(body.fullName),
        email: normalizeText(body.email),
        role: normalizeText(body.role) || "agent",
        status: normalizeText(body.status) || "active",
      };

    case "auditLogs":
      return {
        ...createBaseEntity("audit"),
        workspaceId: normalizeText(body.workspaceId) || "ws_001",
        action: normalizeText(body.action) || "other",
        entityType: normalizeText(body.entityType) || "other",
        message: normalizeText(body.message),
      };

    case "emails":
      return {
        ...createBaseEntity("email"),
        workspaceId: normalizeText(body.workspaceId) || "ws_001",
        subject: normalizeText(body.subject),
        body: normalizeText(body.body),
        fromEmail: normalizeText(body.fromEmail),
        to: Array.isArray(body.to)
          ? body.to.filter((item): item is string => typeof item === "string")
          : [],
        status: normalizeText(body.status) || "draft",
      };
  }
}

function updateRecord<T extends BaseEntity>(
  existing: T,
  updates: Record<string, unknown>
): T {
  return {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: nowIso(),
  };
}

function filterItems(
  items: MockCollectionItem[],
  query?: MockRequestQuery
): MockCollectionItem[] {
  if (!query) {
    return items;
  }

  const search = normalizeText(query.search).toLowerCase();
  const workspaceId = normalizeText(query.workspaceId);

  return items.filter((item) => {
    if (workspaceId && String(item.workspaceId ?? "") !== workspaceId) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = Object.values(item)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

export function isMockServerEnabled(): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(MOCK_SERVER_ENABLED_KEY) === "true";
}

export function enableMockServer(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(MOCK_SERVER_ENABLED_KEY, "true");

  if (!storage.getItem(MOCK_DB_STORAGE_KEY)) {
    setDb(createDefaultDb());
  }
}

export function disableMockServer(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(MOCK_SERVER_ENABLED_KEY, "false");
}

export function resetMockServer(): void {
  setDb(createDefaultDb());
}

export function getMockDbSnapshot(): MockDb {
  return getDb();
}

export async function handleMockRequest(
  request: MockRequest
): Promise<MockResponse> {
  await delay();

  const db = getDb();
  const collectionKey = getCollectionKey(request.path);

  if (!collectionKey) {
    return buildError(`Unknown mock route: ${request.path}`, 404);
  }

  const entityId = getEntityIdFromPath(request.path);
  const query = request.query;
  const body =
    request.body && typeof request.body === "object"
      ? (request.body as Record<string, unknown>)
      : {};

  const collection = db[collectionKey] as MockCollectionItem[];

  if (request.method === "GET") {
    if (entityId) {
      const item = collection.find((record) => record.id === entityId) ?? null;

      if (!item) {
        return buildError("Record not found.", 404);
      }

      return buildSuccess(item);
    }

    const page =
      typeof query?.page === "number"
        ? query.page
        : Number(query?.page ?? 1);

    const pageSize =
      typeof query?.pageSize === "number"
        ? query.pageSize
        : Number(query?.pageSize ?? 10);

    const filtered = filterItems(collection, query);
    return buildListResponse(filtered, page, pageSize);
  }

  if (request.method === "POST") {
    const created = createRecord(collectionKey, body);
    const nextDb: MockDb = {
      ...db,
      [collectionKey]: [created, ...collection] as never,
    };

    setDb(nextDb);
    return buildSuccess(created, "Created successfully.");
  }

  if (request.method === "PATCH" || request.method === "PUT") {
    if (!entityId) {
      return buildError("Record ID is required.", 400);
    }

    const existing = collection.find((record) => record.id === entityId);

    if (!existing) {
      return buildError("Record not found.", 404);
    }

    const updated = updateRecord(existing, body);
    const nextCollection = collection.map((record) =>
      record.id === entityId ? updated : record
    );

    const nextDb: MockDb = {
      ...db,
      [collectionKey]: nextCollection as never,
    };

    setDb(nextDb);
    return buildSuccess(updated, "Updated successfully.");
  }

  if (request.method === "DELETE") {
    if (!entityId) {
      return buildError("Record ID is required.", 400);
    }

    const exists = collection.some((record) => record.id === entityId);

    if (!exists) {
      return buildError("Record not found.", 404);
    }

    const nextCollection = collection.filter(
      (record) => record.id !== entityId
    );

    const nextDb: MockDb = {
      ...db,
      [collectionKey]: nextCollection as never,
    };

    setDb(nextDb);

    return buildSuccess({ id: entityId }, "Deleted successfully.");
  }

  return buildError("Unsupported method.", 405);
}

export async function mockGet(
  path: string,
  query?: MockRequestQuery
): Promise<MockResponse> {
  return handleMockRequest({
    method: "GET",
    path,
    query,
  });
}

export async function mockPost(
  path: string,
  body?: unknown,
  query?: MockRequestQuery
): Promise<MockResponse> {
  return handleMockRequest({
    method: "POST",
    path,
    body,
    query,
  });
}

export async function mockPatch(
  path: string,
  body?: unknown,
  query?: MockRequestQuery
): Promise<MockResponse> {
  return handleMockRequest({
    method: "PATCH",
    path,
    body,
    query,
  });
}

export async function mockPut(
  path: string,
  body?: unknown,
  query?: MockRequestQuery
): Promise<MockResponse> {
  return handleMockRequest({
    method: "PUT",
    path,
    body,
    query,
  });
}

export async function mockDelete(
  path: string,
  query?: MockRequestQuery
): Promise<MockResponse> {
  return handleMockRequest({
    method: "DELETE",
    path,
    query,
  });
}