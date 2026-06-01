import { TalkSurface } from '@authenticated/talkRoom/components/talks/TalkSurface';

type Props = {
  content: string;
};

// contentをTalkSurfaceのchildrenとして渡す薄いラッパー
export const TalkUser = ({ content }: Props) => {
  return (
    <TalkSurface type="user">
      <p className="whitespace-pre-line">{content}</p>
    </TalkSurface>
  );
};
