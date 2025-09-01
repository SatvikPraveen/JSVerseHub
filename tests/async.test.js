// File: tests/async.test.js
// Location: jsversehub/tests/async.test.js

describe('Asynchronous JavaScript Concepts', () => {
  
  // Test callbacks
  describe('Callbacks', () => {
    test('callback functions should execute after main function', (done) => {
      let result = '';
      
      function mainFunction(callback) {
        result += 'main ';
        setTimeout(() => {
          result += 'async ';
          callback();
        }, 10);
      }
      
      function callbackFunction() {
        result += 'callback';
        expect(result).toBe('main async callback');
        done();
      }
      
      mainFunction(callbackFunction);
    });

    test('callback hell should be manageable with proper structure', (done) => {
      let steps = [];
      
      function step1(callback) {
        setTimeout(() => {
          steps.push('step1');
          callback();
        }, 10);
      }
      
      function step2(callback) {
        setTimeout(() => {
          steps.push('step2');
          callback();
        }, 10);
      }
      
      function step3(callback) {
        setTimeout(() => {
          steps.push('step3');
          callback();
        }, 10);
      }
      
      step1(() => {
        step2(() => {
          step3(() => {
            expect(steps).toEqual(['step1', 'step2', 'step3']);
            done();
          });
        });
      });
    });

    test('error-first callbacks should handle errors', (done) => {
      function asyncOperation(shouldFail, callback) {
        setTimeout(() => {
          if (shouldFail) {
            callback(new Error('Operation failed'), null);
          } else {
            callback(null, 'success');
          }
        }, 10);
      }
      
      asyncOperation(false, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe('success');
        
        asyncOperation(true, (error, result) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Operation failed');
          expect(result).toBeNull();
          done();
        });
      });
    });
  });

  // Test Promises
  describe('Promises', () => {
    test('Promise should resolve with correct value', async () => {
      const promise = new Promise((resolve) => {
        setTimeout(() => resolve('resolved value'), 10);
      });
      
      const result = await promise;
      expect(result).toBe('resolved value');
    });

    test('Promise should reject with error', async () => {
      const promise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('rejected')), 10);
      });
      
      await expect(promise).rejects.toThrow('rejected');
    });

    test('Promise.then should chain correctly', () => {
      return Promise.resolve(5)
        .then(value => value * 2)
        .then(value => value + 3)
        .then(value => {
          expect(value).toBe(13);
        });
    });

    test('Promise.catch should handle errors', () => {
      return Promise.reject(new Error('test error'))
        .catch(error => {
          expect(error.message).toBe('test error');
          return 'handled';
        })
        .then(value => {
          expect(value).toBe('handled');
        });
    });

    test('Promise.finally should always execute', async () => {
      let finallyExecuted = false;
      
      await Promise.resolve('success')
        .finally(() => {
          finallyExecuted = true;
        });
      
      expect(finallyExecuted).toBe(true);
      
      finallyExecuted = false;
      
      await Promise.reject(new Error('error'))
        .catch(() => {})
        .finally(() => {
          finallyExecuted = true;
        });
      
      expect(finallyExecuted).toBe(true);
    });

    test('Promise.all should resolve when all promises resolve', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
      ];
      
      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2, 3]);
    });

    test('Promise.all should reject if any promise rejects', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject(new Error('failed')),
        Promise.resolve(3)
      ];
      
      await expect(Promise.all(promises)).rejects.toThrow('failed');
    });

    test('Promise.allSettled should wait for all promises regardless of outcome', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject(new Error('failed')),
        Promise.resolve(3)
      ];
      
      const results = await Promise.allSettled(promises);
      
      expect(results[0]).toEqual({ status: 'fulfilled', value: 1 });
      expect(results[1]).toEqual({ 
        status: 'rejected', 
        reason: expect.objectContaining({ message: 'failed' })
      });
      expect(results[2]).toEqual({ status: 'fulfilled', value: 3 });
    });

    test('Promise.race should resolve with first settled promise', async () => {
      const slowPromise = new Promise(resolve => setTimeout(() => resolve('slow'), 100));
      const fastPromise = new Promise(resolve => setTimeout(() => resolve('fast'), 10));
      
      const result = await Promise.race([slowPromise, fastPromise]);
      expect(result).toBe('fast');
    });
  });

  // Test async/await
  describe('Async/Await', () => {
    test('async function should return a Promise', () => {
      async function asyncFunc() {
        return 'hello';
      }
      
      const result = asyncFunc();
      expect(result).toBeInstanceOf(Promise);
      return expect(result).resolves.toBe('hello');
    });

    test('await should wait for Promise resolution', async () => {
      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
      const start = Date.now();
      await delay(50);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(45);
    });

    test('async/await should handle errors with try/catch', async () => {
      async function throwError() {
        throw new Error('async error');
      }
      
      let caughtError;
      try {
        await throwError();
      } catch (error) {
        caughtError = error;
      }
      
      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError.message).toBe('async error');
    });

    test('async/await should work with sequential operations', async () => {
      async function fetchData(id) {
        await new Promise(resolve => setTimeout(resolve, 10));
        return `data-${id}`;
      }
      
      const start = Date.now();
      const result1 = await fetchData(1);
      const result2 = await fetchData(2);
      const end = Date.now();
      
      expect(result1).toBe('data-1');
      expect(result2).toBe('data-2');
      expect(end - start).toBeGreaterThanOrEqual(18); // Two 10ms delays
    });

    test('async/await should work with concurrent operations', async () => {
      async function fetchData(id) {
        await new Promise(resolve => setTimeout(resolve, 20));
        return `data-${id}`;
      }
      
      const start = Date.now();
      const [result1, result2] = await Promise.all([
        fetchData(1),
        fetchData(2)
      ]);
      const end = Date.now();
      
      expect(result1).toBe('data-1');
      expect(result2).toBe('data-2');
      expect(end - start).toBeLessThan(35); // Should be ~20ms, not 40ms
    });
  });

  // Test setTimeout and setInterval
  describe('Timers', () => {
    test('setTimeout should execute after specified delay', (done) => {
      const start = Date.now();
      
      setTimeout(() => {
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(45);
        done();
      }, 50);
    });

    test('clearTimeout should cancel timeout', (done) => {
      let executed = false;
      
      const timeoutId = setTimeout(() => {
        executed = true;
      }, 50);
      
      clearTimeout(timeoutId);
      
      setTimeout(() => {
        expect(executed).toBe(false);
        done();
      }, 100);
    });

    test('setInterval should execute repeatedly', (done) => {
      let count = 0;
      
      const intervalId = setInterval(() => {
        count++;
        if (count === 3) {
          clearInterval(intervalId);
          expect(count).toBe(3);
          done();
        }
      }, 20);
    });

    test('clearInterval should stop interval', (done) => {
      let count = 0;
      
      const intervalId = setInterval(() => {
        count++;
      }, 10);
      
      setTimeout(() => {
        clearInterval(intervalId);
        const finalCount = count;
        
        setTimeout(() => {
          expect(count).toBe(finalCount); // Should not have increased
          done();
        }, 30);
      }, 25);
    });
  });

  // Test Event Loop concepts
  describe('Event Loop', () => {
    test('microtasks should execute before macrotasks', (done) => {
      const order = [];
      
      setTimeout(() => {
        order.push('setTimeout');
        expect(order).toEqual(['promise', 'setTimeout']);
        done();
      }, 0);
      
      Promise.resolve().then(() => {
        order.push('promise');
      });
    });

    test('nested setTimeout should maintain order', (done) => {
      const order = [];
      
      setTimeout(() => {
        order.push('first');
        setTimeout(() => {
          order.push('nested');
          expect(order).toEqual(['first', 'second', 'nested']);
          done();
        }, 0);
      }, 0);
      
      setTimeout(() => {
        order.push('second');
      }, 0);
    });

    test('Promise.resolve should be faster than setTimeout', (done) => {
      const order = [];
      
      setTimeout(() => {
        order.push('timeout');
        expect(order).toEqual(['promise', 'timeout']);
        done();
      }, 0);
      
      Promise.resolve().then(() => {
        order.push('promise');
      });
    });
  });

  // Test fetch API (mocked)
  describe('Fetch API', () => {
    // Mock fetch for testing
    const mockFetch = (url, options = {}) => {
      if (url.includes('success')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'success' }),
          text: () => Promise.resolve('success text')
        });
      } else if (url.includes('error')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Not found' }),
          text: () => Promise.resolve('Not found')
        });
      } else if (url.includes('network-error')) {
        return Promise.reject(new Error('Network error'));
      }
    };

    // Replace global fetch with mock
    const originalFetch = global.fetch;
    beforeAll(() => {
      global.fetch = mockFetch;
    });
    afterAll(() => {
      global.fetch = originalFetch;
    });

    test('fetch should handle successful response', async () => {
      const response = await fetch('/api/success');
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toEqual({ data: 'success' });
    });

    test('fetch should handle error response', async () => {
      const response = await fetch('/api/error');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data).toEqual({ error: 'Not found' });
    });

    test('fetch should handle network errors', async () => {
      await expect(fetch('/api/network-error')).rejects.toThrow('Network error');
    });

    test('fetch with async/await error handling', async () => {
      try {
        const response = await fetch('/api/error');
        if (!response.ok) {
          const errorData = await response.json();
          expect(errorData.error).toBe('Not found');
        }
      } catch (error) {
        // This shouldn't execute for HTTP errors, only network errors
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  // Test async patterns
  describe('Async Patterns', () => {
    test('async forEach should not work as expected', async () => {
      const numbers = [1, 2, 3];
      const results = [];
      
      // This won't work as expected because forEach doesn't wait
      numbers.forEach(async (num) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        results.push(num * 2);
      });
      
      // Results array will be empty immediately
      expect(results).toEqual([]);
    });

    test('for...of loop should work with async/await', async () => {
      const numbers = [1, 2, 3];
      const results = [];
      
      for (const num of numbers) {
        await new Promise(resolve => setTimeout(resolve, 10));
        results.push(num * 2);
      }
      
      expect(results).toEqual([2, 4, 6]);
    });

    test('Promise.all should handle concurrent async operations', async () => {
      async function processNumber(num) {
        await new Promise(resolve => setTimeout(resolve, 10));
        return num * 2;
      }
      
      const numbers = [1, 2, 3];
      const results = await Promise.all(numbers.map(processNumber));
      
      expect(results).toEqual([2, 4, 6]);
    });

    test('async/await with map should create Promise array', async () => {
      async function processNumber(num) {
        await new Promise(resolve => setTimeout(resolve, 10));
        return num * 2;
      }
      
      const numbers = [1, 2, 3];
      const promises = numbers.map(processNumber);
      
      // Map creates an array of Promises
      expect(promises[0]).toBeInstanceOf(Promise);
      
      const results = await Promise.all(promises);
      expect(results).toEqual([2, 4, 6]);
    });
  });

  // Test error handling in async code
  describe('Async Error Handling', () => {
    test('unhandled promise rejection should be catchable', async () => {
      const promise = Promise.reject(new Error('unhandled'));
      
      await expect(promise).rejects.toThrow('unhandled');
    });

    test('async function should propagate errors', async () => {
      async function throwingFunction() {
        throw new Error('async error');
      }
      
      async function callingFunction() {
        return await throwingFunction();
      }
      
      await expect(callingFunction()).rejects.toThrow('async error');
    });

    test('mixed sync and async errors should be handled differently', async () => {
      function syncError() {
        throw new Error('sync error');
      }
      
      async function asyncError() {
        throw new Error('async error');
      }
      
      // Sync error
      expect(() => syncError()).toThrow('sync error');
      
      // Async error
      await expect(asyncError()).rejects.toThrow('async error');
    });
  });
});