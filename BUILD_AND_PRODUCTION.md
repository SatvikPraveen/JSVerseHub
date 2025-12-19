# JSVerseHub Build & Production Guide v1.0.0

## Table of Contents

1. [Build Process](#build-process)
2. [Production Deployment](#production-deployment)
3. [Performance Optimization](#performance-optimization)
4. [Security Hardening](#security-hardening)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## Build Process

### Prerequisites

```bash
# Verify Node.js and npm versions
node --version  # Should be >= 16.0.0
npm --version   # Should be >= 7.0.0

# Install dependencies
npm install

# Verify installation
npm run validate  # Runs linting and tests
```

### Build Command

```bash
# Full production build
npm run build

# This runs:
# 1. npm run clean              - Clean dist and cache
# 2. npm run build:css          - Minify CSS with PostCSS
# 3. npm run build:js           - Bundle JS with Webpack (production mode)
# 4. npm run optimize           - Optimize images and assets

# Output location: ./dist/
```

### Build Configuration

**webpack.config.js**
```javascript
module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  // Minification, source maps, code splitting configured
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000
    }
  }
};
```

### Build Output

```
dist/
├── index.html                 # Entry point
├── js/
│   ├── main.[hash].js        # Main bundle
│   ├── vendors.[hash].js     # Third-party dependencies
│   └── ...other chunks
├── styles/
│   ├── index.css             # Global styles (minified)
│   ├── galaxy.css            # Galaxy styles
│   └── ...other stylesheets
├── images/
│   ├── icons/
│   ├── planets/
│   ├── ui/
│   └── ...optimized images
└── ...other assets
```

### Build Statistics

- **Bundle Size**: ~150KB (gzipped: ~45KB)
- **CSS Size**: ~25KB (minified, gzipped: ~6KB)
- **Images**: ~2MB (optimized)
- **Total**: ~2.2MB
- **Build Time**: ~45 seconds

---

## Production Deployment

### 1. Environment Setup

```bash
# Set production environment
export NODE_ENV=production

# Load production environment variables
source .env.production

# Verify critical variables
echo "Database: $DB_HOST:$DB_PORT"
echo "Redis: $REDIS_URL"
echo "Log Level: $LOG_LEVEL"
```

### 2. Build Verification

```bash
# Build the project
npm run build

# Run tests
npm run test:ci

# Generate coverage report
npm run test:coverage

# Analyze bundle
npm run analyze

# Generate Lighthouse report
npm run lighthouse
```

### 3. Deploy Options

#### Option A: Docker (Recommended)

```bash
# Build Docker image
docker build -t jsversehub:1.0.0 .

# Push to registry
docker push jsversehub:1.0.0

# Run container
docker run -d \
  --name jsversehub \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=$DATABASE_URL \
  jsversehub:1.0.0

# Verify
curl http://localhost:3000/health
```

#### Option B: Traditional Server

```bash
# Copy files to server
scp -r dist/ user@server:/var/www/jsversehub/

# Copy Node modules
ssh user@server "cd /var/www/jsversehub && npm install --production"

# Create systemd service
sudo cp jsversehub.service /etc/systemd/system/

# Start service
sudo systemctl daemon-reload
sudo systemctl start jsversehub
sudo systemctl enable jsversehub
```

#### Option C: PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'jsversehub',
    script: './src/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

---

## Performance Optimization

### 1. Code Optimization

```bash
# Enable minification
NODE_ENV=production npm run build

# Code splitting by route
npm run analyze  # View bundle composition
```

### 2. Asset Optimization

```bash
# Image optimization
npm run optimize:images

# CSS minification
cssnano src/styles/*.css

# JS minification
webpack --mode=production
```

### 3. Caching Strategy

```javascript
// Set cache headers in production
app.use((req, res, next) => {
  if (req.path.match(/\.(js|css)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.path === '/index.html') {
    res.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  next();
});
```

### 4. Compression

```javascript
// Enable gzip compression
const compression = require('compression');
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6  // 1-9, 6 is default
}));
```

### 5. Database Optimization

```javascript
// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query optimization
// Use prepared statements
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Use indexes
CREATE INDEX idx_user_email ON users(email);
```

---

## Security Hardening

### 1. Environment Variables

```bash
# Never commit sensitive data
# All secrets in .env.production (not in git)

# Use strong random values
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
```

### 2. Headers

```javascript
// Set security headers
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));
```

### 3. Input Validation

```javascript
// Validate all inputs
const { body, validationResult } = require('express-validator');

app.post('/api/endpoint', [
  body('email').isEmail(),
  body('username').isLength({ min: 3, max: 50 }),
  body('password').isStrongPassword()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process valid request
});
```

### 4. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 5. CORS

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Monitoring & Logging

### 1. Application Metrics

```bash
# Prometheus metrics endpoint
curl http://localhost:3000/metrics

# Key metrics:
# - http_requests_total
# - http_request_duration_ms
# - process_cpu_usage_percent
# - process_resident_memory_bytes
```

### 2. Logging

```bash
# View application logs
tail -f logs/combined.log

# Search logs for errors
grep ERROR logs/combined.log

# Log rotation
# Logs automatically rotate daily or at 10MB
# Retention: 30 files (30 days)
```

### 3. Health Checks

```bash
# Basic health check
curl http://localhost:3000/health

# Deep health check
curl http://localhost:3000/health/deep

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-19T12:00:00Z",
  "version": "1.0.0",
  "checks": {
    "database": "OK",
    "cache": "OK",
    "diskSpace": "85%"
  }
}
```

### 4. Alerts

```bash
# Error rate alert (> 1%)
ALERT HighErrorRate
  IF rate(errors_total[5m]) > 0.01

# Response time alert (p95 > 1s)
ALERT HighResponseTime
  IF histogram_quantile(0.95, http_request_duration_ms) > 1000

# Memory alert (> 85%)
ALERT HighMemoryUsage
  IF process_resident_memory_bytes / 1073741824 > 0.85
```

---

## Troubleshooting

### Issue: High Memory Usage

```bash
# Check memory
ps aux | grep node

# Generate heap dump
kill -USR2 <pid>

# Analyze with
node --inspect --inspect-brk app.js

# Use Chrome DevTools to debug
chrome://inspect
```

### Issue: Slow Response Times

```bash
# Enable profiling
NODE_OPTIONS="--prof" node app.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt

# Check database queries
npm run test:db-performance
```

### Issue: High CPU Usage

```bash
# Monitor with top
top -p <pid>

# Check for infinite loops
node --inspect app.js

# Profile with clinic.js
npx clinic.js doctor -- node app.js
```

### Issue: Container Won't Start

```bash
# Check logs
docker logs <container_id>

# Verify environment variables
docker inspect <container_id> | grep -A 20 Env

# Test locally
NODE_ENV=production node src/main.js
```

---

## Rollback Procedures

### Immediate Rollback

```bash
# If using Docker
docker pull jsversehub:1.0.0-previous
docker stop jsversehub
docker rm jsversehub
docker run -d --name jsversehub jsversehub:1.0.0-previous

# If using PM2
pm2 restart jsversehub

# If using systemd
sudo systemctl restart jsversehub
```

### Database Rollback

```bash
# Backup current data
pg_dump jsversehub > backup.sql

# Restore previous version
psql jsversehub < backup-previous.sql

# Verify data integrity
SELECT COUNT(*) FROM users;  // Check row counts
```

### Git Rollback

```bash
# If code needs rollback
git revert <commit_hash>
git push origin main

# Rebuild and redeploy
npm run build
npm run deploy
```

---

## Pre-Release Checklist

- [ ] All tests passing (test:ci)
- [ ] Code coverage >= 80%
- [ ] No security vulnerabilities
- [ ] Build completes without warnings
- [ ] Performance metrics acceptable
- [ ] Documentation updated
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Backups created
- [ ] Rollback plan documented

---

## Post-Release Checklist

- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Logs being collected
- [ ] No error spike in first hour
- [ ] Performance metrics normal
- [ ] User-facing features working
- [ ] Analytics tracking events
- [ ] Stakeholders notified

---

**JSVerseHub v1.0.0 is ready for production!** 🚀
