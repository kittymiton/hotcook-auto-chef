type Variant = keyof typeof styles;
type Props = {
  variant?: Variant;
  point?: string;
};

const styles = {
  compact: 'mb-1',
  default: 'mb-2',
} as const;

export const RecipePoint = ({ point, variant }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = styles[styleKey];

  if (!point) return null;

  return <p className={styleClass}>{point}</p>;
};
