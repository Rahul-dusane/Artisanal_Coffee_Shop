# Artisanal Coffee Shop ☕

An AI-powered Artisanal Coffee & Midnight Culinary Recipe Formulator featuring a **React + Redux Toolkit** single-page application frontend and a **Node.js + Express** backend integrated with **Neon Serverless PostgreSQL**, **Drizzle ORM**, and **Google Gemini AI**.

---

## 🏗️ Technical Architecture

### Architecture Overview

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React + Vite)"]
        UI["React Components\n(RecipeFormulator, RecipeCanvas, VibeSelector)"]
        Redux["Redux Toolkit Store\n(recipeSlice, useRecipeSelectors)"]
        Axios["Axios HTTP Client"]
        UI --> Redux
        Redux --> Axios
    end

    subgraph Security ["Security & Middleware Layer"]
        Helmet["Helmet HTTP Headers\n(CSP, HSTS, No-Sniff)"]
        RateLimit["Express Rate Limiters\n(Global & Recipe Limiters)"]
        Validation["Input Validation Middleware\n(Max 500 chars, String Sanitization)"]
    end

    subgraph Backend ["Backend Service Layer (Express.js)"]
        Routes["Express Router\n(/api/recipes/formulate, /api/health)"]
        Controller["Recipe Controller\n(formulateMeal)"]
        GenAI["@google/genai SDK\n(gemini-2.5-flash)"]
        Routes --> Controller
        Controller --> GenAI
    end

    subgraph Database ["Database Layer (Neon PostgreSQL)"]
        Drizzle["Drizzle ORM (neon-http)"]
        UserReqTable[("user_requests Table")]
        RecipesTable[("recipes Table")]
        Drizzle --> UserReqTable
        Drizzle --> RecipesTable
    end

    Axios -->|"HTTP POST (JSON)"| Helmet
    Helmet --> RateLimit
    RateLimit --> Validation
    Validation --> Routes
    Controller -->|"Insert Log & Read Schema"| Drizzle
```

### Data Flow Pipeline

1. **User Input Phase**: The user inputs available kitchen ingredients and selects a target culinary vibe on the React SPA.
2. **State & Dispatch**: Redux Toolkit dispatches `formulateMealThank`, sending an asynchronous HTTP request via Axios.
3. **Security Ingress**: Express passes requests through **Helmet** security headers, **CORS** origin checks, **Rate Limiting** (max 10 requests/min), and **Input Validation** (max 500 chars).
4. **Database Transaction A**: Log the initial user request parameters (`ingredientsInput`, `cravingVibe`) to Neon PostgreSQL (`user_requests` table) via Drizzle ORM and return the generated primary key `id`.
5. **AI Generation Phase**: The server constructs a context-aware prompt (tailored with regional Indian household context & vibe rules) and calls `gemini-2.5-flash` with strict JSON response schema enforcement and retry resilience.
6. **Database Transaction B**: Parse structured recipe payload and persist into Neon PostgreSQL (`recipes` table) linked via `request_id` foreign key.
7. **Client Render**: Response JSON is returned to Redux store and visually rendered in `RecipeCanvas`.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance Single Page Application framework |
| **State Management** | Redux Toolkit | Centralized state management for formulator inputs & AI recipes |
| **Backend** | Node.js, Express.js | Enterprise REST API server |
| **AI Engine** | Google Gemini AI (`@google/genai`) | `gemini-2.5-flash` with structured JSON schema outputs |
| **Database** | Neon Serverless PostgreSQL | Serverless cloud PostgreSQL instance |
| **ORM** | Drizzle ORM (`drizzle-orm/pg-core`) | Type-safe SQL query builder and schema management |
| **Security** | Helmet, Express Rate Limit | Security HTTP headers, CORS origin protection, & rate limiting |

---

## 🗄️ Database Schema & Data Model

### Entity Relationship Model

- **`user_requests`**: Logs incoming raw user ingredient prompts and selected vibes.
- **`recipes`**: Stores AI-generated structured recipes mapped to `user_requests` via a 1:N Foreign Key relationship (`onDelete: CASCADE`).

```sql
-- 1. Table: user_requests
CREATE TABLE IF NOT EXISTS user_requests (
    id SERIAL PRIMARY KEY,
    ingredients_input TEXT NOT NULL,
    craving_vibe VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: recipes
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES user_requests(id) ON DELETE CASCADE,
    dish_name VARCHAR(255) NOT NULL,
    prep_time VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    full_output_instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛡️ Security & Production Hardening Features

- **HTTP Security Headers**: Powered by `helmet` (`x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, hidden `X-Powered-By`).
- **DDoS & Quota Guard**: `express-rate-limit` enforces global limits (100 req/15 min) and strict recipe generation limits (10 req/min).
- **Payload & Input Validation**: Enforces string length limits (max 500 chars for ingredients) and JSON request body caps (`10kb`).
- **Startup Validation**: Validates `DATABASE_URL` and `GEMINI_API_KEY` before starting the HTTP server.
- **Production Error Masking**: Suppresses internal database schemas and stack traces from client responses in production mode.
- **Graceful Shutdown**: Listens for `SIGINT` and `SIGTERM` signals to cleanly close HTTP connections.

---

## 📡 API Reference

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `200 OK`
  ```json
  {
    "status": "OK",
    "timestamp": "2026-09-15T14:42:06.742Z"
  }
  ```

### 2. Formulate Recipe
- **Endpoint**: `POST /api/recipes/formulate`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "ingredients": "espresso shot, steamed milk, caramel syrup",
    "vibe": "gourmet"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "dishName": "Velvet Caramel Espresso Dream",
    "prepTime": "5 minutes",
    "difficulty": "EASY",
    "ingredientsUtilized": [
      "espresso shot",
      "steamed milk",
      "caramel syrup"
    ],
    "instructions": [
      "Gently re-warm your steamed milk in a small kadhai or microwave.",
      "In your favorite mug, combine espresso shot with caramel syrup.",
      "Slowly pour frothy steamed milk over the espresso-caramel blend.",
      "Crown with a drizzle of caramel syrup and serve immediately."
    ]
  }
  ```

---

## 📂 Project Structure

```
Artisanal_Coffee_Shop/
├── Client/                         # React + Vite Frontend
│   ├── src/
│   │   ├── Features/
│   │   │   ├── Components/         # RecipeCanvas, VibeSelector, LoadingView
│   │   │   ├── Hook/               # useRecipeSelectors
│   │   │   ├── Page/               # RecipeFormulator
│   │   │   └── Slice/              # recipeSlice (Redux Toolkit)
│   │   ├── Store/                  # Redux Store setup
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── Server/                         # Node.js + Express Backend
    ├── drizzle/                    # Drizzle ORM SQL migrations & PostgreSQL schema
    │   └── schema.js
    ├── src/
    │   ├── config/                 # Neon DB connection & env validation
    │   ├── controller/             # Recipe formulation logic & Gemini AI API
    │   ├── middleware/             # Rate limiters & payload validators
    │   ├── routes/                 # Express API routes
    │   └── app.js                  # Main server entrypoint
    ├── .env.example
    ├── drizzle.config.js
    └── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **Database**: Neon Serverless PostgreSQL Database account
- **AI Key**: Google Gemini AI API Key

### Installation & Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rahul-dusane/Artisanal_Coffee_Shop.git
   cd Artisanal_Coffee_Shop
   ```

2. **Configure Backend (`Server/`):**
   ```bash
   cd Server
   npm install
   ```
   Create a `.env` file inside `Server/`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5173
   DATABASE_URL=postgresql://username:password@ep-something.neon.tech/neondb?sslmode=require
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   Push Drizzle PostgreSQL database schema to Neon:
   ```bash
   npx drizzle-kit push
   ```
   Start Backend Server:
   ```bash
   npm run dev
   ```

3. **Configure Frontend (`Client/`):**
   ```bash
   cd ../Client
   npm install
   ```
   Create a `.env` file inside `Client/`:
   ```env
   BASE_URL=http://localhost:5000
   ```
   Start Frontend Development Client:
   ```bash
   npm run dev
   ```

---

## 📄 License

MIT License
