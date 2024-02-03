'use client';

import * as React from 'react';

import { useSidebar } from '@/lib/hooks/use-sidebar';
import { Button } from '@/components/ui/button';
import SidebarIcon from '@/components/icons/sidebar-icon';
import CrossIcon from '@/components/icons/cross-icon';

type Props = {
  mode?: 'open' | 'close';
};

export default function SidebarToggler({ mode = 'open' }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" className="p-0 md:hidden" onClick={toggleSidebar}>
      {mode === 'open' ? <SidebarIcon size={24} /> : <CrossIcon size={18} />}
    </Button>
  );
}
