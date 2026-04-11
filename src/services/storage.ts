// src/services/storage.ts

export type StorageScope = "local" | "session";

export type StorageSetOptions = {
  scope?: StorageScope;
};

export type StorageGetOptions<T> = {
  scope?: StorageScope;
  fallback: T;
};

export type StorageItemMeta = {
  key: string;
  scope: StorageScope;
};

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined";
}

function getStorageByScope(scope: StorageScope = "local"): Storage | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return scope === "session" ? window.sessionStorage : window.localStorage;
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

function normalizeKey(key: string): string {
  return key.trim();
}

export function setStorageItem<T>(
  key: string,
  value: T,
  options: StorageSetOptions = {}
): boolean {
  const storage = getStorageByScope(options.scope ?? "local");

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(normalizeKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getStorageItem<T>(
  key: string,
  options: StorageGetOptions<T>
): T {
  const storage = getStorageByScope(options.scope ?? "local");

  if (!storage) {
    return options.fallback;
  }

  return safeParse<T>(
    storage.getItem(normalizeKey(key)),
    options.fallback
  );
}

export function removeStorageItem(
  key: string,
  scope: StorageScope = "local"
): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(normalizeKey(key));
    return true;
  } catch {
    return false;
  }
}

export function hasStorageItem(
  key: string,
  scope: StorageScope = "local"
): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  return storage.getItem(normalizeKey(key)) !== null;
}

export function clearStorage(scope: StorageScope = "local"): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
}

export function getRawStorageItem(
  key: string,
  scope: StorageScope = "local"
): string | null {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return null;
  }

  return storage.getItem(normalizeKey(key));
}

export function setRawStorageItem(
  key: string,
  value: string,
  scope: StorageScope = "local"
): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(normalizeKey(key), value);
    return true;
  } catch {
    return false;
  }
}

export function getStorageNumber(
  key: string,
  fallback = 0,
  scope: StorageScope = "local"
): number {
  const raw = getRawStorageItem(key, scope);

  if (raw === null) {
    return fallback;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function setStorageNumber(
  key: string,
  value: number,
  scope: StorageScope = "local"
): boolean {
  return setRawStorageItem(key, String(value), scope);
}

export function getStorageBoolean(
  key: string,
  fallback = false,
  scope: StorageScope = "local"
): boolean {
  const raw = getRawStorageItem(key, scope);

  if (raw === null) {
    return fallback;
  }

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  return fallback;
}

export function setStorageBoolean(
  key: string,
  value: boolean,
  scope: StorageScope = "local"
): boolean {
  return setRawStorageItem(key, value ? "true" : "false", scope);
}

export function getStorageString(
  key: string,
  fallback = "",
  scope: StorageScope = "local"
): string {
  const raw = getRawStorageItem(key, scope);
  return raw ?? fallback;
}

export function setStorageString(
  key: string,
  value: string,
  scope: StorageScope = "local"
): boolean {
  return setRawStorageItem(key, value, scope);
}

export function getStorageKeys(
  scope: StorageScope = "local"
): string[] {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return [];
  }

  return Array.from({ length: storage.length }, (_, index) => {
    return storage.key(index) ?? "";
  }).filter(Boolean);
}

export function getStorageEntries(
  scope: StorageScope = "local"
): Array<{ key: string; value: string }> {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return [];
  }

  return getStorageKeys(scope).map((key) => ({
    key,
    value: storage.getItem(key) ?? "",
  }));
}

export function removeStorageItems(
  keys: string[],
  scope: StorageScope = "local"
): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  try {
    keys.forEach((key) => {
      storage.removeItem(normalizeKey(key));
    });

    return true;
  } catch {
    return false;
  }
}

export function getNamespacedKey(namespace: string, key: string): string {
  const cleanNamespace = namespace.trim();
  const cleanKey = key.trim();

  return `${cleanNamespace}:${cleanKey}`;
}

export function clearStorageByPrefix(
  prefix: string,
  scope: StorageScope = "local"
): boolean {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return false;
  }

  try {
    const keys = getStorageKeys(scope).filter((key) =>
      key.startsWith(prefix)
    );

    keys.forEach((key) => {
      storage.removeItem(key);
    });

    return true;
  } catch {
    return false;
  }
}

export function getStorageSnapshot(
  scope: StorageScope = "local"
): Record<string, string> {
  const storage = getStorageByScope(scope);

  if (!storage) {
    return {};
  }

  return getStorageKeys(scope).reduce<Record<string, string>>((acc, key) => {
    acc[key] = storage.getItem(key) ?? "";
    return acc;
  }, {});
}

export function moveStorageItem(
  key: string,
  fromScope: StorageScope,
  toScope: StorageScope
): boolean {
  const value = getRawStorageItem(key, fromScope);

  if (value === null) {
    return false;
  }

  const setOk = setRawStorageItem(key, value, toScope);

  if (!setOk) {
    return false;
  }

  return removeStorageItem(key, fromScope);
}

export function storageItemExistsInAnyScope(key: string): boolean {
  return hasStorageItem(key, "local") || hasStorageItem(key, "session");
}

export function getFirstAvailableStorageItem<T>(
  key: string,
  fallback: T
): T {
  if (hasStorageItem(key, "local")) {
    return getStorageItem<T>(key, {
      scope: "local",
      fallback,
    });
  }

  if (hasStorageItem(key, "session")) {
    return getStorageItem<T>(key, {
      scope: "session",
      fallback,
    });
  }

  return fallback;
}

export const storage = {
  setItem: setStorageItem,
  getItem: getStorageItem,
  removeItem: removeStorageItem,
  hasItem: hasStorageItem,
  clear: clearStorage,
  getRawItem: getRawStorageItem,
  setRawItem: setRawStorageItem,
  getNumber: getStorageNumber,
  setNumber: setStorageNumber,
  getBoolean: getStorageBoolean,
  setBoolean: setStorageBoolean,
  getString: getStorageString,
  setString: setStorageString,
  getKeys: getStorageKeys,
  getEntries: getStorageEntries,
  removeItems: removeStorageItems,
  getNamespacedKey,
  clearByPrefix: clearStorageByPrefix,
  snapshot: getStorageSnapshot,
  moveItem: moveStorageItem,
  existsInAnyScope: storageItemExistsInAnyScope,
  getFirstAvailable: getFirstAvailableStorageItem,
};