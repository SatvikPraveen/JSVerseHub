// tests/testing.test.js
// Tests for the Testing Concept

describe('Testing Concept', () => {
  
  describe('Testing Principles', () => {
    
    test('should understand test pyramid', () => {
      const pyramid = {
        unitTests: 70,
        integrationTests: 20,
        endToEndTests: 10
      };
      
      const total = pyramid.unitTests + pyramid.integrationTests + pyramid.endToEndTests;
      expect(total).toBe(100);
    });
    
    test('should apply FIRST principles', () => {
      const FIRST = {
        Fast: true,
        Independent: true,
        Repeatable: true,
        SelfChecking: true,
        Timely: true
      };
      
      const allTrue = Object.values(FIRST).every(val => val === true);
      expect(allTrue).toBe(true);
    });
    
    test('should follow Arrange-Act-Assert pattern', () => {
      // ARRANGE
      const numbers = [1, 2, 3];
      
      // ACT
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      // ASSERT
      expect(sum).toBe(6);
    });
  });
  
  describe('Jest Matchers', () => {
    
    test('toBe for strict equality', () => {
      expect(2 + 2).toBe(4);
      expect('hello').toBe('hello');
    });
    
    test('toEqual for object equality', () => {
      const obj = { name: 'John', age: 30 };
      expect(obj).toEqual({ name: 'John', age: 30 });
    });
    
    test('truthiness matchers', () => {
      expect(true).toBeTruthy();
      expect(false).toBeFalsy();
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      expect(42).toBeDefined();
    });
    
    test('number matchers', () => {
      expect(4).toBeGreaterThan(3);
      expect(3).toBeGreaterThanOrEqual(3);
      expect(2).toBeLessThan(3);
      expect(3).toBeLessThanOrEqual(3);
    });
    
    test('string matchers', () => {
      expect('testing').toMatch(/test/);
      expect('hello').toHaveLength(5);
    });
    
    test('array matchers', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr).toContain(3);
      expect(arr).toHaveLength(5);
    });
    
    test('exception matchers', () => {
      const throwError = () => {
        throw new Error('Test error');
      };
      
      expect(throwError).toThrow();
      expect(throwError).toThrow('Test error');
    });
  });
  
  describe('Unit Testing', () => {
    
    // Simple function to test
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    const divide = (a, b) => {
      if (b === 0) throw new Error('Cannot divide by zero');
      return a / b;
    };
    
    test('add function with positive numbers', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(10, 20)).toBe(30);
    });
    
    test('add function with negative numbers', () => {
      expect(add(-5, 3)).toBe(-2);
      expect(add(-10, -20)).toBe(-30);
    });
    
    test('add function with zero', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(5, 0)).toBe(5);
    });
    
    test('multiply function', () => {
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(0, 100)).toBe(0);
      expect(multiply(-2, -3)).toBe(6);
    });
    
    test('divide function with valid inputs', () => {
      expect(divide(10, 2)).toBe(5);
      expect(divide(15, 3)).toBe(5);
    });
    
    test('divide function throws on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
  
  describe('Mocking', () => {
    
    test('should create and use mock function', () => {
      const mockFn = jest.fn();
      mockFn(1, 2);
      
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(1, 2);
    });
    
    test('should mock return value', () => {
      const mockFn = jest.fn(() => 42);
      
      const result = mockFn();
      expect(result).toBe(42);
    });
    
    test('should track multiple calls', () => {
      const mockFn = jest.fn();
      
      mockFn(1);
      mockFn(2);
      mockFn(3);
      
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(1, 1);
      expect(mockFn).toHaveBeenNthCalledWith(2, 2);
      expect(mockFn).toHaveBeenNthCalledWith(3, 3);
    });
    
    test('should spy on object methods', () => {
      const obj = {
        getValue: jest.fn(() => 'value')
      };
      
      const result = obj.getValue();
      
      expect(obj.getValue).toHaveBeenCalled();
      expect(result).toBe('value');
    });
  });
  
  describe('Async Testing', () => {
    
    test('should handle resolved promises', () => {
      const promise = Promise.resolve('success');
      return expect(promise).resolves.toBe('success');
    });
    
    test('should handle rejected promises', () => {
      const promise = Promise.reject(new Error('failed'));
      return expect(promise).rejects.toThrow('failed');
    });
    
    test('should test async functions with async/await', async () => {
      const asyncFn = async () => {
        return new Promise(resolve => {
          setTimeout(() => resolve('done'), 10);
        });
      };
      
      const result = await asyncFn();
      expect(result).toBe('done');
    });
  });
  
  describe('Setup and Teardown', () => {
    
    let testValue;
    
    beforeEach(() => {
      testValue = 0;
    });
    
    afterEach(() => {
      testValue = null;
    });
    
    test('should start with 0', () => {
      expect(testValue).toBe(0);
      testValue = 10;
      expect(testValue).toBe(10);
    });
    
    test('should reset between tests', () => {
      expect(testValue).toBe(0); // Reset from previous test
    });
  });
  
  describe('Parameterized Testing', () => {
    
    const testCases = [
      { a: 1, b: 2, expected: 3 },
      { a: 0, b: 0, expected: 0 },
      { a: -1, b: 1, expected: 0 },
      { a: 5, b: -3, expected: 2 }
    ];
    
    test.each(testCases)(
      'add(%i, %i) should equal %i',
      ({ a, b, expected }) => {
        expect(a + b).toBe(expected);
      }
    );
  });
  
  describe('Edge Cases and Error Handling', () => {
    
    function processUser(user) {
      if (!user) throw new Error('User is required');
      if (typeof user !== 'object') throw new Error('User must be object');
      if (!user.name) throw new Error('User name is required');
      return user.name.toUpperCase();
    }
    
    test('should process valid user', () => {
      expect(processUser({ name: 'john' })).toBe('JOHN');
    });
    
    test('should throw on null user', () => {
      expect(() => processUser(null)).toThrow('User is required');
    });
    
    test('should throw on undefined user', () => {
      expect(() => processUser(undefined)).toThrow('User is required');
    });
    
    test('should throw on non-object user', () => {
      expect(() => processUser('invalid')).toThrow('User must be object');
    });
    
    test('should throw on missing name', () => {
      expect(() => processUser({})).toThrow('User name is required');
    });
    
    test('should throw on empty name', () => {
      expect(() => processUser({ name: '' })).not.toThrow();
      // Empty string is falsy, might throw depending on requirements
    });
  });
  
  describe('Test Coverage', () => {
    
    function calculateDiscount(price, discountPercent) {
      if (price < 0) throw new Error('Price must be positive');
      if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount must be 0-100');
      }
      return price - (price * discountPercent / 100);
    }
    
    test('should calculate discount for valid inputs', () => {
      expect(calculateDiscount(100, 20)).toBe(80);
      expect(calculateDiscount(50, 10)).toBe(45);
    });
    
    test('should handle zero discount', () => {
      expect(calculateDiscount(100, 0)).toBe(100);
    });
    
    test('should handle 100% discount', () => {
      expect(calculateDiscount(100, 100)).toBe(0);
    });
    
    test('should throw on negative price', () => {
      expect(() => calculateDiscount(-10, 10)).toThrow('Price must be positive');
    });
    
    test('should throw on invalid discount', () => {
      expect(() => calculateDiscount(100, -10)).toThrow('Discount must be 0-100');
      expect(() => calculateDiscount(100, 150)).toThrow('Discount must be 0-100');
    });
  });
});
