import Image from 'next/image';
import logoSrc from '../../public/logo.png';
import { IconProps } from '@/lib/types';

export default function Logo({ size = 32, className }: IconProps) {
  return <Image alt="Wizy logo" src={logoSrc} height={size} className={className} />;
}
