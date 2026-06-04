'use client';

import { SideArea } from '@authenticated/components/SideArea';
import { SideNav } from '@authenticated/talkRoom/components/side/SideNav';
import { useRouter } from 'next/navigation';

// ログインユーザーのダッシュボード 将来はトーク一覧の入口にする
export default function AuthenticatedHomePage() {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>
        <SideNav />
      </SideArea>
      <main>
        <h2>おかえりなさい</h2>
        <p>前回の会話や保存したレシピを確認できます</p>

        {/* <button type="button" onClick={handleBackTalk}>
          会話に戻る
        </button> */}
      </main>
    </div>
  );
}
