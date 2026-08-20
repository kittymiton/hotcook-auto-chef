import { HOT_COOK_PROMPT } from '@/lib/apiServer/hotCookPrompt';
import {
  openAIChatResponseSchema,
  type RecentMessage,
} from '@/lib/schema/openAISchema';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createHotcookRecipe({
  content,
  recentMessages,
}: {
  content: string;
  recentMessages: RecentMessage;
}) {
  try {
    const res = await openai.responses.parse({
      model: 'gpt-4o',
      input: [
        {
          role: 'system',
          content: HOT_COOK_PROMPT,
        },
        ...recentMessages,
        { role: 'user', content },
      ],
      text: {
        format: zodTextFormat(openAIChatResponseSchema, 'chat'),
      },
      temperature: 0.7,
      max_output_tokens: 1000,
    });
    // TODO: プロンプト整理 (4o-mini対応 / 複数レシピ対応 / myページ読み取り対応）
    const chat = res.output_parsed;

    if (!chat) throw new Error('AI_ERROR');

    return chat;
  } catch (e) {
    const err = e as Partial<{ error: { type: string }; status: number }>;
    if (err.error?.type === 'insufficient_quota') {
      throw new Error('QUOTA_EXCEEDED');
    }
    if (err.status === 403) {
      throw new Error('FORBIDDEN');
    }

    throw new Error('AI_ERROR');
  }
}
