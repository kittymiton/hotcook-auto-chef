import {
  recipeElementMarginStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  point: string;
};

export const RecipePoint = ({ variant = 'default', point }: Props) => {
  const styleClass = recipeElementMarginStyles[variant];

  return <p className={styleClass}>{point}</p>;
};
