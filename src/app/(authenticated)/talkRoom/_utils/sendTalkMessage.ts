import { fetcher } from '@/lib/apiClient/fetcher';

type SendParams = {
  currentContent: string;
  talkRoomId: number;
  token: string;
};

export const sendTalkMessage = async ({
  currentContent,
  talkRoomId,
  token,
}: SendParams) => {
  const body = {
    content: currentContent,
    talkRoomId,
  };

  await fetcher('/api/talks', {
    method: 'POST',
    token,
    body,
  });
};
