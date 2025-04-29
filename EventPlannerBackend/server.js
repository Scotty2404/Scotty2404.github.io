// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const { router: authRoutes } = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

// Create Express app
const app = express();

// Increase request size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure CORS for cross-origin requests
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'event_management'
};

// Use test database if in test environment
if(process.env.NODE_ENV === 'test') {
  dbConfig.database = process.env.TEST_DB_NAME || 'event_management_test';
}

// Create MySQL connection
const mysql = require('mysql2');
const db = mysql.createConnection(dbConfig);

// Establish connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log(`MySQL database connected: ${dbConfig.database}`);
});

// Make database connection available globally
global.db = db;

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/surveys', surveyRoutes);

// Test endpoint for database connection
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection failed', 
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: 'Database connection successful', 
      data: { 
        result: results[0].result,
        tables: [] 
      }
    });
    
    // List tables (optional)
    db.query('SHOW TABLES', (err, tables) => {
      if (!err) {
        console.log('Available tables:', tables);
      }
    });
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app for testing purposes
module.exports = app;