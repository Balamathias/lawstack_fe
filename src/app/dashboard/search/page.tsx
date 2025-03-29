import React from 'react';
import { searchContent, getSearchFilterOptions } from '@/services/server/search';
import { SearchClient } from '@/components/search/search-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Search | LawStack',
  description: 'Search through courses, past questions, and legal resources',
};

export default async function SearchPage() {
  // Fetch initial data and filter options server-side
  const initialFilters = {
    query: '',
    page: 1,
    limit: 10
  };
  
  const [searchResults, filterOptions] = await Promise.all([
    searchContent(initialFilters),
    getSearchFilterOptions()
  ]);
  
  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto animate-fade-in p-3 py-10 sm:p-8 pb-20 max-lg:pt-14">
      <div className="flex flex-col space-y-4">
        <h1 className="sm:text-3xl text-xl font-bold tracking-tight">Advanced Search</h1>
        <p className="text-muted-foreground">
          Search across courses, past questions, and legal resources
        </p>
      </div>
      
      <SearchClient 
        initialResults={searchResults.data}
        filterOptions={filterOptions.data}
      />
    </div>
  );
} 