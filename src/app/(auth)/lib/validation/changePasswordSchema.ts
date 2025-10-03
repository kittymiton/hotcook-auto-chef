import { z } from 'zod';

// マイページ：パスワード変更
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: '6文字以上で入力してください' }),
    newPassword: z.string().min(6, { message: '6文字以上で入力してください' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// ChangePasswordInput型を生成
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
