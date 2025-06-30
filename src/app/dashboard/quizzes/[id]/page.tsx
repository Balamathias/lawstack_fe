import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QuizSession from '@/components/quizzes/quiz-session'
import { getQuiz } from '@/services/server/quiz'

import { getUser } from '@/services/server/auth'
import Empty from '@/components/empty'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LucideBookOpen } from 'lucide-react'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const id = (await params)?.id
  
  if (!id) {
    return {
      title: 'Quiz Not Found',
      description: 'The requested quiz could not be found'
    }
  }
  
  const quizResponse = await getQuiz(id)
  const quiz = quizResponse.data
  
  if (!quiz) {
    return {
      title: 'Quiz Not Found',
      description: 'The requested quiz could not be found'
    }
  }
  
  return {
    title: `${quiz.title} | LawStack`,
    description: `Take the "${quiz.title}" quiz with ${quiz.total_questions} questions`,
  }
}

export default async function QuizPage({ params }: PageProps) {
  const id = (await params)?.id
  
  if (!id) {
    notFound()
  }
  
  console.log("Quiz ID from params:", id)
  
  const quizResponse = await getQuiz(id)
  const user = await getUser()
  
  console.log("Quiz response status:", quizResponse.status)
  console.log("Quiz exists:", !!quizResponse.data)
  
  const quiz = quizResponse.data
  
  if (!quiz) {
    notFound()
  }

  if (!user?.data) {
      return (
        <div className="flex flex-col gap-y-5 py-8 animate-fade-in max-w-7xl mx-auto p-4 sm:p-8 pb-16 max-lg:mt-14">
          <Empty
            title="Please login to access your dashboard"
            content="To take the quiz, you need to be logged in."
            action={
              <Button asChild>
                <Link href={`/login?next=/dashboard/quizzes/${quiz.id}`} className="w-full">
                  Login
                </Link>
              </Button>
            }
            icon={<LucideBookOpen className="w-8 h-8 text-muted-foreground" />}
            color="green"
          />
        </div>
      )
    }
  
  return (
    <div className="py-8 max-w-7xl mx-auto animate-fade-in p-3 sm:p-8 pb-20 max-lg:pt-14">
      <QuizSession initialQuiz={quiz} />
    </div>
  )
}
