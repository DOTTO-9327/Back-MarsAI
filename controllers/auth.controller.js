const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin.model');

const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email et mot de passe requis.' });
    }

    // On utilise await pour récupérer l'utilisateur
    const results = await Admin.findByEmail(mail);

    if (!results || results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: 'Identifiants invalides' });
    }

    const user = results[0];

    // Comparaison du mot de passe saisi avec le hash en BDD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Identifiants invalides' });
    }

    // Génération du Token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_de_secours', // Sécurité si le .env est mal lu
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        mail: user.mail, // Attention : vérifiez si votre colonne est 'mail' ou 'email'
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Erreur Login:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { login };