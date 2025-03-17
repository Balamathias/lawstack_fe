import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CoursesEmptyProps {
  searchTerm?: string;
}

const CoursesEmpty = ({ searchTerm }: CoursesEmptyProps) => {
  return (
    <div className="border rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        {searchTerm ? (
          <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
            <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        ) : (
          <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">
        {searchTerm 
          ? `No results for "${searchTerm}"`
          : "No courses found"
        }
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchTerm 
          ? "Try adjusting your search or filters to find what you're looking for."
          : "There are no courses available for your selection criteria."
        }
      </p>
      
      {searchTerm && (
        <Link href="/dashboard/courses">
          <Button variant="outline">Clear search and filters</Button>
        </Link>
      )}
    </div>
  );
};

export default CoursesEmpty;
