import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUser } from '@/services/server/auth'
import ExploreCourses, { ExploreCoursesSkeleton } from '@/components/dashboard/explore-courses'
import SearchCourse from '@/components/dashboard/search.course'
import DashboardWelcome from '@/components/dashboard/welcome'
import DashboardAction from '@/components/dashboard/dashboard-actions'

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
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-10 md:mx-auto w-full px-4 gap-5 pb-20 max-lg:mt-14'>
        
        <DashboardWelcome user={user} />

        <div className='flex flex-col gap-2'>
          <DashboardAction />
        </div>
    </div>
  )
}

export default Page
