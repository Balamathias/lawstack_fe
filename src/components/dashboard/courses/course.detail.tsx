import { Course } from '@/@types/db'
import { StackResponse } from '@/@types/generics'
import BackButton from '@/components/back-button'
import React, { Suspense, use } from 'react'
import CourseQuestions, { CourseQuestionsSkeleton } from './course-questions'
import { Book, BookLock, Brain, Calendar, GraduationCap, MessagesSquare, School, Star, Timer, Weight } from 'lucide-react'
import Filters from '@/components/past-questions/filters'
import Empty from '@/components/empty'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createChat } from '@/services/server/chats'
import { getUser } from '@/services/server/auth'
import { redirect } from 'next/navigation'
import OpenChatButton from './open-chat-button'

interface Props {
    promisedCourse: Promise<StackResponse<Course | null>>,
    searchParams: Record<string, any>
}

const CourseDetail = ({ promisedCourse, searchParams }: Props) => {
  const { data: course } = use(promisedCourse)
  const { data: user } = use(getUser())

  if (!course) {
    return (
      <div className='flex flex-col gap-4'>
          <Empty
              title="Course not found"
              content="Sorry, this course could not be retrieved at this point, please try again."
              icon={<BookLock />}
              color="blue"
          />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6 animate-fade-in max-w-7xl mx-auto'>
      <div className="flex items-center justify-between">
        <BackButton />
      </div>

      <Card className="border-secondary/40 bg-card/50 backdrop-blur-sm overflow-hidden border shadow-lg relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 md:w-64 h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-10 md:w-48 h-48 bg-gradient-to-tr from-primary/10 to-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-8 md:w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 relative'>
            <div className="space-y-2 animate-slide-in-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Book className="h-4 w-4" />
                {course?.code}
              </div>
              <CardTitle className='text-2xl md:text-3xl font-semibold tracking-tight'>
                {course?.name}
              </CardTitle>
            </div>
            <Filters isPQ={false} />
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-8">
          {course?.description && (
            <div className="group relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full"></div>
              <p className='text-muted-foreground text-lg py-3 pl-4 animate-fade-in-delay leading-relaxed italic'>
                {course?.description}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 animate-slide-in-up">
            {/* Course metadata */}
            <div className='space-y-4'>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Course Information</h3>
              <div className='flex flex-wrap gap-3'>
                <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2 group">
                  <Star className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{course?.level} level</span>
                </Badge>
                
                <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2 group">
                  <Weight className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{course?.credit_units} Credit Units</span>
                </Badge>
                
                {course?.institution && (
                  <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2 group">
                    <School className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{course?.institution_name}</span>
                  </Badge>
                )}
                
                {course?.duration && (
                  <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2 group">
                    <Timer className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{course?.duration} {parseInt(course?.duration) > 1 ? 'Years' : 'Year'}</span>
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-row items-center gap-4">
              <Button 
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600/90 to-blue-500 hover:from-blue-600 hover:to-blue-500/90 text-white shadow-md border border-blue-600/20 gap-2 transition-all group relative overflow-hidden"
                style={{ minWidth: "160px" }}
              >
                <Link href={`/dashboard/quizzes?course=${course?.id}`} className="flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Brain className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="ml-2">Practice Quiz</span>
                </Link>
              </Button>
              
              {/* Chat button - with enhanced styling */}
              <div className="w-full sm:w-auto" style={{ minWidth: "160px" }}>
                <OpenChatButton course={course} user={user} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='mt-4 animate-fade-in-delay-longer'>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <MessagesSquare className="h-5 w-5 text-primary mr-2" />
            Past Questions
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>
        <Suspense fallback={<CourseQuestionsSkeleton />}>
          <CourseQuestions courseId={course?.id || ''} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default CourseDetail