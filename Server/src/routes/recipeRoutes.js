import express from 'express';
import { formulateMeal } from '../controller/recipeController.js';
import { validateRecipeInput } from '../middleware/validateRecipe.js';
import { recipeFormulationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Endpoint: POST /api/recipes/formulate with rate limiting and input validation
router.post("/formulate", recipeFormulationLimiter, validateRecipeInput, formulateMeal);

export default router;