import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gamechanger-retz.at'),
  title: {
    default: 'GAME:changer - eSport Gaming Verein Retz Pleissing Niederösterreich',
    template: '%s | GAME:changer Retz Gaming'
  },
  description: 'GAME:changer - Der führende eSport & Gaming Verein in Retz, Pleissing, Niederösterreich. Gaming Community, Turniere, Events. Jetzt Mitglied werden!',
  keywords: [
    'GAME:changer', 'Game Changer', 'Retz Gaming', 'Retz eSport', 'Gaming Verein Retz',
    'eSport Retz', 'Gaming Pleissing', 'eSport Pleissing', 'Gaming Niederösterreich',
    'eSport Niederösterreich', 'Gaming Club Retz', 'Competitive Gaming Retz',
    'Gaming Community Retz', 'Gaming Turniere Retz', 'eSport Events Retz',
    'Gaming Events Pleissing', 'österreichischer Gaming Verein', 'eSport Austria',
    'Gaming Verein Österreich', 'Retz Verein', 'Gaming Club Niederösterreich',
    'eSport Team Retz', 'Gaming Team Pleissing', 'Computerspiele Verein Retz'
  ],
  authors: [{ name: 'GAME:changer Verein' }],
  creator: 'GAME:changer',
  publisher: 'GAME:changer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: 'https://gamechanger-retz.at',
    siteName: 'GAME:changer',
    title: 'GAME:changer - eSport Gaming Verein Retz Pleissing',
    description: 'GAME:changer - Der führende eSport & Gaming Verein in Retz, Pleissing, Niederösterreich. Gaming Community, Turniere, Events!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GAME:changer - Gaming Verein Retz',
    description: 'GAME:changer - eSport & Gaming Verein in Retz, Pleissing, Niederösterreich.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=REPLACE_WITH_YOUR_VERIFICATION_CODE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#ff0057" />
        <meta name="msapplication-TileColor" content="#ff0057" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <link rel="canonical" href="https://gamechanger-retz.at" />
        <meta name="geo.region" content="AT-3" />
        <meta name="geo.placename" content="Retz, Pleissing" />
        <meta name="geo.position" content="48.7567,15.9457" />
        <meta name="ICBM" content="48.7567,15.9457" />
        <meta name="DC.title" content="GAME:changer Gaming Verein Retz" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}