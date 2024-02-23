import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300',
  {
    variants: {
      // @todo: Adapt dark theme.
      variant: {
        primary:
          'border-transparent bg-blue-100 text-blue-600 hover:bg-blue-200/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80',
        slate:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        error:
          'border-transparent bg-red-100 text-red-600 hover:bg-red-200/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80',
        success:
          'border-transparent bg-green-100 text-green-600 hover:bg-green-200/80 dark:bg-green-900 dark:text-gray-50 dark:hover:bg-green-900/80',
        warning:
          'border-transparent bg-yellow-100 text-yellow-600 hover:bg-yellow-200/80 dark:bg-yellow-900 dark:text-gray-50 dark:hover:bg-yellow-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
