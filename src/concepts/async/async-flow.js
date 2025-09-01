// File: src/concepts/async/async-flow.js
// Async Flow Control - Advanced patterns for managing asynchronous operations

export const asyncFlowConfig = {
  title: "Async Flow Control",
  description: "Master advanced patterns for controlling asynchronous execution flow",
  difficulty: "advanced",
  estimatedTime: "45 minutes"
};

// Sequential Execution Patterns
export const sequentialPatterns = {
  concept: "Sequential Execution Patterns",
  explanation: `
    Sequential execution ensures operations run one after another.
    Useful when later operations depend on results from earlier ones.
  `,
  
  examples: {
    basicSequential: `
// Basic sequential execution with async/await
async function processDataSequentially(items) {
  const results = [];
  
  for (const item of items) {
    console.log(\`Processing \${item}...\`);
    const result = await processItem(item);
    results.push(result);
    console.log(\`Completed \${item}: \${result}\`);
  }
  
  return results;
}

async function processItem(item) {
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  return \`processed-\${item}\`;
}

// Sequential with error handling
async function robustSequentialProcessing(items) {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < items.length; i++) {
    try {
      console.log(\`Step \${i + 1}: Processing \${items[i]}\`);
      const result = await processItem(items[i]);
      results.push({ index: i, item: items[i], result, status: 'success' });
    } catch (error) {
      console.error(\`Step \${i + 1} failed:\`, error.message);
      errors.push({ index: i, item: items[i], error: error.message, status: 'error' });
    }
  }
  
  return {
    results,
    errors,
    totalProcessed: results.length,
    totalFailed: errors.length
  };
}

// Sequential with conditional processing
async function conditionalSequentialProcessing(items) {
  let currentItem = null;
  const results = [];
  
  for (const item of items) {
    try {
      currentItem = item;
      
      // Check if we should process this item
      const shouldProcess = await shouldProcessItem(item);
      if (!shouldProcess) {
        console.log(\`Skipping \${item} based on condition\`);
        continue;
      }
      
      // Process the item
      const result = await processItem(item);
      results.push(result);
      
      // Check if we should continue processing
      const shouldContinue = await shouldContinueProcessing(result, results);
      if (!shouldContinue) {
        console.log('Stopping processing based on result condition');
        break;
      }
      
    } catch (error) {
      console.error(\`Failed to process \${currentItem}:\`, error.message);
      
      // Check if error is recoverable
      const canRecover = await canRecoverFromError(error, currentItem);
      if (!canRecover) {
        console.error('Unrecoverable error, stopping processing');
        throw error;
      }
    }
  }
  
  return results;
}

async function shouldProcessItem(item) {
  // Simulate condition check
  await new Promise(resolve => setTimeout(resolve, 100));
  return !item.includes('skip');
}

async function shouldContinueProcessing(result, allResults) {
  // Simulate continuation check
  await new Promise(resolve => setTimeout(resolve, 50));
  return allResults.length < 10; // Stop after 10 results
}

async function canRecoverFromError(error, item) {
  // Simulate error recovery check
  await new Promise(resolve => setTimeout(resolve, 100));
  return !error.message.includes('fatal');
}
    `,
    
    pipelinePattern: `
// Pipeline pattern for sequential data transformation
class AsyncPipeline {
  constructor() {
    this.steps = [];
  }
  
  addStep(name, processor) {
    this.steps.push({ name, processor });
    return this;
  }
  
  async execute(input) {
    let current = input;
    const stepResults = [];
    
    for (const step of this.steps) {
      const stepStart = Date.now();
      
      try {
        console.log(\`Executing step: \${step.name}\`);
        current = await step.processor(current);
        
        const stepTime = Date.now() - stepStart;
        stepResults.push({
          step: step.name,
          duration: stepTime,
          success: true,
          output: current
        });
        
        console.log(\`Step \${step.name} completed in \${stepTime}ms\`);
        
      } catch (error) {
        const stepTime = Date.now() - stepStart;
        stepResults.push({
          step: step.name,
          duration: stepTime,
          success: false,
          error: error.message
        });
        
        console.error(\`Step \${step.name} failed after \${stepTime}ms:\`, error.message);
        throw error;
      }
    }
    
    return {
      result: current,
      steps: stepResults,
      totalDuration: stepResults.reduce((sum, step) => sum + step.duration, 0)
    };
  }
}

// Pipeline step functions
const validateInput = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input data');
  }
  return { ...data, validated: true };
};

const enrichData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    ...data,
    enriched: true,
    timestamp: new Date().toISOString(),
    metadata: { version: '1.0', source: 'pipeline' }
  };
};

const transformData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: data.id,
    processed: true,
    originalData: data,
    transformedAt: Date.now()
  };
};

const saveData = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    ...data,
    saved: true,
    savedAt: new Date().toISOString()
  };
};

// Usage example
async function pipelineExample() {
  const pipeline = new AsyncPipeline()
    .addStep('validate', validateInput)
    .addStep('enrich', enrichData)
    .addStep('transform', transformData)
    .addStep('save', saveData);
  
  const inputData = { id: 123, name: 'Test Item', value: 42 };
  
  try {
    const result = await pipeline.execute(inputData);
    console.log('Pipeline completed successfully:');
    console.log('Final result:', result.result);
    console.log('Total duration:', result.totalDuration, 'ms');
  } catch (error) {
    console.error('Pipeline failed:', error.message);
  }
}
    `,
    
    reducePattern: `
// Using reduce for sequential async operations
async function sequentialReduce(items, asyncReducer, initialValue) {
  let accumulator = initialValue;
  
  for (let i = 0; i < items.length; i++) {
    accumulator = await asyncReducer(accumulator, items[i], i, items);
  }
  
  return accumulator;
}

// Example: Sequential API calls with accumulation
async function fetchUserDataSequentially(userIds) {
  const userData = await sequentialReduce(
    userIds,
    async (acc, userId) => {
      console.log(\`Fetching user \${userId}...\`);
      
      // Simulate API call
      const user = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: userId,
            name: \`User \${userId}\`,
            fetchedAt: new Date().toISOString()
          });
        }, 500);
      });
      
      acc.users.push(user);
      acc.totalFetched++;
      
      return acc;
    },
    { users: [], totalFetched: 0 }
  );
  
  return userData;
}

// Example: Building complex objects sequentially
async function buildComplexObject(steps) {
  return await sequentialReduce(
    steps,
    async (obj, step) => {
      console.log(\`Executing step: \${step.name}\`);
      
      const result = await step.execute(obj);
      return { ...obj, ...result };
    },
    {}
  );
}

const buildSteps = [
  {
    name: 'initializeBase',
    execute: async (obj) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { initialized: true, createdAt: Date.now() };
    }
  },
  {
    name: 'addMetadata',
    execute: async (obj) => {
      await new Promise(resolve => setTimeout(resolve, 150));
      return { metadata: { version: '1.0', type: 'complex' } };
    }
  },
  {
    name: 'processData',
    execute: async (obj) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { 
        processed: true, 
        data: { count: Math.floor(Math.random() * 100) }
      };
    }
  }
];

async function sequentialBuildExample() {
  const result = await buildComplexObject(buildSteps);
  console.log('Complex object built:', result);
}
    `
  }
};

// Parallel Execution Patterns
export const parallelPatterns = {
  concept: "Parallel Execution Patterns",
  explanation: `
    Parallel execution runs multiple operations simultaneously to improve performance.
    Useful when operations are independent of each other.
  `,
  
  examples: {
    basicParallel: `
// Basic parallel execution
async function processInParallel(items) {
  console.log(\`Processing \${items.length} items in parallel...\`);
  const startTime = Date.now();
  
  // Start all operations at once
  const promises = items.map(async (item, index) => {
    console.log(\`Started processing \${item}\`);
    const result = await processItem(item);
    console.log(\`Completed processing \${item}\`);
    return { index, item, result };
  });
  
  // Wait for all to complete
  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;
  
  console.log(\`All \${items.length} items processed in \${totalTime}ms\`);
  return results;
}

// Parallel with error handling - fail fast
async function parallelWithFailFast(items) {
  try {
    const results = await Promise.all(items.map(processItem));
    return { success: true, results, failed: [] };
  } catch (error) {
    // If any promise rejects, Promise.all rejects immediately
    console.error('One operation failed, stopping all:', error.message);
    return { success: false, error: error.message, results: [], failed: items };
  }
}

// Parallel with error handling - fail soft
async function parallelWithFailSoft(items) {
  const promises = items.map(async (item) => {
    try {
      const result = await processItem(item);
      return { status: 'fulfilled', item, result };
    } catch (error) {
      return { status: 'rejected', item, error: error.message };
    }
  });
  
  const results = await Promise.all(promises);
  
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  return {
    success: failed.length === 0,
    results: successful.map(r => r.result),
    failed: failed.map(r => ({ item: r.item, error: r.error })),
    totalProcessed: successful.length,
    totalFailed: failed.length
  };
}

// Using Promise.allSettled for mixed results
async function parallelWithAllSettled(items) {
  const promises = items.map(item => processItem(item));
  const results = await Promise.allSettled(promises);
  
  const analysis = results.reduce((acc, result, index) => {
    if (result.status === 'fulfilled') {
      acc.successful.push({
        index,
        item: items[index],
        result: result.value
      });
    } else {
      acc.failed.push({
        index,
        item: items[index],
        error: result.reason.message
      });
    }
    return acc;
  }, { successful: [], failed: [] });
  
  return analysis;
}
    `,
    
    concurrencyControl: `
// Controlled concurrency - limit parallel operations
async function processWithConcurrencyLimit(items, processor, limit = 3) {
  const results = [];
  const executing = new Set();
  
  for (const item of items) {
    // Wait if we've reached the concurrency limit
    while (executing.size >= limit) {
      await Promise.race(executing);
    }
    
    // Start processing this item
    const promise = processor(item).then(result => {
      executing.delete(promise);
      return { item, result, status: 'success' };
    }).catch(error => {
      executing.delete(promise);
      return { item, error: error.message, status: 'error' };
    });
    
    executing.add(promise);
    results.push(promise);
  }
  
  // Wait for all remaining operations to complete
  return Promise.all(results);
}

// Batch processing with controlled concurrency
class BatchProcessor {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.batchSize = options.batchSize || 10;
    this.delayBetweenBatches = options.delayBetweenBatches || 0;
  }
  
  async processBatches(items, processor) {
    const batches = this.createBatches(items);
    const allResults = [];
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(\`Processing batch \${i + 1}/\${batches.length} (\${batch.length} items)\`);
      
      const batchResults = await this.processBatch(batch, processor);
      allResults.push(...batchResults);
      
      // Delay between batches if configured
      if (this.delayBetweenBatches > 0 && i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
      }
    }
    
    return allResults;
  }
  
  async processBatch(batch, processor) {
    return processWithConcurrencyLimit(batch, processor, this.concurrency);
  }
  
  createBatches(items) {
    const batches = [];
    for (let i = 0; i < items.length; i += this.batchSize) {
      batches.push(items.slice(i, i + this.batchSize));
    }
    return batches;
  }
}

// Usage example
async function batchProcessingExample() {
  const items = Array.from({ length: 25 }, (_, i) => \`item-\${i + 1}\`);
  
  const batchProcessor = new BatchProcessor({
    concurrency: 3,
    batchSize: 5,
    delayBetweenBatches: 1000
  });
  
  const results = await batchProcessor.processBatches(items, async (item) => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    return \`processed-\${item}\`;
  });
  
  console.log(\`Processed \${results.length} items:`, results);
}

// Smart concurrency based on system resources
class AdaptiveBatchProcessor extends BatchProcessor {
  constructor(options = {}) {
    super(options);
    this.maxConcurrency = options.maxConcurrency || 10;
    this.minConcurrency = options.minConcurrency || 1;
    this.adaptationThreshold = options.adaptationThreshold || 0.8;
  }
  
  async processBatch(batch, processor) {
    let currentConcurrency = this.concurrency;
    const results = [];
    const errors = [];
    
    while (results.length + errors.length < batch.length) {
      const remaining = batch.slice(results.length + errors.length);
      const currentBatch = remaining.slice(0, currentConcurrency);
      
      const batchStart = Date.now();
      const batchResults = await Promise.allSettled(
        currentBatch.map(item => processor(item))
      );
      const batchTime = Date.now() - batchStart;
      
      // Process results
      batchResults.forEach((result, index) => {
        const item = currentBatch[index];
        if (result.status === 'fulfilled') {
          results.push({ item, result: result.value, status: 'success' });
        } else {
          errors.push({ item, error: result.reason.message, status: 'error' });
        }
      });
      
      // Adapt concurrency based on performance
      const avgTimePerItem = batchTime / currentBatch.length;
      if (avgTimePerItem < 500 && currentConcurrency < this.maxConcurrency) {
        currentConcurrency = Math.min(currentConcurrency + 1, this.maxConcurrency);
        console.log(\`Increasing concurrency to \${currentConcurrency}\`);
      } else if (avgTimePerItem > 2000 && currentConcurrency > this.minConcurrency) {
        currentConcurrency = Math.max(currentConcurrency - 1, this.minConcurrency);
        console.log(\`Decreasing concurrency to \${currentConcurrency}\`);
      }
    }
    
    return [...results, ...errors];
  }
}
    `,
    
    racePatterns: `
// Race patterns for competitive async operations

// Basic race - first to complete wins
async function fastestResponse(urls) {
  const fetchPromises = urls.map(async (url) => {
    const start = Date.now();
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        url,
        data,
        responseTime: Date.now() - start,
        success: true
      };
    } catch (error) {
      return {
        url,
        error: error.message,
        responseTime: Date.now() - start,
        success: false
      };
    }
  });
  
  try {
    const winner = await Promise.race(fetchPromises);
    console.log('Fastest response:', winner);
    return winner;
  } catch (error) {
    console.error('All requests failed or timed out');
    throw error;
  }
}

// Race with timeout
async function raceWithTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Multiple winner race - get N fastest responses
async function getNFastestResponses(promises, n) {
  const results = [];
  const pending = [...promises];
  
  while (results.length < n && pending.length > 0) {
    try {
      const winner = await Promise.race(pending);
      results.push(winner);
      
      // Remove the winning promise from pending
      const winnerIndex = pending.findIndex(p => p === winner);
      if (winnerIndex !== -1) {
        pending.splice(winnerIndex, 1);
      }
    } catch (error) {
      // Remove failed promise and continue
      console.error('One promise failed:', error.message);
      break;
    }
  }
  
  return results;
}

// Circuit breaker pattern for race conditions
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 10000;
    this.resetTimeout = options.resetTimeout || 30000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = null;
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker moving to HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await raceWithTimeout(operation(), this.timeout);
      
      // Success - reset if in HALF_OPEN state
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        console.log('Circuit breaker reset to CLOSED state');
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        console.log('Circuit breaker opened due to failures');
      }
      
      throw error;
    }
  }
}

// Usage example
async function circuitBreakerExample() {
  const breaker = new CircuitBreaker({
    failureThreshold: 3,
    timeout: 2000,
    resetTimeout: 5000
  });
  
  const unreliableOperation = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.7) {
          resolve('Operation succeeded');
        } else {
          reject(new Error('Operation failed'));
        }
      }, Math.random() * 3000);
    });
  };
  
  // Try the operation multiple times
  for (let i = 0; i < 10; i++) {
    try {
      const result = await breaker.execute(unreliableOperation);
      console.log(\`Attempt \${i + 1}: \${result}\`);
    } catch (error) {
      console.error(\`Attempt \${i + 1}: \${error.message}\`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
    `
  }
};

// Mixed Flow Patterns
export const mixedFlowPatterns = {
  concept: "Mixed Flow Patterns",
  explanation: `
    Combining sequential and parallel execution patterns for complex workflows.
  `,
  
  examples: {
    workflowOrchestrator: `
// Workflow orchestrator combining sequential and parallel patterns
class WorkflowOrchestrator {
  constructor() {
    this.steps = [];
  }
  
  addSequentialStep(name, processor) {
    this.steps.push({
      type: 'sequential',
      name,
      processor
    });
    return this;
  }
  
  addParallelStep(name, processors) {
    this.steps.push({
      type: 'parallel',
      name,
      processors
    });
    return this;
  }
  
  addConditionalStep(name, condition, processor) {
    this.steps.push({
      type: 'conditional',
      name,
      condition,
      processor
    });
    return this;
  }
  
  async execute(initialData) {
    let currentData = initialData;
    const stepResults = [];
    
    for (const step of this.steps) {
      const stepStart = Date.now();
      console.log(\`Executing \${step.type} step: \${step.name}\`);
      
      try {
        switch (step.type) {
          case 'sequential':
            currentData = await step.processor(currentData);
            break;
            
          case 'parallel':
            const parallelResults = await Promise.all(
              step.processors.map(processor => processor(currentData))
            );
            currentData = { ...currentData, parallelResults };
            break;
            
          case 'conditional':
            const shouldExecute = await step.condition(currentData);
            if (shouldExecute) {
              currentData = await step.processor(currentData);
            } else {
              console.log(\`Skipping conditional step: \${step.name}\`);
            }
            break;
        }
        
        const stepTime = Date.now() - stepStart;
        stepResults.push({
          step: step.name,
          type: step.type,
          duration: stepTime,
          success: true
        });
        
        console.log(\`Step \${step.name} completed in \${stepTime}ms\`);
        
      } catch (error) {
        const stepTime = Date.now() - stepStart;
        stepResults.push({
          step: step.name,
          type: step.type,
          duration: stepTime,
          success: false,
          error: error.message
        });
        
        console.error(\`Step \${step.name} failed after \${stepTime}ms:\`, error.message);
        throw error;
      }
    }
    
    return {
      result: currentData,
      steps: stepResults,
      totalDuration: stepResults.reduce((sum, step) => sum + step.duration, 0)
    };
  }
}

// Example workflow usage
async function complexWorkflowExample() {
  const workflow = new WorkflowOrchestrator()
    .addSequentialStep('initialize', async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...data, initialized: true, startTime: Date.now() };
    })
    
    .addParallelStep('fetchData', [
      async (data) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { userData: { id: data.userId, name: 'John Doe' } };
      },
      async (data) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { userPosts: [{ id: 1, title: 'Post 1' }] };
      },
      async (data) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { userSettings: { theme: 'dark' } };
      }
    ])
    
    .addConditionalStep('processExtendedData', 
      async (data) => data.parallelResults.some(result => result.userData),
      async (data) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...data, extendedProcessing: true };
      }
    )
    
    .addSequentialStep('finalize', async (data) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { 
        ...data, 
        finalized: true, 
        endTime: Date.now(),
        processingTime: Date.now() - data.startTime
      };
    });
  
  const initialData = { userId: 123, requestId: 'req-456' };
  
  try {
    const result = await workflow.execute(initialData);
    console.log('Workflow completed successfully:');
    console.log('Final result:', result.result);
    console.log('Total duration:', result.totalDuration, 'ms');
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
}
    `,
    
    dependencyManagement: `
// Dependency management for complex async flows
class DependencyResolver {
  constructor() {
    this.tasks = new Map();
    this.results = new Map();
    this.executing = new Set();
  }
  
  addTask(name, dependencies, processor) {
    this.tasks.set(name, {
      name,
      dependencies: dependencies || [],
      processor,
      status: 'pending'
    });
    return this;
  }
  
  async execute() {
    const startTime = Date.now();
    const executionOrder = [];
    
    while (this.tasks.size > 0) {
      // Find tasks that can be executed (all dependencies met)
      const readyTasks = Array.from(this.tasks.values()).filter(task => 
        task.dependencies.every(dep => this.results.has(dep))
      );
      
      if (readyTasks.length === 0) {
        const remainingTasks = Array.from(this.tasks.keys());
        throw new Error(\`Circular dependency or missing dependencies. Remaining tasks: \${remainingTasks.join(', ')}\`);
      }
      
      console.log(\`Executing \${readyTasks.length} ready tasks: \${readyTasks.map(t => t.name).join(', ')}\`);
      
      // Execute all ready tasks in parallel
      const taskPromises = readyTasks.map(async (task) => {
        this.executing.add(task.name);
        const taskStart = Date.now();
        
        try {
          // Prepare input data from dependencies
          const inputData = {};
          for (const dep of task.dependencies) {
            inputData[dep] = this.results.get(dep);
          }
          
          console.log(\`Starting task: \${task.name}\`);
          const result = await task.processor(inputData);
          
          const taskTime = Date.now() - taskStart;
          console.log(\`Task \${task.name} completed in \${taskTime}ms\`);
          
          return { name: task.name, result, duration: taskTime, success: true };
          
        } catch (error) {
          const taskTime = Date.now() - taskStart;
          console.error(\`Task \${task.name} failed after \${taskTime}ms:\`, error.message);
          
          return { name: task.name, error: error.message, duration: taskTime, success: false };
        } finally {
          this.executing.delete(task.name);
        }
      });
      
      // Wait for all ready tasks to complete
      const taskResults = await Promise.all(taskPromises);
      
      // Process results and remove completed tasks
      for (const taskResult of taskResults) {
        if (taskResult.success) {
          this.results.set(taskResult.name, taskResult.result);
          executionOrder.push(taskResult.name);
        } else {
          throw new Error(\`Task \${taskResult.name} failed: \${taskResult.error}\`);
        }
        
        this.tasks.delete(taskResult.name);
      }
    }
    
    const totalTime = Date.now() - startTime;
    return {
      results: Object.fromEntries(this.results),
      executionOrder,
      totalDuration: totalTime
    };
  }
}

// Example dependency-based workflow
async function dependencyWorkflowExample() {
  const resolver = new DependencyResolver()
    
    // Independent tasks (no dependencies)
    .addTask('fetchUser', [], async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: 123, name: 'John Doe', email: 'john@example.com' };
    })
    
    .addTask('fetchConfig', [], async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { theme: 'dark', language: 'en', notifications: true };
    })
    
    // Dependent on fetchUser
    .addTask('fetchUserPosts', ['fetchUser'], async ({ fetchUser }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return [
        { id: 1, title: 'First Post', authorId: fetchUser.id },
        { id: 2, title: 'Second Post', authorId: fetchUser.id }
      ];
    })
    
    .addTask('fetchUserProfile', ['fetchUser'], async ({ fetchUser }) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        userId: fetchUser.id,
        avatar: 'avatar.jpg',
        bio: 'Software developer',
        joinDate: '2023-01-01'
      };
    })
    
    // Dependent on multiple tasks
    .addTask('fetchPostComments', ['fetchUserPosts'], async ({ fetchUserPosts }) => {
      await new Promise(resolve => setTimeout(resolve, 700));
      const comments = {};
      for (const post of fetchUserPosts) {
        comments[post.id] = [
          { id: 1, text: \`Comment on \${post.title}\`, postId: post.id }
        ];
      }
      return comments;
    })
    
    // Final aggregation task
    .addTask('buildUserDashboard', ['fetchUser', 'fetchConfig', 'fetchUserPosts', 'fetchUserProfile', 'fetchPostComments'], 
      async ({ fetchUser, fetchConfig, fetchUserPosts, fetchUserProfile, fetchPostComments }) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return {
          user: fetchUser,
          profile: fetchUserProfile,
          posts: fetchUserPosts.map(post => ({
            ...post,
            comments: fetchPostComments[post.id] || []
          })),
          config: fetchConfig,
          dashboardGeneratedAt: new Date().toISOString()
        };
      }
    );
  
  try {
    const result = await resolver.execute();
    console.log('Dependency workflow completed:');
    console.log('Execution order:', result.executionOrder);
    console.log('Total duration:', result.totalDuration, 'ms');
    console.log('Final dashboard:', result.results.buildUserDashboard);
  } catch (error) {
    console.error('Dependency workflow failed:', error.message);
  }
}
    `,
    
    stateManagement: `
// State management for long-running async workflows
class WorkflowState {
  constructor() {
    this.state = 'idle';
    this.currentStep = null;
    this.completedSteps = [];
    this.data = {};
    this.errors = [];
    this.startTime = null;
    this.subscribers = new Set();
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  emit(event, data) {
    this.subscribers.forEach(callback => {
      try {
        callback({ event, data, state: this.getState() });
      } catch (error) {
        console.error('Subscriber error:', error);
      }
    });
  }
  
  setState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.emit('stateChange', { oldState, newState });
  }
  
  setCurrentStep(step) {
    this.currentStep = step;
    this.emit('stepStart', { step });
  }
  
  completeStep(step, result) {
    this.completedSteps.push({
      step,
      result,
      completedAt: Date.now()
    });
    this.currentStep = null;
    this.emit('stepComplete', { step, result });
  }
  
  addError(error, step) {
    this.errors.push({
      error: error.message,
      step,
      timestamp: Date.now()
    });
    this.emit('error', { error, step });
  }
  
  updateData(updates) {
    this.data = { ...this.data, ...updates };
    this.emit('dataUpdate', updates);
  }
  
  getState() {
    return {
      state: this.state,
      currentStep: this.currentStep,
      completedSteps: this.completedSteps.length,
      totalErrors: this.errors.length,
      duration: this.startTime ? Date.now() - this.startTime : 0,
      data: this.data
    };
  }
  
  getProgress() {
    const totalSteps = this.completedSteps.length + (this.currentStep ? 1 : 0);
    return {
      completed: this.completedSteps.length,
      total: totalSteps,
      percentage: totalSteps > 0 ? (this.completedSteps.length / totalSteps) * 100 : 0
    };
  }
}

// Stateful workflow executor
class StatefulWorkflow {
  constructor() {
    this.steps = [];
    this.state = new WorkflowState();
  }
  
  addStep(name, processor) {
    this.steps.push({ name, processor });
    return this;
  }
  
  onStateChange(callback) {
    return this.state.subscribe(callback);
  }
  
  async execute(initialData = {}) {
    this.state.setState('starting');
    this.state.startTime = Date.now();
    this.state.updateData(initialData);
    
    try {
      for (const step of this.steps) {
        this.state.setState('running');
        this.state.setCurrentStep(step.name);
        
        try {
          const result = await step.processor(this.state.data);
          this.state.updateData(result);
          this.state.completeStep(step.name, result);
          
        } catch (error) {
          this.state.addError(error, step.name);
          this.state.setState('error');
          throw error;
        }
      }
      
      this.state.setState('completed');
      return this.state.getState();
      
    } catch (error) {
      this.state.setState('failed');
      throw error;
    }
  }
  
  pause() {
    this.state.setState('paused');
  }
  
  resume() {
    this.state.setState('running');
  }
  
  cancel() {
    this.state.setState('cancelled');
  }
}

// Example stateful workflow
async function statefulWorkflowExample() {
  const workflow = new StatefulWorkflow()
    .addStep('initialize', async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { initialized: true, timestamp: Date.now() };
    })
    
    .addStep('processData', async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { processed: true, itemCount: 42 };
    })
    
    .addStep('saveResults', async (data) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { saved: true, savedAt: new Date().toISOString() };
    });
  
  // Subscribe to state changes
  const unsubscribe = workflow.onStateChange(({ event, data, state }) => {
    console.log(\`Event: \${event}\`, data);
    console.log('Current state:', state);
    
    if (event === 'stepStart') {
      console.log(\`Started step: \${data.step}\`);
    } else if (event === 'stepComplete') {
      console.log(\`Completed step: \${data.step}\`);
    } else if (event === 'error') {
      console.error(\`Error in step \${data.step}:\`, data.error);
    }
  });
  
  try {
    const initialData = { userId: 123, requestId: 'req-789' };
    const finalState = await workflow.execute(initialData);
    
    console.log('Workflow completed successfully:');
    console.log('Final state:', finalState);
    console.log('Progress:', workflow.state.getProgress());
    
  } catch (error) {
    console.error('Workflow failed:', error.message);
    console.log('Final state:', workflow.state.getState());
  } finally {
    unsubscribe();
  }
}

// Recovery and retry mechanisms
class ResilientWorkflow extends StatefulWorkflow {
  constructor(options = {}) {
    super();
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.checkpointInterval = options.checkpointInterval || 5;
    this.checkpoints = new Map();
  }
  
  async executeWithRetry(initialData = {}) {
    let attempt = 0;
    
    while (attempt <= this.maxRetries) {
      try {
        return await this.execute(initialData);
      } catch (error) {
        attempt++;
        
        if (attempt <= this.maxRetries) {
          console.log(\`Attempt \${attempt} failed, retrying in \${this.retryDelay}ms...\`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          
          // Reset state for retry
          this.state = new WorkflowState();
        } else {
          console.error('All retry attempts failed');
          throw error;
        }
      }
    }
  }
  
  createCheckpoint(name, data) {
    this.checkpoints.set(name, {
      data: JSON.parse(JSON.stringify(data)),
      timestamp: Date.now(),
      step: this.state.currentStep
    });
    console.log(\`Checkpoint '\${name}' created\`);
  }
  
  restoreFromCheckpoint(name) {
    const checkpoint = this.checkpoints.get(name);
    if (checkpoint) {
      this.state.updateData(checkpoint.data);
      console.log(\`Restored from checkpoint '\${name}'\`);
      return checkpoint;
    }
    throw new Error(\`Checkpoint '\${name}' not found\`);
  }
}
    `
  }
};

// Export all patterns
export default {
  config: asyncFlowConfig,
  patterns: {
    sequentialPatterns,
    parallelPatterns,
    mixedFlowPatterns
  }
};