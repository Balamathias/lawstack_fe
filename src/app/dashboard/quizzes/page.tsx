import React from 'react'
import { Metadata } from 'next'
import QuizDashboard from '@/components/quizzes/quiz-dashboard'
import { getQuizStatistics, getQuizzes } from '@/services/server/quiz'
import { getCourses } from '@/services/server/courses'
import { getUser } from '@/services/server/auth'

import Empty from '@/components/empty'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { LucideBookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Law Stack Quiz Dashboard | LawStack',
  description: 'Test your law knowledge with AI-generated quizzes based on past exam questions',
}

export default async function QuizzesPage() {
  const [quizzesResponse, statsResponse, coursesResponse, user] = await Promise.all([
    getQuizzes(),
    getQuizStatistics(),
    getCourses(),
    getUser()
  ])

  if (!user?.data) {
    return (
      <div className="flex flex-col gap-y-5 py-8 animate-fade-in max-w-7xl mx-auto p-4 sm:p-8 pb-16 max-lg:mt-14">
        <Empty
          title="Please login to access your dashboard"
          content="You need to be logged in to view your quizzes and statistics."
          action={
            <Button asChild>
              <Link href="/login?next=/dashboard/quizzes" className="w-full">
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
    <div className="flex flex-col gap-y-5 py-8 animate-fade-in max-w-7xl mx-auto p-4 sm:p-8 pb-16 max-lg:mt-14">
      <QuizDashboard 
        initialQuizzes={quizzesResponse} 
        initialStats={statsResponse}
        initialCourses={coursesResponse}
      />
    </div>
  )
}
