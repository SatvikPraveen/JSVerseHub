// File: src/concepts/es6/modules-demo.js
// ES6 Modules - Import/Export syntax and module patterns

export const modulesConfig = {
  title: "ES6 Modules",
  description: "Master ES6 module system with import/export syntax",
  difficulty: "intermediate",
  estimatedTime: "35 minutes"
};

// Export Syntax Examples
export const exportSyntax = {
  concept: "Export Syntax",
  explanation: `
    ES6 modules use export/import syntax to share code between files.
    There are named exports, default exports, and various patterns for organizing code.
  `,
  
  examples: {
    namedExports: `
// Named Exports - multiple exports from a single module
// File: mathUtils.js

// Individual exports
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(value) {
    this.result += value;
    return this;
  }
  
  multiply(value) {
    this.result *= value;
    return this;
  }
  
  getResult() {
    return this.result;
  }
}

// Export at the end of file
const subtract = (a, b) => a - b;
const divide = (a, b) => b !== 0 ? a / b : null;
const power = (base, exponent) => Math.pow(base, exponent);

export { subtract, divide, power };

// Export with renaming
const square = (x) => x * x;
const cube = (x) => x * x * x;

export { square as sq, cube as cb };

// Re-export from another module
// export { sin, cos, tan } from './trigUtils.js';
    `,
    
    defaultExports: `
// Default Exports - single main export from a module
// File: userService.js

class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.users = [];
  }
  
  async fetchUsers() {
    try {
      const response = await fetch(\`\${this.apiUrl}/users\`);
      const users = await response.json();
      this.users = users;
      return users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }
  
  getUserById(id) {
    return this.users.find(user => user.id === id);
  }
  
  addUser(user) {
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }
}

// Default export
export default UserService;

// You can also have named exports alongside default export
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

export const validateUser = (user) => {
  const required = ['name', 'email'];
  return required.every(field => user[field] && user[field].trim());
};

// Alternative default export syntax
// const UserService = class { ... };
// export { UserService as default };
    `,
    
    mixedExports: `
// Mixed Exports - combining default and named exports
// File: apiClient.js

// Constants
export const API_ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
  COMMENTS: '/comments'
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

// Utility functions
export const createHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers.Authorization = \`Bearer \${token}\`;
  }
  
  return headers;
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(\`HTTP \${response.status}: \${error}\`);
  }
  return response.json();
};

// Main class as default export
class ApiClient {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config = {
      headers: createHeaders(this.token),
      ...options
    };
    
    const response = await fetch(url, config);
    return handleResponse(response);
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: HTTP_METHODS.GET });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, { method: HTTP_METHODS.DELETE });
  }
}

export default ApiClient;

// You can also export an instance
export const defaultClient = new ApiClient('https://api.example.com');
    `
  }
};

// Import Syntax Examples
export const importSyntax = {
  concept: "Import Syntax",
  explanation: `
    ES6 provides various ways to import modules, from importing specific exports
    to importing entire modules or renaming imports.
  `,
  
  examples: {
    namedImports: `
// Named Imports - importing specific exports
// File: calculator.js

// Basic named imports
import { add, multiply, PI } from './mathUtils.js';

console.log(add(5, 3)); // 8
console.log(multiply(4, 7)); // 28
console.log(PI); // 3.14159

// Import with renaming
import { 
  subtract as minus, 
  divide as dividedBy,
  sq as square,
  cb as cube 
} from './mathUtils.js';

console.log(minus(10, 4)); // 6
console.log(dividedBy(15, 3)); // 5
console.log(square(4)); // 16
console.log(cube(3)); // 27

// Import class
import { Calculator } from './mathUtils.js';

const calc = new Calculator();
const result = calc.add(10).multiply(2).getResult();
console.log(result); // 20

// Selective imports for better tree-shaking
import { validateUser, USER_ROLES } from './userService.js';

const user = { name: 'Alice', email: 'alice@example.com' };
if (validateUser(user)) {
  console.log('User is valid');
}
    `,
    
    defaultImports: `
// Default Imports - importing the default export
// File: app.js

// Import default export
import UserService from './userService.js';

const userService = new UserService('https://api.example.com');

// You can name default imports anything
import MyUserService from './userService.js';
import UserManager from './userService.js';

// All refer to the same default export
const service1 = new UserService();
const service2 = new MyUserService();
const service3 = new UserManager();

// Import default along with named exports
import ApiClient, { API_ENDPOINTS, createHeaders } from './apiClient.js';

const client = new ApiClient('https://api.example.com');
const headers = createHeaders('token123');

// Using imported constants
client.get(API_ENDPOINTS.USERS).then(users => {
  console.log('Users:', users);
});
    `,
    
    namespaceImports: `
// Namespace Imports - import everything as an object
// File: mathApp.js

// Import all named exports as a namespace
import * as Math from './mathUtils.js';

console.log(Math.PI); // 3.14159
console.log(Math.add(5, 3)); // 8
console.log(Math.multiply(4, 7)); // 28

const calculator = new Math.Calculator();
calculator.add(10).multiply(2);
console.log(calculator.getResult()); // 20

// Import all from apiClient
import * as API from './apiClient.js';

// Access default export through .default
const client = new API.default('https://api.example.com');

// Access named exports directly
console.log(API.API_ENDPOINTS.USERS);
const headers = API.createHeaders('token');

// Mixed approach - default and namespace
import ApiClient, * as APIUtils from './apiClient.js';

const mainClient = new ApiClient('https://api.example.com');
console.log(APIUtils.HTTP_METHODS.GET);
    `,
    
    dynamicImports: `
// Dynamic Imports - runtime module loading
// File: dynamicLoader.js

// Basic dynamic import
async function loadMathUtils() {
  try {
    const mathModule = await import('./mathUtils.js');
    
    console.log(mathModule.PI);
    console.log(mathModule.add(5, 3));
    
    const calculator = new mathModule.Calculator();
    return calculator;
  } catch (error) {
    console.error('Failed to load math utils:', error);
  }
}

// Conditional loading
async function loadUserService(useAdvanced = false) {
  const moduleName = useAdvanced ? './advancedUserService.js' : './userService.js';
  
  try {
    const module = await import(moduleName);
    return module.default; // Access default export
  } catch (error) {
    console.error('Failed to load user service:', error);
    return null;
  }
}

// Dynamic import with destructuring
async function loadApiUtils() {
  const { createHeaders, handleResponse, API_ENDPOINTS } = await import('./apiClient.js');
  
  return { createHeaders, handleResponse, API_ENDPOINTS };
}

// Import based on user action
async function handleButtonClick(feature) {
  switch (feature) {
    case 'charts':
      const chartModule = await import('./chartUtils.js');
      return chartModule.createChart();
      
    case 'analytics':
      const analyticsModule = await import('./analytics.js');
      return analyticsModule.default.init();
      
    case 'exports':
      const exportModule = await import('./exportUtils.js');
      return exportModule.exportData();
      
    default:
      console.log('Unknown feature');
  }
}

// Lazy loading with error handling
class FeatureLoader {
  constructor() {
    this.loadedModules = new Map();
  }
  
  async loadFeature(featureName) {
    if (this.loadedModules.has(featureName)) {
      return this.loadedModules.get(featureName);
    }
    
    try {
      const module = await import(\`./features/\${featureName}.js\`);
      this.loadedModules.set(featureName, module);
      return module;
    } catch (error) {
      console.error(\`Failed to load feature \${featureName}:\`, error);
      throw error;
    }
  }
}

const featureLoader = new FeatureLoader();

// Usage
async function initializeApp() {
  const calc = await loadMathUtils();
  if (calc) {
    calc.add(10).multiply(2);
    console.log('Calculator result:', calc.getResult());
  }
  
  const UserService = await loadUserService(true);
  if (UserService) {
    const service = new UserService('https://api.example.com');
    console.log('User service loaded');
  }
}

// initializeApp();
    `
  }
};

// Module Patterns
export const modulePatterns = {
  concept: "Module Patterns",
  explanation: `
    Common patterns for organizing and structuring ES6 modules,
    including barrel exports, plugin systems, and configuration modules.
  `,
  
  examples: {
    barrelExports: `
// Barrel Exports - re-exporting from multiple modules
// File: utils/index.js (barrel file)

// Re-export everything from specific modules
export * from './stringUtils.js';
export * from './arrayUtils.js';
export * from './objectUtils.js';

// Re-export with renaming
export { 
  validateEmail as isValidEmail,
  formatPhone as formatPhoneNumber 
} from './validators.js';

// Re-export default as named
export { default as ApiClient } from './apiClient.js';
export { default as Database } from './database.js';

// Selective re-exports
export { 
  debounce, 
  throttle, 
  memoize 
} from './performanceUtils.js';

// Create and export utility object
import { formatDate, parseDate } from './dateUtils.js';
import { generateId, randomString } from './idUtils.js';

export const Utils = {
  date: { formatDate, parseDate },
  id: { generateId, randomString }
};

// Usage in other files:
// import { debounce, ApiClient, isValidEmail } from './utils/index.js';
// import { Utils } from './utils/index.js';
    `,
    
    configurationModules: `
// Configuration Modules - centralized configuration
// File: config/database.js

export const databaseConfig = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_dev',
    user: 'dev_user',
    password: 'dev_password',
    pool: { min: 2, max: 10 }
  },
  
  production: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'myapp',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '',
    pool: { min: 5, max: 50 }
  }
};

export const getConfig = (environment = 'development') => {
  return databaseConfig[environment] || databaseConfig.development;
};

// File: config/api.js
export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3,
  
  endpoints: {
    auth: '/auth',
    users: '/users',
    posts: '/posts',
    upload: '/upload'
  },
  
  features: {
    enableCaching: true,
    enableLogging: process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NODE_ENV === 'production'
  }
};

// File: config/index.js (main config barrel)
import { databaseConfig, getConfig as getDBConfig } from './database.js';
import { apiConfig } from './api.js';

export const config = {
  database: databaseConfig,
  api: apiConfig,
  
  // App-specific config
  app: {
    name: 'MyApp',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  
  // Helper methods
  getDBConfig,
  
  isDevelopment() {
    return this.app.environment === 'development';
  },
  
  isProduction() {
    return this.app.environment === 'production';
  }
};

export default config;
    `,
    
    pluginSystem: `
// Plugin System - extensible module architecture
// File: core/pluginManager.js

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }
  
  async registerPlugin(name, pluginPath) {
    try {
      const pluginModule = await import(pluginPath);
      const plugin = pluginModule.default;
      
      if (!plugin || typeof plugin.init !== 'function') {
        throw new Error('Plugin must export default object with init method');
      }
      
      // Initialize plugin
      await plugin.init(this);
      
      this.plugins.set(name, plugin);
      console.log(\`Plugin '\${name}' registered successfully\`);
      
      return plugin;
    } catch (error) {
      console.error(\`Failed to register plugin '\${name}':\`, error);
      throw error;
    }
  }
  
  getPlugin(name) {
    return this.plugins.get(name);
  }
  
  // Hook system for plugin communication
  addHook(event, callback) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push(callback);
  }
  
  async executeHooks(event, data = {}) {
    const hooks = this.hooks.get(event) || [];
    const results = [];
    
    for (const hook of hooks) {
      try {
        const result = await hook(data);
        results.push(result);
      } catch (error) {
        console.error(\`Hook execution failed for event '\${event}':\`, error);
      }
    }
    
    return results;
  }
}

export default PluginManager;

// File: plugins/authPlugin.js
const authPlugin = {
  name: 'auth',
  version: '1.0.0',
  
  async init(pluginManager) {
    this.pluginManager = pluginManager;
    
    // Register hooks
    pluginManager.addHook('user-login', this.onUserLogin.bind(this));
    pluginManager.addHook('user-logout', this.onUserLogout.bind(this));
    
    console.log('Auth plugin initialized');
  },
  
  async onUserLogin(userData) {
    console.log('User logged in:', userData.email);
    // Auth-specific logic
    return { success: true, plugin: this.name };
  },
  
  async onUserLogout(userData) {
    console.log('User logged out:', userData.email);
    // Cleanup logic
    return { success: true, plugin: this.name };
  },
  
  authenticate(token) {
    // Authentication logic
    return { valid: true, user: { id: 1, email: 'user@example.com' } };
  }
};

export default authPlugin;

// File: plugins/loggingPlugin.js
const loggingPlugin = {
  name: 'logging',
  version: '1.0.0',
  
  async init(pluginManager) {
    this.logs = [];
    
    // Register for all events
    pluginManager.addHook('user-login', this.logEvent.bind(this));
    pluginManager.addHook('user-logout', this.logEvent.bind(this));
    pluginManager.addHook('api-request', this.logEvent.bind(this));
    
    console.log('Logging plugin initialized');
  },
  
  async logEvent(data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: data.event || 'unknown',
      data: data
    };
    
    this.logs.push(logEntry);
    console.log('Event logged:', logEntry);
    
    return { logged: true, plugin: this.name };
  },
  
  getLogs() {
    return [...this.logs];
  },
  
  clearLogs() {
    this.logs = [];
  }
};

export default loggingPlugin;

// Usage example
async function setupApp() {
  const pluginManager = new PluginManager();
  
  // Register plugins
  await pluginManager.registerPlugin('auth', './plugins/authPlugin.js');
  await pluginManager.registerPlugin('logging', './plugins/loggingPlugin.js');
  
  // Use plugins
  const authPlugin = pluginManager.getPlugin('auth');
  const user = authPlugin.authenticate('token123');
  
  // Execute hooks
  await pluginManager.executeHooks('user-login', { 
    email: user.email, 
    event: 'user-login' 
  });
  
  return pluginManager;
}
    `,
    
    factoryPattern: `
// Factory Pattern with Modules
// File: factories/componentFactory.js

import Button from '../components/Button.js';
import Input from '../components/Input.js';
import Modal from '../components/Modal.js';

const componentRegistry = new Map([
  ['button', Button],
  ['input', Input],
  ['modal', Modal]
]);

export class ComponentFactory {
  static register(name, componentClass) {
    componentRegistry.set(name, componentClass);
  }
  
  static create(type, props = {}) {
    const ComponentClass = componentRegistry.get(type);
    
    if (!ComponentClass) {
      throw new Error(\`Unknown component type: \${type}\`);
    }
    
    return new ComponentClass(props);
  }
  
  static getAvailableTypes() {
    return Array.from(componentRegistry.keys());
  }
  
  static async createAsync(type, props = {}) {
    // For dynamic imports
    if (!componentRegistry.has(type)) {
      try {
        const module = await import(\`../components/\${type}.js\`);
        componentRegistry.set(type, module.default);
      } catch (error) {
        throw new Error(\`Failed to load component: \${type}\`);
      }
    }
    
    return this.create(type, props);
  }
}

// Export factory instance and class
export const factory = new ComponentFactory();
export default ComponentFactory;

// File: services/serviceFactory.js
export class ServiceFactory {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  register(name, serviceClass, options = {}) {
    this.services.set(name, {
      class: serviceClass,
      singleton: options.singleton || false,
      dependencies: options.dependencies || []
    });
  }
  
  create(name, ...args) {
    const serviceConfig = this.services.get(name);
    
    if (!serviceConfig) {
      throw new Error(\`Service not registered: \${name}\`);
    }
    
    // Return singleton instance if exists
    if (serviceConfig.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }
    
    // Inject dependencies
    const dependencies = serviceConfig.dependencies.map(dep => this.create(dep));
    const instance = new serviceConfig.class(...dependencies, ...args);
    
    // Store singleton
    if (serviceConfig.singleton) {
      this.singletons.set(name, instance);
    }
    
    return instance;
  }
}

// Usage
const serviceFactory = new ServiceFactory();

// Register services
serviceFactory.register('database', DatabaseService, { singleton: true });
serviceFactory.register('auth', AuthService, { 
  singleton: true, 
  dependencies: ['database'] 
});
serviceFactory.register('api', ApiService, { 
  dependencies: ['auth', 'database'] 
});

export default serviceFactory;
    `
  }
};

// Best Practices
export const bestPractices = {
  concept: "Module Best Practices",
  explanation: `
    Guidelines and patterns for writing maintainable, performant,
    and well-organized ES6 modules.
  `,
  
  examples: {
    fileOrganization: `
// File Organization Best Practices

// 1. Clear naming conventions
// Good:
// - userService.js (camelCase for files)
// - UserService.js (PascalCase for classes)
// - constants.js (descriptive names)
// - utils/index.js (barrel files)

// Bad:
// - service.js (too generic)
// - stuff.js (meaningless)
// - helper.js (vague)

// 2. Consistent export patterns
// File: userService.js

// Group related functionality
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

// Helper functions
const validateUser = (user) => {
  return user.name && user.email && user.email.includes('@');
};

const formatUser = (user) => ({
  ...user,
  displayName: \`\${user.firstName} \${user.lastName}\`,
  initials: \`\${user.firstName[0]}\${user.lastName[0]}\`
});

// Main class
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.cache = new Map();
  }
  
  async getUser(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const user = await this.apiClient.get(\`/users/\${id}\`);
    this.cache.set(id, user);
    return user;
  }
  
  async createUser(userData) {
    if (!validateUser(userData)) {
      throw new Error('Invalid user data');
    }
    
    const user = await this.apiClient.post('/users', userData);
    return formatUser(user);
  }
}

// Organized exports
export {
  USER_STATUS,
  USER_ROLES,
  validateUser,
  formatUser
};

export default UserService;

// 3. Dependency management
// File: app.js

// Group imports by type
// Third-party imports first
import express from 'express';
import cors from 'cors';

// Internal imports
import config from './config/index.js';
import ApiClient from './services/apiClient.js';
import UserService from './services/userService.js';
import { logger } from './utils/logger.js';

// Feature imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
    `,
    
    performanceOptimization: `
// Performance Optimization Techniques

// 1. Tree-shaking friendly exports
// File: utils.js

// ✅ Good - named exports for tree-shaking
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ❌ Bad - single object export (harder to tree-shake)
// export default { debounce, throttle, memoize };

// 2. Lazy loading with dynamic imports
class FeatureManager {
  constructor() {
    this.loadedFeatures = new Map();
  }
  
  async loadFeature(featureName) {
    if (this.loadedFeatures.has(featureName)) {
      return this.loadedFeatures.get(featureName);
    }
    
    try {
      // Dynamic import for code splitting
      const module = await import(\`./features/\${featureName}.js\`);
      const feature = module.default;
      
      this.loadedFeatures.set(featureName, feature);
      return feature;
    } catch (error) {
      console.error(\`Failed to load feature \${featureName}:\`, error);
      throw error;
    }
  }
  
  // Preload critical features
  async preloadCriticalFeatures() {
    const criticalFeatures = ['auth', 'navigation', 'errorHandler'];
    
    await Promise.all(
      criticalFeatures.map(feature => this.loadFeature(feature))
    );
  }
}

// 3. Circular dependency prevention
// File: models/User.js

// ❌ Avoid circular dependencies
// import Post from './Post.js'; // If Post.js also imports User.js

// ✅ Use dependency injection instead
class User {
  constructor(userData, postService = null) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.postService = postService;
  }
  
  async getPosts() {
    if (!this.postService) {
      // Lazy load the service
      const { PostService } = await import('../services/postService.js');
      this.postService = new PostService();
    }
    
    return this.postService.getPostsByUserId(this.id);
  }
}

export default User;

// 4. Module initialization patterns
// File: services/database.js

let dbInstance = null;

class DatabaseService {
  constructor(config) {
    if (dbInstance) {
      return dbInstance;
    }
    
    this.config = config;
    this.connected = false;
    this.pool = null;
    
    dbInstance = this;
  }
  
  async connect() {
    if (this.connected) return;
    
    try {
      // Connection logic
      this.connected = true;
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  
  static async getInstance(config) {
    if (!dbInstance) {
      dbInstance = new DatabaseService(config);
      await dbInstance.connect();
    }
    return dbInstance;
  }
}

export default DatabaseService;

// 5. Environment-specific modules
// File: services/logger.js

let logger;

if (process.env.NODE_ENV === 'production') {
  // Production logger with minimal output
  logger = {
    info: (message) => console.log(message),
    warn: (message) => console.warn(message),
    error: (message) => console.error(message),
    debug: () => {} // No debug in production
  };
} else {
  // Development logger with detailed output
  logger = {
    info: (message) => console.log(\`[INFO] \${new Date().toISOString()}: \${message}\`),
    warn: (message) => console.warn(\`[WARN] \${new Date().toISOString()}: \${message}\`),
    error: (message) => console.error(\`[ERROR] \${new Date().toISOString()}: \${message}\`),
    debug: (message) => console.log(\`[DEBUG] \${new Date().toISOString()}: \${message}\`)
  };
}

export { logger };
export default logger;
    `
  }
};

// Export all concepts
export default {
  config: modulesConfig,
  concepts: {
    exportSyntax,
    importSyntax,
    modulePatterns,
    bestPractices
  }
};