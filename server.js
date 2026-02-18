require('dotenv').config();
const express = require('express');
const { query } = require('express-validator');
const path = require('path');
const app = express();
const cors = require('cors');
const MoviesRoutes = require('./routes/movie.routes');
const DirectorRoutes = require('./routes/director.routes');
const CollaboratorRoutes = require('./routes/collaborator.routes');
const SubmissionRoutes = require('./routes/submission.routes');
const AdminRoutes = require('./routes/admin.routes');
const frontUrl = process.env.PORT_URL;
require('./config/database');

// Middleware pour lire le JSON
app.use(express.json());
// --- Oblige à la personne qui existe pour que son champ ne soit pas vide  ---
app.use(express.json());
app.get('/hello', query('person').notEmpty(), (req, res) => {
  res.send(`Hello, ${req.query.person}!`);
});

// --- ACCÈS AUX FICHIERS (UPLOADS) ---
// Indispensable pour que l'admin puisse voir les posters et vidéos en local
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use(
  cors({
    origin: {frontUrl} ,
    methods: ['get', 'post', 'put', 'delete'],
    allowedHeader: ['content-type'],
  })
);
app.use('/submission', SubmissionRoutes);
app.use('/movie', MoviesRoutes);
app.use('/director', DirectorRoutes);
app.use('/collaborator', CollaboratorRoutes);
app.use('/admin', AdminRoutes);

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
