import { emailOnlySchema } from '@auth/lib/validation/emailOnlySchema';
import { z } from 'zod';

// login/signup共通
export const authSchema = emailOnlySchema.extend({
  password: z.string().min(6, { message: '6文字以上で入力してください' }),
});

// z.infer・・authSchemaの型推論をしてemailOnlySchemaを参照したAuthInput型を生成
export type AuthInput = z.infer<typeof authSchema>;
