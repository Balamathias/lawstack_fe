import React from 'react';
import { Metadata } from 'next';
import { getCourse } from '@/services/server/courses';
import { notFound } from 'next/navigation';
import CourseDetail from '@/components/dashboard/courses/course-detail';
import CourseQuestions from '@/components/dashboard/courses/course-questions';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const { data: course } = await getCourse(params.id);
  
  if (!course) {
    return {
      title: 'Course Not Found | LegalX',
      description: 'The requested course could not be found',
    };
  }
  
  return {
    title: `${course.name} | LegalX`,
    description: course.description || `Past questions and materials for ${course.name}`,
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: course } = await getCourse(params.id);
  
  if (!course) {
    return notFound();
  }
  
  // Parse search parameters for questions
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const year = typeof searchParams.year === 'string' ? searchParams.year : undefined;
  
  const questionParams = {
    page,
    page_size: 10,
    search,
    year,
    course: params.id,
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-8 px-4 pb-16">
      {/* Course Detail Header */}
      <CourseDetail course={course} />
      
      {/* Course Questions */}
      <CourseQuestions 
        courseId={params.id} 
        initialParams={questionParams} 
      />
    </div>
  );
}