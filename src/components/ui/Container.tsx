import React from 'react';
import { clsx } from 'clsx';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
    children: React.ReactNode;
}

/**
 * Composant Container
 * Centre le contenu avec une largeur max définie
 */
export const Container: React.FC<ContainerProps> = ({
    size = 'lg',
    className,
    children,
    ...props
}) => {
    const sizes = {
        sm: 'max-w-[var(--container-md)]',  // lecture
        md: 'max-w-[var(--container-xl)]',  // contenu standard
        lg: 'max-w-[var(--container-5xl)]', // large standard
        xl: 'max-w-[var(--container-7xl)]', // full width avec padding
        full: 'max-w-full',
    };

    return (
        <div
            className={clsx(
                'mx-auto px-4 sm:px-6 lg:px-8 w-full',
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'alternate' | 'primary' | 'dark';
    spacing?: 'none' | 'sm' | 'base' | 'lg';
    className?: string;
    children: React.ReactNode;
}

/**
 * Composant Section
 * Wrapper pour les sections de page avec background et spacing
 */
export const Section: React.FC<SectionProps> = ({
    variant = 'default',
    spacing = 'base',
    className,
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-[var(--color-background)]',
        alternate: 'bg-[var(--color-background-pure)]', // Blanc pur sur fond blanc cassé
        primary: 'bg-[var(--color-primary)] text-white',
        dark: 'bg-[var(--color-secondary)] text-white',
    };

    const spacings = {
        none: 'py-0',
        sm: 'py-8 md:py-12',
        base: 'py-12 md:py-20',
        lg: 'py-20 md:py-32',
    };

    return (
        <section
            className={clsx(
                'w-full relative overflow-hidden',
                variants[variant],
                spacings[spacing],
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
};
