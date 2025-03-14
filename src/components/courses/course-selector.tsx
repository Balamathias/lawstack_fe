"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, BookOpen, Check, Loader2, GraduationCap } from 'lucide-react'
import { useCourses } from '@/services/client/courses'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import { cn } from '@/lib/utils'
import { Course } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { useSearchParams } from 'next/navigation'

interface CourseSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const CourseSelector = ({ isOpen, onClose }: CourseSelectorProps) => {

  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const router = useRouter()
  
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    params: search ? { search } : undefined
  })
  
  const { mutate: startChat, isPending: isCreatingChat } = useCreateChat()
  
  const handleStartChat = () => {
    if (!selectedCourse) return
    
    startChat(
      { 
        title: `${selectedCourse.name} Course Chat`, 
        course: selectedCourse.id || searchParams.get('course'),
      },
      {
        onSuccess: (data) => {
          if (data.error) {
            console.error('Error starting chat:', data.error)
            return
          }
          router.push(`/dashboard/chat/${data?.data?.id}`)
          onClose()
        }
      }
    )
  }
  
  // Reset selected course when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCourse(null)
      setSearch('')
    }
  }, [isOpen])

  const courses = coursesData?.data || []
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-600" />
            Select a Course
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search courses by name, code or description..."
            className="pl-10 bg-background h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        
        {isLoadingCourses ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="mx-auto h-16 w-16 opacity-20 mb-3" />
            <p className="text-lg font-medium">No courses found</p>
            {search && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        ) : (
          <ScrollArea className="flex-1 max-h-[400px] pr-4 -mr-4 overflow-auto">
            <div className="grid gap-3">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id === selectedCourse?.id ? null : course)}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all relative group",
                    "hover:bg-muted/50 hover:border-emerald-300",
                    course.id === selectedCourse?.id 
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                      : "border-border"
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-lg">{course.name}</h3>
                        {course.code && (
                          <Badge variant="outline" className="text-xs font-normal">
                            {course.code}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {course.description || "No description available"}
                      </p>
                      {course.level && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {course.level} Level
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "h-6 w-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                      course.id === selectedCourse?.id 
                        ? "border-emerald-500 bg-emerald-500 text-white" 
                        : "border-gray-300 group-hover:border-emerald-400"
                    )}>
                      {course.id === selectedCourse?.id && (
                        <Check className="h-4 w-4 m-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartChat} 
            disabled={!selectedCourse || isCreatingChat}
            className="gap-2"
          >
            {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            Start Chat with Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CourseSelector
