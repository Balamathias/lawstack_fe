import { getCourses } from '@/services/server/courses';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';
import Link from 'next/link';
import { GraduationCap, Flag, LucideBookLock } from 'lucide-react';
import Empty from '../empty';
import { truncateString } from '@/lib/utils';

const ExploreCourses = async () => {
  const { data: courses, error } = await getCourses({
    params: {
      ordering: '-created_at',
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {courses.map(({ id, name, description, level }) => (
        <Link key={id} href={`/dashboard/courses/${id}`} passHref>
          <Card className="relative p-5 rounded-xl flex flex-col justify-between bg-secondary/40 border-none shadow-lg transition-all hover:bg-green-600/20 hover:text-green-600 hover:scale-105 cursor-pointer overflow-hidden group">
            <div className="absolute top-3 right-3 text-green-500 group-hover:text-green-700 transition-colors">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-semibold flex items-center gap-2 line-clamp-1">
              {truncateString(name, 20)}
            </h2>
            <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Flag size={16} className="text-green-500/90" />
              <span>{level} Level</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ExploreCourses;

export const ExploreCoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="relative p-5 bg-white dark:bg-black/70 bg-opacity-10 dark:bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg border">
          <div className="flex flex-col gap-y-1.5">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};
