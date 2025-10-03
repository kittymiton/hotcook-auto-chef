// 'use client';

// /**
//  * パスワード・確認入力→更新ボタンのUI表示
//  *
//  * Zodバリデーション
//  *
//  * @returns
//  */
// import { useLoginForm } from '@auth/hooks/useLoginForm';

// export const LoginForm = () => {
//   const {
//     register,
//     handleSubmit,
//     isDirty,
//     isValid,
//     errors,
//     isSubmitting,
//     onSubmit,
//   } = useLoginForm();

//   return (
//     <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
//       <div>
//         <label htmlFor="email">アドレス</label>
//         <input
//           type="email"
//           id="email"
//           placeholder=""
//           required
//           {...register('email')}
//         />
//         {errors.email && <p>{errors.email.message}</p>}
//       </div>
//       <div>
//         <label htmlFor="password">パスワード</label>
//         <input
//           type="password"
//           id="password"
//           placeholder="●●●●●●●●●"
//           required
//           {...register('password')}
//         />
//         {errors.password && <p>{errors.password.message}</p>}
//       </div>
//       <button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
//         {isSubmitting ? '送信中' : '送信'}
//       </button>
//     </form>
//   );
// };
