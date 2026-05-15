import type { Config } from 'tailwindcss';
import { semantics } from './src/styles/semantics';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    //色素材
    extend: {
      backgroundImage: {
        ...semantics.panelGradients,
      },
      colors: {
        ...semantics.panelColors,
        ...semantics.textColors,
      },

      text: {},

      borderRadius: {},

      //影
      boxShadow: {
        // 素材 → 表面 → 環境 → 接地
        // 2層：内側ボタンの厚み立体感のベース（押し込み強い硬い系）
        hard: [
          // .shadow-hardクラス名
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
