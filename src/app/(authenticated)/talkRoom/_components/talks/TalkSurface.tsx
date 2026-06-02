import { cn } from '@/lib/utils/cn';
import { primitives } from '@styles/primitives';
import { createShadow } from '@styles/tailwindTokens';

type SurfaceType = keyof typeof surfaceStyles;
type Props = {
  type: SurfaceType;
  children: React.ReactNode;
};

// NOTE: typeごとの差分を閉じるためTailwindクラスをconfigに置く。
// Prettierの並び替えが効きにくいので、追加時は手動で順序を整える。
const surfaceStyles = {
  chef: {
    shape: 'mr-auto w-fit max-w-[680px]',
    background: 'bg-beige-pink',
    shadow: createShadow('hard', {
      base: primitives.gray.dark,
      highlight: primitives.gray.dove,
    }),
  },
  user: {
    shape: 'ml-auto w-fit max-w-[70%]',
    background: 'bg-beige-salmon',
    shadow: createShadow('hard', {
      base: primitives.gray.dark,
      highlight: primitives.gray.dove,
    }),
  },
  recipe: {
    shape: 'mr-auto w-full max-w-[720px]',
    background: 'bg-beige-tomato',
    shadow: createShadow('hard', {
      base: primitives.gray.dark,
      highlight: primitives.gray.dove,
    }),
  },
} as const;

const baseClassName = 'mb-6 rounded-xl px-4 pb-4 pt-3';

// トーク外枠だけを提供し、中身の種類は関知しない
export const TalkSurface = ({ type, children }: Props) => {
  // typeごとの箱の差分
  const config = surfaceStyles[type];

  return (
    <div
      className={cn(
        baseClassName,
        config.shape,
        config.background,
        config.shadow?.type
      )}
      style={{
        ...(config.shadow?.vars ?? {}),
      }}
    >
      {children}
    </div>
  );
};
