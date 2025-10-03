// 'use client';

// import { AUTH_CALLBACK_PATH, SIGNUP_SEND_PATH } from '@/constants/index';
// import { AuthErrorInfo } from '@/types/auth';
// import { getAuthErrorInfo } from '@auth/lib/getAuthErrorInfo';
// import { resend, signIn, signOut } from '@auth/lib/sign';
// import { AuthInput, authSchema } from '@auth/lib/validation/authSchema';
// import { resendSchema } from '@auth/lib/validation/resendSchema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { AuthError } from '@supabase/supabase-js';
// import { useRouter } from 'next/navigation';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import z, { email } from 'zod';

// /**
//  * 認証フローを制御するフック
//  *RHF初期化, Zodバリデーション, submit処理API通信ロジック集中
//  resend, 初期エラー注入, Supabaseエラー翻訳 はこのHookに集中
//  それ以外は全て RHF に任せる
//  * @returns
//  */
// type UseAuthFormOptions = {
//   initialError?: unknown; // 'url_auth_error' など
// };
// type FormError = {
//   email?: string;
//   password?: string;
// };
// type RawError =
//   | AuthError
//   | { message?: string }
//   | { status?: number }
//   | string
//   | null;
// export const useLoginForm = ({ initialError }: { initialError?: unknown }) => {
//   const type = 'login';
//   const router = useRouter();
//   const [sending, setSending] = useState<boolean>(false);

//   // Authの生エラー（API/SDK/ハッシュ加工後自作固定メッセージ）を一元的に内部で保管
//   const [rawError, setRawError] = useState<RawError>(null);

//   // 再送ボタンローディング
//   const [reSending, setReSending] = useState<boolean>(false);
//   // ログイン試行メール対象（未認証ログインの再送）
//   const [lastInputEmail, setLastInputEmail] = useState<string>('');
//   // 有効期限管理（値と時刻）
//   const lastInputRef = useRef<number>(0);

//   // 409時にメール変更があったかどうかの確認フラグ
//   const [emailChangedAfterError, setEmailChangedAfterError] = useState(false);
//   // 409時にのみセット
//   const lastErrorEmailRef = useRef<string | null>(null);
//   // 初回マウントで全クリア（共有PC/タブ持ち越し対策）
//   useEffect(() => {
//     signOut();
//     //setRawError(null); ★初期値nullを保持する
//     setLastInputEmail('');
//     lastInputRef.current = 0;
//   }, []);

//   // 初期エラーを後から同期
//   useEffect(() => {
//     if (initialError) setRawError(initialError);
//   }, [initialError]);

//   // 生エラーをUI用に加工
//   const errorInfo: AuthErrorInfo | null = useMemo(
//     () => getAuthErrorInfo(rawError, type),
//     [rawError, type]
//   );

//   // 409エラー時に別のアドレスに切り替えたかどうかの判定フラグ（UX向上のための比較基準）
//   useEffect(() => {
//     if (errorInfo?.status === 409) {
//       setEmailChangedAfterError(false);
//       lastErrorEmailRef.current = email;
//     }
//   }, [errorInfo]);

//   // UI判定のためエラーメッセージをキーに変換
//   const MSG_VERIFY_EXPIRED = 'リンクの有効期限が過ぎています';
//   const MSG_NOT_CONFIRMED = 'メール認証が未完了です';

//   // email入力欄表示のフラグ（期限切れリンクのみ）
//   const requireEmail = !!errorInfo?.message?.includes(MSG_VERIFY_EXPIRED);

//   // resend実行のフラグ（期限切れリンクorメール未認証）
//   const showResend =
//     requireEmail || !!errorInfo?.message?.includes(MSG_NOT_CONFIRMED);

//   // 再送ボタンが押されたときの処理
//   const onResend = useCallback(async () => {
//     if (reSending) return;

//     // バリデーション対象選定
//     const targetEmail = requireEmail ? email : lastInputEmail;
//     if (!targetEmail) return;
//     // emailのZodバリデーション（lastInputEmailのケース→保険として再チェック）
//     const formResult = resendSchema.safeParse({ email: targetEmail });
//     if (!formResult.success) {
//       const tree = z.treeifyError(formResult.error);
//       setFormErrors({
//         email: tree.properties?.email?.errors?.[0],
//       });
//       return;
//     }
//     setFormErrors({});

//     // 再送リクエスト中連打防止＆処理中表示
//     setReSending(true);

//     const { error } = await resend(targetEmail);
//     setReSending(false);

//     // useMemo再評価のトリガー
//     if (error) {
//       setRawError(error);
//       return;
//     }

//     router.push(SIGNUP_SEND_PATH);
//   }, [email, reSending, requireEmail, lastInputEmail, router]);

//   const form = useForm<AuthInput>({
//     reValidateMode: 'onSubmit',
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//     resolver: zodResolver(authSchema),
//     mode: 'onChange',
//   });
//   const { register, handleSubmit, getValues, setError } = form;
//   const { isDirty, isValid, errors, isSubmitting } = form.formState;

//   const onSubmit: SubmitHandler<AuthInput> = async (data: AuthInput) => {
//     const email = getValues('email');
//     const password = getValues('password');

//     try {
//       const { error } = await signIn(email, password);

//       if (error) {
//         setError('email', {
//           type: 'server',
//           message: error.message,
//         });
//       }
//       if (error) {
//         setError('password', {
//           type: 'server',
//           message: error.message,
//         });
//       }
//     } catch (e) {
//       if (e instanceof Error) {
//         console.error('詳細エラー:', e.message);
//       }
//     }
//     router.replace(AUTH_CALLBACK_PATH);
//   };

//   return {
//     register,
//     handleSubmit,
//     isDirty,
//     isValid,
//     errors,
//     isSubmitting,
//     onSubmit,
//   };
// };
