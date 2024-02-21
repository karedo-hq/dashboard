'use client';

import Link from 'next/link';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import Logo from '@/components/ui/logo';
import SidebarToggler from './sidebar-toggler';
import Footer from './footer';
import { SidebarLink } from '@/lib/types';
import SidebarItem from './sidebar-item';
import HomeIcon from '../icons/home-icon';
import ContactsIcon from '../icons/contacts-icon';

const LINKS: SidebarLink[] = [
  { href: '/dashboard', label: 'Übersicht', icon: HomeIcon },
  { href: '/dashboard/customers', label: 'Betreute', icon: ContactsIcon },
];

export default function Sidebar() {
  const { isSidebarOpen, isLoading } = useSidebar();

  return (
    <aside
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className="peer absolute inset-y-0 z-30 flex w-full -translate-x-full flex-col justify-between space-y-8 border-r border-slate-200 bg-white p-8 duration-300 ease-in-out data-[state=open]:translate-x-0 dark:bg-slate-800 md:w-[280px] md:-translate-x-0"
    >
      <div className="flex flex-col">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <SidebarToggler mode="close" />
        </header>

        <ul>
          {LINKS.map((link) => (
            <SidebarItem key={link.href} {...link} />
          ))}
        </ul>
      </div>

      <Footer />
    </aside>
  );
}
