"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Question } from '@/@types/db';
import { useQuestions } from '@/services/client/question';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import QuestionsList from '@/components/dashboard/courses/questions-list';
import QuestionsSkeleton from '@/components/dashboard/courses/questions-skeleton';
import QuestionsEmpty from '@/components/dashboard/courses/questions-empty';

interface CourseQuestionsProps {
  courseId: string;
  initialParams: {
    page: number;
    page_size: number;
    search?: string;
    year?: string;
    course: string;
  };
}

const CourseQuestions = ({ courseId, initialParams }: CourseQuestionsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [year, setYear] = useState(initialParams.year || '');
  const [activeTab, setActiveTab] = useState('questions');

  // Generate a range of years from current year to 10 years ago
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

  // Fetch questions
  const { data, isLoading } = useQuestions({ 
    params: { 
      ...initialParams,
      search: debouncedSearch,
      year: year
    } 
  });

  const questions = data?.data || [];
  const totalQuestions = data?.count || 0;

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    if (
      debouncedSearch === initialParams.search && 
      year === initialParams.year
    ) return;
    
    const params = new URLSearchParams(searchParams?.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    if (year) {
      params.set('year', year);
    } else {
      params.delete('year');
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, year, router, pathname, searchParams, initialParams]);

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setYear('');
  };

  const hasActiveFilters = searchTerm || year;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Course Materials</CardTitle>
        <CardDescription>Past questions and study materials for this course</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="questions">Past Questions</TabsTrigger>
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="reviews">Course Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search past questions..." 
                  className="pl-10 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="relative w-[130px]">
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="pl-8">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Year</SelectItem>
                      {years.map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Questions List */}
            {isLoading ? (
              <QuestionsSkeleton />
            ) : questions.length === 0 ? (
              <QuestionsEmpty searchTerm={debouncedSearch} year={year} />
            ) : (
              <>
                <QuestionsList questions={questions} />
                
                {/* Pagination */}
                {totalQuestions > initialParams.page_size && (
                  <div className="mt-6">
                    <Pagination 
                      totalPages={Math.ceil(totalQuestions / initialParams.page_size)}
                      currentPage={initialParams.page}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="materials">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-3">
                <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Study Materials Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're working on adding lecture notes, textbook recommendations, and other study materials for this course.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-3">
                <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Course Reviews Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Student reviews and ratings for this course will be available soon. Check back later for insights from your peers.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CourseQuestions;

// Star icon component
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
