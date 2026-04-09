'use client';

import { fetcher } from '@/lib/apiClient/fetcher';
import { chatSchema } from '@/lib/schema/chatSchema';
import { suggestSchema } from '@/lib/schema/suggestSchema';
import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeSchema } from '@/lib/validators/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { AsidePanel } from '@authenticated/components/layout/AsidePanel';
import { RecipeList } from '@authenticated/components/recipe/RecipeList';
import { TalkList } from '@authenticated/components/talk/TalkList';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchSuggest, setFetchSuggest] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);

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

  let recipeContent;
  let talkContent;

  if (!recipes) {
    recipeContent = <p>読み込み中...</p>;
  } else {
    recipeContent = <RecipeList recipes={recipes} talkRoomId={talkRoomId} />;
  }

  if (!talks) {
    talkContent = <p>読み込み中...</p>;
  } else if (talks.length === 0) {
    <p>会話がまだありません</p>;
  } else {
    talkContent = <TalkList talks={talks} />;
  }

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <div className="flex h-[90vh]">
        <AsidePanel>
          <h2 className="font-bold mb-2">最近のレシピ</h2>
          <>
            {recipeContent}
            {url_asideError && (
              <p>取得に失敗しました: {url_asideError.message}</p>
            )}
            <Link
              href={`/recipes?from=${talkRoomId}`}
              className="text-sm underline text-blue-600"
            >
              すべてのレシピを見る
            </Link>
          </>
        </AsidePanel>

        <main className="flex-1 flex flex-col">
          {talkContent}
          {url_mainError && <p>取得に失敗しました: {url_mainError.message}</p>}

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
