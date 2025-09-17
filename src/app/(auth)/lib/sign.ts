import { AUTH_CALLBACK_PATH } from '@/constants/index';
import { supabase } from '@/lib/utils/env';

/**
 * Supabaseの認証処理に関するロジック郡
 * @returns {Promise<{ error: { message: string } | null }>}
 **/
type AuthResult = {
  error: {
    message: string;
  } | null;
};

const getRedirectUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
};

export const signUp = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(AUTH_CALLBACK_PATH),
      },
    });

    // userを返すが、既存ユーザ情報があるため、identitiesに要素が入らなかった場合
    if (!error && data.user?.identities?.length === 0) {
      return { error: { message: 'User already registered' } };
    }
    return { error };
  } catch (e) {
    if (e instanceof Error) {
      console.error('詳細エラー:', e.message);
    }
    return { error: { message: 'unexpected_failure' } };
  }
};

// メールリンクを踏んでいないユーザーがログインしようとした場合
export const resend = async (email: string): Promise<AuthResult> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: getRedirectUrl(AUTH_CALLBACK_PATH),
    },
  });
  return { error };
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  } catch (e) {
    if (e instanceof Error) {
      console.error('詳細エラー:', e.message);
    }
    return { error: { message: '' } };
  }
};

// export const resetPassword = async (
//   email: string
// ): Promise<AuthResult> => {
//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: getRedirectUrl(UPDATE_PASSWORD_PATH),
//   });
//   return { error };
// };

// export const updateUser = async (
//   password: string
// ): Promise<AuthResult> => {
//   const { error } = await supabase.auth.updateUser({
//     password,
//   });
//   return { error };
// };

export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (e) {
    if (e instanceof Error) {
      console.error('詳細エラー:', e.message);
    }
    return { error: { message: '' } };
  }
};
