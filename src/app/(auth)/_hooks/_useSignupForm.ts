// 'use client';

// import { SIGNUP_SEND_PATH } from '@/constants/index';
// import { signUp } from '@auth/lib/sign';
// import { AuthInput, authSchema } from '@auth/lib/validation/authSchema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { SubmitHandler, useForm } from 'react-hook-form';

// /**
//  * 認証フローを制御するフック
//  *RHF初期化, Zodバリデーション, submit処理API通信ロジック集中
//  * @returns
//  */
// export const useSignupForm = () => {
//   const router = useRouter();
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
//       const { error } = await signUp(email, password);

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
//     // 成功時リダイレクト
//     router.push(SIGNUP_SEND_PATH);
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
