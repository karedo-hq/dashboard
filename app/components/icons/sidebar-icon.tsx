import { IconProps } from '@/lib/types';

export default function SidebarIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={color} {...props}>
      <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z" />
    </svg>
  );
}
