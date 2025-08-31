#!/bin/bash

echo "⚡ Deploying to Vercel..."
echo "========================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"

# Check if project is already linked
if [ -f ".vercel/project.json" ]; then
    echo "📁 Project already linked to Vercel"
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "🔗 Linking project to Vercel..."
    echo "Please follow the prompts to configure your project:"
    echo ""
    echo "When prompted, set these environment variables:"
    echo "  NODE_ENV=production"
    echo "  DB_HOST=your-database-host"
    echo "  DB_USER=your-database-user"
    echo "  DB_PASSWORD=your-database-password"
    echo "  DB_NAME=your-database-name"
    echo "  DB_PORT=3306"
    echo "  CORS_ORIGIN=*"
    echo "  RATE_LIMIT_WINDOW_MS=900000"
    echo "  RATE_LIMIT_MAX_REQUESTS=100"
    echo "  LOG_LEVEL=info"
    echo ""
    echo "After linking, run: vercel --prod"
    
    vercel
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Your app is now live at the provided URL"
echo "Test your endpoints:"
echo "  - Health: /health"
echo "  - API: /api/profile"
echo "  - Frontend: /"
