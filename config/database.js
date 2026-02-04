const mysql = require('mysql2/promise');
require('dotenv').config();

// On utilise createPool au lieu de createConnection pour de meilleures performances
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Pas besoin de .connect() !
// On fait juste un petit test rapide pour vérifier si les identifiants sont bons :
db.getConnection()
  .then(() => console.log('✅ Connecté à la base de données MySQL (Pool)'))
  .catch(err => console.error('❌ Erreur de connexion à MySQL :', err.message));

module.exports = db;