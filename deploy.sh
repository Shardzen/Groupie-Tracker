#!/bin/bash
# =====================================================
# DEPLOYMENT SCRIPT - Groupie Tracker
# =====================================================
# Usage: ./deploy.sh [frontend|backend|all]

set -e  # Exit on error

COLOR_RESET="\033[0m"
COLOR_INFO="\033[0;36m"
COLOR_SUCCESS="\033[0;32m"
COLOR_ERROR="\033[0;31m"

info() {
    echo -e "${COLOR_INFO}ℹ️  $1${COLOR_RESET}"
}

success() {
    echo -e "${COLOR_SUCCESS}✅ $1${COLOR_RESET}"
}

error() {
    echo -e "${COLOR_ERROR}❌ $1${COLOR_RESET}"
}

# =====================================================
# FRONTEND DEPLOYMENT (Netlify)
# =====================================================
deploy_frontend() {
    info "Building Frontend..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        info "Installing dependencies..."
        npm install
    fi
    
    # Build
    npm run build
    success "Frontend build complete!"
    
    # Deploy to Netlify (requires netlify-cli)
    if command -v netlify &> /dev/null; then
        info "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        success "Frontend deployed to Netlify!"
    else
        info "Netlify CLI not found. Install with: npm install -g netlify-cli"
        info "Or push to Git - Netlify auto-deploys on push!"
    fi
    
    cd ..
}

# =====================================================
# BACKEND DEPLOYMENT (Docker)
# =====================================================
deploy_backend() {
    info "Building Backend Docker image..."
    cd backend
    
    # Build Docker image
    docker build -t groupie-tracker-api:latest .
    success "Backend Docker image built!"
    
    # Optional: Push to Docker Hub
    read -p "Push to Docker Hub? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Docker Hub username: " username
        docker tag groupie-tracker-api:latest $username/groupie-tracker-api:latest
        docker push $username/groupie-tracker-api:latest
        success "Backend pushed to Docker Hub!"
    fi
    
    cd ..
}

# =====================================================
# MAIN SCRIPT
# =====================================================
case "${1:-all}" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    all)
        info "Deploying full stack..."
        deploy_backend
        deploy_frontend
        success "Full deployment complete! 🎉"
        ;;
    *)
        error "Invalid argument. Use: frontend, backend, or all"
        exit 1
        ;;
esac

info "
📝 Next Steps:
   Frontend: https://your-app.netlify.app
   Backend:  Configure in AWS EC2 or your hosting platform
   
   Set environment variables:
   - Backend: DATABASE_URL, JWT_SECRET, PORT
   - Frontend: VITE_API_URL (in Netlify dashboard)
"
