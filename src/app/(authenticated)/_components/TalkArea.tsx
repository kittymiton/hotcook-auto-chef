import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const TalkArea = ({ children }: Props) => {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col px-4 lg:pl-0 lg:pr-4">
      {children}
    </main>
  );
};
