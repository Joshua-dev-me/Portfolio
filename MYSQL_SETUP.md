# MySQL Setup Guide

This project has been migrated from SQLite to MySQL. Follow these steps to set up MySQL:

## Prerequisites

1. **Install MySQL Server** (if not already installed)
   - Windows: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - Or use XAMPP/WAMP which includes MySQL

2. **Install MySQL Workbench** (optional but recommended)
   - Download from [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Setup Steps

### 1. Start MySQL Service
Make sure MySQL service is running on your system.

### 2. Create Database and User
Connect to MySQL as root and run:

```sql
-- Create database
CREATE DATABASE me_api_playground;

-- Create user (optional - you can use root)
CREATE USER 'me_api_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON me_api_playground.* TO 'me_api_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment Variables
Create a `.env` file in your project root with:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root          # or your created user
DB_PASSWORD=          # your MySQL password
DB_NAME=me_api_playground
DB_PORT=3306

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Initialize Database
Run the database initialization:

```bash
npm run init-db
```

### 5. Seed Database
Populate with sample data:

```bash
npm run seed-db
```

### 6. Start Application
Start the development server:

```bash
npm run dev
```

## Troubleshooting

### Connection Issues
- Ensure MySQL service is running
- Check if port 3306 is available
- Verify username/password in .env file
- Make sure database exists

### Permission Issues
- Ensure user has CREATE, INSERT, UPDATE, DELETE privileges
- Check if user can access the database

### Port Conflicts
- MySQL default port is 3306
- Change in .env if needed: `DB_PORT=3307`

## Database Schema

The application will automatically create these tables:
- `profile` - Candidate profile information
- `skills` - Skills with proficiency levels
- `projects` - Project portfolio
- `project_skills` - Many-to-many relationship
- `work_experience` - Employment history

## Benefits of MySQL over SQLite

- **Better Performance**: Optimized for concurrent connections
- **Scalability**: Handles multiple users better
- **Advanced Features**: Stored procedures, triggers, views
- **Backup & Recovery**: Better backup tools and recovery options
- **Monitoring**: Better monitoring and performance analysis tools

