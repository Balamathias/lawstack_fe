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
        {questions?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((question, index) => (
                <QuestionItem 
                  key={question.id} 
                  question={question} 
                  number={(index + 1) + (page - 1) * 15} 
                />
              ))}
            </div>
            <Pagination
              totalPages={Math.ceil(count / 15)}
              className="mt-8"
            />
          </>
        ) : (
          <div className="flex justify-center py-10">
            <Empty 
              title="No questions found" 
              content="There are currently no questions available for this course or filter." 
              color="blue" 
              className="dark:bg-inherit max-w-md" 
            />
          </div>
        )}
      </div>
    )
  }
  
  const QuestionItem = ({ question, number }: { question: Question; number: number }) => {
    return (
      <Link href={`/dashboard/past-questions/${question.id}`} className="group" passHref>
        <div className="h-full p-5 bg-white dark:bg-secondary/25 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-500/50 dark:hover:border-green-500/50 flex flex-col">
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/15 dark:bg-green-600/15 rounded-full text-green-600 font-bold mr-3 group-hover:bg-green-500/30 transition-colors">
              {number}
            </div>
            {question?.session && (
              <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-1 rounded-full">
                {question.session}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownPreview content={truncateString(question.text, 180)} />
            </div>
          </div>
          
          <div className="mt-3 text-sm text-muted-foreground flex justify-end">
            <span className="group-hover:text-green-500 transition-colors flex items-center gap-1">
              View question
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    )
  }

  export const CourseQuestionsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-5 bg-white dark:bg-secondary/25 rounded-xl border border-border/50 shadow-sm">
            <div className="flex items-center mb-3">
              <Skeleton className="w-8 h-8 rounded-full mr-3" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-4 w-full rounded" />
            <Skeleton className="mb-2 h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="mt-3 flex justify-end">
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

export default CourseQuestions
