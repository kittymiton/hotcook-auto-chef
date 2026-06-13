import { Surface } from '../../../../../components/ui/Surface';

type Props = {
  content: string;
};

// contentをSurfaceのchildrenとして渡す薄いラッパー
export const TalkUser = ({ content }: Props) => {
  return (
    <Surface type="user">
      <p className="whitespace-pre-line">{content}</p>
    </Surface>
  );
};
