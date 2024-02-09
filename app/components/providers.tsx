'use client';

import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/lib/hooks/use-sidebar';

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <SessionProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </SessionProvider>
  );
}
