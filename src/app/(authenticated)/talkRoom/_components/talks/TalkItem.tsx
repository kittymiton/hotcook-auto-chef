import { splitChefContent } from '@/lib/parser/splitChefContent';
import type { ChatItem } from '@/lib/schema/chatSchema';
import { TalkChef } from '@authenticated/talkRoom/components/talks/TalkChef';
import { TalkRecipe } from '@authenticated/talkRoom/components/talks/TalkRecipe';
import { TalkUser } from '@authenticated/talkRoom/components/talks/TalkUser';

type Props = {
  talk: ChatItem;
};

export const TalkItem = ({ talk }: Props) => {
  const isChef = talk.sender === 'CHEF';
  if (!isChef) return <TalkUser content={talk.content} />;

  const { prefix, recipe, suffix } = splitChefContent(talk.content);

  return (
    <>
      {prefix && <TalkChef content={prefix} />}
      {recipe && <TalkRecipe recipe={recipe} />}
      {suffix && <TalkChef content={suffix} />}
    </>
  );
};
