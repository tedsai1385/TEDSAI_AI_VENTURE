import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variantes optimisées mobile
const buttonVariants = cva(
    // Base styles avec touch target minimum
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                // ═══════════════════════════════════════════════════════════════
                // TAILLES MOBILE-OPTIMISÉES
                // ═══════════════════════════════════════════════════════════════

                // Desktop: normal, Mobile: plus compact
                default: "h-9 px-4 py-2 text-sm sm:h-10 sm:px-5 sm:text-base",

                // Desktop: petit, Mobile: encore plus petit
                sm: "h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm",

                // Desktop: grand, Mobile: normal
                lg: "h-10 px-5 text-sm sm:h-11 sm:px-6 sm:text-base",

                // Desktop: très grand, Mobile: grand
                xl: "h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg",

                // Icône seule - toujours carré
                icon: "h-9 w-9 sm:h-10 sm:w-10",
            },
            // ═══════════════════════════════════════════════════════════════
            // PROP MOBILE SPÉCIFIQUE
            // ═══════════════════════════════════════════════════════════════
            mobile: {
                default: "",
                // Force taille très réduite pour mobile
                compact: "h-7 px-2.5 py-1 text-xs sm:h-9 sm:px-4 sm:text-sm",
                // Pleine largeur sur mobile
                full: "w-full h-10 sm:w-auto sm:h-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            mobile: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, mobile, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, mobile, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
