'use client';

import { HOME_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * 会員登録ボタン送信後（=登録成功時）に遷移するページ
 * 未認証時のメール再送信ボタン送信後（=登録成功時）に遷移するページ
 * @returns {JSX.Element}（メッセージ）
 */
export default function SignUpSendPage() {
  return (
    <div>
      <h1>確認メールを送信しました</h1>
      <div>
        <p>メールからリンクをクリックし、登録を完了させてください。</p>
        <p>
          ※メールが届かない場合は迷惑メールフォルダをご確認ください。
          <br />
          ※リンクをクリックするとトークルームへ自動で移動します。
        </p>
        <p>
          <Link href={HOME_PATH}>TOP</Link>
        </p>
      </div>
    </div>
  );
}
