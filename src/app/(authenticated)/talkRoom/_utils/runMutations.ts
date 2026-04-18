export function runMutations(
  mutate: (key: string) => Promise<unknown>,
  url_main?: string,
  url_aside?: string
) {
  return async () => {
    if (url_main) await mutate(url_main);
    if (url_aside) await mutate(url_aside);
    // NOTE: Promise.allで並列化すると体感速度が悪化のため直列実行
  };
}
