import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CourseEditForm from '@/components/admin/courses/course-edit-form'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const EditCoursePage = async ({ params }: PageProps) => {
  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            href="/admin/courses" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Link>
          <h2 className='text-2xl font-bold'>
            Edit Course
          </h2>
          <p className="text-muted-foreground mt-1">
            Update the details of this course
          </p>
        </div>
      </div>
      
      <CourseEditForm courseId={(await params).id} />
    </div>
  )
}

export default EditCoursePage
