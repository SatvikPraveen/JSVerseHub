// src/utils/debounce.js - Debounce and Throttle Utilities

/**
 * Debounce and Throttle utilities for performance optimization
 * Prevents excessive function calls during high-frequency events
 */

/**
 * Debounce function - delays execution until after wait time has passed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Advanced debounce with cancellation and immediate execution options
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {Object} options - Configuration options
 * @returns {Function} Advanced debounced function with additional methods
 */
function advancedDebounce(func, wait, options = {}) {
  const {
    immediate = false,
    maxWait = null,
    leading = false,
    trailing = true,
  } = options;

  let timeout;
  let maxTimeout;
  let lastCallTime;
  let lastInvokeTime = 0;
  let lastArgs;
  let lastThis;
  let result;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);

    return result;
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== null
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== null && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timeout = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    if (maxTimeout !== undefined) {
      clearTimeout(maxTimeout);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
    timeout = undefined;
  }

  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timeout !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== null) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === undefined) {
      timeout = setTimeout(timerExpired, wait);
    }
    return result;
  }

  // Add methods to debounced function
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

/**
 * Frame-based throttle using requestAnimationFrame
 * @param {Function} func - Function to throttle
 * @returns {Function} Frame-throttled function
 */
function rafThrottle(func) {
  let ticking = false;

  return function (...args) {
    const context = this;

    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(context, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Idle callback wrapper for non-critical operations
 * @param {Function} func - Function to execute when idle
 * @param {Object} options - Configuration options
 * @returns {Function} Idle-wrapped function
 */
function idleCallback(func, options = {}) {
  const { timeout = 5000 } = options;

  return function (...args) {
    const context = this;

    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        () => {
          func.apply(context, args);
        },
        { timeout }
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        func.apply(context, args);
      }, 0);
    }
  };
}

/**
 * Leading edge throttle - executes immediately and ignores subsequent calls
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Leading edge throttled function
 */
function leadingThrottle(func, wait) {
  let lastExec = 0;

  return function (...args) {
    const context = this;
    const now = Date.now();

    if (now - lastExec > wait) {
      func.apply(context, args);
      lastExec = now;
    }
  };
}

/**
 * Trailing edge throttle - executes after the wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Trailing edge throttled function
 */
function trailingThrottle(func, wait) {
  let timeout;
  let lastArgs;
  let lastThis;

  return function (...args) {
    const context = this;
    lastArgs = args;
    lastThis = context;

    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(lastThis, lastArgs);
        timeout = null;
      }, wait);
    }
  };
}

/**
 * Batch function calls and execute them together
 * @param {Function} func - Function to batch
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Batched function
 */
function batch(func, wait = 0) {
  let calls = [];
  let timeout;

  return function (...args) {
    const context = this;
    calls.push({ context, args });

    if (!timeout) {
      timeout = setTimeout(() => {
        const allCalls = calls;
        calls = [];
        timeout = null;

        // Execute all batched calls
        allCalls.forEach(({ context, args }) => {
          func.apply(context, args);
        });
      }, wait);
    }
  };
}

/**
 * Memoize function results with optional cache size limit
 * @param {Function} func - Function to memoize
 * @param {number} maxSize - Maximum cache size
 * @returns {Function} Memoized function
 */
function memoize(func, maxSize = 100) {
  const cache = new Map();

  function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);

    // Implement LRU cache behavior
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Rate limit function calls
 * @param {Function} func - Function to rate limit
 * @param {number} maxCalls - Maximum calls per period
 * @param {number} period - Time period in milliseconds
 * @returns {Function} Rate limited function
 */
function rateLimit(func, maxCalls, period) {
  const calls = [];

  return function (...args) {
    const context = this;
    const now = Date.now();

    // Remove old calls outside the period
    while (calls.length && now - calls[0] > period) {
      calls.shift();
    }

    // Check if we've exceeded the rate limit
    if (calls.length >= maxCalls) {
      JSVLogger.warn("Rate limit exceeded");
      return;
    }

    calls.push(now);
    return func.apply(context, args);
  };
}

/**
 * Retry function with exponential backoff
 * @param {Function} func - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Function} Function that retries on failure
 */
function retry(func, maxRetries = 3, baseDelay = 1000) {
  return async function (...args) {
    const context = this;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await func.apply(context, args);
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };
}

/**
 * Create a debounced version of multiple functions
 * @param {Object} functions - Object with functions to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Object} Object with debounced functions
 */
function debounceAll(functions, wait) {
  const debounced = {};

  Object.keys(functions).forEach((key) => {
    if (typeof functions[key] === "function") {
      debounced[key] = debounce(functions[key], wait);
    } else {
      debounced[key] = functions[key];
    }
  });

  return debounced;
}

/**
 * Performance monitoring wrapper
 * @param {Function} func - Function to monitor
 * @param {string} label - Label for performance measurement
 * @returns {Function} Performance monitored function
 */
function performanceWrap(func, label) {
  return function (...args) {
    const startTime = performance.now();
    const result = func.apply(this, args);
    const endTime = performance.now();

    JSVLogger.debug(
      `Performance [${label}]: ${(endTime - startTime).toFixed(2)}ms`
    );

    return result;
  };
}

// Export utilities
const PerformanceUtils = {
  debounce,
  throttle,
  advancedDebounce,
  rafThrottle,
  idleCallback,
  leadingThrottle,
  trailingThrottle,
  batch,
  memoize,
  rateLimit,
  retry,
  debounceAll,
  performanceWrap,
};

// Export for use in other modules
if (typeof window !== "undefined") {
  window.debounce = debounce;
  window.throttle = throttle;
  window.PerformanceUtils = PerformanceUtils;
}
