// src/rag/rag.service.ts

import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface Chunk {
  text: string;
  embedding: number[];
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class RAGService {
  private knowledgeBase: Chunk[] = [];
  private embeddingModel: GenerativeModel;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  }

  async initialize() {
    console.log('Initializing RAG service with Gemini...');
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        const textContent = await marked.parse(content);
        const chunks = textContent.split(/\n\s*\n/).filter((c: string) => c.trim().length > 10);

        for (const chunkText of chunks) {
          const embedding = await this.getEmbedding(chunkText);
          this.knowledgeBase.push({ text: chunkText, embedding });
        }
      }
    }
    console.log(`RAG service initialized. ${this.knowledgeBase.length} chunks loaded.`);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const result = await this.embeddingModel.embedContent(text);
    return result.embedding.values;
  }
  
  async query(message: string, topK: number = 3): Promise<string[]> {
    const queryEmbedding = await this.getEmbedding(message);
    if (!this.knowledgeBase.length) return [];

    const similarities = this.knowledgeBase.map(chunk => ({
      text: chunk.text,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topK).map(s => s.text);
  }
}