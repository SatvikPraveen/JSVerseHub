# Production Deployment Guide

## JSVerseHub v1.0.0 Production Deployment

This guide covers deploying JSVerseHub to production environments.

---

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (100% test coverage)
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Performance benchmarks acceptable
- [ ] Documentation up to date
- [ ] Changelog updated
- [ ] Version bumped to v1.0.0
- [ ] All dependencies pinned
- [ ] Environment variables documented

---

## 🚀 Deployment Methods

### Method 1: Docker (Recommended)

#### Prerequisites
- Docker installed (v20+)
- Docker Compose installed (v1.29+)

#### Build and Deploy

```bash
# Build Docker image
docker build -t jsversehub:1.0.0 .

# Tag image
docker tag jsversehub:1.0.0 yourusername/jsversehub:1.0.0

# Push to registry
docker push yourusername/jsversehub:1.0.0

# Run container
docker run -d \
  --name jsversehub \
  -p 3000:3000 \
  -e NODE_ENV=production \
  jsversehub:1.0.0

# Or use Docker Compose
docker-compose up -d
```

#### Docker Configuration

Environment variables in `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - LOG_LEVEL=info
  - PORT=3000
```

### Method 2: Traditional Server

#### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Systemd or PM2 for process management

#### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/jsversehub.git
cd jsversehub

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Create systemd service
sudo nano /etc/systemd/system/jsversehub.service
```

#### Systemd Service File

```ini
[Unit]
Description=JSVerseHub Production Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/jsversehub
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/jsversehub/app.log
StandardError=append:/var/log/jsversehub/error.log

[Install]
WantedBy=multi-user.target
```

#### Start Service

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable jsversehub
sudo systemctl start jsversehub

# Check status
sudo systemctl status jsversehub

# View logs
sudo journalctl -u jsversehub -f
```

### Method 3: PM2 Process Manager

```bash
# Global install
npm install -g pm2

# Start application
pm2 start app.js --name jsversehub --env production

# Save process list
pm2 save

# Configure startup
pm2 startup
pm2 save

# Monitor
pm2 monit
```

#### PM2 Ecosystem File (ecosystem.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'jsversehub',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

---

## 🌐 Nginx Configuration (Reverse Proxy)

```nginx
upstream jsversehub {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  keepalive 64;
}

server {
  listen 80;
  server_name jsversehub.example.com;
  
  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name jsversehub.example.com;

  # SSL Configuration
  ssl_certificate /etc/ssl/certs/jsversehub.crt;
  ssl_certificate_key /etc/ssl/private/jsversehub.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Compression
  gzip on;
  gzip_types text/plain text/css text/javascript application/json;
  gzip_min_length 256;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy "default-src 'self';" always;

  # Proxy configuration
  location / {
    proxy_pass http://jsversehub;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }

  # Static files caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 🔐 Security Hardening

### Environment Variables

Create `.env.production`:
```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
SECURITY_HEADERS=enabled
RATE_LIMIT=100
SESSION_SECRET=your-secret-key-here
```

### SSL/TLS Setup

```bash
# Let's Encrypt with Certbot
sudo certbot certonly --webroot -w /var/www/jsversehub -d jsversehub.example.com

# Auto-renewal
sudo certbot renew --quiet --no-eff-email
```

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban for brute-force protection
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
```

---

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Check logs
pm2 logs jsversehub

# Generate report
pm2 report
```

### Log Aggregation

```bash
# Create log directory
sudo mkdir -p /var/log/jsversehub
sudo chown www-data:www-data /var/log/jsversehub

# Configure log rotation
sudo nano /etc/logrotate.d/jsversehub
```

#### Logrotate Configuration

```
/var/log/jsversehub/*.log {
  daily
  rotate 14
  compress
  delaycompress
  notifempty
  create 0640 www-data www-data
  sharedscripts
  postrotate
    /bin/systemctl reload jsversehub > /dev/null 2>&1 || true
  endscript
}
```

### Performance Monitoring

```bash
# CPU and Memory monitoring
top -p $(pgrep -f "node.*jsversehub")

# Network monitoring
netstat -an | grep ESTABLISHED | wc -l

# Disk usage
du -sh /opt/jsversehub
```

---

## 🔄 Backup & Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/jsversehub"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/jsversehub_$DATE.tar.gz /opt/jsversehub

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/jsversehub_$DATE.tar.gz s3://your-bucket/backups/
```

### Restore Procedure

```bash
# Stop service
sudo systemctl stop jsversehub

# Restore from backup
tar -xzf jsversehub_backup.tar.gz -C /opt

# Restart service
sudo systemctl start jsversehub

# Verify
curl http://localhost:3000/health
```

---

## 🚨 Incident Response

### Health Check Endpoint

Add health check to your application:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
```

### Rollback Procedure

```bash
# Keep previous version
cp -r jsversehub jsversehub.backup

# Rollback
git checkout v0.9.0
npm ci
npm run build
pm2 restart jsversehub
```

---

## 📈 Performance Optimization

### Caching Strategy

```javascript
// Redis caching (optional)
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Cache API responses
app.get('/api/concepts', (req, res) => {
  const cacheKey = 'concepts:all';
  
  client.get(cacheKey, (err, data) => {
    if (data) {
      return res.json(JSON.parse(data));
    }
    
    // Get from database
    const concepts = getConceptsFromDB();
    client.setex(cacheKey, 3600, JSON.stringify(concepts));
    res.json(concepts);
  });
});
```

### CDN Setup

```bash
# Cloudflare integration
# 1. Add jsversehub.example.com to Cloudflare
# 2. Update nameservers
# 3. Configure caching rules in Cloudflare dashboard
# 4. Enable DDoS protection
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Run full test suite
- [ ] Build production bundle
- [ ] Verify all dependencies
- [ ] Check environment variables
- [ ] Review security settings
- [ ] Backup current production
- [ ] Create rollback plan

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Verify health checks
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Deploy to production
- [ ] Final verification

### Post-Deployment
- [ ] Verify uptime
- [ ] Check error rates
- [ ] Monitor resource usage
- [ ] Review user feedback
- [ ] Document changes
- [ ] Celebrate success! 🎉

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Application not starting
```bash
# Check logs
journalctl -u jsversehub -n 50
pm2 logs jsversehub

# Verify permissions
ls -la /opt/jsversehub

# Check port availability
netstat -tlnp | grep 3000
```

**Issue**: High memory usage
```bash
# Check memory leak
node --max-old-space-size=4096 server.js

# Monitor process
ps aux | grep node

# Restart service
sudo systemctl restart jsversehub
```

**Issue**: Slow responses
```bash
# Check CPU
top -p $(pgrep -f "node.*jsversehub")

# Check disk I/O
iostat -x 1

# Review application logs
pm2 logs jsversehub --lines 100 --err
```

---

## 🎓 Additional Resources

- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

**JSVerseHub v1.0.0 is now ready for production deployment!** 🚀
