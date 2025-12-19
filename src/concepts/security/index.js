// File: src/concepts/security/index.js
// Web Security Fundamentals - XSS, CSRF, Validation, Injection Prevention

/**
 * Security Configuration
 */
export const securityConfig = {
  title: "Web Security Fundamentals",
  description: "Learn to protect JavaScript applications from common vulnerabilities",
  difficulty: "intermediate-advanced",
  estimatedTime: "120 minutes",
  topics: [
    "Security Principles",
    "XSS Prevention",
    "CSRF Protection",
    "Input Validation",
    "Authentication Security",
    "Data Protection"
  ],
  prerequisites: ["JavaScript Basics", "DOM", "HTTP/API"],
  learningObjectives: [
    "Understand common web vulnerabilities",
    "Prevent cross-site scripting attacks",
    "Protect against CSRF attacks",
    "Validate and sanitize user input",
    "Implement secure authentication",
    "Protect sensitive data"
  ]
};

/**
 * Security Principles
 */
export const securityPrinciples = {
  concept: "Security Principles",
  explanation: `
    Key security principles for web applications:
    
    1. Defense in Depth: Multiple layers of protection
    2. Principle of Least Privilege: Give minimum necessary access
    3. Secure by Default: Make secure options the default
    4. Fail Safely: Errors should not expose information
    5. Never Trust User Input: Always validate and sanitize
    6. Keep It Simple: Complex code = harder to audit
    7. Stay Updated: Patch vulnerabilities immediately
    
    Security Threats:
    - XSS (Cross-Site Scripting): Inject malicious scripts
    - CSRF (Cross-Site Request Forgery): Trick user into action
    - SQL Injection: Inject code into SQL queries
    - Session Hijacking: Steal session tokens
    - Malware: Malicious software
    - DDoS: Overwhelming server with requests
  `,
  
  examples: {
    threatTypes: `
// Common security threats

1. XSS (Cross-Site Scripting)
   Attack: User inputs <script>alert('hacked')</script>
   Impact: Steal cookies, redirect user, deface website
   Prevention: Sanitize HTML, use textContent not innerHTML

2. CSRF (Cross-Site Request Forgery)
   Attack: Trick user into clicking link from attacker site
   Impact: Unauthorized actions (delete, transfer money)
   Prevention: Use tokens, check origin/referrer

3. SQL Injection
   Attack: Input: ' OR '1'='1
   Impact: Access/modify database
   Prevention: Use parameterized queries, escape input

4. Session Hijacking
   Attack: Steal session cookie
   Impact: Access user account
   Prevention: HTTPS only, HttpOnly cookies, CSRF tokens

5. Password Attacks
   Attack: Brute force, dictionary attack
   Impact: Unauthorized access
   Prevention: Hash + salt, rate limiting, strong requirements

6. Man-in-the-Middle
   Attack: Intercept unencrypted communication
   Impact: Steal data, modify requests
   Prevention: Use HTTPS always
    `,
    
    securityByDesign: `
// Security best practices

SECURE CODE:
function getUserData(userId) {
  // Validate input
  if (!Number.isInteger(userId)) {
    throw new Error('Invalid user ID');
  }
  
  // Use prepared statements (server-side)
  return database.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).get(userId);
  
  // Never do this:
  // 'SELECT * FROM users WHERE id = ' + userId
}

SECURE STORAGE:
// Bad: Store password in plain text
const user = { username: 'john', password: 'secret123' };

// Good: Hash and salt password
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash('secret123', 10);
const user = { username: 'john', password: hashedPassword };

// Verify password
const isValid = await bcrypt.compare('secret123', hashedPassword);
    `
  }
};

/**
 * XSS Prevention
 */
export const xssPrevention = {
  concept: "XSS (Cross-Site Scripting) Prevention",
  explanation: `
    XSS vulnerabilities allow attackers to inject malicious scripts.
    
    Types of XSS:
    1. Stored XSS: Attack stored in database, affects all users
    2. Reflected XSS: Attack in URL/parameter, affects current user
    3. DOM-based XSS: Attack executed in JavaScript on client
    
    Prevention:
    - Escape HTML when displaying user content
    - Use textContent instead of innerHTML
    - Sanitize HTML if necessary
    - Use Content Security Policy (CSP)
    - Validate input format
  `,
  
  examples: {
    xssVulnerability: `
// VULNERABLE: XSS Attack
const userComment = '<img src=x onerror="alert(\'hacked\')">';

// Bad: Using innerHTML
document.getElementById('comments').innerHTML = userComment;
// Result: Script executes, alert shows

// Good: Using textContent
document.getElementById('comments').textContent = userComment;
// Result: Comment displayed as text, no script execution

// Good: Using createElement
const commentEl = document.createElement('div');
commentEl.textContent = userComment;
document.getElementById('comments').appendChild(commentEl);

// Best: Sanitize if HTML needed
function sanitizeHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(s => s.remove());
  
  // Remove event handlers
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return doc.body.innerHTML;
}
    `,
    
    escapeHtml: `
// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Usage
const userInput = '<script>alert("xss")</script>';
const safe = escapeHtml(userInput);
// Result: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;

// Display safely
element.innerHTML = safe; // Safe, shows as text

// Or even better:
element.textContent = safe; // Always safe for text
    `,
    
    cspHeaders: `
// Content Security Policy (CSP) - Server-side
// Add to HTTP headers to prevent XSS

// Strict policy (recommended):
Content-Security-Policy: default-src 'self'

// Allow specific sources:
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com

// Benefits:
// - Prevents inline script execution
// - Restricts loading of external resources
// - Blocks plugins (Flash, etc.)
// - Reports violations

// Implement reporting:
Content-Security-Policy: 
  default-src 'self';
  report-uri https://example.com/csp-report
    `
  }
};

/**
 * CSRF Prevention
 */
export const csrfPrevention = {
  concept: "CSRF (Cross-Site Request Forgery) Prevention",
  explanation: `
    CSRF tricks authenticated users into performing unwanted actions.
    
    How CSRF works:
    1. User logs into banking website
    2. User visits malicious website without logging out
    3. Malicious site makes request to bank (user's cookie sent)
    4. Bank processes request thinking it's from real user
    
    Prevention:
    - Use CSRF tokens for state-changing operations
    - Check Origin and Referer headers
    - Use SameSite cookie attribute
    - Require explicit confirmation
    - Implement CORS properly
  `,
  
  examples: {
    csrfToken: `
// Generate CSRF token (server)
const crypto = require('crypto');

function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store in session and send to client
app.get('/form', (req, res) => {
  req.session.csrfToken = generateCSRFToken();
  res.render('form', { csrfToken: req.session.csrfToken });
});

// In HTML form:
<form method="POST" action="/submit">
  <input type="hidden" name="csrf_token" 
         value="\${csrfToken}">
  <input type="text" name="data">
  <button>Submit</button>
</form>

// Verify token (server)
app.post('/submit', (req, res) => {
  if (req.body.csrf_token !== req.session.csrfToken) {
    return res.status(403).send('CSRF token invalid');
  }
  // Process form...
});

// For AJAX requests:
// Add token to request header
const token = document.querySelector('meta[name="csrf-token"]')
  .getAttribute('content');

fetch('/api/action', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

// Server verifies header:
app.post('/api/action', (req, res) => {
  const token = req.headers['x-csrf-token'];
  if (token !== req.session.csrfToken) {
    return res.status(403).send('CSRF token invalid');
  }
  // Process request...
});
    `,
    
    samesite: `
// SameSite Cookie Attribute (modern approach)
// Server sets cookie with SameSite attribute

// Strict: Never send cookie in cross-site requests
Set-Cookie: sessionId=abc123; Path=/; SameSite=Strict; Secure

// Lax: Send only for top-level navigation (default)
Set-Cookie: sessionId=abc123; Path=/; SameSite=Lax; Secure

// None: Send in all cross-site requests (requires Secure)
Set-Cookie: sessionId=abc123; Path=/; SameSite=None; Secure

// Benefits:
// - Automatic protection against CSRF
// - No need for tokens (but still recommended)
// - Browser enforces the policy
    `,
    
    headerValidation: `
// Validate request origin and referer
function validateOrigin(req, allowedOrigins) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  // Check origin header (for CORS requests)
  if (origin && !allowedOrigins.includes(origin)) {
    throw new Error('Invalid origin');
  }
  
  // Check referer header
  if (referer) {
    const refererUrl = new URL(referer);
    if (!allowedOrigins.includes(refererUrl.origin)) {
      throw new Error('Invalid referer');
    }
  }
  
  return true;
}

// Usage
app.post('/api/sensitive', (req, res) => {
  validateOrigin(req, ['https://example.com']);
  // Process request...
});
    `
  }
};

/**
 * Input Validation & Sanitization
 */
export const inputValidation = {
  concept: "Input Validation & Sanitization",
  explanation: `
    Never trust user input. Always validate and sanitize.
    
    Validation: Check if input matches expected format
    Sanitization: Remove/escape dangerous characters
    
    Validate:
    - Type: Is it the right type (string, number, etc)?
    - Format: Does it match the expected pattern?
    - Range: Is it within acceptable bounds?
    - Length: Is it the right length?
    
    Sanitize:
    - Remove HTML tags
    - Escape special characters
    - Remove null bytes
    - Normalize whitespace
  `,
  
  examples: {
    emailValidation: `
// Validate email address
function validateEmail(email) {
  // Basic validation
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false; // Max email length
  
  // Regex pattern (basic, not RFC compliant)
  const pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!pattern.test(email)) return false;
  
  // Additional checks
  const [local, domain] = email.split('@');
  if (local.length > 64) return false; // Local part limit
  
  // Check for consecutive dots
  if (email.includes('..')) return false;
  
  // Check for leading/trailing dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return true;
}

// Better: Use native email input validation
const email = document.querySelector('input[type="email"]');
const isValid = email.checkValidity();

// Or fetch validation from server (more robust)
const response = await fetch('/api/validate-email', {
  method: 'POST',
  body: JSON.stringify({ email }),
  headers: { 'Content-Type': 'application/json' }
});
    `,
    
    sanitizeInput: `
// Sanitize user input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Remove null bytes
  input = input.replace(/\\0/g, '');
  
  // Trim whitespace
  input = input.trim();
  
  // Remove control characters
  input = input.replace(/[\\x00-\\x1F\\x7F]/g, '');
  
  // Limit length
  input = input.substring(0, 1000);
  
  return input;
}

// Sanitize HTML
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Remove HTML tags
function stripHTML(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// Escape for database (SQL)
function escapeSql(str) {
  return "'" + str.replace(/'/g, "''") + "'";
}

// Better: Use parameterized queries (server-side)
db.query('SELECT * FROM users WHERE email = ?', [email]);
    `,
    
    formValidation: `
// Comprehensive form validation
class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = {};
  }
  
  validate() {
    this.errors = {};
    
    const formData = new FormData(this.form);
    
    for (const [name, value] of formData) {
      this.validateField(name, value);
    }
    
    return Object.keys(this.errors).length === 0;
  }
  
  validateField(name, value) {
    const rules = {
      username: [
        { type: 'required' },
        { type: 'minLength', value: 3 },
        { type: 'maxLength', value: 20 },
        { type: 'pattern', value: /^[a-zA-Z0-9_]+$/ }
      ],
      email: [
        { type: 'required' },
        { type: 'email' }
      ],
      password: [
        { type: 'required' },
        { type: 'minLength', value: 8 },
        { type: 'password' }
      ],
      age: [
        { type: 'required' },
        { type: 'number' },
        { type: 'min', value: 18 },
        { type: 'max', value: 120 }
      ]
    };
    
    if (!rules[name]) return;
    
    for (const rule of rules[name]) {
      if (!this.checkRule(name, value, rule)) {
        if (!this.errors[name]) this.errors[name] = [];
        this.errors[name].push(rule.type);
      }
    }
  }
  
  checkRule(name, value, rule) {
    switch (rule.type) {
      case 'required':
        return value.trim().length > 0;
      case 'email':
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
      case 'minLength':
        return value.length >= rule.value;
      case 'maxLength':
        return value.length <= rule.value;
      case 'pattern':
        return rule.value.test(value);
      case 'number':
        return !isNaN(value);
      case 'min':
        return Number(value) >= rule.value;
      case 'max':
        return Number(value) <= rule.value;
      case 'password':
        // At least 1 uppercase, 1 lowercase, 1 number, 1 special
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])/.test(value);
      default:
        return true;
    }
  }
  
  getErrors() {
    return this.errors;
  }
}

// Usage
const form = document.getElementById('myForm');
const validator = new FormValidator(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validator.validate()) {
    form.submit();
  } else {
    console.log('Validation errors:', validator.getErrors());
  }
});
    `
  }
};

/**
 * Authentication Security
 */
export const authSecurity = {
  concept: "Authentication Security",
  explanation: `
    Secure authentication protects user accounts.
    
    Best practices:
    1. Hash passwords with bcrypt or Argon2
    2. Never store plain passwords
    3. Use strong password requirements
    4. Implement rate limiting
    5. Use HTTPS only
    6. Secure session management
    7. Implement logout properly
    8. Use secure password reset
    
    Methods:
    - Username/Password with MFA
    - OAuth 2.0 / OpenID Connect
    - API keys for services
    - JWT tokens
  `,
  
  examples: {
    passwordHashing: `
// Password hashing (server-side)
const bcrypt = require('bcrypt');

// Hash password on registration
async function hashPassword(password) {
  // Validate password strength first
  if (password.length < 8) {
    throw new Error('Password too short');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

// Verify password on login
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Client-side: Never send plain password over HTTP
// ALWAYS use HTTPS
const response = await fetch('https://api.example.com/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john',
    password: 'SecurePass123!' // HTTPS protects this
  })
});

// Alternative: Use challenge-response (more secure)
// 1. Server sends random challenge
// 2. Client signs challenge with password
// 3. Server verifies signature
    `,
    
    sessionManagement: `
// Secure session management
const sessions = new Map();

// Create session (server)
function createSession(userId) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  sessions.set(sessionId, {
    userId,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    expiresAt: Date.now() + (1000 * 60 * 60) // 1 hour
  });
  
  return sessionId;
}

// Set secure cookie
res.cookie('sessionId', sessionId, {
  httpOnly: true,    // Not accessible to JavaScript
  secure: true,      // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000    // 1 hour
});

// Validate session
function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  // Update last activity
  session.lastActivity = Date.now();
  
  // Refresh expiration
  session.expiresAt = Date.now() + (1000 * 60 * 60);
  
  return session;
}

// Logout: Clear session
function logout(sessionId) {
  sessions.delete(sessionId);
  // Clear cookie on client
  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
}
    `,
    
    mfa: `
// Multi-Factor Authentication (MFA)
const speakeasy = require('speakeasy');

// Generate MFA secret (Time-based One-Time Password)
function generateMFASecret(userEmail) {
  const secret = speakeasy.generateSecret({
    name: \`JSVerseHub (\${userEmail})\`,
    issuer: 'JSVerseHub'
  });
  
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url
  };
}

// Verify MFA token
function verifyMFAToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 30 seconds tolerance
  });
}

// Login flow with MFA
async function loginWithMFA(username, password, mfaToken) {
  // 1. Verify password
  const user = await User.findByUsername(username);
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');
  
  // 2. Verify MFA token
  if (user.mfaEnabled) {
    if (!verifyMFAToken(user.mfaSecret, mfaToken)) {
      throw new Error('Invalid MFA token');
    }
  }
  
  // 3. Create session
  return createSession(user.id);
}
    `
  }
};

/**
 * Data Protection
 */
export const dataProtection = {
  concept: "Data Protection",
  explanation: `
    Protect sensitive data from unauthorized access.
    
    Principles:
    1. Only collect necessary data
    2. Encrypt sensitive data
    3. Use HTTPS for transmission
    4. Secure local storage
    5. Delete when no longer needed
    6. Comply with regulations (GDPR, etc.)
    
    Sensitive data:
    - Passwords and authentication
    - Personal information (SSN, ID)
    - Payment information
    - Health records
    - Financial data
  `,
  
  examples: {
    dataEncryption: `
// Encrypt sensitive data
const crypto = require('crypto');

function encryptData(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

function decryptData(encryptedData, key) {
  const [iv, encrypted] = encryptedData.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage
const key = crypto.randomBytes(32); // 256-bit key
const encryptedSSN = encryptData('123-45-6789', key);
const decryptedSSN = decryptData(encryptedSSN, key);
    `,
    
    secureLoacalStorage: `
// Secure local storage practices

// WRONG: Store sensitive data in localStorage
localStorage.setItem('password', 'secret123'); // DON'T DO THIS

// Better: Use sessionStorage (cleared when tab closes)
sessionStorage.setItem('sessionToken', token);

// Best: Don't store sensitive data on client at all
// Use HttpOnly cookies (server-side, not accessible to JS)
// Or use memory storage (cleared on page reload)

class SecureMemoryStore {
  constructor() {
    this.data = {};
  }
  
  set(key, value) {
    this.data[key] = value;
  }
  
  get(key) {
    return this.data[key];
  }
  
  remove(key) {
    delete this.data[key];
  }
  
  clear() {
    this.data = {};
  }
}

// Usage
const store = new SecureMemoryStore();
store.set('apiToken', token); // Cleared on page reload

// Never do this:
window.apiToken = token; // Visible in console, persistent
    `,
    
    dataMinimization: `
// Collect only necessary data
function registerUser(data) {
  // Bad: Store everything sent
  const user = data; // Might include extra fields
  
  // Good: Only store what we need
  const user = {
    username: data.username,
    email: data.email,
    passwordHash: hashPassword(data.password),
    createdAt: new Date()
    // Don't store: phone, ssn, etc unless necessary
  };
  
  // Very good: Validate and transform
  const schema = {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    email: { type: 'email' },
    password: { type: 'password' }
  };
  
  const validatedData = validateAgainstSchema(data, schema);
  const user = {
    username: validatedData.username,
    email: validatedData.email,
    passwordHash: await bcrypt.hash(validatedData.password, 10),
    createdAt: new Date()
  };
  
  return user;
}

// Delete data when no longer needed
async function deleteOldSessions() {
  const expiryTime = Date.now() - (1000 * 60 * 60 * 24 * 30); // 30 days
  
  for (const [sessionId, session] of sessions) {
    if (session.createdAt < expiryTime) {
      sessions.delete(sessionId);
    }
  }
}
    `
  }
};

/**
 * Exercises
 */
export const exercises = [
  {
    id: "sec_ex1",
    title: "Prevent XSS Attack",
    difficulty: "easy",
    description: "Fix XSS vulnerability in code",
    template: `
// VULNERABLE: User input displayed unsafely
const userComment = document.getElementById('userComment').value;

// Bad: Using innerHTML (VULNERABLE)
document.getElementById('output').innerHTML = userComment;

// Fix: Use textContent or sanitize
// Option 1: Use textContent for plain text
// document.getElementById('output').textContent = userComment;

// Option 2: Escape HTML characters
// const escaped = escapeHtml(userComment);
// document.getElementById('output').innerHTML = escaped;

// Write the fix:
    `,
    tests: [
      {
        description: "Should not use innerHTML with user input",
        check: (code) => !code.includes('innerHTML = userComment')
      },
      {
        description: "Should use textContent or escapeHtml",
        check: (code) => code.includes('textContent') || code.includes('escapeHtml')
      }
    ],
    hints: [
      "Use textContent for plain text display",
      "Use escapeHtml() function to safely display HTML",
      "Never use innerHTML with unsanitized user input"
    ]
  },
  {
    id: "sec_ex2",
    title: "Validate Email Input",
    difficulty: "medium",
    description: "Create email validation function",
    template: `
// Validate email address
function validateEmail(email) {
  // Add validation checks here
  
  // Check if it's a string
  
  // Check basic format with regex
  
  // Check length limits
  
  return true; // or false
}

// Test cases:
// validateEmail('user@example.com') -> true
// validateEmail('invalid') -> false
// validateEmail('') -> false
// validateEmail(123) -> false
    `,
    tests: [
      {
        description: "Should check if it's a string",
        check: (code) => code.includes('typeof') || code.includes('String')
      },
      {
        description: "Should use regex pattern",
        check: (code) => code.includes('/')
      },
      {
        description: "Should validate length",
        check: (code) => code.includes('length')
      }
    ],
    hints: [
      "Use typeof to check if input is string",
      "Use regex pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
      "Check email length is reasonable (< 254 chars)"
    ]
  },
  {
    id: "sec_ex3",
    title: "Implement CSRF Protection",
    difficulty: "hard",
    description: "Add CSRF token to form",
    template: `
// HTML form needs CSRF token
<form id="submitForm" method="POST">
  <!-- Add hidden CSRF token input -->
  
  <input type="text" name="data">
  <button>Submit</button>
</form>

<script>
// JavaScript: Send CSRF token with AJAX
document.getElementById('submitForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // Get CSRF token from form
  
  // Send AJAX request with token in header
  
});
</script>
    `,
    tests: [
      {
        description: "Should have hidden CSRF token input",
        check: (code) => code.includes('csrf') && code.includes('hidden')
      },
      {
        description: "Should send token in header",
        check: (code) => code.includes('header') || code.includes('X-CSRF')
      }
    ],
    hints: [
      "Add hidden input with csrf_token from server",
      "Extract token in JavaScript",
      "Send token in X-CSRF-Token header with AJAX"
    ]
  }
];

/**
 * Quiz
 */
export const quiz = [
  {
    id: "sq1",
    question: "What does XSS stand for?",
    options: [
      "Extra Script Storage",
      "Cross-Site Scripting",
      "XML Syntax Structure",
      "Explicit Script Security"
    ],
    correct: 1,
    explanation: "XSS (Cross-Site Scripting) is an attack that injects malicious scripts"
  },
  {
    id: "sq2",
    question: "Which is safer for displaying user-generated content?",
    options: [
      "innerHTML",
      "textContent",
      "outerHTML",
      "insertAdjacentHTML"
    ],
    correct: 1,
    explanation: "textContent is safer because it treats content as plain text, not HTML"
  },
  {
    id: "sq3",
    question: "What protects against CSRF attacks?",
    options: [
      "HTTPS encryption",
      "CSRF tokens and SameSite cookies",
      "Password hashing",
      "API rate limiting"
    ],
    correct: 1,
    explanation: "CSRF tokens and SameSite cookies are designed to prevent CSRF attacks"
  },
  {
    id: "sq4",
    question: "Should you store plain passwords?",
    options: [
      "Yes, it's faster",
      "No, always hash with bcrypt",
      "Only for admin accounts",
      "Yes, with encryption"
    ],
    correct: 1,
    explanation: "Passwords should always be hashed with bcrypt or similar, never stored plain"
  }
];

/**
 * Export all
 */
export default {
  config: securityConfig,
  securityPrinciples,
  xssPrevention,
  csrfPrevention,
  inputValidation,
  authSecurity,
  dataProtection,
  exercises,
  quiz
};
