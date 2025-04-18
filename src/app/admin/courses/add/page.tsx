import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CourseForm from '@/components/admin/courses/course-form'

const Page = () => {
  return (
    <div className='max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            href="/admin" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h2 className='text-2xl font-bold'>
            Add New Course
          </h2>
          <p className="text-muted-foreground mt-1">
            Create a new educational course in the system
          </p>
        </div>
      </div>
      
      <CourseForm />
    </div>
  )
}

export default Page
