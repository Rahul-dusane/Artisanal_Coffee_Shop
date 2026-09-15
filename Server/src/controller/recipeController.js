import { db } from "../config/db.js";
import { userRequests, recipes } from "../../drizzle/schema.js";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the google Gen AI client wrapper instance 
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const formulateMeal = async (req, res) => {
    const { ingredients, vibe } = req.body;

    // Basic validation guardrail block
    if (!ingredients || ingredients.trim() === "") {
        return res.status(400).json({ error: "Ingredient counter string input cannot be blank." });
    }

    try {
        // 1. DATABASE TRANSACTION STEP A: Log the user's initial craving parameters
        const [insertRequest] = await db.insert(userRequests).values({
            ingredientsInput: ingredients.trim(),
            cravingVibe: vibe || "Comfort Food 🥞"
        }).returning({ id: userRequests.id });

        // Extract the exact generated auto-increment primary key ID index record
        const newRequestId = insertRequest.id;

        // 2. CORE INTELLIGENCE ROUTING STEP B: Call the Gemini GenAI model framework with retry resilience
        const userPrompt = `Available Leftovers: ${ingredients}. Preferred Target Vibe: ${vibe}.`;

        let aiResponse;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                attempts++;
                aiResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: userPrompt,
                    config: {
                        systemInstruction: `
                            ROLE & PERSONA:
                            You are 'The Midnight Fusion Chef', an elite, witty culinary master who rescues users from late-night hunger crises using random kitchen leftovers. Your tone is encouraging, sharp, and highly efficient.

                            REGIONAL & ENVIRONMENTAL CONTEXT (INDIA):
                            - Primary location context is India. You must respect the local household ecosystem.
                            - Assume basic Indian kitchen staples are universally available as binding elements (e.g., oil/ghee, salt, turmeric/haldi, red chili powder, jeera, chaat masala, ginger-garlic paste).
                            - Primary cooking equipment should be standard local tools (Tawa, Kadhai, Pressure Cooker, or Microwave).

                            THE BALANCED VIBE ENGINE (TRADITIONAL VS. MODERN FUSION):
                            - You must dynamically adapt the culinary style based on the 'vibe' parameter without breaking ingredient compatibility:
                            
                            1. TRADITIONAL VIBES (e.g., 'lazy breakfast', 'full dinner', 'comfort'):
                                Focus strictly on authentic local flavor families and street styles (e.g., Bhurji, Tawa Fry, Tadka Rice, Poha/Upma twists, Instant Parathas/Cheelas).
                            
                            2. MODERN/CREATIVE VIBES (e.g., 'gourmet', 'cheat day', 'modern twist'):
                                Create exciting Indo-Western Fusion or Progressive Indian Street Food. Do NOT suggest pure Western dishes requiring rare oven baking. Instead, apply modern concepts to Indian bases. 
                                (Examples: Converting flour/eggs/milk into a 'Masala Tawa Crepe-Roll', turning leftovers into a 'Kadhai-Chilli Grilled Toast', or making a 'Deconstructed Street-Style Bowl').

                            COMPLEXITY & DIFFICULTY SCALING:
                            - EASY: Focus on one-bowl/one-pan steps, minimal chopping, and fast fork-mixing.
                            - MEDIUM: Require simple parallel processing (e.g., boiling a grain while searing a protein).
                            - HARD: Incorporate technical practices like precise reductions, separating ingredient states, or layered tawa techniques.

                            OUTPUT GUARDRAILS:
                            - Focus purely on single-portion standalone meals or late-night liquid refreshers.
                            - Do not output conversational pleasantries, intros, or multi-course layout prose.
                            - Include a top-level array called ingredientsUtilized containing the exact ingredient names used in the recipe.
                            - Every step inside the instructions data array must be linear, actionable, crisp, and direct.
                            `, 
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                dishName: { type: Type.STRING },
                                prepTime: { type: Type.STRING },
                                difficulty: { type: Type.STRING },
                                ingredientsUtilized: { type: Type.ARRAY, items: { type: Type.STRING } },
                                instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["dishName", "prepTime", "difficulty", "ingredientsUtilized", "instructions"]
                        }
                    }
                });
                break;
            } catch (retryErr) {
                if (retryErr.status === 503 && attempts < maxAttempts) {
                    console.warn(`Gemini API returned 503 spike, retrying attempt ${attempts}/${maxAttempts}...`);
                    await new Promise(r => setTimeout(r, 1500 * attempts));
                } else {
                    throw retryErr;
                }
            }
        }

        // Parse the safe string object directly into native JSON blocks
        const generatedRecipe = JSON.parse(aiResponse.text);

        // 3. DATABASE TRANSACTION STEP C: Write AI metrics directly to relational recipes Table
        await db.insert(recipes).values({
            requestId: newRequestId,
            dishName: generatedRecipe.dishName,
            prepTime: generatedRecipe.prepTime,
            difficulty: generatedRecipe.difficulty,
            fullOutputInstructions: JSON.stringify(generatedRecipe.instructions)
        });

        // 4. CLIENT RESPONSE: Send the final payload back down the pipe loop to React Redux
        return res.status(200).json(generatedRecipe);
    } catch (error) {
        console.error("Full-Stack Processing Pipeline Runtime Failure: ", error);
        return res.status(500).json({ error: "Failed to assemble structured meal recipes safely." });
    }
};