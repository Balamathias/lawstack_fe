import { getCourses } from '@/services/server/courses';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { GraduationCap, CalendarDays, BookOpen, Clock, Building, Sparkles } from 'lucide-react';
import Empty from '../empty';
import Pagination from '../pagination';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Image from 'next/image';

interface Props {
  searchParams: Record<string, any>;
}

const PAGE_SIZE = 24;

const ExploreCourses = async ({ searchParams }: Props) => {
  const { data: courses, count, error } = await getCourses({
    params: {
      ordering: '-created_at',
      page_size: PAGE_SIZE,
      ...searchParams,
    }
  });

  if (error) {
    return (
      <div className='flex flex-col gap-4 mt-12 animate-fade-in'>
        <Empty
          title="Error loading courses"
          content={"We encountered an issue fetching the courses. Please try again later."}
          icon={<BookOpen className="h-16 w-16 text-destructive" />}
          color="red"
        />
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className='flex flex-col gap-4 mt-12 animate-fade-in'>
        <Empty
          title="No courses found"
          content={"We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms."}
          icon={<BookOpen className="h-16 w-16 text-amber-500" />}
          color="amber"
          action={
            <Link href="/dashboard/courses">
              <Button variant="outline" className="mt-4 glass-effect hover:bg-white/20 transition-all">
                Clear Filters & View All
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Map level to a color for visual distinction with enhanced gradient
  const getLevelColor = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch(numLevel) {
      case 100: return 'bg-gradient-to-r from-emerald-100/90 to-emerald-200/80 text-emerald-800 border-emerald-200/50 backdrop-blur-md dark:from-emerald-900/70 dark:to-emerald-800/60 dark:text-emerald-300 dark:border-emerald-700/30';
      case 200: return 'bg-gradient-to-r from-blue-100/90 to-blue-200/80 text-blue-800 border-blue-200/50 backdrop-blur-md dark:from-blue-900/70 dark:to-blue-800/60 dark:text-blue-300 dark:border-blue-700/30';
      case 300: return 'bg-gradient-to-r from-indigo-100/90 to-indigo-200/80 text-indigo-800 border-indigo-200/50 backdrop-blur-md dark:from-indigo-900/70 dark:to-indigo-800/60 dark:text-indigo-300 dark:border-indigo-700/30';
      case 400: return 'bg-gradient-to-r from-purple-100/90 to-purple-200/80 text-purple-800 border-purple-200/50 backdrop-blur-md dark:from-purple-900/70 dark:to-purple-800/60 dark:text-purple-300 dark:border-purple-700/30';
      case 500: return 'bg-gradient-to-r from-rose-100/90 to-rose-200/80 text-rose-800 border-rose-200/50 backdrop-blur-md dark:from-rose-900/70 dark:to-rose-800/60 dark:text-rose-300 dark:border-rose-700/30';
      default: return 'bg-gradient-to-r from-gray-100/90 to-gray-200/80 text-gray-800 border-gray-200/50 backdrop-blur-md dark:from-gray-800/70 dark:to-gray-700/60 dark:text-gray-300 dark:border-gray-700/30';
    }
  };

  const getLevelLabel = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    return `${numLevel}L`;
  };

  return (
    <div className="space-y-8 relative">
      {/* Glassmorphic decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl opacity-20 animate-pulse-glow"></div>
      <div className="absolute top-60 left-40 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl opacity-10 animate-pulse-glow"></div>
      
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-neural-pattern opacity-5 pointer-events-none"></div>
      
      <section className="relative z-10">
        <div className="flex md:items-center md:flex-row flex-col justify-between mb-8 animate-fade-in gap-2.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary/20 rounded-full animate-pulse-custom"></div>
            <div className="space-y-1">
              <h2 className="text-lg md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                Available Courses
                <Sparkles size={18} className="text-yellow-400 animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground">Discover and explore your educational journey</p>
            </div>
          </div>
          <Badge variant="outline" className="font-medium py-1.5 px-4 text-sm glass-effect shadow-sm animate-fade-in-delay">
            {count} course{count !== 1 ? 's' : ''} found
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(({ id, name, description, level, duration, code, institution_name }, index) => (
            <Link key={id} href={`/dashboard/courses/${id}`} passHref className="h-full group perspective">
              <Card className={cn(
                "h-full flex flex-col overflow-hidden glass-effect relative transform-gpu transition-all duration-500",
                "group-hover:shadow-xl group-hover:shadow-primary/5",
                "group-hover:translate-y-[-5px] group-hover:rotate-y-5",
                "animate-fade-in-delay",
                "border border-border dark:border-white/10",
                "bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/30"
              )}
              style={{ 
                animationDelay: `${index * 50}ms`,
                transformStyle: 'preserve-3d'
              }}>
                {/* Card shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-white/60 via-transparent to-transparent mix-blend-overlay"></div>
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] bg-repeat opacity-5"></div>
                
                <CardHeader className="pb-3 pt-4 px-4 relative">
                  <Badge variant="outline" className={cn(
                    "absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 border shadow-sm",
                    getLevelColor(level)
                  )}>
                    {getLevelLabel(level)}
                  </Badge>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <div className="p-1.5 rounded-md bg-primary/10 backdrop-blur-sm">
                      <GraduationCap size={16} className="text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{code}</span>
                  </div>
                  <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
                    {name}
                  </h3>
                  {institution_name && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building className="h-3 w-3" />
                      <span className="line-clamp-1">{institution_name}</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-grow px-4 py-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {description || "No description available."}
                  </p>
                </CardContent>

                <CardFooter className="px-4 py-3 border-t border-border/30 dark:border-white/10 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary/80" />
                    <span>{duration} year{parseInt(duration) !== 1 ? 's' : ''} duration</span>
                  </div>
                  <div className="ml-auto">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center bg-primary/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {count > PAGE_SIZE && (
        <Pagination totalPages={Math.ceil(count / PAGE_SIZE)} className='pt-6 glass-effect p-2 rounded-lg animate-fade-in-delay-longer' />
      )}
    </div>
  );
};

export default ExploreCourses;

export const ExploreCoursesSkeleton = () => {
  return (
    <div className="space-y-8 relative">
      {/* Decorative elements for skeleton */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl animate-pulse-glow"></div>
      
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-1.5 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Card key={`skeleton-${index}`} className={cn(
              "h-full flex flex-col overflow-hidden glass-effect",
              "animate-pulse-custom",
              "border border-white/20 dark:border-white/10"
            )}
            style={{ 
              animationDelay: `${index * 50}ms` 
            }}>
              <CardHeader className="pb-3 pt-4 px-4">
                <Skeleton className="absolute top-3 right-3 h-5 w-12 rounded-md" />
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-1.5 mt-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow px-4 py-2 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-white/10 bg-muted/20 mt-auto">
                <Skeleton className="h-4 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <div className="flex justify-center pt-4">
        <Skeleton className="h-10 w-72 rounded-lg" />
      </div>
    </div>
  );
};
