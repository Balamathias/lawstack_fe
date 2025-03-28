import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QuizSession from '@/components/quizzes/quiz-session'
import { getQuiz } from '@/services/server/quiz'

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
  
  console.log("Quiz response status:", quizResponse.status)
  console.log("Quiz exists:", !!quizResponse.data)
  
  const quiz = quizResponse.data
  
  if (!quiz) {
    notFound()
  }
  
  return (
    <div className="py-8 max-w-5xl mx-auto animate-fade-in p-3 sm:p-8 pb-20 max-lg:pt-14">
      <QuizSession initialQuiz={quiz} />
    </div>
  )
}
