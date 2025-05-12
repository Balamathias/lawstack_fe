import React from 'react'
import { PAGE_SIZE } from '@/lib/utils'
import QuizzesOverview from '@/components/admin/quizzes/quizzes-overview'
import QuizzesTable from '@/components/admin/quizzes/quizzes-table'
import { getQuizzes, getQuizzesAnalytics } from '@/services/server/quizzes'

interface Props {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const Page = async ({ params, searchParams }: Props) => {
  const { data: stats } = await getQuizzesAnalytics()
  const { data: quizzes, count } = await getQuizzes({ params: { ...(await searchParams), page_size: PAGE_SIZE }})

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <QuizzesOverview stats={stats!} />
      <QuizzesTable quizzes={quizzes} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page