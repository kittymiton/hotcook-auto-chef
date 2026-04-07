'use client';

import { fetcher } from '@/lib/apiClient/fetcher';
import { splitChefContent } from '@/lib/parser/splitChefContent';
import { suggestSchema } from '@/lib/schema/suggestSchema';
import { chatSchema } from '@/lib/validators/chatSchema';
import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeSchema } from '@/lib/validators/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchSuggest, setFetchSuggest] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const { token } = useSupabaseSession();

  const params = useParams();
  const result = numberSchema.safeParse(params.id);
  if (!result.success) notFound();
  const talkRoomId = result.data;

  const url_main = `/api/talks?talkRoomId=${talkRoomId}`;
  const url_aside = `/api/recipes?take=5`;
  const url_suggest = `/api/suggest`;

  const {
    data: talks,
    error: url_mainError,
    isLoading: isTalkLoading,
  } = useAuthedSWR(url_main, chatSchema);

  const {
    data: recipes,
    error: url_asideError,
    isLoading: isRecipeLoading,
  } = useAuthedSWR(url_aside, recipeSchema);

  const { data: suggest } = useAuthedSWR(
    fetchSuggest ? url_suggest : null,
    suggestSchema
  );
  // TODO: safe.parse対応 / useSuggestフック化

  const isLoading = isTalkLoading || isRecipeLoading;

  const errorText: Record<string, string> = {
    INVALID_FORMAT: '料理名や食材を教えてください',
    UNAUTHORIZED: 'ログインが必要です',
    NETWORK_ERROR: '通信エラーが発生しました。ネット接続を確認してください',
    QUOTA_EXCEEDED: '利用上限に達しました',
    FORBIDDEN: '現在この機能は利用できません。設定をご確認ください',
    AI_ERROR: 'ただいま混み合っています。少し時間をおいて再度お試しください',
    DEFAULT: 'システムエラーが発生しました。時間を置いてお試しください',
  };

  const seed = suggest?.seed ?? [];
  const popular = suggest?.popular ?? [];
  const recent = suggest?.recent ?? [];

  useLayoutEffect(() => {
    if (!talks?.length) return;

    let raf1 = 0;
    let raf2 = 0;
    let raf3 = 0;
    let cleanedup = false;

    const scrollToBottom = () => {
      if (cleanedup) return; // 新しいrafを優先し、前回のrafを止める

      const viewPort = scrollRef.current;
      if (!viewPort) return;
      viewPort.scrollTop = viewPort.scrollHeight - viewPort.clientHeight;
    };

    // レイアウト確定まで3フレーム追従し、スクロールが上に戻るバグを防ぐ
    raf1 = requestAnimationFrame(() => {
      scrollToBottom();
      raf2 = requestAnimationFrame(() => {
        scrollToBottom();
        raf3 = requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    });

    return () => {
      // 画像等読み込みの重いレイアウトシフトでrafの遅延実行を止め、干渉を防ぐ
      cleanedup = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
    };
  }, [talks]);

  useEffect(() => {
    if (!focused) return;

    const outsideClick = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (inputRef.current && inputRef.current.contains(target)) return;
      setFocused(false);
    };

    document.addEventListener('pointerdown', outsideClick);

    return () => {
      document.removeEventListener('pointerdown', outsideClick);
    };
  }, [focused]);

  const handleFocus = () => {
    setFocused(true);
    setFetchSuggest(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !content.trim() || sending) return;

    const currentContent = content;

    setSending(true);
    setFocused(false);
    setContent('');
    setErrorMsg(null);

    const body = {
      content: currentContent,
      talkRoomId,
    };

    try {
      await fetcher('/api/talks', {
        method: 'POST',
        token,
        body,
      });

      if (url_main) mutate(url_main);
      if (url_aside) mutate(url_aside);
      if (url_suggest) mutate(url_suggest);
    } catch (e) {
      console.error(e);

      const remind =
        e instanceof Error
          ? (errorText[e.message] ?? errorText.DEFAULT)
          : errorText.DEFAULT;

      setContent(currentContent);
      setErrorMsg(remind);
    } finally {
      setSending(false);
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    setContent((prev) => {
      const normalizedKeywords = prev ? prev.split(' ').filter(Boolean) : [];
      if (normalizedKeywords.includes(keyword)) return prev;
      return prev ? `${prev} ${keyword}` : keyword;
    });
  };

  if (!token) return <p>ログイン確認中...</p>;
  if (isLoading) return <p>ローディング中...</p>;

  if (url_mainError || url_asideError) {
    return (
      <p className="p-4 text-red-500">
        取得に失敗しました: {url_mainError?.message || url_asideError?.message}
      </p>
    );
  }

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <div className="flex h-[90vh]">
        <aside className="w-64 flex-shrink-0 border-r p-4">
          {!recipes ? (
            <p>読み込み中...</p>
          ) : (
            <>
              <h2 className="font-bold mb-2">最近のレシピ</h2>
              <ul className="mb-2 space-y-1">
                {recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <Link
                      href={`/recipes/${recipe.id}?from=${talkRoomId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {recipe.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/recipes?from=${talkRoomId}`}
                className="text-sm underline text-blue-600"
              >
                すべてのレシピを見る
              </Link>
            </>
          )}
        </aside>

        <main className="flex-1 flex flex-col">
          <div
            className="flex flex-col overflow-y-auto flex-1 p-4"
            ref={scrollRef}
          >
            {!talks ? (
              <p>読み込み中...</p>
            ) : talks.length === 0 ? (
              <p>会話がまだありません</p>
            ) : (
              talks
                .slice()
                .reverse()
                .map((talk) => {
                  const isChef = talk.sender === 'CHEF';

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

                  const { prefix, recipe, suffix } = splitChefContent(
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
                            <p className="text-sm mb-2 text-gray-700">
                              <strong>ポイント:</strong> {recipe['ポイント']}
                            </p>
                          )}

                          {recipe['調理時間'] && (
                            <p className="text-sm mb-2 text-gray-700">
                              <strong>調理時間:</strong> {recipe['調理時間']}
                            </p>
                          )}

                          {recipe['材料（2人分）'] && (
                            <div className="mb-2 text-gray-700">
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

                          {recipe['作り方'] && (
                            <div>
                              <strong>作り方:</strong>
                              <ol className="list-decimal list-inside text-sm text-gray-700">
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
                })
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <div ref={inputRef}>
              <input
                type="text"
                value={content}
                onFocus={handleFocus}
                onChange={(e) => setContent(e.target.value)}
                disabled={sending}
                placeholder={sending ? '送信中...' : '画像やメッセージを送信'}
                size={32}
                className="border rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {focused && (
                <>
                  {seed.map((item) => (
                    <button
                      type="button"
                      key={item.keyword}
                      onPointerDown={() => handleSelectKeyword(item.keyword)}
                    >
                      {item.keyword}
                    </button>
                  ))}
                  {popular.map((item) => (
                    <button
                      type="button"
                      key={item.keyword}
                      onPointerDown={() => handleSelectKeyword(item.keyword)}
                    >
                      {item.keyword}
                    </button>
                  ))}
                  {recent.map((item) => (
                    <button
                      type="button"
                      key={item.keyword}
                      onPointerDown={() => handleSelectKeyword(item.keyword)}
                    >
                      {item.keyword}
                    </button>
                  ))}
                </>
              )}

              <button
                type="submit"
                disabled={sending || !content.trim()}
                className={`${sending || !content.trim() ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded  transition`}
              >
                {sending ? '送信中' : '送信'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
