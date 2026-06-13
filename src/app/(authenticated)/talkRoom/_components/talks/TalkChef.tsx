import { Surface } from '../../../../../components/ui/Surface';

type Props = {
  content: string;
};

export const TalkChef = ({ content }: Props) => {
  return (
    <Surface type="chef">
      <p className="whitespace-pre-line">{content}</p>
    </Surface>
  );
};
