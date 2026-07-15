type Variant = keyof typeof styles;
type Props = {
  variant?: Variant;
  cookingTime?: string;
};

const styles = {
  compact: 'mb-1',
  default: 'mb-2',
};

export const RecipeCookingTime = ({ variant, cookingTime }: Props) => {
  const styleKey = variant ?? 'default';
  const styleClass = styles[styleKey];

  const timeDisplay = cookingTime ?? '不明';
  // TODO: Zodのstring()は空文字も通すのでcookingTime必須化後はfallback表示を見直す

  if (styleKey === 'compact') {
    return (
      <p className={styleClass}>
        <strong>調理時間:</strong> {timeDisplay}
      </p>
    );
  }

  return <p className={styleClass}>⏱ 調理時間: {timeDisplay}</p>;
};
