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

  const { content, recipeSnapshot, afterRecipeContent } = talk;

  return (
    <>
      {content && <TalkChef content={content} />}
      {recipeSnapshot && <TalkRecipe recipe={recipeSnapshot} />}
      {afterRecipeContent && <TalkChef content={afterRecipeContent} />}
    </>
  );
};
