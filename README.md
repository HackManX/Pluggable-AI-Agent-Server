# **🚀 Pluggable AI Agent Server (Gemini Edition)**

A robust, context-aware, and extensible conversational AI server built with TypeScript and powered by Google's Gemini API. This project fulfills the requirements of a technical internship assignment by implementing a multi-step reasoning agent with session-based memory, a Retrieval-Augmented Generation (RAG) system, and a dynamic plugin system.

**📍 Live Demo URL:** [https://pluggable-ai-agent-server.onrender.com](https://pluggable-ai-agent-server.onrender.com)

### **Table of Contents**

* [About The Project](https://www.google.com/search?q=%23about-the-project)  
* [Key Features](https://www.google.com/search?q=%23-key-features)  
* [System Architecture](https://www.google.com/search?q=%23-system-architecture)  
* [Project Structure](https://www.google.com/search?q=%23-project-structure)  
* [Built With](https://www.google.com/search?q=%23-built-with)  
* [Getting Started](https://www.google.com/search?q=%23-getting-started)  
* [API Usage](https://www.google.com/search?q=%23-api-usage)  
* [Contributing](https://www.google.com/search?q=%23-contributing)  
* [License](https://www.google.com/search?q=%23-license)  
* [Contact](https://www.google.com/search?q=%23-contact)

## **About The Project**

This backend application serves as a powerful, conversational AI agent. It's designed to be context-aware through session management, knowledgeable via a custom RAG pipeline, and capable through a plugin system that connects it to external tools. The entire system is built with a modern, type-safe TypeScript stack and is optimized for easy deployment.

## **✨ Key Features**

* **🧠 Session-Based Memory**: Maintains conversation history on a per-session basis, allowing for natural, context-aware follow-up questions.  
* **📚 Retrieval-Augmented Generation (RAG)**: Uses an in-memory vector store to retrieve relevant information from a local knowledge base (.md files) to provide accurate, fact-based answers.  
* **🔌 Dynamic Plugin System**: Intelligently decides when to use external tools. It currently supports a **Weather Plugin** and a **Math Plugin**.  
* **🚀 Live Deployment**: Fully deployed and accessible via a public URL on Render.  
* **📝 Clean Code**: Written in TypeScript with a clear, modular, and scalable 

## **🏗️ System Architecture**

The agent processes requests using a defined, multi-step flow designed for accuracy and extensibility.

Request In ➡️ Session Management ➡️ RAG Retrieval ➡️ Context Assembly ➡️ LLM Orchestration ➡️ Plugin Execution ➡️ Final Response Generation ➡️ Response Out

\<details\>  
\<summary\>\<strong\>Click for Detailed Workflow\</strong\>\</summary\>

1. **Request Handling**: An Express server receives a POST request with a message and session\_id.  
2. **Session Management**: A ChatSession object from the Gemini SDK is retrieved or created for the session\_id.  
3. **RAG Retrieval**: The user's message is embedded into a vector. This vector is used to find the top 3 most relevant text chunks from the knowledge base using cosine similarity.  
4. **Context Assembly**: The retrieved chunks are prepended to the user's message to form a rich, context-aware prompt.  
5. **LLM Orchestration**: The prompt is sent to the Gemini 1.5 Pro model, which is aware of the available plugins (get\_weather, evaluate\_math). The model decides whether to answer directly or call a tool.  
6. **Plugin Execution**: If Gemini returns a functionCall, the server executes the corresponding local plugin.  
7. **Final Response Generation**: The plugin's output is sent back to Gemini, which then formulates a final, human-readable response.  
8. **Response Out**: The final reply is sent back to the client.

\</details\>

## **📂 Project Structure**

The project follows a modular structure to keep the code organized and maintainable.

Pluggable-AI-Agent-Server/  
├── data/                   \# Knowledge base .md files  
├── src/                    \# Main source code  
│   ├── agent/              \# Core agent orchestration logic  
│   │   └── agent.service.ts  
│   ├── plugins/            \# External tools for the agent  
│   │   ├── math.plugin.ts  
│   │   └── weather.plugin.ts  
│   ├── rag/                \# RAG system implementation  
│   │   └── rag.service.ts  
│   └── index.ts            \# Express server entry point  
├── .env                    \# Environment variables (gitignored)  
├── .gitignore              \# Files to be ignored by Git  
├── package.json            \# Project dependencies and scripts  
└── tsconfig.json           \# TypeScript compiler configuration

## **🛠️ Built With**

This project leverages a modern, robust, and scalable tech stack.

| Category | Technology |
| :---- | :---- |
| **Language & Runtime** | TypeScript, Node.js |
| **Web Framework** | Express.js |
| **AI & Embeddings** | Google Gemini 1.5 Pro, text-embedding-004 |
| **Vector Search** | Custom In-Memory (Cosine Similarity) |
| **Development Runner** | tsx (for fast, zero-config execution) |
| **Deployment** | Render |

## 

## **🚀 Getting Started**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* Node.js (v18 or later)  
* npm  
* A Google AI Studio API Key

### **Installation**

1. **Clone the repository:**  
   git clone https://github.com/HackManX/Pluggable-AI-Agent-Server.git  
   cd Pluggable-AI-Agent-Server

2. **Install NPM packages:**  
   npm install

3. Enter your API Key:  
   Create a .env file in the root and add your key:  
   GEMINI\_API\_KEY='YOUR\_API\_KEY\_HERE'

4. **Run the server:**  
   npm run dev

   The server will be available at http://localhost:3000.

## **⚙️ API Usage**

The agent exposes a single endpoint to handle all conversational turns.

* **URL:** /agent/message  
* **Method:** POST  
* **Body:**  
  {  
    "message": "Your question for the agent",  
    "session\_id": "a-unique-id-for-your-conversation"  
  }

### **Example Test Commands**

\<details\>  
\<summary\>\<strong\>curl (for macOS/Linux/WSL)\</strong\>\</summary\>  
\# Test Weather Plugin  
curl \-X POST https://pluggable-ai-agent-server.onrender.com/agent/message \\  
\-H "Content-Type: application/json" \\  
\-d '{  
  "message": "What is the weather in Bangalore?",  
  "session\_id": "session-1"  
}'

\# Test RAG System  
curl \-X POST https://pluggable-ai-agent-server.onrender.com/agent/message \\  
\-H "Content-Type: application/json" \\  
\-d '{  
  "message": "Who created Markdown?",  
  "session\_id": "session-2"  
}'

\</details\>

\<details\>  
\<summary\>\<strong\>PowerShell (for Windows)\</strong\>\</summary\>  
\# Test Math Plugin  
Invoke-WebRequest \-Uri https://pluggable-ai-agent-server.onrender.com/agent/message \-Method POST \-Headers @{"Content-Type"="application/json"} \-Body '{"message": "what is 50 \* 4 \+ 10?", "session\_id": "session-3"}'

\# Test RAG System  
Invoke-WebRequest \-Uri https://pluggable-ai-agent-server.onrender.com/agent/message \-Method POST \-Headers @{"Content-Type"="application/json"} \-Body '{"message": "Who created Markdown?", "session\_id": "session-4"}'

\</details\>

## **🤝 Contributing**

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project  
2. Create your Feature Branch (git checkout \-b feature/AmazingFeature)  
3. Commit your Changes (git commit \-m 'Add some AmazingFeature')  
4. Push to the Branch (git push origin feature/AmazingFeature)  
5. Open a Pull Request

## **📜 License**

Distributed under the MIT License. See LICENSE file for more information.