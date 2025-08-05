// src/agent/agent.service.ts

import { RAGService } from '../rag/rag.service.js';
import { getWeather } from '../plugins/weather.plugin.js';
import { evaluateMath } from '../plugins/math.plugin.js';

// FINAL FIX 1: We import 'SchemaType' which holds the VALUES (OBJECT, STRING, etc.)
import { GoogleGenerativeAI, GenerativeModel, ChatSession, Tool, FunctionDeclarationSchema, SchemaType } from '@google/generative-ai';


export class AgentService {
  private ragService: RAGService;
  private genAI: GoogleGenerativeAI;
  private sessions: Map<string, ChatSession> = new Map();

  private tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: 'get_weather',
          description: 'Get the current weather for a specific location.',
          parameters: {
            // FINAL FIX 2: Using SchemaType here now
            type: SchemaType.OBJECT,
            properties: {
              // And here
              location: { type: SchemaType.STRING, description: 'The city and state, e.g., San Francisco, CA' },
            },
            required: ['location'],
          },
        },
        {
          name: 'evaluate_math',
          description: 'Evaluate a mathematical expression.',
          parameters: {
            // And here
            type: SchemaType.OBJECT,
            properties: {
              // And here
              expression: { type: SchemaType.STRING, description: 'The mathematical expression to evaluate, e.g., "2 * (3 + 4)"' },
            },
            required: ['expression'],
          },
        },
      ],
    },
  ];

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.ragService = new RAGService(apiKey);
    this.ragService.initialize();
  }
  
  private getChatSession(sessionId: string): ChatSession {
    if (!this.sessions.has(sessionId)) {
      const generativeModel = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-latest',
        tools: this.tools,
        systemInstruction: `You are a helpful AI assistant. Answer based on context, history, and tools.`,
      });
      const chat = generativeModel.startChat({ history: [] });
      this.sessions.set(sessionId, chat);
    }
    return this.sessions.get(sessionId)!;
  }

  async handleMessage(sessionId: string, message: string): Promise<string> {
    const chat = this.getChatSession(sessionId);
    const retrievedChunks = await this.ragService.query(message);
    const ragContext = retrievedChunks.join('\n---\n');
    const promptWithContext = `CONTEXT:\n${ragContext}\n\nUSER QUESTION:\n${message}`;
    const result = await chat.sendMessage(promptWithContext);
    const response = result.response;
    const call = response.functionCalls()?.[0];

    if (call) {
      console.log('[Agent] Function call detected:', call.name);
      let functionResponse: any;

      if (call.name === 'get_weather') {
        const args = call.args as { location: string };
        functionResponse = getWeather(args.location);
      } else if (call.name === 'evaluate_math') {
        const args = call.args as { expression: string };
        functionResponse = evaluateMath(args.expression);
      }

      const toolResponseResult = await chat.sendMessage([
        { functionResponse: { name: call.name, response: { content: JSON.parse(functionResponse) } } },
      ]);
      return toolResponseResult.response.text();
    } else {
      return response.text();
    }
  }
}