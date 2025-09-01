// File: src/concepts/basics/exercises.js
// Interactive exercises for JavaScript Basics

export const exerciseConfig = {
  category: "JavaScript Basics",
  totalExercises: 12,
  difficulty: "beginner",
  estimatedTime: "45 minutes"
};

// Exercise 1: Variable Declaration and Types
export const exercise1 = {
  id: "basics_variables",
  title: "Variables and Data Types",
  difficulty: "easy",
  description: "Practice declaring variables and understanding data types",
  
  instructions: `
    Create variables for a user profile with the following information:
    - firstName (string): "John"
    - lastName (string): "Doe" 
    - age (number): 28
    - isEmployed (boolean): true
    - salary (number): null (not set yet)
    
    Then log each variable and its type to the console.
  `,
  
  starterCode: `
// Declare your variables here
let firstName = 
const lastName = 
var age = 
let isEmployed = 
let salary = 

// Log variables and their types
console.log('firstName:', , 'type:', );
console.log('lastName:', , 'type:', );
console.log('age:', , 'type:', );
console.log('isEmployed:', , 'type:', );
console.log('salary:', , 'type:', );
  `,
  
  solution: `
// Declare your variables here
let firstName = "John";
const lastName = "Doe";
var age = 28;
let isEmployed = true;
let salary = null;

// Log variables and their types
console.log('firstName:', firstName, 'type:', typeof firstName);
console.log('lastName:', lastName, 'type:', typeof lastName);
console.log('age:', age, 'type:', typeof age);
console.log('isEmployed:', isEmployed, 'type:', typeof isEmployed);
console.log('salary:', salary, 'type:', typeof salary);
  `,
  
  tests: [
    {
      description: "Should declare firstName as a string",
      test: (code) => code.includes('firstName') && code.includes('"John"')
    },
    {
      description: "Should declare lastName as a constant",
      test: (code) => code.includes('const lastName')
    },
    {
      description: "Should use typeof operator",
      test: (code) => code.includes('typeof')
    }
  ],
  
  hints: [
    "Use let for variables that might change",
    "Use const for values that won't change",
    "typeof operator returns the type as a string"
  ]
};

// Exercise 2: Arithmetic Operations
export const exercise2 = {
  id: "basics_operators",
  title: "Arithmetic Operations",
  difficulty: "easy",
  description: "Perform calculations using various operators",
  
  instructions: `
    Create a simple calculator that:
    1. Takes two numbers (a = 15, b = 4)
    2. Performs all arithmetic operations
    3. Stores results in appropriately named variables
    4. Logs the results in a formatted way
  `,
  
  starterCode: `
const a = 15;
const b = 4;

// Perform operations
const sum = 
const difference = 
const product = 
const quotient = 
const remainder = 
const power = 

// Log results
console.log(\`\${a} + \${b} = \${sum}\`);
// Add more console.log statements for other operations
  `,
  
  solution: `
const a = 15;
const b = 4;

// Perform operations
const sum = a + b;
const difference = a - b;
const product = a * b;
const quotient = a / b;
const remainder = a % b;
const power = a ** b;

// Log results
console.log(\`\${a} + \${b} = \${sum}\`);
console.log(\`\${a} - \${b} = \${difference}\`);
console.log(\`\${a} * \${b} = \${product}\`);
console.log(\`\${a} / \${b} = \${quotient}\`);
console.log(\`\${a} % \${b} = \${remainder}\`);
console.log(\`\${a} ** \${b} = \${power}\`);
  `,
  
  tests: [
    {
      description: "Should calculate sum correctly",
      test: (code, results) => results && results.sum === 19
    },
    {
      description: "Should use exponentiation operator",
      test: (code) => code.includes('**')
    },
    {
      description: "Should use template literals for output",
      test: (code) => code.includes('`') && code.includes('${')
    }
  ],
  
  hints: [
    "** is the exponentiation operator",
    "% is the modulus (remainder) operator",
    "Use template literals with backticks for formatted strings"
  ]
};

// Exercise 3: Comparison and Logical Operators
export const exercise3 = {
  id: "basics_comparisons",
  title: "Comparisons and Logic",
  difficulty: "easy",
  description: "Practice comparison and logical operators",
  
  instructions: `
    Given three variables, create boolean expressions that check:
    1. If x is greater than y
    2. If y is equal to z (using strict equality)
    3. If x is NOT equal to z
    4. If x is greater than y AND y is less than z
    5. If x is less than 10 OR z is greater than 20
  `,
  
  starterCode: `
const x = 12;
const y = 8;
const z = 15;

// Create comparison expressions
const isXGreaterThanY = 
const isYEqualToZ = 
const isXNotEqualToZ = 
const bothConditionsTrue = 
const eitherConditionTrue = 

// Log all results
console.log('x > y:', isXGreaterThanY);
console.log('y === z:', isYEqualToZ);
console.log('x !== z:', isXNotEqualToZ);
console.log('x > y && y < z:', bothConditionsTrue);
console.log('x < 10 || z > 20:', eitherConditionTrue);
  `,
  
  solution: `
const x = 12;
const y = 8;
const z = 15;

// Create comparison expressions
const isXGreaterThanY = x > y;
const isYEqualToZ = y === z;
const isXNotEqualToZ = x !== z;
const bothConditionsTrue = x > y && y < z;
const eitherConditionTrue = x < 10 || z > 20;

// Log all results
console.log('x > y:', isXGreaterThanY);
console.log('y === z:', isYEqualToZ);
console.log('x !== z:', isXNotEqualToZ);
console.log('x > y && y < z:', bothConditionsTrue);
console.log('x < 10 || z > 20:', eitherConditionTrue);
  `,
  
  tests: [
    {
      description: "Should use strict equality (===)",
      test: (code) => code.includes('===')
    },
    {
      description: "Should use logical AND (&&)",
      test: (code) => code.includes('&&')
    },
    {
      description: "Should use logical OR (||)",
      test: (code) => code.includes('||')
    }
  ],
  
  hints: [
    "Use === for strict equality (no type coercion)",
    "&& requires both conditions to be true",
    "|| requires at least one condition to be true"
  ]
};

// Exercise 4: Control Flow - If/Else
export const exercise4 = {
  id: "basics_conditionals",
  title: "Conditional Statements",
  difficulty: "medium",
  description: "Create a grade calculator using if/else statements",
  
  instructions: `
    Create a function that takes a numeric score and returns a letter grade:
    - 90-100: "A"
    - 80-89: "B"
    - 70-79: "C"
    - 60-69: "D"
    - Below 60: "F"
    
    Test it with scores: 95, 87, 73, 62, 45
  `,
  
  starterCode: `
function getGrade(score) {
  // Write your if/else logic here
  
}

// Test the function
const scores = [95, 87, 73, 62, 45];
scores.forEach(score => {
  console.log(\`Score: \${score}, Grade: \${getGrade(score)}\`);
});
  `,
  
  solution: `
function getGrade(score) {
  if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}

// Test the function
const scores = [95, 87, 73, 62, 45];
scores.forEach(score => {
  console.log(\`Score: \${score}, Grade: \${getGrade(score)}\`);
});
  `,
  
  tests: [
    {
      description: "Should return 'A' for score 95",
      test: (code, fn) => fn && fn(95) === "A"
    },
    {
      description: "Should return 'F' for score 45",
      test: (code, fn) => fn && fn(45) === "F"
    },
    {
      description: "Should use else if statements",
      test: (code) => code.includes('else if')
    }
  ],
  
  hints: [
    "Start with the highest grade range first",
    "Use else if for multiple conditions",
    "Remember to return the grade letter"
  ]
};

// Exercise 5: Loops - For Loop
export const exercise5 = {
  id: "basics_for_loops",
  title: "For Loops",
  difficulty: "medium",
  description: "Use for loops to process data",
  
  instructions: `
    Create a program that:
    1. Uses a for loop to generate numbers 1-10
    2. For each number, check if it's even or odd
    3. Store even numbers in an array called 'evenNumbers'
    4. Store odd numbers in an array called 'oddNumbers'
    5. Print both arrays and their lengths
  `,
  
  starterCode: `
const evenNumbers = [];
const oddNumbers = [];

// Write your for loop here


// Print results
console.log('Even numbers:', evenNumbers);
console.log('Odd numbers:', oddNumbers);
console.log('Even count:', evenNumbers.length);
console.log('Odd count:', oddNumbers.length);
  `,
  
  solution: `
const evenNumbers = [];
const oddNumbers = [];

// Write your for loop here
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    evenNumbers.push(i);
  } else {
    oddNumbers.push(i);
  }
}

// Print results
console.log('Even numbers:', evenNumbers);
console.log('Odd numbers:', oddNumbers);
console.log('Even count:', evenNumbers.length);
console.log('Odd count:', oddNumbers.length);
  `,
  
  tests: [
    {
      description: "Should use a for loop",
      test: (code) => code.includes('for') && code.includes('i++')
    },
    {
      description: "Should check for even/odd using modulus",
      test: (code) => code.includes('% 2')
    },
    {
      description: "Should use push method to add to arrays",
      test: (code) => code.includes('.push(')
    }
  ],
  
  hints: [
    "Use modulus operator (%) to check even/odd",
    "i % 2 === 0 means the number is even",
    "Use push() method to add elements to arrays"
  ]
};

// Exercise 6: Functions - Basic Function Creation
export const exercise6 = {
  id: "basics_functions",
  title: "Function Creation",
  difficulty: "medium",
  description: "Create and use different types of functions",
  
  instructions: `
    Create three versions of a function that calculates the area of a rectangle:
    1. Function declaration
    2. Function expression
    3. Arrow function
    
    Each should take width and height parameters and return the area.
    Test all three with width=5, height=10.
  `,
  
  starterCode: `
// Function declaration
function calculateAreaDeclaration(width, height) {
  // Your code here
}

// Function expression
const calculateAreaExpression = function(width, height) {
  // Your code here
};

// Arrow function
const calculateAreaArrow = 

// Test all functions
const width = 5;
const height = 10;

console.log('Declaration result:', calculateAreaDeclaration(width, height));
console.log('Expression result:', calculateAreaExpression(width, height));
console.log('Arrow result:', calculateAreaArrow(width, height));
  `,
  
  solution: `
// Function declaration
function calculateAreaDeclaration(width, height) {
  return width * height;
}

// Function expression
const calculateAreaExpression = function(width, height) {
  return width * height;
};

// Arrow function
const calculateAreaArrow = (width, height) => width * height;

// Test all functions
const width = 5;
const height = 10;

console.log('Declaration result:', calculateAreaDeclaration(width, height));
console.log('Expression result:', calculateAreaExpression(width, height));
console.log('Arrow result:', calculateAreaArrow(width, height));
  `,
  
  tests: [
    {
      description: "Should have three different function types",
      test: (code) => code.includes('function ') && code.includes('function(') && code.includes('=>')
    },
    {
      description: "Arrow function should be concise",
      test: (code) => code.includes('=>') && !code.match(/=>\s*{[\s\S]*return/)
    },
    {
      description: "All functions should return the same result",
      test: (code, results) => results && results.length === 3 && results[0] === results[1] && results[1] === results[2]
    }
  ],
  
  hints: [
    "Function declaration: function name() {}",
    "Function expression: const name = function() {}",
    "Arrow function: const name = () => expression"
  ]
};

// Exercise 7: Scope Challenge
export const exercise7 = {
  id: "basics_scope",
  title: "Variable Scope",
  difficulty: "hard",
  description: "Understand and demonstrate variable scope",
  
  instructions: `
    Create a function that demonstrates different scopes:
    1. Global variable: globalVar = "global"
    2. Function parameter: message
    3. Function-scoped variable using var
    4. Block-scoped variable using let
    5. Show how each can be accessed from different locations
  `,
  
  starterCode: `
// Global variable
const globalVar = "global";

function demonstrateScope(message) {
  console.log('1. Parameter message:', message);
  console.log('2. Global variable:', globalVar);
  
  // Function-scoped variable
  var functionScoped = "function scoped";
  
  // Block scope
  if (true) {
    let blockScoped = "block scoped";
    const alsoBlockScoped = "also block scoped";
    
    console.log('3. Inside block - blockScoped:', blockScoped);
    console.log('4. Inside block - functionScoped:', functionScoped);
    console.log('5. Inside block - globalVar:', globalVar);
  }
  
  console.log('6. Outside block - functionScoped:', functionScoped);
  
  // Try to access blockScoped here (this should cause an error)
  try {
    console.log('7. Outside block - blockScoped:', blockScoped);
  } catch (error) {
    console.log('7. Error accessing blockScoped:', error.message);
  }
}

// Test the function
demonstrateScope("Hello from parameter!");
  `,
  
  solution: `
// Global variable
const globalVar = "global";

function demonstrateScope(message) {
  console.log('1. Parameter message:', message);
  console.log('2. Global variable:', globalVar);
  
  // Function-scoped variable
  var functionScoped = "function scoped";
  
  // Block scope
  if (true) {
    let blockScoped = "block scoped";
    const alsoBlockScoped = "also block scoped";
    
    console.log('3. Inside block - blockScoped:', blockScoped);
    console.log('4. Inside block - functionScoped:', functionScoped);
    console.log('5. Inside block - globalVar:', globalVar);
  }
  
  console.log('6. Outside block - functionScoped:', functionScoped);
  
  // Try to access blockScoped here (this should cause an error)
  try {
    console.log('7. Outside block - blockScoped:', blockScoped);
  } catch (error) {
    console.log('7. Error accessing blockScoped:', error.message);
  }
}

// Test the function
demonstrateScope("Hello from parameter!");
  `,
  
  tests: [
    {
      description: "Should demonstrate global scope access",
      test: (code) => code.includes('globalVar') && code.includes('const globalVar')
    },
    {
      description: "Should show block scope limitation",
      test: (code) => code.includes('try') && code.includes('catch')
    },
    {
      description: "Should use let for block-scoped variable",
      test: (code) => code.includes('let blockScoped')
    }
  ],
  
  hints: [
    "Global variables are accessible everywhere",
    "Block-scoped variables (let/const) are only accessible within their block",
    "Use try/catch to handle ReferenceError"
  ]
};

// Exercise 8: Hoisting Demonstration
export const exercise8 = {
  id: "basics_hoisting",
  title: "Variable Hoisting",
  difficulty: "hard",
  description: "Understand how hoisting works with different variable declarations",
  
  instructions: `
    Create examples that demonstrate hoisting behavior:
    1. Show var hoisting
    2. Show function declaration hoisting
    3. Show temporal dead zone with let/const
    4. Explain what happens in each case
  `,
  
  starterCode: `
// Demonstrate hoisting behavior
console.log('=== Hoisting Demo ===');

// 1. var hoisting
console.log('Before declaration - myVar:', myVar);
var myVar = "I'm hoisted!";
console.log('After declaration - myVar:', myVar);

// 2. Function declaration hoisting
console.log('Calling hoisted function:', hoistedFunction());

function hoistedFunction() {
  return "I'm a hoisted function!";
}

// 3. let/const temporal dead zone
try {
  console.log('Accessing let before declaration:', myLet);
} catch (error) {
  console.log('Error with let:', error.message);
}

let myLet = "I'm let!";
console.log('After let declaration:', myLet);

// 4. Function expression is NOT hoisted
try {
  console.log('Calling function expression:', notHoisted());
} catch (error) {
  console.log('Error with function expression:', error.message);
}

var notHoisted = function() {
  return "I'm not hoisted!";
};

console.log('After function expression declaration:', notHoisted());
  `,
  
  solution: `
// Demonstrate hoisting behavior
console.log('=== Hoisting Demo ===');

// 1. var hoisting
console.log('Before declaration - myVar:', myVar); // undefined (not error!)
var myVar = "I'm hoisted!";
console.log('After declaration - myVar:', myVar);

// 2. Function declaration hoisting
console.log('Calling hoisted function:', hoistedFunction()); // Works!

function hoistedFunction() {
  return "I'm a hoisted function!";
}

// 3. let/const temporal dead zone
try {
  console.log('Accessing let before declaration:', myLet); // ReferenceError
} catch (error) {
  console.log('Error with let:', error.message);
}

let myLet = "I'm let!";
console.log('After let declaration:', myLet);

// 4. Function expression is NOT hoisted
try {
  console.log('Calling function expression:', notHoisted()); // TypeError
} catch (error) {
  console.log('Error with function expression:', error.message);
}

var notHoisted = function() {
  return "I'm not hoisted!";
};

console.log('After function expression declaration:', notHoisted());
  `,
  
  tests: [
    {
      description: "Should demonstrate var hoisting",
      test: (code) => code.includes('console.log') && code.includes('myVar') && code.includes('var myVar')
    },
    {
      description: "Should show function declaration hoisting",
      test: (code) => code.includes('hoistedFunction()') && code.includes('function hoistedFunction')
    },
    {
      description: "Should handle temporal dead zone with try/catch",
      test: (code) => code.includes('try') && code.includes('catch') && code.includes('let')
    }
  ],
  
  hints: [
    "var declarations are hoisted but initialized as undefined",
    "Function declarations are fully hoisted",
    "let/const are hoisted but in temporal dead zone"
  ]
};

// Exercise 9: FizzBuzz Challenge
export const exercise9 = {
  id: "basics_fizzbuzz",
  title: "FizzBuzz Classic",
  difficulty: "medium",
  description: "Implement the classic FizzBuzz problem",
  
  instructions: `
    Write a program that prints numbers from 1 to 30, but:
    - For multiples of 3, print "Fizz" instead of the number
    - For multiples of 5, print "Buzz" instead of the number
    - For multiples of both 3 and 5, print "FizzBuzz"
    
    Store all outputs in an array and also log each one.
  `,
  
  starterCode: `
const fizzBuzzResults = [];

// Write your FizzBuzz logic here
for (let i = 1; i <= 30; i++) {
  // Your logic here
  
}

// Log the results
console.log('FizzBuzz Results:', fizzBuzzResults);
console.log('Total items:', fizzBuzzResults.length);
  `,
  
  solution: `
const fizzBuzzResults = [];

// Write your FizzBuzz logic here
for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) {
    fizzBuzzResults.push("FizzBuzz");
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    fizzBuzzResults.push("Fizz");
    console.log("Fizz");
  } else if (i % 5 === 0) {
    fizzBuzzResults.push("Buzz");
    console.log("Buzz");
  } else {
    fizzBuzzResults.push(i);
    console.log(i);
  }
}

// Log the results
console.log('FizzBuzz Results:', fizzBuzzResults);
console.log('Total items:', fizzBuzzResults.length);
  `,
  
  tests: [
    {
      description: "Should check for multiples of 15 first",
      test: (code) => code.includes('% 15') || (code.includes('% 3') && code.includes('% 5'))
    },
    {
      description: "Should use modulus operator for divisibility",
      test: (code) => code.includes('% 3') && code.includes('% 5')
    },
    {
      description: "Should store results in array",
      test: (code) => code.includes('.push(')
    }
  ],
  
  hints: [
    "Check for multiples of 15 first (divisible by both 3 and 5)",
    "Use modulus operator (%) to check divisibility",
    "Order matters: check 15, then 3, then 5"
  ]
};

// Exercise 10: Function with Default Parameters
export const exercise10 = {
  id: "basics_default_params",
  title: "Default Parameters",
  difficulty: "medium",
  description: "Create functions using default parameters and rest syntax",
  
  instructions: `
    Create a function called 'createProfile' that:
    1. Takes name (required), age (default: 18), city (default: "Unknown")
    2. Takes any number of hobbies using rest parameters
    3. Returns an object with all the information
    4. Test with different combinations of parameters
  `,
  
  starterCode: `
// Create the function with default parameters and rest syntax
function createProfile(name, age = 18, city = "Unknown", ...hobbies) {
  // Return an object with all the information
  
}

// Test cases
console.log('Test 1:', createProfile("Alice"));
console.log('Test 2:', createProfile("Bob", 25));
console.log('Test 3:', createProfile("Charlie", 30, "New York"));
console.log('Test 4:', createProfile("Diana", 28, "Paris", "reading", "swimming", "cooking"));
console.log('Test 5:', createProfile("Eve", undefined, "London", "painting"));
  `,
  
  solution: `
// Create the function with default parameters and rest syntax
function createProfile(name, age = 18, city = "Unknown", ...hobbies) {
  return {
    name: name,
    age: age,
    city: city,
    hobbies: hobbies,
    hobbyCount: hobbies.length,
    introduction: \`Hi, I'm \${name}, \${age} years old from \${city}.\`
  };
}

// Test cases
console.log('Test 1:', createProfile("Alice"));
console.log('Test 2:', createProfile("Bob", 25));
console.log('Test 3:', createProfile("Charlie", 30, "New York"));
console.log('Test 4:', createProfile("Diana", 28, "Paris", "reading", "swimming", "cooking"));
console.log('Test 5:', createProfile("Eve", undefined, "London", "painting"));
  `,
  
  tests: [
    {
      description: "Should use default parameters",
      test: (code) => code.includes('= 18') && code.includes('= "Unknown"')
    },
    {
      description: "Should use rest parameters",
      test: (code) => code.includes('...hobbies')
    },
    {
      description: "Should return an object",
      test: (code) => code.includes('return') && code.includes('{')
    }
  ],
  
  hints: [
    "Default parameters: param = defaultValue",
    "Rest parameters: ...paramName captures remaining arguments",
    "Return an object with all the profile information"
  ]
};

// Exercise 11: Advanced Control Flow
export const exercise11 = {
  id: "basics_advanced_control",
  title: "Advanced Control Flow",
  difficulty: "hard",
  description: "Combine multiple control flow concepts",
  
  instructions: `
    Create a number analyzer that:
    1. Takes an array of numbers
    2. Categorizes each number as: positive, negative, or zero
    3. For positive numbers, check if they're even or odd
    4. Count totals in each category
    5. Return a comprehensive report object
  `,
  
  starterCode: `
function analyzeNumbers(numbers) {
  const report = {
    positive: { even: [], odd: [], count: 0 },
    negative: { values: [], count: 0 },
    zero: { count: 0 },
    total: numbers.length
  };
  
  // Your analysis logic here
  
  
  return report;
}

// Test with different arrays
const testArray1 = [1, -2, 3, 0, -5, 8, 0, 12, -7, 9];
const testArray2 = [0, 0, 0];
const testArray3 = [-1, -2, -3, -4, -5];
const testArray4 = [2, 4, 6, 8, 10];

console.log('Test 1:', analyzeNumbers(testArray1));
console.log('Test 2:', analyzeNumbers(testArray2));
console.log('Test 3:', analyzeNumbers(testArray3));
console.log('Test 4:', analyzeNumbers(testArray4));
  `,
  
  solution: `
function analyzeNumbers(numbers) {
  const report = {
    positive: { even: [], odd: [], count: 0 },
    negative: { values: [], count: 0 },
    zero: { count: 0 },
    total: numbers.length
  };
  
  // Your analysis logic here
  for (const num of numbers) {
    if (num > 0) {
      // Positive number
      report.positive.count++;
      if (num % 2 === 0) {
        report.positive.even.push(num);
      } else {
        report.positive.odd.push(num);
      }
    } else if (num < 0) {
      // Negative number
      report.negative.count++;
      report.negative.values.push(num);
    } else {
      // Zero
      report.zero.count++;
    }
  }
  
  return report;
}

// Test with different arrays
const testArray1 = [1, -2, 3, 0, -5, 8, 0, 12, -7, 9];
const testArray2 = [0, 0, 0];
const testArray3 = [-1, -2, -3, -4, -5];
const testArray4 = [2, 4, 6, 8, 10];

console.log('Test 1:', analyzeNumbers(testArray1));
console.log('Test 2:', analyzeNumbers(testArray2));
console.log('Test 3:', analyzeNumbers(testArray3));
console.log('Test 4:', analyzeNumbers(testArray4));
  `,
  
  tests: [
    {
      description: "Should use for...of loop or similar iteration",
      test: (code) => code.includes('for') && (code.includes('of') || code.includes('i++'))
    },
    {
      description: "Should categorize numbers correctly",
      test: (code) => code.includes('> 0') && code.includes('< 0')
    },
    {
      description: "Should check even/odd for positive numbers",
      test: (code) => code.includes('% 2')
    }
  ],
  
  hints: [
    "Use for...of to iterate through the array",
    "Use if/else if/else for categorization",
    "Check even/odd only for positive numbers"
  ]
};

// Exercise 12: Comprehensive Challenge
export const exercise12 = {
  id: "basics_final_challenge",
  title: "JavaScript Basics Final Challenge",
  difficulty: "hard",
  description: "A comprehensive exercise combining all basic concepts",
  
  instructions: `
    Create a student management system with the following features:
    1. A Student constructor-like function (using regular function)
    2. Methods to add grades, calculate average, and determine letter grade
    3. A class roster array to store multiple students
    4. Functions to find top performer, class average, and generate report
  `,
  
  starterCode: `
// Student creation function
function createStudent(name, id) {
  // Return an object with student properties and methods
  
}

// Class management functions
const classRoster = [];

function addStudent(name, id) {
  // Add a new student to the roster
  
}

function findTopPerformer() {
  // Find student with highest average
  
}

function calculateClassAverage() {
  // Calculate average of all students
  
}

function generateClassReport() {
  // Generate a comprehensive report
  
}

// Test the system
addStudent("Alice Johnson", "S001");
addStudent("Bob Smith", "S002");
addStudent("Charlie Brown", "S003");

// Add some grades
classRoster[0].addGrade(85);
classRoster[0].addGrade(92);
classRoster[0].addGrade(78);

classRoster[1].addGrade(90);
classRoster[1].addGrade(87);
classRoster[1].addGrade(94);

classRoster[2].addGrade(76);
classRoster[2].addGrade(82);
classRoster[2].addGrade(88);

// Generate reports
console.log("Class Report:");
console.log(generateClassReport());
  `,
  
  solution: `
// Student creation function
function createStudent(name, id) {
  return {
    name: name,
    id: id,
    grades: [],
    
    addGrade: function(grade) {
      if (grade >= 0 && grade <= 100) {
        this.grades.push(grade);
      } else {
        console.log("Invalid grade: must be between 0 and 100");
      }
    },
    
    calculateAverage: function() {
      if (this.grades.length === 0) return 0;
      const sum = this.grades.reduce((total, grade) => total + grade, 0);
      return sum / this.grades.length;
    },
    
    getLetterGrade: function() {
      const avg = this.calculateAverage();
      if (avg >= 90) return "A";
      if (avg >= 80) return "B";
      if (avg >= 70) return "C";
      if (avg >= 60) return "D";
      return "F";
    },
    
    getInfo: function() {
      return {
        name: this.name,
        id: this.id,
        grades: [...this.grades],
        average: Math.round(this.calculateAverage() * 100) / 100,
        letterGrade: this.getLetterGrade()
      };
    }
  };
}

// Class management functions
const classRoster = [];

function addStudent(name, id) {
  const student = createStudent(name, id);
  classRoster.push(student);
  console.log(\`Added student: \${name} (\${id})\`);
}

function findTopPerformer() {
  if (classRoster.length === 0) return null;
  
  let topStudent = classRoster[0];
  let highestAverage = topStudent.calculateAverage();
  
  for (let i = 1; i < classRoster.length; i++) {
    const average = classRoster[i].calculateAverage();
    if (average > highestAverage) {
      highestAverage = average;
      topStudent = classRoster[i];
    }
  }
  
  return topStudent;
}

function calculateClassAverage() {
  if (classRoster.length === 0) return 0;
  
  let totalPoints = 0;
  let totalGrades = 0;
  
  for (const student of classRoster) {
    totalPoints += student.grades.reduce((sum, grade) => sum + grade, 0);
    totalGrades += student.grades.length;
  }
  
  return totalGrades > 0 ? totalPoints / totalGrades : 0;
}

function generateClassReport() {
  const report = {
    totalStudents: classRoster.length,
    classAverage: Math.round(calculateClassAverage() * 100) / 100,
    topPerformer: null,
    students: []
  };
  
  const topStudent = findTopPerformer();
  if (topStudent) {
    report.topPerformer = {
      name: topStudent.name,
      average: Math.round(topStudent.calculateAverage() * 100) / 100
    };
  }
  
  for (const student of classRoster) {
    report.students.push(student.getInfo());
  }
  
  return report;
}

// Test the system
addStudent("Alice Johnson", "S001");
addStudent("Bob Smith", "S002");
addStudent("Charlie Brown", "S003");

// Add some grades
classRoster[0].addGrade(85);
classRoster[0].addGrade(92);
classRoster[0].addGrade(78);

classRoster[1].addGrade(90);
classRoster[1].addGrade(87);
classRoster[1].addGrade(94);

classRoster[2].addGrade(76);
classRoster[2].addGrade(82);
classRoster[2].addGrade(88);

// Generate reports
console.log("Class Report:");
console.log(generateClassReport());
  `,
  
  tests: [
    {
      description: "Should create student objects with methods",
      test: (code) => code.includes('addGrade') && code.includes('calculateAverage')
    },
    {
      description: "Should manage class roster array",
      test: (code) => code.includes('classRoster') && code.includes('push')
    },
    {
      description: "Should calculate averages and generate reports",
      test: (code) => code.includes('reduce') || code.includes('sum')
    }
  ],
  
  hints: [
    "Use object methods to encapsulate student behavior",
    "Store students in an array for easy management",
    "Use reduce() or loops to calculate averages"
  ]
};

// Exercise utilities
export const exerciseUtils = {
  // Function to run exercise code safely
  runExercise: function(exerciseCode, exerciseId) {
    try {
      // Create a safe execution context
      const result = new Function(exerciseCode)();
      return {
        success: true,
        result: result,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        result: null,
        error: error.message
      };
    }
  },
  
  // Function to validate exercise solution
  validateSolution: function(userCode, exercise) {
    const results = {
      passed: 0,
      total: exercise.tests.length,
      details: []
    };
    
    exercise.tests.forEach((test, index) => {
      try {
        const passed = test.test(userCode);
        results.details.push({
          description: test.description,
          passed: passed
        });
        if (passed) results.passed++;
      } catch (error) {
        results.details.push({
          description: test.description,
          passed: false,
          error: error.message
        });
      }
    });
    
    return results;
  },
  
  // Progress tracking
  trackProgress: function(exerciseId, completed = false) {
    const progress = JSON.parse(localStorage.getItem('jsverse_basics_progress') || '{}');
    progress[exerciseId] = {
      completed: completed,
      timestamp: new Date().toISOString(),
      attempts: (progress[exerciseId]?.attempts || 0) + 1
    };
    localStorage.setItem('jsverse_basics_progress', JSON.stringify(progress));
    return progress;
  },
  
  // Get overall progress
  getProgress: function() {
    const progress = JSON.parse(localStorage.getItem('jsverse_basics_progress') || '{}');
    const exercises = [
      exercise1, exercise2, exercise3, exercise4, exercise5, exercise6,
      exercise7, exercise8, exercise9, exercise10, exercise11, exercise12
    ];
    
    const completed = exercises.filter(ex => progress[ex.id]?.completed).length;
    const total = exercises.length;
    
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
      details: progress
    };
  }
};

// Export all exercises
export const allExercises = [
  exercise1, exercise2, exercise3, exercise4, exercise5, exercise6,
  exercise7, exercise8, exercise9, exercise10, exercise11, exercise12
];

export default {
  config: exerciseConfig,
  exercises: allExercises,
  utils: exerciseUtils
};