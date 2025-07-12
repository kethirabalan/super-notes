#!/bin/bash

# SuperNotes Production Deployment Script
# This script automates the production deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="SuperNotes"
VERSION=$(node -p "require('./package.json').version")
BUILD_TYPE=${1:-"production"}

echo -e "${BLUE}🚀 Starting $APP_NAME Production Deployment${NC}"
echo -e "${BLUE}Version: $VERSION${NC}"
echo -e "${BLUE}Build Type: $BUILD_TYPE${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if EAS CLI is installed
    if ! command -v eas &> /dev/null; then
        print_error "EAS CLI is not installed. Install with: npm install -g @expo/eas-cli"
        exit 1
    fi
    
    # Check if logged in to EAS
    if ! eas whoami &> /dev/null; then
        print_error "Not logged in to EAS. Run: eas login"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Clean and install dependencies
setup_dependencies() {
    print_status "Setting up dependencies..."
    
    # Clean install
    rm -rf node_modules
    rm -rf .expo
    npm ci
    
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Type checking
    npm run type-check
    
    # Linting
    npm run lint
    
    # Run tests if available
    if npm run test &> /dev/null; then
        npm run test
    else
        print_warning "No tests configured"
    fi
    
    print_status "Tests completed"
}

# Build for different platforms
build_app() {
    print_status "Building application..."
    
    case $BUILD_TYPE in
        "android")
            print_status "Building for Android..."
            eas build --platform android --profile production --non-interactive
            ;;
        "ios")
            print_status "Building for iOS..."
            eas build --platform ios --profile production --non-interactive
            ;;
        "web")
            print_status "Building for Web..."
            npm run deploy:web
            ;;
        "all")
            print_status "Building for all platforms..."
            eas build --platform all --profile production --non-interactive
            ;;
        *)
            print_error "Invalid build type. Use: android, ios, web, or all"
            exit 1
            ;;
    esac
    
    print_status "Build completed"
}

# Submit to app stores
submit_to_stores() {
    if [ "$BUILD_TYPE" = "android" ] || [ "$BUILD_TYPE" = "ios" ] || [ "$BUILD_TYPE" = "all" ]; then
        print_status "Submitting to app stores..."
        
        if [ "$BUILD_TYPE" = "android" ] || [ "$BUILD_TYPE" = "all" ]; then
            print_status "Submitting to Google Play Store..."
            eas submit --platform android --profile production --non-interactive
        fi
        
        if [ "$BUILD_TYPE" = "ios" ] || [ "$BUILD_TYPE" = "all" ]; then
            print_status "Submitting to Apple App Store..."
            eas submit --platform ios --profile production --non-interactive
        fi
        
        print_status "App store submission completed"
    fi
}

# Update version
update_version() {
    print_status "Updating version..."
    
    # Update version in package.json
    npm version patch --no-git-tag-version
    
    # Update version in app.json
    NEW_VERSION=$(node -p "require('./package.json').version")
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" app.json
    
    print_status "Version updated to $NEW_VERSION"
}

# Create deployment tag
create_tag() {
    print_status "Creating deployment tag..."
    
    git add .
    git commit -m "Release v$VERSION - Production deployment"
    git tag -a "v$VERSION" -m "Release v$VERSION"
    git push origin main --tags
    
    print_status "Deployment tag created"
}

# Main deployment process
main() {
    echo -e "${BLUE}📋 Starting deployment process...${NC}"
    
    # Check prerequisites
    check_prerequisites
    
    # Setup dependencies
    setup_dependencies
    
    # Run tests
    run_tests
    
    # Update version
    update_version
    
    # Build application
    build_app
    
    # Submit to stores (if applicable)
    submit_to_stores
    
    # Create deployment tag
    create_tag
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}Version: $VERSION${NC}"
    echo -e "${GREEN}Build Type: $BUILD_TYPE${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "${BLUE}1. Monitor app store review process${NC}"
    echo -e "${BLUE}2. Check Firebase Analytics for any issues${NC}"
    echo -e "${BLUE}3. Monitor crash reports${NC}"
    echo -e "${BLUE}4. Update documentation if needed${NC}"
}

# Run main function
main "$@" 