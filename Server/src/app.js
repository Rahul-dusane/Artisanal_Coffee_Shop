import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';

// Load local environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));         //Allows React app on port 5173 to talk to the this server safely without CORS issues
app.use(express.json()); //Enables the server to read incoming JSON payloads (res.body)

// API Routes Mounting
app.use("/api/recipes", recipeRoutes);

// Global Error Catch-All to keep your server from crashing during unhandled requests
app.use((err, req, res, next) => {
    console.error("Internal App Error Stack: ", err.stack);
    res.status(500).json({ error: "Internal Server Error." });
});

// Start SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CravingCraft Server Running Securely on Port ${PORT}`);
});