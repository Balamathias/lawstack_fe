import { Course } from '@/@types/db'
import { StackResponse } from '@/@types/generics'
import BackButton from '@/components/back-button'
import React, { Suspense, use } from 'react'
import CourseQuestions, { CourseQuestionsSkeleton } from './course-questions'
import { LucideStars, LucideWeight } from 'lucide-react'
import Filters from '@/components/past-questions/filters'

interface Props {
    promisedCourse: Promise<StackResponse<Course | null>>,
    searchParams: Record<string, any>
}

const CourseDetail = ({ promisedCourse, searchParams }: Props) => {

  const { data: course } = use(promisedCourse)
  
  return (
    <div className='flex flex-col gap-2'>
        <BackButton />

        <div className='flex flex-col gap-2 py-4 border-b border-secondary/60'>
            <div className='flex items-center gap-2 justify-between  py-3'>
              <h1 className='text-2xl font-semibold'>
                {course?.name}
              </h1>
              <Filters isPQ={false} />
            </div>
            <p className='text-muted-foreground text-lg py-1.5'>{course?.description || 'Course Description'}</p>

            <div className='flex items-center gap-4 flex-wrap'>
              <div className='flex items-center gap-x-2'>
                <LucideStars />
                <span>{course?.level} level</span>
              </div>
              <div className='flex items-center gap-x-2'>
                <LucideWeight />
                <span>{course?.credit_units} CU</span>
              </div>
            </div>
        </div>

        <div className='mt-6'>
            <Suspense fallback={<CourseQuestionsSkeleton />}>
                <CourseQuestions courseId={course?.id || ''} searchParams={searchParams} />
            </Suspense>
        </div>
    </div>
  )
}

export default CourseDetail