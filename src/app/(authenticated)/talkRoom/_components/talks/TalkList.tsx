import type { ChatMessageList } from '@/lib/schema/chatSchema';
import { TalkItem } from '@authenticated/talkRoom/components/talks/TalkItem';

type Props = {
  talks: ChatMessageList;
};

export const TalkList = ({ talks }: Props) => {
  return (
    <div className="flex flex-col p-4 lg:p-6">
      {talks
        .slice()
        .reverse()
        .map((talk) => (
          <TalkItem key={talk.id} talk={talk} />
        ))}
    </div>
  );
};
