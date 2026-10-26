import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Sushanti — The Premier Event Discovery, Registration & Hosting Platform',
  description:
    'Discover and host elite hackathons, coding contests, business case challenges, meetups, and conferences. Featuring automated QR ticketing, judging rubrics, team matching, and verifiable certificates.',
  keywords: [
    'hackathons',
    'competitions',
    'coding contests',
    'event hosting',
    'tech conferences',
    'Unstop alternative',
    'Commudle alternative',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white pb-16 md:pb-0">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <MobileBottomNav />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
