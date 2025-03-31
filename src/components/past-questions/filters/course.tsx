'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, School } from 'lucide-react';
import BaseFilter from './base-filter';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useGetCourses } from '@/services/client/courses';
import { useRouter } from 'nextjs-toploader/app'

interface Course {
  id: string;
  name: string;
  code?: string;
  level?: number;
}

export const FilterByCourse = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Get selected course from URL
  const selectedCourseId = searchParams?.get('course') || '';

  // Use client-side data fetching hook
  const { data: coursesResponse, isLoading, error } = useGetCourses();
  const courses = coursesResponse?.data || [];

  // Auto-focus search input when filter opens
  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, []);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  // Handle course selection
  const handleCourseClick = (courseId: string) => {
    const queryString = createQueryString({
      course: selectedCourseId === courseId ? null : courseId
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };
  
  // Handle searchQuery change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Find selected course
  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (course.code && course.code.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : courses;
    
  // Group courses by level
  const coursesByLevel: Record<string, Course[]> = {};
  
  filteredCourses.forEach(course => {
    const level = course.level?.toString() || 'Other';
    if (!coursesByLevel[level]) {
      coursesByLevel[level] = [];
    }
    coursesByLevel[level].push(course);
  });
  
  // Sort levels
  const sortedLevels = Object.keys(coursesByLevel).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return parseInt(a) - parseInt(b);
  });

  if (isLoading) {
    return <CourseFilterSkeleton />;
  }

  if (error || !courses) {
    return (
      <BaseFilter 
        title="Course" 
        icon={School}
        defaultOpen={false}
      >
        <div className="text-sm text-muted-foreground text-center py-4">
          Failed to load courses
        </div>
      </BaseFilter>
    );
  }
  
  return (
    <BaseFilter 
      title="Course" 
      icon={School}
      defaultOpen={!!selectedCourseId}
      contentClassName="pb-2"
      badge={selectedCourse && (
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs font-normal truncate max-w-[120px]">
          {selectedCourse.code || selectedCourse.name}
        </Badge>
      )}
    >
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search courses by name or code"
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-6 border rounded-lg bg-muted/10">
          <BookOpen className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-muted-foreground">No courses found</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 pb-1">
          {sortedLevels.map(level => (
            <div key={level} className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 sticky top-0 bg-card z-10 py-1 backdrop-blur-sm">
                <Badge variant="outline" className="py-0.5">{level === 'Other' ? level : `${level} Level`}</Badge>
                <span className="text-xs text-muted-foreground">
                  ({coursesByLevel[level].length} {coursesByLevel[level].length === 1 ? 'course' : 'courses'})
                </span>
              </h4>
              
              <div className="grid grid-cols-1 gap-1.5">
                {coursesByLevel[level].map(course => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-md cursor-pointer border",
                      selectedCourseId === course.id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-accent hover:border-primary/30"
                    )}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {course.code && (
                        <Badge variant="outline" className="bg-primary/5 border-primary/20 whitespace-nowrap">
                          {course.code}
                        </Badge>
                      )}
                      <span className="text-sm truncate">{course.name}</span>
                    </div>
                    
                    {selectedCourseId === course.id && (
                      <Badge variant="default" className="ml-2 whitespace-nowrap text-xs">Selected</Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseFilter>
  );
};

// Skeleton for loading state
export const CourseFilterSkeleton = () => (
  <div className="space-y-4">
    <div className="relative mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/40" />
      <Skeleton className="h-10 w-full" />
    </div>
    
    <div className="space-y-4">
      {[1, 2].map(group => (
        <div key={group} className="space-y-2">
          <Skeleton className="h-5 w-16" />
          
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const FilterByCourseSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    
    <div className="p-4 pt-1 border-t">
      <CourseFilterSkeleton />
    </div>
  </div>
);