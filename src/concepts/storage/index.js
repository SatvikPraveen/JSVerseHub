// File: src/concepts/storage/index.js
// Browser Storage - Web Storage (localStorage, sessionStorage) and IndexedDB with runnable, environment-safe implementations

import { localStorageContent } from './local-storage';
import { sessionStorageContent } from './session-storage';
import { indexedDBContent } from './indexeddb';

export const storageConfig = {
  title: 'Browser Storage',
  description: 'Persist data in the browser with the Web Storage API and IndexedDB, and know which one to reach for',
  difficulty: 'intermediate',
  estimatedTime: '2-3 hours',
  topics: [
    'Web Storage API (localStorage)',
    'Session-scoped storage (sessionStorage)',
    'Serialising data with JSON',
    'Storage quotas and error handling',
    'IndexedDB databases, object stores and indexes',
    'Transactions and promise wrappers',
    'Choosing the right storage mechanism'
  ],
  prerequisites: ['Basics', 'Objects & JSON', 'Async/Await', 'DOM']
};

// Alias used by the concept loader and several test suites
export const conceptConfig = storageConfig;

/**
 * Builds an error that mimics the DOMException a browser would raise.
 */
function storageError(name, message) {
  if (typeof DOMException === 'function') {
    return new DOMException(message, name);
  }
  const error = new Error(message);
  error.name = name;
  return error;
}

/**
 * In-memory implementation of the WHATWG Storage interface.
 *
 * Behaves like localStorage/sessionStorage: keys and values are coerced to
 * strings, missing keys read as null, insertion order is preserved for key(),
 * and an (optional) quota raises QuotaExceededError just like a browser.
 * Browsers measure the quota in UTF-16 code units, so the default of 5 * 1024 * 1024
 * characters matches the common "5 MB" limit.
 */
export class MemoryStorage {
  constructor({ quota = 5 * 1024 * 1024 } = {}) {
    Object.defineProperty(this, 'entries', {
      value: new Map(),
      enumerable: false
    });
    Object.defineProperty(this, 'quota', {
      value: quota,
      enumerable: false
    });
  }

  get length() {
    return this.entries.size;
  }

  key(index) {
    const position = Number(index);
    if (!Number.isInteger(position) || position < 0 || position >= this.entries.size) {
      return null;
    }
    return [...this.entries.keys()][position];
  }

  getItem(key) {
    const name = String(key);
    return this.entries.has(name) ? this.entries.get(name) : null;
  }

  setItem(key, value) {
    const name = String(key);
    const text = String(value);
    const currentSize = this.usedCharacters() - (this.entries.get(name) || '').length - (this.entries.has(name) ? name.length : 0);
    if (currentSize + name.length + text.length > this.quota) {
      throw storageError('QuotaExceededError', `Setting "${name}" exceeded the storage quota`);
    }
    this.entries.set(name, text);
  }

  removeItem(key) {
    this.entries.delete(String(key));
  }

  clear() {
    this.entries.clear();
  }

  // Number of UTF-16 code units currently stored (keys + values)
  usedCharacters() {
    let total = 0;
    this.entries.forEach((value, name) => {
      total += name.length + value.length;
    });
    return total;
  }

  keys() {
    return [...this.entries.keys()];
  }

  toJSON() {
    return Object.fromEntries(this.entries);
  }
}

/**
 * Reads window[kind] defensively. Accessing localStorage can itself throw a
 * SecurityError (sandboxed iframes, blocked cookies), so the access is guarded.
 */
function getNativeStorage(kind) {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    return window[kind] || null;
  } catch (error) {
    return null;
  }
}

/**
 * A storage object is usable only if it implements the full Storage interface
 * and a write/read round-trip succeeds (Safari private mode throws on setItem).
 */
export function isStorageUsable(candidate) {
  if (!candidate || typeof candidate.setItem !== 'function' || typeof candidate.key !== 'function') {
    return false;
  }
  try {
    const probe = '__storage_probe__';
    candidate.setItem(probe, 'ok');
    const roundTrip = candidate.getItem(probe) === 'ok';
    candidate.removeItem(probe);
    return roundTrip;
  } catch (error) {
    return false;
  }
}

/**
 * Returns the native storage of the requested kind when it works, otherwise an
 * in-memory fallback with identical semantics (used in Node, jsdom, private
 * browsing, or when storage access is blocked).
 */
export function createStorage(kind = 'localStorage', { preferNative = true, quota } = {}) {
  const native = preferNative ? getNativeStorage(kind) : null;
  if (isStorageUsable(native)) {
    return native;
  }
  return new MemoryStorage({ quota });
}

export const localStorage = createStorage('localStorage');
export const sessionStorage = createStorage('sessionStorage');

/**
 * JSON layer on top of any Storage-like object: stores structured data,
 * survives corrupt entries and supports defaults.
 */
export function createJSONStorage(storage) {
  return {
    set(key, value) {
      storage.setItem(key, JSON.stringify(value));
      return value;
    },
    get(key, fallback = null) {
      const raw = storage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      try {
        return JSON.parse(raw);
      } catch (error) {
        // Corrupt or hand-edited entry: treat as missing instead of crashing the app
        return fallback;
      }
    },
    update(key, updater, fallback = null) {
      const next = updater(this.get(key, fallback));
      return this.set(key, next);
    },
    remove(key) {
      storage.removeItem(key);
    },
    has(key) {
      return storage.getItem(key) !== null;
    }
  };
}

/**
 * Prefixes keys so several features (or apps on the same origin) never collide.
 */
export function createNamespacedStorage(storage, namespace) {
  const prefix = `${namespace}:`;

  function ownKeys() {
    const keys = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key.slice(prefix.length));
      }
    }
    return keys;
  }

  return {
    setItem: (key, value) => storage.setItem(prefix + key, value),
    getItem: key => storage.getItem(prefix + key),
    removeItem: key => storage.removeItem(prefix + key),
    key: index => ownKeys()[index] ?? null,
    get length() {
      return ownKeys().length;
    },
    keys: ownKeys,
    // Clears only this namespace, leaving other keys in the shared storage untouched
    clear() {
      ownKeys().forEach(key => storage.removeItem(prefix + key));
    }
  };
}

/**
 * Cache entries with a time-to-live. Web Storage has no expiry, so the
 * timestamp is stored alongside the value; `now` is injectable for tests.
 */
export function createExpiringStorage(storage, { now = () => Date.now() } = {}) {
  const json = createJSONStorage(storage);

  return {
    set(key, value, ttlMs) {
      json.set(key, {
        value,
        expiresAt: ttlMs === undefined ? null : now() + ttlMs
      });
      return value;
    },
    get(key, fallback = null) {
      const entry = json.get(key);
      if (!entry || typeof entry !== 'object' || !('value' in entry)) {
        return fallback;
      }
      if (entry.expiresAt !== null && now() >= entry.expiresAt) {
        storage.removeItem(key);
        return fallback;
      }
      return entry.value;
    },
    remove(key) {
      storage.removeItem(key);
    },
    // Remove every expired entry; returns the number purged
    purge() {
      let purged = 0;
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        keys.push(storage.key(i));
      }
      keys.forEach(key => {
        const entry = json.get(key);
        if (entry && typeof entry === 'object' && entry.expiresAt !== null && entry.expiresAt !== undefined
          && now() >= entry.expiresAt) {
          storage.removeItem(key);
          purged += 1;
        }
      });
      return purged;
    }
  };
}

/**
 * Estimates how much of the quota a Storage object uses. Browsers count UTF-16
 * code units, which occupy two bytes each.
 */
export function getStorageUsage(storage, quotaCharacters = 5 * 1024 * 1024) {
  let characters = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    characters += key.length + (storage.getItem(key) || '').length;
  }
  return {
    characters,
    bytes: characters * 2,
    quotaCharacters,
    percentUsed: Number(((characters / quotaCharacters) * 100).toFixed(2))
  };
}

/**
 * Local Storage
 */
export const localStorageConcept = {
  concept: 'localStorage',
  explanation: `
    localStorage is a synchronous key-value store scoped to an origin (scheme + host + port).
    Data has no expiry: it survives reloads, tab closes and browser restarts until the page
    or the user clears it. Both keys and values are always strings, so structured data must be
    serialised with JSON.stringify and revived with JSON.parse. Because every call blocks the
    main thread and the quota is only about 5 MB, it is ideal for small, frequently needed
    data such as preferences, feature flags and tokens for low-risk sessions, but not for
    large datasets, binary data or anything that must be queried.
  `,
  content: localStorageContent,

  examples: {
    MemoryStorage,
    createStorage,
    isStorageUsable,
    createJSONStorage,
    createNamespacedStorage,
    createExpiringStorage,
    getStorageUsage,

    /**
     * Persisted user preferences with defaults, merging partial updates.
     */
    createPreferences(storage = localStorage, defaults = {
      theme: 'light',
      fontSize: 14,
      language: 'en'
    }) {
      const json = createJSONStorage(storage);
      const KEY = 'preferences';

      return {
        load() {
          return { ...defaults, ...json.get(KEY, {}) };
        },
        save(partial) {
          const next = { ...this.load(), ...partial };
          json.set(KEY, next);
          return next;
        },
        reset() {
          storage.removeItem(KEY);
          return { ...defaults };
        }
      };
    },

    /**
     * Todo list backed by storage; every mutation writes the full list back.
     */
    createTodoList(storage = localStorage, key = 'todos') {
      const json = createJSONStorage(storage);

      function read() {
        const todos = json.get(key, []);
        return Array.isArray(todos) ? todos : [];
      }

      function write(todos) {
        json.set(key, todos);
        return todos;
      }

      return {
        all: read,
        add(text) {
          const todos = read();
          const todo = {
            id: todos.length ? Math.max(...todos.map(item => item.id)) + 1 : 1,
            text,
            done: false
          };
          write([...todos, todo]);
          return todo;
        },
        toggle(id) {
          return write(read().map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
        },
        remove(id) {
          return write(read().filter(todo => todo.id !== id));
        },
        clear() {
          storage.removeItem(key);
        }
      };
    },

    basicUsage: `
// Everything is a string
localStorage.setItem('name', 'John');
localStorage.setItem('age', 30);          // stored as "30"
typeof localStorage.getItem('age');       // "string"
localStorage.getItem('missing');          // null (never undefined)

// Structured data: serialise on the way in, parse on the way out
localStorage.setItem('user', JSON.stringify({ name: 'Alice', roles: ['admin'] }));
const user = JSON.parse(localStorage.getItem('user'));

// Enumerating
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}

localStorage.removeItem('age');
localStorage.clear();
    `,

    storageEvent: `
// The "storage" event fires in OTHER tabs of the same origin when localStorage changes,
// which makes it a cheap cross-tab messaging channel.
window.addEventListener('storage', event => {
  if (event.key === 'theme') {
    document.body.dataset.theme = event.newValue;
  }
  if (event.key === null) {
    console.log('localStorage.clear() was called in another tab');
  }
});
    `,

    quotaHandling: `
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // Firefox, Chrome and Safari all use the QuotaExceededError name; legacy code 22/1014
    if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
      console.warn('Storage full - evicting cache entries');
      return false;
    }
    throw error;
  }
}
    `
  },

  keyPoints: [
    'Scoped per origin and shared by every tab of that origin; persists until cleared',
    'Only strings: use JSON.stringify/JSON.parse for objects and arrays',
    'getItem returns null for missing keys, never undefined',
    'Synchronous and main-thread blocking; keep values small (~5 MB quota per origin)',
    'Never store secrets: any script on the origin, including XSS payloads, can read it',
    'Wrap setItem in try/catch: private modes and full quotas throw QuotaExceededError'
  ]
};

/**
 * Session Storage
 */
export const sessionStorageConcept = {
  concept: 'sessionStorage',
  explanation: `
    sessionStorage has exactly the same API as localStorage but a different lifetime and
    scope: data lives for one browsing session in one tab. It is discarded when the tab or
    window closes and is not shared between tabs, although a page opened via window.open or
    a duplicated tab starts with a copy of the opener's sessionStorage. It is the right home
    for state that should not outlive the tab: unsaved form drafts, wizard progress,
    per-tab view settings and short-lived tokens.
  `,
  content: sessionStorageContent,

  examples: {
    /**
     * Auto-saved form draft that disappears with the tab.
     */
    createFormDraft(formId, storage = sessionStorage) {
      const json = createJSONStorage(storage);
      const key = `draft:${formId}`;

      return {
        save(values) {
          json.set(key, {
            values,
            savedAt: Date.now()
          });
          return values;
        },
        restore() {
          const draft = json.get(key);
          return draft ? draft.values : null;
        },
        hasDraft() {
          return json.has(key);
        },
        discard() {
          storage.removeItem(key);
        }
      };
    },

    /**
     * Small per-tab state container with immutable updates.
     */
    createSessionState(key, initialState = {}, storage = sessionStorage) {
      const json = createJSONStorage(storage);

      return {
        get() {
          return json.get(key, initialState);
        },
        set(partial) {
          const next = { ...this.get(), ...partial };
          json.set(key, next);
          return next;
        },
        reset() {
          storage.removeItem(key);
          return initialState;
        }
      };
    },

    /**
     * Assigns each tab a stable id so per-tab data can be told apart.
     */
    getTabId(storage = sessionStorage, key = 'tabId') {
      let id = storage.getItem(key);
      if (!id) {
        id = `tab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        storage.setItem(key, id);
      }
      return id;
    },

    lifetimeComparison: `
// Same API, different lifetime
localStorage.setItem('theme', 'dark');      // survives closing the browser
sessionStorage.setItem('step', '2');        // gone when this tab closes

// Not shared between tabs: open a second tab and this logs null
console.log(sessionStorage.getItem('step'));

// Exception: window.open and "duplicate tab" copy the current sessionStorage
window.open('/checkout');                   // the new tab starts with step === '2'
    `,

    wizardProgress: `
// Multi-step form that survives an accidental reload but not a new visit
const wizard = createSessionState('checkout', { step: 1, data: {} });

document.querySelector('#next').addEventListener('click', () => {
  const { step, data } = wizard.get();
  wizard.set({ step: step + 1, data: { ...data, ...readCurrentStep() } });
});

window.addEventListener('DOMContentLoaded', () => renderStep(wizard.get().step));
    `
  },

  keyPoints: [
    'Identical API to localStorage: setItem, getItem, removeItem, clear, key, length',
    'Lifetime is the tab: closing the tab clears it, reloading does not',
    'Isolated per tab; window.open and tab duplication copy the opener\'s data',
    'Ideal for form drafts, wizard steps and view state that should not leak across sessions',
    'Same string-only and synchronous limitations as localStorage'
  ]
};

/**
 * Returns the native IndexedDB factory if the environment provides one.
 */
function getNativeIndexedDB() {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || null;
  } catch (error) {
    return null;
  }
}

/**
 * Key comparison following the IndexedDB ordering: number < Date < string < Array.
 */
export function compareKeys(a, b) {
  const rank = key => {
    if (typeof key === 'number') return 0;
    if (key instanceof Date) return 1;
    if (typeof key === 'string') return 2;
    if (Array.isArray(key)) return 3;
    return 4;
  };
  const rankA = rank(a);
  const rankB = rank(b);
  if (rankA !== rankB) {
    return rankA < rankB ? -1 : 1;
  }
  if (rankA === 3) {
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i++) {
      const result = compareKeys(a[i], b[i]);
      if (result !== 0) {
        return result;
      }
    }
    return Math.sign(a.length - b.length);
  }
  const valueA = rankA === 1 ? a.getTime() : a;
  const valueB = rankB === 1 ? b.getTime() : b;
  if (valueA === valueB) return 0;
  return valueA < valueB ? -1 : 1;
}

/**
 * IDBKeyRange-compatible ranges for the in-memory implementation.
 */
export const keyRange = {
  create(lower, upper, lowerOpen = false, upperOpen = false) {
    return {
      lower,
      upper,
      lowerOpen,
      upperOpen,
      includes(key) {
        if (lower !== undefined) {
          const result = compareKeys(key, lower);
          if (result < 0 || (result === 0 && lowerOpen)) return false;
        }
        if (upper !== undefined) {
          const result = compareKeys(key, upper);
          if (result > 0 || (result === 0 && upperOpen)) return false;
        }
        return true;
      }
    };
  },
  only: value => keyRange.create(value, value),
  lowerBound: (lower, open = false) => keyRange.create(lower, undefined, open, false),
  upperBound: (upper, open = false) => keyRange.create(undefined, upper, false, open),
  bound: (lower, upper, lowerOpen = false, upperOpen = false) => keyRange.create(lower, upper, lowerOpen, upperOpen)
};

function isKeyRange(query) {
  return Boolean(query) && typeof query === 'object' && typeof query.includes === 'function';
}

function matchesQuery(key, query) {
  if (query === undefined || query === null) return true;
  if (isKeyRange(query)) return query.includes(key);
  return compareKeys(key, query) === 0;
}

function extractKey(value, keyPath) {
  if (Array.isArray(keyPath)) {
    return keyPath.map(path => extractKey(value, path));
  }
  return keyPath.split('.').reduce((current, segment) => (current === undefined || current === null
    ? undefined
    : current[segment]), value);
}

function assignKey(value, keyPath, key) {
  const segments = keyPath.split('.');
  let current = value;
  for (let i = 0; i < segments.length - 1; i++) {
    if (typeof current[segments[i]] !== 'object' || current[segments[i]] === null) {
      current[segments[i]] = {};
    }
    current = current[segments[i]];
  }
  current[segments[segments.length - 1]] = key;
}

function structuredCopy(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return value instanceof Date ? new Date(value.getTime()) : JSON.parse(JSON.stringify(value));
}

/**
 * Creates an IDBRequest-like object. Handlers may be attached with the
 * onsuccess/onerror properties or addEventListener, exactly as with the native
 * API, and are dispatched asynchronously (on a macrotask, like the browser).
 */
function createRequest(source = null, transaction = null) {
  const listeners = new Map();
  const request = {
    result: undefined,
    error: null,
    readyState: 'pending',
    source,
    transaction,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    onblocked: null,
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      if (listeners.has(type)) listeners.get(type).delete(listener);
    },
    dispatch(type, detail = {}) {
      const event = {
        type,
        target: request,
        ...detail
      };
      const handler = request[`on${type}`];
      if (typeof handler === 'function') handler.call(request, event);
      if (listeners.has(type)) {
        [...listeners.get(type)].forEach(listener => listener.call(request, event));
      }
      return event;
    }
  };
  return request;
}

function settleRequest(request, work, onSettled = () => {}) {
  setTimeout(() => {
    try {
      request.result = work();
      request.readyState = 'done';
      request.dispatch('success');
    } catch (error) {
      request.error = error;
      request.readyState = 'done';
      request.dispatch('error', { error });
    }
    onSettled();
  }, 0);
  return request;
}

/**
 * Creates the object store view used inside one transaction.
 */
function createStoreHandle(store, transaction) {
  const request = work => {
    if (transaction.finished) {
      throw storageError('TransactionInactiveError', 'The transaction has finished');
    }
    transaction.pending += 1;
    return settleRequest(createRequest(handle, transaction), work, () => transaction.settleOne());
  };

  // Like the browser, mutating methods throw synchronously on a read-only transaction
  const writeRequest = work => {
    if (transaction.mode === 'readonly') {
      throw storageError('ReadOnlyError', 'The transaction is read-only');
    }
    return request(work);
  };

  function resolveKey(value, explicitKey) {
    if (store.keyPath !== null) {
      if (explicitKey !== undefined) {
        throw storageError('DataError', 'Object store uses in-line keys and the key parameter was provided');
      }
      let key = extractKey(value, store.keyPath);
      if (key === undefined && store.autoIncrement) {
        key = store.nextKey;
        store.nextKey += 1;
        assignKey(value, store.keyPath, key);
      }
      if (key === undefined) {
        throw storageError('DataError', 'Evaluating the key path did not yield a key');
      }
      return key;
    }
    if (explicitKey !== undefined) {
      return explicitKey;
    }
    if (store.autoIncrement) {
      const key = store.nextKey;
      store.nextKey += 1;
      return key;
    }
    throw storageError('DataError', 'Object store uses out-of-line keys and no key was provided');
  }

  function findEntry(key) {
    return [...store.records.entries()].find(([existing]) => compareKeys(existing, key) === 0);
  }

  function write(value, explicitKey, { overwrite }) {
    const copy = structuredCopy(value);
    const key = resolveKey(copy, explicitKey);
    const existing = findEntry(key);
    if (existing && !overwrite) {
      throw storageError('ConstraintError', `Key ${JSON.stringify(key)} already exists in the object store`);
    }
    store.indexes.forEach(index => {
      if (!index.unique) return;
      const indexed = extractKey(copy, index.keyPath);
      if (indexed === undefined) return;
      const clash = [...store.records.entries()].some(([recordKey, record]) => compareKeys(recordKey, key) !== 0
        && compareKeys(extractKey(record, index.keyPath), indexed) === 0);
      if (clash) {
        throw storageError('ConstraintError', `Unique index "${index.name}" already contains ${JSON.stringify(indexed)}`);
      }
    });
    if (existing) {
      store.records.delete(existing[0]);
    }
    store.records.set(key, copy);
    return key;
  }

  function sortedEntries(query) {
    return [...store.records.entries()]
      .filter(([key]) => matchesQuery(key, query))
      .sort(([a], [b]) => compareKeys(a, b));
  }

  const handle = {
    get name() {
      return store.name;
    },
    get keyPath() {
      return store.keyPath;
    },
    get autoIncrement() {
      return store.autoIncrement;
    },
    get indexNames() {
      const names = [...store.indexes.keys()];
      names.contains = name => store.indexes.has(name);
      return names;
    },
    transaction,

    add: (value, key) => writeRequest(() => write(value, key, { overwrite: false })),
    put: (value, key) => writeRequest(() => write(value, key, { overwrite: true })),
    get: query => request(() => {
      const entry = sortedEntries(query)[0];
      return entry ? structuredCopy(entry[1]) : undefined;
    }),
    getKey: query => request(() => {
      const entry = sortedEntries(query)[0];
      return entry ? entry[0] : undefined;
    }),
    getAll: (query, count) => request(() => {
      const entries = sortedEntries(query).map(([, value]) => structuredCopy(value));
      return count === undefined ? entries : entries.slice(0, count);
    }),
    getAllKeys: (query, count) => request(() => {
      const keys = sortedEntries(query).map(([key]) => key);
      return count === undefined ? keys : keys.slice(0, count);
    }),
    count: query => request(() => sortedEntries(query).length),
    delete: query => writeRequest(() => {
      sortedEntries(query).forEach(([key]) => store.records.delete(key));
      return undefined;
    }),
    clear: () => writeRequest(() => {
      store.records.clear();
      return undefined;
    }),

    createIndex(name, keyPath, { unique = false, multiEntry = false } = {}) {
      if (transaction.mode !== 'versionchange') {
        throw storageError('InvalidStateError', 'Indexes can only be created during a version change');
      }
      if (store.indexes.has(name)) {
        throw storageError('ConstraintError', `Index "${name}" already exists`);
      }
      store.indexes.set(name, {
        name,
        keyPath,
        unique,
        multiEntry
      });
      return handle.index(name);
    },
    deleteIndex(name) {
      if (transaction.mode !== 'versionchange') {
        throw storageError('InvalidStateError', 'Indexes can only be deleted during a version change');
      }
      store.indexes.delete(name);
    },
    index(name) {
      const index = store.indexes.get(name);
      if (!index) {
        throw storageError('NotFoundError', `Index "${name}" does not exist`);
      }

      const indexedEntries = query => [...store.records.entries()]
        .map(([primaryKey, value]) => ({
          primaryKey,
          value,
          indexKey: extractKey(value, index.keyPath)
        }))
        .filter(entry => entry.indexKey !== undefined && matchesQuery(entry.indexKey, query))
        .sort((a, b) => compareKeys(a.indexKey, b.indexKey) || compareKeys(a.primaryKey, b.primaryKey));

      return {
        name: index.name,
        keyPath: index.keyPath,
        unique: index.unique,
        multiEntry: index.multiEntry,
        objectStore: handle,
        get: query => request(() => {
          const entry = indexedEntries(query)[0];
          return entry ? structuredCopy(entry.value) : undefined;
        }),
        getKey: query => request(() => {
          const entry = indexedEntries(query)[0];
          return entry ? entry.primaryKey : undefined;
        }),
        getAll: (query, count) => request(() => {
          const values = indexedEntries(query).map(entry => structuredCopy(entry.value));
          return count === undefined ? values : values.slice(0, count);
        }),
        getAllKeys: (query, count) => request(() => {
          const keys = indexedEntries(query).map(entry => entry.primaryKey);
          return count === undefined ? keys : keys.slice(0, count);
        }),
        count: query => request(() => indexedEntries(query).length)
      };
    }
  };

  return handle;
}

/**
 * Creates a transaction over the given stores. `complete` fires once every
 * request issued through the transaction has settled.
 */
function createTransaction(database, connection, storeNames, mode) {
  const names = [].concat(storeNames);
  names.forEach(name => {
    if (!database.stores.has(name)) {
      throw storageError('NotFoundError', `Object store "${name}" does not exist`);
    }
  });

  const listeners = new Map();
  const transaction = {
    mode,
    db: connection,
    error: null,
    finished: false,
    pending: 0,
    oncomplete: null,
    onerror: null,
    onabort: null,
    get objectStoreNames() {
      const list = [...names];
      list.contains = name => names.includes(name);
      return list;
    },
    objectStore(name) {
      if (!names.includes(name)) {
        throw storageError('NotFoundError', `Object store "${name}" is not part of this transaction`);
      }
      return createStoreHandle(database.stores.get(name), transaction);
    },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      if (listeners.has(type)) listeners.get(type).delete(listener);
    },
    dispatch(type) {
      const event = {
        type,
        target: transaction
      };
      const handler = transaction[`on${type}`];
      if (typeof handler === 'function') handler.call(transaction, event);
      if (listeners.has(type)) {
        [...listeners.get(type)].forEach(listener => listener.call(transaction, event));
      }
    },
    abort() {
      if (transaction.finished) return;
      transaction.finished = true;
      transaction.error = storageError('AbortError', 'The transaction was aborted');
      setTimeout(() => transaction.dispatch('abort'), 0);
    },
    // Called by each request when it settles; completes once the queue drains
    settleOne() {
      transaction.pending -= 1;
      if (transaction.pending === 0 && !transaction.finished) {
        setTimeout(() => {
          if (transaction.pending === 0 && !transaction.finished) {
            transaction.finished = true;
            transaction.dispatch('complete');
          }
        }, 0);
      }
    }
  };

  // A transaction with no requests completes on its own, as in the browser
  setTimeout(() => {
    if (transaction.pending === 0 && !transaction.finished) {
      transaction.finished = true;
      transaction.dispatch('complete');
    }
  }, 0);

  return transaction;
}

/**
 * Creates the IDBDatabase-like connection object for one open() call.
 */
function createConnection(database, factoryState) {
  let closed = false;
  let upgradeTransaction = null;

  const connection = {
    get name() {
      return database.name;
    },
    get version() {
      return database.version;
    },
    get objectStoreNames() {
      const names = [...database.stores.keys()];
      names.contains = name => database.stores.has(name);
      return names;
    },
    onversionchange: null,
    onclose: null,

    createObjectStore(name, { keyPath = null, autoIncrement = false } = {}) {
      if (!upgradeTransaction) {
        throw storageError('InvalidStateError', 'Object stores can only be created during a version change');
      }
      if (database.stores.has(name)) {
        throw storageError('ConstraintError', `Object store "${name}" already exists`);
      }
      database.stores.set(name, {
        name,
        keyPath,
        autoIncrement,
        records: new Map(),
        indexes: new Map(),
        nextKey: 1
      });
      upgradeTransaction.storeNames.push(name);
      return createStoreHandle(database.stores.get(name), upgradeTransaction);
    },

    deleteObjectStore(name) {
      if (!upgradeTransaction) {
        throw storageError('InvalidStateError', 'Object stores can only be deleted during a version change');
      }
      if (!database.stores.delete(name)) {
        throw storageError('NotFoundError', `Object store "${name}" does not exist`);
      }
    },

    transaction(storeNames, mode = 'readonly') {
      if (closed) {
        throw storageError('InvalidStateError', 'The database connection is closed');
      }
      if (!['readonly', 'readwrite'].includes(mode)) {
        throw storageError('TypeError', `Invalid transaction mode "${mode}"`);
      }
      return createTransaction(database, connection, storeNames, mode);
    },

    close() {
      closed = true;
      factoryState.connections.delete(connection);
    },

    // Internal: called by open() while running the upgrade callback
    beginUpgrade() {
      upgradeTransaction = {
        mode: 'versionchange',
        db: connection,
        finished: false,
        pending: 0,
        storeNames: [],
        objectStore(name) {
          return createStoreHandle(database.stores.get(name), upgradeTransaction);
        },
        settleOne() {
          upgradeTransaction.pending -= 1;
        },
        abort() {
          upgradeTransaction.finished = true;
        }
      };
      return upgradeTransaction;
    },
    endUpgrade() {
      upgradeTransaction = null;
    }
  };

  factoryState.connections.add(connection);
  return connection;
}

/**
 * In-memory implementation of the IDBFactory surface (open, deleteDatabase,
 * databases, cmp). Databases persist for the lifetime of the page/process and
 * are shared between open() calls, just like the browser's implementation is
 * shared between scripts; only durability across reloads is missing.
 */
export function createMemoryIndexedDB() {
  const state = {
    databases: new Map(),
    connections: new Set()
  };

  return {
    isEmulated: true,

    open(name, version) {
      if (version !== undefined && (!Number.isInteger(version) || version < 1)) {
        throw new TypeError('The version must be a positive integer');
      }
      const request = createRequest();

      setTimeout(() => {
        try {
          if (!state.databases.has(name)) {
            state.databases.set(name, {
              name,
              version: 0,
              stores: new Map()
            });
          }
          const database = state.databases.get(name);
          const requested = version === undefined ? Math.max(database.version, 1) : version;

          if (requested < database.version) {
            throw storageError(
              'VersionError',
              `The requested version (${requested}) is less than the existing version (${database.version})`
            );
          }

          const connection = createConnection(database, state);
          request.result = connection;

          if (requested > database.version) {
            const oldVersion = database.version;
            database.version = requested;
            request.transaction = connection.beginUpgrade();
            request.dispatch('upgradeneeded', {
              oldVersion,
              newVersion: requested
            });
            connection.endUpgrade();
            request.transaction = null;
          }

          request.readyState = 'done';
          request.dispatch('success');
        } catch (error) {
          request.error = error;
          request.readyState = 'done';
          request.dispatch('error', { error });
        }
      }, 0);

      return request;
    },

    deleteDatabase(name) {
      const request = createRequest();
      return settleRequest(request, () => {
        state.databases.delete(name);
        return undefined;
      });
    },

    databases() {
      return Promise.resolve([...state.databases.values()].map(database => ({
        name: database.name,
        version: database.version
      })));
    },

    cmp: compareKeys,

    // Test helper: wipe everything
    reset() {
      state.databases.clear();
      state.connections.clear();
    }
  };
}

const nativeIndexedDB = getNativeIndexedDB();

/**
 * The IndexedDB factory this module works with: the browser's own implementation
 * when present, otherwise the in-memory emulation.
 */
export const indexedDB = nativeIndexedDB || createMemoryIndexedDB();

// Register the fallback so standard code (window.indexedDB.open(...)) keeps running in
// Node, jsdom and other environments without a native IndexedDB.
if (typeof window !== 'undefined' && !nativeIndexedDB) {
  try {
    Object.defineProperty(window, 'indexedDB', {
      value: indexedDB,
      configurable: true,
      writable: true
    });
  } catch (error) {
    // Ignore: some environments freeze the global object
  }
}

/**
 * Turns an IDBRequest (native or emulated) into a Promise.
 */
export function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || storageError('UnknownError', 'IndexedDB request failed'));
  });
}

/**
 * Resolves when the transaction completes; rejects on error or abort.
 */
export function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || storageError('UnknownError', 'Transaction failed'));
    transaction.onabort = () => reject(transaction.error || storageError('AbortError', 'Transaction aborted'));
  });
}

/**
 * Opens (and, when the version increases, upgrades) a database.
 * `upgrade(db, oldVersion, newVersion, transaction)` receives the connection in
 * versionchange mode so it can create object stores and indexes.
 */
export function openDatabase(name, version = 1, { upgrade = () => {}, factory = indexedDB } = {}) {
  return new Promise((resolve, reject) => {
    const request = factory.open(name, version);
    request.onupgradeneeded = event => {
      upgrade(request.result, event.oldVersion, event.newVersion, request.transaction);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(storageError('AbortError', 'Database open was blocked by another connection'));
  });
}

/**
 * Promise-based repository for one object store. Works with the native API
 * and with the emulation because both speak IDBRequest.
 */
export function createRepository(db, storeName) {
  function run(mode, operation) {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = promisifyRequest(operation(store));
    return transactionDone(transaction).then(() => result);
  }

  return {
    add: value => run('readwrite', store => store.add(value)),
    put: value => run('readwrite', store => store.put(value)),
    get: key => run('readonly', store => store.get(key)),
    getAll: (query, count) => run('readonly', store => store.getAll(query, count)),
    count: query => run('readonly', store => store.count(query)),
    remove: key => run('readwrite', store => store.delete(key)),
    clear: () => run('readwrite', store => store.clear()),
    findBy: (indexName, query) => run('readonly', store => store.index(indexName).getAll(query)),
    findOneBy: (indexName, query) => run('readonly', store => store.index(indexName).get(query))
  };
}

/**
 * IndexedDB
 */
export const indexedDBConcept = {
  concept: 'IndexedDB',
  explanation: `
    IndexedDB is a transactional, asynchronous object database built into the browser. It
    stores structured JavaScript values (objects, arrays, Dates, Blobs, typed arrays) via the
    structured clone algorithm, so no JSON serialisation is needed. Data is organised into
    databases with a version number, object stores (like tables) keyed by a key path or
    generated key, and indexes for querying on other properties. Every read or write happens
    inside a transaction that auto-commits when its requests finish. The API is event-based
    (IDBRequest with onsuccess/onerror), which is why almost everyone wraps it in Promises.
    Quotas are far larger than Web Storage (hundreds of MB to GBs) and work runs off the
    main thread, making it the right choice for offline-first apps and large datasets.
  `,
  content: indexedDBContent,

  examples: {
    createMemoryIndexedDB,
    compareKeys,
    keyRange,
    promisifyRequest,
    transactionDone,
    openDatabase,
    createRepository,

    /**
     * Full workflow: open, define schema, insert, query by index.
     */
    async notesExample(factory = indexedDB) {
      const db = await openDatabase('notes-demo', 1, {
        factory,
        upgrade(database) {
          const store = database.createObjectStore('notes', {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('byTag', 'tag');
        }
      });
      const notes = createRepository(db, 'notes');
      await notes.clear();
      await notes.add({
        title: 'Learn IndexedDB',
        tag: 'study'
      });
      await notes.add({
        title: 'Buy milk',
        tag: 'errand'
      });
      await notes.add({
        title: 'Read the spec',
        tag: 'study'
      });
      const studyNotes = await notes.findBy('byTag', 'study');
      const total = await notes.count();
      db.close();
      return {
        total,
        studyTitles: studyNotes.map(note => note.title)
      };
    },

    rawApi: `
// The raw, event-based API
const request = indexedDB.open('shop', 2);

request.onupgradeneeded = event => {
  const db = request.result;
  // Runs only when the version increases: build or migrate the schema here
  if (event.oldVersion < 1) {
    const products = db.createObjectStore('products', { keyPath: 'sku' });
    products.createIndex('byCategory', 'category');
  }
  if (event.oldVersion < 2) {
    db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
  }
};

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction(['products'], 'readwrite');
  tx.objectStore('products').put({ sku: 'A1', name: 'Keyboard', category: 'input' });
  tx.oncomplete = () => console.log('saved');
  tx.onerror = () => console.error(tx.error);
};

request.onerror = () => console.error('open failed', request.error);
    `,

    rangeQueries: `
// Indexes and key ranges answer "SQL-ish" questions without loading everything
const tx = db.transaction('orders', 'readonly');
const byDate = tx.objectStore('orders').index('byDate');

const lastWeek = IDBKeyRange.lowerBound(Date.now() - 7 * 24 * 3600 * 1000);
byDate.getAll(lastWeek).onsuccess = event => renderOrders(event.target.result);

// Cursors stream large result sets one record at a time
byDate.openCursor(null, 'prev').onsuccess = event => {
  const cursor = event.target.result;
  if (!cursor) return;          // done
  console.log(cursor.value);
  cursor.continue();
};
    `,

    versioningAndBlocking: `
// Other open tabs hold the old version; ask them to close or the upgrade is "blocked"
const request = indexedDB.open('shop', 3);
request.onblocked = () => alert('Please close other tabs of this app to update');

request.onsuccess = () => {
  const db = request.result;
  db.onversionchange = () => {
    db.close();                 // let a newer tab upgrade the schema
    location.reload();
  };
};
    `
  },

  keyPoints: [
    'Stores real JavaScript values via structured clone: no JSON.stringify needed',
    'Schema (object stores, indexes) changes only inside onupgradeneeded when the version increases',
    'All reads and writes go through transactions that auto-commit; keep them short and never await unrelated work inside',
    'Requests are event-based; wrap them in Promises (or use a library such as idb) for async/await',
    'Indexes plus key ranges and cursors give efficient queries over large datasets',
    'Asynchronous and large-capacity: the right tool for offline-first apps, caches of API data and files'
  ]
};

/**
 * Picks a storage mechanism from a set of requirements.
 */
export function chooseStorage({
  persistent = true,
  sizeKB = 1,
  structured = false,
  queryable = false,
  perTab = false,
  binary = false
} = {}) {
  if (perTab && !persistent) {
    return {
      choice: 'sessionStorage',
      reason: 'Data is only needed while this tab is open'
    };
  }
  if (queryable || binary || sizeKB > 1024) {
    return {
      choice: 'IndexedDB',
      reason: 'Needs large capacity, binary values or indexed queries'
    };
  }
  if (structured && sizeKB > 256) {
    return {
      choice: 'IndexedDB',
      reason: 'Large structured data is cheaper to store without JSON round-trips'
    };
  }
  return {
    choice: persistent ? 'localStorage' : 'sessionStorage',
    reason: persistent ? 'Small data that should survive reloads' : 'Small temporary data'
  };
}

/**
 * Comparison guide
 */
export const storageComparison = {
  concept: 'Choosing a Storage Mechanism',
  explanation: `
    The three mechanisms differ in lifetime, scope, capacity, data model and whether they
    block the main thread. Cookies are a fourth option, but they travel with every HTTP
    request and are best reserved for authentication handled by the server. Choose by asking
    how long the data must live, how big it is and whether it must be queried.
  `,

  table: [
    {
      feature: 'Lifetime',
      localStorage: 'Until cleared',
      sessionStorage: 'Tab session',
      indexedDB: 'Until cleared'
    },
    {
      feature: 'Scope',
      localStorage: 'Origin, all tabs',
      sessionStorage: 'Origin, one tab',
      indexedDB: 'Origin, all tabs'
    },
    {
      feature: 'Capacity',
      localStorage: '~5 MB',
      sessionStorage: '~5 MB',
      indexedDB: 'Hundreds of MB to GB (quota-managed)'
    },
    {
      feature: 'Data types',
      localStorage: 'Strings only',
      sessionStorage: 'Strings only',
      indexedDB: 'Structured clone (objects, Blobs, Dates, typed arrays)'
    },
    {
      feature: 'API style',
      localStorage: 'Synchronous',
      sessionStorage: 'Synchronous',
      indexedDB: 'Asynchronous, transactional'
    },
    {
      feature: 'Queries',
      localStorage: 'Key lookup only',
      sessionStorage: 'Key lookup only',
      indexedDB: 'Key ranges, indexes, cursors'
    },
    {
      feature: 'Web Worker access',
      localStorage: 'No',
      sessionStorage: 'No',
      indexedDB: 'Yes'
    }
  ],

  examples: {
    chooseStorage,

    decisionGuide: `
// localStorage: small, persistent, read on every visit
localStorage.setItem('theme', 'dark');

// sessionStorage: temporary, tab-specific
sessionStorage.setItem('checkoutStep', '3');

// IndexedDB: large, structured, queryable, available in workers
const db = await openDatabase('app', 1, {
  upgrade: database => database.createObjectStore('articles', { keyPath: 'id' })
});
await createRepository(db, 'articles').put({ id: 1, title: 'Offline first', body: '...' });
    `
  },

  keyPoints: [
    'localStorage for small persistent data such as preferences, theme and language',
    'sessionStorage for draft form data, wizard steps and settings that should die with the tab',
    'IndexedDB for large datasets, offline-first app state, files and anything that must be queried',
    'None of them is secure storage: everything is readable by any script on the origin',
    'Use the Cache API (with Service Workers) for HTTP responses rather than storing them by hand'
  ]
};

/**
 * Feature detection summary for the current environment.
 */
export const storageSupport = {
  localStorage: isStorageUsable(getNativeStorage('localStorage')),
  sessionStorage: isStorageUsable(getNativeStorage('sessionStorage')),
  indexedDB: Boolean(nativeIndexedDB)
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: 'storage_ex1',
    title: 'Save and Load a Theme',
    difficulty: 'easy',
    description: 'Use localStorage to remember the user\'s theme: saveTheme(name) stores it and loadTheme() returns it, defaulting to "light" when nothing is stored.',
    template: `
function saveTheme(name) {
  // store the theme under the key "theme"
}

function loadTheme() {
  // return the stored theme, or "light" when there is none
}

saveTheme('dark');
console.log(loadTheme()); // "dark"
    `,
    tests: [
      {
        description: 'Should call localStorage.setItem',
        check: code => /localStorage\.setItem\(\s*['"]theme['"]/.test(code)
      },
      {
        description: 'Should default to light',
        check: code => /['"]light['"]/.test(code) && /getItem/.test(code)
      }
    ],
    hints: [
      'getItem returns null for a missing key',
      'The nullish coalescing operator (??) is perfect for defaults'
    ]
  },
  {
    id: 'storage_ex2',
    title: 'Store an Object with JSON',
    difficulty: 'easy',
    description: 'localStorage only stores strings. Write saveUser(user) and loadUser() that serialise an object with JSON.stringify and revive it with JSON.parse.',
    template: `
function saveUser(user) {
  // serialise the object before storing it
}

function loadUser() {
  // parse the stored string back into an object, or return null
}

saveUser({ name: 'Alice', age: 28 });
console.log(loadUser().name); // "Alice"
    `,
    tests: [
      {
        description: 'Should serialise with JSON.stringify',
        check: code => /JSON\.stringify\(/.test(code)
      },
      {
        description: 'Should parse with JSON.parse',
        check: code => /JSON\.parse\(/.test(code)
      }
    ],
    hints: [
      'JSON.parse(null) returns null, but JSON.parse(undefined) throws',
      'Guard the parse so a missing key does not crash'
    ]
  },
  {
    id: 'storage_ex3',
    title: 'Persist a Wizard Step in sessionStorage',
    difficulty: 'easy',
    description: 'Use sessionStorage so a multi-step form remembers its current step across reloads but forgets it when the tab closes.',
    template: `
function setStep(step) {
  // store the step number
}

function getStep() {
  // return the stored step as a NUMBER, defaulting to 1
}

setStep(3);
console.log(getStep() + 1); // 4, not "31"
    `,
    tests: [
      {
        description: 'Should use sessionStorage',
        check: code => /sessionStorage\.setItem/.test(code) && /sessionStorage\.getItem/.test(code)
      },
      {
        description: 'Should convert the stored value to a number',
        check: code => /Number\(|parseInt\(/.test(code)
      }
    ],
    hints: [
      'Everything comes back as a string, so convert on the way out',
      'parseInt(value, 10) or Number(value) both work'
    ]
  },
  {
    id: 'storage_ex4',
    title: 'Safe JSON Storage Wrapper',
    difficulty: 'medium',
    description: 'Build createJSONStorage(storage) with get(key, fallback) and set(key, value) that works for both localStorage and sessionStorage and returns the fallback when the stored JSON is corrupt.',
    template: `
function createJSONStorage(storage) {
  return {
    set(key, value) {
      // stringify and store
    },
    get(key, fallback = null) {
      // return fallback when missing OR when JSON.parse throws
    },
    remove(key) {
      // ...
    }
  };
}

const local = createJSONStorage(localStorage);
const session = createJSONStorage(sessionStorage);
local.set('prefs', { theme: 'dark' });
console.log(local.get('prefs').theme); // "dark"
console.log(session.get('missing', [])); // []
    `,
    tests: [
      {
        description: 'Should guard JSON.parse with try/catch',
        check: code => /try\s*\{[\s\S]*JSON\.parse[\s\S]*\}\s*catch/.test(code)
      },
      {
        description: 'Should return the fallback',
        check: code => /return\s+fallback/.test(code)
      }
    ],
    hints: [
      'Check for null before parsing',
      'Because the wrapper takes the storage object as a parameter, it works for any Storage implementation'
    ]
  },
  {
    id: 'storage_ex5',
    title: 'Cache API Responses with Expiry',
    difficulty: 'medium',
    description: 'Implement cachedFetch(url, ttlMs) that stores each response in localStorage together with a timestamp and only hits the network when the cached copy is missing or older than ttlMs.',
    template: `
async function cachedFetch(url, ttlMs = 60000) {
  const cacheKey = 'cache:' + url;
  // 1. read the cache entry { data, savedAt }
  // 2. if it exists and Date.now() - savedAt < ttlMs, return data
  // 3. otherwise fetch, store { data, savedAt: Date.now() } and return data
}
    `,
    tests: [
      {
        description: 'Should store a timestamp',
        check: code => /Date\.now\(\)/.test(code)
      },
      {
        description: 'Should compare age with ttl',
        check: code => /ttlMs/.test(code) && /</.test(code)
      },
      {
        description: 'Should read and write localStorage',
        check: code => /localStorage\.getItem/.test(code) && /localStorage\.setItem/.test(code)
      }
    ],
    hints: [
      'Store the timestamp inside the JSON alongside the data',
      'Wrap setItem in try/catch: a full quota must not break fetching'
    ]
  },
  {
    id: 'storage_ex6',
    title: 'Sync Theme Across Tabs',
    difficulty: 'medium',
    description: 'Listen for the storage event so that when one tab changes the theme in localStorage every other open tab updates its document immediately.',
    template: `
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme); // the storage event does NOT fire in the tab that made the change
}

// Add a "storage" listener that applies event.newValue when event.key === 'theme'
    `,
    tests: [
      {
        description: 'Should listen for the storage event',
        check: code => /addEventListener\(\s*['"]storage['"]/.test(code)
      },
      {
        description: 'Should check the event key and use newValue',
        check: code => /event\.key|e\.key/.test(code) && /newValue/.test(code)
      }
    ],
    hints: [
      'The event fires only in other tabs of the same origin',
      'event.key is null when clear() was called'
    ]
  },
  {
    id: 'storage_ex7',
    title: 'Open an IndexedDB Database with a Schema',
    difficulty: 'medium',
    description: 'Write openTasksDB() that opens an IndexedDB database named "tasks" at version 1, creates a "tasks" object store with an auto-incrementing id and an index on "status" during onupgradeneeded, and resolves with the connection.',
    template: `
function openTasksDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tasks', 1);

    request.onupgradeneeded = () => {
      // create the "tasks" store (keyPath 'id', autoIncrement) and a "byStatus" index
    };

    // resolve with request.result on success, reject with request.error on error
  });
}
    `,
    tests: [
      {
        description: 'Should create the object store in onupgradeneeded',
        check: code => /createObjectStore\(\s*['"]tasks['"]/.test(code)
      },
      {
        description: 'Should create the status index',
        check: code => /createIndex\(/.test(code) && /status/.test(code)
      },
      {
        description: 'Should resolve and reject the promise',
        check: code => /resolve\(/.test(code) && /reject\(/.test(code)
      }
    ],
    hints: [
      'onupgradeneeded runs before onsuccess and only when the version increases',
      'request.result is the IDBDatabase in both handlers'
    ]
  },
  {
    id: 'storage_ex8',
    title: 'Promise Wrapper for IndexedDB Requests',
    difficulty: 'hard',
    description: 'Write promisify(request) and then a saveTask(db, task) function that uses an IndexedDB readwrite transaction, awaits the store.add request, and resolves only after the transaction completes.',
    template: `
function promisify(request) {
  return new Promise((resolve, reject) => {
    // hook onsuccess / onerror
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    // hook oncomplete / onerror / onabort
  });
}

async function saveTask(db, task) {
  const tx = db.transaction('tasks', 'readwrite');
  // add the task, wait for the request AND the transaction
  // return the generated key
}
    `,
    tests: [
      {
        description: 'Should wrap onsuccess and onerror',
        check: code => /onsuccess/.test(code) && /onerror/.test(code)
      },
      {
        description: 'Should await transaction completion',
        check: code => /oncomplete/.test(code)
      },
      {
        description: 'Should use a readwrite transaction',
        check: code => /['"]readwrite['"]/.test(code)
      }
    ],
    hints: [
      'A request resolving does not mean the data is committed; wait for tx.oncomplete',
      'Never await something unrelated between issuing requests: the transaction auto-commits when idle'
    ]
  },
  {
    id: 'storage_ex9',
    title: 'Offline-First Task Queue',
    difficulty: 'hard',
    description: 'Build a queue in IndexedDB that records actions while offline and replays them in insertion order when the browser comes back online, deleting each entry after it syncs successfully.',
    template: `
async function enqueue(db, action) {
  // add { action, createdAt: Date.now() } to the "outbox" store
}

async function replayOutbox(db, send) {
  // read all entries in key order, send() each one, delete it on success,
  // stop at the first failure so order is preserved
}

window.addEventListener('online', () => replayOutbox(db, sendToServer));
    `,
    tests: [
      {
        description: 'Should react to the online event',
        check: code => /addEventListener\(\s*['"]online['"]/.test(code)
      },
      {
        description: 'Should delete synced entries',
        check: code => /\.delete\(/.test(code)
      },
      {
        description: 'Should read entries with getAll or a cursor',
        check: code => /getAll\(|openCursor\(/.test(code)
      }
    ],
    hints: [
      'An autoIncrement key gives you insertion order for free',
      'Use one transaction per entry so a failure leaves earlier deletions committed'
    ]
  },
  {
    id: 'storage_ex10',
    title: 'Storage Strategy Selector',
    difficulty: 'hard',
    description: 'Implement a persist(key, value, options) facade that routes small persistent values to localStorage, per-tab values to sessionStorage and large or binary values to IndexedDB, exposing a single async get/set/remove API.',
    template: `
function createPersistence({ sizeThresholdKB = 256 } = {}) {
  function pick(value, { perTab }) {
    // return 'sessionStorage', 'localStorage' or 'indexedDB'
    // hint: Blob/ArrayBuffer values or JSON larger than the threshold => indexedDB
  }

  return {
    async set(key, value, options = {}) { /* route by pick() */ },
    async get(key) { /* check each backend */ },
    async remove(key) { /* remove from every backend */ }
  };
}
    `,
    tests: [
      {
        description: 'Should mention all three backends',
        check: code => /localStorage/.test(code) && /sessionStorage/.test(code) && /indexedDB/i.test(code)
      },
      {
        description: 'Should measure the serialised size',
        check: code => /JSON\.stringify\([\s\S]*\)\.length|\.size/.test(code)
      },
      {
        description: 'Should expose an async API',
        check: code => /async\s+(set|get|remove)\s*\(/.test(code)
      }
    ],
    hints: [
      'JSON.stringify(value).length approximates UTF-16 size; Blob.size gives bytes',
      'Record which backend holds each key so get() does not have to search all three'
    ]
  }
];

/**
 * Progress tracking
 */
export const progressConfig = {
  totalConcepts: 4,
  conceptsCompleted: 0,
  exercises: {
    total: exercises.length,
    completed: 0
  },

  updateProgress(conceptId, exerciseId = null) {
    if (exerciseId) {
      this.exercises.completed += 1;
    } else {
      this.conceptsCompleted += 1;
    }

    const conceptProgress = (this.conceptsCompleted / this.totalConcepts) * 100;
    const exerciseProgress = (this.exercises.completed / this.exercises.total) * 100;
    const completedTotal = this.conceptsCompleted + this.exercises.completed;
    const overallTotal = this.totalConcepts + this.exercises.total;

    return {
      conceptProgress,
      exerciseProgress,
      overallProgress: (completedTotal / overallTotal) * 100
    };
  }
};

export default {
  config: storageConfig,
  concepts: {
    localStorage: localStorageConcept,
    sessionStorage: sessionStorageConcept,
    indexedDB: indexedDBConcept,
    comparison: storageComparison
  },
  storage: {
    localStorage,
    sessionStorage,
    indexedDB,
    support: storageSupport
  },
  exercises,
  progress: progressConfig
};
