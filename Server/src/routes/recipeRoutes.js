import express from 'express';
import {formulateMeal} from '../controller/recipeController.js';

const router = express.Router();

//This endpoint maps to: POST http://localhost:5000/api/recipes/formulate
router.post("/formulate", formulateMeal);

export default router;