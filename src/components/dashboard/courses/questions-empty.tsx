import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionsEmptyProps {
  searchTerm?: string;
  year?: string;
}

const QuestionsEmpty = ({ searchTerm, year }: QuestionsEmptyProps) => {
  const isFiltered = searchTerm || year;

  return (
    <div className="border rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        {isFiltered ? (
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
        {isFiltered 
          ? "No matching questions found"
          : "No questions available"
        }
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {isFiltered 
          ? "Try adjusting your search criteria or filters to find past questions for this course."
          : "There are no past questions available for this course yet. Check back later for updates."
        }
      </p>
      
      {isFiltered && (
        <Button 
          variant="outline" 
          onClick={() => window.location.href = window.location.pathname}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default QuestionsEmpty;
