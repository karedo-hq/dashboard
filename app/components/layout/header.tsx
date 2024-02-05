import Logo from '@/components/ui/logo';
import SidebarToggler from './sidebar-toggler';
import UserOrLogin from '@/(auth)/components/profile-badge';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 p-4 lg:md:justify-end">
      <div className="flex items-center space-x-4 md:hidden ">
        <SidebarToggler />

        <Logo size={24} />
      </div>

      <UserOrLogin />
    </header>
  );
}
