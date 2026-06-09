type Props = {
  children: React.ReactNode;
};

export const SideArea = ({ children }: Props) => {
  return (
    <aside className="relative z-[1] mt-[-55px] hidden min-h-screen shrink-0 bg-beige-soft p-6 pt-[55px] lg:block lg:w-[280px]">
      {children}
    </aside>
  );
};
