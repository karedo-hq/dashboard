import { IconProps } from '@/lib/types';

export default function PlusIcon({ size = 24, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M1.63246 13.6325H10.3675V22.3675C10.3675 23.2554 11.0979 24 12 24C12.9021 24 13.6325 23.2554 13.6325 22.3675V13.6325H22.3675C23.2554 13.6325 24 12.9021 24 12C24 11.0979 23.2554 10.3675 22.3675 10.3675H13.6325V1.63246C13.6325 0.74463 12.9021 0 12 0C11.0979 0 10.3675 0.74463 10.3675 1.63246V10.3675H1.63246C0.74463 10.3675 0 11.0979 0 12C0 12.9021 0.74463 13.6325 1.63246 13.6325Z"
        fill={color}
      />
    </svg>
  );
}
