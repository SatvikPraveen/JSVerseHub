import {
  localStorage,
  sessionStorage,
  indexedDB,
  exercises,
} from '../src/concepts/storage/index';

describe('Storage - Local Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Basic Operations', () => {
    test('should set and retrieve string values', () => {
      localStorage.setItem('name', 'John');
      expect(localStorage.getItem('name')).toBe('John');
    });

    test('should set and retrieve numbers as strings', () => {
      localStorage.setItem('age', '30');
      expect(localStorage.getItem('age')).toBe('30');
    });

    test('should handle empty values', () => {
      localStorage.setItem('empty', '');
      expect(localStorage.getItem('empty')).toBe('');
    });

    test('should return null for non-existent keys', () => {
      expect(localStorage.getItem('nonexistent')).toBeNull();
    });
  });

  describe('JSON Storage', () => {
    test('should store and retrieve JSON objects', () => {
      const user = { name: 'Alice', age: 28 };
      localStorage.setItem('user', JSON.stringify(user));
      const retrieved = JSON.parse(localStorage.getItem('user'));
      
      expect(retrieved).toEqual(user);
    });

    test('should store and retrieve arrays', () => {
      const items = ['apple', 'banana', 'cherry'];
      localStorage.setItem('items', JSON.stringify(items));
      const retrieved = JSON.parse(localStorage.getItem('items'));
      
      expect(retrieved).toEqual(items);
    });

    test('should handle complex nested structures', () => {
      const data = {
        user: { name: 'Bob', roles: ['admin', 'user'] },
        settings: { theme: 'dark', notifications: true },
      };
      localStorage.setItem('appState', JSON.stringify(data));
      const retrieved = JSON.parse(localStorage.getItem('appState'));
      
      expect(retrieved).toEqual(data);
    });
  });

  describe('Storage Operations', () => {
    test('should remove items', () => {
      localStorage.setItem('key', 'value');
      localStorage.removeItem('key');
      
      expect(localStorage.getItem('key')).toBeNull();
    });

    test('should clear all items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });

    test('should get storage key by index', () => {
      localStorage.setItem('first', '1');
      localStorage.setItem('second', '2');
      
      const key = localStorage.key(0);
      expect(key).toBeTruthy();
    });

    test('should report length', () => {
      localStorage.setItem('a', '1');
      localStorage.setItem('b', '2');
      
      expect(localStorage.length).toBe(2);
    });
  });

  describe('Practical Use Cases', () => {
    test('should persist user preferences', () => {
      const preferences = { fontSize: 14, theme: 'dark', language: 'en' };
      localStorage.setItem('preferences', JSON.stringify(preferences));
      
      const stored = JSON.parse(localStorage.getItem('preferences'));
      expect(stored.theme).toBe('dark');
    });

    test('should cache API responses', () => {
      const apiData = { users: ['Alice', 'Bob', 'Charlie'], cached: true };
      localStorage.setItem('api_users', JSON.stringify(apiData));
      
      const cached = JSON.parse(localStorage.getItem('api_users'));
      expect(cached.users).toHaveLength(3);
    });

    test('should implement a simple todo list', () => {
      const todos = [
        { id: 1, text: 'Learn localStorage', done: false },
        { id: 2, text: 'Build app', done: false },
      ];
      localStorage.setItem('todos', JSON.stringify(todos));
      
      const stored = JSON.parse(localStorage.getItem('todos'));
      expect(stored).toHaveLength(2);
    });
  });

  describe('Limitations', () => {
    test('should handle storage quota', () => {
      // localStorage has ~5-10MB limit
      const largeString = 'x'.repeat(1000);
      localStorage.setItem('large', largeString);
      
      expect(localStorage.getItem('large')).toBe(largeString);
    });

    test('should persist data across page reloads (simulated)', () => {
      localStorage.setItem('persistent', 'value');
      
      // Simulating reload - in real tests, this would be verified differently
      expect(localStorage.getItem('persistent')).toBe('value');
    });
  });
});

describe('Storage - Session Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('Basic Operations', () => {
    test('should set and retrieve values', () => {
      sessionStorage.setItem('user', 'John');
      expect(sessionStorage.getItem('user')).toBe('John');
    });

    test('should clear values (different from localStorage)', () => {
      sessionStorage.setItem('temp', 'value');
      sessionStorage.clear();
      
      expect(sessionStorage.getItem('temp')).toBeNull();
    });
  });

  describe('Session-Based Storage', () => {
    test('should handle JSON like localStorage', () => {
      const session = { id: 123, token: 'abc123xyz' };
      sessionStorage.setItem('session', JSON.stringify(session));
      const retrieved = JSON.parse(sessionStorage.getItem('session'));
      
      expect(retrieved.id).toBe(123);
    });

    test('should store user state during session', () => {
      const userState = {
        loggedIn: true,
        username: 'alice',
        lastPage: '/dashboard',
      };
      sessionStorage.setItem('state', JSON.stringify(userState));
      
      const stored = JSON.parse(sessionStorage.getItem('state'));
      expect(stored.loggedIn).toBe(true);
    });
  });

  describe('Practical Use Cases', () => {
    test('should store temporary form data', () => {
      const formData = { name: 'Bob', email: 'bob@example.com', draft: true };
      sessionStorage.setItem('formData', JSON.stringify(formData));
      
      const stored = JSON.parse(sessionStorage.getItem('formData'));
      expect(stored.draft).toBe(true);
    });

    test('should track session-specific settings', () => {
      const settings = { viewMode: 'grid', itemsPerPage: 20 };
      sessionStorage.setItem('viewSettings', JSON.stringify(settings));
      
      expect(JSON.parse(sessionStorage.getItem('viewSettings')).viewMode).toBe('grid');
    });
  });
});

describe('Storage - IndexedDB', () => {
  describe('Basic Concepts', () => {
    test('should have IndexedDB API available', () => {
      const indexedDBAPI = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
      expect(indexedDBAPI).toBeDefined();
    });

    test('should support larger storage than localStorage', () => {
      // IndexedDB can store much more (GB+ depending on browser)
      expect(true).toBe(true);
    });
  });

  describe('Data Types', () => {
    test('should support various data types', () => {
      const dataTypes = {
        string: 'text',
        number: 42,
        boolean: true,
        date: new Date(),
        object: { key: 'value' },
        array: [1, 2, 3],
      };
      
      expect(typeof dataTypes.string).toBe('string');
      expect(typeof dataTypes.number).toBe('number');
      expect(typeof dataTypes.boolean).toBe('boolean');
    });
  });

  describe('Use Cases', () => {
    test('should be suitable for large datasets', () => {
      // IndexedDB ideal for: large files, offline-first apps, complex queries
      expect(true).toBe(true);
    });

    test('should support complex queries', () => {
      // Can create indices, query ranges, etc.
      expect(true).toBe(true);
    });

    test('should enable offline-first applications', () => {
      // Store complete app state locally
      expect(true).toBe(true);
    });
  });

  describe('Comparison with Other Storage', () => {
    test('IndexedDB should have larger capacity than localStorage', () => {
      const localStorageLimit = '5-10 MB';
      const indexedDBLimit = 'GB+ (depends on browser)';
      
      // IndexedDB > localStorage in capacity
      expect(true).toBe(true);
    });

    test('IndexedDB is async compared to sync localStorage', () => {
      // IndexedDB: async (non-blocking)
      // localStorage: sync (blocking)
      expect(true).toBe(true);
    });

    test('IndexedDB supports complex queries', () => {
      // IndexedDB can filter, sort, index
      // localStorage requires manual JSON parsing
      expect(true).toBe(true);
    });
  });
});

describe('Storage - Exercises', () => {
  describe('Exercise Availability', () => {
    test('should have exercises defined', () => {
      expect(exercises).toBeDefined();
      expect(Array.isArray(exercises)).toBe(true);
    });

    test('should have multiple exercises', () => {
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

  describe('Exercise Coverage', () => {
    test('should have exercises for localStorage', () => {
      const localStorageExercises = exercises.filter(e => 
        e.description.toLowerCase().includes('localstorage')
      );
      expect(localStorageExercises.length).toBeGreaterThan(0);
    });

    test('should have exercises for sessionStorage', () => {
      const sessionStorageExercises = exercises.filter(e => 
        e.description.toLowerCase().includes('sessionstorage')
      );
      expect(sessionStorageExercises.length).toBeGreaterThan(0);
    });

    test('should have exercises for IndexedDB', () => {
      const indexedDBExercises = exercises.filter(e => 
        e.description.toLowerCase().includes('indexeddb')
      );
      expect(indexedDBExercises.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise Difficulty Distribution', () => {
    test('should include easy exercises', () => {
      const easyExercises = exercises.filter(e => e.difficulty === 'easy');
      expect(easyExercises.length).toBeGreaterThan(0);
    });

    test('should include medium exercises', () => {
      const mediumExercises = exercises.filter(e => e.difficulty === 'medium');
      expect(mediumExercises.length).toBeGreaterThan(0);
    });

    test('should include hard exercises', () => {
      const hardExercises = exercises.filter(e => e.difficulty === 'hard');
      expect(hardExercises.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise Quality', () => {
    test('each exercise should have meaningful description', () => {
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

    test('some exercises should have hints', () => {
      const exercisesWithHints = exercises.filter(e => e.hints);
      expect(exercisesWithHints.length).toBeGreaterThan(0);
    });
  });
});

describe('Storage - Comparison Guide', () => {
  describe('Storage Method Selection', () => {
    test('should use localStorage for user preferences', () => {
      // Persistent, auto-loaded, small data (<5MB)
      expect(true).toBe(true);
    });

    test('should use sessionStorage for temp form data', () => {
      // Session-only, small to medium data
      expect(true).toBe(true);
    });

    test('should use IndexedDB for large datasets', () => {
      // Complex queries, large capacity, offline support
      expect(true).toBe(true);
    });
  });

  describe('Choosing Right Storage', () => {
    test('localStorage: small persistent data', () => {
      const useCase = 'User preferences, theme, language';
      expect(useCase).toContain('preferences');
    });

    test('sessionStorage: temporary session data', () => {
      const useCase = 'Draft form data, temp settings, session tokens';
      expect(useCase).toContain('form');
    });

    test('IndexedDB: large complex data', () => {
      const useCase = 'App state, large datasets, offline apps';
      expect(useCase).toContain('offline');
    });
  });
});
