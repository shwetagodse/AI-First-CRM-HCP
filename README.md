# AI-First CRM HCP Module 🩺🤖

**Task 1 Technical Assessment** A modern, AI-driven Customer Relationship Management (CRM) module designed for Life Sciences field representatives. This application features a dual-pane interface that seamlessly synchronizes natural language conversational inputs with structured CRM data logging using a LangGraph-powered AI agent.

---

## 🏗️ Architecture & Tech Stack

This project follows a decoupled, full-stack architecture to ensure scalability and real-time state synchronization.

* **Frontend:** React.js, Tailwind CSS, Redux Toolkit, Lucide Icons.
* **Backend:** Python, FastAPI, SQLAlchemy (SQLite), Uvicorn.
* **AI / LLM:** LangGraph, LangChain, Groq API (`llama-3.3-70b-versatile`).

---

## ✨ Key Features

1.  **Dual-Pane Synchronization:** Users can interact with a standard web form on the left or chat with the AI on the right. Both panes stay perfectly in sync via Redux state management.
2.  **Conversational Data Entry:** The AI agent extracts entities (HCP Name, Interaction Type, Topics, Sentiment) from natural language and automatically populates the structured database and UI.
3.  **Crash-Proof Editing:** Users can conversationally correct specific fields (e.g., *"Actually, the sentiment was negative"*). The agent intelligently updates **only** the targeted field without wiping existing data or crashing due to missing IDs.
4.  **Advanced Entity Resolution:** Strict system prompts prevent the AI from incorrectly overwriting names when pronouns (e.g., *"the doctor"*, *"he"*) are used in follow-up prompts.

---

## 🛠️ The LangGraph Agent & Tools

The core of the AI backend is a LangGraph state machine equipped with 5 specialized tools. The agent autonomously decides which tool to trigger based on user intent.

1.  `log_interaction` *(Mandatory)*: Extracts core meeting details and logs them to the SQLite database.
2.  `edit_interaction` *(Mandatory)*: Modifies a specific field of an existing draft or logged interaction securely.
3.  `retrieve_materials` *(Sales Activity)*: A mock RAG tool that searches the company database for product collateral (e.g., Safety Guidelines) based on conversational queries.
4.  `suggest_followups` *(Sales Activity)*: Analyzes topics discussed and proposes actionable next steps based on predefined business rules.
5.  `analyze_sentiment` *(Sales Activity)*: Explicitly calculates and classifies the conversational tone using positive/negative keyword matching.

---

## 🚀 Setup & Installation Instructions

Follow these steps to run the application locally.

### Prerequisites
* Node.js (v16+)
* Python (3.9+)
* A Groq API Key

### 1. Backend Setup (FastAPI + LangGraph)
Open a terminal and navigate to the backend directory:
```bash
cd hcp-crm-backend

Install the required Python dependencies:

pip install -r requirements.txt

Set up your environment variables:

    Copy the .env.example file and rename it to .env.

    Open .env and paste your Groq API key: GROQ_API_KEY=your_key_here.

Start the backend server:

python main.py

The backend will run on http://localhost:8000.
```

### 2. Frontend Setup (React)
```bash

Open a new terminal window and navigate to the frontend directory:

Install the Node modules:

npm install

Start the React development server:

npm start

The frontend will open automatically at http://localhost:3000.