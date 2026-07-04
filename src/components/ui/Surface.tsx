import { cn } from '@/lib/utils/cn';
import { primitives } from '@styles/primitives';
import { createShadow } from '@styles/tailwindTokens';

type SurfaceVariant = keyof typeof surfaceStyles;
type Props = {
  variant: SurfaceVariant;
  children?: React.ReactNode;
};

const baseClassName = 'mb-6 rounded-xl px-4 pb-4 pt-3';

// Prettierの並び替えが効きにくいので、追加時は手動で順序を整える
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

  'recipe-detail': {
    shape: 'mx-auto w-full',
    background: 'bg-beige-tomato',
    shadow: createShadow('hard', {
      base: primitives.gray.dark,
      highlight: primitives.gray.dove,
    }),
  },

  'recipe-list-item': {
    shape: 'mx-auto w-full',
    background: 'bg-beige-tomato',
    hover: 'hover:shadow-soft-glossy',
    transition: 'transition-all duration-200',
    shadow: createShadow('soft-glossy', {
      base: primitives.pink.softPink,
      highlight: primitives.pink.strawberry,
      accent: primitives.gray.dark,
    }),
    shadowOnlyOnHover: true, // 通常時の影を消す
  },
} as const;

// 外枠を提供
export const Surface = ({ variant, children }: Props) => {
  const config = surfaceStyles[variant];

  const isShadowOnlyOnHover =
    'shadowOnlyOnHover' in config && config.shadowOnlyOnHover;
  const shadowClass = isShadowOnlyOnHover ? 'shadow-none' : config.shadow?.type;

  const hoverClass = 'hover' in config && config.hover;
  const transitionClass = 'transition' in config && config.transition;

  return (
    <div
      className={cn(
        baseClassName,
        config.shape,
        config.background,
        hoverClass,
        shadowClass,
        transitionClass
      )}
      style={{
        ...(config.shadow?.vars ?? {}),
      }}
    >
      {children}
    </div>
  );
};
