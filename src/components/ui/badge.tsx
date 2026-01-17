import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'vitedia' | 'garden' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                    {
                        'bg-gray-100 text-gray-800': variant === 'default',
                        'bg-green-100 text-green-800': variant === 'success',
                        'bg-yellow-100 text-yellow-800': variant === 'warning',
                        'bg-red-100 text-red-800': variant === 'error',
                        'bg-blue-100 text-blue-800': variant === 'info',
                        'bg-vitedia-bg text-vitedia-primary': variant === 'vitedia',
                        'bg-garden-bg text-garden-primary': variant === 'garden',
                        'bg-transparent border border-gray-200 text-gray-700': variant === 'outline',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';

export { Badge };
