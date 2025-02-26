import { getCourses } from '@/services/server/courses'
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ExploreCourses = async () => {
  const { data: courses } = await getCourses()
  return (
    <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {courses?.map((course) => (
                <div key={course.id} className='relative p-5 bg-white dark:bg-black/70 bg-opacity-10 dark:bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg flex flex-col just-between border'>
                    <h2 className='text-xl font-semibold line-clamp-1'>{course.name} ({course.code})</h2>
                    <p className='text-muted-foreground line-clamp-2'>{course.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ExploreCourses

export const ExploreCoursesSkeleton = () => {
  return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='relative p-5 bg-white dark:bg-black/70 bg-opacity-10 dark:bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg border'>
                  <div className='flex flex-col gap-y-1.5'>
                    <Skeleton className='h-6 w-3/4 mb-2' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                  </div>
              </div>
          ))}
      </div>
  )
}