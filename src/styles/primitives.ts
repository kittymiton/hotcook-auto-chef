export const primitives = {
  gray: {
    silver: '#f5f5f5',
    dusky: '#515151',
    solid: '#95908c',
    sky: '#F2F2F7',
    slate: '#6B7280',
    warm: '#EEE5E599', //60% opacity
    light: '#C5C5C5',
    dark: '#4D4D4D',
    dove: '#c6c6c64d', //30% opacity
    foggy: '#D9D9D9',
    soft: '#7C7C7C',
  },

  // TODO: 数値スケール版にする
  // gray: {
  //   50: '#F5F5F5', // silver
  //   100: '#F2F2F7', // sky
  //   200: '#EEE5E5', // warm
  //   300: '#C5C5C5', // light
  //   500: '#95908C', // solid
  //   600: '#6B7280', // slate
  //   700: '#515151', // dusky
  //   800: '#4D4D4D', // dark
  // },

  pink: {
    strawberry: '#f39696',
    salmon: '#ad200980',
    softPink: '#995858',
  },
  beige: {
    light: '#FDF3EA',
    dark: '#f4f0e8',
    skin: '#FBF5ED',
    salmon: '#fef4ef',
    coffee: '#df9a7680', //50% opacityfff0e880
    caramel: '#f1cdb4cc', //80% opacity
    oyster: '#fe962299',
    tomato: '#ff8e8e4d',
    pink: '#fff7f6',
    deep: '#716C68',
    cement: '#C0B7B0',
  },
  white: '#FFFFFF',
  charcoal: '#110000',
  taupe: '#7f2e00',
  black: '#000000',
  softGray: '#5D5D5D',
} as const;

export const gradients = {
  gray: {
    soft: 'linear-gradient(180deg, #b5b5b5 0%, #9f9e9e 63%, #8d8c8c 100%)',
    stone: 'linear-gradient(90deg, rgba(5, 5, 5, 0.34) 0%, #4f4f4f 100%)',
    steel:
      'linear-gradient(90deg, #b0b0b0 0%, #d1d1d1 23%, #c8c8c8 50%, #d1d1d1 81%, #b0b0b0 100%)',
    slate_light: 'linear-gradient(180deg, #9d9b99 0%, #7a7772 100%)',
    slate_deep: 'linear-gradient(180deg, #9D9B99 0%, #6C6965 100%)',
    ash: 'linear-gradient()',
  },

  beige: {
    soft: 'linear-gradient(90deg, #eee9e2 0%, #efe6dd 100%)',
    dark: 'linear-gradient(90deg, #f1ede6 0%, #efebe3 53%, #f1ede6 100%)',
    light: 'linear-gradient(360deg, #efe3d8 0%, #f2eCe3 100%)',
    oyster: 'linear-gradient(180deg, #BDB4AD 0%, #A0958E 64%, #9D9691 89%)',
  },

  pink: {
    soft: 'linear-gradient(180deg, #f6b5b5 0%, #e39f9f 69%, #e39f9f 89%)',
    orange: 'linear-gradient(90deg, #ffaaaa 0%, #ff7e7e 70%)',
  },
} as const;

// Figmaから取得した元値。createShadowの調整・比較用に残す
const figmaRawShadowCss = `
  --shadow-action: rgba(153, 76, 76, 0.2);
  --shadow-system: rgba(0, 0, 0, 0.25);

  --pukupuku-action:
    inset 2px -3px 2px var(--shadow-action),
    inset -1px -1px 2px var(--shadow-action);

  --pukupuku-system:
    inset 2px -3px 2px var(--shadow-system),
    inset -1px -1px 2px var(--shadow-system);

  --pukupuku:
    inset 2px -3px 2px rgba(0, 0, 0, 0.25),
    inset -1px -1px 2px rgba(0, 0, 0, 0.25);

  --pukupuku-action-base:
    inset -1px -1px 2px rgba(155, 176, 176, 0.3),
    inset 1px -1px 2px rgba(153, 76, 76, 0.5),
    1px 1px 2px rgba(119, 55, 55, 0.2);

  --pukupuku-action-soft:
    inset 1px 1px 2px rgba(255, 204, 204, 0.3),
    inset -1px -1px 2px rgba(153, 88, 88, 0.5),
    1px -1px 2px rgba(153, 88, 88, 0.2), -1px -1px 2px rgba(255, 204, 204, 0.9),
    -1px 1px 3px rgba(124, 124, 124, 0.35);

  --pukupuku-action-rich:
    inset -1px -1px 2px rgba(197, 197, 197, 0.3),
    inset 1px -1px 2px rgba(124, 124, 124, 0.5),
    1px 1px 2px rgba(153, 76, 76, 0.2), -1px -1px 2px rgba(153, 76, 76, 0.2),
    1px -1px 2px rgba(255, 176, 176, 0.9), -1px 1px 3px rgba(153, 76, 76, 0.9);

  --pukupuku-gray:
    --pukupuku-gray-suggest: inset -1px 1px 2px rgba(197, 197, 197, 0.3),
    inset 1px -1px 2px rgba(76, 76, 76, 0.5), 1px 1px 2px rgba(76, 76, 76, 0.2),
    1px 1px -1px rgba(218, 218, 218, 0.9);

  --pukupuku-gray-soft:
    inset -1px -1px 2px rgba(93, 93, 93, 0.5),
    -1px 1px 2px rgba(93, 93, 93, 0.2), -1px -1px 2px rgba(217, 217, 217, 0.9);
`;
