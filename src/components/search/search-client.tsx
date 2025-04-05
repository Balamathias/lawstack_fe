'use client';

import React, { useState, useEffect } from 'react';
import { SearchInput } from './search-input';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsDisplay } from './search-results-display';
import { SearchEmptyState } from './search-empty-state';
import { SearchAIOverview } from './search-ai-overview';
import { SearchParams, FilterOptions } from '@/services/server/search';
import { useSearch, useSearchFilterOptions } from '@/services/client/search';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, History, Sparkles, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SearchResults } from '@/@types/db';

interface SearchClientProps {
  initialResults: SearchResults;
  filterOptions: FilterOptions;
}

export function SearchClient({ initialResults, filterOptions: initialFilterOptions }: SearchClientProps) {
  // State for search parameters and UI
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Omit<SearchParams, 'query' | 'page' | 'limit'>>({ 
    institution: '', 
    course: '', 
    year: '', 
    type: '' 
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Debounce the search query to prevent too many API calls
  const debouncedQuery = useDebounce(query, 500);
  
  // Create the complete search params object with query, page and filters
  const searchParams: SearchParams = {
    ...(debouncedQuery ? { query: debouncedQuery } : {}),
    page,
    limit: 10
  };

  // Add non-empty filters
  // Object.entries(filters).forEach(([key, value]) => {
  //   if (value && value !== '') {
  //     searchParams[(key as keyof SearchParams)] = value;
  //   }
  // });

  // Check if we have any active search criteria
  const hasSearchCriteria = Boolean(
    debouncedQuery || Object.values(filters).some(f => f && f !== '')
  );

  // Use React Query hooks for fetching data
  const { 
    data: searchResponse,
    isPending: isSearching,
    isFetching: isRefetching,
    error: searchError
  } = useSearch(searchParams);

  const { 
    data: filterOptionsResponse,
    error: filtersError 
  } = useSearchFilterOptions();

  // Handle errors
  useEffect(() => {
    if (searchError) {
      console.error('Search error:', searchError);
      toast.error('Error performing search. Please try again.');
    }
    
    if (filtersError) {
      console.error('Error loading filters:', filtersError);
      toast.error('Error loading search filters.');
    }
  }, [searchError, filtersError]);

  // Derive state from query responses
  const results = searchResponse?.data || initialResults;
  const actualFilterOptions = filterOptionsResponse?.data || initialFilterOptions;
  const isLoading = isSearching || isRefetching;
  
  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    console.log('Updating filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="space-y-5 pb-16">
      {/* Search bar with floating effect */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SearchInput 
          value={query} 
          onChange={setQuery} 
          isLoading={isLoading}
          placeholder="Search for courses, past questions, topics..."
        />
      </motion.div>
      
      {/* Filters toggle and AI assist */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <Button
          variant="outline"
          className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-primary/20 text-primary w-5 h-5 rounded-full text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-lg">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Recent Searches</span>
          </Button>
          
          <Button className="gap-2 bg-primary/90 hover:bg-primary text-primary-foreground rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assist</span>
          </Button>
        </div>
      </div>
      
      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <SearchFiltersPanel 
              filters={filters} 
              onChange={handleFilterChange} 
              filterOptions={actualFilterOptions}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Overview for searches */}
      {debouncedQuery && results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SearchAIOverview query={debouncedQuery} />
        </motion.div>
      )}
      
      {/* Results display */}
      {results ? (
        <SearchResultsDisplay 
          results={results} 
          onPageChange={handlePageChange}
          currentPage={page}
        />
      ) : debouncedQuery || activeFilterCount > 0 ? (
        <SearchEmptyState 
          query={debouncedQuery} 
          onClearFilters={() => {
            setFilters({ institution: '', course: '', year: '', type: '' });
            if (!debouncedQuery) setQuery('');
          }}
        />
      ) : null}
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-5 sm:right-10 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-20 hover:bg-primary/90 transition-all"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}