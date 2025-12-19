// File: src/concepts/testing/index.js
// Testing Fundamentals - Jest, Unit Tests, Integration Tests, and TDD

/**
 * Testing Concept Configuration
 */
export const testingConfig = {
  title: "Testing Fundamentals",
  description: "Master testing strategies, Jest framework, and test-driven development",
  difficulty: "intermediate-advanced",
  estimatedTime: "90 minutes",
  topics: [
    "Testing Principles",
    "Jest Basics & Syntax",
    "Unit Testing",
    "Mocking & Spying",
    "Async Testing",
    "Test-Driven Development"
  ],
  prerequisites: ["JavaScript Basics", "Functions", "Async/Await"],
  learningObjectives: [
    "Write effective unit tests",
    "Understand Jest testing framework",
    "Mock and spy on functions",
    "Test async code",
    "Apply TDD principles",
    "Achieve high code coverage"
  ]
};

/**
 * Testing Principles
 */
export const testingPrinciples = {
  concept: "Testing Principles",
  explanation: `
    Testing is critical for building reliable software. Key testing principles:
    
    1. Test Pyramid:
       - Unit Tests (70%): Test individual functions in isolation
       - Integration Tests (20%): Test how modules work together
       - End-to-End Tests (10%): Test complete user workflows
    
    2. Test Coverage:
       - Statement coverage: Are all lines executed?
       - Branch coverage: Are all if/else paths tested?
       - Function coverage: Are all functions called?
       - Line coverage: Are all lines executed?
    
    3. FIRST Principles:
       - Fast: Tests should run quickly
       - Independent: Tests don't depend on each other
       - Repeatable: Same results every time
       - Self-Checking: Pass or fail without manual inspection
       - Timely: Written around the time of code
    
    4. Arrange-Act-Assert Pattern:
       - Arrange: Set up test data and state
       - Act: Execute the code being tested
       - Assert: Verify the results
  `,
  
  examples: {
    whyTesting: `
// Why testing matters

// Bad: No tests - bugs slip through
function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity; // BUG: What if price is negative?
  });
  return total;
}

// Good: With tests - bugs caught early
function calculateTotal(items) {
  if (!Array.isArray(items)) throw new Error('Items must be array');
  
  let total = 0;
  items.forEach(item => {
    if (item.price < 0) throw new Error('Price cannot be negative');
    if (item.quantity < 0) throw new Error('Quantity cannot be negative');
    total += item.price * item.quantity;
  });
  return total;
}

// Test catches the bug:
test('should reject negative prices', () => {
  expect(() => {
    calculateTotal([{ price: -10, quantity: 1 }]);
  }).toThrow('Price cannot be negative');
});
    `,
    
    testingBenefits: `
// Testing provides multiple benefits

1. Catch bugs early
   - Before they reach production
   - Faster than user reports

2. Document expected behavior
   - Tests show how code should work
   - Better than comments

3. Refactoring confidence
   - Change code without fear
   - Tests verify nothing broke

4. Better code design
   - Hard to test code = poorly designed
   - Tests drive better architecture

5. Debugging faster
   - Test pinpoints exact problem
   - Isolates the issue

// Example: Refactoring with confidence
function getUserAge(user) {
  // Original implementation
  return new Date().getFullYear() - user.birthYear;
}

// Tests ensure it still works:
test('should calculate age correctly', () => {
  const user = { birthYear: 1990 };
  expect(getUserAge(user)).toBe(2024 - 1990);
});

// Can now safely refactor:
function getUserAge(user) {
  if (!user || !user.birthYear) return null;
  const currentYear = new Date().getFullYear();
  const age = currentYear - user.birthYear;
  return age < 0 ? 0 : age; // More robust
}
    `,
    
    testStructure: `
// Proper test structure (Arrange-Act-Assert)

describe('calculateDiscount function', () => {
  
  test('should apply percentage discount', () => {
    // ARRANGE - Set up test data
    const price = 100;
    const discountPercent = 20;
    
    // ACT - Execute the function
    const result = calculateDiscount(price, discountPercent);
    
    // ASSERT - Verify the result
    expect(result).toBe(80); // 100 - (100 * 0.20)
  });
  
  test('should handle zero discount', () => {
    // ARRANGE
    const price = 50;
    const discountPercent = 0;
    
    // ACT
    const result = calculateDiscount(price, discountPercent);
    
    // ASSERT
    expect(result).toBe(50);
  });
  
  test('should throw on negative price', () => {
    // ARRANGE
    const price = -10;
    const discountPercent = 10;
    
    // ACT & ASSERT
    expect(() => {
      calculateDiscount(price, discountPercent);
    }).toThrow('Price must be positive');
  });
});
    `
  }
};

/**
 * Jest Basics
 */
export const jestBasics = {
  concept: "Jest Framework Basics",
  explanation: `
    Jest is a popular JavaScript testing framework with:
    - Built-in test runner
    - Assertion library
    - Mocking capabilities
    - Coverage reporting
    - Snapshot testing
    
    Jest syntax:
    - describe(): Group related tests
    - test() or it(): Define individual test
    - expect(): Assert conditions
    - beforeEach(): Setup before each test
    - afterEach(): Cleanup after each test
    - beforeAll(): Setup once before all
    - afterAll(): Cleanup after all tests
  `,
  
  examples: {
    jestSyntax: `
// Jest basic syntax

// Import dependencies
const { add, subtract } = require('./math');

// Group tests with describe
describe('Math functions', () => {
  
  // Individual test
  test('add should return sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  // Alternative syntax (it is alias for test)
  it('subtract should return difference', () => {
    expect(subtract(5, 2)).toBe(3);
  });
  
  // Multiple assertions in one test
  test('should handle different types', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(0, 0)).toBe(0);
    expect(add(-1, 1)).toBe(0);
  });
});

// Nested describe blocks for organization
describe('String utilities', () => {
  describe('capitalize', () => {
    test('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });
  });
  
  describe('reverse', () => {
    test('should reverse string', () => {
      expect(reverse('hello')).toBe('olleh');
    });
  });
});
    `,
    
    setupTeardown: `
// Setup and teardown

describe('Database operations', () => {
  let db;
  
  // Run once before all tests
  beforeAll(() => {
    console.log('Starting database...');
    db = createTestDatabase();
  });
  
  // Run before each test
  beforeEach(() => {
    console.log('Clearing database...');
    db.clear();
  });
  
  test('should insert data', () => {
    db.insert({ id: 1, name: 'Test' });
    expect(db.count()).toBe(1);
  });
  
  test('should delete data', () => {
    db.insert({ id: 1, name: 'Test' });
    db.delete(1);
    expect(db.count()).toBe(0);
  });
  
  // Run after each test
  afterEach(() => {
    console.log('Test complete');
  });
  
  // Run once after all tests
  afterAll(() => {
    console.log('Stopping database...');
    db.close();
  });
});
    `,
    
    testMatchers: `
// Jest matchers (assertions)

describe('Jest matchers', () => {
  
  // Equality
  test('toBe for strict equality', () => {
    expect(2 + 2).toBe(4);
    expect(2 + 2).not.toBe(5);
  });
  
  // Object equality
  test('toEqual for object comparison', () => {
    const obj = { name: 'John' };
    expect(obj).toEqual({ name: 'John' });
  });
  
  // Truthiness
  test('truthiness matchers', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(5).toBeDefined();
  });
  
  // Numbers
  test('number matchers', () => {
    expect(4).toBeGreaterThan(3);
    expect(3).toBeGreaterThanOrEqual(3);
    expect(2).toBeLessThan(3);
    expect(3).toBeLessThanOrEqual(3);
    expect(0.1 + 0.2).toBeCloseTo(0.3); // Handles floating point
  });
  
  // Strings
  test('string matchers', () => {
    expect('testing').toMatch(/test/);
    expect('hello').toHaveLength(5);
  });
  
  // Arrays and iterables
  test('array matchers', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
    expect(arr).toHaveLength(3);
  });
  
  // Exceptions
  test('exception matchers', () => {
    expect(() => {
      throw new Error('oops');
    }).toThrow();
    
    expect(() => {
      throw new Error('oops');
    }).toThrow('oops');
  });
});
    `
  }
};

/**
 * Unit Testing
 */
export const unitTesting = {
  concept: "Unit Testing",
  explanation: `
    Unit tests focus on testing individual functions in isolation.
    
    Best practices:
    1. One assertion per test (or related assertions)
    2. Test one thing per test
    3. Use descriptive test names
    4. Test edge cases and error conditions
    5. Keep tests small and fast
    6. Test public API, not implementation details
  `,
  
  examples: {
    unitTestExample: `
// Unit test example

// Function to test
function validateEmail(email) {
  if (!email) return false;
  if (typeof email !== 'string') return false;
  
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}

// Comprehensive unit tests
describe('validateEmail function', () => {
  
  describe('valid emails', () => {
    test('should accept simple email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    test('should accept email with plus', () => {
      expect(validateEmail('test+tag@example.co.uk')).toBe(true);
    });
  });
  
  describe('invalid emails', () => {
    test('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
    
    test('should reject null', () => {
      expect(validateEmail(null)).toBe(false);
    });
    
    test('should reject undefined', () => {
      expect(validateEmail(undefined)).toBe(false);
    });
    
    test('should reject non-string', () => {
      expect(validateEmail(123)).toBe(false);
      expect(validateEmail({})).toBe(false);
    });
    
    test('should reject missing @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });
    
    test('should reject missing domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });
    
    test('should reject missing TLD', () => {
      expect(validateEmail('test@example')).toBe(false);
    });
  });
});
    `,
    
    testingClassMethods: `
// Testing class methods

class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(num) {
    this.result += num;
    return this.result;
  }
  
  subtract(num) {
    this.result -= num;
    return this.result;
  }
  
  getResult() {
    return this.result;
  }
  
  reset() {
    this.result = 0;
  }
}

describe('Calculator class', () => {
  let calc;
  
  beforeEach(() => {
    calc = new Calculator();
  });
  
  test('add should add to result', () => {
    expect(calc.add(5)).toBe(5);
    expect(calc.add(3)).toBe(8);
  });
  
  test('subtract should subtract from result', () => {
    calc.add(10);
    expect(calc.subtract(3)).toBe(7);
  });
  
  test('reset should clear result', () => {
    calc.add(5);
    calc.reset();
    expect(calc.getResult()).toBe(0);
  });
  
  test('should maintain state across operations', () => {
    calc.add(10);
    calc.add(5);
    calc.subtract(3);
    expect(calc.getResult()).toBe(12);
  });
});
    `
  }
};

/**
 * Mocking and Spying
 */
export const mockingAndSpying = {
  concept: "Mocking & Spying",
  explanation: `
    Mocking: Replace a function/module with a fake version for testing
    Spying: Track calls to a function without replacing it
    
    Why mock?
    - Test without external dependencies (databases, APIs)
    - Control function behavior in tests
    - Verify functions are called correctly
    - Isolate the code being tested
    
    Common mocking scenarios:
    - API calls
    - Database operations
    - File system operations
    - Date/time
    - Random numbers
  `,
  
  examples: {
    basicMocking: `
// Basic mocking

// Original API function
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`).then(r => r.json());
}

// Test with mock
describe('fetchUser', () => {
  test('should return user data', async () => {
    // Create mock function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'John' })
      })
    );
    
    const user = await fetchUser(1);
    
    // Verify mock was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user.name).toBe('John');
    
    // Clean up
    fetch.mockRestore();
  });
});
    `,
    
    spyingOnMethods: `
// Spying on object methods

const user = {
  name: 'John',
  getName() {
    return this.name;
  },
  setName(name) {
    this.name = name;
  }
};

describe('user object spying', () => {
  test('should spy on getName', () => {
    // Create spy without replacing function
    const spy = jest.spyOn(user, 'getName');
    
    const name = user.getName();
    
    // Verify function was called
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(name).toBe('John');
    
    spy.mockRestore();
  });
  
  test('should spy on method calls', () => {
    const spy = jest.spyOn(user, 'setName');
    
    user.setName('Jane');
    
    expect(spy).toHaveBeenCalledWith('Jane');
    expect(user.name).toBe('Jane');
    
    spy.mockRestore();
  });
});
    `,
    
    mockImplementation: `
// Mock with custom implementation

function processData(data, transformer) {
  return data.map(transformer);
}

describe('processData with mocks', () => {
  test('should apply transformer', () => {
    const mockTransformer = jest.fn(x => x * 2);
    
    const result = processData([1, 2, 3], mockTransformer);
    
    expect(mockTransformer).toHaveBeenCalledTimes(3);
    expect(result).toEqual([2, 4, 6]);
  });
  
  test('should handle transformer side effects', () => {
    const mockTransformer = jest.fn((x) => {
      console.log('Transforming:', x);
      return x + 10;
    });
    
    processData([5, 10], mockTransformer);
    
    // Verify each call
    expect(mockTransformer).toHaveBeenNthCalledWith(1, 5);
    expect(mockTransformer).toHaveBeenNthCalledWith(2, 10);
  });
});
    `
  }
};

/**
 * Async Testing
 */
export const asyncTesting = {
  concept: "Testing Async Code",
  explanation: `
    Testing asynchronous code requires special handling:
    
    1. Return Promise from test
    2. Use async/await
    3. Use done() callback
    4. Use jest timers for setTimeout
    
    Common async testing scenarios:
    - Promises
    - Async/await functions
    - setTimeout/setInterval
    - Fetch API calls
    - Database operations
  `,
  
  examples: {
    testingPromises: `
// Testing Promises

function fetchData() {
  return Promise.resolve({ data: 'test' });
}

describe('Promises', () => {
  // Method 1: Return promise
  test('should resolve with data', () => {
    return fetchData().then(result => {
      expect(result.data).toBe('test');
    });
  });
  
  // Method 2: Use .resolves
  test('should resolve correctly', () => {
    return expect(fetchData()).resolves.toEqual({ data: 'test' });
  });
  
  // Method 3: Use async/await (recommended)
  test('should handle async data', async () => {
    const result = await fetchData();
    expect(result.data).toBe('test');
  });
});

// Testing rejected promises
function fetchError() {
  return Promise.reject(new Error('API Error'));
}

describe('Error handling', () => {
  test('should reject with error', () => {
    return expect(fetchError()).rejects.toThrow('API Error');
  });
  
  test('should catch error with async/await', async () => {
    try {
      await fetchError();
      fail('Should have thrown');
    } catch (error) {
      expect(error.message).toBe('API Error');
    }
  });
});
    `,
    
    testingAsyncAwait: `
// Testing async/await functions

async function getUserById(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

describe('async/await testing', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });
  
  test('should fetch user', async () => {
    const mockUser = { id: 1, name: 'John' };
    global.fetch.mockResolvedValueOnce({
      json: async () => mockUser
    });
    
    const user = await getUserById(1);
    expect(user.name).toBe('John');
  });
  
  test('should handle errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    try {
      await getUserById(1);
      fail('Should throw');
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });
});
    `,
    
    testingTimers: `
// Testing timer-based code

jest.useFakeTimers();

function delayedGreeting(callback, delay) {
  setTimeout(() => {
    callback('Hello!');
  }, delay);
}

describe('Timers', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });
  
  test('should call callback after delay', () => {
    const callback = jest.fn();
    
    delayedGreeting(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledWith('Hello!');
  });
  
  test('should work with runAllTimers', () => {
    const callback = jest.fn();
    
    delayedGreeting(callback, 5000);
    jest.runAllTimers();
    
    expect(callback).toHaveBeenCalled();
  });
});
    `
  }
};

/**
 * Test-Driven Development (TDD)
 */
export const tdd = {
  concept: "Test-Driven Development",
  explanation: `
    TDD is a development approach: Red → Green → Refactor
    
    1. RED: Write test that fails (function doesn't exist yet)
    2. GREEN: Write minimal code to make test pass
    3. REFACTOR: Improve code while keeping test passing
    
    Benefits:
    - Forces you to think about requirements
    - Code is testable by design
    - High test coverage
    - Catches bugs early
    - Easier refactoring
  `,
  
  examples: {
    tddExample: `
// TDD Example: Building a todo app

// RED: Write failing test first
describe('Todo app', () => {
  test('should create new todo', () => {
    const todos = new TodoList();
    todos.add('Buy milk');
    
    expect(todos.get()).toHaveLength(1);
    expect(todos.get()[0].text).toBe('Buy milk');
  });
});

// GREEN: Write minimal code to pass
class TodoList {
  constructor() {
    this.items = [];
  }
  
  add(text) {
    this.items.push({ text, done: false });
  }
  
  get() {
    return this.items;
  }
}

// GREEN: Test passes, now add more tests
test('should mark todo complete', () => {
  const todos = new TodoList();
  todos.add('Buy milk');
  todos.complete(0);
  
  expect(todos.get()[0].done).toBe(true);
});

// GREEN: Add more functionality
class TodoList {
  constructor() {
    this.items = [];
  }
  
  add(text) {
    this.items.push({ text, done: false });
  }
  
  complete(index) {
    this.items[index].done = true;
  }
  
  get() {
    return this.items;
  }
}

// REFACTOR: Improve while tests still pass
class TodoList {
  constructor() {
    this.items = [];
    this.nextId = 0;
  }
  
  add(text) {
    this.items.push({
      id: this.nextId++,
      text,
      done: false,
      createdAt: new Date()
    });
  }
  
  complete(id) {
    const item = this.items.find(i => i.id === id);
    if (item) item.done = true;
  }
  
  get(filter = 'all') {
    return this.items.filter(item => {
      if (filter === 'done') return item.done;
      if (filter === 'pending') return !item.done;
      return true;
    });
  }
}

// All tests still pass after refactoring!
    `
  }
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: "testing_ex1",
    title: "Write First Unit Test",
    difficulty: "easy",
    description: "Write a simple unit test using Jest",
    template: `
// Function to test
function greet(name) {
  return 'Hello, ' + name;
}

// Your test here:
describe('greet function', () => {
  // Write test here
});
    `,
    tests: [
      {
        description: "Should use describe block",
        check: (code) => code.includes('describe')
      },
      {
        description: "Should use test or it",
        check: (code) => code.includes('test') || code.includes('it(')
      },
      {
        description: "Should use expect",
        check: (code) => code.includes('expect')
      }
    ],
    hints: [
      "Use describe() to group tests",
      "Use test() to define individual test",
      "Use expect() and matchers like toBe()"
    ]
  },
  {
    id: "testing_ex2",
    title: "Test Edge Cases",
    difficulty: "medium",
    description: "Write tests for edge cases",
    template: `
function divide(a, b) {
  return a / b;
}

// Your tests here - cover edge cases
    `,
    tests: [
      {
        description: "Should test normal division",
        check: (code) => code.includes('divide') && code.includes('test')
      },
      {
        description: "Should test division by zero",
        check: (code) => code.includes('0')
      },
      {
        description: "Should test with negative numbers",
        check: (code) => code.includes('-')
      }
    ],
    hints: [
      "Test normal cases first",
      "Test boundary conditions",
      "Test error cases (like division by zero)"
    ]
  },
  {
    id: "testing_ex3",
    title: "Mock an API Call",
    difficulty: "hard",
    description: "Write test with mocked fetch",
    template: `
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`).then(r => r.json());
}

// Your test here - mock the fetch
    `,
    tests: [
      {
        description: "Should mock fetch",
        check: (code) => code.includes('jest.fn') || code.includes('mock')
      },
      {
        description: "Should return mock data",
        check: (code) => code.includes('toHaveBeenCalled') || code.includes('json')
      }
    ],
    hints: [
      "Use jest.fn() to create mock",
      "Use mockResolvedValueOnce for promises",
      "Verify mock was called with expect()"
    ]
  }
];

/**
 * Quiz
 */
export const quiz = [
  {
    id: "tq1",
    question: "What does the Red-Green-Refactor cycle mean in TDD?",
    options: [
      "Three colors used in testing",
      "Red=failing test, Green=passing test, Refactor=improve code",
      "Three test categories",
      "Three types of assertions"
    ],
    correct: 1,
    explanation: "TDD follows: Write failing test (Red), make it pass (Green), improve code (Refactor)"
  },
  {
    id: "tq2",
    question: "What is the FIRST principle in testing?",
    options: [
      "First test always",
      "Fast, Independent, Repeatable, Self-Checking, Timely",
      "Focus, Isolate, Run, Search, Track",
      "Framework, Input, Response, Setup, Time"
    ],
    correct: 1,
    explanation: "FIRST principles ensure tests are effective and maintainable"
  },
  {
    id: "tq3",
    question: "When should you use mocking?",
    options: [
      "Always",
      "Never, mock is bad practice",
      "When testing code that depends on external services or complex dependencies",
      "Only for unit tests"
    ],
    correct: 2,
    explanation: "Mocking isolates code from external dependencies like APIs or databases"
  }
];

/**
 * Export all
 */
export default {
  config: testingConfig,
  principles: testingPrinciples,
  jestBasics,
  unitTesting,
  mockingAndSpying,
  asyncTesting,
  tdd,
  exercises,
  quiz
};
