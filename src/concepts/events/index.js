// File: src/concepts/events/index.js
// Event Systems - Events, event handling, delegation, and custom events

/**
 * Events Concept Configuration
 * Comprehensive guide to JavaScript event systems
 */
export const eventsConfig = {
  title: "Event Systems & Delegation",
  description: "Master event-driven programming in JavaScript with events, delegation, and custom event creation",
  difficulty: "beginner-intermediate",
  estimatedTime: "120 minutes",
  topics: [
    "Event Fundamentals",
    "Event Bubbling & Capturing",
    "Event Delegation",
    "Event Object & Methods",
    "Custom Events",
    "Event Performance"
  ],
  prerequisites: ["JavaScript Basics", "DOM Manipulation"],
  learningObjectives: [
    "Understand event flow and propagation",
    "Implement event delegation for performance",
    "Create and dispatch custom events",
    "Manage event listeners efficiently",
    "Optimize event handling performance"
  ]
};

// ============================================================================
// EVENT FUNDAMENTALS
// ============================================================================

/**
 * Event Fundamentals - Understanding JavaScript events
 */
export const eventFundamentals = {
  concept: "Event Fundamentals",
  explanation: `
    Events are actions or occurrences that happen in the browser that the JavaScript code can react to.
    Events can be triggered by user actions (clicks, keyboard input, mouse movements) or by the browser
    (page loading, resource loading). The event system is core to interactive web applications.
    
    Key concepts:
    - Event: An action/occurrence (click, submit, load, etc.)
    - Event Target: The element where the event occurred
    - Event Handler: Function that runs when event occurs
    - Event Listener: Code that listens for specific events
    - Event Flow: How events propagate through the DOM
  `,
  
  examples: {
    basicEventHandling: `
// 1. Inline event handling (not recommended)
<button onclick="handleClick()">Click me</button>
<script>
  function handleClick() {
    console.log('Button clicked!');
  }
</script>

// 2. addEventListener method (recommended)
const button = document.querySelector('button');
button.addEventListener('click', function(event) {
  console.log('Button was clicked!');
  console.log('Event object:', event);
});

// 3. Multiple event listeners
button.addEventListener('click', () => console.log('First listener'));
button.addEventListener('click', () => console.log('Second listener'));
// Both listeners will fire

// 4. Removing event listeners
function handleClick() {
  console.log('Clicked');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);
    `,
    
    commonEvents: `
// Mouse Events
element.addEventListener('click', handler);      // Single click
element.addEventListener('dblclick', handler);   // Double click
element.addEventListener('mousedown', handler);  // Mouse button pressed
element.addEventListener('mouseup', handler);    // Mouse button released
element.addEventListener('mousemove', handler);  // Mouse moved
element.addEventListener('mouseenter', handler); // Mouse enters element
element.addEventListener('mouseleave', handler); // Mouse leaves element
element.addEventListener('mouseover', handler);  // Mouse over (bubbles)
element.addEventListener('mouseout', handler);   // Mouse out (bubbles)

// Keyboard Events
document.addEventListener('keydown', handler);   // Key pressed down
document.addEventListener('keyup', handler);     // Key released
document.addEventListener('keypress', handler);  // Character key pressed

// Form Events
form.addEventListener('submit', handler);        // Form submitted
input.addEventListener('change', handler);       // Input value changed
input.addEventListener('input', handler);        // Input receiving input
input.addEventListener('focus', handler);        // Input focused
input.addEventListener('blur', handler);         // Input lost focus

// Document/Window Events
window.addEventListener('load', handler);        // Page fully loaded
window.addEventListener('DOMContentLoaded', handler); // DOM ready
window.addEventListener('resize', handler);      // Window resized
window.addEventListener('scroll', handler);      // Page scrolled
document.addEventListener('visibilitychange', handler); // Tab visibility changed

// Touch Events (mobile)
element.addEventListener('touchstart', handler); // Touch begins
element.addEventListener('touchmove', handler);  // Touch moves
element.addEventListener('touchend', handler);   // Touch ends
element.addEventListener('touchcancel', handler); // Touch cancelled
    `,
    
    eventObject: `
// The Event Object contains information about the event
element.addEventListener('click', function(event) {
  // Event object properties
  console.log(event.type);           // 'click'
  console.log(event.target);         // Element that triggered event
  console.log(event.currentTarget);  // Element with listener attached
  console.log(event.timeStamp);      // When event occurred
  console.log(event.bubbles);        // Does it bubble?
  console.log(event.cancelable);     // Can it be cancelled?
  
  // Mouse event specific
  if (event.type === 'click') {
    console.log(event.clientX);      // X relative to viewport
    console.log(event.clientY);      // Y relative to viewport
    console.log(event.pageX);        // X relative to document
    console.log(event.pageY);        // Y relative to document
    console.log(event.button);       // 0=left, 1=middle, 2=right
  }
  
  // Keyboard event specific
  if (event.type === 'keydown') {
    console.log(event.key);          // 'a', 'Enter', 'Shift', etc.
    console.log(event.code);         // 'KeyA', 'Enter', 'ShiftLeft'
    console.log(event.keyCode);      // Deprecated - use key/code
    console.log(event.altKey);       // Alt pressed?
    console.log(event.ctrlKey);      // Ctrl pressed?
    console.log(event.shiftKey);     // Shift pressed?
    console.log(event.metaKey);      // Cmd/Windows pressed?
  }
});

// Event methods
event.preventDefault();              // Prevent default action
event.stopPropagation();            // Stop event bubbling
event.stopImmediatePropagation();   // Prevent other listeners
    `
  },
  
  keyPoints: [
    "Events are triggered by user actions or browser",
    "Use addEventListener() for modern event handling",
    "Each event has a type (click, keydown, etc.)",
    "Event object contains details about what happened",
    "preventDefault() stops default behavior",
    "stopPropagation() prevents event bubbling"
  ]
};

// ============================================================================
// EVENT FLOW - BUBBLING & CAPTURING
// ============================================================================

/**
 * Event Bubbling & Capturing - Event propagation through the DOM
 */
export const eventFlow = {
  concept: "Event Bubbling & Capturing Phases",
  explanation: `
    When an event occurs on an element, it doesn't just happen on that element. The event has a propagation
    flow through the DOM hierarchy:
    
    1. CAPTURING PHASE: Event travels DOWN from document to target element
    2. TARGET PHASE: Event reaches the target element
    3. BUBBLING PHASE: Event travels UP from target back to document
    
    By default, event listeners fire during the BUBBLING phase. You can capture during the CAPTURING
    phase using the third parameter of addEventListener.
    
    Not all events bubble (e.g., focus, blur, scroll) - check the bubbles property.
  `,
  
  examples: {
    eventPropagation: `
// HTML Structure:
// <div id="outer">
//   <div id="middle">
//     <button id="inner">Click me</button>
//   </div>
// </div>

const outer = document.getElementById('outer');
const middle = document.getElementById('middle');
const inner = document.getElementById('inner');

// BUBBLING PHASE (default - third parameter false or omitted)
inner.addEventListener('click', (e) => console.log('Inner clicked - BUBBLING'));
middle.addEventListener('click', (e) => console.log('Middle clicked - BUBBLING'));
outer.addEventListener('click', (e) => console.log('Outer clicked - BUBBLING'));

// When you click the button, output:
// Inner clicked - BUBBLING
// Middle clicked - BUBBLING
// Outer clicked - BUBBLING

// Event bubbles UP from innermost to outermost element
    `,
    
    capturingPhase: `
// CAPTURING PHASE (third parameter true)
outer.addEventListener('click', (e) => console.log('Outer clicked - CAPTURING'), true);
middle.addEventListener('click', (e) => console.log('Middle clicked - CAPTURING'), true);
inner.addEventListener('click', (e) => console.log('Inner clicked - CAPTURING'), true);

// When you click the button, output:
// Outer clicked - CAPTURING
// Middle clicked - CAPTURING
// Inner clicked - CAPTURING

// Event travels DOWN from outermost to innermost element

// COMBINED: Both capturing and bubbling
outer.addEventListener('click', () => console.log('Outer CAPTURING'), true);
outer.addEventListener('click', () => console.log('Outer BUBBLING'), false);
inner.addEventListener('click', () => console.log('Inner CAPTURING'), true);
inner.addEventListener('click', () => console.log('Inner BUBBLING'), false);

// When you click inner button, output:
// Outer CAPTURING  (capturing phase)
// Inner CAPTURING  (capturing phase)
// Inner BUBBLING   (bubbling phase)
// Outer BUBBLING   (bubbling phase)
    `,
    
    stoppingPropagation: `
// stopPropagation() stops event from propagating further
middle.addEventListener('click', (e) => {
  console.log('Middle clicked');
  e.stopPropagation(); // Prevents outer listener from firing
});
outer.addEventListener('click', (e) => {
  console.log('Outer clicked'); // Won't execute
});

// stopImmediatePropagation() stops other listeners on same element
middle.addEventListener('click', (e) => {
  console.log('First listener');
  e.stopImmediatePropagation();
});
middle.addEventListener('click', (e) => {
  console.log('Second listener'); // Won't execute
});

// preventDefault() prevents default action (doesn't stop propagation)
const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.preventDefault(); // Prevents navigation
  console.log('Link clicked but navigation prevented');
  // Event still bubbles up!
});
    `,
    
    nonBubblingEvents: `
// Some events don't bubble:
// - focus, blur
// - load, unload
// - scroll
// - resize
// - reset
// - submit (for form submission detection)
// - error
// - abort
// - play, pause, playing, seeking, etc. (media events)

// Check if event bubbles
const event = new Event('click');
console.log(event.bubbles); // true

const focusEvent = new Event('focus');
console.log(focusEvent.bubbles); // false

// Use capturing phase for non-bubbling events
const input = document.querySelector('input');
input.addEventListener('focus', handler, true); // Capturing phase
    `
  },
  
  keyPoints: [
    "Events propagate through DOM in two phases: capturing and bubbling",
    "Capturing phase travels DOWN the DOM tree (document → target)",
    "Bubbling phase travels UP the DOM tree (target → document)",
    "addEventListener() fires during bubbling by default",
    "Use true as third parameter to listen during capturing phase",
    "stopPropagation() prevents further propagation",
    "preventDefault() stops default action but doesn't stop propagation",
    "Not all events bubble - check the bubbles property"
  ]
};

// ============================================================================
// EVENT DELEGATION
// ============================================================================

/**
 * Event Delegation - Efficient event handling with bubbling
 */
export const eventDelegation = {
  concept: "Event Delegation Pattern",
  explanation: `
    Event delegation is a technique where instead of attaching event listeners to individual elements,
    you attach a single listener to a parent element and use event.target to determine which child
    element was clicked.
    
    Benefits:
    - Fewer event listeners = better performance
    - Works with dynamically created elements
    - Cleaner code for multiple similar elements
    - Less memory usage
    
    The technique relies on event bubbling - the event bubbles up to the parent where the listener
    is attached, allowing you to handle events for all child elements.
  `,
  
  examples: {
    basicDelegation: `
// WITHOUT Delegation (inefficient for many items)
const items = document.querySelectorAll('.list-item');
items.forEach(item => {
  item.addEventListener('click', handleItemClick);
});

function handleItemClick(e) {
  console.log('Item clicked:', e.target.textContent);
}

// WITH Delegation (efficient - one listener)
const list = document.querySelector('.list');
list.addEventListener('click', handleItemClick);

function handleItemClick(e) {
  // Check if clicked element matches our target selector
  if (e.target.matches('.list-item')) {
    console.log('Item clicked:', e.target.textContent);
  }
}

// HTML:
// <ul class="list">
//   <li class="list-item">Item 1</li>
//   <li class="list-item">Item 2</li>
//   <li class="list-item">Item 3</li>
// </ul>
    `,
    
    dynamicElements: `
// Event delegation is powerful for dynamic content
const container = document.querySelector('.container');

// Single listener handles all current AND future items
container.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    e.target.closest('.item').remove();
  }
  if (e.target.matches('.edit-btn')) {
    editItem(e.target.closest('.item'));
  }
});

// Add new items dynamically - they automatically work!
function addItem(text) {
  const item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = \`
    <span>\${text}</span>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  \`;
  container.appendChild(item);
}

// HTML:
// <div class="container">
//   <div class="item">
//     <span>Item 1</span>
//     <button class="edit-btn">Edit</button>
//     <button class="delete-btn">Delete</button>
//   </div>
//   <!-- More items added dynamically -->
// </div>
    `,
    
    delegationPatterns: `
// Pattern 1: Using matches() method
parent.addEventListener('click', (e) => {
  if (e.target.matches('button.save')) {
    save(e.target);
  }
});

// Pattern 2: Using closest() method (more flexible)
parent.addEventListener('click', (e) => {
  const saveBtn = e.target.closest('button.save');
  if (saveBtn) {
    save(saveBtn);
  }
});

// Pattern 3: Delegating multiple event types
const form = document.querySelector('form');
form.addEventListener('click', handleFormClick);
form.addEventListener('keydown', handleFormKeydown);
form.addEventListener('submit', handleFormSubmit);

function handleFormClick(e) {
  if (e.target.matches('button.save')) {
    save();
  }
  if (e.target.matches('button.cancel')) {
    cancel();
  }
}

function handleFormKeydown(e) {
  if (e.target.matches('input') && e.key === 'Enter') {
    save();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  save();
}

// Pattern 4: Multiple delegation listeners for organization
const app = document.querySelector('.app');

// Component A listeners
app.addEventListener('click', (e) => {
  if (e.target.closest('.component-a')) {
    handleComponentA(e);
  }
});

// Component B listeners
app.addEventListener('click', (e) => {
  if (e.target.closest('.component-b')) {
    handleComponentB(e);
  }
});
    `,
    
    performanceComparison: `
// Performance test: 1000 items

// WITHOUT delegation: 1000 listeners attached
console.time('without-delegation');
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});
console.timeEnd('without-delegation');
// Result: ~5-10ms attachment time, each listener takes memory

// WITH delegation: 1 listener attached
console.time('with-delegation');
const container = document.querySelector('.container');
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    e.target.classList.toggle('active');
  }
});
console.timeEnd('with-delegation');
// Result: <1ms attachment time, minimal memory usage

// Dynamic content - WITHOUT delegation needs re-attachment
function addItemWithoutDelegation() {
  const item = createItemElement();
  item.addEventListener('click', () => { // Need to add listener again!
    item.classList.toggle('active');
  });
  container.appendChild(item);
}

// Dynamic content - WITH delegation works automatically
function addItemWithDelegation() {
  const item = createItemElement();
  container.appendChild(item); // Listener already works!
}
    `
  },
  
  keyPoints: [
    "Attach listener to parent, not individual children",
    "Use event.target or event.currentTarget to identify clicked element",
    "Rely on event bubbling to propagate events up",
    "Use matches() to check if element matches selector",
    "Use closest() to find matching ancestor element",
    "Works automatically with dynamically created elements",
    "Better performance for many elements",
    "Reduces memory footprint significantly"
  ]
};

// ============================================================================
// CUSTOM EVENTS
// ============================================================================

/**
 * Custom Events - Creating and dispatching custom events
 */
export const customEvents = {
  concept: "Custom Events & EventTarget API",
  explanation: `
    JavaScript allows you to create and dispatch custom events. This is useful for:
    - Communication between components
    - Decoupling components
    - Creating plugin systems
    - Implementing pub/sub patterns
    - Building event-driven architectures
    
    There are two ways to create custom events:
    1. Event constructor (basic)
    2. CustomEvent constructor (with data)
  `,
  
  examples: {
    basicCustomEvent: `
// Create and dispatch a simple custom event
const event = new Event('myEvent');
element.dispatchEvent(event);

// Listen for the custom event
element.addEventListener('myEvent', () => {
  console.log('Custom event fired!');
});

// Example: Create a custom "dataLoaded" event
const dataEvent = new Event('dataLoaded');
element.dispatchEvent(dataEvent);

element.addEventListener('dataLoaded', () => {
  console.log('Data has been loaded');
  render();
});
    `,
    
    customEventWithData: `
// CustomEvent allows passing data
const event = new CustomEvent('dataLoaded', {
  detail: {
    message: 'Data is ready',
    data: [1, 2, 3, 4, 5]
  }
});

element.dispatchEvent(event);

// Listen and access the data
element.addEventListener('dataLoaded', (e) => {
  console.log(e.detail.message);      // 'Data is ready'
  console.log(e.detail.data);         // [1, 2, 3, 4, 5]
});

// Real example: Form validation event
const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  const value = e.target.value;
  
  if (value.length < 3) {
    const event = new CustomEvent('validationError', {
      detail: {
        message: 'Minimum 3 characters',
        value: value
      }
    });
    input.dispatchEvent(event);
  } else {
    const event = new CustomEvent('validationSuccess', {
      detail: { value: value }
    });
    input.dispatchEvent(event);
  }
});

input.addEventListener('validationError', (e) => {
  console.log('Error:', e.detail.message);
});

input.addEventListener('validationSuccess', (e) => {
  console.log('Valid:', e.detail.value);
});
    `,
    
    eventTargetInterface: `
// Extend EventTarget for custom objects
class DataStore extends EventTarget {
  constructor() {
    super();
    this.data = [];
  }
  
  addData(item) {
    this.data.push(item);
    
    // Dispatch custom event when data is added
    const event = new CustomEvent('dataAdded', {
      detail: { item: item, length: this.data.length }
    });
    this.dispatchEvent(event);
  }
  
  getData() {
    return this.data;
  }
  
  clearData() {
    this.data = [];
    
    const event = new CustomEvent('dataCleared');
    this.dispatchEvent(event);
  }
}

// Usage
const store = new DataStore();

store.addEventListener('dataAdded', (e) => {
  console.log('Item added:', e.detail.item);
  console.log('Total items:', e.detail.length);
});

store.addEventListener('dataCleared', () => {
  console.log('Store cleared');
});

store.addData('first');     // Fires dataAdded event
store.addData('second');    // Fires dataAdded event
store.clearData();          // Fires dataCleared event
    `,
    
    pubSubPattern: `
// Simple Pub/Sub system using custom events
class EventBus extends EventTarget {
  publish(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    this.dispatchEvent(event);
  }
  
  subscribe(eventName, callback) {
    this.addEventListener(eventName, callback);
  }
  
  unsubscribe(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }
}

// Create global event bus
const bus = new EventBus();

// Component A publishes events
function componentA() {
  bus.publish('userLogin', { username: 'john', id: 123 });
  bus.publish('dataFetched', { items: [1, 2, 3] });
}

// Component B subscribes to events
function componentB() {
  bus.subscribe('userLogin', (e) => {
    console.log('User logged in:', e.detail.username);
    updateUserUI(e.detail);
  });
  
  bus.subscribe('dataFetched', (e) => {
    console.log('Data fetched:', e.detail.items);
    renderItems(e.detail.items);
  });
}

// Component C subscribes to different events
function componentC() {
  bus.subscribe('userLogin', (e) => {
    console.log('Login notification sent');
    sendAnalytics('login', e.detail);
  });
}

// Usage
componentB();
componentC();
componentA(); // Triggers both components
    `
  },
  
  keyPoints: [
    "Use Event constructor for simple custom events",
    "Use CustomEvent constructor to pass data",
    "Dispatch custom events with dispatchEvent()",
    "Listen for custom events with addEventListener()",
    "Extend EventTarget for custom objects",
    "Great for component communication",
    "Useful for decoupling components",
    "Can implement pub/sub patterns"
  ]
};

// ============================================================================
// EXERCISES
// ============================================================================

/**
 * Exercises for Event Systems concept
 */
export const exercises = [
  {
    id: "events_fundamentals",
    title: "Event Basics Challenge",
    difficulty: "easy",
    description: "Create a button that tracks how many times it was clicked",
    template: `
// Create a button and track clicks
const button = document.createElement('button');
button.textContent = 'Click Me';
let clickCount = 0;

// Add event listener here

document.body.appendChild(button);
    `,
    tests: [
      {
        description: "Should have an event listener attached",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should increment click count",
        check: (code) => code.includes('clickCount++') || code.includes('clickCount +=') || code.includes('clickCount = clickCount + 1')
      },
      {
        description: "Should listen for 'click' event",
        check: (code) => code.includes("'click'") || code.includes('"click"')
      }
    ],
    hints: [
      "Use addEventListener to attach a click listener",
      "Inside the handler, increment clickCount",
      "Update the button text to show the count"
    ]
  },
  
  {
    id: "events_form_handling",
    title: "Form Validation Events",
    difficulty: "easy",
    description: "Validate email input and show error/success messages",
    template: `
// Create form with email validation
const form = document.createElement('form');
const input = document.createElement('input');
input.type = 'email';
input.placeholder = 'Enter email';

const message = document.createElement('div');

// Add event listeners for validation

form.appendChild(input);
form.appendChild(message);
document.body.appendChild(form);
    `,
    tests: [
      {
        description: "Should have event listeners",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should validate email format",
        check: (code) => code.includes('@') || code.includes('includes')
      }
    ],
    hints: [
      "Listen to the 'input' event on the email field",
      "Check if email contains @ symbol",
      "Show appropriate message based on validation"
    ]
  },
  
  {
    id: "events_delegation",
    title: "Event Delegation Challenge",
    difficulty: "medium",
    description: "Implement a to-do list with delete buttons using event delegation",
    template: `
// To-do list with event delegation
const list = document.createElement('ul');
const addBtn = document.createElement('button');
addBtn.textContent = 'Add Todo';

function addTodo(text) {
  const item = document.createElement('li');
  item.innerHTML = \`
    <span>\${text}</span>
    <button class="delete">Delete</button>
  \`;
  list.appendChild(item);
}

// Add event delegation listener

addBtn.addEventListener('click', () => {
  addTodo('New todo');
});

document.body.appendChild(addBtn);
document.body.appendChild(list);
    `,
    tests: [
      {
        description: "Should use event delegation",
        check: (code) => code.includes('addEventListener') && code.includes('list')
      },
      {
        description: "Should handle delete button clicks",
        check: (code) => code.includes('delete') || code.includes('remove')
      }
    ],
    hints: [
      "Attach listener to the list element",
      "Use matches() or closest() to identify the delete button",
      "Remove the item when delete is clicked"
    ]
  },
  
  {
    id: "events_custom",
    title: "Custom Event Publisher",
    difficulty: "medium",
    description: "Create a simple pub/sub system with custom events",
    template: `
// Simple event publisher
class Publisher extends EventTarget {
  publish(eventName, data) {
    // Dispatch custom event with data
  }
}

const pub = new Publisher();

// Subscribe to events
pub.addEventListener('greet', (e) => {
  console.log('Event received:', e.detail);
});

// Your challenge: make this work
pub.publish('greet', { message: 'Hello!' });
    `,
    tests: [
      {
        description: "Should use CustomEvent",
        check: (code) => code.includes('CustomEvent')
      },
      {
        description: "Should dispatch events",
        check: (code) => code.includes('dispatchEvent')
      }
    ],
    hints: [
      "Use CustomEvent constructor with detail property",
      "Use dispatchEvent() to trigger the event",
      "The subscriber should receive the data in event.detail"
    ]
  },
  
  {
    id: "events_stopPropagation",
    title: "Event Propagation Control",
    difficulty: "medium",
    description: "Create nested elements and control event propagation",
    template: `
// Nested elements with event propagation
const outer = document.createElement('div');
const middle = document.createElement('div');
const inner = document.createElement('button');

outer.textContent = 'Outer';
middle.textContent = 'Middle ';
inner.textContent = 'Inner';

outer.style.border = '2px solid blue';
middle.style.border = '2px solid green';
inner.style.border = '2px solid red';

// Add event listeners and control propagation

middle.appendChild(inner);
outer.appendChild(middle);
document.body.appendChild(outer);
    `,
    tests: [
      {
        description: "Should have event listeners",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should use stopPropagation",
        check: (code) => code.includes('stopPropagation')
      }
    ],
    hints: [
      "Add click listeners to outer, middle, and inner",
      "Use stopPropagation() to prevent bubbling",
      "Test by clicking inner button and see what gets logged"
    ]
  },
  
  {
    id: "events_keyboard",
    title: "Keyboard Event Handling",
    difficulty: "medium",
    description: "Create a keyboard shortcut handler",
    template: `
// Keyboard shortcut handler
const shortcuts = {};

// Register shortcuts
function registerShortcut(key, callback) {
  shortcuts[key] = callback;
}

// Handle keyboard events

registerShortcut('Enter', () => console.log('Enter pressed'));
registerShortcut('Escape', () => console.log('Escape pressed'));
registerShortcut('Space', () => console.log('Space pressed'));
    `,
    tests: [
      {
        description: "Should listen to keyboard events",
        check: (code) => code.includes('keydown') || code.includes('keyup') || code.includes('keypress')
      },
      {
        description: "Should check event.key",
        check: (code) => code.includes('event.key') || code.includes('e.key')
      }
    ],
    hints: [
      "Listen to keydown or keyup event on document",
      "Check event.key to identify which key was pressed",
      "Call the registered callback for that key"
    ]
  },
  
  {
    id: "events_debounce",
    title: "Debounce Event Handler",
    difficulty: "hard",
    description: "Implement a debounced scroll event handler",
    template: `
// Debounce function and scroll handler
function debounce(func, wait) {
  // Implement debounce logic
}

function handleScroll() {
  console.log('Scroll event fired at', new Date().toLocaleTimeString());
}

const debouncedScroll = debounce(handleScroll, 500);

// Attach to scroll event

// Test: scroll rapidly - should only log after 500ms of no scrolling
    `,
    tests: [
      {
        description: "Should have debounce function",
        check: (code) => code.includes('debounce')
      },
      {
        description: "Should use setTimeout",
        check: (code) => code.includes('setTimeout')
      }
    ],
    hints: [
      "Clear previous timeout on each call",
      "Set new timeout for the function call",
      "Return a debounced version of the function",
      "Attach the debounced function to scroll event"
    ]
  },
  
  {
    id: "events_event_object",
    title: "Working with Event Object",
    difficulty: "medium",
    description: "Create a mouse tracking system that logs mouse position",
    template: `
// Mouse position tracker
const tracker = document.createElement('div');
tracker.textContent = 'Move your mouse here';
tracker.style.width = '400px';
tracker.style.height = '300px';
tracker.style.border = '2px solid black';
tracker.style.position = 'relative';

const position = document.createElement('div');
position.textContent = 'X: 0, Y: 0';

// Add mouse move listener to tracker

tracker.appendChild(position);
document.body.appendChild(tracker);
    `,
    tests: [
      {
        description: "Should listen to mousemove event",
        check: (code) => code.includes('mousemove')
      },
      {
        description: "Should use event.clientX and event.clientY",
        check: (code) => (code.includes('clientX') || code.includes('pageX')) && (code.includes('clientY') || code.includes('pageY'))
      }
    ],
    hints: [
      "Listen to mousemove event on the tracker element",
      "Access event.clientX and event.clientY",
      "Update the position display in real-time"
    ]
  },
  
  {
    id: "events_final_challenge",
    title: "Interactive Event System",
    difficulty: "hard",
    description: "Build a complete todo app with event delegation, custom events, and proper cleanup",
    template: `
// Complete todo application with events
class TodoApp {
  constructor(selector) {
    this.app = document.querySelector(selector);
    this.todos = [];
    this.setupUI();
    this.attachListeners();
  }
  
  setupUI() {
    // Create input, button, and list
  }
  
  attachListeners() {
    // Add event listeners using delegation
  }
  
  addTodo(text) {
    // Add todo and dispatch custom event
  }
  
  removeTodo(index) {
    // Remove todo and dispatch custom event
  }
}

const app = new TodoApp('.container');
    `,
    tests: [
      {
        description: "Should have addEventListener",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should handle add and remove",
        check: (code) => code.includes('addTodo') && code.includes('removeTodo')
      }
    ],
    hints: [
      "Use event delegation for the todo list",
      "Dispatch custom events for add/remove actions",
      "Keep todo array in sync with DOM",
      "Implement proper cleanup and organization"
    ]
  }
];

// ============================================================================
// EXPORT ALL CONCEPTS
// ============================================================================

export default {
  config: eventsConfig,
  fundamentals: eventFundamentals,
  flow: eventFlow,
  delegation: eventDelegation,
  custom: customEvents,
  exercises: exercises
};
