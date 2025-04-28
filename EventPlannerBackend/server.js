require('dotenv').config();
const mysql = require('mysql2');
const app = require('./app');
/*
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
*/
app.listen(5000, () => console.log("Server running on Port 5000"));