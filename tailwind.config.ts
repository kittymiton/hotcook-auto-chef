import type { Config } from 'tailwindcss';
import { tailwindColors, tailwindGradients } from './src/styles/tailwindTokens';

// tailwindは@エイリアスを認識しないため、最後の出力はデフォルトエクスポート
export const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // 色素材
      colors: tailwindColors,
      backgroundImage: tailwindGradients,

      // 影
      boxShadow: {
        // 2層：内側ボタンの厚み立体感のベース（押し込み強い硬い系）
        hard: [
          // ①素材 → ②表面 → ③環境 → ④接地
          'var(--shadow-depth)', // ①内部ベース（素材）
          'var(--shadow-highlight)', // ①内部ベース（素材）
        ].join(', '),

        'hard-deep': ['var(--shadow-depth)', 'var(--shadow-highlight)'].join(
          ', '
        ),

        // 3層：浮遊感を追加
        soft: [
          'var(--shadow-ambient)',
          'var(--shadow-highlight)',
          'var(--shadow-ground)', // ④接地
        ].join(', '),

        // 4層：光沢感を追加
        'soft-glossy': [
          'var(--shadow-ambient)',
          'var(--shadow-highlight)',
          'var(--shadow-edge)', // ②表面（主光）
          'var(--shadow-ground)',
        ].join(', '),

        // 5層：二段構えのハイライトで浮遊感を追加
        'rich-floating': [
          'var(--shadow-ambient)',
          'var(--shadow-highlight)',
          'var(--shadow-edge)',
          'var(--shadow-reflect)', // ③環境光（回り込み）
          'var(--shadow-ambient-out)', // ③環境光（回り込み）
        ].join(', '),

        // 6層：接地影で安定感を追加
        'rich-grounded': [
          'var(--shadow-ambient)',
          'var(--shadow-highlight)',
          'var(--shadow-edge)',
          'var(--shadow-reflect)',
          'var(--shadow-ambient-out)',
          'var(--shadow-ground)',
        ].join(', '),
      },
    },
    plugins: [],
  },
};

export default config;
