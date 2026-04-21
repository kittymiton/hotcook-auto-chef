'use client';

import { errorText } from '@/lib/constants/errorText';
import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeSchema } from '@/lib/validators/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { Loading } from '@authenticated/components/Loading';
import { useClickOutside } from '@authenticated/hooks/useClickOutside';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { useTalks } from '@authenticated/hooks/useTalks';
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
import { useCallback, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
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
    errorMsg: talkErrorMsg,
    isLoading: isTalkLoading,
  } = useTalks(url_main);

  const {
    data: recipes,
    errorMsg: recipeErrorMsg,
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

  const { handleSubmit, isSending, errorMsg, isDisabled } = useTalkSubmit({
    token,
    content,
    talkRoomId,
    setIsInputFocused,
    setContent,
    run,
    errorText,
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
    if (recipeErrorMsg) {
      return <p> {recipeErrorMsg}</p>;
    }
    if (!recipes) {
      return <Loading />;
    }
    if (recipes.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return <AsideRecipeList recipes={recipes} talkRoomId={talkRoomId} />;
  };

  const renderTalks = () => {
    if (talkErrorMsg) {
      return <p> {talkErrorMsg}</p>;
    }
    if (!talks) {
      return <Loading />;
    }
    if (talks.length === 0) {
      return <p>会話がまだありません</p>;
    }

    return <TalkList talks={talks} />;
  };

  if (!token) return <p>ログイン確認中...</p>;

  return (
    <>
      <h1 className="text-lg font-bold mb-4">今日は何にしましょうか？</h1>
      {errorMsg && <p className="text-red-500 mb-2">送信エラー：{errorMsg}</p>}

      <div className="flex h-[90vh]">
        <AsidePanel>
          <h2 className="font-bold mb-2">最近のレシピ</h2>
          <>
            {renderRecipeList()}
            <Link
              href={`/recipes?from=${talkRoomId}`}
              className="text-sm underline text-blue-600"
            >
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
