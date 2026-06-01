import type { SuggestItem } from '@/lib/schema/suggestSchema';

type Props = {
  item: SuggestItem;
  onKeywordSelect: (keyword: string) => void;
};

export const Suggest = ({ item, onKeywordSelect }: Props) => {
  return (
    <button
      type="button"
      onPointerDown={() => onKeywordSelect(item.keyword)}
      className={item.label === 'seed' ? 'bg-gray-100' : ''}
    >
      {item.keyword}
    </button>
  );
};
