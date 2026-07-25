type Props = {
  variant?: Variant;
  instructions: string[];
};

const olStyles = {
  compact: 'mb-1',
  default: 'mb-4',
} as const;

type Variant = keyof typeof olStyles;

export const RecipeInstructions = ({ variant, instructions }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = olStyles[styleKey];

  let heading: React.ReactNode;

  if (styleKey === 'compact') {
    heading = <h3 className="font-semibold">作り方</h3>;
  } else {
    heading = <h2 className="mb-1 text-lg font-semibold">作り方</h2>;
  }

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
