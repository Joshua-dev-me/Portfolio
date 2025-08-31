# 🚀 Deployment Guide - Render & Vercel

This guide will walk you through deploying your Me-API Playground to both Render and Vercel.

## 🌐 Render Deployment

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)

### Step 1: Connect to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your project

### Step 2: Configure the Service
- **Name**: `me-api-playground` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or upgrade if needed)

### Step 3: Set Environment Variables
In the Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the build to complete
4. Your app will be available at the provided URL

### Step 5: Database Setup
For the database, you have several options:
1. **Use Render's PostgreSQL** (free tier available)
2. **External MySQL service** (PlanetScale, AWS RDS, etc.)
3. **Local database** (for testing only)

## ⚡ Vercel Deployment

### Prerequisites
- Node.js installed locally
- Vercel CLI installed: `npm i -g vercel`

### Step 1: Prepare Your Project
1. Ensure your project is in a Git repository
2. Make sure all dependencies are in `package.json`

### Step 2: Deploy with Vercel CLI
```bash
# Navigate to your project directory
cd /path/to/your/project

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables
During deployment, Vercel will ask for environment variables. Set these:

```bash
NODE_ENV=production
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Step 4: Verify Deployment
1. Vercel will provide you with a deployment URL
2. Test your endpoints:
   - Health check: `https://your-app.vercel.app/health`
   - API: `https://your-app.vercel.app/api/profile`

## 🔧 Database Setup Options

### Option 1: Render PostgreSQL (Recommended for Render)
1. Create a new PostgreSQL service in Render
2. Use the connection details in your environment variables
3. Update your database connection to use PostgreSQL

### Option 2: PlanetScale MySQL (Recommended for Vercel)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Use the connection details in your environment variables

### Option 3: External MySQL Service
1. Use any MySQL-compatible service (AWS RDS, Google Cloud SQL, etc.)
2. Configure network access and security
3. Use the connection details in your environment variables

## 🚨 Important Notes

### CORS Configuration
- For production, update `CORS_ORIGIN` to your actual frontend domain
- Avoid using `*` in production for security

### Database Security
- Never commit database credentials to Git
- Use environment variables for all sensitive data
- Consider using connection pooling for production

### Rate Limiting
- Adjust rate limits based on your expected traffic
- Monitor usage to prevent abuse

### Health Checks
- Both platforms will use `/health` endpoint for monitoring
- Ensure this endpoint responds quickly

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Verify build commands are correct

2. **Database Connection Issues**
   - Verify database credentials
   - Check network access and firewall rules
   - Ensure database is running and accessible

3. **Environment Variable Issues**
   - Double-check variable names and values
   - Restart the service after changing variables
   - Check for typos in variable names

4. **CORS Issues**
   - Verify `CORS_ORIGIN` is set correctly
   - Check browser console for CORS errors
   - Test with Postman or similar tool

### Getting Help
- Check the platform's documentation
- Review build logs for specific error messages
- Test locally with production environment variables

## 🎉 Success Checklist

- [ ] App deploys successfully
- [ ] Health check endpoint responds
- [ ] Database connection works
- [ ] API endpoints are accessible
- [ ] Frontend loads correctly
- [ ] Environment variables are set
- [ ] Monitoring and logging work
- [ ] SSL/HTTPS is enabled (automatic on both platforms)

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Render**: Automatically deploys on Git push to main branch
- **Vercel**: Automatically deploys on Git push to main branch

To enable:
1. Connect your GitHub repository
2. Configure deployment settings
3. Push changes to trigger automatic deployment

---

**Happy Deploying! 🚀**
