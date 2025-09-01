// File: src/concepts/es6/arrow-functions.js
// ES6 Arrow Functions - Syntax, behavior, and best practices

export const arrowFunctionsConfig = {
  title: "ES6 Arrow Functions",
  description: "Master arrow function syntax, lexical this, and use cases",
  difficulty: "beginner-intermediate",
  estimatedTime: "30 minutes"
};

// Basic Arrow Function Syntax
export const basicSyntax = {
  concept: "Basic Arrow Function Syntax",
  explanation: `
    Arrow functions provide a more concise way to write functions in JavaScript.
    They have different behavior regarding 'this' binding and cannot be used as constructors.
  `,
  
  examples: {
    syntaxVariations: `
// Traditional function expression
const traditionalFunction = function(x, y) {
  return x + y;
};

// Arrow function equivalents
const arrowFunction1 = (x, y) => {
  return x + y;
};

// Concise body (implicit return)
const arrowFunction2 = (x, y) => x + y;

// Single parameter (parentheses optional)
const double = x => x * 2;
const doubleExplicit = (x) => x * 2;

// No parameters
const greet = () => "Hello World!";
const getCurrentTime = () => new Date();

// Multiple statements require braces and explicit return
const processData = (data) => {
  const processed = data.map(item => item.toUpperCase());
  const filtered = processed.filter(item => item.length > 3);
  return filtered.join(', ');
};

// Returning object literals (wrap in parentheses)
const createUser = (name, age) => ({ name, age, id: Math.random() });

// Without parentheses, this would be interpreted as a block
const createUserWrong = (name, age) => { name, age }; // Syntax error

console.log(arrowFunction2(5, 3)); // 8
console.log(double(4)); // 8
console.log(greet()); // "Hello World!"
console.log(createUser("Alice", 30)); // { name: "Alice", age: 30, id: 0.123... }
    `,
    
    comparisonWithRegularFunctions: `
// Comparison between regular functions and arrow functions

// 1. Syntax comparison
function regularAdd(a, b) {
  return a + b;
}

const arrowAdd = (a, b) => a + b;

// 2. Function expressions
const regularMultiply = function(a, b) {
  return a * b;
};

const arrowMultiply = (a, b) => a * b;

// 3. Single expression vs multiple statements
const regularCalculate = function(x) {
  const squared = x * x;
  const doubled = x * 2;
  return squared + doubled;
};

const arrowCalculate = x => {
  const squared = x * x;
  const doubled = x * 2;
  return squared + doubled;
};

// Single expression version
const arrowCalculateShort = x => x * x + x * 2;

// 4. Array methods - where arrow functions shine
const numbers = [1, 2, 3, 4, 5];

// Using regular functions
const doubledRegular = numbers.map(function(n) {
  return n * 2;
});

const evenRegular = numbers.filter(function(n) {
  return n % 2 === 0;
});

// Using arrow functions (much cleaner)
const doubledArrow = numbers.map(n => n * 2);
const evenArrow = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(doubledArrow); // [2, 4, 6, 8, 10]
console.log(evenArrow); // [2, 4]
console.log(sum); // 15

// 5. Chaining with arrow functions
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 3)
  .reduce((acc, n) => acc + n, 0);

console.log(result); // 42 (3*3 + 4*3 + 5*3 = 9 + 12 + 15)
    `,
    
    concisePatterns: `
// Concise patterns with arrow functions

// 1. Conditional returns
const getStatus = score => score >= 60 ? 'Pass' : 'Fail';
const isEven = n => n % 2 === 0;
const max = (a, b) => a > b ? a : b;

// 2. Object property shorthand with arrow functions
const mathUtils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : null
};

// 3. Array destructuring in parameters
const getFullName = ([first, last]) => \`\${first} \${last}\`;
const getCoordinateDistance = ([x1, y1], [x2, y2]) => 
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// 4. Object destructuring in parameters
const formatUser = ({ name, age, email }) => 
  \`\${name} (\${age}) - \${email}\`;

const calculateArea = ({ width, height }) => width * height;

// 5. Default parameters with arrow functions
const greetUser = (name = 'Guest') => \`Welcome, \${name}!\`;
const createCircle = (radius = 1) => ({ 
  radius, 
  area: Math.PI * radius ** 2,
  circumference: 2 * Math.PI * radius
});

// 6. Rest parameters
const sum = (...numbers) => numbers.reduce((acc, n) => acc + n, 0);
const createList = (title, ...items) => ({ title, items });

console.log(getStatus(75)); // "Pass"
console.log(getFullName(["John", "Doe"])); // "John Doe"
console.log(formatUser({ name: "Alice", age: 30, email: "alice@example.com" }));
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(createList("Shopping", "milk", "bread", "eggs"));
    `
  }
};

// Lexical This Binding
export const lexicalThis = {
  concept: "Lexical This Binding",
  explanation: `
    Arrow functions don't have their own 'this' context. They inherit 'this' 
    from the enclosing scope, which is different from regular functions.
  `,
  
  examples: {
    thisBinding: `
// Traditional function vs Arrow function 'this' binding

// Example 1: Object methods
const person = {
  name: 'Alice',
  age: 30,
  
  // Regular function - 'this' refers to the person object
  regularGreet: function() {
    console.log(\`Hello, I'm \${this.name} and I'm \${this.age} years old.\`);
  },
  
  // Arrow function - 'this' refers to the enclosing scope (likely window/global)
  arrowGreet: () => {
    console.log(\`Hello, I'm \${this.name} and I'm \${this.age} years old.\`);
    // this.name and this.age will be undefined (or global values)
  },
  
  // Nested function example
  delayedGreeting: function() {
    // Regular function in setTimeout - 'this' context is lost
    setTimeout(function() {
      console.log(\`Delayed: \${this.name}\`); // undefined
    }, 1000);
    
    // Arrow function preserves 'this' from enclosing scope
    setTimeout(() => {
      console.log(\`Delayed: \${this.name}\`); // "Alice"
    }, 1500);
  }
};

person.regularGreet(); // Works correctly
person.arrowGreet(); // this.name and this.age are undefined
person.delayedGreeting();

// Example 2: Event handlers
const button = {
  element: null, // Would be a DOM element in browser
  text: 'Click Me!',
  clickCount: 0,
  
  init: function() {
    // Simulate DOM element
    this.element = { addEventListener: function() {} };
    
    // Regular function - loses 'this' context
    this.element.addEventListener('click', function() {
      this.clickCount++; // 'this' refers to the element, not the button object
      console.log(\`Clicks: \${this.clickCount}\`); // Won't work as expected
    });
    
    // Arrow function - preserves 'this' context
    this.element.addEventListener('click', () => {
      this.clickCount++; // 'this' refers to the button object
      console.log(\`Clicks: \${this.clickCount}\`); // Works correctly
    });
    
    // Alternative with regular function and bind
    this.element.addEventListener('click', function() {
      this.clickCount++;
      console.log(\`Clicks: \${this.clickCount}\`);
    }.bind(this));
  }
};
    `,
    
    classMethodsAndThis: `
// Arrow functions in classes and this binding
class Counter {
  constructor(initialValue = 0) {
    this.count = initialValue;
    this.history = [];
  }
  
  // Regular method - 'this' refers to instance
  increment() {
    this.count++;
    this.history.push(\`increment: \${this.count}\`);
    return this;
  }
  
  // Arrow function method - 'this' is lexically bound
  decrement = () => {
    this.count--;
    this.history.push(\`decrement: \${this.count}\`);
    return this;
  }
  
  // Method that returns a function
  getIncrementer() {
    // Regular function - would lose 'this' context when called separately
    return function() {
      this.count++; // 'this' would be undefined or global object
    };
  }
  
  // Method that returns an arrow function
  getArrowIncrementer() {
    // Arrow function - preserves 'this' context
    return () => {
      this.count++;
      this.history.push(\`arrow increment: \${this.count}\`);
    };
  }
  
  // Method using arrow functions for array operations
  processNumbers(numbers) {
    return numbers
      .filter(n => n > 0) // Arrow function inherits 'this'
      .map(n => {
        this.count += n; // Can access this.count
        return n * 2;
      })
      .reduce((sum, n) => sum + n, 0);
  }
}

const counter = new Counter(10);

// Method chaining works with both
counter.increment().decrement();
console.log(counter.count); // 10

// Getting functions to call separately
const regularInc = counter.getIncrementer();
const arrowInc = counter.getArrowIncrementer();

// regularInc(); // Would cause error or not work as expected
arrowInc(); // Works correctly
console.log(counter.count); // 11

// Array processing
const numbers = [1, 2, 3, 4, 5];
const result = counter.processNumbers(numbers);
console.log(counter.count); // 26 (10 + 1 + 2 + 3 + 4 + 5)
console.log(result); // 30 (2 + 4 + 6 + 8 + 10)
    `,
    
    asyncAndThis: `
// Arrow functions with async operations and 'this'
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
    this.requestCount = 0;
  }
  
  // Regular async method
  async fetchData(endpoint) {
    this.requestCount++;
    
    // Using arrow function in Promise to preserve 'this'
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.cache.has(endpoint)) {
          resolve(this.cache.get(endpoint));
        } else {
          const data = { endpoint, timestamp: Date.now(), count: this.requestCount };
          this.cache.set(endpoint, data);
          resolve(data);
        }
      }, 100);
    });
  }
  
  // Arrow function async method
  fetchMultiple = async (endpoints) => {
    // Arrow function preserves 'this' in async context
    const promises = endpoints.map(endpoint => this.fetchData(endpoint));
    return Promise.all(promises);
  }
  
  // Method that returns async function
  createFetcher(endpoint) {
    // Return arrow function to preserve 'this'
    return async () => {
      return await this.fetchData(endpoint);
    };
  }
  
  // Chain async operations with arrow functions
  async processEndpoints(endpoints) {
    const results = await Promise.all(
      endpoints
        .filter(endpoint => endpoint.startsWith('/api/')) // Arrow function
        .map(async endpoint => { // Async arrow function
          const data = await this.fetchData(endpoint);
          return {
            ...data,
            processed: true,
            clientRequests: this.requestCount
          };
        })
    );
    
    return results;
  }
}

// Usage example
const client = new ApiClient('https://api.example.com');

async function demonstrateAsyncThis() {
  try {
    const data = await client.fetchData('/api/users');
    console.log('Single fetch:', data);
    
    const multiple = await client.fetchMultiple(['/api/users', '/api/posts']);
    console.log('Multiple fetch:', multiple);
    
    const fetcher = client.createFetcher('/api/profile');
    const profile = await fetcher();
    console.log('Created fetcher:', profile);
    
    console.log('Total requests:', client.requestCount);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// demonstrateAsyncThis();
    `
  }
};

// When NOT to use Arrow Functions
export const whenNotToUse = {
  concept: "When NOT to Use Arrow Functions",
  explanation: `
    Arrow functions aren't always the right choice. There are specific scenarios
    where regular functions are more appropriate or necessary.
  `,
  
  examples: {
    objectMethods: `
// 1. Object methods that need 'this' context
const calculator = {
  value: 0,
  
  // ❌ Wrong - arrow function doesn't bind 'this' to the object
  addWrong: (n) => {
    this.value += n; // 'this' doesn't refer to calculator object
    return this;
  },
  
  // ✅ Correct - regular function binds 'this' to the object
  add: function(n) {
    this.value += n;
    return this;
  },
  
  // ✅ Also correct - method shorthand
  subtract(n) {
    this.value -= n;
    return this;
  },
  
  // ❌ Wrong for event handlers that need method chaining
  onClickWrong: () => {
    this.value = 0; // 'this' doesn't refer to calculator
    return this; // Can't chain
  },
  
  // ✅ Correct for method that returns bound function
  getResetter() {
    return () => {
      this.value = 0; // Arrow function preserves calculator's 'this'
    };
  }
};

calculator.add(5).subtract(2); // Works, value = 3
// calculator.addWrong(10); // Won't work as expected

// 2. Constructor functions
// ❌ Wrong - arrow functions cannot be constructors
const PersonWrong = (name) => {
  this.name = name; // Error: arrow functions don't have 'this'
};

// new PersonWrong('Alice'); // TypeError: PersonWrong is not a constructor

// ✅ Correct - regular function constructor
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');
console.log(alice.name); // "Alice"
    `,
    
    methodsRequiringThis: `
// 3. Methods that need dynamic 'this'
const element = {
  id: 'myButton',
  text: 'Click me',
  clickCount: 0,
  
  // ❌ Wrong - can't access element properties
  handleClickWrong: () => {
    this.clickCount++; // 'this' is not the element
    console.log(\`Button \${this.id} clicked \${this.clickCount} times\`);
  },
  
  // ✅ Correct - 'this' refers to the element object
  handleClick: function() {
    this.clickCount++;
    console.log(\`Button \${this.id} clicked \${this.clickCount} times\`);
  },
  
  // ✅ Correct - method shorthand
  reset() {
    this.clickCount = 0;
  }
};

// 4. Prototype methods
// ❌ Wrong - arrow functions on prototype
Array.prototype.customMapWrong = (callback) => {
  const result = [];
  for (let i = 0; i < this.length; i++) { // 'this' is not the array
    result.push(callback(this[i], i, this));
  }
  return result;
};

// ✅ Correct - regular function on prototype
Array.prototype.customMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) { // 'this' refers to the array
    result.push(callback(this[i], i, this));
  }
  return result;
};

const numbers = [1, 2, 3];
// const wrongResult = numbers.customMapWrong(x => x * 2); // Won't work
const correctResult = numbers.customMap(x => x * 2); // [2, 4, 6]
    `,
    
    argumentsAndHoisting: `
// 5. Functions that need 'arguments' object
// ❌ Arrow functions don't have 'arguments'
const sumWrong = () => {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) { // ReferenceError: arguments is not defined
    total += arguments[i];
  }
  return total;
};

// ✅ Regular function has 'arguments'
function sumCorrect() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// ✅ Arrow function with rest parameters (preferred modern approach)
const sumModern = (...numbers) => {
  return numbers.reduce((total, num) => total + num, 0);
};

console.log(sumCorrect(1, 2, 3, 4)); // 10
console.log(sumModern(1, 2, 3, 4)); // 10

// 6. Function hoisting
console.log(hoistedFunction()); // Works - function is hoisted

// ✅ Function declaration is hoisted
function hoistedFunction() {
  return 'I am hoisted!';
}

// ❌ Arrow functions are not hoisted (variable hoisting applies)
// console.log(notHoisted()); // ReferenceError or TypeError
const notHoisted = () => 'I am not hoisted!';

// 7. Generator functions
// ❌ Arrow functions cannot be generators
// const generatorWrong = * () => { // Syntax error
//   yield 1;
//   yield 2;
// };

// ✅ Regular generator function
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = numberGenerator();
console.log(generator.next()); // { value: 1, done: false }
    `,
    
    performanceConsiderations: `
// 8. Performance considerations
class EventHandler {
  constructor() {
    this.eventCount = 0;
    
    // ❌ Creates new function instance for each class instance
    this.handleClickArrow = () => {
      this.eventCount++;
      console.log(\`Event \${this.eventCount}\`);
    };
  }
  
  // ✅ Shared method on prototype
  handleClick() {
    this.eventCount++;
    console.log(\`Event \${this.eventCount}\`);
  }
  
  // ✅ Create bound function when needed
  getBoundHandler() {
    return this.handleClick.bind(this);
  }
}

// Arrow function in constructor creates new function for each instance
const handler1 = new EventHandler();
const handler2 = new EventHandler();

console.log(handler1.handleClickArrow === handler2.handleClickArrow); // false - different functions
console.log(handler1.handleClick === handler2.handleClick); // true - same prototype method

// 9. Dynamic function creation
const operations = {
  add: function(a, b) { return a + b; },
  subtract: function(a, b) { return a - b; },
  multiply: function(a, b) { return a * b; },
  
  // ❌ Arrow function makes 'this' usage confusing
  calculate: (operation, a, b) => {
    return this[operation](a, b); // 'this' doesn't refer to operations object
  },
  
  // ✅ Regular function allows proper 'this' usage
  compute: function(operation, a, b) {
    return this[operation](a, b);
  }
};

// operations.calculate('add', 5, 3); // Won't work
console.log(operations.compute('add', 5, 3)); // 8
    `
  }
};

// Best Practices and Use Cases
export const bestPractices = {
  concept: "Best Practices and Use Cases",
  explanation: `
    Guidelines for when to use arrow functions effectively and how to write
    clean, maintainable code with them.
  `,
  
  examples: {
    arrayMethods: `
// ✅ Excellent use cases for arrow functions

// 1. Array methods - where arrow functions shine
const users = [
  { id: 1, name: 'Alice', age: 28, active: true },
  { id: 2, name: 'Bob', age: 32, active: false },
  { id: 3, name: 'Charlie', age: 25, active: true },
  { id: 4, name: 'Diana', age: 30, active: true }
];

// Clean, readable array transformations
const activeUsers = users.filter(user => user.active);
const userNames = users.map(user => user.name);
const averageAge = users.reduce((sum, user) => sum + user.age, 0) / users.length;
const youngActiveUsers = users
  .filter(user => user.active && user.age < 30)
  .map(user => ({ ...user, category: 'young_active' }));

console.log(activeUsers.length); // 3
console.log(userNames); // ['Alice', 'Bob', 'Charlie', 'Diana']
console.log(averageAge); // 28.75

// 2. Functional programming patterns
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const processNumbers = (nums) => 
  nums
    .filter(n => n % 2 === 0)           // Even numbers
    .map(n => n * n)                    // Square them
    .reduce((sum, n) => sum + n, 0);    // Sum the squares

console.log(processNumbers(numbers)); // 220 (4 + 16 + 36 + 64 + 100)

// 3. Higher-order functions
const createMultiplier = (factor) => (value) => value * factor;
const double = createMultiplier(2);
const triple = createMultiplier(3);

const doubledNumbers = numbers.map(double);
const tripledNumbers = numbers.map(triple);

console.log(doubledNumbers); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// 4. Conditional operations
const getDiscountedPrice = (price, isPremium) => 
  isPremium ? price * 0.8 : price * 0.9;

const formatCurrency = (amount) => \`$\${amount.toFixed(2)}\`;

const products = [
  { name: 'Laptop', price: 999.99, premium: true },
  { name: 'Mouse', price: 29.99, premium: false },
  { name: 'Keyboard', price: 79.99, premium: true }
];

const discountedPrices = products.map(product => ({
  ...product,
  discountedPrice: getDiscountedPrice(product.price, product.premium),
  formattedPrice: formatCurrency(getDiscountedPrice(product.price, product.premium))
}));

console.log(discountedPrices);
    `,
    
    eventHandling: `
// 5. Event handling with proper context
class TodoApp {
  constructor() {
    this.todos = [];
    this.filter = 'all';
    this.nextId = 1;
  }
  
  // ✅ Arrow function preserves 'this' for event handlers
  addTodo = (text) => {
    if (!text.trim()) return;
    
    const todo = {
      id: this.nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    this.todos.push(todo);
    this.render();
  }
  
  toggleTodo = (id) => {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.render();
    }
  }
  
  deleteTodo = (id) => {
    this.todos = this.todos.filter(t => t.id !== id);
    this.render();
  }
  
  setFilter = (filter) => {
    this.filter = filter;
    this.render();
  }
  
  // Regular method for internal logic
  getFilteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }
  
  // ✅ Arrow function for rendering logic
  render = () => {
    const filteredTodos = this.getFilteredTodos();
    const completedCount = this.todos.filter(t => t.completed).length;
    const activeCount = this.todos.length - completedCount;
    
    console.log(\`Todos: \${filteredTodos.length} shown, \${activeCount} active, \${completedCount} completed\`);
  }
}

// Usage - arrow functions make event binding clean
const app = new TodoApp();
app.addTodo('Learn JavaScript');
app.addTodo('Build a project');
app.toggleTodo(1);
app.setFilter('active');
    `,
    
    asyncPatterns: `
// 6. Async/await with arrow functions
class DataService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
    this.retryConfig = { maxRetries: 3, delay: 1000 };
  }
  
  // ✅ Arrow function for consistent 'this' binding
  fetchWithRetry = async (endpoint, options = {}) => {
    const url = \`\${this.apiUrl}\${endpoint}\`;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        
        const data = await response.json();
        this.cache.set(endpoint, { data, timestamp: Date.now() });
        return data;
        
      } catch (error) {
        if (attempt === this.retryConfig.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, this.retryConfig.delay * attempt));
      }
    }
  }
  
  // ✅ Arrow function for data processing pipeline
  processUserData = async (userId) => {
    const user = await this.fetchWithRetry(\`/users/\${userId}\`);
    const posts = await this.fetchWithRetry(\`/users/\${userId}/posts\`);
    
    // Process data with arrow functions
    const processedPosts = posts
      .filter(post => post.published)
      .map(post => ({
        ...post,
        excerpt: post.content.substring(0, 150) + '...',
        wordCount: post.content.split(' ').length
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return {
      user: {
        ...user,
        totalPosts: posts.length,
        publishedPosts: processedPosts.length
      },
      posts: processedPosts
    };
  }
  
  // ✅ Batch operations with arrow functions
  batchProcess = async (items, processor, batchSize = 5) => {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item).catch(error => ({ error: error.message, item })))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Usage example
const service = new DataService('https://api.example.com');

// Arrow functions make async chains readable
const loadUserDashboard = async (userId) => {
  try {
    const userData = await service.processUserData(userId);
    
    // Further processing with arrow functions
    const dashboardData = {
      ...userData,
      stats: {
        avgWordsPerPost: userData.posts.reduce((sum, post) => sum + post.wordCount, 0) / userData.posts.length,
        mostRecentPost: userData.posts[0]?.title || 'No posts',
        topCategories: userData.posts
          .map(post => post.category)
          .reduce((acc, category) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {})
      }
    };
    
    return dashboardData;
  } catch (error) {
    console.error('Dashboard load failed:', error.message);
    return null;
  }
};

// loadUserDashboard(123).then(dashboard => console.log(dashboard));
    `,
    
    functionalProgramming: `
// 7. Functional programming utilities
const fp = {
  // ✅ Curry functions with arrow functions
  curry: (fn) => (...args) => 
    args.length >= fn.length 
      ? fn(...args)
      : (...nextArgs) => fp.curry(fn)(...args, ...nextArgs),
  
  // ✅ Compose functions
  compose: (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value),
  pipe: (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value),
  
  // ✅ Common functional utilities
  map: fn => arr => arr.map(fn),
  filter: predicate => arr => arr.filter(predicate),
  reduce: (fn, initial) => arr => arr.reduce(fn, initial),
  
  // ✅ Property access utilities
  prop: key => obj => obj[key],
  path: keys => obj => keys.reduce((current, key) => current?.[key], obj),
  
  // ✅ Predicate functions
  isEven: n => n % 2 === 0,
  isPositive: n => n > 0,
  isEmpty: arr => arr.length === 0,
  hasLength: n => arr => arr.length === n
};

// Usage examples
const add = (a, b, c) => a + b + c;
const curriedAdd = fp.curry(add);
const add5 = curriedAdd(5);
const add5and3 = add5(3);
console.log(add5and3(2)); // 10

// Composition example
const users = [
  { id: 1, name: 'Alice', scores: [85, 92, 78] },
  { id: 2, name: 'Bob', scores: [90, 88, 95] },
  { id: 3, name: 'Charlie', scores: [76, 84, 82] }
];

const getTopPerformers = fp.pipe(
  fp.map(user => ({
    ...user,
    average: user.scores.reduce((sum, score) => sum + score, 0) / user.scores.length
  })),
  fp.filter(user => user.average >= 85),
  fp.map(fp.prop('name'))
);

console.log(getTopPerformers(users)); // ['Alice', 'Bob']
    `
  }
};

// Export all concepts
export default {
  config: arrowFunctionsConfig,
  concepts: {
    basicSyntax,
    lexicalThis,
    whenNotToUse,
    bestPractices
  }
};