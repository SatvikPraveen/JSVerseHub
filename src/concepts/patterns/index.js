// File: src/concepts/patterns/index.js
// Design Patterns - Module, Observer, Singleton and other reusable solutions, implemented as runnable examples

import { modulePatternContent } from './module-pattern';
import { observerContent } from './observer';
import { singletonContent } from './singleton';

export const patternsConfig = {
  title: 'Design Patterns',
  description:
    'Recognise, implement and choose between the classic design patterns as they appear in idiomatic JavaScript',
  difficulty: 'intermediate',
  estimatedTime: '3-4 hours',
  topics: [
    'Module Pattern & Encapsulation',
    'Observer Pattern & Event Emitters',
    'Singleton Pattern & Shared State',
    'Factory Pattern',
    'Decorator Pattern',
    'Strategy Pattern',
    'Proxy Pattern',
    'Command Pattern'
  ],
  prerequisites: ['Basics', 'Functions', 'Objects', 'OOP']
};

// Alias used by the concept loader and several test suites
export const conceptConfig = patternsConfig;

/**
 * Small, dependency-free string hash (djb2). Used so the module-pattern user
 * example never keeps the plain-text password in memory.
 */
function hashString(input) {
  let hash = 5381;
  const text = String(input);
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(16);
}

/**
 * Module Pattern
 * Closures give JavaScript real privacy: anything declared inside the factory
 * (or IIFE) that is not returned cannot be reached from the outside.
 */
export const modulePattern = {
  concept: 'Module Pattern',
  explanation: `
    The Module Pattern uses a function scope (a factory function or an IIFE) to create
    private state and private helpers, and returns an object that exposes only the public
    API. Because the returned methods close over the private variables, the state survives
    between calls but can never be read or mutated directly. Each call to the factory
    produces an independent module instance, unlike the Singleton pattern. ES modules give
    file-level privacy for free, but the closure-based module pattern is still the tool for
    per-instance privacy without classes or #private fields.
  `,
  content: modulePatternContent,

  examples: {
    /**
     * Counter with a private "count" variable.
     */
    createCounter(initialValue = 0) {
      let count = initialValue;

      return {
        increment() {
          count += 1;
          return count;
        },
        decrement() {
          count -= 1;
          return count;
        },
        reset() {
          count = initialValue;
          return count;
        },
        getValue() {
          return count;
        }
      };
    },

    /**
     * Bank account whose balance can only change through validated operations.
     */
    createBankAccount(initialBalance = 0) {
      if (typeof initialBalance !== 'number' || initialBalance < 0) {
        throw new RangeError('Initial balance must be a non-negative number');
      }

      let balance = initialBalance;
      const transactions = [];

      function record(type, amount) {
        transactions.push({
          type,
          amount,
          balance,
          at: Date.now()
        });
      }

      return {
        deposit(amount) {
          if (typeof amount !== 'number' || amount <= 0) {
            throw new RangeError('Deposit amount must be a positive number');
          }
          balance += amount;
          record('deposit', amount);
          return balance;
        },
        withdraw(amount) {
          if (typeof amount !== 'number' || amount <= 0) {
            throw new RangeError('Withdrawal amount must be a positive number');
          }
          if (amount > balance) {
            throw new RangeError('Insufficient funds');
          }
          balance -= amount;
          record('withdraw', amount);
          return balance;
        },
        getBalance() {
          return balance;
        },
        // Return a copy so callers cannot mutate the private ledger
        getTransactions() {
          return transactions.map(entry => ({ ...entry }));
        }
      };
    },

    /**
     * FIFO queue that hides its backing array.
     */
    createQueue() {
      const items = [];

      return {
        enqueue(item) {
          items.push(item);
          return items.length;
        },
        dequeue() {
          return items.length === 0 ? undefined : items.shift();
        },
        peek() {
          return items[0];
        },
        size() {
          return items.length;
        },
        isEmpty() {
          return items.length === 0;
        },
        toArray() {
          return [...items];
        }
      };
    },

    /**
     * User record that never exposes the password, not even hashed.
     */
    createUser(name, password) {
      if (!name || !password) {
        throw new TypeError('createUser requires a name and a password');
      }

      let passwordHash = hashString(password);
      let failedAttempts = 0;

      return {
        getName() {
          return name;
        },
        validatePassword(candidate) {
          const valid = hashString(candidate) === passwordHash;
          failedAttempts = valid ? 0 : failedAttempts + 1;
          return valid;
        },
        changePassword(currentPassword, nextPassword) {
          if (hashString(currentPassword) !== passwordHash) {
            return false;
          }
          passwordHash = hashString(nextPassword);
          return true;
        },
        getFailedAttempts() {
          return failedAttempts;
        }
      };
    },

    iifeNamespace: `
// Classic IIFE module: runs once, exposes a namespace object
const MathUtils = (function () {
  const PRECISION = 2;                     // private constant

  function round(value) {                  // private helper
    return Number(value.toFixed(PRECISION));
  }

  return {                                 // public API
    average(numbers) {
      const total = numbers.reduce((sum, n) => sum + n, 0);
      return round(total / numbers.length);
    }
  };
})();

MathUtils.average([1, 2, 4]); // 2.33
MathUtils.PRECISION;          // undefined - private
    `,

    revealingModule: `
// Revealing Module Pattern: define everything privately, then "reveal" chosen members
function createTimer() {
  let ticks = 0;
  const listeners = new Set();

  function tick() {
    ticks += 1;
    listeners.forEach(fn => fn(ticks));
  }

  function onTick(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function getTicks() {
    return ticks;
  }

  // The object literal maps public names to private implementations
  return { tick, onTick, getTicks };
}
    `
  },

  keyPoints: [
    'Privacy comes from closures: variables declared in the factory are unreachable from outside',
    'Return only what callers need; return copies of internal arrays and objects',
    'Every factory call creates a new, independent instance with its own private state',
    'IIFE modules run once and are effectively singletons; factory modules can be instantiated many times',
    'ES modules provide file-level privacy; the module pattern provides per-instance privacy'
  ]
};

/**
 * Observer Pattern
 * A subject keeps a list of observers and notifies them when something happens.
 */
export const observerPattern = {
  concept: 'Observer Pattern',
  explanation: `
    The Observer pattern defines a one-to-many relationship: when a subject changes, every
    subscribed observer is notified automatically. The subject knows nothing about what the
    observers do, which decouples the producer of an event from its consumers. Event emitters,
    DOM events, RxJS observables and state-management stores are all variations of this
    pattern. Two details matter in practice: subscribing must return a way to unsubscribe
    (to avoid memory leaks), and notifications should iterate over a snapshot so observers
    can safely unsubscribe during a notification.
  `,
  content: observerContent,

  examples: {
    /**
     * Topic-based event emitter (publish/subscribe).
     */
    createEventEmitter() {
      const topics = new Map();

      function getObservers(event) {
        if (!topics.has(event)) {
          topics.set(event, new Set());
        }
        return topics.get(event);
      }

      function unsubscribe(event, callback) {
        const observers = topics.get(event);
        if (!observers) {
          return false;
        }
        const removed = observers.delete(callback);
        if (observers.size === 0) {
          topics.delete(event);
        }
        return removed;
      }

      function subscribe(event, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Observer callback must be a function');
        }
        getObservers(event).add(callback);
        return () => unsubscribe(event, callback);
      }

      function once(event, callback) {
        const dispose = subscribe(event, payload => {
          dispose();
          callback(payload);
        });
        return dispose;
      }

      function publish(event, payload) {
        const observers = topics.get(event);
        if (!observers) {
          return 0;
        }
        // Iterate over a snapshot so observers may unsubscribe while being notified
        const snapshot = [...observers];
        snapshot.forEach(callback => callback(payload));
        return snapshot.length;
      }

      function hasObservers(event) {
        const observers = topics.get(event);
        return Boolean(observers && observers.size > 0);
      }

      function observerCount(event) {
        const observers = topics.get(event);
        return observers ? observers.size : 0;
      }

      function clear(event) {
        if (event === undefined) {
          topics.clear();
        } else {
          topics.delete(event);
        }
      }

      return {
        subscribe,
        unsubscribe,
        once,
        publish,
        hasObservers,
        observerCount,
        clear
      };
    },

    /**
     * Minimal observable state container (the core idea behind Redux/Zustand stores).
     */
    createDataStore(initialState = {}) {
      let state = { ...initialState };
      const listeners = new Set();

      return {
        getState() {
          return state;
        },
        updateState(partial) {
          const previous = state;
          const patch = typeof partial === 'function' ? partial(previous) : partial;
          state = { ...previous, ...patch };
          [...listeners].forEach(listener => listener(state, previous));
          return state;
        },
        onStateChange(listener) {
          if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
          }
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        listenerCount() {
          return listeners.size;
        }
      };
    },

    /**
     * A single observable value, notifying only when the value actually changes.
     */
    createObservableValue(initialValue) {
      let value = initialValue;
      const observers = new Set();

      return {
        get() {
          return value;
        },
        set(nextValue) {
          if (Object.is(nextValue, value)) {
            return false;
          }
          const previous = value;
          value = nextValue;
          [...observers].forEach(observer => observer(value, previous));
          return true;
        },
        subscribe(observer, { immediate = false } = {}) {
          observers.add(observer);
          if (immediate) {
            observer(value, undefined);
          }
          return () => observers.delete(observer);
        }
      };
    },

    classBasedSubject: `
// Classic GoF structure: Subject + Observer objects with an update() method
class Subject {
  #observers = new Set();

  attach(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer);
  }

  notify(data) {
    for (const observer of this.#observers) {
      observer.update(data);
    }
  }
}

class StockTicker extends Subject {
  #price = 0;

  set price(value) {
    this.#price = value;
    this.notify({ price: value });
  }
}

const ticker = new StockTicker();
ticker.attach({ update: ({ price }) => console.log('Chart redraw at', price) });
ticker.attach({ update: ({ price }) => price > 100 && console.log('Alert!') });
ticker.price = 120; // both observers run
    `
  },

  keyPoints: [
    'Subjects and observers communicate only through the subscribe/notify contract',
    'subscribe() should return an unsubscribe function to prevent leaks',
    'Notify over a snapshot of the observer list so observers can unsubscribe mid-notification',
    'Publish/subscribe adds named topics (channels) on top of the basic observer idea',
    'DOM addEventListener, Node EventEmitter and store.subscribe are all observer implementations'
  ]
};

/**
 * Shared helper for the singleton examples: memoises the first result of a
 * factory so every subsequent call returns the very same object.
 */
function singletonOf(factory) {
  let instance = null;

  function getInstance() {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  }

  // Exposed for tests and hot-reload scenarios; production code rarely needs it
  getInstance.reset = () => {
    instance = null;
  };
  getInstance.isCreated = () => instance !== null;

  return getInstance;
}

/**
 * Class-based singleton: the constructor always returns the cached instance.
 */
export class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    this.createdAt = Date.now();
    Singleton.instance = this;
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  static reset() {
    Singleton.instance = null;
  }
}

/**
 * Singleton Pattern
 */
export const singletonPattern = {
  concept: 'Singleton Pattern',
  explanation: `
    A Singleton guarantees that a piece of state exists exactly once and gives the whole
    application one access point to it. In JavaScript the natural implementation is a closure
    that lazily creates the instance on first access and returns the cached reference after
    that, so "new instances" are never created. Because JavaScript is single-threaded, the
    lazy check needs no locking. Singletons suit loggers, configuration, connection pools and
    caches, but they are global state in disguise: prefer passing dependencies explicitly
    when testability matters, and provide a reset hook for tests.
  `,
  content: singletonContent,

  examples: {
    singletonOf,
    Singleton,

    createSingleton: singletonOf(() => ({
      id: 'app-singleton',
      createdAt: Date.now(),
      describe() {
        return `Singleton created at ${new Date(this.createdAt).toISOString()}`;
      }
    })),

    createLogger: singletonOf(() => {
      const entries = [];
      const levels = ['debug', 'info', 'warn', 'error'];

      function log(level, message, meta) {
        if (!levels.includes(level)) {
          throw new RangeError(`Unknown log level: ${level}`);
        }
        const entry = {
          level,
          message,
          meta,
          at: Date.now()
        };
        entries.push(entry);
        return entry;
      }

      return {
        log,
        debug: (message, meta) => log('debug', message, meta),
        info: (message, meta) => log('info', message, meta),
        warn: (message, meta) => log('warn', message, meta),
        error: (message, meta) => log('error', message, meta),
        getEntries: (level = null) => entries.filter(entry => level === null || entry.level === level),
        count: () => entries.length,
        clear: () => entries.splice(0, entries.length)
      };
    }),

    createCounter: singletonOf(() => {
      let count = 0;
      return {
        increment() {
          count += 1;
          return count;
        },
        decrement() {
          count -= 1;
          return count;
        },
        getValue() {
          return count;
        },
        reset() {
          count = 0;
        }
      };
    }),

    createDatabase: singletonOf(() => {
      let connected = false;
      let connectionCount = 0;
      const tables = new Map();

      return {
        connect() {
          // Idempotent: repeated connect() calls never open a second connection
          if (!connected) {
            connected = true;
            connectionCount += 1;
          }
          return connected;
        },
        disconnect() {
          connected = false;
        },
        isConnected() {
          return connected;
        },
        getConnectionCount() {
          return connectionCount;
        },
        insert(table, row) {
          if (!connected) {
            throw new Error('Database is not connected');
          }
          if (!tables.has(table)) {
            tables.set(table, []);
          }
          tables.get(table).push(row);
          return tables.get(table).length;
        },
        select(table) {
          return [...(tables.get(table) || [])];
        }
      };
    }),

    createConfigManager: singletonOf(() => {
      const settings = new Map();
      const frozenKeys = new Set();

      return {
        set(key, value, { freeze = false } = {}) {
          if (frozenKeys.has(key)) {
            throw new Error(`Config key "${key}" is frozen`);
          }
          settings.set(key, value);
          if (freeze) {
            frozenKeys.add(key);
          }
          return value;
        },
        get(key, fallback = undefined) {
          return settings.has(key) ? settings.get(key) : fallback;
        },
        has(key) {
          return settings.has(key);
        },
        getAll() {
          return Object.fromEntries(settings);
        },
        clear() {
          settings.clear();
          frozenKeys.clear();
        }
      };
    }),

    moduleScopeSingleton: `
// The simplest JavaScript singleton: an ES module is evaluated once per app,
// so a module-level instance is shared by every importer.
// cache.js
const store = new Map();
export const cache = {
  get: key => store.get(key),
  set: (key, value) => store.set(key, value)
};

// a.js and b.js both receive the same "cache" object
import { cache } from './cache.js';
    `
  },

  keyPoints: [
    'Lazy initialisation: the instance is created on first access, then cached',
    'All references point to the same object, so state is shared everywhere',
    'ES modules are singletons by design; a module-level const is often enough',
    'Singletons are global state: they complicate testing, so expose a reset() hook',
    'Prefer dependency injection when more than one instance might ever be needed'
  ]
};

/**
 * Additional creational, structural and behavioural patterns.
 * `patterns` doubles as the catalogue for the whole concept.
 */
export const patterns = {
  concept: 'Design Patterns Catalogue',
  explanation: `
    Design patterns are named, reusable solutions to recurring design problems. They are
    grouped into creational patterns (how objects are made: Factory, Singleton, Builder),
    structural patterns (how objects are composed: Decorator, Proxy, Adapter, Facade) and
    behavioural patterns (how objects communicate: Observer, Strategy, Command, Iterator).
    JavaScript's first-class functions, closures and dynamic objects make most patterns far
    lighter than their classic class-based descriptions.
  `,

  catalog: [
    {
      name: 'Module',
      category: 'creational',
      intent: 'Encapsulate private state behind a public API',
      useWhen: 'You need privacy or a namespace without a class'
    },
    {
      name: 'Observer',
      category: 'behavioural',
      intent: 'Notify many dependents when a subject changes',
      useWhen: 'Components must react to events without knowing the source'
    },
    {
      name: 'Singleton',
      category: 'creational',
      intent: 'Ensure exactly one shared instance',
      useWhen: 'A resource (config, logger, connection) must be shared app-wide'
    },
    {
      name: 'Factory',
      category: 'creational',
      intent: 'Create objects without exposing the concrete construction logic',
      useWhen: 'The concrete type depends on runtime input'
    },
    {
      name: 'Decorator',
      category: 'structural',
      intent: 'Add behaviour to an object dynamically',
      useWhen: 'You want to extend behaviour without subclassing'
    },
    {
      name: 'Strategy',
      category: 'behavioural',
      intent: 'Swap interchangeable algorithms at runtime',
      useWhen: 'Several algorithms solve the same problem'
    },
    {
      name: 'Proxy',
      category: 'structural',
      intent: 'Control access to another object',
      useWhen: 'You need validation, lazy loading, logging or access control'
    },
    {
      name: 'Command',
      category: 'behavioural',
      intent: 'Turn an operation into an object',
      useWhen: 'You need undo/redo, queues or macros'
    }
  ],

  examples: {
    modulePattern,
    observerPattern,
    singletonPattern,

    factory: {
      description: 'A factory centralises object creation so callers depend on an interface, not a constructor',

      createAnimal(type, name = 'Unnamed') {
        const behaviours = {
          dog: {
            sound: 'Woof',
            legs: 4
          },
          cat: {
            sound: 'Meow',
            legs: 4
          },
          bird: {
            sound: 'Tweet',
            legs: 2
          }
        };
        const behaviour = behaviours[type];
        if (!behaviour) {
          throw new TypeError(`Unknown animal type: ${type}`);
        }
        return {
          type,
          name,
          legs: behaviour.legs,
          speak() {
            return `${name} the ${type} says ${behaviour.sound}`;
          }
        };
      },

      createShape(type, dimensions = {}) {
        const builders = {
          circle: ({ radius = 1 }) => ({
            type: 'circle',
            area: () => Math.PI * radius * radius,
            perimeter: () => 2 * Math.PI * radius
          }),
          rectangle: ({ width = 1, height = 1 }) => ({
            type: 'rectangle',
            area: () => width * height,
            perimeter: () => 2 * (width + height)
          }),
          square: ({ side = 1 }) => ({
            type: 'square',
            area: () => side * side,
            perimeter: () => 4 * side
          })
        };
        const build = builders[type];
        if (!build) {
          throw new TypeError(`Unknown shape type: ${type}`);
        }
        return build(dimensions);
      },

      registryFactory: `
// Extensible factory: new product types register themselves
const registry = new Map();

export function registerNotification(type, create) {
  registry.set(type, create);
}

export function createNotification(type, options) {
  const create = registry.get(type);
  if (!create) throw new TypeError(\`No notification type "\${type}"\`);
  return create(options);
}

registerNotification('email', ({ to }) => ({ send: () => \`Emailing \${to}\` }));
registerNotification('sms', ({ phone }) => ({ send: () => \`Texting \${phone}\` }));
      `
    },

    decorator: {
      description: 'Decorators wrap an object or function to add behaviour while preserving the original interface',

      createDecoratedObject() {
        const base = {
          originalMethod(value = 1) {
            return value * 2;
          }
        };

        // Wrap without mutating the original object
        return {
          ...base,
          decoratedMethod(value = 1) {
            const result = base.originalMethod(value);
            return {
              result,
              decoratedBy: 'logging',
              message: `originalMethod(${value}) -> ${result}`
            };
          }
        };
      },

      withLogging(fn, log = () => {}) {
        return function logged(...args) {
          log(`Calling ${fn.name || 'anonymous'} with`, args);
          const result = fn.apply(this, args);
          log(`Result: ${JSON.stringify(result)}`);
          return result;
        };
      },

      withMemoization(fn) {
        const cache = new Map();

        function memoized(...args) {
          const key = JSON.stringify(args);
          if (!cache.has(key)) {
            cache.set(key, fn.apply(this, args));
          }
          return cache.get(key);
        }

        memoized.cache = cache;
        return memoized;
      },

      withRetry(fn, { attempts = 3 } = {}) {
        return function retried(...args) {
          const attempt = remaining =>
            Promise.resolve()
              .then(() => fn.apply(this, args))
              .catch(error => (remaining > 1 ? attempt(remaining - 1) : Promise.reject(error)));
          return attempt(attempts);
        };
      },

      compose(...decorators) {
        return target => decorators.reduceRight((decorated, decorate) => decorate(decorated), target);
      }
    },

    strategy: {
      description:
        'Strategy objects make an algorithm pluggable so the context never changes when a new variant is added',

      createShippingCalculator(initialStrategy = 'standard') {
        const strategies = {
          standard: weight => 5 + weight * 0.5,
          express: weight => 12 + weight * 1.2,
          overnight: weight => 25 + weight * 2
        };
        let current = initialStrategy;

        return {
          setStrategy(name) {
            if (!strategies[name]) {
              throw new RangeError(`Unknown shipping strategy: ${name}`);
            }
            current = name;
          },
          addStrategy(name, calculate) {
            strategies[name] = calculate;
          },
          getStrategy() {
            return current;
          },
          calculate(weight) {
            return Number(strategies[current](weight).toFixed(2));
          }
        };
      },

      createSorter() {
        const strategies = {
          ascending: (a, b) => (a > b ? 1 : -1),
          descending: (a, b) => (a < b ? 1 : -1),
          byLength: (a, b) => String(a).length - String(b).length
        };
        return {
          sort(items, strategy = 'ascending') {
            const compare = typeof strategy === 'function' ? strategy : strategies[strategy];
            if (!compare) {
              throw new RangeError(`Unknown sort strategy: ${strategy}`);
            }
            return [...items].sort(compare);
          }
        };
      }
    },

    proxy: {
      description: 'A proxy stands in for another object to add validation, lazy loading or access control',

      createValidatedObject(target, validators) {
        return new Proxy(target, {
          set(object, property, value) {
            const validate = validators[property];
            if (validate && !validate(value)) {
              throw new TypeError(`Invalid value for "${String(property)}": ${JSON.stringify(value)}`);
            }
            object[property] = value;
            return true;
          }
        });
      },

      createReadOnly(target) {
        return new Proxy(target, {
          set(object, property) {
            throw new TypeError(`Cannot set read-only property "${String(property)}"`);
          },
          deleteProperty(object, property) {
            throw new TypeError(`Cannot delete read-only property "${String(property)}"`);
          }
        });
      },

      createLazy(factory) {
        let real = null;
        return new Proxy(
          {},
          {
            get(ignored, property) {
              if (real === null) {
                real = factory();
              }
              const value = real[property];
              return typeof value === 'function' ? value.bind(real) : value;
            }
          }
        );
      },

      createAccessLog(target) {
        const log = [];
        const proxy = new Proxy(target, {
          get(object, property) {
            log.push({
              action: 'get',
              property
            });
            return object[property];
          },
          set(object, property, value) {
            log.push({
              action: 'set',
              property,
              value
            });
            object[property] = value;
            return true;
          }
        });
        return {
          proxy,
          log
        };
      }
    },

    command: {
      description: 'Commands encapsulate an action and its inverse, enabling undo/redo, queuing and macros',

      createCommand(execute, undo, label = 'command') {
        if (typeof execute !== 'function' || typeof undo !== 'function') {
          throw new TypeError('A command needs execute() and undo() functions');
        }
        return {
          execute,
          undo,
          label
        };
      },

      createCommandManager() {
        const done = [];
        const undone = [];

        return {
          execute(command) {
            const result = command.execute();
            done.push(command);
            undone.length = 0;
            return result;
          },
          undo() {
            const command = done.pop();
            if (!command) {
              return false;
            }
            command.undo();
            undone.push(command);
            return true;
          },
          redo() {
            const command = undone.pop();
            if (!command) {
              return false;
            }
            command.execute();
            done.push(command);
            return true;
          },
          canUndo() {
            return done.length > 0;
          },
          canRedo() {
            return undone.length > 0;
          },
          history() {
            return done.map(command => command.label);
          }
        };
      },

      textEditorExample: `
// Using commands to make a text editor undoable
const editor = { text: '' };
const manager = createCommandManager();

function insert(snippet) {
  return createCommand(
    () => { editor.text += snippet; },
    () => { editor.text = editor.text.slice(0, -snippet.length); },
    \`insert "\${snippet}"\`
  );
}

manager.execute(insert('Hello'));
manager.execute(insert(' world'));
manager.undo();               // editor.text === 'Hello'
manager.redo();               // editor.text === 'Hello world'
      `
    }
  },

  keyPoints: [
    'Creational patterns decide how objects are made; structural patterns how they are composed; behavioural how they interact',
    'Factories hide the concrete type so callers depend on an interface',
    'Decorators and proxies both wrap objects: decorators add behaviour, proxies control access',
    'Strategy replaces long if/else chains with interchangeable function objects',
    'Command objects make operations first-class: they can be queued, logged, undone and replayed'
  ]
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: 'patterns_ex1',
    title: 'Build a Counter Module',
    difficulty: 'easy',
    description:
      'Use the module pattern to build a counter with a private count and public increment, decrement and getValue methods.',
    template: `
function createCounter(start = 0) {
  // Declare the private "count" variable here

  return {
    // increment(), decrement(), getValue()
  };
}

const counter = createCounter(5);
counter.increment();
console.log(counter.getValue()); // 6
console.log(counter.count);      // undefined - stays private
    `,
    tests: [
      {
        description: 'Should declare a private variable inside the factory',
        check: code => /let\s+count/.test(code)
      },
      {
        description: 'Should expose increment, decrement and getValue',
        check: code => /increment/.test(code) && /decrement/.test(code) && /getValue/.test(code)
      }
    ],
    hints: [
      'Variables declared inside createCounter are invisible from outside',
      'The returned methods close over the count variable'
    ]
  },
  {
    id: 'patterns_ex2',
    title: 'Create a Namespace with an IIFE',
    difficulty: 'easy',
    description:
      'Wrap helper functions in an immediately invoked function expression so only a StringUtils namespace object is exposed.',
    template: `
const StringUtils = (function () {
  // private helper: capitalise the first letter of a word
  function capitalizeWord(word) {
    // ...
  }

  return {
    // titleCase(sentence) -> uses capitalizeWord on every word
  };
})();

console.log(StringUtils.titleCase('design patterns rock')); // "Design Patterns Rock"
console.log(typeof StringUtils.capitalizeWord);             // "undefined"
    `,
    tests: [
      {
        description: 'Should use an IIFE',
        check: code => /\(function\s*\(\)\s*\{[\s\S]*\}\)\(\)/.test(code)
      },
      {
        description: 'Should expose titleCase',
        check: code => /titleCase/.test(code)
      }
    ],
    hints: [
      'An IIFE is a function expression followed by ()',
      'Split the sentence on spaces, map each word through capitalizeWord and join'
    ]
  },
  {
    id: 'patterns_ex3',
    title: 'Simple Event Emitter',
    difficulty: 'easy',
    description:
      'Implement subscribe(event, callback) and publish(event, payload) on top of a Map of arrays to practice the observer pattern.',
    template: `
function createEmitter() {
  const topics = new Map();

  return {
    subscribe(event, callback) {
      // add the callback to the topic's list
    },
    publish(event, payload) {
      // call every callback registered for the event
    }
  };
}

const emitter = createEmitter();
emitter.subscribe('greet', name => console.log('Hello, ' + name));
emitter.publish('greet', 'Ada'); // "Hello, Ada"
    `,
    tests: [
      {
        description: 'Should store callbacks per event',
        check: code => /topics\.(get|set|has)\(/.test(code)
      },
      {
        description: 'Should invoke callbacks in publish',
        check: code => /forEach|for\s*\(/.test(code)
      }
    ],
    hints: [
      'Create the array for a topic the first time someone subscribes to it',
      'publish should be a no-op when nobody subscribed'
    ]
  },
  {
    id: 'patterns_ex4',
    title: 'Unsubscribe and once() for the Emitter',
    difficulty: 'medium',
    description:
      'Extend the event emitter so subscribe returns an unsubscribe function and add once(), which removes the observer after its first notification.',
    template: `
function createEmitter() {
  const topics = new Map();

  function subscribe(event, callback) {
    // register, then return a function that removes exactly this callback
  }

  function once(event, callback) {
    // subscribe with a wrapper that unsubscribes itself before calling callback
  }

  function publish(event, payload) {
    // notify a COPY of the observer list so unsubscribing mid-loop is safe
  }

  return { subscribe, once, publish };
}
    `,
    tests: [
      {
        description: 'subscribe should return a function',
        check: code => /return\s*\(\)\s*=>/.test(code) || /return\s+function/.test(code)
      },
      {
        description: 'Should implement once',
        check: code => /function\s+once|once\s*\(/.test(code)
      },
      {
        description: 'Should iterate over a snapshot when publishing',
        check: code => /\[\.\.\./.test(code) || /slice\(\)/.test(code) || /Array\.from/.test(code)
      }
    ],
    hints: [
      'A Set makes removal easy and prevents duplicate subscriptions',
      'once() can be built entirely with subscribe() and the returned unsubscribe function'
    ]
  },
  {
    id: 'patterns_ex5',
    title: 'Singleton Configuration Store',
    difficulty: 'medium',
    description:
      'Write getConfig() so that every call returns the same object, created lazily on the first call, with get/set methods and a reset hook for tests.',
    template: `
const getConfig = (function () {
  let instance = null;

  function create() {
    const values = new Map();
    return {
      set(key, value) { /* ... */ },
      get(key) { /* ... */ }
    };
  }

  function getInstance() {
    // create the instance only once
  }

  getInstance.reset = () => { /* forget the instance */ };
  return getInstance;
})();

getConfig().set('theme', 'dark');
console.log(getConfig().get('theme'));        // "dark"
console.log(getConfig() === getConfig());     // true
    `,
    tests: [
      {
        description: 'Should lazily create the instance',
        check: code => /if\s*\(\s*!instance|instance\s*===\s*null|instance\s*==\s*null/.test(code)
      },
      {
        description: 'Should expose reset',
        check: code => /reset/.test(code)
      }
    ],
    hints: ['The closure variable "instance" survives between calls', 'reset() just sets instance back to null']
  },
  {
    id: 'patterns_ex6',
    title: 'Notification Factory',
    difficulty: 'medium',
    description:
      'Build createNotification(type, options) that returns email, sms or push notification objects sharing a send() interface, and throws for unknown types.',
    template: `
function createNotification(type, options = {}) {
  const creators = {
    email: ({ to }) => ({ type: 'email', send: () => \`Email to \${to}\` }),
    // sms: ...
    // push: ...
  };

  // look up the creator and throw a TypeError when the type is unknown
}

console.log(createNotification('email', { to: 'a@b.c' }).send());
createNotification('fax'); // TypeError
    `,
    tests: [
      {
        description: 'Should define at least three creators',
        check: code => /email/.test(code) && /sms/.test(code) && /push/.test(code)
      },
      {
        description: 'Should throw for unknown types',
        check: code => /throw\s+new\s+\w*Error/.test(code)
      }
    ],
    hints: [
      'An object map of creator functions replaces a switch statement',
      'Every product must expose the same send() method'
    ]
  },
  {
    id: 'patterns_ex7',
    title: 'Memoize with a Decorator',
    difficulty: 'medium',
    description:
      'Write withMemoization(fn), a function decorator that caches results by JSON-serialised arguments and preserves the original this binding.',
    template: `
function withMemoization(fn) {
  const cache = new Map();

  return function memoized(...args) {
    // build a cache key, return the cached value or compute and store it
  };
}

const slowSquare = n => { console.log('computing'); return n * n; };
const fastSquare = withMemoization(slowSquare);
fastSquare(4); // logs "computing"
fastSquare(4); // cached, no log
    `,
    tests: [
      {
        description: 'Should use a Map cache',
        check: code => /new\s+Map\(\)/.test(code)
      },
      {
        description: 'Should preserve this with apply or call',
        check: code => /fn\.apply\(this|fn\.call\(this/.test(code)
      }
    ],
    hints: [
      'JSON.stringify(args) is a simple key for primitive arguments',
      'Return the wrapper as a regular function so "this" can be forwarded'
    ]
  },
  {
    id: 'patterns_ex8',
    title: 'Undo/Redo Command Stack',
    difficulty: 'hard',
    description:
      'Implement a command manager with execute, undo and redo. Executing a new command must clear the redo stack, and undo/redo must return false when nothing is available.',
    template: `
function createCommandManager() {
  const done = [];
  const undone = [];

  return {
    execute(command) {
      // run command.execute(), push to done, clear undone
    },
    undo() {
      // pop from done, run command.undo(), push to undone
    },
    redo() {
      // pop from undone, run command.execute(), push to done
    }
  };
}

const editor = { text: '' };
const manager = createCommandManager();
manager.execute({
  execute: () => { editor.text += 'Hi'; },
  undo: () => { editor.text = editor.text.slice(0, -2); }
});
manager.undo();
console.log(editor.text); // ""
    `,
    tests: [
      {
        description: 'Should keep two stacks',
        check: code => /done\.push/.test(code) && /undone\.push/.test(code)
      },
      {
        description: 'Should clear the redo stack on execute',
        check: code => /undone\.length\s*=\s*0|undone\.splice/.test(code)
      },
      {
        description: 'Should return false when nothing to undo',
        check: code => /return\s+false/.test(code)
      }
    ],
    hints: ['Array.prototype.pop returns undefined for an empty stack', 'A redo is just executing the command again']
  },
  {
    id: 'patterns_ex9',
    title: 'Observable Store with Selectors',
    difficulty: 'hard',
    description:
      'Create a state store whose subscribe(selector, listener) only notifies when the selected slice actually changes (compare with Object.is), combining the observer and module patterns.',
    template: `
function createStore(initialState) {
  let state = initialState;
  const subscriptions = new Set();

  function getState() { return state; }

  function setState(partial) {
    const previous = state;
    state = { ...state, ...partial };
    // notify only subscriptions whose selector(state) !== selector(previous)
  }

  function subscribe(selector, listener) {
    // store { selector, listener }, return an unsubscribe function
  }

  return { getState, setState, subscribe };
}

const store = createStore({ count: 0, user: 'ada' });
store.subscribe(s => s.count, count => console.log('count is', count));
store.setState({ user: 'grace' }); // no log - count unchanged
store.setState({ count: 1 });      // "count is 1"
    `,
    tests: [
      {
        description: 'Should compare selected values with Object.is',
        check: code => /Object\.is\(/.test(code)
      },
      {
        description: 'Should return an unsubscribe function',
        check: code => /return\s*\(\)\s*=>\s*subscriptions\.delete/.test(code) || /subscriptions\.delete/.test(code)
      }
    ],
    hints: [
      'Run every selector against both the previous and the next state',
      'Store the subscription object itself in the Set so it can be deleted later'
    ]
  },
  {
    id: 'patterns_ex10',
    title: 'Validating Proxy',
    difficulty: 'hard',
    description:
      'Use the Proxy API to implement createValidated(target, schema) where each schema entry is a predicate; invalid assignments must throw a TypeError and reads pass through untouched.',
    template: `
function createValidated(target, schema) {
  return new Proxy(target, {
    set(object, property, value) {
      // if schema[property] exists and returns false, throw a TypeError
      // otherwise assign and return true
    }
  });
}

const user = createValidated({}, {
  age: value => Number.isInteger(value) && value >= 0,
  email: value => /^[^@\\s]+@[^@\\s]+$/.test(value)
});

user.age = 30;          // ok
user.email = 'nope';    // TypeError
    `,
    tests: [
      {
        description: 'Should use a Proxy with a set trap',
        check: code => /new\s+Proxy\(/.test(code) && /set\s*\(/.test(code)
      },
      {
        description: 'Should throw a TypeError on invalid values',
        check: code => /throw\s+new\s+TypeError/.test(code)
      },
      {
        description: 'The set trap should return true on success',
        check: code => /return\s+true/.test(code)
      }
    ],
    hints: [
      'A set trap that does not return true throws in strict mode',
      'Reflect.set(object, property, value) is the canonical way to forward the assignment'
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
  config: patternsConfig,
  concepts: {
    modulePattern,
    observerPattern,
    singletonPattern,
    patterns
  },
  exercises,
  progress: progressConfig
};
