import { TalkSurface } from '@authenticated/talkRoom/components/talks/TalkSurface';

type Props = {
  content: string;
};

export const TalkChef = ({ content }: Props) => {
  return (
    <TalkSurface type="chef">
      <p className="whitespace-pre-line">{content}</p>
    </TalkSurface>
  );
};
