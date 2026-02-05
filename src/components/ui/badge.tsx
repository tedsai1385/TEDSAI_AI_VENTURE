import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
    size?: 'sm' | 'md';
}

/**
 * Composant Badge TEDSAI
 * Pour afficher des statuts, étiquettes ou catégories
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            className,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'inline-flex items-center font-medium rounded-full';

        const sizeStyles = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-3 py-1 text-sm',
        };

        const variantStyles = {
            primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-dark)]',
            secondary: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary)]',
            accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-dark)]',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            error: 'bg-red-100 text-red-800',
            outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)]',
        };

        return (
            <span
                ref={ref}
                className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
