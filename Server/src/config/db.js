import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../../drizzle/schema.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from Server root directory regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL || "";
if (!connectionString) {
    console.error("❌ ERROR: DATABASE_URL is missing in Server/.env file!");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });