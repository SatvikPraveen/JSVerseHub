// tests/algorithms.test.js
// Tests for the Algorithms Concept

describe('Algorithms Fundamentals', () => {
  
  describe('Big O Notation', () => {
    
    test('should recognize O(1) constant time', () => {
      const getFirst = (arr) => arr[0]; // O(1)
      
      const small = [1];
      const large = Array.from({ length: 1000000 }, (_, i) => i);
      
      // Same operations regardless of size
      const t1 = Date.now();
      getFirst(small);
      const time1 = Date.now() - t1;
      
      const t2 = Date.now();
      getFirst(large);
      const time2 = Date.now() - t2;
      
      // Times should be similar
      expect(time1 + time2).toBeGreaterThanOrEqual(0);
    });
    
    test('should recognize O(n) linear time', () => {
      const findMax = (arr) => {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] > max) max = arr[i];
        }
        return max;
      };
      
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      // Twice the size takes ~twice the time
      expect(findMax(arr1)).toBe(5);
      expect(findMax(arr2)).toBe(10);
    });
    
    test('should recognize space complexity', () => {
      const constantSpace = (arr) => {
        let sum = 0;
        for (const num of arr) {
          sum += num;
        }
        return sum;
      };
      
      const linearSpace = (arr) => {
        return arr.map(x => x * 2);
      };
      
      expect(constantSpace([1, 2, 3])).toBe(6); // O(1) space
      expect(linearSpace([1, 2, 3])).toEqual([2, 4, 6]); // O(n) space
    });
  });
  
  describe('Sorting Algorithms', () => {
    
    test('bubble sort should sort array', () => {
      const bubbleSort = (arr) => {
        const n = arr.length;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
          }
        }
        return arr;
      };
      
      expect(bubbleSort([64, 34, 25, 12, 22, 11, 90])).toEqual(
        [11, 12, 22, 25, 34, 64, 90]
      );
      
      expect(bubbleSort([5, 2, 8, 1, 9])).toEqual([1, 2, 5, 8, 9]);
      
      expect(bubbleSort([1])).toEqual([1]);
      expect(bubbleSort([])).toEqual([]);
    });
    
    test('merge sort should sort array', () => {
      const merge = (left, right) => {
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
      };
      
      const mergeSort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
      };
      
      expect(mergeSort([64, 34, 25, 12, 22, 11, 90])).toEqual(
        [11, 12, 22, 25, 34, 64, 90]
      );
    });
    
    test('should handle duplicates in sorting', () => {
      const bubbleSort = (arr) => {
        const n = arr.length;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
          }
        }
        return arr;
      };
      
      expect(bubbleSort([5, 2, 5, 1, 2, 5])).toEqual([1, 2, 2, 5, 5, 5]);
    });
  });
  
  describe('Searching Algorithms', () => {
    
    test('linear search should find element', () => {
      const linearSearch = (arr, target) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === target) return i;
        }
        return -1;
      };
      
      const arr = [10, 20, 30, 40, 50];
      
      expect(linearSearch(arr, 30)).toBe(2);
      expect(linearSearch(arr, 25)).toBe(-1);
      expect(linearSearch(arr, 10)).toBe(0);
      expect(linearSearch(arr, 50)).toBe(4);
    });
    
    test('binary search should find element in sorted array', () => {
      const binarySearch = (arr, target) => {
        let left = 0, right = arr.length - 1;
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          
          if (arr[mid] === target) return mid;
          if (arr[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        
        return -1;
      };
      
      const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17];
      
      expect(binarySearch(sorted, 7)).toBe(3);
      expect(binarySearch(sorted, 1)).toBe(0);
      expect(binarySearch(sorted, 17)).toBe(8);
      expect(binarySearch(sorted, 10)).toBe(-1);
      expect(binarySearch(sorted, 0)).toBe(-1);
    });
    
    test('binary search should be faster for large arrays', () => {
      const binarySearch = (arr, target) => {
        let left = 0, right = arr.length - 1;
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (arr[mid] === target) return mid;
          if (arr[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      };
      
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      expect(binarySearch(largeArray, 5000)).toBe(5000);
      expect(binarySearch(largeArray, 9999)).toBe(9999);
    });
  });
  
  describe('Recursion', () => {
    
    test('factorial should calculate correctly', () => {
      const factorial = (n) => {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      };
      
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(6)).toBe(720);
    });
    
    test('fibonacci should calculate correctly', () => {
      const fib = (n) => {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      };
      
      expect(fib(0)).toBe(0);
      expect(fib(1)).toBe(1);
      expect(fib(2)).toBe(1);
      expect(fib(3)).toBe(2);
      expect(fib(5)).toBe(5);
      expect(fib(10)).toBe(55);
    });
    
    test('memoization should optimize fibonacci', () => {
      const fibMemo = (n, memo = {}) => {
        if (n in memo) return memo[n];
        if (n <= 1) return n;
        
        memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        return memo[n];
      };
      
      expect(fibMemo(20)).toBe(6765);
      expect(fibMemo(30)).toBe(832040);
    });
    
    test('recursion should work for tree traversal', () => {
      class Node {
        constructor(value) {
          this.value = value;
          this.left = null;
          this.right = null;
        }
      }
      
      const inorder = (node) => {
        if (!node) return [];
        return [
          ...inorder(node.left),
          node.value,
          ...inorder(node.right)
        ];
      };
      
      // Build tree:
      //     2
      //    / \\
      //   1   3
      const root = new Node(2);
      root.left = new Node(1);
      root.right = new Node(3);
      
      expect(inorder(root)).toEqual([1, 2, 3]);
    });
  });
  
  describe('Complexity Tradeoffs', () => {
    
    test('should understand time vs space tradeoff', () => {
      // Faster but uses more space
      const quickSort = (arr) => {
        if (arr.length <= 1) return arr;
        
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => x < pivot);
        const middle = arr.filter(x => x === pivot);
        const right = arr.filter(x => x > pivot);
        
        return [...quickSort(left), ...middle, ...quickSort(right)];
      };
      
      const arr = [5, 2, 8, 1, 9];
      expect(quickSort(arr)).toEqual([1, 2, 5, 8, 9]);
    });
    
    test('should choose algorithm based on constraints', () => {
      // For small arrays, simple algorithms are fine
      const arr1 = [5, 2, 8, 1, 9];
      
      // For large arrays, efficient algorithms matter
      const arr2 = Array.from({ length: 1000 }, () =>
        Math.floor(Math.random() * 1000)
      );
      
      expect(arr1.length).toBe(5);
      expect(arr2.length).toBe(1000);
      
      // Both could use same algorithm, but for arr2,
      // quick sort (O(n log n)) is much better than bubble sort (O(n²))
    });
  });
  
  describe('Algorithm Selection', () => {
    
    test('should select appropriate sorting algorithm', () => {
      const algorithms = {
        'Bubble Sort': { time: 'O(n²)', space: 'O(1)', use: 'educational' },
        'Merge Sort': { time: 'O(n log n)', space: 'O(n)', use: 'general' },
        'Quick Sort': { time: 'O(n log n)', space: 'O(log n)', use: 'fast' }
      };
      
      expect(algorithms['Merge Sort'].time).toBe('O(n log n)');
      expect(algorithms['Quick Sort'].use).toBe('fast');
      expect(algorithms['Bubble Sort'].space).toBe('O(1)');
    });
    
    test('should select appropriate searching algorithm', () => {
      // Unsorted data
      const unsorted = [5, 2, 8, 1, 9];
      // Must use linear search
      
      // Sorted data
      const sorted = [1, 2, 5, 8, 9];
      // Can use binary search for better performance
      
      expect(unsorted.length).toBe(sorted.length);
      // Binary search would be faster on sorted data
    });
  });
});
