// tests/setup.js - Jest Test Setup Configuration

// Mock browser APIs that aren't available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {}

  unobserve() {}

  disconnect() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock canvas context
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  setTransform: jest.fn(),
  resetTransform: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  measureText: jest.fn(() => ({ width: 0 })),
  drawImage: jest.fn()
}));

// Minimal User Timing (mark/measure) polyfill - jsdom's performance object
// only implements now()/timeOrigin. Only the missing methods are installed.
(() => {
  const perf = global.performance;
  if (!perf || typeof perf.mark === 'function') return;

  const entries = [];
  const makeEntry = (name, entryType, startTime, duration) => ({
    name,
    entryType,
    startTime,
    duration,
    toJSON() {
      return { name, entryType, startTime, duration };
    }
  });
  const lastByName = (name, entryType) => {
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].name === name && entries[i].entryType === entryType) {
        return entries[i];
      }
    }
    return null;
  };
  const remove = (entryType, name) => {
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].entryType === entryType && (name === undefined || entries[i].name === name)) {
        entries.splice(i, 1);
      }
    }
  };

  perf.mark = name => {
    const entry = makeEntry(name, 'mark', perf.now(), 0);
    entries.push(entry);
    return entry;
  };
  perf.measure = (name, startMark, endMark) => {
    const start = startMark ? lastByName(startMark, 'mark') : null;
    const end = endMark ? lastByName(endMark, 'mark') : null;
    if ((startMark && !start) || (endMark && !end)) {
      throw new DOMException(`Mark '${startMark || endMark}' does not exist.`, 'SyntaxError');
    }
    const startTime = start ? start.startTime : 0;
    const endTime = end ? end.startTime : perf.now();
    const entry = makeEntry(name, 'measure', startTime, endTime - startTime);
    entries.push(entry);
    return entry;
  };
  perf.clearMarks = name => remove('mark', name);
  perf.clearMeasures = name => remove('measure', name);
  perf.getEntries = () => entries.slice();
  perf.getEntriesByType = type => entries.filter(e => e.entryType === type);
  perf.getEntriesByName = (name, type) =>
    entries.filter(e => e.name === name && (type === undefined || e.entryType === type));
})();

// Minimal PerformanceObserver mock (jsdom does not provide one)
if (typeof global.PerformanceObserver === 'undefined') {
  global.PerformanceObserver = class PerformanceObserver {
    static get supportedEntryTypes() {
      return ['mark', 'measure'];
    }

    constructor(callback) {
      this.callback = callback;
    }

    observe() {}

    disconnect() {}

    takeRecords() {
      return [];
    }
  };
}

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(() => Promise.resolve()),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  volume: 1
}));

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};

// Setup custom matchers if needed
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  }
});
