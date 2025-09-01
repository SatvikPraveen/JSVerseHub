// File: src/concepts/dom/index.js
// DOM Manipulation - Document Object Model concepts and practices

export const domConfig = {
  title: "DOM Manipulation",
  description: "Master the Document Object Model and web page interaction",
  difficulty: "beginner-intermediate",
  estimatedTime: "45 minutes",
  topics: [
    "DOM Tree Structure",
    "Element Selection",
    "Element Manipulation",
    "Event Handling",
    "Dynamic Content Creation"
  ]
};

// DOM Tree Structure and Understanding
export const domStructure = {
  concept: "DOM Tree Structure",
  explanation: `
    The DOM (Document Object Model) is a programming interface for web documents.
    It represents the page as a tree of objects that JavaScript can manipulate.
    Every HTML element, attribute, and text is a node in this tree.
  `,
  
  examples: {
    domTree: `
// Understanding the DOM hierarchy
/*
document (root)
├── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── header
        │   └── h1
        ├── main
        │   ├── section
        │   │   ├── p
        │   │   └── ul
        │   │       ├── li
        │   │       ├── li
        │   │       └── li
        │   └── div
        └── footer
*/

// Accessing different parts of the DOM
console.log(document);                    // The entire document
console.log(document.documentElement);    // <html> element
console.log(document.head);              // <head> element
console.log(document.body);              // <body> element
console.log(document.title);             // Page title

// Node types
console.log(document.nodeType);          // 9 (DOCUMENT_NODE)
console.log(document.body.nodeType);     // 1 (ELEMENT_NODE)

// Document information
console.log(document.URL);               // Current page URL
console.log(document.domain);            // Domain name
console.log(document.readyState);        // loading/interactive/complete
    `,
    
    nodeNavigation: `
// Navigating between nodes
const mainElement = document.querySelector('main');

// Parent relationships
console.log(mainElement.parentNode);        // Parent node
console.log(mainElement.parentElement);     // Parent element (same as above for elements)

// Child relationships
console.log(mainElement.childNodes);        // All child nodes (includes text/whitespace)
console.log(mainElement.children);          // Only element children
console.log(mainElement.firstChild);        // First child node
console.log(mainElement.firstElementChild); // First child element
console.log(mainElement.lastChild);         // Last child node
console.log(mainElement.lastElementChild);  // Last child element

// Sibling relationships
console.log(mainElement.nextSibling);          // Next sibling node
console.log(mainElement.nextElementSibling);   // Next sibling element
console.log(mainElement.previousSibling);      // Previous sibling node
console.log(mainElement.previousElementSibling); // Previous sibling element

// Counting children
console.log(mainElement.childElementCount);    // Number of child elements
console.log(mainElement.children.length);      // Same as above
    `
  },
  
  exercises: [
    {
      id: "dom_exploration",
      question: "Navigate to the second paragraph in the main section and log its text content",
      hint: "Use querySelector or children indexing to access specific elements"
    }
  ]
};

// Element Selection Methods
export const elementSelection = {
  concept: "Element Selection",
  explanation: `
    JavaScript provides multiple ways to select DOM elements.
    Choose the right method based on what you're trying to select and how specific you need to be.
  `,
  
  examples: {
    basicSelection: `
// Basic selection methods
const elementById = document.getElementById('myId');
const elementsByClass = document.getElementsByClassName('myClass');
const elementsByTag = document.getElementsByTagName('div');
const elementsByName = document.getElementsByName('username');

// Modern query methods (preferred)
const singleElement = document.querySelector('#myId');           // First match
const multipleElements = document.querySelectorAll('.myClass');  // All matches

// CSS selector examples
const header = document.querySelector('header');                 // Tag selector
const navigation = document.querySelector('.navigation');        // Class selector
const loginForm = document.querySelector('#login-form');         // ID selector
const submitButton = document.querySelector('button[type="submit"]'); // Attribute selector

// Complex selectors
const firstListItem = document.querySelector('ul li:first-child');
const lastParagraph = document.querySelector('section p:last-of-type');
const evenRows = document.querySelectorAll('tr:nth-child(even)');
const activeButtons = document.querySelectorAll('button:not(:disabled)');
    `,
    
    advancedSelection: `
// Advanced selection techniques
// Selecting within a specific parent
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = sidebar.querySelectorAll('a');

// Multiple selectors
const headingsAndParagraphs = document.querySelectorAll('h1, h2, h3, p');

// Pseudo-classes and pseudo-elements
const checkedInputs = document.querySelectorAll('input:checked');
const requiredFields = document.querySelectorAll('input:required');
const firstLetters = document.querySelectorAll('p::first-letter');

// Combining selectors
const articleImages = document.querySelectorAll('article img');
const navActiveLinks = document.querySelectorAll('nav a.active');
const formErrors = document.querySelectorAll('form .error-message');

// Selecting by data attributes
const userCards = document.querySelectorAll('[data-user-id]');
const specificUser = document.querySelector('[data-user-id="123"]');
const categoryItems = document.querySelectorAll('[data-category="electronics"]');

// Dynamic selection
function selectByRole(role) {
  return document.querySelectorAll(\`[role="\${role}"]\`);
}

const buttons = selectByRole('button');
const navigation = selectByRole('navigation');
    `,
    
    selectionComparison: `
// Performance and use case comparison
// getElementById - Fastest for single elements with IDs
const fastElement = document.getElementById('unique-id');

// querySelector - Most flexible, good for complex selectors
const flexibleElement = document.querySelector('.complex > .selector:nth-child(2)');

// getElementsByClassName - Live collection, updates automatically
const liveCollection = document.getElementsByClassName('dynamic-class');

// querySelectorAll - Static collection, snapshot at time of call
const staticCollection = document.querySelectorAll('.dynamic-class');

// Demonstrating live vs static collections
console.log('Before adding element:', liveCollection.length, staticCollection.length);

// Add a new element with the class
const newElement = document.createElement('div');
newElement.className = 'dynamic-class';
document.body.appendChild(newElement);

console.log('After adding element:', liveCollection.length, staticCollection.length);
// liveCollection will have increased by 1, staticCollection stays the same
    `
  },
  
  exercises: [
    {
      id: "selector_practice",
      question: "Select all images inside articles that have an alt attribute",
      solution: "document.querySelectorAll('article img[alt]')",
      hint: "Use attribute selectors with querySelectorAll"
    }
  ]
};

// Element Manipulation
export const elementManipulation = {
  concept: "Element Manipulation",
  explanation: `
    Once you've selected elements, you can modify their content, attributes, styles, and structure.
    JavaScript provides many properties and methods to manipulate DOM elements dynamically.
  `,
  
  examples: {
    contentManipulation: `
// Content manipulation
const paragraph = document.querySelector('p');

// Text content (plain text only)
paragraph.textContent = 'New text content';
console.log(paragraph.textContent);

// Inner HTML (includes HTML tags)
paragraph.innerHTML = 'Text with <strong>bold</strong> and <em>italic</em>';
console.log(paragraph.innerHTML);

// Outer HTML (entire element)
console.log(paragraph.outerHTML);
paragraph.outerHTML = '<div>Replaced the paragraph entirely</div>';

// Inner text (respects styling, excludes hidden elements)
const hiddenSpan = document.querySelector('.hidden');
console.log('textContent:', hiddenSpan.textContent); // Shows hidden text
console.log('innerText:', hiddenSpan.innerText);     // May exclude hidden text

// Safe HTML insertion (prevents XSS)
function safeInsertHTML(element, htmlString) {
  // Create a temporary element
  const temp = document.createElement('div');
  temp.textContent = htmlString; // This escapes HTML
  element.innerHTML = temp.innerHTML;
}
    `,
    
    attributeManipulation: `
// Attribute manipulation
const image = document.querySelector('img');

// Getting attributes
console.log(image.getAttribute('src'));
console.log(image.getAttribute('alt'));
console.log(image.id);    // Direct property access
console.log(image.src);   // Direct property access

// Setting attributes
image.setAttribute('src', 'new-image.jpg');
image.setAttribute('alt', 'New description');
image.id = 'hero-image';           // Direct property
image.src = 'another-image.jpg';   // Direct property

// Checking if attribute exists
console.log(image.hasAttribute('data-lazy')); // true/false

// Removing attributes
image.removeAttribute('data-lazy');

// Data attributes (HTML5)
image.dataset.userId = '123';           // Creates data-user-id="123"
image.dataset.productCategory = 'tech'; // Creates data-product-category="tech"
console.log(image.dataset.userId);      // Reads data-user-id

// Boolean attributes
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.checked = true;               // Set checked
checkbox.disabled = false;             // Enable
checkbox.required = true;              // Make required

// Class manipulation
const element = document.querySelector('.my-element');
element.classList.add('new-class');        // Add class
element.classList.remove('old-class');     // Remove class
element.classList.toggle('active');        // Toggle class
element.classList.replace('old', 'new');   // Replace class
console.log(element.classList.contains('active')); // Check if class exists

// Multiple classes
element.classList.add('class1', 'class2', 'class3');
element.classList.remove('class1', 'class2');
    `,
    
    styleManipulation: `
// Style manipulation
const box = document.querySelector('.box');

// Inline styles (high specificity)
box.style.backgroundColor = 'red';
box.style.width = '200px';
box.style.height = '200px';
box.style.borderRadius = '10px';

// Multiple styles at once
Object.assign(box.style, {
  backgroundColor: 'blue',
  color: 'white',
  padding: '20px',
  textAlign: 'center',
  fontSize: '18px'
});

// CSS custom properties (CSS variables)
box.style.setProperty('--main-color', '#ff6b35');
box.style.setProperty('--spacing', '15px');

// Getting computed styles
const computedStyles = window.getComputedStyle(box);
console.log('Computed background:', computedStyles.backgroundColor);
console.log('Computed width:', computedStyles.width);

// Removing styles
box.style.removeProperty('background-color');
box.style.backgroundColor = ''; // Alternative way

// Working with CSS classes for styling (recommended)
function toggleTheme(element) {
  element.classList.toggle('dark-theme');
  element.classList.toggle('light-theme');
}

// Animating with CSS classes
function slideIn(element) {
  element.classList.add('slide-in-animation');
  element.addEventListener('animationend', () => {
    element.classList.remove('slide-in-animation');
  }, { once: true });
}
    `
  },
  
  exercises: [
    {
      id: "element_styling",
      question: "Change all links in navigation to have blue color and remove underlines",
      hint: "Select nav links and modify their style properties or add CSS classes"
    }
  ]
};

// Event Handling
export const eventHandling = {
  concept: "Event Handling",
  explanation: `
    Events are actions that happen in the browser - clicks, key presses, form submissions, etc.
    JavaScript can listen for these events and respond with custom behavior.
  `,
  
  examples: {
    basicEvents: `
// Basic event handling
const button = document.querySelector('.my-button');

// Method 1: Event handler property
button.onclick = function() {
  alert('Button clicked!');
};

// Method 2: addEventListener (recommended)
button.addEventListener('click', function() {
  console.log('Button was clicked');
});

// Method 3: Arrow function
button.addEventListener('click', () => {
  console.log('Arrow function handler');
});

// Method 4: Named function
function handleButtonClick(event) {
  console.log('Named function handler');
  console.log('Event type:', event.type);
  console.log('Target element:', event.target);
}

button.addEventListener('click', handleButtonClick);

// Removing event listeners
button.removeEventListener('click', handleButtonClick);

// Event options
button.addEventListener('click', handleButtonClick, {
  once: true,      // Run only once
  passive: true,   // Never calls preventDefault
  capture: true    // Capture phase instead of bubble phase
});
    `,
    
    eventTypes: `
// Different types of events
const input = document.querySelector('input');
const form = document.querySelector('form');
const element = document.querySelector('.interactive');

// Mouse events
element.addEventListener('click', (e) => console.log('Clicked'));
element.addEventListener('dblclick', (e) => console.log('Double clicked'));
element.addEventListener('mousedown', (e) => console.log('Mouse down'));
element.addEventListener('mouseup', (e) => console.log('Mouse up'));
element.addEventListener('mouseover', (e) => console.log('Mouse over'));
element.addEventListener('mouseout', (e) => console.log('Mouse out'));
element.addEventListener('mouseenter', (e) => console.log('Mouse enter'));
element.addEventListener('mouseleave', (e) => console.log('Mouse leave'));
element.addEventListener('mousemove', (e) => {
  console.log(\`Mouse position: \${e.clientX}, \${e.clientY}\`);
});

// Keyboard events
input.addEventListener('keydown', (e) => {
  console.log('Key down:', e.key, e.code);
  if (e.key === 'Enter') {
    console.log('Enter key pressed');
  }
});

input.addEventListener('keyup', (e) => console.log('Key up:', e.key));
input.addEventListener('keypress', (e) => console.log('Key press:', e.key));

// Form events
input.addEventListener('focus', () => console.log('Input focused'));
input.addEventListener('blur', () => console.log('Input blurred'));
input.addEventListener('input', (e) => console.log('Input changed:', e.target.value));
input.addEventListener('change', (e) => console.log('Input change event:', e.target.value));

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission
  console.log('Form submitted');
});

// Window events
window.addEventListener('resize', () => {
  console.log('Window resized:', window.innerWidth, window.innerHeight);
});

window.addEventListener('scroll', () => {
  console.log('Page scrolled:', window.scrollY);
});

// Document events
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
});
    `,
    
    eventDelegation: `
// Event delegation - handling events on parent elements
const todoList = document.querySelector('.todo-list');

// Instead of adding listeners to each item, listen on the parent
todoList.addEventListener('click', function(event) {
  const clickedElement = event.target;
  
  // Check what was clicked
  if (clickedElement.classList.contains('delete-btn')) {
    // Handle delete button click
    const todoItem = clickedElement.closest('.todo-item');
    todoItem.remove();
    console.log('Todo item deleted');
    
  } else if (clickedElement.classList.contains('complete-btn')) {
    // Handle complete button click
    const todoItem = clickedElement.closest('.todo-item');
    todoItem.classList.toggle('completed');
    console.log('Todo item toggled');
    
  } else if (clickedElement.classList.contains('edit-btn')) {
    // Handle edit button click
    const todoItem = clickedElement.closest('.todo-item');
    const text = todoItem.querySelector('.todo-text');
    text.contentEditable = true;
    text.focus();
    console.log('Todo item editing enabled');
  }
});

// Dynamic content - new items will automatically work with delegation
function addTodoItem(text) {
  const todoItem = document.createElement('div');
  todoItem.className = 'todo-item';
  todoItem.innerHTML = \`
    <span class="todo-text">\${text}</span>
    <button class="complete-btn">Complete</button>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  \`;
  todoList.appendChild(todoItem);
}

// Custom events
const customEvent = new CustomEvent('todoAdded', {
  detail: { text: 'New todo item', timestamp: Date.now() }
});

document.addEventListener('todoAdded', (e) => {
  console.log('Custom event received:', e.detail);
});

// Dispatch custom event
document.dispatchEvent(customEvent);
    `
  },
  
  exercises: [
    {
      id: "event_practice",
      question: "Create a button that changes color when clicked and shows coordinates when mouse moves over it",
      hint: "Use click and mousemove events, modify styles and display coordinates"
    }
  ]
};

// Dynamic Content Creation
export const dynamicContent = {
  concept: "Dynamic Content Creation",
  explanation: `
    JavaScript can create new HTML elements, modify existing ones, and restructure the DOM tree.
    This enables dynamic, interactive web applications that respond to user actions and data changes.
  `,
  
  examples: {
    createElement: `
// Creating elements
const newDiv = document.createElement('div');
const newParagraph = document.createElement('p');
const newImage = document.createElement('img');
const newLink = document.createElement('a');

// Setting properties and attributes
newDiv.className = 'dynamic-content';
newDiv.id = 'generated-div';
newDiv.textContent = 'This div was created with JavaScript';

newParagraph.innerHTML = 'Paragraph with <strong>bold text</strong>';
newParagraph.style.color = 'blue';

newImage.src = 'dynamic-image.jpg';
newImage.alt = 'Dynamically created image';
newImage.setAttribute('data-generated', 'true');

newLink.href = 'https://example.com';
newLink.textContent = 'Dynamic Link';
newLink.target = '_blank';

// Creating complex structures
function createUserCard(userData) {
  const card = document.createElement('div');
  card.className = 'user-card';
  
  const avatar = document.createElement('img');
  avatar.className = 'user-avatar';
  avatar.src = userData.avatar || 'default-avatar.jpg';
  avatar.alt = \`\${userData.name}'s avatar\`;
  
  const info = document.createElement('div');
  info.className = 'user-info';
  
  const name = document.createElement('h3');
  name.textContent = userData.name;
  
  const email = document.createElement('p');
  email.textContent = userData.email;
  email.className = 'user-email';
  
  const role = document.createElement('span');
  role.textContent = userData.role;
  role.className = \`role role-\${userData.role.toLowerCase()}\`;
  
  // Assemble the structure
  info.appendChild(name);
  info.appendChild(email);
  info.appendChild(role);
  
  card.appendChild(avatar);
  card.appendChild(info);
  
  return card;
}

// Using the function
const user = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  role: 'Admin',
  avatar: 'alice.jpg'
};

const userCard = createUserCard(user);
    `,
    
    domInsertion: `
// Different ways to insert elements
const container = document.querySelector('.container');
const newElement = document.createElement('div');
newElement.textContent = 'New element';

// Append as last child
container.appendChild(newElement);

// Insert at specific position
const firstChild = container.firstElementChild;
container.insertBefore(newElement, firstChild);

// Modern insertion methods
container.prepend(newElement);                    // Insert at beginning
container.append(newElement);                     // Insert at end
container.before(newElement);                     // Insert before container
container.after(newElement);                      // Insert after container

// Insert adjacent to element
const referenceElement = document.querySelector('.reference');

referenceElement.insertAdjacentElement('beforebegin', newElement); // Before the element
referenceElement.insertAdjacentElement('afterbegin', newElement);  // First child
referenceElement.insertAdjacentElement('beforeend', newElement);   // Last child
referenceElement.insertAdjacentElement('afterend', newElement);    // After the element

// Insert HTML strings
referenceElement.insertAdjacentHTML('afterbegin', '<p>HTML string content</p>');
referenceElement.insertAdjacentText('beforeend', 'Plain text content');

// Replace elements
const oldElement = document.querySelector('.old');
const newReplacement = document.createElement('div');
newReplacement.textContent = 'Replacement element';

oldElement.replaceWith(newReplacement);
// Or: oldElement.parentNode.replaceChild(newReplacement, oldElement);

// Clone elements
const original = document.querySelector('.original');
const shallowClone = original.cloneNode();        // Element only
const deepClone = original.cloneNode(true);       // Element + all children

container.appendChild(deepClone);
    `,
    
    documentFragments: `
// Document fragments for efficient DOM manipulation
const fragment = document.createDocumentFragment();

// Build complex structure in memory first
for (let i = 1; i <= 100; i++) {
  const listItem = document.createElement('li');
  listItem.textContent = \`Item \${i}\`;
  listItem.className = 'list-item';
  
  if (i % 2 === 0) {
    listItem.classList.add('even');
  }
  
  fragment.appendChild(listItem);
}

// Single DOM update instead of 100 updates
const list = document.querySelector('.large-list');
list.appendChild(fragment);

// Template-based creation
function createFromTemplate(templateId, data) {
  const template = document.getElementById(templateId);
  const clone = template.content.cloneNode(true);
  
  // Fill in template data
  Object.keys(data).forEach(key => {
    const element = clone.querySelector(\`[data-field="\${key}"]\`);
    if (element) {
      element.textContent = data[key];
    }
  });
  
  return clone;
}

// HTML Template usage
/*
<template id="product-template">
  <div class="product">
    <h3 data-field="name"></h3>
    <p data-field="description"></p>
    <span class="price" data-field="price"></span>
  </div>
</template>
*/

const productData = {
  name: 'Laptop Computer',
  description: 'High-performance laptop for professionals',
  price: '$1,299'
};

const productElement = createFromTemplate('product-template', productData);
document.querySelector('.products').appendChild(productElement);

// Removing elements
const elementToRemove = document.querySelector('.remove-me');
elementToRemove.remove();                        // Modern way
// elementToRemove.parentNode.removeChild(elementToRemove); // Legacy way

// Remove all children
const parent = document.querySelector('.clear-me');
parent.innerHTML = '';                           // Quick but not always ideal
// Or:
while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
}
// Or modern:
parent.replaceChildren();
    `
  },
  
  exercises: [
    {
      id: "dynamic_list",
      question: "Create a function that generates a shopping list from an array of items",
      hint: "Use createElement to make ul/li elements and appendChild to build the structure"
    }
  ]
};

// Interactive exercises
export const interactiveExercises = [
  {
    id: "dom_selector_challenge",
    title: "DOM Selector Challenge",
    description: "Practice different ways to select DOM elements",
    template: `
// Given this HTML structure:
/*
<div class="container">
  <header id="main-header">
    <h1>My Website</h1>
    <nav class="navigation">
      <a href="#" class="nav-link active">Home</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Contact</a>
    </nav>
  </header>
  <main>
    <section class="content">
      <article data-category="tech">
        <h2>Article Title</h2>
        <p>Article content...</p>
      </article>
    </section>
  </main>
</div>
*/

// Select the following elements:
const header = // Select the header element
const activeLink = // Select the active navigation link
const techArticles = // Select all articles with tech category
const allLinks = // Select all links in navigation

// Your code here
    `,
    tests: [
      {
        description: "Should select header element",
        check: (code) => code.includes('getElementById') || code.includes('#main-header')
      }
    ]
  },
  
  {
    id: "event_handler_practice",
    title: "Event Handler Practice",
    description: "Create interactive elements with event handling",
    template: `
// Create an interactive counter
const counter = document.querySelector('.counter');
const incrementBtn = document.querySelector('.increment');
const decrementBtn = document.querySelector('.decrement');
const resetBtn = document.querySelector('.reset');

let count = 0;

// Add event listeners here
// Update counter display
// Handle increment, decrement, and reset

// Your code here
    `,
    tests: [
      {
        description: "Should add event listeners",
        check: (code) => code.includes('addEventListener')
      }
    ]
  }
];

// Progress tracking
export const progressConfig = {
  totalConcepts: 4,
  conceptsCompleted: 0,
  exercises: {
    total: 6,
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
      overallProgress: ((this.conceptsCompleted + this.exercises.completed) / (this.totalConcepts + this.exercises.total)) * 100
    };
  }
};

// Export all concepts
export default {
  config: domConfig,
  concepts: {
    domStructure,
    elementSelection,
    elementManipulation,
    eventHandling,
    dynamicContent
  },
  exercises: interactiveExercises,
  progress: progressConfig
};