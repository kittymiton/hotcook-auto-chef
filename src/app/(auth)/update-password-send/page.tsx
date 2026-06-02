'use client';

import Link from 'next/link';

/**
 * パスワードリセット用メール送信後に遷移するページ
 * @returns {JSX.Element}（メッセージ）
 */
export default function UpdatePasswordSendPage() {
  return (
    <div>
      <h1>完了しました</h1>
      <div>
        <p>
          パスワード変更済みです。
          <Link href="/">TOP</Link>
        </p>
      </div>
    </div>
  );
}
