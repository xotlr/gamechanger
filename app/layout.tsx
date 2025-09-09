import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GAME:changer - eSport & Gaming Verein',
  description: 'Gemeinnütziger Verein für eSport & Gaming in Pleissing, Niederösterreich',
  keywords: ['eSport', 'Gaming', 'Verein', 'GAME:changer', 'Pleissing', 'Niederösterreich'],
  authors: [{ name: 'GAME:changer' }],
  creator: 'GAME:changer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}