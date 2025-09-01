// File: src/concepts/oop/prototypes.js
// Object-Oriented Programming - Prototypes in JavaScript

export const prototypesContent = {
  title: "JavaScript Prototypes",
  description: "Understand JavaScript's prototype-based inheritance and object creation",
  
  theory: {
    introduction: `
      JavaScript uses prototype-based inheritance rather than classical inheritance.
      Every object has a prototype, and objects inherit properties and methods from their prototype chain.
      Understanding prototypes is crucial for mastering JavaScript's object model.
    `,
    
    concepts: [
      {
        name: "Prototype Basics",
        explanation: "Every function has a prototype property, and objects have __proto__",
        example: `
// Function constructor approach
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding methods to prototype
Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name} and I'm \${this.age} years old\`;
};

Person.prototype.birthday = function() {
  this.age++;
  console.log(\`\${this.name} is now \${this.age} years old!\`);
};

// Creating instances
const person1 = new Person("Alice", 25);
const person2 = new Person("Bob", 30);

console.log(person1.greet()); // "Hello, I'm Alice and I'm 25 years old"
person2.birthday(); // "Bob is now 31 years old!"

// Both instances share the same methods from prototype
console.log(person1.greet === person2.greet); // true

// Checking prototype relationships
console.log(person1.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
        `
      },
      
      {
        name: "Prototype Chain",
        explanation: "Objects inherit from their prototype's prototype, creating a chain",
        example: `
// Create a base Animal constructor
function Animal(species) {
  this.species = species;
  this.isAlive = true;
}

Animal.prototype.breathe = function() {
  console.log(\`\${this.species} is breathing\`);
};

Animal.prototype.die = function() {
  this.isAlive = false;
  console.log(\`\${this.species} has died\`);
};

// Create Mammal constructor that inherits from Animal
function Mammal(species, furColor) {
  Animal.call(this, species); // Call parent constructor
  this.furColor = furColor;
  this.bodyTemp = "warm";
}

// Set up inheritance by linking prototypes
Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;

// Add Mammal-specific methods
Mammal.prototype.growFur = function() {
  console.log(\`\${this.species} grows \${this.furColor} fur\`);
};

Mammal.prototype.regulateTemp = function() {
  console.log(\`\${this.species} maintains body temperature\`);
};

// Create Dog constructor that inherits from Mammal
function Dog(name, breed, furColor) {
  Mammal.call(this, "Dog", furColor);
  this.name = name;
  this.breed = breed;
  this.loyalty = 100;
}

// Set up inheritance chain
Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function() {
  console.log(\`\${this.name} barks: Woof!\`);
};

Dog.prototype.wagTail = function() {
  console.log(\`\${this.name} wags tail happily\`);
};

// Usage
const myDog = new Dog("Buddy", "Golden Retriever", "golden");

// Methods from Dog
myDog.bark(); // "Buddy barks: Woof!"
myDog.wagTail(); // "Buddy wags tail happily"

// Methods from Mammal
myDog.growFur(); // "Dog grows golden fur"
myDog.regulateTemp(); // "Dog maintains body temperature"

// Methods from Animal
myDog.breathe(); // "Dog is breathing"

// Prototype chain verification
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Mammal); // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true
        `
      },
      
      {
        name: "Object.create() Method",
        explanation: "Modern way to create objects with specific prototypes",
        example: `
// Create a prototype object
const vehiclePrototype = {
  start: function() {
    this.isRunning = true;
    console.log(\`\${this.make} \${this.model} started\`);
  },
  
  stop: function() {
    this.isRunning = false;
    console.log(\`\${this.make} \${this.model} stopped\`);
  },
  
  getInfo: function() {
    return \`\${this.year} \${this.make} \${this.model}\`;
  }
};

// Create objects using Object.create()
const car1 = Object.create(vehiclePrototype);
car1.make = "Toyota";
car1.model = "Camry";
car1.year = 2022;
car1.isRunning = false;

const car2 = Object.create(vehiclePrototype, {
  make: { value: "Honda", writable: true, enumerable: true },
  model: { value: "Civic", writable: true, enumerable: true },
  year: { value: 2021, writable: true, enumerable: true },
  isRunning: { value: false, writable: true, enumerable: true }
});

// Both objects share the same prototype methods
car1.start(); // "Toyota Camry started"
car2.start(); // "Honda Civic started"

console.log(car1.getInfo()); // "2022 Toyota Camry"
console.log(car2.getInfo()); // "2021 Honda Civic"

// Factory function using Object.create
function createVehicle(make, model, year) {
  const vehicle = Object.create(vehiclePrototype);
  vehicle.make = make;
  vehicle.model = model;
  vehicle.year = year;
  vehicle.isRunning = false;
  return vehicle;
}

const bike = createVehicle("Harley", "Sportster", 2020);
bike.start(); // "Harley Sportster started"
        `
      },
      
      {
        name: "Prototype Methods and Properties",
        explanation: "Working with prototype properties and understanding enumerable properties",
        example: `
function Calculator(initialValue = 0) {
  this.value = initialValue;
  this.history = [];
}

// Add methods to prototype
Calculator.prototype.add = function(num) {
  this.history.push(\`\${this.value} + \${num} = \${this.value + num}\`);
  this.value += num;
  return this;
};

Calculator.prototype.subtract = function(num) {
  this.history.push(\`\${this.value} - \${num} = \${this.value - num}\`);
  this.value -= num;
  return this;
};

Calculator.prototype.multiply = function(num) {
  this.history.push(\`\${this.value} × \${num} = \${this.value * num}\`);
  this.value *= num;
  return this;
};

Calculator.prototype.divide = function(num) {
  if (num === 0) throw new Error("Cannot divide by zero");
  this.history.push(\`\${this.value} ÷ \${num} = \${this.value / num}\`);
  this.value /= num;
  return this;
};

Calculator.prototype.clear = function() {
  this.value = 0;
  this.history = [];
  return this;
};

Calculator.prototype.getResult = function() {
  return this.value;
};

Calculator.prototype.showHistory = function() {
  return this.history.join('\\n');
};

// Method chaining example
const calc = new Calculator(10);
calc.add(5).multiply(2).subtract(3).divide(3);

console.log("Result:", calc.getResult()); // 9
console.log("History:\\n" + calc.showHistory());

// Adding properties to prototype
Calculator.prototype.version = "1.0.0";
Calculator.prototype.author = "JavaScript Developer";

// Check what properties are enumerable
console.log("\\nOwn properties:");
for (let prop in calc) {
  if (calc.hasOwnProperty(prop)) {
    console.log(prop, ":", calc[prop]);
  }
}

console.log("\\nPrototype properties:");
for (let prop in calc) {
  if (!calc.hasOwnProperty(prop)) {
    console.log(prop, ":", calc[prop]);
  }
}

// Using Object.getOwnPropertyNames vs Object.keys
console.log("\\nOwn property names:", Object.getOwnPropertyNames(calc));
console.log("Enumerable keys:", Object.keys(calc));
        `
      },
      
      {
        name: "Modifying Built-in Prototypes",
        explanation: "Extending built-in objects (use with caution)",
        example: `
// Extending Array prototype (be careful with this in production!)
Array.prototype.last = function() {
  return this[this.length - 1];
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.unique = function() {
  return [...new Set(this)];
};

Array.prototype.shuffle = function() {
  const shuffled = [...this];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Usage
const numbers = [1, 2, 3, 4, 5, 2, 3];
console.log("First:", numbers.first()); // 1
console.log("Last:", numbers.last()); // 3
console.log("Unique:", numbers.unique()); // [1, 2, 3, 4, 5]
console.log("Shuffled:", numbers.shuffle());

// Extending String prototype
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.reverse = function() {
  return this.split('').reverse().join('');
};

String.prototype.wordCount = function() {
  return this.trim().split(/\\s+/).length;
};

String.prototype.isPalindrome = function() {
  const cleaned = this.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

// Usage
const text = "hello WORLD";
console.log("Capitalized:", text.capitalize()); // "Hello world"
console.log("Reversed:", text.reverse()); // "DLROw olleh"
console.log("Word count:", text.wordCount()); // 2
console.log("Is 'racecar' a palindrome?", "racecar".isPalindrome()); // true

// WARNING: Modifying built-in prototypes can cause conflicts
// Better approach: create utility functions or use a library
const StringUtils = {
  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  reverse: str => str.split('').reverse().join(''),
  wordCount: str => str.trim().split(/\\s+/).length,
  isPalindrome: str => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  }
};

console.log("Safe approach:", StringUtils.capitalize("hello world"));
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Event Emitter System",
      description: "A custom event system using prototype-based inheritance",
      code: `
// Base EventEmitter constructor
function EventEmitter() {
  this.events = {};
}

// Add methods to prototype
EventEmitter.prototype.on = function(eventName, callback) {
  if (!this.events[eventName]) {
    this.events[eventName] = [];
  }
  this.events[eventName].push(callback);
  return this; // Enable chaining
};

EventEmitter.prototype.emit = function(eventName, ...args) {
  if (this.events[eventName]) {
    this.events[eventName].forEach(callback => {
      callback.apply(this, args);
    });
  }
  return this;
};

EventEmitter.prototype.off = function(eventName, callback) {
  if (this.events[eventName]) {
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }
  return this;
};

EventEmitter.prototype.once = function(eventName, callback) {
  const onceCallback = (...args) => {
    callback.apply(this, args);
    this.off(eventName, onceCallback);
  };
  this.on(eventName, onceCallback);
  return this;
};

EventEmitter.prototype.removeAllListeners = function(eventName) {
  if (eventName) {
    delete this.events[eventName];
  } else {
    this.events = {};
  }
  return this;
};

EventEmitter.prototype.listenerCount = function(eventName) {
  return this.events[eventName] ? this.events[eventName].length : 0;
};

// Chat Room that extends EventEmitter
function ChatRoom(name) {
  EventEmitter.call(this); // Call parent constructor
  this.name = name;
  this.users = [];
  this.messages = [];
}

// Set up inheritance
ChatRoom.prototype = Object.create(EventEmitter.prototype);
ChatRoom.prototype.constructor = ChatRoom;

// Add ChatRoom specific methods
ChatRoom.prototype.addUser = function(username) {
  if (!this.users.includes(username)) {
    this.users.push(username);
    this.emit('userJoined', username, this.users.length);
    return true;
  }
  return false;
};

ChatRoom.prototype.removeUser = function(username) {
  const index = this.users.indexOf(username);
  if (index > -1) {
    this.users.splice(index, 1);
    this.emit('userLeft', username, this.users.length);
    return true;
  }
  return false;
};

ChatRoom.prototype.sendMessage = function(username, message) {
  if (this.users.includes(username)) {
    const messageObj = {
      username,
      message,
      timestamp: new Date()
    };
    this.messages.push(messageObj);
    this.emit('message', messageObj);
    return true;
  }
  return false;
};

ChatRoom.prototype.getHistory = function(limit = 10) {
  return this.messages.slice(-limit);
};

// Usage
const chatRoom = new ChatRoom("General");

// Set up event listeners
chatRoom.on('userJoined', (username, userCount) => {
  console.log(`${username} joined the chat. Users online: ${userCount}`);
});

chatRoom.on('userLeft', (username, userCount) => {
  console.log(`${username} left the chat. Users online: ${userCount}`);
});

chatRoom.on('message', (messageObj) => {
  console.log(`[${messageObj.timestamp.toLocaleTimeString()}] ${messageObj.username}: ${messageObj.message}`);
});

// Simulate chat activity
chatRoom.addUser("Alice");
chatRoom.addUser("Bob");
chatRoom.sendMessage("Alice", "Hello everyone!");
chatRoom.sendMessage("Bob", "Hi Alice!");
chatRoom.removeUser("Alice");
      `
    },
    
    {
      title: "Plugin System Architecture",
      description: "Extensible plugin system using prototypes",
      code: `
// Base Plugin constructor
function Plugin(name, version) {
  this.name = name;
  this.version = version;
  this.isEnabled = false;
  this.dependencies = [];
  this.hooks = {};
}

Plugin.prototype.enable = function() {
  if (this.checkDependencies()) {
    this.isEnabled = true;
    this.onEnable();
    console.log(`Plugin "${this.name}" v${this.version} enabled`);
    return true;
  }
  return false;
};

Plugin.prototype.disable = function() {
  this.isEnabled = false;
  this.onDisable();
  console.log(`Plugin "${this.name}" disabled`);
};

Plugin.prototype.checkDependencies = function() {
  return this.dependencies.every(dep => 
    window.pluginManager && window.pluginManager.isPluginEnabled(dep)
  );
};

Plugin.prototype.addHook = function(hookName, callback) {
  if (!this.hooks[hookName]) {
    this.hooks[hookName] = [];
  }
  this.hooks[hookName].push(callback);
};

Plugin.prototype.executeHook = function(hookName, data) {
  if (this.hooks[hookName]) {
    return this.hooks[hookName].reduce((result, hook) => {
      return hook(result);
    }, data);
  }
  return data;
};

// Virtual methods to be overridden
Plugin.prototype.onEnable = function() {};
Plugin.prototype.onDisable = function() {};
Plugin.prototype.install = function() {};
Plugin.prototype.uninstall = function() {};

// Specific plugin types
function SecurityPlugin(name, version) {
  Plugin.call(this, name, version);
  this.securityLevel = 'medium';
  this.blockedIPs = [];
  this.rateLimits = {};
}

SecurityPlugin.prototype = Object.create(Plugin.prototype);
SecurityPlugin.prototype.constructor = SecurityPlugin;

SecurityPlugin.prototype.blockIP = function(ip) {
  if (!this.blockedIPs.includes(ip)) {
    this.blockedIPs.push(ip);
    console.log(`IP ${ip} blocked by ${this.name}`);
  }
};

SecurityPlugin.prototype.setRateLimit = function(endpoint, limit) {
  this.rateLimits[endpoint] = limit;
  console.log(`Rate limit set for ${endpoint}: ${limit} requests/minute`);
};

// Analytics Plugin
function AnalyticsPlugin(name, version) {
  Plugin.call(this, name, version);
  this.events = [];
  this.sessions = {};
}

AnalyticsPlugin.prototype = Object.create(Plugin.prototype);
AnalyticsPlugin.prototype.constructor = AnalyticsPlugin;

AnalyticsPlugin.prototype.trackEvent = function(eventName, data) {
  const event = {
    name: eventName,
    data: data,
    timestamp: Date.now(),
    sessionId: this.getCurrentSessionId()
  };
  this.events.push(event);
  console.log(`Event tracked: ${eventName}`, data);
};

AnalyticsPlugin.prototype.getCurrentSessionId = function() {
  return 'session_' + Date.now();
};

AnalyticsPlugin.prototype.getEventsByName = function(eventName) {
  return this.events.filter(event => event.name === eventName);
};

// Plugin Manager
function PluginManager() {
  this.plugins = new Map();
  this.enabledPlugins = new Set();
}

PluginManager.prototype.register = function(plugin) {
  if (plugin instanceof Plugin) {
    this.plugins.set(plugin.name, plugin);
    console.log(`Plugin "${plugin.name}" registered`);
    return true;
  }
  throw new Error('Invalid plugin object');
};

PluginManager.prototype.enable = function(pluginName) {
  const plugin = this.plugins.get(pluginName);
  if (plugin && plugin.enable()) {
    this.enabledPlugins.add(pluginName);
    return true;
  }
  return false;
};

PluginManager.prototype.disable = function(pluginName) {
  const plugin = this.plugins.get(pluginName);
  if (plugin) {
    plugin.disable();
    this.enabledPlugins.delete(pluginName);
    return true;
  }
  return false;
};

PluginManager.prototype.isPluginEnabled = function(pluginName) {
  return this.enabledPlugins.has(pluginName);
};

PluginManager.prototype.getEnabledPlugins = function() {
  return Array.from(this.enabledPlugins);
};

// Usage
window.pluginManager = new PluginManager();

const securityPlugin = new SecurityPlugin("FirewallGuard", "1.0.0");
const analyticsPlugin = new AnalyticsPlugin("TrackMaster", "2.1.0");

window.pluginManager.register(securityPlugin);
window.pluginManager.register(analyticsPlugin);

window.pluginManager.enable("FirewallGuard");
window.pluginManager.enable("TrackMaster");

securityPlugin.blockIP("192.168.1.100");
analyticsPlugin.trackEvent("pageView", { page: "/home", user: "user123" });
      `
    }
  ],
  
  exercises: [
    {
      id: "prototype-basic",
      title: "Create a Counter with Prototype",
      difficulty: "easy",
      prompt: "Create a Counter constructor with increment, decrement, and reset methods on its prototype.",
      solution: `
function Counter(initialValue = 0) {
  this.value = initialValue;
  this.initialValue = initialValue;
}

Counter.prototype.increment = function(step = 1) {
  this.value += step;
  return this;
};

Counter.prototype.decrement = function(step = 1) {
  this.value -= step;
  return this;
};

Counter.prototype.reset = function() {
  this.value = this.initialValue;
  return this;
};

Counter.prototype.getValue = function() {
  return this.value;
};

Counter.prototype.toString = function() {
  return `Counter: ${this.value}`;
};

// Usage
const counter = new Counter(5);
counter.increment(3).decrement(1).increment(2);
console.log(counter.getValue()); // 9
      `
    },
    
    {
      id: "prototype-intermediate",
      title: "Library Book System",
      difficulty: "medium",
      prompt: "Create a Book constructor and Library constructor with methods to add, remove, and search books using prototypes.",
      solution: `
function Book(title, author, isbn, year) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
  this.year = year;
  this.isAvailable = true;
  this.borrowHistory = [];
}

Book.prototype.borrow = function(borrowerName) {
  if (this.isAvailable) {
    this.isAvailable = false;
    this.borrowHistory.push({
      borrower: borrowerName,
      borrowDate: new Date(),
      returnDate: null
    });
    return true;
  }
  return false;
};

Book.prototype.return = function() {
  if (!this.isAvailable) {
    this.isAvailable = true;
    const lastBorrow = this.borrowHistory[this.borrowHistory.length - 1];
    if (lastBorrow) {
      lastBorrow.returnDate = new Date();
    }
    return true;
  }
  return false;
};

Book.prototype.getInfo = function() {
  return `"${this.title}" by ${this.author} (${this.year}) - ${this.isAvailable ? 'Available' : 'Borrowed'}`;
};

function Library(name) {
  this.name = name;
  this.books = [];
  this.members = [];
}

Library.prototype.addBook = function(book) {
  if (book instanceof Book) {
    this.books.push(book);
    return true;
  }
  return false;
};

Library.prototype.removeBook = function(isbn) {
  const index = this.books.findIndex(book => book.isbn === isbn);
  if (index > -1) {
    this.books.splice(index, 1);
    return true;
  }
  return false;
};

Library.prototype.findBookByTitle = function(title) {
  return this.books.filter(book => 
    book.title.toLowerCase().includes(title.toLowerCase())
  );
};

Library.prototype.findBookByAuthor = function(author) {
  return this.books.filter(book => 
    book.author.toLowerCase().includes(author.toLowerCase())
  );
};

Library.prototype.getAvailableBooks = function() {
  return this.books.filter(book => book.isAvailable);
};

Library.prototype.getBorrowedBooks = function() {
  return this.books.filter(book => !book.isAvailable);
};
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the relationship between an object and its prototype?",
      options: [
        "Objects copy properties from their prototype",
        "Objects inherit properties through the prototype chain",
        "Objects replace their prototype properties",
        "Objects and prototypes are independent"
      ],
      correct: 1,
      explanation: "Objects inherit properties through the prototype chain - they look up the chain when a property is not found on the object itself."
    },
    
    {
      question: "What does Object.create() do?",
      options: [
        "Creates a copy of an existing object",
        "Creates a new object with the specified prototype",
        "Creates a new prototype for an object",
        "Creates a new constructor function"
      ],
      correct: 1,
      explanation: "Object.create() creates a new object with the specified object as its prototype."
    },
    
    {
      question: "What is the correct way to set up inheritance with prototypes?",
      options: [
        "Child.prototype = Parent.prototype",
        "Child.prototype = new Parent()",
        "Child.prototype = Object.create(Parent.prototype)",
        "Child.prototype = Object.assign(Parent.prototype)"
      ],
      correct: 2,
      explanation: "Object.create(Parent.prototype) creates a new object with Parent.prototype as its prototype, avoiding issues with shared references."
    }
  ]
};

export default prototypesContent;