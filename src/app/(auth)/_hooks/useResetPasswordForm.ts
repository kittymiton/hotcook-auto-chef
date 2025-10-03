'use client';

import { RESET_PASSWORD_SEND_PATH } from '@/constants/index';
import { resetPassword } from '@auth/lib/sign';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@auth/lib/validation/resetPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

/**
 * リセットパスワード（未ログイン時）から呼ばれるフック
 *  - RHF初期化, Zodバリデーション, submit処理、API通信ロジック
 *
 * email受取
 * ↓ Zodバリデーション
 * resetPassword()
 * ↓ リセット用リンク発行
 * email送信完了ページ表示（reset-password-send）
 *
 * 以下遷移後の流れ
 * link→update-passwordページ→password入力→updateUserPassword()→upate-password-sendページ）
 *
 * @returns {Object} フォームの状態と操作関数をまとめたオブジェクト
 * - register: 入力フィールドをRHFに登録する関数
 * - handleSubmit: 送信時にバリデーションを実行し、成功時に指定関数を呼び出すラッパー関数
 * - isDirty: 入力が初期状態から変更されたかを示すフラグ
 * - errors: バリデーションエラーの情報が入ったオブジェクト
 * - isSubmitting: フォームが送信中かどうかを示すブール値
 * - onSubmit: 実際の送信ロジック関数
 * - redirecting: 遷移中であるかを示すブール値
 */
export const useResetPasswordForm = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm<ResetPasswordInput>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, getValues, setError } = form;
  const { isDirty, errors, isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (
    data: ResetPasswordInput
  ) => {
    const email = getValues('email');

    const { error } = await resetPassword(email);

    if (error) {
      setError('email', {
        type: 'server',
        message: 'エラーが発生しました。もう一度お試しください。',
      });
    }

    setRedirecting(true);
    router.replace(RESET_PASSWORD_SEND_PATH);
  };

  return {
    register,
    handleSubmit,
    isDirty,
    errors,
    isSubmitting,
    redirecting,
    onSubmit,
  };
};
