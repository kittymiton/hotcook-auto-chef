'use client';

import { MYPAGE_PATH } from '@/constants/index';
import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '../ui/Button';

type Props = {
  session: Session;
};

export const UserMenu = ({ session }: Props) => {
  const email = session?.user?.email;
  if (!email) return null;

  const initials = email
    .split('@')[0]
    .split(/[\.\-_]/) // 区切り
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <>
      <Link href={MYPAGE_PATH} aria-label="マイページ">
        <Button variant="header-icon">{initials}</Button>
      </Link>
    </>
  );
};
