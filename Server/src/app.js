import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { validateEnv, env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import recipeRoutes from './routes/recipeRoutes.js';

// 1. Startup validation of required environment variables
validateEnv();

const app = express();

// 2. Helmet Security Headers Setup
app.use(helmet({
    contentSecurityPolicy: false, // Set to true with custom directives if serving HTML directly
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 3. CORS Configuration
const allowedOrigins = [env.CLIENT_ORIGIN, 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) or matching allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS security policy.'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// 4. Request Payload Body Limits (prevents memory buffer exhaustion attacks)
app.use(express.json({ limit: '10kb' }));

// 5. Global Rate Limiter
app.use(globalLimiter);

// 6. Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 7. API Routes Mounting
app.use("/api/recipes", recipeRoutes);

// 8. Production-Safe Global Error Handler (prevents stack trace / database schema leaks)
app.use((err, req, res, next) => {
    console.error("Unhandled Error Stack: ", err.stack || err.message);

    const isProduction = env.NODE_ENV === 'production';

    res.status(err.status || 500).json({
        error: isProduction ? "An unexpected server error occurred." : (err.message || "Internal Server Error")
    });
});

// 9. Start Server & Graceful Shutdown Setup
const PORT = env.PORT;
const server = app.listen(PORT, () => {
    console.log(`🚀 CravingCraft Server Running Securely on Port ${PORT} [Env: ${env.NODE_ENV}]`);
});

const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Closing HTTP server gracefully...`);
    server.close(() => {
        console.log('HTTP Server closed. Exiting process.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));