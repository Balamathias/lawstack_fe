import { Course } from '@/@types/db'
import { StackResponse } from '@/@types/generics'
import BackButton from '@/components/back-button'
import React, { Suspense, use } from 'react'
import CourseQuestions, { CourseQuestionsSkeleton } from './course-questions'
import { LucideBookLock, LucideStars, LucideWeight, LucideBook, LucideInfo } from 'lucide-react'
import Filters from '@/components/past-questions/filters'
import Empty from '@/components/empty'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    promisedCourse: Promise<StackResponse<Course | null>>,
    searchParams: Record<string, any>
}

const CourseDetail = ({ promisedCourse, searchParams }: Props) => {

  const { data: course } = use(promisedCourse)

  if (!course) {
    return (
      <div className='flex flex-col gap-4'>
          <Empty
              title="Course not found"
              content="Sorry, Course could not be retrieved at this point, please try again."
              icon={<LucideBookLock />}
              color="blue"
          />
      </div>
    )
  }
  
  return (
    <div className='flex flex-col gap-4 animate-fade-in'>
        <BackButton />

        <Card className="border-secondary/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className='flex items-center justify-between'>
              <div className="animate-slide-in-left">
                <CardTitle className='text-2xl font-semibold flex items-center gap-2'>
                  <LucideBook className="h-5 w-5 text-primary" />
                  {course?.name}
                </CardTitle>
              </div>
              <Filters isPQ={false} />
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-lg py-3 border-l-4 border-primary/20 pl-4 italic animate-fade-in-delay'>
              {course?.description || 'Course Description'}
            </p>

            <div className='flex items-center gap-4 flex-wrap mt-4 animate-slide-in-up'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all hover:shadow-sm group">
                      <LucideStars className="h-4 w-4 mr-2 text-yellow-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{course?.level} level</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Course level</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all hover:shadow-sm group">
                      <LucideWeight className="h-4 w-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{course?.credit_units} Credit Units</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Credit units for this course</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="px-3 py-1.5 border-primary/30 hover:border-primary transition-all flex items-center gap-2 hover:shadow-sm group">
                      <LucideInfo className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Course Code: {course?.code}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Course Code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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