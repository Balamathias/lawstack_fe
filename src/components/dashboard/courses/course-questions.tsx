import { Question } from '@/@types/db'
import MarkdownPreview from '@/components/markdown-preview'
import { getQuestions } from '@/services/server/questions'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Empty from '@/components/empty'
import { truncateString } from '@/lib/utils'
import Pagination from '@/components/pagination'

interface Props {
    courseId: string,
    searchParams: Record<string, any>
}

const CourseQuestions = async ({ courseId, searchParams }: Props) => {
    const { data: questions, count } = await getQuestions({ params: { course: courseId, ...searchParams, page_size: 15 } })

    const page = Number(searchParams?.page || 1)
  
    return (
      <div className="relative">
        <div className="flex flex-col space-y-8">
          {questions?.map((question, index) => (
            <div key={question.id} className="flex">
              <div className="flex flex-col items-center w-12">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500/15 dark:bg-green-600/15 rounded-full text-green-600 font-bold z-10 mt-1.5">
                  {(index + 1) + (page - 1) * 15}
                </div>
                {index !== questions.length - 1 && (
                  <div className="flex-1 w-px bg-gray-300 dark:bg-secondary mt-1"></div>
                )}
              </div>
              <div className="flex-1">
                <QuestionItem question={question} />
              </div>
            </div>
          ))}
        </div>

        {
          questions?.length === 0 && (
            <div className='flex flex-col gap-4'>
                <Empty title='No questions found' content='There are currently no questions available for this course or filter.' color='blue' className='dark:bg-inherit' />
            </div>
          )
        }

        <Pagination
          totalPages={Math.ceil(count / 15)}
          className="mt-8"
        />
      </div>
    )
  }
  
  const QuestionItem = ({ question }: { question: Question }) => {
    return (
      <Link href={`/dashboard/past-questions/${question.id}`} className="flex flex-col" passHref>
        <div className="p-4 bg-white dark:bg-secondary/25 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:bg-green-600/15 hover:text-muted-foreground cursor-pointer flex flex-col gap-2.5">
          <MarkdownPreview content={truncateString(question.text, 420) + (question?.session ? ` **(${question.session})**` : '')} />
        </div>
      </Link>
    )
  }

  export const CourseQuestionsSkeleton = () => {
    return (
      <div className="relative">
        <div className="flex flex-col space-y-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center w-12">
                <Skeleton className="w-8 h-8 rounded-full" />
                {index !== 4 && (
                  <div className="flex-1 w-px bg-secondary/50 mt-1"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="p-4 border rounded-lg shadow">
                  <Skeleton className="mb-2 h-6 w-3/4 rounded" />
                  <Skeleton className="mb-2 h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  

export default CourseQuestions
