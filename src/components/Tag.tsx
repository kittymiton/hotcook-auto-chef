import { cn } from '@/lib/utils/cn';
import { primitives } from '@styles/primitives';
import { createShadow } from '@styles/tailwindTokens';

type Props = {
  keyword: string;
};

const tagStyles = {
  shape: 'flex items-center justify-center px-4 py-1 rounded-full bg-white/70',
  shadow: createShadow('soft', {
    base: primitives.beige.dark_tomato,
    highlight: primitives.beige.tomato,
    accent: primitives.beige.light,
  }),
} as const;

export const Tag = ({ keyword }: Props) => {
  const shadowClass = tagStyles.shadow.type;
  const shadowVars = tagStyles.shadow.vars;

  const combinedClass = cn(shadowClass, tagStyles.shape);

  return (
    <span className={combinedClass} style={shadowVars}>
      {keyword}
    </span>
  );
};
