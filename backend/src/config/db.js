const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection and print status
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully to MySQL.');
    connection.release();
    await runMigrations();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.log('Please ensure MySQL is running and the database "task_manager" exists.');
  }
}

// Auto-migration function to ensure column is_priority exists
async function runMigrations() {
  try {
    const [rows] = await pool.execute("SHOW COLUMNS FROM tasks LIKE 'is_priority'");
    if (rows.length === 0) {
      console.log('Column "is_priority" not found in tasks table. Running migration...');
      await pool.execute("ALTER TABLE tasks ADD COLUMN is_priority TINYINT(1) DEFAULT 0");
      console.log('Migration completed successfully: "is_priority" added to tasks.');
    }
  } catch (err) {
    console.warn('Database migration skipped or failed:', err.message);
  }
}

testConnection();

module.exports = pool;
