require('dotenv').config();
const mysql = require('mysql2');
const cors = require('cors');

const { router: authRoutes } = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();

// Erhöhe die Größenbeschränkung für Requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Konfiguriere CORS richtig
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/surveys', surveyRoutes);

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

*/
app.listen(5000, () => console.log("Server running on Port 5000"));