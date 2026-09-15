import {mysqlTable, serial, bigint, varchar, text, timestamp} from 'drizzle-orm/mysql-core';

//1. Table: Tracks user input data
export const userRequests = mysqlTable("user_requests", {
    id: serial("id").primaryKey(),
    ingredientsInput: text("ingredients_input").notNull(),
    cravingVibe: varchar("craving_vibe", {length: 100}).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

//2. Table: Tracks raw AI structured recipe output linked back to the user request
export const recipes = mysqlTable("recipes", {
    id: serial("id").primaryKey(),

    //Foreign key mapping: links this recipe response back to to a unique user request
    requestId: bigint("request_id", { mode: "number", unsigned: true }).references(() => userRequests.id, {onDelete: "cascade"}).notNull(),
    
    dishName: varchar("dish_name", {length: 255}).notNull(),
    prepTime: varchar("prep_time", {length: 50}).notNull(),
    difficulty: varchar("difficulty", {length: 50}).notNull(),
   
    //store the instructions as text 
    fullOutputInstructions: text("full_output_instructions").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    
    // Automatically updates its timestamp record whenever a row column changes mutations
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});