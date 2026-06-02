import { SuggestItem } from '@/lib/schema/suggestSchema';
import { TalkInput } from '@authenticated/talkRoom/components/form/TalkInput';
import { TalkSubmitButton } from '@authenticated/talkRoom/components/form/TalkSubmitButton';
import { Suggest } from '@authenticated/talkRoom/components/suggest/Suggest';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLDivElement>;
  content: string;
  isSending: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  isInputFocused: boolean;
  sortedSuggestList: SuggestItem[];
  onKeywordSelect: (keyword: string) => void;
  isDisabled: boolean;
};

export const TalkForm = ({
  onSubmit,
  inputRef,
  content,
  isSending,
  onFocus,
  onChange,
  isInputFocused,
  sortedSuggestList,
  onKeywordSelect,
  isDisabled,
}: Props) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-6">
      <div ref={inputRef}>
        <TalkInput
          value={content}
          disabled={isSending}
          placeholder={isSending ? '送信中...' : '画像やメッセージを送信'}
          onFocus={onFocus}
          onChange={onChange}
        />

        {isInputFocused && (
          <>
            {sortedSuggestList.map((item) => (
              <Suggest
                key={item.keyword}
                item={item}
                onKeywordSelect={onKeywordSelect}
              />
            ))}
          </>
        )}

        <TalkSubmitButton disabled={isDisabled} sending={isSending} />
      </div>
    </form>
  );
};
