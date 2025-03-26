'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Search, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  const suggestions = [
    "Try searching for specific legal terms (e.g., 'habeas corpus')",
    "Include the name of a legal case (e.g., 'Brown v. Board')",
    "Search for course names (e.g., 'Constitutional Law')",
    "Use broader terms if your search is too specific",
    "Check the spelling of complex legal terminology"
  ];
  
  return (
    <Card className="border-dashed border-2 border-border">
      <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary/5 p-4 rounded-full mb-4">
            <Search className="h-12 w-12 text-primary/50" />
          </div>
        </motion.div>
        
        <h3 className="text-xl font-semibold mt-4">
          {query ? (
            <>No results found for <span className="text-primary">"{query}"</span></>
          ) : (
            <>Enter a search term to begin</>
          )}
        </h3>
        
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          {query ? (
            <>Try adjusting your search terms or filters to find what you're looking for.</>
          ) : (
            <>Search for legal topics, concepts, case law, or course materials.</>
          )}
        </p>
        
        {query && (
          <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium text-sm">Search Tips</h4>
            </div>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 