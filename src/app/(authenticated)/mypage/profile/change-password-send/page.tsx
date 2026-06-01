'use client';

import Link from 'next/link';

export default function ChangePasswordSendPage() {
  return (
    <div>
      <h1>完了しました</h1>
      <div>
        <p>
          パスワード変更済みです。
          <Link href="/mypage">TOP</Link>
        </p>
      </div>
    </div>
  );
}
