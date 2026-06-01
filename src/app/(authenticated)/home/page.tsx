'use client';

import { useRouter } from 'next/navigation';

// ログインユーザーのダッシュボード 将来はトーク一覧の入口にする
export default function AuthenticatedHomePage() {
  const router = useRouter();

  return (
    <div className="flex gap-8">
      {/* TODO：talkRoom導線はリレーション修正後に取得から作り直す */}
      {/* <SideArea>
        <SideNav talkRoomId={talkRoomId}/>
      </SideArea> */}
      <main>
        <h2>おかえりなさい</h2>
        <p>前回の会話や保存したレシピを確認できます</p>
        {/* TODO：talkRoom導線はリレーション修正後に取得から作り直す */}
        {/* <button type="button" onClick={handleBackTalk}>
        会話に戻る
      </button> */}
      </main>
    </div>
  );
}
