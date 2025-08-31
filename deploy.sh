
\

\
''



#!/bin/bash

# Me-API Playground Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 Me-API Playground Deployment Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database
echo "🗄️ Initializing database..."
npm run init-db

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
npm run seed-db

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "  Development: npm run dev"
echo "  Production:  npm start"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3001"
echo "  Health:   http://localhost:3001/health"
echo "  API:      http://localhost:3001/api"
echo ""
echo "📚 For more information, see the README.md file"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Deployment options:"
echo ""
echo "1. 🌐 Render (Recommended - Easy & Free):"
echo "   • Connect GitHub repo to Render"
echo "   • Use render.yaml for automatic setup"
echo "   • Set environment variables in dashboard"
echo ""
echo "2. ⚡ Vercel (Fast & Free):"
echo "   • Install Vercel CLI: npm i -g vercel"
echo "   • Login: vercel login"
echo "   • Deploy: vercel --prod"
echo ""
echo "⚠️  IMPORTANT: Update database credentials in Render/Vercel dashboard!"
echo "⚠️  IMPORTANT: Set NODE_ENV=production in deployment platforms!"
