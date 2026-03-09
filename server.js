require('dotenv').config();
const express = require('express');
const { query } = require('express-validator');
const path = require('path');
const cors = require('cors');

// Import des routes
const MoviesRoutes = require('./routes/movie.routes');
const DirectorRoutes = require('./routes/director.routes');
const CollaboratorRoutes = require('./routes/collaborator.routes');
const SubmissionRoutes = require('./routes/submission.routes');
const EventRoutes = require('./routes/event.routes'); // Import des routes d'événements
const AdminRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');

// Connexion BDD
require('./config/database');

const app = express();

// --- GESTION DES CORS MULTIPLES ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5174', 'http://localhost:5173'];

// --- MIDDLEWARES DE BASE ---
app.use(express.json());

// --- CONFIGURATION CORS ---
app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origine (ex: Postman, curl, serveurs)
      if (!origin) return callback(null, true);

      // Si l'origine de la requête est dans notre tableau, on l'autorise
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Sinon, on bloque
        callback(new Error('Bloqué par la politique CORS de MarsAI'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// --- ACCÈS AUX FICHIERS STATIQUES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/submission', SubmissionRoutes);
app.use('/movie', MoviesRoutes);
app.use('/director', DirectorRoutes);
app.use('/collaborator', CollaboratorRoutes);
app.use('/event', EventRoutes); // Utilisation des routes d'événements
app.use('/admin', AdminRoutes);
app.use('/auth', authRoutes);

// Route de test validator
app.get('/hello', query('person').notEmpty(), (req, res) => {
  res.send(`Hello, ${req.query.person}!`);
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Allowed CORS origins:`, allowedOrigins);
});
