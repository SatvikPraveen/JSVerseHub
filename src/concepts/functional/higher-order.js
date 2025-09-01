// File: src/concepts/functional/higher-order.js
// Functional Programming - Higher-Order Functions in JavaScript

export const higherOrderContent = {
  title: "Higher-Order Functions",
  description: "Master functions that take other functions as arguments or return functions",
  
  theory: {
    introduction: `
      Higher-order functions are functions that either take other functions as arguments, 
      return functions as their result, or both. They are a fundamental concept in functional 
      programming and enable powerful patterns like function composition, currying, and decorators.
      JavaScript's built-in array methods like map, filter, and reduce are examples of higher-order functions.
    `,
    
    concepts: [
      {
        name: "Functions as Arguments",
        explanation: "Passing functions to other functions to customize behavior",
        example: `
// Basic higher-order function
function processArray(array, processor) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(processor(array[i], i, array));
  }
  return result;
}

// Different processors
const double = x => x * 2;
const square = x => x * x;
const addIndex = (value, index) => value + index;

const numbers = [1, 2, 3, 4, 5];

console.log(processArray(numbers, double)); // [2, 4, 6, 8, 10]
console.log(processArray(numbers, square)); // [1, 4, 9, 16, 25]
console.log(processArray(numbers, addIndex)); // [1, 3, 5, 7, 9]

// Event handling with higher-order functions
function createEventHandler(action, logger) {
  return function(event) {
    logger(\`Event triggered: \${event.type}\`);
    action(event);
  };
}

const handleClick = createEventHandler(
  (event) => console.log(\`Button clicked at \${event.clientX}, \${event.clientY}\`),
  (message) => console.log(\`LOG: \${message}\`)
);

// Conditional execution
function when(condition, action) {
  return function(value) {
    if (condition(value)) {
      return action(value);
    }
    return value;
  };
}

const doubleIfEven = when(x => x % 2 === 0, x => x * 2);
const uppercaseIfLong = when(str => str.length > 5, str => str.toUpperCase());

console.log(doubleIfEven(4)); // 8
console.log(doubleIfEven(3)); // 3
console.log(uppercaseIfLong("hello")); // "hello"
console.log(uppercaseIfLong("javascript")); // "JAVASCRIPT"

// Array operations with custom functions
function filterMap(array, predicate, mapper) {
  return array.filter(predicate).map(mapper);
}

function findAndTransform(array, finder, transformer) {
  const found = array.find(finder);
  return found ? transformer(found) : null;
}

const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: false },
  { name: "Charlie", age: 35, active: true }
];

// Get names of active users in uppercase
const activeUserNames = filterMap(
  users,
  user => user.active,
  user => user.name.toUpperCase()
);

console.log(activeUserNames); // ["ALICE", "CHARLIE"]

// Find and format first user over 30
const oldestUserInfo = findAndTransform(
  users,
  user => user.age > 30,
  user => \`\${user.name} (\${user.age} years old)\`
);

console.log(oldestUserInfo); // "Charlie (35 years old)"
        `
      },
      
      {
        name: "Functions Returning Functions",
        explanation: "Creating specialized functions by returning new functions",
        example: `
// Function factories
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log(double(5)); // 10
console.log(triple(4)); // 12
console.log(tenTimes(3)); // 30

// Validation function factory
function createValidator(rules) {
  return function(value) {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return { valid: false, error: rule.message };
      }
    }
    return { valid: true };
  };
}

const passwordValidator = createValidator([
  { test: val => val.length >= 8, message: "Password must be at least 8 characters" },
  { test: val => /[A-Z]/.test(val), message: "Password must contain uppercase letter" },
  { test: val => /[0-9]/.test(val), message: "Password must contain a number" }
]);

const emailValidator = createValidator([
  { test: val => val.includes("@"), message: "Email must contain @" },
  { test: val => val.includes("."), message: "Email must contain domain" }
]);

console.log(passwordValidator("Pass123")); // { valid: true }
console.log(passwordValidator("weak")); // { valid: false, error: "Password must be at least 8 characters" }

// Memoization function
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key);
    }
    
    console.log("Computing...");
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive fibonacci function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = memoize(fibonacci);

console.log(memoizedFibonacci(10)); // Computing... 55
console.log(memoizedFibonacci(10)); // Cache hit! 55

// Throttle function factory
function throttle(fn, delay) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Usage example (in a browser environment)
const throttledLog = throttle(message => console.log(message), 1000);

// Only logs once per second, even if called more frequently
throttledLog("Hello 1"); // Logs immediately
throttledLog("Hello 2"); // Ignored (too soon)
setTimeout(() => throttledLog("Hello 3"), 1100); // Logs after delay

// Configuration function factory
function createApiClient(baseUrl, defaultHeaders = {}) {
  return function(endpoint, options = {}) {
    const url = \`\${baseUrl}\${endpoint}\`;
    const headers = { ...defaultHeaders, ...options.headers };
    
    return {
      get: () => fetch(url, { ...options, method: 'GET', headers }),
      post: (data) => fetch(url, { ...options, method: 'POST', headers, body: JSON.stringify(data) }),
      put: (data) => fetch(url, { ...options, method: 'PUT', headers, body: JSON.stringify(data) }),
      delete: () => fetch(url, { ...options, method: 'DELETE', headers })
    };
  };
}

const jsonApiClient = createApiClient('https://api.example.com', {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token123'
});

const usersApi = jsonApiClient('/users');
// usersApi.get() makes a GET request to https://api.example.com/users
        `
      },
      
      {
        name: "Function Decorators",
        explanation: "Wrapping functions to add additional behavior",
        example: `
// Basic decorator pattern
function withLogging(fn) {
  return function(...args) {
    console.log(\`Calling \${fn.name} with arguments:\`, args);
    const result = fn.apply(this, args);
    console.log(\`\${fn.name} returned:\`, result);
    return result;
  };
}

// Timing decorator
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(\`\${fn.name} took \${(end - start).toFixed(2)}ms\`);
    return result;
  };
}

// Error handling decorator
function withErrorHandling(fn, errorHandler = console.error) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      errorHandler(\`Error in \${fn.name}:\`, error.message);
      return null;
    }
  };
}

// Retry decorator
function withRetry(fn, maxRetries = 3) {
  return function(...args) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        lastError = error;
        console.log(\`Attempt \${attempt} failed: \${error.message}\`);
        
        if (attempt === maxRetries) {
          throw lastError;
        }
      }
    }
  };
}

// Rate limiting decorator
function withRateLimit(fn, maxCalls, timeWindow) {
  const calls = [];
  
  return function(...args) {
    const now = Date.now();
    
    // Remove calls outside the time window
    while (calls.length && calls[0] <= now - timeWindow) {
      calls.shift();
    }
    
    if (calls.length >= maxCalls) {
      throw new Error(\`Rate limit exceeded: \${maxCalls} calls per \${timeWindow}ms\`);
    }
    
    calls.push(now);
    return fn.apply(this, args);
  };
}

// Compose multiple decorators
function compose(...decorators) {
  return function(fn) {
    return decorators.reduce((decoratedFn, decorator) => decorator(decoratedFn), fn);
  };
}

// Example usage
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

function slowFunction(n) {
  // Simulate slow operation
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += Math.random();
  }
  return result;
}

// Apply decorators
const decoratedDivide = compose(
  withLogging,
  withErrorHandling,
  withRetry
)(divide);

const decoratedSlowFunction = compose(
  withTiming,
  withLogging
)(slowFunction);

// Test decorated functions
console.log(decoratedDivide(10, 2)); // 5 (with logging and error handling)
console.log(decoratedDivide(10, 0)); // null (error caught and handled)

decoratedSlowFunction(100); // Executes with timing and logging

// API call decorator example
function withCache(fn, ttl = 60000) { // 60 second TTL
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log("Returning cached result");
      return Promise.resolve(cached.data);
    }
    
    return fn.apply(this, args).then(result => {
      cache.set(key, { data: result, timestamp: Date.now() });
      return result;
    });
  };
}

async function fetchUser(id) {
  console.log(\`Fetching user \${id} from API...\`);
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: \`User \${id}\` }), 1000);
  });
}

const cachedFetchUser = withCache(fetchUser, 30000); // 30 second cache

// First call hits API, second call uses cache
cachedFetchUser(1).then(user => console.log("First call:", user));
setTimeout(() => {
  cachedFetchUser(1).then(user => console.log("Second call (cached):", user));
}, 2000);
        `
      },
      
      {
        name: "Currying and Partial Application",
        explanation: "Creating specialized functions through currying and partial application",
        example: `
// Manual currying
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(add(1)(2)(3)); // 6

// Generic currying function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    
    return function(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

// Example functions to curry
function multiply(a, b, c) {
  return a * b * c;
}

function greet(greeting, name, punctuation) {
  return \`\${greeting} \${name}\${punctuation}\`;
}

// Create curried versions
const curriedMultiply = curry(multiply);
const curriedGreet = curry(greet);

// Use curried functions
const multiplyByTwo = curriedMultiply(2);
const multiplyByTwoAndThree = curriedMultiply(2)(3);

console.log(multiplyByTwo(5, 6)); // 60 (2 * 5 * 6)
console.log(multiplyByTwoAndThree(4)); // 24 (2 * 3 * 4)

const sayHello = curriedGreet("Hello");
const sayHelloToJohn = curriedGreet("Hello")("John");

console.log(sayHello("Alice", "!")); // "Hello Alice!"
console.log(sayHelloToJohn(".")); // "Hello John."

// Partial application
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

// Example with fetch wrapper
function apiCall(method, url, headers, data) {
  console.log(\`\${method} \${url}\`);
  console.log("Headers:", headers);
  console.log("Data:", data);
  // In real scenario, would make actual fetch call
  return \`Mock response for \${method} \${url}\`;
}

// Create specialized API functions
const jsonHeaders = { "Content-Type": "application/json" };
const postJson = partial(apiCall, "POST", undefined, jsonHeaders);
const getRequest = partial(apiCall, "GET");

// Usage
postJson("https://api.example.com/users", { name: "John", age: 30 });
getRequest("https://api.example.com/users", {}, null);

// Practical currying examples
const map = curry((fn, array) => array.map(fn));
const filter = curry((predicate, array) => array.filter(predicate));
const reduce = curry((reducer, initial, array) => array.reduce(reducer, initial));

// Create reusable specialized functions
const mapDouble = map(x => x * 2);
const filterEven = filter(x => x % 2 === 0);
const sum = reduce((acc, val) => acc + val, 0);

const numbers = [1, 2, 3, 4, 5, 6];

console.log(mapDouble(numbers)); // [2, 4, 6, 8, 10, 12]
console.log(filterEven(numbers)); // [2, 4, 6]
console.log(sum(numbers)); // 21

// Function composition with curried functions
const pipe = (...functions) => (value) => functions.reduce((acc, fn) => fn(acc), value);

const processNumbers = pipe(
  filterEven,     // Filter even numbers
  mapDouble,      // Double them
  sum             // Sum the result
);

console.log(processNumbers([1, 2, 3, 4, 5, 6])); // 24 ((2 + 4 + 6) * 2)

// Configuration with currying
const createValidator = curry((rules, value) => {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
});

// Email validation rules
const emailRules = [
  { test: val => val.includes("@"), message: "Must contain @" },
  { test: val => val.length > 5, message: "Must be longer than 5 characters" }
];

const validateEmail = createValidator(emailRules);

console.log(validateEmail("test@example.com")); // { valid: true }
console.log(validateEmail("test")); // { valid: false, error: "Must contain @" }
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Event System with Higher-Order Functions",
      description: "A flexible event system using function composition and decorators",
      code: `
// Event emitter using higher-order functions
function createEventEmitter() {
  const events = {};
  
  // Base event methods
  const on = (eventName, handler) => {
    if (!events[eventName]) {
      events[eventName] = [];
    }
    events[eventName].push(handler);
  };
  
  const emit = (eventName, ...args) => {
    if (events[eventName]) {
      events[eventName].forEach(handler => handler(...args));
    }
  };
  
  const off = (eventName, handler) => {
    if (events[eventName]) {
      events[eventName] = events[eventName].filter(h => h !== handler);
    }
  };
  
  return { on, emit, off, getEvents: () => ({ ...events }) };
}

// Event handler decorators
function withOnce(handler) {
  let called = false;
  return function(...args) {
    if (!called) {
      called = true;
      return handler.apply(this, args);
    }
  };
}

function withDelay(handler, delay) {
  return function(...args) {
    setTimeout(() => handler.apply(this, args), delay);
  };
}

function withCondition(handler, condition) {
  return function(...args) {
    if (condition(...args)) {
      return handler.apply(this, args);
    }
  };
}

function withLogging(handler, logger = console.log) {
  return function(...args) {
    logger(\`Event handler called with:\`, args);
    return handler.apply(this, args);
  };
}

// Event middleware system
function createMiddleware() {
  const middlewares = [];
  
  const use = (middleware) => {
    middlewares.push(middleware);
  };
  
  const execute = (eventName, data, next) => {
    let index = 0;
    
    function runMiddleware() {
      if (index >= middlewares.length) {
        return next();
      }
      
      const middleware = middlewares[index++];
      middleware(eventName, data, runMiddleware);
    }
    
    runMiddleware();
  };
  
  return { use, execute };
}

// Enhanced event emitter with middleware
function createAdvancedEventEmitter() {
  const baseEmitter = createEventEmitter();
  const middleware = createMiddleware();
  
  const emit = (eventName, ...args) => {
    middleware.execute(eventName, args, () => {
      baseEmitter.emit(eventName, ...args);
    });
  };
  
  return {
    ...baseEmitter,
    emit,
    use: middleware.use
  };
}

// Usage examples
const emitter = createAdvancedEventEmitter();

// Add middleware for logging
emitter.use((eventName, data, next) => {
  console.log(\`Middleware: \${eventName} event with data:\`, data);
  next();
});

// Add middleware for validation
emitter.use((eventName, data, next) => {
  if (eventName.startsWith('user.') && data.length === 0) {
    console.log('Validation failed: user events require data');
    return; // Don't call next(), blocking the event
  }
  next();
});

// Register event handlers with decorators
const handleUserLogin = withLogging((user) => {
  console.log(`User ${user.name} logged in`);
});

const handleUserLogout = withOnce(withDelay((user) => {
  console.log(`User ${user.name} logged out`);
}, 1000));

const handleAdminAction = withCondition(
  (action) => console.log(`Admin action: ${action}`),
  (action) => action.startsWith('admin.')
);

emitter.on('user.login', handleUserLogin);
emitter.on('user.logout', handleUserLogout);
emitter.on('admin.action', handleAdminAction);

// Test the event system
emitter.emit('user.login', { name: 'John', id: 1 });
emitter.emit('user.logout', { name: 'John', id: 1 });
emitter.emit('user.logout', { name: 'John', id: 1 }); // Won't fire (once only)
emitter.emit('admin.action', 'admin.delete_user');
emitter.emit('admin.action', 'regular.action'); // Won't fire (condition fails)
      `
    },
    
    {
      title: "Functional Data Pipeline",
      description: "Data processing pipeline using higher-order functions and composition",
      code: `
// Core pipeline functions
const pipe = (...functions) => (input) => functions.reduce((acc, fn) => fn(acc), input);
const compose = (...functions) => (input) => functions.reduceRight((acc, fn) => fn(acc), input);

// Curried utility functions
const curry = (fn) => (...args) => args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));

// Data transformation functions
const map = curry((fn, data) => data.map(fn));
const filter = curry((predicate, data) => data.filter(predicate));
const reduce = curry((reducer, initial, data) => data.reduce(reducer, initial));
const sort = curry((compareFn, data) => [...data].sort(compareFn));
const take = curry((count, data) => data.slice(0, count));
const skip = curry((count, data) => data.slice(count));
const groupBy = curry((keyFn, data) => {
  return data.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
});

// Statistical functions
const sum = (numbers) => numbers.reduce((a, b) => a + b, 0);
const average = (numbers) => numbers.length ? sum(numbers) / numbers.length : 0;
const min = (numbers) => Math.min(...numbers);
const max = (numbers) => Math.max(...numbers);

// String utilities
const trim = (str) => str.trim();
const toLowerCase = (str) => str.toLowerCase();
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Validation functions
const isEmail = (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
const isValidAge = (age) => typeof age === 'number' && age >= 0 && age <= 150;
const hasProperty = curry((prop, obj) => obj.hasOwnProperty(prop));
const matchesPattern = curry((pattern, str) => pattern.test(str));

// Data processing pipeline factory
function createDataProcessor(config = {}) {
  const { 
    validate = true, 
    transform = true, 
    sort: shouldSort = false,
    limit = null,
    grouping = null 
  } = config;
  
  return function processData(data, operations = {}) {
    let pipeline = [];
    
    // Validation stage
    if (validate && operations.validations) {
      pipeline.push(
        filter(item => {
          return operations.validations.every(validation => validation(item));
        })
      );
    }
    
    // Transformation stage
    if (transform && operations.transformations) {
      operations.transformations.forEach(transformation => {
        pipeline.push(map(transformation));
      });
    }
    
    // Filtering stage
    if (operations.filters) {
      operations.filters.forEach(filterFn => {
        pipeline.push(filter(filterFn));
      });
    }
    
    // Sorting stage
    if (shouldSort && operations.sortBy) {
      pipeline.push(sort(operations.sortBy));
    }
    
    // Limiting stage
    if (limit && operations.limit) {
      pipeline.push(take(operations.limit));
    }
    
    // Grouping stage
    if (grouping && operations.groupBy) {
      pipeline.push(groupBy(operations.groupBy));
    }
    
    // Execute pipeline
    return pipe(...pipeline)(data);
  };
}

// Analytics functions
const createAnalytics = () => {
  const calculateStats = (data, valueExtractor) => {
    const values = data.map(valueExtractor);
    return {
      count: values.length,
      sum: sum(values),
      average: average(values),
      min: min(values),
      max: max(values),
      median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
    };
  };
  
  const percentile = curry((p, values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  });
  
  const distribution = (data, valueExtractor, buckets = 10) => {
    const values = data.map(valueExtractor);
    const minVal = min(values);
    const maxVal = max(values);
    const bucketSize = (maxVal - minVal) / buckets;
    
    const bucketCounts = Array(buckets).fill(0);
    
    values.forEach(value => {
      const bucketIndex = Math.min(Math.floor((value - minVal) / bucketSize), buckets - 1);
      bucketCounts[bucketIndex]++;
    });
    
    return bucketCounts.map((count, index) => ({
      range: [minVal + (index * bucketSize), minVal + ((index + 1) * bucketSize)],
      count
    }));
  };
  
  return { calculateStats, percentile, distribution };
};

// Usage example with sample data
const rawUserData = [
  { name: "  Alice Johnson  ", email: "alice@EXAMPLE.com", age: 28, department: "engineering", salary: 75000, active: true },
  { name: "BOB SMITH", email: "bob.smith@company.com", age: 32, department: "marketing", salary: 65000, active: true },
  { name: "charlie brown", email: "invalid-email", age: 29, department: "engineering", salary: 80000, active: false },
  { name: "Diana Wilson", email: "diana@company.com", age: 26, department: "design", salary: 70000, active: true },
  { name: "Eve Davis", email: "eve@company.com", age: 35, department: "engineering", salary: 90000, active: true }
];

// Create processor
const userProcessor = createDataProcessor({ 
  validate: true, 
  transform: true, 
  sort: true 
});

// Define processing operations
const userOperations = {
  validations: [
    user => isEmail(user.email),
    user => isValidAge(user.age),
    user => user.active
  ],
  transformations: [
    user => ({
      ...user,
      name: pipe(trim, capitalize)(user.name),
      email: toLowerCase(user.email),
      department: capitalize(user.department)
    })
  ],
  filters: [
    user => user.salary > 60000
  ],
  sortBy: (a, b) => b.salary - a.salary,
  groupBy: user => user.department
};

// Process the data
const processedUsers = userProcessor(rawUserData, userOperations);
console.log("Processed Users:", processedUsers);

// Analytics example
const analytics = createAnalytics();
const validUsers = rawUserData.filter(user => user.active && isEmail(user.email));

const salaryStats = analytics.calculateStats(validUsers, user => user.salary);
const ageDistribution = analytics.distribution(validUsers, user => user.age, 5);
const salaryPercentile90 = analytics.percentile(90, validUsers.map(user => user.salary));

console.log("Salary Statistics:", salaryStats);
console.log("Age Distribution:", ageDistribution);
console.log("90th Percentile Salary:", salaryPercentile90);

// Create specialized processors
const seniorEngineers = pipe(
  filter(user => user.department.toLowerCase() === 'engineering'),
  filter(user => user.age >= 30),
  sort((a, b) => b.salary - a.salary)
);

const topEarners = pipe(
  filter(user => user.active),
  sort((a, b) => b.salary - a.salary),
  take(3),
  map(user => ({ name: user.name, salary: user.salary, department: user.department }))
);

console.log("Senior Engineers:", seniorEngineers(rawUserData));
console.log("Top 3 Earners:", topEarners(rawUserData));
      `
    }
  ],
  
  exercises: [
    {
      id: "higher-order-basic",
      title: "Create Array Utilities",
      difficulty: "easy", 
      prompt: "Create higher-order functions for array operations: createFilter, createMapper, and createReducer.",
      solution: `
// Higher-order array utility functions
function createFilter(predicate) {
  return function(array) {
    return array.filter(predicate);
  };
}

function createMapper(transformer) {
  return function(array) {
    return array.map(transformer);
  };
}

function createReducer(reducer, initialValue) {
  return function(array) {
    return array.reduce(reducer, initialValue);
  };
}

// Usage examples
const filterEven = createFilter(x => x % 2 === 0);
const mapDouble = createMapper(x => x * 2);
const sumAll = createReducer((acc, val) => acc + val, 0);

const numbers = [1, 2, 3, 4, 5, 6];

console.log(filterEven(numbers)); // [2, 4, 6]
console.log(mapDouble(numbers));  // [2, 4, 6, 8, 10, 12]
console.log(sumAll(numbers));     // 21

// Create specialized functions
const filterPositive = createFilter(x => x > 0);
const mapSquare = createMapper(x => x * x);
const findMax = createReducer((max, val) => Math.max(max, val), -Infinity);

const mixedNumbers = [-2, -1, 0, 1, 2, 3];
console.log(filterPositive(mixedNumbers)); // [1, 2, 3]
console.log(mapSquare(mixedNumbers));      // [4, 1, 0, 1, 4, 9]
console.log(findMax(mixedNumbers));        // 3
      `
    },
    
    {
      id: "higher-order-intermediate", 
      title: "Function Decorator System",
      difficulty: "medium",
      prompt: "Create a decorator system with timing, caching, and retry decorators that can be composed together.",
      solution: `
// Decorator functions
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(\`\${fn.name || 'anonymous'} took \${(end - start).toFixed(2)}ms\`);
    return result;
  };
}

function withCache(fn, ttl = 60000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log("Cache hit!");
      return cached.value;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
}

function withRetry(fn, maxAttempts = 3, delay = 1000) {
  return function(...args) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        lastError = error;
        console.log(\`Attempt \${attempt} failed: \${error.message}\`);
        
        if (attempt < maxAttempts) {
          // In a real scenario, you'd want to use setTimeout for async operations
          console.log(\`Retrying in \${delay}ms...\`);
        }
      }
    }
    
    throw new Error(\`All \${maxAttempts} attempts failed. Last error: \${lastError.message}\`);
  };
}

function withLogging(fn) {
  return function(...args) {
    console.log(\`Calling \${fn.name || 'anonymous'} with args:\`, args);
    try {
      const result = fn.apply(this, args);
      console.log(\`\${fn.name || 'anonymous'} returned:\`, result);
      return result;
    } catch (error) {
      console.log(\`\${fn.name || 'anonymous'} threw error:\`, error.message);
      throw error;
    }
  };
}

// Composition helper
function compose(...decorators) {
  return function(fn) {
    return decorators.reduceRight((decoratedFn, decorator) => {
      return decorator(decoratedFn);
    }, fn);
  };
}

// Test functions
function expensiveCalculation(n) {
  console.log("Performing expensive calculation...");
  let result = 0;
  for (let i = 0; i < n * 1000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

function unreliableFunction(input) {
  if (Math.random() < 0.7) {
    throw new Error("Random failure occurred");
  }
  return \`Success: \${input}\`;
}

// Apply decorators individually
const timedCalculation = withTiming(expensiveCalculation);
const cachedCalculation = withCache(expensiveCalculation, 30000);
const retriedFunction = withRetry(unreliableFunction, 5);

// Compose multiple decorators
const fullyDecorated = compose(
  withTiming,
  withCache,
  withLogging
)(expensiveCalculation);

const robustFunction = compose(
  withLogging,
  withRetry,
  withTiming
)(unreliableFunction);

// Usage
console.log("=== Testing individual decorators ===");
timedCalculation(100);
cachedCalculation(100); // First call - calculates
cachedCalculation(100); // Second call - from cache

console.log("=== Testing composed decorators ===");
fullyDecorated(50); // Logs, caches, and times
fullyDecorated(50); // Second call uses cache

console.log("=== Testing retry functionality ===");
try {
  robustFunction("test data");
} catch (error) {
  console.log("Final error:", error.message);
}
      `
    }
  ],
  
  quiz: [
    {
      question: "What is a higher-order function?",
      options: [
        "A function that returns a number",
        "A function that takes other functions as arguments or returns a function",
        "A function that has more than 3 parameters",
        "A function that uses arrow syntax"
      ],
      correct: 1,
      explanation: "A higher-order function either takes other functions as arguments, returns a function as its result, or both."
    },
    
    {
      question: "What is the difference between currying and partial application?",
      options: [
        "They are the same thing",
        "Currying creates a series of unary functions, partial application fixes some arguments",
        "Currying is for objects, partial application is for functions",
        "Partial application creates unary functions, currying fixes arguments"
      ],
      correct: 1,
      explanation: "Currying transforms a function into a series of unary functions. Partial application creates a new function by fixing some arguments of the original function."
    },
    
    {
      question: "What does function composition allow you to do?",
      options: [
        "Combine multiple functions into a single function",
        "Create private variables in functions",
        "Make functions run faster",
        "Prevent function side effects"
      ],
      correct: 0,
      explanation: "Function composition allows you to combine multiple functions into a single function, where the output of one function becomes the input of the next."
    }
  ]
};

export default higherOrderContent;