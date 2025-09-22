'use Client';

import type { AuthErrorInfo, Copy } from '@/types/auth';
import type { ReactNode } from 'react';

/**
 * フォーム外枠 内部にフォームフィールド（children）を挿入
 *
 * @param props フォームの入力状態と検証・エラー表示に必要な情報
 *  - title, buttonLabel, footer: type別の表示
 *  - handleSubmit: 入力更新ハンドラー
 *  - children: 内部に配置するフォームフィールド群
 * @returns {JSX.Element} 子要素ラップ（タイトル＋フィールド郡＋ボタン＋フッター）
 */
type AuthFormBaseProps = Copy & {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorInfo?: AuthErrorInfo | null;
  emailChangedAfterError: boolean;
  sending: boolean;
  children: ReactNode;
};
export const AuthFormBase = ({
  title,
  buttonLabel,
  handleSubmit,
  errorInfo,
  children,
  emailChangedAfterError,
  sending,
  footer,
}: AuthFormBaseProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <form noValidate onSubmit={handleSubmit} aria-busy={sending}>
        {children}
        <button
          type="submit"
          disabled={
            (errorInfo?.status === 409 && !emailChangedAfterError) || sending
          }
        >
          {buttonLabel(sending)}
        </button>
        <div>{footer}</div>
      </form>
    </div>
  );
};
