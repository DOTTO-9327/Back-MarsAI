const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion asynchrone
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connecté à la base de données MySQL, mon petit chou !");
    connection.release(); // Très important : libère la connexion pour le pool
  } catch (error) {
    console.error("❌ Erreur de connexion à MySQL :", error.message);
  }
})();

module.exports = pool;