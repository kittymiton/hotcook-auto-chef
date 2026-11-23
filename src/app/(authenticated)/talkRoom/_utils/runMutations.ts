export function runMutations(
  // TODO: JestでrunMutationsのキャッシュキーと再検証処理をテストする。トーク送信→ 送信完了→ ページ再読み込みせずに新しいトーク表示を確認。
  // TODO: Playwrightで送信後のトーク表示を確認する

  // mutate関数と再取得対象のURLを引数で受け取る
  mutate: (key: [string, string]) => Promise<unknown>,
  talkRoomUrl: string,
  recipeListUrl: string,
  userId: string | undefined
) {
  return async () => {
    if (!userId) return;
    // urlとuserIdを組み合わせたキャッシュkeyでmutateを実行
    await mutate([talkRoomUrl, userId]);
    await mutate([recipeListUrl, userId]);
    // NOTE: Promise.allで並列化すると体感速度が悪化のため直列実行
  };
}
