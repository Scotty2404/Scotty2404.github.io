require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const { router: authRoutes } = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Datenbank konfigurieren
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_management'
};

// Wenn umgebungsvariable auf test gesetzt ist, test-db verwenden
if(process.env.NODE_ENV === 'test') {
    dbConfig.database = process.env.TEST_DB_NAME || 'event_management_test';
}

// MySQL Verbindung erstellen
const db = mysql.createConnection(dbConfig);

// Verbindung herstellen
db.connect((err) => {
  if (err) {
    console.error('Fehler bei der Verbindung zur MySQL Datenbank:', err);
    return;
  }
  console.log(`MySQL Datenbank verbunden: ${dbConfig.database}`);
});

global.db = db;

module.exports = app;