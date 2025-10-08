import { emailOnlySchema } from '@auth/lib/validation/emailOnlySchema';
import { z } from 'zod';

// パスワード再設定用スキーマ（用途名として残す）
export const resetPasswordSchema = emailOnlySchema;
// z.infer・・resendSchemaの型推論をしてemailOnlySchemaを参照したResendPasswordInput型を生成
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
