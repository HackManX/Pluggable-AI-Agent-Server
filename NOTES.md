Project Notes & Learnings
This document outlines the development process, challenges faced, and architectural decisions made while building the Pluggable AI Agent Server.

1. AI-Generated vs. Human-Written Code
This project was developed with the assistance of an AI programming partner (Google's Gemini). The collaboration can be broken down as follows:

AI-Assisted:

Initial scaffolding of project files and boilerplate code for the Express server.

Providing the syntax for library functions (e.g., @google/generative-ai, express).

Generating initial versions of utility functions like cosineSimilarity.

Assisting in diagnosing errors and suggesting potential solutions and code fixes during the extensive debugging phase.

Human-Driven:

The core architecture and the logical flow of the entire application.

The decision-making process for debugging and selecting the correct solution from AI-provided suggestions.

The specific implementation of the agent's orchestration logic in agent.service.ts (the RAG -> Tool Use -> Final Response loop).

The design of the system prompt and the structure of how RAG context is injected.

The persistence and iterative problem-solving required to get the project from a non-working state to a fully functional, deployed application. The entire debugging journey was a human-led effort.

2. Bugs Faced & Solutions
The development process involved overcoming several significant configuration and code-level challenges. This demonstrates a practical approach to debugging a modern TypeScript application.

Initial Module System Conflict:

Bug: The project was initialized with a default CommonJS module system, but the code used modern ESM import/export syntax, leading to ESM syntax is not allowed... errors.

Solution: The module system was modernized across the project. First, the tsconfig.json was updated with "module": "NodeNext" and "moduleResolution": "NodeNext". Second, "type": "module" was added to package.json to instruct Node.js to treat all .js files as ES Modules.

Strict Import Path Errors:

Bug: After switching to the NodeNext module system, TypeScript threw Cannot find module... errors for all local file imports.

Solution: The imports were updated to conform to the strict ESM standard by appending the .js extension to the end of each local file path (e.g., import { RAGService } from './rag/rag.service.js').

Gemini SDK Type Errors:

Bug: The code initially used FunctionDeclarationSchema.OBJECT, which caused a TypeScript error: 'FunctionDeclarationSchema' only refers to a type, but is being used as a value.

Solution: Corrected the code to import and use the SchemaType enum from the @google/generative-ai library, which correctly provides the values (e.g., SchemaType.OBJECT, SchemaType.STRING).

Development Server Runner Issues:

Bug: The initial development tool, ts-node-dev, failed to run the project correctly in ESM mode, even with the --esm flag, resulting in a no script to run provided error.

Solution: The problematic tool was replaced with tsx, a more modern and reliable TypeScript runner with native ESM support. The dev script in package.json was updated to tsx watch src/index.ts, which resolved all startup issues.

Runtime File System Error:

Bug: The server would start but immediately crash with an ENOTDIR: not a directory, scandir 'E:\Agent\data' error.

Solution: This was a simple but crucial file system error. A file named data had been created instead of a folder. The solution was to delete the file and create a proper data directory to hold the .md knowledge base files.

API Testing Command Errors in PowerShell:

Bug: Standard curl commands failed in Windows PowerShell because curl is an alias for Invoke-WebRequest, which has a different syntax.

Solution: The test command was rewritten using the native Invoke-WebRequest syntax. For easier and more reliable testing, Postman was also used.

Missing Request Body Parameter:

Bug: API calls were successfully connecting to the server but returning a 400 Bad Request with the error {"error":"\message` and `session_id` are required."}`.

Solution: This was a successful test of the server's input validation. The error was in the test command's request body, which was missing the session_id field. The solution was to update the test command to include both required fields, leading to the first successful AI response.

3. Agent Design: Routing, Memory, and Context
The agent's intelligence comes from the orchestration of three core components.

Plugin Routing (Tool Use):
The agent uses the native tools feature of the Gemini API.

During initialization, the AgentService defines a list of available tools (get_weather, evaluate_math) with clear names, descriptions, and parameter schemas.

This tool definition is passed to the Gemini model when a new chat session is created.

When the user sends a message, the Gemini model itself analyzes the intent. If the intent matches a tool's description, the model's response will contain a functionCall object specifying the function name and arguments.

The backend code checks for this functionCall. If present, it executes the corresponding local TypeScript function, captures its return value, and sends this result back to the Gemini model in the next turn.

Gemini then uses this new information to generate a final, natural language response.

Memory Management:
Memory is handled on a per-session basis to support distinct, parallel conversations.

A Map object in the AgentService stores ChatSession instances, with the session_id provided by the client as the key.

When a message arrives, the service retrieves the existing ChatSession for that session_id. If one doesn't exist, it creates a new one.

The ChatSession object from the @google/generative-ai SDK automatically manages the entire conversation history, including user messages, AI responses, tool calls, and tool results. This provides a robust and stateful memory for the agent without manual history management.

Context (RAG) Embedding:
The agent's ability to answer questions from a specific knowledge base is powered by a custom RAG implementation.

Initialization: On server startup, the RAGService reads all .md files from the /data directory. It uses the marked library to convert them to plain text, splits them into smaller chunks, and then uses the Gemini text-embedding-004 model to create a vector embedding for each chunk. These chunks and their embeddings are stored in an in-memory array.

Retrieval: When a user sends a message, their message is also converted into a vector embedding using the same model.

Search: A cosineSimilarity function calculates the mathematical "distance" between the user's message embedding and every chunk embedding in the knowledge base.

Injection: The text from the top 3 chunks with the highest similarity scores are retrieved. This text is then prepended to the user's original message, forming a rich prompt like CONTEXT: [retrieved text] USER QUESTION: [original message]. This combined prompt is sent to the Gemini model, giving it the specific, relevant information needed to form a high-quality answer.
