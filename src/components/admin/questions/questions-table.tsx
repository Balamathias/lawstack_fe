'use client'

import { Question } from '@/@types/db'
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
  Calendar,
  School
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
  questions: Question[],
  count: number,
  pageSize?: number
}

const QuestionsTable = ({ questions, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleQuestionAction = (question: Question, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/past-questions/${question.id}`)
        break
      case 'edit':
        router.push(`/admin/questions/${question.id}/edit`)
        break
      case 'delete':
        setQuestionToDelete(question)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return
    
    try {
      // API call to delete question would go here
      // await deleteQuestion(questionToDelete.id)
      console.log(`Deleting question: ${questionToDelete.id}`)
      setQuestionToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete question:', error)
      // Show error message
    }
  }

  // Format type label
  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
  }

  // Get badge variant for question type
  const getTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mcq':
      case 'multiple choice':
        return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 border border-blue-300/30'
      case 'essay':
        return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border border-amber-300/30'
      case 'problem question':
        return 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400 border border-violet-300/30'
      default:
        return 'bg-secondary/50'
    }
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No questions found</h3>
          <p className="text-sm text-muted-foreground">
            There are no questions to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className="w-full overflow-hidden shadow-sm">
        <Table>
          <TableCaption>List of past questions in the system</TableCaption>
          <TableHeader>
            <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
              <TableHead className="w-[300px]">Question</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Institution</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id} className="hover:bg-muted/30 transition-all duration-150">
                <TableCell className="py-4 font-medium">
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <div className="truncate max-w-[300px]">
                        {question.text_plain?.substring(0, 100) || 'No plain text available'}...
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-md">
                      <p className="text-sm">{question.text_plain || 'No plain text available'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground/80">{question.course_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{question.year}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={getTypeBadgeVariant(question.type)}>
                    {getTypeLabel(question.type)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{question.institution_name}</span>
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
                      <DropdownMenuLabel>Question Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleQuestionAction(question, 'view')}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Question</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuestionAction(question, 'edit')}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Question</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleQuestionAction(question, 'delete')}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Question</span>
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
              <span className="font-medium">{count}</span> questions
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
        <Dialog open={!!questionToDelete} onOpenChange={() => setQuestionToDelete(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this question?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm truncate">
                {questionToDelete?.text_plain?.substring(0, 100)}...
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{questionToDelete?.course_name}</span>
                <span>•</span>
                <span>{questionToDelete?.year}</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setQuestionToDelete(null)}>
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

export default QuestionsTable
