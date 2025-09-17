// 'use client';

// import { createContext, useState } from 'react';

// /**
//  * Providerの雛形として取っておくだけで実際に使用しない
//  * グローバルでemail情報を持たない方針（安全上）
//  */
// type EmailProviderType = {
//   email: string;
//   setEmail: (email: string) => void;
// };

// export const EmailContext = createContext<EmailProviderType | undefined>(
//   undefined
// );

// export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
//   const [email, setEmail] = useState('');
//   return (
//     <EmailContext.Provider value={{ email, setEmail }}>
//       {children}
//     </EmailContext.Provider>
//   );
// };
