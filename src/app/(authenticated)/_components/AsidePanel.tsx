type Props = {
  children: React.ReactNode;
};

export const AsidePanel = ({ children }: Props) => {
  return <aside className="w-64 flex-shrink-0 border-r p-4">{children}</aside>;
};
