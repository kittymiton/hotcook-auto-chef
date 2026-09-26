type Props = {
  children: React.ReactNode;
};

export const IconWrapper = ({ children }: Props) => {
  return <div className="flex shrink-0 justify-center">{children}</div>;
};
