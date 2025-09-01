// File: tests/es6.test.js
// Location: jsversehub/tests/es6.test.js

describe('ES6+ Features', () => {

  // Test arrow functions
  describe('Arrow Functions', () => {
    test('arrow functions should have concise syntax', () => {
      const add = (a, b) => a + b;
      const square = x => x * x;
      const greet = () => 'Hello!';

      expect(add(2, 3)).toBe(5);
      expect(square(4)).toBe(16);
      expect(greet()).toBe('Hello!');
    });

    test('arrow functions should not have their own this', () => {
      const obj = {
        name: 'Test',
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

      const regular = obj.regularFunction();
      const arrow = obj.arrowFunction();

      expect(regular()).toBeUndefined(); // 'this' is undefined in strict mode
      expect(arrow()).toBe('Test'); // 'this' is bound from outer context
    });

    test('arrow functions should not have arguments object', () => {
      const regularFunction = function() {
        return arguments.length;
      };

      const arrowFunction = (...args) => {
        return args.length;
      };

      expect(regularFunction(1, 2, 3)).toBe(3);
      expect(arrowFunction(1, 2, 3)).toBe(3);
    });
  });

  // Test template literals
  describe('Template Literals', () => {
    test('template literals should support string interpolation', () => {
      const name = 'World';
      const greeting = `Hello, ${name}!`;

      expect(greeting).toBe('Hello, World!');
    });

    test('template literals should support multi-line strings', () => {
      const multiLine = `Line 1
Line 2
Line 3`;

      expect(multiLine.split('\n').length).toBe(3);
    });

    test('template literals should support expressions', () => {
      const a = 5;
      const b = 3;
      const result = `${a} + ${b} = ${a + b}`;

      expect(result).toBe('5 + 3 = 8');
    });

    test('tagged template literals should work with custom functions', () => {
      function highlight(strings, ...values) {
        return strings.reduce((acc, string, i) => {
          const value = values[i] ? `<mark>${values[i]}</mark>` : '';
          return acc + string + value;
        }, '');
      }

      const name = 'John';
      const age = 30;
      const result = highlight`Name: ${name}, Age: ${age}`;

      expect(result).toBe('Name: <mark>John</mark>, Age: <mark>30</mark>');
    });
  });

  // Test destructuring
  describe('Destructuring', () => {
    test('array destructuring should extract values', () => {
      const [first, second, third] = [1, 2, 3];
      
      expect(first).toBe(1);
      expect(second).toBe(2);
      expect(third).toBe(3);
    });

    test('array destructuring should work with rest elements', () => {
      const [first, ...rest] = [1, 2, 3, 4, 5];
      
      expect(first).toBe(1);
      expect(rest).toEqual([2, 3, 4, 5]);
    });

    test('array destructuring should support default values', () => {
      const [a = 10, b = 20] = [1];
      
      expect(a).toBe(1);
      expect(b).toBe(20);
    });

    test('object destructuring should extract properties', () => {
      const { name, age } = { name: 'John', age: 30, city: 'New York' };
      
      expect(name).toBe('John');
      expect(age).toBe(30);
    });

    test('object destructuring should support aliasing', () => {
      const { name: fullName, age: years } = { name: 'John', age: 30 };
      
      expect(fullName).toBe('John');
      expect(years).toBe(30);
    });

    test('object destructuring should support default values', () => {
      const { name = 'Unknown', age = 0 } = { name: 'John' };
      
      expect(name).toBe('John');
      expect(age).toBe(0);
    });

    test('nested destructuring should work', () => {
      const data = {
        user: {
          personal: {
            name: 'John',
            age: 30
          },
          contact: {
            email: 'john@example.com'
          }
        }
      };

      const { user: { personal: { name }, contact: { email } } } = data;
      
      expect(name).toBe('John');
      expect(email).toBe('john@example.com');
    });
  });

  // Test spread operator
  describe('Spread Operator', () => {
    test('spread should work with arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const combined = [...arr1, ...arr2];
      
      expect(combined).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('spread should create shallow copies of arrays', () => {
      const original = [1, 2, 3];
      const copy = [...original];
      
      copy.push(4);
      
      expect(original).toEqual([1, 2, 3]);
      expect(copy).toEqual([1, 2, 3, 4]);
    });

    test('spread should work with objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const combined = { ...obj1, ...obj2 };
      
      expect(combined).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    test('spread should handle property overrides', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const combined = { ...obj1, ...obj2 };
      
      expect(combined).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('spread should work in function calls', () => {
      function sum(a, b, c) {
        return a + b + c;
      }
      
      const numbers = [1, 2, 3];
      const result = sum(...numbers);
      
      expect(result).toBe(6);
    });
  });

  // Test rest parameters
  describe('Rest Parameters', () => {
    test('rest parameters should collect remaining arguments', () => {
      function sum(first, ...rest) {
        return first + rest.reduce((acc, num) => acc + num, 0);
      }
      
      expect(sum(1, 2, 3, 4, 5)).toBe(15);
    });

    test('rest parameters should create an array', () => {
      function testRest(...args) {
        return Array.isArray(args) && args.length;
      }
      
      expect(testRest(1, 2, 3)).toBe(3);
    });
  });

  // Test default parameters
  describe('Default Parameters', () => {
    test('default parameters should work with undefined', () => {
      function greet(name = 'World') {
        return `Hello, ${name}!`;
      }
      
      expect(greet()).toBe('Hello, World!');
      expect(greet('John')).toBe('Hello, John!');
      expect(greet(undefined)).toBe('Hello, World!');
    });

    test('default parameters should work with expressions', () => {
      function createArray(length = 5, value = length * 2) {
        return new Array(length).fill(value);
      }
      
      expect(createArray()).toEqual([10, 10, 10, 10, 10]);
      expect(createArray(3)).toEqual([6, 6, 6]);
      expect(createArray(2, 'test')).toEqual(['test', 'test']);
    });
  });

  // Test let and const
  describe('Let and Const', () => {
    test('let should have block scope', () => {
      let x = 1;
      if (true) {
        let x = 2;
        expect(x).toBe(2);
      }
      expect(x).toBe(1);
    });

    test('const should prevent reassignment', () => {
      const x = 1;
      expect(() => {
        x = 2;
      }).toThrow();
    });

    test('const objects should be mutable', () => {
      const obj = { a: 1 };
      obj.a = 2;
      obj.b = 3;
      
      expect(obj).toEqual({ a: 2, b: 3 });
    });

    test('let should not be hoisted like var', () => {
      expect(() => {
        console.log(hoistedLet);
        let hoistedLet = 'test';
      }).toThrow();
    });
  });

  // Test classes
  describe('Classes', () => {
    test('class should create instances', () => {
      class Person {
        constructor(name, age) {
          this.name = name;
          this.age = age;
        }
        
        greet() {
          return `Hello, I'm ${this.name}`;
        }
        
        static species() {
          return 'Homo sapiens';
        }
      }
      
      const john = new Person('John', 30);
      
      expect(john.name).toBe('John');
      expect(john.age).toBe(30);
      expect(john.greet()).toBe("Hello, I'm John");
      expect(Person.species()).toBe('Homo sapiens');
    });

    test('class inheritance should work', () => {
      class Animal {
        constructor(name) {
          this.name = name;
        }
        
        speak() {
          return `${this.name} makes a sound`;
        }
      }
      
      class Dog extends Animal {
        constructor(name, breed) {
          super(name);
          this.breed = breed;
        }
        
        speak() {
          return `${this.name} barks`;
        }
      }
      
      const dog = new Dog('Buddy', 'Golden Retriever');
      
      expect(dog.name).toBe('Buddy');
      expect(dog.breed).toBe('Golden Retriever');
      expect(dog.speak()).toBe('Buddy barks');
      expect(dog instanceof Animal).toBe(true);
      expect(dog instanceof Dog).toBe(true);
    });

    test('class getters and setters should work', () => {
      class Rectangle {
        constructor(width, height) {
          this.width = width;
          this.height = height;
        }
        
        get area() {
          return this.width * this.height;
        }
        
        set area(value) {
          this.width = Math.sqrt(value);
          this.height = Math.sqrt(value);
        }
      }
      
      const rect = new Rectangle(4, 5);
      
      expect(rect.area).toBe(20);
      
      rect.area = 16;
      expect(rect.width).toBe(4);
      expect(rect.height).toBe(4);
    });
  });

  // Test symbols
  describe('Symbols', () => {
    test('symbols should be unique', () => {
      const sym1 = Symbol('test');
      const sym2 = Symbol('test');
      
      expect(sym1).not.toBe(sym2);
      expect(typeof sym1).toBe('symbol');
    });

    test('symbols should work as object keys', () => {
      const nameSymbol = Symbol('name');
      const obj = {
        [nameSymbol]: 'John',
        age: 30
      };
      
      expect(obj[nameSymbol]).toBe('John');
      expect(Object.keys(obj)).toEqual(['age']); // Symbols are not enumerable
    });

    test('well-known symbols should work', () => {
      class Collection {
        constructor(...items) {
          this.items = items;
        }
        
        *[Symbol.iterator]() {
          yield* this.items;
        }
      }
      
      const collection = new Collection(1, 2, 3);
      const result = [...collection];
      
      expect(result).toEqual([1, 2, 3]);
    });
  });

  // Test iterators and generators
  describe('Iterators and Generators', () => {
    test('generators should work with yield', () => {
      function* numberGenerator() {
        yield 1;
        yield 2;
        yield 3;
      }
      
      const gen = numberGenerator();
      
      expect(gen.next()).toEqual({ value: 1, done: false });
      expect(gen.next()).toEqual({ value: 2, done: false });
      expect(gen.next()).toEqual({ value: 3, done: false });
      expect(gen.next()).toEqual({ value: undefined, done: true });
    });

    test('generators should work with for...of', () => {
      function* fibonacci() {
        let [a, b] = [0, 1];
        while (true) {
          yield a;
          [a, b] = [b, a + b];
        }
      }
      
      const fib = fibonacci();
      const first5 = [];
      
      for (const num of fib) {
        first5.push(num);
        if (first5.length === 5) break;
      }
      
      expect(first5).toEqual([0, 1, 1, 2, 3]);
    });

    test('generators should handle yield delegation', () => {
      function* inner() {
        yield 2;
        yield 3;
      }
      
      function* outer() {
        yield 1;
        yield* inner();
        yield 4;
      }
      
      const result = [...outer()];
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  // Test Map and Set
  describe('Map and Set', () => {
    test('Map should store key-value pairs', () => {
      const map = new Map();
      const keyObj = {};
      const keyFunc = function() {};
      
      map.set('string key', 'string value');
      map.set(keyObj, 'object value');
      map.set(keyFunc, 'function value');
      map.set(1, 'number value');
      
      expect(map.size).toBe(4);
      expect(map.get('string key')).toBe('string value');
      expect(map.get(keyObj)).toBe('object value');
      expect(map.has(keyFunc)).toBe(true);
      
      map.delete(1);
      expect(map.size).toBe(3);
    });

    test('Map should be iterable', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3]
      ]);
      
      const keys = [...map.keys()];
      const values = [...map.values()];
      const entries = [...map.entries()];
      
      expect(keys).toEqual(['a', 'b', 'c']);
      expect(values).toEqual([1, 2, 3]);
      expect(entries).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    test('Set should store unique values', () => {
      const set = new Set([1, 2, 3, 2, 1]);
      
      expect(set.size).toBe(3);
      expect(set.has(1)).toBe(true);
      expect(set.has(4)).toBe(false);
      
      set.add(4);
      expect(set.size).toBe(4);
      
      set.delete(1);
      expect(set.has(1)).toBe(false);
    });

    test('Set should be iterable', () => {
      const set = new Set(['a', 'b', 'c']);
      const values = [...set];
      
      expect(values).toEqual(['a', 'b', 'c']);
    });
  });

  // Test WeakMap and WeakSet
  describe('WeakMap and WeakSet', () => {
    test('WeakMap should only accept objects as keys', () => {
      const weakMap = new WeakMap();
      const key = {};
      
      weakMap.set(key, 'value');
      expect(weakMap.get(key)).toBe('value');
      expect(weakMap.has(key)).toBe(true);
      
      expect(() => weakMap.set('string', 'value')).toThrow();
    });

    test('WeakSet should only accept objects', () => {
      const weakSet = new WeakSet();
      const obj = {};
      
      weakSet.add(obj);
      expect(weakSet.has(obj)).toBe(true);
      
      expect(() => weakSet.add('string')).toThrow();
    });
  });

  // Test for...of loops
  describe('For...of Loops', () => {
    test('for...of should work with arrays', () => {
      const arr = [1, 2, 3];
      const result = [];
      
      for (const value of arr) {
        result.push(value * 2);
      }
      
      expect(result).toEqual([2, 4, 6]);
    });

    test('for...of should work with strings', () => {
      const str = 'hello';
      const chars = [];
      
      for (const char of str) {
        chars.push(char.toUpperCase());
      }
      
      expect(chars).toEqual(['H', 'E', 'L', 'L', 'O']);
    });

    test('for...of should work with Map', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      const entries = [];
      
      for (const [key, value] of map) {
        entries.push([key, value]);
      }
      
      expect(entries).toEqual([['a', 1], ['b', 2]]);
    });
  });

  // Test computed property names
  describe('Computed Property Names', () => {
    test('computed property names should work in object literals', () => {
      const prop = 'dynamic';
      const obj = {
        [prop]: 'value',
        [`${prop}_2`]: 'value2'
      };
      
      expect(obj.dynamic).toBe('value');
      expect(obj.dynamic_2).toBe('value2');
    });

    test('computed property names should work with methods', () => {
      const methodName = 'greet';
      const obj = {
        [`${methodName}User`]() {
          return 'Hello User!';
        }
      };
      
      expect(obj.greetUser()).toBe('Hello User!');
    });
  });

  // Test Object.assign and other Object methods
  describe('Object Methods', () => {
    test('Object.assign should copy properties', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3, a: 4 };
      
      const result = Object.assign(target, source1, source2);
      
      expect(result).toBe(target); // Returns target object
      expect(result).toEqual({ a: 4, b: 2, c: 3 });
    });

    test('Object.keys, Object.values, Object.entries should work', () => {
      const obj = { a: 1, b: 2, c: 3 };
      
      expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
      expect(Object.values(obj)).toEqual([1, 2, 3]);
      expect(Object.entries(obj)).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    test('Object.fromEntries should create object from entries', () => {
      const entries = [['a', 1], ['b', 2], ['c', 3]];
      const obj = Object.fromEntries(entries);
      
      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  // Test Array methods (ES6+)
  describe('Array Methods', () => {
    test('Array.from should create arrays from iterables', () => {
      const str = 'hello';
      const arr = Array.from(str);
      
      expect(arr).toEqual(['h', 'e', 'l', 'l', 'o']);
      
      const numbers = Array.from({ length: 5 }, (_, i) => i + 1);
      expect(numbers).toEqual([1, 2, 3, 4, 5]);
    });

    test('Array.of should create arrays from arguments', () => {
      const arr = Array.of(1, 2, 3, 4, 5);
      
      expect(arr).toEqual([1, 2, 3, 4, 5]);
      expect(Array.of(3)).toEqual([3]); // Different from Array(3)
    });

    test('find and findIndex should locate elements', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      const found = numbers.find(n => n > 3);
      const foundIndex = numbers.findIndex(n => n > 3);
      
      expect(found).toBe(4);
      expect(foundIndex).toBe(3);
    });

    test('includes should check for element existence', () => {
      const arr = [1, 2, 3, NaN];
      
      expect(arr.includes(2)).toBe(true);
      expect(arr.includes(4)).toBe(false);
      expect(arr.includes(NaN)).toBe(true); // Unlike indexOf
    });

    test('fill should fill array with values', () => {
      const arr = new Array(5).fill(0);
      expect(arr).toEqual([0, 0, 0, 0, 0]);
      
      arr.fill(1, 2, 4);
      expect(arr).toEqual([0, 0, 1, 1, 0]);
    });

    test('copyWithin should copy elements within array', () => {
      const arr = [1, 2, 3, 4, 5];
      arr.copyWithin(0, 3);
      
      expect(arr).toEqual([4, 5, 3, 4, 5]);
    });
  });

  // Test String methods (ES6+)
  describe('String Methods', () => {
    test('startsWith and endsWith should check string boundaries', () => {
      const str = 'JavaScript';
      
      expect(str.startsWith('Java')).toBe(true);
      expect(str.startsWith('Script')).toBe(false);
      expect(str.endsWith('Script')).toBe(true);
      expect(str.endsWith('Java')).toBe(false);
    });

    test('includes should check for substring', () => {
      const str = 'JavaScript is awesome';
      
      expect(str.includes('Script')).toBe(true);
      expect(str.includes('Python')).toBe(false);
    });

    test('repeat should repeat strings', () => {
      expect('ha'.repeat(3)).toBe('hahaha');
      expect('x'.repeat(0)).toBe('');
    });

    test('padStart and padEnd should pad strings', () => {
      expect('5'.padStart(3, '0')).toBe('005');
      expect('hello'.padEnd(8, '!')).toBe('hello!!!');
    });
  });

  // Test Number methods and properties
  describe('Number Methods', () => {
    test('Number.isInteger should check for integers', () => {
      expect(Number.isInteger(5)).toBe(true);
      expect(Number.isInteger(5.0)).toBe(true);
      expect(Number.isInteger(5.5)).toBe(false);
    });

    test('Number.isNaN should check for NaN correctly', () => {
      expect(Number.isNaN(NaN)).toBe(true);
      expect(Number.isNaN('NaN')).toBe(false); // Unlike global isNaN
      expect(Number.isNaN(123)).toBe(false);
    });

    test('Number.parseFloat and Number.parseInt should parse numbers', () => {
      expect(Number.parseFloat('3.14')).toBe(3.14);
      expect(Number.parseInt('123abc')).toBe(123);
      expect(Number.parseInt('1010', 2)).toBe(10);
    });

    test('Number constants should be available', () => {
      expect(typeof Number.EPSILON).toBe('number');
      expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
      expect(Number.MIN_SAFE_INTEGER).toBe(-9007199254740991);
    });
  });

  // Test Math methods (ES6+)
  describe('Math Methods', () => {
    test('Math.trunc should truncate decimal part', () => {
      expect(Math.trunc(4.1)).toBe(4);
      expect(Math.trunc(4.9)).toBe(4);
      expect(Math.trunc(-4.1)).toBe(-4);
    });

    test('Math.sign should return sign of number', () => {
      expect(Math.sign(5)).toBe(1);
      expect(Math.sign(-5)).toBe(-1);
      expect(Math.sign(0)).toBe(0);
      expect(Math.sign(-0)).toBe(-0);
    });

    test('Math.cbrt should calculate cube root', () => {
      expect(Math.cbrt(8)).toBe(2);
      expect(Math.cbrt(27)).toBe(3);
      expect(Math.cbrt(-8)).toBe(-2);
    });
  });

  // Test Proxy (basic)
  describe('Proxy', () => {
    test('Proxy should intercept property access', () => {
      const target = { a: 1, b: 2 };
      const proxy = new Proxy(target, {
        get(target, prop) {
          return prop in target ? target[prop] : 'default';
        },
        set(target, prop, value) {
          if (typeof value === 'number') {
            target[prop] = value;
            return true;
          }
          return false;
        }
      });
      
      expect(proxy.a).toBe(1);
      expect(proxy.c).toBe('default');
      
      proxy.d = 4;
      expect(proxy.d).toBe(4);
      
      proxy.e = 'string';
      expect(proxy.e).toBe('default'); // Set failed
    });
  });

  // Test module-like patterns (since actual modules need different setup)
  describe('Module Patterns', () => {
    test('export/import like patterns should work', () => {
      // Simulating module exports
      const mathModule = (() => {
        const add = (a, b) => a + b;
        const multiply = (a, b) => a * b;
        
        return { add, multiply };
      })();
      
      const { add, multiply } = mathModule;
      
      expect(add(2, 3)).toBe(5);
      expect(multiply(2, 3)).toBe(6);
    });

    test('default export pattern should work', () => {
      const createCalculator = () => {
        return {
          add: (a, b) => a + b,
          subtract: (a, b) => a - b
        };
      };
      
      const calculator = createCalculator();
      
      expect(calculator.add(5, 3)).toBe(8);
      expect(calculator.subtract(5, 3)).toBe(2);
    });
  });
});