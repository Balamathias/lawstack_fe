'use client';

import React from 'react';
import { SearchX, FileSearch, Sparkles, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface SearchEmptyStateProps {
  query: string;
  onClearFilters: () => void;
}

export function SearchEmptyState({ query, onClearFilters }: SearchEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-10"
    >
      <Card className="border-dashed border-border/70 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl transform scale-150"></div>
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-full border border-primary/20 shadow-md">
                <SearchX className="h-10 w-10 text-primary" />
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {query ? (
                <>We couldn't find any matches for <span className="font-medium">"{query}"</span></>
              ) : (
                <>No results match your current filter settings</>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button 
                onClick={onClearFilters} 
                variant="outline" 
                className="gap-2 border-primary/20 hover:bg-primary/5"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
              
              <Button className="gap-2 bg-primary/90 hover:bg-primary">
                <Sparkles className="h-4 w-4" />
                Try AI Suggestions
              </Button>
            </div>
            
            {/* Search tips */}
            <div className="mt-8 max-w-lg w-full border-t border-border/40 pt-6">
              <h4 className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
                <FileSearch className="h-4 w-4 text-primary" />
                Search Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Try using more general keywords
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Check spelling of search terms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-medium">•</span>
                  Try searching for related topics
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}