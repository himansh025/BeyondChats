# BeyondChats Blog Scraper & Enhancer

**Full Stack Web Developer Intern Assignment**

This project is a 3-phase Full Stack solution that scrapes blogs, automates content enhancement using AI, and presents them in a responsive React UI.

## 🔗 Live Link
> [!IMPORTANT]
> **[https://beyond-chat-amber.vercel.app/]**
> _(The live deployment demonstrates both original and AI-enhanced articles fetched from the same backend APIs.)_

## 🏗️ Architecture Diagram

![System Architecture](./frontend/src/assets/flowchart.png)


---

## 🧠 Architectural Decisions

- Separated scraping and AI enhancement into independent scripts to keep backend APIs lightweight.
- Used MongoDB flags (`isUpdated`) to track article lifecycle without duplicating records.
- Designed the system to be LLM-provider agnostic, allowing easy switching between AI services.



### 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS v3, Lucide Icons, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **AI/LLM**: Groq API (LLM-based content generation)
- **Search**: SerpAPI (Google Search)
- **Scraping**: Cheerio (HTML Parsing), Axios

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas URI)

### Phase 0: Clone
```bash
git clone <your-repo-url>
cd BeyondChats
```

### Phase 1 & 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats_blog
   API_URL=http://localhost:5000/api/articles
   
   # Required for Phase 2 AI Enhancement
   SERP_API_KEY=your_serpapi_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```
3. Run the scripts and server:
   ```bash
   # 1. Scrape original articles
   node scripts/scrapeInitial.js

   # 2. Run AI enhancement script
   node scripts/updateArticles.js

   # 3. Start the API Server
   node server.js
   ```

### Phase 3: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser:
   - **App**: http://localhost:5173
   - **Server**: http://localhost:5000

---

## 📂 Project Structure
```text
├── backend/
│   ├── models/         # Mongoose Schemas (Article)
│   ├── routes/         # Express Routes (CRUD)
│   ├── scripts/        # Automation Scripts
│   │   ├── scrapeInitial.js   # Phase 1
│   │   └── updateArticles.js  # Phase 2
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # ArticleCard, ArticleDetail
    │   └── App.jsx     # Main Logic
    └── index.css       # Tailwind v4
```

## ✅ Features Implemented
1. **Live Original Articles**: Real-time fetching of the 5 oldest articles from BeyondChats.com without database storage.
2. **AI Enhancement**: Automated content enhancement using Groq LLM with Google Search integration.
3. **Database**: MongoDB storage for AI-enhanced articles with references.
4. **Dual-Tab Interface**: 
   - **Original Tab**: Displays live articles fetched directly from BeyondChats
   - **AI Enhanced Tab**: Shows enhanced versions with citations from database
5. **Responsive UI**: Modern component-based React interface with gradient designs and smooth animations.

### 🔄 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────┐
│  1. SCRAPE (scrapeInitial.js)                       │
│     beyondchats.com → MongoDB                       │
│     Result: 5 articles with isUpdated: false        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  2. ENHANCE (updateArticles.js)                     │
│     Google Search → Scrape refs → Groq LLM          │
│     Result: 5 articles with isUpdated: true         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  3. DISPLAY (React Frontend)                        │
│     Original Tab: Live from BeyondChats (5 articles)│
│     AI Enhanced Tab: From MongoDB (5 articles)      │
└─────────────────────────────────────────────────────┘
```

### 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/articles/live-originals` | GET | Fetches 5 oldest articles live from BeyondChats |
| `/api/articles?type=updated` | GET | Fetches AI-enhanced articles from database |
| `/api/articles/:id` | GET | Get single article by ID |
| `/api/articles` | POST | Create new article |
| `/api/articles/:id` | PUT | Update existing article |
| `/api/articles/:id` | DELETE | Delete article |