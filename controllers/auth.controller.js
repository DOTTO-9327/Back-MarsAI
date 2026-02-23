// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const Admin = require('../models/admin.model');

// const login = (req, res) => {
//   const { email, password } = req.body;

//   Admin.findByEmail(email, (error, results) => {
//     if (error) {
//       console.error('❌ Erreur SQL:', error.message);
//       return res.status(500).send('Erreur serveur');
//     }
//     if (results.length === 0) {
//       return res.status(401).send('Identifiants invalides');
//     }
//     const user = results[0];

//     const isPasswordValid = bcrypt.compareSync(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send('Identifiants invalides');
//     }
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: '1h',
//       }
//     );
//     res.json({
//       token,
//       user: {
//         id: user.id,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   });
// };

// // const register = (req, res) => {
// //   const { firstname, lastname, email, password } = req.body;
// //   const hashedPassword = bcrypt.hashSync(password, 10);
// //   Admin.create(firstname, lastname, email, hashedPassword, (error, result) => {
// //     if (error) {
// //       if (error.code === 'ER_DUP_ENTRY') {
// //         return res.status(409).send('Email déjà utilisé');
// //       }
// //       return res.status(500).send('Erreur serveur : ' + error.message);
// //     }
// //     res.status(201).json({ id: result.insertId, email });
// //   });
// // };

// module.exports = {
// //   register,
//   login,
// };
