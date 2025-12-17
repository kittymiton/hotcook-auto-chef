'use client';

import { useAuthedSWR } from '@/lib/apiClient/useAuthedSWR';
import { safeParseContent } from '@/lib/parser/safeParseContent';
import type { ChatMessage } from '@/types/ai';
import { RecipeBase } from '@/types/recipe';
import type { Talk } from '@/types/talk';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { mutate } from 'swr';

/**
 * トークルーム
 * 指定された talkRoomId の会話ログを取得し、ユーザー入力とAI応答を表示
 * - /api/talksから会話ログを取得して表示
 * - ユーザー入力を/api/openaiへ送信し、AI応答を表示
 * - サイドバーで最新のレシピ（最新5件）を一覧表示
 * - SWRで会話データ・レシピデータを自動取得・更新
 * - スクロール位置を最新メッセージへ自動調整
 * @param params.id - 表示するトークルームのID（URLから文字列として渡される）
 */
export default function TalkRoomIdPage() {
  const { token, isLoading, session } = useSupabaseSession();
  const [content, setContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const params = useParams();
  const from = params.id; // クエリで使用
  const talkRoomId = Number(from);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const url_main =
    token && talkRoomId ? `/api/talks?talkRoomId=${talkRoomId}` : null;
  const url_aside = token ? `/api/recipes?take=5` : null;

  // ==== 会話データ ====
  const { data: talked, error: url_mainError } = useAuthedSWR<Talk[]>(
    url_main,
    token
  );

  // ==== サイドレシピ ====
  const { data: recipes, error: url_asideError } = useAuthedSWR<RecipeBase[]>(
    url_aside,
    token
  );

  //  ==== 過去会話最新3件 ====
  const recentMessages: ChatMessage[] = Array.isArray(talked)
    ? talked
        .slice(0, 3) // talkedは新しい順
        .reverse() // AIには古→新順で渡す
        .map((talk) => ({
          role: talk.sender === 'CHEF' ? 'assistant' : 'user',
          content:
            typeof talk.content === 'string'
              ? talk.content
              : JSON.stringify(talk.content), // 全文string
        }))
    : [];

  const isFirstScroll = useRef(true);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!talked || talked.length === 0) return;

    requestAnimationFrame(() => {
      const max = el.scrollHeight - el.clientHeight;

      // DDM描画待ち：高さが0なら再実行
      if (max <= 0) {
        requestAnimationFrame(() => {
          const el2 = scrollRef.current;
          if (!el2) return;
          const max2 = el2.scrollHeight - el2.clientHeight;
          el2.scrollTo({ top: max2, behavior: 'auto' });
        });
        return;
      }

      el.scrollTo({
        top: max,
        behavior: isFirstScroll.current ? 'auto' : 'smooth',
      });

      isFirstScroll.current = false;
    });
  }, [talked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !content.trim()) return;
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          talkRoomId,
          recentMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('サーバーエラー:', data?.error || '不明なエラー');
        setErrorMsg(data?.error || 'OpenAI通信に失敗しました');
        return;
      }

      setContent('');
      setErrorMsg(null);
    } catch (err) {
      console.error('ネットワークエラー:', err);
      setErrorMsg('通信エラーが発生しました');
    }
    if (url_main) mutate(url_main);
    if (url_aside) mutate(url_aside);
  };

  // === Safe Guards ===
  if (!token) return <p className="p-4">ログイン確認中...</p>;
  // session
  if (isLoading || !session) {
    return <div className="p-4">読み込み中…</div>;
  }
  if (!talked) {
    return <p>読み込み中...</p>;
  }
  if (talked.length === 0) {
    return <p className="p-4">会話がまだありません</p>;
  }
  if (!recipes) {
    return <p>読み込み中...</p>;
  }
  if (url_mainError)
    return (
      <p className="p-4">会話取得に失敗しました: {url_mainError.message}</p>
    );
  if (url_asideError)
    return (
      <p className="p-4">レシピ取得に失敗しました: {url_asideError.message}</p>
    );

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <div className="flex h-[90vh]">
        {/* ==== サイド（レシピ一覧から最新５件） ==== */}
        <aside className="w-64 flex-shrink-0 border-r p-4">
          <h2 className="font-bold mb-2">最近のレシピ</h2>
          <ul className="mb-2 space-y-1">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                {from && (
                  <Link
                    href={`/recipes/${recipe.id}?from=${from}`}
                    className="text-blue-600 hover:underline"
                  >
                    {recipe.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {from && (
            <Link
              href={`/recipes?from=${from}`}
              className="text-sm underline text-blue-600"
            >
              すべてのレシピを見る
            </Link>
          )}
        </aside>

        <main className="flex-1 flex flex-col">
          <div
            className="flex flex-col overflow-y-auto flex-1 max-h-full p-4"
            ref={scrollRef}
          >
            {talked
              .slice()
              .reverse()
              .map((talk) => {
                const isChef = talk.sender === 'CHEF';

                // === ユーザー側 ===
                if (!isChef) {
                  return (
                    <p
                      key={talk.id}
                      className="bg-blue-50 p-2 rounded-lg shadow w-fit ml-auto text-gray-700 mb-4"
                    >
                      {talk.content}
                    </p>
                  );
                }

                // === シェフ側 ===
                const { prefix, recipe, suffix } = safeParseContent(
                  talk.content
                );

                return (
                  <div key={talk.id}>
                    {prefix && (
                      <div className="bg-orange-50 p-2 rounded-lg shadow w-fit mr-auto text-gray-700 mb-4">
                        <p className="whitespace-pre-line">{prefix}</p>
                      </div>
                    )}

                    {recipe && (
                      <div className="bg-orange-50 p-2 rounded shadow mb-4">
                        {recipe['レシピタイトル'] && (
                          <h2 className="font-bold text-orange-700 mb-1">
                            {recipe['レシピタイトル']}
                          </h2>
                        )}

                        {recipe['ポイント'] && (
                          <p className="text-sm mb-2">
                            <strong>ポイント:</strong> {recipe['ポイント']}
                          </p>
                        )}

                        {recipe['調理時間'] && (
                          <p className="text-sm mb-2">
                            <strong>調理時間:</strong> {recipe['調理時間']}
                          </p>
                        )}

                        {Array.isArray(recipe['材料（2人分）']) && (
                          <div className="mb-2">
                            <strong>材料（2人分）:</strong>
                            <ul className="list-disc list-inside text-sm">
                              {recipe['材料（2人分）'].map(
                                (item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(recipe['作り方']) && (
                          <div>
                            <strong>作り方:</strong>
                            <ol className="list-decimal list-inside text-sm">
                              {recipe['作り方'].map(
                                (step: string, i: number) => (
                                  <li key={i}>
                                    {step.replace(/^\d+[:：]\s*/, '').trim()}
                                  </li>
                                )
                              )}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}

                    {suffix && (
                      <div className="bg-orange-50 p-2 rounded-lg shadow w-fit mr-auto text-gray-700 mb-4">
                        <p className="whitespace-pre-line">{suffix}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="画像やメッセージを送信"
              size={32}
              className="border rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              送信
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
