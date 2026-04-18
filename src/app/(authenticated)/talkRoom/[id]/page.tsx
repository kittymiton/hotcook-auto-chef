'use client';

import { errorText } from '@/lib/constants/errorText';
import { chatSchema } from '@/lib/schema/chatSchema';
import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeSchema } from '@/lib/validators/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';

import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { AsidePanel } from '@authenticated/talkRoom/components/AsidePanel';
import { AsideRecipeList } from '@authenticated/talkRoom/components/AsideRecipeList';
import { Button } from '@authenticated/talkRoom/components/Button';
import { Suggest } from '@authenticated/talkRoom/components/Suggest';
import { TalkInput } from '@authenticated/talkRoom/components/TalkInput';

import { TalkList } from '@authenticated/talkRoom/components/TalkList';
import { useSuggest } from '@authenticated/talkRoom/hooks/useSuggest';
import { useTalkSubmit } from '@authenticated/talkRoom/hooks/useTalkSubmit';
import { getSortedSuggestList } from '@authenticated/talkRoom/utils/getSortedSuggestList';
import { runMutations } from '@authenticated/talkRoom/utils/runMutations';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLDivElement | null>(null);

  const { token } = useSupabaseSession();

  const params = useParams();
  const result = numberSchema.safeParse(params.id);
  if (!result.success) notFound();
  const talkRoomId = result.data;

  const url_main = `/api/talks?talkRoomId=${talkRoomId}`;
  const url_aside = `/api/recipes?take=5`;
  const url_suggest = `/api/suggest`;

  const run = runMutations(mutate, url_main, url_aside);

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

  const { suggest } = useSuggest({ url_suggest, isFocused });

  const { handleSubmit, isSending, errorMsg, isDisabled } = useTalkSubmit({
    token,
    content,
    talkRoomId,
    setIsFocused,
    setContent,
    run,
    errorText,
  });

  const isInitialLoading = !recipes || !talks;

  let recipeContent;
  const recipeIsEmpty = recipes?.length === 0;

  if (!recipes) {
    recipeContent = null;
  } else if (recipeIsEmpty) {
    recipeContent = <p>レシピがまだありません</p>;
  } else {
    recipeContent = (
      <AsideRecipeList recipes={recipes} talkRoomId={talkRoomId} />
    );
  }

  let talkContent;
  const talkIsEmpty = talks?.length === 0;

  if (!talks) {
    talkContent = null;
  } else if (talkIsEmpty) {
    talkContent = <p>会話がまだありません</p>;
  } else {
    talkContent = <TalkList talks={talks} />;
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    if (!isFocused) return;

    const outsideClick = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (inputRef.current && inputRef.current.contains(target)) return;
      setIsFocused(false);
    };

    document.addEventListener('pointerdown', outsideClick);

    return () => {
      document.removeEventListener('pointerdown', outsideClick);
    };
  }, [isFocused]);

  const handleSelectKeyword = (keyword: string) => {
    setContent((prev) => {
      const normalizedKeywords = prev ? prev.split(' ').filter(Boolean) : [];
      if (normalizedKeywords.includes(keyword)) return prev;
      return prev ? `${prev} ${keyword}` : keyword;
    });
  };

  const { sortedSuggestList } = getSortedSuggestList(suggest);

  if (!token) return <p>ログイン確認中...</p>;

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>

      {isInitialLoading && <p>ローディング中...</p>}
      {errorMsg && <p className="text-red-500 mb-2">送信エラー：{errorMsg}</p>}

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
              <TalkInput
                value={content}
                disabled={isSending}
                placeholder={isSending ? '送信中...' : '画像やメッセージを送信'}
                onFocus={handleFocus}
                onChange={(value) => setContent(value)}
              />

              {isFocused && (
                <>
                  {sortedSuggestList.map((item) => (
                    <Suggest
                      key={item.keyword}
                      item={item}
                      onKeywordSelct={handleSelectKeyword}
                    />
                  ))}
                </>
              )}

              <Button disabled={isDisabled} sending={isSending} />
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
