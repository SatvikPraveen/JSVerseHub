// File: src/concepts/api/index.js
// API Integration Fundamentals - Fetch, REST, Async Data

/**
 * API Integration Configuration
 */
export const apiConfig = {
  title: "API Integration",
  description: "Master API interactions, REST principles, and async data fetching",
  difficulty: "intermediate-advanced",
  estimatedTime: "120 minutes",
  topics: [
    "HTTP Basics",
    "Fetch API",
    "REST Principles",
    "Error Handling",
    "Authentication",
    "Response Processing"
  ],
  prerequisites: ["JavaScript Basics", "Async/Await", "JSON"],
  learningObjectives: [
    "Understand HTTP methods and status codes",
    "Use Fetch API for data requests",
    "Apply REST principles correctly",
    "Handle errors and edge cases",
    "Work with APIs requiring authentication",
    "Parse and transform API responses"
  ]
};

/**
 * HTTP Basics
 */
export const httpBasics = {
  concept: "HTTP Basics",
  explanation: `
    HTTP (HyperText Transfer Protocol) is the foundation of web communication.
    
    HTTP Methods (verbs):
    - GET: Retrieve data (safe, idempotent)
    - POST: Create new data (not idempotent)
    - PUT: Replace entire resource (idempotent)
    - PATCH: Partial update (idempotent)
    - DELETE: Remove data (idempotent)
    - HEAD: Like GET but no response body
    - OPTIONS: Describe communication options
    
    HTTP Status Codes:
    - 1xx: Information
    - 2xx: Success (200 OK, 201 Created, 204 No Content)
    - 3xx: Redirection (301 Moved, 304 Not Modified)
    - 4xx: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)
    - 5xx: Server Error (500 Internal Error, 503 Service Unavailable)
    
    Request Structure:
    - Method: GET, POST, etc.
    - URL: Endpoint to request
    - Headers: Metadata (Content-Type, Authorization)
    - Body: Data (for POST, PUT, PATCH)
    
    Response Structure:
    - Status Code: Success indicator
    - Headers: Response metadata
    - Body: Response data
  `,
  
  examples: {
    httpMethods: `
// Different HTTP methods for different operations

// GET - Retrieve data
GET /api/users/1
// Returns: User object

// POST - Create new
POST /api/users
Content-Type: application/json
Body: { "name": "John", "email": "john@example.com" }
// Returns: Created user with id

// PUT - Replace entire resource
PUT /api/users/1
Body: { "name": "Jane", "email": "jane@example.com", "age": 30 }
// Returns: Updated user

// PATCH - Partial update
PATCH /api/users/1
Body: { "name": "Jane" }
// Returns: Updated user (other fields preserved)

// DELETE - Remove
DELETE /api/users/1
// Returns: 204 No Content

// HEAD - Check without body
HEAD /api/users
// Returns: Headers only, no body
    `,
    
    statusCodes: `
// Understanding HTTP status codes

200 OK
// Request successful, data in response

201 Created
// Resource successfully created

204 No Content
// Success but no response body

400 Bad Request
// Client error: invalid request format
{ "error": "Invalid email format" }

401 Unauthorized
// Authentication required
{ "error": "Missing authentication token" }

403 Forbidden
// Authenticated but not authorized
{ "error": "Access denied" }

404 Not Found
// Resource doesn't exist
{ "error": "User not found" }

500 Internal Server Error
// Server error
{ "error": "Database connection failed" }

503 Service Unavailable
// Server temporarily down
{ "error": "Service under maintenance" }
    `,
    
    headersConcept: `
// HTTP headers provide metadata

REQUEST HEADERS:
Content-Type: application/json
// Tells server we're sending JSON

Authorization: Bearer token123
// Authentication credential

Accept: application/json
// Tell server we want JSON response

User-Agent: Mozilla/5.0...
// Identifies the client

Cache-Control: no-cache
// Caching instructions

RESPONSE HEADERS:
Content-Type: application/json
// Format of response body

Content-Length: 1234
// Size of response body

Set-Cookie: session=abc123
// Store cookie on client

X-RateLimit-Limit: 100
// Custom header: rate limit info

Access-Control-Allow-Origin: *
// CORS: who can access this
    `
  }
};

/**
 * Fetch API Fundamentals
 */
export const fetchApi = {
  concept: "Fetch API",
  explanation: `
    Fetch API provides a modern way to make HTTP requests using Promises.
    
    Basic syntax:
    fetch(url, options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
    
    Options parameter includes:
    - method: 'GET', 'POST', etc. (default: 'GET')
    - headers: Object with headers
    - body: Request body (string or FormData)
    - mode: 'cors', 'no-cors', etc.
    - credentials: 'include' for cookies
    - cache: 'default', 'no-cache', etc.
  `,
  
  examples: {
    basicFetch: `
// Basic GET request
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Users:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

// Same with async/await (more readable)
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Users:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

getUsers();
    `,
    
    postRequest: `
// POST request to create data
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(\`Failed to create user: \${response.status}\`);
    }
    
    const newUser = await response.json();
    console.log('Created user:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error:', error);
  }
}

createUser({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
    `,
    
    requestOptions: `
// Fetch with various options
async function fetchWithOptions(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
    credentials: 'include', // Include cookies
    mode: 'cors',
    cache: 'default',
    timeout: 5000 // 5 second timeout
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      finalOptions.timeout
    );
    
    const response = await fetch(url, {
      ...finalOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
    `,
    
    handleResponse: `
// Handle different response types
async function processResponse(response) {
  // Check response status
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  // Check content type
  const contentType = response.headers.get('content-type');
  
  if (contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType.includes('text/')) {
    return await response.text();
  } else if (contentType.includes('image/')) {
    return await response.blob();
  } else {
    return await response.arrayBuffer();
  }
}

// Usage
const data = await fetch(url).then(processResponse);
    `
  }
};

/**
 * REST Principles
 */
export const restPrinciples = {
  concept: "REST (Representational State Transfer)",
  explanation: `
    REST is an architectural style for designing web APIs.
    
    REST Principles:
    1. Client-Server: Separation of concerns
    2. Statelessness: Each request is independent
    3. Uniform Interface: Consistent API design
    4. Cacheability: Responses can be cached
    5. Layered System: Architecture can have intermediaries
    6. Code on Demand: Optional, rarely used
    
    RESTful URLs:
    - Resources are nouns: /users, /posts, /comments
    - Use HTTP methods: GET, POST, PUT, DELETE
    - Hierarchical: /users/123/posts/456
    - Use IDs: /users/1 not /users/getById/1
    - Plural for collections: /users not /user
  `,
  
  examples: {
    restfulUrls: `
// RESTful URL patterns

// Collection operations
GET    /api/users           // List all users
POST   /api/users           // Create new user
GET    /api/users/1         // Get specific user
PUT    /api/users/1         // Replace user
PATCH  /api/users/1         // Update user
DELETE /api/users/1         // Delete user

// Nested resources
GET    /api/users/1/posts            // User's posts
POST   /api/users/1/posts            // Create post for user
GET    /api/users/1/posts/456        // Specific post
DELETE /api/users/1/posts/456        // Delete user's post

// Query parameters
GET    /api/users?page=2&limit=20    // Pagination
GET    /api/users?sort=name          // Sorting
GET    /api/users?filter=active      // Filtering
GET    /api/users?search=john        // Search

// Versioning (optional)
GET    /api/v1/users                 // API version 1
GET    /api/v2/users                 // API version 2
    `,
    
    requestResponse: `
// RESTful request/response examples

// CREATE - POST /api/users
REQUEST:
POST /api/users HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

RESPONSE: 201 Created
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// READ - GET /api/users/123
REQUEST:
GET /api/users/123 HTTP/1.1

RESPONSE: 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// UPDATE - PATCH /api/users/123
REQUEST:
PATCH /api/users/123 HTTP/1.1
Content-Type: application/json

{
  "email": "john.doe@example.com"
}

RESPONSE: 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "updatedAt": "2024-01-15T11:00:00Z"
}

// DELETE - DELETE /api/users/123
REQUEST:
DELETE /api/users/123 HTTP/1.1

RESPONSE: 204 No Content
(Empty body)
    `
  }
};

/**
 * Error Handling in APIs
 */
export const apiErrorHandling = {
  concept: "API Error Handling",
  explanation: `
    Proper error handling is critical for robust applications.
    
    Error types:
    1. Network Errors: No internet, server down
    2. HTTP Errors: 4xx, 5xx responses
    3. Data Errors: Invalid JSON, wrong format
    4. Timeout Errors: Request takes too long
    5. CORS Errors: Cross-origin restrictions
    
    Best practices:
    - Check response.ok before processing
    - Handle each error type specifically
    - Provide user-friendly error messages
    - Log errors for debugging
    - Implement retry logic for transient errors
  `,
  
  examples: {
    errorHandling: `
// Comprehensive error handling
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // Check HTTP status
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 400:
          throw new Error(\`Bad request: \${errorData.message}\`);
        case 401:
          throw new Error('Authentication failed. Please log in.');
        case 403:
          throw new Error('You do not have permission.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error('Server error. Try again later.');
        default:
          throw new Error(\`Error: \${response.status} \${response.statusText}\`);
      }
    }
    
    // Parse response
    return await response.json();
    
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError) {
      // Network error
      console.error('Network error:', error);
      throw new Error('Network connection failed. Check your internet.');
    } else if (error instanceof SyntaxError) {
      // JSON parsing error
      console.error('JSON error:', error);
      throw new Error('Invalid response format from server.');
    } else {
      // Known errors
      console.error('API error:', error);
      throw error;
    }
  }
}
    `,
    
    retryLogic: `
// Retry failed requests
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt
      if (attempt === maxRetries - 1) break;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.log(\`Attempt \${attempt + 1} failed. Retrying in \${delay}ms...\`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
    `,
    
    timeouts: `
// Implement request timeout
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Or using AbortController
async function fetchWithAbort(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
    `
  }
};

/**
 * Authentication
 */
export const authentication = {
  concept: "API Authentication",
  explanation: `
    Authentication verifies user identity. Common methods:
    
    1. No Auth: Public APIs (limited functionality)
    2. API Keys: Simple token sent in headers or query
    3. Basic Auth: Username:password in header
    4. Bearer Token: Token in Authorization header
    5. OAuth: Third-party authentication
    6. JWT: Self-contained token with claims
    
    Always:
    - Use HTTPS (not HTTP)
    - Never expose tokens in URLs
    - Store tokens securely
    - Refresh tokens periodically
    - Validate tokens server-side
  `,
  
  examples: {
    authMethods: `
// API Key authentication
async function fetchWithApiKey(url, apiKey) {
  const response = await fetch(\`\${url}?api_key=\${apiKey}\`);
  // Or in header:
  // const response = await fetch(url, {
  //   headers: { 'X-API-Key': apiKey }
  // });
  return response.json();
}

// Bearer Token (JWT, OAuth)
async function fetchWithBearer(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Basic Authentication
async function fetchWithBasicAuth(url, username, password) {
  const credentials = btoa(\`\${username}:\${password}\`);
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Basic \${credentials}\`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// OAuth 2.0 flow
async function getOAuthToken(clientId, clientSecret, code) {
  const response = await fetch('https://oauth.provider.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'https://yourapp.com/callback'
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
    `,
    
    tokenStorage: `
// Secure token storage and management
class TokenManager {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.expiresAt = null;
  }
  
  setTokens(accessToken, refreshToken, expiresIn) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    // Set expiry time (subtract 5 minutes for safety)
    this.expiresAt = Date.now() + (expiresIn - 300) * 1000;
    
    // Store in sessionStorage (cleared on tab close)
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('expires_at', this.expiresAt);
  }
  
  getToken() {
    if (this.isTokenExpired()) {
      return null; // Token expired
    }
    return this.token;
  }
  
  isTokenExpired() {
    return Date.now() >= this.expiresAt;
  }
  
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });
    
    const data = await response.json();
    this.setTokens(data.accessToken, data.refreshToken, data.expiresIn);
    return data.accessToken;
  }
  
  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    this.expiresAt = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires_at');
  }
}
    `
  }
};

/**
 * Response Processing
 */
export const responseProcessing = {
  concept: "Response Processing",
  explanation: `
    Properly processing API responses ensures data integrity.
    
    Common tasks:
    1. Validate response structure
    2. Transform data to app format
    3. Handle pagination
    4. Cache responses
    5. Handle rate limiting
    6. Parse different content types
  `,
  
  examples: {
    dataTransformation: `
// Transform API response to app format
async function getUsers() {
  const response = await fetch('/api/users');
  const rawData = await response.json();
  
  // Transform raw API data to app format
  return rawData.data.map(user => ({
    id: user.user_id,
    name: user.full_name,
    email: user.email_address,
    avatar: user.profile_pic_url,
    createdAt: new Date(user.created_timestamp)
  }));
}

// Validate response structure
function validateUser(user) {
  if (!user || typeof user !== 'object') {
    throw new Error('Invalid user object');
  }
  
  const required = ['id', 'name', 'email'];
  for (const field of required) {
    if (!user[field]) {
      throw new Error(\`Missing required field: \${field}\`);
    }
  }
  
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  return user;
}
    `,
    
    pagination: `
// Handle paginated responses
async function getAllUsers() {
  let allUsers = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(\`/api/users?page=\${page}&limit=50\`);
    const data = await response.json();
    
    allUsers = allUsers.concat(data.users);
    
    // Check if there are more pages
    hasMore = data.hasNextPage || data.totalPages > page;
    page++;
  }
  
  return allUsers;
}

// Or using cursor-based pagination
async function getAllUsersCursor() {
  let allUsers = [];
  let cursor = null;
  
  while (true) {
    const url = cursor
      ? \`/api/users?cursor=\${cursor}\`
      : '/api/users';
    
    const response = await fetch(url);
    const data = await response.json();
    
    allUsers = allUsers.concat(data.users);
    
    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }
  
  return allUsers;
}
    `,
    
    caching: `
// Simple response caching
class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async fetch(url, options) {
    const cacheKey = url + JSON.stringify(options);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log('Serving from cache:', url);
      return cached.data;
    }
    
    // Fetch fresh data
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Store in cache
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
  
  clear() {
    this.cache.clear();
  }
}

const apiCache = new APICache();
const users = await apiCache.fetch('/api/users');
    `
  }
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: "api_ex1",
    title: "First API Request",
    difficulty: "easy",
    description: "Make your first API request using fetch",
    template: `
// Use the free JSONPlaceholder API
// https://jsonplaceholder.typicode.com

// Fetch a post with ID 1 and log it
async function getPost() {
  try {
    const url = ''; // Add the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const post = await response.json();
    console.log(post);
  } catch (error) {
    console.error(error);
  }
}

getPost();
    `,
    tests: [
      {
        description: "Should use fetch",
        check: (code) => code.includes('fetch')
      },
      {
        description: "Should use async/await",
        check: (code) => code.includes('async') && code.includes('await')
      },
      {
        description: "Should check response.ok",
        check: (code) => code.includes('response.ok')
      }
    ],
    hints: [
      "Use https://jsonplaceholder.typicode.com/posts/1",
      "Check response.ok before parsing",
      "Use await response.json()"
    ]
  },
  {
    id: "api_ex2",
    title: "POST Request",
    difficulty: "medium",
    description: "Create new data with POST request",
    template: `
// Create a new post using JSONPlaceholder
// https://jsonplaceholder.typicode.com/posts

async function createPost(title, body) {
  try {
    const response = await fetch('', { // Add URL
      method: '', // Add method
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    const newPost = await response.json();
    console.log('Created:', newPost);
    return newPost;
  } catch (error) {
    console.error(error);
  }
}

createPost('My Post', 'This is my first post');
    `,
    tests: [
      {
        description: "Should use POST method",
        check: (code) => code.includes("'POST'") || code.includes('"POST"')
      },
      {
        description: "Should use JSON.stringify",
        check: (code) => code.includes('JSON.stringify')
      },
      {
        description: "Should set Content-Type header",
        check: (code) => code.includes('Content-Type')
      }
    ],
    hints: [
      "Use method: 'POST'",
      "Include proper headers",
      "Use JSON.stringify for body"
    ]
  },
  {
    id: "api_ex3",
    title: "Error Handling",
    difficulty: "hard",
    description: "Handle API errors gracefully",
    template: `
// Create robust error handling

async function fetchUserData(userId) {
  try {
    const response = await fetch(''); // Add URL
    
    // Check status and handle errors
    if () { // Add condition
      // Handle error based on status
    }
    
    return await response.json();
  } catch (error) {
    // Handle network errors
    console.error('Error:', error.message);
  }
}

// Test with invalid user ID
fetchUserData(99999);
    `,
    tests: [
      {
        description: "Should check response.ok or status",
        check: (code) => code.includes('response.ok') || code.includes('response.status')
      },
      {
        description: "Should have try/catch",
        check: (code) => code.includes('try') && code.includes('catch')
      }
    ],
    hints: [
      "Check if response.ok is false",
      "Throw error with descriptive message",
      "Catch and log network errors separately"
    ]
  }
];

/**
 * Quiz
 */
export const quiz = [
  {
    id: "aq1",
    question: "Which HTTP method is used to retrieve data?",
    options: [
      "POST",
      "GET",
      "PUT",
      "DELETE"
    ],
    correct: 1,
    explanation: "GET is used to retrieve data from the server without modifying it"
  },
  {
    id: "aq2",
    question: "What does HTTP status code 404 mean?",
    options: [
      "Unauthorized",
      "Bad Request",
      "Not Found",
      "Server Error"
    ],
    correct: 2,
    explanation: "404 means the requested resource was not found on the server"
  },
  {
    id: "aq3",
    question: "When should you use PATCH instead of PUT?",
    options: [
      "Always use PUT",
      "When you want to delete data",
      "When you're doing a partial update",
      "When retrieving data"
    ],
    correct: 2,
    explanation: "PATCH is for partial updates, PUT replaces the entire resource"
  },
  {
    id: "aq4",
    question: "What does response.ok check?",
    options: [
      "If response is an object",
      "If HTTP status is in 200-299 range",
      "If content-type is JSON",
      "If request was successful"
    ],
    correct: 1,
    explanation: "response.ok is true if the HTTP status code is 200-299"
  },
  {
    id: "aq5",
    question: "Which is the correct way to send JSON data in a POST request?",
    options: [
      "body: { key: 'value' }",
      "body: '<json></json>'",
      "body: JSON.stringify({ key: 'value' })",
      "data: { key: 'value' }"
    ],
    correct: 2,
    explanation: "JSON must be stringified before sending in request body"
  }
];

/**
 * Export all
 */
export default {
  config: apiConfig,
  httpBasics,
  fetchApi,
  restPrinciples,
  apiErrorHandling,
  authentication,
  responseProcessing,
  exercises,
  quiz
};
