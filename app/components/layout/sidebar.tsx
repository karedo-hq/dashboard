'use client';

import Link from 'next/link';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import Logo from '@/components/logo';
import SidebarToggler from './sidebar-toggler';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils/cn';
import PlusIcon from '../icons/plus-icon';
import Footer from './footer';

export default function Sidebar({ children }: React.ComponentProps<'aside'>) {
  const { isSidebarOpen, isLoading } = useSidebar();

  return (
    <aside
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className="bg-white dark:bg-slate-800 peer absolute w-full md:w-[280px] inset-y-0 z-30 -translate-x-full md:-translate-x-0 duration-300 ease-in-out data-[state=open]:translate-x-0 flex flex-col justify-between p-8 border-r border-slate-200 space-y-8"
    >
      <header className="flex flex-col">
        <div className="flex justify-between items-center mb-8 text-lights-0">
          <Link href="/">
            <Logo />
          </Link>

          <SidebarToggler mode="close" />
        </div>

        <Link
          href="/guides/create"
          className={cn(buttonVariants({ variant: 'outline' }), 'space-x-2')}
        >
          <PlusIcon size={8} />

          <p>New guide</p>
        </Link>
      </header>

      {children}

      <Footer />
    </aside>
  );
}
