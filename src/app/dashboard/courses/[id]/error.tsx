'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
                        Oops! Something went wrong
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                    {error.digest && (
                        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={() => reset()}
                        className="rounded-full"
                    >
                        Try again
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        If this issue persists, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    )
}