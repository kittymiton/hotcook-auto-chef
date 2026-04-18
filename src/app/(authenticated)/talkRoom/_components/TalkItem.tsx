import { splitChefContent } from '@/lib/parser/splitChefContent';
import type { ChatItem } from '@/lib/schema/chatSchema';
import { ChefTalk } from '@authenticated/talkRoom/components/ChefTalk';
import { ChefTalkRecipe } from '@authenticated/talkRoom/components/ChefTalkRecipe';
import { UserTalk } from '@authenticated/talkRoom/components/UserTalk';

type TalkItemProps = {
  talk: ChatItem;
};

export const TalkItem = ({ talk }: TalkItemProps) => {
  const isChef = talk.sender === 'CHEF';
  if (!isChef) return <UserTalk content={talk.content} />;

  const { prefix, recipe, suffix } = splitChefContent(talk.content);

  return (
    <>
      {prefix && <ChefTalk content={prefix} />}
      {recipe && <ChefTalkRecipe recipe={recipe} />}
      {suffix && <ChefTalk content={suffix} />}
    </>
  );
};
