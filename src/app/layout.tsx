import type { Metadata, Viewport } from 'next';
import '@seed-design/css/all.css';
import '@/app/globals.scss';

export const metadata: Metadata = {
  title: '오운완 · 운동 기록',
  description: '하루하루 운동을 기록하고, 오늘의 운동을 추천받으세요.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '오운완',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-seed="" data-seed-color-mode="light-only">
      <body>{children}</body>
    </html>
  );
}
