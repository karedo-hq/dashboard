import Logo from '@/components/logo';
import SidebarToggler from './sidebar-toggler';
import UserOrLogin from '@/(auth)/components/user-or-login';

export function Header() {
  return (
    <header className="flex justify-between lg:md:justify-end items-center p-4 border-b border-slate-200">
      <div className="md:hidden space-x-4 flex items-center ">
        <SidebarToggler />

        <Logo size={24} />
      </div>

      <UserOrLogin />
    </header>
  );
}
