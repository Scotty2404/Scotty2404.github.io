require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const { router: authRoutes } = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// MySQL Verbindung erstellen
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'event_management'
});

// Verbindung herstellen
db.connect((err) => {
  if (err) {
    console.error('Fehler bei der Verbindung zur MySQL Datenbank:', err);
    return;
  }
  console.log('MySQL Datenbank verbunden');
});

// Datenbank global verfügbar machen
global.db = db;

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Testendpoint für Datenbankverbindung
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Datenbankverbindung fehlgeschlagen', 
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: 'Datenbankverbindung erfolgreich', 
      data: { 
        result: results[0].result,
        tables: [] 
      }
    });
    
    // Tabellen auflisten (optional)
    db.query('SHOW TABLES', (err, tables) => {
      if (!err) {
        console.log('Verfügbare Tabellen:', tables);
      }
    });
  });
});

app.listen(5000, () => console.log("Server running on Port 5000"));