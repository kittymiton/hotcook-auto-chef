type Props = {
  value: string;
  disabled?: boolean;
  placeholder: string;
  onFocus?: () => void;
  onChange: (value: string) => void;
};

export const TalkInput = ({
  value,
  disabled,
  placeholder,
  onFocus,
  onChange,
}: Props) => {
  return (
    <>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        size={32}
        className="flex-grow rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </>
  );
};
