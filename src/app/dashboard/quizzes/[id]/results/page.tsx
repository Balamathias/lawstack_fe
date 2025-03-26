import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QuizResults from '@/components/quizzes/quiz-results'
import { getQuiz } from '@/services/server/quiz'

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
  
  if (!quiz || quiz.status !== 'completed') {
    notFound()
  }
  
  return (
    <div className="py-8 max-w-5xl mx-auto animate-fade-in p-3 sm:p-8 pb-20 max-lg:pt-14">
      <QuizResults initialQuiz={quiz} />
    </div>
  )
}
