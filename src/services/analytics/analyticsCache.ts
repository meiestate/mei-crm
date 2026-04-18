export interface AnalyticsCacheEntry<T = unknown> {
  key: string;
  value: T;
  createdAt: number;
  expiresAt: number | null;
}

export interface AnalyticsCacheOptions {
  ttlMs?: number;
  persist?: boolean;
  namespace?: string;
}

export interface AnalyticsCacheState<T = unknown> {
  key: string;
  value: T | null;
  isExpired: boolean;
  exists: boolean;
}

const DEFAULT_NAMESPACE = "mei-analytics-cache";
const DEFAULT_TTL_MS = 5 * 60 * 1000;

const memoryCache = new Map<string, AnalyticsCacheEntry<unknown>>();

const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
};

const buildStorageKey = (namespace: string, key: string): string => {
  return `${namespace}:${key}`;
};

const now = (): number => Date.now();

const isExpiredEntry = (entry: AnalyticsCacheEntry<unknown>): boolean => {
  if (entry.expiresAt === null) return false;
  return entry.expiresAt <= now();
};

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const readFromLocalStorage = <T>(
  namespace: string,
  key: string
): AnalyticsCacheEntry<T> | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(buildStorageKey(namespace, key));
  const parsed = safeParse<AnalyticsCacheEntry<T>>(raw);

  if (!parsed) return null;

  if (isExpiredEntry(parsed as AnalyticsCacheEntry<unknown>)) {
    window.localStorage.removeItem(buildStorageKey(namespace, key));
    return null;
  }

  return parsed;
};

const writeToLocalStorage = <T>(
  namespace: string,
  key: string,
  entry: AnalyticsCacheEntry<T>
): void => {
  if (!isBrowser()) return;

  window.localStorage.setItem(
    buildStorageKey(namespace, key),
    JSON.stringify(entry)
  );
};

const removeFromLocalStorage = (namespace: string, key: string): void => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(buildStorageKey(namespace, key));
};

const clearNamespaceFromLocalStorage = (namespace: string): void => {
  if (!isBrowser()) return;

  const keysToDelete: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const storageKey = window.localStorage.key(index);

    if (storageKey && storageKey.startsWith(`${namespace}:`)) {
      keysToDelete.push(storageKey);
    }
  }

  keysToDelete.forEach((storageKey) => {
    window.localStorage.removeItem(storageKey);
  });
};

export const setAnalyticsCache = <T>(
  key: string,
  value: T,
  options?: AnalyticsCacheOptions
): AnalyticsCacheEntry<T> => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const persist = options?.persist ?? true;

  const createdAt = now();
  const expiresAt = ttlMs > 0 ? createdAt + ttlMs : null;

  const entry: AnalyticsCacheEntry<T> = {
    key,
    value,
    createdAt,
    expiresAt,
  };

  memoryCache.set(buildStorageKey(namespace, key), entry);

  if (persist) {
    writeToLocalStorage(namespace, key, entry);
  }

  return entry;
};

export const getAnalyticsCache = <T>(
  key: string,
  options?: AnalyticsCacheOptions
): T | null => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;
  const storageKey = buildStorageKey(namespace, key);

  const memoryEntry = memoryCache.get(storageKey) as AnalyticsCacheEntry<T> | undefined;

  if (memoryEntry) {
    if (isExpiredEntry(memoryEntry as AnalyticsCacheEntry<unknown>)) {
      memoryCache.delete(storageKey);
      removeFromLocalStorage(namespace, key);
      return null;
    }

    return memoryEntry.value;
  }

  const localEntry = readFromLocalStorage<T>(namespace, key);

  if (!localEntry) return null;

  memoryCache.set(storageKey, localEntry);
  return localEntry.value;
};

export const getAnalyticsCacheState = <T>(
  key: string,
  options?: AnalyticsCacheOptions
): AnalyticsCacheState<T> => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;
  const storageKey = buildStorageKey(namespace, key);

  const memoryEntry = memoryCache.get(storageKey) as AnalyticsCacheEntry<T> | undefined;

  if (memoryEntry) {
    const expired = isExpiredEntry(memoryEntry as AnalyticsCacheEntry<unknown>);

    if (expired) {
      memoryCache.delete(storageKey);
      removeFromLocalStorage(namespace, key);

      return {
        key,
        value: null,
        isExpired: true,
        exists: false,
      };
    }

    return {
      key,
      value: memoryEntry.value,
      isExpired: false,
      exists: true,
    };
  }

  const localEntry = readFromLocalStorage<T>(namespace, key);

  if (!localEntry) {
    return {
      key,
      value: null,
      isExpired: false,
      exists: false,
    };
  }

  memoryCache.set(storageKey, localEntry);

  return {
    key,
    value: localEntry.value,
    isExpired: false,
    exists: true,
  };
};

export const hasAnalyticsCache = (
  key: string,
  options?: AnalyticsCacheOptions
): boolean => {
  return getAnalyticsCache(key, options) !== null;
};

export const removeAnalyticsCache = (
  key: string,
  options?: AnalyticsCacheOptions
): void => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;
  const storageKey = buildStorageKey(namespace, key);

  memoryCache.delete(storageKey);
  removeFromLocalStorage(namespace, key);
};

export const clearAnalyticsCache = (
  options?: Pick<AnalyticsCacheOptions, "namespace">
): void => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;

  const memoryKeysToDelete: string[] = [];

  memoryCache.forEach((_, key) => {
    if (key.startsWith(`${namespace}:`)) {
      memoryKeysToDelete.push(key);
    }
  });

  memoryKeysToDelete.forEach((key) => {
    memoryCache.delete(key);
  });

  clearNamespaceFromLocalStorage(namespace);
};

export const cleanupExpiredAnalyticsCache = (
  options?: Pick<AnalyticsCacheOptions, "namespace">
): void => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;

  const expiredMemoryKeys: string[] = [];

  memoryCache.forEach((entry, storageKey) => {
    if (
      storageKey.startsWith(`${namespace}:`) &&
      isExpiredEntry(entry)
    ) {
      expiredMemoryKeys.push(storageKey);
    }
  });

  expiredMemoryKeys.forEach((storageKey) => {
    memoryCache.delete(storageKey);
  });

  if (isBrowser()) {
    const localKeysToDelete: string[] = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const storageKey = window.localStorage.key(index);

      if (!storageKey || !storageKey.startsWith(`${namespace}:`)) continue;

      const parsed = safeParse<AnalyticsCacheEntry<unknown>>(
        window.localStorage.getItem(storageKey)
      );

      if (!parsed || isExpiredEntry(parsed)) {
        localKeysToDelete.push(storageKey);
      }
    }

    localKeysToDelete.forEach((storageKey) => {
      window.localStorage.removeItem(storageKey);
    });
  }
};

export const getOrSetAnalyticsCache = <T>(
  key: string,
  factory: () => T,
  options?: AnalyticsCacheOptions
): T => {
  const existing = getAnalyticsCache<T>(key, options);

  if (existing !== null) {
    return existing;
  }

  const nextValue = factory();
  setAnalyticsCache(key, nextValue, options);
  return nextValue;
};

export const getAnalyticsCacheEntry = <T>(
  key: string,
  options?: AnalyticsCacheOptions
): AnalyticsCacheEntry<T> | null => {
  const namespace = options?.namespace ?? DEFAULT_NAMESPACE;
  const storageKey = buildStorageKey(namespace, key);

  const memoryEntry = memoryCache.get(storageKey) as AnalyticsCacheEntry<T> | undefined;

  if (memoryEntry) {
    if (isExpiredEntry(memoryEntry as AnalyticsCacheEntry<unknown>)) {
      memoryCache.delete(storageKey);
      removeFromLocalStorage(namespace, key);
      return null;
    }

    return memoryEntry;
  }

  const localEntry = readFromLocalStorage<T>(namespace, key);

  if (!localEntry) return null;

  memoryCache.set(storageKey, localEntry);
  return localEntry;
};

export const analyticsCache = {
  set: setAnalyticsCache,
  get: getAnalyticsCache,
  getState: getAnalyticsCacheState,
  getEntry: getAnalyticsCacheEntry,
  has: hasAnalyticsCache,
  remove: removeAnalyticsCache,
  clear: clearAnalyticsCache,
  cleanupExpired: cleanupExpiredAnalyticsCache,
  getOrSet: getOrSetAnalyticsCache,
};

export default analyticsCache;