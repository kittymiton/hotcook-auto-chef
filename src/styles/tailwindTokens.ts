import { gradients, primitives } from '../styles/primitives';

export const toRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const toRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// Hexを10倍暗くする関数
const darkenSingleHex = (hex: string): string => {
  const rgbStr = toRgb(hex);
  const [r, g, b] = rgbStr.split(',').map(Number);

  const newR = Math.max(0, r - 10)
    .toString(16)
    .padStart(2, '0');
  const newG = Math.max(0, g - 10)
    .toString(16)
    .padStart(2, '0');
  const newB = Math.max(0, b - 10)
    .toString(16)
    .padStart(2, '0');

  return `#${newR}${newG}${newB}`;
};

// colorを1段濃くする関数
export const createActiveColor = (colorStr: string): string => {
  return colorStr.replace(/#[0-9a-fA-F]{6}/g, (match) =>
    darkenSingleHex(match)
  );
};

/* ===== Shadow（Tailwind構造込みで影を合成） ===== */

// 影のCSS変数を生成するために使う色セットの型
type ShadowColors = {
  base: string;
  highlight: string;
  accent?: string;
};

// createShadowに渡す型
type ShadowType = keyof typeof shadowMap;

// createShadowが返すオブジェクトの型
type CreateShadowConfig = {
  type: (typeof shadowMap)[ShadowType]; // Tailwindのクラス名
  vars: React.CSSProperties;
};

// keyはShadowType、valueはclassNameに付けるTailwindクラス
const shadowMap = {
  hard: 'shadow-hard',
  'hard-deep': 'shadow-hard-deep',
  soft: 'shadow-soft',
  'soft-glossy': 'shadow-soft-glossy',
  'rich-floating': 'shadow-rich-floating',
  'rich-grounded': 'shadow-rich-grounded',
} as const;

// Tailwind configに登録する色・グラデーション・影の形
// NOTE: 「影type」「影色vars」で1セット
// 第1引数:影の形(type)はTailwind configにshadowtypeとして登録する
// 第2引数:影の色(vars)はcreateShadowにprimitivesの色を渡す
export const createShadow = (
  type: ShadowType,
  colors: ShadowColors
): CreateShadowConfig => {
  // Hexで登録されたprimitivesの色に透明度を付けるため、RGB形式に変換する
  const baseRgb = toRgb(colors.base); // 影のベース色
  const highlightRgb = toRgb(colors.highlight); // 影のハイライト色
  const accentRgb = toRgb(colors.accent ?? colors.base); // 影のアクセント色

  switch (type) {
    case 'hard':
      return {
        type: shadowMap[type],
        vars: {
          '--shadow-depth': `inset 2px -3px 2px rgba(${baseRgb}, 0.25)`, // 内側の沈み込み（素材の厚み）
          '--shadow-highlight': `inset -1px -1px 2px rgba(${highlightRgb}, 0.25)`, // 内側ハイライト（素材の柔らかさ・反射）
        } as React.CSSProperties, // カスタムCSS変数(--shadow-depth)をReactのstyleに渡す
      };

    case 'hard-deep':
      return {
        type: shadowMap[type],
        vars: {
          '--shadow-depth': `inset 2px -3px 2px rgba(${baseRgb}, 0.5)`,
          '--shadow-highlight': `inset -1px -1px 2px rgba(${highlightRgb}, 0.3)`,
        } as React.CSSProperties,
      };

    case 'soft':
      return {
        type: shadowMap[type],
        vars: {
          '--shadow-ambient': `inset -1px -1px 2px rgba(${baseRgb}, 0.3)`, // 内側にじみ
          '--shadow-highlight': `inset 1px -1px 2px rgba(${highlightRgb}, 0.5)`,
          '--shadow-ground': `1px 1px 2px rgba(${accentRgb}, 0.2)`, // 接地影（柔らか）
        } as React.CSSProperties,
      };

    case 'soft-glossy':
      return {
        type: `shadow-${type}`,
        vars: {
          '--shadow-ambient': `inset -1px -1px 2px rgba(${baseRgb}, 0.3)`,
          '--shadow-highlight': `inset 1px -1px 2px rgba(${highlightRgb}, 0.5)`,
          '--shadow-edge': `-1px -1px -1px rgba(${highlightRgb}, 0.9)`, // 表面コーティング（パキッとした硬質な輪郭）
          '--shadow-ground': `1px 1px 2px rgba(${accentRgb}, 0.2)`,
        } as React.CSSProperties,
      };

    case 'rich-floating':
      return {
        type: shadowMap[type],
        vars: {
          '--shadow-ambient': `inset -1px -1px 2px rgba(${baseRgb}, 0.3)`,
          '--shadow-highlight': `inset 1px -1px 2px rgba(${highlightRgb}, 0.5)`,
          '--shadow-edge': `-1px -1px 2px rgba(${baseRgb}, 0.9)`,
          '--shadow-reflect': `-1px 1px 3px rgba(${accentRgb}, 0.35)`, // 直下の反射光（ボタンを背景から切り離す）
          '--shadow-ambient-out': `-1px -1px 2px rgba(${highlightRgb}, 0.2)`, // 外側のにじみ
        } as React.CSSProperties,
      };

    case 'rich-grounded':
      return {
        type: shadowMap[type],
        vars: {
          '--shadow-ambient': `inset -1px -1px 2px rgba(${baseRgb}, 0.3)`,
          '--shadow-highlight': `inset 1px -1px 2px rgba(${highlightRgb}, 0.5)`,
          '--shadow-edge': `-1px -1px 2px rgba(${accentRgb}, 0.9)`,
          '--shadow-reflect': `-1px 1px 3px rgba(${highlightRgb}, 0.9)`,
          '--shadow-ambient-out': `-1px -1px 2px rgba(${accentRgb}, 0.2)`,
          '--shadow-ground': `1px 1px 2px rgba(${accentRgb}, 0.2)`,
        } as React.CSSProperties,
      };
  }
};

// 1層に整えてconfigに渡す
// 役割色（よく使う場所をエイリアスとして固定登録）重複OK
export const tailwindColors = {
  white: primitives.white,
  primary: primitives.charcoal,

  'beige-light': primitives.beige.light,
  'beige-cement': primitives.beige.cement,
  'gray-dusky': primitives.gray.dusky,
  'beige-pink': primitives.beige.pink,
  'beige-salmon': primitives.beige.salmon,
  'beige-tomato': primitives.beige.tomato,
  'beige-skin': primitives.beige.skin, // アプリ全体

  'gray-warm': primitives.gray.warm,

  taupe: primitives.taupe,
  'beige-dark': primitives.beige.dark,
} as const;

export const tailwindGradients = {
  'beige-soft': gradients.beige.soft,
  'beige-light': gradients.beige.light, // header
  'beige-dark': gradients.beige.dark, // アプリ背景
  'beige-oyster': gradients.beige.oyster,
  'beige-oyster-active': createActiveColor(gradients.beige.oyster),
  'gray-soft': gradients.gray.soft,
  'gray-soft-active': createActiveColor(gradients.gray.soft),
  'gray-slate-deep': gradients.gray.slate_deep,
  'gray-steel': gradients.gray.steel,
  'gray-slate-light': gradients.gray.slate_light,
  'pink-soft': gradients.pink.soft,
  'pink-soft-active': createActiveColor(gradients.pink.soft),
} as const;
