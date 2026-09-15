import rateLimit from 'express-rate-limit';

// Global API Rate Limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests from this IP. Please try again after 15 minutes."
    }
});

// Strict Recipe Generator Rate Limiter: 10 recipe requests per minute per IP to protect Gemini API quota
export const recipeFormulationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Recipe formulation rate limit reached. Please wait 1 minute before generating another recipe."
    }
});
