export const validateRecipeInput = (req, res, next) => {
    const { ingredients, vibe } = req.body;

    if (!ingredients || typeof ingredients !== 'string' || ingredients.trim() === '') {
        return res.status(400).json({
            error: "Ingredient input is required and must be a non-empty string."
        });
    }

    const trimmedIngredients = ingredients.trim();

    if (trimmedIngredients.length > 500) {
        return res.status(400).json({
            error: "Ingredient input exceeds maximum length of 500 characters."
        });
    }

    if (vibe && (typeof vibe !== 'string' || vibe.length > 100)) {
        return res.status(400).json({
            error: "Invalid vibe selection parameter."
        });
    }

    // Attach sanitized values back to req.body
    req.body.ingredients = trimmedIngredients;
    req.body.vibe = vibe ? vibe.trim() : "Comfort Food 🥞";

    next();
};
