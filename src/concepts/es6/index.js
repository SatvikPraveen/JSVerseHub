// File: src/concepts/es6/index.js
// ES6+ Features - Modern JavaScript syntax and capabilities

export const es6Config = {
  title: "ES6+ Modern JavaScript",
  description: "Master modern JavaScript features and best practices",
  difficulty: "intermediate",
  estimatedTime: "45 minutes",
  topics: [
    "Arrow Functions",
    "Destructuring",
    "Template Literals",
    "Spread & Rest Operators",
    "ES Modules",
    "Classes & Inheritance"
  ]
};

// Arrow Functions
export const arrowFunctions = {
  concept: "Arrow Functions",
  explanation: `
    Arrow functions provide a more concise syntax for writing functions
    and have lexical 'this' binding, making them ideal for callbacks.
  `,
  
  examples: {
    basicSyntax: `
// Traditional function
function traditionalAdd(a, b) {
  return a + b;
}

// Arrow function variations
const arrowAdd = (a, b) => a + b;           // Concise, implicit return
const arrowAddBlock = (a, b) => {           // Block body, explicit return
  return a + b;
};
const singleParam = x => x * 2;             // Single param, no parentheses
const noParams = () => "Hello!";            // No params, empty parentheses
const returnObject = (name) => ({ name });  // Return object literal (wrap in parens)

// Using with array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
console.log(sum);     // 15
    `,
    
    lexicalThis: `
// Arrow functions vs regular functions with 'this'

// Regular function - 'this' depends on how it's called
const regularObj = {
  name: "Regular",
  items: [1, 2, 3],
  printItems: function() {
    this.items.forEach(function(item) {
      // 'this' is undefined in strict mode or refers to global object
      console.log(this.name, item); // Error or unexpected behavior
    });
  }
};

// Arrow function - 'this' is lexically bound
const arrowObj = {
  name: "Arrow",
  items: [1, 2, 3],
  printItems: function() {
    this.items.forEach(item => {
      // 'this' refers to arrowObj
      console.log(this.name, item); // "Arrow 1", "Arrow 2", "Arrow 3"
    });
  }
};

// Modern class with arrow functions
class Timer {
  constructor() {
    this.seconds = 0;
  }
  
  start() {
    // Arrow function preserves 'this'
    setInterval(() => {
      this.seconds++;
      console.log(\`Time: \${this.seconds}s\`);
    }, 1000);
  }
}

const timer = new Timer();
timer.start(); // Works correctly
    `
  },
  
  exercises: [
    {
      id: "arrow_conversion",
      question: "Convert this traditional function to arrow function syntax: function double(x) { return x * 2; }",
      solution: "const double = x => x * 2;",
      hint: "Single parameter doesn't need parentheses, single expression has implicit return"
    }
  ]
};

// Destructuring
export const destructuring = {
  concept: "Destructuring",
  explanation: `
    Destructuring allows unpacking values from arrays or properties from objects
    into distinct variables, making code more readable and concise.
  `,
  
  examples: {
    arrayDestructuring: `
// Basic array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second] = numbers;
console.log(first);  // 1
console.log(second); // 2

// Skip elements
const [a, , c] = numbers;
console.log(a, c); // 1, 3

// Rest operator
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values
const [x = 0, y = 0, z = 0] = [1, 2];
console.log(x, y, z); // 1, 2, 0

// Swapping variables
let m = 10, n = 20;
[m, n] = [n, m];
console.log(m, n); // 20, 10

// Nested destructuring
const matrix = [[1, 2], [3, 4]];
const [[a1, a2], [b1, b2]] = matrix;
console.log(a1, a2, b1, b2); // 1, 2, 3, 4
    `,
    
    objectDestructuring: `
// Basic object destructuring
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  country: "USA"
};

const { name, age } = user;
console.log(name, age); // "Alice", 30

// Rename variables
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // "Alice", 30

// Default values
const { name, role = "user", active = true } = user;
console.log(role, active); // "user", true

// Rest properties
const { email, ...rest } = user;
console.log(email); // "alice@example.com"
console.log(rest);  // { name: "Alice", age: 30, country: "USA" }

// Nested object destructuring
const person = {
  name: "Bob",
  address: {
    city: "New York",
    zip: "10001",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }
};

const { 
  name: personName,
  address: { 
    city, 
    coordinates: { lat, lng } 
  }
} = person;

console.log(personName, city, lat, lng); // "Bob", "New York", 40.7128, -74.0060

// Function parameters
function displayUser({ name, age, country = "Unknown" }) {
  console.log(\`\${name} is \${age} years old from \${country}\`);
}

displayUser(user); // "Alice is 30 years old from USA"
    `
  },
  
  exercises: [
    {
      id: "destructuring_practice",
      question: "Destructure this object to get firstName and lastName: const person = { firstName: 'John', lastName: 'Doe', age: 25 };",
      solution: "const { firstName, lastName } = person;",
      hint: "Use curly braces for object destructuring"
    }
  ]
};

// Template Literals
export const templateLiterals = {
  concept: "Template Literals",
  explanation: `
    Template literals use backticks and allow embedded expressions,
    multi-line strings, and string interpolation.
  `,
  
  examples: {
    basic: `
// Traditional string concatenation
const name = "Alice";
const greeting = "Hello, " + name + "!";

// Template literal
const greetingModern = \`Hello, \${name}!\`;

// Multi-line strings
const multiline = \`
  This is a multi-line string.
  No need for \\n or string concatenation.
  It preserves formatting and indentation.
\`;

// Expression interpolation
const a = 5, b = 10;
console.log(\`Sum: \${a + b}\`);                    // "Sum: 15"
console.log(\`Product: \${a * b}\`);                // "Product: 50"
console.log(\`Is even: \${a % 2 === 0}\`);         // "Is even: false"

// Function calls in templates
function formatPrice(price) {
  return \`$\${price.toFixed(2)}\`;
}

const price = 19.5;
console.log(\`Total: \${formatPrice(price)}\`);    // "Total: $19.50"

// Nested templates
const user = { name: "Bob", role: "admin" };
const badge = \`\${user.name} (\${user.role === "admin" ? "👑 Admin" : "👤 User"})\`;
console.log(badge); // "Bob (👑 Admin)"
    `,
    
    advanced: `
// Tagged template literals
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? \`<mark>\${values[i]}</mark>\` : '';
    return result + str + value;
  }, '');
}

const name = "Alice";
const score = 95;
const html = highlight\`Student \${name} scored \${score}%\`;
console.log(html); // "Student <mark>Alice</mark> scored <mark>95</mark>%"

// HTML escaping tag
function escapeHTML(strings, ...values) {
  const escape = str => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  return strings.reduce((result, str, i) => {
    const value = values[i] ? escape(values[i]) : '';
    return result + str + value;
  }, '');
}

const userInput = "<script>alert('xss')</script>";
const safe = escapeHTML\`User input: \${userInput}\`;
console.log(safe); // "User input: &lt;script&gt;alert('xss')&lt;/script&gt;"
    `
  },
  
  exercises: [
    {
      id: "template_literals_practice",
      question: "Create a template literal that outputs 'Hello, [name]! You are [age] years old.' using variables name='John' and age=25",
      solution: "const name = 'John'; const age = 25; const message = \`Hello, \${name}! You are \${age} years old.\`;",
      hint: "Use backticks and \${} for interpolation"
    }
  ]
};

// Spread and Rest Operators
export const spreadRest = {
  concept: "Spread & Rest Operators",
  explanation: `
    The spread operator (...) expands iterables, while the rest operator
    gathers remaining elements into an array.
  `,
  
  examples: {
    spreadOperator: `
// Spread with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array (shallow)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unchanged)
console.log(copy);     // [1, 2, 3, 4]

// Spread in function calls
const numbers = [5, 2, 8, 1, 9];
console.log(Math.max(...numbers)); // 9 (instead of Math.max.apply(null, numbers))

// Spread with objects
const person = { name: "Alice", age: 30 };
const employee = { ...person, role: "developer", salary: 80000 };
console.log(employee); // { name: "Alice", age: 30, role: "developer", salary: 80000 }

// Merging objects
const defaults = { theme: "light", language: "en" };
const userPrefs = { theme: "dark" };
const settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: "dark", language: "en" }

// Adding/updating properties
const user = { id: 1, name: "Bob" };
const updatedUser = { ...user, name: "Bobby", active: true };
console.log(updatedUser); // { id: 1, name: "Bobby", active: true }
    `,
    
    restOperator: `
// Rest in function parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Mix regular params with rest
function greet(greeting, ...names) {
  return \`\${greeting}, \${names.join(' and ')}!\`;
}

console.log(greet("Hello", "Alice", "Bob", "Charlie")); 
// "Hello, Alice and Bob and Charlie!"

// Rest in destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(others); // [3, 4, 5]

// Rest with objects
const { name, age, ...otherInfo } = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  country: "USA"
};

console.log(name, age);    // "Alice", 30
console.log(otherInfo);    // { email: "alice@example.com", country: "USA" }
    `
  },
  
  exercises: [
    {
      id: "spread_rest_practice",
      question: "Write a function that takes any number of arguments and returns their average using rest parameters",
      solution: "const average = (...numbers) => numbers.reduce((sum, n) => sum + n, 0) / numbers.length;",
      hint: "Use ...numbers in parameters, then reduce to sum and divide by length"
    }
  ]
};

// ES Modules (Enhanced)
export const esModules = {
  concept: "ES Modules",
  explanation: `
    ES Modules provide a standardized way to organize and share code across files.
    They support named exports, default exports, dynamic imports, and tree-shaking.
  `,
  
  examples: {
    namedExports: `
// ===== File: mathUtils.js =====
// Named exports - can have multiple per file

// Export at declaration
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
  getResult() {
    return this.result;
  }
}

// Or export at the end
const subtract = (a, b) => a - b;
const divide = (a, b) => a / b;
export { subtract, divide };

// Export with alias
const square = x => x * x;
export { square as sq };

// ===== File: main.js =====
// Importing named exports

// Import specific items
import { add, multiply } from './mathUtils.js';

// Import with alias
import { add as sum, multiply as product } from './mathUtils.js';

// Import all as namespace
import * as math from './mathUtils.js';
console.log(math.add(5, 3));        // 8
console.log(math.PI);               // 3.14159

// Import and re-export
export { add, multiply } from './mathUtils.js';
export { subtract as minus } from './mathUtils.js';
    `,
    
    defaultExports: `
// ===== File: UserService.js =====
// Default export - one per file (typically the main thing)

export default class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.users = [];
  }
  
  async fetchUsers() {
    const response = await fetch(\`\${this.apiUrl}/users\`);
    return await response.json();
  }
  
  getUserById(id) {
    return this.users.find(user => user.id === id);
  }
}

// Alternative: default export function
export default function createUserService(apiUrl) {
  return new UserService(apiUrl);
}

// Alternative: default export object
export default {
  name: 'UserService',
  version: '1.0.0',
  create(apiUrl) {
    return new UserService(apiUrl);
  }
};

// ===== File: app.js =====
// Importing default exports (can name it anything)

import UserService from './UserService.js';
const service = new UserService('/api');

// Mix default and named exports in same file
// File: utils.js
export default function mainFunction() { }
export const helper1 = () => { };
export const helper2 = () => { };

// Import both
import mainFunction, { helper1, helper2 } from './utils.js';
    `,
    
    dynamicImports: `
// Dynamic imports - load modules on demand (returns a Promise)

// Basic dynamic import
async function loadModule() {
  const module = await import('./heavyModule.js');
  module.doSomething();
}

// Conditional loading
async function loadChart(type) {
  if (type === 'bar') {
    const { BarChart } = await import('./charts/BarChart.js');
    return new BarChart();
  } else {
    const { LineChart } = await import('./charts/LineChart.js');
    return new LineChart();
  }
}

// Lazy loading on user action
document.querySelector('#loadButton').addEventListener('click', async () => {
  const { showModal } = await import('./modal.js');
  showModal('Hello!');
});

// Code splitting with webpack/bundlers
async function loadAnalytics() {
  if (userHasConsented()) {
    // This creates a separate bundle chunk
    const analytics = await import(/* webpackChunkName: "analytics" */ './analytics.js');
    analytics.trackPageView();
  }
}

// Error handling
async function safeImport(modulePath) {
  try {
    const module = await import(modulePath);
    return module;
  } catch (error) {
    console.error(\`Failed to load module: \${modulePath}\`, error);
    return null;
  }
}

// Dynamic import with destructuring
const { default: Component, helper } = await import('./component.js');
    `,
    
    modulePatterns: `
// Module patterns and best practices

// ===== Barrel exports (index.js pattern) =====
// File: components/index.js
export { Button } from './Button.js';
export { Input } from './Input.js';
export { Modal } from './Modal.js';
export { default as Form } from './Form.js';

// Now import all from one place
import { Button, Input, Modal, Form } from './components';

// ===== Singleton pattern with modules =====
// File: config.js
class Config {
  constructor() {
    this.settings = {};
  }
  set(key, value) {
    this.settings[key] = value;
  }
  get(key) {
    return this.settings[key];
  }
}

// Export single instance
export default new Config();

// ===== Factory pattern =====
// File: userFactory.js
export function createUser(name, role) {
  return {
    name,
    role,
    permissions: getPermissions(role),
    createdAt: new Date()
  };
}

function getPermissions(role) {
  const perms = {
    admin: ['read', 'write', 'delete'],
    user: ['read'],
    guest: []
  };
  return perms[role] || [];
}

// ===== Namespace pattern =====
// File: utils/index.js
import * as stringUtils from './strings.js';
import * as arrayUtils from './arrays.js';
import * as dateUtils from './dates.js';

export const Utils = {
  string: stringUtils,
  array: arrayUtils,
  date: dateUtils
};

// Usage: import { Utils } from './utils';
// Utils.string.capitalize('hello');

// ===== Module configuration =====
// File: api.js
let apiUrl = 'https://api.example.com';

export function configure(url) {
  apiUrl = url;
}

export async function fetchData(endpoint) {
  const response = await fetch(\`\${apiUrl}\${endpoint}\`);
  return response.json();
}

// Usage:
// import { configure, fetchData } from './api.js';
// configure('https://staging.example.com');
    `
  },
  
  exercises: [
    {
      id: "modules_practice",
      question: "Create a module that exports a greet function (named export) and a default export of a User class",
      solution: `// user.js
export function greet(name) {
  return \`Hello, \${name}!\`;
}

export default class User {
  constructor(name) {
    this.name = name;
  }
}

// Import:
import User, { greet } from './user.js';`,
      hint: "Use 'export function' for named export and 'export default class' for default"
    }
  ]
};

// Classes (brief - already covered in OOP planet)
export const classes = {
  concept: "ES6 Classes",
  explanation: `
    ES6 classes provide a cleaner syntax for creating objects and implementing inheritance,
    though they're syntactic sugar over JavaScript's prototype-based inheritance.
  `,
  
  examples: {
    basicClasses: `
// Class declaration
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
  
  // Getter
  get info() {
    return \`\${this.name} (\${this.age})\`;
  }
  
  // Setter
  set info(value) {
    const [name, age] = value.split(',');
    this.name = name.trim();
    this.age = parseInt(age);
  }
  
  // Static method
  static createAnonymous() {
    return new Person('Anonymous', 0);
  }
}

// Usage
const person = new Person('Alice', 30);
console.log(person.greet());     // "Hello, I'm Alice"
console.log(person.info);        // "Alice (30)"

const anon = Person.createAnonymous();

// Inheritance
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age);
    this.role = role;
  }
  
  greet() {
    return \`\${super.greet()}, I'm a \${this.role}\`;
  }
}

const emp = new Employee('Bob', 25, 'Developer');
console.log(emp.greet()); // "Hello, I'm Bob, I'm a Developer"
    `
  },
  
  exercises: [
    {
      id: "class_practice",
      question: "Create a Rectangle class with width, height properties and an area() method",
      solution: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
}`,
      hint: "Use constructor for properties and regular method for area()"
    }
  ]
};

// Progress tracking
export const progressConfig = {
  totalConcepts: 6,
  conceptsCompleted: 0,
  exercises: {
    total: 6,
    completed: 0
  },
  
  updateProgress(conceptId, exerciseId = null) {
    if (exerciseId) {
      this.exercises.completed++;
    } else {
      this.conceptsCompleted++;
    }
    
    return {
      conceptProgress: (this.conceptsCompleted / this.totalConcepts) * 100,
      exerciseProgress: (this.exercises.completed / this.exercises.total) * 100,
      overallProgress: ((this.conceptsCompleted + this.exercises.completed) / (this.totalConcepts + this.exercises.total)) * 100
    };
  }
};

// Export all concepts
export default {
  config: es6Config,
  concepts: {
    arrowFunctions,
    destructuring,
    templateLiterals,
    spreadRest,
    esModules,
    classes
  },
  progress: progressConfig
};
