import { z } from 'zod';

const allowedTLD = ['.com', 'jp'];
const normalizeEmail = (email: string) =>
  email
    .trim()
    .toLowerCase()
    .replace(/\u200b/g, ''); // 前後空白・大文字・ゼロ幅除去

// Zodschema定義
export const resendSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'メールは必須です' })
    .email({ message: 'メール形式が正しくありません' })
    .transform(normalizeEmail)
    // 許可されたTLDで終わっているかチェック
    .refine(
      (email) => allowedTLD.some((allowedTLD) => email.endsWith(allowedTLD)),
      {
        message:
          'ドメインに誤りがあります。.comやco.jpなどのメールアドレスを使用してください',
      }
    ),
});
// z.infer・・resendSchemaの型推論をしてResendInput型を生成
export type ResendInput = z.infer<typeof resendSchema>;
