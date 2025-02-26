import { Question } from '@/@types/db'
import MarkdownPreview from '@/components/markdown-preview'
import { getQuestions } from '@/services/server/questions'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface Props {
    courseId: string
}

const CourseQuestions = async ({ courseId }: Props) => {
    const { data: questions } = await getQuestions({ params: { course: courseId } })
  
    return (
      <div className="relative">
        <div className="flex flex-col space-y-8">
          {questions?.map((question, index) => (
            <div key={question.id} className="flex">
              {/* Timeline marker column */}
              <div className="flex flex-col items-center w-12">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500/15 dark:bg-green-600/15 rounded-full text-green-600 font-bold z-10">
                  {index + 1}
                </div>
                {/* Vertical connector: shown if not the last item */}
                {index !== questions.length - 1 && (
                  <div className="flex-1 w-px bg-gray-300 dark:bg-secondary mt-1"></div>
                )}
              </div>
              {/* Question content */}
              <div className="flex-1">
                <QuestionItem question={question} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  const QuestionItem = ({ question }: { question: Question }) => {
    return (
      <Link href={`/past-questions/${question.id}`} className="flex flex-col">
        <div className="p-4 bg-white dark:bg-secondary/25 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground line-clamp-3">
            {question?.text_plain || question?.text}
          </p>
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
              {/* Timeline marker skeleton */}
              <div className="flex flex-col items-center w-12">
                <Skeleton className="w-8 h-8 bg-secondary/30 rounded-full" />
                {index !== 4 && (
                  <div className="flex-1 w-px bg-secondary/30 mt-1"></div>
                )}
              </div>
              {/* Skeleton for question content */}
              <div className="flex-1">
                <div className="p-4 bg-white dark:bg-secondary/30 rounded-lg shadow">
                  <Skeleton className="mb-2 h-6 w-3/4 bg-secondary/30 rounded" />
                  <Skeleton className="mb-2 h-4 w-full bg-secondary/30 rounded" />
                  <Skeleton className="h-4 w-5/6 bg-secondary/30 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  

export default CourseQuestions
