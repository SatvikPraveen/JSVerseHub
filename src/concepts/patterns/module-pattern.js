// File: src/concepts/patterns/module-pattern.js
// Design Patterns - Module Pattern in JavaScript

export const modulePatternContent = {
  title: "Module Pattern",
  description: "Learn to organize code using the Module Pattern for encapsulation and namespacing",
  
  theory: {
    introduction: `
      The Module Pattern is one of the most important design patterns in JavaScript. It provides 
      encapsulation, privacy, and organization to your code by creating a scope where you can 
      define private variables and functions, while exposing only what's necessary through a 
      public interface. This pattern helps prevent global namespace pollution and creates 
      reusable, maintainable code modules.
    `,
    
    concepts: [
      {
        name: "Basic Module Pattern (IIFE)",
        explanation: "Using Immediately Invoked Function Expression to create encapsulated modules",
        example: `
// Basic Module Pattern using IIFE
const Calculator = (function() {
  // Private variables and functions
  let history = [];
  let currentResult = 0;
  
  function logOperation(operation, operand, result) {
    history.push({
      operation,
      operand,
      result,
      timestamp: new Date()
    });
  }
  
  function validateNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('Invalid number provided');
    }
  }
  
  // Public interface
  return {
    add: function(num) {
      validateNumber(num);
      currentResult += num;
      logOperation('add', num, currentResult);
      return this; // Enable method chaining
    },
    
    subtract: function(num) {
      validateNumber(num);
      currentResult -= num;
      logOperation('subtract', num, currentResult);
      return this;
    },
    
    multiply: function(num) {
      validateNumber(num);
      currentResult *= num;
      logOperation('multiply', num, currentResult);
      return this;
    },
    
    divide: function(num) {
      validateNumber(num);
      if (num === 0) {
        throw new Error('Division by zero is not allowed');
      }
      currentResult /= num;
      logOperation('divide', num, currentResult);
      return this;
    },
    
    getResult: function() {
      return currentResult;
    },
    
    clear: function() {
      currentResult = 0;
      history = [];
      return this;
    },
    
    getHistory: function() {
      return [...history]; // Return a copy to prevent external modification
    },
    
    setValue: function(num) {
      validateNumber(num);
      currentResult = num;
      logOperation('setValue', num, currentResult);
      return this;
    }
  };
})();

// Usage
console.log(Calculator.setValue(10).add(5).multiply(2).getResult()); // 30
console.log(Calculator.getHistory());

// Private variables are not accessible
// console.log(Calculator.history); // undefined
// console.log(Calculator.currentResult); // undefined

// Counter Module with Configuration
const Counter = (function(config = {}) {
  let count = config.initialValue || 0;
  const step = config.step || 1;
  const min = config.min ?? -Infinity;
  const max = config.max ?? Infinity;
  
  function withinBounds(newValue) {
    return newValue >= min && newValue <= max;
  }
  
  return {
    increment: function() {
      const newValue = count + step;
      if (withinBounds(newValue)) {
        count = newValue;
      }
      return this;
    },
    
    decrement: function() {
      const newValue = count - step;
      if (withinBounds(newValue)) {
        count = newValue;
      }
      return this;
    },
    
    getValue: function() {
      return count;
    },
    
    reset: function() {
      count = config.initialValue || 0;
      return this;
    },
    
    canIncrement: function() {
      return withinBounds(count + step);
    },
    
    canDecrement: function() {
      return withinBounds(count - step);
    }
  };
})({ initialValue: 5, step: 2, min: 0, max: 20 });

console.log(Counter.getValue()); // 5
Counter.increment().increment().increment();
console.log(Counter.getValue()); // 11
console.log(Counter.canIncrement()); // true
        `
      },
      
      {
        name: "Revealing Module Pattern",
        explanation: "A variation that defines all functions privately and reveals selected ones",
        example: `
// Revealing Module Pattern
const UserManager = (function() {
  // Private variables
  let users = [];
  let currentId = 1;
  
  // Private functions
  function generateId() {
    return currentId++;
  }
  
  function validateUser(user) {
    if (!user.name || typeof user.name !== 'string') {
      throw new Error('User name is required and must be a string');
    }
    if (!user.email || !isValidEmail(user.email)) {
      throw new Error('Valid email is required');
    }
    return true;
  }
  
  function isValidEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }
  
  function findUserById(id) {
    return users.find(user => user.id === id);
  }
  
  function findUserByEmail(email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }
  
  function createUser(userData) {
    validateUser(userData);
    
    if (findUserByEmail(userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    const user = {
      id: generateId(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase(),
      createdAt: new Date(),
      active: true,
      lastLogin: null
    };
    
    users.push(user);
    return { ...user }; // Return a copy
  }
  
  function updateUser(id, updates) {
    const user = findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Validate updates if they include name or email
    if (updates.name !== undefined || updates.email !== undefined) {
      validateUser({ name: updates.name || user.name, email: updates.email || user.email });
    }
    
    // Check for email conflicts
    if (updates.email && updates.email !== user.email) {
      if (findUserByEmail(updates.email)) {
        throw new Error('Email already exists');
      }
    }
    
    Object.assign(user, updates);
    return { ...user };
  }
  
  function deleteUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = users.splice(index, 1)[0];
    return { ...deletedUser };
  }
  
  function getAllUsers() {
    return users.map(user => ({ ...user })); // Return copies
  }
  
  function getActiveUsers() {
    return users.filter(user => user.active).map(user => ({ ...user }));
  }
  
  function getUserCount() {
    return users.length;
  }
  
  function loginUser(email, password) {
    // In a real application, you'd verify the password
    const user = findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.active) {
      throw new Error('User account is inactive');
    }
    
    user.lastLogin = new Date();
    return { ...user };
  }
  
  function deactivateUser(id) {
    return updateUser(id, { active: false });
  }
  
  function reactivateUser(id) {
    return updateUser(id, { active: true });
  }
  
  // Reveal public interface
  return {
    // User CRUD operations
    create: createUser,
    update: updateUser,
    delete: deleteUser,
    
    // User queries
    getById: findUserById,
    getByEmail: findUserByEmail,
    getAll: getAllUsers,
    getActive: getActiveUsers,
    getCount: getUserCount,
    
    // User actions
    login: loginUser,
    deactivate: deactivateUser,
    reactivate: reactivateUser
  };
})();

// Usage
try {
  const user1 = UserManager.create({ 
    name: 'John Doe', 
    email: 'john@example.com' 
  });
  console.log('Created user:', user1);
  
  const user2 = UserManager.create({ 
    name: 'Jane Smith', 
    email: 'jane@example.com' 
  });
  
  console.log('All users:', UserManager.getAll());
  console.log('User count:', UserManager.getCount());
  
  // Login a user
  const loggedInUser = UserManager.login('john@example.com', 'password');
  console.log('Logged in user:', loggedInUser);
  
  // Update user
  const updatedUser = UserManager.update(user1.id, { name: 'John Updated' });
  console.log('Updated user:', updatedUser);
  
} catch (error) {
  console.error('Error:', error.message);
}

// Private functions and variables are not accessible
// console.log(UserManager.users); // undefined
// console.log(UserManager.validateUser); // undefined
        `
      },
      
      {
        name: "Module Factory Pattern",
        explanation: "Creating multiple module instances with factory functions",
        example: `
// Module Factory Pattern
function createShoppingCart() {
  // Private variables for each cart instance
  let items = [];
  let discountCode = null;
  let discountAmount = 0;
  
  // Private functions
  function calculateSubtotal() {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  function calculateTax(subtotal) {
    return subtotal * 0.08; // 8% tax
  }
  
  function calculateShipping(subtotal) {
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  }
  
  function findItemIndex(productId) {
    return items.findIndex(item => item.productId === productId);
  }
  
  function validateProduct(product) {
    if (!product.productId || !product.name || !product.price) {
      throw new Error('Product must have productId, name, and price');
    }
    if (product.price < 0) {
      throw new Error('Product price cannot be negative');
    }
  }
  
  function applyDiscountCode(code) {
    const discounts = {
      'SAVE10': { type: 'percentage', value: 0.1, minAmount: 25 },
      'SAVE5': { type: 'fixed', value: 5, minAmount: 20 },
      'FREESHIP': { type: 'shipping', value: 0, minAmount: 30 }
    };
    
    const discount = discounts[code];
    if (!discount) {
      throw new Error('Invalid discount code');
    }
    
    const subtotal = calculateSubtotal();
    if (subtotal < discount.minAmount) {
      throw new Error(\`Minimum order of $\${discount.minAmount} required for this discount\`);
    }
    
    return discount;
  }
  
  // Public interface
  return {
    addItem: function(product, quantity = 1) {
      validateProduct(product);
      
      if (quantity <= 0) {
        throw new Error('Quantity must be positive');
      }
      
      const existingIndex = findItemIndex(product.productId);
      
      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: quantity
        });
      }
      
      return this;
    },
    
    removeItem: function(productId) {
      const index = findItemIndex(productId);
      if (index >= 0) {
        items.splice(index, 1);
      }
      return this;
    },
    
    updateQuantity: function(productId, quantity) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      
      const index = findItemIndex(productId);
      if (index >= 0) {
        items[index].quantity = quantity;
      }
      
      return this;
    },
    
    getItems: function() {
      return items.map(item => ({ ...item })); // Return copies
    },
    
    getItemCount: function() {
      return items.reduce((count, item) => count + item.quantity, 0);
    },
    
    applyDiscount: function(code) {
      try {
        const discount = applyDiscountCode(code);
        discountCode = code;
        
        const subtotal = calculateSubtotal();
        
        if (discount.type === 'percentage') {
          discountAmount = subtotal * discount.value;
        } else if (discount.type === 'fixed') {
          discountAmount = discount.value;
        }
        
        return { success: true, discount: discountAmount };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    removeDiscount: function() {
      discountCode = null;
      discountAmount = 0;
      return this;
    },
    
    getTotal: function() {
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal - discountAmount);
      const shipping = calculateShipping(subtotal);
      
      return {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number((subtotal - discountAmount + tax + shipping).toFixed(2))
      };
    },
    
    clear: function() {
      items = [];
      discountCode = null;
      discountAmount = 0;
      return this;
    },
    
    isEmpty: function() {
      return items.length === 0;
    },
    
    checkout: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot checkout empty cart');
      }
      
      const orderSummary = {
        items: this.getItems(),
        totals: this.getTotal(),
        discountCode: discountCode,
        timestamp: new Date(),
        orderId: 'ORDER-' + Date.now()
      };
      
      this.clear(); // Empty cart after checkout
      return orderSummary;
    }
  };
}

// Usage - Create multiple cart instances
const cart1 = createShoppingCart();
const cart2 = createShoppingCart();

// Each cart maintains its own state
cart1.addItem({ productId: 'P001', name: 'Laptop', price: 999 }, 1)
     .addItem({ productId: 'P002', name: 'Mouse', price: 29 }, 2);

cart2.addItem({ productId: 'P003', name: 'Book', price: 19.99 }, 3);

console.log('Cart 1 total:', cart1.getTotal());
console.log('Cart 2 total:', cart2.getTotal());

// Apply discount to cart 1 only
const discountResult = cart1.applyDiscount('SAVE10');
if (discountResult.success) {
  console.log('Discount applied to cart 1:', cart1.getTotal());
}

// Checkout cart 1
try {
  const order = cart1.checkout();
  console.log('Order placed:', order);
} catch (error) {
  console.error('Checkout error:', error.message);
}

console.log('Cart 1 after checkout:', cart1.isEmpty()); // true
console.log('Cart 2 still has items:', cart2.getItemCount()); // 3
        `
      },
      
      {
        name: "Namespace Module Pattern",
        explanation: "Organizing multiple modules under a single namespace",
        example: `
// Namespace Module Pattern
const MyApp = MyApp || {};

// Utilities Module
MyApp.Utils = (function() {
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  return {
    formatCurrency,
    formatDate,
    debounce,
    throttle
  };
})();

// API Module
MyApp.API = (function() {
  const baseUrl = 'https://api.example.com';
  
  function makeRequest(endpoint, options = {}) {
    const url = \`\${baseUrl}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    return fetch(url, config)
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      });
  }
  
  return {
    get: (endpoint, headers = {}) => makeRequest(endpoint, { method: 'GET', headers }),
    post: (endpoint, data, headers = {}) => makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }),
    put: (endpoint, data, headers = {}) => makeRequest(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    }),
    delete: (endpoint, headers = {}) => makeRequest(endpoint, { method: 'DELETE', headers })
  };
})();

// Storage Module
MyApp.Storage = (function() {
  const prefix = 'myapp_';
  
  function getKey(key) {
    return prefix + key;
  }
  
  return {
    set: function(key, value) {
      try {
        localStorage.setItem(getKey(key), JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Storage set error:', error);
        return false;
      }
    },
    
    get: function(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(getKey(key));
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Storage get error:', error);
        return defaultValue;
      }
    },
    
    remove: function(key) {
      try {
        localStorage.removeItem(getKey(key));
        return true;
      } catch (error) {
        console.error('Storage remove error:', error);
        return false;
      }
    },
    
    clear: function() {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(prefix))
          .forEach(key => localStorage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Storage clear error:', error);
        return false;
      }
    }
  };
})();

// Event Bus Module
MyApp.EventBus = (function() {
  const events = {};
  
  return {
    on: function(eventName, callback) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(callback);
    },
    
    off: function(eventName, callback) {
      if (events[eventName]) {
        events[eventName] = events[eventName].filter(cb => cb !== callback);
      }
    },
    
    emit: function(eventName, data) {
      if (events[eventName]) {
        events[eventName].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(\`Error in event handler for \${eventName}:\`, error);
          }
        });
      }
    },
    
    once: function(eventName, callback) {
      const onceCallback = (data) => {
        callback(data);
        this.off(eventName, onceCallback);
      };
      this.on(eventName, onceCallback);
    }
  };
})();

// Usage of the namespace modules
console.log('Formatted price:', MyApp.Utils.formatCurrency(1234.56));
console.log('Formatted date:', MyApp.Utils.formatDate(new Date()));

// Store some data
MyApp.Storage.set('user', { name: 'John', preferences: { theme: 'dark' } });
console.log('Retrieved user:', MyApp.Storage.get('user'));

// Set up event handling
MyApp.EventBus.on('user.login', (userData) => {
  console.log('User logged in:', userData);
  MyApp.Storage.set('currentUser', userData);
});

MyApp.EventBus.emit('user.login', { id: 1, name: 'Alice' });

// The modules are organized under MyApp namespace
console.log('Available modules:', Object.keys(MyApp));
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Task Management System Module",
      description: "A complete task management system using the module pattern",
      code: `
// Task Management System using Module Pattern
const TaskManager = (function() {
  // Private variables
  let tasks = [];
  let categories = ['personal', 'work', 'shopping', 'health'];
  let currentId = 1;
  let filters = {
    status: 'all',
    category: 'all',
    priority: 'all'
  };
  
  // Private functions
  function generateId() {
    return currentId++;
  }
  
  function validateTask(task) {
    if (!task.title || task.title.trim() === '') {
      throw new Error('Task title is required');
    }
    
    if (task.category && !categories.includes(task.category)) {
      throw new Error('Invalid category');
    }
    
    if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
      throw new Error('Priority must be low, medium, or high');
    }
    
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
    
    return true;
  }
  
  function findTaskById(id) {
    return tasks.find(task => task.id === id);
  }
  
  function createTask(taskData) {
    validateTask(taskData);
    
    const task = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description || '',
      category: taskData.category || 'personal',
      priority: taskData.priority || 'medium',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      completedAt: null,
      tags: taskData.tags || []
    };
    
    tasks.push(task);
    notifySubscribers('taskCreated', task);
    return { ...task };
  }
  
  function updateTask(id, updates) {
    const task = findTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    // Validate updates
    if (updates.title !== undefined || updates.category !== undefined || 
        updates.priority !== undefined || updates.dueDate !== undefined) {
      validateTask({ ...task, ...updates });
    }
    
    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        task[key] = updates[key];
      }
    });
    
    task.updatedAt = new Date();
    
    notifySubscribers('taskUpdated', task);
    return { ...task };
  }
  
  function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = tasks.splice(index, 1)[0];
    notifySubscribers('taskDeleted', deletedTask);
    return { ...deletedTask };
  }
  
  function filterTasks() {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      if (filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }
      
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      
      return true;
    });
  }
  
  function sortTasks(tasksToSort, sortBy = 'createdAt', order = 'desc') {
    return [...tasksToSort].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        aVal = priorityOrder[aVal];
        bVal = priorityOrder[bVal];
      }
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  // Event system for notifications
  const subscribers = {};
  
  function notifySubscribers(event, data) {
    if (subscribers[event]) {
      subscribers[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(\`Error in subscriber for \${event}:\`, error);
        }
      });
    }
  }
  
  function subscribe(event, callback) {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event].push(callback);
  }
  
  function unsubscribe(event, callback) {
    if (subscribers[event]) {
      subscribers[event] = subscribers[event].filter(cb => cb !== callback);
    }
  }
  
  // Statistics functions
  function getTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => 
      t.dueDate && t.dueDate < new Date() && t.status !== 'completed'
    ).length;
    
    const categoryStats = categories.reduce((stats, category) => {
      stats[category] = tasks.filter(t => t.category === category).length;
      return stats;
    }, {});
    
    const priorityStats = ['low', 'medium', 'high'].reduce((stats, priority) => {
      stats[priority] = tasks.filter(t => t.priority === priority).length;
      return stats;
    }, {});
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      categoryStats,
      priorityStats
    };
  }
  
  // Public API
  return {
    // Task CRUD operations
    create: createTask,
    update: updateTask,
    delete: deleteTask,
    getById: findTaskById,
    
    // Task queries
    getAll: function(sortBy = 'createdAt', order = 'desc') {
      return sortTasks(filterTasks(), sortBy, order).map(task => ({ ...task }));
    },
    
    getCompleted: function() {
      return tasks.filter(t => t.status === 'completed').map(task => ({ ...task }));
    },
    
    getPending: function() {
      return tasks.filter(t => t.status === 'pending').map(task => ({ ...task }));
    },
    
    getOverdue: function() {
      return tasks.filter(t => 
        t.dueDate && t.dueDate < new Date() && t.status !== 'completed'
      ).map(task => ({ ...task }));
    },
    
    getByCategory: function(category) {
      return tasks.filter(t => t.category === category).map(task => ({ ...task }));
    },
    
    getByPriority: function(priority) {
      return tasks.filter(t => t.priority === priority).map(task => ({ ...task }));
    },
    
    search: function(query) {
      const lowerQuery = query.toLowerCase();
      return tasks.filter(task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      ).map(task => ({ ...task }));
    },
    
    // Task actions
    complete: function(id) {
      return updateTask(id, { 
        status: 'completed', 
        completedAt: new Date() 
      });
    },
    
    reopen: function(id) {
      return updateTask(id, { 
        status: 'pending', 
        completedAt: null 
      });
    },
    
    // Filters
    setFilter: function(filterType, value) {
      if (filters.hasOwnProperty(filterType)) {
        filters[filterType] = value;
      }
    },
    
    getFilters: function() {
      return { ...filters };
    },
    
    clearFilters: function() {
      filters = { status: 'all', category: 'all', priority: 'all' };
    },
    
    // Categories
    getCategories: function() {
      return [...categories];
    },
    
    addCategory: function(category) {
      if (!categories.includes(category)) {
        categories.push(category);
        return true;
      }
      return false;
    },
    
    // Statistics
    getStats: getTaskStats,
    
    // Event system
    on: subscribe,
    off: unsubscribe,
    
    // Bulk operations
    bulkComplete: function(ids) {
      const results = [];
      ids.forEach(id => {
        try {
          results.push(this.complete(id));
        } catch (error) {
          results.push({ error: error.message, id });
        }
      });
      return results;
    },
    
    bulkDelete: function(ids) {
      const results = [];
      ids.forEach(id => {
        try {
          results.push(this.delete(id));
        } catch (error) {
          results.push({ error: error.message, id });
        }
      });
      return results;
    },
    
    // Data export/import
    exportTasks: function() {
      return {
        tasks: tasks.map(task => ({ ...task })),
        categories: [...categories],
        exportDate: new Date(),
        version: '1.0'
      };
    },
    
    importTasks: function(data) {
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid import data');
      }
      
      // Clear existing data
      tasks = [];
      currentId = 1;
      
      // Import tasks
      data.tasks.forEach(taskData => {
        try {
          createTask(taskData);
        } catch (error) {
          console.warn('Failed to import task:', taskData.title, error.message);
        }
      });
      
      // Import categories
      if (data.categories) {
        categories = [...new Set([...categories, ...data.categories])];
      }
      
      return { imported: tasks.length };
    }
  };
})();

// Usage example
console.log("=== Task Manager Demo ===");

// Subscribe to events
TaskManager.on('taskCreated', (task) => {
  console.log('New task created:', task.title);
});

TaskManager.on('taskCompleted', (task) => {
  console.log('Task completed:', task.title);
});

// Create tasks
const task1 = TaskManager.create({
  title: 'Learn JavaScript Modules',
  description: 'Study the module pattern',
  category: 'work',
  priority: 'high',
  tags: ['javascript', 'learning']
});

const task2 = TaskManager.create({
  title: 'Buy groceries',
  category: 'shopping',
  priority: 'medium'
});

const task3 = TaskManager.create({
  title: 'Exercise',
  category: 'health',
  priority: 'low'
});

console.log('All tasks:', TaskManager.getAll());
console.log('Work tasks:', TaskManager.getByCategory('work'));
console.log('Task stats:', TaskManager.getStats());

// Complete a task
TaskManager.complete(task1.id);
console.log('After completing task 1:', TaskManager.getStats());

// Search tasks
console.log('Search results for "learn":', TaskManager.search('learn'));

// Export data
const exportData = TaskManager.exportTasks();
console.log('Export data structure:', Object.keys(exportData));
      `
    }
  ],
  
  exercises: [
    {
      id: "module-basic",
      title: "Create a Simple Bank Account Module",
      difficulty: "easy",
      prompt: "Create a module that manages a bank account with deposit, withdraw, and balance checking functionality. Keep the balance private.",
      solution: `
const BankAccount = (function() {
  let balance = 0;
  let accountNumber = '';
  let accountHolder = '';
  
  function validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
  }
  
  return {
    initialize: function(holder, initialBalance = 0) {
      if (!holder) {
        throw new Error('Account holder name is required');
      }
      accountHolder = holder;
      balance = initialBalance;
      accountNumber = 'ACC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      return this;
    },
    
    deposit: function(amount) {
      validateAmount(amount);
      balance += amount;
      console.log(\`Deposited $\${amount}. New balance: $\${balance}\`);
      return this;
    },
    
    withdraw: function(amount) {
      validateAmount(amount);
      if (amount > balance) {
        throw new Error('Insufficient funds');
      }
      balance -= amount;
      console.log(\`Withdrew $\${amount}. New balance: $\${balance}\`);
      return this;
    },
    
    getBalance: function() {
      return balance;
    },
    
    getAccountInfo: function() {
      return {
        accountNumber,
        accountHolder,
        balance
      };
    }
  };
})();

// Usage
BankAccount.initialize('John Doe', 100);
BankAccount.deposit(50).withdraw(30);
console.log('Account info:', BankAccount.getAccountInfo());
      `
    },
    
    {
      id: "module-advanced",
      title: "Library Management System",
      difficulty: "hard",
      prompt: "Create a comprehensive library system with books, members, and borrowing functionality using the module pattern.",
      solution: `
const LibrarySystem = (function() {
  // Private data stores
  let books = [];
  let members = [];
  let borrowedBooks = [];
  let bookIdCounter = 1;
  let memberIdCounter = 1;
  
  // Private helper functions
  function generateBookId() {
    return 'B' + String(bookIdCounter++).padStart(4, '0');
  }
  
  function generateMemberId() {
    return 'M' + String(memberIdCounter++).padStart(4, '0');
  }
  
  function findBookById(id) {
    return books.find(book => book.id === id);
  }
  
  function findMemberById(id) {
    return members.find(member => member.id === id);
  }
  
  function isBookAvailable(bookId) {
    return !borrowedBooks.some(borrowed => borrowed.bookId === bookId);
  }
  
  function validateBook(book) {
    if (!book.title || !book.author) {
      throw new Error('Book must have title and author');
    }
    if (book.isbn && books.some(b => b.isbn === book.isbn && b.id !== book.id)) {
      throw new Error('Book with this ISBN already exists');
    }
  }
  
  function validateMember(member) {
    if (!member.name || !member.email) {
      throw new Error('Member must have name and email');
    }
    if (members.some(m => m.email === member.email && m.id !== member.id)) {
      throw new Error('Member with this email already exists');
    }
  }
  
  // Public interface
  return {
    // Book management
    addBook: function(bookData) {
      validateBook(bookData);
      
      const book = {
        id: generateBookId(),
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || null,
        category: bookData.category || 'General',
        addedDate: new Date(),
        totalCopies: bookData.copies || 1,
        availableCopies: bookData.copies || 1
      };
      
      books.push(book);
      return { ...book };
    },
    
    removeBook: function(id) {
      const index = books.findIndex(book => book.id === id);
      if (index === -1) {
        throw new Error('Book not found');
      }
      
      // Check if book is currently borrowed
      if (!isBookAvailable(id)) {
        throw new Error('Cannot remove book that is currently borrowed');
      }
      
      return books.splice(index, 1)[0];
    },
    
    updateBook: function(id, updates) {
      const book = findBookById(id);
      if (!book) {
        throw new Error('Book not found');
      }
      
      validateBook({ ...book, ...updates });
      Object.assign(book, updates);
      return { ...book };
    },
    
    searchBooks: function(query) {
      const lowerQuery = query.toLowerCase();
      return books.filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery)
      ).map(book => ({ ...book }));
    },
    
    getAllBooks: function() {
      return books.map(book => ({ ...book }));
    },
    
    // Member management
    addMember: function(memberData) {
      validateMember(memberData);
      
      const member = {
        id: generateMemberId(),
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone || null,
        joinDate: new Date(),
        borrowedBooks: 0,
        maxBorrowLimit: 3
      };
      
      members.push(member);
      return { ...member };
    },
    
    updateMember: function(id, updates) {
      const member = findMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      validateMember({ ...member, ...updates });
      Object.assign(member, updates);
      return { ...member };
    },
    
    getMember: function(id) {
      const member = findMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const memberBooks = borrowedBooks
        .filter(borrowed => borrowed.memberId === id)
        .map(borrowed => {
          const book = findBookById(borrowed.bookId);
          return {
            bookId: borrowed.bookId,
            title: book ? book.title : 'Unknown',
            author: book ? book.author : 'Unknown',
            borrowDate: borrowed.borrowDate,
            dueDate: borrowed.dueDate
          };
        });
      
      return {
        ...member,
        currentlyBorrowed: memberBooks
      };
    },
    
    getAllMembers: function() {
      return members.map(member => ({ ...member }));
    },
    
    // Borrowing operations
    borrowBook: function(memberId, bookId) {
      const member = findMemberById(memberId);
      const book = findBookById(bookId);
      
      if (!member) throw new Error('Member not found');
      if (!book) throw new Error('Book not found');
      
      if (member.borrowedBooks >= member.maxBorrowLimit) {
        throw new Error('Member has reached borrowing limit');
      }
      
      if (!isBookAvailable(bookId)) {
        throw new Error('Book is not available');
      }
      
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period
      
      const borrowRecord = {
        memberId,
        bookId,
        borrowDate,
        dueDate,
        returned: false
      };
      
      borrowedBooks.push(borrowRecord);
      member.borrowedBooks++;
      book.availableCopies--;
      
      return {
        memberId,
        memberName: member.name,
        bookId,
        bookTitle: book.title,
        borrowDate,
        dueDate
      };
    },
    
    returnBook: function(memberId, bookId) {
      const borrowIndex = borrowedBooks.findIndex(
        borrowed => borrowed.memberId === memberId && 
                   borrowed.bookId === bookId && 
                   !borrowed.returned
      );
      
      if (borrowIndex === -1) {
        throw new Error('Borrow record not found');
      }
      
      const borrowRecord = borrowedBooks[borrowIndex];
      const member = findMemberById(memberId);
      const book = findBookById(bookId);
      
      borrowRecord.returned = true;
      borrowRecord.returnDate = new Date();
      member.borrowedBooks--;
      book.availableCopies++;
      
      const isLate = borrowRecord.returnDate > borrowRecord.dueDate;
      const daysLate = isLate ? 
        Math.ceil((borrowRecord.returnDate - borrowRecord.dueDate) / (1000 * 60 * 60 * 24)) : 0;
      
      return {
        memberId,
        bookId,
        returnDate: borrowRecord.returnDate,
        wasLate: isLate,
        daysLate,
        fine: isLate ? daysLate * 0.5 : 0 // $0.50 per day fine
      };
    },
    
    // Reports and analytics
    getOverdueBooks: function() {
      const today = new Date();
      return borrowedBooks
        .filter(borrowed => !borrowed.returned && borrowed.dueDate < today)
        .map(borrowed => {
          const member = findMemberById(borrowed.memberId);
          const book = findBookById(borrowed.bookId);
          const daysOverdue = Math.ceil((today - borrowed.dueDate) / (1000 * 60 * 60 * 24));
          
          return {
            memberId: borrowed.memberId,
            memberName: member ? member.name : 'Unknown',
            bookId: borrowed.bookId,
            bookTitle: book ? book.title : 'Unknown',
            dueDate: borrowed.dueDate,
            daysOverdue,
            fine: daysOverdue * 0.5
          };
        });
    },
    
    getLibraryStats: function() {
      const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
      const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
      const borrowedCount = borrowedBooks.filter(b => !b.returned).length;
      const overdueCount = this.getOverdueBooks().length;
      
      return {
        totalBooks,
        availableBooks,
        borrowedCount,
        overdueCount,
        totalMembers: members.length,
        utilizationRate: Math.round((borrowedCount / totalBooks) * 100)
      };
    }
  };
})();

// Usage example
const library = LibrarySystem;

// Add books
const book1 = library.addBook({
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  isbn: "978-0596517748",
  category: "Programming",
  copies: 2
});

const book2 = library.addBook({
  title: "Clean Code",
  author: "Robert Martin",
  category: "Programming"
});

// Add members
const member1 = library.addMember({
  name: "Alice Johnson",
  email: "alice@example.com",
  phone: "555-0123"
});

const member2 = library.addMember({
  name: "Bob Smith", 
  email: "bob@example.com"
});

// Borrow and return books
console.log("Borrowing book:", library.borrowBook(member1.id, book1.id));
console.log("Member details:", library.getMember(member1.id));
console.log("Library stats:", library.getLibraryStats());

// Return book
console.log("Returning book:", library.returnBook(member1.id, book1.id));
console.log("Updated stats:", library.getLibraryStats());
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the main benefit of the Module Pattern?",
      options: [
        "Faster code execution",
        "Smaller file sizes",
        "Encapsulation and privacy",
        "Better browser compatibility"
      ],
      correct: 2,
      explanation: "The Module Pattern's main benefit is encapsulation - it allows you to create private variables and functions while exposing only what's necessary through a public interface."
    },
    
    {
      question: "What does IIFE stand for in the context of the Module Pattern?",
      options: [
        "Immediately Invoked Function Expression",
        "Internal Interface Function Extension",
        "Integrated Input Function Event",
        "Independent Instance Function Execution"
      ],
      correct: 0,
      explanation: "IIFE stands for Immediately Invoked Function Expression, which is used to create a private scope for module variables and functions."
    },
    
    {
      question: "In the Revealing Module Pattern, when are functions and variables defined?",
      options: [
        "In the returned object",
        "Privately within the module, then selectively exposed",
        "As global variables",
        "Only when called by external code"
      ],
      correct: 1,
      explanation: "In the Revealing Module Pattern, all functions and variables are defined privately within the module scope, and then selectively exposed through the returned object."
    },
    
    {
      question: "What happens to private variables in a module when multiple instances are created using a factory function?",
      options: [
        "They are shared between all instances",
        "They are global to the application",
        "Each instance has its own copy",
        "They become undefined"
      ],
      correct: 2,
      explanation: "When using a factory function to create module instances, each instance gets its own copy of the private variables, providing proper encapsulation."
    }
  ]
};

export default modulePatternContent;