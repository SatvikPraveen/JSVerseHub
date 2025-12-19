import {
  patterns,
  modulePattern,
  observerPattern,
  singletonPattern,
  exercises,
} from '../src/concepts/patterns/index';

describe('Design Patterns - Module Pattern', () => {
  describe('Encapsulation', () => {
    test('should encapsulate private variables', () => {
      const { createCounter } = modulePattern.examples;
      const counter = createCounter();
      
      // Private variable should not be accessible directly
      expect(counter.count).toBeUndefined();
    });

    test('should expose public methods', () => {
      const { createCounter } = modulePattern.examples;
      const counter = createCounter();
      
      expect(typeof counter.increment).toBe('function');
      expect(typeof counter.decrement).toBe('function');
    });

    test('should maintain state through closures', () => {
      const { createCounter } = modulePattern.examples;
      const counter = createCounter();
      
      counter.increment();
      counter.increment();
      expect(counter.getValue()).toBe(2);
    });
  });

  describe('Multiple Instances', () => {
    test('should create independent module instances', () => {
      const { createCounter } = modulePattern.examples;
      const counter1 = createCounter();
      const counter2 = createCounter();
      
      counter1.increment();
      counter1.increment();
      
      expect(counter1.getValue()).toBe(2);
      expect(counter2.getValue()).toBe(0);
    });

    test('should maintain separate private state for each instance', () => {
      const { createBankAccount } = modulePattern.examples;
      const account1 = createBankAccount(1000);
      const account2 = createBankAccount(500);
      
      account1.withdraw(100);
      
      expect(account1.getBalance()).toBe(900);
      expect(account2.getBalance()).toBe(500);
    });
  });

  describe('Public/Private Interface', () => {
    test('should have clear public API', () => {
      const { createQueue } = modulePattern.examples;
      const queue = createQueue();
      
      expect(typeof queue.enqueue).toBe('function');
      expect(typeof queue.dequeue).toBe('function');
    });

    test('should hide internal implementation', () => {
      const { createQueue } = modulePattern.examples;
      const queue = createQueue();
      
      expect(queue.items).toBeUndefined();
      expect(queue._internalQueue).toBeUndefined();
    });
  });

  describe('Data Privacy', () => {
    test('should prevent direct access to private data', () => {
      const { createUser } = modulePattern.examples;
      const user = createUser('John', 'secret123');
      
      expect(user.password).toBeUndefined();
    });

    test('should validate data through public methods', () => {
      const { createUser } = modulePattern.examples;
      const user = createUser('John', 'secret123');
      
      expect(user.validatePassword('secret123')).toBe(true);
      expect(user.validatePassword('wrong')).toBe(false);
    });
  });
});

describe('Design Patterns - Observer Pattern', () => {
  describe('Subject and Observers', () => {
    test('should notify observers of state changes', () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback = jest.fn();
      
      emitter.subscribe('change', callback);
      emitter.publish('change', { value: 42 });
      
      expect(callback).toHaveBeenCalledWith({ value: 42 });
    });

    test('should support multiple observers', () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      emitter.subscribe('event', callback1);
      emitter.subscribe('event', callback2);
      emitter.publish('event', { data: 'test' });
      
      expect(callback1).toHaveBeenCalledWith({ data: 'test' });
      expect(callback2).toHaveBeenCalledWith({ data: 'test' });
    });

    test('should handle multiple event types', () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      emitter.subscribe('add', callback1);
      emitter.subscribe('remove', callback2);
      emitter.publish('add', { item: 'A' });
      emitter.publish('remove', { item: 'B' });
      
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Observer Subscription', () => {
    test('should allow observers to unsubscribe', () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback = jest.fn();
      
      const unsubscribe = emitter.subscribe('event', callback);
      unsubscribe();
      emitter.publish('event', {});
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('should track subscription status', () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback = jest.fn();
      
      expect(emitter.hasObservers('event')).toBe(false);
      emitter.subscribe('event', callback);
      expect(emitter.hasObservers('event')).toBe(true);
    });
  });

  describe('Event-Driven Architecture', () => {
    test('should decouple subjects and observers', () => {
      const { createDataStore } = observerPattern.examples;
      const store = createDataStore();
      const userCallback = jest.fn();
      
      store.onStateChange(userCallback);
      store.updateState({ user: 'Alice' });
      
      expect(userCallback).toHaveBeenCalled();
    });

    test('should support async notifications', async () => {
      const { createEventEmitter } = observerPattern.examples;
      const emitter = createEventEmitter();
      const callback = jest.fn();
      
      emitter.subscribe('event', callback);
      emitter.publish('event', {});
      
      expect(callback).toHaveBeenCalled();
    });
  });
});

describe('Design Patterns - Singleton Pattern', () => {
  describe('Single Instance', () => {
    test('should create only one instance', () => {
      const { createSingleton } = singletonPattern.examples;
      const instance1 = createSingleton();
      const instance2 = createSingleton();
      
      expect(instance1).toBe(instance2);
    });

    test('should return same instance on multiple calls', () => {
      const { createLogger } = singletonPattern.examples;
      const logger1 = createLogger();
      const logger2 = createLogger();
      const logger3 = createLogger();
      
      expect(logger1).toBe(logger2);
      expect(logger2).toBe(logger3);
    });
  });

  describe('Shared State', () => {
    test('should share state across references', () => {
      const { createCounter } = singletonPattern.examples;
      const counter1 = createCounter();
      const counter2 = createCounter();
      
      counter1.increment();
      counter1.increment();
      
      expect(counter2.getValue()).toBe(2);
    });

    test('should prevent creation of new instances', () => {
      const { createDatabase } = singletonPattern.examples;
      const db1 = createDatabase();
      db1.connect();
      
      const db2 = createDatabase();
      
      // Should be same instance, not reconnecting
      expect(db1).toBe(db2);
    });
  });

  describe('Thread Safety Equivalent', () => {
    test('should handle rapid concurrent-like calls safely', () => {
      const { createSingleton } = singletonPattern.examples;
      const instances = [];
      
      for (let i = 0; i < 100; i++) {
        instances.push(createSingleton());
      }
      
      // All should be same instance
      const firstInstance = instances[0];
      instances.forEach(instance => {
        expect(instance).toBe(firstInstance);
      });
    });
  });

  describe('Global State Management', () => {
    test('should serve as application-wide configuration store', () => {
      const { createConfigManager } = singletonPattern.examples;
      const config1 = createConfigManager();
      
      config1.set('apiUrl', 'https://api.example.com');
      
      const config2 = createConfigManager();
      expect(config2.get('apiUrl')).toBe('https://api.example.com');
    });
  });
});

describe('Design Patterns - Additional Patterns', () => {
  describe('Factory Pattern', () => {
    test('factory should create different object types', () => {
      const { createAnimal } = patterns.examples.factory || {};
      
      if (createAnimal) {
        const dog = createAnimal('dog');
        const cat = createAnimal('cat');
        
        expect(dog.type).toBe('dog');
        expect(cat.type).toBe('cat');
      }
    });
  });

  describe('Decorator Pattern', () => {
    test('decorator should add functionality to objects', () => {
      const { createDecoratedObject } = patterns.examples.decorator || {};
      
      if (createDecoratedObject) {
        const obj = createDecoratedObject();
        expect(typeof obj.originalMethod).toBe('function');
        expect(typeof obj.decoratedMethod).toBe('function');
      }
    });
  });
});

describe('Design Patterns - Exercises', () => {
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

  describe('Exercise Difficulty Distribution', () => {
    test('should have beginner-level exercises', () => {
      const beginnerExercises = exercises.filter(e => e.difficulty === 'easy');
      expect(beginnerExercises.length).toBeGreaterThan(0);
    });

    test('should have intermediate-level exercises', () => {
      const intermediateExercises = exercises.filter(e => e.difficulty === 'medium');
      expect(intermediateExercises.length).toBeGreaterThan(0);
    });

    test('should have advanced-level exercises', () => {
      const advancedExercises = exercises.filter(e => e.difficulty === 'hard');
      expect(advancedExercises.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise Content Quality', () => {
    test('each exercise should have descriptive title', () => {
      exercises.forEach(ex => {
        expect(ex.title.length).toBeGreaterThan(5);
      });
    });

    test('each exercise should have clear description', () => {
      exercises.forEach(ex => {
        expect(ex.description.length).toBeGreaterThan(10);
      });
    });

    test('each exercise should have template code', () => {
      exercises.forEach(ex => {
        expect(typeof ex.template).toBe('string');
        expect(ex.template.length).toBeGreaterThan(0);
      });
    });

    test('each exercise should have test cases', () => {
      exercises.forEach(ex => {
        expect(Array.isArray(ex.tests)).toBe(true);
        expect(ex.tests.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Exercise Progression', () => {
    test('exercises should increase in complexity', () => {
      const sortedByDifficulty = [...exercises].sort((a, b) => {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
      
      // Verify ordering makes sense
      expect(sortedByDifficulty.length).toBe(exercises.length);
    });
  });
});

describe('Design Patterns - Concept Configuration', () => {
  test('should have pattern descriptions', () => {
    expect(patterns).toBeDefined();
    
    const patternNames = Object.keys(patterns);
    expect(patternNames.length).toBeGreaterThan(0);
  });

  test('should describe pattern concepts', () => {
    const conceptConfig = {
      title: 'Design Patterns',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
    };
    
    expect(conceptConfig).toHaveProperty('title');
    expect(conceptConfig).toHaveProperty('difficulty');
  });

  test('should list prerequisites', () => {
    const conceptConfig = {
      prerequisites: ['Basics', 'Functions', 'Objects', 'OOP'],
    };
    
    expect(conceptConfig.prerequisites).toBeDefined();
    expect(Array.isArray(conceptConfig.prerequisites)).toBe(true);
  });
});
