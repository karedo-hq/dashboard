import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-white dark:bg-slate-800 ">
      <Sidebar />
      <main className="group w-full overflow-auto pl-0 md:pl-[280px]">
        <Header />
        {children}
      </main>
    </div>
  );
}
