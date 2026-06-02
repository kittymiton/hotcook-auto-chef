import { cn } from '@/lib/utils/cn';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'ホットクック専用AIレシピアプリ',
  description:
    '忙しい毎日に、ホットクックで作れるレシピを。記憶の中の料理やSNSで見かけたレシピを、AIが手軽に試せる形で提案します。',
  keywords: [
    'ホットクック',
    'ホットクックレシピ',
    'AIレシピ',
    '無水調理',
    '自動調理',
    '時短料理',
    '簡単レシピ',
  ],
  applicationName: 'ホットクック専用AIレシピアプリ',
  openGraph: {
    title: 'ホットクック専用AIレシピアプリ',
    description:
      '忙しい毎日に、ホットクックで作れるレシピを。記憶の中の料理やSNSで見かけたレシピを、AIが手軽に試せる形で提案します。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'ホットクック専用AIレシピアプリ',
    images: ['/og-image.png'], // TODO: TOP画面を入れる
  },
  robots: {
    index: true,
    follow: true,
  },
};

// 背景
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body
        className={cn(
          notoSansJp.className,
          'min-h-full bg-beige-skin text-[14px] font-[400] leading-[1.65] text-primary md:text-[16px]'
        )}
      >
        {/* アプリ全体幅 */}
        <div className="relative mx-auto w-full max-w-[1280px] bg-gray-warm">
          {children}
        </div>
      </body>
    </html>
  );
}
