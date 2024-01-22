import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    color: {
      black: 'text-black',
      white: 'text-white',
      gray: 'text-gray-700',
      red: 'text-red-600',
    },
    variant: {
      title1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      title2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      title3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      title4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      paragraph: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      small: 'text-sm leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    color: 'black',
    variant: 'paragraph',
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label' | 'div' | 'span';
}

const Typography: React.FC<TypographyProps> = ({
  as: Component = 'span',
  className,
  color = 'black',
  variant = 'paragraph',
  ...props
}) => {
  return <Component className={cn(typographyVariants({ color, variant }), className)} {...props} />;
};

export { Typography, typographyVariants };
