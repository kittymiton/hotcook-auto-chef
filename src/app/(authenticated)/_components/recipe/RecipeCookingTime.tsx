import {
  recipeElementMarginStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  cookingTime: string;
};

export const RecipeCookingTime = ({ variant, cookingTime }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = recipeElementMarginStyles[styleKey];

  const timePrefix = styleKey === 'compact' ? '' : '◷ ';

  return (
    <p className={styleClass}>
      {timePrefix}調理時間: {cookingTime}
    </p>
  );
};
