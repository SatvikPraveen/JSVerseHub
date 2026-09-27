// File: src/concepts/functional/index.js
// Functional Programming - Pure functions, higher-order functions, and declarative data transformation

import { pureFunctionsContent } from './pure-functions.js';
import { higherOrderContent } from './higher-order.js';
import { mapFilterReduceContent } from './map-filter-reduce.js';

export const functionalConfig = {
  title: 'Functional Programming',
  description: 'Write predictable, composable code with pure functions, immutability, and higher-order functions',
  difficulty: 'intermediate',
  estimatedTime: '4-5 hours',
  topics: [
    'Pure Functions & Referential Transparency',
    'Immutability & Avoiding Side Effects',
    'Higher-Order Functions',
    'Closures, Currying & Partial Application',
    'Function Composition (compose / pipe)',
    'map, filter, reduce',
    'find, some, every & Method Chaining'
  ],
  prerequisites: ['Basics', 'Functions', 'ES6+']
};

// Alias so callers can import the generic name used across concept modules
export const conceptConfig = functionalConfig;

// ---------------------------------------------------------------------------
// Pure Functions
// ---------------------------------------------------------------------------

const TAX_RATE = 5; // A constant is fine to read: it never changes, so purity is preserved

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Returns a new array instead of mutating the argument
function doubleArray(numbers) {
  return numbers.map(n => n * 2);
}

// Depends only on its argument and an immutable constant
function calculate(amount) {
  return amount * TAX_RATE;
}

// Object spread produces a shallow copy; the original is untouched
function updateObject(obj, changes) {
  return { ...obj, ...changes };
}

function appendItem(array, item) {
  return [...array, item];
}

// A deterministic "random": given the same seed it always yields the same value.
// Math.random() is impure (its output depends on hidden state), so purity is
// recovered by making the seed an explicit input (linear congruential generator).
function getRandomNumber(seed = 42) {
  const next = (seed * 1664525 + 1013904223) % 4294967296;
  return next / 4294967296;
}

// Pure data pipeline: no logging, no network, no mutation, just a return value
function processData(values) {
  return values
    .filter(v => typeof v === 'number' && Number.isFinite(v))
    .map(v => v * v)
    .sort((a, b) => a - b);
}

// Impure counterpart shown for contrast (do not use in production pipelines)
let impureCallCount = 0;
function impureIncrement() {
  impureCallCount += 1; // side effect: mutates external state
  return impureCallCount;
}

// Deep freeze: recursively make an object (and nested objects) immutable
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = obj[name];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

// Immutable nested update using a key path
function setIn(obj, path, value) {
  if (path.length === 0) {
    return value;
  }
  const [head, ...rest] = path;
  const current = obj && typeof obj === 'object' ? obj : {};
  return { ...current, [head]: setIn(current[head], rest, value) };
}

// Memoisation is only safe because the wrapped function is pure
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
}

export const pureFunctions = {
  concept: 'Pure Functions',
  title: 'Pure Functions & Immutability',
  explanation: `
    A pure function satisfies two rules: (1) given the same arguments it always returns
    the same result, and (2) it produces no observable side effects. It does not read
    mutable external state, mutate its inputs, log, throw for control flow, perform I/O,
    or depend on time or randomness. Because of this, a pure call can be replaced by its
    value without changing program behaviour (referential transparency).

    Purity buys you: trivial unit tests (no mocks), safe memoisation and caching, safe
    parallelism, and code that can be reasoned about locally. Reading immutable constants
    is fine; reading a variable that something else may change is not.

    Immutability is the companion discipline. Instead of mutating an object or array,
    return a new one: spread ({ ...obj }, [...arr]), map/filter/reduce, Object.freeze for
    enforcement, and helper functions such as setIn for nested updates. Note that spread
    is shallow: nested objects are still shared unless you copy them too.

    Real programs need side effects (rendering, network, storage). The functional approach
    is to push them to the edges of the system and keep the core logic pure, so most of
    the code remains predictable and testable.
  `,
  keyPoints: [
    'Same input, same output; no side effects.',
    'Do not mutate arguments: return new arrays/objects via spread or map/filter.',
    'Impure inputs (Date.now, Math.random, globals) become pure when passed as parameters.',
    'Object.freeze is shallow; use deepFreeze for nested structures.',
    'Memoisation is only correct for pure functions.',
    'Keep side effects at the boundaries; keep the core pure.'
  ],
  examples: {
    add,
    multiply,
    doubleArray,
    calculate,
    updateObject,
    appendItem,
    getRandomNumber,
    processData,
    impureIncrement,
    deepFreeze,
    setIn,
    memoize,
    pureVsImpure: `
// IMPURE: reads and writes external state, output depends on history
let total = 0;
function addToTotal(n) {
  total += n;
  return total;
}
addToTotal(5); // 5
addToTotal(5); // 10  -- same input, different output

// PURE: everything the function needs is passed in
function sum(total, n) {
  return total + n;
}
sum(0, 5); // 5
sum(0, 5); // 5  -- always
    `,
    immutableUpdates: `
const user = { name: 'Ann', address: { city: 'Oslo' } };

// Shallow copy with an override
const renamed = { ...user, name: 'Anna' };
renamed !== user;                    // true
renamed.address === user.address;    // true (shallow!)

// Nested immutable update
const moved = setIn(user, ['address', 'city'], 'Bergen');
moved.address.city;                  // 'Bergen'
user.address.city;                   // 'Oslo' (unchanged)

// Enforce immutability
const frozen = deepFreeze({ a: { b: 1 } });
frozen.a.b = 2;                      // silently ignored (throws in strict mode)
    `,
    memoization: `
let calls = 0;
const slowSquare = n => { calls += 1; return n * n; };
const fastSquare = memoize(slowSquare);

fastSquare(9); // computes: calls === 1
fastSquare(9); // cached:   calls === 1
    `
  },
  content: pureFunctionsContent
};

// ---------------------------------------------------------------------------
// Higher-Order Functions
// ---------------------------------------------------------------------------

// Functions returning functions
function multiplier(factor) {
  return n => n * factor;
}

function makeAdder(amount) {
  return n => n + amount;
}

// Functions taking functions
function applyTwice(fn, value) {
  return fn(fn(value));
}

// compose applies right-to-left: compose(f, g)(x) === f(g(x))
function compose(...fns) {
  return input => fns.reduceRight((acc, fn) => fn(acc), input);
}

// pipe applies left-to-right: pipe(f, g)(x) === g(f(x))
function pipe(...fns) {
  return input => fns.reduce((acc, fn) => fn(acc), input);
}

// Closure: the returned function keeps private access to 'count'
function makeCounter(start = 0) {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}

function createFilter(predicate) {
  return items => items.filter(predicate);
}

// Decorator: wraps a function with extra behaviour without changing its result
function withLogging(fn, logger = () => {}) {
  return (...args) => {
    logger(`Calling ${fn.name || 'anonymous'} with`, args);
    const result = fn(...args);
    logger(`Result:`, result);
    return result;
  };
}

// Currying: turn f(a, b, c) into f(a)(b)(c), collecting args until arity is met
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
}

// Partial application: fix some leading arguments now, supply the rest later
function partial(fn, ...preset) {
  return (...later) => fn(...preset, ...later);
}

// Call the wrapped function at most once; subsequent calls return the first result
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

// Debounce: run only after 'delay' ms of silence (returns a cancel-able wrapper)
function debounce(fn, delay) {
  let timer = null;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

// Predicate combinators
const not =
  predicate =>
  (...args) =>
    !predicate(...args);
const both =
  (p, q) =>
  (...args) =>
    p(...args) && q(...args);
const either =
  (p, q) =>
  (...args) =>
    p(...args) || q(...args);

export const higherOrderFunctions = {
  concept: 'Higher-Order Functions',
  title: 'Higher-Order Functions',
  explanation: `
    A higher-order function (HOF) is one that takes a function as an argument, returns
    a function, or both. JavaScript treats functions as first-class values, so they can be
    stored, passed, and returned like any other value. This is the mechanism behind array
    methods (map, filter), event handlers, middleware, and most abstraction in JS.

    Functions that return functions typically rely on closures: the inner function keeps
    a live reference to the variables of the scope it was created in, even after the outer
    function has returned. makeCounter() uses this to hold private mutable state; multiplier(2)
    uses it to "bake in" configuration and produce a specialised function.

    Composition builds complex behaviour from simple pieces. compose(f, g)(x) evaluates
    f(g(x)) (right-to-left, mathematical order); pipe(f, g)(x) evaluates g(f(x))
    (left-to-right, reading order). Both require unary functions in the chain, which is
    where currying and partial application come in: they turn multi-argument functions
    into a series of single-argument ones.

    Decorators such as withLogging, memoize, once, and debounce wrap a function to add
    behaviour while preserving its interface, an application of the open/closed principle.
  `,
  keyPoints: [
    'Functions are values: they can be passed, returned, and stored.',
    'Closures let returned functions retain private state (makeCounter).',
    'compose is right-to-left; pipe is left-to-right.',
    'Currying: f(a, b) -> f(a)(b); partial application fixes some arguments up front.',
    'Decorators wrap functions to add logging, caching, throttling, etc.',
    'Each call to a factory creates an independent closure.'
  ],
  examples: {
    multiplier,
    makeAdder,
    applyTwice,
    compose,
    pipe,
    makeCounter,
    createFilter,
    withLogging,
    curry,
    partial,
    once,
    debounce,
    not,
    both,
    either,
    closures: `
function makeCounter() {
  let count = 0;             // private: only reachable through the closure
  return () => { count += 1; return count; };
}
const a = makeCounter();
const b = makeCounter();
a(); a();                    // 2
b();                         // 1  -- independent state
    `,
    composition: `
const trim = s => s.trim();
const lower = s => s.toLowerCase();
const slug = s => s.replace(/\\s+/g, '-');

const slugify = pipe(trim, lower, slug);
slugify('  Hello Functional World ');   // 'hello-functional-world'

const shout = compose(s => \`\${s}!\`, s => s.toUpperCase());
shout('hi');                            // 'HI!'
    `,
    curryingAndPartial: `
const volume = (l, w, h) => l * w * h;
const curriedVolume = curry(volume);
curriedVolume(2)(3)(4);      // 24
curriedVolume(2, 3)(4);      // 24

const cube = partial(volume, 2, 2);
cube(2);                     // 8
    `,
    decorators: `
const init = once(() => 'initialised');
init(); // 'initialised'
init(); // 'initialised' (fn not called again)

const isEven = n => n % 2 === 0;
const isPositive = n => n > 0;
[ -2, -1, 0, 1, 2 ].filter(both(isEven, isPositive)); // [2]
[ -2, -1, 0, 1, 2 ].filter(not(isEven));              // [-1, 1]
    `
  },
  content: higherOrderContent
};

// ---------------------------------------------------------------------------
// Map, Filter, Reduce
// ---------------------------------------------------------------------------

function mapDoubleNumbers(numbers) {
  return numbers.map(n => n * 2);
}

function mapNames(users) {
  return users.map(user => user.name);
}

function filterEvenNumbers(numbers) {
  return numbers.filter(n => n % 2 === 0);
}

function filterActive(users) {
  return users.filter(user => user.active);
}

function filterGreaterThan10(numbers) {
  return numbers.filter(n => n > 10);
}

function sumArray(numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

function countOccurrences(items) {
  return items.reduce(
    (counts, item) => ({
      ...counts,
      [item]: (counts[item] ?? 0) + 1
    }),
    {}
  );
}

function groupByProperty(items, key) {
  return items.reduce((groups, item) => {
    const groupKey = item[key];
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] ?? []), item]
    };
  }, {});
}

function multiplyWithInitial(numbers, initial) {
  return numbers.reduce((product, n) => product * n, initial);
}

function findUserByName(users, name) {
  return users.find(user => user.name === name);
}

function hasAdminUser(users) {
  return users.some(user => user.role === 'admin');
}

function allAdults(ages) {
  return ages.every(age => age >= 18);
}

// flatMap: map then flatten one level
function tokenize(sentences) {
  return sentences.flatMap(sentence => sentence.split(/\s+/).filter(Boolean));
}

// Implementations built on reduce, to show that map and filter are special cases of it
function mapWithReduce(array, fn) {
  return array.reduce((acc, item, index) => [...acc, fn(item, index)], []);
}

function filterWithReduce(array, predicate) {
  return array.reduce((acc, item, index) => (predicate(item, index) ? [...acc, item] : acc), []);
}

// Single-pass pipeline: filter, map, and reduce fused into one reduce for large inputs
function averageOfActiveAges(users) {
  const { sum, count } = users.reduce(
    (acc, user) => (user.active ? { sum: acc.sum + user.age, count: acc.count + 1 } : acc),
    { sum: 0, count: 0 }
  );
  return count === 0 ? 0 : sum / count;
}

// Reduce to run a list of functions in order (pipe expressed via reduce)
function runPipeline(value, steps) {
  return steps.reduce((acc, step) => step(acc), value);
}

export const mapFilterReduce = {
  concept: 'Map, Filter, Reduce',
  title: 'map, filter, reduce & Friends',
  explanation: `
    map, filter, and reduce are the core declarative array operations. Each takes a
    callback, never mutates the source array, and returns a new value, so they chain
    naturally and slot into a pure, immutable style.

    map(fn) transforms every element 1:1 and returns an array of the same length.
    filter(predicate) keeps elements for which the predicate is truthy; the result may be
    shorter, or empty. reduce(reducer, initial) folds the array into a single value of any
    type (number, object, array, Map). Always pass an initial value: without it reduce uses
    the first element, which throws on an empty array and can silently produce the wrong
    type. map and filter can themselves be written with reduce.

    Related methods: find returns the first matching element (or undefined); some returns
    true if any element matches; every returns true if all match (and true for an empty
    array); flatMap maps then flattens one level.

    Chaining is readable but each step allocates an intermediate array. For very large
    inputs, fuse the steps into a single reduce, or use a lazy iterator approach.
  `,
  keyPoints: [
    'map: same length, transformed elements. filter: subset. reduce: anything.',
    'None of them mutate the original array.',
    'Always supply an initial value to reduce.',
    'find/some/every short-circuit; every([]) is true, some([]) is false.',
    'flatMap is map + flatten one level.',
    'Chaining allocates intermediates; fuse into one reduce when performance matters.'
  ],
  examples: {
    mapDoubleNumbers,
    mapNames,
    filterEvenNumbers,
    filterActive,
    filterGreaterThan10,
    sumArray,
    countOccurrences,
    groupByProperty,
    multiplyWithInitial,
    findUserByName,
    hasAdminUser,
    allAdults,
    tokenize,
    mapWithReduce,
    filterWithReduce,
    averageOfActiveAges,
    runPipeline,
    basics: `
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);                       // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0);              // [2, 4]
nums.reduce((sum, n) => sum + n, 0);        // 15
nums;                                       // [1, 2, 3, 4, 5]  (unchanged)

// Callback signature: (element, index, array)
nums.map((n, i) => n * i);                  // [0, 2, 6, 12, 20]
    `,
    reduceToObject: `
const words = ['a', 'b', 'a'];
words.reduce((counts, w) => ({ ...counts, [w]: (counts[w] ?? 0) + 1 }), {});
// { a: 2, b: 1 }

const users = [{ name: 'Al', role: 'admin' }, { name: 'Bo', role: 'user' }];
groupByProperty(users, 'role');
// { admin: [{ name: 'Al', ... }], user: [{ name: 'Bo', ... }] }
    `,
    chaining: `
const orders = [
  { id: 1, total: 120, paid: true },
  { id: 2, total: 80,  paid: false },
  { id: 3, total: 200, paid: true }
];

const paidRevenue = orders
  .filter(o => o.paid)
  .map(o => o.total)
  .reduce((sum, t) => sum + t, 0);          // 320

orders.find(o => o.total > 100);            // { id: 1, ... }
orders.some(o => !o.paid);                  // true
orders.every(o => o.total > 50);            // true
    `,
    mapFilterViaReduce: `
mapWithReduce([1, 2, 3], n => n * 10);       // [10, 20, 30]
filterWithReduce([1, 2, 3, 4], n => n > 2);  // [3, 4]
    `
  },
  content: mapFilterReduceContent
};

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

function safely(fn) {
  try {
    return fn();
  } catch {
    return false;
  }
}

export const exercises = [
  {
    id: 1,
    title: 'Make It Pure',
    difficulty: 'easy',
    description:
      'The function below mutates its argument. Rewrite addTag(post, tag) so it returns a new post object with the tag appended and leaves the original untouched.',
    template: `
// Impure version (mutates the input):
// function addTag(post, tag) {
//   post.tags.push(tag);
//   return post;
// }

function addTag(post, tag) {
  // Your code here
}
    `,
    tests: [
      {
        description: 'Should return a post containing the new tag',
        check: (code, addTag) => safely(() => addTag({ tags: ['a'] }, 'b').tags.join() === 'a,b')
      },
      {
        description: 'Should not mutate the original post',
        check: (code, addTag) =>
          safely(() => {
            const post = { title: 'x', tags: ['a'] };
            addTag(post, 'b');
            return post.tags.length === 1;
          })
      }
    ],
    hints: ['Spread the object and spread the tags array', 'Never call push on an argument']
  },
  {
    id: 2,
    title: 'Square the Odds',
    difficulty: 'easy',
    description:
      'Write squareOdds(numbers) that returns the squares of only the odd numbers, in original order, using filter and map.',
    template: `
function squareOdds(numbers) {
  // Your code here
}
    `,
    tests: [
      {
        description: 'squareOdds([1, 2, 3, 4, 5]) should be [1, 9, 25]',
        check: (code, squareOdds) => safely(() => JSON.stringify(squareOdds([1, 2, 3, 4, 5])) === '[1,9,25]')
      },
      {
        description: 'Should return [] when there are no odd numbers',
        check: (code, squareOdds) => safely(() => squareOdds([2, 4]).length === 0)
      }
    ],
    hints: ['n % 2 !== 0 identifies odd numbers', 'Chain .filter(...).map(...)']
  },
  {
    id: 3,
    title: 'Function Factory',
    difficulty: 'easy',
    description:
      'Write makeGreeter(greeting) that returns a function taking a name and returning "<greeting>, <name>!".',
    template: `
function makeGreeter(greeting) {
  // Return a function that uses 'greeting' via closure
}
    `,
    tests: [
      {
        description: 'makeGreeter should return a function',
        check: (code, makeGreeter) => safely(() => typeof makeGreeter('Hi') === 'function')
      },
      {
        description: 'The returned function should format the greeting',
        check: (code, makeGreeter) => safely(() => makeGreeter('Hello')('Ada') === 'Hello, Ada!')
      }
    ],
    hints: ['The inner function closes over the greeting parameter']
  },
  {
    id: 4,
    title: 'Implement pipe',
    difficulty: 'medium',
    description:
      'Implement pipe(...fns) that returns a function applying each fn left-to-right to its input. pipe() with no functions should return the identity function.',
    template: `
function pipe(...fns) {
  // Your code here (hint: reduce)
}
    `,
    tests: [
      {
        description: 'pipe(add1, double)(5) should be 12',
        check: (code, pipeFn) =>
          safely(
            () =>
              pipeFn(
                x => x + 1,
                x => x * 2
              )(5) === 12
          )
      },
      {
        description: 'pipe() should be the identity',
        check: (code, pipeFn) => safely(() => pipeFn()(7) === 7)
      }
    ],
    hints: ['fns.reduce((acc, fn) => fn(acc), input)']
  },
  {
    id: 5,
    title: 'Group and Count with reduce',
    difficulty: 'medium',
    description:
      'Write countBy(items, fn) that returns an object mapping each result of fn(item) to the number of items producing it, e.g. countBy([1,2,3], n => n % 2 ? "odd" : "even") -> { odd: 2, even: 1 }.',
    template: `
function countBy(items, fn) {
  // Your code here (use reduce with an object accumulator)
}
    `,
    tests: [
      {
        description: 'Should count by the derived key',
        check: (code, countBy) =>
          safely(() => {
            const out = countBy([1, 2, 3], n => (n % 2 ? 'odd' : 'even'));
            return out.odd === 2 && out.even === 1;
          })
      },
      {
        description: 'Should return {} for an empty array',
        check: (code, countBy) => safely(() => Object.keys(countBy([], x => x)).length === 0)
      }
    ],
    hints: ['Always pass {} as the initial value', 'Use (acc[key] ?? 0) + 1']
  },
  {
    id: 6,
    title: 'Memoize a Pure Function',
    difficulty: 'medium',
    description:
      'Implement memoize(fn) so that repeated calls with the same arguments return a cached result instead of calling fn again. Support any number of primitive arguments.',
    template: `
function memoize(fn) {
  // Use a Map keyed by the serialised arguments
}
    `,
    tests: [
      {
        description: 'Should return the correct result',
        check: (code, memoizeFn) => safely(() => memoizeFn((a, b) => a + b)(2, 3) === 5)
      },
      {
        description: 'Should call the underlying function only once per argument set',
        check: (code, memoizeFn) =>
          safely(() => {
            let calls = 0;
            const m = memoizeFn(n => {
              calls += 1;
              return n * n;
            });
            m(4);
            m(4);
            m(5);
            return calls === 2;
          })
      }
    ],
    hints: ['JSON.stringify(args) makes a usable cache key for primitives', 'Check cache.has(key) before computing']
  },
  {
    id: 7,
    title: 'Curry with Arbitrary Arity',
    difficulty: 'hard',
    description:
      'Implement curry(fn) that works for functions of any fixed arity: curry(f)(1)(2)(3), curry(f)(1, 2)(3), and curry(f)(1, 2, 3) must all equal f(1, 2, 3).',
    template: `
function curry(fn) {
  // Use fn.length to know how many arguments are needed
}
    `,
    tests: [
      {
        description: 'All call shapes should produce the same result',
        check: (code, curryFn) =>
          safely(() => {
            const f = curryFn((a, b, c) => a + b + c);
            return f(1)(2)(3) === 6 && f(1, 2)(3) === 6 && f(1, 2, 3) === 6;
          })
      },
      {
        description: 'Partial applications should be reusable',
        check: (code, curryFn) =>
          safely(() => {
            const addFn = curryFn((a, b) => a + b);
            const add10 = addFn(10);
            return add10(1) === 11 && add10(2) === 12;
          })
      }
    ],
    hints: ['Recursively accumulate arguments until args.length >= fn.length']
  },
  {
    id: 8,
    title: 'Immutable Nested Update',
    difficulty: 'hard',
    description:
      'Implement setIn(obj, path, value) that returns a new object with the value set at the given key path, copying only the objects along the path and sharing everything else structurally.',
    template: `
function setIn(obj, path, value) {
  // Recursive: copy one level, recurse into the next key
}
    `,
    tests: [
      {
        description: 'Should set a nested value without mutating the original',
        check: (code, setInFn) =>
          safely(() => {
            const src = { a: { b: { c: 1 } }, x: { y: 2 } };
            const out = setInFn(src, ['a', 'b', 'c'], 9);
            return out.a.b.c === 9 && src.a.b.c === 1;
          })
      },
      {
        description: 'Untouched branches should be shared, not copied',
        check: (code, setInFn) =>
          safely(() => {
            const src = { a: { b: 1 }, x: { y: 2 } };
            const out = setInFn(src, ['a', 'b'], 3);
            return out.x === src.x && out.a !== src.a;
          })
      }
    ],
    hints: [
      'Base case: path is empty, return value',
      'const [head, ...rest] = path; return { ...obj, [head]: setIn(obj[head], rest, value) }'
    ]
  },
  {
    id: 9,
    title: 'Transducer-style Single-Pass Pipeline',
    difficulty: 'hard',
    description:
      'Write processOrders(orders) that, in a single reduce pass (no intermediate arrays), returns { revenue, count } for paid orders whose total is at least 50.',
    template: `
function processOrders(orders) {
  // One reduce call: filter (paid && total >= 50), map to total, sum and count
}
    `,
    tests: [
      {
        description: 'Should compute revenue and count in one pass',
        check: (code, processOrders) =>
          safely(() => {
            const out = processOrders([
              { total: 120, paid: true },
              { total: 30, paid: true },
              { total: 80, paid: false },
              { total: 50, paid: true }
            ]);
            return out.revenue === 170 && out.count === 2;
          })
      },
      {
        description: 'Should return zeros for an empty input',
        check: (code, processOrders) =>
          safely(() => {
            const out = processOrders([]);
            return out.revenue === 0 && out.count === 0;
          })
      }
    ],
    hints: [
      'The accumulator can be an object: { revenue: 0, count: 0 }',
      'Return the accumulator unchanged when an order does not qualify'
    ]
  }
];

// Progress tracking
export const progressConfig = {
  totalConcepts: 3,
  conceptsCompleted: 0,
  exercises: {
    total: exercises.length,
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
      overallProgress:
        ((this.conceptsCompleted + this.exercises.completed) / (this.totalConcepts + this.exercises.total)) * 100
    };
  }
};

// Export all concepts
export default {
  config: functionalConfig,
  concepts: {
    pureFunctions,
    higherOrderFunctions,
    mapFilterReduce
  },
  exercises,
  progress: progressConfig
};
