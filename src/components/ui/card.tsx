
'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    hover?: boolean;
    padded?: boolean;
}

/**
 * Composant Card TEDSAI
 * Conteneur polyvalent pour le contenu
 * 
 * Variantes:
 * - default: Fond blanc, ombre légère
 * - elevated: Fond blanc, ombre portée plus forte
 * - outlined: Fond transparent, bordure visible
 * - glass: Effet verre dépoli (pour superpositions)
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            hover = false,
            padded = true,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = clsx(
            'rounded-2xl overflow-hidden transition-all duration-300',
            {
                'p-6': padded,
                'cursor-pointer': hover,
            }
        );

        const variantStyles = {
            default: 'bg-[var(--color-surface)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)]',
            elevated: 'bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)]',
            outlined: 'bg-transparent border-2 border-[var(--color-border)]',
            glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-[var(--shadow-sm)]',
        };

        const hoverStyles = hover
            ? 'hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-primary-200)]'
            : '';

        return (
            <motion.div
                ref={ref}
                initial={false}
                className={clsx(baseStyles, variantStyles[variant], hoverStyles, className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={clsx("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={clsx("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={clsx("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={clsx("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

