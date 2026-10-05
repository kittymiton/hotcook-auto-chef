'use client';

import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { idParamSchema } from '@/lib/schema/paramSchema';
import { recipeSchema } from '@/lib/schema/recipeSchema';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { DisplayErrorMessage } from '@authenticated/components/error/DisplayErrorMessage';

import { UnauthorizedError } from '@authenticated/components/error/UnauthorizedError';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
import { TalkArea } from '@authenticated/components/TalkArea';
import { useClickOutside } from '@authenticated/hooks/useClickOutside';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { useTalks } from '@authenticated/hooks/useTalks';
import { TalkForm } from '@authenticated/talkRoom/components/form/TalkForm';
import { TalkPanel } from '@authenticated/talkRoom/components/panel/TalkPanel';
import { SideRecipeList } from '@authenticated/talkRoom/components/side/SideRecipeList';
import { useSuggest } from '@authenticated/talkRoom/hooks/useSuggest';
import { useTalkSubmit } from '@authenticated/talkRoom/hooks/useTalkSubmit';
import { getSortedSuggestList } from '@authenticated/talkRoom/utils/getSortedSuggestList';
import { runMutations } from '@authenticated/talkRoom/utils/runMutations';
import { useParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { mutate } from 'swr';

export default function TalkRoomIdPage() {
  const [content, setContent] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const { token } = useSupabaseSession();

  const params = useParams();

  const parsedParams = idParamSchema.safeParse(params.id);

  if (!parsedParams.success) {
    return (
      <main className="px-4">
        <p>{errorCodeMap.INVALID_ID}</p>
      </main>
    );
  }

  const talkRoomId = parsedParams.data;

  const talkRoomUrl = `/api/talks?talkRoomId=${talkRoomId}`;
  const recipeListUrl = `/api/recipes?take=5`;
  const suggestUrl = `/api/suggest`;

  const run = runMutations(mutate, talkRoomUrl, recipeListUrl);

  const {
    data: talks,
    error: talkError,
    isLoading: isTalkLoading,
  } = useTalks(talkRoomUrl);

  // sidenav用レシピ一覧
  const {
    data: recipes,
    error: recipesError,
    isLoading: isRecipesLoading,
  } = useRecipes(recipeListUrl, recipeSchema); // レシピ一覧・レシピ詳細でschemaが異なるため、呼び出し側でschemaを渡す

  const { suggest } = useSuggest({ suggestUrl, isInputFocused }); // サジェスト取得条件をまとめて渡す

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
    const code = talkError;

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  if (recipesError) {
    const code = recipesError;

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  const renderSideRecipeList = () => {
    if (isRecipesLoading || !recipes) {
      return <Loading />;
    }

    if (recipes.length === 0) {
      return <SideNav />;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} />
      </SideNav>
    );
  };

  const renderTalks = () => {
    if (isTalkLoading || !talks) {
      return <Loading />;
    }

    const emptyTalkMessage = !talkError && talks.length === 0 && (
      <div className="pb-4 pt-4">
        <p>
          会話がまだありません。
          <br />
          今日のおすすめは何？など、話しかけてみてください！
        </p>
      </div>
    );

    // エラー表示対象のcodeを1つの配列にまとめる
    const errorCodeArray = [talkError, recipesError];

    // 片方のみエラー時に混ざるnullだけを除外
    const filterdErrorCodeArray = errorCodeArray.filter(
      (code) => code !== null
    );

    return (
      <>
        {/* 正常系：データなし */}
        {emptyTalkMessage}

        {/* 異常系：データ有無に関係なく取得エラーを表示。Side非表示時も見えるようmainに表示 */}
        {filterdErrorCodeArray.length > 0 && (
          <DisplayErrorMessage errorCodes={filterdErrorCodeArray} />
        )}

        <TalkPanel talks={talks}>
          <div className="pl-6 pt-2">
            {errorMsg && (
              <p className="text-stone-700">送信できません：{errorMsg}</p>
            )}
          </div>
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
      </>
    );
  };

  if (!token) return <p>ログイン確認中...</p>;

  return (
    <>
      <div className="flex h-[calc(100vh-55px)] gap-8">
        <SideArea>{renderSideRecipeList()}</SideArea>
        <TalkArea>{renderTalks()}</TalkArea>
      </div>
    </>
  );
}
