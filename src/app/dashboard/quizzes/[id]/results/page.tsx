import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QuizResults from '@/components/quizzes/quiz-results'
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
  // Ensure the id is properly extracted and awaited
  const id = (await params)?.id
  
  if (!id) {
    return {
      title: 'Quiz Results Not Found',
      description: 'The requested quiz results could not be found'
    }
  }
  
  const quizResponse = await getQuiz(id)
  const quiz = quizResponse.data
  
  if (!quiz) {
    return {
      title: 'Quiz Results Not Found',
      description: 'The requested quiz results could not be found'
    }
  }
  
  return {
    title: `${quiz.title} Results | LawStack`,
    description: `Your results for the "${quiz.title}" quiz`,
  }
}

export default async function QuizResultsPage({ params }: PageProps) {
  const id = (await params)?.id
  
  if (!id) {
    notFound()
  }
  
  const quizResponse = await getQuiz(id)
  const quiz = quizResponse.data

  const user = await getUser()
  
  if (!quiz || quiz.status !== 'completed') {
    notFound()
  }

  if (!user?.data) {
    return (
      <div className="flex flex-col gap-y-5 py-8 animate-fade-in max-w-7xl mx-auto p-4 sm:p-8 pb-16 max-lg:mt-14">
        <Empty
          title="Please login to access your dashboard"
          content="You have to be logged in in order to be able to see your quiz results"
          action={
            <Button asChild>
              <Link href={`/login?next=/dashboard/quizzes/${quiz.id}/results`} className="w-full">
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
    <div className="py-8 max-w-5xl mx-auto animate-fade-in p-3 sm:p-8 pb-20 max-lg:pt-14">
      <QuizResults initialQuiz={quiz} />
    </div>
  )
}
