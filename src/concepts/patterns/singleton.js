// File: src/concepts/patterns/singleton.js
// Design Patterns - Singleton Pattern in JavaScript

export const singletonContent = {
  title: "Singleton Pattern",
  description: "Learn to implement and use the Singleton pattern for single instance control",
  
  theory: {
    introduction: `
      The Singleton pattern ensures that a class has only one instance and provides a global 
      point of access to that instance. It's useful for managing shared resources like database 
      connections, logging services, configuration objects, or any service that should have 
      exactly one instance throughout the application lifecycle.
    `,
    
    concepts: [
      {
        name: "Basic Singleton Implementation",
        explanation: "Creating a singleton using closure and IIFE",
        example: `
// Basic Singleton using IIFE and closure
const Logger = (function() {
  let instance;
  let logs = [];
  
  function createInstance() {
    return {
      log: function(message, level = 'INFO') {
        const logEntry = {
          timestamp: new Date().toISOString(),
          level: level.toUpperCase(),
          message: message
        };
        logs.push(logEntry);
        console.log(\`[\${logEntry.timestamp}] \${logEntry.level}: \${message}\`);
      },
      
      getLogs: function() {
        return [...logs]; // Return a copy to prevent external modification
      },
      
      clearLogs: function() {
        logs = [];
      },
      
      getLogCount: function() {
        return logs.length;
      },
      
      getLogsByLevel: function(level) {
        return logs.filter(log => log.level === level.toUpperCase());
      },
      
      exportLogs: function() {
        return logs.map(log => 
          \`[\${log.timestamp}] \${log.level}: \${log.message}\`
        ).join('\\n');
      }
    };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
        console.log('Logger instance created');
      }
      return instance;
    }
  };
})();

// Usage
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log('Same instance?', logger1 === logger2); // true

logger1.log('Application started');
logger1.log('User logged in', 'INFO');
logger1.log('Database connection failed', 'ERROR');

// Both variables reference the same instance
console.log('Logger1 log count:', logger1.getLogCount()); // 3
console.log('Logger2 log count:', logger2.getLogCount()); // 3

console.log('Error logs:', logger2.getLogsByLevel('ERROR'));

// Class-based Singleton (ES6)
class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    
    this.config = {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      environment: 'development'
    };
    
    ConfigManager.instance = this;
    return this;
  }
  
  get(key) {
    return this.config[key];
  }
  
  set(key, value) {
    this.config[key] = value;
    this.notifyObservers(key, value);
  }
  
  getAll() {
    return { ...this.config }; // Return a copy
  }
  
  update(newConfig) {
    Object.assign(this.config, newConfig);
    this.notifyObservers('*', this.config);
  }
  
  reset() {
    this.config = {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      environment: 'development'
    };
  }
  
  // Observer pattern integration
  observers = []
  
  subscribe(callback) {
    this.observers.push(callback);
  }
  
  unsubscribe(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }
  
  notifyObservers(key, value) {
    this.observers.forEach(callback => {
      try {
        callback(key, value);
      } catch (error) {
        console.error('Error notifying config observer:', error);
      }
    });
  }
}

// Usage
const config1 = new ConfigManager();
const config2 = new ConfigManager();

console.log('Same config instance?', config1 === config2); // true

config1.set('apiUrl', 'https://prod.api.example.com');
console.log('Config from instance 2:', config2.get('apiUrl')); // https://prod.api.example.com

// Subscribe to config changes
config1.subscribe((key, value) => {
  console.log(\`Config changed: \${key} = \${JSON.stringify(value)}\`);
});

config1.set('timeout', 10000); // Triggers observer notification
        `
      },
      
      {
        name: "Lazy Initialization Singleton",
        explanation: "Delaying singleton creation until first access",
        example: `
// Lazy initialization singleton for expensive operations
const DatabaseConnection = (function() {
  let instance;
  let connectionConfig = {
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'user',
    password: 'password',
    poolSize: 10
  };
  
  function createConnection() {
    console.log('Creating database connection...');
    
    // Simulate expensive database connection setup
    const connection = {
      isConnected: false,
      queries: [],
      
      connect: function() {
        if (!this.isConnected) {
          console.log(\`Connecting to database at \${connectionConfig.host}:\${connectionConfig.port}\`);
          // Simulate connection delay
          this.isConnected = true;
          console.log('Database connected successfully');
        }
        return this;
      },
      
      disconnect: function() {
        if (this.isConnected) {
          this.isConnected = false;
          console.log('Database disconnected');
        }
        return this;
      },
      
      query: function(sql, params = []) {
        if (!this.isConnected) {
          throw new Error('Database not connected. Call connect() first.');
        }
        
        const queryId = Date.now();
        const query = {
          id: queryId,
          sql,
          params,
          timestamp: new Date(),
          executed: true
        };
        
        this.queries.push(query);
        console.log(\`Executing query \${queryId}: \${sql}\`);
        
        // Simulate query execution
        return {
          queryId,
          rows: [], // Mock result
          rowCount: 0,
          executionTime: Math.random() * 100
        };
      },
      
      getConnectionInfo: function() {
        return {
          host: connectionConfig.host,
          port: connectionConfig.port,
          database: connectionConfig.database,
          isConnected: this.isConnected,
          totalQueries: this.queries.length
        };
      },
      
      getQueryHistory: function() {
        return [...this.queries];
      },
      
      clearQueryHistory: function() {
        this.queries = [];
      }
    };
    
    return connection;
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createConnection();
      }
      return instance;
    },
    
    // Allow configuration before instance creation
    configure: function(config) {
      if (instance) {
        console.warn('Cannot reconfigure after instance is created');
        return false;
      }
      Object.assign(connectionConfig, config);
      return true;
    },
    
    isInstanceCreated: function() {
      return !!instance;
    }
  };
})();

// Configure before first use
DatabaseConnection.configure({
  host: 'prod-db.example.com',
  database: 'production'
});

console.log('Instance created yet?', DatabaseConnection.isInstanceCreated()); // false

// First access creates the instance
const db1 = DatabaseConnection.getInstance();
console.log('Instance created now?', DatabaseConnection.isInstanceCreated()); // true

// Connect and use
db1.connect();
db1.query('SELECT * FROM users');
db1.query('SELECT * FROM products', ['active']);

const db2 = DatabaseConnection.getInstance();
console.log('Same database instance?', db1 === db2); // true
console.log('Connection info:', db2.getConnectionInfo());

// Thread-safe singleton implementation
class ThreadSafeSingleton {
  static instance;
  static isCreating = false;
  
  constructor() {
    if (ThreadSafeSingleton.instance) {
      return ThreadSafeSingleton.instance;
    }
    
    if (ThreadSafeSingleton.isCreating) {
      throw new Error('Cannot create multiple instances simultaneously');
    }
    
    ThreadSafeSingleton.isCreating = true;
    
    // Simulate expensive initialization
    this.data = [];
    this.initialized = false;
    this.initializeAsync();
    
    ThreadSafeSingleton.instance = this;
    ThreadSafeSingleton.isCreating = false;
    
    return this;
  }
  
  async initializeAsync() {
    console.log('Initializing singleton asynchronously...');
    // Simulate async initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    this.data = ['initialized', 'data'];
    this.initialized = true;
    console.log('Singleton initialization complete');
  }
  
  async waitForInitialization() {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return this;
  }
  
  getData() {
    if (!this.initialized) {
      throw new Error('Singleton not yet initialized. Call waitForInitialization() first.');
    }
    return [...this.data];
  }
  
  addData(item) {
    if (!this.initialized) {
      throw new Error('Singleton not yet initialized');
    }
    this.data.push(item);
  }
}

// Usage of thread-safe singleton
async function testThreadSafeSingleton() {
  const instance1 = new ThreadSafeSingleton();
  const instance2 = new ThreadSafeSingleton();
  
  console.log('Same instance?', instance1 === instance2); // true
  
  await instance1.waitForInitialization();
  instance1.addData('test item');
  
  console.log('Data from instance2:', instance2.getData()); // ['initialized', 'data', 'test item']
}

testThreadSafeSingleton();
        `
      },
      
      {
        name: "Modern Singleton with Modules",
        explanation: "Using ES6 modules to create singleton-like behavior",
        example: `
// Modern singleton using ES6 modules
// File: cacheManager.js

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.accessCount = new Map();
    this.createdAt = Date.now();
  }
  
  set(key, value, ttl = 3600000) { // 1 hour default TTL
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      value,
      createdAt: Date.now(),
      ttl,
      accessCount: 0
    });
    
    this.accessCount.set(key, 0);
  }
  
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check TTL
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.delete(key);
      return null;
    }
    
    // Update access tracking
    entry.accessCount++;
    this.accessCount.set(key, this.accessCount.get(key) + 1);
    
    return entry.value;
  }
  
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check TTL
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  delete(key) {
    this.cache.delete(key);
    this.accessCount.delete(key);
  }
  
  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }
  
  // Evict least recently used item
  evictLRU() {
    let lruKey = null;
    let lruCount = Infinity;
    
    for (const [key, count] of this.accessCount) {
      if (count < lruCount) {
        lruCount = count;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.delete(lruKey);
      console.log(\`Evicted LRU cache entry: \${lruKey}\`);
    }
  }
  
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      uptime: now - this.createdAt,
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.createdAt,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        expired: now - entry.createdAt > entry.ttl
      }))
    };
  }
  
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    
    for (const [key, entry] of this.cache) {
      if (now - entry.createdAt > entry.ttl) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.delete(key));
    console.log(\`Cleaned up \${keysToDelete.length} expired cache entries\`);
    
    return keysToDelete.length;
  }
  
  setMaxSize(size) {
    this.maxSize = size;
    
    // Evict items if over new limit
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }
}

// Export single instance
export const cacheManager = new CacheManager();

// Usage in other modules:
// import { cacheManager } from './cacheManager.js';

// Example usage
cacheManager.set('user:123', { name: 'John', email: 'john@example.com' });
cacheManager.set('config:app', { theme: 'dark', lang: 'en' }, 1800000); // 30 minutes TTL

console.log('User data:', cacheManager.get('user:123'));
console.log('Has config:', cacheManager.has('config:app'));

// Namespace-based singleton
const AppSingletons = (function() {
  const instances = {};
  
  return {
    getInstance: function(name, factory) {
      if (!instances[name]) {
        if (typeof factory !== 'function') {
          throw new Error('Factory function required for new singleton');
        }
        instances[name] = factory();
        console.log(\`Created singleton: \${name}\`);
      }
      return instances[name];
    },
    
    hasInstance: function(name) {
      return !!instances[name];
    },
    
    destroyInstance: function(name) {
      if (instances[name]) {
        delete instances[name];
        console.log(\`Destroyed singleton: \${name}\`);
        return true;
      }
      return false;
    },
    
    listInstances: function() {
      return Object.keys(instances);
    },
    
    destroyAll: function() {
      const names = Object.keys(instances);
      names.forEach(name => delete instances[name]);
      console.log(\`Destroyed \${names.length} singletons\`);
      return names;
    }
  };
})();

// Usage of namespace singleton
const logger = AppSingletons.getInstance('logger', () => ({
  logs: [],
  log: function(message) {
    this.logs.push({ message, timestamp: new Date() });
    console.log(message);
  },
  getLogs: function() { return [...this.logs]; }
}));

const eventBus = AppSingletons.getInstance('eventBus', () => ({
  events: {},
  on: function(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  emit: function(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },
  off: function(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}));

// Same instances returned
const logger2 = AppSingletons.getInstance('logger');
console.log('Same logger?', logger === logger2); // true

logger.log('Test message');
console.log('Available singletons:', AppSingletons.listInstances());
        `
      },
      
      {
        name: "Singleton with Dependency Injection",
        explanation: "Creating flexible singletons that accept dependencies",
        example: `
// Singleton with dependency injection
class ServiceContainer {
  constructor() {
    if (ServiceContainer.instance) {
      return ServiceContainer.instance;
    }
    
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
    
    ServiceContainer.instance = this;
    return this;
  }
  
  // Register a singleton service
  singleton(name, factory) {
    this.singletons.set(name, { factory, instance: null });
    return this;
  }
  
  // Register a factory service (new instance each time)
  factory(name, factory) {
    this.factories.set(name, factory);
    return this;
  }
  
  // Register a service instance
  instance(name, instance) {
    this.services.set(name, instance);
    return this;
  }
  
  // Get service by name
  get(name) {
    // Check for direct instance
    if (this.services.has(name)) {
      return this.services.get(name);
    }
    
    // Check for singleton
    if (this.singletons.has(name)) {
      const singletonDef = this.singletons.get(name);
      if (!singletonDef.instance) {
        singletonDef.instance = singletonDef.factory(this);
      }
      return singletonDef.instance;
    }
    
    // Check for factory
    if (this.factories.has(name)) {
      const factory = this.factories.get(name);
      return factory(this);
    }
    
    throw new Error(\`Service '\${name}' not found\`);
  }
  
  // Check if service exists
  has(name) {
    return this.services.has(name) || 
           this.singletons.has(name) || 
           this.factories.has(name);
  }
  
  // List all registered services
  list() {
    return {
      instances: Array.from(this.services.keys()),
      singletons: Array.from(this.singletons.keys()),
      factories: Array.from(this.factories.keys())
    };
  }
  
  // Clear all services
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
  
  // Create a child container
  createChild() {
    const child = Object.create(this);
    child.services = new Map(this.services);
    child.singletons = new Map();
    child.factories = new Map();
    return child;
  }
}

// Usage example
const container = new ServiceContainer();

// Register services
container
  .singleton('logger', (container) => ({
    log: (message) => console.log(\`[LOG]: \${message}\`),
    error: (message) => console.error(\`[ERROR]: \${message}\`)
  }))
  .singleton('config', (container) => ({
    get: (key) => process.env[key] || null,
    set: (key, value) => { process.env[key] = value; }
  }))
  .singleton('database', (container) => {
    const config = container.get('config');
    const logger = container.get('logger');
    
    return {
      connect: () => {
        logger.log('Connecting to database...');
        return true;
      },
      query: (sql) => {
        logger.log(\`Executing: \${sql}\`);
        return [];
      }
    };
  })
  .factory('httpClient', (container) => {
    const logger = container.get('logger');
    const config = container.get('config');
    
    return {
      baseURL: config.get('API_URL') || 'http://localhost:3000',
      get: (url) => {
        logger.log(\`GET \${url}\`);
        return Promise.resolve({ data: null });
      },
      post: (url, data) => {
        logger.log(\`POST \${url}\`);
        return Promise.resolve({ data: null });
      }
    };
  });

// Use services
const logger = container.get('logger');
const db = container.get('database');
const httpClient1 = container.get('httpClient');
const httpClient2 = container.get('httpClient');

logger.log('Application starting');
db.connect();

// Singletons return same instance
const logger2 = container.get('logger');
console.log('Same logger instance?', logger === logger2); // true

// Factories return new instances
console.log('Same HTTP client?', httpClient1 === httpClient2); // false

console.log('Registered services:', container.list());

// Registry pattern with singleton behavior
const ServiceRegistry = (function() {
  let instance;
  
  function create() {
    const registry = new Map();
    const metadata = new Map();
    
    return {
      register: function(name, service, options = {}) {
        if (registry.has(name) && !options.override) {
          throw new Error(\`Service '\${name}' already registered\`);
        }
        
        registry.set(name, service);
        metadata.set(name, {
          registeredAt: new Date(),
          options: { ...options },
          type: typeof service === 'function' ? 'factory' : 'instance'
        });
        
        console.log(\`Registered service: \${name}\`);
        return this;
      },
      
      get: function(name) {
        if (!registry.has(name)) {
          throw new Error(\`Service '\${name}' not found\`);
        }
        
        const service = registry.get(name);
        const meta = metadata.get(name);
        
        // Call factory if it's a function
        if (meta.type === 'factory') {
          return service();
        }
        
        return service;
      },
      
      unregister: function(name) {
        const removed = registry.delete(name);
        if (removed) {
          metadata.delete(name);
          console.log(\`Unregistered service: \${name}\`);
        }
        return removed;
      },
      
      list: function() {
        return Array.from(registry.keys());
      },
      
      info: function(name) {
        if (!registry.has(name)) return null;
        
        return {
          name,
          ...metadata.get(name),
          exists: true
        };
      },
      
      clear: function() {
        const count = registry.size;
        registry.clear();
        metadata.clear();
        console.log(\`Cleared \${count} services\`);
      }
    };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = create();
      }
      return instance;
    }
  };
})();

// Usage
const registry = ServiceRegistry.getInstance();
const registry2 = ServiceRegistry.getInstance();

console.log('Same registry?', registry === registry2); // true

registry
  .register('utils', {
    formatDate: (date) => date.toISOString(),
    randomId: () => Math.random().toString(36)
  })
  .register('apiClient', () => ({
    request: (url) => fetch(url),
    baseURL: 'https://api.example.com'
  }));

const utils = registry.get('utils');
const apiClient1 = registry.get('apiClient'); // New instance
const apiClient2 = registry.get('apiClient'); // Another new instance

console.log('API clients same?', apiClient1 === apiClient2); // false
console.log('Services:', registry.list());
console.log('Utils info:', registry.info('utils'));
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Application State Manager",
      description: "Global state management using singleton pattern",
      code: `
// Global Application State Manager
class AppStateManager {
  static instance;
  
  constructor() {
    if (AppStateManager.instance) {
      return AppStateManager.instance;
    }
    
    this.state = {
      user: null,
      theme: 'light',
      language: 'en',
      notifications: [],
      isLoading: false,
      errors: []
    };
    
    this.subscribers = new Map();
    this.history = [];
    this.maxHistorySize = 50;
    
    AppStateManager.instance = this;
    return this;
  }
  
  // Get current state
  getState() {
    return { ...this.state };
  }
  
  // Get specific state property
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }
  
  // Set state with automatic notification
  setState(updates) {
    const previousState = { ...this.state };
    
    // Deep merge updates
    this.state = this.deepMerge(this.state, updates);
    
    // Add to history
    this.addToHistory(previousState, this.state, updates);
    
    // Notify subscribers
    this.notifySubscribers(previousState, this.state, updates);
    
    return this.state;
  }
  
  // Subscribe to state changes
  subscribe(callback, filter = null) {
    const id = Date.now() + Math.random();
    this.subscribers.set(id, { callback, filter });
    
    // Return unsubscribe function
    return () => this.subscribers.delete(id);
  }
  
  // Subscribe to specific path changes
  subscribeTo(path, callback) {
    return this.subscribe((prev, curr, updates) => {
      const prevValue = path.split('.').reduce((obj, key) => obj?.[key], prev);
      const currValue = path.split('.').reduce((obj, key) => obj?.[key], curr);
      
      if (prevValue !== currValue) {
        callback(currValue, prevValue, updates);
      }
    });
  }
  
  // Notify all subscribers
  notifySubscribers(previousState, currentState, updates) {
    this.subscribers.forEach(({ callback, filter }) => {
      try {
        if (!filter || filter(previousState, currentState, updates)) {
          callback(previousState, currentState, updates);
        }
      } catch (error) {
        console.error('Error in state subscriber:', error);
      }
    });
  }
  
  // Deep merge objects
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  // Add state change to history
  addToHistory(previousState, currentState, updates) {
    this.history.push({
      timestamp: Date.now(),
      previousState: { ...previousState },
      currentState: { ...currentState },
      updates: { ...updates }
    });
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }
  
  // Get state history
  getHistory() {
    return [...this.history];
  }
  
  // Undo last state change
  undo() {
    if (this.history.length === 0) {
      return false;
    }
    
    const lastChange = this.history[this.history.length - 1];
    this.state = { ...lastChange.previousState };
    this.history.pop();
    
    this.notifySubscribers(lastChange.currentState, this.state, {});
    return true;
  }
  
  // Reset state to initial values
  reset() {
    const initialState = {
      user: null,
      theme: 'light',
      language: 'en',
      notifications: [],
      isLoading: false,
      errors: []
    };
    
    this.setState(initialState);
    this.history = [];
  }
  
  // Convenience methods for common operations
  setUser(user) {
    this.setState({ user });
  }
  
  setTheme(theme) {
    this.setState({ theme });
  }
  
  setLanguage(language) {
    this.setState({ language });
  }
  
  addNotification(notification) {
    const notifications = [...this.state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }];
    this.setState({ notifications });
  }
  
  removeNotification(id) {
    const notifications = this.state.notifications.filter(n => n.id !== id);
    this.setState({ notifications });
  }
  
  setLoading(isLoading) {
    this.setState({ isLoading });
  }
  
  addError(error) {
    const errors = [...this.state.errors, {
      id: Date.now(),
      timestamp: new Date(),
      message: error.message || error,
      stack: error.stack
    }];
    this.setState({ errors });
  }
  
  clearErrors() {
    this.setState({ errors: [] });
  }
  
  // Persistence methods
  saveToStorage(key = 'appState') {
    try {
      localStorage.setItem(key, JSON.stringify(this.state));
      return true;
    } catch (error) {
      console.error('Failed to save state to storage:', error);
      return false;
    }
  }
  
  loadFromStorage(key = 'appState') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedState = JSON.parse(saved);
        this.setState(parsedState);
        return true;
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
    return false;
  }
  
  // Debug methods
  getStats() {
    return {
      stateSize: JSON.stringify(this.state).length,
      subscriberCount: this.subscribers.size,
      historyLength: this.history.length,
      lastUpdated: this.history.length > 0 ? 
        new Date(this.history[this.history.length - 1].timestamp) : null
    };
  }
}

// Export singleton instance
export const appState = new AppStateManager();

// Usage example
console.log('=== App State Manager Demo ===');

// Subscribe to user changes
const unsubscribeUser = appState.subscribeTo('user', (newUser, oldUser) => {
  console.log('User changed from', oldUser?.name, 'to', newUser?.name);
});

// Subscribe to theme changes
const unsubscribeTheme = appState.subscribeTo('theme', (newTheme) => {
  console.log('Theme changed to:', newTheme);
  document.body.className = newTheme;
});

// Subscribe to all changes
const unsubscribeAll = appState.subscribe((prev, curr, updates) => {
  console.log('State updated:', Object.keys(updates));
});

// Test state changes
appState.setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
appState.setTheme('dark');
appState.addNotification({ type: 'success', message: 'Welcome!' });

console.log('Current user:', appState.get('user.name'));
console.log('Current theme:', appState.get('theme'));
console.log('Notification count:', appState.get('notifications').length);

// Test undo
console.log('\\nTesting undo...');
appState.setUser({ id: 1, name: 'Jane Doe', email: 'jane@example.com' });
console.log('User after change:', appState.get('user.name'));
appState.undo();
console.log('User after undo:', appState.get('user.name'));

// Test persistence
appState.saveToStorage();
console.log('State saved to localStorage');

console.log('\\nState stats:', appState.getStats());

// Clean up subscriptions
unsubscribeUser();
unsubscribeTheme();
unsubscribeAll();
      `
    },
    
    {
      title: "API Cache Manager",
      description: "Singleton cache manager for API responses with TTL and LRU eviction",
      code: `
// Advanced API Cache Manager Singleton
class APICacheManager {
  static instance;
  
  constructor() {
    if (APICacheManager.instance) {
      return APICacheManager.instance;
    }
    
    this.cache = new Map();
    this.accessTimes = new Map();
    this.requestCounts = new Map();
    
    this.config = {
      maxSize: 1000,
      defaultTTL: 300000, // 5 minutes
      maxRequestsPerMinute: 100,
      cleanupInterval: 60000 // 1 minute
    };
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      cleanups: 0
    };
    
    this.startCleanupTimer();
    
    APICacheManager.instance = this;
    return this;
  }
  
  // Generate cache key from URL and options
  generateKey(url, options = {}) {
    const normalizedOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body || null
    };
    
    return \`\${normalizedOptions.method}:\${url}:\${JSON.stringify(normalizedOptions)}\`;
  }
  
  // Check if entry is valid (not expired)
  isValid(entry) {
    return Date.now() - entry.timestamp < entry.ttl;
  }
  
  // Get from cache
  get(url, options = {}) {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    if (!this.isValid(entry)) {
      this.cache.delete(key);
      this.accessTimes.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Update access time for LRU
    this.accessTimes.set(key, Date.now());
    this.stats.hits++;
    
    return entry.data;
  }
  
  // Set cache entry
  set(url, data, options = {}, ttl = this.config.defaultTTL) {
    const key = this.generateKey(url, options);
    
    // Check if we need to evict
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }
    
    const entry = {
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      timestamp: Date.now(),
      ttl,
      url,
      options: { ...options }
    };
    
    this.cache.set(key, entry);
    this.accessTimes.set(key, Date.now());
  }
  
  // Evict least recently used entry
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;
    
    for (const [key, time] of this.accessTimes) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessTimes.delete(oldestKey);
      this.stats.evictions++;
    }
  }
  
  // Rate limiting check
  canMakeRequest(url) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    if (!this.requestCounts.has(url)) {
      this.requestCounts.set(url, []);
    }
    
    const requests = this.requestCounts.get(url);
    
    // Remove old requests
    const recentRequests = requests.filter(time => time > oneMinuteAgo);
    this.requestCounts.set(url, recentRequests);
    
    return recentRequests.length < this.config.maxRequestsPerMinute;
  }
  
  // Record request
  recordRequest(url) {
    if (!this.requestCounts.has(url)) {
      this.requestCounts.set(url, []);
    }
    
    this.requestCounts.get(url).push(Date.now());
  }
  
  // Main fetch method with caching
  async fetch(url, options = {}) {
    // Check cache first
    const cached = this.get(url, options);
    if (cached) {
      console.log(\`Cache HIT for: \${url}\`);
      return cached;
    }
    
    // Check rate limiting
    if (!this.canMakeRequest(url)) {
      throw new Error(\`Rate limit exceeded for: \${url}\`);
    }
    
    console.log(\`Cache MISS for: \${url}\`);
    
    try {
      // Record the request
      this.recordRequest(url);
      
      // Make actual request
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Determine TTL based on cache headers or use default
      let ttl = this.config.defaultTTL;
      const cacheControl = response.headers.get('cache-control');
      
      if (cacheControl) {
        const maxAgeMatch = cacheControl.match(/max-age=(\\d+)/);
        if (maxAgeMatch) {
          ttl = parseInt(maxAgeMatch[1]) * 1000;
        }
      }
      
      // Cache successful response
      this.set(url, {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: Date.now()
      }, options, ttl);
      
      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error(\`Request failed for: \${url}\`, error);
      throw error;
    }
  }
  
  // Batch requests with caching
  async batchFetch(requests) {
    const results = [];
    
    for (const request of requests) {
      try {
        const result = await this.fetch(request.url, request.options);
        results.push({ ...request, result, error: null });
      } catch (error) {
        results.push({ ...request, result: null, error });
      }
    }
    
    return results;
  }
  
  // Invalidate cache entries
  invalidate(pattern) {
    let count = 0;
    
    for (const [key, entry] of this.cache) {
      if (typeof pattern === 'string' && entry.url.includes(pattern)) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
        count++;
      } else if (pattern instanceof RegExp && pattern.test(entry.url)) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
        count++;
      }
    }
    
    console.log(\`Invalidated \${count} cache entries matching pattern\`);
    return count;
  }
  
  // Preload cache entries
  async preload(urls, options = {}) {
    const results = [];
    
    for (const url of urls) {
      try {
        const result = await this.fetch(url, options);
        results.push({ url, success: true, result });
      } catch (error) {
        results.push({ url, success: false, error: error.message });
      }
    }
    
    return results;
  }
  
  // Clean up expired entries
  cleanup() {
    const before = this.cache.size;
    const now = Date.now();
    
    for (const [key, entry] of this.cache) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
      }
    }
    
    const cleaned = before - this.cache.size;
    this.stats.cleanups++;
    
    if (cleaned > 0) {
      console.log(\`Cleaned up \${cleaned} expired cache entries\`);
    }
    
    return cleaned;
  }
  
  // Start automatic cleanup timer
  startCleanupTimer() {
    setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }
  
  // Get cache statistics
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 ? 
      (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      hitRate: \`\${hitRate}%\`,
      cacheSize: this.cache.size,
      maxSize: this.config.maxSize,
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  // Estimate memory usage
  getMemoryUsage() {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry).length * 2; // Rough estimate
    }
    
    return {
      bytes: totalSize,
      kb: (totalSize / 1024).toFixed(2),
      mb: (totalSize / 1024 / 1024).toFixed(2)
    };
  }
  
  // Clear all cache
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.accessTimes.clear();
    this.requestCounts.clear();
    
    console.log(\`Cleared \${size} cache entries\`);
    return size;
  }
  
  // Update configuration
  configure(newConfig) {
    Object.assign(this.config, newConfig);
    
    // If maxSize was reduced, evict excess entries
    while (this.cache.size > this.config.maxSize) {
      this.evictLRU();
    }
  }
}

// Export singleton instance
export const apiCache = new APICacheManager();

// Usage example
async function testAPICache() {
  console.log('=== API Cache Manager Demo ===');
  
  // Configure cache
  apiCache.configure({
    maxSize: 50,
    defaultTTL: 30000, // 30 seconds
    maxRequestsPerMinute: 20
  });
  
  try {
    // First request (cache miss)
    console.log('\\nMaking first request...');
    const result1 = await apiCache.fetch('https://jsonplaceholder.typicode.com/posts/1');
    console.log('First request result:', result1.data.title);
    
    // Second request (cache hit)
    console.log('\\nMaking second request (should be cached)...');
    const result2 = await apiCache.fetch('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Second request result:', result2.data.title);
    
    // Batch requests
    console.log('\\nMaking batch requests...');
    const batchResults = await apiCache.batchFetch([
      { url: 'https://jsonplaceholder.typicode.com/posts/2', id: 'post2' },
      { url: 'https://jsonplaceholder.typicode.com/posts/3', id: 'post3' },
      { url: 'https://jsonplaceholder.typicode.com/posts/1', id: 'post1' } // Should be cached
    ]);
    
    console.log('Batch results:', batchResults.map(r => ({
      id: r.id,
      title: r.result?.data?.title || 'Failed',
      cached: !r.error
    })));
    
    // Preload some URLs
    console.log('\\nPreloading URLs...');
    await apiCache.preload([
      'https://jsonplaceholder.typicode.com/posts/4',
      'https://jsonplaceholder.typicode.com/posts/5'
    ]);
    
    console.log('\\nCache Statistics:');
    console.log(apiCache.getStats());
    
    // Test invalidation
    console.log('\\nTesting cache invalidation...');
    const invalidated = apiCache.invalidate('posts');
    console.log(\`Invalidated \${invalidated} entries\`);
    
    console.log('\\nFinal Cache Statistics:');
    console.log(apiCache.getStats());
    
  } catch (error) {
    console.error('API Cache test failed:', error);
  }
}

// Run the test (uncomment to test with real API)
// testAPICache();

console.log('API Cache Manager ready for use');
      `
    }
  ],
  
  exercises: [
    {
      id: "singleton-basic",
      title: "Simple Settings Manager",
      difficulty: "easy",
      prompt: "Create a singleton Settings Manager that can store and retrieve application settings with persistence to localStorage.",
      solution: `
class SettingsManager {
  static instance;
  
  constructor() {
    if (SettingsManager.instance) {
      return SettingsManager.instance;
    }
    
    this.settings = this.loadFromStorage();
    SettingsManager.instance = this;
    return this;
  }
  
  get(key, defaultValue = null) {
    return this.settings.hasOwnProperty(key) ? this.settings[key] : defaultValue;
  }
  
  set(key, value) {
    this.settings[key] = value;
    this.saveToStorage();
    return this;
  }
  
  remove(key) {
    delete this.settings[key];
    this.saveToStorage();
    return this;
  }
  
  getAll() {
    return { ...this.settings };
  }
  
  clear() {
    this.settings = {};
    this.saveToStorage();
    return this;
  }
  
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('app-settings');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }
  
  saveToStorage() {
    try {
      localStorage.setItem('app-settings', JSON.stringify(this.settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
}

// Usage
const settings1 = new SettingsManager();
const settings2 = new SettingsManager();

console.log('Same instance?', settings1 === settings2); // true

settings1.set('theme', 'dark').set('language', 'en');
console.log('Settings from second instance:', settings2.getAll());

export { SettingsManager };
      `
    },
    
    {
      id: "singleton-advanced",
      title: "Event Bus with Namespaces",
      difficulty: "hard",
      prompt: "Create a singleton Event Bus that supports namespaced events, wildcard subscriptions, and event history with replay capabilities.",
      solution: `
class EventBus {
  static instance;
  
  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }
    
    this.events = new Map(); // namespace -> event -> subscribers
    this.history = [];
    this.maxHistorySize = 1000;
    this.wildcardSubscribers = new Map();
    
    EventBus.instance = this;
    return this;
  }
  
  // Subscribe to an event
  on(eventPath, callback, options = {}) {
    const { namespace = 'default', once = false, priority = 0 } = options;
    const [ns, eventName] = this.parseEventPath(eventPath, namespace);
    
    if (!this.events.has(ns)) {
      this.events.set(ns, new Map());
    }
    
    if (!this.events.get(ns).has(eventName)) {
      this.events.get(ns).set(eventName, []);
    }
    
    const subscriber = {
      callback,
      once,
      priority,
      id: Date.now() + Math.random()
    };
    
    const subscribers = this.events.get(ns).get(eventName);
    subscribers.push(subscriber);
    
    // Sort by priority (higher priority first)
    subscribers.sort((a, b) => b.priority - a.priority);
    
    // Return unsubscribe function
    return () => this.off(eventPath, subscriber.id, { namespace });
  }
  
  // Subscribe to wildcard events
  onWildcard(pattern, callback, options = {}) {
    const { namespace = 'default' } = options;
    const id = Date.now() + Math.random();
    
    if (!this.wildcardSubscribers.has(namespace)) {
      this.wildcardSubscribers.set(namespace, []);
    }
    
    this.wildcardSubscribers.get(namespace).push({
      pattern: new RegExp(pattern.replace(/\\*/g, '.*')),
      callback,
      id,
      originalPattern: pattern
    });
    
    return () => {
      const subscribers = this.wildcardSubscribers.get(namespace) || [];
      const index = subscribers.findIndex(s => s.id === id);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }
  
  // Subscribe once
  once(eventPath, callback, options = {}) {
    return this.on(eventPath, callback, { ...options, once: true });
  }
  
  // Emit an event
  emit(eventPath, data = null, options = {}) {
    const { namespace = 'default', async = false } = options;
    const [ns, eventName] = this.parseEventPath(eventPath, namespace);
    
    // Add to history
    const eventRecord = {
      namespace: ns,
      event: eventName,
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      timestamp: Date.now(),
      id: Date.now() + Math.random()
    };
    
    this.addToHistory(eventRecord);
    
    // Get direct subscribers
    const directSubscribers = this.events.get(ns)?.get(eventName) || [];
    
    // Get wildcard subscribers
    const wildcardSubscribers = this.getWildcardMatches(ns, eventName);
    
    const allSubscribers = [...directSubscribers, ...wildcardSubscribers];
    
    if (async) {
      // Emit asynchronously
      setTimeout(() => {
        this.executeCallbacks(allSubscribers, eventRecord);
      }, 0);
    } else {
      // Emit synchronously
      this.executeCallbacks(allSubscribers, eventRecord);
    }
    
    return this;
  }
  
  // Remove event listener
  off(eventPath, subscriberIdOrCallback, options = {}) {
    const { namespace = 'default' } = options;
    const [ns, eventName] = this.parseEventPath(eventPath, namespace);
    
    const eventMap = this.events.get(ns);
    if (!eventMap) return this;
    
    const subscribers = eventMap.get(eventName);
    if (!subscribers) return this;
    
    // Remove by ID or callback function
    const index = subscribers.findIndex(s => 
      s.id === subscriberIdOrCallback || s.callback === subscriberIdOrCallback
    );
    
    if (index > -1) {
      subscribers.splice(index, 1);
    }
    
    // Clean up empty arrays
    if (subscribers.length === 0) {
      eventMap.delete(eventName);
      if (eventMap.size === 0) {
        this.events.delete(ns);
      }
    }
    
    return this;
  }
  
  // Clear all listeners for a namespace or event
  clear(eventPath = null, options = {}) {
    const { namespace = 'default' } = options;
    
    if (!eventPath) {
      // Clear entire namespace
      this.events.delete(namespace);
      this.wildcardSubscribers.delete(namespace);
    } else {
      const [ns, eventName] = this.parseEventPath(eventPath, namespace);
      this.events.get(ns)?.delete(eventName);
    }
    
    return this;
  }
  
  // Get event history
  getHistory(filter = {}) {
    let filtered = [...this.history];
    
    if (filter.namespace) {
      filtered = filtered.filter(e => e.namespace === filter.namespace);
    }
    
    if (filter.event) {
      filtered = filtered.filter(e => e.event === filter.event);
    }
    
    if (filter.since) {
      filtered = filtered.filter(e => e.timestamp >= filter.since);
    }
    
    if (filter.limit) {
      filtered = filtered.slice(-filter.limit);
    }
    
    return filtered;
  }
  
  // Replay events
  replay(filter = {}, options = {}) {
    const { delay = 0 } = options;
    const events = this.getHistory(filter);
    
    events.forEach((eventRecord, index) => {
      setTimeout(() => {
        this.emit(\`\${eventRecord.namespace}:\${eventRecord.event}\`, eventRecord.data, {
          namespace: eventRecord.namespace
        });
      }, delay * index);
    });
    
    return events.length;
  }
  
  // Helper methods
  parseEventPath(eventPath, defaultNamespace) {
    if (eventPath.includes(':')) {
      const [namespace, event] = eventPath.split(':', 2);
      return [namespace, event];
    }
    return [defaultNamespace, eventPath];
  }
  
  getWildcardMatches(namespace, eventName) {
    const wildcards = this.wildcardSubscribers.get(namespace) || [];
    return wildcards
      .filter(w => w.pattern.test(eventName))
      .map(w => ({ callback: w.callback, once: false, priority: 0 }));
  }
  
  executeCallbacks(subscribers, eventRecord) {
    subscribers.forEach(subscriber => {
      try {
        subscriber.callback(eventRecord.data, {
          event: eventRecord.event,
          namespace: eventRecord.namespace,
          timestamp: eventRecord.timestamp,
          id: eventRecord.id
        });
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
    
    // Remove 'once' subscribers
    subscribers.forEach(subscriber => {
      if (subscriber.once) {
        this.off(\`\${eventRecord.namespace}:\${eventRecord.event}\`, subscriber.id);
      }
    });
  }
  
  addToHistory(eventRecord) {
    this.history.push(eventRecord);
    
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }
  
  // Debug methods
  getSubscriberCount(eventPath = null, options = {}) {
    const { namespace = 'default' } = options;
    
    if (!eventPath) {
      // Count all subscribers in namespace
      let count = 0;
      const eventMap = this.events.get(namespace);
      if (eventMap) {
        eventMap.forEach(subscribers => count += subscribers.length);
      }
      
      const wildcards = this.wildcardSubscribers.get(namespace);
      if (wildcards) {
        count += wildcards.length;
      }
      
      return count;
    }
    
    const [ns, eventName] = this.parseEventPath(eventPath, namespace);
    const directCount = this.events.get(ns)?.get(eventName)?.length || 0;
    const wildcardCount = this.getWildcardMatches(ns, eventName).length;
    
    return directCount + wildcardCount;
  }
  
  listNamespaces() {
    const namespaces = new Set();
    this.events.forEach((_, ns) => namespaces.add(ns));
    this.wildcardSubscribers.forEach((_, ns) => namespaces.add(ns));
    return Array.from(namespaces);
  }
  
  listEvents(namespace = 'default') {
    const eventMap = this.events.get(namespace);
    if (!eventMap) return [];
    return Array.from(eventMap.keys());
  }
}

// Usage example
const eventBus = new EventBus();

// Test the implementation
console.log('=== Event Bus Demo ===');

// Subscribe to events
const unsubUser = eventBus.on('user:login', (data, meta) => {
  console.log('User logged in:', data.username, 'at', new Date(meta.timestamp));
});

const unsubWildcard = eventBus.onWildcard('user:*', (data, meta) => {
  console.log('User event:', meta.event, data);
});

// High priority subscriber
eventBus.on('user:login', (data) => {
  console.log('Priority login handler for:', data.username);
}, { priority: 10 });

// Once subscriber
eventBus.once('app:init', (data) => {
  console.log('App initialized:', data);
});

// Emit events
eventBus.emit('user:login', { username: 'john', id: 1 });
eventBus.emit('user:logout', { username: 'john', id: 1 });
eventBus.emit('app:init', { version: '1.0.0' });
eventBus.emit('app:init', { version: '1.0.0' }); // Won't trigger 'once' subscriber

console.log('\\nSubscriber counts:');
console.log('user:login subscribers:', eventBus.getSubscriberCount('user:login'));
console.log('Total user namespace subscribers:', eventBus.getSubscriberCount(null, { namespace: 'default' }));

console.log('\\nEvent history:', eventBus.getHistory({ limit: 3 }));

console.log('\\nNamespaces:', eventBus.listNamespaces());
console.log('Events in default namespace:', eventBus.listEvents('default'));

export { EventBus };
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the main purpose of the Singleton pattern?",
      options: [
        "To create multiple instances of a class",
        "To ensure a class has only one instance and provide global access to it",
        "To make classes inherit from each other",
        "To hide implementation details"
      ],
      correct: 1,
      explanation: "The Singleton pattern ensures that a class has only one instance throughout the application and provides a global point of access to that instance."
    },
    
    {
      question: "Which approach is commonly used to implement Singleton in JavaScript?",
      options: [
        "Using global variables only",
        "Using closures and IIFE or static class properties",
        "Using multiple constructors",
        "Using prototype inheritance"
      ],
      correct: 1,
      explanation: "Singletons in JavaScript are commonly implemented using closures with IIFE (Immediately Invoked Function Expression) or using static class properties to store the single instance."
    },
    
    {
      question: "What is lazy initialization in the context of Singleton pattern?",
      options: [
        "Creating the instance immediately when the class is defined",
        "Creating the instance only when it's first requested",
        "Creating multiple instances at once",
        "Delaying all method calls"
      ],
      correct: 1,
      explanation: "Lazy initialization means creating the singleton instance only when it's first accessed or requested, which can improve performance by avoiding unnecessary object creation."
    },
    
    {
      question: "What is a potential drawback of the Singleton pattern?",
      options: [
        "It improves performance",
        "It makes code more modular",
        "It can make unit testing difficult and create tight coupling",
        "It reduces memory usage"
      ],
      correct: 2,
      explanation: "The Singleton pattern can make unit testing difficult because it creates global state, and it can lead to tight coupling between classes that depend on the singleton instance."
    },
    
    {
      question: "How can you implement thread-safe Singleton in JavaScript?",
      options: [
        "JavaScript is single-threaded, so no special handling is needed",
        "Use multiple locks",
        "Use async/await for instance creation and check creation flags",
        "Use worker threads"
      ],
      correct: 2,
      explanation: "While JavaScript is single-threaded in most contexts, with async operations you might need to use flags and checks during instance creation to prevent race conditions, especially when dealing with asynchronous initialization."
    }
  ],
  
  bestPractices: [
    "Use lazy initialization to improve performance",
    "Consider dependency injection to make singletons more testable",
    "Be aware of memory leaks - singletons live for the entire application lifecycle",
    "Use ES6 modules for simpler singleton-like behavior when appropriate",
    "Implement proper cleanup methods for singletons that manage resources",
    "Consider using a registry pattern for managing multiple singleton instances",
    "Document singleton dependencies clearly to avoid circular dependencies",
    "Use TypeScript or JSDoc for better type safety with singleton instances"
  ],
  
  commonMistakes: [
    "Creating singletons when a regular object would suffice",
    "Not handling asynchronous initialization properly",
    "Making singletons too complex with too many responsibilities",
    "Forgetting to implement proper error handling in singleton creation",
    "Not providing a way to reset or clear singleton state for testing",
    "Creating tight coupling between singletons and other classes",
    "Not considering the singleton's lifecycle and cleanup needs",
    "Using singletons to store temporary or request-specific data"
  ],
  
  relatedPatterns: [
    {
      name: "Factory Pattern",
      relationship: "Factories can be implemented as singletons to centralize object creation"
    },
    {
      name: "Observer Pattern", 
      relationship: "Singletons often implement the Observer pattern for state change notifications"
    },
    {
      name: "Registry Pattern",
      relationship: "Registries are commonly implemented as singletons to manage global collections"
    },
    {
      name: "Module Pattern",
      relationship: "ES6 modules provide singleton-like behavior with better encapsulation"
    }
  ],
  
  realWorldApplications: [
    "Application configuration managers",
    "Logging services and error handlers",
    "Database connection pools",
    "Cache managers and storage services",
    "Event bus/message broker systems",
    "Authentication and session managers",
    "Performance monitoring and analytics",
    "Feature flag and A/B testing managers"
  ]
};

export default singletonContent;