// src/index.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// FIX: Added '.js' to the import
import { AgentService } from './agent/agent.service.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY; 
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}

const agentService = new AgentService(apiKey);

app.get('/', (req: Request, res: Response) => {
  res.send('AI Agent Server (Gemini) is running!');
});

app.post('/agent/message', async (req: Request, res: Response) => {
  const { message, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: '`message` and `session_id` are required.' });
  }

  try {
    const reply = await agentService.handleMessage(session_id, message);
    res.json({ reply });
  } catch (error: any) {
    console.error('Error handling message:', error);
    res.status(500).json({ error: 'An internal error occurred.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});