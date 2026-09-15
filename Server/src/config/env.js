import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from Server root folder regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const validateEnv = () => {
    const requiredVars = [
        { name: 'DATABASE_URL', description: 'Neon PostgreSQL Database connection string' },
        { name: 'GEMINI_API_KEY', description: 'Google Gemini GenAI API Key' }
    ];

    const missing = requiredVars.filter(v => !process.env[v.name] || process.env[v.name].trim() === '');

    if (missing.length > 0) {
        console.error('\n❌ FATAL: Missing Required Environment Variables:');
        missing.forEach(v => {
            console.error(`   - ${v.name}: ${v.description}`);
        });
        console.error('Please configure Server/.env before starting the application.\n');
        process.exit(1);
    }
};

export const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    DATABASE_URL: process.env.DATABASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
