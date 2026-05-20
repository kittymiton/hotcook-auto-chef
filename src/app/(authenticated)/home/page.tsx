'use client';

import { LOGIN_PATH } from '@/constants/paths';
import { signOut } from '@auth/lib/sign';
import { useRouter } from 'next/navigation';

// 将来はトーク一覧の入口にする
export default function AuthenticatedHomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      alert('ログアウトに失敗しました');
      return;
    }

    router.push(LOGIN_PATH);
  };

  return (
    <main>
      <h2>おかえりなさい</h2>
      <p>前回の会話や保存したレシピを確認できます</p>

      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
      {/* TODO：talkRoom導線はリレーション修正後に取得から作り直す */}
      {/* <button type="button" onClick={handleBackTalk}>
        会話に戻る
      </button> */}
    </main>
  );
}
