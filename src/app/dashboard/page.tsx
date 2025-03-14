import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'
import { Button } from '@/components/ui/button'
import { LucidePlaneTakeoff } from 'lucide-react'
import SearchCourse from '@/components/dashboard/search.course'

export const metadata: Metadata = {
  title: 'Dashboard | Law Stack',
  description: 'Law Stack'
}

interface Props {
  params: Promise<Record<string, any>>,
  searchParams: Promise<Record<string, any>>,
}

const Page = async ({ params: _params, searchParams: _searchParams }: Props) => {

  const { data: user } = await getUser()
  const searchParams = await _searchParams

  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
        <h2 className='sr-only'>Hi, Welcome</h2>

        <div className='w-full items-center justify-between py-4 hidden'>
          <h1 className='text-2xl font-semibold text-muted-foreground line-clamp-1'>
            Hi, <span className='text-primary'>{user?.username || user?.first_name || user?.email || 'Guest'}</span>.
          </h1>

            <Button className='flex items-center rounded-full px-5'>
              <LucidePlaneTakeoff className='w-6 h-6 mr-0.5' />
              Start
            </Button>
          </div>

        <SearchCourse />

        <div className='flex flex-col gap-2'>
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses searchParams={searchParams} />
          </Suspense>
        </div>
    </div>
  )
}

export default Page