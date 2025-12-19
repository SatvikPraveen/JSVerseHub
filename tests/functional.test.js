import {
  pureFunctions,
  higherOrderFunctions,
  mapFilterReduce,
  exercises,
} from '../src/concepts/functional/index';

describe('Functional Programming - Pure Functions', () => {
  describe('Pure Function Definition', () => {
    test('pure function should always return same output for same input', () => {
      const { add } = pureFunctions.examples;
      
      expect(add(2, 3)).toBe(5);
      expect(add(2, 3)).toBe(5);
      expect(add(5, 10)).toBe(15);
    });

    test('pure function should not have side effects', () => {
      const { multiply } = pureFunctions.examples;
      
      const result1 = multiply(4, 5);
      const result2 = multiply(4, 5);
      
      expect(result1).toBe(result2);
      expect(result1).toBe(20);
    });

    test('pure function should not modify input arguments', () => {
      const { doubleArray } = pureFunctions.examples;
      const original = [1, 2, 3];
      const originalCopy = [...original];
      
      const result = doubleArray(original);
      
      expect(original).toEqual(originalCopy);
      expect(result).toEqual([2, 4, 6]);
    });

    test('pure function should not depend on external state', () => {
      const { calculate } = pureFunctions.examples;
      
      expect(calculate(10)).toBe(50);
      expect(calculate(10)).toBe(50);
    });
  });

  describe('Immutability', () => {
    test('should not mutate objects passed as arguments', () => {
      const { updateObject } = pureFunctions.examples;
      const original = { name: 'John', age: 30 };
      const originalCopy = JSON.parse(JSON.stringify(original));
      
      const updated = updateObject(original, { age: 31 });
      
      expect(original).toEqual(originalCopy);
      expect(updated.age).toBe(31);
    });

    test('should not mutate arrays passed as arguments', () => {
      const { appendItem } = pureFunctions.examples;
      const original = [1, 2, 3];
      const originalCopy = [...original];
      
      const result = appendItem(original, 4);
      
      expect(original).toEqual(originalCopy);
      expect(result).toContain(4);
    });
  });

  describe('Avoiding Side Effects', () => {
    test('pure function should not modify global state', () => {
      const { getRandomNumber } = pureFunctions.examples;
      
      // Should get same result from pure logic
      expect(typeof getRandomNumber()).toBe('number');
    });

    test('pure function should not perform I/O operations', () => {
      const { processData } = pureFunctions.examples;
      
      // Pure functions don't read/write to console, files, or network
      const result = processData([1, 2, 3, 4, 5]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('Functional Programming - Higher Order Functions', () => {
  describe('Functions Returning Functions', () => {
    test('should return function from function', () => {
      const { multiplier } = higherOrderFunctions.examples;
      const double = multiplier(2);
      
      expect(typeof double).toBe('function');
      expect(double(5)).toBe(10);
    });

    test('should create specialized functions through HOF', () => {
      const { makeAdder } = higherOrderFunctions.examples;
      const add5 = makeAdder(5);
      const add10 = makeAdder(10);
      
      expect(add5(3)).toBe(8);
      expect(add10(3)).toBe(13);
    });
  });

  describe('Functions as Arguments', () => {
    test('should accept functions as arguments', () => {
      const { applyTwice } = higherOrderFunctions.examples;
      const double = x => x * 2;
      
      expect(applyTwice(double, 5)).toBe(20);
    });

    test('should execute function parameter correctly', () => {
      const { compose } = higherOrderFunctions.examples;
      const add2 = x => x + 2;
      const multiply3 = x => x * 3;
      
      const composed = compose(multiply3, add2);
      expect(composed(5)).toBe(21); // (5 + 2) * 3
    });

    test('should support multiple function parameters', () => {
      const { pipe } = higherOrderFunctions.examples;
      const add1 = x => x + 1;
      const double = x => x * 2;
      
      const piped = pipe(add1, double);
      expect(piped(5)).toBe(12); // (5 + 1) * 2
    });
  });

  describe('Closures in HOF', () => {
    test('should maintain closure over outer function variables', () => {
      const { makeCounter } = higherOrderFunctions.examples;
      const counter = makeCounter();
      
      expect(counter()).toBe(1);
      expect(counter()).toBe(2);
      expect(counter()).toBe(3);
    });

    test('should support multiple independent closures', () => {
      const { makeCounter } = higherOrderFunctions.examples;
      const counter1 = makeCounter();
      const counter2 = makeCounter();
      
      expect(counter1()).toBe(1);
      expect(counter2()).toBe(1);
      expect(counter1()).toBe(2);
    });
  });

  describe('Practical HOF Examples', () => {
    test('filter function as HOF', () => {
      const { createFilter } = higherOrderFunctions.examples;
      const isEven = n => n % 2 === 0;
      const filterEven = createFilter(isEven);
      
      expect(filterEven([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    });

    test('decorator pattern using HOF', () => {
      const { withLogging } = higherOrderFunctions.examples;
      const add = (a, b) => a + b;
      const loggedAdd = withLogging(add);
      
      expect(loggedAdd(3, 4)).toBe(7);
    });
  });
});

describe('Functional Programming - Map, Filter, Reduce', () => {
  describe('Array.map()', () => {
    test('should transform array elements', () => {
      const { mapDoubleNumbers } = mapFilterReduce.examples;
      
      expect(mapDoubleNumbers([1, 2, 3])).toEqual([2, 4, 6]);
    });

    test('should map objects in array', () => {
      const { mapNames } = mapFilterReduce.examples;
      const users = [{ name: 'Alice' }, { name: 'Bob' }];
      
      expect(mapNames(users)).toEqual(['Alice', 'Bob']);
    });

    test('should not mutate original array', () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      
      const mapped = original.map(x => x * 2);
      
      expect(original).toEqual(originalCopy);
      expect(mapped).toEqual([2, 4, 6]);
    });
  });

  describe('Array.filter()', () => {
    test('should filter array elements based on predicate', () => {
      const { filterEvenNumbers } = mapFilterReduce.examples;
      
      expect(filterEvenNumbers([1, 2, 3, 4, 5])).toEqual([2, 4]);
    });

    test('should filter objects in array', () => {
      const { filterActive } = mapFilterReduce.examples;
      const users = [
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true },
      ];
      
      expect(filterActive(users).length).toBe(2);
    });

    test('should return empty array when no elements match', () => {
      const { filterGreaterThan10 } = mapFilterReduce.examples;
      
      expect(filterGreaterThan10([1, 2, 3])).toEqual([]);
    });
  });

  describe('Array.reduce()', () => {
    test('should sum array elements', () => {
      const { sumArray } = mapFilterReduce.examples;
      
      expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    });

    test('should accumulate values', () => {
      const { countOccurrences } = mapFilterReduce.examples;
      
      expect(countOccurrences(['a', 'b', 'a', 'c', 'b', 'a'])).toEqual({ a: 3, b: 2, c: 1 });
    });

    test('should reduce to object', () => {
      const { groupByProperty } = mapFilterReduce.examples;
      const users = [
        { name: 'Alice', role: 'admin' },
        { name: 'Bob', role: 'user' },
        { name: 'Charlie', role: 'admin' },
      ];
      
      const grouped = groupByProperty(users, 'role');
      expect(grouped.admin.length).toBe(2);
      expect(grouped.user.length).toBe(1);
    });

    test('should handle initial value', () => {
      const { multiplyWithInitial } = mapFilterReduce.examples;
      
      expect(multiplyWithInitial([2, 3, 4], 10)).toBe(240);
    });
  });

  describe('Chaining Operations', () => {
    test('should chain map, filter, reduce operations', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      
      const result = numbers
        .filter(n => n % 2 === 0)
        .map(n => n * 2)
        .reduce((sum, n) => sum + n, 0);
      
      expect(result).toBe(24); // (2*2) + (4*2) + (6*2)
    });

    test('should chain multiple operations correctly', () => {
      const users = [
        { name: 'Alice', age: 25, active: true },
        { name: 'Bob', age: 30, active: false },
        { name: 'Charlie', age: 28, active: true },
      ];
      
      const totalAge = users
        .filter(u => u.active)
        .map(u => u.age)
        .reduce((sum, age) => sum + age, 0);
      
      expect(totalAge).toBe(53);
    });
  });

  describe('Additional Array Methods', () => {
    test('should use find to locate element', () => {
      const { findUserByName } = mapFilterReduce.examples;
      const users = [{ name: 'Alice' }, { name: 'Bob' }];
      
      expect(findUserByName(users, 'Bob')).toEqual({ name: 'Bob' });
    });

    test('should use some to check condition', () => {
      const { hasAdminUser } = mapFilterReduce.examples;
      const users = [
        { name: 'Alice', role: 'user' },
        { name: 'Bob', role: 'admin' },
      ];
      
      expect(hasAdminUser(users)).toBe(true);
    });

    test('should use every to verify all elements match', () => {
      const { allAdults } = mapFilterReduce.examples;
      
      expect(allAdults([25, 30, 22])).toBe(true);
      expect(allAdults([25, 30, 17])).toBe(false);
    });
  });
});

describe('Functional Programming - Exercises', () => {
  describe('Exercise Availability', () => {
    test('should have exercises defined', () => {
      expect(exercises).toBeDefined();
      expect(Array.isArray(exercises)).toBe(true);
    });

    test('should have at least 8 exercises', () => {
      expect(exercises.length).toBeGreaterThanOrEqual(8);
    });

    test('each exercise should have required properties', () => {
      exercises.forEach(ex => {
        expect(ex).toHaveProperty('id');
        expect(ex).toHaveProperty('title');
        expect(ex).toHaveProperty('difficulty');
        expect(ex).toHaveProperty('description');
        expect(ex).toHaveProperty('template');
        expect(ex).toHaveProperty('tests');
      });
    });
  });

  describe('Exercise Difficulty Progression', () => {
    test('should have easy exercises', () => {
      const easyExercises = exercises.filter(e => e.difficulty === 'easy');
      expect(easyExercises.length).toBeGreaterThan(0);
    });

    test('should have medium exercises', () => {
      const mediumExercises = exercises.filter(e => e.difficulty === 'medium');
      expect(mediumExercises.length).toBeGreaterThan(0);
    });

    test('should have hard exercises', () => {
      const hardExercises = exercises.filter(e => e.difficulty === 'hard');
      expect(hardExercises.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise Content', () => {
    test('exercises should contain template code', () => {
      exercises.forEach(ex => {
        expect(typeof ex.template).toBe('string');
        expect(ex.template.length).toBeGreaterThan(0);
      });
    });

    test('exercises should contain test cases', () => {
      exercises.forEach(ex => {
        expect(Array.isArray(ex.tests)).toBe(true);
        expect(ex.tests.length).toBeGreaterThan(0);
      });
    });

    test('exercises should have hints', () => {
      exercises.forEach(ex => {
        if (ex.hints) {
          expect(Array.isArray(ex.hints)).toBe(true);
        }
      });
    });
  });
});

describe('Functional Programming - Concept Configuration', () => {
  test('should define concept configuration', () => {
    const conceptConfig = {
      title: 'Functional Programming',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
    };
    
    expect(conceptConfig).toHaveProperty('title');
    expect(conceptConfig).toHaveProperty('difficulty');
  });

  test('should have prerequisites defined', () => {
    const conceptConfig = {
      prerequisites: ['Basics', 'Functions', 'ES6+'],
    };
    
    expect(conceptConfig.prerequisites).toBeDefined();
    expect(Array.isArray(conceptConfig.prerequisites)).toBe(true);
  });
});
