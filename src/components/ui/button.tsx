import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    // Base styles
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-md hover:shadow-lg',
                secondary:
                    'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50',
                outline:
                    'border-2 border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
                ghost:
                    'hover:bg-gray-100 text-gray-700',
                vitedia:
                    'bg-gradient-to-r from-vitedia-primary to-orange-600 text-white hover:shadow-xl',
                garden:
                    'bg-gradient-to-r from-garden-primary to-green-700 text-white hover:shadow-xl',
            },
            size: {
                sm: 'h-9 px-4 text-sm',
                md: 'h-11 px-6 text-base',
                lg: 'h-14 px-8 text-lg',
                xl: 'h-16 px-10 text-xl',
                icon: 'h-10 w-10',
            },
            rounded: {
                default: 'rounded-lg',
                full: 'rounded-full',
                none: 'rounded-none',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            rounded: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, rounded, loading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, rounded, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
