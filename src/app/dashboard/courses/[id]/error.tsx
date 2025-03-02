'use client'

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
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-10 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
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
                    <button
                        onClick={() => reset()}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
                    >
                        Try again
                    </button>
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