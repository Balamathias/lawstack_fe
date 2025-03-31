'use client'

import React, { useCallback, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';
import BaseFilter from './base-filter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'nextjs-toploader/app'

export const FilterByYear = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  // Get current year for generating years list
  const currentYear = new Date().getFullYear();
  
  // Generate years from 1990 to current year, chunked by responsive amounts
  const allYears = Array.from({ length: currentYear - 2009 + 1 }, (_, i) => (currentYear - i).toString());
  
  // Responsive chunking - fewer years per page on mobile
  const chunkSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 12;
  
  const chunkedYears = allYears.reduce((acc, year, i) => {
    const chunkIndex = Math.floor(i / chunkSize);
    acc[chunkIndex] = [...(acc[chunkIndex] || []), year];
    return acc;
  }, [] as string[][]);
  
  // Get selected year from URL
  const selectedYear = searchParams?.get('year') || '';

  // Create new search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  // Handle year selection
  const handleYearClick = (year: string) => {
    const queryString = createQueryString({
      year: selectedYear === year ? null : year
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  // Calculate if we can go to next/prev page
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < chunkedYears.length - 1;

  const activeYears = chunkedYears[currentPage] || [];
  
  return (
    <BaseFilter 
      title="Filter by Year" 
      icon={CalendarRange} 
      defaultOpen={!!selectedYear}
      badge={selectedYear && (
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-normal">
          {selectedYear}
        </Badge>
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Select a year</span>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2"
          key={currentPage}
          initial={{ opacity: 0, x: currentPage > 0 ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeYears.map((year) => (
            <Badge
              key={year}
              variant="outline"
              className={cn(
                "py-2 cursor-pointer hover:bg-primary/10 text-center transition-colors",
                selectedYear === year
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-card"
              )}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </Badge>
          ))}
        </motion.div>
        
        {/* Pagination dots */}
        {chunkedYears.length > 1 && (
          <div className="flex items-center justify-center gap-1 mt-1">
            {chunkedYears.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  currentPage === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </BaseFilter>
  );
};