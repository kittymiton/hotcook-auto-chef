'use client';

import { HOME_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * パスワードリセット用メール送信後に遷移するページ
 * @returns {JSX.Element}（メッセージ）
 */
export default function ResetPasswordSendPage() {
  return (
    <div>
      <h1>リセット用の確認メールを送信しました</h1>
      <div>
        <p>メールからリンクをクリックし、パスワード変更ができます。</p>
        <p>※メールが届かない場合は迷惑メールフォルダをご確認ください。</p>
        <p>
          <Link href={HOME_PATH}>TOP</Link>
        </p>
      </div>
    </div>
  );
}
