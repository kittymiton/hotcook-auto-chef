import { filterRecipesByTag } from '@authenticated/recipes/utils/filterRecipesByTag';

describe('filterRecipesByTag', () => {
  const recipes = [
    {
      id: 4,
      title: '豆乳とチンゲンサイのささみクリーム煮',
      point:
        '豆乳のまろやかさがチンゲンサイとささみとよく合い、優しい味わいの一品に。',
      talkRoomId: 1,
      tags: ['豆乳', 'チンゲンサイ', 'ささみ'],
    },
    {
      id: 3,
      title: 'チンゲンサイときのこのガーリック炒め',
      point:
        'ガーリックの風味がきのことチンゲンサイに絡まり、食欲をそそります。',
      talkRoomId: 1,
      tags: ['きのこ', 'チンゲンサイ'],
    },
    {
      id: 2,
      title: '焼き豆腐のすき焼き風',
      point: '牛肉の旨味が野菜と豆腐に染み込み、贅沢な味わいになります。',
      talkRoomId: 1,
      tags: ['牛肉', '豆腐', 'すき焼き'],
    },
    {
      id: 1,
      title: 'こんにゃくとピーマンのピリ辛炒め',
      point: '豆板醤のピリ辛がこんにゃくに絡んでおいしいです。',
      talkRoomId: 1,
      tags: ['ピリ辛', 'こんにゃく', 'ピーマン'],
    },
  ];

  it('タグに完全一致するレシピを全件返す', () => {
    const tag = 'チンゲンサイ';

    const result = filterRecipesByTag(recipes, tag);
    expect(result).toEqual([recipes[0], recipes[1]]);
  });

  it('タグが未指定の場合、レシピを全件返す', () => {
    // URLにtagパラメータがない場合
    const tag = null;

    const result = filterRecipesByTag(recipes, tag);
    expect(result).toEqual(recipes);
  });

  it('タグが空文字の場合、レシピを全件返す', () => {
    // URLにtagパラメータはあるが、検索条件が空の場合
    const tag = '';

    const result = filterRecipesByTag(recipes, tag);
    expect(result).toEqual(recipes);
  });

  it('タグに一致するレシピがない場合、空配列を返す', () => {
    const tag = '存在しないタグ';

    const result = filterRecipesByTag(recipes, tag);
    expect(result).toEqual([]);
  });

  it('タグが部分一致するだけの場合、空配列を返す', () => {
    const tag = 'チンゲン';

    const result = filterRecipesByTag(recipes, tag);
    expect(result).toEqual([]);
  });
});
