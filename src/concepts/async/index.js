// File: src/concepts/async/index.js
// Asynchronous JavaScript - Callbacks, Promises, Async/Await, and Event Loop

export const asyncConfig = {
  title: "Asynchronous JavaScript",
  description: "Master asynchronous programming patterns and concepts",
  difficulty: "intermediate",
  estimatedTime: "60 minutes",
  topics: [
    "Understanding the Event Loop",
    "Callbacks and Callback Hell",
    "Promises and Promise Chaining",
    "Async/Await Syntax",
    "Error Handling in Async Code",
    "Parallel vs Sequential Execution"
  ]
};

// Event Loop and Asynchronous Basics
export const eventLoop = {
  concept: "Event Loop and Asynchronous Basics",
  explanation: `
    JavaScript is single-threaded but can handle asynchronous operations through the event loop.
    Understanding how the event loop works is crucial for mastering async programming.
  `,
  
  examples: {
    eventLoopBasics: `
// Understanding synchronous vs asynchronous execution
console.log('1. First - Synchronous');

setTimeout(() => {
  console.log('2. Third - Asynchronous (after 0ms)');
}, 0);

console.log('3. Second - Synchronous');

// Output order: 1, 3, 2
// Even with 0ms delay, setTimeout is asynchronous

// Call stack demonstration
function first() {
  console.log('Inside first function');
  second();
  console.log('Back in first function');
}

function second() {
  console.log('Inside second function');
  third();
  console.log('Back in second function');
}

function third() {
  console.log('Inside third function');
}

first();
// Call stack: first -> second -> third -> second -> first

// Event loop phases
console.log('=== Event Loop Demo ===');

// 1. Call stack (immediate)
console.log('Synchronous 1');

// 2. Timer queue (macrotask)
setTimeout(() => console.log('setTimeout 1'), 0);

// 3. Microtask queue (higher priority)
Promise.resolve().then(() => console.log('Promise 1'));

// 4. More synchronous code
console.log('Synchronous 2');

// 5. More microtasks
Promise.resolve().then(() => console.log('Promise 2'));

// 6. More macrotasks
setTimeout(() => console.log('setTimeout 2'), 0);

// Output: Synchronous 1, Synchronous 2, Promise 1, Promise 2, setTimeout 1, setTimeout 2
    `,
    
    taskQueues: `
// Understanding different task queues
console.log('=== Task Queue Priority Demo ===');

// Synchronous code (immediate execution)
console.log('Start');

// Macrotasks (Timer queue)
setTimeout(() => console.log('setTimeout 0ms'), 0);
setTimeout(() => console.log('setTimeout 10ms'), 10);

// Microtasks (Job queue) - Higher priority than macrotasks
Promise.resolve().then(() => {
  console.log('Promise then 1');
  return Promise.resolve();
}).then(() => {
  console.log('Promise then 2');
});

// queueMicrotask (same as Promise.resolve().then())
queueMicrotask(() => console.log('queueMicrotask'));

// More synchronous code
console.log('End');

// Expected output:
// Start
// End
// Promise then 1
// queueMicrotask
// Promise then 2
// setTimeout 0ms
// setTimeout 10ms

// Demonstrating microtask priority
function demonstratePriority() {
  setTimeout(() => console.log('Timeout 1'), 0);
  
  Promise.resolve().then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('Timeout 2'), 0);
    return Promise.resolve();
  }).then(() => {
    console.log('Promise 2');
  });
  
  setTimeout(() => console.log('Timeout 3'), 0);
}

demonstratePriority();
// Output: Promise 1, Promise 2, Timeout 1, Timeout 3, Timeout 2
    `,
    
    webApis: `
// Web APIs and asynchronous operations
// These operations are handled by the browser, not JavaScript engine

// DOM Events
document.addEventListener('click', () => {
  console.log('DOM Event - goes to task queue');
});

// HTTP Requests
fetch('https://api.example.com/data')
  .then(response => console.log('Fetch response - microtask'))
  .catch(error => console.log('Fetch error - microtask'));

// File API (if in browser with file input)
function handleFileRead(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    console.log('File read complete - task queue');
  };
  reader.readAsText(file);
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
  console.log('Intersection observed - task queue');
});

// Animation frames
function animate() {
  console.log('Animation frame');
  requestAnimationFrame(animate);
}
// requestAnimationFrame(animate);

// Performance timing
performance.mark('start');
setTimeout(() => {
  performance.mark('end');
  performance.measure('duration', 'start', 'end');
  console.log('Performance measure complete');
}, 100);
    `
  }
};

// Callbacks and Callback Hell
export const callbacks = {
  concept: "Callbacks and Callback Hell",
  explanation: `
    Callbacks are functions passed as arguments to other functions.
    While useful for async operations, they can lead to "callback hell" - nested callbacks that are hard to read and maintain.
  `,
  
  examples: {
    basicCallbacks: `
// Basic callback pattern
function fetchUserData(userId, callback) {
  // Simulate async operation
  setTimeout(() => {
    const userData = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com'
    };
    callback(null, userData); // Error-first callback pattern
  }, 1000);
}

// Using the callback
fetchUserData(123, (error, user) => {
  if (error) {
    console.error('Error fetching user:', error);
    return;
  }
  console.log('User data:', user);
});

// Higher-order function with callback
function processArray(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = processArray(numbers, (num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Error-first callback pattern (Node.js style)
function readFileAsync(filename, callback) {
  setTimeout(() => {
    if (filename.includes('.txt')) {
      callback(null, 'File content here');
    } else {
      callback(new Error('Invalid file type'));
    }
  }, 500);
}

readFileAsync('document.txt', (err, content) => {
  if (err) {
    console.error('File read error:', err.message);
    return;
  }
  console.log('File content:', content);
});
    `,
    
    callbackHell: `
// Callback Hell - The Pyramid of Doom
function fetchUser(userId, callback) {
  setTimeout(() => {
    console.log('Fetching user...');
    callback(null, { id: userId, name: 'John Doe' });
  }, 1000);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    console.log('Fetching posts...');
    callback(null, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);
  }, 800);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    console.log('Fetching comments...');
    callback(null, [{ id: 1, text: 'Great post!' }]);
  }, 600);
}

function fetchUserProfile(userId, callback) {
  setTimeout(() => {
    console.log('Fetching profile...');
    callback(null, { avatar: 'avatar.jpg', bio: 'Software developer' });
  }, 400);
}

// The dreaded callback hell
fetchUser(123, (err, user) => {
  if (err) {
    console.error(err);
    return;
  }
  
  fetchUserPosts(user.id, (err, posts) => {
    if (err) {
      console.error(err);
      return;
    }
    
    fetchPostComments(posts[0].id, (err, comments) => {
      if (err) {
        console.error(err);
        return;
      }
      
      fetchUserProfile(user.id, (err, profile) => {
        if (err) {
          console.error(err);
          return;
        }
        
        // Finally, we have all the data
        console.log('Complete user data:', {
          user,
          posts,
          comments,
          profile
        });
      });
    });
  });
});

// Problems with callback hell:
// 1. Hard to read and understand
// 2. Difficult to handle errors consistently
// 3. Hard to add new async operations
// 4. Testing becomes complex
// 5. No easy way to handle parallel operations
    `,
    
    callbackSolutions: `
// Solutions to callback hell

// 1. Named functions (avoid anonymous callbacks)
function handleUser(err, user) {
  if (err) {
    console.error('User error:', err);
    return;
  }
  fetchUserPosts(user.id, handlePosts);
}

function handlePosts(err, posts) {
  if (err) {
    console.error('Posts error:', err);
    return;
  }
  console.log('Posts:', posts);
  // Continue with next operation...
}

fetchUser(123, handleUser);

// 2. Modularization
const UserService = {
  async getCompleteUserData(userId) {
    return new Promise((resolve, reject) => {
      this.getUser(userId, (err, user) => {
        if (err) return reject(err);
        
        this.getUserPosts(userId, (err, posts) => {
          if (err) return reject(err);
          
          this.getUserProfile(userId, (err, profile) => {
            if (err) return reject(err);
            
            resolve({ user, posts, profile });
          });
        });
      });
    });
  },
  
  getUser(userId, callback) {
    setTimeout(() => callback(null, { id: userId, name: 'John' }), 100);
  },
  
  getUserPosts(userId, callback) {
    setTimeout(() => callback(null, [{ id: 1, title: 'Post' }]), 100);
  },
  
  getUserProfile(userId, callback) {
    setTimeout(() => callback(null, { avatar: 'avatar.jpg' }), 100);
  }
};

// 3. Control flow libraries (like async.js)
// Simulating async.js waterfall pattern
function waterfall(tasks, finalCallback) {
  let currentIndex = 0;
  
  function executeNext(...args) {
    if (currentIndex >= tasks.length) {
      return finalCallback(null, ...args);
    }
    
    const currentTask = tasks[currentIndex++];
    const callback = (err, ...results) => {
      if (err) return finalCallback(err);
      executeNext(...results);
    };
    
    if (currentIndex === 1) {
      currentTask(callback);
    } else {
      currentTask(...args, callback);
    }
  }
  
  executeNext();
}

// Usage
waterfall([
  (callback) => {
    fetchUser(123, callback);
  },
  (user, callback) => {
    fetchUserPosts(user.id, (err, posts) => {
      callback(err, user, posts);
    });
  },
  (user, posts, callback) => {
    fetchUserProfile(user.id, (err, profile) => {
      callback(err, { user, posts, profile });
    });
  }
], (err, result) => {
  if (err) {
    console.error('Waterfall error:', err);
    return;
  }
  console.log('Waterfall result:', result);
});
    `
  }
};

// Promises
export const promises = {
  concept: "Promises",
  explanation: `
    Promises represent the eventual completion or failure of an asynchronous operation.
    They provide a cleaner alternative to callbacks and enable better error handling.
  `,
  
  examples: {
    promiseBasics: `
// Creating promises
const simplePromise = new Promise((resolve, reject) => {
  const success = true;
  
  setTimeout(() => {
    if (success) {
      resolve('Promise resolved successfully!');
    } else {
      reject(new Error('Promise rejected'));
    }
  }, 1000);
});

// Consuming promises
simplePromise
  .then(result => {
    console.log('Success:', result);
    return 'Modified result';
  })
  .then(modifiedResult => {
    console.log('Modified:', modifiedResult);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Promise completed');
  });

// Promise states
console.log('Promise state examples:');

// Pending
const pendingPromise = new Promise(() => {
  // Never resolves or rejects
});
console.log('Pending promise created');

// Resolved
const resolvedPromise = Promise.resolve('Immediately resolved');
resolvedPromise.then(value => console.log('Resolved:', value));

// Rejected
const rejectedPromise = Promise.reject(new Error('Immediately rejected'));
rejectedPromise.catch(error => console.log('Rejected:', error.message));

// Promise constructor patterns
function createDelayedPromise(value, delay, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(\`Failed after \${delay}ms\`));
      } else {
        resolve(\`\${value} after \${delay}ms\`);
      }
    }, delay);
  });
}

// Usage
createDelayedPromise('Success', 500)
  .then(result => console.log(result))
  .catch(error => console.error(error.message));
    `,
    
    promiseChaining: `
// Promise chaining - solving callback hell
function fetchUserPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: 'John Doe' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 500);
  });
}

function fetchUserPostsPromise(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Post 1', userId },
        { id: 2, title: 'Post 2', userId }
      ]);
    }, 300);
  });
}

function fetchPostCommentsPromise(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'Great post!', postId },
        { id: 2, text: 'Thanks for sharing!', postId }
      ]);
    }, 200);
  });
}

// Clean promise chaining (no callback hell!)
fetchUserPromise(123)
  .then(user => {
    console.log('User:', user);
    return fetchUserPostsPromise(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return fetchPostCommentsPromise(posts[0].id);
  })
  .then(comments => {
    console.log('Comments:', comments);
    return 'All data fetched successfully';
  })
  .then(finalMessage => {
    console.log(finalMessage);
  })
  .catch(error => {
    console.error('Chain error:', error.message);
  });

// Returning promises vs values in then()
Promise.resolve(1)
  .then(value => {
    console.log('Value 1:', value);
    return value + 1; // Returning a value
  })
  .then(value => {
    console.log('Value 2:', value);
    return Promise.resolve(value + 1); // Returning a promise
  })
  .then(value => {
    console.log('Value 3:', value);
    // Returning a delayed promise
    return new Promise(resolve => {
      setTimeout(() => resolve(value + 1), 500);
    });
  })
  .then(value => {
    console.log('Final value:', value);
  });

// Error propagation in chains
Promise.resolve('start')
  .then(value => {
    console.log('Step 1:', value);
    throw new Error('Something went wrong!');
  })
  .then(value => {
    // This won't execute due to the error above
    console.log('Step 2:', value);
    return value.toUpperCase();
  })
  .catch(error => {
    console.error('Caught error:', error.message);
    return 'recovered'; // Recovery from error
  })
  .then(value => {
    console.log('After recovery:', value);
  });
    `,
    
    promiseUtilities: `
// Promise utility methods

// Promise.all - Wait for all promises to resolve
const promise1 = createDelayedPromise('First', 1000);
const promise2 = createDelayedPromise('Second', 500);
const promise3 = createDelayedPromise('Third', 800);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log('All results:', results); // ['First after 1000ms', 'Second after 500ms', 'Third after 800ms']
  })
  .catch(error => {
    console.error('One of the promises failed:', error);
  });

// Promise.allSettled - Wait for all promises to settle (resolve or reject)
const mixedPromises = [
  Promise.resolve('Success 1'),
  Promise.reject(new Error('Error 1')),
  Promise.resolve('Success 2'),
  createDelayedPromise('Delayed success', 300)
];

Promise.allSettled(mixedPromises)
  .then(results => {
    console.log('All settled results:');
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(\`Promise \${index}: Fulfilled with \${result.value}\`);
      } else {
        console.log(\`Promise \${index}: Rejected with \${result.reason.message}\`);
      }
    });
  });

// Promise.race - First promise to settle wins
const racePromises = [
  createDelayedPromise('Slow', 2000),
  createDelayedPromise('Fast', 500),
  createDelayedPromise('Medium', 1000)
];

Promise.race(racePromises)
  .then(result => {
    console.log('Race winner:', result); // 'Fast after 500ms'
  })
  .catch(error => {
    console.error('Race error:', error);
  });

// Promise.any - First promise to fulfill wins (ignores rejections)
const anyPromises = [
  Promise.reject(new Error('Fast rejection')),
  createDelayedPromise('Slower success', 1000),
  createDelayedPromise('Fast success', 200)
];

Promise.any(anyPromises)
  .then(result => {
    console.log('Any winner:', result); // 'Fast success after 200ms'
  })
  .catch(error => {
    console.error('All promises rejected:', error);
  });

// Custom promise utilities
function promiseTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(\`Promise timed out after \${timeoutMs}ms\`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage
promiseTimeout(createDelayedPromise('Slow operation', 2000), 1500)
  .then(result => console.log('Timeout result:', result))
  .catch(error => console.error('Timeout error:', error.message));

// Retry utility
function retryPromise(promiseFactory, maxRetries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      promiseFactory()
        .then(resolve)
        .catch(error => {
          if (attempts >= maxRetries) {
            reject(error);
          } else {
            console.log(\`Attempt \${attempts} failed, retrying in \${delay}ms...\`);
            setTimeout(attempt, delay);
          }
        });
    }
    
    attempt();
  });
}

// Usage
retryPromise(
  () => createDelayedPromise('Unreliable operation', 100, Math.random() > 0.7),
  3,
  500
)
  .then(result => console.log('Retry success:', result))
  .catch(error => console.error('All retries failed:', error));

// Sequential execution
function executeSequentially(promiseFactories) {
  return promiseFactories.reduce((chain, promiseFactory) => {
    return chain.then(results => {
      return promiseFactory().then(result => [...results, result]);
    });
  }, Promise.resolve([]));
}

const sequentialTasks = [
  () => createDelayedPromise('Task 1', 300),
  () => createDelayedPromise('Task 2', 200),
  () => createDelayedPromise('Task 3', 400)
];

executeSequentially(sequentialTasks)
  .then(results => console.log('Sequential results:', results));
    `
  }
};

// Async/Await
export const asyncAwait = {
  concept: "Async/Await",
  explanation: `
    Async/await is syntactic sugar over promises that makes asynchronous code look and behave more like synchronous code.
    It provides a cleaner way to handle promises without chaining.
  `,
  
  examples: {
    basicAsyncAwait: `
// Converting promise chains to async/await
async function fetchCompleteUserData(userId) {
  try {
    console.log('Starting to fetch user data...');
    
    // Each await pauses execution until the promise resolves
    const user = await fetchUserPromise(userId);
    console.log('User fetched:', user);
    
    const posts = await fetchUserPostsPromise(user.id);
    console.log('Posts fetched:', posts);
    
    const comments = await fetchPostCommentsPromise(posts[0].id);
    console.log('Comments fetched:', comments);
    
    // Return the complete data
    return {
      user,
      posts,
      comments
    };
    
  } catch (error) {
    console.error('Error in fetchCompleteUserData:', error.message);
    throw error; // Re-throw to allow caller to handle
  }
}

// Using the async function
async function main() {
  try {
    const userData = await fetchCompleteUserData(123);
    console.log('Complete user data:', userData);
  } catch (error) {
    console.error('Failed to get user data:', error.message);
  }
}

main();

// Async functions always return promises
async function simpleAsyncFunction() {
  return 'Hello from async function';
}

// These are equivalent:
simpleAsyncFunction().then(result => console.log(result));

(async () => {
  const result = await simpleAsyncFunction();
  console.log(result);
})();

// Async function variations
const asyncArrowFunction = async () => {
  return await Promise.resolve('Arrow function result');
};

const asyncMethodObject = {
  async getData() {
    return await Promise.resolve('Object method result');
  }
};

class AsyncClass {
  async fetchData() {
    return await Promise.resolve('Class method result');
  }
  
  static async staticMethod() {
    return await Promise.resolve('Static method result');
  }
}
    `,
    
    errorHandling: `
// Error handling with async/await
async function robustAsyncFunction() {
  try {
    // Multiple await calls with different error handling strategies
    
    // Basic try-catch
    const result1 = await riskyOperation('operation1');
    console.log('Result 1:', result1);
    
    // Handling specific errors
    let result2;
    try {
      result2 = await riskyOperation('operation2');
    } catch (error) {
      if (error.message.includes('timeout')) {
        console.log('Timeout error, using default value');
        result2 = 'default_value';
      } else {
        throw error; // Re-throw non-timeout errors
      }
    }
    
    console.log('Result 2:', result2);
    
    return { result1, result2 };
    
  } catch (error) {
    console.error('Unhandled error:', error.message);
    
    // Log additional context
    console.error('Stack trace:', error.stack);
    
    // Return a safe fallback or re-throw
    throw new Error(\`Failed in robustAsyncFunction: \${error.message}\`);
  }
}

function riskyOperation(operation) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(\`\${operation} succeeded\`);
      } else {
        reject(new Error(\`\${operation} failed\`));
      }
    }, 100);
  });
}

// Multiple error handling patterns
async function errorHandlingPatterns() {
  // Pattern 1: Try-catch for each operation
  try {
    const result1 = await riskyOperation('op1');
    try {
      const result2 = await riskyOperation('op2');
      return [result1, result2];
    } catch (error2) {
      console.error('Operation 2 failed:', error2.message);
      return [result1, null];
    }
  } catch (error1) {
    console.error('Operation 1 failed:', error1.message);
    return [null, null];
  }
}

// Pattern 2: Promise.catch() for individual promises
async function promiseCatchPattern() {
  const result1 = await riskyOperation('op1').catch(err => {
    console.error('Op1 failed:', err.message);
    return 'fallback1';
  });
  
  const result2 = await riskyOperation('op2').catch(err => {
    console.error('Op2 failed:', err.message);
    return 'fallback2';
  });
  
  return [result1, result2];
}

// Pattern 3: Error wrapper utility
function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(error => [error, null]);
}

async function errorWrapperPattern() {
  const [error1, result1] = await to(riskyOperation('op1'));
  if (error1) {
    console.error('Op1 failed:', error1.message);
    return null;
  }
  
  const [error2, result2] = await to(riskyOperation('op2'));
  if (error2) {
    console.error('Op2 failed:', error2.message);
    return result1;
  }
  
  return [result1, result2];
}
    `,
    
    parallelExecution: `
// Parallel execution with async/await
async function parallelVsSequential() {
  console.log('=== Sequential Execution ===');
  const sequentialStart = performance.now();
  
  // Sequential - waits for each operation to complete
  const seq1 = await createDelayedPromise('Sequential 1', 500);
  const seq2 = await createDelayedPromise('Sequential 2', 500);
  const seq3 = await createDelayedPromise('Sequential 3', 500);
  
  const sequentialTime = performance.now() - sequentialStart;
  console.log('Sequential results:', [seq1, seq2, seq3]);
  console.log('Sequential time:', sequentialTime, 'ms');
  
  console.log('=== Parallel Execution ===');
  const parallelStart = performance.now();
  
  // Parallel - all operations start at the same time
  const [par1, par2, par3] = await Promise.all([
    createDelayedPromise('Parallel 1', 500),
    createDelayedPromise('Parallel 2', 500),
    createDelayedPromise('Parallel 3', 500)
  ]);
  
  const parallelTime = performance.now() - parallelStart;
  console.log('Parallel results:', [par1, par2, par3]);
  console.log('Parallel time:', parallelTime, 'ms');
}

// Mixed parallel and sequential patterns
async function mixedExecutionPattern() {
  // Start parallel operations
  const userPromise = fetchUserPromise(123);
  const settingsPromise = fetchUserSettings(123);
  
  // Wait for both user and settings in parallel
  const [user, settings] = await Promise.all([userPromise, settingsPromise]);
  
  // Now fetch posts sequentially (depends on user data)
  const posts = await fetchUserPostsPromise(user.id);
  
  // Fetch comments for all posts in parallel
  const commentPromises = posts.map(post => fetchPostCommentsPromise(post.id));
  const allComments = await Promise.all(commentPromises);
  
  return {
    user,
    settings,
    posts,
    comments: allComments
  };
}

function fetchUserSettings(userId) {
  return createDelayedPromise({ theme: 'dark', notifications: true }, 300);
}

// Batch processing with controlled concurrency
async function processBatchWithLimit(items, processor, limit = 3) {
  const results = [];
  
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchPromises = batch.map(item => processor(item));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    console.log(\`Processed batch \${Math.floor(i / limit) + 1}\`);
  }
  
  return results;
}

// Usage
async function batchExample() {
  const items = Array.from({ length: 10 }, (_, i) => \`item-\${i + 1}\`);
  
  const processItem = async (item) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return \`processed-\${item}\`;
  };
  
  const results = await processBatchWithLimit(items, processItem, 3);
  console.log('Batch results:', results);
}
    `,
    
    advancedPatterns: `
// Advanced async/await patterns

// 1. Async iteration
async function* asyncGenerator() {
  for (let i = 1; i <= 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    yield \`Value \${i}\`;
  }
}

async function useAsyncGenerator() {
  console.log('=== Async Generator ===');
  for await (const value of asyncGenerator()) {
    console.log('Generated:', value);
  }
}

// 2. Async pipeline
const asyncPipe = (...functions) => (input) => {
  return functions.reduce(async (result, func) => {
    const resolvedResult = await result;
    return func(resolvedResult);
  }, Promise.resolve(input));
};

const addAsync = async (x) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return x + 10;
};

const multiplyAsync = async (x) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return x * 2;
};

const squareAsync = async (x) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return x * x;
};

async function pipelineExample() {
  const pipeline = asyncPipe(addAsync, multiplyAsync, squareAsync);
  const result = await pipeline(5);
  console.log('Pipeline result:', result); // ((5 + 10) * 2)² = 900
}

// 3. Async memoization
function asyncMemoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  
  return async function(...args) {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      console.log('Cache hit for:', key);
      return cache.get(key);
    }
    
    console.log('Cache miss for:', key);
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveAsyncOperation = async (n) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return n * n;
};

const memoizedOperation = asyncMemoize(expensiveAsyncOperation);

async function memoizationExample() {
  console.log('First call:', await memoizedOperation(5));  // Cache miss, slow
  console.log('Second call:', await memoizedOperation(5)); // Cache hit, fast
  console.log('Third call:', await memoizedOperation(3));  // Cache miss, slow
  console.log('Fourth call:', await memoizedOperation(5)); // Cache hit, fast
}

// 4. Race with timeout
async function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

async function timeoutExample() {
  try {
    const result = await withTimeout(
      createDelayedPromise('Slow operation', 2000),
      1500
    );
    console.log('Timeout result:', result);
  } catch (error) {
    console.error('Timeout error:', error.message);
  }
}

// 5. Async constructor pattern
class AsyncDataLoader {
  constructor(config) {
    this.config = config;
    this.initPromise = this.init();
  }
  
  async init() {
    console.log('Initializing async data loader...');
    this.connection = await this.establishConnection();
    this.cache = await this.loadInitialCache();
    console.log('Data loader initialized');
    return this;
  }
  
  async establishConnection() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { connected: true, host: this.config.host };
  }
  
  async loadInitialCache() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return new Map([['key1', 'value1'], ['key2', 'value2']]);
  }
  
  async getData(key) {
    await this.initPromise; // Wait for initialization
    return this.cache.get(key) || null;
  }
  
  static async create(config) {
    const instance = new AsyncDataLoader(config);
    await instance.initPromise;
    return instance;
  }
}

async function asyncConstructorExample() {
  // Method 1: Manual initialization wait
  const loader1 = new AsyncDataLoader({ host: 'localhost' });
  await loader1.initPromise;
  console.log('Data 1:', await loader1.getData('key1'));
  
  // Method 2: Static factory method
  const loader2 = await AsyncDataLoader.create({ host: 'localhost' });
  console.log('Data 2:', await loader2.getData('key2'));
}

// Running all examples
async function runAllExamples() {
  await useAsyncGenerator();
  await pipelineExample();
  await memoizationExample();
  await timeoutExample();
  await asyncConstructorExample();
  await parallelVsSequential();
  await batchExample();
}

// runAllExamples();
    `
  }
};

// Practical Async Patterns
export const practicalPatterns = {
  concept: "Practical Async Patterns",
  explanation: `
    Real-world patterns and best practices for handling asynchronous operations in applications.
  `,
  
  examples: {
    apiIntegration: `
// API integration patterns
class ApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      ...options
    };
  }
  
  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config = { ...this.defaultOptions, ...options };
    
    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.log(\`Attempt \${attempt} failed:\`, error.message);
        
        if (attempt === config.retries) {
          throw error;
        }
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }
  }
  
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? \`\${endpoint}?\${query}\` : endpoint;
    return this.request(url, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Usage
const api = new ApiClient('https://jsonplaceholder.typicode.com');

async function apiExample() {
  try {
    // GET request
    const posts = await api.get('/posts', { _limit: 5 });
    console.log('Posts:', posts);
    
    // POST request
    const newPost = await api.post('/posts', {
      title: 'New Post',
      body: 'This is a new post',
      userId: 1
    });
    console.log('Created post:', newPost);
    
    // Concurrent requests
    const [users, albums] = await Promise.all([
      api.get('/users'),
      api.get('/albums', { _limit: 3 })
    ]);
    console.log('Users:', users.length, 'Albums:', albums.length);
    
  } catch (error) {
    console.error('API Error:', error.message);
  }
}
    `,
    
    dataProcessing: `
// Data processing pipelines
class DataProcessor {
  constructor() {
    this.pipeline = [];
  }
  
  addStep(name, processor) {
    this.pipeline.push({ name, processor });
    return this;
  }
  
  async process(data) {
    let result = data;
    
    for (const step of this.pipeline) {
      console.log(\`Processing step: \${step.name}\`);
      const stepStart = performance.now();
      
      try {
        result = await step.processor(result);
        const stepTime = performance.now() - stepStart;
        console.log(\`Step \${step.name} completed in \${stepTime.toFixed(2)}ms\`);
      } catch (error) {
        console.error(\`Step \${step.name} failed:\`, error.message);
        throw error;
      }
    }
    
    return result;
  }
}

// Processing steps
const validateData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  return data.filter(item => item !== null && item !== undefined);
};

const transformData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
};

const enrichData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  // Simulate API calls to enrich data
  const enrichedData = await Promise.all(
    data.map(async (item, index) => {
      // Simulate async enrichment
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        ...item,
        enriched: true,
        index
      };
    })
  );
  return enrichedData;
};

const saveData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(\`Saving \${data.length} items to database\`);
  return { saved: true, count: data.length };
};

// Usage
async function dataProcessingExample() {
  const processor = new DataProcessor()
    .addStep('validate', validateData)
    .addStep('transform', transformData)
    .addStep('enrich', enrichData)
    .addStep('save', saveData);
  
  const rawData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    null,
    { id: 3, name: 'Item 3' }
  ];
  
  try {
    const result = await processor.process(rawData);
    console.log('Processing completed:', result);
  } catch (error) {
    console.error('Processing failed:', error.message);
  }
}
    `,
    
    realTimeData: `
// Real-time data handling patterns
class RealTimeDataHandler {
  constructor() {
    this.subscribers = new Set();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  async connect() {
    if (this.isConnected) return;
    
    try {
      console.log('Connecting to real-time data source...');
      
      // Simulate connection setup
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) { // 70% success rate
            resolve();
          } else {
            reject(new Error('Connection failed'));
          }
        }, 1000);
      });
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('Connected to real-time data source');
      
      // Start receiving data
      this.startDataStream();
      
    } catch (error) {
      console.error('Connection failed:', error.message);
      await this.handleReconnect();
    }
  }
  
  async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(\`Reconnecting in \${delay}ms (attempt \${this.reconnectAttempts})\`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    await this.connect();
  }
  
  startDataStream() {
    const sendData = () => {
      if (!this.isConnected) return;
      
      // Simulate incoming data
      const data = {
        timestamp: Date.now(),
        value: Math.random() * 100,
        id: Math.floor(Math.random() * 1000)
      };
      
      // Notify all subscribers
      this.subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Subscriber error:', error);
        }
      });
      
      // Random connection drops for testing
      if (Math.random() < 0.05) { // 5% chance of disconnection
        this.disconnect();
        this.handleReconnect();
        return;
      }
      
      // Continue streaming
      setTimeout(sendData, 1000 + Math.random() * 2000);
    };
    
    sendData();
  }
  
  disconnect() {
    this.isConnected = false;
    console.log('Disconnected from real-time data source');
  }
}

// Usage
async function realTimeExample() {
  const dataHandler = new RealTimeDataHandler();
  
  // Subscribe to data updates
  const unsubscribe1 = dataHandler.subscribe((data) => {
    console.log('Subscriber 1 received:', data);
  });
  
  const unsubscribe2 = dataHandler.subscribe((data) => {
    console.log('Subscriber 2 processed value:', data.value.toFixed(2));
  });
  
  // Connect to data source
  await dataHandler.connect();
  
  // Unsubscribe after 10 seconds
  setTimeout(() => {
    unsubscribe1();
    console.log('Subscriber 1 unsubscribed');
  }, 10000);
  
  // Disconnect after 15 seconds
  setTimeout(() => {
    dataHandler.disconnect();
    unsubscribe2();
  }, 15000);
}

// WebSocket wrapper example
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.messageQueue = [];
    this.eventHandlers = new Map();
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.flushMessageQueue();
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.handleReconnection();
      };
    });
  }
  
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }
  
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }
  
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }
  
  handleMessage(data) {
    const handlers = this.eventHandlers.get(data.type);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      this.send(this.messageQueue.shift());
    }
  }
  
  async handleReconnection() {
    // Implement reconnection logic similar to RealTimeDataHandler
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await this.connect();
    } catch (error) {
      console.error('Reconnection failed:', error);
    }
  }
}
    `
  }
};

// Interactive exercises
export const interactiveExercises = [
  {
    id: "promise_chain_conversion",
    title: "Convert Callbacks to Promises",
    description: "Convert callback-based code to promise-based code",
    template: `
// Convert this callback-based function to return a promise
function getUserData(userId, callback) {
  setTimeout(() => {
    if (userId > 0) {
      callback(null, { id: userId, name: 'User ' + userId });
    } else {
      callback(new Error('Invalid user ID'));
    }
  }, 500);
}

// Your promise-based version here:
function getUserDataPromise(userId) {
  // Your code here
}

// Test your implementation
getUserDataPromise(123)
  .then(user => console.log('User:', user))
  .catch(error => console.error('Error:', error.message));
    `,
    tests: [
      {
        description: "Should return a promise",
        check: (code, fn) => fn && typeof fn(1).then === 'function'
      }
    ]
  },
  
  {
    id: "async_await_practice",
    title: "Async/Await Implementation",
    description: "Implement async/await patterns for multiple operations",
    template: `
// Implement an async function that:
// 1. Fetches user data
// 2. Fetches user posts (parallel with user settings)
// 3. Fetches user settings
// 4. Returns combined data

async function fetchCompleteProfile(userId) {
  // Your implementation here
  
}

// Test functions (simulate API calls)
function fetchUser(id) {
  return Promise.resolve({ id, name: \`User \${id}\` });
}

function fetchPosts(userId) {
  return Promise.resolve([{ id: 1, title: 'Post 1', userId }]);
}

function fetchSettings(userId) {
  return Promise.resolve({ theme: 'dark', notifications: true });
}
    `,
    tests: [
      {
        description: "Should be an async function",
        check: (code) => code.includes('async') && code.includes('await')
      }
    ]
  }
];

// Progress tracking
export const progressConfig = {
  totalConcepts: 4,
  conceptsCompleted: 0,
  exercises: {
    total: 8,
    completed: 0
  },
  
  updateProgress(conceptId, exerciseId = null) {
    if (exerciseId) {
      this.exercises.completed++;
    } else {
      this.conceptsCompleted++;
    }
    
    return {
      conceptProgress: (this.conceptsCompleted / this.totalConcepts) * 100,
      exerciseProgress: (this.exercises.completed / this.exercises.total) * 100,
      overallProgress: ((this.conceptsCompleted + this.exercises.completed) / (this.totalConcepts + this.exercises.total)) * 100
    };
  }
};

// Export all concepts
export default {
  config: asyncConfig,
  concepts: {
    eventLoop,
    callbacks,
    promises,
    asyncAwait,
    practicalPatterns
  },
  exercises: interactiveExercises,
  progress: progressConfig
};