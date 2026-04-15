import type { SuggestItem } from '@/lib/schema/suggestSchema';

type SuggestProps = {
  item: SuggestItem;
  onKeywordSelct: (keyword: string) => void;
};

export const Suggest = ({ item, onKeywordSelct }: SuggestProps) => {
  return (
    <button
      type="button"
      onPointerDown={() => onKeywordSelct(item.keyword)}
      className={item.label === 'seed' ? 'bg-gray-100' : ''}
    >
      {item.keyword}
    </button>
  );
};
