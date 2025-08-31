const mysql = require('mysql2/promise');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'me_api_playground',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Database schema
const schema = `
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    education TEXT,
    github VARCHAR(500),
    linkedin VARCHAR(500),
    portfolio VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    proficiency INT CHECK(proficiency >= 1 AND proficiency <= 5),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_link VARCHAR(500),
    live_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_skills (
    project_id INT,
    skill_id INT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_projects_title ON projects(title);
CREATE INDEX IF NOT EXISTS idx_project_skills_project ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills(skill_id);
`;

// Initialize database
async function initialize() {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('MySQL connection established successfully');
    
    // Create database if it doesn't exist (use query for DDL commands)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    // Create tables
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // Ignore "already exists" errors for indexes
          if (!error.message.includes('Duplicate key name')) {
            console.warn('Warning creating table/index:', error.message);
          }
        }
      }
    }
    
    connection.release();
    console.log('Database schema initialized successfully');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get database pool
function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initialize() first.');
  }
  return pool;
}

// Close database connection
async function close() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Helper function to run queries with promises
async function run(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return { id: result.insertId, changes: result.affectedRows };
  } finally {
    connection.release();
  }
}

async function get(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    // Use query for SELECT statements to avoid parameter binding issues
    const [rows] = await connection.query(sql, params);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function all(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    // Use query for SELECT statements to avoid LIMIT parameter issues
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  initialize,
  getPool,
  close,
  run,
  get,
  all
};
