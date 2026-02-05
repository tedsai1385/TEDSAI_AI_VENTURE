import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProviderProps {
    children: React.ReactNode;
    delayDuration?: number;
}

const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>

const Tooltip = ({ children, delayDuration }: { children: React.ReactNode; delayDuration?: number }) => (
    <div className="relative group inline-block">{children}</div>
)

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
    ({ className, asChild, ...props }, ref) => (
        <div ref={ref} className={cn("inline-block", className)} {...props} />
    )
)
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { side?: string }
>(({ className, children, side = "bottom", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "absolute z-50 overflow-hidden rounded-md border bg-gray-900 px-3 py-1.5 text-xs text-white shadow-xl animate-in fade-in-0 zoom-in-95",
            "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200",
            side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            className
        )}
        {...props}
    >
        {children}
    </div>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
