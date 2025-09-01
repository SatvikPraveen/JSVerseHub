// File: src/concepts/basics/index.js
// JavaScript Basics - Core concepts and fundamentals

export const basicsConfig = {
  title: "JavaScript Basics",
  description: "Master the fundamental building blocks of JavaScript",
  difficulty: "beginner",
  estimatedTime: "30 minutes",
  topics: [
    "Variables and Data Types",
    "Operators",
    "Control Flow",
    "Functions",
    "Scope and Hoisting"
  ]
};

// Variables and Data Types
export const variablesAndTypes = {
  concept: "Variables and Data Types",
  explanation: `
    Variables are containers for storing data values. JavaScript has several data types:
    - Primitive: string, number, boolean, undefined, null, symbol, bigint
    - Non-primitive: object, array, function
  `,
  
  examples: {
    variables: `
// Variable declarations
let message = "Hello, World!";        // String
const age = 25;                       // Number
var isActive = true;                  // Boolean
let data;                            // Undefined
let empty = null;                    // Null

// Dynamic typing
let value = 42;          // Number
value = "Now a string";  // String
value = true;           // Boolean

console.log(typeof value); // "boolean"
    `,
    
    dataTypes: `
// Primitive types
const name = "Alice";                    // String
const score = 95.5;                      // Number
const passed = true;                     // Boolean
const notAssigned = undefined;           // Undefined
const intentionallyEmpty = null;         // Null
const uniqueId = Symbol('id');          // Symbol
const bigNumber = 123456789012345678901234567890n; // BigInt

// Non-primitive types
const person = { name: "Bob", age: 30 };     // Object
const colors = ["red", "green", "blue"];    // Array
const greet = function(name) { return \`Hello, \${name}!\`; }; // Function

// Type checking
console.log(typeof name);        // "string"
console.log(typeof score);       // "number"
console.log(typeof passed);      // "boolean"
console.log(typeof person);      // "object"
console.log(Array.isArray(colors)); // true
    `
  },
  
  exercises: [
    {
      id: "var_declaration",
      question: "Declare three variables: userName (string), userAge (number), and isLoggedIn (boolean)",
      solution: `let userName = "JohnDoe";\nconst userAge = 28;\nlet isLoggedIn = false;`,
      hint: "Use let for variables that might change, const for constants"
    }
  ]
};

// Operators
export const operators = {
  concept: "Operators",
  explanation: `
    Operators are symbols that perform operations on operands.
    JavaScript has arithmetic, assignment, comparison, logical, and more.
  `,
  
  examples: {
    arithmetic: `
// Arithmetic operators
let a = 10, b = 3;

console.log(a + b);  // Addition: 13
console.log(a - b);  // Subtraction: 7
console.log(a * b);  // Multiplication: 30
console.log(a / b);  // Division: 3.333...
console.log(a % b);  // Modulus: 1
console.log(a ** b); // Exponentiation: 1000

// Increment/Decrement
let count = 5;
console.log(++count); // Pre-increment: 6
console.log(count++); // Post-increment: 6, then count becomes 7
console.log(--count); // Pre-decrement: 6
console.log(count--); // Post-decrement: 6, then count becomes 5
    `,
    
    comparison: `
// Comparison operators
let x = 5, y = "5";

console.log(x == y);   // Equality (type coercion): true
console.log(x === y);  // Strict equality: false
console.log(x != y);   // Inequality: false
console.log(x !== y);  // Strict inequality: true
console.log(x > 3);    // Greater than: true
console.log(x < 10);   // Less than: true
console.log(x >= 5);   // Greater than or equal: true
console.log(x <= 4);   // Less than or equal: false
    `,
    
    logical: `
// Logical operators
let p = true, q = false;

console.log(p && q);  // AND: false
console.log(p || q);  // OR: true
console.log(!p);      // NOT: false

// Short-circuit evaluation
let name = "" || "Anonymous";  // "Anonymous"
let user = { name: "Alice" };
let userName = user && user.name; // "Alice"

// Nullish coalescing
let config = null;
let defaultConfig = config ?? { theme: "dark" }; // { theme: "dark" }
    `
  },
  
  exercises: [
    {
      id: "operator_usage",
      question: "Calculate the area of a circle with radius 5, then check if it's greater than 70",
      solution: `const radius = 5;\nconst area = Math.PI * radius ** 2;\nconst isLarge = area > 70;\nconsole.log(isLarge);`,
      hint: "Use Math.PI for π and ** for exponentiation"
    }
  ]
};

// Control Flow
export const controlFlow = {
  concept: "Control Flow",
  explanation: `
    Control flow statements determine the order of execution in your program.
    Includes conditionals (if/else, switch) and loops (for, while).
  `,
  
  examples: {
    conditionals: `
// If-else statements
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}

// Ternary operator
const status = score >= 60 ? "Pass" : "Fail";
console.log(status);

// Switch statement
const day = "Monday";
switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;
  case "Friday":
    console.log("TGIF!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Midweek");
}
    `,
    
    loops: `
// For loop
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`);
}

// For...of loop (for arrays)
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}

// For...in loop (for objects)
const person = { name: "Alice", age: 30, city: "NYC" };
for (const key in person) {
  console.log(\`\${key}: \${person[key]}\`);
}

// While loop
let count = 0;
while (count < 3) {
  console.log(\`Count: \${count}\`);
  count++;
}

// Do-while loop
let num = 0;
do {
  console.log(\`Number: \${num}\`);
  num++;
} while (num < 3);
    `
  },
  
  exercises: [
    {
      id: "fizzbuzz",
      question: "Write a FizzBuzz program for numbers 1-15",
      solution: `for (let i = 1; i <= 15; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}`,
      hint: "Check divisibility by 15 first, then 3, then 5"
    }
  ]
};

// Functions
export const functions = {
  concept: "Functions",
  explanation: `
    Functions are reusable blocks of code that perform specific tasks.
    They can accept parameters and return values.
  `,
  
  examples: {
    declaration: `
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Function expression
const farewell = function(name) {
  return \`Goodbye, \${name}!\`;
};

// Arrow function
const welcome = (name) => \`Welcome, \${name}!\`;

// Arrow function with multiple parameters
const add = (a, b) => a + b;

// Arrow function with block body
const calculate = (x, y) => {
  const sum = x + y;
  const product = x * y;
  return { sum, product };
};

// Usage
console.log(greet("Alice"));        // "Hello, Alice!"
console.log(farewell("Bob"));       // "Goodbye, Bob!"
console.log(welcome("Charlie"));    // "Welcome, Charlie!"
console.log(add(5, 3));            // 8
console.log(calculate(4, 6));      // { sum: 10, product: 24 }
    `,
    
    parameters: `
// Default parameters
function createUser(name, role = "user", active = true) {
  return { name, role, active };
}

console.log(createUser("Alice"));                    // { name: "Alice", role: "user", active: true }
console.log(createUser("Bob", "admin"));            // { name: "Bob", role: "admin", active: true }
console.log(createUser("Charlie", "moderator", false)); // { name: "Charlie", role: "moderator", active: false }

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Destructuring parameters
function displayUser({ name, age, city = "Unknown" }) {
  console.log(\`\${name} is \${age} years old and lives in \${city}\`);
}

const user = { name: "Diana", age: 28, city: "Paris" };
displayUser(user); // "Diana is 28 years old and lives in Paris"
    `
  },
  
  exercises: [
    {
      id: "function_creation",
      question: "Create a function that calculates the factorial of a number",
      solution: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\n// Or iterative version:\nfunction factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}`,
      hint: "Think about base case (n <= 1) and recursive case"
    }
  ]
};

// Scope and Hoisting
export const scopeAndHoisting = {
  concept: "Scope and Hoisting",
  explanation: `
    Scope determines where variables can be accessed in your code.
    Hoisting moves variable and function declarations to the top of their scope.
  `,
  
  examples: {
    scope: `
// Global scope
const globalVar = "I'm global";

function outerFunction() {
  // Function scope
  const outerVar = "I'm in outer function";
  
  function innerFunction() {
    // Inner function scope
    const innerVar = "I'm in inner function";
    
    console.log(globalVar); // Accessible
    console.log(outerVar);  // Accessible
    console.log(innerVar);  // Accessible
  }
  
  innerFunction();
  console.log(globalVar); // Accessible
  console.log(outerVar);  // Accessible
  // console.log(innerVar); // Error: not accessible
}

outerFunction();

// Block scope (let and const)
if (true) {
  let blockScoped = "I'm block scoped";
  const alsoBlockScoped = "Me too";
  var functionScoped = "I'm function scoped";
}

// console.log(blockScoped);     // Error: not accessible
// console.log(alsoBlockScoped); // Error: not accessible
console.log(functionScoped);     // Accessible (function scoped)
    `,
    
    hoisting: `
// Variable hoisting
console.log(hoistedVar); // undefined (not error)
var hoistedVar = "I'm hoisted";

// Equivalent to:
// var hoistedVar; // undefined
// console.log(hoistedVar);
// hoistedVar = "I'm hoisted";

// let and const are hoisted but in temporal dead zone
console.log(letVar); // ReferenceError
let letVar = "I'm let";

console.log(constVar); // ReferenceError
const constVar = "I'm const";

// Function hoisting
console.log(hoistedFunction()); // "I'm hoisted!" - works!

function hoistedFunction() {
  return "I'm hoisted!";
}

// Function expressions are not hoisted
console.log(notHoisted()); // TypeError: notHoisted is not a function

var notHoisted = function() {
  return "I'm not hoisted";
};
    `
  },
  
  exercises: [
    {
      id: "scope_challenge",
      question: "Predict the output of the following code and explain why",
      code: `
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
      `,
      solution: `// Output: 3, 3, 3\n// Reason: var is function-scoped, so all setTimeout callbacks reference the same variable i\n// Fix with let: for (let i = 0; i < 3; i++) {...} would output 0, 1, 2`,
      hint: "Consider the difference between var and let in loops"
    }
  ]
};

// Interactive exercises
export const interactiveExercises = [
  {
    id: "variable_playground",
    title: "Variable Playground",
    description: "Experiment with different variable declarations and types",
    template: `
// Try declaring variables with different types
let myString = "";
const myNumber = 0;
var myBoolean = false;

// Your code here
    `,
    tests: [
      {
        description: "Should declare a string variable",
        check: (code) => code.includes('let') || code.includes('const') || code.includes('var')
      }
    ]
  },
  
  {
    id: "function_builder",
    title: "Function Builder",
    description: "Create functions with different syntaxes",
    template: `
// Create a function that takes two numbers and returns their sum
// Try different function syntaxes: declaration, expression, arrow

// Your code here
    `,
    tests: [
      {
        description: "Should create a function that adds two numbers",
        check: (code, testFn) => {
          try {
            return testFn(2, 3) === 5;
          } catch {
            return false;
          }
        }
      }
    ]
  }
];

// Progress tracking
export const progressConfig = {
  totalConcepts: 5,
  conceptsCompleted: 0,
  exercises: {
    total: 4,
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
  config: basicsConfig,
  concepts: {
    variablesAndTypes,
    operators,
    controlFlow,
    functions,
    scopeAndHoisting
  },
  exercises: interactiveExercises,
  progress: progressConfig
};