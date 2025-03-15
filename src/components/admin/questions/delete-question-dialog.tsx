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

interface DeleteQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  questionText: string
  isDeleting: boolean
}

const DeleteQuestionDialog = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  questionText,
  isDeleting
}: DeleteQuestionDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Question
          </AlertDialogTitle>
          <div className="space-y-2">
            <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm text-foreground/80">
              <p className="line-clamp-2">{questionText}</p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Question"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteQuestionDialog
