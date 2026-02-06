'use client';

import { motion, MotionProps } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { ReactNode } from 'react';

interface MobileSafeMotionProps extends MotionProps {
    children: ReactNode;
    // Désactiver complètement sur mobile
    disableOnMobile?: boolean;
    // Réduire l'amplitude sur mobile
    reduceMotion?: boolean;
}

export function MobileSafeMotion({
    children,
    disableOnMobile = false,
    reduceMotion = true,
    initial,
    animate,
    whileHover,
    whileTap,
    transition,
    ...props
}: MobileSafeMotionProps) {
    const isMobile = useIsMobile();

    // Désactiver totalement si demandé
    if (disableOnMobile && isMobile) {
        return <>{children}</>;
    }

    // Réduire les animations sur mobile
    const mobileSafeTransition = isMobile && reduceMotion
        ? { duration: 0.2, ease: "linear" }
        : transition;

    const mobileSafeInitial = isMobile && reduceMotion && typeof initial === 'object'
        ? { opacity: 0.8, y: 5 } // Subtil au lieu de 20
        : initial;

    return (
        <motion.div
            initial={mobileSafeInitial}
            animate={animate}
            whileHover={isMobile ? undefined : whileHover} // Pas de hover sur mobile
            whileTap={whileTap}
            transition={mobileSafeTransition}
            {...props}
        >
            {children}
        </motion.div>
    );
}
