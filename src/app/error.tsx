'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h2 className="mb-4 text-3xl font-bold text-red-600">Oups ! Une erreur est survenue.</h2>
            <p className="mb-8 text-gray-600 max-w-md">
                {error.message || "Une erreur inattendue s'est produite."}
            </p>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                variant="outline"
            >
                Réessayer
            </Button>
        </div>
    )
}
