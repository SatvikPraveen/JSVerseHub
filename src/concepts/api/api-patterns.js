// File: src/concepts/api/api-patterns.js
// API Design Patterns and Best Practices

/**
 * API Client Pattern
 * Centralized API interaction
 */
export const apiClientPattern = {
  title: "API Client Pattern",
  explanation: `
    Create a centralized API client to:
    - Avoid repeating headers and base URL
    - Handle authentication automatically
    - Implement consistent error handling
    - Add request/response interceptors
    - Manage retries and timeouts
  `,
  
  code: `
class APIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 5000;
    this.maxRetries = options.maxRetries || 3;
    this.headers = options.headers || {};
  }
  
  setAuthToken(token) {
    this.headers['Authorization'] = \`Bearer \${token}\`;
  }
  
  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: { 'Content-Type': 'application/json', ...this.headers },
      ...options
    };
    
    return this.fetchWithRetry(url, config);
  }
  
  async fetchWithRetry(url, config, attempt = 0) {
    try {
      const response = await this.fetchWithTimeout(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API error');
      }
      
      return response.json();
    } catch (error) {
      if (attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, delay));
        return this.fetchWithRetry(url, config, attempt + 1);
      }
      throw error;
    }
  }
  
  async fetchWithTimeout(url, config) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      return await fetch(url, { ...config, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Usage
const apiClient = new APIClient('https://api.example.com');
apiClient.setAuthToken('token123');

const users = await apiClient.get('/users');
const newUser = await apiClient.post('/users', { name: 'John' });
  `
};

/**
 * Response Mapper Pattern
 * Normalize API responses
 */
export const responseMapper = {
  title: "Response Mapper Pattern",
  explanation: `
    Map API responses to consistent app format:
    - Different APIs have different formats
    - Centralize transformation logic
    - Make app independent of API changes
    - Easy to switch APIs
  `,
  
  code: `
class ResponseMapper {
  // Map single item
  static mapUser(apiUser) {
    return {
      id: apiUser.user_id,
      name: apiUser.full_name,
      email: apiUser.email_address,
      avatar: apiUser.profile_pic,
      createdAt: new Date(apiUser.created_at)
    };
  }
  
  // Map collection
  static mapUsers(apiUsers) {
    return apiUsers.map(u => this.mapUser(u));
  }
  
  // Map nested structure
  static mapPost(apiPost) {
    return {
      id: apiPost.post_id,
      title: apiPost.title,
      content: apiPost.body,
      author: this.mapUser(apiPost.author),
      comments: apiPost.comments.map(c => this.mapComment(c)),
      createdAt: new Date(apiPost.published_at)
    };
  }
  
  static mapComment(apiComment) {
    return {
      id: apiComment.comment_id,
      text: apiComment.content,
      author: this.mapUser(apiComment.author),
      createdAt: new Date(apiComment.posted_at)
    };
  }
}

// Usage
const rawUser = await fetch('/api/users/1').then(r => r.json());
const user = ResponseMapper.mapUser(rawUser);
  `
};

/**
 * Cache and Invalidation
 */
export const cachePattern = {
  title: "Cache and Invalidation Pattern",
  explanation: `
    Efficient caching strategy:
    - Cache GET requests
    - Invalidate on mutations
    - Set appropriate TTL
    - Allow manual cache clear
  `,
  
  code: `
class CachedAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }
  
  async get(endpoint) {
    const cached = this.getFromCache(endpoint);
    if (cached) return cached;
    
    const data = await fetch(\`\${this.baseURL}\${endpoint}\`)
      .then(r => r.json());
    
    this.setCache(endpoint, data);
    return data;
  }
  
  async post(endpoint, data) {
    const result = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => r.json());
    
    // Invalidate related cache
    this.invalidateCache(endpoint);
    return result;
  }
  
  getFromCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  invalidateCache(pattern) {
    for (const [key] of this.cache) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  clearCache() {
    this.cache.clear();
  }
}
  `
};

/**
 * Error Handling Middleware
 */
export const errorMiddleware = {
  title: "Error Handling Middleware",
  explanation: `
    Centralize error handling:
    - Consistent error responses
    - Specific error handling per type
    - Automatic retry on transient errors
    - Error logging
  `,
  
  code: `
class APIErrorHandler {
  static handle(error, context = {}) {
    if (error instanceof TypeError) {
      return this.handleNetworkError(error, context);
    }
    
    if (error.response) {
      return this.handleHTTPError(error.response, context);
    }
    
    return this.handleUnknownError(error, context);
  }
  
  static handleNetworkError(error, context) {
    console.error('Network error:', error);
    
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection failed',
      userMessage: 'Check your internet connection',
      retryable: true,
      context
    };
  }
  
  static handleHTTPError(response, context) {
    const errorMap = {
      400: { message: 'Invalid request', userMessage: 'Bad request' },
      401: { message: 'Unauthorized', userMessage: 'Please log in' },
      403: { message: 'Forbidden', userMessage: 'Access denied' },
      404: { message: 'Not found', userMessage: 'Resource not found' },
      429: { message: 'Rate limited', userMessage: 'Try again later', retryable: true },
      500: { message: 'Server error', userMessage: 'Server error', retryable: true },
      503: { message: 'Service unavailable', userMessage: 'Service down', retryable: true }
    };
    
    const errorInfo = errorMap[response.status] || { message: 'Unknown error' };
    
    return {
      type: 'HTTP_ERROR',
      status: response.status,
      message: errorInfo.message,
      userMessage: errorInfo.userMessage,
      retryable: errorInfo.retryable || false,
      context
    };
  }
  
  static handleUnknownError(error, context) {
    console.error('Unknown error:', error);
    
    return {
      type: 'UNKNOWN_ERROR',
      message: error.message,
      userMessage: 'An error occurred',
      retryable: false,
      context
    };
  }
}

// Usage
try {
  await fetch('/api/data');
} catch (error) {
  const errorResponse = APIErrorHandler.handle(error);
  console.log(errorResponse.userMessage); // Show to user
}
  `
};

export default {
  apiClientPattern,
  responseMapper,
  cachePattern,
  errorMiddleware
};
