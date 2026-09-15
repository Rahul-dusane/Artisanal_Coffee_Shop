# Artisanal Coffee Shop ☕ - CravingCraft AI Recipe Engine

CravingCraft (Artisanal Coffee Shop) is an enterprise-grade, AI-powered culinary and recipe formulation platform that transforms available ingredients and flavor vibes into structured, artisanal coffee and fusion recipes. Built with a **React 18 + Redux Toolkit** frontend and a **Node.js + Express** backend integrated with **Neon Serverless PostgreSQL**, **Drizzle ORM**, and **Google Gemini AI (`gemini-2.5-flash`)**, CravingCraft combines modern security hardening, structured JSON response schemas, and persistent cloud database tracking.

---

## 🏗️ System Architecture

CravingCraft follows a decoupled microservices-ready architecture featuring a responsive Single-Page Application (SPA) frontend, a production-hardened Express REST API server, Google Gemini GenAI integration, and a serverless PostgreSQL database cloud layer.

```mermaid
graph TD
    subgraph "Frontend Layer (React 18 + Vite)"
        UI["Recipe Formulator UI Page"]
        InputStation["Ingredient Input Component"]
        VibeSelector["Vibe Selector Component"]
        CanvasView["Interactive Recipe Canvas"]
        ReduxStore["Redux Toolkit Store (recipeSlice)"]
    end

    subgraph "Security & Protection Layer"
        Helmet["Helmet Security Headers (No-Sniff, Frameguard, CSP)"]
        RateLimit["Rate Limiters (Global 100/15min, Recipe 10/min)"]
        Validator["Input Sanitizer & Length Validator (Max 500 Chars)"]
        Cors["CORS Origin Verifier (CLIENT_ORIGIN)"]
    end

    subgraph "API Layer (Express.js / Node.js)"
        Router["Express REST Router (/api/recipes, /api/health)"]
        EnvChecker["Startup Environment Validator"]
        ErrHandler["Production Error Masker"]
    end

    subgraph "AI Intelligence Engine (Google GenAI)"
        ChefAgent["'The Midnight Fusion Chef' Persona Engine"]
        GenAI["@google/genai SDK (gemini-2.5-flash)"]
        SchemaGuard["Strict Response Schema Enforcer"]
        RetryLoop["Exponential Backoff Retry Loop (503 Resilience)"]
    end

    subgraph "Storage & Cloud Database Layer"
        Drizzle["Drizzle ORM (drizzle-orm/neon-http)"]
        NeonDB["Neon Serverless PostgreSQL DB"]
        UserReqTable[("user_requests Table")]
        RecipesTable[("recipes Table")]
    end

    UI --> InputStation
    UI --> VibeSelector
    UI --> ReduxStore
    ReduxStore --> Router

    Router --> Helmet
    Helmet --> Cors
    Cors --> RateLimit
    RateLimit --> Validator
    Validator --> EnvChecker

    EnvChecker --> Drizzle
    Drizzle --> UserReqTable
    UserReqTable --> ChefAgent

    ChefAgent --> GenAI
    GenAI --> SchemaGuard
    SchemaGuard --> RetryLoop
    RetryLoop --> Drizzle
    Drizzle --> RecipesTable

    RecipesTable --> CanvasView
```

---

## 🤖 AI Recipe Formulation Workflow

The backend coordinates an end-to-end recipe generation workflow. Each user prompt undergoes sanitization, primary logging in Neon DB, Gemini AI formulation with fallback retry logic, structured JSON validation, and relational database persistence.

```mermaid
graph LR
    Start([Raw Leftovers & Vibe Input]) --> Val["1. Ingress Validation & Rate Limit"]
    Val --> LogReq["2. DB Log (user_requests)"]
    LogReq --> AI["3. Gemini AI Formulation Engine"]
    AI --> Retry{"Attempt Succeeded?"}
    Retry -- "No (503 Spike)" --> AI
    Retry -- "Yes" --> Parse["4. JSON Schema Validation"]
    Parse --> LogRec["5. DB Log (recipes)"]
    LogRec --> End([Persisted Recipe Payload to Client Canvas])
```

### Workflow Execution Stages

1. **Ingress Validation & Rate Limiting** ([`Server/src/middleware/validateRecipe.js`](file:///d:/Artisanal_Coffee_Shop/Server/src/middleware/validateRecipe.js)):
   - Sanitizes ingredient strings and limits input to 500 characters.
   - Enforces rate limits (10 requests per minute per IP) to safeguard Google Gemini API quotas.

2. **Primary Request Persistence** ([`Server/src/controller/recipeController.js`](file:///d:/Artisanal_Coffee_Shop/Server/src/controller/recipeController.js)):
   - Logs incoming user ingredient lists and selected vibes into the `user_requests` table in Neon PostgreSQL.
   - Retrieves the auto-generated primary key `id` using Drizzle ORM `.returning({ id: userRequests.id })`.

3. **Intelligence Engine & Persona Routing**:
   - Invokes `@google/genai` using `"The Midnight Fusion Chef"` system persona tailored for Indian kitchen contexts and fusion concepts.
   - Enforces strict JSON Schema guardrails (`dishName`, `prepTime`, `difficulty`, `ingredientsUtilized`, `instructions`).

4. **Retry Resilience**:
   - Handles temporary 503 high-demand API spikes using exponential backoff retry loops (up to 3 attempts).

5. **Recipe Persistence & Client Delivery**:
   - Serializes instructions into JSON and writes the resulting record to the `recipes` table linked via the `requestId` foreign key.
   - Returns a structured `200 OK` JSON response to the React Redux store.

---

## 🧮 Vibe Engine & Recipe Categorization

CravingCraft dynamically adapts recipe complexity and culinary style based on selected flavor vibes.

### Vibe Taxonomy

| Vibe Category | Style Focus | Complexity Scaling |
| :--- | :--- | :--- |
| **Comfort Food 🥞** | Authentic local street food & comforting traditional staples | **Easy**: One-pan/one-bowl methods |
| **Lazy Breakfast 🍳** | Fast, minimal chopping instant breakfast twists | **Easy**: High speed, minimal equipment |
| **Gourmet 🍷** | Indo-Western fusion, progressive plating & technique | **Hard**: Layered flavors & precise reductions |
| **Cheat Day 🍔** | Rich, indulgent late-night fusion cravings | **Medium**: Parallel cooking & grilling |
| **Modern Twist 🌮** | Creative street food twists (e.g., Masala Tawa Crepes) | **Medium**: Repurposing leftovers creatively |

---

## 🗄️ Database Schema & ORM Entities

The system uses Drizzle ORM (`drizzle-orm/pg-core`) supporting Neon Serverless PostgreSQL.

```mermaid
erDiagram
    user_requests ||--o{ recipes : "generates (1:N)"

    user_requests {
        serial id PK
        text ingredients_input
        varchar craving_vibe
        timestamp created_at
    }

    recipes {
        serial id PK
        integer request_id FK
        varchar dish_name
        varchar prep_time
        varchar difficulty
        text full_output_instructions
        timestamp created_at
        timestamp updated_at
    }
```

### Core Schema Tables

- **`user_requests`**: Stores candidate input prompts, raw ingredient strings, target craving vibes, and request timestamps.
- **`recipes`**: Stores AI-generated recipes, dish names, preparation times, difficulty levels, instruction JSON arrays, and foreign key references (`request_id` -> `user_requests.id`).

---

## 🌐 REST API Reference

All backend API endpoints are available under the `/api` prefix.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check, uptime status, and security verification |
| `POST` | `/api/recipes/formulate` | Formulates AI recipes, logs requests/recipes to DB, and returns JSON |

### Endpoint Details

#### `POST /api/recipes/formulate`
- **Request Headers**: `Content-Type: application/json`
- **Request Payload**:
  ```json
  {
    "ingredients": "espresso shot, steamed milk, caramel syrup",
    "vibe": "gourmet"
  }
  ```
- **Response Payload (`200 OK`)**:
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

## 🛡️ Production Security & Hardening Features

- **HTTP Security Headers (`helmet`)**: Configured with `nosniff`, `SAMEORIGIN` frameguard, HSTS, and hidden `X-Powered-By` headers.
- **DDoS & Quota Guard (`express-rate-limit`)**: Global limiter (100 req/15 min) and dedicated recipe formulation limiter (10 req/min).
- **Request Validation**: String length limits (max 500 chars for ingredients) and JSON request body size limits (`10kb`).
- **Environment Checks**: Validates `DATABASE_URL` and `GEMINI_API_KEY` on startup, exiting gracefully if missing.
- **Production Error Masking**: Suppresses stack traces and internal database error details in production (`NODE_ENV=production`).
- **Graceful Shutdown**: Handles `SIGINT` and `SIGTERM` signals cleanly to avoid database connection leaks.

---

## 💻 Frontend Application Architecture

The frontend is built as a single-page React 18 application with Redux Toolkit and Vite.

```
Client/
├── src/
│   ├── Features/
│   │   ├── Components/
│   │   │   ├── LoadingView.jsx       # Animated cooking loader
│   │   │   ├── RecipeCanvas.jsx      # Visual recipe card & step viewer
│   │   │   └── VibeSelector.jsx      # Interactive vibe picker buttons
│   │   ├── Config/
│   │   │   └── recipeFormulator.config.js # Vibe definitions & initial state
│   │   ├── Hook/
│   │   │   └── useRecipeSelectors.js  # Redux store selector hooks
│   │   ├── Page/
│   │   │   └── RecipeFormulator.jsx   # Main formulator layout & interaction
│   │   ├── Slice/
│   │   │   └── recipeSlice.js         # Redux Toolkit slice & async thunk
│   │   └── Style/
│   │       └── RecipeFormulator.css   # Ambient food sticker CSS styling
│   ├── Store/
│   │   └── store.js                   # Redux store configuration
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🛠️ Real-World Setup & Execution Guide

### Prerequisites
- **Node.js**: v18 or higher (with `npm`)
- **Database**: Neon Serverless PostgreSQL Database account
- **AI Key**: Google Gemini AI API Key

---

### Step 1: Configure Environment Variables (`.env`)

Create a `.env` file inside `Server/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Database Connection (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-something.neon.tech/neondb?sslmode=require

# AI LLM Provider Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Create a `.env` file inside `Client/`:

```env
BASE_URL=http://localhost:5000
```

---

### Step 2: Push Database Schema & Start Backend Server

Open a terminal window and execute:

```powershell
# 1. Navigate to Server directory
cd Server

# 2. Install backend dependencies
npm install

# 3. Push Drizzle schema to Neon PostgreSQL
npx drizzle-kit push

# 4. Start development server
npm run dev
```

> **API Status**: The backend server will run at `http://localhost:5000`. Test health status by opening `http://localhost:5000/api/health`.

---

### Step 3: Start React Frontend Application

Open a second terminal window and execute:

```powershell
# 1. Navigate to Client directory
cd Client

# 2. Install frontend dependencies
npm install

# 3. Launch Vite dev server
npm run dev
```

> **Access Application**: Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Security & Verification Auditing

To verify syntax, security headers, and endpoint health:

```powershell
# 1. Check Node.js syntax
cd Server
node --check src/app.js

# 2. Verify Health Check endpoint
curl http://localhost:5000/api/health
```

---

## 📄 License

This project is licensed under the MIT License.
