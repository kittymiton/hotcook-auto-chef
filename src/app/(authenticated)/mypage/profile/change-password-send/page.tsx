'use client';

import { MYPAGE_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * マイページからのパスワード変更後に遷移するページ
 * @returns {JSX.Element}
 */
export default function ChangePasswordSendPage() {
  return (
    <div>
      <h1>完了しました</h1>
      <div>
        <p>
          パスワード変更済みです。
          <Link href={MYPAGE_PATH}>TOP</Link>
        </p>
      </div>
    </div>
  );
}
