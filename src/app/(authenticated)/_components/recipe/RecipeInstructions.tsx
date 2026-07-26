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

export const RecipeInstructions = ({ variant, instructions }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = olStyles[styleKey];
  const headingClass = recipeSectionHeadingStyles[styleKey];

  const instructionsHeadingText = '作り方';

  const heading =
    styleKey === 'compact' ? (
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
