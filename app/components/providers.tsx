'use client';

import { SidebarProvider } from '@/lib/hooks/use-sidebar';

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
