# Life Science CRM: HCP Module with LangGraph Co-Pilot

A modern, AI-powered Healthcare Professional (HCP) Customer Relationship Management (CRM) platform designed specifically for life sciences and pharmaceutical representatives. This application features a dual-input architecture: a structured tracking form for manual entries and an advanced **LangGraph Co-Pilot Agent Chat** that autonomously parses casual, unstructured visit notes to extract key entities and execute CRM operations automatically.

---

## 🚀 Key Features

*   **Dual Architecture Log Entry**: Input details through a conventional structured UI form or chat naturally with a background autonomous agent.
*   **LangGraph Co-Pilot Agent**: Utilizing LangGraph, LangChain, and Groq to dynamically orchestrate conversation flow, parse variables, and handle tool executions.
*   **Automated Information Extraction**: Out-of-the-box extraction of critical medical CRM metrics:
    *   *HCP Professional Name* (e.g., Dr. Robert Chen)
    *   *Core Topic of Conversation* (e.g., Oncology Pipeline, Diabetes Drug Efficacy)
    *   *Interaction Summary* (Granular meeting highlights and safety/efficacy queries)
    *   *Follow-Up Action Items* (Automated task scheduling and literature delivery)
*   **Live Database Registry Logs**: Real-time telemetry feed displaying current CRM logs updated by either manual forms or agent tools.
*   **FastAPI & SQLAlchemy Backend**: Robust, high-performance async REST API backed by Python and relational schema management.
*   **Vite + React Frontend**: Ultra-fast, responsive web interface built on a lean single-page application architecture.

---

## 📁 System Architecture & Directory Layout

```text
hcp-crm-ai/
├── backend/                  # FastAPI Application Engine
│   ├── app/
│   │   ├── core/             # Configuration & Environment Setup
│   │   ├── models/           # SQLAlchemy Database Models
│   │   ├── schemas/          # Pydantic Data Validation Schemas
│   │   ├── tools/            # LangGraph / LangChain Agent Toolsets
│   │   └── main.py           # Core ASGI Entry Point
│   └── requirements.txt      # Python Dependencies List
├── frontend/                 # React SPA Client
│   ├── src/
│   │   ├── components/       # UI Elements & Form Components
│   │   ├── store/            # State Management Configurations
│   │   ├── App.jsx           # Root Client Interface Canvas
│   │   ├── main.jsx          # Vite Setup Entry Script
│   │   └── index.css         # Document Styling
│   ├── index.html            # Web Module Canvas Mounting Shell
│   ├── package.json          # Node Manifest & Dependencies
│   └── vite.config.js        # Build configuration parameters
└── venv/                     # Isolated Python Environment Workspace
```

---

## 🛠️ Installation & Environment Setup

### 1. Prerequisites
Ensure you have the following environments installed locally on your system:
*   **Python 3.10+**
*   **Node.js (v18+)** & **npm**

### 2. Backend Configuration
1. Navigate to the backend directory from your project root:
   ```powershell
   cd backend
   ```
2. Activate your pre-configured virtual environment:
   ```powershell
   ..\venv\Scripts\Activate.ps1
   ```
3. Install the required Python frameworks:
   ```powershell
   pip install -r requirements.txt
   ```
4. Create a `.env` configuration file inside the `backend/` directory and configure your credentials:
   ```text
   GROQ_API_KEY=your_groq_api_key_here
   DATABASE_URL=sqlite:///./hcp_crm.db
   ```

### 3. Frontend Setup
1. Open a separate terminal and navigate into the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install the necessary Node modules:
   ```powershell
   npm install
   ```

---

## 🖥️ Running the Application Locally

To execute the system, both the backend server engine and frontend development build pipeline must run concurrently.

### Launching the Backend Server
From the `backend/` directory (with your `venv` active), start the Uvicorn ASGI process:
```powershell
uvicorn app.main:app --reload
```
The FastAPI instance will launch successfully at `http://127.0.0.1:8000`.

### Launching the Frontend Client
From the `frontend/` directory, spin up the Vite rendering process:
```powershell
npm run dev
```
The browser interface will expose itself on `http://localhost:5173/` or `http://localhost:5174/`.

---

## 💡 Usage Example

Instead of manually navigating and clicking text boxes inside the UI layout, navigate to the **LangGraph Co-Pilot Agent Chat** panel at the base of the page and interact with it:

**Prompt Input:**
> *"Had a great meeting with Dr. Robert Chen today. We discussed the new diabetes drug efficacy results. He was very receptive but asked if we could send over the latest patient case studies. Let's make sure to email him those case studies by Friday."*

**Automated Agent Behavior:**
1. The text stream is analyzed by the LangGraph agent chain.
2. The agent automatically triggers extraction tools to separate fields.
3. A structured entry records `Dr. Robert Chen` under HCP, `Diabetes Drug Efficacy` as the topic, handles the core insights, and records the Friday deadline into follow-up parameters.
4. The database registers the commit and instantly projects it to the Live Registry UI interface.

---
