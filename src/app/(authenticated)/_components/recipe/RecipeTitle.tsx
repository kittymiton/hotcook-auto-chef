import { cn } from '@/lib/utils/cn';
import {
  recipeElementMarginStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  title: string;
};

const baseTextSizeClass = 'text-lg';

const titleStyles = {
  compact: 'font-semibold',
  default: 'mt-2 font-bold sm:text-2xl',
} as const satisfies Record<Variant, string>;

export const RecipeTitle = ({ variant, title }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = recipeElementMarginStyles[styleKey];

  const combinedClass = cn(
    baseTextSizeClass,
    styleClass,
    titleStyles[styleKey]
  );

  const recipeTitle =
    styleKey === 'compact' ? (
      <h2 className={combinedClass}>{title}</h2>
    ) : (
      <h1 className={combinedClass}>{title}</h1>
    );

  return recipeTitle;
};
