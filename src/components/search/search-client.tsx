'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '@/services/client/search';
import { SearchFilters, SearchResults } from '@/@types/db';
import { SearchInput } from './search-input';
import { SearchFiltersPanel } from './search-filters-panel';
import { SearchResultsDisplay } from './search-results-display';
import { SearchEmptyState } from './search-empty-state';
import { SearchAIOverview } from './search-ai-overview';
import { Button } from '@/components/ui/button';
import { Loader2, Filter, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchClientProps {
  initialResults: SearchResults;
  filterOptions: {
    institutions: Array<{ id: string; name: string }>;
    courses: Array<{ id: string; name: string }>;
    years: string[];
    types: string[];
  };
}

export function SearchClient({ initialResults, filterOptions }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Initialize filters from URL or default values
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('query') || '',
    institution: searchParams.get('institution') || '',
    course: searchParams.get('course') || '',
    year: searchParams.get('year') || '',
    type: searchParams.get('type') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showAIOverview, setShowAIOverview] = useState(false);
  
  // Use the custom hook to fetch search results
  const { data, isLoading, error } = useSearch(filters);
  
  // Update URL when filters change
  const updateSearchParams = (newFilters: SearchFilters) => {
    startTransition(() => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });
      router.push(`/dashboard/search?${params.toString()}`);
    });
  };
  
  // Handle search input changes
  const handleSearch = (query: string) => {
    const newFilters = { ...filters, query, page: 1 };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateSearchParams(updatedFilters);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };
  
  // Use initial results or fetched results
  const results = data?.data || initialResults;
  
  // Calculate if we have results
  const hasResults = results && (
    (results.past_questions?.length > 0) || 
    (results.courses?.length > 0) || 
    (results.institutions?.length > 0)
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <SearchInput 
          value={filters.query || ''}
          onChange={handleSearch}
          isLoading={isLoading}
          placeholder="Search for courses, past questions, or legal terms..."
        />
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIOverview(!showAIOverview)}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {showAIOverview ? 'Hide AI Overview' : 'AI Overview'}
          </Button>
          
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters, query: '' };
                setFilters(newFilters);
                updateSearchParams(newFilters);
              }}
              className="text-muted-foreground"
            >
              Clear Search
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SearchFiltersPanel
              filters={filters}
              onChange={handleFilterChange}
              filterOptions={filterOptions}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAIOverview && filters.query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SearchAIOverview query={filters.query} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading && !data ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-red-500">Error loading search results. Please try again.</p>
        </Card>
      ) : hasResults ? (
        <SearchResultsDisplay 
          results={results}
          currentPage={filters.page || 1}
          onPageChange={handlePageChange}
        />
      ) : (
        <SearchEmptyState query={filters.query || ''} />
      )}
    </div>
  );
} 