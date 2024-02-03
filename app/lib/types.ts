export type IconProps = React.ComponentProps<'svg'> & {
  size?: number;
  color?: string;
  variant?: 'outline' | 'fill';
};

export type SidebarLink = {
  href: string;
  label: string;
  icon: (props: IconProps) => JSX.Element;
};
