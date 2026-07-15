type Variant = keyof typeof listStyles;
type Props = {
  variant?: Variant;
  ingredients: string[];
};

const listStyles = {
  compact: 'mb-2',
  default: 'mb-4',
} as const;

const listItemStyles =
  'relative pl-6 before:absolute before:left-[0.2em] before:top-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-primary before:content-[""]';

export const RecipeIngredients = ({ variant, ingredients }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = listStyles[styleKey];

  if (styleKey === 'compact') {
    return (
      <div className="mb-1">
        <h3>
          <strong>材料（2人分）:</strong>
        </h3>
        <ul className={styleClass}>
          {ingredients.map((item, i) => (
            <li key={i} className={listItemStyles}>
              {/* TODO: JSON構造見直し：英語keyに変更 / keyにidを持たせkey.idの形にする */}
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-1 text-lg font-semibold">材料（2人分）</h2>
      <ul className={styleClass}>
        {ingredients.map((item, i) => (
          <li key={i} className={listItemStyles}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
};
