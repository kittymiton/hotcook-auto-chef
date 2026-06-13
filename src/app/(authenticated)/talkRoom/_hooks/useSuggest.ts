import { suggestCollectionSchema } from '@/lib/schema/suggestSchema';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

type UseSuggestArgs = {
  suggestUrl: string;
  isInputFocused: boolean;
};

// サジェストデータの取得実行、取得タイミングの制御をするフック
export const useSuggest = ({ suggestUrl, isInputFocused }: UseSuggestArgs) => {
  const swrKey = isInputFocused ? suggestUrl : null;
  // NOTE: suggestは初回フォーカス時のみ取得、その後はキャッシュ利用

  const { data: suggest } = useAuthedSWR(swrKey, suggestCollectionSchema);
  // TODO: safe.parse対応 / useSuggestフック化

  return { suggest };
};
