export function runMutations(
  // mutate関数と再取得対象のURLを引数で受け取る
  mutate: (key: [string, string]) => Promise<unknown>,
  userId: string | undefined,
  url_main?: string,
  url_aside?: string
) {
  return async () => {
    if (!userId) return;
    // urlとuserIdを組み合わせたキャッシュkeyでmutateを実行
    if (url_main) await mutate([url_main, userId]);
    if (url_aside) await mutate([url_aside, userId]);
    // NOTE: Promise.allで並列化すると体感速度が悪化のため直列実行
  };
}
