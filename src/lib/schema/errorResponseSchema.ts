import z from 'zod';

export const errorResponseSchema = z.object({ error: z.string().optional() });
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
