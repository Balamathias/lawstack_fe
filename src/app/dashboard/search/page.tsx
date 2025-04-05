import React from 'react';
import { searchContent, getSearchFilterOptions, SearchParams } from '@/services/server/search';
import { SearchClient } from '@/components/search/search-client';
import { Metadata } from 'next';
import { SearchIcon, BookOpen, FileText, School } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advanced Search | LawStack',
  description: 'Search through courses, past questions, and legal resources',
};

export default async function SearchPage() {
  // Fetch initial data and filter options server-side
  const initialParams: SearchParams = {
    page: 1,
    limit: 10
  };
  
  try {
    const [searchResults, filterOptions] = await Promise.all([
      searchContent(initialParams),
      getSearchFilterOptions()
    ]);
    
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in p-3 py-10 sm:p-8 pb-20 max-lg:pt-14">
        {/* Hero section with background pattern */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 sm:p-8 border border-primary/20 shadow-sm">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%)] bg-[length:8px_8px]"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col max-w-4xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Advanced Search</h1>
            </div>
            
            <p className="text-muted-foreground sm:text-lg max-w-3xl">
              Search across LawStack's comprehensive database of courses, past questions, and legal resources to find exactly what you need for your legal studies.
            </p>
            
            {/* Search categories */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm py-2 px-3 rounded-lg border border-border/60 text-sm">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Courses</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm py-2 px-3 rounded-lg border border-border/60 text-sm">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Past Questions</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm py-2 px-3 rounded-lg border border-border/60 text-sm">
                <School className="h-4 w-4 text-amber-500" />
                <span>Resources</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-6">
          <SearchClient 
            initialResults={searchResults.data}
            filterOptions={filterOptions.data}
          />
        </div>
        
        {/* Footer gradient */}
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10 opacity-80" />
      </div>
    );
  } catch (error) {
    console.error("Error loading search page:", error);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-5">
        <div className="bg-destructive/10 p-3 rounded-full mb-4">
          <SearchIcon className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Search Service Unavailable</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We're experiencing difficulties with the search service. Please try again later.
        </p>
        <p className="text-sm text-muted-foreground">Error: {(error as Error).message}</p>
      </div>
    );
  }
}