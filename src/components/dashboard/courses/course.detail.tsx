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
import { getUser } from '@/services/server/auth'
import OpenChatButton from './open-chat-button'

interface Props {
  promisedCourse: Promise<StackResponse<Course | null>>,
  searchParams: Record<string, any>
}

const CourseDetail = ({ promisedCourse, searchParams }: Props) => {
  const { data: course } = use(promisedCourse)
  const { data: user } = use(getUser())
  const currentSemester = searchParams.semester || '1'

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

  const SemesterTabs = () => {
  const semesters = [
    { label: 'First Semester', value: '1' },
    { label: 'Second Semester', value: '2' }
  ]

  return (
    <div className="flex items-center justify-center mb-6 md:mb-8 px-4 animate-fade-in">
    <div className="relative p-0.5 md:p-1 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-xl md:rounded-2xl blur-sm"></div>
      <div className="relative flex space-x-0.5 md:space-x-1">
      {semesters.map((semester) => {
        const isActive = currentSemester === semester.value
        const href = new URLSearchParams(searchParams)
        href.set('semester', semester.value)
        
        return (
        <Link
          key={semester.value}
          href={`?${href.toString()}`}
          className={`relative flex-1 px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-medium text-xs md:text-sm transition-all duration-500 ease-out group overflow-hidden text-center ${
          isActive
            ? 'text-white shadow-lg'
            : 'text-white/60 hover:text-white/80'
          }`}
        >
          {/* Active background */}
          {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 backdrop-blur-sm border border-white/20 rounded-lg md:rounded-xl transition-all duration-500">
            <div className="absolute inset-0 bg-white/5 rounded-lg md:rounded-xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-cyan-400/40 rounded-lg md:rounded-xl blur opacity-75"></div>
          </div>
          )}
          
          {/* Hover effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${isActive ? 'hidden' : ''}`}></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">{semester.label}</span>
          <span className="sm:hidden">{semester.value === '1' ? '1st Sem' : '2nd Sem'}</span>
          </span>
        </Link>
        )
      })}
      </div>
    </div>
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
    <div className="absolute top-0 right-0 w-6 md:w-64 h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-8 md:w-48 h-48 bg-gradient-to-tr from-primary/10 to-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>
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

      <div className="grid md:grid-cols-2 gap-8 animate-slide-in-up">
      {/* Course metadata */}
      <div className='space-y-6'>
        <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm opacity-60"></div>
        <h3 className="relative text-sm font-semibold uppercase tracking-[0.15em] bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Course Information
        </h3>
        </div>
        
        <div className='flex flex-wrap gap-4'>
        <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <Badge variant="outline" className="relative px-4 py-2.5 bg-black/10 backdrop-blur-xl border border-yellow-500/20 hover:border-yellow-500/40 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 transition-all duration-300 flex items-center gap-2.5 group shadow-lg hover:shadow-yellow-500/25">
        <Star className="h-4 w-4 text-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
        <span className="font-semibold text-yellow-100/90 group-hover:text-yellow-50 transition-colors">{course?.level} level</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </Badge>
        </div>
        
        <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-sky-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <Badge variant="outline" className="relative px-4 py-2.5 bg-black/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 transition-all duration-300 flex items-center gap-2.5 group shadow-lg hover:shadow-blue-500/25">
        <Weight className="h-4 w-4 text-blue-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
        <span className="font-semibold text-blue-100/90 group-hover:text-blue-50 transition-colors">{course?.credit_units} Credit Units</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </Badge>
        </div>
        
        {course?.institution && (
        <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <Badge variant="outline" className="relative px-4 py-2.5 bg-black/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-r from-purple-500/5 to-violet-500/5 transition-all duration-300 flex items-center gap-2.5 group shadow-lg hover:shadow-purple-500/25">
          <School className="h-4 w-4 text-purple-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
          <span className="font-semibold text-purple-100/90 group-hover:text-purple-50 transition-colors">{course?.institution_name}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </Badge>
        </div>
        )}
        
        {course?.duration && (
        <div className="group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <Badge variant="outline" className="relative px-4 py-2.5 bg-black/10 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 transition-all duration-300 flex items-center gap-2.5 group shadow-lg hover:shadow-emerald-500/25">
          <Timer className="h-4 w-4 text-emerald-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
          <span className="font-semibold text-emerald-100/90 group-hover:text-emerald-50 transition-colors">{course?.duration} {parseInt(course?.duration) > 1 ? 'Years' : 'Year'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </Badge>
        </div>
        )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-row items-center gap-4">
        <Button 
        asChild
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white shadow-2xl hover:shadow-cyan-500/25 gap-2 transition-all duration-300 group relative overflow-hidden rounded-xl"
        >
        <Link href={`/dashboard/quizzes?course=${course?.id}`} className="flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 rounded-xl blur opacity-0 group-hover:opacity-75 transition-all duration-500 -z-10"></div>
          <Brain className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
          <span className="ml-2 font-medium relative z-10">Practice Quiz</span>
        </Link>
        </Button>
        
        {/* Chat button - with enhanced styling */}
        <div className="w-full sm:w-auto">
        <OpenChatButton course={course} user={user} />
        </div>
      </div>
      </div>
    </CardContent>
    </Card>

    {/* Semester Filter Tabs */}
    <SemesterTabs />

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