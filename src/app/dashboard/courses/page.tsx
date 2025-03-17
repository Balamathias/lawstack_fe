import React from 'react';
import { Metadata } from 'next';
import { getCourses } from '@/services/server/courses';
import CoursesClient from '@/components/dashboard/courses/courses-client';
import { Suspense } from 'react';
import CoursesSkeleton from '@/components/dashboard/courses/courses-skeleton';

export const metadata: Metadata = {
  title: 'Courses | LegalX',
  description: 'Browse all available law courses',
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse search parameters
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const institution = typeof searchParams.institution === 'string' ? searchParams.institution : undefined;
  const level = typeof searchParams.level === 'string' ? searchParams.level : undefined;
  
  const params = {
    page,
    page_size: 12,
    search,
    institution,
    level,
  };

  // Fetch courses with search params
  const { data: courses, count } = await getCourses({ params });

  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-8 px-4 pb-16">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Browse all available law courses and their past questions</p>
      </div>

      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesClient 
          initialCourses={courses || []} 
          totalCourses={count} 
          initialParams={params}
        />
      </Suspense>
    </div>
  );
}
