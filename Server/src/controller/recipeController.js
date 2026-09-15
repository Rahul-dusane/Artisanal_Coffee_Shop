import { db } from "../config/db.js";
import { userRequests, recipes } from "../../drizzle/schema.js";
import { GoogleGenAI, Type } from "@google/genai";

//Initialize the google Gen AI client wrapper instance 
//It automatically picks up your environment key variables cleanly 
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const formulateMeal = async (req, res) => {
    const { ingredients, vibe } = req.body;

    //Basic validation guardrail block
    if (!ingredients || ingredients.trim() == "") {
        return res.status(400).json({ error: "Ingredient counter string input cannot be blank." });
    }

    try {

        //1. DATABASE TRANSECTION STEP A: Log the user`s intial craving parameters
        const [insertRequest] = await db.insert(userRequests).values({
            ingredientsInput: ingredients.trim(),
            cravingVibe: vibe || "Comfort Food 🥞"
        });

        //Extract the exact generated auto-increment primary key ID index record
        const newRequestId = insertRequest.insertId;

        //2. CORE INTELLIGENCE ROUTING STEP B: Call the Gemini GenAI model framwork
        const userPrompt = `Available Leftovers: ${ingredients}. Preferred Target Vibe: ${vibe}.`;

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash", //Free tire model for fast execution JSON processing streams
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
                // Strict mapping schemas protect React Redux store layers from breaking execution crashes 
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

        //parse the safe string object directly into native JSON blocks
        const generatedRecipe = JSON.parse(aiResponse.text);

        //3. DATABASE TRANSECTION STEP C: Write AI metrics directly to relational aiReipes Table
        await db.insert(recipes).values({
            requestId: newRequestId, //Mapping foreign key reference paths directly 
            dishName: generatedRecipe.dishName,
            prepTime: generatedRecipe.prepTime,
            difficulty: generatedRecipe.difficulty,
            fullOutputInstructions: JSON.stringify(generatedRecipe.instructions) //Stringify instruction arrray structures 
        });

        //4. CLIENT RESPONS: Send the final payload back down the pipe loopto React Redux
        return res.status(200).json(generatedRecipe);
    } catch (error) {
        console.error("Full-Stack Processing Pipline Runtime Failure: ", error);
        return res.status(500).json({ error: "Failed to assemble structured meal recipes safely." });
    }
};