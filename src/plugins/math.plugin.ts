// src/plugins/math.plugin.ts
import { create, all } from 'mathjs';

const math = create(all);

export function evaluateMath(expression: string): string {
  console.log(`[Plugin] Evaluating math expression: ${expression}`);
  try {
    const result = math.evaluate(expression);
    return JSON.stringify({ expression, result });
  } catch (error: any) {
    return JSON.stringify({ expression, error: error.message });
  }
}