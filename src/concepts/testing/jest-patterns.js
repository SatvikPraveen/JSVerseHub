// File: src/concepts/testing/jest-patterns.js
// Advanced Jest Patterns and Techniques

/**
 * Snapshot Testing
 * Useful for testing complex outputs that rarely change
 */
export const snapshotTesting = {
  title: "Snapshot Testing",
  explanation: `
    Snapshot tests capture output and compare future runs against it.
    
    Use cases:
    - UI component rendering
    - Complex object structures
    - API responses
    - Generated files
    
    Caution:
    - Don't overuse snapshots
    - Review snapshot changes carefully
    - Snapshots are stored separately
  `,
  
  examples: {
    basicSnapshot: `
function renderUserCard(user) {
  return \`
    <div class="user-card">
      <h3>\${user.name}</h3>
      <p>\${user.email}</p>
      <p>Age: \${user.age}</p>
    </div>
  \`;
}

describe('User card snapshot', () => {
  test('should render user card correctly', () => {
    const user = { name: 'John', email: 'john@example.com', age: 30 };
    const output = renderUserCard(user);
    
    expect(output).toMatchSnapshot();
  });
});

// On first run: creates __snapshots__/jest-patterns.test.js.snap
// On future runs: compares against snapshot
// If different: fails and asks to update
    `,
    
    inlineSnapshot: `
test('should format date', () => {
  const date = new Date('2024-01-15');
  expect(formatDate(date)).toMatchInlineSnapshot(\`"Jan 15, 2024"\`);
});

// Snapshot embedded inline in test file
    `,
    
    partialSnapshot: `
test('should partially match snapshot', () => {
  const response = {
    status: 200,
    data: { name: 'John' },
    timestamp: 1234567890 // Changes every time
  };
  
  expect(response).toMatchSnapshot({
    timestamp: expect.any(Number) // Ignore timestamp
  });
});
    `
  }
};

/**
 * Parameterized Testing
 * Run same test with different inputs
 */
export const parameterizedTesting = {
  title: "Parameterized/Table-Driven Testing",
  explanation: `
    Use test.each() to run same test with different parameters.
    
    Benefits:
    - Less code duplication
    - Easy to add test cases
    - Clear test matrix
    - Better coverage
  `,
  
  examples: {
    tableTest: `
describe('Calculator', () => {
  test.each([
    [1, 2, 3],      // input a, b, expected result
    [0, 0, 0],
    [-1, 1, 0],
    [5, -2, 3],
    [100, 200, 300]
  ])('add(%i, %i) should return %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });
});

// Generates 5 test cases from one test definition
    `,
    
    namedTableTest: `
test.each\`
  a    | b    | expected
  \${1} | \${2} | \${3}
  \${0} | \${0} | \${0}
  \${-1}| \${1} | \${0}
\`('add(\$a, \$b) = \$expected', ({ a, b, expected }) => {
  expect(add(a, b)).toBe(expected);
});

// Named parameters with template literals
    `,
    
    objectTableTest: `
test.each([
  { a: 1, b: 2, expected: 3 },
  { a: 0, b: 0, expected: 0 },
  { a: -5, b: 5, expected: 0 }
])('add(\$a, \$b) = \$expected', ({ a, b, expected }) => {
  expect(add(a, b)).toBe(expected);
});
    `
  }
};

/**
 * Test Coverage
 * Measuring how much code is tested
 */
export const testCoverage = {
  title: "Test Coverage",
  explanation: `
    Coverage metrics:
    - Line coverage: % of lines executed
    - Branch coverage: % of if/else paths taken
    - Function coverage: % of functions called
    - Statement coverage: % of statements executed
    
    Generate coverage with:
    npm test -- --coverage
    
    Goal: Aim for 80%+ coverage
    Don't chase 100% - focus on important code
  `,
  
  examples: {
    coverageExample: `
// Function with low coverage
function processUser(user, isPremium) {
  if (!user) {
    throw new Error('User required');
  }
  
  const discount = isPremium ? 0.2 : 0;
  const price = 100 - (100 * discount);
  
  return {
    name: user.name,
    email: user.email,
    price: price
  };
}

// Test only covers happy path (low coverage)
test('should process user', () => {
  const user = { name: 'John', email: 'john@example.com' };
  const result = processUser(user, true);
  expect(result.name).toBe('John');
});

// Better tests for higher coverage
describe('processUser coverage', () => {
  test('should throw on null user', () => {
    expect(() => processUser(null)).toThrow('User required');
  });
  
  test('should apply premium discount', () => {
    const user = { name: 'John', email: 'john@example.com' };
    const result = processUser(user, true);
    expect(result.price).toBe(80); // 100 - 20% = 80
  });
  
  test('should apply no discount for non-premium', () => {
    const user = { name: 'Jane', email: 'jane@example.com' };
    const result = processUser(user, false);
    expect(result.price).toBe(100);
  });
});

// Coverage report:
// Statements: 5/5 (100%)
// Branches: 2/2 (100%) - both if paths
// Functions: 1/1 (100%)
// Lines: 5/5 (100%)
    `,
    
    coverageReporting: `
// Run tests with coverage:
// npm test -- --coverage

// Output example:
// ------|----------|----------|----------|----------|
// File  | % Stmts  | % Branch | % Funcs  | % Lines  |
// ------|----------|----------|----------|----------|
// All   |     78.5 |     72.1 |     85.2 |     78.5 |
// math. |    100   |    100   |    100   |    100   |
// utils |     45   |     40   |     50   |     45   |
// ------|----------|----------|----------|----------|
    `
  }
};

/**
 * Testing Patterns and Anti-Patterns
 */
export const testingPatterns = {
  title: "Best Practices & Anti-Patterns",
  
  bestPractices: `
    ✓ GOOD PRACTICES:
    1. Descriptive test names - clarifies intent
    2. One logical assertion per test (can have multiple related assertions)
    3. DRY but readable - avoid over-abstraction
    4. Isolated tests - no dependencies between tests
    5. Fast tests - unit tests should run in milliseconds
    6. No implementation details - test behavior, not internals
    7. Meaningful error messages - helps debugging
    8. Keep tests simple - simpler than code being tested
  `,
  
  antiPatterns: `
    ✗ BAD PATTERNS:
    1. Fragile tests - break on minor code changes
    2. Slow tests - slow down development
    3. Flaky tests - pass/fail randomly
    4. Too many assertions - unclear what failed
    5. Testing internals - brittle to refactoring
    6. Shared test state - tests affect each other
    7. Missing edge cases - false confidence
    8. Unclear test names - hard to understand
  `
};

export default {
  snapshotTesting,
  parameterizedTesting,
  testCoverage,
  testingPatterns
};
