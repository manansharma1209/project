import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Button = forwardRef(({ className, variant = 'primary', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-1',
        {
          'bg-gray-900 text-white hover:bg-gray-800': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'bg-green-600 text-white hover:bg-green-700': variant === 'success',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';