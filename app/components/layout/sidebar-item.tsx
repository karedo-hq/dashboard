'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { SidebarLink } from '@/lib/types';
import { Typography } from '../ui/typography';

type SidebarItemProps = SidebarLink;

export default function SidebarItem({ href, label, icon: Icon }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'text-paragraph-regular flex items-center space-x-4 rounded-lg px-4 py-2 transition-colors duration-200',
        isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600',
      )}
    >
      <Icon size={18} variant={isActive ? 'fill' : 'outline'} />
      <Typography
        variant="label"
        color={isActive ? 'primary-600' : 'slate-950'}
        className="font-medium"
      >
        {label}
      </Typography>
    </Link>
  );
}
