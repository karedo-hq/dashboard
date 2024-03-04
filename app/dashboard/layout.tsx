import SessionExpiredDialog from '@/auth/components/session-expired-dialog';
import { auth } from '@/auth/lib/utils/auth';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const sessionExpired = session?.error === 'RefreshTokenExpired';

  return (
    <div className="relative flex h-screen overflow-hidden bg-white dark:bg-slate-800 ">
      <Sidebar />
      <main className="group w-full overflow-auto pl-0 md:pl-[240px]">
        <Header />
        {children}

        {sessionExpired && <SessionExpiredDialog />}
      </main>
    </div>
  );
}
