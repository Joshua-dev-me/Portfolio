#!/bin/bash

echo "🚀 Deploying to Render..."
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/username/repository.git"
    exit 1
fi

echo "✅ Git repository configured"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Render - $(date)"
git push origin main

echo ""
echo "🎉 Code pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=3001"
echo "   - DB_HOST=your-database-host"
echo "   - DB_USER=your-database-user"
echo "   - DB_PASSWORD=your-database-password"
echo "   - DB_NAME=your-database-name"
echo "   - DB_PORT=3306"
echo "   - CORS_ORIGIN=*"
echo "5. Click 'Create Web Service'"
echo ""
echo "🚀 Your app will be deployed automatically!"
