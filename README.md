<div align="center">🚀 Pluggable AI Agent Server (Gemini Edition) 🚀</div><p align="center">A robust, context-aware, and extensible conversational AI server built with TypeScript and powered by Google's Gemini API.</p><p align="center"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge"/><img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini Badge"/></p><p align="center">This project fulfills the requirements of a technical internship assignment by implementing a multi-step reasoning agent with session-based memory, a Retrieval-Augmented Generation (RAG) system, and a dynamic plugin system.</p><div align="center">📍 View the Live Demo</div>Table of ContentsAbout The ProjectKey FeaturesSystem ArchitectureBuilt WithGetting StartedAPI UsageContactAbout The ProjectThis backend application serves as a powerful, conversational AI agent. It's designed to be context-aware through session management, knowledgeable via a custom RAG pipeline, and capable through a plugin system that connects it to external tools. The entire system is built with a modern, type-safe TypeScript stack and is optimized for easy deployment.✨ Key Features🧠 Session-Based Memory: Maintains conversation history on a per-session basis, allowing for natural, context-aware follow-up questions.📚 Retrieval-Augmented Generation (RAG): Uses an in-memory vector store to retrieve relevant information from a local knowledge base (.md files) to provide accurate, fact-based answers.🔌 Dynamic Plugin System: Intelligently decides when to use external tools. It currently supports:Weather Plugin: Fetches mock weather data.Math Plugin: Safely evaluates mathematical expressions.🏗️ System ArchitectureThe agent processes requests using a defined, multi-step flow designed for accuracy and extensibility.Request In ➡️ Session Management ➡️ RAG Retrieval ➡️ Context Assembly ➡️ LLM Orchestration ➡️ Plugin Execution ➡️ Final Response Generation ➡️ Response Out<details><summary><strong>Click for Detailed Workflow</strong></summary>Request Handling: An Express server receives a POST request with a message and session_id.Session Management: A ChatSession object from the Gemini SDK is retrieved or created for the session_id.RAG Retrieval: The user's message is embedded into a vector. This vector is used to find the top 3 most relevant text chunks from the knowledge base using cosine similarity.Context Assembly: The retrieved chunks are prepended to the user's message to form a rich, context-aware prompt.LLM Orchestration: The prompt is sent to the Gemini 1.5 Pro model, which is aware of the available plugins (get_weather, evaluate_math). The model decides whether to answer directly or call a tool.Plugin Execution: If Gemini returns a functionCall, the server executes the corresponding local plugin.Final Response Generation: The plugin's output is sent back to Gemini, which then formulates a final, human-readable response.Response Out: The final reply is sent back to the client.</details>🛠️ Built WithThis project leverages a modern, robust, and scalable tech stack.CategoryTechnologyLanguage & RuntimeTypeScript, Node.jsWeb FrameworkExpress.jsAI & EmbeddingsGoogle Gemini 1.5 Pro, text-embedding-004Vector SearchCustom In-Memory (Cosine Similarity)Development Runnertsx (for fast, zero-config execution)DeploymentRender / Railway🚀 Getting StartedTo get a local copy up and running, follow these simple steps.PrerequisitesNode.js (v18 or later)npmA Google AI Studio API KeyInstallationClone the repository:git clone https://github.com/HackManX/Pluggable-AI-Agent-Server.git
cd Pluggable-AI-Agent-Server
Install NPM packages:npm install
Enter your API Key:Create a .env file in the root and add your key:GEMINI_API_KEY='YOUR_API_KEY_HERE'
Run the server:npm run dev
The server will be available at http://localhost:3000.⚙️ API UsageThe agent exposes a single endpoint to handle all conversational turns.URL: /agent/messageMethod: POSTBody:{
  "message": "Your question for the agent",
  "session_id": "a-unique-id-for-your-conversation"
}
Example Test Commands<details><summary><strong>curl (for macOS/Linux/WSL)</strong></summary># Test Weather Plugin
curl -X POST http://localhost:3000/agent/message \
-H "Content-Type: application/json" \
-d '{
  "message": "What is the weather in Bangalore?",
  "session_id": "session-1"
}'

# Test RAG System
curl -X POST http://localhost:3000/agent/message \
-H "Content-Type: application/json" \
-d '{
  "message": "Who created Markdown?",
  "session_id": "session-2"
}'
</details><details><summary><strong>PowerShell (for Windows)</strong></summary># Test Math Plugin
Invoke-WebRequest -Uri http://localhost:3000/agent/message -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "what is 50 * 4 + 10?", "session_id": "session-3"}'

# Test RAG System
Invoke-WebRequest -Uri http://localhost:3000/agent/message -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message": "Who created Markdown?", "session_id": "session-4"}'
</details>📞 ContactYour Name - your.email@example.comProject Link: https://github.com/HackManX/Pluggable-AI-Agent-Server
