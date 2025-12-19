// File: src/concepts/algorithms/index.js
// Algorithm Fundamentals - Sorting, Searching, Complexity Analysis

/**
 * Algorithms Configuration
 */
export const algorithmsConfig = {
  title: "Algorithm Fundamentals",
  description: "Master essential algorithms and analyze their performance",
  difficulty: "intermediate-advanced",
  estimatedTime: "120 minutes",
  topics: [
    "Big O Notation",
    "Sorting Algorithms",
    "Searching Algorithms",
    "Recursion",
    "Dynamic Programming",
    "Algorithm Optimization"
  ],
  prerequisites: ["JavaScript Basics", "Arrays", "Functions"],
  learningObjectives: [
    "Understand time and space complexity",
    "Implement core sorting algorithms",
    "Implement searching techniques",
    "Write recursive solutions",
    "Optimize algorithms for performance",
    "Choose appropriate algorithms"
  ]
};

/**
 * Big O Notation
 */
export const bigONotation = {
  concept: "Big O Notation & Complexity Analysis",
  explanation: `
    Big O describes how an algorithm's performance scales with input size.
    
    Common Complexities (best to worst):
    1. O(1) - Constant: Same time regardless of input size
    2. O(log n) - Logarithmic: Cuts input in half each iteration
    3. O(n) - Linear: Time proportional to input size
    4. O(n log n) - Linearithmic: Combination of linear and log
    5. O(n²) - Quadratic: Time proportional to input squared
    6. O(n³) - Cubic: Time proportional to input cubed
    7. O(2^n) - Exponential: Doubles with each additional element
    8. O(n!) - Factorial: Incredibly slow for large inputs
    
    Space Complexity: How much memory an algorithm uses
    
    Best Practices:
    - Analyze algorithms before coding
    - Choose algorithms with better complexity
    - Optimize hot paths in code
    - Test with large datasets
  `,
  
  examples: {
    complexityComparison: `
// O(1) - Constant time
function getFirstElement(arr) {
  return arr[0]; // Always 1 operation
}

// O(log n) - Binary search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// O(n) - Linear time
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) - Quadratic time
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// O(2^n) - Exponential time
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
    `,
    
    analyzeComplexity: `
// Analyzing complexity

function analyzeExample1(arr) {
  // O(1) - Constant
  return arr[0];
}

function analyzeExample2(arr) {
  // O(n) - Iterates through all elements once
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function analyzeExample3(arr) {
  // O(n²) - Nested loops
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}

function analyzeExample4(arr) {
  // O(n log n) - Sort + iterate
  arr.sort(); // O(n log n)
  for (let i = 0; i < arr.length; i++) { // O(n)
    console.log(arr[i]);
  }
  // Total: O(n log n) dominates
}

// Space complexity
function analyzeSpace1(n) {
  // O(1) - Constant space
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
}

function analyzeSpace2(arr) {
  // O(n) - Creates new array same size as input
  return arr.map(x => x * 2);
}

function analyzeSpace3(n) {
  // O(n) - Call stack depth
  if (n <= 0) return;
  analyzeSpace3(n - 1); // Recursive calls use O(n) stack space
}
    `
  }
};

/**
 * Sorting Algorithms
 */
export const sortingAlgorithms = {
  concept: "Sorting Algorithms",
  explanation: `
    Sorting arranges data in order. Different algorithms have different tradeoffs.
    
    Common Sorting Algorithms:
    1. Bubble Sort: O(n²) - Simple but slow
    2. Selection Sort: O(n²) - Simple
    3. Insertion Sort: O(n²) - Good for small/nearly sorted data
    4. Merge Sort: O(n log n) - Stable, consistent performance
    5. Quick Sort: O(n log n) avg - Fast in practice
    6. Heap Sort: O(n log n) - Consistent, but slower constants
    
    When to use:
    - Small datasets: Insertion sort
    - General purpose: Merge sort or Quick sort
    - Nearly sorted: Insertion sort
    - Need stable sort: Merge sort or built-in sort
  `,
  
  examples: {
    bubbleSort: `
// Bubble Sort - Compare adjacent, swap if wrong order
// Time: O(n²), Space: O(1)
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Usage
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// Result: [11, 12, 22, 25, 34, 64, 90]
    `,
    
    mergeSort: `
// Merge Sort - Divide and conquer
// Time: O(n log n), Space: O(n)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Usage
console.log(mergeSort([64, 34, 25, 12, 22, 11, 90]));
// Result: [11, 12, 22, 25, 34, 64, 90]
    `,
    
    quickSort: `
// Quick Sort - Partition around pivot
// Time: O(n log n) avg, O(n²) worst, Space: O(log n)
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return quickSort(left).concat(middle).concat(quickSort(right));
}

// In-place version (more efficient)
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSortInPlace(arr, low, pi - 1);
    quickSortInPlace(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
    `
  }
};

/**
 * Searching Algorithms
 */
export const searchingAlgorithms = {
  concept: "Searching Algorithms",
  explanation: `
    Finding specific elements in data.
    
    Linear Search: O(n)
    - Works on any data
    - Simple to implement
    
    Binary Search: O(log n)
    - Requires sorted data
    - Much faster for large datasets
    - Cuts search space in half each step
  `,
  
  examples: {
    linearSearch: `
// Linear Search - Check each element
// Time: O(n), Space: O(1)
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1; // Not found
}

// Usage
console.log(linearSearch([10, 20, 30, 40, 50], 30)); // 2
console.log(linearSearch([10, 20, 30, 40, 50], 25)); // -1
    `,
    
    binarySearch: `
// Binary Search - Divide and eliminate half
// Time: O(log n), Space: O(1)
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1; // Not found
}

// Recursive version
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Usage
const sorted = [10, 20, 30, 40, 50, 60, 70];
console.log(binarySearch(sorted, 40)); // 3
console.log(binarySearch(sorted, 25)); // -1
    `
  }
};

/**
 * Recursion
 */
export const recursion = {
  concept: "Recursion",
  explanation: `
    Function calling itself with smaller input.
    
    Key components:
    1. Base case: When to stop recursing
    2. Recursive case: Smaller version of problem
    
    Call stack: Each call uses memory, very deep recursion can cause stack overflow.
    
    Benefits:
    - Natural for problems like trees
    - Cleaner code for some problems
    
    Drawbacks:
    - Stack memory usage
    - Performance overhead
    - Can be slower than loops
  `,
  
  examples: {
    recursionBasics: `
// Simple recursion - Factorial
function factorial(n) {
  // Base case
  if (n <= 1) return 1;
  
  // Recursive case
  return n * factorial(n - 1);
}

// Fibonacci - Bad (exponential time)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Fibonacci - Better with memoization
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Tree traversal
function treeSum(node) {
  if (!node) return 0;
  return node.value + treeSum(node.left) + treeSum(node.right);
}
    `,
    
    recursionOptimization: `
// Tail recursion optimization
function sumTail(arr, index = 0, accumulator = 0) {
  // Base case
  if (index === arr.length) return accumulator;
  
  // Recursive case (tail call - can be optimized)
  return sumTail(arr, index + 1, accumulator + arr[index]);
}

// Better: Use loop instead
function sum(arr) {
  let result = 0;
  for (const num of arr) {
    result += num;
  }
  return result;
}

// When recursion is good: Tree problems
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(node) {
  if (!node) return [];
  
  return [
    ...inorderTraversal(node.left),
    node.value,
    ...inorderTraversal(node.right)
  ];
}
    `
  }
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: "alg_ex1",
    title: "Analyze Big O",
    difficulty: "easy",
    description: "Determine time complexity of code",
    template: `
// What is the Big O complexity?

function example1(arr) {
  // O(?)
  return arr[0];
}

function example2(arr) {
  // O(?)
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function example3(arr) {
  // O(?)
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i] + arr[j]);
    }
  }
}

// Write your answers as comments
    `,
    tests: [
      {
        description: "Should have O(1) for example1",
        check: (code) => code.includes('O(1)') || code.includes('O(1)')
      }
    ],
    hints: [
      "Example 1: Constant time access",
      "Example 2: Iterate once",
      "Example 3: Nested loops"
    ]
  },
  {
    id: "alg_ex2",
    title: "Implement Bubble Sort",
    difficulty: "medium",
    description: "Write bubble sort algorithm",
    template: `
function bubbleSort(arr) {
  // Your implementation here
  // Compare adjacent elements
  // Swap if needed
  // Repeat until sorted
  
  return arr;
}

// Test
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// Expected: [11, 12, 22, 25, 34, 64, 90]
    `,
    tests: [
      {
        description: "Should have nested loops",
        check: (code) => code.match(/for/g).length >= 2
      }
    ],
    hints: [
      "Use two nested loops",
      "Compare adjacent elements",
      "Swap if arr[j] > arr[j+1]"
    ]
  },
  {
    id: "alg_ex3",
    title: "Implement Binary Search",
    difficulty: "hard",
    description: "Write binary search for sorted array",
    template: `
function binarySearch(arr, target) {
  // Your implementation here
  // Use left and right pointers
  // Calculate middle
  // Compare and adjust bounds
  
  return -1; // Not found
}

// Test
const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sorted, 7)); // 3
console.log(binarySearch(sorted, 10)); // -1
    `,
    tests: [
      {
        description: "Should use left and right",
        check: (code) => code.includes('left') && code.includes('right')
      }
    ],
    hints: [
      "Track left and right boundaries",
      "Calculate mid = (left + right) / 2",
      "Narrow range based on comparison"
    ]
  }
];

/**
 * Quiz
 */
export const quiz = [
  {
    id: "aq1",
    question: "What is O(n log n) complexity?",
    options: [
      "Linear time",
      "Quadratic time",
      "Linearithmic time",
      "Exponential time"
    ],
    correct: 2,
    explanation: "O(n log n) is called linearithmic - combination of linear and logarithmic"
  },
  {
    id: "aq2",
    question: "Which algorithm is O(log n)?",
    options: [
      "Bubble sort",
      "Linear search",
      "Binary search",
      "Fibonacci"
    ],
    correct: 2,
    explanation: "Binary search has O(log n) complexity by eliminating half the search space"
  },
  {
    id: "aq3",
    question: "What is the best case for quick sort?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(2^n)"
    ],
    correct: 1,
    explanation: "Quick sort best case is O(n log n) when pivot splits array evenly"
  }
];

/**
 * Export all
 */
export default {
  config: algorithmsConfig,
  bigONotation,
  sortingAlgorithms,
  searchingAlgorithms,
  recursion,
  exercises,
  quiz
};
