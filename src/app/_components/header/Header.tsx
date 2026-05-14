'use client';

import { cn } from '@/lib/utils/cn';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';
import { GuestMenu } from './GuestMenu';
import { UserMenu } from './UserMenu';

type Props = {
  className?: string;
};

export const Header = ({ className }: Props) => {
  const { session } = useSupabaseSession(); // UI出し分け分岐用

  return (
    <header
      className={cn(
        'relative z-[99] flex items-center justify-between p-4 h-[72px] bg-header',
        className
      )}
    >
      <Link href="/">
        <h1>HotCookAutoChef</h1>
      </Link>
      {!session ? <GuestMenu /> : <UserMenu session={session} />}
    </header>
  );
};
