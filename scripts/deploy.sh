#!/bin/bash

# JSVerseHub v1.0.0 Production Deployment Script
# This script automates the deployment of JSVerseHub to production

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
print_header "JSVerseHub v1.0.0 Production Deployment"

echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js not installed. Please install Node.js >= 16.0.0"
fi
print_success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm not installed. Please install npm >= 7.0.0"
fi
print_success "npm found: $(npm --version)"

# Load environment
if [ ! -f ".env.production" ]; then
    print_error ".env.production not found. Please create it using .env.example as template."
fi
print_success ".env.production found"

# Install dependencies
print_header "Installing Dependencies"
npm install --production

# Run validation
print_header "Running Validation"
npm run validate

# Build for production
print_header "Building for Production"
npm run build

# Create backup
print_header "Creating Backup"
if [ -d "dist.backup" ]; then
    rm -rf dist.backup
fi
cp -r dist dist.backup
print_success "Backup created: dist.backup"

# Deployment method selection
print_header "Select Deployment Method"
echo "1) Docker (recommended)"
echo "2) Traditional Server (systemd)"
echo "3) PM2 Process Manager"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        print_header "Docker Deployment"
        docker --version > /dev/null || print_error "Docker not installed"
        docker build -t jsversehub:1.0.0 .
        print_success "Docker image built"
        docker-compose up -d
        print_success "Container deployed"
        sleep 2
        curl http://localhost:3000/health || print_warning "Health check failed"
        ;;
    2)
        print_header "Traditional Server Deployment"
        sudo cp jsversehub.service /etc/systemd/system/
        sudo systemctl daemon-reload
        sudo systemctl enable jsversehub
        sudo systemctl start jsversehub
        print_success "Systemd service deployed"
        sleep 2
        curl http://localhost:3000/health || print_warning "Health check failed"
        ;;
    3)
        print_header "PM2 Process Manager Deployment"
        npm install -g pm2 || print_warning "PM2 install skipped"
        pm2 start ecosystem.config.js
        pm2 save
        print_success "PM2 deployment complete"
        sleep 2
        curl http://localhost:3000/health || print_warning "Health check failed"
        ;;
    *)
        print_error "Invalid choice"
        ;;
esac

# Verify deployment
print_header "Verifying Deployment"
sleep 2

if curl -s http://localhost:3000/health > /dev/null; then
    print_success "Application is running"
    print_success "Health check passed"
else
    print_warning "Health check failed - application may still be starting"
fi

# Display URLs
print_header "Deployment Complete!"
echo ""
echo "Application URL: http://localhost:3000"
echo "Health Check: http://localhost:3000/health"
echo "Metrics: http://localhost:3000/metrics"
echo ""
echo "Next steps:"
echo "1. Configure reverse proxy (Nginx)"
echo "2. Setup SSL/TLS certificates"
echo "3. Enable monitoring (Prometheus/Grafana)"
echo "4. Configure logging aggregation"
echo "5. Setup alerting rules"
echo ""
echo "Documentation:"
echo "- Deployment: See DEPLOYMENT.md"
echo "- Monitoring: See MONITORING.md"
echo "- Build: See BUILD_AND_PRODUCTION.md"
echo "- Release: See RELEASE.md"
echo ""

print_success "JSVerseHub v1.0.0 is now deployed! 🚀"
