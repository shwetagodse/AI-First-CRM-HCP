# AI-First CRM HCP Module 🩺🤖

**Task 1 Technical Assessment** A modern, AI-driven Customer Relationship Management (CRM) module designed for Life Sciences field representatives. This application features a dual-pane interface that seamlessly synchronizes natural language conversational inputs with structured CRM data logging using a LangGraph-powered AI agent.

---

## 🏗️ Architecture & Tech Stack

This project follows a decoupled, full-stack architecture to ensure scalability and real-time state synchronization.

* **Frontend:** React.js, Tailwind CSS, Redux Toolkit, Lucide Icons.
* **Backend:** Python, FastAPI, SQLAlchemy, Uvicorn.
* **Database:** MySQL 8.0+
* **AI / LLM:** LangGraph, LangChain, Groq API (`llama-3.3-70b-versatile`).

---

## ✨ Key Features

1.  **Dual-Pane Synchronization:** Users can interact with a standard web form on the left or chat with the AI on the right. Both panes stay perfectly in sync via Redux state management.
2.  **Conversational Data Entry:** The AI agent extracts entities (HCP Name, Interaction Type, Topics, Sentiment) from natural language and automatically populates the structured MySQL database and UI.
3.  **Crash-Proof Editing:** Users can conversationally correct specific fields (e.g., *"Actually, the sentiment was negative"*). The agent intelligently updates **only** the targeted field without wiping existing data.
4.  **Advanced Entity Resolution:** Strict system prompts prevent the AI from incorrectly overwriting names when pronouns (e.g., *"the doctor"*, *"he"*) are used in follow-up prompts.

---

## 🛠️ The LangGraph Agent & Tools

The core of the AI backend is a LangGraph state machine equipped with 5 specialized tools:

1.  `log_interaction`: Extracts core meeting details and logs them to the **MySQL** database.
2.  `edit_interaction`: Modifies specific fields of an existing interaction securely.
3.  `retrieve_materials`: A mock RAG tool that searches for product collateral (e.g., Safety Guidelines).
4.  `suggest_followups`: Analyzes discussed topics to propose actionable next steps.
5.  `analyze_sentiment`: Classifies conversational tone using NLP.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* Node.js (v16+)
* Python (3.9+)
* MySQL Server (Running on port 3306)
* A Groq API Key

### 1. Database Setup
1.  Log into your MySQL instance.
2.  Create a new database for the project:
    ```sql
    CREATE DATABASE crm_db;
    ```

### 2. Backend Setup (FastAPI + LangGraph)
Navigate to the backend directory:
```bash
cd hcp-crm-backend

Install the required Python dependencies:

pip install -r requirements.txt

Set up your environment variables:

    Copy the .env.example file and rename it to .env.

    Fill in your credentials:

    Open .env and paste your
    GROQ_API_KEY=your_groq_key_here
    MYSQL_PASSWORD=your_mysql_password_here

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