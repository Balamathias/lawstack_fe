'use client'

import { Course } from '@/@types/db'
import React, { useState } from 'react'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  BookOpen,
  FileQuestion,
  School,
  Clock
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

interface Props {
  courses: Course[],
  count: number,
  pageSize?: number
}

const CoursesTable = ({ courses, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleCourseAction = (course: Course, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/courses/${course.id}`)
        break
      case 'edit':
        router.push(`/admin/courses/${course.id}/edit`)
        break
      case 'delete':
        setCourseToDelete(course)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return
    
    try {
      // API call to delete course would go here
      // await deleteCourse(courseToDelete.id)
      console.log(`Deleting course: ${courseToDelete.id}`)
      setCourseToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete course:', error)
      // Show error message
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (courses.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No courses found</h3>
          <p className="text-sm text-muted-foreground">
            There are no courses to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className="w-full overflow-hidden shadow-sm">
        <Table>
          <TableCaption>List of courses in the system</TableCaption>
          <TableHeader>
            <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
              <TableHead className="w-[280px]">Course</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden md:table-cell">Level</TableHead>
              <TableHead className="hidden lg:table-cell">Institution</TableHead>
              <TableHead className="hidden lg:table-cell">Credit Units</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/30 transition-all duration-150">
                <TableCell className="py-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium leading-none mb-1 text-base">
                        {course.name}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {course.duration || 'N/A'} duration
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-secondary/50 font-mono">
                    {course.code}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300/30 dark:text-blue-400">
                    {course.level}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1">
                        <School className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate max-w-[150px]">{course.institution_name || 'Multiple'}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-sm">
                        {Array.isArray(course.institution)
                          ? course.institution.length > 1
                            ? `${course.institution.length} institutions`
                            : course.institution_name
                          : 'Institution information unavailable'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-center">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300/30 dark:text-amber-400">
                    {course.credit_units}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(course.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] animate-in zoom-in-50 duration-200">
                      <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCourseAction(course, 'view')}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Course</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCourseAction(course, 'edit')}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Course</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleCourseAction(course, 'delete')}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Course</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * pageSize, count)}</span> of{' '}
              <span className="font-medium">{count}</span> courses
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <div className="flex items-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the course{' '}
                <span className="font-medium">
                  {courseToDelete?.name} ({courseToDelete?.code})
                </span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm">
                <span className="font-medium">Course:</span> {courseToDelete?.name}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Code:</span> {courseToDelete?.code}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Level:</span> {courseToDelete?.level}
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCourseToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  )
}

export default CoursesTable
