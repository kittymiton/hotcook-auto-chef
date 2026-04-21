import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { sendTalkMessage } from '@authenticated/talkRoom/utils/sendTalkMessage';
import { useState } from 'react';

type UseTalkSubmit = {
  token: string | null;
  content: string;
  talkRoomId: number;
  setIsInputFocused: (isFocused: boolean) => void;
  setContent: (newContent: string) => void;
  run: () => Promise<void>;
  errorText: Record<string, string>;
};

export const useTalkSubmit = ({
  token,
  content,
  talkRoomId,
  setIsInputFocused,
  setContent,
  run,
  errorText,
}: UseTalkSubmit) => {
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
    } catch (e) {
      console.error(e);

      const remind = getErrorMessage(e);

      setContent(currentContent);
      setErrorMsg(remind);
    } finally {
      setIsSending(false);
    }
  };

  return { handleSubmit, isSending, errorMsg, isDisabled };
};
