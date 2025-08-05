Pluggable AI Agent Server (Gemini Edition)
This project is a backend AI agent built with TypeScript, Node.js, and Express, powered by the Google Gemini API. It's designed to be a robust, context-aware, and extensible conversational AI that fulfills the requirements of the internship technical assignment.

The agent features a multi-step reasoning process that incorporates session-based memory, a Retrieval-Augmented Generation (RAG) system for answering questions from a knowledge base, and a dynamic plugin system for executing real-world tools.

Key Features
🧠 Session-Based Memory: The agent maintains conversation history on a per-session basis, allowing for natural, context-aware follow-up questions.

📚 Retrieval-Augmented Generation (RAG): The agent uses an in-memory vector store built with Gemini embeddings to retrieve relevant information from a local knowledge base (5 .md files) and use it to inform its answers.

🔌 Plugin System (Tool Use): The agent can intelligently decide when to use external tools. It currently supports two plugins:

Weather Plugin: Fetches mock weather data for a given location.

Math Plugin: Safely evaluates mathematical expressions using mathjs.

Tech Stack
Language: TypeScript

Framework: Node.js with Express

AI Model: Google Gemini 1.5 Pro (for reasoning and tool use)

Embeddings: Google text-embedding-004

Vector Search: Custom in-memory implementation using Cosine Similarity

Development Runner: tsx for fast, modern TypeScript execution

Getting Started
Follow these steps to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later recommended)

npm (or yarn/pnpm)

A Google AI Studio API Key

Installation & Setup
Clone the repository:

git clone https://github.com/HackManX/Pluggable-AI-Agent-Server.git
cd Pluggable-AI-Agent-Server

Install dependencies:

npm install

Set up environment variables:

Create a new file named .env in the root of the project.

Add your Google Gemini API key to it:

GEMINI_API_KEY=your-google-ai-studio-api-key-goes-here

Run the development server:
The server will start with live-reloading, listening on http://localhost:3000.

npm run dev

API Usage
The agent exposes a single endpoint to handle all messages.

Endpoint: POST /agent/message

Body:

{
  "message": "Your question for the agent",
  "session_id": "a-unique-id-for-your-conversation"
}

Example Requests
You can use any API client like Postman, or use the command-line examples below.

Standard curl (for macOS/Linux/WSL)
Test the Weather Plugin:

curl -X POST http://localhost:3000/agent/message \
-H "Content-Type: application/json" \
-d '{
  "message": "What is the weather in Bangalore?",
  "session_id": "session-weather-test"
}'

Test the Math Plugin:

curl -X POST http://localhost:3000/agent/message \
-H "Content-Type: application/json" \
-d '{
  "message": "what is 50 * 4 + 10?",
  "session_id": "session-math-test"
}'

PowerShell Invoke-WebRequest (for Windows)
Test the Weather Plugin:

Invoke-WebRequest -Uri http://localhost:3000/agent/message -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "what is the weather in bangalore?", "session_id": "session-weather-test"}'

Test the RAG System:

Invoke-WebRequest -Uri http://localhost:3000/agent/message -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "According to the documents, who created Markdown?", "session_id": "session-rag-test"}'

System Architecture
The agent processes requests using a defined, multi-step flow:

Request Handling: The Express server receives a POST request containing a message and a session_id.

Session Management: A ChatSession object from the Gemini SDK is retrieved or created for the given session_id, ensuring conversation history is maintained.

RAG Retrieval: The user's message is embedded using the Gemini embeddings model. This embedding is used to query the in-memory vector store (built from local .md files) via cosine similarity, retrieving the top 3 most relevant text chunks.

Context Assembly: The retrieved RAG chunks are prepended to the user's message to form a rich, context-aware prompt.

LLM Orchestration (Tool Use): The prompt is sent to the Gemini 1.5 Pro model. The model has been initialized with definitions of the available tools (get_weather, evaluate_math). It analyzes the prompt and decides whether to respond directly or to call a function.

Plugin Execution: If Gemini returns a functionCall, the server executes the corresponding local plugin function (e.g., getWeather()).

Final Response Generation: The output from the executed plugin is sent back to the Gemini model in a new turn. The model then uses this result to formulate a final, human-readable text response.

Response to Client: The final text reply is sent back to the user as a JSON object.
