'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';

export default function MyPage() {
  const { session } = useSupabaseSession();

  const currentEmail = session?.user.email;

  return (
    <>
      <p>
        メールアドレス
        <br />
        {currentEmail}
      </p>
      <p>
        パスワード
        <br />
        ●●●●●●
      </p>
      <Link href="/mypage/profile">編集</Link>
    </>
  );
}
