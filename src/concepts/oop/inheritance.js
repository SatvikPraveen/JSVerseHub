// File: src/concepts/oop/inheritance.js
// Object-Oriented Programming - Inheritance in JavaScript

export const inheritanceContent = {
  title: "JavaScript Inheritance",
  description: "Master class inheritance, method overriding, and polymorphism",
  
  theory: {
    introduction: `
      Inheritance allows classes to inherit properties and methods from parent classes,
      enabling code reuse and creating hierarchical relationships between objects.
      JavaScript supports both classical inheritance (with classes) and prototypal inheritance.
    `,
    
    concepts: [
      {
        name: "Class Inheritance with extends",
        explanation: "Create child classes that inherit from parent classes",
        example: `
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }
  
  eat(food) {
    this.energy = Math.min(100, this.energy + 20);
    console.log(\`\${this.name} eats \${food} and gains energy!\`);
  }
  
  sleep() {
    this.energy = 100;
    console.log(\`\${this.name} sleeps and fully restores energy!\`);
  }
  
  makeSound() {
    console.log(\`\${this.name} makes a sound!\`);
  }
  
  getInfo() {
    return \`\${this.name} is a \${this.species} with \${this.energy}% energy\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Dog"); // Call parent constructor
    this.breed = breed;
    this.loyalty = 100;
  }
  
  // Override parent method
  makeSound() {
    console.log(\`\${this.name} barks: Woof woof!\`);
  }
  
  // New method specific to Dog
  fetch() {
    if (this.energy >= 20) {
      this.energy -= 20;
      this.loyalty = Math.min(100, this.loyalty + 10);
      console.log(\`\${this.name} fetches the ball! Loyalty increased!\`);
    } else {
      console.log(\`\${this.name} is too tired to fetch!\`);
    }
  }
  
  // Override getInfo to include breed
  getInfo() {
    return \`\${super.getInfo()} (\${this.breed} breed, \${this.loyalty}% loyalty)\`;
  }
}

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
dog.makeSound(); // "Buddy barks: Woof woof!"
dog.eat("kibble");
dog.fetch();
console.log(dog.getInfo());
        `
      },
      
      {
        name: "Method Overriding",
        explanation: "Child classes can override parent methods to provide specific behavior",
        example: `
class Shape {
  constructor(color) {
    this.color = color;
  }
  
  draw() {
    console.log(\`Drawing a \${this.color} shape\`);
  }
  
  getArea() {
    throw new Error("getArea() must be implemented by subclass");
  }
  
  getPerimeter() {
    throw new Error("getPerimeter() must be implemented by subclass");
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  // Override parent methods
  draw() {
    console.log(\`Drawing a \${this.color} circle with radius \${this.radius}\`);
  }
  
  getArea() {
    return Math.PI * this.radius * this.radius;
  }
  
  getPerimeter() {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }
  
  draw() {
    console.log(\`Drawing a \${this.color} rectangle \${this.width}x\${this.height}\`);
  }
  
  getArea() {
    return this.width * this.height;
  }
  
  getPerimeter() {
    return 2 * (this.width + this.height);
  }
}

// Usage
const shapes = [
  new Circle("red", 5),
  new Rectangle("blue", 10, 6)
];

shapes.forEach(shape => {
  shape.draw();
  console.log(\`Area: \${shape.getArea().toFixed(2)}\`);
  console.log(\`Perimeter: \${shape.getPerimeter().toFixed(2)}\`);
});
        `
      },
      
      {
        name: "Super Keyword",
        explanation: "Access parent class methods and constructor using super",
        example: `
class Employee {
  constructor(name, id, salary) {
    this.name = name;
    this.id = id;
    this.salary = salary;
    this.hireDate = new Date();
  }
  
  work() {
    console.log(\`\${this.name} is working...\`);
  }
  
  getYearsOfService() {
    return new Date().getFullYear() - this.hireDate.getFullYear();
  }
  
  getSalaryInfo() {
    return \`\${this.name} earns $\${this.salary} per year\`;
  }
}

class Manager extends Employee {
  constructor(name, id, salary, department) {
    super(name, id, salary); // Call parent constructor
    this.department = department;
    this.teamSize = 0;
    this.bonus = 0;
  }
  
  work() {
    super.work(); // Call parent method
    console.log(\`\${this.name} is also managing the \${this.department} department\`);
  }
  
  addTeamMember() {
    this.teamSize++;
    console.log(\`Team size increased to \${this.teamSize}\`);
  }
  
  giveBonus(amount) {
    this.bonus += amount;
    console.log(\`\${this.name} received a $\${amount} bonus!\`);
  }
  
  getSalaryInfo() {
    const baseInfo = super.getSalaryInfo(); // Call parent method
    return \`\${baseInfo} + $\${this.bonus} bonus = $\${this.salary + this.bonus} total\`;
  }
}

// Usage
const manager = new Manager("Alice Johnson", "EMP001", 75000, "Engineering");
manager.work();
manager.addTeamMember();
manager.giveBonus(5000);
console.log(manager.getSalaryInfo());
        `
      },
      
      {
        name: "Abstract Classes Pattern",
        explanation: "Creating base classes that should not be instantiated directly",
        example: `
class Vehicle {
  constructor(make, model) {
    if (new.target === Vehicle) {
      throw new Error("Cannot instantiate abstract class Vehicle directly");
    }
    this.make = make;
    this.model = model;
    this.speed = 0;
  }
  
  // Abstract methods - must be implemented by subclasses
  start() {
    throw new Error("start() method must be implemented");
  }
  
  stop() {
    throw new Error("stop() method must be implemented");
  }
  
  // Concrete method - can be used by all subclasses
  accelerate(amount) {
    this.speed += amount;
    console.log(\`\${this.make} \${this.model} accelerating to \${this.speed} mph\`);
  }
  
  getInfo() {
    return \`\${this.make} \${this.model} - Speed: \${this.speed} mph\`;
  }
}

class Car extends Vehicle {
  constructor(make, model, fuelType = "gasoline") {
    super(make, model);
    this.fuelType = fuelType;
    this.engine = "off";
  }
  
  start() {
    this.engine = "on";
    console.log(\`\${this.make} \${this.model} engine started (\${this.fuelType})\`);
  }
  
  stop() {
    this.engine = "off";
    this.speed = 0;
    console.log(\`\${this.make} \${this.model} engine stopped\`);
  }
}

class Bicycle extends Vehicle {
  constructor(make, model, gears = 1) {
    super(make, model);
    this.gears = gears;
    this.currentGear = 1;
    this.isMoving = false;
  }
  
  start() {
    this.isMoving = true;
    console.log(\`Started pedaling the \${this.make} \${this.model}\`);
  }
  
  stop() {
    this.isMoving = false;
    this.speed = 0;
    console.log(\`Stopped the \${this.make} \${this.model}\`);
  }
  
  shiftGear(gear) {
    if (gear >= 1 && gear <= this.gears) {
      this.currentGear = gear;
      console.log(\`Shifted to gear \${gear}\`);
    }
  }
}

// Usage
// const vehicle = new Vehicle("Generic", "Vehicle"); // Error!
const car = new Car("Toyota", "Camry", "hybrid");
const bike = new Bicycle("Trek", "Mountain", 21);

car.start();
car.accelerate(30);
console.log(car.getInfo());

bike.start();
bike.shiftGear(5);
bike.accelerate(15);
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "E-commerce Product System",
      description: "A complete product hierarchy with different product types",
      code: `
class Product {
  constructor(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.inStock = true;
    this.reviews = [];
    this.createdAt = new Date();
  }
  
  addReview(rating, comment) {
    this.reviews.push({
      rating,
      comment,
      date: new Date()
    });
  }
  
  getAverageRating() {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
  }
  
  applyDiscount(percentage) {
    const discount = this.price * (percentage / 100);
    return this.price - discount;
  }
  
  getInfo() {
    return \`\${this.name} - $\${this.price} (\${this.category})\`;
  }
  
  // Abstract method
  getShippingCost() {
    throw new Error("getShippingCost must be implemented by subclass");
  }
}

class ElectronicsProduct extends Product {
  constructor(name, price, brand, warranty = 12) {
    super(name, price, "Electronics");
    this.brand = brand;
    this.warrantyMonths = warranty;
    this.specifications = {};
  }
  
  addSpecification(key, value) {
    this.specifications[key] = value;
  }
  
  getShippingCost() {
    return this.price > 100 ? 0 : 15; // Free shipping over $100
  }
  
  getInfo() {
    return \`\${super.getInfo()} by \${this.brand} - \${this.warrantyMonths}mo warranty\`;
  }
  
  isUnderWarranty() {
    const monthsSincePurchase = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24 * 30);
    return monthsSincePurchase < this.warrantyMonths;
  }
}

class ClothingProduct extends Product {
  constructor(name, price, brand, sizes = []) {
    super(name, price, "Clothing");
    this.brand = brand;
    this.availableSizes = sizes;
    this.material = "";
    this.careInstructions = [];
  }
  
  addSize(size) {
    if (!this.availableSizes.includes(size)) {
      this.availableSizes.push(size);
    }
  }
  
  removeSize(size) {
    this.availableSizes = this.availableSizes.filter(s => s !== size);
  }
  
  getShippingCost() {
    return 8; // Standard clothing shipping
  }
  
  getInfo() {
    const sizes = this.availableSizes.join(", ");
    return \`\${super.getInfo()} by \${this.brand} - Sizes: \${sizes}\`;
  }
  
  addCareInstruction(instruction) {
    this.careInstructions.push(instruction);
  }
}

class BookProduct extends Product {
  constructor(name, price, author, isbn, pages) {
    super(name, price, "Books");
    this.author = author;
    this.isbn = isbn;
    this.pages = pages;
    this.publisher = "";
    this.publishDate = null;
  }
  
  getShippingCost() {
    return this.pages > 500 ? 12 : 8; // Heavier books cost more
  }
  
  getInfo() {
    return \`\${super.getInfo()} by \${this.author} - \${this.pages} pages\`;
  }
  
  getReadingTime() {
    const wordsPerPage = 250;
    const wordsPerMinute = 200;
    const totalWords = this.pages * wordsPerPage;
    const minutes = totalWords / wordsPerMinute;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return \`\${hours}h \${mins}m\`;
  }
}

// Usage
const laptop = new ElectronicsProduct("Gaming Laptop", 1299, "TechCorp", 24);
laptop.addSpecification("RAM", "16GB");
laptop.addSpecification("Storage", "1TB SSD");
laptop.addReview(5, "Amazing performance!");

const tshirt = new ClothingProduct("Cotton T-Shirt", 29, "FashionBrand", ["S", "M", "L"]);
tshirt.addCareInstruction("Machine wash cold");
tshirt.addReview(4, "Great quality and fit");

const book = new BookProduct("JavaScript Mastery", 45, "John Coder", "978-1234567890", 450);
book.addReview(5, "Best JS book ever!");

const products = [laptop, tshirt, book];
products.forEach(product => {
  console.log(product.getInfo());
  console.log(\`Shipping: $\${product.getShippingCost()}\`);
  console.log(\`Rating: \${product.getAverageRating()}/5\`);
  console.log("---");
});
      `
    },
    
    {
      title: "Media Player System",
      description: "Inheritance hierarchy for different media types",
      code: `
class MediaItem {
  constructor(title, duration) {
    this.title = title;
    this.duration = duration; // in seconds
    this.currentPosition = 0;
    this.isPlaying = false;
    this.volume = 50;
  }
  
  play() {
    this.isPlaying = true;
    console.log(\`Playing: \${this.title}\`);
    this.startProgressTracking();
  }
  
  pause() {
    this.isPlaying = false;
    console.log(\`Paused: \${this.title}\`);
  }
  
  stop() {
    this.isPlaying = false;
    this.currentPosition = 0;
    console.log(\`Stopped: \${this.title}\`);
  }
  
  seek(position) {
    this.currentPosition = Math.max(0, Math.min(this.duration, position));
    console.log(\`Seeked to \${this.formatTime(this.currentPosition)}\`);
  }
  
  setVolume(level) {
    this.volume = Math.max(0, Math.min(100, level));
    console.log(\`Volume set to \${this.volume}%\`);
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  }
  
  getProgress() {
    return \`\${this.formatTime(this.currentPosition)} / \${this.formatTime(this.duration)}\`;
  }
  
  startProgressTracking() {
    // Simplified progress tracking
    if (this.isPlaying && this.currentPosition < this.duration) {
      setTimeout(() => {
        this.currentPosition += 1;
        if (this.currentPosition >= this.duration) {
          this.onFinished();
        } else if (this.isPlaying) {
          this.startProgressTracking();
        }
      }, 1000);
    }
  }
  
  onFinished() {
    console.log(\`\${this.title} finished playing\`);
    this.isPlaying = false;
    this.currentPosition = 0;
  }
}

class AudioTrack extends MediaItem {
  constructor(title, duration, artist, album) {
    super(title, duration);
    this.artist = artist;
    this.album = album;
    this.genre = "";
    this.bitrate = 320;
  }
  
  play() {
    console.log(\`🎵 Now playing: \${this.artist} - \${this.title}\`);
    super.play();
  }
  
  getInfo() {
    return \`\${this.artist} - \${this.title} (\${this.album}) - \${this.formatTime(this.duration)}\`;
  }
  
  showLyrics() {
    console.log(\`Showing lyrics for \${this.title}...\`);
  }
}

class VideoFile extends MediaItem {
  constructor(title, duration, resolution, frameRate = 30) {
    super(title, duration);
    this.resolution = resolution;
    this.frameRate = frameRate;
    this.subtitles = [];
    this.currentQuality = resolution;
  }
  
  play() {
    console.log(\`📺 Playing video: \${this.title} (\${this.resolution})\`);
    super.play();
  }
  
  changeQuality(newResolution) {
    this.currentQuality = newResolution;
    console.log(\`Quality changed to \${newResolution}\`);
  }
  
  toggleSubtitles() {
    console.log("Toggling subtitles...");
  }
  
  getInfo() {
    return \`\${this.title} - \${this.resolution} @ \${this.frameRate}fps - \${this.formatTime(this.duration)}\`;
  }
  
  takeScreenshot() {
    console.log(\`Screenshot taken at \${this.formatTime(this.currentPosition)}\`);
  }
}

class Podcast extends AudioTrack {
  constructor(title, duration, host, episode, series) {
    super(title, duration, host, series);
    this.episode = episode;
    this.description = "";
    this.chapters = [];
  }
  
  play() {
    console.log(\`🎙️  Playing podcast: \${this.title} - Episode \${this.episode}\`);
    MediaItem.prototype.play.call(this); // Call grandparent method
  }
  
  addChapter(time, title) {
    this.chapters.push({ time, title });
    this.chapters.sort((a, b) => a.time - b.time);
  }
  
  jumpToChapter(chapterIndex) {
    if (this.chapters[chapterIndex]) {
      this.seek(this.chapters[chapterIndex].time);
      console.log(\`Jumped to: \${this.chapters[chapterIndex].title}\`);
    }
  }
  
  getInfo() {
    return \`\${this.artist} - \${this.title} (Episode \${this.episode}) - \${this.formatTime(this.duration)}\`;
  }
}

// Usage
const song = new AudioTrack("Bohemian Rhapsody", 354, "Queen", "A Night at the Opera");
const video = new VideoFile("Epic Movie", 7200, "1080p", 24);
const podcast = new Podcast("JavaScript Deep Dive", 3600, "Tech Guru", 42, "Code Masters");

podcast.addChapter(0, "Introduction");
podcast.addChapter(600, "ES6 Features");
podcast.addChapter(1800, "Async Programming");

const playlist = [song, video, podcast];
playlist.forEach(item => {
  console.log(item.getInfo());
  item.play();
  item.setVolume(75);
  console.log("---");
});
      `
    }
  ],
  
  exercises: [
    {
      id: "inheritance-basic",
      title: "Animal Kingdom",
      difficulty: "easy",
      prompt: "Create an Animal base class and Bird, Fish subclasses with specific behaviors.",
      solution: `
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.age = 0;
    this.isAlive = true;
  }
  
  eat() {
    console.log(\`\${this.name} is eating\`);
  }
  
  sleep() {
    console.log(\`\${this.name} is sleeping\`);
  }
  
  makeSound() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Bird extends Animal {
  constructor(name, species, canFly = true) {
    super(name, species);
    this.canFly = canFly;
    this.altitude = 0;
  }
  
  makeSound() {
    console.log(\`\${this.name} chirps\`);
  }
  
  fly() {
    if (this.canFly) {
      this.altitude = 100;
      console.log(\`\${this.name} is flying at \${this.altitude}ft\`);
    } else {
      console.log(\`\${this.name} cannot fly\`);
    }
  }
  
  land() {
    this.altitude = 0;
    console.log(\`\${this.name} has landed\`);
  }
}

class Fish extends Animal {
  constructor(name, species, waterType = "freshwater") {
    super(name, species);
    this.waterType = waterType;
    this.depth = 0;
  }
  
  makeSound() {
    console.log(\`\${this.name} blows bubbles\`);
  }
  
  swim() {
    console.log(\`\${this.name} is swimming\`);
  }
  
  dive(depth) {
    this.depth = depth;
    console.log(\`\${this.name} dives to \${depth}ft deep\`);
  }
}
      `
    },
    
    {
      id: "inheritance-advanced",
      title: "Banking System",
      difficulty: "hard",
      prompt: "Create Account base class and CheckingAccount, SavingsAccount, CreditAccount subclasses with different rules.",
      solution: `
class Account {
  constructor(accountNumber, ownerName, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.ownerName = ownerName;
    this.balance = initialBalance;
    this.transactions = [];
    this.isActive = true;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.recordTransaction("deposit", amount);
      console.log(\`Deposited $\${amount}. New balance: $\${this.balance}\`);
      return true;
    }
    return false;
  }
  
  withdraw(amount) {
    if (this.canWithdraw(amount)) {
      this.balance -= amount;
      this.recordTransaction("withdrawal", amount);
      console.log(\`Withdrew $\${amount}. New balance: $\${this.balance}\`);
      return true;
    }
    console.log("Insufficient funds or withdrawal not allowed");
    return false;
  }
  
  canWithdraw(amount) {
    return amount > 0 && amount <= this.balance;
  }
  
  recordTransaction(type, amount) {
    this.transactions.push({
      type,
      amount,
      date: new Date(),
      balance: this.balance
    });
  }
  
  getBalance() {
    return this.balance;
  }
  
  getStatement() {
    return \`Account \${this.accountNumber} - \${this.ownerName}: $\${this.balance}\`;
  }
}

class CheckingAccount extends Account {
  constructor(accountNumber, ownerName, initialBalance = 0) {
    super(accountNumber, ownerName, initialBalance);
    this.overdraftLimit = 100;
    this.monthlyFee = 10;
    this.freeTransactions = 10;
    this.transactionCount = 0;
  }
  
  canWithdraw(amount) {
    return amount > 0 && (this.balance + this.overdraftLimit) >= amount;
  }
  
  withdraw(amount) {
    this.transactionCount++;
    const success = super.withdraw(amount);
    
    if (this.balance < 0) {
      console.log(\`Overdraft used: $\${Math.abs(this.balance)}\`);
    }
    
    if (this.transactionCount > this.freeTransactions) {
      this.balance -= 2; // Transaction fee
      console.log("Transaction fee: $2");
    }
    
    return success;
  }
  
  applyMonthlyFee() {
    this.balance -= this.monthlyFee;
    this.recordTransaction("monthly fee", this.monthlyFee);
    console.log(\`Monthly fee applied: $\${this.monthlyFee}\`);
  }
}

class SavingsAccount extends Account {
  constructor(accountNumber, ownerName, initialBalance = 0, interestRate = 0.02) {
    super(accountNumber, ownerName, initialBalance);
    this.interestRate = interestRate;
    this.withdrawalLimit = 6; // Federal regulation
    this.monthlyWithdrawals = 0;
  }
  
  withdraw(amount) {
    if (this.monthlyWithdrawals >= this.withdrawalLimit) {
      console.log(\`Monthly withdrawal limit (\${this.withdrawalLimit}) reached\`);
      return false;
    }
    
    const success = super.withdraw(amount);
    if (success) {
      this.monthlyWithdrawals++;
    }
    return success;
  }
  
  applyInterest() {
    const interest = this.balance * (this.interestRate / 12);
    this.balance += interest;
    this.recordTransaction("interest", interest);
    console.log(\`Interest applied: $\${interest.toFixed(2)}\`);
  }
  
  resetMonthlyLimits() {
    this.monthlyWithdrawals = 0;
  }
}

class CreditAccount extends Account {
  constructor(accountNumber, ownerName, creditLimit) {
    super(accountNumber, ownerName, 0);
    this.creditLimit = creditLimit;
    this.interestRate = 0.18; // 18% APR
    this.minimumPayment = 0;
  }
  
  charge(amount) {
    if (amount > 0 && (this.balance + amount) <= this.creditLimit) {
      this.balance += amount;
      this.recordTransaction("charge", amount);
      this.calculateMinimumPayment();
      console.log(\`Charged $\${amount}. Balance: $\${this.balance}\`);
      return true;
    }
    console.log("Credit limit exceeded");
    return false;
  }
  
  makePayment(amount) {
    if (amount > 0) {
      this.balance -= amount;
      this.recordTransaction("payment", amount);
      this.calculateMinimumPayment();
      console.log(\`Payment of $\${amount}. Balance: $\${this.balance}\`);
      return true;
    }
    return false;
  }
  
  calculateMinimumPayment() {
    this.minimumPayment = Math.max(25, this.balance * 0.02);
  }
  
  applyInterest() {
    if (this.balance > 0) {
      const interest = this.balance * (this.interestRate / 12);
      this.balance += interest;
      this.recordTransaction("interest charge", interest);
      console.log(\`Interest charged: $\${interest.toFixed(2)}\`);
    }
  }
  
  getStatement() {
    return \`\${super.getStatement()} (Credit limit: $\${this.creditLimit}, Min payment: $\${this.minimumPayment.toFixed(2)})\`;
  }
}
      `
    }
  ],
  
  quiz: [
    {
      question: "What does the 'super()' keyword do in a constructor?",
      options: [
        "Creates a new instance of the parent class",
        "Calls the parent class constructor",
        "Overrides the parent class constructor", 
        "Deletes the parent class constructor"
      ],
      correct: 1,
      explanation: "super() calls the parent class constructor and must be called before using 'this' in the child constructor."
    },
    
    {
      question: "Method overriding in inheritance means:",
      options: [
        "Adding new methods to a child class",
        "Removing methods from the parent class",
        "Replacing a parent method with a new implementation",
        "Calling parent methods from child class"
      ],
      correct: 2,
      explanation: "Method overriding means providing a new implementation of a parent class method in the child class."
    },
    
    {
      question: "How do you prevent a class from being instantiated directly?",
      options: [
        "Use the 'abstract' keyword",
        "Check new.target in the constructor",
        "Make the constructor private",
        "Use static methods only"
      ],
      correct: 1,
      explanation: "Checking 'new.target' in the constructor allows you to prevent direct instantiation of a base class."
    }
  ]
};

export default inheritanceContent;