/* ●●ルール●●
 *
 * null許容は使う場所で付ける
 * 再利用orネストが深いものは必ず型名をつける
 */

import { ReactNode } from 'react';

/**
 * 認証モードの種類
 * - useAuthForm
 * - AuthScreen
 */
export type AuthType = 'login' | 'signup';

/**
 * 認証エラーの正規化後の形
 * - useAuthForm
 * - AuthErrorBanner
 */
export type AuthErrorInfo = {
  status: number;
  message: string; // 表示用の日本語
  code?: string; // 'url_auth_error' 等
};

/**
 * 認証フォーム内で使うresend実行に必要なもの
 * - useAuthForm
 */
export type ResendControls = {
  requireEmail: boolean; // メールアドレス入力欄
  showResend: boolean; // UI分岐
  sending: boolean;
  onResend?: () => Promise<void>;
};

/**
 * 認証フォームに必要な状態と操作の返り値（フックが返す型）
 * - useAuthForm
 * - AuthScreenが呼び出し、AuthFieldsに分配
 * - AuthErrorBanner
 */
export type UseAuthForm = {
  email: string;
  password: string;
  formErrors: { email?: string; password?: string };
  errorInfo: AuthErrorInfo | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  emailChangedAfterError: boolean;
  resendControls: ResendControls;
};

/**
 * 認証フォームUI出し分け
 * - AuthScreen
 * - AuthFormBase
 */
export type Copy = { title: string; buttonLabel: string; footer: ReactNode };
