'use client'

import { Quiz } from '@/@types/db'
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
  Clock,
  CheckCircle,
  Hourglass,
  TimerOff
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
import { format } from 'date-fns'

interface Props {
  quizzes: Quiz[],
  count: number,
  pageSize?: number
}

const QuizzesTable = ({ quizzes, count, pageSize = 10 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page') || '1')
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null)
  
  const totalPages = Math.ceil(count / pageSize)

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleQuizAction = (quiz: Quiz, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/dashboard/quizzes/${quiz.id}`)
        break
      case 'edit':
        router.push(`/admin/quizzes/${quiz.id}/edit`)
        break
      case 'delete':
        setQuizToDelete(quiz)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return
    
    try {
      // API call to delete quiz would go here
      // await deleteQuiz(quizToDelete.id)
      console.log(`Deleting quiz: ${quizToDelete.id}`)
      setQuizToDelete(null)
      // Refresh data or show success message
    } catch (error) {
      console.error('Failed to delete quiz:', error)
      // Show error message
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started'
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const formatScore = (score: number) => {
    return `${score.toFixed(1)}%`
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400 border border-green-300/30'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 border border-blue-300/30'
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border border-amber-300/30'
      case 'expired':
        return 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 border border-red-300/30'
      default:
        return 'bg-secondary/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <Hourglass className="h-4 w-4" />
      case 'expired':
        return <TimerOff className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
  }

  if (quizzes.length === 0) {
    return (
      <Card className="w-full p-12 text-center bg-background/50">
        <div className="flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No quizzes found</h3>
          <p className="text-sm text-muted-foreground">
            There are no quizzes to display at the moment.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <Table>
        <TableCaption>List of quizzes in the system</TableCaption>
        <TableHeader>
          <TableRow className="bg-secondary/20 hover:bg-secondary/30 dark:bg-muted/50 dark:hover:bg-muted/60">
            <TableHead className="w-[280px]">Quiz</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Questions</TableHead>
            <TableHead className="hidden md:table-cell">Score</TableHead>
            <TableHead className="hidden lg:table-cell">Started</TableHead>
            <TableHead className="hidden lg:table-cell">Completed</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id} className="hover:bg-muted/30 transition-all duration-150">
              <TableCell className="py-4 font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium leading-none mb-1 text-base">
                      {quiz.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {quiz.course_name}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeVariant(quiz.status)}>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(quiz.status)}
                    <span>{getStatusLabel(quiz.status)}</span>
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium text-foreground/80">
                    {quiz.correct_answers}/{quiz.total_questions}
                  </span>
                  <span className="text-muted-foreground">correct</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className={
                  quiz.status === 'completed' 
                    ? quiz.score >= 70 ? 'text-green-600 dark:text-green-400' 
                    : quiz.score >= 50 ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                }>
                  {quiz.status === 'completed' ? formatScore(quiz.score) : '-'}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(quiz.started_at)}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(quiz.completed_at)}
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
                    <DropdownMenuLabel>Quiz Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleQuizAction(quiz, 'view')}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Quiz</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuizAction(quiz, 'edit')}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Quiz</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleQuizAction(quiz, 'delete')}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Quiz</span>
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
            <span className="font-medium">{count}</span> quizzes
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
      <Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the quiz{' '}
              <span className="font-medium">{quizToDelete?.title}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm">
              <span className="font-medium">Title:</span> {quizToDelete?.title}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Course:</span> {quizToDelete?.course_name}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Status:</span> {quizToDelete && getStatusLabel(quizToDelete.status)}
            </p>
            {quizToDelete?.completed_at && (
              <p className="text-sm mt-1">
                <span className="font-medium">Completed:</span> {formatDate(quizToDelete.completed_at)}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setQuizToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default QuizzesTable
