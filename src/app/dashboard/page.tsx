import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'

export const metadata: Metadata = {
  title: 'Dashboard | Law Stack',
  description: 'Law Stack'
}

const Page = async () => {
  const { data: user } = await getUser()
  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4'>
        <h2 className='sr-only'>Hi, Welcome</h2>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-muted-foreground py-4'>
            Hi, <span className='text-primary'>{user?.username || user?.first_name || user?.email || 'Guest'}</span>.
          </h1>
        </div>

        <div className='flex flex-col gap-2'>
          <Suspense fallback={<ExploreCoursesSkeleton />}>
            <ExploreCourses />
          </Suspense>
        </div>
    </div>
  )
}

export default Page