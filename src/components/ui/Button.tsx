import { cn } from '@/lib/utils/cn';
import { primitives } from '@styles/primitives';
import { createShadow } from '@styles/tailwindTokens';
import Link from 'next/link';

// ボタン/リンクの共通処理
type Variant = keyof typeof buttonStyles;
type Props = {
  variant: Variant;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

const baseClassName =
  'flex items-center rounded-full transition-all duration-200 transform';
const beigeBase = {
  background: 'bg-beige-light',
  text: 'text-primary',
};
const grayBase = {
  background: 'bg-gray-slate-deep',
  text: 'text-white',
};
const headerBase = {
  shape:
    'justify-center w-[104px] h-[35px] text-[14px] active:translate-y-[2px] pb-[2px]', // pb-影の厚み分
  hover: 'hover:brightness-110',
};
const sideBase = {
  shape: 'gap-4 w-[200px] h-[48px] pl-8 active:translate-y-[2px]',
  hover: 'hover:brightness-110 active:shadow-none',
  text: 'text-white',
};

const buttonStyles = {
  'header-signup': {
    ...beigeBase,
    ...headerBase,
    shadow: createShadow('hard', {
      base: primitives.black,
      highlight: primitives.black,
    }),
  },
  'header-login': {
    ...grayBase,
    ...headerBase,
    shadow: createShadow('hard-deep', {
      base: primitives.gray.dark,
      highlight: primitives.gray.light,
    }),
  },
  'header-logout': {
    ...grayBase,
    ...headerBase,
    shadow: createShadow('hard', {
      base: primitives.black,
      highlight: primitives.black,
    }),
  },

  'header-icon': {
    background: 'bg-gray-dusky',
    text: 'text-white',
    hover: 'hover:brightness-110',
    shape: 'justify-center w-10 h-10 p-0 shadow-none text-[14px]',
    shadow: undefined,
  },

  'side-chat': {
    background: 'bg-pink-soft active:bg-pink-soft-active',
    ...sideBase,
    shadow: createShadow('soft', {
      base: primitives.pink.softPink,
      highlight: primitives.gray.soft,
    }),
  },

  'side-mypage': {
    background: 'bg-gray-soft active:bg-gray-soft-active',
    ...sideBase,
    shadow: createShadow('soft', {
      base: primitives.softGray,
      highlight: primitives.softGray,
      accent: primitives.gray.foggy,
    }),
  },

  'side-my-recipes': {
    background: 'bg-beige-oyster active:bg-beige-oyster-active',
    ...sideBase,
    shadow: createShadow('soft', {
      base: primitives.beige.deep,
      highlight: primitives.beige.deep,
    }),
  },

  'side-recipe-item': {
    ...beigeBase,
    hover: 'hover:bg-none hover:bg-beige-cement',
    shape: 'justify-start w-full h-[40px] text-[14px] leading-[1.4] pl-8',
    shadow: createShadow('hard', {
      base: primitives.black,
      highlight: primitives.black,
    }),
  },

  'side-all-recipe': {
    background: 'bg-transparent',
    text: 'text-primary',
    hover: 'hover:shadow-hard',
    shape: 'w-full h-[40px] text-[14px] pl-8',
    shadow: createShadow('hard', {
      base: primitives.black,
      highlight: primitives.black,
    }),
    shadowOnHover: true, // 通常時は影なし、hover時のみ影を出す
  },
} as const;

export const Button = ({
  variant,
  onClick,
  href,
  children,
  ariaLabel,
}: Props) => {
  const config = buttonStyles[variant];

  const shadowOnHover = 'shadowOnHover' in config && config.shadowOnHover;
  const shadowClass = shadowOnHover ? 'shadow-none' : config.shadow?.type;

  const combinedClass = cn(
    baseClassName,
    config.background,
    config.shape,
    config.text,
    config.hover,
    shadowClass
  );

  const shadowStyle = {
    ...(config.shadow?.vars ?? {}),
  };

  // 見た目は全部ボタン様式のため、中身をLink or buttonにする
  if (href) {
    return (
      <Link
        href={href}
        className={combinedClass}
        style={shadowStyle}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={combinedClass}
      style={shadowStyle}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
