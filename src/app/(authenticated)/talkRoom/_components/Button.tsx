type ButtonProps = {
  sending: boolean;
  disabled: boolean;
};

export const Button = ({ sending, disabled }: ButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded  transition`}
    >
      {sending ? '送信中' : '送信'}
    </button>
  );
};
