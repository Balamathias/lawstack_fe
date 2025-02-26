import { Course } from '@/@types/db'
import { StackResponse } from '@/@types/generics'
import BackButton from '@/components/back-button'
import React, { Suspense, use } from 'react'
import CourseQuestions, { CourseQuestionsSkeleton } from './course-questions'

interface Props {
    promisedCourse: Promise<StackResponse<Course | null>>
}

const CourseDetail = ({ promisedCourse }: Props) => {

  const { data: course } = use(promisedCourse)
  
  return (
    <div className='flex flex-col gap-2'>
        <BackButton />

        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-semibold py-2'>
              {course?.name || 'Course Title'}
            </h1>
            <p className='text-muted-foreground'>{course?.description || 'Course Description'}</p>
        </div>

        <div className='mt-4'>
            <Suspense fallback={<CourseQuestionsSkeleton />}>
                <CourseQuestions courseId={course?.id || ''} />
            </Suspense>
        </div>
    </div>
  )
}

export default CourseDetail