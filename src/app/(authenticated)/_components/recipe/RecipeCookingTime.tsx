import {
  recipeElementMarginStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  cookingTime: string;
};

export const RecipeCookingTime = ({
  variant = 'default',
  cookingTime,
}: Props) => {
  const styleClass = recipeElementMarginStyles[variant];
  const timePrefix = variant === 'compact' ? '' : '◷ ';

  return (
    <p className={styleClass}>
      {timePrefix}調理時間: {cookingTime}
    </p>
  );
};
