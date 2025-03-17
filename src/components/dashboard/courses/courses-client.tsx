"use client";

import React, { useEffect, useState } from 'react';
import { Course } from '@/@types/db';
import CourseCard from './course-card';
import CourseFilters from './course-filters';
import CoursesEmpty from './courses-empty';
import Pagination from '@/components/pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCourses } from '@/services/client/courses';

interface CoursesClientProps {
  initialCourses: Course[];
  totalCourses: number;
  initialParams: {
    page: number;
    page_size: number;
    search?: string;
    institution?: string;
    level?: string;
  };
}

const CoursesClient = ({ 
  initialCourses,
  totalCourses,
  initialParams,
}: CoursesClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialParams.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  // If user is actively searching, use client-side fetching
  const { data: coursesData, isLoading } = useCourses({
    params: {
      ...initialParams,
      search: debouncedSearch,
    },
  }, {
    enabled: debouncedSearch !== initialParams.search,
  });

  // The courses to display - either from server or client fetch
  const courses = debouncedSearch !== initialParams.search && coursesData?.data 
    ? coursesData.data 
    : initialCourses;
  
  // Total count for pagination
  const totalCount = debouncedSearch !== initialParams.search && coursesData?.count !== undefined
    ? coursesData.count
    : totalCourses;

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearch === initialParams.search) return;
    
    const params = new URLSearchParams(searchParams?.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    // Reset to page 1 when search changes
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, router, pathname, searchParams, initialParams.search]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  if (courses.length === 0 && !isLoading) {
    return <CoursesEmpty searchTerm={debouncedSearch} />;
  }

  return (
    <div className="space-y-6">
      {/* Search and filters bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile filters button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="pt-4 pb-8">
              <h3 className="text-lg font-semibold mb-4">Filter Courses</h3>
              <CourseFilters className="space-y-6" />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop filters */}
        <div className="hidden sm:flex gap-2">
          <CourseFilters />
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalCount > initialParams.page_size && (
        <Pagination 
          totalPages={Math.ceil(totalCount / initialParams.page_size)}
          currentPage={initialParams.page}
        />
      )}
    </div>
  );
};

export default CoursesClient;
