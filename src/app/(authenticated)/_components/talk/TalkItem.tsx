import { splitChefContent } from '@/lib/parser/splitChefContent';
import type { ChatItem } from '@/lib/schema/chatSchema';
import { RecipeCard } from '@authenticated/components/recipe/RecipeCard';
import { ChefTalk } from '@authenticated/components/talk/ChefTalk';
import { UserTalk } from '@authenticated/components/talk/UserTalk';

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
      {recipe && <RecipeCard recipe={recipe} />}
      {suffix && <ChefTalk content={suffix} />}
    </>
  );
};
