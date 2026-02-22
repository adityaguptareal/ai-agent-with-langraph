# ✈️ Tripo Saints Flight Booking Agent (Modular Version)

A production-ready AI agent designed to help users search, select, and book flights through a strict, tool-driven workflow. Built using **LangChain** and **LangGraph**.

## 🚀 Features

- **Flight Search**: Find flights based on origin, destination, and date.
- **Booking Drafts**: Temporarily store passenger details before confirming.
- **Strict Validation**: Will not book a flight without explicit user confirmation and valid passenger details (name/email).
- **Manage Bookings**: Update or delete existing bookings using a Booking ID.
- **Resilient State Management**: Built with a state machine (LangGraph) to handle complex conversation flows.

---

## 📂 Folder Structure

I have organized the code to be clean and reusable:

- **`agent.js`**: The main entry point. Run this to start the chat interface.
- **`graph/`**: The "brain" of the agent.
  - `workflow.js`: Defines the step-by-step logic (The State Machine).
  - `nodes.js`: The AI logic that decides what to do next.
  - `bookingState.js`: Stores temporary booking data (drafts).
  - `invoker.js`: A helper to run the graph safely.
- **`tools/`**: Commands the AI can run.
  - `bookingTools.js`: Handle booking, updating, and deleting.
  - `flightSearch.js`: Logic to find flights in the database.
- **`utils/`**: Helper functions.
  - `bookingStorage.js`: Saves bookings to `bookings.json`.
  - `userInfoExtractor.js`: Finds names and emails in your messages automatically.
- **`systemPrompt/`**: The rules and personality of the AI.
- **`constants/`**: Mock databases for flights and airports.

---

## 🛠️ Setup Instructions

### 1. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
GROQ_API_KEY=your_groq_api_key
```

### 3. Run the Agent
Start the CLI chat:
```bash
node agent.js
```

---

## 🧱 The Building Process (How it Works)

1. **Defining the Goal**: We wanted an agent that doesn't "hallucinate" and follows a strict process (Search -> Select -> Draft -> Confirm).
2. **Tools First**: We built JavaScript functions (Tools) that can actually search data and write to files.
3. **The State Machine (LangGraph)**: We used LangGraph to create a "map" of the conversation. It ensures the AI always goes through the right steps.
4. **Modularization**: We split the giant `agent.js` file into smaller pieces so that each part is easy to read and fix.
5. **Human-in-the-loop logic**: The agent is programmed to stop and ask you for confirmation instead of just booking automatically.

---

## 📝 Commands inside the Chat
- `/reset`: Start the conversation over.
- `/bye`: Exit the agent.
