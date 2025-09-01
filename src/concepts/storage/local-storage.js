// File: src/concepts/storage/local-storage.js
// Browser Storage - Local Storage in JavaScript

export const localStorageContent = {
  title: "Local Storage",
  description: "Master browser local storage for persistent client-side data management",
  
  theory: {
    introduction: `
      Local Storage is a web storage API that allows you to store data in a user's browser 
      with no expiration time. Data stored in local storage persists until explicitly cleared 
      by the user or your application. It provides a simple key-value storage mechanism with 
      a larger storage capacity than cookies (typically 5-10MB per origin).
    `,
    
    concepts: [
      {
        name: "Basic Local Storage Operations",
        explanation: "Fundamental operations for storing and retrieving data",
        example: `
// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = 'localStorage-test';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('localStorage not available:', error);
    return false;
  }
}

console.log('localStorage available:', isLocalStorageAvailable());

// Basic storage operations
if (isLocalStorageAvailable()) {
  // Store simple string data
  localStorage.setItem('username', 'john_doe');
  localStorage.setItem('theme', 'dark');
  localStorage.setItem('language', 'en');
  
  // Retrieve data
  const username = localStorage.getItem('username');
  const theme = localStorage.getItem('theme');
  const language = localStorage.getItem('language');
  
  console.log('Retrieved data:', { username, theme, language });
  
  // Check if key exists
  const hasUsername = localStorage.getItem('username') !== null;
  const hasEmail = localStorage.getItem('email') !== null;
  
  console.log('Has username:', hasUsername); // true
  console.log('Has email:', hasEmail); // false
  
  // Remove single item
  localStorage.removeItem('language');
  console.log('After removing language:', localStorage.getItem('language')); // null
  
  // Get all localStorage keys
  console.log('All keys:', Object.keys(localStorage));
  
  // Get storage length
  console.log('Storage length:', localStorage.length);
  
  // Clear all localStorage data
  // localStorage.clear();
}

// Working with JSON data
const userData = {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true,
    autoSave: false
  },
  lastLogin: new Date().toISOString()
};

// Store JSON data (must stringify)
try {
  localStorage.setItem('userData', JSON.stringify(userData));
  console.log('User data stored successfully');
} catch (error) {
  console.error('Error storing user data:', error);
}

// Retrieve and parse JSON data
try {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    const parsedUserData = JSON.parse(storedUserData);
    console.log('Retrieved user data:', parsedUserData);
    console.log('User theme:', parsedUserData.preferences.theme);
  }
} catch (error) {
  console.error('Error parsing user data:', error);
}

// Storage event listener (fires when localStorage is modified in another tab/window)
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage) {
    console.log('localStorage changed in another tab:', {
      key: event.key,
      oldValue: event.oldValue,
      newValue: event.newValue,
      url: event.url
    });
  }
});

// Iterate through all localStorage items
function displayAllStorageItems() {
  console.log('All localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(\`  \${key}: \${value}\`);
  }
}

displayAllStorageItems();
        `
      },
      
      {
        name: "LocalStorage Utility Functions",
        explanation: "Helper functions for safer and more convenient localStorage usage",
        example: `
// LocalStorage utility class
class LocalStorageUtils {
  // Check if localStorage is supported
  static isSupported() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Safe set with error handling
  static setItem(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(\`Error setting localStorage item '\${key}':\`, error);
      return false;
    }
  }
  
  // Safe get with automatic JSON parsing
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item; // Return as string if not valid JSON
      }
    } catch (error) {
      console.error(\`Error getting localStorage item '\${key}':\`, error);
      return defaultValue;
    }
  }
  
  // Remove item safely
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(\`Error removing localStorage item '\${key}':\`, error);
      return false;
    }
  }
  
  // Check if key exists
  static hasItem(key) {
    return localStorage.getItem(key) !== null;
  }
  
  // Get all keys
  static getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  }
  
  // Get all items as an object
  static getAllItems() {
    const items = {};
    this.getAllKeys().forEach(key => {
      items[key] = this.getItem(key);
    });
    return items;
  }
  
  // Clear all items
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  // Get storage size (approximate)
  static getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
  
  // Get human readable storage size
  static getStorageSizeFormatted() {
    const bytes = this.getStorageSize();
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Set item with expiration
  static setItemWithExpiry(key, value, expiryInMinutes) {
    const now = new Date().getTime();
    const item = {
      value: value,
      expiry: now + (expiryInMinutes * 60 * 1000)
    };
    return this.setItem(key, item);
  }
  
  // Get item with expiration check
  static getItemWithExpiry(key, defaultValue = null) {
    const item = this.getItem(key);
    if (!item) return defaultValue;
    
    // Check if item has expiry structure
    if (typeof item === 'object' && item.expiry && item.value !== undefined) {
      const now = new Date().getTime();
      if (now > item.expiry) {
        this.removeItem(key);
        return defaultValue;
      }
      return item.value;
    }
    
    // Return item as-is if no expiry structure
    return item || defaultValue;
  }
  
  // Bulk operations
  static setMultiple(items) {
    const results = {};
    for (const [key, value] of Object.entries(items)) {
      results[key] = this.setItem(key, value);
    }
    return results;
  }
  
  static getMultiple(keys, defaultValue = null) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.getItem(key, defaultValue);
    });
    return results;
  }
  
  static removeMultiple(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.removeItem(key);
    });
    return results;
  }
  
  // Namespace operations
  static setNamespaced(namespace, key, value) {
    return this.setItem(\`\${namespace}:\${key}\`, value);
  }
  
  static getNamespaced(namespace, key, defaultValue = null) {
    return this.getItem(\`\${namespace}:\${key}\`, defaultValue);
  }
  
  static getAllNamespaced(namespace) {
    const items = {};
    const prefix = \`\${namespace}:\`;
    
    this.getAllKeys()
      .filter(key => key.startsWith(prefix))
      .forEach(key => {
        const cleanKey = key.substring(prefix.length);
        items[cleanKey] = this.getItem(key);
      });
    
    return items;
  }
  
  static clearNamespaced(namespace) {
    const prefix = \`\${namespace}:\`;
    const keysToRemove = this.getAllKeys().filter(key => key.startsWith(prefix));
    return this.removeMultiple(keysToRemove);
  }
}

// Usage examples
console.log('=== LocalStorage Utils Demo ===');

if (LocalStorageUtils.isSupported()) {
  // Basic usage
  LocalStorageUtils.setItem('user', { 
    name: 'John Doe', 
    email: 'john@example.com',
    preferences: { theme: 'dark' }
  });
  
  const user = LocalStorageUtils.getItem('user');
  console.log('Retrieved user:', user);
  
  // With expiration
  LocalStorageUtils.setItemWithExpiry('session', { token: 'abc123' }, 30); // 30 minutes
  console.log('Session token:', LocalStorageUtils.getItemWithExpiry('session'));
  
  // Bulk operations
  LocalStorageUtils.setMultiple({
    'app_version': '1.2.3',
    'last_update': new Date().toISOString(),
    'feature_flags': ['dark_mode', 'new_ui']
  });
  
  const appData = LocalStorageUtils.getMultiple(['app_version', 'last_update', 'feature_flags']);
  console.log('App data:', appData);
  
  // Namespaced storage
  LocalStorageUtils.setNamespaced('settings', 'theme', 'dark');
  LocalStorageUtils.setNamespaced('settings', 'language', 'en');
  LocalStorageUtils.setNamespaced('cache', 'api_response', { data: 'cached data' });
  
  console.log('All settings:', LocalStorageUtils.getAllNamespaced('settings'));
  console.log('Storage size:', LocalStorageUtils.getStorageSizeFormatted());
}

// Advanced LocalStorage wrapper with events and validation
class LocalStorageManager extends EventTarget {
  constructor(namespace = '', options = {}) {
    super();
    this.namespace = namespace;
    this.options = {
      enableEvents: true,
      enableValidation: false,
      enableEncryption: false,
      ...options
    };
    this.validators = {};
    
    // Listen to storage events from other tabs
    if (this.options.enableEvents) {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }
  
  // Add validator for a key
  addValidator(key, validatorFn) {
    this.validators[key] = validatorFn;
    return this;
  }
  
  // Validate data before storing
  validate(key, value) {
    if (this.validators[key]) {
      try {
        return this.validators[key](value);
      } catch (error) {
        console.error(\`Validation error for key '\${key}':\`, error);
        return false;
      }
    }
    return true;
  }
  
  // Get full key with namespace
  getFullKey(key) {
    return this.namespace ? \`\${this.namespace}:\${key}\` : key;
  }
  
  // Set item with validation and events
  set(key, value) {
    if (!this.validate(key, value)) {
      const error = new Error(\`Validation failed for key '\${key}'\`);
      this.dispatchEvent(new CustomEvent('validationError', { 
        detail: { key, value, error } 
      }));
      throw error;
    }
    
    const fullKey = this.getFullKey(key);
    const oldValue = LocalStorageUtils.getItem(fullKey);
    
    const success = LocalStorageUtils.setItem(fullKey, value);
    
    if (success && this.options.enableEvents) {
      this.dispatchEvent(new CustomEvent('itemSet', {
        detail: { key, value, oldValue, fullKey }
      }));
    }
    
    return success;
  }
  
  // Get item
  get(key, defaultValue = null) {
    const fullKey = this.getFullKey(key);
    const value = LocalStorageUtils.getItem(fullKey, defaultValue);
    
    if (this.options.enableEvents && value !== defaultValue) {
      this.dispatchEvent(new CustomEvent('itemGet', {
        detail: { key, value, fullKey }
      }));
    }
    
    return value;
  }
  
  // Remove item
  remove(key) {
    const fullKey = this.getFullKey(key);
    const oldValue = LocalStorageUtils.getItem(fullKey);
    const success = LocalStorageUtils.removeItem(fullKey);
    
    if (success && this.options.enableEvents) {
      this.dispatchEvent(new CustomEvent('itemRemoved', {
        detail: { key, oldValue, fullKey }
      }));
    }
    
    return success;
  }
  
  // Check if key exists
  has(key) {
    const fullKey = this.getFullKey(key);
    return LocalStorageUtils.hasItem(fullKey);
  }
  
  // Get all items in namespace
  getAll() {
    if (this.namespace) {
      return LocalStorageUtils.getAllNamespaced(this.namespace);
    }
    return LocalStorageUtils.getAllItems();
  }
  
  // Clear all items in namespace
  clear() {
    if (this.namespace) {
      const success = LocalStorageUtils.clearNamespaced(this.namespace);
      
      if (this.options.enableEvents) {
        this.dispatchEvent(new CustomEvent('cleared', {
          detail: { namespace: this.namespace }
        }));
      }
      
      return success;
    } else {
      const success = LocalStorageUtils.clear();
      
      if (this.options.enableEvents) {
        this.dispatchEvent(new CustomEvent('cleared', { detail: {} }));
      }
      
      return success;
    }
  }
  
  // Handle storage events from other tabs
  handleStorageEvent(event) {
    if (event.storageArea === localStorage) {
      const fullKey = event.key;
      let key = fullKey;
      
      // Check if it's within our namespace
      if (this.namespace) {
        const prefix = \`\${this.namespace}:\`;
        if (!fullKey.startsWith(prefix)) return;
        key = fullKey.substring(prefix.length);
      }
      
      this.dispatchEvent(new CustomEvent('externalChange', {
        detail: {
          key,
          fullKey,
          oldValue: event.oldValue ? JSON.parse(event.oldValue) : null,
          newValue: event.newValue ? JSON.parse(event.newValue) : null,
          url: event.url
        }
      }));
    }
  }
  
  // Batch operations
  setBatch(items) {
    const results = {};
    for (const [key, value] of Object.entries(items)) {
      try {
        results[key] = this.set(key, value);
      } catch (error) {
        results[key] = { success: false, error: error.message };
      }
    }
    return results;
  }
  
  // Export data
  export() {
    return {
      namespace: this.namespace,
      data: this.getAll(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  // Import data
  import(exportedData) {
    if (exportedData.namespace !== this.namespace) {
      throw new Error('Namespace mismatch');
    }
    
    const results = this.setBatch(exportedData.data);
    
    this.dispatchEvent(new CustomEvent('imported', {
      detail: { results, timestamp: exportedData.timestamp }
    }));
    
    return results;
  }
}

// Usage of advanced LocalStorage manager
console.log('\\n=== Advanced LocalStorage Manager Demo ===');

const userStorage = new LocalStorageManager('user', { 
  enableEvents: true,
  enableValidation: true 
});

// Add validators
userStorage.addValidator('email', (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
});

userStorage.addValidator('age', (age) => {
  return typeof age === 'number' && age >= 0 && age <= 150;
});

// Event listeners
userStorage.addEventListener('itemSet', (event) => {
  console.log('Item set:', event.detail);
});

userStorage.addEventListener('validationError', (event) => {
  console.log('Validation error:', event.detail.error.message);
});

userStorage.addEventListener('externalChange', (event) => {
  console.log('External change detected:', event.detail);
});

// Test the manager
try {
  userStorage.set('name', 'Jane Doe');
  userStorage.set('email', 'jane@example.com');
  userStorage.set('age', 28);
  
  console.log('User data:', userStorage.getAll());
  
  // This will trigger validation error
  // userStorage.set('email', 'invalid-email');
  
} catch (error) {
  console.log('Error:', error.message);
}

// Export data
const exportedData = userStorage.export();
console.log('Exported data keys:', Object.keys(exportedData));

// Settings storage with different namespace
const settingsStorage = new LocalStorageManager('settings');
settingsStorage.setBatch({
  theme: 'dark',
  language: 'en',
  notifications: true
});

console.log('Settings:', settingsStorage.getAll());
console.log('Total storage size:', LocalStorageUtils.getStorageSizeFormatted());
        `
      },
      
      {
        name: "Storage Quotas and Error Handling",
        explanation: "Managing storage limits and handling quota exceeded errors",
        example: `
// Storage quota management
class StorageQuotaManager {
  static checkQuotaSupport() {
    return 'storage' in navigator && 'estimate' in navigator.storage;
  }
  
  static async getStorageEstimate() {
    if (!this.checkQuotaSupport()) {
      return { supported: false };
    }
    
    try {
      const estimate = await navigator.storage.estimate();
      return {
        supported: true,
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota - estimate.usage,
        usagePercent: ((estimate.usage / estimate.quota) * 100).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return { supported: true, error: error.message };
    }
  }
  
  static formatBytes(bytes) {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  static async displayStorageInfo() {
    const estimate = await this.getStorageEstimate();
    
    if (!estimate.supported) {
      console.log('Storage quota API not supported');
      return estimate;
    }
    
    if (estimate.error) {
      console.log('Error getting storage info:', estimate.error);
      return estimate;
    }
    
    console.log('Storage Information:');
    console.log(\`  Quota: \${this.formatBytes(estimate.quota)}\`);
    console.log(\`  Used: \${this.formatBytes(estimate.usage)} (\${estimate.usagePercent}%)\`);
    console.log(\`  Available: \${this.formatBytes(estimate.available)}\`);
    
    return estimate;
  }
  
  static testStorageCapacity() {
    console.log('Testing localStorage capacity...');
    
    let data = '';
    let size = 0;
    const chunkSize = 1024 * 10; // 10KB chunks
    
    try {
      while (true) {
        const chunk = 'a'.repeat(chunkSize);
        const testKey = 'capacity_test';
        
        localStorage.setItem(testKey, data + chunk);
        data += chunk;
        size += chunkSize;
        
        console.log(\`Stored: \${(size / 1024).toFixed(0)}KB\`);
        
        // Stop at reasonable limit to prevent freezing
        if (size > 1024 * 1024 * 5) { // 5MB
          console.log('Stopped test at 5MB limit');
          break;
        }
      }
    } catch (error) {
      console.log(\`Storage limit reached at approximately \${(size / 1024).toFixed(0)}KB\`);
      console.log('Error:', error.name);
      
      // Clean up
      localStorage.removeItem('capacity_test');
    }
    
    return size;
  }
}

// Safe storage operations with quota handling
class SafeLocalStorage {
  static setItem(key, value, options = {}) {
    const { 
      onQuotaExceeded = null,
      autoCleanup = false,
      maxRetries = 3,
      retryDelay = 1000
    } = options;
    
    let retries = 0;
    
    const attemptStore = () => {
      try {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return { success: true };
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded for key:', key);
          
          if (onQuotaExceeded) {
            try {
              onQuotaExceeded(error, key, value);
            } catch (handlerError) {
              console.error('Error in quota exceeded handler:', handlerError);
            }
          }
          
          if (autoCleanup && retries < maxRetries) {
            console.log(\`Attempting cleanup and retry (\${retries + 1}/\${maxRetries})\`);
            this.performCleanup();
            
            setTimeout(() => {
              retries++;
              return attemptStore();
            }, retryDelay);
          }
          
          return { 
            success: false, 
            error: 'QUOTA_EXCEEDED',
            message: 'Storage quota exceeded',
            originalError: error
          };
        }
        
        return {
          success: false,
          error: error.name,
          message: error.message,
          originalError: error
        };
      }
    };
    
    return attemptStore();
  }
  
  static performCleanup(strategy = 'lru') {
    console.log('Performing localStorage cleanup...');
    
    const items = [];
    
    // Collect all items with metadata
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      items.push({
        key,
        value,
        size: key.length + value.length,
        timestamp: this.getItemTimestamp(key) || 0
      });
    }
    
    // Sort based on cleanup strategy
    switch (strategy) {
      case 'lru': // Least Recently Used
        items.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'size': // Largest items first
        items.sort((a, b) => b.size - a.size);
        break;
      case 'age': // Oldest items first
        items.sort((a, b) => a.timestamp - b.timestamp);
        break;
    }
    
    // Remove items until we free up some space
    const targetCleanupSize = this.getCurrentStorageSize() * 0.2; // Clean 20%
    let cleanedSize = 0;
    let cleanedCount = 0;
    
    for (const item of items) {
      if (cleanedSize >= targetCleanupSize) break;
      
      // Skip essential keys
      if (this.isEssentialKey(item.key)) continue;
      
      localStorage.removeItem(item.key);
      cleanedSize += item.size;
      cleanedCount++;
    }
    
    console.log(\`Cleaned up \${cleanedCount} items, freed \${cleanedSize} bytes\`);
    return { cleanedCount, cleanedSize };
  }
  
  static getCurrentStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
  
  static getItemTimestamp(key) {
    // Try to extract timestamp from special metadata keys
    const metaKey = \`\${key}_meta\`;
    try {
      const meta = JSON.parse(localStorage.getItem(metaKey) || '{}');
      return meta.lastAccessed || meta.created || 0;
    } catch {
      return 0;
    }
  }
  
  static isEssentialKey(key) {
    const essentialPrefixes = ['auth_', 'user_', 'config_', 'essential_'];
    return essentialPrefixes.some(prefix => key.startsWith(prefix));
  }
  
  static setItemWithMetadata(key, value, metadata = {}) {
    const metaKey = \`\${key}_meta\`;
    const metaData = {
      created: Date.now(),
      lastAccessed: Date.now(),
      ...metadata
    };
    
    // Store metadata first
    try {
      localStorage.setItem(metaKey, JSON.stringify(metaData));
    } catch (error) {
      console.warn('Could not store metadata for key:', key);
    }
    
    // Store actual data
    return this.setItem(key, value);
  }
  
  static getItemWithMetadata(key) {
    const metaKey = \`\${key}_meta\`;
    
    // Update last accessed time
    try {
      const meta = JSON.parse(localStorage.getItem(metaKey) || '{}');
      meta.lastAccessed = Date.now();
      localStorage.setItem(metaKey, JSON.stringify(meta));
    } catch (error) {
      // Metadata update failed, continue with getting the actual item
    }
    
    return LocalStorageUtils.getItem(key);
  }
}

// Usage examples
console.log('\\n=== Storage Quota Management Demo ===');

StorageQuotaManager.displayStorageInfo().then(estimate => {
  if (estimate.supported && !estimate.error) {
    console.log('Storage usage is at', estimate.usagePercent + '%');
    
    if (parseFloat(estimate.usagePercent) > 80) {
      console.log('⚠️ Storage is getting full, consider cleanup');
    }
  }
});

// Test safe storage operations
console.log('\\n=== Safe Storage Operations ===');

const result = SafeLocalStorage.setItem('test_data', { 
  message: 'This is test data',
  timestamp: Date.now()
}, {
  autoCleanup: true,
  onQuotaExceeded: (error, key, value) => {
    console.log(\`Quota exceeded while storing '\${key}'\`);
  }
});

console.log('Storage result:', result);

// Store item with metadata tracking
SafeLocalStorage.setItemWithMetadata('tracked_item', 'Important data', {
  category: 'essential',
  priority: 'high'
});

const trackedItem = SafeLocalStorage.getItemWithMetadata('tracked_item');
console.log('Tracked item:', trackedItem);

console.log('Current storage size:', SafeLocalStorage.getCurrentStorageSize(), 'bytes');

// Uncomment to test storage capacity (warning: may take time)
// StorageQuotaManager.testStorageCapacity();
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "User Preferences Management System",
      description: "Complete user preferences system with localStorage persistence",
      code: `
// User Preferences Management System
class UserPreferencesManager {
  constructor() {
    this.defaultPreferences = {
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      autoSave: true,
      notifications: {
        email: true,
        push: false,
        sound: true
      },
      privacy: {
        analyticsOptIn: false,
        shareData: false
      },
      ui: {
        sidebar: 'expanded',
        density: 'comfortable',
        animations: true
      }
    };
    
    this.storageKey = 'user_preferences';
    this.validators = this.setupValidators();
    this.eventListeners = [];
    
    // Load preferences on initialization
    this.preferences = this.loadPreferences();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.handleExternalChange.bind(this));
  }
  
  setupValidators() {
    return {
      theme: (value) => ['light', 'dark', 'auto'].includes(value),
      language: (value) => /^[a-z]{2}(-[A-Z]{2})?$/.test(value),
      fontSize: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value),
      autoSave: (value) => typeof value === 'boolean',
      'ui.sidebar': (value) => ['collapsed', 'expanded', 'auto'].includes(value),
      'ui.density': (value) => ['compact', 'comfortable', 'spacious'].includes(value)
    };
  }
  
  loadPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    
    return { ...this.defaultPreferences };
  }
  
  mergeWithDefaults(stored) {
    const merged = JSON.parse(JSON.stringify(this.defaultPreferences));
    
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    
    deepMerge(merged, stored);
    return merged;
  }
  
  savePreferences() {
    try {
      const toStore = {
        ...this.preferences,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(toStore));
      this.notifyListeners('saved', { preferences: this.preferences });
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      this.notifyListeners('error', { error, operation: 'save' });
      return false;
    }
  }
  
  get(path) {
    return this.getNestedValue(this.preferences, path);
  }
  
  set(path, value) {
    // Validate if validator exists
    const validator = this.validators[path];
    if (validator && !validator(value)) {
      const error = new Error(\`Invalid value for preference '\${path}': \${value}\`);
      this.notifyListeners('validationError', { path, value, error });
      throw error;
    }
    
    const oldValue = this.get(path);
    this.setNestedValue(this.preferences, path, value);
    
    const saved = this.savePreferences();
    
    if (saved) {
      this.notifyListeners('changed', { path, oldValue, newValue: value });
    }
    
    return saved;
  }
  
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
  
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }
  
  reset(path = null) {
    if (path) {
      const defaultValue = this.getNestedValue(this.defaultPreferences, path);
      if (defaultValue !== undefined) {
        this.set(path, defaultValue);
      }
    } else {
      this.preferences = { ...this.defaultPreferences };
      this.savePreferences();
      this.notifyListeners('reset', { preferences: this.preferences });
    }
  }
  
  export() {
    return {
      preferences: this.preferences,
      exported: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  import(data) {
    try {
      if (data.version !== '1.0') {
        throw new Error('Unsupported export version');
      }
      
      this.preferences = this.mergeWithDefaults(data.preferences);
      const saved = this.savePreferences();
      
      if (saved) {
        this.notifyListeners('imported', { preferences: this.preferences });
      }
      
      return saved;
    } catch (error) {
      console.error('Error importing preferences:', error);
      this.notifyListeners('error', { error, operation: 'import' });
      return false;
    }
  }
  
  // Event system
  addEventListener(type, callback) {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(callback);
  }
  
  removeEventListener(type, callback) {
    if (this.eventListeners[type]) {
      this.eventListeners[type] = this.eventListeners[type].filter(cb => cb !== callback);
    }
  }
  
  notifyListeners(type, data) {
    if (this.eventListeners[type]) {
      this.eventListeners[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in preference event listener:', error);
        }
      });
    }
  }
  
  handleExternalChange(event) {
    if (event.key === this.storageKey && event.storageArea === localStorage) {
      try {
        const newPreferences = JSON.parse(event.newValue);
        this.preferences = this.mergeWithDefaults(newPreferences);
        this.notifyListeners('externalChange', { 
          preferences: this.preferences,
          source: 'external'
        });
      } catch (error) {
        console.error('Error handling external preference change:', error);
      }
    }
  }
  
  // Batch operations
  setBatch(updates) {
    const results = {};
    const changes = [];
    
    for (const [path, value] of Object.entries(updates)) {
      try {
        const oldValue = this.get(path);
        this.setNestedValue(this.preferences, path, value);
        
        changes.push({ path, oldValue, newValue: value });
        results[path] = { success: true };
      } catch (error) {
        results[path] = { success: false, error: error.message };
      }
    }
    
    const saved = this.savePreferences();
    
    if (saved && changes.length > 0) {
      this.notifyListeners('batchChanged', { changes });
    }
    
    return { results, saved };
  }
  
  // Utility methods
  getAll() {
    return JSON.parse(JSON.stringify(this.preferences));
  }
  
  has(path) {
    return this.get(path) !== undefined;
  }
  
  getStorageSize() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? stored.length : 0;
    } catch {
      return 0;
    }
  }
}

// Theme Manager that uses preferences
class ThemeManager {
  constructor(preferencesManager) {
    this.preferences = preferencesManager;
    this.currentTheme = null;
    
    // Listen for theme changes
    this.preferences.addEventListener('changed', (data) => {
      if (data.path === 'theme') {
        this.applyTheme(data.newValue);
      }
    });
    
    // Apply initial theme
    this.applyTheme(this.preferences.get('theme'));
  }
  
  applyTheme(theme) {
    this.currentTheme = theme;
    
    // In a real app, you would update CSS classes, variables, etc.
    document.documentElement.setAttribute('data-theme', theme);
    console.log(\`Applied theme: \${theme}\`);
    
    // Handle auto theme
    if (theme === 'auto') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      console.log(\`Auto theme resolved to: \${effectiveTheme}\`);
    }
  }
  
  toggle() {
    const current = this.preferences.get('theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.preferences.set('theme', next);
  }
}

// Usage example
console.log('=== User Preferences Management Demo ===');

const preferences = new UserPreferencesManager();
const themeManager = new ThemeManager(preferences);

// Event listeners
preferences.addEventListener('changed', (data) => {
  console.log(\`Preference changed: \${data.path} = \${JSON.stringify(data.newValue)}\`);
});

preferences.addEventListener('validationError', (data) => {
  console.log(\`Validation error: \${data.error.message}\`);
});

preferences.addEventListener('externalChange', (data) => {
  console.log('Preferences updated in another tab');
});

// Test the system
console.log('Initial preferences:', preferences.getAll());

// Change individual preferences
preferences.set('theme', 'dark');
preferences.set('fontSize', 'large');
preferences.set('notifications.email', false);
preferences.set('ui.sidebar', 'collapsed');

// Batch update
const batchResult = preferences.setBatch({
  'language': 'es',
  'ui.density': 'compact',
  'autoSave': false
});

console.log('Batch update results:', batchResult);

// Test validation
try {
  preferences.set('theme', 'invalid-theme'); // Should throw error
} catch (error) {
  console.log('Caught validation error:', error.message);
}

// Export and import
const exported = preferences.export();
console.log('Exported data keys:', Object.keys(exported));

// Reset specific preference
preferences.reset('theme');
console.log('Theme after reset:', preferences.get('theme'));

// Toggle theme using theme manager
setTimeout(() => {
  themeManager.toggle();
  console.log('Theme toggled to:', preferences.get('theme'));
}, 1000);

console.log('Preferences storage size:', preferences.getStorageSize(), 'bytes');
      `
    }
  ],
  
  exercises: [
    {
      id: "localstorage-basic",
      title: "Shopping Cart Storage",
      difficulty: "easy",
      prompt: "Create a shopping cart that persists items in localStorage with add, remove, and clear functionality.",
      solution: `
class ShoppingCart {
  constructor() {
    this.storageKey = 'shopping_cart';
    this.items = this.loadCart();
  }
  
  loadCart() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }
  
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  }
  
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart();
    return this.items;
  }
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    return this.items;
  }
  
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
    
    return this.items;
  }
  
  clear() {
    this.items = [];
    this.saveCart();
  }
  
  getItems() {
    return [...this.items];
  }
  
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// Usage
const cart = new ShoppingCart();

cart.addItem({ id: 1, name: 'Laptop', price: 999 }, 1);
cart.addItem({ id: 2, name: 'Mouse', price: 29 }, 2);

console.log('Cart items:', cart.getItems());
console.log('Total:', cart.getTotal());
console.log('Item count:', cart.getItemCount());
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the storage limit for localStorage in most browsers?",
      options: [
        "1MB per origin",
        "5-10MB per origin", 
        "50MB per origin",
        "No limit"
      ],
      correct: 1,
      explanation: "Most browsers provide 5-10MB of localStorage per origin, which is much larger than cookies but still has limits."
    },
    
    {
      question: "What happens to localStorage data when the browser is closed?",
      options: [
        "Data is automatically deleted",
        "Data persists until manually cleared", 
        "Data expires after 24 hours",
        "Data is moved to sessionStorage"
      ],
      correct: 1,
      explanation: "localStorage data persists even after the browser is closed, until it's manually cleared by the user or your application."
    },
    
    {
      question: "What exception is thrown when localStorage quota is exceeded?",
      options: [
        "StorageLimitError",
        "QuotaExceededError",
        "DOMException", 
        "SecurityError"
      ],
      correct: 1,
      explanation: "When localStorage quota is exceeded, a QuotaExceededError (or DOMException with name 'QuotaExceededError') is thrown."
    }
  ]
};

export default localStorageContent;