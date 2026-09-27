// File: src/concepts/oop/index.js
// Object-Oriented Programming - Classes, inheritance, and the prototype model in JavaScript

/* eslint-disable max-classes-per-file -- this module intentionally defines many small example classes */

import { classesContent } from './classes.js';
import { inheritanceContent } from './inheritance.js';
import { prototypesContent } from './prototypes.js';

export const oopConfig = {
  title: 'OOP',
  description: 'Model programs as collaborating objects using classes, inheritance, and prototypes',
  difficulty: 'intermediate',
  estimatedTime: '4-5 hours',
  topics: [
    'Class Fundamentals',
    'Constructors & Instance Methods',
    'Static Members & Getters/Setters',
    'Inheritance with extends & super',
    'Method Overriding & Polymorphism',
    'Prototypes & the Prototype Chain',
    'Object.create() & Constructor Functions'
  ],
  prerequisites: ['Basics', 'Functions', 'ES6+']
};

// Alias so callers can import the generic name used across concept modules
export const conceptConfig = oopConfig;

// ---------------------------------------------------------------------------
// Runnable example classes for Class Fundamentals
// ---------------------------------------------------------------------------

class PersonClass {
  static species = 'Homo sapiens';

  #nickname; // Private backing field for the nickname accessor pair

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }

  getAge() {
    return this.age;
  }

  // Getter: accessed like a property, computed on demand
  get isAdult() {
    return this.age >= 18;
  }

  // Setter: validates before writing to a backing field
  set nickname(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new TypeError('nickname must be a non-empty string');
    }
    this.#nickname = value.trim();
  }

  get nickname() {
    return this.#nickname ?? this.name;
  }

  // Returning `this` enables fluent method chaining: p.birthday().rename('X')
  birthday() {
    this.age += 1;
    return this;
  }

  rename(newName) {
    this.name = newName;
    return this;
  }

  // Static factory: belongs to the class, not to any instance
  static createMultiple(count, namePrefix = 'Person') {
    return Array.from({ length: count }, (_, i) => new PersonClass(`${namePrefix}${i + 1}`, 20 + i));
  }

  static compareByAge(a, b) {
    return a.age - b.age;
  }

  toString() {
    return `${this.name} (${this.age})`;
  }
}

class CarClass {
  #mileage = 0; // Private field: only accessible inside the class body

  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  drive(distance) {
    if (distance < 0) {
      throw new RangeError('distance cannot be negative');
    }
    this.#mileage += distance;
    return this;
  }

  get mileage() {
    return this.#mileage;
  }

  get age() {
    return new Date().getFullYear() - this.year;
  }

  describe() {
    return `${this.year} ${this.brand} ${this.model} with ${this.#mileage} km on the clock`;
  }

  static fromObject({ brand, model, year }) {
    return new CarClass(brand, model, year);
  }
}

// A minimal bank account illustrating encapsulation with private state and invariants
class BankAccount {
  #balance;

  #transactions = [];

  constructor(owner, openingBalance = 0) {
    if (openingBalance < 0) {
      throw new RangeError('opening balance cannot be negative');
    }
    this.owner = owner;
    this.#balance = openingBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new RangeError('deposit must be positive');
    }
    this.#balance += amount;
    this.#transactions.push({ type: 'deposit', amount });
    return this;
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new RangeError('withdrawal must be positive');
    }
    if (amount > this.#balance) {
      throw new Error('insufficient funds');
    }
    this.#balance -= amount;
    this.#transactions.push({ type: 'withdraw', amount });
    return this;
  }

  get balance() {
    return this.#balance;
  }

  get history() {
    // Return a copy so callers cannot mutate internal state
    return this.#transactions.map(t => ({ ...t }));
  }
}

export const classFundamentals = {
  concept: 'Class Fundamentals',
  title: 'Class Fundamentals',
  explanation: `
    A class is a blueprint for creating objects that share the same shape and behaviour.
    The 'constructor' runs once per 'new' expression and initialises instance state.
    Methods declared in the class body are placed on the class's prototype, so every
    instance shares a single copy of each method rather than carrying its own.

    Classes also support:
      - Static members ('static'), which belong to the class itself and are used for
        factories, registries, and utility helpers that do not need an instance.
      - Accessors ('get'/'set'), which expose computed or validated properties while
        keeping property-style access for callers.
      - Private fields ('#field'), which are enforced by the language and cannot be
        read or written from outside the class body, giving true encapsulation.
      - Fluent interfaces, where a method returns 'this' so calls can be chained.

    Note on 'this': a method's 'this' is determined by how it is called. Extracting a
    method ('const g = person.greet') and calling 'g()' loses the binding. Use '.bind',
    an arrow-function wrapper, or a class field arrow function when a method must be
    passed around as a callback.
  `,
  keyPoints: [
    'Class declarations are not hoisted like function declarations: define before use.',
    'Methods live on the prototype and are shared by all instances.',
    'Static methods are called on the class (PersonClass.createMultiple), not on instances.',
    'Getters/setters let you compute or validate values without changing the call site.',
    'Private fields (#name) are enforced at runtime, unlike the _underscore convention.',
    'Return this from mutating methods to enable method chaining.'
  ],
  examples: {
    PersonClass,
    CarClass,
    BankAccount,
    classSyntax: `
class Person {
  static species = 'Homo sapiens';   // static field (shared by the class)
  #secret = 'hidden';                // private field (not accessible outside)

  constructor(name, age) {           // runs on 'new Person(...)'
    this.name = name;
    this.age = age;
  }

  greet() {                          // instance method (on Person.prototype)
    return \`Hello, my name is \${this.name}\`;
  }

  get isAdult() {                    // getter: person.isAdult (no parentheses)
    return this.age >= 18;
  }

  static create(name, age) {         // static factory: Person.create(...)
    return new Person(name, age);
  }
}

const alice = Person.create('Alice', 30);
alice.greet();        // 'Hello, my name is Alice'
alice.isAdult;        // true
Person.species;       // 'Homo sapiens'
typeof alice.greet;   // 'function'
Object.keys(alice);   // ['name', 'age']  -- methods are not own properties
    `,
    thisBinding: `
class Counter {
  count = 0;

  increment() {          // regular method: 'this' depends on call site
    this.count += 1;
    return this.count;
  }

  incrementArrow = () => { // class-field arrow: 'this' is captured lexically
    this.count += 1;
    return this.count;
  };
}

const c = new Counter();
const detached = c.increment;
// detached();            // TypeError: cannot read 'count' of undefined
const bound = c.increment.bind(c);
bound();                  // 1
const arrow = c.incrementArrow;
arrow();                  // 2 -- still works, 'this' was captured
    `,
    methodChaining: `
const account = new BankAccount('Dana', 100)
  .deposit(50)
  .withdraw(30)
  .deposit(5);

account.balance;          // 125
account.history.length;   // 3
    `
  },
  content: classesContent
};

// ---------------------------------------------------------------------------
// Runnable example classes for Inheritance
// ---------------------------------------------------------------------------

class Vehicle {
  constructor(brand, wheels) {
    this.brand = brand;
    this.wheels = wheels;
  }

  getBrand() {
    return `Brand: ${this.brand}`;
  }

  describe() {
    return `A ${this.brand} vehicle with ${this.wheels} wheels`;
  }

  start() {
    return `${this.brand} engine started`;
  }

  static isVehicle(obj) {
    return obj instanceof Vehicle;
  }
}

class Car extends Vehicle {
  constructor(brand, wheels = 4, doors = 4) {
    super(brand, wheels); // must run before 'this' is touched in a derived constructor
    this.doors = doors;
  }

  // Method override: replaces the parent's implementation for Car instances
  describe() {
    return `A ${this.brand} car with ${this.wheels} wheels and ${this.doors} doors`;
  }

  honk() {
    return 'Beep beep!';
  }
}

class Truck extends Vehicle {
  constructor(brand, wheels, payloadKg) {
    super(brand, wheels);
    this.payloadKg = payloadKg;
  }

  // Override that extends rather than replaces the parent's behaviour via super.method()
  describe() {
    return `${super.describe()} that can haul ${this.payloadKg} kg`;
  }

  start() {
    return `${super.start()} (diesel warm-up complete)`;
  }
}

// Three-level hierarchy: Vehicle -> Car -> ElectricCar
class ElectricCar extends Car {
  constructor(brand, batteryKwh) {
    super(brand, 4, 4);
    this.batteryKwh = batteryKwh;
  }

  describe() {
    return `${super.describe()} powered by a ${this.batteryKwh} kWh battery`;
  }

  start() {
    return `${this.brand} silently powered on`;
  }
}

// Abstract-style base class: enforces that subclasses implement area()
class Shape {
  constructor(name) {
    if (new.target === Shape) {
      throw new TypeError('Shape is abstract and cannot be instantiated directly');
    }
    this.name = name;
  }

  area() {
    throw new Error(`${this.constructor.name} must implement area()`);
  }

  toString() {
    return `${this.name} with area ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super('Circle');
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super('Rectangle');
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// Polymorphism: the same call site dispatches to each subclass's own implementation
function totalArea(shapes) {
  return shapes.reduce((sum, shape) => sum + shape.area(), 0);
}

// Mixins: compose behaviour into a class without a deep inheritance chain
const Serializable = Base => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }
};

const Comparable = Base => class extends Base {
  equals(other) {
    return JSON.stringify(this) === JSON.stringify(other);
  }
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class SerializablePoint extends Serializable(Comparable(Point)) {}

export const inheritance = {
  concept: 'Inheritance',
  title: 'Inheritance',
  explanation: `
    Inheritance lets a class ('subclass' or 'derived class') reuse and specialise the
    behaviour of another class ('superclass' or 'base class'). The 'extends' keyword wires
    the subclass's prototype chain to the superclass, so any method not found on the
    subclass is looked up on the parent.

    In a derived constructor, 'super(...)' must be called before 'this' is used; it invokes
    the parent constructor so the parent's state is initialised first. 'super.method()' calls
    the parent's version of a method, which is how a subclass can extend rather than fully
    replace inherited behaviour.

    Overriding a method and relying on dynamic dispatch is what makes polymorphism work: the
    same 'shape.area()' call runs different code depending on the runtime type of 'shape'.
    'instanceof' walks the prototype chain, so an ElectricCar is also a Car and a Vehicle.

    Prefer shallow hierarchies. Deep inheritance trees are fragile; composition and mixins
    (functions that return a class extending a base) are often a better fit for cross-cutting
    behaviour such as serialisation or logging.
  `,
  keyPoints: [
    'extends links Child.prototype to Parent.prototype and Child to Parent (for statics).',
    'super() must be called before this in a derived constructor.',
    'super.method() lets an override reuse the parent implementation.',
    'instanceof checks the entire prototype chain, not just the direct class.',
    'new.target lets a base class detect and forbid direct instantiation.',
    'Favour composition and mixins over deep inheritance hierarchies.'
  ],
  examples: {
    Vehicle,
    Car,
    Truck,
    ElectricCar,
    Shape,
    Circle,
    Rectangle,
    totalArea,
    Serializable,
    Comparable,
    Point,
    SerializablePoint,
    extendsAndSuper: `
class Vehicle {
  constructor(brand, wheels) {
    this.brand = brand;
    this.wheels = wheels;
  }
  describe() {
    return \`A \${this.brand} vehicle with \${this.wheels} wheels\`;
  }
}

class Truck extends Vehicle {
  constructor(brand, wheels, payloadKg) {
    super(brand, wheels);          // 1. initialise the Vehicle part first
    this.payloadKg = payloadKg;    // 2. then add Truck-specific state
  }
  describe() {
    return \`\${super.describe()} that can haul \${this.payloadKg} kg\`;
  }
}

const t = new Truck('Volvo', 8, 5000);
t.describe();            // 'A Volvo vehicle with 8 wheels that can haul 5000 kg'
t instanceof Truck;      // true
t instanceof Vehicle;    // true
Object.getPrototypeOf(Truck.prototype) === Vehicle.prototype; // true
    `,
    polymorphism: `
const shapes = [new Circle(1), new Rectangle(2, 3)];
shapes.map(s => s.toString());
// ['Circle with area 3.14', 'Rectangle with area 6.00']
totalArea(shapes);       // 9.14159...
// new Shape('x');       // TypeError: Shape is abstract
    `,
    mixins: `
const Serializable = Base => class extends Base {
  serialize() { return JSON.stringify(this); }
};

class Point { constructor(x, y) { this.x = x; this.y = y; } }
class SerializablePoint extends Serializable(Point) {}

new SerializablePoint(1, 2).serialize(); // '{"x":1,"y":2}'
    `
  },
  content: inheritanceContent
};

// ---------------------------------------------------------------------------
// Runnable examples for Prototypes
// ---------------------------------------------------------------------------

// Pre-ES2015 constructor function: the pattern that 'class' syntax desugars to
function PersonConstructor(name, age) {
  this.name = name;
  this.age = age;
}

PersonConstructor.prototype.greet = function greet() {
  return `Hi, I'm ${this.name}`;
};

PersonConstructor.prototype.getAge = function getAge() {
  return this.age;
};

PersonConstructor.prototype.haveBirthday = function haveBirthday() {
  this.age += 1;
  return this;
};

// Prototypal inheritance without classes
function EmployeeConstructor(name, age, role) {
  PersonConstructor.call(this, name, age); // borrow the parent constructor
  this.role = role;
}

EmployeeConstructor.prototype = Object.create(PersonConstructor.prototype);
EmployeeConstructor.prototype.constructor = EmployeeConstructor; // restore constructor link

EmployeeConstructor.prototype.greet = function greet() {
  return `${PersonConstructor.prototype.greet.call(this)}, a ${this.role}`;
};

// Object.create: build objects directly from a prototype object (no constructor needed)
const animalProto = {
  init(name, sound) {
    this.name = name;
    this.sound = sound;
    return this;
  },
  speak() {
    return `${this.name} says ${this.sound}`;
  }
};

function createAnimal(name, sound) {
  return Object.create(animalProto).init(name, sound);
}

// Walk the prototype chain and report each link
function getPrototypeChain(obj) {
  const chain = [];
  let current = Object.getPrototypeOf(obj);
  while (current !== null) {
    chain.push(current.constructor?.name ?? '(anonymous)');
    current = Object.getPrototypeOf(current);
  }
  return chain;
}

// Distinguish own properties from inherited ones
function describeProperties(obj) {
  const own = [];
  const inherited = [];
  // eslint-disable-next-line guard-for-in
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      own.push(key);
    } else {
      inherited.push(key);
    }
  }
  return { own, inherited };
}

export const prototypes = {
  concept: 'Prototypes',
  title: 'Prototypes & the Prototype Chain',
  explanation: `
    JavaScript objects inherit from other objects, not from classes. Every object has an
    internal [[Prototype]] link (readable with Object.getPrototypeOf). When a property is
    not found on an object, the engine follows this link, then the next, until it reaches
    null. That linked sequence is the prototype chain.

    A constructor function's 'prototype' property is the object that will become the
    [[Prototype]] of every instance created with 'new'. Methods placed there are shared by
    all instances, which is memory efficient and is exactly what 'class' syntax does behind
    the scenes. 'instance.constructor' resolves through the chain to the function that built it.

    Object.create(proto) creates a new object with 'proto' as its prototype, which is the
    most direct way to express prototypal inheritance. Before 'class', subclassing meant
    'Child.prototype = Object.create(Parent.prototype)' and restoring 'constructor'.

    Never add properties to Object.prototype: every object in the program would inherit
    them, breaking 'for...in' loops and third-party code. This is the root of prototype
    pollution vulnerabilities, where untrusted input keyed by '__proto__' can mutate the
    shared prototype.
  `,
  keyPoints: [
    'Property lookup walks [[Prototype]] links until it finds the key or hits null.',
    'Constructor.prototype becomes the [[Prototype]] of every instance created with new.',
    'Methods on the prototype are shared: p1.greet === p2.greet.',
    'Object.create(proto) creates an object whose prototype is proto.',
    'Restore .constructor after replacing a prototype object.',
    'Never mutate Object.prototype; guard against __proto__ keys in untrusted input.'
  ],
  examples: {
    PersonConstructor,
    EmployeeConstructor,
    animalProto,
    createAnimal,
    getPrototypeChain,
    describeProperties,
    constructorPattern: `
function Person(name, age) {
  this.name = name;      // own property, unique per instance
  this.age = age;
}

Person.prototype.greet = function () {   // shared by all instances
  return \`Hi, I'm \${this.name}\`;
};

const a = new Person('Ann', 30);
const b = new Person('Ben', 25);

a.greet === b.greet;                        // true (same function object)
Object.getPrototypeOf(a) === Person.prototype; // true
a.constructor === Person;                   // true (found via the chain)
a.hasOwnProperty('greet');                  // false -- it is inherited
    `,
    prototypeChain: `
// a -> Person.prototype -> Object.prototype -> null
getPrototypeChain(new Person('Ann', 30));   // ['Person', 'Object']
getPrototypeChain([]);                      // ['Array', 'Object']
getPrototypeChain(Object.create(null));     // []  (no prototype at all)
    `,
    objectCreate: `
const animalProto = {
  speak() { return \`\${this.name} says \${this.sound}\`; }
};
const dog = Object.create(animalProto);
dog.name = 'Rex';
dog.sound = 'woof';
dog.speak();                                // 'Rex says woof'
Object.getPrototypeOf(dog) === animalProto; // true
    `,
    prototypePollution: `
// DANGEROUS: affects every object in the runtime
// Object.prototype.isAdmin = true;
// ({}).isAdmin  -> true  (!!)

// Guard when merging untrusted objects
function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    target[key] = source[key];
  }
  return target;
}
    `
  },
  content: prototypesContent
};

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

function safely(fn) {
  try {
    return fn();
  } catch {
    return false;
  }
}

export const exercises = [
  {
    id: 1,
    title: 'Define a Book Class',
    difficulty: 'easy',
    description: 'Create a class Book with a constructor taking title, author, and pages. Add a summary() method that returns "<title> by <author>, <pages> pages".',
    template: `
// Define a class named Book
class Book {
  constructor(title, author, pages) {
    // Your code here
  }

  summary() {
    // Your code here
  }
}
    `,
    tests: [
      {
        description: 'Constructor should assign title, author, and pages',
        check: (code, Book) => safely(() => {
          const b = new Book('Dune', 'Herbert', 412);
          return b.title === 'Dune' && b.author === 'Herbert' && b.pages === 412;
        })
      },
      {
        description: 'summary() should return the formatted string',
        check: (code, Book) => safely(() => new Book('Dune', 'Herbert', 412).summary() === 'Dune by Herbert, 412 pages')
      }
    ],
    hints: ['Assign each constructor parameter to this.<name>', 'Use a template literal in summary()']
  },
  {
    id: 2,
    title: 'Extend Animal into Dog',
    difficulty: 'easy',
    description: 'Given a base class Animal with speak() returning "<name> makes a sound", create class Dog that extends Animal and overrides speak() to return "<name> barks".',
    template: `
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return \`\${this.name} makes a sound\`;
  }
}

// Create Dog extending Animal and override speak()
class Dog extends Animal {
  // Your code here
}
    `,
    tests: [
      {
        description: 'Dog instance should inherit the name property',
        check: (code, Dog) => safely(() => new Dog('Rex').name === 'Rex')
      },
      {
        description: 'Dog.speak() should return "<name> barks"',
        check: (code, Dog) => safely(() => new Dog('Rex').speak() === 'Rex barks')
      },
      {
        description: 'Dog should be an instance of Animal',
        check: (code, Dog, Animal) => safely(() => new Dog('Rex') instanceof Animal)
      }
    ],
    hints: ['You do not need a constructor if it only calls super with the same arguments', 'Define speak() in Dog to override the parent version']
  },
  {
    id: 3,
    title: 'Fluent Query Builder',
    difficulty: 'medium',
    description: 'Implement class QueryBuilder with methods select(fields), from(table), where(condition) that each return this, and build() that returns "SELECT <fields> FROM <table> WHERE <condition>".',
    template: `
class QueryBuilder {
  // Store the parts of the query as instance state

  select(fields) {
    // Your code here (return this)
  }

  from(table) {
    // Your code here (return this)
  }

  where(condition) {
    // Your code here (return this)
  }

  build() {
    // Your code here
  }
}
    `,
    tests: [
      {
        description: 'Methods should be chainable',
        check: (code, QueryBuilder) => safely(() => {
          const q = new QueryBuilder();
          return q.select('*') === q && q.from('users') === q && q.where('id = 1') === q;
        })
      },
      {
        description: 'build() should produce the full SQL string',
        check: (code, QueryBuilder) => safely(() => {
          const sql = new QueryBuilder()
            .select('name, age')
            .from('users')
            .where('age > 18')
            .build();
          return sql === 'SELECT name, age FROM users WHERE age > 18';
        })
      }
    ],
    hints: ['Each builder method should end with return this', 'Assemble the string in build() using a template literal']
  },
  {
    id: 4,
    title: 'Temperature with Getters and Setters',
    difficulty: 'medium',
    description: 'Create class Temperature that stores celsius. Expose a fahrenheit getter and setter that convert to and from celsius, and throw a RangeError if celsius is set below -273.15.',
    template: `
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    // Your code here
  }

  set fahrenheit(value) {
    // Your code here
  }

  // Add a celsius accessor pair that validates against absolute zero
}
    `,
    tests: [
      {
        description: 'fahrenheit getter should convert from celsius',
        check: (code, Temperature) => safely(() => new Temperature(100).fahrenheit === 212)
      },
      {
        description: 'fahrenheit setter should update celsius',
        check: (code, Temperature) => safely(() => {
          const t = new Temperature(0);
          t.fahrenheit = 32;
          return Math.abs(t.celsius) < 1e-9;
        })
      },
      {
        description: 'Setting celsius below absolute zero should throw',
        check: (code, Temperature) => safely(() => {
          const t = new Temperature(0);
          try {
            t.celsius = -300;
            return false;
          } catch (e) {
            return e instanceof RangeError;
          }
        })
      }
    ],
    hints: ['F = C * 9/5 + 32 and C = (F - 32) * 5/9', 'Store the raw value in a private or underscore-prefixed field so the setter can validate']
  },
  {
    id: 5,
    title: 'Static Registry with Instance Counting',
    difficulty: 'medium',
    description: 'Create class User with a static count that increments on each construction, a static findByName(name) that searches all created users, and a static reset() that clears the registry.',
    template: `
class User {
  static count = 0;
  static #registry = [];

  constructor(name) {
    // Your code here
  }

  static findByName(name) {
    // Your code here
  }

  static reset() {
    // Your code here
  }
}
    `,
    tests: [
      {
        description: 'count should track number of instances',
        check: (code, User) => safely(() => {
          User.reset();
          const a = new User('a');
          const b = new User('b');
          return User.count === 2 && a !== b;
        })
      },
      {
        description: 'findByName should return the matching user',
        check: (code, User) => safely(() => {
          User.reset();
          const u = new User('zoe');
          return User.findByName('zoe') === u && User.findByName('nope') === undefined;
        })
      }
    ],
    hints: ['Static members are accessed via the class name: User.count', 'Push this into the registry inside the constructor']
  },
  {
    id: 6,
    title: 'Constructor Function and Prototype',
    difficulty: 'medium',
    description: 'Without using the class keyword, write a constructor function Counter that starts at 0, and add increment() and getValue() to its prototype. increment() must return the counter for chaining.',
    template: `
function Counter() {
  // Your code here
}

// Add methods to Counter.prototype (do NOT define them inside the constructor)
    `,
    tests: [
      {
        description: 'Methods should live on the prototype and be shared',
        check: (code, Counter) => safely(() => {
          const first = new Counter();
          const second = new Counter();
          return first.increment === second.increment
            && Object.prototype.hasOwnProperty.call(Counter.prototype, 'increment');
        })
      },
      {
        description: 'increment() should be chainable and getValue() correct',
        check: (code, Counter) => safely(() => new Counter().increment().increment().getValue() === 2)
      }
    ],
    hints: ['Counter.prototype.increment = function () { ... }', 'Return this from increment()']
  },
  {
    id: 7,
    title: 'Abstract Shape Hierarchy with Polymorphism',
    difficulty: 'hard',
    description: 'Implement an abstract Shape class that throws when instantiated directly and whose area() throws if not overridden. Create Circle(r) and Square(side) subclasses and a function largest(shapes) that returns the shape with the greatest area.',
    template: `
class Shape {
  constructor() {
    // Throw a TypeError if new.target === Shape
  }

  area() {
    // Throw an Error: subclasses must implement area()
  }
}

class Circle extends Shape {
  // Your code here
}

class Square extends Shape {
  // Your code here
}

function largest(shapes) {
  // Your code here
}
    `,
    tests: [
      {
        description: 'Shape cannot be instantiated directly',
        check: (code, ShapeClass) => safely(() => {
          try {
            // eslint-disable-next-line no-new
            new ShapeClass();
            return false;
          } catch (e) {
            return e instanceof TypeError;
          }
        })
      },
      {
        description: 'largest() should use polymorphic area() dispatch',
        check: (code, ShapeClass, CircleClass, SquareClass, largestFn) => safely(() => {
          const c = new CircleClass(1);
          const s = new SquareClass(2);
          return largestFn([c, s]) === s && largestFn([new CircleClass(2), s]) instanceof CircleClass;
        })
      }
    ],
    hints: ['new.target is the constructor that was invoked with new', 'Use reduce to find the maximum by area()']
  },
  {
    id: 8,
    title: 'Mixins for Cross-Cutting Behaviour',
    difficulty: 'hard',
    description: 'Write two mixin factories, withTimestamps(Base) adding createdAt on construction and touch() that updates updatedAt, and withValidation(Base) adding validate() that returns true only if all keys in this.required are non-empty on the instance. Compose them onto a Model class.',
    template: `
const withTimestamps = Base => class extends Base {
  // Your code here
};

const withValidation = Base => class extends Base {
  // Your code here
};

class Model {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

class User extends withValidation(withTimestamps(Model)) {
  required = ['name', 'email'];
}
    `,
    tests: [
      {
        description: 'withTimestamps should set createdAt and update updatedAt on touch()',
        check: (code, User) => safely(() => {
          const u = new User({ name: 'a', email: 'b' });
          const before = u.updatedAt;
          u.touch();
          return u.createdAt instanceof Date && u.updatedAt instanceof Date && u.updatedAt !== before;
        })
      },
      {
        description: 'validate() should check required fields',
        check: (code, User) => safely(() => new User({ name: 'a', email: 'b' }).validate() === true
          && new User({ name: 'a' }).validate() === false)
      }
    ],
    hints: ['A mixin is a function that takes a class and returns a new class extending it', 'Call super(...args) in the mixin constructor before touching this']
  },
  {
    id: 9,
    title: 'Safe Deep Merge (Prototype Pollution Guard)',
    difficulty: 'hard',
    description: 'Implement deepMerge(target, source) that recursively merges plain objects without ever assigning the keys __proto__, constructor, or prototype, so untrusted JSON cannot pollute Object.prototype.',
    template: `
function deepMerge(target, source) {
  // Your code here
}
    `,
    tests: [
      {
        description: 'Should merge nested objects',
        check: (code, deepMerge) => safely(() => {
          const out = deepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: 3 });
          return out.a.b === 1 && out.a.c === 2 && out.d === 3;
        })
      },
      {
        description: 'Should ignore __proto__ keys from untrusted input',
        check: (code, deepMerge) => safely(() => {
          const payload = JSON.parse('{"__proto__": {"polluted": true}}');
          deepMerge({}, payload);
          return ({}).polluted === undefined;
        })
      }
    ],
    hints: ['Iterate with Object.keys(source) rather than for...in', 'Skip the three dangerous keys before recursing']
  }
];

// Progress tracking
export const progressConfig = {
  totalConcepts: 3,
  conceptsCompleted: 0,
  exercises: {
    total: exercises.length,
    completed: 0
  },

  updateProgress(conceptId, exerciseId = null) {
    if (exerciseId) {
      this.exercises.completed++;
    } else {
      this.conceptsCompleted++;
    }

    return {
      conceptProgress: (this.conceptsCompleted / this.totalConcepts) * 100,
      exerciseProgress: (this.exercises.completed / this.exercises.total) * 100,
      overallProgress: ((this.conceptsCompleted + this.exercises.completed)
        / (this.totalConcepts + this.exercises.total)) * 100
    };
  }
};

// Export all concepts
export default {
  config: oopConfig,
  concepts: {
    classFundamentals,
    inheritance,
    prototypes
  },
  exercises,
  progress: progressConfig
};
