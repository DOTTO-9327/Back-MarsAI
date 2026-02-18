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
const AdminRoutes = require('./routes/admin.routes');

// Connexion BDD
require('./config/database');

const app = express();
const frontUrl = process.env.PORT_URL || 'http://localhost:5174';

// --- MIDDLEWARES DE BASE ---
app.use(express.json());

// --- CONFIGURATION CORS ---
app.use(
  cors({
    origin: frontUrl, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// --- ACCÈS AUX FICHIERS STATIQUES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/submission', SubmissionRoutes);
app.use('/movie', MoviesRoutes);
app.use('/director', DirectorRoutes);
app.use('/collaborator', CollaboratorRoutes);
app.use('/admin', AdminRoutes);

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
  console.log(`🌍 Accepting requests from: ${frontUrl}`);
});