import { ChatItemList } from '@/lib/schema/chatSchema';
import { ErrorCode } from '@/lib/schema/errorSchema';
import { filterErrorCodes } from '@/lib/utils/filterErrorCodes';
import { DisplayErrorMessage } from '@authenticated/components/error/DisplayErrorMessage';
import { Loading } from '@authenticated/components/Loading';

type Props = {
  isTalkLoading: boolean;
  talks: ChatItemList | undefined;
  talkError: ErrorCode | null;
  recipesError: ErrorCode | null;
};

// データ取得後の状態に応じた表示制御
export const TalkDataState = ({
  isTalkLoading,
  talks,
  talkError,
  recipesError,
}: Props) => {
  if (isTalkLoading && !talks) {
    return <Loading />;
  }

  if (!talks) {
    // 例外系
    return <p>会話を表示できません</p>;
  }

  const emptyTalkMessage = !talkError && talks.length === 0 && (
    <div className="pb-4 pt-4">
      <p>
        入力欄をクリックし、今日のおすすめは何？など、入れて送信してください！
        <br />
        あなた専用のオリジナルレシピを提案します。
      </p>
    </div>
  );

  const filterdErrorCodeArray = filterErrorCodes(talkError, recipesError);

  return (
    <>
      {emptyTalkMessage}
      {filterdErrorCodeArray.length > 0 && (
        <DisplayErrorMessage errorCodes={filterdErrorCodeArray} />
      )}
    </>
  );
};
