'use client';

import { HOME_PATH } from '@/constants/paths';
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

  const logoHref = session ? HOME_PATH : '/';
  return (
    <header
      className={cn(
        'relative z-[99] flex h-[72px] items-center justify-between bg-beige-light p-4',
        className
      )}
    >
      <Link href={logoHref}>
        <h1>HotCookAutoChef</h1>
      </Link>
      {/* ヘッダー右側に出すメニュー */}
      {!session ? <GuestMenu /> : <UserMenu session={session} />}
    </header>
  );
};
