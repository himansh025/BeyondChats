# BeyondChats Blog Scraper & Enhancer

**Full Stack Web Developer Intern Assignment**

This project is a 3-phase Full Stack solution that scrapes blogs, automates content enhancement using AI, and presents them in a responsive React UI.

## 🔗 Live Link
> [!IMPORTANT]
> **[INSERT YOUR LIVE FRONTEND LINK HERE]**
> _(Please deploy the frontend to Vercel/Netlify and backend to Render/Railway, then paste the URL above)_

---

## 🏗️ Architecture & Data Flow Diagram
The following diagram provides a quick summary of the entire project's data flow and architecture.

```mermaid
graph TD
    %% Nodes
    User([User])
    Frontend[React Frontend\n(Vite + Tailwind)]
    Backend[Node.js Backend\n(Express)]
    DB[(MongoDB)]
    
    %% External Services
    BeyondChats[BeyondChats Blogs]
    Google[Google Search]
    ExtSites[External Articles]
    LLM[LLM API\n(Gemini/OpenAI)]

    %% Connections
    User -->|View & Interact| Frontend
    Frontend -->|REST API Calls| Backend
    Backend -->|CRUD Operations| DB

    subgraph "Phase 1: Initial Scraping"
        Script1[scrapeInitial.js] -->|Scrape Last 5| BeyondChats
        Script1 -->|Store Data| DB
    end

    subgraph "Phase 2: AI Automation"
        Script2[updateArticles.js] -->|Fetch Pending| Backend
        Script2 -->|Search Topic| Google
        Script2 -->|Scrape Content| ExtSites
        Script2 -->|Generate Rewrite| LLM
        Script2 -->|Update Article| Backend
    end
```

### 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.
- **Automation**: Puppeteer (Headless Browser), Cheerio (DOM Parsing).

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
   MONGODB_URI=mongodb://localhost:27017/beyondchats_blog
   # Optional Keys for Phase 2 (Script falls back to mock if missing)
   SERP_API_KEY=your_serp_api_key
   LLM_API_KEY=your_llm_api_key
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
1. **Scraping**: Automated extraction of the oldest 5 articles from BeyondChats.com.
2. **Database**: MongoDB storage with support for original and updated versions.
3. **AI Automation**: Independent script to search, research, and rewrite content.
4. **Responsive UI**: Clean, professional interface with "Original" and "AI Enhanced" tokens.
