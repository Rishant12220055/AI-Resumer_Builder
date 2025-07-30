# AI Resume Builder Deployment Script for Windows
# This script automates the deployment process for both frontend and backend

param(
    [Parameter(Position=0)]
    [ValidateSet("backend", "frontend", "docker", "all", "status", "help")]
    [string]$Action = "all"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting AI Resume Builder Deployment..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Status "Node.js version: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
}

# Check Node.js version
$nodeMajorVersion = (node --version).Split('.')[0].TrimStart('v')
if ([int]$nodeMajorVersion -lt 18) {
    Write-Error "Node.js version 18+ is required. Current version: $nodeVersion"
    exit 1
}

# Function to deploy backend
function Deploy-Backend {
    Write-Status "Deploying Backend..."
    
    Set-Location backend
    
    # Install dependencies
    Write-Status "Installing backend dependencies..."
    npm install --production
    
    # Check if PM2 is installed
    try {
        pm2 --version | Out-Null
        Write-Status "PM2 is installed"
    } catch {
        Write-Warning "PM2 not found. Installing PM2..."
        npm install -g pm2
    }
    
    # Create logs directory if it doesn't exist
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
    }
    
    # Start with PM2
    Write-Status "Starting backend with PM2..."
    pm2 start ecosystem.config.js --env production
    
    Write-Status "Backend deployed successfully!"
    Set-Location ..
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Status "Deploying Frontend..."
    
    Set-Location frontend
    
    # Install dependencies
    Write-Status "Installing frontend dependencies..."
    npm install
    
    # Build the application
    Write-Status "Building frontend application..."
    npm run build
    
    # Start with PM2 if PM2 is available
    try {
        pm2 --version | Out-Null
        Write-Status "Starting frontend with PM2..."
        pm2 start npm --name "resume-builder-frontend" -- start
    } catch {
        Write-Warning "PM2 not found. Starting frontend with npm start..."
        Start-Process npm -ArgumentList "start" -WindowStyle Hidden
    }
    
    Write-Status "Frontend deployed successfully!"
    Set-Location ..
}

# Function to deploy with Docker
function Deploy-Docker {
    Write-Status "Deploying with Docker..."
    
    # Check if Docker is installed
    try {
        docker --version | Out-Null
    } catch {
        Write-Error "Docker is not installed. Please install Docker first."
        exit 1
    }
    
    # Check if Docker Compose is installed
    try {
        docker-compose --version | Out-Null
    } catch {
        Write-Error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    }
    
    # Build and start containers
    Write-Status "Building and starting Docker containers..."
    docker-compose up -d --build
    
    Write-Status "Docker deployment completed!"
}

# Function to check deployment status
function Check-Status {
    Write-Status "Checking deployment status..."
    
    # Check backend health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "✅ Backend is running"
        } else {
            Write-Error "❌ Backend is not responding"
        }
    } catch {
        Write-Error "❌ Backend is not responding"
    }
    
    # Check frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "✅ Frontend is running"
        } else {
            Write-Error "❌ Frontend is not responding"
        }
    } catch {
        Write-Error "❌ Frontend is not responding"
    }
    
    # Check MongoDB (if running locally)
    try {
        $mongodProcess = Get-Process mongod -ErrorAction SilentlyContinue
        if ($mongodProcess) {
            Write-Status "✅ MongoDB is running"
        } else {
            Write-Warning "⚠️  MongoDB is not running locally"
        }
    } catch {
        Write-Warning "⚠️  MongoDB is not running locally"
    }
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\deploy.ps1 [OPTION]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  backend     Deploy only the backend"
    Write-Host "  frontend    Deploy only the frontend"
    Write-Host "  docker      Deploy using Docker"
    Write-Host "  all         Deploy both frontend and backend"
    Write-Host "  status      Check deployment status"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 all        # Deploy everything"
    Write-Host "  .\deploy.ps1 docker     # Deploy with Docker"
    Write-Host "  .\deploy.ps1 status     # Check status"
}

# Main script logic
switch ($Action) {
    "backend" {
        Deploy-Backend
    }
    "frontend" {
        Deploy-Frontend
    }
    "docker" {
        Deploy-Docker
    }
    "all" {
        Deploy-Backend
        Deploy-Frontend
    }
    "status" {
        Check-Status
    }
    "help" {
        Show-Usage
        return
    }
    default {
        Write-Error "Unknown option: $Action"
        Show-Usage
        exit 1
    }
}

Write-Status "Deployment completed! 🎉"
Write-Status "Frontend: http://localhost:3000"
Write-Status "Backend: http://localhost:5000"
Write-Status "Health Check: http://localhost:5000/health" 