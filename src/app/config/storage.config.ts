// =====================================================
// MEI CRM - storage.config.ts
// Frontend-safe storage configuration
// Vite + React + TypeScript
// -----------------------------------------------------
// IMPORTANT:
// AWS S3 secret / Firebase private key / Cloudinary secret
// frontend-ல் வைக்கக்கூடாது. File upload/signature/presigned URL
// backend API வழியாக மட்டும் நடக்க வேண்டும்.
// Frontend-ல் public upload settings, endpoints, validation,
// local cache helpers மட்டும் maintain செய்யவும்.
// =====================================================

export type StorageEnvironment = "development" | "staging" | "production";

export type StorageProvider =
  | "backend_api"
  | "s3"
  | "gcs"
  | "firebase"
  | "supabase"
  | "cloudinary"
  | "local"
  | "mock";

export type BrowserStorageType = "localStorage" | "sessionStorage" | "memory";

export type UploadVisibility = "private" | "public" | "workspace";

export type UploadCategory =
  | "avatar"
  | "company_logo"
  | "lead_document"
  | "deal_document"
  | "invoice"
  | "payment_receipt"
  | "support_attachment"
  | "import_file"
  | "export_file"
  | "other";

export type StorageConfig = {
  environment: StorageEnvironment;
  provider: StorageProvider;
  enabled: boolean;
  browserStorageType: BrowserStorageType;
  api: {
    baseUrl: string;
    uploadEndpoint: string;
    downloadEndpoint: string;
    deleteEndpoint: string;
    signedUrlEndpoint: string;
    fileListEndpoint: string;
    timeoutMs: number;
    retryCount: number;
  };
  upload: {
    defaultVisibility: UploadVisibility;
    maxFileSizeMb: number;
    maxFilesPerUpload: number;
    imageMaxFileSizeMb: number;
    documentMaxFileSizeMb: number;
    allowedImageTypes: string[];
    allowedDocumentTypes: string[];
    allowedImportTypes: string[];
    blockedExtensions: string[];
  };
  paths: {
    rootFolder: string;
    avatarFolder: string;
    companyLogoFolder: string;
    leadDocumentsFolder: string;
    dealDocumentsFolder: string;
    invoiceFolder: string;
    receiptFolder: string;
    supportAttachmentFolder: string;
    importFolder: string;
    exportFolder: string;
    tempFolder: string;
  };
  cache: {
    enabled: boolean;
    keyPrefix: string;
    ttlMs: number;
    maxItems: number;
  };
  localPreview: {
    enabled: boolean;
    storageKey: string;
    keepLastCount: number;
  };
  security: {
    requireAuthForUpload: boolean;
    requireWorkspaceId: boolean;
    enableFileTypeValidation: boolean;
    enableFileSizeValidation: boolean;
    sanitizeFileName: boolean;
  };
};

export type StorageFileMeta = {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  extension: string;
  category: UploadCategory;
  visibility: UploadVisibility;
  url?: string;
  path?: string;
  workspaceId?: string;
  uploadedBy?: string;
  createdAt: string;
};

export type UploadValidationResult = {
  valid: boolean;
  errors: string[];
};

let memoryStorage = new Map<string, string>();

const getEnvValue = (key: string, fallback: string): string => {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim().length > 0 ? value : fallback;
};

const getBooleanEnvValue = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
};

const getNumberEnvValue = (key: string, fallback: number): number => {
  const value = import.meta.env[key] as string | undefined;
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const resolveEnvironment = (): StorageEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }

  return "development";
};

const resolveProvider = (): StorageProvider => {
  const provider = getEnvValue("VITE_STORAGE_PROVIDER", "backend_api");

  if (
    provider === "backend_api" ||
    provider === "s3" ||
    provider === "gcs" ||
    provider === "firebase" ||
    provider === "supabase" ||
    provider === "cloudinary" ||
    provider === "local" ||
    provider === "mock"
  ) {
    return provider;
  }

  return "backend_api";
};

const resolveBrowserStorageType = (): BrowserStorageType => {
  const storageType = getEnvValue("VITE_BROWSER_STORAGE_TYPE", "localStorage");

  if (storageType === "localStorage" || storageType === "sessionStorage" || storageType === "memory") {
    return storageType;
  }

  return "localStorage";
};

const resolveUploadVisibility = (): UploadVisibility => {
  const visibility = getEnvValue("VITE_UPLOAD_DEFAULT_VISIBILITY", "workspace");

  if (visibility === "private" || visibility === "public" || visibility === "workspace") {
    return visibility;
  }

  return "workspace";
};

export const STORAGE_CONFIG: StorageConfig = {
  environment: resolveEnvironment(),
  provider: resolveProvider(),
  enabled: getBooleanEnvValue("VITE_STORAGE_ENABLED", true),
  browserStorageType: resolveBrowserStorageType(),

  api: {
    baseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:4000/api/v1"),
    uploadEndpoint: getEnvValue("VITE_STORAGE_UPLOAD_ENDPOINT", "/storage/upload"),
    downloadEndpoint: getEnvValue("VITE_STORAGE_DOWNLOAD_ENDPOINT", "/storage/download"),
    deleteEndpoint: getEnvValue("VITE_STORAGE_DELETE_ENDPOINT", "/storage/delete"),
    signedUrlEndpoint: getEnvValue("VITE_STORAGE_SIGNED_URL_ENDPOINT", "/storage/signed-url"),
    fileListEndpoint: getEnvValue("VITE_STORAGE_FILE_LIST_ENDPOINT", "/storage/files"),
    timeoutMs: getNumberEnvValue("VITE_STORAGE_TIMEOUT_MS", 60000),
    retryCount: getNumberEnvValue("VITE_STORAGE_RETRY_COUNT", 2),
  },

  upload: {
    defaultVisibility: resolveUploadVisibility(),
    maxFileSizeMb: getNumberEnvValue("VITE_STORAGE_MAX_FILE_SIZE_MB", 10),
    maxFilesPerUpload: getNumberEnvValue("VITE_STORAGE_MAX_FILES_PER_UPLOAD", 10),
    imageMaxFileSizeMb: getNumberEnvValue("VITE_STORAGE_IMAGE_MAX_FILE_SIZE_MB", 5),
    documentMaxFileSizeMb: getNumberEnvValue("VITE_STORAGE_DOCUMENT_MAX_FILE_SIZE_MB", 10),
    allowedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"],
    allowedDocumentTypes: [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    allowedImportTypes: [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    blockedExtensions: ["exe", "bat", "cmd", "sh", "js", "msi", "scr", "com", "pif", "jar"],
  },

  paths: {
    rootFolder: getEnvValue("VITE_STORAGE_ROOT_FOLDER", "mei-crm"),
    avatarFolder: getEnvValue("VITE_STORAGE_AVATAR_FOLDER", "avatars"),
    companyLogoFolder: getEnvValue("VITE_STORAGE_COMPANY_LOGO_FOLDER", "company-logos"),
    leadDocumentsFolder: getEnvValue("VITE_STORAGE_LEAD_DOCUMENTS_FOLDER", "leads/documents"),
    dealDocumentsFolder: getEnvValue("VITE_STORAGE_DEAL_DOCUMENTS_FOLDER", "deals/documents"),
    invoiceFolder: getEnvValue("VITE_STORAGE_INVOICE_FOLDER", "billing/invoices"),
    receiptFolder: getEnvValue("VITE_STORAGE_RECEIPT_FOLDER", "billing/receipts"),
    supportAttachmentFolder: getEnvValue("VITE_STORAGE_SUPPORT_ATTACHMENT_FOLDER", "support/attachments"),
    importFolder: getEnvValue("VITE_STORAGE_IMPORT_FOLDER", "imports"),
    exportFolder: getEnvValue("VITE_STORAGE_EXPORT_FOLDER", "exports"),
    tempFolder: getEnvValue("VITE_STORAGE_TEMP_FOLDER", "temp"),
  },

  cache: {
    enabled: getBooleanEnvValue("VITE_STORAGE_CACHE_ENABLED", true),
    keyPrefix: getEnvValue("VITE_STORAGE_CACHE_KEY_PREFIX", "mei-crm-storage"),
    ttlMs: getNumberEnvValue("VITE_STORAGE_CACHE_TTL_MS", 5 * 60 * 1000),
    maxItems: getNumberEnvValue("VITE_STORAGE_CACHE_MAX_ITEMS", 200),
  },

  localPreview: {
    enabled: getBooleanEnvValue("VITE_STORAGE_LOCAL_PREVIEW_ENABLED", resolveEnvironment() === "development"),
    storageKey: getEnvValue("VITE_STORAGE_LOCAL_PREVIEW_KEY", "mei-crm-storage-preview"),
    keepLastCount: getNumberEnvValue("VITE_STORAGE_LOCAL_PREVIEW_KEEP_LAST", 25),
  },

  security: {
    requireAuthForUpload: getBooleanEnvValue("VITE_STORAGE_REQUIRE_AUTH_FOR_UPLOAD", true),
    requireWorkspaceId: getBooleanEnvValue("VITE_STORAGE_REQUIRE_WORKSPACE_ID", true),
    enableFileTypeValidation: getBooleanEnvValue("VITE_STORAGE_ENABLE_FILE_TYPE_VALIDATION", true),
    enableFileSizeValidation: getBooleanEnvValue("VITE_STORAGE_ENABLE_FILE_SIZE_VALIDATION", true),
    sanitizeFileName: getBooleanEnvValue("VITE_STORAGE_SANITIZE_FILE_NAME", true),
  },
};

export const isStorageProduction = STORAGE_CONFIG.environment === "production";
export const isStorageDevelopment = STORAGE_CONFIG.environment === "development";
export const isStorageStaging = STORAGE_CONFIG.environment === "staging";

export const isStorageEnabled = (): boolean => STORAGE_CONFIG.enabled;

export const isMockStorageEnabled = (): boolean => STORAGE_CONFIG.provider === "mock";

export const getStorageApiBaseUrl = (): string => STORAGE_CONFIG.api.baseUrl.replace(/\/$/, "");

export const getStorageApiUrl = (endpoint: string): string => {
  const baseUrl = getStorageApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
};

export const getUploadUrl = (): string => getStorageApiUrl(STORAGE_CONFIG.api.uploadEndpoint);

export const getDownloadUrl = (): string => getStorageApiUrl(STORAGE_CONFIG.api.downloadEndpoint);

export const getDeleteUrl = (): string => getStorageApiUrl(STORAGE_CONFIG.api.deleteEndpoint);

export const getSignedUrlEndpoint = (): string => getStorageApiUrl(STORAGE_CONFIG.api.signedUrlEndpoint);

export const getFileListUrl = (): string => getStorageApiUrl(STORAGE_CONFIG.api.fileListEndpoint);

export const getBrowserStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (STORAGE_CONFIG.browserStorageType === "localStorage") {
    return window.localStorage;
  }

  if (STORAGE_CONFIG.browserStorageType === "sessionStorage") {
    return window.sessionStorage;
  }

  return null;
};

export const setStorageItem = (key: string, value: string): void => {
  if (STORAGE_CONFIG.browserStorageType === "memory") {
    memoryStorage.set(key, value);
    return;
  }

  getBrowserStorage()?.setItem(key, value);
};

export const getStorageItem = (key: string): string | null => {
  if (STORAGE_CONFIG.browserStorageType === "memory") {
    return memoryStorage.get(key) ?? null;
  }

  return getBrowserStorage()?.getItem(key) ?? null;
};

export const removeStorageItem = (key: string): void => {
  if (STORAGE_CONFIG.browserStorageType === "memory") {
    memoryStorage.delete(key);
    return;
  }

  getBrowserStorage()?.removeItem(key);
};

export const clearMemoryStorage = (): void => {
  memoryStorage = new Map<string, string>();
};

export const getStorageCacheKey = (key: string): string => {
  return `${STORAGE_CONFIG.cache.keyPrefix}:${key}`;
};

export const setCachedValue = <T,>(key: string, value: T, ttlMs = STORAGE_CONFIG.cache.ttlMs): void => {
  if (!STORAGE_CONFIG.cache.enabled) {
    return;
  }

  const cacheItem = {
    value,
    expiresAt: Date.now() + ttlMs,
  };

  setStorageItem(getStorageCacheKey(key), JSON.stringify(cacheItem));
};

export const getCachedValue = <T,>(key: string): T | null => {
  if (!STORAGE_CONFIG.cache.enabled) {
    return null;
  }

  const rawValue = getStorageItem(getStorageCacheKey(key));

  if (!rawValue) {
    return null;
  }

  try {
    const cacheItem = JSON.parse(rawValue) as { value: T; expiresAt: number };

    if (Date.now() > cacheItem.expiresAt) {
      removeStorageItem(getStorageCacheKey(key));
      return null;
    }

    return cacheItem.value;
  } catch {
    removeStorageItem(getStorageCacheKey(key));
    return null;
  }
};

export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${sizes[index]}`;
};

export const mbToBytes = (mb: number): number => mb * 1024 * 1024;

export const sanitizeFileName = (fileName: string): string => {
  if (!STORAGE_CONFIG.security.sanitizeFileName) {
    return fileName;
  }

  const extension = getFileExtension(fileName);
  const nameWithoutExtension = extension ? fileName.slice(0, -(extension.length + 1)) : fileName;

  const safeName = nameWithoutExtension
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return extension ? `${safeName || "file"}.${extension}` : safeName || "file";
};

export const getCategoryFolder = (category: UploadCategory): string => {
  const folders: Record<UploadCategory, string> = {
    avatar: STORAGE_CONFIG.paths.avatarFolder,
    company_logo: STORAGE_CONFIG.paths.companyLogoFolder,
    lead_document: STORAGE_CONFIG.paths.leadDocumentsFolder,
    deal_document: STORAGE_CONFIG.paths.dealDocumentsFolder,
    invoice: STORAGE_CONFIG.paths.invoiceFolder,
    payment_receipt: STORAGE_CONFIG.paths.receiptFolder,
    support_attachment: STORAGE_CONFIG.paths.supportAttachmentFolder,
    import_file: STORAGE_CONFIG.paths.importFolder,
    export_file: STORAGE_CONFIG.paths.exportFolder,
    other: STORAGE_CONFIG.paths.tempFolder,
  };

  return folders[category];
};

export const buildStoragePath = (params: {
  workspaceId?: string;
  category: UploadCategory;
  fileName: string;
  includeDatePath?: boolean;
}): string => {
  const safeFileName = sanitizeFileName(params.fileName);
  const root = STORAGE_CONFIG.paths.rootFolder.replace(/^\/|\/$/g, "");
  const workspace = params.workspaceId ? `workspaces/${params.workspaceId}` : "global";
  const categoryFolder = getCategoryFolder(params.category).replace(/^\/|\/$/g, "");

  if (!params.includeDatePath) {
    return `${root}/${workspace}/${categoryFolder}/${safeFileName}`;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${root}/${workspace}/${categoryFolder}/${year}/${month}/${day}/${safeFileName}`;
};

export const isImageFile = (file: File): boolean => {
  return STORAGE_CONFIG.upload.allowedImageTypes.includes(file.type);
};

export const isDocumentFile = (file: File): boolean => {
  return STORAGE_CONFIG.upload.allowedDocumentTypes.includes(file.type);
};

export const isImportFile = (file: File): boolean => {
  return STORAGE_CONFIG.upload.allowedImportTypes.includes(file.type);
};

export const isBlockedFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName);
  return STORAGE_CONFIG.upload.blockedExtensions.includes(extension);
};

export const getAllowedTypesByCategory = (category: UploadCategory): string[] => {
  if (category === "avatar" || category === "company_logo") {
    return STORAGE_CONFIG.upload.allowedImageTypes;
  }

  if (category === "import_file") {
    return STORAGE_CONFIG.upload.allowedImportTypes;
  }

  return [...STORAGE_CONFIG.upload.allowedImageTypes, ...STORAGE_CONFIG.upload.allowedDocumentTypes];
};

export const validateFile = (file: File, category: UploadCategory = "other"): UploadValidationResult => {
  const errors: string[] = [];
  const extension = getFileExtension(file.name);
  const allowedTypes = getAllowedTypesByCategory(category);

  if (isBlockedFile(file.name)) {
    errors.push(`.${extension} files are not allowed.`);
  }

  if (STORAGE_CONFIG.security.enableFileTypeValidation && !allowedTypes.includes(file.type)) {
    errors.push(`${file.type || "Unknown file type"} is not allowed for ${category}.`);
  }

  if (STORAGE_CONFIG.security.enableFileSizeValidation) {
    const maxFileSizeMb = isImageFile(file)
      ? STORAGE_CONFIG.upload.imageMaxFileSizeMb
      : isDocumentFile(file)
        ? STORAGE_CONFIG.upload.documentMaxFileSizeMb
        : STORAGE_CONFIG.upload.maxFileSizeMb;

    if (file.size > mbToBytes(maxFileSizeMb)) {
      errors.push(`${file.name} exceeds maximum size of ${maxFileSizeMb} MB.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateFiles = (files: File[], category: UploadCategory = "other"): UploadValidationResult => {
  const errors: string[] = [];

  if (files.length === 0) {
    errors.push("At least one file is required.");
  }

  if (files.length > STORAGE_CONFIG.upload.maxFilesPerUpload) {
    errors.push(`Maximum ${STORAGE_CONFIG.upload.maxFilesPerUpload} files are allowed per upload.`);
  }

  files.forEach((file) => {
    const result = validateFile(file, category);
    errors.push(...result.errors);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const createStorageFileMeta = (params: {
  file: File;
  category?: UploadCategory;
  visibility?: UploadVisibility;
  workspaceId?: string;
  uploadedBy?: string;
  url?: string;
}): StorageFileMeta => {
  const category = params.category ?? "other";
  const safeName = sanitizeFileName(params.file.name);

  return {
    id: crypto.randomUUID(),
    name: safeName,
    originalName: params.file.name,
    size: params.file.size,
    type: params.file.type,
    extension: getFileExtension(params.file.name),
    category,
    visibility: params.visibility ?? STORAGE_CONFIG.upload.defaultVisibility,
    url: params.url,
    path: buildStoragePath({ workspaceId: params.workspaceId, category, fileName: safeName, includeDatePath: true }),
    workspaceId: params.workspaceId,
    uploadedBy: params.uploadedBy,
    createdAt: new Date().toISOString(),
  };
};

export const saveStoragePreview = (fileMeta: StorageFileMeta): void => {
  if (!STORAGE_CONFIG.localPreview.enabled || typeof window === "undefined") {
    return;
  }

  const storageKey = STORAGE_CONFIG.localPreview.storageKey;
  const existingRaw = window.localStorage.getItem(storageKey);
  const existing = existingRaw ? (JSON.parse(existingRaw) as StorageFileMeta[]) : [];
  const nextItems = [fileMeta, ...existing].slice(0, STORAGE_CONFIG.localPreview.keepLastCount);

  window.localStorage.setItem(storageKey, JSON.stringify(nextItems));
};

export const getStoragePreviews = (): StorageFileMeta[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const existingRaw = window.localStorage.getItem(STORAGE_CONFIG.localPreview.storageKey);
  return existingRaw ? (JSON.parse(existingRaw) as StorageFileMeta[]) : [];
};

export const clearStoragePreviews = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_CONFIG.localPreview.storageKey);
};

export const assertStorageConfig = (): void => {
  const errors: string[] = [];

  if (!STORAGE_CONFIG.api.baseUrl) {
    errors.push("VITE_API_BASE_URL is required.");
  }

  if (!STORAGE_CONFIG.api.uploadEndpoint) {
    errors.push("VITE_STORAGE_UPLOAD_ENDPOINT is required.");
  }

  if (STORAGE_CONFIG.api.timeoutMs <= 0) {
    errors.push("VITE_STORAGE_TIMEOUT_MS must be greater than 0.");
  }

  if (STORAGE_CONFIG.api.retryCount < 0) {
    errors.push("VITE_STORAGE_RETRY_COUNT cannot be negative.");
  }

  if (STORAGE_CONFIG.upload.maxFileSizeMb <= 0) {
    errors.push("VITE_STORAGE_MAX_FILE_SIZE_MB must be greater than 0.");
  }

  if (STORAGE_CONFIG.upload.maxFilesPerUpload <= 0) {
    errors.push("VITE_STORAGE_MAX_FILES_PER_UPLOAD must be greater than 0.");
  }

  if (STORAGE_CONFIG.cache.ttlMs < 0) {
    errors.push("VITE_STORAGE_CACHE_TTL_MS cannot be negative.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid storage configuration:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
};

export default STORAGE_CONFIG;
