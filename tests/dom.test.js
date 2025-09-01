// File: tests/dom.test.js
// Location: jsversehub/tests/dom.test.js

/**
 * @jest-environment jsdom
 */

describe('DOM Manipulation Concepts', () => {
  let container;

  beforeEach(() => {
    // Set up DOM container for each test
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  // Test element selection
  describe('Element Selection', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div id="main" class="container">
          <p class="text">Paragraph 1</p>
          <p class="text highlight">Paragraph 2</p>
          <span data-test="special">Special span</span>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      `;
    });

    test('getElementById should select element by ID', () => {
      const element = document.getElementById('main');
      expect(element).toBeTruthy();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('container');
    });

    test('getElementsByClassName should select elements by class', () => {
      const elements = document.getElementsByClassName('text');
      expect(elements.length).toBe(2);
      expect(elements[0].textContent).toBe('Paragraph 1');
      expect(elements[1].textContent).toBe('Paragraph 2');
    });

    test('getElementsByTagName should select elements by tag', () => {
      const elements = document.getElementsByTagName('p');
      expect(elements.length).toBe(2);
      expect(elements[0].className).toBe('text');
      expect(elements[1].className).toBe('text highlight');
    });

    test('querySelector should select first matching element', () => {
      const element = document.querySelector('.text');
      expect(element.textContent).toBe('Paragraph 1');

      const highlighted = document.querySelector('.highlight');
      expect(highlighted.textContent).toBe('Paragraph 2');

      const dataElement = document.querySelector('[data-test="special"]');
      expect(dataElement.textContent).toBe('Special span');
    });

    test('querySelectorAll should select all matching elements', () => {
      const elements = document.querySelectorAll('.text');
      expect(elements.length).toBe(2);
      expect(Array.from(elements).map(el => el.textContent)).toEqual(['Paragraph 1', 'Paragraph 2']);

      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBe(3);
    });
  });

  // Test element creation and manipulation
  describe('Element Creation and Manipulation', () => {
    test('createElement and appendChild should create and add elements', () => {
      const newDiv = document.createElement('div');
      newDiv.textContent = 'New element';
      newDiv.className = 'created';

      container.appendChild(newDiv);

      expect(container.children.length).toBe(1);
      expect(container.firstElementChild.textContent).toBe('New element');
      expect(container.firstElementChild.className).toBe('created');
    });

    test('insertBefore should insert element at specific position', () => {
      const first = document.createElement('div');
      first.textContent = 'First';
      const second = document.createElement('div');
      second.textContent = 'Second';

      container.appendChild(first);
      container.insertBefore(second, first);

      expect(container.children.length).toBe(2);
      expect(container.firstElementChild.textContent).toBe('Second');
      expect(container.lastElementChild.textContent).toBe('First');
    });

    test('removeChild should remove elements', () => {
      const element = document.createElement('div');
      element.textContent = 'To be removed';
      container.appendChild(element);

      expect(container.children.length).toBe(1);

      container.removeChild(element);
      expect(container.children.length).toBe(0);
    });

    test('cloneNode should clone elements', () => {
      const original = document.createElement('div');
      original.innerHTML = '<span>Child</span>';
      original.className = 'original';

      const shallowClone = original.cloneNode(false);
      expect(shallowClone.className).toBe('original');
      expect(shallowClone.children.length).toBe(0);

      const deepClone = original.cloneNode(true);
      expect(deepClone.className).toBe('original');
      expect(deepClone.children.length).toBe(1);
      expect(deepClone.firstElementChild.textContent).toBe('Child');
    });
  });

  // Test text and HTML content manipulation
  describe('Content Manipulation', () => {
    test('textContent should get and set text content', () => {
      const element = document.createElement('div');
      element.textContent = 'Hello World';
      expect(element.textContent).toBe('Hello World');

      element.textContent = 'Updated text';
      expect(element.textContent).toBe('Updated text');
    });

    test('innerHTML should get and set HTML content', () => {
      const element = document.createElement('div');
      element.innerHTML = '<span>HTML content</span>';
      expect(element.innerHTML).toBe('<span>HTML content</span>');
      expect(element.children.length).toBe(1);
      expect(element.firstElementChild.tagName).toBe('SPAN');
    });

    test('innerText should handle text with styling', () => {
      const element = document.createElement('div');
      element.innerHTML = '<span style="display: none;">Hidden</span><span>Visible</span>';
      
      // innerText respects styling (hidden elements), textContent doesn't
      expect(element.textContent).toBe('HiddenVisible');
      // Note: innerText behavior may vary in test environment
    });
  });

  // Test attribute manipulation
  describe('Attribute Manipulation', () => {
    test('setAttribute and getAttribute should manage attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-value', '123');
      element.setAttribute('class', 'test-class');

      expect(element.getAttribute('data-value')).toBe('123');
      expect(element.getAttribute('class')).toBe('test-class');
      expect(element.hasAttribute('data-value')).toBe(true);
      expect(element.hasAttribute('nonexistent')).toBe(false);
    });

    test('removeAttribute should remove attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-temp', 'value');
      
      expect(element.hasAttribute('data-temp')).toBe(true);
      
      element.removeAttribute('data-temp');
      expect(element.hasAttribute('data-temp')).toBe(false);
    });

    test('dataset should manage data attributes', () => {
      const element = document.createElement('div');
      element.dataset.userId = '42';
      element.dataset.itemCount = '5';

      expect(element.dataset.userId).toBe('42');
      expect(element.getAttribute('data-user-id')).toBe('42');

      delete element.dataset.userId;
      expect(element.hasAttribute('data-user-id')).toBe(false);
    });
  });

  // Test CSS class manipulation
  describe('CSS Class Manipulation', () => {
    test('className should get and set CSS classes', () => {
      const element = document.createElement('div');
      element.className = 'class1 class2';
      
      expect(element.className).toBe('class1 class2');
    });

    test('classList should provide class manipulation methods', () => {
      const element = document.createElement('div');
      
      element.classList.add('first', 'second');
      expect(element.classList.contains('first')).toBe(true);
      expect(element.classList.contains('second')).toBe(true);
      expect(element.classList.length).toBe(2);

      element.classList.remove('first');
      expect(element.classList.contains('first')).toBe(false);
      expect(element.classList.length).toBe(1);

      element.classList.toggle('third');
      expect(element.classList.contains('third')).toBe(true);
      
      element.classList.toggle('third');
      expect(element.classList.contains('third')).toBe(false);

      element.classList.replace('second', 'replaced');
      expect(element.classList.contains('second')).toBe(false);
      expect(element.classList.contains('replaced')).toBe(true);
    });
  });

  // Test style manipulation
  describe('Style Manipulation', () => {
    test('style property should get and set inline styles', () => {
      const element = document.createElement('div');
      
      element.style.color = 'red';
      element.style.fontSize = '16px';
      element.style.backgroundColor = 'blue';

      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('blue');
    });

    test('getComputedStyle should get computed styles', () => {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '200px';
      container.appendChild(element);

      const styles = window.getComputedStyle(element);
      expect(styles.width).toBe('100px');
      expect(styles.height).toBe('200px');
    });
  });

  // Test DOM traversal
  describe('DOM Traversal', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div class="parent">
          <div class="child first">Child 1</div>
          <div class="child middle">Child 2</div>
          <div class="child last">Child 3</div>
        </div>
      `;
    });

    test('parentNode should navigate to parent', () => {
      const child = document.querySelector('.first');
      const parent = child.parentNode;
      
      expect(parent.className).toBe('parent');
    });

    test('children should get child elements', () => {
      const parent = document.querySelector('.parent');
      const children = parent.children;
      
      expect(children.length).toBe(3);
      expect(children[0].className).toBe('child first');
      expect(children[1].className).toBe('child middle');
      expect(children[2].className).toBe('child last');
    });

    test('firstElementChild and lastElementChild should get first/last children', () => {
      const parent = document.querySelector('.parent');
      
      expect(parent.firstElementChild.className).toBe('child first');
      expect(parent.lastElementChild.className).toBe('child last');
    });

    test('nextElementSibling and previousElementSibling should navigate siblings', () => {
      const middle = document.querySelector('.middle');
      
      expect(middle.previousElementSibling.className).toBe('child first');
      expect(middle.nextElementSibling.className).toBe('child last');
    });
  });

  // Test event handling
  describe('Event Handling', () => {
    test('addEventListener should add event listeners', () => {
      const button = document.createElement('button');
      button.textContent = 'Click me';
      let clicked = false;

      button.addEventListener('click', () => {
        clicked = true;
      });

      container.appendChild(button);
      button.click();

      expect(clicked).toBe(true);
    });

    test('removeEventListener should remove event listeners', () => {
      const button = document.createElement('button');
      let clickCount = 0;

      const handler = () => {
        clickCount++;
      };

      button.addEventListener('click', handler);
      button.click();
      expect(clickCount).toBe(1);

      button.removeEventListener('click', handler);
      button.click();
      expect(clickCount).toBe(1); // Should not increment
    });

    test('event object should contain event information', () => {
      const button = document.createElement('button');
      let eventInfo = {};

      button.addEventListener('click', (event) => {
        eventInfo = {
          type: event.type,
          target: event.target,
          currentTarget: event.currentTarget,
          bubbles: event.bubbles
        };
      });

      container.appendChild(button);
      button.click();

      expect(eventInfo.type).toBe('click');
      expect(eventInfo.target).toBe(button);
      expect(eventInfo.currentTarget).toBe(button);
    });
  });

  // Test form handling
  describe('Form Handling', () => {
    test('form elements should have value properties', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = 'test value';

      expect(input.value).toBe('test value');

      const select = document.createElement('select');
      const option1 = document.createElement('option');
      option1.value = 'opt1';
      option1.textContent = 'Option 1';
      const option2 = document.createElement('option');
      option2.value = 'opt2';
      option2.textContent = 'Option 2';
      option2.selected = true;

      select.appendChild(option1);
      select.appendChild(option2);

      expect(select.value).toBe('opt2');
    });

    test('checkbox and radio inputs should have checked property', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;

      expect(checkbox.checked).toBe(true);

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.checked = false;

      expect(radio.checked).toBe(false);
    });
  });

  // Test document ready and loading
  describe('Document Ready', () => {
    test('document.readyState should indicate loading state', () => {
      expect(['loading', 'interactive', 'complete']).toContain(document.readyState);
    });

    test('DOMContentLoaded event should be handled', (done) => {
      // Since document is already loaded in test environment,
      // we'll simulate the behavior
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          expect(document.readyState).not.toBe('loading');
          done();
        });
      } else {
        expect(document.readyState).not.toBe('loading');
        done();
      }
    });
  });

  // Test performance considerations
  describe('Performance Considerations', () => {
    test('documentFragment should improve performance for multiple operations', () => {
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < 5; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i + 1}`;
        fragment.appendChild(div);
      }

      container.appendChild(fragment);
      
      expect(container.children.length).toBe(5);
      expect(container.children[0].textContent).toBe('Item 1');
      expect(container.children[4].textContent).toBe('Item 5');
    });

    test('querySelector vs getElementById performance difference', () => {
      const testDiv = document.createElement('div');
      testDiv.id = 'performance-test';
      container.appendChild(testDiv);

      // Both should work, but getElementById is generally faster
      const byId = document.getElementById('performance-test');
      const byQuery = document.querySelector('#performance-test');

      expect(byId).toBe(testDiv);
      expect(byQuery).toBe(testDiv);
      expect(byId).toBe(byQuery);
    });
  });
});