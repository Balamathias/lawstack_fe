import { Question } from '@/@types/db'
import MarkdownPreview from '@/components/markdown-preview'
import { getQuestions } from '@/services/server/questions'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
    courseId: string
}

const CourseQuestions = async ({ courseId }: Props) => {
    const { data: questions } = await getQuestions({ params: { course: courseId } })

    return (
        <div className='flex flex-col gap-y-5'>
            {questions?.map((question, index) => (
                <div key={question.id} className='flex items-start gap-x-3'>
                    <QuestionItem question={question} />
                </div>
            ))}
    </div>
  )
}

const QuestionItem = ({ question }: { question: Question }) => {
  return (
    <div className='flex flex-col gap-y-2'>
        <div className='sm:text-lg flex flex-col gap-y-2.5 antialiased leading-relaxed py-3 border-b'>
            <MarkdownPreview content={question?.text} />
        </div>
    </div>
  )
}

export const CourseQuestionsSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-5'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='flex flex-col gap-y-5'>
            <div className='sm:text-lg flex flex-col gap-y-2.5 antialiased leading-relaxed py-3 border-b'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
            </div>
        </div>
      ))}
    </div>
  )
}

export default CourseQuestions
