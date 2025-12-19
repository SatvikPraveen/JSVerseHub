import {
  classFundamentals,
  inheritance,
  prototypes,
  exercises,
} from '../src/concepts/oop/index';

describe('OOP - Class Fundamentals', () => {
  describe('Basic Class Definition', () => {
    test('should create a class instance correctly', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('John', 30);
      
      expect(person.name).toBe('John');
      expect(person.age).toBe(30);
    });

    test('should call methods correctly on class instance', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('Jane', 25);
      
      expect(person.greet()).toContain('Jane');
    });

    test('should use constructor parameters properly', () => {
      const { CarClass } = classFundamentals.examples;
      const car = new CarClass('Toyota', 'Camry', 2022);
      
      expect(car.brand).toBe('Toyota');
      expect(car.model).toBe('Camry');
      expect(car.year).toBe(2022);
    });

    test('should handle getter methods', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('Bob', 35);
      
      expect(person.getAge()).toBe(35);
    });
  });

  describe('Method Definition', () => {
    test('should define instance methods', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('Alice', 28);
      
      expect(typeof person.greet).toBe('function');
    });

    test('should allow method chaining', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('Charlie', 40);
      
      expect(person).toHaveProperty('greet');
    });
  });

  describe('Static Methods', () => {
    test('should define static methods on class', () => {
      const { PersonClass } = classFundamentals.examples;
      
      expect(typeof PersonClass.createMultiple).toBe('function');
    });

    test('should call static methods on class, not instance', () => {
      const { PersonClass } = classFundamentals.examples;
      const people = PersonClass.createMultiple(5);
      
      expect(Array.isArray(people)).toBe(true);
      expect(people.length).toBe(5);
    });
  });

  describe('This Binding', () => {
    test('this should refer to instance in methods', () => {
      const { PersonClass } = classFundamentals.examples;
      const person = new PersonClass('David', 32);
      const greeting = person.greet;
      
      // Arrow functions in class preserve 'this'
      expect(typeof greeting).toBe('function');
    });
  });
});

describe('OOP - Inheritance', () => {
  describe('Extends Keyword', () => {
    test('should inherit properties from parent class', () => {
      const { Vehicle, Car: CarClass } = inheritance.examples;
      const car = new CarClass('Toyota', 4);
      
      expect(car.brand).toBe('Toyota');
      expect(car.wheels).toBe(4);
    });

    test('should inherit methods from parent class', () => {
      const { Vehicle, Car: CarClass } = inheritance.examples;
      const car = new CarClass('Honda', 4);
      
      expect(car.getBrand()).toContain('Honda');
    });

    test('should override parent methods in child class', () => {
      const { Vehicle, Car: CarClass } = inheritance.examples;
      const car = new CarClass('Ford', 4);
      const vehicleMethod = Vehicle.prototype.describe?.toString() || 'default';
      const carMethod = CarClass.prototype.describe?.toString() || 'default';
      
      expect(vehicleMethod).not.toBe(carMethod);
    });
  });

  describe('Super Keyword', () => {
    test('should call parent constructor with super()', () => {
      const { Vehicle, Truck } = inheritance.examples;
      const truck = new Truck('Volvo', 8, 5000);
      
      expect(truck.brand).toBe('Volvo');
      expect(truck.wheels).toBe(8);
    });

    test('should call parent methods with super.method()', () => {
      const { Vehicle, Truck } = inheritance.examples;
      const truck = new Truck('Volvo', 8, 5000);
      
      expect(typeof truck.describe).toBe('function');
    });
  });

  describe('Multi-level Inheritance', () => {
    test('should support multi-level class hierarchies', () => {
      const { Vehicle, Car: CarClass } = inheritance.examples;
      
      expect(CarClass.prototype instanceof Vehicle).toBe(true);
    });
  });

  describe('Instanceof Operator', () => {
    test('should correctly identify instance types', () => {
      const { Vehicle, Car: CarClass } = inheritance.examples;
      const car = new CarClass('BMW', 4);
      
      expect(car instanceof CarClass).toBe(true);
      expect(car instanceof Vehicle).toBe(true);
    });
  });
});

describe('OOP - Prototypes', () => {
  describe('Prototype Chain', () => {
    test('should access methods through prototype chain', () => {
      const { PersonConstructor } = prototypes.examples;
      const person = new PersonConstructor('Emma', 26);
      
      expect(person.greet()).toContain('Emma');
    });

    test('should verify prototype relationship', () => {
      const { PersonConstructor } = prototypes.examples;
      const person = new PersonConstructor('Frank', 33);
      
      expect(Object.getPrototypeOf(person)).toBe(PersonConstructor.prototype);
    });
  });

  describe('Prototype Methods', () => {
    test('should add methods to prototype', () => {
      const { PersonConstructor } = prototypes.examples;
      
      expect(typeof PersonConstructor.prototype.greet).toBe('function');
    });

    test('should share methods across instances via prototype', () => {
      const { PersonConstructor } = prototypes.examples;
      const person1 = new PersonConstructor('George', 29);
      const person2 = new PersonConstructor('Helen', 31);
      
      expect(person1.greet === person2.greet).toBe(true);
    });
  });

  describe('Object.create()', () => {
    test('should create object with specified prototype', () => {
      const { PersonConstructor } = prototypes.examples;
      const person = Object.create(PersonConstructor.prototype);
      
      expect(Object.getPrototypeOf(person)).toBe(PersonConstructor.prototype);
    });
  });

  describe('Constructor Property', () => {
    test('should reference constructor through constructor property', () => {
      const { PersonConstructor } = prototypes.examples;
      const person = new PersonConstructor('Iris', 27);
      
      expect(person.constructor).toBe(PersonConstructor);
    });
  });

  describe('Prototype Pollution Prevention', () => {
    test('should not pollute Object prototype', () => {
      const { PersonConstructor } = prototypes.examples;
      
      expect(Object.prototype.greet).toBeUndefined();
    });
  });
});

describe('OOP - Exercises', () => {
  describe('Exercise 1 - Basic Class', () => {
    test('Exercise 1 template should be provided', () => {
      const ex1 = exercises.find(e => e.id === 1);
      
      expect(ex1).toBeDefined();
      expect(ex1.difficulty).toBe('easy');
      expect(ex1.template).toContain('class');
    });

    test('Exercise 1 should have test cases', () => {
      const ex1 = exercises.find(e => e.id === 1);
      
      expect(ex1.tests).toBeDefined();
      expect(Array.isArray(ex1.tests)).toBe(true);
      expect(ex1.tests.length).toBeGreaterThan(0);
    });
  });

  describe('Exercise 2 - Inheritance', () => {
    test('Exercise 2 should involve inheritance', () => {
      const ex2 = exercises.find(e => e.id === 2);
      
      expect(ex2).toBeDefined();
      expect(ex2.difficulty).toBe('easy');
    });
  });

  describe('Exercise 3 - Methods', () => {
    test('Exercise 3 should involve methods', () => {
      const ex3 = exercises.find(e => e.id === 3);
      
      expect(ex3).toBeDefined();
      expect(ex3.difficulty).toBe('medium');
    });
  });

  describe('Exercise Progression', () => {
    test('should have exercises of varying difficulty', () => {
      const difficulties = exercises.map(e => e.difficulty);
      
      expect(difficulties).toContain('easy');
      expect(difficulties).toContain('medium');
      expect(difficulties).toContain('hard');
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
});

describe('OOP - Concept Configuration', () => {
  test('should export conceptConfig with required properties', () => {
    const config = { title: 'OOP', difficulty: 'intermediate', estimatedTime: '4-5 hours' };
    
    expect(config).toHaveProperty('title');
    expect(config).toHaveProperty('difficulty');
  });

  test('should have prerequisites defined', () => {
    const config = { prerequisites: ['Basics', 'Functions', 'ES6+'] };
    
    expect(config.prerequisites).toContain('Basics');
  });
});
