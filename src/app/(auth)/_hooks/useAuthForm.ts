'use client';

import { AUTH_CALLBACK_PATH, SIGNUP_SEND_PATH } from '@/constants/index';
import type { AuthErrorInfo, AuthType, UseAuthForm } from '@/types/auth';
import { getAuthErrorInfo } from '@auth/lib/getAuthErrorInfo';
import { resend, signIn, signOut, signUp } from '@auth/lib/sign';
import { authSchema } from '@auth/lib/validation/authSchema';
import { resendSchema } from '@auth/lib/validation/resendSchema';
import type { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

/**
 * 認証フロー制御するフック
 *
 * 認証に係るすべてのロジックを持つ
 *  初回マウントでクリア
 *  フォーム検証（Zod）
 *  signIn/signUp/resend実行と生エラー収集（rawError）
 *  getAuthErrorInfoでUI表示用メッセージに変換→errorInfoを返す(obj)
 *  注入されたinitialErrorを加工→resendControls(errorInfo/requireEmail/showResend/onResend)を返す(string)
 *  成功時の入力クリア＆router.push/replace
 *
 * @param type 'signup' | 'login'
 * @param opts 'url_auth_error'
 * @returns 認証フォームの入力状態とハンドラーをまとめたオブジェクト
 */
type UseAuthFormOptions = {
  initialError?: unknown; // 'url_auth_error' など
};
type FormError = {
  email?: string;
  password?: string;
};
type RawError =
  | AuthError
  | { message?: string }
  | { status?: number }
  | string
  | null;

export const useAuthForm = (
  type: AuthType,
  opts?: UseAuthFormOptions
): UseAuthForm => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formErrors, setFormErrors] = useState<FormError>({});
  // Authの生エラー（API/SDK/ハッシュ加工後自作固定メッセージ）を一元的に内部で保管
  const [rawError, setRawError] = useState<RawError>(null);

  // 再送ボタンローディング
  const [sending, setSending] = useState<boolean>(false);
  // ログイン試行メール対象（未認証ログインの再送）
  const [lastInputEmail, setLastInputEmail] = useState<string>('');
  // 有効期限管理（値と時刻）
  const lastInputRef = useRef<number>(0);

  // 409時にメール変更があったかどうかの確認フラグ
  const [emailChangedAfterError, setEmailChangedAfterError] = useState(false);
  // 409時にのみセット
  const lastErrorEmailRef = useRef<string | null>(null);

  // 初回マウントで全クリア（共有PC/タブ持ち越し対策）
  useEffect(() => {
    signOut();
    setEmail('');
    setPassword('');
    setFormErrors({});
    //setRawError(null); ★初期値nullを保持する
    setLastInputEmail('');
    lastInputRef.current = 0;
  }, []);

  // 初期エラーを後から同期
  useEffect(() => {
    if (opts?.initialError) setRawError(opts.initialError);
  }, [opts?.initialError]);

  // 生エラーをUI用に加工
  const errorInfo: AuthErrorInfo | null = useMemo(
    () => getAuthErrorInfo(rawError, type),
    [rawError, type]
  );

  // 409エラー時に別のアドレスに切り替えたかどうかの判定フラグ（UX向上のための比較基準）
  useEffect(() => {
    if (errorInfo?.status === 409) {
      setEmailChangedAfterError(false);
      lastErrorEmailRef.current = email;
    }
  }, [errorInfo]);

  // UI判定のためエラーメッセージをキーに変換
  const MSG_VERIFY_EXPIRED = 'リンクの有効期限が過ぎています';
  const MSG_NOT_CONFIRMED = 'メール認証が未完了です';

  // email入力欄表示のフラグ（期限切れリンクのみ）
  const requireEmail = !!errorInfo?.message?.includes(MSG_VERIFY_EXPIRED);

  // resend実行のフラグ（期限切れリンクorメール未認証）
  const showResend =
    requireEmail || !!errorInfo?.message?.includes(MSG_NOT_CONFIRMED);

  // 再送ボタンが押されたときの処理
  const onResend = useCallback(async () => {
    if (sending) return;

    // バリデーション対象選定
    const targetEmail = requireEmail ? email : lastInputEmail;
    if (!targetEmail) return;

    // emailのZodバリデーション（lastInputEmailのケース→保険として再チェック）
    const formResult = resendSchema.safeParse({ email: targetEmail });
    if (!formResult.success) {
      const tree = z.treeifyError(formResult.error);
      setFormErrors({
        email: tree.properties?.email?.errors?.[0],
      });
      return;
    }
    setFormErrors({});

    // 再送リクエスト中連打防止＆処理中表示
    setSending(true);

    const { error } = await resend(targetEmail);
    setSending(false);

    // useMemo再評価のトリガー
    if (error) {
      setRawError(error);
      return;
    }

    setEmail('');

    router.push(SIGNUP_SEND_PATH);
  }, [email, sending, requireEmail, lastInputEmail, router]);

  // 送信ボタンクリック時の処理
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formResult = authSchema.safeParse({ email, password });
      if (!formResult.success) {
        const tree = z.treeifyError(formResult.error);
        setFormErrors({
          email: tree.properties?.email?.errors?.[0],
          password: tree.properties?.password?.errors?.[0],
        });
        return;
      }
      setFormErrors({});

      // 再送時用として、直近ログインメールを更新
      setLastInputEmail(email.trim());
      lastInputRef.current = Date.now();

      const { error } =
        type === 'signup'
          ? await signUp(email, password)
          : await signIn(email, password);

      // useMemo再評価のトリガー
      if (error) {
        setRawError(error);
        return;
      }

      // 登録成功でフォーム送信完了後に入力フィールドをクリア
      if (type === 'signup') {
        setEmail('');
        setPassword('');
      }
      setLastInputEmail('');
      lastInputRef.current = 0;

      // 成功時リダイレクト
      if (type === 'signup') {
        router.push(SIGNUP_SEND_PATH);
      } else {
        router.replace(AUTH_CALLBACK_PATH);
      }
    },
    [email, password, type, router]
  );

  // 409時のemail入力ハンドラ
  const handleEmailChange = (email: string) => {
    setEmail(email);

    if (errorInfo?.status === 409 && lastErrorEmailRef.current) {
      if (email !== lastErrorEmailRef.current) {
        setEmailChangedAfterError(true);
        setRawError(null); // 表示メッセージを消す
      }
    }
  };

  return {
    email,
    password,
    formErrors,
    errorInfo,
    setEmail: handleEmailChange, // 実体は拡張済みの関数
    setPassword,
    handleSubmit,
    emailChangedAfterError,
    resendControls: {
      requireEmail,
      showResend,
      sending,
      onResend,
    },
  };
};
