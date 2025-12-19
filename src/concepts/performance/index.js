/**
 * Performance Optimization Concept
 * Learn web performance optimization, measurement, and best practices
 * 
 * Topics Covered:
 * 1. Performance Measurement - Metrics, APIs, tools
 * 2. Code Optimization - Efficient algorithms, caching, memoization
 * 3. Memory Management - Garbage collection, memory leaks, profiling
 * 4. DOM Optimization - Reflows, repaints, batch updates
 * 5. Resource Optimization - Images, CSS, JavaScript, lazy loading
 * 6. Networking - HTTP/2, compression, caching strategies
 * 7. Bundling & Splitting - Code splitting, tree shaking, minification
 * 8. Rendering Performance - CSS animations, requestAnimationFrame
 */

// ============================================================================
// 1. PERFORMANCE MEASUREMENT
// ============================================================================

/**
 * Performance metrics and measurement utilities
 */
const performanceMeasurement = {
  /**
   * Measure execution time of a function
   * @param {Function} fn - Function to measure
   * @param {string} label - Label for the measurement
   * @returns {Object} Measurement result {duration, result}
   */
  measureTime(fn, label = 'Operation') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
    
    return {
      label,
      duration,
      result,
      startTime: start,
      endTime: end
    };
  },

  /**
   * Measure memory usage
   * @returns {Object} Memory information (if available)
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        percentUsed: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      };
    }
    return { available: false };
  },

  /**
   * Get navigation timing data
   * @returns {Object} Timing information
   */
  getNavigationTiming() {
    const timing = performance.timing;
    const navigation = performance.navigation;
    
    return {
      redirectTime: timing.redirectEnd - timing.redirectStart,
      domainLookupTime: timing.domainLookupEnd - timing.domainLookupStart,
      connectTime: timing.connectEnd - timing.connectStart,
      requestTime: timing.responseStart - timing.requestStart,
      responseTime: timing.responseEnd - timing.responseStart,
      domInteractiveTime: timing.domInteractive - timing.navigationStart,
      domCompleteTime: timing.domComplete - timing.navigationStart,
      loadEventTime: timing.loadEventEnd - timing.loadEventStart,
      domContentLoadedTime: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      navigationType: navigation.type
    };
  },

  /**
   * Get resource timing for specific resources
   * @param {string} resourceName - Optional resource name filter
   * @returns {Array} Array of resource timings
   */
  getResourceTiming(resourceName = null) {
    const resources = performance.getEntriesByType('resource');
    
    if (resourceName) {
      return resources.filter(r => r.name.includes(resourceName));
    }
    
    return resources.map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize || 0,
      cached: r.transferSize === 0,
      type: r.initiatorType
    }));
  },

  /**
   * Create a performance observer
   * @param {Function} callback - Callback for performance entries
   * @param {string} entryType - Type of entry to observe
   * @returns {PerformanceObserver}
   */
  createObserver(callback, entryType = 'measure') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry);
      }
    });

    try {
      observer.observe({ entryTypes: [entryType] });
    } catch (e) {
      console.warn(`PerformanceObserver not supported for ${entryType}`);
    }

    return observer;
  },

  /**
   * Mark performance point
   * @param {string} name - Mark name
   */
  mark(name) {
    performance.mark(name);
  },

  /**
   * Measure between two marks
   * @param {string} name - Measurement name
   * @param {string} startMark - Start mark name
   * @param {string} endMark - End mark name
   */
  measure(name, startMark, endMark) {
    try {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name);
      if (measures.length > 0) {
        console.log(`📊 ${name}: ${measures[measures.length - 1].duration.toFixed(2)}ms`);
      }
    } catch (e) {
      console.warn(`Could not measure between ${startMark} and ${endMark}`);
    }
  }
};

// ============================================================================
// 2. CODE OPTIMIZATION
// ============================================================================

/**
 * Code optimization techniques
 */
const codeOptimization = {
  /**
   * Memoization - Cache function results
   * @param {Function} fn - Function to memoize
   * @returns {Function} Memoized function
   */
  memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn.apply(this, args);
      cache.set(key, result);
      
      // Limit cache size to prevent memory leaks
      if (cache.size > 1000) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    };
  },

  /**
   * Debounce function - Wait for pause before executing
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Throttle function - Execute at most once per interval
   * @param {Function} fn - Function to throttle
   * @param {number} interval - Interval in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(fn, interval) {
    let lastCall = 0;
    
    return function(...args) {
      const now = Date.now();
      
      if (now - lastCall >= interval) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * Request Animation Frame based throttle (60fps)
   * @param {Function} fn - Function to throttle
   * @returns {Function} RAF-throttled function
   */
  throttleRAF(fn) {
    let rafId = null;
    
    return function(...args) {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          fn.apply(this, args);
          rafId = null;
        });
      }
    };
  },

  /**
   * Batch function calls
   * @param {Function} fn - Function to batch
   * @param {number} batchSize - Size of each batch
   * @returns {Function} Batching function
   */
  batch(fn, batchSize = 100) {
    let items = [];
    let timeoutId;
    
    return function(item) {
      items.push(item);
      
      if (items.length >= batchSize) {
        fn(items);
        items = [];
        clearTimeout(timeoutId);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          if (items.length > 0) {
            fn(items);
            items = [];
          }
          timeoutId = null;
        }, 16); // ~60fps
      }
    };
  }
};

// ============================================================================
// 3. MEMORY MANAGEMENT
// ============================================================================

/**
 * Memory management and garbage collection
 */
const memoryManagement = {
  /**
   * Detect potential memory leaks
   * @param {Function} fn - Function to monitor
   * @param {number} iterations - Number of iterations
   * @returns {Object} Memory leak analysis
   */
  detectMemoryLeaks(fn, iterations = 100) {
    const measurements = [];
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    for (let i = 0; i < iterations; i++) {
      fn();
      
      if (i % 10 === 0 && performance.memory) {
        measurements.push({
          iteration: i,
          memory: performance.memory.usedJSHeapSize
        });
      }
    }
    
    if (measurements.length < 2) {
      return { available: false };
    }
    
    const finalMemory = measurements[measurements.length - 1].memory;
    const startMemory = measurements[0].memory;
    const growth = finalMemory - startMemory;
    const growthRate = (growth / startMemory) * 100;
    
    return {
      initialMemory,
      finalMemory,
      totalGrowth: finalMemory - initialMemory,
      growthRate,
      growthBetweenIterations: growth,
      likelyLeak: growthRate > 20,
      measurements
    };
  },

  /**
   * Clear references to enable garbage collection
   * @param {Object} obj - Object with references
   */
  clearReferences(obj) {
    Object.keys(obj).forEach(key => {
      obj[key] = null;
    });
  },

  /**
   * Monitor object pool usage
   */
  ObjectPool: class {
    constructor(ObjectClass, initialSize = 10) {
      this.ObjectClass = ObjectClass;
      this.available = [];
      this.inUse = new Set();
      
      for (let i = 0; i < initialSize; i++) {
        this.available.push(new ObjectClass());
      }
    }

    /**
     * Get object from pool
     * @returns {Object}
     */
    acquire() {
      let obj;
      
      if (this.available.length > 0) {
        obj = this.available.pop();
      } else {
        obj = new this.ObjectClass();
      }
      
      this.inUse.add(obj);
      return obj;
    }

    /**
     * Return object to pool
     * @param {Object} obj - Object to return
     */
    release(obj) {
      if (this.inUse.has(obj)) {
        this.inUse.delete(obj);
        this.available.push(obj);
      }
    }

    /**
     * Get pool statistics
     * @returns {Object}
     */
    getStats() {
      return {
        available: this.available.length,
        inUse: this.inUse.size,
        total: this.available.length + this.inUse.size
      };
    }
  }
};

// ============================================================================
// 4. DOM OPTIMIZATION
// ============================================================================

/**
 * DOM manipulation optimization
 */
const domOptimization = {
  /**
   * Batch DOM updates using DocumentFragment
   * @param {Array} items - Items to add
   * @param {Function} createElementFn - Function to create element for each item
   * @returns {DocumentFragment}
   */
  batchUpdate(items, createElementFn) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
      const element = createElementFn(item);
      fragment.appendChild(element);
    });
    
    return fragment;
  },

  /**
   * Prevent layout thrashing by batch reading/writing
   * @param {Function} readFn - Function to read DOM properties
   * @param {Function} writeFn - Function to write DOM properties
   */
  batchReadWrite(readFn, writeFn) {
    // Read phase
    const readData = readFn();
    
    // Write phase
    writeFn(readData);
  },

  /**
   * Virtual scrolling for large lists
   */
  VirtualScroller: class {
    constructor(container, itemHeight, items, renderFn) {
      this.container = container;
      this.itemHeight = itemHeight;
      this.items = items;
      this.renderFn = renderFn;
      this.visibleItems = [];
      this.viewport = document.createElement('div');
      this.scrollTop = 0;

      this.container.appendChild(this.viewport);
      this.container.addEventListener('scroll', () => this.onScroll());
    }

    /**
     * Handle scroll event
     */
    onScroll() {
      this.scrollTop = this.container.scrollTop;
      this.render();
    }

    /**
     * Render only visible items
     */
    render() {
      const containerHeight = this.container.clientHeight;
      const startIndex = Math.floor(this.scrollTop / this.itemHeight);
      const endIndex = Math.ceil((this.scrollTop + containerHeight) / this.itemHeight);

      this.viewport.innerHTML = '';
      this.viewport.style.height = this.items.length * this.itemHeight + 'px';

      for (let i = startIndex; i < Math.min(endIndex, this.items.length); i++) {
        const element = this.renderFn(this.items[i], i);
        element.style.transform = `translateY(${i * this.itemHeight}px)`;
        this.viewport.appendChild(element);
      }
    }
  },

  /**
   * CSS class batching
   * @param {Element} element - Element to modify
   * @param {Array} classesToAdd - Classes to add
   * @param {Array} classesToRemove - Classes to remove
   */
  batchClassUpdate(element, classesToAdd = [], classesToRemove = []) {
    // Read current classes
    const current = element.className.split(' ');
    
    // Batch modifications
    const updated = new Set(current);
    classesToAdd.forEach(cls => updated.add(cls));
    classesToRemove.forEach(cls => updated.delete(cls));
    
    // Single write
    element.className = Array.from(updated).join(' ');
  }
};

// ============================================================================
// 5. RESOURCE OPTIMIZATION
// ============================================================================

/**
 * Resource loading and optimization
 */
const resourceOptimization = {
  /**
   * Lazy load images
   * @param {Element} container - Container element
   * @param {string} imageSelector - CSS selector for images
   */
  lazyLoadImages(container, imageSelector = 'img[data-src]') {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    const images = container.querySelectorAll(imageSelector);
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  /**
   * Lazy load components/sections
   * @param {Element} container - Container element
   * @param {Function} loaderFn - Function to load content
   */
  lazyLoadContent(container, loaderFn) {
    if (!('IntersectionObserver' in window)) {
      loaderFn();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loaderFn();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(container);
  },

  /**
   * Prefetch resources
   * @param {Array} urls - URLs to prefetch
   * @param {string} type - Resource type
   */
  prefetch(urls, type = 'script') {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = type;
      document.head.appendChild(link);
    });
  },

  /**
   * Preload critical resources
   * @param {Array} urls - URLs to preload
   * @param {string} type - Resource type
   */
  preload(urls, type = 'script') {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      document.head.appendChild(link);
    });
  }
};

// ============================================================================
// 6. RENDERING PERFORMANCE
// ============================================================================

/**
 * Rendering optimization
 */
const renderingOptimization = {
  /**
   * Optimize CSS animations
   * @param {Element} element - Element to animate
   * @param {Object} options - Animation options
   */
  setupGPUAcceleration(element, options = {}) {
    const {
      useTransform3d = true,
      useWillChange = true
    } = options;

    if (useTransform3d) {
      element.style.transform = 'translate3d(0, 0, 0)';
    }

    if (useWillChange) {
      element.style.willChange = 'transform';
    }
  },

  /**
   * Disable will-change after animation
   * @param {Element} element - Element to optimize
   */
  cleanupGPUAcceleration(element) {
    element.style.willChange = 'auto';
  },

  /**
   * Request animation frame loop
   * @param {Function} callback - Callback function
   * @returns {number} Animation frame ID
   */
  animationLoop(callback) {
    let rafId;
    const loop = () => {
      callback();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return rafId;
  },

  /**
   * Calculate frame rate
   * @returns {Promise} FPS measurement
   */
  measureFPS() {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frames++;
        
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(frames);
        }
      };
      
      requestAnimationFrame(countFrame);
    });
  }
};

// ============================================================================
// 7. PERFORMANCE BEST PRACTICES
// ============================================================================

/**
 * Best practices and patterns
 */
const bestPractices = {
  /**
   * Performance budgeting
   */
  PerformanceBudget: class {
    constructor(budgets = {}) {
      this.budgets = {
        loadTime: 3000,        // 3 seconds
        interactiveTime: 5000, // 5 seconds
        bundleSize: 200,       // 200KB
        ...budgets
      };
      this.measurements = {};
    }

    /**
     * Check if within budget
     * @param {string} metric - Metric name
     * @param {number} value - Measured value
     * @returns {boolean}
     */
    isWithinBudget(metric, value) {
      const budget = this.budgets[metric];
      if (!budget) return true;
      
      const withinBudget = value <= budget;
      const status = withinBudget ? '✅' : '❌';
      console.log(`${status} ${metric}: ${value}/${budget}`);
      
      return withinBudget;
    }
  },

  /**
   * Performance audit
   */
  performanceAudit() {
    const timing = performanceMeasurement.getNavigationTiming();
    const memory = performanceMeasurement.getMemoryUsage();
    const resources = performanceMeasurement.getResourceTiming();

    return {
      timing,
      memory,
      resourceCount: resources.length,
      cachedResources: resources.filter(r => r.cached).length,
      totalLoadTime: timing.pageLoadTime,
      domReady: timing.domContentLoadedTime
    };
  }
};

// ============================================================================
// EXERCISES & QUIZZES
// ============================================================================

const exercises = [
  {
    id: 'perf-memoize',
    title: 'Implement Function Memoization',
    description: 'Create a memoized fibonacci function that caches results. Measure performance improvement with and without memoization.',
    difficulty: 'intermediate',
    hints: [
      'Use a Map to store previous results',
      'Cache keys should be based on arguments',
      'Compare execution times with measureTime()'
    ]
  },
  {
    id: 'perf-dom-batch',
    title: 'Optimize DOM Updates',
    description: 'Create a function that adds 1000 elements to the DOM. First do it naively, then batch with DocumentFragment. Measure reflow count.',
    difficulty: 'intermediate',
    hints: [
      'Use batchUpdate() for DocumentFragment approach',
      'Monitor performance.measure() for differences',
      'DocumentFragment prevents multiple reflows'
    ]
  },
  {
    id: 'perf-infinite-scroll',
    title: 'Virtual Scrolling Implementation',
    description: 'Implement virtual scrolling for a list of 10,000 items using VirtualScroller class.',
    difficulty: 'advanced',
    hints: [
      'Only render visible items in viewport',
      'Update render() on scroll events',
      'Calculate start/end indices based on scroll position'
    ]
  }
];

const quiz = [
  {
    id: 'q1',
    question: 'What is the main benefit of memoization?',
    options: [
      'Reduces memory usage',
      'Caches function results to avoid recalculation',
      'Improves code readability',
      'Speeds up network requests'
    ],
    correct: 1
  },
  {
    id: 'q2',
    question: 'Which technique prevents layout thrashing?',
    options: [
      'Using setTimeout',
      'Batch reading then writing DOM properties',
      'Minifying CSS',
      'Using inline styles'
    ],
    correct: 1
  },
  {
    id: 'q3',
    question: 'What is lazy loading?',
    options: [
      'Delaying JavaScript execution',
      'Loading resources only when needed',
      'Slowing down the application',
      'Caching all resources'
    ],
    correct: 1
  },
  {
    id: 'q4',
    question: 'Which of these optimizes animations?',
    options: [
      'Using `translate3d()` for GPU acceleration',
      'Using `setTimeout` loops',
      'Increasing frame rate',
      'Reducing element count'
    ],
    correct: 0
  },
  {
    id: 'q5',
    question: 'What does debouncing prevent?',
    options: [
      'Memory leaks',
      'Excessive function calls during rapid events',
      'CSS animation jank',
      'DOM reflows'
    ],
    correct: 1
  }
];

// ============================================================================
// EXPORT CONCEPT CONFIG
// ============================================================================

const conceptConfig = {
  id: 'performance',
  title: 'Performance Optimization',
  description: 'Master web performance optimization, profiling, and best practices. Learn to measure, analyze, and improve application speed.',
  icon: 'zap',
  level: 'advanced',
  estimatedTime: '5-7 hours',
  prerequisites: ['basics', 'dom', 'async'],
  topics: {
    measurement: performanceMeasurement,
    codeOptimization,
    memory: memoryManagement,
    dom: domOptimization,
    resources: resourceOptimization,
    rendering: renderingOptimization,
    practices: bestPractices
  },
  exercises,
  quiz,
  resources: [
    {
      title: 'Web Vitals',
      url: 'https://web.dev/vitals/'
    },
    {
      title: 'Performance Best Practices',
      url: 'https://web.dev/performance/'
    },
    {
      title: 'Chrome DevTools Performance',
      url: 'https://developer.chrome.com/docs/devtools/performance/'
    },
    {
      title: 'Performance API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Performance'
    }
  ]
};

module.exports = {
  conceptConfig,
  performanceMeasurement,
  codeOptimization,
  memoryManagement,
  domOptimization,
  resourceOptimization,
  renderingOptimization,
  bestPractices
};
