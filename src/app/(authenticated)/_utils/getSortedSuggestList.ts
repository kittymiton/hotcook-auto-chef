import type { SuggestCollection } from '@/lib/schema/suggestSchema';

export const getSortedSuggestList = (suggest?: SuggestCollection) => {
  const seed = suggest?.seed ?? [];
  const popular = suggest?.popular ?? [];
  const recent = suggest?.recent ?? [];

  const suggestList = [...seed, ...popular, ...recent];
  const ORDER_PRIORITY = ['seed', 'popular', 'recent'];
  const sortedSuggestList = suggestList.sort(
    (a, b) => ORDER_PRIORITY.indexOf(a.label) - ORDER_PRIORITY.indexOf(b.label)
  );

  return { sortedSuggestList };
};
