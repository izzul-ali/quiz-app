import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz App',
  description: 'An example Quiz App based on web, built with React.js, Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
