import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Composant Button TEDSAI
 * Basé sur le design system consolidé
 * 
 * Variantes:
 * - primary: Vert Forêt (Actions principales)
 * - secondary: Bleu Nuit (Actions secondaires)
 * - ghost: Transparent (Actions tertiaires)
 * - accent: Or Chaud (Actions premium)
 * - outline: Bordure seule
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            loading = false,
            disabled = false,
            leftIcon,
            rightIcon,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = clsx(
            'inline-flex items-center justify-center',
            'font-medium rounded-lg',
            'transition-all duration-250',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            {
                'w-full': fullWidth,
                'cursor-wait': loading,
            }
        );

        const variantStyles = {
            primary: clsx(
                'bg-[var(--color-primary)] text-white',
                'hover:bg-[var(--color-primary-light)]',
                'focus:ring-[var(--color-primary)]',
                'shadow-md hover:shadow-lg',
                'active:scale-95'
            ),
            secondary: clsx(
                'bg-[var(--color-secondary)] text-white',
                'hover:bg-[var(--color-secondary-light)]',
                'focus:ring-[var(--color-secondary)]',
                'shadow-md hover:shadow-lg',
                'active:scale-95'
            ),
            ghost: clsx(
                'bg-transparent text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-primary-50)]',
                'focus:ring-[var(--color-primary)]',
                'active:scale-95'
            ),
            outline: clsx(
                'bg-transparent text-[var(--color-text-primary)]',
                'border-2 border-[var(--color-border)]',
                'hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary)]',
                'focus:ring-[var(--color-primary)]',
                'active:scale-95'
            ),
            accent: clsx(
                'bg-[var(--color-accent)] text-white',
                'hover:bg-[var(--color-accent-light)]',
                'focus:ring-[var(--color-accent)]',
                'shadow-[var(--shadow-accent)] hover:shadow-xl',
                'active:scale-95'
            ),
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm gap-1.5',
            md: 'px-5 py-2.5 text-base gap-2',
            lg: 'px-7 py-3.5 text-lg gap-2.5',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={clsx(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
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
                {!loading && leftIcon && <span>{leftIcon}</span>}
                <span>{children}</span>
                {!loading && rightIcon && <span>{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
