'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

const levelOptions = [
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' },
  { value: '500', label: '500 Level' },
];

const SearchCourse: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
    // Initialize state from URL params to avoid unnecessary navigation
    const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
    const [isFocused, setIsFocused] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(searchParams?.get('level'));
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    // Use debounce to prevent excessive renders
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Build URL with filters without triggering navigation
    const createQueryString = useCallback(
      (params: Record<string, string | null>) => {
        const newSearchParams = new URLSearchParams(searchParams?.toString());
        
        // Update or remove params based on values
        Object.entries(params).forEach(([key, value]) => {
          if (value === null || value === '') {
            newSearchParams.delete(key);
          } else {
            newSearchParams.set(key, value);
          }
        });
        
        return newSearchParams.toString();
      },
      [searchParams]
    );

    // Handle debounced search term changes
    useEffect(() => {
      // Only update if the value has actually changed from current URL
      const currentSearchParam = searchParams?.get('search') || '';
      if (debouncedSearchTerm !== currentSearchParam) {
        const newQueryString = createQueryString({ search: debouncedSearchTerm || null });
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      }
    }, [debouncedSearchTerm, pathname, router, createQueryString, searchParams]);

    // Initialize active filters from URL
    useEffect(() => {
      const level = searchParams?.get('level');
      
      // Reset active filters
      const newFilters: string[] = [];
      
      if (level) {
        newFilters.push(`Level: ${level}`);
      }
      
      // Only update if different to avoid render loops
      if (JSON.stringify(newFilters) !== JSON.stringify(activeFilters)) {
        setActiveFilters(newFilters);
      }
    }, [searchParams, activeFilters]);

    const handleClear = () => {
        setSearchTerm('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Direct submission not needed as we're using debounce
    };
    
    const applyLevelFilter = (level: string) => {
      // Don't update if already selected
      if (level === selectedLevel) return;
      
      setSelectedLevel(level);
      const newQueryString = createQueryString({ level });
      router.push(`${pathname}?${newQueryString}`, { scroll: false });
    };
    
    const clearFilter = (filter: string) => {
      if (filter.startsWith('Level:')) {
        setSelectedLevel(null);
        const newQueryString = createQueryString({ level: null });
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      }
    };
    
    const clearAllFilters = () => {
      // Only clear if there are filters
      if (activeFilters.length === 0) return;
      
      setActiveFilters([]);
      setSelectedLevel(null);
      
      // Keep only search term
      const newSearchParams = new URLSearchParams();
      if (searchTerm) newSearchParams.set('search', searchTerm);
      router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full mb-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <div className={`relative rounded-xl ${isFocused ? 'ring-2 ring-primary/50' : ''}`}>
                            <form 
                                onSubmit={handleSubmit}
                                className="relative bg-card rounded-lg overflow-hidden flex items-center p-2 shadow-sm border border-border">
                                <Search
                                    className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <input
                                    type="text"
                                    placeholder="Search for courses by name, code, or description..."
                                    className="w-full border-none focus:outline-none bg-transparent py-2 px-4 text-foreground placeholder:text-muted-foreground ring-0 focus-within:ring-0 focus:ring-0"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                {searchTerm && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={handleClear}
                                        className="flex-shrink-0 mr-2 p-1 rounded-full hover:bg-secondary/80"
                                        aria-label="Clear search"
                                        type='button'
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </motion.button>
                                )}
                            </form>
                        </div>
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1 h-[42px] whitespace-nowrap">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Level</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {levelOptions.map((level) => (
                                    <DropdownMenuItem 
                                        key={level.value}
                                        onClick={() => applyLevelFilter(level.value)}
                                        className={cn(
                                            "cursor-pointer",
                                            selectedLevel === level.value && "bg-primary/10 text-primary font-medium"
                                        )}
                                    >
                                        {level.label}
                                        {selectedLevel === level.value && (
                                            <span className="ml-auto">
                                                <Check className="h-4 w-4" />
                                            </span>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                {activeFilters.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={clearAllFilters}
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            Clear all filters
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                
                {/* Active filters display */}
                <AnimatePresence>
                    {activeFilters.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2"
                        >
                            {activeFilters.map(filter => (
                                <Badge 
                                    key={filter} 
                                    variant="secondary"
                                    className="flex items-center gap-1 px-2 py-1"
                                >
                                    {filter}
                                    <X 
                                        className="h-3 w-3 cursor-pointer ml-1" 
                                        onClick={() => clearFilter(filter)}
                                    />
                                </Badge>
                            ))}
                            {activeFilters.length > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs h-6"
                                    onClick={clearAllFilters}
                                >
                                    Clear all
                                </Button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchCourse;