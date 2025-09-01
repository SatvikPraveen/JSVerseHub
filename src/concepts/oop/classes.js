// File: src/concepts/oop/classes.js
// Object-Oriented Programming - Classes in JavaScript

export const classesContent = {
  title: "JavaScript Classes",
  description: "Master ES6 classes and modern object-oriented programming patterns",
  
  theory: {
    introduction: `
      Classes in JavaScript provide a clean syntax for creating objects and handling inheritance.
      They're syntactic sugar over JavaScript's prototype-based inheritance but make OOP more accessible.
    `,
    
    concepts: [
      {
        name: "Class Declaration",
        explanation: "Basic class syntax with constructor and methods",
        example: `
class Spaceship {
  constructor(name, fuel = 100) {
    this.name = name;
    this.fuel = fuel;
    this.speed = 0;
  }
  
  accelerate(amount) {
    if (this.fuel > 0) {
      this.speed += amount;
      this.fuel -= amount * 0.1;
      console.log(\`\${this.name} accelerates to \${this.speed} km/h\`);
    } else {
      console.log("Out of fuel!");
    }
  }
  
  brake() {
    this.speed = Math.max(0, this.speed - 10);
    console.log(\`\${this.name} slows down to \${this.speed} km/h\`);
  }
  
  refuel(amount) {
    this.fuel = Math.min(100, this.fuel + amount);
    console.log(\`\${this.name} refueled. Fuel: \${this.fuel}%\`);
  }
}

// Usage
const enterprise = new Spaceship("Enterprise");
enterprise.accelerate(20);
enterprise.brake();
        `
      },
      
      {
        name: "Static Methods",
        explanation: "Methods that belong to the class itself, not instances",
        example: `
class MathUtils {
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
  
  static factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
  
  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Usage - no need to create instance
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.factorial(5)); // 120
console.log(MathUtils.randomBetween(1, 10));
        `
      },
      
      {
        name: "Private Fields",
        explanation: "Private properties and methods using # syntax",
        example: `
class BankAccount {
  #balance = 0;
  #accountNumber;
  #pin;
  
  constructor(accountNumber, initialPin) {
    this.#accountNumber = accountNumber;
    this.#pin = initialPin;
  }
  
  #validatePin(inputPin) {
    return inputPin === this.#pin;
  }
  
  deposit(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }
    
    if (amount > 0) {
      this.#balance += amount;
      return \`Deposited $\${amount}. New balance: $\${this.#balance}\`;
    }
    throw new Error("Amount must be positive");
  }
  
  withdraw(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }
    
    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }
    
    this.#balance -= amount;
    return \`Withdrew $\${amount}. Remaining balance: $\${this.#balance}\`;
  }
  
  getBalance(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }
    return this.#balance;
  }
}

// Usage
const account = new BankAccount("12345", "1234");
console.log(account.deposit(100, "1234"));
console.log(account.withdraw(30, "1234"));
// console.log(account.#balance); // SyntaxError - cannot access private field
        `
      },
      
      {
        name: "Getters and Setters",
        explanation: "Control access to object properties with get/set",
        example: `
class Temperature {
  constructor(celsius = 0) {
    this._celsius = celsius;
  }
  
  get celsius() {
    return this._celsius;
  }
  
  set celsius(value) {
    if (typeof value !== 'number') {
      throw new Error("Temperature must be a number");
    }
    this._celsius = value;
  }
  
  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }
  
  set fahrenheit(value) {
    if (typeof value !== 'number') {
      throw new Error("Temperature must be a number");
    }
    this._celsius = (value - 32) * 5/9;
  }
  
  get kelvin() {
    return this._celsius + 273.15;
  }
  
  set kelvin(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error("Kelvin must be a positive number");
    }
    this._celsius = value - 273.15;
  }
  
  toString() {
    return \`\${this._celsius}°C / \${this.fahrenheit.toFixed(1)}°F / \${this.kelvin.toFixed(1)}K\`;
  }
}

// Usage
const temp = new Temperature(25);
console.log(temp.toString()); // 25°C / 77.0°F / 298.2K

temp.fahrenheit = 100;
console.log(temp.celsius); // 37.78
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Game Character System",
      description: "A complete character class for a game",
      code: `
class GameCharacter {
  constructor(name, characterClass) {
    this.name = name;
    this.class = characterClass;
    this.level = 1;
    this.experience = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.mana = 50;
    this.maxMana = 50;
    this.inventory = [];
    this.skills = [];
  }
  
  gainExperience(amount) {
    this.experience += amount;
    const experienceNeeded = this.level * 100;
    
    if (this.experience >= experienceNeeded) {
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.experience = 0;
    this.maxHealth += 20;
    this.maxMana += 10;
    this.health = this.maxHealth; // Full heal on level up
    this.mana = this.maxMana;
    
    console.log(\`\${this.name} reached level \${this.level}!\`);
  }
  
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    console.log(\`\${this.name} takes \${amount} damage. HP: \${this.health}/\${this.maxHealth}\`);
    
    if (this.health === 0) {
      console.log(\`\${this.name} has been defeated!\`);
    }
  }
  
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    console.log(\`\${this.name} heals for \${amount}. HP: \${this.health}/\${this.maxHealth}\`);
  }
  
  addItem(item) {
    this.inventory.push(item);
    console.log(\`\${this.name} obtained: \${item.name}\`);
  }
  
  getStats() {
    return {
      name: this.name,
      class: this.class,
      level: this.level,
      health: \`\${this.health}/\${this.maxHealth}\`,
      mana: \`\${this.mana}/\${this.maxMana}\`,
      experience: this.experience,
      inventoryCount: this.inventory.length
    };
  }
}

// Usage
const hero = new GameCharacter("Aragorn", "Ranger");
hero.gainExperience(150);
hero.takeDamage(30);
hero.heal(15);
hero.addItem({ name: "Iron Sword", damage: 25 });
console.log(hero.getStats());
      `
    },
    
    {
      title: "Task Management System",
      description: "A task manager with priority and status tracking",
      code: `
class Task {
  static #idCounter = 1;
  
  constructor(title, description, priority = 'medium') {
    this.id = Task.#idCounter++;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = 'pending';
    this.createdAt = new Date();
    this.completedAt = null;
  }
  
  complete() {
    this.status = 'completed';
    this.completedAt = new Date();
    console.log(\`Task "\${this.title}" completed!\`);
  }
  
  updatePriority(newPriority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (validPriorities.includes(newPriority)) {
      this.priority = newPriority;
    } else {
      throw new Error('Invalid priority level');
    }
  }
  
  getDuration() {
    if (this.completedAt) {
      return this.completedAt - this.createdAt;
    }
    return Date.now() - this.createdAt;
  }
  
  toString() {
    const duration = this.getDuration();
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return \`[\${this.status.toUpperCase()}] \${this.title} (\${this.priority}) - \${days} days\`;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
  }
  
  addTask(title, description, priority) {
    const task = new Task(title, description, priority);
    this.tasks.push(task);
    return task;
  }
  
  getTaskById(id) {
    return this.tasks.find(task => task.id === id);
  }
  
  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }
  
  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }
  
  completeTask(id) {
    const task = this.getTaskById(id);
    if (task) {
      task.complete();
    }
  }
  
  getSummary() {
    const summary = {
      total: this.tasks.length,
      pending: this.getTasksByStatus('pending').length,
      completed: this.getTasksByStatus('completed').length
    };
    
    summary.completionRate = summary.total > 0 
      ? ((summary.completed / summary.total) * 100).toFixed(1) + '%'
      : '0%';
      
    return summary;
  }
}

// Usage
const taskManager = new TaskManager();
taskManager.addTask("Learn JavaScript Classes", "Complete the OOP section", "high");
taskManager.addTask("Build a project", "Create a real-world application", "medium");
taskManager.completeTask(1);

console.log(taskManager.getSummary());
      `
    }
  ],
  
  exercises: [
    {
      id: "class-basic",
      title: "Create a Book Class",
      difficulty: "easy",
      prompt: "Create a Book class with title, author, pages, and currentPage properties. Add methods to read pages and get reading progress.",
      solution: `
class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.currentPage = 0;
  }
  
  read(pagesToRead) {
    this.currentPage = Math.min(this.pages, this.currentPage + pagesToRead);
    console.log(\`Read \${pagesToRead} pages. Currently on page \${this.currentPage}\`);
  }
  
  getProgress() {
    return \`\${((this.currentPage / this.pages) * 100).toFixed(1)}% complete\`;
  }
  
  reset() {
    this.currentPage = 0;
  }
  
  isFinished() {
    return this.currentPage >= this.pages;
  }
}
      `
    },
    
    {
      id: "class-intermediate",
      title: "Vehicle Fleet Management",
      difficulty: "medium",
      prompt: "Create a Vehicle base class and Car/Truck subclasses with fuel tracking, maintenance schedules, and fleet statistics.",
      solution: `
class Vehicle {
  constructor(make, model, year, fuelCapacity) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.fuelCapacity = fuelCapacity;
    this.currentFuel = fuelCapacity;
    this.mileage = 0;
    this.maintenanceDue = false;
  }
  
  drive(miles) {
    const fuelNeeded = miles / this.getMPG();
    if (fuelNeeded <= this.currentFuel) {
      this.currentFuel -= fuelNeeded;
      this.mileage += miles;
      
      if (this.mileage % 3000 === 0) {
        this.maintenanceDue = true;
      }
      
      return true;
    }
    return false; // Not enough fuel
  }
  
  refuel() {
    this.currentFuel = this.fuelCapacity;
  }
  
  performMaintenance() {
    this.maintenanceDue = false;
    console.log(\`Maintenance completed for \${this.make} \${this.model}\`);
  }
  
  getMPG() {
    return 25; // Base MPG
  }
  
  getStatus() {
    return {
      vehicle: \`\${this.make} \${this.model} (\${this.year})\`,
      fuel: \`\${this.currentFuel.toFixed(1)}/\${this.fuelCapacity}\`,
      mileage: this.mileage,
      maintenanceDue: this.maintenanceDue
    };
  }
}

class Car extends Vehicle {
  getMPG() {
    return 30; // Cars are more fuel efficient
  }
}

class Truck extends Vehicle {
  getMPG() {
    return 18; // Trucks use more fuel
  }
}
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the correct way to define a private field in a JavaScript class?",
      options: [
        "private #fieldName;",
        "#fieldName;",
        "_fieldName;",
        "this.#fieldName;"
      ],
      correct: 1,
      explanation: "Private fields are defined with the # prefix directly in the class body."
    },
    
    {
      question: "Which keyword is used to call the parent class constructor?",
      options: ["parent()", "super()", "base()", "inherit()"],
      correct: 1,
      explanation: "The super() keyword is used to call the parent class constructor in JavaScript."
    },
    
    {
      question: "Static methods in a class:",
      options: [
        "Can access instance properties",
        "Must be called on class instances",
        "Are called on the class itself",
        "Cannot call other static methods"
      ],
      correct: 2,
      explanation: "Static methods belong to the class itself and are called on the class, not instances."
    }
  ]
};

export default classesContent;