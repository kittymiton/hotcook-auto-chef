import { suggestCollectionSchema } from '@/lib/schema/suggestSchema';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

type UseSuggestArgs = {
  url_suggest: string;
  isInputFocused: boolean;
};

export const useSuggest = ({ url_suggest, isInputFocused }: UseSuggestArgs) => {
  const swrKey = isInputFocused ? url_suggest : null;
  // NOTE: suggestは初回フォーカス時のみ取得、その後はキャッシュ利用

  const { data: suggest } = useAuthedSWR(swrKey, suggestCollectionSchema);
  // TODO: safe.parse対応 / useSuggestフック化

  return { suggest };
};
