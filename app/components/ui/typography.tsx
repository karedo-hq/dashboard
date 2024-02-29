import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const typographyVariants = cva('', {
  variants: {
    variant: {
      title1: 'scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl',
      title2: 'scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0',
      title3: 'scroll-m-20 text-xl font-semibold tracking-tight',
      title4: 'scroll-m-20 text-lg font-semibold tracking-tight',
      title5: 'scroll-m-20 text-md font-semibold tracking-tight',
      paragraph: 'leading-7 [&:not(:first-child)]:mt-4',
      label: 'leading-7',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      small: 'text-sm leading-5',
      muted: 'text-sm text-muted-foreground',
    },
    color: {
      // Slate color variants
      'slate-50': 'text-slate-50',
      'slate-100': 'text-slate-100',
      'slate-200': 'text-slate-200',
      'slate-300': 'text-slate-300',
      'slate-400': 'text-slate-400',
      'slate-500': 'text-slate-500',
      'slate-600': 'text-slate-600',
      'slate-700': 'text-slate-700',
      'slate-800': 'text-slate-800',
      'slate-900': 'text-slate-900',
      'slate-950': 'text-slate-950', // Custom or extended color in some configurations
      // Primary color variants
      'primary-50': 'text-blue-50',
      'primary-100': 'text-blue-100',
      'primary-200': 'text-blue-200',
      'primary-300': 'text-blue-300',
      'primary-400': 'text-blue-400',
      'primary-500': 'text-blue-500',
      'primary-600': 'text-blue-600',
      'primary-700': 'text-blue-700',
      'primary-800': 'text-blue-800',
      'primary-900': 'text-blue-900',
      'primary-950': 'text-blue-950',
      // Warning color variants
      'warning-50': 'text-yellow-50',
      'warning-100': 'text-yellow-100',
      'warning-200': 'text-yellow-200',
      'warning-300': 'text-yellow-300',
      'warning-400': 'text-yellow-400',
      'warning-500': 'text-yellow-500',
      'warning-600': 'text-yellow-600',
      'warning-700': 'text-yellow-700',
      'warning-800': 'text-yellow-800',
      'warning-900': 'text-yellow-900',
      'warning-950': 'text-yellow-950',
      // Success color variants
      'success-50': 'text-green-50',
      'success-100': 'text-green-100',
      'success-200': 'text-green-200',
      'success-300': 'text-green-300',
      'success-400': 'text-green-400',
      'success-500': 'text-green-500',
      'success-600': 'text-green-600',
      'success-700': 'text-green-700',
      'success-800': 'text-green-800',
      'success-900': 'text-green-900',
      'success-950': 'text-green-950',
      // Error color variants
      'error-50': 'text-red-50',
      'error-100': 'text-red-100',
      'error-200': 'text-red-200',
      'error-300': 'text-red-300',
      'error-400': 'text-red-400',
      'error-500': 'text-red-500',
      'error-600': 'text-red-600',
      'error-700': 'text-red-700',
      'error-800': 'text-red-800',
      'error-900': 'text-red-900',
      'error-950': 'text-red-950',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    color: 'slate-950',
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'label' | 'div' | 'span' | 'legend';
}

const Typography: React.FC<TypographyProps> = ({
  as: Component = 'span',
  className,
  variant = 'paragraph',
  color = 'slate-950',
  ...props
}) => {
  return <Component className={cn(typographyVariants({ variant, color }), className)} {...props} />;
};

export { Typography, typographyVariants };
