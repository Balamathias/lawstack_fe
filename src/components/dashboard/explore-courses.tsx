'use client';

import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Building, CalendarDays, Clock, GraduationCap, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Empty from '../empty';
import Pagination from '../pagination';
import { getCourses } from '@/services/server/courses';
import { Skeleton } from '../ui/skeleton';
import { Course } from '@/@types/db';
import { PaginatedStackResponse } from '@/@types/generics';

interface Props {
  searchParams: Record<string, any>;
  getCourses: Promise<PaginatedStackResponse<Course[]>>;
}

const PAGE_SIZE = 24;

// Helper function to get level-specific styling
const getLevelBadgeStyle = (level?: number | string): string => {
  const levelNum = typeof level === 'string' ? parseInt(level.replace('L', ''), 10) : level;
  switch (levelNum) {
    case 100:
      return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-300';
    case 200:
      return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-300';
    case 300:
      return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700/50 dark:text-yellow-300';
    case 400:
      return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700/50 dark:text-purple-300';
    case 500:
    case 600:
      return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/30 dark:border-gray-700/50 dark:text-gray-300'; // Default/fallback style
  }
};


const ExploreCourses = ({ searchParams, getCourses }: Props) => {

  const { data: courses, count, error } = use(getCourses);

  const getPattern = (courseName: string = 'Default') => {
    const patterns = [
      'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/20px 20px',
      'linear-gradient(45deg, currentColor 12%, transparent 12%, transparent 88%, currentColor 88%) 0 0/20px 20px',
      'linear-gradient(0deg, currentColor 2px, transparent 2px) 0 0/24px 24px',
      'radial-gradient(circle at 50% 50%, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%) 0 0/24px 24px',
      'linear-gradient(30deg, currentColor 12%, transparent 12.5%, transparent 87%, currentColor 87.5%, currentColor 100%) 0 0/12px 12px',
      'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%) 0 0/12px 12px'
    ];

    // Generate a consistent pattern index based on course name
    const hash = courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return patterns[hash % patterns.length];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

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
              <Button variant="outline" className="mt-4 hover:bg-white/20 transition-all">
                Clear Filters & View All
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl opacity-20"></div>

      <section className="relative z-10">
        <div className="flex md:items-center md:flex-row flex-col justify-between mb-8 gap-2.5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-primary/20 rounded-full"></div>
            <div className="space-y-1">
              <h2 className="text-lg md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                Available Courses
                <Sparkles size={18} className="text-yellow-400" />
              </h2>
              <p className="text-sm text-muted-foreground">Discover and explore your educational journey</p>
            </div>
          </div>
          <Badge variant="outline" className="font-medium py-1.5 px-4 text-sm shadow-sm">
            {count} course{count !== 1 ? 's' : ''} found
          </Badge>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {courses.map((course) => {
            const pattern = getPattern(course.name);
            const levelStyle = getLevelBadgeStyle(course.level);

            return (
              <motion.div
                key={course.id}
                variants={item}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                {/* Pattern background */}
                <div className="absolute inset-0 pointer-events-none text-primary/[0.02] dark:text-primary/[0.015]">
                  <div className="absolute inset-0 bg-repeat opacity-60" style={{ backgroundImage: pattern }} />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-70" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full opacity-50" />

                {/* Top gradient border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="flex flex-col relative z-10 p-6 h-full w-full"
                >
                  {/* Course content */}
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-foreground/90 line-clamp-2 text-base mb-1">
                          {course.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {course.description || "No description available."}
                        </p>
                      </div>

                      <div className="group-hover:bg-primary/20 p-2 rounded-full transform group-hover:rotate-12 transition-all duration-300">
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    {/* Tags and metadata */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-4">
                      {/* Course code */}
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 flex items-center gap-1.5 px-2 py-1">
                        <BookOpen className="h-3 w-3 text-primary" />
                        <span className="text-xs truncate max-w-[100px]">{course.code}</span>
                      </Badge>

                      {/* Level */}
                      {course.level && (
                        <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2 py-1", levelStyle)}>
                          <GraduationCap className="h-3 w-3" />
                          <span className="text-xs">{course.level}L</span>
                        </Badge>
                      )}

                      {/* Duration */}
                      {course.duration && (
                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{course.duration} year{parseInt(course.duration) !== 1 ? 's' : ''}</span>
                        </Badge>
                      )}

                      {/* Institution */}
                      {course.institution_name && (
                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1">
                          <Building className="h-3 w-3" />
                          <span className="text-xs">{course.institution_name}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {count > PAGE_SIZE && (
        <Pagination totalPages={Math.ceil(count / PAGE_SIZE)} className='pt-6 rounded-lg' />
      )}
    </div>
  );
};

export default ExploreCourses;

export const ExploreCoursesSkeleton = () => {
  return (
    <div className="space-y-8 relative">
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl animate-pulse"></div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-xl p-6 h-[220px]"
            >
              <div className="flex justify-between mb-4">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              </div>

              <div className="flex flex-wrap gap-2 mt-auto pt-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-md" /> // Changed to rounded-md for badge shape
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-4">
        <Skeleton className="h-10 w-72 rounded-lg" />
      </div>
    </div>
  );
};
