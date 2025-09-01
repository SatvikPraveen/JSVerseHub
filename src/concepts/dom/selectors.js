// File: src/concepts/dom/selectors.js
// Advanced DOM Selectors - Comprehensive guide to element selection methods

export const selectorConfig = {
  title: "DOM Selectors Mastery",
  description: "Master all methods of selecting DOM elements efficiently",
  difficulty: "beginner-intermediate",
  estimatedTime: "30 minutes"
};

// Basic Selection Methods
export const basicSelectors = {
  concept: "Basic Selection Methods",
  explanation: `
    The foundation of DOM manipulation starts with selecting elements.
    JavaScript provides several methods, each optimized for different use cases.
  `,
  
  examples: {
    getElementById: `
// getElementById - Fastest method for single elements with unique IDs
const header = document.getElementById('main-header');
const navigation = document.getElementById('nav-menu');
const loginForm = document.getElementById('login-form');

// Returns null if element not found
const nonExistent = document.getElementById('does-not-exist');
console.log(nonExistent); // null

// Best practices
if (header) {
  header.style.color = 'blue';
} else {
  console.warn('Header element not found');
}

// Performance note: This is the fastest selection method
// Use when you have unique IDs
    `,
    
    getElementsByClassName: `
// getElementsByClassName - Returns live HTMLCollection
const buttons = document.getElementsByClassName('btn');
const activeItems = document.getElementsByClassName('active');
const errorMessages = document.getElementsByClassName('error-message');

// Live collection - updates automatically
console.log('Initial button count:', buttons.length);

// Add a new button
const newButton = document.createElement('button');
newButton.className = 'btn';
document.body.appendChild(newButton);

console.log('After adding button:', buttons.length); // Increased by 1

// Convert to array for easier manipulation
const buttonArray = Array.from(buttons);
const buttonArraySpread = [...buttons];

// Multiple classes (space-separated string searches for elements with ALL classes)
const specificButtons = document.getElementsByClassName('btn primary large');

// Iterate through collection
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', handleButtonClick);
}

// Or using for...of (works on HTMLCollections)
for (const button of buttons) {
  button.style.cursor = 'pointer';
}
    `,
    
    getElementsByTagName: `
// getElementsByTagName - Select by HTML tag name
const allDivs = document.getElementsByTagName('div');
const allParagraphs = document.getElementsByTagName('p');
const allImages = document.getElementsByTagName('img');
const allLinks = document.getElementsByTagName('a');

// Special case: get ALL elements
const allElements = document.getElementsByTagName('*');

// Case insensitive
const headings = document.getElementsByTagName('H1'); // Same as 'h1'

// Useful for bulk operations
function addClassToAllImages(className) {
  const images = document.getElementsByTagName('img');
  for (const img of images) {
    img.classList.add(className);
  }
}

// Find specific tags within a parent
const sidebar = document.getElementById('sidebar');
const sidebarLinks = sidebar.getElementsByTagName('a');
    `,
    
    getElementsByName: `
// getElementsByName - Select by name attribute (mainly for form elements)
const usernameFields = document.getElementsByName('username');
const radioButtons = document.getElementsByName('gender');
const checkboxes = document.getElementsByName('interests');

// Common with form handling
function getFormValues(formName) {
  const form = document.getElementsByName(formName)[0];
  if (!form) return null;
  
  const formData = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (input.name) {
      formData[input.name] = input.value;
    }
  });
  
  return formData;
}

// Radio button handling
function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null;
}
    `
  }
};

// Modern Query Selectors
export const modernSelectors = {
  concept: "Modern Query Selectors",
  explanation: `
    querySelector and querySelectorAll use CSS selectors and are more flexible
    than the basic methods. They return static NodeLists (snapshots).
  `,
  
  examples: {
    querySelector: `
// querySelector - Returns first matching element or null
const firstButton = document.querySelector('button');
const mainHeader = document.querySelector('#main-header');
const firstActiveItem = document.querySelector('.active');
const submitButton = document.querySelector('button[type="submit"]');

// Complex selectors
const firstListItem = document.querySelector('ul li:first-child');
const lastParagraph = document.querySelector('section p:last-of-type');
const requiredInput = document.querySelector('input:required');
const checkedCheckbox = document.querySelector('input[type="checkbox"]:checked');

// Descendant selectors
const navLink = document.querySelector('nav a');
const articleImage = document.querySelector('article img');
const formButton = document.querySelector('form button.primary');

// Pseudo-classes
const hoverableElements = document.querySelector(':hover');
const focusedElement = document.querySelector(':focus');
const disabledInputs = document.querySelector('input:disabled');

// Attribute selectors
const externalLinks = document.querySelector('a[href^="http"]');
const pdfLinks = document.querySelector('a[href$=".pdf"]');
const dataElements = document.querySelector('[data-user-id]');
const specificUser = document.querySelector('[data-user-id="123"]');

// Combined selectors
const specificElement = document.querySelector('div.container > .content p:not(.highlight)');
    `,
    
    querySelectorAll: `
// querySelectorAll - Returns static NodeList of all matching elements
const allButtons = document.querySelectorAll('button');
const allActiveItems = document.querySelectorAll('.active');
const allExternalLinks = document.querySelectorAll('a[href^="http"]');

// Multiple selectors (comma-separated)
const headingsAndParagraphs = document.querySelectorAll('h1, h2, h3, p');
const inputsAndSelects = document.querySelectorAll('input, select, textarea');

// Advanced selectors
const evenTableRows = document.querySelectorAll('tr:nth-child(even)');
const oddTableRows = document.querySelectorAll('tr:nth-child(odd)');
const everyThirdItem = document.querySelectorAll('li:nth-child(3n)');

// Pseudo-selectors
const emptyElements = document.querySelectorAll(':empty');
const elementsWithText = document.querySelectorAll('p:not(:empty)');
const firstChildren = document.querySelectorAll(':first-child');
const lastChildren = document.querySelectorAll(':last-child');

// Complex combinations
const specificCombination = document.querySelectorAll(
  'article.featured .content p:first-of-type'
);

// Convert NodeList to Array for additional methods
const buttonsArray = Array.from(allButtons);
const buttonsSpread = [...allButtons];

// NodeList methods (limited compared to Arrays)
allButtons.forEach((button, index) => {
  button.dataset.index = index;
  button.addEventListener('click', (e) => {
    console.log('Button', index, 'clicked');
  });
});

// Static vs Live collections
const staticButtons = document.querySelectorAll('button'); // Static snapshot
const liveButtons = document.getElementsByTagName('button'); // Live collection

console.log('Static:', staticButtons.length, 'Live:', liveButtons.length);

// Add new button
document.body.appendChild(document.createElement('button'));

console.log('After adding button - Static:', staticButtons.length, 'Live:', liveButtons.length);
// Static count stays same, live count increases
    `
  }
};

// Advanced Selector Techniques
export const advancedSelectors = {
  concept: "Advanced Selector Techniques",
  explanation: `
    Advanced patterns and techniques for complex element selection scenarios.
  `,
  
  examples: {
    contextualSelection: `
// Contextual selection - selecting within specific containers
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = sidebar.querySelectorAll('a');
const sidebarActiveLink = sidebar.querySelector('a.active');

// Method chaining for context
const menuItems = document.querySelector('.menu').querySelectorAll('.menu-item');

// Selecting across multiple contexts
function selectInContainers(containerSelector, itemSelector) {
  const containers = document.querySelectorAll(containerSelector);
  const allItems = [];
  
  containers.forEach(container => {
    const items = container.querySelectorAll(itemSelector);
    allItems.push(...items);
  });
  
  return allItems;
}

// Usage: find all buttons in all card containers
const cardButtons = selectInContainers('.card', 'button');

// Parent-child relationship selection
const parentWithActiveChild = document.querySelector('.item:has(.active)'); // Modern browsers
const childrenOfActiveParent = document.querySelectorAll('.active > *');

// Sibling selection
const nextSibling = document.querySelector('.current + .next');
const allFollowingSiblings = document.querySelectorAll('.current ~ *');
    `,
    
    attributeSelectors: `
// Advanced attribute selectors
// Exact match
const exactMatch = document.querySelectorAll('[data-category="electronics"]');

// Contains word (space-separated)
const containsWord = document.querySelectorAll('[class~="highlight"]');

// Starts with
const startsWithHttp = document.querySelectorAll('[href^="http"]');
const startsWithData = document.querySelectorAll('[id^="data-"]');

// Ends with
const endsWithPdf = document.querySelectorAll('[href$=".pdf"]');
const endsWithJpg = document.querySelectorAll('[src$=".jpg"]');

// Contains substring
const containsSubstring = document.querySelectorAll('[title*="important"]');

// Case-insensitive matching (add 'i' flag)
const caseInsensitive = document.querySelectorAll('[title*="Important" i]');

// Multiple attribute conditions
const multipleAttrs = document.querySelectorAll('input[type="text"][required]');
const complexAttrs = document.querySelectorAll('[data-status="active"][data-priority="high"]');

// Data attributes (preferred approach)
const userElements = document.querySelectorAll('[data-user-id]');
const specificUser = document.querySelector('[data-user-id="user-123"]');
const categoryItems = document.querySelectorAll('[data-category]');

// Dynamic attribute selection
function selectByDataAttribute(attribute, value) {
  return document.querySelectorAll(\`[data-\${attribute}="\${value}"]\`);
}

const electronics = selectByDataAttribute('category', 'electronics');
const highPriority = selectByDataAttribute('priority', 'high');
    `,
    
    pseudoSelectors: `
// Structural pseudo-selectors
const firstChild = document.querySelectorAll(':first-child');
const lastChild = document.querySelectorAll(':last-child');
const onlyChild = document.querySelectorAll(':only-child');

// Type-based pseudo-selectors
const firstParagraph = document.querySelectorAll('p:first-of-type');
const lastImage = document.querySelectorAll('img:last-of-type');
const onlyHeading = document.querySelectorAll('h1:only-of-type');

// nth-child patterns
const evenItems = document.querySelectorAll('li:nth-child(even)');
const oddItems = document.querySelectorAll('li:nth-child(odd)');
const everyThird = document.querySelectorAll('li:nth-child(3n)');
const everyThirdStartingSecond = document.querySelectorAll('li:nth-child(3n+2)');

// nth-of-type patterns
const everySecondParagraph = document.querySelectorAll('p:nth-of-type(2n)');
const firstThreeImages = document.querySelectorAll('img:nth-of-type(-n+3)');

// State pseudo-selectors
const checkedInputs = document.querySelectorAll('input:checked');
const disabledElements = document.querySelectorAll(':disabled');
const requiredFields = document.querySelectorAll('input:required');
const validFields = document.querySelectorAll('input:valid');
const invalidFields = document.querySelectorAll('input:invalid');

// Content-based pseudo-selectors
const emptyElements = document.querySelectorAll(':empty');
const elementsWithContent = document.querySelectorAll('p:not(:empty)');

// Negation pseudo-selector
const notHidden = document.querySelectorAll('div:not(.hidden)');
const notDisabled = document.querySelectorAll('input:not(:disabled)');
const notFirstChild = document.querySelectorAll('li:not(:first-child)');

// Complex negation
const complexNot = document.querySelectorAll('button:not(.primary):not(.secondary)');
    `,
    
    performanceOptimization: `
// Performance considerations and optimizations

// 1. Use specific selectors
// Slow: document.querySelectorAll('*');
// Fast: document.querySelectorAll('.specific-class');

// 2. Scope your selections
const container = document.getElementById('main-content');
const items = container.querySelectorAll('.item'); // Better than document.querySelectorAll('#main-content .item');

// 3. Cache frequently used selections
const cachedElements = {
  navigation: document.querySelector('.navigation'),
  sidebar: document.querySelector('.sidebar'),
  content: document.querySelector('.content')
};

// 4. Use the most appropriate method
// For IDs: getElementById (fastest)
const fastId = document.getElementById('unique-id');

// For single class: querySelector
const singleClass = document.querySelector('.single-class');

// For multiple elements: querySelectorAll or getElementsByClassName
const multipleElements = document.querySelectorAll('.multiple-items');

// 5. Minimize DOM queries in loops
// Bad
for (let i = 0; i < 100; i++) {
  const element = document.querySelector('.dynamic-element');
  // Do something with element
}

// Good
const element = document.querySelector('.dynamic-element');
for (let i = 0; i < 100; i++) {
  // Do something with cached element
}

// 6. Use delegation instead of multiple listeners
// Bad: Adding listeners to many elements
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleItemClick);
});

// Good: Single listener with delegation
document.querySelector('.container').addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event);
  }
});

// 7. Batch DOM operations
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const element = document.createElement('div');
  element.textContent = \`Item \${i}\`;
  fragment.appendChild(element);
}
document.querySelector('.container').appendChild(fragment);

function handleItemClick(event) {
  console.log('Item clicked:', event.target);
}
    `
  }
};

// Selector Utility Functions
export const selectorUtilities = {
  concept: "Selector Utility Functions",
  explanation: `
    Useful utility functions to enhance DOM selection capabilities.
  `,
  
  examples: {
    utilityFunctions: `
// Utility functions for enhanced selection

// Multi-selector function
function selectMultiple(...selectors) {
  const elements = [];
  selectors.forEach(selector => {
    elements.push(...document.querySelectorAll(selector));
  });
  return [...new Set(elements)]; // Remove duplicates
}

// Usage
const importantElements = selectMultiple('.highlight', '.important', '[data-priority="high"]');

// Find parent with specific selector
function findParent(element, selector) {
  while (element && element !== document) {
    if (element.matches(selector)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

// Usage
const button = document.querySelector('.submit-btn');
const form = findParent(button, 'form');

// Find all children matching selector
function findChildren(parent, selector) {
  return Array.from(parent.children).filter(child => child.matches(selector));
}

// Get siblings matching selector
function getSiblings(element, selector = '*') {
  const siblings = Array.from(element.parentElement.children);
  return siblings.filter(sibling => sibling !== element && sibling.matches(selector));
}

// Get elements by text content
function getElementsByText(text, tag = '*') {
  const elements = document.querySelectorAll(tag);
  return Array.from(elements).filter(el => 
    el.textContent.trim().toLowerCase().includes(text.toLowerCase())
  );
}

// Get elements by partial attribute value
function getByPartialAttribute(attribute, value) {
  return document.querySelectorAll(\`[\${attribute}*="\${value}"]\`);
}

// Safe selector - returns empty array if selector fails
function safeQuerySelectorAll(selector) {
  try {
    return Array.from(document.querySelectorAll(selector));
  } catch (error) {
    console.warn(\`Invalid selector: \${selector}\`, error);
    return [];
  }
}

// Wait for element to exist (useful for dynamic content)
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(\`Element \${selector} not found within \${timeout}ms\`));
    }, timeout);
  });
}

// Usage
waitForElement('.dynamic-content').then(element => {
  console.log('Element found:', element);
});

// Check if element exists
function exists(selector) {
  return document.querySelector(selector) !== null;
}

// Get element index among siblings
function getElementIndex(element) {
  return Array.from(element.parentElement.children).indexOf(element);
}

// Find elements containing specific data
function findElementsByData(dataKey, dataValue) {
  if (dataValue) {
    return document.querySelectorAll(\`[data-\${dataKey}="\${dataValue}"]\`);
  } else {
    return document.querySelectorAll(\`[data-\${dataKey}]\`);
  }
}
    `,
    
    selectorHelpers: `
// Advanced selector helpers and patterns

// Element collection wrapper with utility methods
class ElementCollection {
  constructor(selector) {
    this.elements = Array.from(document.querySelectorAll(selector));
    this.selector = selector;
  }
  
  each(callback) {
    this.elements.forEach(callback);
    return this;
  }
  
  addClass(className) {
    this.each(el => el.classList.add(className));
    return this;
  }
  
  removeClass(className) {
    this.each(el => el.classList.remove(className));
    return this;
  }
  
  toggle(className) {
    this.each(el => el.classList.toggle(className));
    return this;
  }
  
  css(property, value) {
    if (value !== undefined) {
      this.each(el => el.style[property] = value);
      return this;
    } else {
      return this.elements[0]?.style[property];
    }
  }
  
  attr(attribute, value) {
    if (value !== undefined) {
      this.each(el => el.setAttribute(attribute, value));
      return this;
    } else {
      return this.elements[0]?.getAttribute(attribute);
    }
  }
  
  on(event, handler) {
    this.each(el => el.addEventListener(event, handler));
    return this;
  }
  
  get length() {
    return this.elements.length;
  }
  
  get(index) {
    return this.elements[index];
  }
  
  first() {
    return this.elements[0];
  }
  
  last() {
    return this.elements[this.elements.length - 1];
  }
  
  filter(predicate) {
    this.elements = this.elements.filter(predicate);
    return this;
  }
  
  refresh() {
    this.elements = Array.from(document.querySelectorAll(this.selector));
    return this;
  }
}

// Usage
const buttons = new ElementCollection('button')
  .addClass('btn')
  .css('cursor', 'pointer')
  .on('click', (e) => console.log('Button clicked:', e.target));

// Smart selector with automatic fallbacks
function smartSelect(primarySelector, fallbackSelectors = []) {
  let element = document.querySelector(primarySelector);
  
  if (!element && fallbackSelectors.length > 0) {
    for (const fallback of fallbackSelectors) {
      element = document.querySelector(fallback);
      if (element) break;
    }
  }
  
  return element;
}

// Usage
const header = smartSelect('#header', ['#main-header', '.header', 'header']);

// Conditional selector
function selectIf(condition, trueSelector, falseSelector) {
  return document.querySelector(condition ? trueSelector : falseSelector);
}

// Selector with error handling and logging
function debugSelect(selector, context = document) {
  console.log(\`Selecting: \${selector}\`);
  
  try {
    const elements = context.querySelectorAll(selector);
    console.log(\`Found \${elements.length} elements\`);
    
    if (elements.length === 0) {
      console.warn(\`No elements found for selector: \${selector}\`);
    }
    
    return elements;
  } catch (error) {
    console.error(\`Invalid selector: \${selector}\`, error);
    return [];
  }
}

// Cached selector factory
function createCachedSelector() {
  const cache = new Map();
  
  return function cachedSelect(selector) {
    if (cache.has(selector)) {
      return cache.get(selector);
    }
    
    const elements = document.querySelectorAll(selector);
    cache.set(selector, elements);
    
    // Auto-clear cache after 5 seconds (adjust as needed)
    setTimeout(() => cache.delete(selector), 5000);
    
    return elements;
  };
}

const $ = createCachedSelector();

// Usage
const buttons1 = $('.button'); // Queries DOM
const buttons2 = $('.button'); // Uses cache
    `
  }
};

// Practical Examples and Exercises
export const practicalExamples = {
  concept: "Practical Selection Examples",
  explanation: `
    Real-world scenarios and common use cases for DOM selection.
  `,
  
  examples: {
    formHandling: `
// Form element selection and handling
const form = document.querySelector('#registration-form');
const requiredFields = form.querySelectorAll('input:required, select:required');
const textInputs = form.querySelectorAll('input[type="text"], input[type="email"]');
const checkboxes = form.querySelectorAll('input[type="checkbox"]');
const radioGroups = {};

// Group radio buttons by name
form.querySelectorAll('input[type="radio"]').forEach(radio => {
  if (!radioGroups[radio.name]) {
    radioGroups[radio.name] = [];
  }
  radioGroups[radio.name].push(radio);
});

// Validate form
function validateForm() {
  const errors = [];
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      errors.push(\`\${field.name || field.id} is required\`);
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  });
  
  // Check radio button groups
  Object.keys(radioGroups).forEach(groupName => {
    const group = radioGroups[groupName];
    const isRequired = group[0].required;
    const hasSelection = group.some(radio => radio.checked);
    
    if (isRequired && !hasSelection) {
      errors.push(\`Please select a \${groupName}\`);
    }
  });
  
  return errors;
}
    `,
    
    navigationHandling: `
// Navigation and menu selection
const navigation = document.querySelector('nav');
const menuItems = navigation.querySelectorAll('.menu-item');
const activeItem = navigation.querySelector('.menu-item.active');
const dropdownMenus = navigation.querySelectorAll('.dropdown-menu');

// Handle menu interactions
menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all items
    menuItems.forEach(i => i.classList.remove('active'));
    
    // Add active class to clicked item
    item.classList.add('active');
    
    // Handle dropdown
    const dropdown = item.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!navigation.contains(e.target)) {
    dropdownMenus.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }
});
    `,
    
    dataTableHandling: `
// Data table selection and manipulation
const table = document.querySelector('.data-table');
const headerCells = table.querySelectorAll('th');
const bodyRows = table.querySelectorAll('tbody tr');
const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');

// Sortable columns
headerCells.forEach((header, index) => {
  if (header.classList.contains('sortable')) {
    header.addEventListener('click', () => sortTable(index));
  }
});

// Select all functionality
selectAllCheckbox?.addEventListener('change', (e) => {
  rowCheckboxes.forEach(checkbox => {
    checkbox.checked = e.target.checked;
  });
});

// Row selection
bodyRows.forEach(row => {
  row.addEventListener('click', (e) => {
    if (e.target.type !== 'checkbox') {
      row.classList.toggle('selected');
    }
  });
});

// Filter table rows
function filterTable(searchTerm) {
  bodyRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matches = text.includes(searchTerm.toLowerCase());
    row.style.display = matches ? '' : 'none';
  });
}

function sortTable(columnIndex) {
  const rows = Array.from(bodyRows);
  const isAscending = headerCells[columnIndex].classList.contains('asc');
  
  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();
    
    // Try numeric comparison first
    const aNum = parseFloat(aText);
    const bNum = parseFloat(bText);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return isAscending ? bNum - aNum : aNum - bNum;
    }
    
    // String comparison
    return isAscending ? bText.localeCompare(aText) : aText.localeCompare(bText);
  });
  
  // Update DOM
  const tbody = table.querySelector('tbody');
  rows.forEach(row => tbody.appendChild(row));
  
  // Update sort indicators
  headerCells.forEach(h => h.classList.remove('asc', 'desc'));
  headerCells[columnIndex].classList.add(isAscending ? 'desc' : 'asc');
}
    `
  }
};

// Export all concepts
export default {
  config: selectorConfig,
  concepts: {
    basicSelectors,
    modernSelectors,
    advancedSelectors,
    selectorUtilities,
    practicalExamples
  }
};