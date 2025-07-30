#!/bin/bash

# AI Resume Builder Deployment Script
# This script automates the deployment process for both frontend and backend

set -e  # Exit on any error

echo "🚀 Starting AI Resume Builder Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Function to deploy backend
deploy_backend() {
    print_status "Deploying Backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install --production
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 not found. Installing PM2..."
        npm install -g pm2
    fi
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Start with PM2
    print_status "Starting backend with PM2..."
    pm2 start ecosystem.config.js --env production
    
    print_status "Backend deployed successfully!"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    print_status "Deploying Frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build the application
    print_status "Building frontend application..."
    npm run build
    
    # Start with PM2 if PM2 is available
    if command -v pm2 &> /dev/null; then
        print_status "Starting frontend with PM2..."
        pm2 start npm --name "resume-builder-frontend" -- start
    else
        print_warning "PM2 not found. Starting frontend with npm start..."
        npm start &
    fi
    
    print_status "Frontend deployed successfully!"
    cd ..
}

# Function to deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build and start containers
    print_status "Building and starting Docker containers..."
    docker-compose up -d --build
    
    print_status "Docker deployment completed!"
}

# Function to check deployment status
check_status() {
    print_status "Checking deployment status..."
    
    # Check backend health
    if curl -s http://localhost:5000/health > /dev/null; then
        print_status "✅ Backend is running"
    else
        print_error "❌ Backend is not responding"
    fi
    
    # Check frontend
    if curl -s http://localhost:3000 > /dev/null; then
        print_status "✅ Frontend is running"
    else
        print_error "❌ Frontend is not responding"
    fi
    
    # Check MongoDB (if running locally)
    if command -v mongod &> /dev/null; then
        if pgrep mongod > /dev/null; then
            print_status "✅ MongoDB is running"
        else
            print_warning "⚠️  MongoDB is not running locally"
        fi
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  backend     Deploy only the backend"
    echo "  frontend    Deploy only the frontend"
    echo "  docker      Deploy using Docker"
    echo "  all         Deploy both frontend and backend"
    echo "  status      Check deployment status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 all        # Deploy everything"
    echo "  $0 docker     # Deploy with Docker"
    echo "  $0 status     # Check status"
}

# Main script logic
case "${1:-all}" in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "docker")
        deploy_docker
        ;;
    "all")
        deploy_backend
        deploy_frontend
        ;;
    "status")
        check_status
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        print_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac

print_status "Deployment completed! 🎉"
print_status "Frontend: http://localhost:3000"
print_status "Backend: http://localhost:5000"
print_status "Health Check: http://localhost:5000/health" 