import Logo from '@/components/logo';
import SidebarToggler from './sidebar-toggler';

export function Header() {
  return (
    <header className="flex justify-between lg:md:justify-end items-center p-4 border-b border-slate-200">
      <div className="md:hidden space-x-4 flex items-center ">
        <SidebarToggler />

        <Logo size={24} />
      </div>

      <div className="flex space-x-12">login</div>
    </header>
  );
}
