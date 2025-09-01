// File: src/concepts/storage/session-storage.js
// Browser Storage - Session Storage in JavaScript

export const sessionStorageContent = {
  title: "Session Storage",
  description: "Learn to use session storage for temporary, tab-specific data persistence",
  
  theory: {
    introduction: `
      Session Storage is a web storage API similar to localStorage but with key differences: 
      data persists only for the duration of the page session and is isolated per tab. 
      When the tab is closed, all sessionStorage data is cleared. This makes it perfect 
      for storing temporary data, form states, or tab-specific information that shouldn't 
      persist between browser sessions.
    `,
    
    concepts: [
      {
        name: "Basic Session Storage Operations",
        explanation: "Fundamental operations for temporary data storage per browser tab",
        example: `
// Check if sessionStorage is available
function isSessionStorageAvailable() {
  try {
    const test = 'sessionStorage-test';
    sessionStorage.setItem(test, 'test');
    sessionStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('sessionStorage not available:', error);
    return false;
  }
}

console.log('sessionStorage available:', isSessionStorageAvailable());

if (isSessionStorageAvailable()) {
  // Basic operations
  sessionStorage.setItem('currentPage', 'dashboard');
  sessionStorage.setItem('viewMode', 'grid');
  sessionStorage.setItem('filterState', 'active');
  
  // Retrieve data
  const currentPage = sessionStorage.getItem('currentPage');
  const viewMode = sessionStorage.getItem('viewMode');
  const filterState = sessionStorage.getItem('filterState');
  
  console.log('Session data:', { currentPage, viewMode, filterState });
  
  // Working with JSON data
  const formState = {
    step: 2,
    completedSteps: [1],
    formData: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    timestamp: new Date().toISOString()
  };
  
  // Store JSON (must stringify)
  sessionStorage.setItem('wizardState', JSON.stringify(formState));
  
  // Retrieve and parse JSON
  const retrievedState = JSON.parse(sessionStorage.getItem('wizardState'));
  console.log('Wizard state:', retrievedState);
  
  // Check existence
  console.log('Has currentPage:', sessionStorage.getItem('currentPage') !== null);
  console.log('Has nonExistent:', sessionStorage.getItem('nonExistent') !== null);
  
  // Get all keys
  console.log('All session keys:', Object.keys(sessionStorage));
  console.log('Session length:', sessionStorage.length);
  
  // Iterate through all items
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(\`\${key}: \${value}\`);
  }
  
  // Remove specific item
  sessionStorage.removeItem('filterState');
  console.log('After removing filterState:', Object.keys(sessionStorage));
  
  // Clear all sessionStorage
  // sessionStorage.clear();
}

// Session storage vs localStorage comparison
console.log('\\n=== Storage Comparison ===');

// Set same data in both storages
const testData = { message: 'Hello from storage', timestamp: Date.now() };
localStorage.setItem('comparison-test', JSON.stringify(testData));
sessionStorage.setItem('comparison-test', JSON.stringify(testData));

console.log('localStorage data:', localStorage.getItem('comparison-test'));
console.log('sessionStorage data:', sessionStorage.getItem('comparison-test'));

// Note: sessionStorage will be cleared when tab closes, localStorage will persist

// Storage event listener (only fires for localStorage, not sessionStorage)
window.addEventListener('storage', (event) => {
  console.log('Storage event:', event.key, event.newValue);
  // This only fires for localStorage changes from other tabs
  // sessionStorage doesn't trigger storage events
});

// Tab communication using sessionStorage
function generateTabId() {
  return 'tab_' + Math.random().toString(36).substr(2, 9);
}

const tabId = generateTabId();
sessionStorage.setItem('tabId', tabId);
console.log('This tab ID:', tabId);

// Simulate tab-specific data
const tabData = {
  id: tabId,
  openedAt: new Date().toISOString(),
  pageViews: 1,
  lastActivity: new Date().toISOString()
};

sessionStorage.setItem('tabData', JSON.stringify(tabData));
        `
      },
      
      {
        name: "Session Storage Utilities",
        explanation: "Helper functions for safer session storage operations",
        example: `
// Session Storage utility class
class SessionStorageUtils {
  // Check if sessionStorage is supported
  static isSupported() {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, 'test');
      sessionStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Safe set with error handling
  static setItem(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(\`Error setting sessionStorage item '\${key}':\`, error);
      return false;
    }
  }
  
  // Safe get with automatic JSON parsing
  static getItem(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(\`Error getting sessionStorage item '\${key}':\`, error);
      return defaultValue;
    }
  }
  
  // Remove item safely
  static removeItem(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(\`Error removing sessionStorage item '\${key}':\`, error);
      return false;
    }
  }
  
  // Check if key exists
  static hasItem(key) {
    return sessionStorage.getItem(key) !== null;
  }
  
  // Get all keys
  static getAllKeys() {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      keys.push(sessionStorage.key(i));
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
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
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
  
  // Get session storage size
  static getStorageSize() {
    let total = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        total += sessionStorage[key].length + key.length;
      }
    }
    return total;
  }
  
  // Session-specific utilities
  static generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  static getSessionDuration() {
    const sessionStart = this.getItem('sessionStartTime');
    if (sessionStart) {
      return Date.now() - sessionStart;
    }
    
    // Initialize session start time if not set
    this.setItem('sessionStartTime', Date.now());
    return 0;
  }
  
  static trackPageView(page) {
    const views = this.getItem('pageViews', {});
    views[page] = (views[page] || 0) + 1;
    this.setItem('pageViews', views);
    
    // Track navigation history
    const history = this.getItem('navigationHistory', []);
    history.push({
      page,
      timestamp: Date.now()
    });
    
    // Keep only last 50 page views
    if (history.length > 50) {
      history.shift();
    }
    
    this.setItem('navigationHistory', history);
  }
}

// Usage examples
console.log('\\n=== SessionStorage Utils Demo ===');

if (SessionStorageUtils.isSupported()) {
  // Initialize session
  const sessionId = SessionStorageUtils.generateSessionId();
  SessionStorageUtils.setItem('sessionId', sessionId);
  SessionStorageUtils.setItem('sessionStartTime', Date.now());
  
  console.log('Session ID:', sessionId);
  console.log('Session duration:', SessionStorageUtils.getSessionDuration(), 'ms');
  
  // Bulk operations
  SessionStorageUtils.setMultiple({
    'current_user': { id: 123, name: 'John Doe' },
    'app_state': { route: '/dashboard', loading: false },
    'temp_data': { unsavedChanges: true }
  });
  
  const sessionData = SessionStorageUtils.getMultiple([
    'current_user', 'app_state', 'temp_data'
  ]);
  
  console.log('Session data:', sessionData);
  
  // Namespaced storage
  SessionStorageUtils.setNamespaced('form', 'step', 1);
  SessionStorageUtils.setNamespaced('form', 'data', { name: 'Test' });
  SessionStorageUtils.setNamespaced('ui', 'sidebar', 'collapsed');
  
  console.log('Form namespace:', SessionStorageUtils.getAllNamespaced('form'));
  console.log('UI namespace:', SessionStorageUtils.getAllNamespaced('ui'));
  
  // Track page views
  SessionStorageUtils.trackPageView('/dashboard');
  SessionStorageUtils.trackPageView('/profile');
  SessionStorageUtils.trackPageView('/dashboard');
  
  console.log('Page views:', SessionStorageUtils.getItem('pageViews'));
  console.log('Navigation history:', SessionStorageUtils.getItem('navigationHistory'));
  
  console.log('Storage size:', SessionStorageUtils.getStorageSize(), 'bytes');
}
        `
      },
      
      {
        name: "Form State Management",
        explanation: "Using session storage to preserve form data across page reloads",
        example: `
// Form State Manager using sessionStorage
class FormStateManager {
  constructor(formId, options = {}) {
    this.formId = formId;
    this.options = {
      autoSave: true,
      saveInterval: 1000,
      clearOnSubmit: true,
      excludeFields: ['password', 'confirmPassword'],
      includeHidden: false,
      ...options
    };
    
    this.storageKey = \`form_state_\${formId}\`;
    this.saveTimeout = null;
    this.form = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    this.form = document.getElementById(this.formId);
    if (!this.form) {
      console.warn(\`Form with ID '\${this.formId}' not found\`);
      return;
    }
    
    this.setupEventListeners();
    this.restoreFormState();
  }
  
  setupEventListeners() {
    if (!this.form) return;
    
    // Auto-save on input changes
    if (this.options.autoSave) {
      this.form.addEventListener('input', (e) => {
        this.scheduleAutoSave();
      });
      
      this.form.addEventListener('change', (e) => {
        this.scheduleAutoSave();
      });
    }
    
    // Clear state on successful submission
    if (this.options.clearOnSubmit) {
      this.form.addEventListener('submit', (e) => {
        // Wait a bit before clearing in case submission fails
        setTimeout(() => {
          this.clearState();
        }, 1000);
      });
    }
    
    // Save state before page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveState();
      }
    });
  }
  
  scheduleAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveState();
    }, this.options.saveInterval);
  }
  
  getFormData() {
    if (!this.form) return {};
    
    const formData = new FormData(this.form);
    const data = {};
    
    // Get all form fields
    const fields = this.form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      if (this.shouldIncludeField(field)) {
        if (field.type === 'checkbox') {
          data[field.name] = field.checked;
        } else if (field.type === 'radio') {
          if (field.checked) {
            data[field.name] = field.value;
          }
        } else if (field.type === 'file') {
          // Don't save file inputs
          return;
        } else {
          data[field.name] = field.value;
        }
      }
    });
    
    return data;
  }
  
  shouldIncludeField(field) {
    // Skip fields without names
    if (!field.name) return false;
    
    // Skip excluded fields
    if (this.options.excludeFields.includes(field.name)) return false;
    
    // Skip hidden fields unless explicitly included
    if (!this.options.includeHidden && field.type === 'hidden') return false;
    
    // Skip disabled fields
    if (field.disabled) return false;
    
    return true;
  }
  
  saveState() {
    const formData = this.getFormData();
    const stateData = {
      data: formData,
      savedAt: new Date().toISOString(),
      url: window.location.href
    };
    
    SessionStorageUtils.setItem(this.storageKey, stateData);
    
    // Dispatch custom event
    this.form.dispatchEvent(new CustomEvent('formStateSaved', {
      detail: { formData, savedAt: stateData.savedAt }
    }));
  }
  
  restoreFormState() {
    const stateData = SessionStorageUtils.getItem(this.storageKey);
    
    if (!stateData || !stateData.data) {
      return false;
    }
    
    // Check if state is from the same URL (optional)
    if (stateData.url !== window.location.href) {
      console.log('Form state from different URL, skipping restore');
      return false;
    }
    
    const { data } = stateData;
    let restoredFields = 0;
    
    Object.entries(data).forEach(([fieldName, value]) => {
      const field = this.form.querySelector(\`[name="\${fieldName}"]\`);
      
      if (field && this.shouldIncludeField(field)) {
        if (field.type === 'checkbox') {
          field.checked = value;
          restoredFields++;
        } else if (field.type === 'radio') {
          if (field.value === value) {
            field.checked = true;
            restoredFields++;
          }
        } else {
          field.value = value;
          restoredFields++;
        }
        
        // Trigger change event to update any dependent logic
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    
    if (restoredFields > 0) {
      // Dispatch custom event
      this.form.dispatchEvent(new CustomEvent('formStateRestored', {
        detail: { 
          restoredFields, 
          savedAt: stateData.savedAt,
          formData: data
        }
      }));
      
      console.log(\`Restored \${restoredFields} form fields from session\`);
      return true;
    }
    
    return false;
  }
  
  clearState() {
    SessionStorageUtils.removeItem(this.storageKey);
    
    // Dispatch custom event
    if (this.form) {
      this.form.dispatchEvent(new CustomEvent('formStateCleared'));
    }
  }
  
  hasState() {
    return SessionStorageUtils.hasItem(this.storageKey);
  }
  
  getStateInfo() {
    const stateData = SessionStorageUtils.getItem(this.storageKey);
    
    if (!stateData) {
      return null;
    }
    
    return {
      savedAt: stateData.savedAt,
      url: stateData.url,
      fieldCount: Object.keys(stateData.data || {}).length
    };
  }
  
  // Manual save/restore methods
  manualSave() {
    this.saveState();
  }
  
  manualRestore() {
    return this.restoreFormState();
  }
  
  // Export form state for debugging
  exportState() {
    return {
      formId: this.formId,
      currentData: this.getFormData(),
      savedState: SessionStorageUtils.getItem(this.storageKey),
      options: this.options
    };
  }
}

// Multi-step form wizard using sessionStorage
class FormWizard {
  constructor(containerId, steps) {
    this.containerId = containerId;
    this.steps = steps;
    this.currentStep = 0;
    this.formData = {};
    this.storageKey = \`wizard_\${containerId}\`;
    
    this.init();
  }
  
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(\`Container '\${this.containerId}' not found\`);
      return;
    }
    
    this.loadState();
    this.render();
  }
  
  loadState() {
    const state = SessionStorageUtils.getItem(this.storageKey);
    if (state) {
      this.currentStep = state.currentStep || 0;
      this.formData = state.formData || {};
      console.log('Wizard state restored:', state);
    }
  }
  
  saveState() {
    const state = {
      currentStep: this.currentStep,
      formData: this.formData,
      savedAt: new Date().toISOString()
    };
    
    SessionStorageUtils.setItem(this.storageKey, state);
  }
  
  nextStep() {
    this.saveCurrentStepData();
    
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.saveState();
      this.render();
    }
  }
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.saveState();
      this.render();
    }
  }
  
  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.saveCurrentStepData();
      this.currentStep = stepIndex;
      this.saveState();
      this.render();
    }
  }
  
  saveCurrentStepData() {
    const currentStepElement = this.container.querySelector('.wizard-step.active');
    if (currentStepElement) {
      const form = currentStepElement.querySelector('form');
      if (form) {
        const formData = new FormData(form);
        const stepKey = this.steps[this.currentStep].id;
        
        this.formData[stepKey] = {};
        
        for (const [key, value] of formData.entries()) {
          this.formData[stepKey][key] = value;
        }
      }
    }
  }
  
  render() {
    const step = this.steps[this.currentStep];
    
    this.container.innerHTML = \`
      <div class="wizard-header">
        <h2>\${step.title}</h2>
        <div class="wizard-progress">
          Step \${this.currentStep + 1} of \${this.steps.length}
        </div>
      </div>
      
      <div class="wizard-step active">
        \${step.content}
      </div>
      
      <div class="wizard-navigation">
        <button 
          onclick="wizard.previousStep()" 
          \${this.currentStep === 0 ? 'disabled' : ''}
        >
          Previous
        </button>
        
        <button 
          onclick="wizard.nextStep()" 
          \${this.currentStep === this.steps.length - 1 ? 'disabled' : ''}
        >
          \${this.currentStep === this.steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
      
      <div class="wizard-steps-indicator">
        \${this.steps.map((step, index) => \`
          <div class="step-indicator \${index === this.currentStep ? 'active' : ''} \${index < this.currentStep ? 'completed' : ''}"
               onclick="wizard.goToStep(\${index})">
            \${index + 1}
          </div>
        \`).join('')}
      </div>
    \`;
    
    // Restore form data for current step
    this.restoreCurrentStepData();
  }
  
  restoreCurrentStepData() {
    const stepKey = this.steps[this.currentStep].id;
    const stepData = this.formData[stepKey];
    
    if (stepData) {
      Object.entries(stepData).forEach(([fieldName, value]) => {
        const field = this.container.querySelector(\`[name="\${fieldName}"]\`);
        if (field) {
          field.value = value;
        }
      });
    }
  }
  
  reset() {
    this.currentStep = 0;
    this.formData = {};
    SessionStorageUtils.removeItem(this.storageKey);
    this.render();
  }
  
  getAllData() {
    this.saveCurrentStepData();
    return { ...this.formData };
  }
  
  getProgress() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.steps.length,
      percentage: Math.round((this.currentStep / (this.steps.length - 1)) * 100)
    };
  }
}

// Usage examples
console.log('\\n=== Form State Management Demo ===');

// Example: Create a form state manager
// Note: This would work with actual HTML forms in a real application
const formManager = new FormStateManager('contact-form', {
  autoSave: true,
  saveInterval: 2000,
  excludeFields: ['password']
});

// Example wizard steps
const wizardSteps = [
  {
    id: 'personal',
    title: 'Personal Information',
    content: \`
      <form>
        <input type="text" name="firstName" placeholder="First Name" />
        <input type="text" name="lastName" placeholder="Last Name" />
        <input type="email" name="email" placeholder="Email" />
      </form>
    \`
  },
  {
    id: 'preferences',
    title: 'Preferences',
    content: \`
      <form>
        <select name="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <input type="checkbox" name="newsletter" /> Subscribe to newsletter
      </form>
    \`
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    content: \`
      <div>Please review your information and confirm.</div>
    \`
  }
];

// Create wizard instance
// const wizard = new FormWizard('wizard-container', wizardSteps);

// Simulate some session storage usage
console.log('Session storage demo with temporary data:');

// Store temporary UI state
SessionStorageUtils.setNamespaced('ui', 'sidebar', 'collapsed');
SessionStorageUtils.setNamespaced('ui', 'theme', 'dark');
SessionStorageUtils.setNamespaced('ui', 'language', 'en');

// Store temporary form data
SessionStorageUtils.setNamespaced('form', 'draft', {
  title: 'Draft Article',
  content: 'This is a draft...',
  lastSaved: new Date().toISOString()
});

// Store navigation state
SessionStorageUtils.setNamespaced('nav', 'breadcrumb', [
  { label: 'Home', path: '/' },
  { label: 'Articles', path: '/articles' },
  { label: 'New Article', path: '/articles/new' }
]);

console.log('UI state:', SessionStorageUtils.getAllNamespaced('ui'));
console.log('Form state:', SessionStorageUtils.getAllNamespaced('form'));
console.log('Navigation state:', SessionStorageUtils.getAllNamespaced('nav'));

console.log('Total session storage size:', SessionStorageUtils.getStorageSize(), 'bytes');
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Shopping Session Manager",
      description: "Complete shopping session with cart, filters, and temporary user preferences",
      code: `
// Shopping Session Manager
class ShoppingSessionManager {
  constructor() {
    this.storageKeys = {
      cart: 'shopping_cart',
      filters: 'product_filters', 
      preferences: 'user_preferences',
      browsing: 'browsing_history',
      comparison: 'product_comparison',
      searchHistory: 'search_history'
    };
    
    this.maxHistoryItems = 50;
    this.maxComparisonItems = 4;
    this.maxSearchHistory = 10;
    
    this.init();
  }
  
  init() {
    // Initialize session if first visit
    if (!SessionStorageUtils.hasItem('session_initialized')) {
      this.initializeSession();
    }
    
    // Track session activity
    this.updateActivity();
    
    // Set up activity tracking
    this.setupActivityTracking();
  }
  
  initializeSession() {
    const sessionData = {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      pageViews: 0,
      lastActivity: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    
    SessionStorageUtils.setItem('session_initialized', sessionData);
    console.log('Shopping session initialized:', sessionData.sessionId);
  }
  
  generateSessionId() {
    return 'shop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  setupActivityTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActivity();
      }
    });
    
    // Track user interactions
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.throttledActivityUpdate();
      });
    });
    
    // Track page navigation
    window.addEventListener('beforeunload', () => {
      this.saveSessionData();
    });
  }
  
  throttledActivityUpdate = this.throttle(() => {
    this.updateActivity();
  }, 30000); // Update every 30 seconds
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
  
  updateActivity() {
    const session = SessionStorageUtils.getItem('session_initialized');
    if (session) {
      session.lastActivity = new Date().toISOString();
      session.pageViews = (session.pageViews || 0) + 1;
      SessionStorageUtils.setItem('session_initialized', session);
    }
  }
  
  // Cart Management
  getCart() {
    return SessionStorageUtils.getItem(this.storageKeys.cart, []);
  }
  
  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.lastUpdated = new Date().toISOString();
    } else {
      cart.push({
        ...product,
        quantity,
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
    }
    
    SessionStorageUtils.setItem(this.storageKeys.cart, cart);
    this.updateActivity();
    
    return cart;
  }
  
  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    SessionStorageUtils.setItem(this.storageKeys.cart, cart);
    return cart;
  }
  
  updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.lastUpdated = new Date().toISOString();
        SessionStorageUtils.setItem(this.storageKeys.cart, cart);
      }
    }
    
    return cart;
  }
  
  clearCart() {
    SessionStorageUtils.removeItem(this.storageKeys.cart);
    return [];
  }
  
  getCartSummary() {
    const cart = this.getCart();
    return {
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      uniqueItems: cart.length,
      lastUpdated: cart.reduce((latest, item) => {
        return new Date(item.lastUpdated) > new Date(latest) ? item.lastUpdated : latest;
      }, '1970-01-01T00:00:00.000Z')
    };
  }
  
  // Filter Management
  getFilters() {
    return SessionStorageUtils.getItem(this.storageKeys.filters, {});
  }
  
  setFilter(category, value) {
    const filters = this.getFilters();
    filters[category] = value;
    filters.lastUpdated = new Date().toISOString();
    
    SessionStorageUtils.setItem(this.storageKeys.filters, filters);
    return filters;
  }
  
  removeFilter(category) {
    const filters = this.getFilters();
    delete filters[category];
    filters.lastUpdated = new Date().toISOString();
    
    SessionStorageUtils.setItem(this.storageKeys.filters, filters);
    return filters;
  }
  
  clearFilters() {
    SessionStorageUtils.removeItem(this.storageKeys.filters);
    return {};
  }
  
  // Browsing History
  addToBrowsingHistory(product) {
    const history = SessionStorageUtils.getItem(this.storageKeys.browsing, []);
    
    // Remove if already exists
    const filtered = history.filter(item => item.id !== product.id);
    
    // Add to beginning
    filtered.unshift({
      ...product,
      viewedAt: new Date().toISOString()
    });
    
    // Limit history size
    const limited = filtered.slice(0, this.maxHistoryItems);
    
    SessionStorageUtils.setItem(this.storageKeys.browsing, limited);
    return limited;
  }
  
  getBrowsingHistory(limit = null) {
    const history = SessionStorageUtils.getItem(this.storageKeys.browsing, []);
    return limit ? history.slice(0, limit) : history;
  }
  
  clearBrowsingHistory() {
    SessionStorageUtils.removeItem(this.storageKeys.browsing);
    return [];
  }
  
  // Product Comparison
  addToComparison(product) {
    const comparison = SessionStorageUtils.getItem(this.storageKeys.comparison, []);
    
    // Check if already in comparison
    if (comparison.some(item => item.id === product.id)) {
      return { success: false, reason: 'Product already in comparison' };
    }
    
    // Check comparison limit
    if (comparison.length >= this.maxComparisonItems) {
      return { success: false, reason: 'Comparison limit reached' };
    }
    
    comparison.push({
      ...product,
      addedAt: new Date().toISOString()
    });
    
    SessionStorageUtils.setItem(this.storageKeys.comparison, comparison);
    return { success: true, comparison };
  }
  
  removeFromComparison(productId) {
    const comparison = SessionStorageUtils.getItem(this.storageKeys.comparison, [])
      .filter(item => item.id !== productId);
    
    SessionStorageUtils.setItem(this.storageKeys.comparison, comparison);
    return comparison;
  }
  
  getComparison() {
    return SessionStorageUtils.getItem(this.storageKeys.comparison, []);
  }
  
  clearComparison() {
    SessionStorageUtils.removeItem(this.storageKeys.comparison);
    return [];
  }
  
  // Search History
  addToSearchHistory(query, results = null) {
    if (!query.trim()) return;
    
    const history = SessionStorageUtils.getItem(this.storageKeys.searchHistory, []);
    
    // Remove if already exists
    const filtered = history.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    
    // Add to beginning
    filtered.unshift({
      query: query.trim(),
      resultCount: results ? results.length : null,
      searchedAt: new Date().toISOString()
    });
    
    // Limit history size
    const limited = filtered.slice(0, this.maxSearchHistory);
    
    SessionStorageUtils.setItem(this.storageKeys.searchHistory, limited);
    return limited;
  }
  
  getSearchHistory() {
    return SessionStorageUtils.getItem(this.storageKeys.searchHistory, []);
  }
  
  clearSearchHistory() {
    SessionStorageUtils.removeItem(this.storageKeys.searchHistory);
    return [];
  }
  
  // User Preferences (temporary for session)
  getPreferences() {
    return SessionStorageUtils.getItem(this.storageKeys.preferences, {
      sortBy: 'relevance',
      viewMode: 'grid',
      itemsPerPage: 12,
      currency: 'USD'
    });
  }
  
  setPreference(key, value) {
    const preferences = this.getPreferences();
    preferences[key] = value;
    preferences.lastUpdated = new Date().toISOString();
    
    SessionStorageUtils.setItem(this.storageKeys.preferences, preferences);
    return preferences;
  }
  
  // Session Export/Import
  exportSession() {
    const sessionData = {};
    
    Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
      sessionData[key] = SessionStorageUtils.getItem(storageKey);
    });
    
    sessionData.sessionInfo = SessionStorageUtils.getItem('session_initialized');
    sessionData.exportedAt = new Date().toISOString();
    
    return sessionData;
  }
  
  importSession(sessionData) {
    if (!sessionData || typeof sessionData !== 'object') {
      throw new Error('Invalid session data');
    }
    
    Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
      if (sessionData[key]) {
        SessionStorageUtils.setItem(storageKey, sessionData[key]);
      }
    });
    
    if (sessionData.sessionInfo) {
      SessionStorageUtils.setItem('session_initialized', sessionData.sessionInfo);
    }
    
    console.log('Session data imported successfully');
  }
  
  // Session Analytics
  getSessionAnalytics() {
    const sessionInfo = SessionStorageUtils.getItem('session_initialized');
    const cart = this.getCartSummary();
    const preferences = this.getPreferences();
    const filters = this.getFilters();
    
    return {
      session: sessionInfo,
      cart,
      browsedProducts: this.getBrowsingHistory().length,
      searchQueries: this.getSearchHistory().length,
      comparisonItems: this.getComparison().length,
      activeFilters: Object.keys(filters).length,
      preferences,
      sessionDuration: sessionInfo ? 
        Date.now() - new Date(sessionInfo.startTime).getTime() : 0
    };
  }
  
  saveSessionData() {
    const analytics = this.getSessionAnalytics();
    console.log('Session ending. Analytics:', analytics);
    
    // In a real app, you might send this data to your analytics service
    return analytics;
  }
  
  clearSession() {
    Object.values(this.storageKeys).forEach(key => {
      SessionStorageUtils.removeItem(key);
    });
    
    SessionStorageUtils.removeItem('session_initialized');
    console.log('Session cleared');
  }
}

// Usage example
console.log('=== Shopping Session Manager Demo ===');

const shoppingSession = new ShoppingSessionManager();

// Simulate shopping activity
const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { id: 2, name: 'Running Shoes', price: 129.99, category: 'Sports' },
  { id: 3, name: 'Coffee Maker', price: 79.99, category: 'Home' }
];

// Add products to cart
shoppingSession.addToCart(products[0], 1);
shoppingSession.addToCart(products[1], 2);

console.log('Cart summary:', shoppingSession.getCartSummary());

// Set some filters
shoppingSession.setFilter('category', 'Electronics');
shoppingSession.setFilter('priceRange', '50-150');
shoppingSession.setFilter('brand', 'Sony');

console.log('Active filters:', shoppingSession.getFilters());

// Add to browsing history
products.forEach(product => {
  shoppingSession.addToBrowsingHistory(product);
});

console.log('Browsing history:', shoppingSession.getBrowsingHistory(2));

// Add to comparison
shoppingSession.addToComparison(products[0]);
shoppingSession.addToComparison(products[2]);

console.log('Comparison:', shoppingSession.getComparison());

// Add search queries
shoppingSession.addToSearchHistory('wireless headphones', products);
shoppingSession.addToSearchHistory('bluetooth speakers', []);

console.log('Search history:', shoppingSession.getSearchHistory());

// Update preferences
shoppingSession.setPreference('sortBy', 'price_low_high');
shoppingSession.setPreference('viewMode', 'list');

console.log('Preferences:', shoppingSession.getPreferences());

// Get session analytics
const analytics = shoppingSession.getSessionAnalytics();
console.log('Session analytics:', analytics);

// Export session (useful for debugging or transferring sessions)
const exportedSession = shoppingSession.exportSession();
console.log('Exported session keys:', Object.keys(exportedSession));

setTimeout(() => {
  console.log('Session duration:', analytics.sessionDuration, 'ms');
}, 1000);
      `
    }
  ],
  
  exercises: [
    {
      id: "session-basic",
      title: "Tab-specific Counter",
      difficulty: "easy",
      prompt: "Create a counter that maintains separate counts for each browser tab using sessionStorage.",
      solution: `
class TabCounter {
  constructor() {
    this.storageKey = 'tab_counter';
    this.tabId = this.generateTabId();
    this.count = this.loadCount();
    
    console.log(\`Tab \${this.tabId} initialized with count: \${this.count}\`);
  }
  
  generateTabId() {
    let tabId = SessionStorageUtils.getItem('tab_id');
    if (!tabId) {
      tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      SessionStorageUtils.setItem('tab_id', tabId);
    }
    return tabId;
  }
  
  loadCount() {
    return SessionStorageUtils.getItem(this.storageKey, 0);
  }
  
  saveCount() {
    SessionStorageUtils.setItem(this.storageKey, this.count);
  }
  
  increment() {
    this.count++;
    this.saveCount();
    console.log(\`Tab \${this.tabId} count: \${this.count}\`);
    return this.count;
  }
  
  decrement() {
    this.count--;
    this.saveCount();
    console.log(\`Tab \${this.tabId} count: \${this.count}\`);
    return this.count;
  }
  
  reset() {
    this.count = 0;
    this.saveCount();
    console.log(\`Tab \${this.tabId} count reset\`);
    return this.count;
  }
  
  getCount() {
    return this.count;
  }
  
  getTabInfo() {
    return {
      tabId: this.tabId,
      count: this.count,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }
}

// Usage
const tabCounter = new TabCounter();

// Simulate some counting
tabCounter.increment();
tabCounter.increment();
tabCounter.increment();
tabCounter.decrement();

console.log('Tab info:', tabCounter.getTabInfo());
      `
    },
    
    {
      id: "session-intermediate", 
      title: "Multi-step Form with Session Persistence",
      difficulty: "medium",
      prompt: "Create a multi-step form that saves progress in sessionStorage and can resume from where the user left off.",
      solution: `
class MultiStepForm {
  constructor(formId) {
    this.formId = formId;
    this.storageKey = \`multistep_form_\${formId}\`;
    this.currentStep = 0;
    this.totalSteps = 0;
    this.formData = {};
    this.steps = [];
    
    this.loadProgress();
  }
  
  addStep(stepConfig) {
    this.steps.push({
      id: stepConfig.id,
      title: stepConfig.title,
      fields: stepConfig.fields,
      validation: stepConfig.validation || {},
      ...stepConfig
    });
    
    this.totalSteps = this.steps.length;
    return this;
  }
  
  loadProgress() {
    const saved = SessionStorageUtils.getItem(this.storageKey);
    if (saved) {
      this.currentStep = saved.currentStep || 0;
      this.formData = saved.formData || {};
      console.log('Form progress loaded:', {
        step: this.currentStep + 1,
        totalSteps: saved.totalSteps,
        completedData: Object.keys(this.formData)
      });
    }
  }
  
  saveProgress() {
    const progress = {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      formData: this.formData,
      lastSaved: new Date().toISOString(),
      formId: this.formId
    };
    
    SessionStorageUtils.setItem(this.storageKey, progress);
    
    console.log('Progress saved:', {
      step: this.currentStep + 1,
      completion: \`\${Math.round((this.currentStep / this.totalSteps) * 100)}%\`
    });
  }
  
  setStepData(stepId, data) {
    this.formData[stepId] = {
      ...this.formData[stepId],
      ...data,
      completedAt: new Date().toISOString()
    };
    
    this.saveProgress();
  }
  
  getStepData(stepId) {
    return this.formData[stepId] || {};
  }
  
  validateStep(stepIndex = this.currentStep) {
    const step = this.steps[stepIndex];
    const stepData = this.formData[step.id] || {};
    const errors = [];
    
    // Check required fields
    if (step.fields) {
      step.fields.forEach(field => {
        if (field.required && (!stepData[field.name] || stepData[field.name].trim() === '')) {
          errors.push(\`\${field.label || field.name} is required\`);
        }
      });
    }
    
    // Run custom validation
    if (step.validation && typeof step.validation.validate === 'function') {
      const customErrors = step.validation.validate(stepData);
      if (customErrors && customErrors.length > 0) {
        errors.push(...customErrors);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  nextStep() {
    // Validate current step
    const validation = this.validateStep();
    if (!validation.isValid) {
      console.log('Validation errors:', validation.errors);
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.saveProgress();
      
      return {
        success: true,
        currentStep: this.currentStep,
        stepInfo: this.getCurrentStepInfo()
      };
    }
    
    return {
      success: false,
      reason: 'Already on last step'
    };
  }
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.saveProgress();
      
      return {
        success: true,
        currentStep: this.currentStep,
        stepInfo: this.getCurrentStepInfo()
      };
    }
    
    return {
      success: false,
      reason: 'Already on first step'
    };
  }
  
  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.totalSteps) {
      this.currentStep = stepIndex;
      this.saveProgress();
      
      return {
        success: true,
        currentStep: this.currentStep,
        stepInfo: this.getCurrentStepInfo()
      };
    }
    
    return {
      success: false,
      reason: 'Invalid step index'
    };
  }
  
  getCurrentStepInfo() {
    const step = this.steps[this.currentStep];
    return {
      stepIndex: this.currentStep,
      stepId: step.id,
      title: step.title,
      isFirst: this.currentStep === 0,
      isLast: this.currentStep === this.totalSteps - 1,
      progress: Math.round(((this.currentStep + 1) / this.totalSteps) * 100),
      data: this.getStepData(step.id)
    };
  }
  
  getAllData() {
    return {
      formId: this.formId,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      formData: { ...this.formData },
      isComplete: this.isComplete()
    };
  }
  
  isComplete() {
    return this.currentStep === this.totalSteps - 1 && 
           this.validateStep().isValid;
  }
  
  submit() {
    // Validate all steps
    const allErrors = [];
    
    for (let i = 0; i < this.totalSteps; i++) {
      const validation = this.validateStep(i);
      if (!validation.isValid) {
        allErrors.push({
          step: i,
          stepId: this.steps[i].id,
          errors: validation.errors
        });
      }
    }
    
    if (allErrors.length > 0) {
      return {
        success: false,
        errors: allErrors
      };
    }
    
    // Mark as submitted
    const submissionData = {
      ...this.getAllData(),
      submittedAt: new Date().toISOString()
    };
    
    console.log('Form submitted successfully:', submissionData);
    
    // Clear progress after successful submission
    this.clearProgress();
    
    return {
      success: true,
      data: submissionData
    };
  }
  
  clearProgress() {
    SessionStorageUtils.removeItem(this.storageKey);
    this.currentStep = 0;
    this.formData = {};
    console.log('Form progress cleared');
  }
  
  hasProgress() {
    return SessionStorageUtils.hasItem(this.storageKey);
  }
  
  getProgressSummary() {
    if (!this.hasProgress()) {
      return null;
    }
    
    const completedSteps = Object.keys(this.formData).length;
    const progressPercent = Math.round((completedSteps / this.totalSteps) * 100);
    
    return {
      currentStep: this.currentStep + 1,
      totalSteps: this.totalSteps,
      completedSteps,
      progressPercent,
      canResume: true
    };
  }
}

// Usage example
const registrationForm = new MultiStepForm('registration');

// Define form steps
registrationForm
  .addStep({
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      { name: 'email', label: 'Email', required: true }
    ],
    validation: {
      validate: (data) => {
        const errors = [];
        if (data.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
          errors.push('Please enter a valid email address');
        }
        return errors;
      }
    }
  })
  .addStep({
    id: 'account',
    title: 'Account Setup',
    fields: [
      { name: 'username', label: 'Username', required: true },
      { name: 'password', label: 'Password', required: true },
      { name: 'confirmPassword', label: 'Confirm Password', required: true }
    ],
    validation: {
      validate: (data) => {
        const errors = [];
        if (data.password && data.password.length < 6) {
          errors.push('Password must be at least 6 characters');
        }
        if (data.password !== data.confirmPassword) {
          errors.push('Passwords do not match');
        }
        return errors;
      }
    }
  })
  .addStep({
    id: 'preferences',
    title: 'Preferences',
    fields: [
      { name: 'newsletter', label: 'Subscribe to newsletter' },
      { name: 'notifications', label: 'Enable notifications' }
    ]
  });

// Simulate form usage
console.log('=== Multi-step Form Demo ===');

// Check for existing progress
const progress = registrationForm.getProgressSummary();
if (progress) {
  console.log('Resuming form from step', progress.currentStep);
} else {
  console.log('Starting new form');
}

// Fill out first step
registrationForm.setStepData('personal', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com'
});

console.log('Current step info:', registrationForm.getCurrentStepInfo());

// Move to next step
let result = registrationForm.nextStep();
console.log('Next step result:', result);

// Fill out second step
registrationForm.setStepData('account', {
  username: 'johndoe',
  password: 'securepass123',
  confirmPassword: 'securepass123'
});

// Move to final step
result = registrationForm.nextStep();
console.log('Final step result:', result);

// Fill preferences
registrationForm.setStepData('preferences', {
  newsletter: true,
  notifications: false
});

// Submit form
const submissionResult = registrationForm.submit();
console.log('Submission result:', submissionResult.success ? 'Success' : 'Failed');

if (submissionResult.success) {
  console.log('Submitted data keys:', Object.keys(submissionResult.data.formData));
}
      `
    }
  ],
  
  quiz: [
    {
      question: "When is sessionStorage data automatically cleared?",
      options: [
        "When the browser is closed",
        "When the tab is closed", 
        "After 24 hours",
        "When localStorage quota is exceeded"
      ],
      correct: 1,
      explanation: "sessionStorage data is automatically cleared when the tab (or window) is closed, making it perfect for temporary, tab-specific data."
    },
    
    {
      question: "What is the main difference between localStorage and sessionStorage?",
      options: [
        "sessionStorage has a smaller storage limit",
        "sessionStorage data is tab-specific and temporary",
        "sessionStorage only stores strings",
        "sessionStorage doesn't support JSON"
      ],
      correct: 1,
      explanation: "The main difference is that sessionStorage data is isolated per tab and cleared when the tab closes, while localStorage persists across browser sessions."
    },
    
    {
      question: "Do sessionStorage changes trigger storage events?",
      options: [
        "Yes, like localStorage",
        "No, sessionStorage doesn't trigger storage events",
        "Only in the same tab",
        "Only when the tab is closed"
      ],
      correct: 1,
      explanation: "sessionStorage changes do not trigger storage events. Storage events only fire for localStorage changes from other tabs/windows."
    }
  ]
};

export default sessionStorageContent;