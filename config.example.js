// Me-API Playground Configuration Example
// Copy this file to config.js and modify the values as needed

module.exports = {
  // Server configuration
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  
  // MySQL Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'me_api_playground',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    queueLimit: 0
  },
  
  // Security configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
