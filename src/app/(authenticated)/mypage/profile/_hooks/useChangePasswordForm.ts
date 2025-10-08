'use client';

import {
  LOGIN_PATH,
  MYPAGE__PROFILE__CHANGE_PASSWORD_SEND_PATH,
} from '@/constants/index';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { signIn, updateUserPassword } from '@auth/lib/sign';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@auth/lib/validation/changePasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
/**
 * マイページでパスワード変更（ログイン時）で呼ばれるフック
 *  - RHF初期化, Zodバリデーション, submit処理、API通信
 *
 * @returns {Object} フォームの状態と操作関数をまとめたオブジェクト
 */
export const useChangePasswordForm = () => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace(LOGIN_PATH);
    }
  }, [isLoading, session]);

  const form = useForm<ChangePasswordInput>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, getValues, setError } = form;
  const { isDirty, isValid, errors, isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<ChangePasswordInput> = async (
    data: ChangePasswordInput
  ) => {
    const email = session?.user?.email;
    const currentPassword = getValues('currentPassword');

    if (email) {
      const { error } = await signIn(email, currentPassword);

      if (error) {
        setError('currentPassword', {
          type: 'server',
          message: '現在のパスワードが正しくありません',
        });
        setRedirecting(false);
        return;
      }
    }

    const newPassword = getValues('newPassword');
    const { error } = await updateUserPassword(newPassword);

    if (error) {
      setError('newPassword', {
        type: 'server',
        message: 'パスワードの変更に失敗しました。',
      });
      setRedirecting(false);
      return;
    }

    setRedirecting(true); // isSubmittingがfalseのため、明示的に遷移中であることを表示
    router.replace(MYPAGE__PROFILE__CHANGE_PASSWORD_SEND_PATH);
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
