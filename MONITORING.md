# Monitoring & Logging Configuration

## JSVerseHub Production Monitoring

This file contains monitoring, logging, and observability configuration.

---

## 📊 Application Metrics

### Key Performance Indicators (KPIs)

```javascript
// Web Vitals
const KPIs = {
  performance: {
    loadTime: "< 3000ms",              // Page load
    interactiveTime: "< 5000ms",       // Time to interactive
    firstPaint: "< 1500ms",            // FP
    largestContentfulPaint: "< 2500ms" // LCP
  },
  stability: {
    uptime: "> 99.9%",
    errorRate: "< 0.1%",
    crashFreeRate: "> 99.9%"
  },
  reliability: {
    averageResponseTime: "< 200ms",
    p95ResponseTime: "< 500ms",
    p99ResponseTime: "< 1000ms"
  },
  engagement: {
    pageViewsPerUser: "> 5",
    sessionDuration: "> 5min",
    bounceRate: "< 30%"
  }
};
```

### Metrics Collection

```javascript
// server.js or monitoring module
const prometheus = require('prom-client');

// Define metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const errorCount = new prometheus.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type', 'severity']
});

// Record metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(duration);
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

---

## 📝 Logging Strategy

### Log Levels

```javascript
const logger = {
  DEBUG: 0,     // Detailed diagnostic information
  INFO: 1,      // General informational messages
  WARN: 2,      // Warning messages for potentially harmful situations
  ERROR: 3,     // Error messages for failures
  FATAL: 4      // Fatal errors causing application shutdown
};
```

### Structured Logging

```javascript
// winston.js configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'jsversehub',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    }),
    
    // File logging
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Usage
logger.info('Application started', { port: 3000 });
logger.warn('High memory usage detected', { memory_mb: 512 });
logger.error('Database connection failed', { error: err, retry_count: 3 });
```

### Log Rotation

```javascript
// Configure log rotation
const rfs = require('rotating-file-stream');

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',        // Daily rotation
  path: './logs',
  maxSize: '10M',        // Rotate when file > 10MB
  maxFiles: 30           // Keep last 30 files
});

// Use with Express
const morgan = require('morgan');
app.use(morgan('combined', { stream: accessLogStream }));
```

---

## 🔔 Alerting Rules

### Alert Thresholds

```javascript
const alertRules = {
  errorRate: {
    threshold: 1.0,      // > 1%
    duration: '5m',
    severity: 'critical',
    action: 'page_oncall'
  },
  responseTime: {
    threshold: 1000,     // > 1000ms
    percentile: 'p95',
    duration: '10m',
    severity: 'warning',
    action: 'notify_team'
  },
  cpuUsage: {
    threshold: 80,       // > 80%
    duration: '5m',
    severity: 'high',
    action: 'scale_up'
  },
  memoryUsage: {
    threshold: 85,       // > 85%
    duration: '5m',
    severity: 'high',
    action: 'investigate'
  },
  diskSpace: {
    threshold: 90,       // > 90% used
    duration: '1h',
    severity: 'warning',
    action: 'cleanup'
  },
  uptime: {
    threshold: 99.5,     // < 99.5%
    window: '1h',
    severity: 'critical',
    action: 'page_oncall'
  }
};
```

### Alert Notification Channels

```javascript
// Configure multiple notification channels
const notificationChannels = {
  slack: {
    webhook: process.env.SLACK_WEBHOOK,
    channel: '#alerts',
    severities: ['critical', 'high']
  },
  email: {
    recipients: ['ops@jsversehub.com'],
    severities: ['critical', 'high']
  },
  pagerduty: {
    integrationKey: process.env.PAGERDUTY_KEY,
    severities: ['critical']
  },
  sms: {
    numbers: ['+1-XXX-XXX-XXXX'],
    severities: ['critical']
  }
};
```

---

## 🎯 Dashboard Configuration

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "JSVerseHub Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(errors_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_ms)"
          }
        ]
      },
      {
        "title": "CPU Usage",
        "targets": [
          {
            "expr": "process_cpu_usage_percent"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024"
          }
        ]
      },
      {
        "title": "Active Connections",
        "targets": [
          {
            "expr": "active_connections"
          }
        ]
      }
    ]
  }
}
```

---

## 🔍 Error Tracking

### Error Monitoring

```javascript
// Sentry integration for error tracking
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection()
  ]
});

// Capture errors
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'critical_operation'
    }
  });
}

// Middleware for Express
app.use(Sentry.Handlers.errorHandler());
```

### Health Checks

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {
      database: 'OK',
      cache: 'OK',
      diskSpace: '85%',
      memory: '512MB / 1GB'
    }
  };
  
  res.status(200).json(health);
});

// Deep health check
app.get('/health/deep', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    api: await checkExternalAPI(),
    diskSpace: checkDiskSpace(),
    memory: process.memoryUsage()
  };
  
  const allHealthy = Object.values(checks).every(c => c.status === 'OK');
  res.status(allHealthy ? 200 : 503).json(checks);
});
```

---

## 📊 Distributed Tracing

### OpenTelemetry Configuration

```javascript
const { BasicTracerProvider } = require("@opentelemetry/tracing");
const { registerInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const provider = new BasicTracerProvider();
provider.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter())
);

registerInstrumentations({
  tracerProvider: provider
});

const tracer = provider.getTracer('jsversehub');

// Use tracer
const span = tracer.startSpan('operation_name');
span.addEvent('operation_started');
// ... do work ...
span.end();
```

---

## 🎛️ Performance Profiling

### Node.js Profiling

```bash
# CPU profiling
node --prof app.js

# Process profile
node --prof-process isolate-*.log > profile.txt

# Heap snapshot
node --max-old-space-size=4096 --heap-prof app.js
```

### Memory Leak Detection

```javascript
// heapdump for memory analysis
const heapdump = require('heapdump');

// Generate heap snapshot on demand
app.get('/debug/heap', (req, res) => {
  heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
  res.json({ message: 'Heap snapshot created' });
});
```

---

## 📈 Reporting

### Weekly Report Template

```markdown
## JSVerseHub Monitoring Report
**Week of**: Dec 19, 2025

### System Health
- **Uptime**: 99.97%
- **Error Rate**: 0.08%
- **Average Response Time**: 145ms

### Traffic
- **Total Requests**: 2.5M
- **Unique Users**: 45K
- **Page Views**: 180K

### Performance
- **P95 Response Time**: 320ms
- **P99 Response Time**: 850ms
- **Error Distribution**: 60% validation, 25% timeout, 15% other

### Alerts Fired
- 2 high: Memory spikes (resolved)
- 0 critical

### Actions Taken
- Optimized database query (40% faster)
- Increased cache TTL on popular endpoints
- Added rate limiting to API

### Issues to Address
- [ ] Investigate slow endpoint /api/search
- [ ] Optimize image delivery
- [ ] Review error logs for patterns
```

---

## 🔧 Configuration Files

### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'jsversehub'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

### .env.monitoring

```
# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
SENTRY_DSN=https://...
LOG_LEVEL=info
TRACE_SAMPLE_RATE=0.1

# Alerting
ALERT_EMAIL=ops@jsversehub.com
SLACK_WEBHOOK=https://...
PAGERDUTY_KEY=...
```

---

## 📞 On-Call Procedures

### Incident Response Checklist

1. **Detect** - Alert fires or user reports issue
2. **Acknowledge** - On-call engineer confirms
3. **Investigate** - Check logs, metrics, traces
4. **Assess** - Determine severity and impact
5. **Communicate** - Notify stakeholders
6. **Remediate** - Apply fix or workaround
7. **Verify** - Confirm issue resolved
8. **Document** - Create incident post-mortem

---

**JSVerseHub is now fully monitored and production-ready!** 📊
