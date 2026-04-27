'use client';

import { numberSchema } from '@/lib/schema/numberSchema';
import { recipeSchema } from '@/lib/schema/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { AsidePanel } from '@authenticated/components/AsidePanel';
import { Loading } from '@authenticated/components/Loading';
import { useClickOutside } from '@authenticated/hooks/useClickOutside';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { useTalks } from '@authenticated/hooks/useTalks';
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
import { useParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { token } = useSupabaseSession();

  const params = useParams();
  const parsedParams = numberSchema.safeParse(params.id);
  if (!parsedParams.success) return <p>不正なURLです</p>;

  const talkRoomId = parsedParams.data;

  const url_main = `/api/talks?talkRoomId=${talkRoomId}`;
  const url_aside = `/api/recipes?take=5`;
  const url_suggest = `/api/suggest`;

  const run = runMutations(mutate, url_main, url_aside);

  const {
    data: talks,
    error: talkError,
    isLoading: isTalkLoading,
  } = useTalks(url_main);

  const {
    data: recipes,
    error: recipeError,
    isLoading: isRecipeLoading,
  } = useRecipes(url_aside, recipeSchema);

  const { suggest } = useSuggest({ url_suggest, isInputFocused });

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputClose = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  useClickOutside({
    ref: inputRef,
    onClose: handleInputClose,
    isActive: isInputFocused,
  });

  const { handleSubmit, isSending, error, isDisabled } = useTalkSubmit({
    token,
    content,
    talkRoomId,
    setIsInputFocused,
    setContent,
    run,
  });

  const handleSelectKeyword = (keyword: string) => {
    setContent((prev) => {
      const normalizedKeywords = prev ? prev.split(' ').filter(Boolean) : [];

      if (normalizedKeywords.includes(keyword)) return prev;
      return prev ? `${prev} ${keyword}` : keyword;
    });
  };

  const { sortedSuggestList } = getSortedSuggestList(suggest);

  const renderRecipeList = () => {
    if (recipeError) {
      return <p>{recipeError}</p>;
    }
    if (!recipes) {
      return <Loading />;
    }
    if (recipes.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return <AsideRecipeList recipes={recipes} />;
  };

  const renderTalks = () => {
    if (talkError) {
      return <p>{talkError.message}</p>;
    }
    if (!talks) {
      return <Loading />;
    }
    if (talks.length === 0) {
      return <p>会話がまだありません</p>;
    }

    return <TalkList talks={talks} />;
  };

  if (talkError?.code === 'NOT_FOUND') {
    return (
      <div>
        <p>この会話は存在しません</p>
        <Link href="/">戻る</Link>
      </div>
    );
  }

  if (!token) return <p>ログイン確認中...</p>;

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>

      {error && (
        <p className="text-red-500 mb-2">送信エラー：{error.message}</p>
      )}

      <div className="flex h-[90vh]">
        <AsidePanel>
          <h2 className="font-bold mb-2">最近のレシピ</h2>
          <>
            {renderRecipeList()}
            <Link href={`/recipes`} className="text-sm underline text-blue-600">
              すべてのレシピを見る
            </Link>
          </>
        </AsidePanel>

        <main className="flex-1 flex flex-col">
          {renderTalks()}

          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <div ref={inputRef}>
              <TalkInput
                value={content}
                disabled={isSending}
                placeholder={isSending ? '送信中...' : '画像やメッセージを送信'}
                onFocus={handleInputFocus}
                onChange={(value) => setContent(value)}
              />

              {isInputFocused && (
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
