import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  weight: ['300', '400', '600', '700', '800'],
  style: 'normal',
  subsets: ['latin'],
  display: 'auto',
});

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'An example Quiz App based on web, built with React.js, Next.js and Tailwind CSS',
  themeColor: '#eddbff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 ${poppins.className}`}>{children}</body>
    </html>
  );
}
