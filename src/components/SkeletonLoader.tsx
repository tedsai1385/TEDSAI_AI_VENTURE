import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoader({ className }: { className?: string }) {
    return <Skeleton className={className} />
}
