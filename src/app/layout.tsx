'use client';

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full bg-white">
      <body className="min-h-full">
        <div className="relative mx-auto min-h-screen w-full max-w-[960px] bg-guest">
          {/* <EmailProvider>{children}</EmailProvider>//安全上使用しない設計に変更、雛形のためにとっておく */}

          {children}
        </div>
      </body>
    </html>
  );
}
