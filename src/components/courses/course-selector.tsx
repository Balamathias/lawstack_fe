"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, BookOpen, Check, Loader2, GraduationCap, BookType, School, X } from 'lucide-react'
import { useCourses } from '@/services/client/courses'
import { useCreateChat } from '@/services/client/chat'
import { useRouter } from 'nextjs-toploader/app'
import { cn } from '@/lib/utils'
import { Course } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'

interface CourseSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const CourseSelector = ({ isOpen, onClose }: CourseSelectorProps) => {
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400) // Debounce search input with 400ms delay
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const router = useRouter()
  
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({
    params: debouncedSearch ? { search: debouncedSearch } : undefined
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
      setSearchInput('')
    }
  }, [isOpen])

  const courses = coursesData?.data || []
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              Select a Course
            </DialogTitle>
            <p className="text-muted-foreground mt-2 ml-1">
              Choose a course to start a focused conversation with our AI assistant.
            </p>
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full h-8 w-8 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 pt-4 space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search input with animation */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses by name, code or description..."
              className="pl-10 bg-card h-12 border-border focus-visible:ring-primary/20 focus-visible:border-primary/80 rounded-lg"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            {searchInput && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8 rounded-full" 
                onClick={() => setSearchInput('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isLoadingCourses ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 flex-1">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Searching courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex-1 flex flex-col items-center justify-center">
              <div className="bg-primary/5 p-4 rounded-full mb-4">
                <BookOpen className="h-10 w-10 text-primary/60" />
              </div>
              <p className="text-lg font-medium text-foreground">No courses found</p>
              {searchInput && (
                <p className="text-sm mt-1 max-w-md">
                  No courses match "{searchInput}". Try a different search term or browse all courses.
                </p>
              )}
              {!searchInput && (
                <p className="text-sm mt-1 max-w-md">
                  Start typing to search for courses.
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="flex-1 max-h-[400px] pr-4 -mr-4 overflow-auto">
              <div className="grid gap-3">
                <AnimatePresence initial={false}>
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.03,
                        ease: "easeOut"
                      }}
                    >
                      <div 
                        onClick={() => setSelectedCourse(course.id === selectedCourse?.id ? null : course)}
                        className={cn(
                          "p-4 border rounded-xl cursor-pointer transition-all relative group",
                          "hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm",
                          course.id === selectedCourse?.id 
                            ? "border-primary bg-primary/5 shadow" 
                            : "border-border"
                        )}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h3 className="font-medium text-lg text-foreground">{course.name}</h3>
                              {course.code && (
                                <Badge variant="outline" className="text-xs font-normal bg-primary/5 text-primary border-primary/20">
                                  {course.code}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {course.description || "No description available"}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              {course.level && (
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                  <School className="h-3 w-3" />
                                  {course.level} Level
                                </Badge>
                              )}
                              {course.duration && (
                                <Badge variant="secondary" className="text-xs">
                                  {course.duration} {parseInt(course.duration) > 1 ? 'Years' : 'Year'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            "h-7 w-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                            course.id === selectedCourse?.id 
                              ? "border-primary bg-primary text-primary-foreground" 
                              : "border-muted-foreground/30 group-hover:border-primary/40"
                          )}>
                            {course.id === selectedCourse?.id && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/80 mt-4">
            <Button variant="outline" onClick={onClose} className="rounded-lg">
              Cancel
            </Button>
            <Button 
              onClick={handleStartChat} 
              disabled={!selectedCourse || isCreatingChat}
              className="gap-2 rounded-lg"
            >
              {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookType className="h-4 w-4" />}
              Start Course Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CourseSelector
