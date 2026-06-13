import z from 'zod';

// URLparamsの検証用
export const idParamSchema = z.string().regex(/^\d+$/).transform(Number);
