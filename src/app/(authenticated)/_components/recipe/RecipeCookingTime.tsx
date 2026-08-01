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

  const timeDisplay = cookingTime ?? '不明';
  // TODO: Zodのstring()は空文字も通すのでcookingTime必須化後はfallback表示を見直す

  const timePrefix = styleKey === 'compact' ? '' : '◷ ';

  return (
    <p className={styleClass}>
      {timePrefix}調理時間: {timeDisplay}
    </p>
  );
};
