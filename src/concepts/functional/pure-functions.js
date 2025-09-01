// File: src/concepts/functional/pure-functions.js
// Functional Programming - Pure Functions in JavaScript

export const pureFunctionsContent = {
  title: "Pure Functions",
  description: "Master pure functions and immutable programming patterns in JavaScript",
  
  theory: {
    introduction: `
      Pure functions are the foundation of functional programming. They always return the same output 
      for the same input and have no side effects. This makes code more predictable, testable, and easier to reason about.
      Understanding pure functions is essential for writing maintainable and bug-free JavaScript applications.
    `,
    
    concepts: [
      {
        name: "What Makes a Function Pure",
        explanation: "Pure functions have two key characteristics: deterministic output and no side effects",
        example: `
// Pure function examples
function add(a, b) {
  return a + b; // Always returns same result for same inputs
}

function multiply(x, y) {
  return x * y; // No side effects, just returns a value
}

function getFullName(firstName, lastName) {
  return \`\${firstName} \${lastName}\`; // Predictable output
}

// Impure function examples
let counter = 0;
function impureIncrement() {
  counter++; // Side effect: modifies external state
  return counter; // Output depends on external state
}

function impureRandom() {
  return Math.random(); // Different output each time
}

function impureLog(message) {
  console.log(message); // Side effect: I/O operation
  return message;
}

const currentDate = new Date();
function impureGreeting(name) {
  return \`Hello \${name}, today is \${currentDate.toDateString()}\`; // Depends on external state
}

// Pure alternatives
function pureIncrement(currentValue) {
  return currentValue + 1; // Takes input, returns new value
}

function pureGreeting(name, date) {
  return \`Hello \${name}, today is \${date.toDateString()}\`; // All dependencies as parameters
}

function pureLogger(message, logFunction) {
  logFunction(message); // Dependency injection
  return message;
}

// Usage
console.log(add(2, 3)); // Always 5
console.log(multiply(4, 5)); // Always 20
console.log(getFullName("John", "Doe")); // Always "John Doe"

// Pure increment
let value = 5;
const newValue = pureIncrement(value); // value stays 5, newValue is 6
console.log(value, newValue); // 5, 6
        `
      },
      
      {
        name: "Immutability Patterns",
        explanation: "Working with data without mutating original values",
        example: `
// Immutable array operations
const numbers = [1, 2, 3, 4, 5];

// Pure functions for array manipulation
function addToArray(array, item) {
  return [...array, item]; // Create new array instead of modifying
}

function removeFromArray(array, index) {
  return array.filter((_, i) => i !== index);
}

function updateArrayItem(array, index, newValue) {
  return array.map((item, i) => i === index ? newValue : item);
}

function insertAtIndex(array, index, item) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

// Usage
const originalNumbers = [1, 2, 3];
const withAdded = addToArray(originalNumbers, 4); // [1, 2, 3, 4]
const withRemoved = removeFromArray(originalNumbers, 1); // [1, 3]
const withUpdated = updateArrayItem(originalNumbers, 1, 10); // [1, 10, 3]

console.log("Original:", originalNumbers); // Still [1, 2, 3]
console.log("With added:", withAdded);
console.log("With removed:", withRemoved);
console.log("With updated:", withUpdated);

// Immutable object operations
const person = {
  name: "Alice",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York"
  }
};

function updatePersonAge(person, newAge) {
  return {
    ...person,
    age: newAge
  };
}

function updatePersonAddress(person, newAddress) {
  return {
    ...person,
    address: {
      ...person.address,
      ...newAddress
    }
  };
}

function addPersonProperty(person, key, value) {
  return {
    ...person,
    [key]: value
  };
}

// Usage
const olderPerson = updatePersonAge(person, 31);
const movedPerson = updatePersonAddress(person, { city: "Boston" });
const personWithEmail = addPersonProperty(person, "email", "alice@example.com");

console.log("Original person:", person);
console.log("Older person:", olderPerson);
console.log("Moved person:", movedPerson);
        `
      },
      
      {
        name: "Function Composition",
        explanation: "Combining pure functions to create more complex behavior",
        example: `
// Basic pure functions
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
const removeSpaces = str => str.replace(/\s+/g, '');
const addPrefix = prefix => str => \`\${prefix}\${str}\`;

// Composition helper
function compose(...functions) {
  return function(value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

function pipe(...functions) {
  return function(value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

// Create composed functions
const cleanAndCapitalize = compose(
  capitalizeFirstLetter,
  toLowerCase,
  trim
);

const processUsername = pipe(
  trim,
  toLowerCase,
  removeSpaces,
  addPrefix('@')
);

// Usage
console.log(cleanAndCapitalize("  HELLO WORLD  ")); // "Hello world"
console.log(processUsername("  John Doe  ")); // "@johndoe"

// Math operations composition
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const square = x => x * x;

const complexCalculation = compose(
  square,    // 4. Square the result
  add5,      // 3. Add 5
  multiply3, // 2. Multiply by 3
  add5       // 1. Add 5 (executed first due to reduceRight)
);

console.log(complexCalculation(2)); // ((2 + 5) * 3 + 5)² = (7 * 3 + 5)² = 26² = 676

// Data transformation pipeline
const users = [
  { name: "  Alice Johnson  ", age: 25, active: true },
  { name: "BOB SMITH", age: 30, active: false },
  { name: "charlie brown", age: 35, active: true }
];

const normalizeUserName = user => ({
  ...user,
  name: pipe(trim, toLowerCase, capitalizeFirstLetter)(user.name)
});

const filterActiveUsers = users => users.filter(user => user.active);
const sortByAge = users => [...users].sort((a, b) => a.age - b.age);
const addFormattedAge = user => ({
  ...user,
  ageLabel: \`\${user.age} years old\`
});

const processUsers = pipe(
  users => users.map(normalizeUserName),
  filterActiveUsers,
  sortByAge,
  users => users.map(addFormattedAge)
);

console.log("Processed users:", processUsers(users));
        `
      },
      
      {
        name: "Avoiding Side Effects",
        explanation: "Strategies to eliminate side effects and maintain purity",
        example: `
// Bad: Functions with side effects
let globalCounter = 0;
let logMessages = [];

function badIncrement() {
  globalCounter++; // Mutates global state
  logMessages.push(\`Counter: \${globalCounter}\`); // Side effect
  return globalCounter;
}

function badProcessData(data) {
  data.processed = true; // Mutates input
  console.log("Data processed"); // Side effect
  return data;
}

// Good: Pure functions with dependency injection
function pureIncrement(currentValue) {
  return currentValue + 1;
}

function pureIncrementWithLog(currentValue, logger) {
  const newValue = currentValue + 1;
  logger(\`Counter: \${newValue}\`);
  return newValue;
}

function pureProcessData(data) {
  return {
    ...data,
    processed: true,
    processedAt: new Date().toISOString()
  };
}

// State management with pure functions
function createCounter(initialValue = 0) {
  return {
    value: initialValue,
    increment: function() {
      return createCounter(this.value + 1);
    },
    decrement: function() {
      return createCounter(this.value - 1);
    },
    add: function(amount) {
      return createCounter(this.value + amount);
    },
    toString: function() {
      return \`Counter: \${this.value}\`;
    }
  };
}

// Usage of pure counter
let counter1 = createCounter(5);
let counter2 = counter1.increment().increment().add(3);
let counter3 = counter2.decrement();

console.log(counter1.toString()); // "Counter: 5"
console.log(counter2.toString()); // "Counter: 10"
console.log(counter3.toString()); // "Counter: 9"

// Pure function for API calls (with external dependency)
function createApiClient(fetch) {
  return {
    get: (url) => fetch(url).then(response => response.json()),
    post: (url, data) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(response => response.json())
  };
}

// Error handling with pure functions
function divide(a, b) {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, value: a / b };
}

function safeOperation(operation, ...args) {
  try {
    const result = operation(...args);
    return { success: true, value: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Usage
const divisionResult = divide(10, 2);
if (divisionResult.success) {
  console.log("Result:", divisionResult.value);
} else {
  console.log("Error:", divisionResult.error);
}
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Shopping Cart System",
      description: "A complete shopping cart implementation using pure functions",
      code: `
// Pure functions for shopping cart operations
function createCartItem(product, quantity = 1) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    total: product.price * quantity
  };
}

function addItemToCart(cart, product, quantity = 1) {
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    return cart.map((item, index) => 
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
        : item
    );
  }
  
  return [...cart, createCartItem(product, quantity)];
}

function removeItemFromCart(cart, productId) {
  return cart.filter(item => item.id !== productId);
}

function updateItemQuantity(cart, productId, newQuantity) {
  if (newQuantity <= 0) {
    return removeItemFromCart(cart, productId);
  }
  
  return cart.map(item => 
    item.id === productId
      ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
      : item
  );
}

function calculateCartTotal(cart) {
  return cart.reduce((total, item) => total + item.total, 0);
}

function calculateCartSummary(cart) {
  const subtotal = calculateCartTotal(cart);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  
  return {
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

function applyDiscount(cart, discountCode) {
  const discounts = {
    'SAVE10': { type: 'percentage', value: 0.1, minAmount: 25 },
    'SAVE5': { type: 'fixed', value: 5, minAmount: 20 },
    'FREESHIP': { type: 'shipping', value: 0, minAmount: 30 }
  };
  
  const discount = discounts[discountCode];
  if (!discount) {
    return { cart, discount: null, error: "Invalid discount code" };
  }
  
  const subtotal = calculateCartTotal(cart);
  if (subtotal < discount.minAmount) {
    return { 
      cart, 
      discount: null, 
      error: \`Minimum order of $\${discount.minAmount} required for this discount\`
    };
  }
  
  return { cart, discount, error: null };
}

function clearCart() {
  return [];
}

// Helper functions for cart operations
function findItemInCart(cart, productId) {
  return cart.find(item => item.id === productId);
}

function isItemInCart(cart, productId) {
  return cart.some(item => item.id === productId);
}

function getCartItemsCount(cart) {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Usage example
const products = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Mouse", price: 29.99 },
  { id: 3, name: "Keyboard", price: 79.99 }
];

let cart = [];

// Add items to cart
cart = addItemToCart(cart, products[0], 1); // Add laptop
cart = addItemToCart(cart, products[1], 2); // Add 2 mice
cart = addItemToCart(cart, products[2], 1); // Add keyboard

console.log("Cart items:", cart);
console.log("Cart summary:", calculateCartSummary(cart));

// Update quantity
cart = updateItemQuantity(cart, 2, 1); // Change mouse quantity to 1

// Apply discount
const discountResult = applyDiscount(cart, 'SAVE10');
if (!discountResult.error) {
  console.log("Discount applied:", discountResult.discount);
} else {
  console.log("Discount error:", discountResult.error);
}

console.log("Final cart:", cart);
console.log("Final summary:", calculateCartSummary(cart));
      `
    },
    
    {
      title: "Data Validation System",
      description: "Pure functions for validating and sanitizing user input",
      code: `
// Basic validation functions
const isString = value => typeof value === 'string';
const isNumber = value => typeof value === 'number' && !isNaN(value);
const isEmail = email => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
const isPhone = phone => /^\\d{10}$/.test(phone.replace(/[^\\d]/g, ''));
const isDate = date => date instanceof Date && !isNaN(date);

// Length validators
const minLength = min => str => isString(str) && str.length >= min;
const maxLength = max => str => isString(str) && str.length <= max;
const exactLength = len => str => isString(str) && str.length === len;

// Number validators
const minValue = min => num => isNumber(num) && num >= min;
const maxValue = max => num => isNumber(num) && num <= max;
const inRange = (min, max) => num => isNumber(num) && num >= min && num <= max;

// Custom validators
const isStrongPassword = password => {
  if (!isString(password) || password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpper && hasLower && hasDigit && hasSpecial;
};

const isValidAge = age => isNumber(age) && age >= 0 && age <= 120;

const isValidUsername = username => 
  isString(username) && 
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

// Sanitization functions
const trim = str => isString(str) ? str.trim() : str;
const toLowerCase = str => isString(str) ? str.toLowerCase() : str;
const toUpperCase = str => isString(str) ? str.toUpperCase() : str;
const removeSpaces = str => isString(str) ? str.replace(/\\s+/g, '') : str;
const normalizePhone = phone => isString(phone) ? phone.replace(/[^\\d]/g, '') : phone;

// Validation result helpers
function createValidationResult(isValid, value, errors = []) {
  return { isValid, value, errors };
}

function addError(result, error) {
  return {
    ...result,
    isValid: false,
    errors: [...result.errors, error]
  };
}

// Field validation function
function validateField(value, rules) {
  let result = createValidationResult(true, value);
  
  for (const rule of rules) {
    if (!rule.validator(value)) {
      result = addError(result, rule.message);
    }
  }
  
  return result;
}

// Form validation
function validateForm(data, schema) {
  const results = {};
  let isFormValid = true;
  
  for (const [fieldName, rules] of Object.entries(schema)) {
    const fieldValue = data[fieldName];
    const fieldResult = validateField(fieldValue, rules);
    results[fieldName] = fieldResult;
    
    if (!fieldResult.isValid) {
      isFormValid = false;
    }
  }
  
  return {
    isValid: isFormValid,
    fields: results,
    errors: Object.values(results)
      .filter(result => !result.isValid)
      .flatMap(result => result.errors)
  };
}

// Sanitization pipeline
function sanitizeField(value, sanitizers) {
  return sanitizers.reduce((sanitizedValue, sanitizer) => sanitizer(sanitizedValue), value);
}

function sanitizeForm(data, sanitizationSchema) {
  const sanitizedData = {};
  
  for (const [fieldName, sanitizers] of Object.entries(sanitizationSchema)) {
    sanitizedData[fieldName] = sanitizeField(data[fieldName], sanitizers);
  }
  
  return sanitizedData;
}

// Usage example
const userRegistrationSchema = {
  username: [
    { validator: isString, message: "Username must be a string" },
    { validator: minLength(3), message: "Username must be at least 3 characters" },
    { validator: maxLength(20), message: "Username must be at most 20 characters" },
    { validator: isValidUsername, message: "Username can only contain letters, numbers, and underscores" }
  ],
  email: [
    { validator: isString, message: "Email must be a string" },
    { validator: isEmail, message: "Please enter a valid email address" }
  ],
  password: [
    { validator: isString, message: "Password must be a string" },
    { validator: isStrongPassword, message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" }
  ],
  age: [
    { validator: isNumber, message: "Age must be a number" },
    { validator: isValidAge, message: "Age must be between 0 and 120" }
  ]
};

const sanitizationSchema = {
  username: [trim, toLowerCase],
  email: [trim, toLowerCase],
  password: [trim],
  age: [(value) => Number(value)]
};

// Test data
const userData = {
  username: "  JohnDoe123  ",
  email: "  JOHN@EXAMPLE.COM  ",
  password: "MyStrongPass123!",
  age: "25"
};

// Sanitize first, then validate
const sanitizedData = sanitizeForm(userData, sanitizationSchema);
const validationResult = validateForm(sanitizedData, userRegistrationSchema);

console.log("Original data:", userData);
console.log("Sanitized data:", sanitizedData);
console.log("Validation result:", validationResult);

if (validationResult.isValid) {
  console.log("Form is valid! Ready to submit.");
} else {
  console.log("Form has errors:", validationResult.errors);
}
      `
    }
  ],
  
  exercises: [
    {
      id: "pure-basic",
      title: "Temperature Converter",
      difficulty: "easy",
      prompt: "Create pure functions to convert between Celsius, Fahrenheit, and Kelvin temperatures.",
      solution: `
// Pure temperature conversion functions
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function fahrenheitToKelvin(fahrenheit) {
  return celsiusToKelvin(fahrenheitToCelsius(fahrenheit));
}

function kelvinToFahrenheit(kelvin) {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin));
}

// Helper function for rounding
function roundTo(decimals) {
  return function(number) {
    return Number(number.toFixed(decimals));
  };
}

const roundTo2 = roundTo(2);

// Complete conversion function
function convertTemperature(value, fromUnit, toUnit) {
  const conversions = {
    'celsius-fahrenheit': celsiusToFahrenheit,
    'fahrenheit-celsius': fahrenheitToCelsius,
    'celsius-kelvin': celsiusToKelvin,
    'kelvin-celsius': kelvinToCelsius,
    'fahrenheit-kelvin': fahrenheitToKelvin,
    'kelvin-fahrenheit': kelvinToFahrenheit
  };
  
  const key = \`\${fromUnit}-\${toUnit}\`;
  const converter = conversions[key];
  
  if (!converter) {
    return { success: false, error: "Invalid conversion" };
  }
  
  return { 
    success: true, 
    value: roundTo2(converter(value)),
    from: \`\${value}°\${fromUnit.charAt(0).toUpperCase()}\`,
    to: \`\${roundTo2(converter(value))}°\${toUnit.charAt(0).toUpperCase()}\`
  };
}
      `
    },
    
    {
      id: "pure-intermediate",
      title: "Array Processing Pipeline",
      difficulty: "medium",
      prompt: "Create pure functions to process an array of student objects with filtering, sorting, and transformation operations.",
      solution: `
// Pure functions for student data processing
function filterStudentsByGrade(students, minGrade) {
  return students.filter(student => student.grade >= minGrade);
}

function filterStudentsByAge(students, minAge, maxAge) {
  return students.filter(student => student.age >= minAge && student.age <= maxAge);
}

function sortStudentsByGrade(students, ascending = true) {
  return [...students].sort((a, b) => 
    ascending ? a.grade - b.grade : b.grade - a.grade
  );
}

function sortStudentsByName(students, ascending = true) {
  return [...students].sort((a, b) => 
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}

function addGradeLetters(students) {
  return students.map(student => ({
    ...student,
    gradeLetter: getGradeLetter(student.grade)
  }));
}

function getGradeLetter(grade) {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
}

function calculateClassStatistics(students) {
  if (students.length === 0) {
    return { average: 0, highest: 0, lowest: 0, passingCount: 0 };
  }
  
  const grades = students.map(student => student.grade);
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  const average = sum / grades.length;
  const highest = Math.max(...grades);
  const lowest = Math.min(...grades);
  const passingCount = students.filter(student => student.grade >= 60).length;
  
  return {
    average: Number(average.toFixed(2)),
    highest,
    lowest,
    passingCount,
    totalStudents: students.length
  };
}

function groupStudentsByGradeLetter(students) {
  return students.reduce((groups, student) => {
    const gradeLetter = getGradeLetter(student.grade);
    if (!groups[gradeLetter]) {
      groups[gradeLetter] = [];
    }
    groups[gradeLetter].push(student);
    return groups;
  }, {});
}

// Composition functions
function processStudents(students, filters = {}) {
  let processed = [...students];
  
  if (filters.minGrade) {
    processed = filterStudentsByGrade(processed, filters.minGrade);
  }
  
  if (filters.minAge && filters.maxAge) {
    processed = filterStudentsByAge(processed, filters.minAge, filters.maxAge);
  }
  
  if (filters.sortBy === 'grade') {
    processed = sortStudentsByGrade(processed, filters.ascending);
  } else if (filters.sortBy === 'name') {
    processed = sortStudentsByName(processed, filters.ascending);
  }
  
  if (filters.addGradeLetters) {
    processed = addGradeLetters(processed);
  }
  
  return processed;
}
      `
    }
  ],
  
  quiz: [
    {
      question: "What makes a function 'pure'?",
      options: [
        "It uses only primitive data types",
        "It returns the same output for the same input and has no side effects",
        "It doesn't use any variables",
        "It only uses built-in JavaScript functions"
      ],
      correct: 1,
      explanation: "A pure function always returns the same output for the same input and produces no side effects (doesn't modify external state or perform I/O operations)."
    },
    
    {
      question: "Which of these is a side effect?",
      options: [
        "Returning a calculated value",
        "Using function parameters",
        "Modifying a global variable",
        "Creating a local variable"
      ],
      correct: 2,
      explanation: "Modifying a global variable is a side effect because it changes state outside the function's scope."
    },
    
    {
      question: "What is the best way to modify an array in a pure function?",
      options: [
        "Use push() to add elements",
        "Use splice() to remove elements",
        "Use the spread operator to create a new array",
        "Modify the array directly with assignment"
      ],
      correct: 2,
      explanation: "Pure functions should not mutate their inputs. Using the spread operator creates a new array without modifying the original."
    }
  ]
};

export default pureFunctionsContent;