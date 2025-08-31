const db = require('../database/db');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Initialize database (this will create tables)
    await db.initialize();
    
    console.log('Database initialized successfully!');
    console.log('Tables created:');
    console.log('- profile');
    console.log('- skills');
    console.log('- projects');
    console.log('- project_skills');
    console.log('- work_experience');
    console.log('');
    console.log('You can now run "npm run seed-db" to populate the database with sample data.');
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    db.close();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
