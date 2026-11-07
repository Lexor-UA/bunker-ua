import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from '@/lib/session';
import {
  getActiveMatchForUser,
  getPendingAndDisputedMatches,
} from '@/lib/tournament-engine';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AmbientBackground } from '@/components/AmbientBackground';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title:
    'BUNKER FC 1v1 • UKRAINE — Благодійна платформа турнірів в EA SPORTS FC на підтримку ЗСУ',
  description:
    'Офіційна благодійна платформа BUNKER FC 1v1 Ukraine: турніри 1 на 1 в EA SPORTS FC за системою Ліги Чемпіонів (групи + плей-офф) на підтримку ЗСУ.',
  icons: {
    icon: '/images/bunker-fc-crest.png',
    shortcut: '/images/bunker-fc-crest.png',
    apple: '/images/bunker-fc-crest.png',
  },
  openGraph: {
    title: 'BUNKER FC 1v1 • UKRAINE — Благодійна платформа',
    description:
      'Турніри 1 на 1 в EA SPORTS FC за системою Ліги Чемпіонів на підтримку ЗСУ (Project Ukraine).',
    images: ['/images/bunker-fc-logo.jpg'],
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const disputed = getPendingAndDisputedMatches();
  const activeMatch = currentUser
    ? getActiveMatchForUser(currentUser.id)
    : null;

  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body
        suppressHydrationWarning
        className="relative font-sans antialiased flex flex-col min-h-screen selection:bg-sky-300/30 selection:text-white"
      >
        <AmbientBackground />
        <Navbar
          currentUser={currentUser}
          disputedCount={disputed.length}
          activeMatch={activeMatch}
        />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
