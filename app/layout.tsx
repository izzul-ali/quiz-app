import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

export const poppins = Poppins({
  weight: ['300', '400', '600', '700', '800'],
  style: 'normal',
  subsets: ['latin'],
  display: 'auto',
});

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'Example of a web-based Quiz App, built with React.js, Next.js, and Tailwind CSS',
  themeColor: '#eddbff',
  icons: {
    icon: [
      { rel: 'icon', type: 'image/png', url: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', url: '/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-bl from-purple-100 to-gray-50 ${poppins.className}`}>{children}</body>
    </html>
  );
}
