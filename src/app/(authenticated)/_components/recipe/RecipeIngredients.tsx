import {
  recipeSectionHeadingStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  ingredients: string[];
};

const ulStyles = {
  compact: 'mb-2',
  default: 'mb-4',
} as const satisfies Record<Variant, string>;

const listItemClass =
  'relative pl-6 before:absolute before:left-[0.2em] before:top-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-primary before:content-[""]';

export const RecipeIngredients = ({
  variant = 'default',
  ingredients,
}: Props) => {
  const ulClass = ulStyles[variant];
  const headingClass = recipeSectionHeadingStyles[variant];

  const ingredientsHeadingText = '材料（2人分）';

  const heading =
    variant === 'compact' ? (
      <h3 className={headingClass}>{ingredientsHeadingText}</h3>
    ) : (
      <h2 className={headingClass}>{ingredientsHeadingText}</h2>
    );

  return (
    <section>
      {heading}
      <ul className={ulClass}>
        {ingredients.map((item, i) => (
          <li key={i} className={listItemClass}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};
