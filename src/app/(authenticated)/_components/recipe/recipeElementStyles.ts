export type Variant = 'compact' | 'default';

export const recipeSectionHeadingStyles = {
  compact: 'font-semibold',
  default: 'mb-1 text-lg font-semibold',
} as const satisfies Record<Variant, string>;

export const recipeElementMarginStyles = {
  compact: 'mb-1',
  default: 'mb-2',
} as const satisfies Record<Variant, string>;
