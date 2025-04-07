import { getCourses } from '@/services/server/courses';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { GraduationCap, CalendarDays, BookOpen, Clock } from 'lucide-react';
import Empty from '../empty';
import { truncateString } from '@/lib/utils';
import Pagination from '../pagination';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Props {
  searchParams: Record<string, any>;
}

const ExploreCourses = async ({ searchParams }: Props) => {
  const { data: courses, count, error } = await getCourses({
    params: {
      ordering: '-created_at',
      page_size: 12,
      ...searchParams,
    }
  });

  if (!courses?.length || error) {
    return (
        <div className='flex flex-col gap-4 mt-12'>
            <Empty
                title="No courses found"
                content={"We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms."}
                icon={<BookOpen className="h-16 w-16 text-amber-500" />}
                color="amber"
                action={
                  <Link href="/dashboard/courses">
                    <Button className="mt-4">View all courses</Button>
                  </Link>
                }
            />
        </div>
    )
  }

  // Map level to a color for visual distinction
  const getLevelColor = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch(numLevel) {
      case 100: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800';
      case 200: return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800';
      case 300: return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-800';
      case 400: return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800';
      case 500: return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  // Get human readable label for level
  const getLevelLabel = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    return `${numLevel} Level`;
  };

  const featuredCourses = courses.slice(0, Math.min(3, courses.length));
  const remainingCourses = courses.slice(Math.min(3, courses.length));

  return (
    <div className="space-y-10">
      {/* Featured section */}
      {featuredCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full"></div>
            <h2 className="text-2xl font-bold text-foreground">Featured Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredCourses.map(({ id, name, description, level, duration, code, institution_name }) => (
              <div key={id} className="h-full">
                <Link href={`/dashboard/courses/${id}`}>
                  <Card className="h-full overflow-hidden group transition-all hover:shadow-lg border-border hover:border-primary/30 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 transform origin-left"></div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className={`${getLevelColor(level)} text-xs font-medium shadow-sm border`}>
                        {getLevelLabel(level)}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-2 pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <GraduationCap size={20} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">{code}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {name}
                      </h3>
                      
                      {institution_name && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          {institution_name}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground line-clamp-3 text-sm">{description}</p>
                      
                      <div className="text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary/70" />
                          <span>{duration} year{parseInt(duration) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-3 flex justify-between items-center bg-muted/20">
                      <Badge variant="secondary" className="hover:bg-primary/20 cursor-pointer group-hover:bg-primary/20 transition-colors">
                        View Course
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* All courses grid */}
      <section>
        {featuredCourses.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-primary/70 to-primary/10 rounded-full"></div>
              <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
            </div>
            <div>
              <Badge variant="outline" className="font-normal py-1 px-2">
                {count} course{count !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(featuredCourses.length > 0 ? remainingCourses : courses).map(({ id, name, description, level, duration, code, institution_name }) => (
            <div key={id}>
              <Link href={`/dashboard/courses/${id}`} passHref>
                <Card className="h-full overflow-hidden group transition-all hover:shadow-lg border-border hover:border-primary/30 relative flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/70 to-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="text-primary/80 p-1.5 rounded-md bg-primary/5 group-hover:bg-primary/10 transition-colors">
                          <GraduationCap size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground font-medium">{code}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getLevelColor(level)} text-xs py-0 px-2 h-5`}>
                        {getLevelLabel(level)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      {institution_name && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {institution_name}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t flex justify-between items-center bg-muted/20">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                        <span>{duration} yr</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      <Pagination totalPages={Math.ceil(count / 12)} className='mt-10' />
    </div>
  );
};

export default ExploreCourses;

// Skeleton remains unchanged
export const ExploreCoursesSkeleton = () => {
  return (
    <div className="space-y-10">
      {/* Featured section skeleton */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-1 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`featured-${index}`} className="h-full overflow-hidden border-border">
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-3 flex justify-between items-center bg-muted/20">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* All courses skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-1 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={`course-${index}`} className="h-full overflow-hidden border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                
                <div className="mt-3">
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardHeader>
              
              <CardContent>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              
              <CardFooter className="pt-3 border-t flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};