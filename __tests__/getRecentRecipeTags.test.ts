import { RecipeSummaryList } from '@/lib/schema/recipeSchema';
import { getRecentRecipeTags } from '@authenticated/recipes/utils/getRecentRecipeTags';

describe('getRecentRecipeTags', () => {
  it('重複を含まないタグ配列を返す', () => {
    const recipes = [
      {
        id: 2,
        title: '豆乳とチンゲンサイのささみクリーム煮',
        point:
          '豆乳のまろやかさがチンゲンサイとささみとよく合い、優しい味わいの一品に。',
        talkRoomId: 1,
        tags: ['豆乳', 'チンゲンサイ', 'ささみ'],
      },
      {
        id: 1,
        title: 'チンゲンサイときのこのガーリック炒め',
        point:
          'ガーリックの風味がきのことチンゲンサイに絡まり、食欲をそそります。',
        talkRoomId: 1,
        tags: ['きのこ', 'チンゲンサイ'],
      },
    ];
    // TODO: title・pointなどのテストデータをbuildRecipe等のヘルパーで簡潔にする

    const result = getRecentRecipeTags(recipes);
    expect(result).toEqual(['豆乳', 'チンゲンサイ', 'ささみ', 'きのこ']);
  });

  it('最大8件のタグ配列を返す', () => {
    const recipes = [
      {
        id: 3,
        title: '豆乳とチンゲンサイのささみクリーム煮',
        point:
          '豆乳のまろやかさがチンゲンサイとささみとよく合い、優しい味わいの一品に。',
        talkRoomId: 1,
        tags: ['豆乳', 'チンゲンサイ', 'ささみ'],
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

    const result = getRecentRecipeTags(recipes);
    expect(result).toEqual([
      '豆乳',
      'チンゲンサイ',
      'ささみ',
      '牛肉',
      '豆腐',
      'すき焼き',
      'ピリ辛',
      'こんにゃく',
    ]);
  });

  it('タグが8件未満の場合、すべてのタグを順番どおりに返す', () => {
    const recipes = [
      {
        id: 1,
        title: 'こんにゃくとピーマンのピリ辛炒め',
        point: '豆板醤のピリ辛がこんにゃくに絡んでおいしいです。',
        talkRoomId: 1,
        tags: ['ピリ辛', 'こんにゃく', 'ピーマン'],
      },
    ];

    const result = getRecentRecipeTags(recipes);
    expect(result).toEqual(['ピリ辛', 'こんにゃく', 'ピーマン']);
  });

  it('レシピが0件でタグが0件の場合、空配列を返す', () => {
    const recipes: RecipeSummaryList = [];

    const result = getRecentRecipeTags(recipes);
    expect(result).toEqual([]);
  });

  it('レシピは存在するがタグが0件の場合、空配列を返す', () => {
    const recipes = [
      {
        id: 1,
        title: 'こんにゃくとピーマンのピリ辛炒め',
        point: '豆板醤のピリ辛がこんにゃくに絡んでおいしいです。',
        talkRoomId: 1,
        tags: [],
      },
    ];

    const result = getRecentRecipeTags(recipes);
    expect(result).toEqual([]);
  });
});
