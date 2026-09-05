import type { Metadata } from 'next';
import { Newsreader, Outfit } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { EdgeCues } from '@/components/navigation/EdgeCues';
import { RoomShortcuts } from '@/components/navigation/RoomShortcuts';
import { SearchDialog } from '@/components/search/SearchDialog';
import { SearchProvider } from '@/components/search/SearchContext';
import { SearchShortcut } from '@/components/search/SearchShortcut';
import { AdjacentRoomPreload } from '@/components/transitions/AdjacentRoomPreload';
import { RoomTransition } from '@/components/transitions/RoomTransition';
import { TransitionProvider } from '@/components/transitions/TransitionProvider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — A calmer way to explore technology`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    title: `${SITE_NAME} — A calmer way to explore technology`,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/images/home-panorama.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — A calmer way to explore technology`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={
        `${outfit.variable} ${newsreader.variable} ` +
        'h-full antialiased'
      }
    >
      <body className='min-h-full bg-[#05090a] text-[#edf3ef]'>
        <AuthProvider>
          <SearchProvider>
            <TransitionProvider>
              <Header />
              <SearchShortcut />
              <RoomShortcuts />
              <EdgeCues />
              <SearchDialog />
              <AdjacentRoomPreload />
              <RoomTransition>{children}</RoomTransition>
              <Footer />
            </TransitionProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
