import {
  recipeSectionHeadingStyles,
  type Variant,
} from '@authenticated/components/recipe/recipeElementStyles';

type Props = {
  variant?: Variant;
  instructions: string[];
};

const olStyles = {
  compact: 'mb-1',
  default: 'mb-4',
} as const satisfies Record<Variant, string>;

export const RecipeInstructions = ({
  variant = 'default',
  instructions,
}: Props) => {
  const styleClass = olStyles[variant];
  const headingClass = recipeSectionHeadingStyles[variant];

  const instructionsHeadingText = '作り方';

  const heading =
    variant === 'compact' ? (
      <h3 className={headingClass}>{instructionsHeadingText}</h3>
    ) : (
      <h2 className={headingClass}>{instructionsHeadingText}</h2>
    );

  return (
    <section>
      {heading}
      <ol className={styleClass}>
        {instructions.map((step, i) => (
          <li key={i}>
            <span className="font-semibold">{i + 1}. </span>
            <span>{step.replace(/^\d+[:：]\s*/, '').trim()}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
