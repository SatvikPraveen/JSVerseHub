// File: src/concepts/security/security-patterns.js
// Advanced Security Patterns and Best Practices

/**
 * Content Security Policy
 */
export const contentSecurityPolicy = {
  title: "Content Security Policy (CSP)",
  explanation: `
    CSP is a security standard that helps prevent XSS, clickjacking, and other attacks.
    Set via HTTP headers to restrict resource loading.
  `,
  
  code: `
// Basic CSP header (server-side)
app.use((req, res) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
});

// Comprehensive CSP
const cspHeader = \`
default-src 'self';
script-src 'self' https://trusted-cdn.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://api.example.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
block-all-mixed-content
\`;

// CSP with nonce for inline scripts
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

app.get('/', (req, res) => {
  const nonce = generateNonce();
  
  res.setHeader('Content-Security-Policy', 
    \`script-src 'nonce-\${nonce}' 'self'\`);
  
  res.send(\`
    <script nonce="\${nonce}">
      console.log('This inline script is allowed');
    </script>
  \`);
});

// CSP reporting
res.setHeader('Content-Security-Policy-Report-Only',
  "default-src 'self'; report-uri /csp-report");

// Handle CSP violation reports
app.post('/csp-report', (req, res) => {
  console.log('CSP Violation:', req.body);
  res.sendStatus(204);
});
  `
};

/**
 * Secure Coding Patterns
 */
export const secureCodePatterns = {
  title: "Secure Coding Patterns",
  explanation: "Common patterns for writing secure code",
  
  code: `
// 1. Input Validation Pattern
class InputValidator {
  static validateString(input, min = 1, max = 1000) {
    if (typeof input !== 'string') {
      throw new TypeError('Input must be string');
    }
    if (input.length < min || input.length > max) {
      throw new RangeError(\`Input must be \${min}-\${max} characters\`);
    }
    return input;
  }
  
  static validateNumber(input, min = -Infinity, max = Infinity) {
    if (typeof input !== 'number') {
      throw new TypeError('Input must be number');
    }
    if (input < min || input > max) {
      throw new RangeError(\`Input must be \${min}-\${max}\`);
    }
    return input;
  }
  
  static validateEmail(email) {
    const pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!pattern.test(email)) {
      throw new Error('Invalid email format');
    }
    return email;
  }
}

// 2. Output Encoding Pattern
class OutputEncoder {
  static forHTML(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, c => map[c]);
  }
  
  static forUrl(str) {
    return encodeURIComponent(str);
  }
  
  static forJavaScript(str) {
    return JSON.stringify(str);
  }
}

// 3. Secure Object Pattern
class SecureObject {
  constructor(data) {
    // Validate all inputs
    Object.keys(data).forEach(key => {
      const value = data[key];
      Object.defineProperty(this, key, {
        value: Object.freeze(value),
        writable: false,
        enumerable: true
      });
    });
    Object.freeze(this);
  }
  
  // Prevent modifications
  toString() { return '[Object]'; }
  toJSON() { return {}; }
}

// 4. Error Handling Pattern
class SecureError extends Error {
  constructor(message, statusCode = 500, userMessage = null) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage || 'An error occurred';
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }
  
  toResponse() {
    return {
      error: this.userMessage,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };
  }
}

// Don't expose internal errors
app.use((err, req, res, next) => {
  console.error('Internal error:', err);
  
  if (err instanceof SecureError) {
    res.status(err.statusCode).json(err.toResponse());
  } else {
    res.status(500).json({
      error: 'Internal server error',
      statusCode: 500
    });
  }
});
  `
};

/**
 * Rate Limiting
 */
export const rateLimiting = {
  title: "Rate Limiting",
  explanation: "Prevent brute force and DDoS attacks",
  
  code: `
// Simple in-memory rate limiter
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = timestamps.filter(
      ts => now - ts < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

// Express middleware
const limiter = new RateLimiter(100, 60000); // 100 requests per minute

app.use((req, res, next) => {
  const identifier = req.ip || req.connection.remoteAddress;
  
  if (!limiter.isAllowed(identifier)) {
    return res.status(429).json({
      error: 'Too many requests, please try again later'
    });
  }
  
  next();
});

// More robust: Use Redis for distributed systems
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const client = redis.createClient();

const limiter = new RedisStore({
  client: client,
  prefix: 'rate-limit:',
  expiry: 60 // 60 seconds
});
  `
};

/**
 * Dependency Security
 */
export const dependencySecurity = {
  title: "Dependency Security",
  explanation: "Keep dependencies safe and updated",
  
  code: `
// Check for vulnerabilities
// npm audit - check for known vulnerabilities

// Command:
// npm audit
// npm audit fix

// Lock versions to prevent unexpected updates
// Use package-lock.json

// Keep dependencies updated
// npm update

// Recommended practices in package.json:
{
  "dependencies": {
    // Use caret (^) for compatible versions
    "express": "^4.18.0",
    // Use specific versions for security-critical packages
    "bcrypt": "5.1.0"
  },
  "devDependencies": {
    // ...
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

// Security audit script
const fs = require('fs');
const path = require('path');

function auditDependencies() {
  const packageJson = JSON.parse(
    fs.readFileSync('package.json', 'utf8')
  );
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  // Known vulnerable packages
  const blacklist = {
    'old-unsafe-package': '<2.0.0',
    'vulnerable-lib': '<1.5.0'
  };
  
  Object.entries(allDeps).forEach(([pkg, version]) => {
    if (blacklist[pkg]) {
      console.warn(\`Warning: \${pkg} \${version} has known vulnerabilities\`);
    }
  });
}

auditDependencies();
  `
};

/**
 * HTTPS and TLS
 */
export const httpsSecurity = {
  title: "HTTPS and TLS",
  explanation: "Always use HTTPS for secure communication",
  
  code: `
// Enforce HTTPS
const http = require('http');
const https = require('https');
const fs = require('fs');

// Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
}).listen(80);

// HTTPS server
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure connection');
}).listen(443);

// Express with HTTPS
const app = require('express')();

// Add HSTS header (force HTTPS for 1 year)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains');
  next();
});

// Disable insecure cookies
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 
    'sessionId=value; Secure; HttpOnly; SameSite=Strict');
  next();
});

// Use helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Helmet sets:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=...
  `
};

export default {
  contentSecurityPolicy,
  secureCodePatterns,
  rateLimiting,
  dependencySecurity,
  httpsSecurity
};
