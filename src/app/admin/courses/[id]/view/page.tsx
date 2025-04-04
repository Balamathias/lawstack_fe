import React from 'react'
import { ArrowLeft, Clock, School, Calculator, GraduationCap, ArrowDownUp } from 'lucide-react'
import Link from 'next/link'
import { getCourse } from '@/services/server/courses'
import { getInstitutions } from '@/services/server/institutions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const ViewCoursePage = async ({ params: _params }: PageProps) => {
  const params = await _params
  const courseResponse = await getCourse(params.id)
  
  if (!courseResponse?.data) {
    return notFound()
  }
  
  const course = courseResponse.data
  
  // Get institutions to resolve names
  const institutionsResponse = await getInstitutions()
  const institutions = institutionsResponse?.data || []
  
  // Map institution IDs to names
  const institutionNames = course.institution.map(id => {
    const institution = institutions.find(i => i.id === id)
    return institution?.name || id
  })
  
  return (
    <div className='max-w-7xl flex flex-col space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div>
        <Link 
          href="/admin/courses" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className='text-2xl font-bold flex items-center gap-2'>
              {course.name}
              <Badge variant="outline" className="ml-2 font-mono bg-secondary/20 text-base">
                {course.code}
              </Badge>
            </h2>
            <p className="text-muted-foreground mt-1">
              {course.level} Level · {course.credit_units} Credit Units
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/courses/${params.id}/edit`}>
              <Button variant="outline">Edit Course</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main course content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{course.description}</div>
          </CardContent>
        </Card>
        
        {/* Course metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Level
              </div>
              <p>{course.level} Level</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p>{course.duration}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4" />
                Credit Units
              </div>
              <p>{course.credit_units}</p>
            </div>
            
            {course.ordering !== null && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowDownUp className="h-4 w-4" />
                  Display Order
                </div>
                <p>{course.ordering}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <School className="h-4 w-4" />
                Institutions
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {institutionNames.map((name, index) => (
                  <Badge key={index} variant="outline" className="w-fit bg-secondary/20">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewCoursePage
