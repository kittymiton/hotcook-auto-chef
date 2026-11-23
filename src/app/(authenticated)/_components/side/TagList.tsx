import { Button } from '../../../../components/ui/Button';

type Props = {
  tags: string[];
};

// リンク付きのタグを表示
export const TagList = ({ tags }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm">キーワード</h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Button
              href={`/recipes/?tag=${encodeURIComponent(tag)}`}
              variant="side-recipe-item"
              className="w-fit"
            >
              <span># {tag}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
