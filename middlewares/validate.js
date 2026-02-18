const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Affiche précisément quel champ échoue dans ton terminal Node
        console.error("❌ Erreurs de validation :", JSON.stringify(errors.array(), null, 2));
        
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    validate
};