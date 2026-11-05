import { expect, test } from '@playwright/test';

test.describe('RecipeList', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
      throw new Error('E2Eのログイン情報が設定されていません');
    }

    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill(email);
    await page.getByLabel('パスワード').fill(password);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();

    await expect(page).toHaveURL(/\/talkRoom\/\d+$/, { timeout: 15000 });
    // TODO: ログイン回数が増えるため、E2Eの本数が増えてきたタイミングでstorageStateに切り替え
  });

  // 正常系：0件
  test('0件表示', async ({ page }) => {
    await page.route('**/api/recipes', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/recipes');

    await expect(
      page.getByText(
        'レシピがまだありません。会話してオリジナルのレシピを作ってみましょう！'
      )
    ).toBeVisible();
  });

  // 正常系
  test('データあり', async ({ page }) => {
    await page.route('**/api/recipes', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            title: 'TestTitle',
            point: 'TestPoint',
            talkRoomId: 9,
            tags: ['TestTag1'],
          },
        ]),
      });
    });
    await page.goto('/recipes');

    await expect(
      page.getByRole('main').getByRole('link', { name: 'TestTitle' })
    ).toBeVisible();
  });

  // Loading
  test('Loading', async ({ page }) => {
    await page.route('**/api/recipes', async (route) => {
      await new Promise(() => {});
    });
    await page.goto('/recipes');
    await expect(
      page.getByRole('main').getByText('ローディング中')
    ).toBeVisible();
  });

  // 異常系
  test('API取得失敗', async ({ page }) => {
    await page.route('**/api/recipes', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }),
      });
    });
    await page.goto('/recipes');

    await expect(
      page.getByRole('main').getByText('サーバーエラーが発生しました')
    ).toBeVisible();
  });
});
