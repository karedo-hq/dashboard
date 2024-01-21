import Sidebar from './sidebar';
import { SidebarList } from './sidebar-list';

export default function SidebarWrapper() {
  return (
    <Sidebar>
      <SidebarList userId="1" />
    </Sidebar>
  );
}
