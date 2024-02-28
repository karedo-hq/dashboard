import { LucideIcon, LucideProps } from 'lucide-react';

export type IconProps = LucideProps & {
  size?: number;
  color?: string;
  variant?: 'outline' | 'fill';
};

export type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};
