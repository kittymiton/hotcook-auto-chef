import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { sendTalkMessage } from '@authenticated/talkRoom/utils/sendTalkMessage';
import { useState } from 'react';

type UseTalkSubmitArgs = {
  token: string | null;
  content: string;
  talkRoomId: number;
  setIsInputFocused: (isFocused: boolean) => void;
  setContent: (newContent: string) => void;
  run: () => Promise<void>;
};

// トーク送信処理の実行、送信に伴う状態の管理をするフック
export const useTalkSubmit = ({
  token,
  content,
  talkRoomId,
  setIsInputFocused,
  setContent,
  run,
}: UseTalkSubmitArgs) => {
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isDisabled = !token || isSending || !content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisabled) return;

    const currentContent = content;

    setIsSending(true);
    setIsInputFocused(false);
    setContent('');
    setErrorMsg(null);

    try {
      await sendTalkMessage({
        currentContent,
        talkRoomId,
        token,
      });
      await run();
    } catch (e: unknown) {
      console.error(e);

      setContent(currentContent);
      setErrorMsg(getErrorMessage(e));
    } finally {
      setIsSending(false);
    }
  };

  return { handleSubmit, isSending, errorMsg, isDisabled };
};
