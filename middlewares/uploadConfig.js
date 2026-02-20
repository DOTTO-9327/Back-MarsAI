/**
 * Configuration de l'Upload via Multer et Scaleway S3
 * --------------------------------------------------
 * Ce middleware intercepte les fichiers envoyés par le formulaire,
 * les renomme et les envoie directement vers un bucket S3.
 */

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

// Initialisation du client S3 pour Scaleway
// Configuration de l'accès au stockage avec les variables d'environnement
const s3 = new S3Client({
  region: process.env.SCALEWAY_REGION,
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY
  }
});

// Configuration du stockage Multer-S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SCALEWAY_BUCKET_NAME,
    // Rend le fichier lisible publiquement (nécessaire pour la galerie)
    acl: 'public-read',
    
    // Stockage de métadonnées optionnelles en BDD S3
    metadata: (req, file, cb) => { 
      cb(null, { fieldName: file.fieldname }); 
    },
    
    // Définition du chemin et du nom du fichier
    key: (req, file, cb) => {
      // Récupère le dossier cible (ex: LARM) ou utilise un dossier par défaut
      const folder = process.env.SCALEWAY_FOLDER || 'grp_default';
      
      // Génère un nom unique : TIMESTAMP_NOM_DU_FICHIER.ext
      // On remplace les espaces par des underscores pour éviter les erreurs d'URL
      const filename = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
      
      // On retourne le chemin complet : "dossier/nom_du_fichier"
      cb(null, `${folder}/${filename}`);
    }
  }),

  // Limites de sécurité
  limits: { 
    // Limite fixée à 300 Mo (300 * 1024 * 1024 octets)
    // Au dessus, Multer renverra une erreur "File too large"
    fileSize: 300 * 1024 * 1024 
  } 
});

module.exports = upload;