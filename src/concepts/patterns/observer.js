// File: src/concepts/patterns/observer.js
// Design Patterns - Observer Pattern in JavaScript

export const observerContent = {
  title: "Observer Pattern",
  description: "Learn to implement the Observer pattern for event-driven programming and reactive systems",
  
  theory: {
    introduction: `
      The Observer pattern defines a one-to-many dependency between objects so that when one 
      object (the subject) changes state, all dependent objects (observers) are notified 
      automatically. This pattern is fundamental to event-driven programming, reactive systems, 
      and implementing the Model-View architecture. It promotes loose coupling between the 
      subject and its observers.
    `,
    
    concepts: [
      {
        name: "Basic Observer Implementation",
        explanation: "Simple subject-observer relationship with subscription management",
        example: `
// Basic Observer Pattern Implementation
class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    if (typeof observer.update !== 'function') {
      throw new Error('Observer must have an update method');
    }
    
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log('Observer subscribed');
    }
    
    return this;
  }
  
  unsubscribe(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log('Observer unsubscribed');
    }
    
    return this;
  }
  
  notify(data) {
    console.log(\`Notifying \${this.observers.length} observers\`);
    
    this.observers.forEach(observer => {
      try {
        observer.update(data);
      } catch (error) {
        console.error('Error notifying observer:', error);
      }
    });
  }
  
  getObserverCount() {
    return this.observers.length;
  }
}

// Observer classes
class EmailObserver {
  constructor(email) {
    this.email = email;
  }
  
  update(data) {
    console.log(\`📧 Email notification to \${this.email}: \${data.message}\`);
  }
}

class SMSObserver {
  constructor(phone) {
    this.phone = phone;
  }
  
  update(data) {
    console.log(\`📱 SMS notification to \${this.phone}: \${data.message}\`);
  }
}

class DatabaseObserver {
  update(data) {
    console.log(\`💾 Logging to database: \${JSON.stringify(data)}\`);
  }
}

// Usage
const notificationSubject = new Subject();

const emailObserver = new EmailObserver('user@example.com');
const smsObserver = new SMSObserver('+1234567890');
const dbObserver = new DatabaseObserver();

// Subscribe observers
notificationSubject
  .subscribe(emailObserver)
  .subscribe(smsObserver)
  .subscribe(dbObserver);

// Notify all observers
notificationSubject.notify({
  type: 'order',
  message: 'Your order has been shipped!',
  orderId: 'ORD-123'
});

// Stock Price Monitor Example
class StockPrice extends Subject {
  constructor(symbol) {
    super();
    this.symbol = symbol;
    this.price = 0;
    this.previousPrice = 0;
  }
  
  setPrice(newPrice) {
    this.previousPrice = this.price;
    this.price = newPrice;
    
    const change = newPrice - this.previousPrice;
    const changePercent = this.previousPrice ? 
      ((change / this.previousPrice) * 100).toFixed(2) : 0;
    
    this.notify({
      symbol: this.symbol,
      price: newPrice,
      previousPrice: this.previousPrice,
      change: change,
      changePercent: parseFloat(changePercent),
      timestamp: new Date()
    });
  }
  
  getPrice() {
    return this.price;
  }
}

class TradingBot {
  constructor(name, strategy) {
    this.name = name;
    this.strategy = strategy; // 'buy-low', 'sell-high', 'momentum'
  }
  
  update(stockData) {
    const { symbol, price, change, changePercent } = stockData;
    
    if (this.strategy === 'buy-low' && changePercent < -5) {
      console.log(\`🤖 \${this.name}: BUY signal for \${symbol} at $\${price} (down \${Math.abs(changePercent)}%)\`);
    } else if (this.strategy === 'sell-high' && changePercent > 5) {
      console.log(\`🤖 \${this.name}: SELL signal for \${symbol} at $\${price} (up \${changePercent}%)\`);
    } else if (this.strategy === 'momentum' && Math.abs(changePercent) > 3) {
      const action = changePercent > 0 ? 'BUY' : 'SELL';
      console.log(\`🤖 \${this.name}: \${action} momentum signal for \${symbol} at $\${price}\`);
    }
  }
}

class PriceAlert {
  constructor(threshold, type = 'above') {
    this.threshold = threshold;
    this.type = type; // 'above' or 'below'
    this.triggered = false;
  }
  
  update(stockData) {
    const { symbol, price } = stockData;
    
    if (this.type === 'above' && price >= this.threshold && !this.triggered) {
      console.log(\`🚨 ALERT: \${symbol} is above $\${this.threshold} (current: $\${price})\`);
      this.triggered = true;
    } else if (this.type === 'below' && price <= this.threshold && !this.triggered) {
      console.log(\`🚨 ALERT: \${symbol} is below $\${this.threshold} (current: $\${price})\`);
      this.triggered = true;
    }
  }
  
  reset() {
    this.triggered = false;
  }
}

// Usage
const appleStock = new StockPrice('AAPL');

const buyBot = new TradingBot('BuyLowBot', 'buy-low');
const sellBot = new TradingBot('SellHighBot', 'sell-high');
const momentumBot = new TradingBot('MomentumBot', 'momentum');
const priceAlert = new PriceAlert(150, 'above');

appleStock
  .subscribe(buyBot)
  .subscribe(sellBot)
  .subscribe(momentumBot)
  .subscribe(priceAlert);

// Simulate price changes
appleStock.setPrice(145);
appleStock.setPrice(138); // Triggers buy-low bot
appleStock.setPrice(152); // Triggers sell-high bot and alert
        `
      },
      
      {
        name: "Event Emitter Pattern",
        explanation: "More flexible observer pattern with named events",
        example: `
// Advanced Event Emitter with named events
class EventEmitter {
  constructor() {
    this.events = {};
    this.maxListeners = 10;
  }
  
  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    if (this.events[eventName].length >= this.maxListeners) {
      console.warn(\`Max listeners (\${this.maxListeners}) exceeded for event '\${eventName}'\`);
    }
    
    this.events[eventName].push(listener);
    this.emit('newListener', eventName, listener);
    
    return this;
  }
  
  once(eventName, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(eventName, onceWrapper);
    };
    
    onceWrapper.originalListener = listener;
    return this.on(eventName, onceWrapper);
  }
  
  off(eventName, listener) {
    if (!this.events[eventName]) {
      return this;
    }
    
    if (!listener) {
      // Remove all listeners for this event
      delete this.events[eventName];
      this.emit('removeListener', eventName);
      return this;
    }
    
    const index = this.events[eventName].findIndex(l => 
      l === listener || l.originalListener === listener
    );
    
    if (index > -1) {
      this.events[eventName].splice(index, 1);
      this.emit('removeListener', eventName, listener);
      
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    }
    
    return this;
  }
  
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return false;
    }
    
    const listeners = [...this.events[eventName]]; // Copy to avoid issues if modified during emit
    
    listeners.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        this.emit('error', error);
      }
    });
    
    return true;
  }
  
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }
  
  eventNames() {
    return Object.keys(this.events);
  }
  
  listeners(eventName) {
    return this.events[eventName] ? [...this.events[eventName]] : [];
  }
  
  setMaxListeners(max) {
    this.maxListeners = max;
    return this;
  }
  
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
    return this;
  }
}

// User Activity Tracker using EventEmitter
class UserActivityTracker extends EventEmitter {
  constructor() {
    super();
    this.user = null;
    this.isActive = false;
    this.lastActivity = null;
    this.sessionStart = null;
    this.activities = [];
  }
  
  login(userData) {
    this.user = userData;
    this.isActive = true;
    this.sessionStart = new Date();
    this.lastActivity = new Date();
    
    this.emit('user:login', {
      user: this.user,
      timestamp: this.sessionStart
    });
  }
  
  logout() {
    const sessionDuration = this.sessionStart ? 
      new Date() - this.sessionStart : 0;
    
    this.emit('user:logout', {
      user: this.user,
      sessionDuration,
      totalActivities: this.activities.length,
      timestamp: new Date()
    });
    
    this.user = null;
    this.isActive = false;
    this.sessionStart = null;
    this.activities = [];
  }
  
  trackActivity(activityType, data = {}) {
    if (!this.user) {
      throw new Error('User must be logged in to track activity');
    }
    
    const activity = {
      type: activityType,
      data,
      timestamp: new Date(),
      userId: this.user.id
    };
    
    this.activities.push(activity);
    this.lastActivity = activity.timestamp;
    
    this.emit('activity:tracked', activity);
    this.emit(\`activity:\${activityType}\`, activity);
  }
  
  getSessionInfo() {
    return {
      user: this.user,
      isActive: this.isActive,
      sessionStart: this.sessionStart,
      lastActivity: this.lastActivity,
      sessionDuration: this.sessionStart ? new Date() - this.sessionStart : 0,
      totalActivities: this.activities.length
    };
  }
}

// Usage with various observers
const tracker = new UserActivityTracker();

// Analytics observer
tracker.on('activity:tracked', (activity) => {
  console.log(\`📊 Analytics: User \${activity.userId} performed \${activity.type}\`);
});

// Security observer
tracker.on('user:login', (data) => {
  console.log(\`🔐 Security: User \${data.user.name} logged in at \${data.timestamp}\`);
});

tracker.on('activity:suspicious', (activity) => {
  console.log(\`⚠️ Security Alert: Suspicious activity detected: \${activity.type}\`);
});

// Performance observer
tracker.on('activity:pageview', (activity) => {
  console.log(\`⚡ Performance: Page '\${activity.data.page}' loaded in \${activity.data.loadTime}ms\`);
});

// Notification observer
tracker.on('user:logout', (data) => {
  console.log(\`👋 Notification: User \${data.user.name} session ended. Duration: \${Math.round(data.sessionDuration/1000)}s\`);
});

// Simulate user activity
tracker.login({ id: 123, name: 'John Doe', role: 'user' });

tracker.trackActivity('pageview', { page: '/dashboard', loadTime: 234 });
tracker.trackActivity('click', { element: 'nav-button', page: '/dashboard' });
tracker.trackActivity('form_submit', { form: 'profile-update', success: true });

setTimeout(() => {
  tracker.logout();
}, 2000);
        `
      },
      
      {
        name: "Model-View Observer Pattern",
        explanation: "Observer pattern in Model-View architecture for reactive UIs",
        example: `
// Model-View Observer Pattern
class Model extends EventEmitter {
  constructor(initialData = {}) {
    super();
    this.data = { ...initialData };
    this.validators = {};
    this.history = [];
    this.maxHistory = 50;
  }
  
  addValidator(property, validatorFn) {
    if (!this.validators[property]) {
      this.validators[property] = [];
    }
    this.validators[property].push(validatorFn);
    return this;
  }
  
  validate(property, value) {
    if (this.validators[property]) {
      for (const validator of this.validators[property]) {
        const result = validator(value);
        if (!result.valid) {
          return result;
        }
      }
    }
    return { valid: true };
  }
  
  set(property, value) {
    const validation = this.validate(property, value);
    if (!validation.valid) {
      this.emit('validation:error', {
        property,
        value,
        error: validation.error
      });
      return false;
    }
    
    const oldValue = this.data[property];
    
    if (oldValue !== value) {
      // Add to history
      this.history.push({
        type: 'set',
        property,
        oldValue,
        newValue: value,
        timestamp: new Date()
      });
      
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      
      this.data[property] = value;
      
      this.emit('change', { property, oldValue, newValue: value });
      this.emit(\`change:\${property}\`, { oldValue, newValue: value });
    }
    
    return true;
  }
  
  get(property) {
    return property ? this.data[property] : { ...this.data };
  }
  
  has(property) {
    return property in this.data;
  }
  
  delete(property) {
    if (this.has(property)) {
      const oldValue = this.data[property];
      delete this.data[property];
      
      this.history.push({
        type: 'delete',
        property,
        oldValue,
        timestamp: new Date()
      });
      
      this.emit('delete', { property, oldValue });
      this.emit(\`delete:\${property}\`, { oldValue });
      
      return true;
    }
    return false;
  }
  
  reset() {
    const oldData = { ...this.data };
    this.data = {};
    this.history = [];
    
    this.emit('reset', { oldData });
  }
  
  getHistory() {
    return [...this.history];
  }
  
  undo() {
    const lastChange = this.history.pop();
    if (!lastChange) {
      return false;
    }
    
    if (lastChange.type === 'set') {
      this.data[lastChange.property] = lastChange.oldValue;
      this.emit('undo', lastChange);
      this.emit('change', {
        property: lastChange.property,
        oldValue: lastChange.newValue,
        newValue: lastChange.oldValue
      });
    } else if (lastChange.type === 'delete') {
      this.data[lastChange.property] = lastChange.oldValue;
      this.emit('undo', lastChange);
    }
    
    return true;
  }
}

// View classes that observe the model
class TextView {
  constructor(model, property, element) {
    this.model = model;
    this.property = property;
    this.element = element;
    
    // Listen for changes to specific property
    this.model.on(\`change:\${property}\`, this.render.bind(this));
    
    // Initial render
    this.render({ newValue: this.model.get(property) });
  }
  
  render({ newValue }) {
    if (this.element) {
      this.element.textContent = newValue || '';
    } else {
      console.log(\`TextView [\${this.property}]: \${newValue}\`);
    }
  }
}

class FormView {
  constructor(model) {
    this.model = model;
    this.fields = {};
    
    // Listen for validation errors
    this.model.on('validation:error', this.showValidationError.bind(this));
    
    // Listen for any changes
    this.model.on('change', this.updateForm.bind(this));
  }
  
  addField(property, fieldElement) {
    this.fields[property] = fieldElement;
    
    // Set up two-way binding
    if (fieldElement && fieldElement.addEventListener) {
      fieldElement.addEventListener('input', (e) => {
        this.model.set(property, e.target.value);
      });
    }
    
    return this;
  }
  
  updateForm({ property, newValue }) {
    if (this.fields[property]) {
      this.fields[property].value = newValue || '';
    } else {
      console.log(\`FormView updated [\${property}]: \${newValue}\`);
    }
  }
  
  showValidationError({ property, error }) {
    console.log(\`❌ Validation Error for \${property}: \${error}\`);
  }
}

class ListenerView {
  constructor(model) {
    this.model = model;
    this.items = [];
    
    this.model.on('change', this.addItem.bind(this));
    this.model.on('delete', this.removeItem.bind(this));
    this.model.on('reset', this.clearItems.bind(this));
  }
  
  addItem({ property, newValue, oldValue }) {
    const item = \`\${property}: \${oldValue || 'undefined'} → \${newValue}\`;
    this.items.push(item);
    console.log(\`📝 History: \${item}\`);
    
    // Keep only last 10 items
    if (this.items.length > 10) {
      this.items.shift();
    }
  }
  
  removeItem({ property, oldValue }) {
    const item = \`Deleted \${property}: \${oldValue}\`;
    this.items.push(item);
    console.log(\`🗑️ History: \${item}\`);
  }
  
  clearItems() {
    this.items = [];
    console.log(\`🧹 History cleared\`);
  }
  
  getHistory() {
    return [...this.items];
  }
}

// Usage example
const userModel = new Model({
  name: '',
  email: '',
  age: 0
});

// Add validators
userModel.addValidator('email', (value) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(value) ? 
    { valid: true } : 
    { valid: false, error: 'Invalid email format' };
});

userModel.addValidator('age', (value) => {
  return (value >= 0 && value <= 120) ? 
    { valid: true } : 
    { valid: false, error: 'Age must be between 0 and 120' };
});

// Create views
const nameView = new TextView(userModel, 'name');
const emailView = new TextView(userModel, 'email');
const formView = new FormView(userModel);
const historyView = new ListenerView(userModel);

// Simulate form interactions
console.log('=== Model-View Observer Demo ===');

userModel.set('name', 'John Doe');
userModel.set('email', 'john@example.com');
userModel.set('age', 30);

// Try invalid email
userModel.set('email', 'invalid-email'); // Should trigger validation error

// Try invalid age
userModel.set('age', 150); // Should trigger validation error

// Valid update
userModel.set('age', 25);

console.log('\\nModel data:', userModel.get());
console.log('History:', historyView.getHistory());

// Test undo
userModel.undo();
console.log('After undo - Age:', userModel.get('age'));
        `
      },
      
      {
        name: "Reactive Observer Pattern",
        explanation: "Advanced observer pattern with data streams and reactive programming",
        example: `
// Reactive Observer Pattern with Streams
class Observable {
  constructor(subscribeFn) {
    this.subscribe = subscribeFn;
  }
  
  // Create observable from values
  static of(...values) {
    return new Observable(observer => {
      values.forEach(value => observer.next(value));
      observer.complete();
      
      return () => {}; // Cleanup function
    });
  }
  
  // Create observable from array
  static from(array) {
    return Observable.of(...array);
  }
  
  // Create observable from events
  static fromEvent(element, eventName) {
    return new Observable(observer => {
      const handler = (event) => observer.next(event);
      element.addEventListener(eventName, handler);
      
      return () => {
        element.removeEventListener(eventName, handler);
      };
    });
  }
  
  // Create observable that emits values at intervals
  static interval(milliseconds) {
    return new Observable(observer => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count++);
      }, milliseconds);
      
      return () => clearInterval(intervalId);
    });
  }
  
  // Transformation operators
  map(transformFn) {
    return new Observable(observer => {
      const subscription = this.subscribe({
        next: value => observer.next(transformFn(value)),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
      
      return subscription;
    });
  }
  
  filter(predicateFn) {
    return new Observable(observer => {
      const subscription = this.subscribe({
        next: value => {
          if (predicateFn(value)) {
            observer.next(value);
          }
        },
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
      
      return subscription;
    });
  }
  
  take(count) {
    return new Observable(observer => {
      let taken = 0;
      
      const subscription = this.subscribe({
        next: value => {
          if (taken < count) {
            observer.next(value);
            taken++;
            if (taken === count) {
              observer.complete();
            }
          }
        },
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
      
      return subscription;
    });
  }
  
  debounce(milliseconds) {
    return new Observable(observer => {
      let timeoutId;
      
      const subscription = this.subscribe({
        next: value => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            observer.next(value);
          }, milliseconds);
        },
        error: error => observer.error(error),
        complete: () => {
          clearTimeout(timeoutId);
          observer.complete();
        }
      });
      
      return () => {
        clearTimeout(timeoutId);
        if (subscription) subscription();
      };
    });
  }
  
  merge(other) {
    return new Observable(observer => {
      let completedCount = 0;
      
      const subscription1 = this.subscribe({
        next: value => observer.next(value),
        error: error => observer.error(error),
        complete: () => {
          completedCount++;
          if (completedCount === 2) observer.complete();
        }
      });
      
      const subscription2 = other.subscribe({
        next: value => observer.next(value),
        error: error => observer.error(error),
        complete: () => {
          completedCount++;
          if (completedCount === 2) observer.complete();
        }
      });
      
      return () => {
        if (subscription1) subscription1();
        if (subscription2) subscription2();
      };
    });
  }
}

// Observer interface
class Observer {
  constructor(nextFn, errorFn = console.error, completeFn = () => {}) {
    this.next = nextFn;
    this.error = errorFn;
    this.complete = completeFn;
  }
}

// Reactive Data Store
class ReactiveStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subjects = {};
  }
  
  getObservable(property) {
    if (!this.subjects[property]) {
      this.subjects[property] = new Observable(observer => {
        // Emit current value immediately
        if (property in this.state) {
          observer.next(this.state[property]);
        }
        
        // Store observer for future updates
        if (!this.subjects[property].observers) {
          this.subjects[property].observers = [];
        }
        this.subjects[property].observers.push(observer);
        
        // Return cleanup function
        return () => {
          const index = this.subjects[property].observers.indexOf(observer);
          if (index > -1) {
            this.subjects[property].observers.splice(index, 1);
          }
        };
      });
      
      this.subjects[property].observers = [];
    }
    
    return this.subjects[property];
  }
  
  setState(property, value) {
    const oldValue = this.state[property];
    this.state[property] = value;
    
    if (this.subjects[property] && this.subjects[property].observers) {
      this.subjects[property].observers.forEach(observer => {
        try {
          observer.next(value);
        } catch (error) {
          observer.error(error);
        }
      });
    }
    
    return { oldValue, newValue: value };
  }
  
  getState(property) {
    return property ? this.state[property] : { ...this.state };
  }
}

// Usage examples
console.log('=== Reactive Observer Pattern Demo ===');

// Basic Observable usage
const numbers$ = Observable.of(1, 2, 3, 4, 5);

console.log('\\n--- Basic Observable ---');
numbers$
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .subscribe(new Observer(
    value => console.log('Even number doubled:', value),
    error => console.error('Error:', error),
    () => console.log('Sequence complete')
  ));

// Reactive Store example
const store = new ReactiveStore({
  counter: 0,
  user: { name: 'Anonymous', online: false }
});

console.log('\\n--- Reactive Store ---');

// Subscribe to counter changes
const counterSubscription = store.getObservable('counter')
  .subscribe(new Observer(
    value => console.log('Counter updated:', value),
    error => console.error('Counter error:', error)
  ));

// Subscribe to user changes with transformations
const userStatusSubscription = store.getObservable('user')
  .map(user => \`\${user.name} is \${user.online ? 'online' : 'offline'}\`)
  .subscribe(new Observer(
    status => console.log('User status:', status)
  ));

// Update values
store.setState('counter', 1);
store.setState('counter', 2);
store.setState('counter', 3);

store.setState('user', { name: 'John Doe', online: true });
store.setState('user', { name: 'John Doe', online: false });

// Interval example with take operator
console.log('\\n--- Interval Observable ---');
const interval$ = Observable.interval(500)
  .take(5)
  .map(x => \`Tick \${x}\`);

const intervalSubscription = interval$.subscribe(new Observer(
  value => console.log(value),
  error => console.error('Interval error:', error),
  () => console.log('Interval complete')
));

// Debounced search simulation
console.log('\\n--- Debounced Search ---');
const searchTerms = ['a', 'ap', 'app', 'appl', 'apple'];
let searchIndex = 0;

const search$ = new Observable(observer => {
  const intervalId = setInterval(() => {
    if (searchIndex < searchTerms.length) {
      observer.next(searchTerms[searchIndex++]);
    } else {
      observer.complete();
      clearInterval(intervalId);
    }
  }, 100);
  
  return () => clearInterval(intervalId);
});

const debouncedSearch$ = search$
  .debounce(250)
  .filter(term => term.length >= 3)
  .map(term => \`Searching for: "\${term}"\`);

debouncedSearch$.subscribe(new Observer(
  result => console.log(result),
  error => console.error('Search error:', error),
  () => console.log('Search complete')
));

// Cleanup subscriptions after demo
setTimeout(() => {
  console.log('\\n--- Cleaning up subscriptions ---');
  counterSubscription();
  userStatusSubscription();
  intervalSubscription();
}, 3000);
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Real-time Dashboard System",
      description: "Complete dashboard system using observer pattern for real-time updates",
      code: `
// Real-time Dashboard System using Observer Pattern
class DashboardModel extends EventEmitter {
  constructor() {
    super();
    this.metrics = {
      activeUsers: 0,
      revenue: 0,
      orders: 0,
      conversionRate: 0,
      serverLoad: 0,
      errorRate: 0
    };
    this.history = {
      activeUsers: [],
      revenue: [],
      orders: [],
      serverLoad: [],
      errorRate: []
    };
    this.alerts = [];
    this.thresholds = {
      serverLoad: 80,
      errorRate: 5,
      revenue: 1000
    };
    this.maxHistoryPoints = 100;
  }
  
  updateMetric(metricName, value, timestamp = new Date()) {
    const oldValue = this.metrics[metricName];
    this.metrics[metricName] = value;
    
    // Add to history
    if (this.history[metricName]) {
      this.history[metricName].push({ value, timestamp });
      
      // Maintain max history points
      if (this.history[metricName].length > this.maxHistoryPoints) {
        this.history[metricName].shift();
      }
    }
    
    // Check thresholds and generate alerts
    this.checkThresholds(metricName, value, oldValue);
    
    // Emit events
    this.emit('metric:updated', { 
      metric: metricName, 
      value, 
      oldValue, 
      timestamp 
    });
    
    this.emit(\`metric:\${metricName}\`, { 
      value, 
      oldValue, 
      timestamp 
    });
  }
  
  checkThresholds(metricName, newValue, oldValue) {
    const threshold = this.thresholds[metricName];
    if (!threshold) return;
    
    let alertType = null;
    let message = '';
    
    if (metricName === 'serverLoad' && newValue > threshold) {
      alertType = 'warning';
      message = \`Server load is high: \${newValue}%\`;
    } else if (metricName === 'errorRate' && newValue > threshold) {
      alertType = 'error';
      message = \`Error rate is high: \${newValue}%\`;
    } else if (metricName === 'revenue' && oldValue > 0 && newValue < oldValue * 0.8) {
      alertType = 'warning';
      message = \`Revenue dropped significantly: \${((newValue - oldValue) / oldValue * 100).toFixed(1)}%\`;
    }
    
    if (alertType) {
      const alert = {
        id: Date.now(),
        type: alertType,
        metric: metricName,
        value: newValue,
        message,
        timestamp: new Date()
      };
      
      this.alerts.push(alert);
      this.emit('alert:created', alert);
    }
  }
  
  getMetric(metricName) {
    return metricName ? this.metrics[metricName] : { ...this.metrics };
  }
  
  getHistory(metricName, limit = null) {
    if (!this.history[metricName]) return [];
    
    const history = this.history[metricName];
    return limit ? history.slice(-limit) : [...history];
  }
  
  getAlerts(type = null) {
    return type ? 
      this.alerts.filter(alert => alert.type === type) : 
      [...this.alerts];
  }
  
  clearAlert(alertId) {
    const index = this.alerts.findIndex(alert => alert.id === alertId);
    if (index > -1) {
      const alert = this.alerts.splice(index, 1)[0];
      this.emit('alert:cleared', alert);
      return alert;
    }
    return null;
  }
  
  setThreshold(metricName, threshold) {
    this.thresholds[metricName] = threshold;
    this.emit('threshold:updated', { metric: metricName, threshold });
  }
}

// Widget components that observe specific metrics
class MetricWidget {
  constructor(model, metricName, config = {}) {
    this.model = model;
    this.metricName = metricName;
    this.config = {
      title: config.title || metricName,
      format: config.format || (val => val.toString()),
      color: config.color || '#007bff',
      showTrend: config.showTrend !== false,
      ...config
    };
    
    this.previousValue = null;
    this.trend = 'stable';
    
    // Subscribe to specific metric updates
    this.model.on(\`metric:\${metricName}\`, this.onMetricUpdate.bind(this));
    
    // Initial render
    const currentValue = this.model.getMetric(metricName);
    if (currentValue !== undefined) {
      this.render(currentValue);
    }
  }
  
  onMetricUpdate({ value, oldValue }) {
    this.calculateTrend(value, oldValue);
    this.render(value);
  }
  
  calculateTrend(currentValue, previousValue) {
    if (previousValue === null || previousValue === undefined) {
      this.trend = 'stable';
      return;
    }
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    
    if (Math.abs(change) < 1) {
      this.trend = 'stable';
    } else if (change > 0) {
      this.trend = 'up';
    } else {
      this.trend = 'down';
    }
    
    this.changePercent = change;
  }
  
  render(value) {
    const formattedValue = this.config.format(value);
    const trendIndicator = this.config.showTrend ? this.getTrendIndicator() : '';
    
    console.log(\`📊 [\${this.config.title}] \${formattedValue} \${trendIndicator}\`);
  }
  
  getTrendIndicator() {
    const symbols = { up: '↗️', down: '↘️', stable: '→' };
    const symbol = symbols[this.trend];
    const percent = this.changePercent ? 
      \`(\${this.changePercent > 0 ? '+' : ''}\${this.changePercent.toFixed(1)}%)\` : 
      '';
    
    return \`\${symbol} \${percent}\`;
  }
}

class ChartWidget {
  constructor(model, metricName, config = {}) {
    this.model = model;
    this.metricName = metricName;
    this.config = {
      title: config.title || \`\${metricName} Chart\`,
      maxPoints: config.maxPoints || 20,
      ...config
    };
    
    this.model.on(\`metric:\${metricName}\`, this.onMetricUpdate.bind(this));
  }
  
  onMetricUpdate() {
    this.render();
  }
  
  render() {
    const history = this.model.getHistory(this.metricName, this.config.maxPoints);
    const values = history.map(point => point.value);
    
    if (values.length === 0) return;
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    // Simple ASCII chart
    const chart = values.map(value => {
      const normalized = (value - min) / range;
      const height = Math.floor(normalized * 5);
      return '▁▂▃▄▅▆▇█'[height] || '▁';
    }).join('');
    
    console.log(\`📈 [\${this.config.title}] \${chart} (min: \${min}, max: \${max})\`);
  }
}

class AlertPanel {
  constructor(model) {
    this.model = model;
    this.maxAlerts = 10;
    
    this.model.on('alert:created', this.onAlertCreated.bind(this));
    this.model.on('alert:cleared', this.onAlertCleared.bind(this));
  }
  
  onAlertCreated(alert) {
    const icon = alert.type === 'error' ? '🚨' : '⚠️';
    console.log(\`\${icon} ALERT: \${alert.message}\`);
    
    // Auto-clear info alerts after 10 seconds
    if (alert.type === 'info') {
      setTimeout(() => {
        this.model.clearAlert(alert.id);
      }, 10000);
    }
  }
  
  onAlertCleared(alert) {
    console.log(\`✅ Alert cleared: \${alert.message}\`);
  }
  
  renderActiveAlerts() {
    const alerts = this.model.getAlerts().slice(-this.maxAlerts);
    
    if (alerts.length === 0) {
      console.log('📋 No active alerts');
      return;
    }
    
    console.log(\`📋 Active Alerts (\${alerts.length}):\`);
    alerts.forEach(alert => {
      const icon = alert.type === 'error' ? '🚨' : '⚠️';
      const time = alert.timestamp.toLocaleTimeString();
      console.log(\`  \${icon} [\${time}] \${alert.message}\`);
    });
  }
}

class DataSimulator {
  constructor(model) {
    this.model = model;
    this.isRunning = false;
    this.intervals = [];
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎯 Data simulator started');
    
    // Active users - gradual changes
    this.intervals.push(setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      const current = this.model.getMetric('activeUsers');
      const newValue = Math.max(0, Math.round(current + change));
      this.model.updateMetric('activeUsers', newValue);
    }, 2000));
    
    // Revenue - business hours pattern
    this.intervals.push(setInterval(() => {
      const hour = new Date().getHours();
      const businessHours = hour >= 9 && hour <= 17;
      const baseRevenue = businessHours ? 100 : 20;
      const revenue = baseRevenue + (Math.random() * 50);
      this.model.updateMetric('revenue', Math.round(revenue));
    }, 3000));
    
    // Server load - random spikes
    this.intervals.push(setInterval(() => {
      const spike = Math.random() < 0.1; // 10% chance of spike
      const baseLoad = 30 + (Math.random() * 30);
      const load = spike ? 85 + (Math.random() * 15) : baseLoad;
      this.model.updateMetric('serverLoad', Math.round(load));
    }, 1500));
    
    // Error rate - mostly low with occasional issues
    this.intervals.push(setInterval(() => {
      const issue = Math.random() < 0.05; // 5% chance of high error rate
      const errorRate = issue ? 8 + (Math.random() * 5) : Math.random() * 2;
      this.model.updateMetric('errorRate', parseFloat(errorRate.toFixed(2)));
    }, 4000));
    
    // Orders - correlated with active users
    this.intervals.push(setInterval(() => {
      const activeUsers = this.model.getMetric('activeUsers');
      const conversionRate = 0.02 + (Math.random() * 0.03); // 2-5% conversion
      const orders = Math.round(activeUsers * conversionRate);
      this.model.updateMetric('orders', orders);
      this.model.updateMetric('conversionRate', parseFloat((conversionRate * 100).toFixed(2)));
    }, 5000));
  }
  
  stop() {
    this.isRunning = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    console.log('⏹️ Data simulator stopped');
  }
}

// Usage - Set up the dashboard
console.log('=== Real-time Dashboard Demo ===');

const dashboard = new DashboardModel();

// Create widgets
const activeUsersWidget = new MetricWidget(dashboard, 'activeUsers', {
  title: 'Active Users',
  format: (val) => val.toLocaleString(),
  color: '#28a745'
});

const revenueWidget = new MetricWidget(dashboard, 'revenue', {
  title: 'Revenue',
  format: (val) => \`$\${val.toFixed(2)}\`,
  color: '#007bff'
});

const serverLoadWidget = new MetricWidget(dashboard, 'serverLoad', {
  title: 'Server Load',
  format: (val) => \`\${val}%\`,
  color: '#ffc107'
});

const errorRateWidget = new MetricWidget(dashboard, 'errorRate', {
  title: 'Error Rate',
  format: (val) => \`\${val}%\`,
  color: '#dc3545'
});

// Create charts
const activeUsersChart = new ChartWidget(dashboard, 'activeUsers', {
  title: 'Active Users Trend'
});

const serverLoadChart = new ChartWidget(dashboard, 'serverLoad', {
  title: 'Server Load Trend'
});

// Create alert panel
const alertPanel = new AlertPanel(dashboard);

// Set up thresholds
dashboard.setThreshold('serverLoad', 75);
dashboard.setThreshold('errorRate', 4);

// Initialize with some data
dashboard.updateMetric('activeUsers', 150);
dashboard.updateMetric('revenue', 85.50);
dashboard.updateMetric('serverLoad', 45);
dashboard.updateMetric('errorRate', 1.2);

// Start data simulation
const simulator = new DataSimulator(dashboard);
simulator.start();

// Show alert panel every 10 seconds
const alertInterval = setInterval(() => {
  console.log('\\n--- Dashboard Status ---');
  alertPanel.renderActiveAlerts();
}, 10000);

// Stop simulation after 30 seconds
setTimeout(() => {
  simulator.stop();
  clearInterval(alertInterval);
  
  console.log('\\n--- Final Dashboard State ---');
  console.log('Metrics:', dashboard.getMetric());
  console.log('Total alerts generated:', dashboard.getAlerts().length);
}, 30000);
      `
    }
  ],
  
  exercises: [
    {
      id: "observer-basic",
      title: "Create a News Subscription System",
      difficulty: "easy",
      prompt: "Create a news publisher that notifies subscribers when new articles are published. Include different types of subscribers (email, SMS, app notification).",
      solution: `
class NewsPublisher {
  constructor() {
    this.subscribers = [];
    this.articles = [];
  }
  
  subscribe(subscriber) {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
      console.log(\`\${subscriber.constructor.name} subscribed to news\`);
    }
    return this;
  }
  
  unsubscribe(subscriber) {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
      console.log(\`\${subscriber.constructor.name} unsubscribed from news\`);
    }
    return this;
  }
  
  publishArticle(title, content, category = 'general') {
    const article = {
      id: Date.now(),
      title,
      content,
      category,
      publishedAt: new Date()
    };
    
    this.articles.push(article);
    this.notifySubscribers(article);
    
    return article;
  }
  
  notifySubscribers(article) {
    this.subscribers.forEach(subscriber => {
      try {
        subscriber.update(article);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }
}

class EmailSubscriber {
  constructor(email) {
    this.email = email;
  }
  
  update(article) {
    console.log(\`📧 Email to \${this.email}: New article "\${article.title}"\`);
  }
}

class SMSSubscriber {
  constructor(phone) {
    this.phone = phone;
  }
  
  update(article) {
    console.log(\`📱 SMS to \${this.phone}: \${article.title} - \${article.content.substring(0, 50)}...\`);
  }
}

class AppNotificationSubscriber {
  constructor(userId) {
    this.userId = userId;
  }
  
  update(article) {
    console.log(\`📲 App notification for user \${this.userId}: "\${article.title}" in \${article.category}\`);
  }
}

// Usage
const newsPublisher = new NewsPublisher();

const emailSub = new EmailSubscriber('user@example.com');
const smsSub = new SMSSubscriber('+1234567890');
const appSub = new AppNotificationSubscriber('user123');

newsPublisher
  .subscribe(emailSub)
  .subscribe(smsSub)
  .subscribe(appSub);

newsPublisher.publishArticle(
  'Breaking News: JavaScript Observer Pattern Explained',
  'The Observer pattern is a behavioral design pattern...',
  'technology'
);

newsPublisher.publishArticle(
  'Weather Update',
  'Sunny skies expected for the weekend...',
  'weather'
);
      `
    },
    
    {
      id: "observer-advanced",
      title: "Create a Stock Trading System",
      difficulty: "hard",
      prompt: "Build a stock trading system with price monitoring, automatic trading strategies, and portfolio tracking using the observer pattern.",
      solution: `
class Stock {
  constructor(symbol, initialPrice) {
    this.symbol = symbol;
    this.price = initialPrice;
    this.previousPrice = initialPrice;
    this.observers = [];
    this.history = [{ price: initialPrice, timestamp: new Date() }];
  }
  
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
    return this;
  }
  
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
    return this;
  }
  
  updatePrice(newPrice) {
    this.previousPrice = this.price;
    this.price = newPrice;
    
    const priceData = {
      symbol: this.symbol,
      price: newPrice,
      previousPrice: this.previousPrice,
      change: newPrice - this.previousPrice,
      changePercent: this.previousPrice ? 
        ((newPrice - this.previousPrice) / this.previousPrice * 100) : 0,
      timestamp: new Date()
    };
    
    this.history.push({
      price: newPrice,
      timestamp: priceData.timestamp
    });
    
    // Keep only last 100 price points
    if (this.history.length > 100) {
      this.history.shift();
    }
    
    this.notifyObservers(priceData);
  }
  
  notifyObservers(priceData) {
    this.observers.forEach(observer => {
      try {
        observer.onPriceUpdate(priceData);
      } catch (error) {
        console.error(\`Error notifying observer: \${error.message}\`);
      }
    });
  }
  
  getMovingAverage(periods = 10) {
    const recentPrices = this.history.slice(-periods).map(h => h.price);
    return recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
  }
}

class TradingStrategy {
  constructor(name, portfolio) {
    this.name = name;
    this.portfolio = portfolio;
    this.isActive = true;
  }
  
  onPriceUpdate(priceData) {
    if (!this.isActive) return;
    
    const signal = this.generateSignal(priceData);
    if (signal) {
      this.executeSignal(signal, priceData);
    }
  }
  
  generateSignal(priceData) {
    // Override in subclasses
    return null;
  }
  
  executeSignal(signal, priceData) {
    try {
      if (signal.action === 'BUY') {
        this.portfolio.buyStock(priceData.symbol, signal.quantity, priceData.price);
      } else if (signal.action === 'SELL') {
        this.portfolio.sellStock(priceData.symbol, signal.quantity, priceData.price);
      }
      
      console.log(\`🤖 \${this.name}: \${signal.action} \${signal.quantity} shares of \${priceData.symbol} at $\${priceData.price}\`);
    } catch (error) {
      console.error(\`Trading error: \${error.message}\`);
    }
  }
}

class MomentumStrategy extends TradingStrategy {
  constructor(name, portfolio, threshold = 5) {
    super(name, portfolio);
    this.threshold = threshold; // Percentage threshold
  }
  
  generateSignal(priceData) {
    const { changePercent, symbol } = priceData;
    
    if (Math.abs(changePercent) >= this.threshold) {
      if (changePercent > 0) {
        return { action: 'BUY', quantity: 10 };
      } else {
        const position = this.portfolio.getPosition(symbol);
        if (position && position.quantity > 0) {
          return { action: 'SELL', quantity: Math.min(10, position.quantity) };
        }
      }
    }
    
    return null;
  }
}

class MeanReversionStrategy extends TradingStrategy {
  constructor(name, portfolio, stock) {
    super(name, portfolio);
    this.stock = stock;
  }
  
  generateSignal(priceData) {
    const { price, symbol } = priceData;
    const movingAvg = this.stock.getMovingAverage(20);
    const deviation = ((price - movingAvg) / movingAvg) * 100;
    
    if (deviation < -3) { // Price 3% below moving average
      return { action: 'BUY', quantity: 5 };
    } else if (deviation > 3) { // Price 3% above moving average
      const position = this.portfolio.getPosition(symbol);
      if (position && position.quantity > 0) {
        return { action: 'SELL', quantity: Math.min(5, position.quantity) };
      }
    }
    
    return null;
  }
}

class Portfolio {
  constructor(initialCash = 10000) {
    this.cash = initialCash;
    this.positions = {}; // { symbol: { quantity, avgPrice } }
    this.transactions = [];
  }
  
  buyStock(symbol, quantity, price) {
    const totalCost = quantity * price;
    
    if (totalCost > this.cash) {
      throw new Error('Insufficient cash for purchase');
    }
    
    this.cash -= totalCost;
    
    if (this.positions[symbol]) {
      const currentPos = this.positions[symbol];
      const totalShares = currentPos.quantity + quantity;
      const totalValue = (currentPos.quantity * currentPos.avgPrice) + totalCost;
      
      this.positions[symbol] = {
        quantity: totalShares,
        avgPrice: totalValue / totalShares
      };
    } else {
      this.positions[symbol] = {
        quantity,
        avgPrice: price
      };
    }
    
    this.transactions.push({
      type: 'BUY',
      symbol,
      quantity,
      price,
      timestamp: new Date()
    });
  }
  
  sellStock(symbol, quantity, price) {
    if (!this.positions[symbol] || this.positions[symbol].quantity < quantity) {
      throw new Error(\`Insufficient shares of \${symbol}\`);
    }
    
    const totalValue = quantity * price;
    this.cash += totalValue;
    
    this.positions[symbol].quantity -= quantity;
    
    if (this.positions[symbol].quantity === 0) {
      delete this.positions[symbol];
    }
    
    this.transactions.push({
      type: 'SELL',
      symbol,
      quantity,
      price,
      timestamp: new Date()
    });
  }
  
  getPosition(symbol) {
    return this.positions[symbol] || null;
  }
  
  getPortfolioValue(currentPrices) {
    let totalValue = this.cash;
    
    for (const [symbol, position] of Object.entries(this.positions)) {
      if (currentPrices[symbol]) {
        totalValue += position.quantity * currentPrices[symbol];
      }
    }
    
    return totalValue;
  }
  
  getPortfolioSummary(currentPrices = {}) {
    return {
      cash: this.cash,
      positions: { ...this.positions },
      totalValue: this.getPortfolioValue(currentPrices),
      transactionCount: this.transactions.length
    };
  }
}

// Usage
const portfolio = new Portfolio(50000);
const appleStock = new Stock('AAPL', 150);
const googleStock = new Stock('GOOGL', 2500);

// Create trading strategies
const momentumStrategy = new MomentumStrategy('Momentum Bot', portfolio);
const meanReversionStrategy = new MeanReversionStrategy('Mean Reversion Bot', portfolio, appleStock);

// Subscribe strategies to stocks
appleStock
  .addObserver(momentumStrategy)
  .addObserver(meanReversionStrategy);

googleStock.addObserver(momentumStrategy);

// Price alert system
class PriceAlert {
  constructor(symbol, targetPrice, type = 'above') {
    this.symbol = symbol;
    this.targetPrice = targetPrice;
    this.type = type;
    this.triggered = false;
  }
  
  onPriceUpdate(priceData) {
    if (this.triggered || priceData.symbol !== this.symbol) return;
    
    const { price } = priceData;
    
    if ((this.type === 'above' && price >= this.targetPrice) ||
        (this.type === 'below' && price <= this.targetPrice)) {
      
      console.log(\`🔔 ALERT: \${this.symbol} is \${this.type} $\${this.targetPrice} (Current: $\${price})\`);
      this.triggered = true;
    }
  }
}

const priceAlert = new PriceAlert('AAPL', 160, 'above');
appleStock.addObserver(priceAlert);

// Simulate price changes
console.log('=== Stock Trading System Demo ===');
console.log('Initial Portfolio:', portfolio.getPortfolioSummary({ AAPL: 150, GOOGL: 2500 }));

// Simulate market movements
const priceUpdates = [
  { stock: appleStock, price: 155 },  // Small increase
  { stock: appleStock, price: 162 },  // Trigger momentum buy and alert
  { stock: googleStock, price: 2400 }, // Decrease
  { stock: appleStock, price: 158 },  // Small decrease
  { stock: googleStock, price: 2350 }, // Large decrease - momentum sell
  { stock: appleStock, price: 145 },  // Below moving average - mean reversion buy
  { stock: appleStock, price: 165 },  // Above moving average - mean reversion sell
];

priceUpdates.forEach((update, index) => {
  setTimeout(() => {
    console.log(\`\\n--- Price Update \${index + 1} ---\`);
    update.stock.updatePrice(update.price);
    
    const currentPrices = { AAPL: appleStock.price, GOOGL: googleStock.price };
    console.log('Portfolio Summary:', portfolio.getPortfolioSummary(currentPrices));
  }, index * 2000);
});

// Final summary
setTimeout(() => {
  console.log('\\n=== Final Trading Summary ===');
  const finalPrices = { AAPL: appleStock.price, GOOGL: googleStock.price };
  console.log('Final Portfolio:', portfolio.getPortfolioSummary(finalPrices));
  console.log('Total Transactions:', portfolio.transactions.length);
  console.log('AAPL Moving Average:', appleStock.getMovingAverage(5).toFixed(2));
}, priceUpdates.length * 2000 + 1000);
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the main purpose of the Observer pattern?",
      options: [
        "To create objects without specifying their exact classes",
        "To define a one-to-many dependency between objects",
        "To provide a way to access elements sequentially",
        "To encapsulate algorithms and make them interchangeable"
      ],
      correct: 1,
      explanation: "The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically."
    },
    
    {
      question: "In the Observer pattern, what are the two main roles?",
      options: [
        "Publisher and Subscriber",
        "Subject and Observer", 
        "Model and View",
        "All of the above"
      ],
      correct: 3,
      explanation: "All these terms refer to the same concepts in the Observer pattern. The Subject (Publisher/Model) maintains observers and notifies them, while Observer (Subscriber/View) receives notifications."
    },
    
    {
      question: "What is a key benefit of using the Observer pattern?",
      options: [
        "Faster execution speed",
        "Reduced memory usage",
        "Loose coupling between subject and observers",
        "Better error handling"
      ],
      correct: 2,
      explanation: "The Observer pattern promotes loose coupling - the subject only knows that observers implement a specific interface, but doesn't need to know their concrete classes."
    },
    
    {
      question: "What should happen if an observer throws an error during notification?",
      options: [
        "Stop notifying all other observers",
        "Automatically remove the problematic observer",
        "Continue notifying other observers after handling the error",
        "Restart the notification process"
      ],
      correct: 2,
      explanation: "Best practice is to catch errors from individual observers and continue notifying the remaining observers, preventing one faulty observer from breaking the entire notification system."
    }
  ]
};

export default observerContent;