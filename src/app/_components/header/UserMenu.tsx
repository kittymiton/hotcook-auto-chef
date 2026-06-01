'use client';

import { signOut } from '@auth/lib/sign';
import { Session } from '@supabase/supabase-js';
import router from 'next/router';
import { Button } from '../../../components/ui/Button';

type Props = {
  session: Session;
  showLogout?: boolean;
};

export const UserMenu = ({ session, showLogout }: Props) => {
  const email = session?.user?.email;
  if (!email) return null;

  const initials = email
    .split('@')[0]
    .split(/[\.\-_]/) // 区切り
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      alert('ログアウトに失敗しました');
      return;
    }

    router.push('/');
  };

  return (
    <div className="flex items-center gap-2">
      {showLogout && (
        <Button variant="header-logout" onClick={handleLogout}>
          ログアウト
        </Button>
      )}
      <Button
        variant="header-icon"
        href={'/mypage'}
        ariaLabel="MYページアイコン"
      >
        {initials}
      </Button>
    </div>
  );
};
