// File: src/concepts/es6/destructuring.js
// ES6 Destructuring - Array and Object destructuring patterns

export const destructuringConfig = {
  title: "ES6 Destructuring",
  description: "Master destructuring assignment for arrays and objects",
  difficulty: "intermediate",
  estimatedTime: "25 minutes"
};

// Object Destructuring
export const objectDestructuring = {
  concept: "Object Destructuring",
  explanation: `
    Object destructuring allows you to extract properties from objects into distinct variables.
    It provides a clean and readable way to access object properties.
  `,
  
  examples: {
    basicObjectDestructuring: `
// Basic object destructuring
const user = {
  id: 123,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  city: 'New York'
};

// Traditional way
const id = user.id;
const name = user.name;
const email = user.email;

// Destructuring way
const { id: userId, name: userName, email: userEmail } = user;
console.log(userId, userName, userEmail); // 123, Alice Johnson, alice@example.com

// Shorthand when variable names match property names
const { age, city } = user;
console.log(age, city); // 28, New York

// Multiple properties at once
const { id, name, email, age, city } = user;

// Destructuring with default values
const { country = 'USA', phone = 'Not provided' } = user;
console.log(country, phone); // USA, Not provided

// Mixed with renaming and defaults
const { name: fullName, department = 'Engineering' } = user;
console.log(fullName, department); // Alice Johnson, Engineering
    `,
    
    nestedObjectDestructuring: `
// Nested object destructuring
const employee = {
  id: 456,
  personal: {
    name: 'Bob Smith',
    age: 32,
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101'
    }
  },
  work: {
    title: 'Senior Developer',
    department: 'Engineering',
    salary: 95000,
    skills: ['JavaScript', 'React', 'Node.js']
  }
};

// Nested destructuring
const {
  personal: {
    name,
    age,
    address: {
      street,
      city,
      state
    }
  },
  work: {
    title,
    department,
    skills
  }
} = employee;

console.log(name, age, street, city, state); // Bob Smith, 32, 123 Main St, Boston, MA
console.log(title, department, skills); // Senior Developer, Engineering, ['JavaScript', 'React', 'Node.js']

// Partial nested destructuring with renaming
const {
  personal: { name: employeeName },
  work: { title: jobTitle, salary }
} = employee;

console.log(employeeName, jobTitle, salary); // Bob Smith, Senior Developer, 95000

// Deep nested destructuring with defaults
const {
  personal: {
    address: {
      country = 'USA',
      zipCode: postal
    }
  },
  work: {
    manager = 'TBD'
  }
} = employee;

console.log(country, postal, manager); // USA, 02101, TBD
    `,
    
    dynamicPropertyDestructuring: `
// Dynamic property destructuring
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retryAttempts: 3,
  enableLogging: true
};

// Using computed property names
const propertyName = 'apiUrl';
const { [propertyName]: url } = config;
console.log(url); // https://api.example.com

// Multiple dynamic properties
const props = ['timeout', 'retryAttempts'];
const { [props[0]]: requestTimeout, [props[1]]: maxRetries } = config;
console.log(requestTimeout, maxRetries); // 5000, 3

// Function to extract specific properties
function extractProperties(obj, ...properties) {
  const result = {};
  properties.forEach(prop => {
    if (prop in obj) {
      result[prop] = obj[prop];
    }
  });
  return result;
}

// Usage
const extracted = extractProperties(config, 'apiUrl', 'timeout', 'nonExistent');
console.log(extracted); // { apiUrl: 'https://api.example.com', timeout: 5000 }

// Destructuring with computed properties and defaults
const getConfigValue = (obj, key, defaultValue) => {
  const { [key]: value = defaultValue } = obj;
  return value;
};

console.log(getConfigValue(config, 'timeout', 3000)); // 5000
console.log(getConfigValue(config, 'maxConnections', 10)); // 10
    `
  }
};

// Array Destructuring
export const arrayDestructuring = {
  concept: "Array Destructuring",
  explanation: `
    Array destructuring allows you to unpack values from arrays into distinct variables.
    It's based on position rather than property names.
  `,
  
  examples: {
    basicArrayDestructuring: `
// Basic array destructuring
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

// Traditional way
const first = colors[0];
const second = colors[1];
const third = colors[2];

// Destructuring way
const [firstColor, secondColor, thirdColor] = colors;
console.log(firstColor, secondColor, thirdColor); // red, green, blue

// Skipping elements
const [primary, , secondary] = colors; // Skip green
console.log(primary, secondary); // red, blue

// Partial destructuring
const [red, green] = colors;
console.log(red, green); // red, green

// With default values
const [r, g, b, y, p, orange = 'orange'] = colors;
console.log(orange); // orange

// Destructuring with fewer elements than array length
const [main, accent] = colors;
console.log(main, accent); // red, green

// Empty array destructuring
const empty = [];
const [a = 'default', b = 'fallback'] = empty;
console.log(a, b); // default, fallback
    `,
    
    advancedArrayDestructuring: `
// Advanced array destructuring patterns
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Rest pattern to collect remaining elements
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // 1, 2, [3, 4, 5, 6, 7, 8, 9, 10]

// Destructuring specific positions
const [a, , c, , e] = numbers; // Get 1st, 3rd, 5th elements
console.log(a, c, e); // 1, 3, 5

// Swapping variables
let x = 10;
let y = 20;
[x, y] = [y, x]; // Swap values
console.log(x, y); // 20, 10

// Multiple swaps
let p = 'alpha';
let q = 'beta';
let r = 'gamma';
[p, q, r] = [r, p, q]; // Rotate values
console.log(p, q, r); // gamma, alpha, beta

// Nested array destructuring
const matrix = [[1, 2], [3, 4], [5, 6]];
const [[firstRow1, firstRow2], [secondRow1]] = matrix;
console.log(firstRow1, firstRow2, secondRow1); // 1, 2, 3

// Destructuring arrays of objects
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const [{ name: firstName }, { name: secondName }] = users;
console.log(firstName, secondName); // Alice, Bob

// Using array destructuring with function returns
function getCoordinates() {
  return [40.7128, -74.0060]; // NYC coordinates
}

const [latitude, longitude] = getCoordinates();
console.log(\`Lat: \${latitude}, Lng: \${longitude}\`); // Lat: 40.7128, Lng: -74.0060
    `,
    
    mixedDestructuring: `
// Mixed array and object destructuring
const response = {
  status: 200,
  data: [
    { id: 1, name: 'Product A', price: 29.99 },
    { id: 2, name: 'Product B', price: 39.99 },
    { id: 3, name: 'Product C', price: 19.99 }
  ],
  meta: {
    total: 3,
    page: 1,
    hasMore: false
  }
};

// Complex destructuring
const {
  status,
  data: [firstProduct, ...otherProducts],
  meta: { total, hasMore }
} = response;

console.log(status); // 200
console.log(firstProduct); // { id: 1, name: 'Product A', price: 29.99 }
console.log(otherProducts.length); // 2
console.log(total, hasMore); // 3, false

// Destructuring function parameters with mixed patterns
function processOrder({
  orderId,
  items: [mainItem, ...additionalItems],
  customer: { name, email },
  shipping = { method: 'standard', cost: 0 }
}) {
  console.log(\`Order \${orderId} for \${name} (\${email})\`);
  console.log(\`Main item: \${mainItem.name}\`);
  console.log(\`Additional items: \${additionalItems.length}\`);
  console.log(\`Shipping: \${shipping.method} (\$\${shipping.cost})\`);
}

const order = {
  orderId: 'ORD-123',
  items: [
    { name: 'Laptop', price: 999.99 },
    { name: 'Mouse', price: 29.99 },
    { name: 'Keyboard', price: 79.99 }
  ],
  customer: {
    name: 'John Doe',
    email: 'john@example.com'
  }
};

processOrder(order);
// Output:
// Order ORD-123 for John Doe (john@example.com)
// Main item: Laptop
// Additional items: 2
// Shipping: standard ($0)
    `
  }
};

// Function Parameter Destructuring
export const parameterDestructuring = {
  concept: "Function Parameter Destructuring",
  explanation: `
    Destructuring can be used directly in function parameters to extract values
    from objects or arrays passed as arguments.
  `,
  
  examples: {
    objectParameterDestructuring: `
// Object parameter destructuring
function createUser({ name, email, age = 18, role = 'user' }) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    age,
    role,
    createdAt: new Date().toISOString()
  };
}

// Usage
const userData = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28
};

const newUser = createUser(userData);
console.log(newUser);

// Destructuring with nested objects
function updateProfile({
  userId,
  updates: {
    personal: { name, age } = {},
    work: { title, department } = {}
  } = {}
}) {
  console.log(\`Updating user \${userId}\`);
  if (name) console.log(\`New name: \${name}\`);
  if (age) console.log(\`New age: \${age}\`);
  if (title) console.log(\`New title: \${title}\`);
  if (department) console.log(\`New department: \${department}\`);
}

updateProfile({
  userId: 123,
  updates: {
    personal: { name: 'Bob Smith' },
    work: { title: 'Senior Developer' }
  }
});

// API endpoint handler example
function handleApiRequest({
  method = 'GET',
  url,
  headers = {},
  body = null,
  timeout = 5000,
  retries = 3
}) {
  console.log(\`\${method} request to \${url}\`);
  console.log(\`Timeout: \${timeout}ms, Retries: \${retries}\`);
  
  // Simulate API logic
  return {
    method,
    url,
    headers,
    body,
    config: { timeout, retries }
  };
}

const apiCall = handleApiRequest({
  url: '/api/users',
  method: 'POST',
  body: { name: 'New User' },
  headers: { 'Content-Type': 'application/json' }
});
    `,
    
    arrayParameterDestructuring: `
// Array parameter destructuring
function calculateDistance([x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

const pointA = [0, 0];
const pointB = [3, 4];
const distance = calculateDistance(pointA, pointB);
console.log(distance); // 5

// Rest parameters with destructuring
function processData([first, second, ...remaining]) {
  console.log('First:', first);
  console.log('Second:', second);
  console.log('Remaining count:', remaining.length);
  return {
    primary: first,
    secondary: second,
    others: remaining
  };
}

const data = [1, 2, 3, 4, 5, 6, 7];
const result = processData(data);
console.log(result);

// Matrix operations
function multiplyMatrices(
  [[a11, a12], [a21, a22]], // Matrix A
  [[b11, b12], [b21, b22]]  // Matrix B
) {
  return [
    [a11 * b11 + a12 * b21, a11 * b12 + a12 * b22],
    [a21 * b11 + a22 * b21, a21 * b12 + a22 * b22]
  ];
}

const matrixA = [[1, 2], [3, 4]];
const matrixB = [[5, 6], [7, 8]];
const product = multiplyMatrices(matrixA, matrixB);
console.log(product); // [[19, 22], [43, 50]]
    `,
    
    mixedParameterDestructuring: `
// Mixed parameter destructuring
function createChart({
  title,
  data: [labels, values],
  options: {
    width = 400,
    height = 300,
    colors = ['#007bff', '#28a745', '#dc3545']
  } = {}
}) {
  return {
    config: {
      title,
      labels,
      values,
      width,
      height,
      colors
    },
    render() {
      console.log(\`Rendering chart: "\${title}"\`);
      console.log(\`Dimensions: \${width}x\${height}\`);
      console.log(\`Data points: \${values.length}\`);
    }
  };
}

const chartData = {
  title: 'Monthly Sales',
  data: [
    ['Jan', 'Feb', 'Mar', 'Apr'],
    [1200, 1500, 1800, 1650]
  ],
  options: {
    width: 800,
    colors: ['#ff6384', '#36a2eb', '#ffce56']
  }
};

const chart = createChart(chartData);
chart.render();

// Error handling with destructuring
function handleApiError({
  status,
  message,
  details: {
    code,
    field = null,
    suggestions = []
  } = {}
}) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  
  if (field) {
    console.log(\`Validation error in field: \${field}\`);
  }
  
  if (suggestions.length > 0) {
    console.log('Suggestions:', suggestions.join(', '));
  }
  
  return error;
}

const errorData = {
  status: 400,
  message: 'Validation failed',
  details: {
    code: 'INVALID_EMAIL',
    field: 'email',
    suggestions: ['Check email format', 'Ensure @ symbol is present']
  }
};

const apiError = handleApiError(errorData);
console.log(apiError.message, apiError.status);
    `
  }
};

// Practical Destructuring Patterns
export const practicalPatterns = {
  concept: "Practical Destructuring Patterns",
  explanation: `
    Real-world examples and patterns where destructuring provides clean,
    readable solutions to common programming tasks.
  `,
  
  examples: {
    reactPatterns: `
// React-style destructuring patterns (conceptual examples)
function UserProfile({ user: { name, avatar, email }, isEditable = false }) {
  // Component logic using destructured props
  return {
    template: \`
      <div class="user-profile">
        <img src="\${avatar}" alt="\${name}">
        <h2>\${name}</h2>
        <p>\${email}</p>
        \${isEditable ? '<button>Edit</button>' : ''}
      </div>
    \`
  };
}

// State management patterns
function useUserState() {
  const state = {
    user: { name: 'John', email: 'john@example.com' },
    loading: false,
    error: null
  };
  
  const actions = {
    setUser: (userData) => ({ ...state, user: userData }),
    setLoading: (loading) => ({ ...state, loading }),
    setError: (error) => ({ ...state, error })
  };
  
  return [state, actions];
}

// Hook-style destructuring
const [{ user, loading, error }, { setUser, setLoading, setError }] = useUserState();

// Custom hook pattern
function useApiData(url) {
  const [{ data, loading, error }, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  // Simulated effect
  setTimeout(() => {
    setState({ data: { id: 1, name: 'Sample' }, loading: false, error: null });
  }, 1000);
  
  return { data, loading, error, refetch: () => setState(prev => ({ ...prev, loading: true })) };
}

function useState(initialState) {
  let state = initialState;
  const setState = (newState) => {
    state = typeof newState === 'function' ? newState(state) : newState;
  };
  return [state, setState];
}
    `,
    
    apiResponseHandling: `
// API response handling with destructuring
async function fetchUserDashboard(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}/dashboard\`);
    const {
      user: { name, email, avatar },
      stats: { totalPosts, totalLikes, totalComments },
      recentActivity: [latestPost, ...otherPosts],
      notifications: { unread = 0, messages = [] } = {}
    } = await response.json();
    
    return {
      profile: { name, email, avatar },
      statistics: { totalPosts, totalLikes, totalComments },
      latest: latestPost,
      otherActivity: otherPosts,
      notificationCount: unread,
      pendingMessages: messages
    };
    
  } catch (error) {
    console.error('Failed to fetch dashboard:', error.message);
    return null;
  }
}

// GraphQL-style response handling
function handleGraphQLResponse({
  data: {
    user: {
      id,
      profile: { firstName, lastName, bio },
      posts: { edges: postEdges, pageInfo: { hasNextPage, endCursor } }
    }
  } = {},
  errors = []
}) {
  if (errors.length > 0) {
    throw new Error(\`GraphQL errors: \${errors.map(e => e.message).join(', ')}\`);
  }
  
  const posts = postEdges.map(({ node }) => node);
  
  return {
    user: {
      id,
      name: \`\${firstName} \${lastName}\`,
      bio
    },
    posts,
    pagination: { hasNextPage, endCursor }
  };
}

// REST API pagination pattern
function processPaginatedResponse({
  data: items = [],
  pagination: {
    page = 1,
    totalPages = 1,
    totalItems = 0,
    hasNext = false,
    hasPrev = false
  } = {},
  meta: { timestamp, version = '1.0' } = {}
}) {
  return {
    items,
    currentPage: page,
    totalPages,
    totalItems,
    navigation: { hasNext, hasPrev },
    metadata: { timestamp, version }
  };
}
    `,
    
    configurationManagement: `
// Configuration management with destructuring
function initializeApp({
  api: {
    baseUrl,
    timeout = 5000,
    retries = 3,
    endpoints: {
      auth = '/auth',
      users = '/users',
      posts = '/posts'
    } = {}
  },
  ui: {
    theme = 'light',
    language = 'en',
    features: {
      darkMode = true,
      notifications = true,
      analytics = false
    } = {}
  } = {},
  debug: {
    enableLogging = false,
    logLevel = 'info',
    enableProfiling = false
  } = {}
}) {
  const config = {
    api: {
      baseUrl,
      timeout,
      retries,
      endpoints: { auth, users, posts }
    },
    ui: {
      theme,
      language,
      features: { darkMode, notifications, analytics }
    },
    debug: {
      enableLogging,
      logLevel,
      enableProfiling
    }
  };
  
  console.log('App initialized with config:', config);
  return config;
}

// Environment-specific configuration
function loadEnvironmentConfig() {
  const config = {
    development: {
      api: { baseUrl: 'http://localhost:3000' },
      debug: { enableLogging: true, logLevel: 'debug' }
    },
    production: {
      api: { baseUrl: 'https://api.example.com' },
      debug: { enableLogging: false }
    }
  };
  
  const environment = 'development'; // Could be from process.env
  const {
    [environment]: envConfig = {},
    common: commonConfig = {}
  } = { ...config, common: { ui: { theme: 'light' } } };
  
  return { ...commonConfig, ...envConfig };
}

// Database query result processing
function processQueryResults({
  rows = [],
  metadata: {
    affectedRows = 0,
    insertId = null,
    warningCount = 0
  } = {},
  error = null
}) {
  if (error) {
    throw new Error(\`Database error: \${error.message}\`);
  }
  
  return {
    success: true,
    data: rows,
    stats: { affectedRows, insertId, warningCount },
    isEmpty: rows.length === 0
  };
}
    `,
    
    eventHandling: `
// Event handling with destructuring
function handleFormSubmit({
  target: form,
  preventDefault,
  stopPropagation
}) {
  preventDefault();
  stopPropagation();
  
  const formData = new FormData(form);
  const {
    name = '',
    email = '',
    message = ''
  } = Object.fromEntries(formData);
  
  // Validate and process form data
  const errors = [];
  if (!name.trim()) errors.push('Name is required');
  if (!email.includes('@')) errors.push('Valid email is required');
  if (!message.trim()) errors.push('Message is required');
  
  return { data: { name, email, message }, errors };
}

// Mouse event handling
function handleMouseEvent({
  type,
  clientX: x,
  clientY: y,
  target: { tagName, id, classList },
  ctrlKey,
  shiftKey,
  altKey
}) {
  const eventData = {
    eventType: type,
    position: { x, y },
    element: { tag: tagName, id, classes: Array.from(classList) },
    modifiers: { ctrl: ctrlKey, shift: shiftKey, alt: altKey }
  };
  
  console.log('Mouse event:', eventData);
  return eventData;
}

// Keyboard event handling with key combinations
function handleKeyEvent({
  key,
  code,
  ctrlKey,
  shiftKey,
  altKey,
  metaKey,
  repeat,
  target
}) {
  const modifiers = [];
  if (ctrlKey) modifiers.push('Ctrl');
  if (shiftKey) modifiers.push('Shift');
  if (altKey) modifiers.push('Alt');
  if (metaKey) modifiers.push('Meta');
  
  const shortcut = modifiers.length > 0 ? \`\${modifiers.join('+')}+\${key}\` : key;
  
  // Handle common shortcuts
  const shortcuts = {
    'Ctrl+s': () => console.log('Save action'),
    'Ctrl+c': () => console.log('Copy action'),
    'Ctrl+v': () => console.log('Paste action'),
    'Ctrl+z': () => console.log('Undo action'),
    'Escape': () => console.log('Cancel action')
  };
  
  if (shortcuts[shortcut]) {
    shortcuts[shortcut]();
    return true; // Handled
  }
  
  return false; // Not handled
}

// WebSocket message handling
function handleWebSocketMessage({
  data,
  type = 'message',
  timestamp = Date.now(),
  origin
}) {
  try {
    const {
      event,
      payload: {
        user = null,
        message = null,
        data: messageData = null
      } = {},
      id = null
    } = JSON.parse(data);
    
    const messageHandlers = {
      'user-joined': ({ user }) => console.log(\`\${user.name} joined the chat\`),
      'user-left': ({ user }) => console.log(\`\${user.name} left the chat\`),
      'new-message': ({ user, message }) => console.log(\`\${user.name}: \${message}\`),
      'system-update': ({ data }) => console.log('System update:', data)
    };
    
    const handler = messageHandlers[event];
    if (handler) {
      handler({ user, message, data: messageData });
    }
    
    return { event, payload: { user, message, data: messageData }, id };
    
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error);
    return null;
  }
}
    `
  }
};

// Export all concepts
export default {
  config: destructuringConfig,
  concepts: {
    objectDestructuring,
    arrayDestructuring,
    parameterDestructuring,
    practicalPatterns
  }
};