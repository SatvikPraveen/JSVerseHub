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
    `,
    basicListener: `
// addEventListener(type, listener, options)
// - type:     the event name ('click', 'keydown', ...)
// - listener: the function to run when the event fires
// - options:  optional { capture, once, passive, signal }
const button = document.querySelector('#save');

function handleSave(event) {
  console.log('Save requested by', event.target);
}

button.addEventListener('click', handleSave);

// The same listener function can be attached to many elements,
// and one element can have many listeners for the same event.
document.querySelectorAll('.save').forEach(btn => {
  btn.addEventListener('click', handleSave);
});
    `,

    clickExample: `
// Click handling: single click, double click and mouse buttons
const card = document.querySelector('.card');

card.addEventListener('click', (event) => {
  console.log('Clicked at', event.clientX, event.clientY);
  console.log('Modifier keys:', {
    shift: event.shiftKey,
    ctrl: event.ctrlKey,
    meta: event.metaKey
  });
});

card.addEventListener('dblclick', () => {
  card.classList.toggle('expanded');
});

// contextmenu fires on right-click; preventDefault() blocks the browser menu
card.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  showCustomMenu(event.pageX, event.pageY);
});
    `,

    keyboardExample: `
// Keyboard handling: prefer event.key (the character/name)
// over the deprecated event.keyCode
const editor = document.querySelector('#editor');

editor.addEventListener('keydown', (event) => {
  // Ctrl/Cmd + S -> save
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault(); // stop the browser "Save page" dialog
    saveDocument();
    return;
  }

  // Escape closes any open dialog
  if (event.key === 'Escape') {
    closeDialog();
  }
});

// keyup is useful for "typing finished" style detection
editor.addEventListener('keyup', (event) => {
  console.log('Released:', event.key, 'physical key:', event.code);
});

// Arrow-key navigation inside a menu
menu.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') focusNext();
  if (event.key === 'ArrowUp') focusPrevious();
});
    `,

    formExample: `
// Form handling: submit, change and input events
const form = document.querySelector('#signup');
const email = form.querySelector('input[name="email"]');
const plan = form.querySelector('select[name="plan"]');

// submit fires on the <form>, not on the button
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the full-page reload
  const data = new FormData(form);
  sendToServer(Object.fromEntries(data));
});

// input fires on every keystroke
email.addEventListener('input', () => {
  email.setCustomValidity(''); // clear previous error while typing
});

// change fires when the value is committed (blur for text, immediately for select)
plan.addEventListener('change', (event) => {
  console.log('Plan selected:', event.target.value);
});

// focus/blur do not bubble; focusin/focusout do
form.addEventListener('focusin', (event) => {
  event.target.classList.add('active');
});
form.addEventListener('focusout', (event) => {
  event.target.classList.remove('active');
});
    `,

    eventObjectExample: `
// Every listener receives an Event object describing what happened
document.querySelector('.toolbar').addEventListener('click', (event) => {
  event.type;           // 'click'
  event.target;         // the element that was actually clicked (may be a child)
  event.currentTarget;  // the element the listener is attached to (.toolbar)
  event.timeStamp;      // ms since the document was created
  event.bubbles;        // true for click
  event.cancelable;     // true - preventDefault() has an effect
  event.defaultPrevented; // becomes true after preventDefault()
  event.eventPhase;     // 1 capturing, 2 at target, 3 bubbling

  // Because event.target can be a nested <span> inside a <button>,
  // use closest() to normalise it to the element you care about.
  const button = event.target.closest('button');
  if (button) {
    console.log('Toolbar action:', button.dataset.action);
  }
});
    `,

    mouseEvents: [
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'mousemove',
      'mouseenter',
      'mouseleave',
      'mouseover',
      'mouseout',
      'contextmenu',
      'wheel'
    ],

    keyboardEvents: [
      'keydown',
      'keyup',
      'keypress'
    ],

    formEvents: [
      'submit',
      'reset',
      'change',
      'input',
      'focus',
      'blur',
      'focusin',
      'focusout',
      'invalid'
    ],

    touchEvents: [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel'
    ],

    removalExample: `
// removeEventListener needs the SAME function reference that was added.
// Anonymous functions cannot be removed because you have no reference to them.
const button = document.querySelector('#load-more');

function loadMore() {
  fetchNextPage();
}

button.addEventListener('click', loadMore);
// ...later, e.g. when the last page is reached:
button.removeEventListener('click', loadMore);

// The capture flag must match too: a listener added with { capture: true }
// is only removed when removeEventListener is called with { capture: true }.
document.addEventListener('scroll', onScroll, { capture: true });
document.removeEventListener('scroll', onScroll, { capture: true });

// Modern alternative: an AbortController can remove many listeners at once
const controller = new AbortController();
button.addEventListener('click', loadMore, { signal: controller.signal });
window.addEventListener('resize', relayout, { signal: controller.signal });
controller.abort(); // both listeners removed
    `,

    onceExample: `
// { once: true } automatically removes the listener after it runs once.
// Ideal for "first interaction" logic such as starting audio or lazy setup.
const video = document.querySelector('video');

video.addEventListener('play', () => {
  trackAnalytics('first-play');
}, { once: true });

// Other useful options:
// { passive: true } promises you will not call preventDefault(),
// which lets the browser scroll immediately without waiting for JS.
document.addEventListener('touchmove', onTouchMove, { passive: true });

// { capture: true } listens during the capturing phase.
document.addEventListener('focus', onAnyFocus, { capture: true });
    `,

    clickCountingExample: `
// A click counter keeps its state in a closure and updates the DOM
const counterButton = document.querySelector('#counter');
let clicks = 0;

counterButton.addEventListener('click', () => {
  clicks += 1;
  counterButton.textContent = 'Clicked ' + clicks + ' time' + (clicks === 1 ? '' : 's');

  if (clicks === 10) {
    counterButton.disabled = true;
    counterButton.textContent = 'Limit reached';
  }
});

// event.detail on a MouseEvent holds the click count within the
// double-click interval, useful for detecting triple clicks
counterButton.addEventListener('click', (event) => {
  if (event.detail === 3) console.log('Triple click!');
});
    `,

    formValidationExample: `
// Live validation: validate on input, block submission on submit
const form = document.querySelector('#register');
const password = form.querySelector('#password');
const error = form.querySelector('#password-error');

function validatePassword(value) {
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[0-9]/.test(value)) return 'Password must include a number';
  return '';
}

password.addEventListener('input', () => {
  const message = validatePassword(password.value);
  error.textContent = message;
  password.setCustomValidity(message); // integrates with :invalid and form.checkValidity()
});

form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.querySelector(':invalid').focus();
    return;
  }
  // form is valid - allow the default submission or send via fetch
});
    `,

    eventFilteringExample: `
// Filtering: only react to events that meet a condition
const list = document.querySelector('#files');

list.addEventListener('click', (event) => {
  // Ignore clicks that did not land on a file row
  const row = event.target.closest('.file-row');
  if (!row) return;

  // Ignore right/middle button clicks
  if (event.button !== 0) return;

  // Ignore disabled rows
  if (row.classList.contains('disabled')) return;

  openFile(row.dataset.id);
});

// Filter keyboard events to a single key
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  if (event.target.tagName === 'TEXTAREA') return; // allow newlines in textareas
  submitActiveForm();
});
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
    `,
    bubblingExplanation: `
Event bubbling is the third phase of event propagation. After an event reaches
its target element, it "bubbles" upward through every ancestor: target -> parent
-> grandparent -> ... -> document -> window. Each ancestor with a matching
listener (registered without the capture flag) is called in that order.

Bubbling is what makes event delegation possible: a single listener on a parent
receives events from all of its descendants. Most UI events bubble (click, input,
keydown, change), but some do not (focus, blur, load, scroll on elements).
Use event.bubbles to check.
    `,

    bubblingExample: `
// <section id="page">
//   <article id="post">
//     <button id="like">Like</button>
//   </article>
// </section>
const page = document.getElementById('page');
const post = document.getElementById('post');
const like = document.getElementById('like');

like.addEventListener('click', () => console.log('1. button (target)'));
post.addEventListener('click', () => console.log('2. article (bubbles)'));
page.addEventListener('click', () => console.log('3. section (bubbles)'));
document.addEventListener('click', () => console.log('4. document (bubbles)'));

// Clicking the button logs 1, 2, 3, 4 - innermost to outermost
    `,

    stopPropagationExample: `
// stopPropagation(): ancestors will NOT receive this event
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

// Clicking the dark overlay closes the modal...
overlay.addEventListener('click', () => closeModal());

// ...but clicks inside the modal must not bubble up to the overlay
modal.addEventListener('click', (event) => {
  event.stopPropagation();
});

// stopImmediatePropagation(): also skips the remaining listeners
// on the SAME element
const input = document.querySelector('#search');
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.stopImmediatePropagation(); // the second listener below never runs
    runSearch(input.value);
  }
});
input.addEventListener('keydown', () => console.log('typing...'));
    `,

    capturingExplanation: `
Event capturing is the first phase of propagation. Before the event reaches its
target, it travels DOWN the tree from window -> document -> html -> body -> ...
-> the target's parent. Listeners registered with capture: true run during this
descent, outermost first.

Capturing lets an ancestor see (and optionally stop) an event before the target
or any bubbling listener runs. It is also the only way to observe non-bubbling
events such as focus, blur, load or error from an ancestor element.
    `,

    capturingExample: `
// The third argument (true) or { capture: true } registers a capturing listener
const app = document.getElementById('app');
const button = document.getElementById('submit');

app.addEventListener('click', () => console.log('app - capturing'), true);
app.addEventListener('click', () => console.log('app - bubbling'));
button.addEventListener('click', () => console.log('button - target'));

// Clicking the button logs:
// app - capturing
// button - target
// app - bubbling

// Practical use: observe every focus change in the app, even though
// 'focus' itself does not bubble
app.addEventListener('focus', (event) => {
  console.log('Focused:', event.target);
}, { capture: true });
    `,

    phases: {
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    },

    targetExplanation: `
event.target is the element on which the event originally occurred - the deepest
element under the pointer for a click, or the input that received a keystroke.
It never changes as the event propagates. Because target can be a nested child
(for example a <span> inside a <button>), delegated handlers usually normalise
it with event.target.closest(selector).
    `,

    currentTargetExplanation: `
event.currentTarget is the element whose listener is currently running. It
changes at every step of propagation and is always the element you called
addEventListener on. Inside a non-arrow listener function, "this" is the same
as event.currentTarget. Use currentTarget when you want the element you
attached to, and target when you want the element that was actually clicked.
    `,

    comparisonExample: `
// <ul id="menu">
//   <li>Home</li>
//   <li>About <span class="badge">new</span></li>
// </ul>
const menu = document.getElementById('menu');

menu.addEventListener('click', (event) => {
  console.log(event.currentTarget); // always <ul id="menu">
  console.log(event.target);        // <li>, or the <span> if the badge was clicked

  // Normalise the target to the <li> the user meant
  const item = event.target.closest('li');
  if (item && menu.contains(item)) {
    console.log('Selected:', item.textContent.trim());
  }
});

// eventPhase tells you which phase the listener is running in
document.addEventListener('click', (event) => {
  // 1 = CAPTURING_PHASE, 2 = AT_TARGET, 3 = BUBBLING_PHASE
  console.log('phase:', event.eventPhase);
});
    `,

    preventDefaultExample: `
// preventDefault() cancels the browser's built-in action for the event,
// without affecting propagation.
const link = document.querySelector('a.ajax');
link.addEventListener('click', (event) => {
  event.preventDefault();       // do not navigate
  loadPage(link.href);          // load the content with fetch instead
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();       // do not reload the page
  submitWithFetch(form);
});

const numberInput = document.querySelector('#quantity');
numberInput.addEventListener('keydown', (event) => {
  // Block letters so only digits are typed
  if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
});

// After calling it, defaultPrevented is true for later listeners
document.addEventListener('submit', (event) => {
  if (event.defaultPrevented) console.log('Handled by page script');
});
    `,

    cancelableExample: `
// Not every event can be cancelled. Check event.cancelable before relying
// on preventDefault(); calling it on a non-cancelable event does nothing.
element.addEventListener('touchmove', (event) => {
  if (event.cancelable) {
    event.preventDefault(); // stop scrolling while dragging
  }
});

// Listeners registered with { passive: true } are never allowed to cancel,
// so preventDefault() is ignored and the browser logs a warning.
document.addEventListener('wheel', (event) => {
  event.preventDefault(); // no effect - passive listener
}, { passive: true });

// Custom events are non-cancelable unless you say otherwise
const cancelable = new CustomEvent('before-save', { cancelable: true });
const proceed = element.dispatchEvent(cancelable);
// dispatchEvent returns false if a listener called preventDefault()
if (!proceed) console.log('Save was vetoed by a listener');
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
    `,
    delegationConcept: `
Event delegation attaches ONE listener to a common ancestor instead of a
listener on every child. When a child is clicked, the event bubbles up to the
ancestor, and the handler inspects event.target to decide what to do.

Why it matters:
- Scales to thousands of rows with a single listener
- Elements added later are handled automatically - no re-binding
- Removing elements does not leak listeners
- Behaviour lives in one place, close to the data it acts on

The trade-off: the handler must filter events (matches/closest) and it only
works for events that bubble (or with capture: true for those that do not).
    `,

    matchesExample: `
// element.matches(selector) returns true if the element itself matches
const table = document.querySelector('#users');

table.addEventListener('click', (event) => {
  const target = event.target;

  if (target.matches('button.edit')) {
    editUser(target.closest('tr').dataset.id);
  } else if (target.matches('button.delete')) {
    deleteUser(target.closest('tr').dataset.id);
  } else if (target.matches('input[type="checkbox"]')) {
    toggleSelection(target.value, target.checked);
  }
});

// matches() only checks the exact element. If the button contains an icon
// (<button><svg/></button>) and the icon is clicked, matches('button') is false.
// Use closest() when the event may originate from a descendant.
    `,

    closestExample: `
// element.closest(selector) walks up from the element (inclusive) and returns
// the first ancestor that matches - or null.
const gallery = document.querySelector('.gallery');

gallery.addEventListener('click', (event) => {
  // Works whether the user clicked the <img>, the caption, or the card itself
  const card = event.target.closest('.photo-card');
  if (!card) return;                       // click was outside any card
  if (!gallery.contains(card)) return;     // safety: card must be inside gallery

  openLightbox(card.dataset.src);
});

// Combine with a guard so clicks on nested interactive controls are ignored
gallery.addEventListener('click', (event) => {
  if (event.target.closest('button, a')) return; // let controls handle themselves
  const card = event.target.closest('.photo-card');
  if (card) selectCard(card);
});
    `,

    memoryExample: `
// Per-element listeners: each closure holds a reference and must be removed
// when the element is discarded, or the listener keeps the element alive.
function renderRowsWithoutDelegation(rows) {
  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.addEventListener('click', () => select(row.id)); // 1 closure per row
    table.appendChild(tr);
  });
}
// Re-rendering 5,000 rows creates 5,000 closures every time.

// With delegation: zero per-row listeners, nothing to clean up
table.addEventListener('click', (event) => {
  const tr = event.target.closest('tr');
  if (tr) select(tr.dataset.id);
});

function renderRowsWithDelegation(rows) {
  table.innerHTML = rows.map(row =>
    '<tr data-id="' + row.id + '"><td>' + row.name + '</td></tr>'
  ).join('');
}
// Rows can be replaced freely; the single listener keeps working.
    `,

    dataAttributeExample: `
// Route actions through data-* attributes instead of separate handlers
// <div class="player">
//   <button data-action="play">Play</button>
//   <button data-action="pause">Pause</button>
//   <button data-action="seek" data-seconds="-10">-10s</button>
//   <button data-action="seek" data-seconds="10">+10s</button>
// </div>
const player = document.querySelector('.player');

const actions = {
  play: () => audio.play(),
  pause: () => audio.pause(),
  seek: (button) => { audio.currentTime += Number(button.dataset.seconds); }
};

player.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const handler = actions[button.dataset.action];
  if (handler) handler(button);
});

// Adding a new button is now a markup change only:
// <button data-action="mute">Mute</button>  +  actions.mute = () => ...
    `,

    multipleEventsExample: `
// One delegated handler per event type, sharing the same lookup logic
const board = document.querySelector('.kanban');

function getCard(event) {
  return event.target.closest('.card');
}

board.addEventListener('click', (event) => {
  const card = getCard(event);
  if (card) openCard(card.dataset.id);
});

board.addEventListener('dblclick', (event) => {
  const card = getCard(event);
  if (card) startInlineEdit(card);
});

board.addEventListener('keydown', (event) => {
  const card = getCard(event);
  if (card && event.key === 'Delete') removeCard(card.dataset.id);
});

// Or register several types in a loop with a shared dispatcher
['dragstart', 'dragover', 'drop'].forEach(type => {
  board.addEventListener(type, (event) => {
    const card = getCard(event);
    if (card) dragHandlers[type](event, card);
  });
});
    `,

    dynamicExample: `
// Delegation handles elements that do not exist yet
const feed = document.querySelector('#feed');

// Registered once, before any posts are loaded
feed.addEventListener('click', (event) => {
  const likeButton = event.target.closest('.like');
  if (likeButton) {
    likeButton.classList.toggle('liked');
  }
});

// Posts loaded later still work - no need to attach listeners to them
async function loadMorePosts() {
  const posts = await fetch('/api/posts?page=2').then(r => r.json());
  posts.forEach(post => {
    const article = document.createElement('article');
    article.innerHTML = '<p>' + post.text + '</p><button class="like">Like</button>';
    feed.appendChild(article);
  });
}

// Compare: with per-element listeners you would have to call
// article.querySelector('.like').addEventListener(...) inside the loop above.
    `,

    selectorExample: `
// Be precise about what you match to avoid handling the wrong element
const nav = document.querySelector('nav');

nav.addEventListener('click', (event) => {
  // Too broad: matches any <a>, including external links
  // const link = event.target.closest('a');

  // Precise: only internal navigation links inside this nav
  const link = event.target.closest('a[href^="/"]:not([target="_blank"])');
  if (!link || !nav.contains(link)) return;

  event.preventDefault();
  router.navigate(link.getAttribute('href'));
});

// Nested delegated regions: stop at the nearest container so an inner
// widget's clicks are not also handled by the outer one
document.addEventListener('click', (event) => {
  const dropdownItem = event.target.closest('.dropdown-item');
  if (dropdownItem) {
    selectOption(dropdownItem);
    return; // handled - do not fall through to the generic handler below
  }
  const cardAction = event.target.closest('.card [data-action]');
  if (cardAction) runCardAction(cardAction);
});
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
    `,
    customEventCreation: `
// CustomEvent extends Event and adds a "detail" payload.
// Options: bubbles (default false), cancelable (default false), composed
const event = new CustomEvent('user:login', {
  detail: { userId: 42, name: 'Ada' },
  bubbles: true,      // let ancestors (and document) hear it
  cancelable: false
});

console.log(event.type);    // 'user:login'
console.log(event.detail);  // { userId: 42, name: 'Ada' }

// A plain Event works when there is no data to carry
const ready = new Event('app:ready', { bubbles: true });
    `,

    detailExample: `
// detail carries any value: object, array, string, number...
const cart = document.querySelector('#cart');

function addToCart(product) {
  cart.dispatchEvent(new CustomEvent('cart:add', {
    bubbles: true,
    detail: {
      product,
      quantity: 1,
      addedAt: Date.now()
    }
  }));
}

cart.addEventListener('cart:add', (event) => {
  const { product, quantity } = event.detail;
  console.log('Added', quantity, 'x', product.name);
});

// detail is read-only on the event; treat it as an immutable message.
// Pass a fresh object each time rather than mutating a shared one.
    `,

    dispatchExample: `
// dispatchEvent(event) runs listeners synchronously and returns false
// if a cancelable event was preventDefault()-ed.
const editor = document.querySelector('#editor');

editor.addEventListener('doc:before-save', (event) => {
  if (hasUnresolvedComments()) {
    event.preventDefault(); // veto the save
  }
});

function save() {
  const allowed = editor.dispatchEvent(
    new CustomEvent('doc:before-save', { cancelable: true })
  );
  if (!allowed) {
    alert('Resolve comments before saving');
    return;
  }
  persist();
  editor.dispatchEvent(new CustomEvent('doc:saved', { bubbles: true }));
}

// Because dispatch is synchronous, code after dispatchEvent runs
// only after every listener has finished.
    `,

    listeningExample: `
// Custom events are listened for exactly like built-in ones
const app = document.querySelector('#app');

// Listen on the element that dispatches
app.addEventListener('theme:change', (event) => {
  document.body.dataset.theme = event.detail.theme;
});

// Or on an ancestor, if the event was created with bubbles: true
document.addEventListener('theme:change', (event) => {
  localStorage.setItem('theme', event.detail.theme);
});

// once and signal work too
const controller = new AbortController();
app.addEventListener('theme:change', logChange, { signal: controller.signal });
controller.abort(); // stop listening

// Trigger
app.dispatchEvent(new CustomEvent('theme:change', {
  bubbles: true,
  detail: { theme: 'dark' }
}));
    `,

    parameterExample: `
// The listener parameter is the CustomEvent instance itself
element.addEventListener('order:placed', (event) => {
  event instanceof CustomEvent; // true
  event.type;                   // 'order:placed'
  event.detail;                 // your payload
  event.target;                 // element that dispatched
  event.currentTarget;          // element this listener is attached to
  event.timeStamp;              // when it was dispatched
});

// Destructure detail for readable handlers
element.addEventListener('order:placed', ({ detail: { orderId, total } }) => {
  showToast('Order ' + orderId + ' placed: $' + total.toFixed(2));
});

// handleEvent objects: any object with a handleEvent method is a valid listener
const logger = {
  handleEvent(event) {
    console.log('[' + event.type + ']', event.detail);
  }
};
element.addEventListener('order:placed', logger);
    `,

    eventTargetPattern: `
// Any class can extend EventTarget to get addEventListener / dispatchEvent
// without being a DOM element. This is the modern "polyfill" for the
// classic Node.js-style EventEmitter in the browser.
class Timer extends EventTarget {
  #id = null;

  start(ms) {
    this.#id = setInterval(() => {
      this.dispatchEvent(new CustomEvent('tick', { detail: { at: Date.now() } }));
    }, ms);
  }

  stop() {
    clearInterval(this.#id);
    this.dispatchEvent(new Event('stop'));
  }
}

const timer = new Timer();
timer.addEventListener('tick', (event) => console.log('tick', event.detail.at));
timer.addEventListener('stop', () => console.log('stopped'), { once: true });
timer.start(1000);

// For environments without EventTarget as a constructor, the same shape can
// be built by hand with a Map of type -> Set of listeners (see emitterExample).
    `,

    pubSubExample: `
// Publish/Subscribe decouples publishers from subscribers via topics.
// Subscribers do not know who publishes; publishers do not know who listens.
class PubSub {
  #topics = new Map();

  subscribe(topic, handler) {
    if (!this.#topics.has(topic)) this.#topics.set(topic, new Set());
    this.#topics.get(topic).add(handler);
    return () => this.unsubscribe(topic, handler); // unsubscribe function
  }

  unsubscribe(topic, handler) {
    this.#topics.get(topic)?.delete(handler);
  }

  publish(topic, payload) {
    this.#topics.get(topic)?.forEach(handler => handler(payload));
  }
}

const bus = new PubSub();

const stop = bus.subscribe('notification', (msg) => showToast(msg.text));
bus.subscribe('notification', (msg) => playSound(msg.level));

bus.publish('notification', { text: 'Upload complete', level: 'info' });
stop(); // the toast subscriber no longer receives messages
    `,

    emitterExample: `
// A minimal EventEmitter: on / off / once / emit
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
    return this; // chainable
  }

  off(type, listener) {
    this.listeners.get(type)?.delete(listener);
    return this;
  }

  once(type, listener) {
    const wrapper = (...args) => {
      this.off(type, wrapper);
      listener(...args);
    };
    return this.on(type, wrapper);
  }

  emit(type, ...args) {
    const set = this.listeners.get(type);
    if (!set) return false;
    // Copy so listeners that remove themselves do not break iteration
    [...set].forEach(listener => listener(...args));
    return true;
  }
}

const emitter = new EventEmitter();
emitter.on('data', (chunk) => process(chunk));
emitter.once('end', () => console.log('done'));
emitter.emit('data', 'chunk 1');
emitter.emit('end');
emitter.emit('end'); // nothing - once listener already removed
    `,

    stateChangeExample: `
// Notify the UI when application state changes, without tight coupling
class Store extends EventTarget {
  #state = { user: null, cart: [] };

  get state() { return this.#state; }

  setState(patch) {
    const previous = this.#state;
    this.#state = { ...previous, ...patch };
    this.dispatchEvent(new CustomEvent('change', {
      detail: { previous, current: this.#state, changed: Object.keys(patch) }
    }));
  }
}

const store = new Store();

// Header only re-renders when the user changes
store.addEventListener('change', ({ detail }) => {
  if (detail.changed.includes('user')) renderHeader(detail.current.user);
});

// Cart badge only cares about the cart
store.addEventListener('change', ({ detail }) => {
  if (detail.changed.includes('cart')) renderBadge(detail.current.cart.length);
});

store.setState({ user: { name: 'Ada' } });   // header updates
store.setState({ cart: [{ id: 1 }] });       // badge updates
    `,

    componentCommExample: `
// Sibling components talk through DOM events that bubble to a shared ancestor.
// Neither component holds a reference to the other.

// <div id="app">
//   <search-box></search-box>
//   <results-list></results-list>
// </div>

// Component A: emits an event with its query
class SearchBox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<input placeholder="Search">';
    this.querySelector('input').addEventListener('input', (event) => {
      this.dispatchEvent(new CustomEvent('search', {
        bubbles: true,
        composed: true,            // cross shadow DOM boundaries
        detail: { query: event.target.value }
      }));
    });
  }
}

// Component B: renders whatever it is told to
class ResultsList extends HTMLElement {
  show(items) {
    this.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
  }
}

customElements.define('search-box', SearchBox);
customElements.define('results-list', ResultsList);

// The parent wires them together
const app = document.querySelector('#app');
app.addEventListener('search', async (event) => {
  const items = await searchApi(event.detail.query);
  app.querySelector('results-list').show(items);
});
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
        assertion: "Solution calls addEventListener on the button",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should increment click count",
        assertion: "The click handler increases clickCount by one on every click",
        check: (code) => code.includes('clickCount++') || code.includes('clickCount +=') || code.includes('clickCount = clickCount + 1')
      },
      {
        description: "Should listen for 'click' event",
        assertion: "The listener is registered for the 'click' event type",
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
        assertion: "Solution registers at least one listener with addEventListener",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should validate email format",
        assertion: "The handler checks that the value contains an '@' before accepting it",
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
        assertion: "A single listener on the list element handles clicks for all items",
        check: (code) => code.includes('addEventListener') && code.includes('list')
      },
      {
        description: "Should handle delete button clicks",
        assertion: "Clicking a delete button removes its parent list item",
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
        assertion: "Publisher creates events with the CustomEvent constructor",
        check: (code) => code.includes('CustomEvent')
      },
      {
        description: "Should dispatch events",
        assertion: "Publisher notifies subscribers with dispatchEvent",
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
        assertion: "Solution registers at least one listener with addEventListener",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should use stopPropagation",
        assertion: "The middle handler calls event.stopPropagation() so outer never fires",
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
        assertion: "A keydown, keyup or keypress listener is registered",
        check: (code) => code.includes('keydown') || code.includes('keyup') || code.includes('keypress')
      },
      {
        description: "Should check event.key",
        assertion: "The handler reads event.key to identify the pressed key",
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
        assertion: "A debounce(func, wait) function is defined and used",
        check: (code) => code.includes('debounce')
      },
      {
        description: "Should use setTimeout",
        assertion: "The debounced function schedules the call with setTimeout",
        check: (code) => code.includes('setTimeout')
      },
      {
        description: "Should clear the pending timeout on each call",
        assertion: "Each new call cancels the previous timer with clearTimeout",
        check: (code) => code.includes('clearTimeout')
      },
      {
        description: "Should attach the debounced handler to the scroll event",
        assertion: "The debounced function is registered as a 'scroll' listener",
        check: (code) => code.includes("'scroll'") || code.includes('"scroll"')
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
        assertion: "A mousemove listener is attached to the tracker element",
        check: (code) => code.includes('mousemove')
      },
      {
        description: "Should use event.clientX and event.clientY",
        assertion: "The handler reads the pointer coordinates from the event object",
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
        assertion: "The app attaches its listeners with addEventListener",
        check: (code) => code.includes('addEventListener')
      },
      {
        description: "Should handle add and remove",
        assertion: "TodoApp implements both addTodo and removeTodo",
        check: (code) => code.includes('addTodo') && code.includes('removeTodo')
      },
      {
        description: "Should use event delegation for list items",
        assertion: "One listener on the list identifies items with matches() or closest()",
        check: (code) => code.includes('closest') || code.includes('matches')
      },
      {
        description: "Should dispatch custom events on add and remove",
        assertion: "addTodo and removeTodo dispatch a CustomEvent describing the change",
        check: (code) => code.includes('CustomEvent') && code.includes('dispatchEvent')
      },
      {
        description: "Should clean up listeners",
        assertion: "A destroy/cleanup step removes listeners with removeEventListener or an AbortController",
        check: (code) => code.includes('removeEventListener') || code.includes('AbortController')
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
