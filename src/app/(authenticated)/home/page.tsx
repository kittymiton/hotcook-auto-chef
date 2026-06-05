'use client';

import { SideArea } from '@authenticated/components/SideArea';
import { SideNav } from '@authenticated/talkRoom/components/side/SideNav';

// ログインユーザーのダッシュボード 将来はトーク一覧の入口にする
export default function AuthenticatedHomePage() {
  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>
        <SideNav />
      </SideArea>
      <main className="flex-1">
        <h2>おかえりなさい</h2>
        <p>前回の会話や保存したレシピを確認できます</p>
      </main>
    </div>
  );
}
