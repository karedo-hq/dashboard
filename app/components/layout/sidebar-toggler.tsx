'use client';

import * as React from 'react';

import { useSidebar } from '@/lib/hooks/use-sidebar';
import { Button } from '@/components/ui/button';
import { AlignLeftIcon, XIcon } from 'lucide-react';

type Props = {
  mode?: 'open' | 'close';
};

export default function SidebarToggler({ mode = 'open' }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" className="p-0 md:hidden" onClick={toggleSidebar}>
      {mode === 'open' ? <AlignLeftIcon size={24} /> : <XIcon size={24} />}
    </Button>
  );
}
