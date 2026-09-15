import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Table: Tracks user input data
export const userRequests = pgTable("user_requests", {
    id: serial("id").primaryKey(),
    ingredientsInput: text("ingredients_input").notNull(),
    cravingVibe: varchar("craving_vibe", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// 2. Table: Tracks raw AI structured recipe output linked back to the user request
export const recipes = pgTable("recipes", {
    id: serial("id").primaryKey(),

    // Foreign key mapping: links this recipe response back to a unique user request
    requestId: integer("request_id").references(() => userRequests.id, { onDelete: "cascade" }).notNull(),
    
    dishName: varchar("dish_name", { length: 255 }).notNull(),
    prepTime: varchar("prep_time", { length: 50 }).notNull(),
    difficulty: varchar("difficulty", { length: 50 }).notNull(),
   
    // Store the instructions as text 
    fullOutputInstructions: text("full_output_instructions").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});