'use client';

import { MYPAGE__PROFILE_PATH } from '@/constants/index';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';

/**
 * マイページのUI
 *
 * @returns {JSX.Element}
 */
export default function MyPage() {
  const { session } = useSupabaseSession();
  if (!session) {
    return;
  }
  const currentEmail = session.user.email;

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
      <Link href={MYPAGE__PROFILE_PATH}>編集</Link>
    </>
  );
}
