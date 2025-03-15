import React, { useState } from 'react'
import { Course } from '@/@types/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DeleteCourseDialog from './delete-course-dialog'

interface CourseRowProps {
  course: Course
  onDelete: (id: string) => void
  isDeleting: boolean
}

const CourseRow = ({ course, onDelete, isDeleting }: CourseRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="py-3 px-4">
          <div>
            <p className="font-medium">{course.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[250px]">
              {course.description}
            </p>
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge variant="outline" className="font-mono bg-secondary/20">
            {course.code}
          </Badge>
        </td>
        <td className="py-3 px-4 hidden md:table-cell">
          {course.level} Level
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          {course.credit_units}
        </td>
        <td className="py-3 px-4 text-right">
          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2 items-center justify-end">
            <Link href={`/admin/courses/${course.id}/view`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${course.id}/view`} className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${course.id}/edit`} className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>

      <DeleteCourseDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={() => {
          onDelete(course.id)
          setShowDeleteDialog(false)
        }}
        courseName={course.name}
        courseCode={course.code}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default CourseRow
