/**
 * Performance Optimization Advanced Patterns
 * Production-ready performance patterns and implementations
 */

/**
 * Advanced Caching Strategies
 */
const cachingStrategies = {
  /**
   * LRU (Least Recently Used) Cache
   */
  LRUCache: class {
    constructor(maxSize = 100) {
      this.maxSize = maxSize;
      this.cache = new Map();
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {any} Cached value or undefined
     */
    get(key) {
      if (!this.cache.has(key)) return undefined;

      const value = this.cache.get(key);
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     */
    set(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }

      this.cache.set(key, value);

      if (this.cache.size > this.maxSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
    }

    /**
     * Clear cache
     */
    clear() {
      this.cache.clear();
    }

    /**
     * Get cache stats
     * @returns {Object}
     */
    getStats() {
      return {
        size: this.cache.size,
        maxSize: this.maxSize,
        utilization: (this.cache.size / this.maxSize) * 100
      };
    }
  },

  /**
   * Time-based Cache with TTL
   */
  TTLCache: class {
    constructor(ttl = 5000) {
      this.ttl = ttl;
      this.cache = new Map();
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {any}
     */
    get(key) {
      if (!this.cache.has(key)) return undefined;

      const entry = this.cache.get(key);
      if (Date.now() - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        return undefined;
      }

      return entry.value;
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     */
    set(key, value) {
      this.cache.set(key, {
        value,
        timestamp: Date.now()
      });
    }

    /**
     * Clear expired entries
     */
    cleanup() {
      const now = Date.now();
      for (const [key, entry] of this.cache) {
        if (now - entry.timestamp > this.ttl) {
          this.cache.delete(key);
        }
      }
    }
  }
};

/**
 * Advanced Async Patterns
 */
const asyncPatterns = {
  /**
   * Promise queue - Execute promises sequentially
   */
  PromiseQueue: class {
    constructor(concurrency = 1) {
      this.concurrency = concurrency;
      this.queue = [];
      this.running = 0;
    }

    /**
     * Add promise to queue
     * @param {Function} fn - Promise-returning function
     * @returns {Promise}
     */
    add(fn) {
      return new Promise((resolve, reject) => {
        this.queue.push({ fn, resolve, reject });
        this.process();
      });
    }

    /**
     * Process queue
     */
    process() {
      while (this.running < this.concurrency && this.queue.length > 0) {
        this.running++;
        const { fn, resolve, reject } = this.queue.shift();

        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;
            this.process();
          });
      }
    }
  },

  /**
   * Timeout wrapper for promises
   * @param {Promise} promise - Promise to wrap
   * @param {number} ms - Timeout in milliseconds
   * @returns {Promise}
   */
  withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  },

  /**
   * Retry logic with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retries
   * @param {number} initialDelay - Initial delay in ms
   * @returns {Promise}
   */
  async retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (i < maxRetries) {
          const delay = initialDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
};

/**
 * Worker Pool Pattern
 */
const workerPool = {
  /**
   * Worker Pool for parallel processing
   */
  WorkerPool: class {
    constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
      this.poolSize = poolSize;
      this.workers = [];
      this.queue = [];
      this.activeCount = 0;

      for (let i = 0; i < poolSize; i++) {
        try {
          const worker = new Worker(workerScript);
          this.workers.push({
            worker,
            busy: false
          });
        } catch (e) {
          console.warn('Web Workers not available');
        }
      }
    }

    /**
     * Execute task
     * @param {any} data - Data to send to worker
     * @returns {Promise}
     */
    execute(data) {
      return new Promise((resolve, reject) => {
        this.queue.push({ data, resolve, reject });
        this.process();
      });
    }

    /**
     * Process queue
     */
    process() {
      const availableWorker = this.workers.find(w => !w.busy);

      if (!availableWorker || this.queue.length === 0) return;

      const { data, resolve, reject } = this.queue.shift();
      availableWorker.busy = true;
      this.activeCount++;

      const messageHandler = (event) => {
        availableWorker.worker.removeEventListener('message', messageHandler);
        availableWorker.worker.removeEventListener('error', errorHandler);
        availableWorker.busy = false;
        this.activeCount--;
        resolve(event.data);
        this.process();
      };

      const errorHandler = (error) => {
        availableWorker.worker.removeEventListener('message', messageHandler);
        availableWorker.worker.removeEventListener('error', errorHandler);
        availableWorker.busy = false;
        this.activeCount--;
        reject(error);
        this.process();
      };

      availableWorker.worker.addEventListener('message', messageHandler);
      availableWorker.worker.addEventListener('error', errorHandler);
      availableWorker.worker.postMessage(data);
    }

    /**
     * Terminate all workers
     */
    terminate() {
      this.workers.forEach(w => w.worker.terminate());
      this.workers = [];
    }

    /**
     * Get pool stats
     * @returns {Object}
     */
    getStats() {
      return {
        poolSize: this.poolSize,
        active: this.activeCount,
        queued: this.queue.length,
        idle: this.workers.filter(w => !w.busy).length
      };
    }
  }
};

/**
 * Request Animation Frame optimization patterns
 */
const rafPatterns = {
  /**
   * Optimal RAF loop with FPS control
   */
  RAF: class {
    constructor(targetFPS = 60) {
      this.targetFPS = targetFPS;
      this.frameTime = 1000 / targetFPS;
      this.lastTime = 0;
      this.rafId = null;
      this.callbacks = [];
    }

    /**
     * Register callback
     * @param {Function} callback - Callback to execute
     */
    onFrame(callback) {
      this.callbacks.push(callback);
    }

    /**
     * Start RAF loop
     */
    start() {
      const loop = (currentTime) => {
        if (currentTime - this.lastTime >= this.frameTime) {
          this.callbacks.forEach(cb => cb(currentTime));
          this.lastTime = currentTime;
        }

        this.rafId = requestAnimationFrame(loop);
      };

      this.rafId = requestAnimationFrame(loop);
    }

    /**
     * Stop RAF loop
     */
    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }
};

/**
 * Intersection Observer optimization
 */
const observerPatterns = {
  /**
   * Visibility observer for element load triggers
   */
  VisibilityObserver: class {
    constructor(options = {}) {
      const {
        threshold = 0.1,
        rootMargin = '50px'
      } = options;

      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        { threshold, rootMargin }
      );

      this.callbacks = new Map();
    }

    /**
     * Observe element
     * @param {Element} element - Element to observe
     * @param {Function} callback - Callback when visible
     */
    observe(element, callback) {
      this.callbacks.set(element, callback);
      this.observer.observe(element);
    }

    /**
     * Stop observing element
     * @param {Element} element - Element to stop observing
     */
    unobserve(element) {
      this.observer.unobserve(element);
      this.callbacks.delete(element);
    }

    /**
     * Handle intersection
     * @private
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback(entry);
          }
        }
      });
    }

    /**
     * Disconnect observer
     */
    disconnect() {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
};

/**
 * Bundle optimization utilities
 */
const bundleOptimization = {
  /**
   * Dynamic import with caching
   * @param {string} modulePath - Path to module
   * @param {Map} cache - Cache map
   * @returns {Promise}
   */
  async cachedDynamicImport(modulePath, cache = new Map()) {
    if (cache.has(modulePath)) {
      return cache.get(modulePath);
    }

    const modulePromise = import(modulePath);
    cache.set(modulePath, modulePromise);
    return modulePromise;
  },

  /**
   * Chunk loading strategy
   */
  ChunkLoader: class {
    constructor() {
      this.chunks = new Map();
      this.loading = new Map();
    }

    /**
     * Load chunk
     * @param {string} chunkId - Chunk identifier
     * @param {string} url - Chunk URL
     * @returns {Promise}
     */
    async loadChunk(chunkId, url) {
      if (this.chunks.has(chunkId)) {
        return this.chunks.get(chunkId);
      }

      if (this.loading.has(chunkId)) {
        return this.loading.get(chunkId);
      }

      const loadPromise = fetch(url)
        .then(r => r.json())
        .then(data => {
          this.chunks.set(chunkId, data);
          this.loading.delete(chunkId);
          return data;
        });

      this.loading.set(chunkId, loadPromise);
      return loadPromise;
    }

    /**
     * Preload chunk
     * @param {string} chunkId - Chunk identifier
     * @param {string} url - Chunk URL
     */
    preloadChunk(chunkId, url) {
      this.loadChunk(chunkId, url);
    }

    /**
     * Get loaded chunks
     * @returns {Array}
     */
    getLoadedChunks() {
      return Array.from(this.chunks.keys());
    }
  }
};

/**
 * Scroll performance optimization
 */
const scrollOptimization = {
  /**
   * Passive scroll listener
   * @param {Element} element - Element to listen on
   * @param {Function} handler - Handler function
   */
  addPassiveScrollListener(element, handler) {
    element.addEventListener('scroll', handler, { passive: true });
  },

  /**
   * Remove passive scroll listener
   * @param {Element} element - Element to unlisten from
   * @param {Function} handler - Handler function
   */
  removePassiveScrollListener(element, handler) {
    element.removeEventListener('scroll', handler, { passive: true });
  },

  /**
   * Infinite scroll implementation
   */
  InfiniteScroll: class {
    constructor(container, loadMoreFn, options = {}) {
      const {
        threshold = 300,
        margin = '100px'
      } = options;

      this.container = container;
      this.loadMoreFn = loadMoreFn;
      this.isLoading = false;

      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          rootMargin: margin
        }
      );

      this.sentinel = document.createElement('div');
      container.appendChild(this.sentinel);
      this.observer.observe(this.sentinel);
    }

    /**
     * Handle intersection
     * @private
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading) {
          this.isLoading = true;
          this.loadMoreFn()
            .then(() => {
              this.isLoading = false;
            })
            .catch(error => {
              console.error('Error loading more items:', error);
              this.isLoading = false;
            });
        }
      });
    }

    /**
     * Disconnect observer
     */
    disconnect() {
      this.observer.disconnect();
      this.sentinel.remove();
    }
  }
};

module.exports = {
  cachingStrategies,
  asyncPatterns,
  workerPool,
  rafPatterns,
  observerPatterns,
  bundleOptimization,
  scrollOptimization
};
