import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteCourseDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  courseName: string
  courseCode: string
  isDeleting: boolean
}

const DeleteCourseDialog = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  courseName,
  courseCode,
  isDeleting
}: DeleteCourseDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Course
          </AlertDialogTitle>
          <div className="space-y-2">
            <p>Are you sure you want to delete this course? This action cannot be undone and may affect related questions and materials.</p>
            <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm text-foreground/80">
              <p className="font-semibold">{courseName} ({courseCode})</p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Course"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCourseDialog
