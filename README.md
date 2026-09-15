# Artisanal Coffee Shop ☕

An AI-powered Artisanal Coffee Recipe Formulator application featuring a React/Vite frontend and a Node.js/Express backend with Drizzle ORM and Gemini AI integration.

## 🚀 Features

- **Recipe Formulation**: Custom coffee recipe generator based on selected vibes, brew methods, and flavor profiles.
- **AI Coffee Assistant**: Powered by Google Gemini AI for smart recipe suggestions.
- **Interactive Recipe Canvas**: Visual representation of coffee recipes with detailed parameters.
- **Database Storage**: Persistence with MySQL and Drizzle ORM.

## 📁 Project Structure

```
Artisanal_Coffee_Shop/
├── Client/            # React + Vite Frontend (Redux Toolkit, Tailwind/CSS)
└── Server/            # Node.js + Express Backend (Drizzle ORM, MySQL, Gemini AI)
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL Database

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rahul-dusane/Artisanal_Coffee_Shop.git
   cd Artisanal_Coffee_Shop
   ```

2. **Backend Setup (`Server/`):**
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Update .env with your MySQL credentials and Gemini API Key
   npm run dev
   ```

3. **Frontend Setup (`Client/`):**
   ```bash
   cd ../Client
   npm install
   cp .env.example .env
   npm run dev
   ```

## 📄 License

MIT License
