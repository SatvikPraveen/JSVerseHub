// File: tests/basics.test.js
// Location: jsversehub/tests/basics.test.js

describe('JavaScript Basics Concepts', () => {
  // Test basic variable declarations
  describe('Variable Declarations', () => {
    test('var declaration should be hoisted', () => {
      expect(typeof hoistedVar).toBe('undefined');
      var hoistedVar = 'test';
      expect(hoistedVar).toBe('test');
    });

    test('let and const should have block scope', () => {
      if (true) {
        let blockScoped = 'let value';
        const constantValue = 'const value';
        expect(blockScoped).toBe('let value');
        expect(constantValue).toBe('const value');
      }
      expect(() => {
        console.log(blockScoped);
      }).toThrow();
    });

    test('const cannot be reassigned', () => {
      const immutable = 'original';
      expect(() => {
        immutable = 'changed';
      }).toThrow();
    });
  });

  // Test data types
  describe('Data Types', () => {
    test('should correctly identify primitive types', () => {
      expect(typeof 42).toBe('number');
      expect(typeof 'hello').toBe('string');
      expect(typeof true).toBe('boolean');
      expect(typeof undefined).toBe('undefined');
      expect(typeof null).toBe('object'); // JavaScript quirk
      expect(typeof Symbol('test')).toBe('symbol');
      expect(typeof 123n).toBe('bigint');
    });

    test('should handle type coercion', () => {
      expect('5' + 3).toBe('53');
      expect('5' - 3).toBe(2);
      expect(+'42').toBe(42);
      expect(!!'hello').toBe(true);
      expect(!!0).toBe(false);
    });

    test('should compare values correctly', () => {
      expect(5 == '5').toBe(true);
      expect(5 === '5').toBe(false);
      expect(null == undefined).toBe(true);
      expect(null === undefined).toBe(false);
    });
  });

  // Test functions
  describe('Functions', () => {
    test('function declarations should be hoisted', () => {
      expect(typeof hoistedFunction).toBe('function');
      expect(hoistedFunction()).toBe('hoisted');
      
      function hoistedFunction() {
        return 'hoisted';
      }
    });

    test('function expressions should not be hoisted', () => {
      expect(typeof functionExpression).toBe('undefined');
      var functionExpression = function() {
        return 'expression';
      };
      expect(functionExpression()).toBe('expression');
    });

    test('arrow functions should preserve lexical this', () => {
      const obj = {
        name: 'test',
        regularFunction: function() {
          return function() {
            return this.name;
          };
        },
        arrowFunction: function() {
          return () => {
            return this.name;
          };
        }
      };

      expect(obj.arrowFunction()()).toBe('test');
    });

    test('functions should handle parameters correctly', () => {
      function testParams(a, b = 'default', ...rest) {
        return { a, b, rest };
      }

      const result = testParams(1, undefined, 3, 4, 5);
      expect(result.a).toBe(1);
      expect(result.b).toBe('default');
      expect(result.rest).toEqual([3, 4, 5]);
    });
  });

  // Test operators
  describe('Operators', () => {
    test('arithmetic operators should work correctly', () => {
      expect(10 + 5).toBe(15);
      expect(10 - 5).toBe(5);
      expect(10 * 5).toBe(50);
      expect(10 / 5).toBe(2);
      expect(10 % 3).toBe(1);
      expect(2 ** 3).toBe(8);
    });

    test('logical operators should work correctly', () => {
      expect(true && true).toBe(true);
      expect(true && false).toBe(false);
      expect(false || true).toBe(true);
      expect(!true).toBe(false);
      expect(5 && 'hello').toBe('hello');
      expect(0 || 'default').toBe('default');
    });

    test('ternary operator should work correctly', () => {
      const result = 5 > 3 ? 'yes' : 'no';
      expect(result).toBe('yes');
    });
  });

  // Test control structures
  describe('Control Structures', () => {
    test('if-else statements should work correctly', () => {
      function checkNumber(num) {
        if (num > 0) {
          return 'positive';
        } else if (num < 0) {
          return 'negative';
        } else {
          return 'zero';
        }
      }

      expect(checkNumber(5)).toBe('positive');
      expect(checkNumber(-3)).toBe('negative');
      expect(checkNumber(0)).toBe('zero');
    });

    test('switch statements should work correctly', () => {
      function getDayType(day) {
        switch (day) {
          case 'monday':
          case 'tuesday':
          case 'wednesday':
          case 'thursday':
          case 'friday':
            return 'weekday';
          case 'saturday':
          case 'sunday':
            return 'weekend';
          default:
            return 'invalid';
        }
      }

      expect(getDayType('monday')).toBe('weekday');
      expect(getDayType('saturday')).toBe('weekend');
      expect(getDayType('invalid')).toBe('invalid');
    });

    test('loops should work correctly', () => {
      // for loop
      let forResult = 0;
      for (let i = 1; i <= 5; i++) {
        forResult += i;
      }
      expect(forResult).toBe(15);

      // while loop
      let whileResult = 0;
      let j = 1;
      while (j <= 5) {
        whileResult += j;
        j++;
      }
      expect(whileResult).toBe(15);

      // do-while loop
      let doWhileResult = 0;
      let k = 1;
      do {
        doWhileResult += k;
        k++;
      } while (k <= 5);
      expect(doWhileResult).toBe(15);
    });
  });

  // Test arrays
  describe('Arrays', () => {
    test('array methods should work correctly', () => {
      const arr = [1, 2, 3, 4, 5];
      
      expect(arr.length).toBe(5);
      expect(arr.push(6)).toBe(6);
      expect(arr.pop()).toBe(6);
      expect(arr.shift()).toBe(1);
      expect(arr.unshift(0)).toBe(5);
      expect(arr).toEqual([0, 2, 3, 4, 5]);
    });

    test('array iteration methods should work correctly', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6, 8, 10]);

      const evens = numbers.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);

      const sum = numbers.reduce((acc, n) => acc + n, 0);
      expect(sum).toBe(15);

      expect(numbers.find(n => n > 3)).toBe(4);
      expect(numbers.includes(3)).toBe(true);
    });
  });

  // Test objects
  describe('Objects', () => {
    test('object creation and manipulation', () => {
      const obj = {
        name: 'John',
        age: 30,
        greet() {
          return `Hello, I'm ${this.name}`;
        }
      };

      expect(obj.name).toBe('John');
      expect(obj['age']).toBe(30);
      expect(obj.greet()).toBe("Hello, I'm John");

      obj.city = 'New York';
      expect(obj.city).toBe('New York');

      delete obj.age;
      expect(obj.age).toBeUndefined();
    });

    test('object methods should work correctly', () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
      expect(Object.values(obj)).toEqual([1, 2, 3]);
      expect(Object.entries(obj)).toEqual([['a', 1], ['b', 2], ['c', 3]]);

      const copy = Object.assign({}, obj);
      expect(copy).toEqual(obj);
      expect(copy).not.toBe(obj);
    });
  });

  // Test scope and closures
  describe('Scope and Closures', () => {
    test('closure should maintain access to outer variables', () => {
      function createCounter() {
        let count = 0;
        return function() {
          return ++count;
        };
      }

      const counter = createCounter();
      expect(counter()).toBe(1);
      expect(counter()).toBe(2);
      expect(counter()).toBe(3);
    });

    test('IIFE should create isolated scope', () => {
      const result = (function(x) {
        return x * 2;
      })(5);

      expect(result).toBe(10);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('try-catch should handle errors', () => {
      function riskyFunction(shouldThrow) {
        if (shouldThrow) {
          throw new Error('Something went wrong');
        }
        return 'success';
      }

      expect(riskyFunction(false)).toBe('success');
      expect(() => riskyFunction(true)).toThrow('Something went wrong');

      let caughtError;
      try {
        riskyFunction(true);
      } catch (error) {
        caughtError = error.message;
      }
      expect(caughtError).toBe('Something went wrong');
    });

    test('finally block should always execute', () => {
      let finallyExecuted = false;
      
      try {
        throw new Error('Test error');
      } catch (error) {
        // Error caught
      } finally {
        finallyExecuted = true;
      }
      
      expect(finallyExecuted).toBe(true);
    });

    test('custom errors should work correctly', () => {
      class ValidationError extends Error {
        constructor(message, field) {
          super(message);
          this.name = 'ValidationError';
          this.field = field;
        }
      }

      const error = new ValidationError('Invalid input', 'email');
      expect(error.message).toBe('Invalid input');
      expect(error.field).toBe('email');
      expect(error instanceof ValidationError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  // Test regular expressions
  describe('Regular Expressions', () => {
    test('regex should match patterns correctly', () => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      expect(emailPattern.test('user@example.com')).toBe(true);
      expect(emailPattern.test('invalid.email')).toBe(false);
      expect(emailPattern.test('user@domain')).toBe(false);
    });

    test('regex flags should work correctly', () => {
      const text = 'Hello World, hello universe';
      
      expect(text.match(/hello/g)).toEqual(['hello']);
      expect(text.match(/hello/gi)).toEqual(['Hello', 'hello']);
      expect(/hello/i.test(text)).toBe(true);
      expect(/goodbye/.test(text)).toBe(false);
    });

    test('regex methods should work correctly', () => {
      const text = 'The year is 2024';
      
      // test()
      expect(/\d{4}/.test(text)).toBe(true);
      
      // match()
      const match = text.match(/\d{4}/);
      expect(match[0]).toBe('2024');
      
      // search()
      expect(text.search(/\d{4}/)).toBe(12);
      
      // replace()
      expect(text.replace(/2024/, '2025')).toBe('The year is 2025');
    });

    test('regex capture groups should work', () => {
      const date = '2024-03-08';
      const pattern = /(\d{4})-(\d{2})-(\d{2})/;
      const match = date.match(pattern);
      
      expect(match[1]).toBe('2024');
      expect(match[2]).toBe('03');
      expect(match[3]).toBe('08');
      
      const formatted = date.replace(pattern, '$2/$3/$1');
      expect(formatted).toBe('03/08/2024');
    });

    test('common regex patterns should work', () => {
      const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
      const urlPattern = /^https?:\/\/[^\s]+$/;
      const usernamePattern = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;
      
      expect(phonePattern.test('123-456-7890')).toBe(true);
      expect(phonePattern.test('1234567890')).toBe(false);
      
      expect(urlPattern.test('https://example.com')).toBe(true);
      expect(urlPattern.test('not a url')).toBe(false);
      
      expect(usernamePattern.test('user123')).toBe(true);
      expect(usernamePattern.test('123user')).toBe(false);
      expect(usernamePattern.test('ab')).toBe(false);
    });
  });
});