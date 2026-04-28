import z from 'zod';

export type SuggestType = 'seed' | 'popular' | 'recent';
export const suggestTypeSchema = z.enum(['seed', 'popular', 'recent']);

export type SuggestItem = {
  keyword: string;
  normalizedKeyword: string;
  label: SuggestType;
};
export const suggestItemSchema: z.ZodType<SuggestItem> = z.object({
  keyword: z.string(),
  normalizedKeyword: z.string(),
  label: suggestTypeSchema,
});

export type SuggestCollection = {
  seed: SuggestItem[];
  popular: SuggestItem[];
  recent: SuggestItem[];
};
export const suggestCollectionSchema: z.ZodType<SuggestCollection> = z.object({
  seed: z.array(suggestItemSchema),
  popular: z.array(suggestItemSchema),
  recent: z.array(suggestItemSchema),
});
