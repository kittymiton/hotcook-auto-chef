import {
  recipeElementMarginStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  point: string;
};

export const RecipePoint = ({ point, variant }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = recipeElementMarginStyles[styleKey];

  return <p className={styleClass}>{point}</p>;
};
