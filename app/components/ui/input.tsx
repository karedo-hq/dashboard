'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
      <div
        className={cn(
          'relative flex w-full items-center rounded-md border bg-white transition duration-150 ease-in-out',
          isFocused
            ? 'border-blue-400 ring ring-blue-400 ring-opacity-50'
            : 'border-gray-200 dark:border-gray-800',
          'dark:bg-gray-950',
          className,
        )}
      >
        {startAdornment && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {startAdornment}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none',
            startAdornment ? 'pl-8' : 'pl-3',
            endAdornment ? 'pr-8' : 'pr-3',
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {endAdornment && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
