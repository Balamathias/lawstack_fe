import CourseDetail from '@/components/dashboard/courses/course.detail'
import LoadingOverlay from '@/components/loading-overlay'
import { getCourse } from '@/services/server/courses'
import { Metadata, ResolvingMetadata } from 'next'
import React, { Suspense } from 'react'

interface Props {
    params: Promise<{ id: string }>,
    searchParams: Promise<any>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
 
  const { data: course } = await getCourse(id)
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: course?.name || 'Course',
    description: course?.description || 'Course',
    openGraph: {
      images: [...previousImages],
    },
  }
}

const Page: React.FC<Props> = async ({ params: _params, searchParams }) => {
  const params = await _params
  const searchParamsData = await searchParams

  const promisedCourse = getCourse(params.id)
  
  return (
    <div className='max-w-5xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
        <div className='flex flex-col gap-2'>
          <Suspense fallback={<LoadingOverlay />}>
            <CourseDetail promisedCourse={promisedCourse} searchParams={searchParamsData} />
          </Suspense>
        </div>
    </div>
  )
}

export default Page