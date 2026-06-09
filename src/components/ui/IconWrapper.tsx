type Props = {
  children: React.ReactNode;
};

export const IconWrapper = ({ children }: Props) => {
  return (
    <div className="flex w-[24px] shrink-0 justify-center">{children}</div>
  );
};
