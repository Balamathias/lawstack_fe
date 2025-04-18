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
  
  // Helper function to create chat with course context
  async function createCourseChat(e: FormData) {
    'use server';
    if (!user) return;
    
    const chatData = await createChat({
      title: `Course: ${course?.name} (${course?.code})`,
      chat_type: 'course_specific',
      course: course?.id
    });
    
    redirect(`/dashboard/chat/${chatData?.data?.id}`);
  }
  
  return (
    <div className='flex flex-col gap-5 animate-fade-in'>
        <BackButton />

        <Card className="border-secondary/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3 relative">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-12 md:w-64 h-64 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 md:w-40 h-40 bg-primary/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-xl"></div>
            
            <div className='flex items-center justify-between relative z-10'>
              <div className="animate-slide-in-left">
                <CardTitle className='text-2xl md:text-3xl font-semibold flex items-center gap-2'>
                  <Book className="h-6 w-6 text-primary" />
                  {course?.name}
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {course?.code}
                  </Badge>
                </CardTitle>
              </div>
              <Filters isPQ={false} />
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-lg py-3 border-l-4 border-primary/20 pl-4 italic animate-fade-in-delay'>
              {course?.description || 'Course Description'}
            </p>

            <div className='flex flex-wrap md:items-center justify-between gap-4 mt-6 animate-slide-in-up'>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all flex items-center gap-2 group">
                  <Star className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{course?.level} level</span>
                </Badge>
                
                <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all flex items-center gap-2 group">
                  <Weight className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{course?.credit_units} Credit Units</span>
                </Badge>
                
                {course?.institution && (
                  <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all flex items-center gap-2 group">
                    <School className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{course?.institution_name}</span>
                  </Badge>
                )}
                
                {course?.duration && (
                  <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all flex items-center gap-2 group">
                    <Timer className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{course?.duration} {parseInt(course?.duration) > 1 ? 'Years' : 'Year'}</span>
                  </Badge>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* CBT Button */}
                <Button 
                  asChild
                  className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-md border border-primary/10 gap-2 transition-all"
                >
                  <Link href={`/dashboard/quizzes?course=${course?.id}`}>
                    <Brain className="h-4 w-4" />
                    <span>Practice Quiz</span>
                  </Link>
                </Button>
                
                {/* Chat button */}
                <OpenChatButton course={course} user={user}  />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='mt-2 animate-fade-in-delay-longer'>
            <Suspense fallback={<CourseQuestionsSkeleton />}>
                <CourseQuestions courseId={course?.id || ''} searchParams={searchParams} />
            </Suspense>
        </div>
    </div>
  )
}

export default CourseDetail