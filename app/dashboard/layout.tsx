import { authOptions } from '@/api/auth/[...nextauth]/route';
import SessionExpiredDialog from '@/auth/components/session-expired-dialog';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getServerSession } from 'next-auth';
//import { signOut } from 'next-auth/react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const sessionExpired = session?.error === 'RefreshTokenExpired';

  return (
    <div className="relative flex h-screen overflow-hidden bg-white dark:bg-slate-800 ">
      <Sidebar />
      <main className="group w-full overflow-auto pl-0 md:pl-[280px]">
        <Header />
        {children}

        {sessionExpired && <SessionExpiredDialog />}
      </main>
    </div>
  );
}
