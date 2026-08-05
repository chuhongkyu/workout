import type { Metadata, Viewport } from 'next';
import '@seed-design/css/all.css';
import '@/app/globals.scss';

export const metadata: Metadata = {
  title: '버핏 기록 · BUTFIT RECORD',
  description: '하루하루 운동을 기록하고, 오늘의 운동을 추천받으세요.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '버핏 기록',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0c',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-seed="" data-seed-color-mode="dark-only">
      <body>{children}</body>
    </html>
  );
}
