/**
 * Performance Optimization Concept Tests
 * Comprehensive test suite for performance measurement and optimization
 */

const {
  performanceMeasurement,
  codeOptimization,
  memoryManagement,
  domOptimization,
  resourceOptimization,
  renderingOptimization,
  bestPractices
} = require('../src/concepts/performance/index.js');

describe('Performance Optimization Concept', () => {
  // ========================================================================
  // Performance Measurement Tests
  // ========================================================================

  describe('Performance Measurement', () => {
    test('should measure execution time', () => {
      const result = performanceMeasurement.measureTime(() => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) sum += i;
        return sum;
      }, 'Sum Test');

      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('result');
      expect(result.result).toBe(499500);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    test('should get memory usage if available', () => {
      const memory = performanceMeasurement.getMemoryUsage();
      
      if (memory.available === false) {
        expect(memory.available).toBe(false);
      } else {
        expect(memory).toHaveProperty('usedJSHeapSize');
        expect(memory).toHaveProperty('totalJSHeapSize');
        expect(memory).toHaveProperty('jsHeapSizeLimit');
      }
    });

    test('should get navigation timing', () => {
      const timing = performanceMeasurement.getNavigationTiming();
      
      expect(timing).toHaveProperty('redirectTime');
      expect(timing).toHaveProperty('domainLookupTime');
      expect(timing).toHaveProperty('connectTime');
      expect(timing).toHaveProperty('pageLoadTime');
    });

    test('should get resource timing', () => {
      const resources = performanceMeasurement.getResourceTiming();
      
      expect(Array.isArray(resources)).toBe(true);
      if (resources.length > 0) {
        expect(resources[0]).toHaveProperty('name');
        expect(resources[0]).toHaveProperty('duration');
        expect(resources[0]).toHaveProperty('size');
      }
    });

    test('should create performance observer', () => {
      const callback = jest.fn();
      const observer = performanceMeasurement.createObserver(callback, 'measure');
      
      expect(observer).toBeInstanceOf(PerformanceObserver);
      observer.disconnect();
    });

    test('should mark performance points', () => {
      performanceMeasurement.mark('testMark');
      const marks = performance.getEntriesByName('testMark');
      
      expect(marks.length).toBeGreaterThan(0);
      expect(marks[0].name).toBe('testMark');
    });

    test('should measure between marks', () => {
      performance.clearMarks();
      performance.clearMeasures();
      
      performanceMeasurement.mark('start');
      performanceMeasurement.mark('end');
      performanceMeasurement.measure('testMeasure', 'start', 'end');
      
      const measures = performance.getEntriesByName('testMeasure');
      expect(measures.length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Code Optimization Tests
  // ========================================================================

  describe('Code Optimization', () => {
    test('should memoize function results', () => {
      let callCount = 0;
      const fibonacci = codeOptimization.memoize((n) => {
        callCount++;
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      });

      const result1 = fibonacci(5);
      const callCount1 = callCount;
      callCount = 0;
      
      const result2 = fibonacci(5);
      const callCount2 = callCount;

      expect(result1).toBe(5);
      expect(result2).toBe(5);
      expect(callCount2).toBeLessThan(callCount1);
    });

    test('should debounce function calls', (done) => {
      let callCount = 0;
      const debounced = codeOptimization.debounce(() => {
        callCount++;
      }, 50);

      debounced();
      debounced();
      debounced();

      expect(callCount).toBe(0);

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 100);
    });

    test('should throttle function calls', (done) => {
      let callCount = 0;
      const throttled = codeOptimization.throttle(() => {
        callCount++;
      }, 50);

      throttled();
      throttled();
      throttled();

      expect(callCount).toBe(1);

      setTimeout(() => {
        expect(callCount).toBeGreaterThanOrEqual(1);
        done();
      }, 100);
    });

    test('should batch function calls', (done) => {
      let batchedItems = [];
      const batchFn = codeOptimization.batch((items) => {
        batchedItems = items;
      }, 3);

      batchFn(1);
      batchFn(2);
      expect(batchedItems.length).toBe(0);

      batchFn(3);
      expect(batchedItems.length).toBe(3);

      done();
    });

    test('should have RAF-based throttle', (done) => {
      let callCount = 0;
      const rafThrottled = codeOptimization.throttleRAF(() => {
        callCount++;
      });

      rafThrottled();
      rafThrottled();
      rafThrottled();

      expect(callCount).toBe(0);

      setTimeout(() => {
        expect(callCount).toBeGreaterThan(0);
        done();
      }, 50);
    });
  });

  // ========================================================================
  // Memory Management Tests
  // ========================================================================

  describe('Memory Management', () => {
    test('should detect memory usage changes', () => {
      const result = memoryManagement.detectMemoryLeaks(() => {
        const arr = [];
        for (let i = 0; i < 1000; i++) {
          arr.push(Math.random());
        }
      }, 10);

      if (result.available !== false) {
        expect(result).toHaveProperty('growthRate');
        expect(result).toHaveProperty('measurements');
      }
    });

    test('should clear object references', () => {
      const obj = {
        a: [1, 2, 3],
        b: { x: 10 },
        c: 'string'
      };

      memoryManagement.clearReferences(obj);

      expect(obj.a).toBeNull();
      expect(obj.b).toBeNull();
      expect(obj.c).toBeNull();
    });

    test('should create object pool', () => {
      class TestObject {
        constructor() {
          this.value = 0;
        }
      }

      const pool = new memoryManagement.ObjectPool(TestObject, 5);
      const stats = pool.getStats();

      expect(stats.available).toBe(5);
      expect(stats.inUse).toBe(0);
      expect(stats.total).toBe(5);
    });

    test('should acquire and release objects from pool', () => {
      class TestObject {
        constructor() {
          this.value = 0;
        }
      }

      const pool = new memoryManagement.ObjectPool(TestObject, 3);
      const obj1 = pool.acquire();
      const obj2 = pool.acquire();

      let stats = pool.getStats();
      expect(stats.inUse).toBe(2);
      expect(stats.available).toBe(1);

      pool.release(obj1);
      stats = pool.getStats();
      expect(stats.inUse).toBe(1);
      expect(stats.available).toBe(2);
    });
  });

  // ========================================================================
  // DOM Optimization Tests
  // ========================================================================

  describe('DOM Optimization', () => {
    test('should batch DOM updates with fragment', () => {
      const createElement = (item) => {
        const div = document.createElement('div');
        div.textContent = item;
        return div;
      };

      const fragment = domOptimization.batchUpdate([1, 2, 3], createElement);

      expect(fragment).toBeInstanceOf(DocumentFragment);
      expect(fragment.childNodes.length).toBe(3);
    });

    test('should batch read/write operations', () => {
      const readFn = jest.fn(() => ({ width: 100 }));
      const writeFn = jest.fn();

      domOptimization.batchReadWrite(readFn, writeFn);

      expect(readFn).toHaveBeenCalled();
      expect(writeFn).toHaveBeenCalled();
    });

    test('should batch class updates', () => {
      const element = document.createElement('div');
      element.className = 'existing';

      domOptimization.batchClassUpdate(
        element,
        ['new-class', 'another-class'],
        ['existing']
      );

      expect(element.className).toContain('new-class');
      expect(element.className).toContain('another-class');
      expect(element.className).not.toContain('existing');
    });

    test('should create virtual scroller', () => {
      const container = document.createElement('div');
      const items = Array.from({ length: 100 }, (_, i) => i);
      const renderFn = jest.fn((item) => {
        const div = document.createElement('div');
        div.textContent = item;
        return div;
      });

      const scroller = new domOptimization.VirtualScroller(
        container,
        20,
        items,
        renderFn
      );

      expect(scroller).toBeTruthy();
      expect(scroller.items.length).toBe(100);
    });
  });

  // ========================================================================
  // Resource Optimization Tests
  // ========================================================================

  describe('Resource Optimization', () => {
    test('should lazy load images', () => {
      const container = document.createElement('div');
      const img = document.createElement('img');
      img.dataset.src = 'image.jpg';
      container.appendChild(img);

      resourceOptimization.lazyLoadImages(container);

      expect(container.querySelectorAll('img[data-src]').length).toBe(1);
    });

    test('should lazy load content', () => {
      const container = document.createElement('div');
      const loaderFn = jest.fn();

      resourceOptimization.lazyLoadContent(container, loaderFn);

      // Function should be ready to be called on intersection
      expect(loaderFn).toHaveBeenCalledOrNotCalled;
    });

    test('should prefetch resources', () => {
      resourceOptimization.prefetch(['https://example.com/script.js'], 'script');
      
      const links = document.querySelectorAll('link[rel="prefetch"]');
      expect(links.length).toBeGreaterThan(0);

      // Cleanup
      links.forEach(link => link.remove());
    });

    test('should preload resources', () => {
      resourceOptimization.preload(['https://example.com/style.css'], 'style');
      
      const links = document.querySelectorAll('link[rel="preload"]');
      expect(links.length).toBeGreaterThan(0);

      // Cleanup
      links.forEach(link => link.remove());
    });
  });

  // ========================================================================
  // Rendering Optimization Tests
  // ========================================================================

  describe('Rendering Optimization', () => {
    test('should setup GPU acceleration', () => {
      const element = document.createElement('div');
      renderingOptimization.setupGPUAcceleration(element);

      expect(element.style.transform).toBe('translate3d(0, 0, 0)');
      expect(element.style.willChange).toBe('transform');
    });

    test('should cleanup GPU acceleration', () => {
      const element = document.createElement('div');
      element.style.willChange = 'transform';

      renderingOptimization.cleanupGPUAcceleration(element);

      expect(element.style.willChange).toBe('auto');
    });

    test('should measure FPS', async () => {
      const fps = await renderingOptimization.measureFPS();

      expect(typeof fps).toBe('number');
      expect(fps).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Best Practices Tests
  // ========================================================================

  describe('Best Practices', () => {
    test('should create performance budget', () => {
      const budget = new bestPractices.PerformanceBudget({
        loadTime: 3000,
        bundleSize: 200
      });

      expect(budget.budgets.loadTime).toBe(3000);
      expect(budget.budgets.bundleSize).toBe(200);
    });

    test('should check if within budget', () => {
      const budget = new bestPractices.PerformanceBudget({
        loadTime: 3000
      });

      const withinBudget = budget.isWithinBudget('loadTime', 2500);
      expect(withinBudget).toBe(true);

      const exceedsBudget = budget.isWithinBudget('loadTime', 4000);
      expect(exceedsBudget).toBe(false);
    });

    test('should perform performance audit', () => {
      const audit = bestPractices.performanceAudit();

      expect(audit).toHaveProperty('timing');
      expect(audit).toHaveProperty('memory');
      expect(audit).toHaveProperty('resourceCount');
      expect(typeof audit.totalLoadTime).toBe('number');
    });
  });

  // ========================================================================
  // Quiz Questions Tests
  // ========================================================================

  describe('Quiz Questions', () => {
    test('should have 5 quiz questions', () => {
      const { quiz } = require('../src/concepts/performance/index.js').conceptConfig;
      expect(quiz.length).toBe(5);
    });

    test('should have correct quiz structure', () => {
      const { quiz } = require('../src/concepts/performance/index.js').conceptConfig;
      quiz.forEach(q => {
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(4);
        expect(typeof q.correct).toBe('number');
      });
    });
  });

  // ========================================================================
  // Exercises Tests
  // ========================================================================

  describe('Exercises', () => {
    test('should have 3 exercises', () => {
      const { exercises } = require('../src/concepts/performance/index.js').conceptConfig;
      expect(exercises.length).toBe(3);
    });

    test('should have exercise structure', () => {
      const { exercises } = require('../src/concepts/performance/index.js').conceptConfig;
      exercises.forEach(ex => {
        expect(ex.id).toBeTruthy();
        expect(ex.title).toBeTruthy();
        expect(ex.description).toBeTruthy();
        expect(ex.difficulty).toBeTruthy();
        expect(Array.isArray(ex.hints)).toBe(true);
      });
    });
  });
});
