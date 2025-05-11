import React from 'react'
import { getQuestions, getQuestionsAnalytics } from '@/services/server/questions'
import { PAGE_SIZE } from '@/lib/utils'
import QuestionsTable from '@/components/admin/questions/questions-table'
import QuestionsOverview from '@/components/admin/questions/questions-overview'

interface Props {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[]>>
}

const Page = async ({ params, searchParams }: Props) => {
  const { data: stats } = await getQuestionsAnalytics()
  const { data: questions, count } = await getQuestions({ params: { ...(await searchParams), page_size: PAGE_SIZE }})

  return (
    <div className='flex flex-col gap-4 p-4 md:p-10 max-w-7xl mx-auto'>
      <QuestionsOverview stats={stats!} />
      <QuestionsTable questions={questions} count={count} pageSize={PAGE_SIZE} />
    </div>
  )
}

export default Page