'use client';

import { numberSchema } from '@/lib/schema/numberSchema';
import { recipeSchema } from '@/lib/schema/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/SideArea';
import { TalkArea } from '@authenticated/components/TalkArea';
import { useClickOutside } from '@authenticated/hooks/useClickOutside';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { useTalks } from '@authenticated/hooks/useTalks';
import { TalkForm } from '@authenticated/talkRoom/components/form/TalkForm';
import { TalkPanel } from '@authenticated/talkRoom/components/panel/TalkPanel';
import { SideNav } from '@authenticated/talkRoom/components/side/SideNav';
import { SideRecipeList } from '@authenticated/talkRoom/components/side/SideRecipeList';

import { useSuggest } from '@authenticated/talkRoom/hooks/useSuggest';
import { useTalkSubmit } from '@authenticated/talkRoom/hooks/useTalkSubmit';
import { getSortedSuggestList } from '@authenticated/talkRoom/utils/getSortedSuggestList';
import { runMutations } from '@authenticated/talkRoom/utils/runMutations';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { token } = useSupabaseSession();
  const router = useRouter();

  const params = useParams();
  const parsedParams = numberSchema.safeParse(params.id);
  if (!parsedParams.success) return <p>不正なURLです</p>;

  const talkRoomId = parsedParams.data;

  const url_main = `/api/talks?talkRoomId=${talkRoomId}`;
  const url_aside = `/api/recipes?take=5`; // TODO: recentRecipesUrlにリネームする
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

  const { handleSubmit, isSending, errorMsg, isDisabled } = useTalkSubmit({
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

  if (talkError) {
    return (
      <div>
        <p>{talkError}</p>
        <button onClick={() => router.back()}>戻る</button>
        <Link href="/">TOPに戻る</Link>
      </div>
    );
  }

  if (recipeError) {
    return (
      <div>
        <p>{recipeError}</p>
        <button onClick={() => router.back()}>戻る</button>
        <Link href="/">TOPに戻る</Link>
      </div>
    );
  }

  const renderRecipeList = () => {
    if (!recipes) {
      return <Loading />;
    }
    if (recipes.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} />
      </SideNav>
    );
  };

  const renderTalks = () => {
    if (!talks) {
      return <Loading />;
    }
    if (talks.length === 0) {
      return <p>会話がまだありません</p>;
    }

    return (
      <TalkPanel talks={talks}>
        <TalkForm
          onSubmit={handleSubmit}
          inputRef={inputRef}
          content={content}
          isSending={isSending}
          onFocus={handleInputFocus}
          onChange={(value) => setContent(value)}
          isInputFocused={isInputFocused}
          sortedSuggestList={sortedSuggestList}
          onKeywordSelect={handleSelectKeyword}
          isDisabled={isDisabled}
        />
      </TalkPanel>
    );
  };

  if (!token) return <p>ログイン確認中...</p>;

  return (
    <>
      {errorMsg && <p className="mb-2">送信エラー：{errorMsg}</p>}

      <div className="flex h-[calc(100vh-55px)] gap-8">
        <SideArea>{renderRecipeList()}</SideArea>
        <TalkArea>{renderTalks()}</TalkArea>
      </div>
    </>
  );
}
