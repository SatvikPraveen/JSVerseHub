// src/utils/domUtils.js - DOM Manipulation Utilities

/**
 * DOMUtils - Collection of utility functions for DOM manipulation
 * Provides common DOM operations with cross-browser compatibility
 */

const DOMUtils = {
  /**
   * Create element with attributes and content
   */
  createElement(tag, attributes = {}, content = "") {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else if (key === "textContent") {
        element.textContent = value;
      } else if (key.startsWith("data-")) {
        element.setAttribute(key, value);
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });

    // Set content
    if (content) {
      if (typeof content === "string") {
        element.innerHTML = content;
      } else if (content instanceof Node) {
        element.appendChild(content);
      }
    }

    return element;
  },

  /**
   * Find element by selector with optional parent scope
   */
  find(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Find all elements by selector with optional parent scope
   */
  findAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Check if element exists
   */
  exists(selector, parent = document) {
    return parent.querySelector(selector) !== null;
  },

  /**
   * Add class(es) to element
   */
  addClass(element, ...classes) {
    if (!element) return false;
    element.classList.add(...classes);
    return true;
  },

  /**
   * Remove class(es) from element
   */
  removeClass(element, ...classes) {
    if (!element) return false;
    element.classList.remove(...classes);
    return true;
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className, force) {
    if (!element) return false;
    return element.classList.toggle(className, force);
  },

  /**
   * Check if element has class
   */
  hasClass(element, className) {
    if (!element) return false;
    return element.classList.contains(className);
  },

  /**
   * Set element attributes
   */
  setAttributes(element, attributes) {
    if (!element) return false;

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    });

    return true;
  },

  /**
   * Get element attribute with optional default
   */
  getAttribute(element, attribute, defaultValue = null) {
    if (!element) return defaultValue;
    return element.getAttribute(attribute) || defaultValue;
  },

  /**
   * Set element data attribute
   */
  setData(element, key, value) {
    if (!element) return false;
    element.dataset[key] = value;
    return true;
  },

  /**
   * Get element data attribute
   */
  getData(element, key, defaultValue = null) {
    if (!element) return defaultValue;
    return element.dataset[key] || defaultValue;
  },

  /**
   * Show element (remove hidden class or set display)
   */
  show(element, display = "") {
    if (!element) return false;

    if (this.hasClass(element, "hidden")) {
      this.removeClass(element, "hidden");
    } else {
      element.style.display = display;
    }

    return true;
  },

  /**
   * Hide element (add hidden class or set display none)
   */
  hide(element) {
    if (!element) return false;

    if (element.classList.contains("hidden")) {
      return true; // Already hidden
    }

    this.addClass(element, "hidden");
    return true;
  },

  /**
   * Toggle element visibility
   */
  toggle(element, display = "") {
    if (!element) return false;

    if (this.isVisible(element)) {
      this.hide(element);
      return false;
    } else {
      this.show(element, display);
      return true;
    }
  },

  /**
   * Check if element is visible
   */
  isVisible(element) {
    if (!element) return false;

    if (this.hasClass(element, "hidden")) {
      return false;
    }

    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  },

  /**
   * Get element dimensions and position
   */
  getBounds(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      marginTop: parseFloat(style.marginTop),
      marginRight: parseFloat(style.marginRight),
      marginBottom: parseFloat(style.marginBottom),
      marginLeft: parseFloat(style.marginLeft),
      paddingTop: parseFloat(style.paddingTop),
      paddingRight: parseFloat(style.paddingRight),
      paddingBottom: parseFloat(style.paddingBottom),
      paddingLeft: parseFloat(style.paddingLeft),
    };
  },

  /**
   * Set element position
   */
  setPosition(element, x, y) {
    if (!element) return false;

    element.style.position = "absolute";
    element.style.left = typeof x === "number" ? `${x}px` : x;
    element.style.top = typeof y === "number" ? `${y}px` : y;

    return true;
  },

  /**
   * Animate element using CSS transitions
   */
  animate(element, properties, duration = 300, easing = "ease") {
    if (!element) return Promise.reject(new Error("Element not found"));

    return new Promise((resolve) => {
      const originalTransition = element.style.transition;

      // Set transition
      element.style.transition = `all ${duration}ms ${easing}`;

      // Apply properties
      Object.entries(properties).forEach(([property, value]) => {
        element.style[property] = value;
      });

      // Wait for transition to complete
      const handleTransitionEnd = () => {
        element.style.transition = originalTransition;
        element.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      };

      element.addEventListener("transitionend", handleTransitionEnd);

      // Fallback timeout
      setTimeout(() => {
        element.style.transition = originalTransition;
        element.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      }, duration + 50);
    });
  },

  /**
   * Fade in element
   */
  fadeIn(element, duration = 300) {
    if (!element) return Promise.reject(new Error("Element not found"));

    element.style.opacity = "0";
    this.show(element);

    return this.animate(element, { opacity: "1" }, duration);
  },

  /**
   * Fade out element
   */
  fadeOut(element, duration = 300) {
    if (!element) return Promise.reject(new Error("Element not found"));

    return this.animate(element, { opacity: "0" }, duration).then(() =>
      this.hide(element)
    );
  },

  /**
   * Slide down element
   */
  slideDown(element, duration = 300) {
    if (!element) return Promise.reject(new Error("Element not found"));

    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;

    element.style.height = "0";
    element.style.overflow = "hidden";
    this.show(element);

    const targetHeight = element.scrollHeight + "px";

    return this.animate(element, { height: targetHeight }, duration).then(
      () => {
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;
      }
    );
  },

  /**
   * Slide up element
   */
  slideUp(element, duration = 300) {
    if (!element) return Promise.reject(new Error("Element not found"));

    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;

    element.style.overflow = "hidden";

    return this.animate(element, { height: "0" }, duration).then(() => {
      this.hide(element);
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
    });
  },

  /**
   * Add event listener with optional delegation
   */
  on(element, event, handler, selector = null) {
    if (!element) return false;

    if (selector) {
      // Event delegation
      const delegatedHandler = (e) => {
        const target = e.target.closest(selector);
        if (target && element.contains(target)) {
          handler.call(target, e);
        }
      };
      element.addEventListener(event, delegatedHandler);
      return delegatedHandler;
    } else {
      element.addEventListener(event, handler);
      return handler;
    }
  },

  /**
   * Remove event listener
   */
  off(element, event, handler) {
    if (!element) return false;
    element.removeEventListener(event, handler);
    return true;
  },

  /**
   * Trigger custom event
   */
  trigger(element, eventName, detail = {}) {
    if (!element) return false;

    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail,
    });

    return element.dispatchEvent(event);
  },

  /**
   * Wait for element to appear in DOM
   */
  waitForElement(selector, timeout = 5000, parent = document) {
    return new Promise((resolve, reject) => {
      const element = this.find(selector, parent);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = this.find(selector, parent);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(parent, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  /**
   * Scroll element into view smoothly
   */
  scrollIntoView(element, options = {}) {
    if (!element) return false;

    const defaultOptions = {
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
    return true;
  },

  /**
   * Get element's text content without HTML
   */
  getText(element) {
    if (!element) return "";
    return element.textContent || element.innerText || "";
  },

  /**
   * Set element's text content
   */
  setText(element, text) {
    if (!element) return false;
    element.textContent = text;
    return true;
  },

  /**
   * Get element's HTML content
   */
  getHTML(element) {
    if (!element) return "";
    return element.innerHTML;
  },

  /**
   * Set element's HTML content
   */
  setHTML(element, html) {
    if (!element) return false;
    element.innerHTML = html;
    return true;
  },

  /**
   * Empty element (remove all children)
   */
  empty(element) {
    if (!element) return false;
    element.innerHTML = "";
    return true;
  },

  /**
   * Remove element from DOM
   */
  remove(element) {
    if (!element) return false;
    if (element.parentNode) {
      element.parentNode.removeChild(element);
      return true;
    }
    return false;
  },

  /**
   * Clone element
   */
  clone(element, deep = true) {
    if (!element) return null;
    return element.cloneNode(deep);
  },

  /**
   * Insert element after another element
   */
  insertAfter(newElement, referenceElement) {
    if (!newElement || !referenceElement || !referenceElement.parentNode) {
      return false;
    }

    referenceElement.parentNode.insertBefore(
      newElement,
      referenceElement.nextSibling
    );
    return true;
  },

  /**
   * Wrap element with another element
   */
  wrap(element, wrapper) {
    if (!element || !wrapper) return false;

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    return true;
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element, threshold = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  },

  /**
   * Debounce function for event handlers
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  /**
   * Throttle function for event handlers
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Get all form data as object
   */
  getFormData(form) {
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes, etc.)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  },

  /**
   * Set form data from object
   */
  setFormData(form, data) {
    if (!form || !data) return false;

    Object.entries(data).forEach(([key, value]) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === "checkbox") {
          field.checked = Boolean(value);
        } else if (field.type === "radio") {
          const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;
        } else {
          field.value = value;
        }
      }
    });

    return true;
  },
};

// Export for use in other modules
if (typeof window !== "undefined") {
  window.DOMUtils = DOMUtils;
}
