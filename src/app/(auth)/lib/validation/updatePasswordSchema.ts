import { z } from 'zod';

// パスワード再設定
export const updatePasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: '6文字以上で入力してください' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// UpdatePasswordInput型を生成
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
