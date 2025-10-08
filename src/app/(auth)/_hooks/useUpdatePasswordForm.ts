'use client';

import { LOGIN_PATH, UPDATE_PASSWORD_SEND_PATH } from '@/constants/index';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { updateUserPassword } from '@auth/lib/sign';
import {
  UpdatePasswordInput,
  updatePasswordSchema,
} from '@auth/lib/validation/updatePasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

/**
 * リセットパスワード（未ログイン時）から呼ばれるフック
 *  - RHF初期化, Zodバリデーション, submit処理、API通信ロジック
 *
 * @returns {Object} フォームの状態と操作関数をまとめたオブジェクト
 * - isValid: 現在のフォームがバリデーションを通過しているかどうか（true = 有効）
 * - register: 入力フィールドをRHFに登録する関数
 * - handleSubmit: フォーム送信時にバリデーションを実行し、成功時に指定関数を呼び出すラッパー関数
 * - isDirty: 入力が初期状態から変更されたかを示すフラグ
 * - errors: バリデーションエラーの情報が入ったオブジェクト
 * - isSubmitting: フォームが送信中かどうかを示すブール値
 * - onSubmit: 実際の送信ロジック関数
 * - redirecting: 遷移中であるかを示すブール値
 */
export const useUpdatePasswordForm = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace(LOGIN_PATH);
    }
  }, [isLoading, session]);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { register, handleSubmit, getValues, setError } = form;
  const { isDirty, isValid, errors, isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<UpdatePasswordInput> = async (
    data: UpdatePasswordInput
  ) => {
    const newPassword = getValues('newPassword'); // RHFのstateから取得

    const { error } = await updateUserPassword(newPassword);

    if (error) {
      // RHFの内部状態（errors）にサーバーエラーを登録
      setError('newPassword', {
        type: 'server',
        message: 'エラーが発生しました。もう一度お試しください。',
      });
    }

    setRedirecting(true);
    router.replace(UPDATE_PASSWORD_SEND_PATH);
  };

  return {
    register,
    handleSubmit,
    isDirty,
    isValid,
    errors,
    isSubmitting,
    redirecting,
    onSubmit,
  };
};
