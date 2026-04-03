import z from 'zod';

export const suggestLabelSchema = z.enum(['seed', 'popular', 'recent']);
export type SuggestLabel = z.infer<typeof suggestLabelSchema>;

export const SuggestBaseItemSchema = z.object({
  keyword: z.string(),
  normalizedKeyword: z.string(),
});

export const suggestItemSchema = SuggestBaseItemSchema.extend({
  label: suggestLabelSchema,
});
export type SuggestItem = z.infer<typeof suggestItemSchema>;

export const suggestCollectionSchema = z.object({
  seed: z.array(suggestItemSchema),
  popular: z.array(suggestItemSchema),
  recent: z.array(suggestItemSchema),
});

export type SuggestCollection = z.infer<typeof suggestCollectionSchema>;
