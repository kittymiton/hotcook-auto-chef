type TalkInputProps = {
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
}: TalkInputProps) => {
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
        className="border rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </>
  );
};
