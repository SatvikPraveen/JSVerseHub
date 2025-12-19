// File: src/concepts/events/event-delegation.js
// Event Delegation Patterns and Best Practices

/**
 * Event Delegation Strategies and Performance Optimization
 */
export const delegationStrategies = {
  concept: "Advanced Event Delegation Patterns",
  explanation: `
    Event delegation is a cornerstone pattern for scalable JavaScript applications.
    This module covers advanced delegation patterns, performance considerations,
    and common use cases.
  `
};

/**
 * Strategy 1: Direct Element Matching
 */
export const directMatching = {
  name: "Direct Element Matching",
  description: "Match directly against the clicked element",
  examples: {
    basic: `
// Simple delegation with direct matching
const container = document.querySelector('.user-list');

container.addEventListener('click', (e) => {
  // Direct check on clicked element
  if (e.target.classList.contains('user-name')) {
    viewUserProfile(e.target.textContent);
  }
  
  if (e.target.classList.contains('delete-btn')) {
    deleteUser(e.target.dataset.userId);
  }
  
  if (e.target.className === 'edit-btn') {
    editUser(e.target.dataset.userId);
  }
});

// HTML:
// <div class="user-list">
//   <div class="user-item">
//     <span class="user-name">John</span>
//     <button class="edit-btn" data-user-id="1">Edit</button>
//     <button class="delete-btn" data-user-id="1">Delete</button>
//   </div>
// </div>
    `
  }
};

/**
 * Strategy 2: Using matches() Method
 */
export const matchesMethod = {
  name: "Using matches() CSS Selector",
  description: "Match using CSS selectors for powerful querying",
  examples: {
    cssSelectors: `
// Using matches() with CSS selectors
const form = document.querySelector('form');

form.addEventListener('click', (e) => {
  // Match by class
  if (e.target.matches('.btn-primary')) {
    handlePrimaryAction();
  }
  
  // Match by attribute
  if (e.target.matches('[data-action="save"]')) {
    save();
  }
  
  // Match by tag and class
  if (e.target.matches('button.btn-danger')) {
    delete();
  }
  
  // Complex selector
  if (e.target.matches('input[type="submit"].btn-large')) {
    submitForm();
  }
});
    `,
    
    combinedMatchers: `
// Multiple matchers in one listener
const app = document.querySelector('.app');

app.addEventListener('click', (e) => {
  // Navigation
  if (e.target.matches('a.nav-link')) {
    handleNavigation(e.target.href);
    e.preventDefault();
  }
  
  // Buttons
  if (e.target.matches('button')) {
    const action = e.target.dataset.action;
    if (action) {
      executeAction(action);
    }
  }
  
  // Checkboxes
  if (e.target.matches('input[type="checkbox"]')) {
    updatePreference(e.target.dataset.preference, e.target.checked);
  }
  
  // Text inputs with special handling
  if (e.target.matches('input.autocomplete')) {
    showAutocomplete(e.target);
  }
});
    `
  }
};

/**
 * Strategy 3: Using closest() Method
 */
export const closestMethod = {
  name: "Using closest() for Flexible Selection",
  description: "Find the closest matching ancestor element",
  examples: {
    ancestorTraversal: `
// Using closest() to find parent element
const todoList = document.querySelector('.todo-list');

todoList.addEventListener('click', (e) => {
  // Find closest button
  const button = e.target.closest('button');
  if (!button) return;
  
  // Get the todo item from the button
  const todoItem = button.closest('.todo-item');
  if (!todoItem) return;
  
  // Determine action from button class
  if (button.classList.contains('delete')) {
    todoItem.remove();
  } else if (button.classList.contains('complete')) {
    todoItem.classList.toggle('completed');
  } else if (button.classList.contains('edit')) {
    editTodoItem(todoItem);
  }
});

// HTML:
// <div class="todo-list">
//   <div class="todo-item">
//     <span>Buy milk</span>
//     <button class="complete">✓</button>
//     <button class="edit">✎</button>
//     <button class="delete">✕</button>
//   </div>
// </div>
    `,
    
    nestedStructures: `
// Handling deeply nested structures with closest()
const table = document.querySelector('table');

table.addEventListener('click', (e) => {
  // Get the table cell
  const cell = e.target.closest('td, th');
  if (!cell) return;
  
  // Get the table row
  const row = cell.closest('tr');
  if (!row) return;
  
  // Get the table
  const table = row.closest('table');
  if (!table) return;
  
  console.log('Row index:', Array.from(table.rows).indexOf(row));
  console.log('Cell index:', Array.from(row.cells).indexOf(cell));
});

// HTML:
// <table>
//   <tr>
//     <td><button>Edit</button></td>
//     <td>Data</td>
//   </tr>
// </table>
    `
  }
};

/**
 * Strategy 4: Event Type Based Delegation
 */
export const eventTypeBasedDelegation = {
  name: "Event Type Based Delegation",
  description: "Different handlers for different event types",
  examples: {
    multipleEvents: `
// Delegate multiple event types on same listener
const form = document.querySelector('form');

form.addEventListener('click', handleFormClick);
form.addEventListener('change', handleFormChange);
form.addEventListener('input', handleFormInput);
form.addEventListener('submit', handleFormSubmit);

function handleFormClick(e) {
  if (e.target.matches('button.save')) {
    save();
  } else if (e.target.matches('button.cancel')) {
    cancel();
  }
}

function handleFormChange(e) {
  if (e.target.matches('select')) {
    updateOptions(e.target.value);
  }
}

function handleFormInput(e) {
  if (e.target.matches('input.search')) {
    performSearch(e.target.value);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  submitForm();
}
    `,
    
    focusEvents: `
// Delegate focus/blur events (don't bubble by default)
const form = document.querySelector('form');

form.addEventListener('focusin', (e) => {
  if (e.target.matches('input')) {
    e.target.parentElement.classList.add('focused');
  }
});

form.addEventListener('focusout', (e) => {
  if (e.target.matches('input')) {
    e.target.parentElement.classList.remove('focused');
  }
});

// Note: focusin/focusout bubble, while focus/blur don't
    `
  }
};

/**
 * Strategy 5: Data Attributes for Delegation
 */
export const dataAttributeDelegation = {
  name: "Data Attributes for Action Routing",
  description: "Use data attributes to route actions",
  examples: {
    actionRouting: `
// Route actions using data attributes
const app = document.querySelector('.app');
const actionHandlers = {};

// Register action handlers
actionHandlers['delete'] = (element) => {
  element.remove();
};

actionHandlers['toggle'] = (element) => {
  element.classList.toggle('active');
};

actionHandlers['navigate'] = (element) => {
  const url = element.dataset.url;
  window.location.href = url;
};

actionHandlers['edit'] = (element) => {
  enableEditMode(element);
};

// Main delegation listener
app.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (action && actionHandlers[action]) {
    actionHandlers[action](e.target);
  }
});

// HTML:
// <div class="app">
//   <item data-action="delete">Item 1</item>
//   <item data-action="toggle">Item 2</item>
//   <a data-action="navigate" data-url="/page">Link</a>
// </div>
    `,
    
    parameterPassing: `
// Pass parameters through data attributes
const list = document.querySelector('.list');

list.addEventListener('click', (e) => {
  if (!e.target.matches('[data-command]')) return;
  
  const command = e.target.dataset.command;
  const params = JSON.parse(e.target.dataset.params || '{}');
  
  executeCommand(command, params);
});

// HTML:
// <div class="list">
//   <button data-command="sort" data-params='{"field":"name"}'>Sort</button>
//   <button data-command="filter" data-params='{"type":"active"}'>Filter</button>
//   <button data-command="search" data-params='{"query":"test"}'>Search</button>
// </div>

function executeCommand(command, params) {
  console.log('Execute:', command, params);
}
    `
  }
};

/**
 * Performance Best Practices
 */
export const performanceBestPractices = {
  name: "Performance Optimization",
  examples: {
    listenerPlacement: `
// GOOD: Single listener at container level
const container = document.querySelector('.large-list');
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleItemClick(e.target);
  }
});

// BAD: 10,000 listeners on individual items
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', handleItemClick); // Memory intensive!
});

// Performance comparison:
// - Single listener: 1 listener, minimal memory
// - Individual listeners: 10,000 listeners, significant memory
// - Difference: ~100x more memory usage!
    `,
    
    eventDelegationWithDynamicContent: `
// Delegation automatically works with dynamic content
const container = document.querySelector('.container');

// Single listener - works for all current and future items
container.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    deleteItem(e.target.closest('.item'));
  }
});

// Add items dynamically - no need to re-attach listeners!
function addItem(text) {
  const item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = \`
    <span>\${text}</span>
    <button class="delete-btn">Delete</button>
  \`;
  container.appendChild(item);
  // Delete button immediately works!
}

// Bad approach (re-attaching listeners):
function addItemBad(text) {
  const item = document.createElement('div');
  item.className = 'item';
  item.innerHTML = \`
    <span>\${text}</span>
    <button class="delete-btn">Delete</button>
  \`;
  
  // Have to re-attach listener each time! Memory leak risk!
  item.querySelector('.delete-btn').addEventListener('click', () => {
    deleteItem(item);
  });
  
  container.appendChild(item);
}
    `,
    
    stopPropagationCosts: `
// Be careful with stopPropagation() - can prevent other listeners
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

// Multiple listeners at different levels
parent.addEventListener('click', () => {
  console.log('Parent listener');
});

child.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents parent listener!
  console.log('Child listener');
});

// Better: Only prevent specific actions
child.addEventListener('click', (e) => {
  if (e.target.matches('.interactive-element')) {
    // Only stop propagation when needed
    e.stopPropagation();
  }
});
    `,
    
    passiveListeners: `
// Improve scroll/touchmove performance with passive listeners
// Passive listeners can't call preventDefault()
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', handleTouchMove, { passive: true });
window.addEventListener('wheel', handleWheel, { passive: true });

// Regular listeners (allow preventDefault)
button.addEventListener('click', handleClick); // Can preventDefault

// Use passive when you won't call preventDefault()
function handleScroll(e) {
  // Can't call e.preventDefault() - that's okay for scroll
  updateScrollIndicator();
}

// Performance benefit:
// - Passive listeners let browser optimize immediately
// - No need to wait for JavaScript to run
// - Smoother 60fps scrolling
    `
  }
};

/**
 * Common Pitfalls and Solutions
 */
export const commonPitfalls = {
  name: "Common Pitfalls",
  examples: {
    targetVsCurrentTarget: `
// Pitfall: Confusing event.target with event.currentTarget
const parent = document.querySelector('.parent');

parent.addEventListener('click', (e) => {
  // e.target: the element that was clicked
  console.log('Clicked element:', e.target.className);
  
  // e.currentTarget: the element with the listener
  console.log('Listener element:', e.currentTarget.className);
});

// If child inside parent is clicked:
// e.target = child
// e.currentTarget = parent

// Correct delegation usage:
if (e.target.matches('.specific-class')) {
  handleClick(e.target);
}
    `,
    
    dynamicSelectorsNeedReevaluation: `
// Pitfall: Dynamically added elements not matching selector
const list = document.querySelector('.list');

// This works for existing items
list.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('Item clicked');
  }
});

// This won't work because .item is added dynamically
setTimeout(() => {
  const item = document.createElement('div');
  item.className = 'item'; // Added after page load
  list.appendChild(item);
  // Click on this item: works! (delegation checks at click time)
}, 1000);

// This WILL work:
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('item')) {
    console.log('Item clicked');
  }
});
    `,
    
    preventingBubblingTooEagerly: `
// Pitfall: Stopping propagation prevents other listeners
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  console.log('Form submitted');
  saveData();
});

// Inside form
const input = document.querySelector('input');
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation(); // Stops form submit listener!
  }
});

// Better: Only prevent specific propagation
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    // Don't stop propagation unless necessary
  }
});
    `,
    
    memoryLeaksWithEventListeners: `
// Pitfall: Not removing event listeners (memory leak)
class Component {
  constructor() {
    this.element = document.querySelector('.component');
    this.handleClick = this.handleClick.bind(this);
    
    // Add listener
    this.element.addEventListener('click', this.handleClick);
  }
  
  handleClick(e) {
    console.log('Clicked');
  }
  
  // MUST remove listener when component is destroyed
  destroy() {
    // Without this, listener stays in memory!
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;
  }
}

// Usage
let component = new Component();
component.destroy(); // Properly cleaned up

// Common SPA pattern:
class Page {
  load() {
    this.container.addEventListener('click', this.handleClick);
  }
  
  unload() {
    // Must remove to prevent memory leak
    this.container.removeEventListener('click', this.handleClick);
  }
}
    `
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  strategies: delegationStrategies,
  directMatching: directMatching,
  matchesMethod: matchesMethod,
  closestMethod: closestMethod,
  eventTypeBased: eventTypeBasedDelegation,
  dataAttributes: dataAttributeDelegation,
  performance: performanceBestPractices,
  pitfalls: commonPitfalls
};
