'use client';

import { LOGIN_PATH } from '@/constants/index';
import { signOut } from '@auth/lib/sign';
import { useRouter } from 'next/navigation';

/**
 * ログイン済みユーザー用ヘッダーUI
 * 直接signOut実行（UI責務が軽いためAuthFormに集約した思想から外す）
 * @returns {JSX.Element}（ログアウトボタン、プロフ編集アイコン（予定））
 */
export const UserMenu = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    const { error } = await signOut();
    if (error) {
      alert('ログアウトに失敗しました');
    } else {
      router.push(LOGIN_PATH);
    }
  };
  return (
    <>
      <button onClick={handleLogout}>ログアウト</button>
    </>
  );
};
