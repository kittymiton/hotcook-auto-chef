type AsidePanelProps = {
  children: React.ReactNode;
};

export const AsidePanel = ({ children }: AsidePanelProps) => {
  return <aside className="w-64 flex-shrink-0 border-r p-4">{children}</aside>;
};
