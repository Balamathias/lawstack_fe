import React from 'react'
import { getCourses, getCoursesAnalytics } from '@/services/server/courses'
import { PAGE_SIZE } from '@/lib/utils'
import CoursesTable from '@/components/admin/courses/courses-table'
import CoursesOverview from '@/components/admin/courses/courses-overview'

interface Props {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const Page = async ({ params, searchParams }: Props) => {
  // Fetch courses analytics and courses data
  const { data: stats } = await getCoursesAnalytics()
  const { data: courses, count } = await getCourses({ params: { ...(await searchParams), page_size: PAGE_SIZE }})

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <CoursesOverview stats={stats!} />
      <CoursesTable courses={courses} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page
