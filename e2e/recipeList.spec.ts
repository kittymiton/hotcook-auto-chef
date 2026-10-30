import { expect, test } from '@playwright/test';

// APIの返答を準備 → ブラウザで画面を開く → 表示を検証する
// 準備：ログイン済み状態を準備　APIが空配列を返す状態を作る
//1. ログイン済みでRecipeListを開ける
//2. 操作：RecipeListページへ移動する
//3. 検証：「レシピがまだありません」が表示される

// test;
// await page.route('/api/recipes', async (route) => {
//   await route.fulfill({
//     status: 200,
//     contentType: 'application/json',
//     body: JSON.stringify([]),
//   });
//   await page.goto('/recipes');
// });
//  page.route()ページからの通信を捕まえて、route.fulfill() で空配列 [] を返すように設定する
//  await page.goto() で RecipeListページ を開く

test('get started link', async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error('E2Eのログイン情報が設定されていません');
  }

  await page.goto('http://localhost:3000/login');
  await page.getByLabel('メールアドレス').fill(email);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();

  await expect(page).toHaveURL(/\/talkRoom\/\d+$/);
});
