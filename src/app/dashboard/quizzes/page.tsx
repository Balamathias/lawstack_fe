import React from 'react'
import { Metadata } from 'next'
import QuizDashboard from '@/components/quizzes/quiz-dashboard'
import { getQuizStatistics, getQuizzes } from '@/services/server/quiz'
import { getCourses } from '@/services/server/courses'

export const metadata: Metadata = {
  title: 'Law Quiz Dashboard | LawStack',
  description: 'Test your law knowledge with AI-generated quizzes based on past exam questions',
}

export default async function QuizzesPage() {
  const [quizzesResponse, statsResponse, coursesResponse] = await Promise.all([
    getQuizzes(),
    getQuizStatistics(),
    getCourses()
  ])
  
  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Law Quiz Dashboard</h1>
      <QuizDashboard 
        initialQuizzes={quizzesResponse} 
        initialStats={statsResponse}
        initialCourses={coursesResponse}
      />
    </div>
  )
}
