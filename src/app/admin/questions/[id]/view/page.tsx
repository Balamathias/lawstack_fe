import React from 'react'
import { ArrowLeft, BookOpen, Building2, GraduationCap, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { getQuestion } from '@/services/server/questions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const ViewQuestionPage = async ({ params: _params }: PageProps) => {
  const params = await _params
  const questionResponse = await getQuestion(params.id)
  
  if (!questionResponse?.data) {
    return notFound()
  }
  
  const question = questionResponse.data
  
  return (
    <div className='max-w-7xl flex flex-col space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div>
        <Link 
          href="/admin/questions" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Questions
        </Link>
        <div className="flex items-center justify-between">
          <h2 className='text-2xl font-bold'>
            Question Details
          </h2>
          <div className="flex gap-2">
            <Link href={`/admin/questions/${params.id}/edit`}>
              <Button variant="outline">Edit Question</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main question content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Question Text</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{question.text}</div>
          </CardContent>
        </Card>
        
        {/* Question metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Question Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Course
              </div>
              <p>{question.course_name || question.course}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Institution
              </div>
              <p>{question.institution_name || question.institution}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Level
                </div>
                <p>{question.level} Level</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Year
                </div>
                <p>{question.year}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Semester
                </div>
                <p>{question.semester}</p>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Marks
                </div>
                <p>{question.marks}</p>
              </div>
            </div>
            
            {question.session && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Session
                </div>
                <p>{question.session}</p>
              </div>
            )}
            
            {question.tags && question.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-secondary/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewQuestionPage
