'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

import { useRouter } from 'nextjs-toploader/app'

interface PaginationProps {
    totalPages: number
    initialPage?: number
    className?: string
}

const Pagination = ({ totalPages, initialPage = 1, className }: PaginationProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(initialPage)
    const { theme } = useTheme()

    // Get current page from URL on component mount
    useEffect(() => {
        const page = searchParams.get('page')
        if (page) {
            const pageNum = parseInt(page, 10)
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                setCurrentPage(pageNum)
            }
        }
    }, [searchParams, totalPages])

    // Update URL when page changes
    const handlePageChange = useCallback((page: number) => {
        if (page < 1 || page > totalPages) return
        
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`?${params.toString()}`)
        setCurrentPage(page)
    }, [router, searchParams, totalPages])

    // Generate page numbers to display
    const getPageNumbers = () => {
        const maxPagesToShow = 5
        let pages = []
        
        if (totalPages <= maxPagesToShow) {
            // If we have few pages, show all of them
            pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        } else {
            // Otherwise, show a subset with current page in the middle when possible
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
            
            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1)
            }
            
            pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
        }
        
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className={cn('flex items-center justify-center space-x-2 my-8', className)}>
            <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                           dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="First page"
            >
                <ChevronsLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                           dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-1">
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3.5 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                            currentPage === page 
                            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg' 
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                           dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                           dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Last page"
            >
                <ChevronsRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
        </div>
    )
}

export default Pagination