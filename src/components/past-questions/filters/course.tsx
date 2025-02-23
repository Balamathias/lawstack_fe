'use client'

import { Course } from "@/@types/db"
import { PaginatedStackResponse } from "@/@types/generics"
import DynamicModal from "@/components/dynamic-modal"
import { DialogClose, DialogTitle } from "@/components/ui/dialog"
import { addQueryParams, cn } from "@/lib/utils"
import React, { use, startTransition, useOptimistic } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export const FilterByCourse = ({ getCourses }: { getCourses: Promise<PaginatedStackResponse<Course[]>> }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [optimisticSelectedCourse, setOptimisticSelectedCourse] = useOptimistic<Course | null>(null)

  const { data: courses } = use(getCourses)

  const selectedCourse = optimisticSelectedCourse || (courses.find(course => course.id === searchParams.get('course')) || null)
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const handleSelectCourse = (course: Course) => {
    startTransition(() => {
      setOptimisticSelectedCourse(course)
      const qs = searchParams.toString()
      const url = addQueryParams(qs, { course: course.id })
      router.replace(url)
    })
  }

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-lg font-semibold">Courses</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
        {courses.slice(0, 3).map((course) => (
          <button 
            key={course.id} 
            className={cn(
              "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
              "bg-secondary/50 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
              course === selectedCourse && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
            )}
            onClick={() => handleSelectCourse(course)}
          >
            {course.code}
          </button>
        ))}

        <DynamicModal
          trigger={
            <button 
              className={cn(
                "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                "bg-secondary/50 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
                selectedCourse && courses.slice(3)?.includes(selectedCourse) && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
              )}
            >
              { selectedCourse && courses.slice(3)?.includes(selectedCourse) ? selectedCourse.code : 'More'}
            </button>
          }
          title={
            <DialogTitle className="flex items-center gap-2 w-full px-4">
              <Input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              />
            </DialogTitle>
          }
          dialogClassName='w-full max-w-3xl'
        >
          <div className="flex flex-col max-h-[80vh] overflow-y-auto gap-3 p-2.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {filteredCourses.map((course) => (
                <DialogClose asChild key={course.id}>
                  <button 
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg cursor-pointer transition-all",
                      "flex flex-col gap-2 items-start justify-start",
                      "bg-secondary/50 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
                      course === selectedCourse && 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-500'
                    )}
                    onClick={() => handleSelectCourse(course)}
                  >
                    <span className="font-semibold text-left">{course.code}</span>
                    <span className="text-left">{course.name}</span>
                  </button>
                </DialogClose>
              ))}
            </div>
          </div>
        </DynamicModal>
      </div>
    </div>
  )
}

export const FilterByCourseSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {Array.from([0,1,2,3]).map((course) => (
        <Skeleton className="h-14 rounded-lg" key={course} />
      ))}
    </div>
  )
}