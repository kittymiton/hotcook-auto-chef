import { suggestItemSchema } from '@/lib/schema/suggestItemSchema';
import z from 'zod';

export const suggestSchema = z.object({
  seed: z.array(suggestItemSchema),
  popular: z.array(suggestItemSchema),
  recent: z.array(suggestItemSchema),
});
