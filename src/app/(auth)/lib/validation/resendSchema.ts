import { emailOnlySchema } from '@auth/lib/validation/emailOnlySchema';
import { z } from 'zod';

// 再送用スキーマ（用途名として残す）
export const resendSchema = emailOnlySchema;
// z.infer・・resendSchemaの型推論をしてemailOnlySchemaを参照したResendInput型を生成
export type ResendInput = z.infer<typeof resendSchema>;
