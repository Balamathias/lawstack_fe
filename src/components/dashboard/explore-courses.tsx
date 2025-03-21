import { getCourses } from '@/services/server/courses';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { GraduationCap, Flag, LucideBookLock, Clock, TrendingUp, Users, LucideCode } from 'lucide-react';
import Empty from '../empty';
import { truncateString } from '@/lib/utils';
import Pagination from '../pagination';
import { Badge } from '../ui/badge';

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
        <div className='flex flex-col gap-4'>
            <Empty
                title="Questions not found"
                content={"Sorry, questions could not be retrieved at this point, please try again."}
                icon={<LucideBookLock />}
                color="amber"
            />
        </div>
    )
  }

  // Map level to a color for visual distinction
  const getLevelColor = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    switch(numLevel) {
      case 100: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 200: return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 300: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 400: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 500: return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get human readable label for level
  const getLevelLabel = (level: number | string) => {
    const numLevel = typeof level === 'string' ? parseInt(level) : level;
    return `${numLevel} Level`;
  };

  return (
    <>
      <div className="mb-6 hidden">
        <h2 className="text-2xl font-bold mb-2 text-foreground/90 flex items-center">
          <TrendingUp className="mr-2 h-6 w-6 text-green-500" />
          Explore Courses
        </h2>
        <p className="text-muted-foreground">Discover all available courses on Law Stack, make a pick and carefully study its past questions.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(({ id, name, description, level, duration, code }) => (
          <Link key={id} href={`/dashboard/courses/${id}`} passHref>
            <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl border-muted/60 hover:border-green-500/50 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              <CardHeader className="pb-2 relative">
                <div className="absolute top-1 right-1">
                  <Badge variant="outline" className={`${getLevelColor(level)} text-xs font-medium`}>
                    {getLevelLabel(level)}
                  </Badge>
                </div>
                <div className="text-green-500 mb-2">
                  <GraduationCap size={22} />
                </div>
                <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-green-600 transition-colors">
                  {truncateString(name, 25)}
                </h3>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
              </CardContent>
              
              <CardFooter className="pt-3 border-t border-border/40 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} className="text-green-500/80" />
                  <span>{duration} Year</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LucideCode size={14} className="text-green-500/80" />
                  <span>{code}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination totalPages={Math.ceil(count / 12)} className='mt-10' />
    </>
  );
};

export default ExploreCourses;

export const ExploreCoursesSkeleton = () => {
  return (
    <>
      <div className="mb-6 hidden">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="h-full overflow-hidden border-muted/60">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-5 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-1" />
            </CardHeader>
            
            <CardContent>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            
            <CardFooter className="pt-3 border-t border-border/40 bg-muted/20 flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
